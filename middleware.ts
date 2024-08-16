import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get('accessToken')?.value;
  if (!tokenCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  const userData = request.cookies.get('userData');
  let parsedUserData;
  if (userData) {
    parsedUserData = JSON.parse(userData.value);
  }
  if (
    parsedUserData.role !== 'ADMIN' &&
    request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    if (tokenCookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|login|public|sw.js).*)',
    '/dashboard/:path*'
  ]
};
