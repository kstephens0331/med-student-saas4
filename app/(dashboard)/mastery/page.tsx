import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function MasteryPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const userId = session?.user?.id

  // Get mastery data
  const { data: masteryData } = await supabase
    .from('student_mastery')
    .select('*, blocks(*)')
    .eq('user_id', userId!)
    .order('block_id')
    .order('accuracy_percentage', { ascending: false })

  // Group by mastery level
  const masters = masteryData?.filter(m => m.mastery_level === 'masters') || []
  const understands = masteryData?.filter(m => m.mastery_level === 'understands') || []
  const needsWork = masteryData?.filter(m => m.mastery_level === 'needs_more_work') || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mastery Tracking</h1>
        <p className="text-gray-600">Track your progress across all topics</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-green-50 border border-green-200">
          <div className="text-sm font-medium text-green-700">Mastered Topics</div>
          <div className="mt-2 text-3xl font-bold text-green-600">{masters.length}</div>
          <div className="text-xs text-green-600 mt-1">≥95% accuracy</div>
        </div>

        <div className="card bg-blue-50 border border-blue-200">
          <div className="text-sm font-medium text-blue-700">Understanding</div>
          <div className="mt-2 text-3xl font-bold text-blue-600">{understands.length}</div>
          <div className="text-xs text-blue-600 mt-1">80-95% accuracy</div>
        </div>

        <div className="card bg-orange-50 border border-orange-200">
          <div className="text-sm font-medium text-orange-700">Needs More Work</div>
          <div className="mt-2 text-3xl font-bold text-orange-600">{needsWork.length}</div>
          <div className="text-xs text-orange-600 mt-1">&lt;80% accuracy</div>
        </div>
      </div>

      {/* Mastered Topics */}
      {masters.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-green-700">🏆 Mastered Topics</h2>
          <div className="space-y-2">
            {masters.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="font-semibold">{item.topic}</div>
                  <div className="text-sm text-gray-600">
                    Block {item.blocks.block_number} • {item.total_attempts} attempts
                  </div>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {item.accuracy_percentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Understanding Topics */}
      {understands.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">📚 Understanding</h2>
          <div className="space-y-2">
            {understands.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-semibold">{item.topic}</div>
                  <div className="text-sm text-gray-600">
                    Block {item.blocks.block_number} • {item.total_attempts} attempts
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {item.accuracy_percentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Needs Work Topics */}
      {needsWork.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-orange-700">⚠️ Needs More Work</h2>
          <div className="space-y-2">
            {needsWork.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div>
                  <div className="font-semibold">{item.topic}</div>
                  <div className="text-sm text-gray-600">
                    Block {item.blocks.block_number} • {item.total_attempts} attempts
                  </div>
                </div>
                <div className="text-lg font-bold text-orange-600">
                  {item.accuracy_percentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!masteryData || masteryData.length === 0) && (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No mastery data yet. Start studying to track your progress!</p>
          <a href="/dashboard/study" className="btn-primary inline-block">
            Start Studying
          </a>
        </div>
      )}
    </div>
  )
}
