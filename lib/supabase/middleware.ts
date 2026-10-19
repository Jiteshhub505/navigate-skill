import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const isProtectedRoute = pathname.startsWith('/admin') ||
                             pathname.startsWith('/profile') ||
                             pathname.startsWith('/billing') ||
                             pathname.startsWith('/my-courses');

    // For public pages without cookies, return immediately with zero overhead
    const hasAuthCookie = request.cookies.getAll().some(c => c.name.startsWith('sb-'));
    if (!isProtectedRoute && !hasAuthCookie) {
        return NextResponse.next({ request });
    }

    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Only fetch user over the network if protected or has auth cookie
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protect admin routes
    if (pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Check for admin role
        // 1. Check if email matches admin email from env
        if (user.email === process.env.ADMIN_EMAIL) {
            return supabaseResponse;
        }

        // 2. Check against database 'users' table
        const { data: dbUser } = await supabase
            .from('users')
            .select('role')
            .eq('email', user.email)
            .single();

        if (dbUser?.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Protect user authenticated routes
    if ((pathname.startsWith('/profile') || pathname.startsWith('/billing') || pathname.startsWith('/my-courses')) && !user) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return supabaseResponse;
}
