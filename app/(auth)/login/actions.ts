'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function login(email: string, password: string) {
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

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  console.log('[Login Action] Successful login:', data.user.id)

  // Check if user has completed onboarding
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('onboarding_completed, school_id')
    .eq('id', data.user.id)
    .single()

  console.log('[Login Action] Profile:', profile)

  // Return success with redirect path
  if (profile?.onboarding_completed && profile?.school_id) {
    return { success: true, redirectTo: '/dashboard' }
  } else {
    return { success: true, redirectTo: '/onboarding' }
  }
}
