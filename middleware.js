import { NextResponse } from 'next/server'

export async function middleware(request) {
  const userId = request.cookies.get('user_id')?.value
  const role = request.cookies.get('role')?.value 

  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin')
  const publicPaths = ['/login', '/register', '/admin/login']

  // 1. Allow public routes always
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // 2. Block /admin routes for non-admins
  if (isAdminRoute) {
    if (!userId) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    else if (role !== 'admin') {
      return NextResponse.redirect(new URL('/home', request.url))
    }
  }

  // 3. Block all other routes for not logged-in users
  if (!userId) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'], // Exclude static/API routes
}
