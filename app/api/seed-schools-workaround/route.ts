import { NextResponse } from 'next/server'

// This endpoint returns the SQL to manually paste into Supabase SQL Editor
export async function GET() {
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

  // Generate SQL INSERT statements
  const sqlStatements = schools.map(school => {
    const domain = school.domain ? `'${school.domain}'` : 'NULL'
    return `INSERT INTO schools (name, domain) VALUES ('${school.name}', ${domain}) ON CONFLICT (name) DO NOTHING;`
  }).join('\n')

  const fullSQL = `
-- Disable RLS first
ALTER TABLE schools DISABLE ROW LEVEL SECURITY;

-- Insert all schools
${sqlStatements}

-- Verify
SELECT COUNT(*) as total_schools FROM schools;
SELECT * FROM schools ORDER BY name LIMIT 5;
`

  return new NextResponse(fullSQL, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
