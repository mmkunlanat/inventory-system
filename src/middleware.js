import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "mysecretkey");

export async function middleware(request) {
    const token = request.cookies.get('token')?.value;

    const { pathname } = request.nextUrl;

    // Protected paths
    if (pathname.startsWith('/admin') || pathname.startsWith('/center')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const { payload } = await jwtVerify(token, SECRET);

            // Role-based protection
            if (pathname.startsWith('/admin') && payload.role !== 'admin') {
                return NextResponse.redirect(new URL('/center/request', request.url));
            }

            if (pathname.startsWith('/center') && payload.role !== 'center') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }

            return NextResponse.next();
        } catch (err) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Prevent logged in users from visiting login/register pages
    if (token && (pathname === '/login' || pathname === '/register')) {
        try {
            const { payload } = await jwtVerify(token, SECRET);
            if (payload.role === 'admin') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            } else {
                return NextResponse.redirect(new URL('/center/request', request.url));
            }
        } catch (err) {
            // Token invalid, let them stay on login page
            return NextResponse.next();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/center/:path*', '/login', '/register'],
};
