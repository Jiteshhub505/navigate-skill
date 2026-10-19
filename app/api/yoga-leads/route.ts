import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { yogaLeads } from '@/lib/db/schema';
import { desc, asc, eq, ilike, gte, lte, and, count, sql } from 'drizzle-orm';

// ─── Auth helper ──────────────────────────────────────────────────────────────
function isAdmin(request: NextRequest): boolean {
    const key =
        request.headers.get('x-admin-api-key') ??
        new URL(request.url).searchParams.get('api_key');
    return key === process.env.ADMIN_API_KEY;
}

// ─── GET  /api/yoga-leads  (admin) ────────────────────────────────────────────
// Headers : x-admin-api-key: <ADMIN_API_KEY>
// Query params (all optional):
//   batch      = Morning | Afternoon | Evening
//   search     = partial name or phone match
//   from       = ISO date  e.g. 2025-06-01
//   to         = ISO date  e.g. 2025-06-30
//   sort       = newest (default) | oldest
//   page       = 1-based page number (default 1)
//   limit      = rows per page (default 50, max 200)
//   stats=1    = also return aggregate counts per batch
export async function GET(request: NextRequest) {
    if (!isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const batch  = searchParams.get('batch');
        const search = searchParams.get('search');
        const from   = searchParams.get('from');
        const to     = searchParams.get('to');
        const sort   = searchParams.get('sort') ?? 'newest';
        const page   = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
        const limit  = Math.min(200, parseInt(searchParams.get('limit') ?? '50', 10));
        const withStats = searchParams.get('stats') === '1';

        // Build WHERE conditions
        const conditions: ReturnType<typeof eq>[] = [];

        if (batch) {
            conditions.push(eq(yogaLeads.batch, batch));
        }
        if (search) {
            // name OR phone partial match
            conditions.push(
                ilike(yogaLeads.name, `%${search}%`)
            );
        }
        if (from) {
            conditions.push(gte(yogaLeads.submittedAt, new Date(from)));
        }
        if (to) {
            // include the whole "to" day
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999);
            conditions.push(lte(yogaLeads.submittedAt, toDate));
        }

        const where = conditions.length > 0 ? and(...conditions) : undefined;
        const orderBy = sort === 'oldest'
            ? asc(yogaLeads.submittedAt)
            : desc(yogaLeads.submittedAt);

        // Fetch rows (with pagination)
        const rows = await db
            .select()
            .from(yogaLeads)
            .where(where)
            .orderBy(orderBy)
            .limit(limit)
            .offset((page - 1) * limit);

        // Total count (for pagination metadata)
        const [{ total }] = await db
            .select({ total: count() })
            .from(yogaLeads)
            .where(where);

        const response: Record<string, unknown> = {
            data:       rows,
            pagination: {
                page,
                limit,
                total:      Number(total),
                totalPages: Math.ceil(Number(total) / limit),
            },
        };

        // Optional batch stats
        if (withStats) {
            const stats = await db
                .select({
                    batch: yogaLeads.batch,
                    count: count(),
                })
                .from(yogaLeads)
                .groupBy(yogaLeads.batch)
                .orderBy(yogaLeads.batch);

            response.stats = {
                byBatch: stats.reduce<Record<string, number>>((acc, r) => {
                    acc[r.batch] = Number(r.count);
                    return acc;
                }, {}),
                total: Number(total),
            };
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error('[yoga-leads GET] error:', error);
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}

// ─── POST  /api/yoga-leads  (public — called by chatbot) ──────────────────────
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, batch, slot, requirement } = body;

        if (!name || !phone || !batch || !slot) {
            return NextResponse.json(
                { error: 'Missing required fields: name, phone, batch, slot' },
                { status: 400 }
            );
        }

        if (!/^[6-9]\d{9}$/.test(phone)) {
            return NextResponse.json(
                { error: 'Invalid phone number' },
                { status: 400 }
            );
        }

        const [lead] = await db
            .insert(yogaLeads)
            .values({
                name:        name.trim(),
                phone:       phone.trim(),
                batch:       batch.trim(),
                slot:        slot.trim(),
                requirement: requirement?.trim() || null,
            })
            .returning({ id: yogaLeads.id });

        return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
    } catch (error) {
        console.error('[yoga-leads POST] error:', error);
        return NextResponse.json({ error: 'Failed to save enquiry' }, { status: 500 });
    }
}

