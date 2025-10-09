import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { evaluateFeynmanText } from '@/lib/llm/factory'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { topic, explanation } = await request.json()

    if (!topic || !explanation) {
      return NextResponse.json({ error: 'Missing topic or explanation' }, { status: 400 })
    }

    if (explanation.length < 500) {
      return NextResponse.json({ error: 'Explanation too short (minimum 500 characters)' }, { status: 400 })
    }

    // Evaluate the explanation using Claude
    const result = await evaluateFeynmanText(topic, explanation)

    // Save feynman session
    await supabase.from('feynman_sessions').insert({
      user_id: session.user.id,
      topic,
      mode: 'text',
      content: explanation,
      accuracy_score: result.accuracy,
      completeness_score: result.completeness,
      clarity_score: result.clarity,
      depth_score: result.depth,
      total_score: result.total,
      feedback: result.feedback,
      completed_at: new Date().toISOString(),
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Feynman evaluation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
