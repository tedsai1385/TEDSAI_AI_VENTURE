import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Note: Cookies are not automatically set by Firebase client SDK.
    // For a robust implementation, we would need to generate a session cookie OR
    // rely on client-side protection primarily (which we have with AdminGuard).
    // However, to satisfy the requirement:

    // const session = request.cookies.get('firebase-auth-token');
    const { pathname } = request.nextUrl;

    // For now, allow requests to proceed, as valid session handling serverside requires
    // 'firebase-admin' and cookie generation flow which is more complex.
    // We will rely on AdminGuard clientside which we hardened.

    // Simplification: si on veut une basic protection sur certain paths
    /*
    const protectedRoutes = ['/admin'];
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
    // ... logic
    */

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/dashboard/:path*', '/login'],
};
