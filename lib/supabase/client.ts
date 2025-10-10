import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Singleton instance
let supabaseInstance: SupabaseClient | null = null

// Lazy initialization function - only runs in browser
function getSupabaseClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    throw new Error('Supabase client can only be used in browser context')
  }

  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      `Missing Supabase environment variables. URL: ${!!supabaseUrl}, Key: ${!!supabaseAnonKey}`
    )
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })

  return supabaseInstance
}

// Export a proxy that lazy-loads the client on first property access
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
