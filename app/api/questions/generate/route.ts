import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { generateQuestions } from '@/lib/llm/factory'

// Dynamic import to avoid build-time issues
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { fileId } = await request.json()

    if (!fileId) {
      return NextResponse.json({ error: 'Missing file ID' }, { status: 400 })
    }

    // Get file details
    const { data: file, error: fileError } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single()

    if (fileError || !file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('study-materials')
      .download(file.storage_path)

    if (downloadError || !fileData) {
      return NextResponse.json({ error: 'Failed to download file' }, { status: 500 })
    }

    // Extract text based on file type
    let extractedText = ''

    if (file.file_type === 'pdf') {
      // Dynamic import of pdf-parse to avoid build issues
      const PDFParser = (await import('pdf-parse')).default
      const buffer = await fileData.arrayBuffer()
      const pdfData = await PDFParser(Buffer.from(buffer))
      extractedText = pdfData.text
    } else if (file.file_type === 'note') {
      extractedText = await fileData.text()
    } else {
      return NextResponse.json({
        error: 'Unsupported file type for question generation. Use PDF or text files.',
      }, { status: 400 })
    }

    if (!extractedText || extractedText.length < 100) {
      return NextResponse.json({
        error: 'Not enough text content to generate questions',
      }, { status: 400 })
    }

    // Determine question count (for MVP: 100 questions for testing)
    const questionCount = 100

    // Generate questions using LLM
    const questions = await generateQuestions(
      extractedText,
      questionCount,
      file.file_type === 'pdf' ? 'textbook' : 'notes'
    )

    // Insert questions into database
    const questionsToInsert = questions.map(q => ({
      block_id: file.block_id,
      file_id: file.id,
      school_id: file.school_id,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      option_e: q.option_e,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      topic: q.topic,
      difficulty: q.difficulty,
    }))

    const { error: insertError } = await supabase
      .from('questions')
      .insert(questionsToInsert)

    if (insertError) {
      console.error('Error inserting questions:', insertError)
      return NextResponse.json({ error: 'Failed to save questions' }, { status: 500 })
    }

    // Update file processing status
    await supabase
      .from('files')
      .update({ processing_status: 'completed' })
      .eq('id', fileId)

    return NextResponse.json({
      message: 'Questions generated successfully',
      count: questions.length,
    })
  } catch (error) {
    console.error('Question generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
