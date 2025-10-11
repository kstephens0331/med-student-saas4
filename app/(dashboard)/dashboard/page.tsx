import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  try {
    const supabase = createServerSupabaseClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect('/login')
    }

    const userId = session.user.id

  // Get user profile with school
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*, schools(*)')
    .eq('id', userId!)
    .single()

  // Get blocks
  const { data: blocks } = await supabase
    .from('blocks')
    .select('*')
    .eq('school_id', profile?.school_id!)
    .order('block_number')

  // Get total questions
  const { count: totalQuestions } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', profile?.school_id!)

  // Get mastery stats
  const { data: masteryStats } = await supabase
    .from('student_mastery')
    .select('mastery_level')
    .eq('user_id', userId!)

  const masteryCount = {
    masters: masteryStats?.filter(m => m.mastery_level === 'masters').length || 0,
    understands: masteryStats?.filter(m => m.mastery_level === 'understands').length || 0,
    needs_more_work: masteryStats?.filter(m => m.mastery_level === 'needs_more_work').length || 0,
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.full_name || 'Student'}!
        </h1>
        <p className="mt-2 text-gray-600">{profile?.schools?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="text-sm font-medium text-gray-500">Total Blocks</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{blocks?.length || 0}</div>
        </div>

        <div className="card">
          <div className="text-sm font-medium text-gray-500">Total Questions</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{totalQuestions || 0}</div>
        </div>

        <div className="card">
          <div className="text-sm font-medium text-gray-500">Topics Mastered</div>
          <div className="mt-2 text-3xl font-bold text-green-600">{masteryCount.masters}</div>
        </div>

        <div className="card">
          <div className="text-sm font-medium text-gray-500">Needs Work</div>
          <div className="mt-2 text-3xl font-bold text-orange-600">{masteryCount.needs_more_work}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/upload" className="card hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-2">📤</div>
          <h3 className="text-lg font-semibold mb-1">Upload Materials</h3>
          <p className="text-sm text-gray-600">Add PDFs, lectures, and notes to your blocks</p>
        </Link>

        <Link href="/dashboard/study" className="card hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-2">📝</div>
          <h3 className="text-lg font-semibold mb-1">Start Studying</h3>
          <p className="text-sm text-gray-600">Practice with USMLE-style questions</p>
        </Link>

        <Link href="/dashboard/feynman" className="card hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-2">🎓</div>
          <h3 className="text-lg font-semibold mb-1">Feynman Mode</h3>
          <p className="text-sm text-gray-600">Teach concepts and get AI feedback</p>
        </Link>
      </div>

      {/* Blocks Overview */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Your Blocks</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {blocks?.map((block) => (
            <Link
              key={block.id}
              href={`/dashboard/blocks/${block.block_number}`}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors text-center"
            >
              <div className="text-2xl font-bold text-gray-900">Block {block.block_number}</div>
              <div className="text-xs text-gray-500 mt-1">
                {block.is_review ? 'Review' : 'Content'}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  ) catch (error) {
    console.error('[Dashboard] Error:', error)
    return (
      <div className="card">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Dashboard</h1>
        <p className="mt-4">There was an error loading your dashboard. Please try logging in again.</p>
        <Link href="/login" className="btn-primary mt-4 inline-block">
          Go to Login
        </Link>
      </div>
    )
  }
}
