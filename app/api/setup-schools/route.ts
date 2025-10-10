import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// This API route uses the service role to bypass RLS and set up schools
export async function POST() {
  try {
    console.log('[Setup] Starting schools setup...')
    console.log('[Setup] Service role key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Check if we have the service role key
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        error: 'SUPABASE_SERVICE_ROLE_KEY not configured in environment variables'
      }, { status: 500 })
    }

    // Use service role key to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    console.log('[Setup] Service role client created')

    // Insert schools
    const schools = [
      { name: 'International University of the Health Sciences', domain: 'iuhs.edu' },
      { name: 'Indiana University School of Medicine', domain: 'iu.edu' },
      { name: 'Harvard Medical School', domain: 'hms.harvard.edu' },
      { name: 'Johns Hopkins School of Medicine', domain: 'jhmi.edu' },
      { name: 'Stanford School of Medicine', domain: 'stanford.edu' },
      { name: 'University of Pennsylvania Perelman School of Medicine', domain: 'upenn.edu' },
      { name: 'Columbia University Vagelos College of Physicians and Surgeons', domain: 'columbia.edu' },
      { name: 'Duke University School of Medicine', domain: 'duke.edu' },
      { name: 'University of California San Francisco School of Medicine', domain: 'ucsf.edu' },
      { name: 'Yale School of Medicine', domain: 'yale.edu' },
      { name: 'University of Michigan Medical School', domain: 'umich.edu' },
      { name: 'Washington University School of Medicine', domain: 'wustl.edu' },
      { name: 'Cornell Medicine', domain: 'cornell.edu' },
      { name: 'University of Chicago Pritzker School of Medicine', domain: 'uchicago.edu' },
      { name: 'Northwestern University Feinberg School of Medicine', domain: 'northwestern.edu' },
      { name: 'University of Pittsburgh School of Medicine', domain: 'pitt.edu' },
      { name: 'Vanderbilt University School of Medicine', domain: 'vanderbilt.edu' },
      { name: 'Mayo Clinic Alix School of Medicine', domain: 'mayo.edu' },
      { name: 'Icahn School of Medicine at Mount Sinai', domain: 'mssm.edu' },
      { name: 'NYU Grossman School of Medicine', domain: 'nyu.edu' },
      { name: 'Other', domain: null },
    ]

    console.log('[Setup] Upserting', schools.length, 'schools...')

    // Use upsert to avoid duplicate errors
    const { data: insertedSchools, error: insertError } = await supabase
      .from('schools')
      .upsert(schools, { onConflict: 'name', ignoreDuplicates: false })
      .select()

    if (insertError) {
      console.error('[Setup] Insert error:', insertError)
      return NextResponse.json({
        error: 'Insert failed: ' + insertError.message,
        details: insertError
      }, { status: 500 })
    }

    console.log('[Setup] Schools upserted successfully')

    // Verify schools were inserted
    const { data: allSchools, error: selectError } = await supabase
      .from('schools')
      .select('id, name')
      .order('name')

    if (selectError) {
      console.error('[Setup] Select error:', selectError)
      return NextResponse.json({
        error: 'Select failed: ' + selectError.message,
        details: selectError
      }, { status: 500 })
    }

    console.log('[Setup] Found', allSchools?.length, 'schools in database')

    return NextResponse.json({
      success: true,
      message: 'Schools setup complete',
      schoolCount: allSchools?.length || 0,
      schools: allSchools,
    })
  } catch (error: any) {
    console.error('[Setup] Unexpected error:', error)
    return NextResponse.json({
      error: 'Unexpected error: ' + error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
