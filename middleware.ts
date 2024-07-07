import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken');
  if (!token?.value) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return;
}
export const config = {
  matcher: ['/', '/favoritos', '/categorias']
};
