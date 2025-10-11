import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({
      error: 'No session found',
      hasSession: false,
    })
  }

  const userId = session.user.id

  // Test profile query
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*, schools(*)')
    .eq('id', userId)
    .single()

  // Test blocks query
  const { data: blocks, error: blocksError } = await supabase
    .from('blocks')
    .select('*')
    .eq('school_id', profile?.school_id)
    .order('block_number')

  return NextResponse.json({
    hasSession: true,
    userId,
    profile,
    profileError,
    blocksCount: blocks?.length,
    blocks,
    blocksError,
  })
}
