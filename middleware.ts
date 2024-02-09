import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Check if the request is for a page within the /dashboard route.
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard');

  // Check if the request is for a page within the /auth route.
  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth');

  if (isProtectedRoute && !token) {
    // User is not logged in and trying to access a protected route, redirect them to the login page
    const loginUrl = new URL('/auth/login', req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  } else if (isAuthRoute && token) {
    // User is logged in and trying to access an auth route, redirect them to the dashboard
    const dashboardUrl = new URL('/dashboard', req.nextUrl.origin);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
