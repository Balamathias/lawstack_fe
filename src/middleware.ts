import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUser } from './services/server/auth';

const authRoutes = [
  '/sign-in',
  '/sign-up',
  '/verify-email',
  '/forgot-password',
  '/verification-email-sent',
  '/reset-password',
];

export async function middleware(request: NextRequest) {
  const { data: user } = await getUser();
  const currentPath = request.nextUrl.pathname;

  if (!user && currentPath.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login?next=' + currentPath, request.url));
  }

  if (user && (authRoutes.includes(currentPath))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (user && currentPath.startsWith('/dashboard') && !user.is_superuser) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
