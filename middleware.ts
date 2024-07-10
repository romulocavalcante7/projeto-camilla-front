import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get('accessToken')?.value;
  if (!tokenCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/', '/favoritos', '/categorias']
};
