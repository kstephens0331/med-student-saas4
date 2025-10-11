import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Get the auth tokens from cookies
  const accessToken = req.cookies.get('sb-bqnmswxuzfguxrfgulps-auth-token')?.value
  const refreshToken = req.cookies.get('sb-bqnmswxuzfguxrfgulps-auth-token-refresh')?.value

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          cookie: req.cookies.toString(),
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log('[Middleware] Has session:', !!session, 'Has access token:', !!accessToken)

  // Check if user is authenticated
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Check if user completed onboarding
  if (session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('id', session.user.id)
      .single()

    if (!profile?.onboarding_completed) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  // Temporarily disable middleware to debug session issues
  matcher: [],
  // matcher: ['/dashboard/:path*', '/login', '/signup', '/onboarding'],
}
