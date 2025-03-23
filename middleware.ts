import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Allow unauthenticated users to access login page
  if (!sessionCookie && pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from auth pages
  if (sessionCookie && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!sessionCookie && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/auth/:path*']
};
