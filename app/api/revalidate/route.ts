import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log('🔄 Revalidating tag "courses" via API...');
    revalidateTag('courses', 'max');
    return NextResponse.json({
        revalidated: true,
        tag: 'courses',
        now: new Date().toISOString()
    });
}
