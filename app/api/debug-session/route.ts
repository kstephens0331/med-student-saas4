import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = cookies()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    }
  )

  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({
      authenticated: false,
      sessionError: sessionError?.message,
      cookies: cookieStore.toString().substring(0, 100) + '...',
    })
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, email, school_id, onboarding_completed')
    .eq('id', session.user.id)
    .single()

  return NextResponse.json({
    authenticated: true,
    userId: session.user.id,
    userEmail: session.user.email,
    profile: profile,
    profileError: profileError?.message,
    hasSchool: !!profile?.school_id,
    onboardingCompleted: profile?.onboarding_completed,
  })
}
