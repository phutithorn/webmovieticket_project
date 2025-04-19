import { NextResponse } from 'next/server'

export function middleware(request) {
  const userId = request.cookies.get('user_id')?.value
  const { pathname } = request.nextUrl

  // Routes that are always allowed even without login
  const publicPaths = ['/login', '/register', '/home', '/admin/login']

  // If the path is public, allow access
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // All other paths require login
  if (!userId) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'], // apply to all routes except static and API
}
