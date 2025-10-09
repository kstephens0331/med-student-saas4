import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

// Initialize clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Together.ai client (using OpenAI-compatible API)
// Note: We use the OpenAI SDK to connect to Together.ai since they provide an OpenAI-compatible API
const togetherAI = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY!,
  baseURL: 'https://api.together.xyz/v1',
})

export interface GeneratedQuestion {
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  option_e: string
  correct_answer: 'A' | 'B' | 'C' | 'D' | 'E'
  explanation: string
  topic: string
  difficulty: string
}

export async function generateQuestions(
  content: string,
  count: number = 50,
  questionType: 'textbook' | 'powerpoint' | 'lecture' | 'notes' = 'textbook'
): Promise<GeneratedQuestion[]> {
  const prompt = `You are a USMLE question generator. Generate ${count} high-quality USMLE Step 1/2 style questions from the following medical content.

CRITICAL REQUIREMENTS:
1. Each question must be a clinical vignette (1-2 paragraphs) with realistic patient scenarios
2. Include relevant labs, vitals, physical exam findings
3. Focus on "next best step" or clinical reasoning questions
4. Provide 5 answer choices (A-E)
5. IMPORTANT: Randomize the position of the correct answer (not always C!)
6. Include detailed explanations
7. Identify the medical topic/system
8. Rate difficulty: easy, medium, or hard

Content to generate questions from:
${content.slice(0, 8000)}

Return ONLY a JSON array of questions in this exact format:
[
  {
    "question_text": "A 45-year-old man with...",
    "option_a": "...",
    "option_b": "...",
    "option_c": "...",
    "option_d": "...",
    "option_e": "...",
    "correct_answer": "B",
    "explanation": "The correct answer is B because...",
    "topic": "Cardiology - Acute Coronary Syndrome",
    "difficulty": "medium"
  }
]`

  try {
    // Primary: Together.ai (cost-efficient)
    const response = await togetherAI.chat.completions.create({
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4000,
    })

    const content_text = response.choices[0]?.message?.content || '[]'
    const questions = JSON.parse(content_text)
    return questions
  } catch (error) {
    console.error('Together.ai failed, falling back to Claude:', error)

    // Fallback: Claude Sonnet
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      })

      const content_text = response.content[0].type === 'text' ? response.content[0].text : '[]'
      const questions = JSON.parse(content_text)
      return questions
    } catch (claudeError) {
      console.error('Claude also failed:', claudeError)
      throw new Error('Failed to generate questions with all providers')
    }
  }
}

export async function ragAnswer(
  question: string,
  context: string[]
): Promise<{ answer: string; sources: string[] }> {
  const contextText = context.join('\n\n---\n\n')

  const prompt = `You are a medical education assistant. Answer the following question using ONLY the provided context from the student's uploaded materials.

IMPORTANT RULES:
1. Only use information from the context below
2. If the answer is not in the context, say "I don't have enough information in your uploaded materials to answer this question."
3. Cite which sources you used
4. Be concise but thorough
5. Use medical terminology appropriately

Context from uploaded materials:
${contextText}

Student's question: ${question}

Provide your answer and list the sources used.`

  try {
    // Primary: Together.ai
    const response = await togetherAI.chat.completions.create({
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000,
    })

    const answer = response.choices[0]?.message?.content || ''

    return {
      answer,
      sources: extractSources(answer, context)
    }
  } catch (error) {
    console.error('Together.ai failed, falling back to Claude:', error)

    // Fallback: Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const answer = response.content[0].type === 'text' ? response.content[0].text : ''

    return {
      answer,
      sources: extractSources(answer, context)
    }
  }
}

export async function evaluateFeynmanText(
  topic: string,
  explanation: string
): Promise<{
  accuracy: number
  completeness: number
  clarity: number
  depth: number
  total: number
  feedback: {
    strengths: string[]
    improvements: string[]
    followUpQuestions: string[]
  }
}> {
  const prompt = `You are an expert medical educator evaluating a student's explanation of a medical concept.

Topic: ${topic}

Student's Explanation:
${explanation}

Evaluate this explanation on 4 criteria (0-25 points each):

1. ACCURACY (0-25): Is the information medically accurate?
2. COMPLETENESS (0-25): Does it cover all key aspects of the topic?
3. CLARITY (0-25): Is it well-organized and easy to understand?
4. DEPTH (0-25): Does it show deep understanding beyond memorization?

Provide:
- Scores for each criterion
- 3-5 specific strengths
- 3-5 areas for improvement
- 3-5 follow-up questions to deepen understanding

Return ONLY a JSON object in this format:
{
  "accuracy": 20,
  "completeness": 18,
  "clarity": 22,
  "depth": 19,
  "feedback": {
    "strengths": ["...", "..."],
    "improvements": ["...", "..."],
    "followUpQuestions": ["...", "..."]
  }
}`

  // Always use Claude for evaluation (best reasoning)
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  const result = response.content[0].type === 'text' ? JSON.parse(response.content[0].text) : {}
  const total = result.accuracy + result.completeness + result.clarity + result.depth

  return {
    ...result,
    total,
  }
}

export async function extractTextFromImage(imageBase64: string): Promise<string> {
  // Note: Image text extraction has been removed.
  // For Phase 2, consider using Claude 3 Vision or GPT-4 Vision for OCR capabilities
  throw new Error('Image text extraction is not currently available. This feature will be added in Phase 2.')
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Using Together.ai's embedding model
    const response = await togetherAI.embeddings.create({
      model: 'togethercomputer/m2-bert-80M-8k-retrieval',
      input: text,
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('Failed to generate embedding:', error)
    throw new Error('Failed to generate embedding')
  }
}

export async function generateProbingQuestion(
  topic: string,
  transcriptSoFar: string
): Promise<string> {
  const prompt = `You are an AI teaching assistant listening to a medical student explain "${topic}".

Transcript so far:
${transcriptSoFar}

Generate ONE probing question to help the student think deeper about this topic. The question should:
1. Be specific to what they've said
2. Challenge them to explain mechanisms or clinical applications
3. Be concise (1-2 sentences)

Return ONLY the question text, nothing else.`

  try {
    const response = await togetherAI.chat.completions.create({
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    })

    return response.choices[0]?.message?.content || 'Can you elaborate on that point?'
  } catch (error) {
    return 'Can you explain that concept in more detail?'
  }
}

// Helper function to extract sources from answer
function extractSources(answer: string, context: string[]): string[] {
  const sources: string[] = []

  // Simple heuristic: look for file references or citations in the answer
  context.forEach((ctx, idx) => {
    if (answer.toLowerCase().includes(ctx.slice(0, 50).toLowerCase())) {
      sources.push(`Source ${idx + 1}`)
    }
  })

  return sources.length > 0 ? sources : ['Multiple sources']
}
