import { createClient, SupabaseClient } from '@supabase/supabase-js'

// IMPORTANT: Get env vars at module level so Next.js can replace them at build time
// These MUST be accessed directly here, not inside functions, for Next.js to inline them
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bqnmswxuzfguxrfgulps.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxbm1zd3h1emZndXhyZmd1bHBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDYzMTIsImV4cCI6MjA3NTUyMjMxMn0.bb0uj41iQguNN9tMWIBXcErfRPfkfW1sqvK68lBvni8'

console.log('[Supabase Client] URL value:', supabaseUrl)
console.log('[Supabase Client] URL length:', supabaseUrl?.length)
console.log('[Supabase Client] Key value:', supabaseAnonKey?.substring(0, 20) + '...')
console.log('[Supabase Client] Key length:', supabaseAnonKey?.length)

// Singleton instance
let supabaseInstance: SupabaseClient | null = null

// Lazy initialization function
function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance
  }

  console.log('[getSupabaseClient] About to create client with:')
  console.log('[getSupabaseClient] URL:', supabaseUrl)
  console.log('[getSupabaseClient] Key:', supabaseAnonKey?.substring(0, 20) + '...')

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      `Missing Supabase environment variables. URL: ${!!supabaseUrl}, Key: ${!!supabaseAnonKey}`
    )
  }

  console.log('[getSupabaseClient] Calling createClient...')
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
  console.log('[getSupabaseClient] Client created successfully')

  return supabaseInstance
}

// Export the client - will be created on first use
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    const client = getSupabaseClient()
    const value = (client as any)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
})

// Server-side client with service role (for admin operations)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
