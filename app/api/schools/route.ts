import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Use anon key since RLS is disabled on schools
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from('schools')
      .select('id, name, domain')
      .order('name')

    if (error) {
      console.error('[Schools API] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ schools: data })
  } catch (error: any) {
    console.error('[Schools API] Exception:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
