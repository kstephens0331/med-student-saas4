import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { generateEmbedding, ragAnswer } from '@/lib/llm/factory'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { question, blockId } = await request.json()

    if (!question) {
      return NextResponse.json({ error: 'Missing question' }, { status: 400 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('school_id, subscriptions(*)')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Check subscription and daily limit for free tier
    if (profile.subscriptions?.tier === 'free') {
      const today = new Date().toISOString().split('T')[0]

      const { data: usage } = await supabase
        .from('daily_usage')
        .select('rag_questions_asked')
        .eq('user_id', session.user.id)
        .eq('usage_date', today)
        .single()

      if (usage && usage.rag_questions_asked >= 5) {
        return NextResponse.json({
          error: 'Free tier limit reached (5 questions/day). Upgrade to continue.',
        }, { status: 403 })
      }

      // Update or create usage record
      await supabase
        .from('daily_usage')
        .upsert({
          user_id: session.user.id,
          usage_date: today,
          rag_questions_asked: (usage?.rag_questions_asked || 0) + 1,
        })
    }

    // Generate embedding for the question
    const questionEmbedding = await generateEmbedding(question)

    // Get file IDs for the block if specified
    let fileIds: string[] | null = null
    if (blockId) {
      const { data: files } = await supabase
        .from('files')
        .select('id')
        .eq('block_id', blockId)

      fileIds = files?.map(f => f.id) || []
    } else {
      // Get all files from user's school
      const { data: files } = await supabase
        .from('files')
        .select('id')
        .eq('school_id', profile.school_id!)

      fileIds = files?.map(f => f.id) || []
    }

    if (!fileIds || fileIds.length === 0) {
      return NextResponse.json({
        error: 'No materials found. Please upload study materials first.',
      }, { status: 404 })
    }

    // Vector similarity search using the custom function
    const { data: matches, error: searchError } = await supabase.rpc('match_embeddings', {
      query_embedding: questionEmbedding,
      match_threshold: 0.7,
      match_count: 10,
      filter_file_ids: fileIds,
    })

    if (searchError) {
      console.error('Vector search error:', searchError)
      return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }

    if (!matches || matches.length === 0) {
      return NextResponse.json({
        answer: "I don't have enough information in your uploaded materials to answer this question. Try uploading more relevant study materials.",
        sources: [],
      })
    }

    // Extract context chunks
    const contextChunks = matches.map((m: any) => m.chunk_text)

    // Generate answer using RAG
    const { answer, sources } = await ragAnswer(question, contextChunks)

    return NextResponse.json({
      answer,
      sources,
      matchCount: matches.length,
    })
  } catch (error) {
    console.error('RAG error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
