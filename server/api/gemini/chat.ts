import { gemini15Pro, gemini15Flash8b, googleAI } from '@genkit-ai/googleai'
import { genkit } from 'genkit'
import { systemPrompts } from './utils/system_prompt'
import { isRateLimited } from './utils/rateLimit'

export default defineEventHandler(async (event) => {
  try {
    const ip = event.node.req.headers['x-forwarded-for'] as string || event.node.req.socket.remoteAddress as string

    if (isRateLimited(ip)) {
      throw createError({
        statusCode: 429,
        message: 'Too Many Requests'
      })
    }

    const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY
    if (!GEMINI_API_KEY) {
      throw new Error('Missing GEMINI API key')
    }

    const { prompt, promptType } = await readBody(event)
    if (!prompt || !promptType) {
      throw new Error('Missing required parameters: prompt or promptType')
    }

    // Initialize Genkit with Google AI plugin
    const ai = genkit({
      plugins: [googleAI({ apiKey: GEMINI_API_KEY })],
      model: gemini15Pro
    })

    const systemInst = systemPrompts[promptType].info
    if (!systemInst) {
      throw new Error(`Invalid promptType: ${promptType}`)
    }

    // Generate content using Genkit
    const { text } = await ai.generate({
      prompt,
      system: systemInst,
      output: { schema: systemPrompts[promptType].schema }
    })

    return text
  } catch (error) {
    console.error('Error in Gemini API handler:', error)

    if (error instanceof Error) {
      return createError({
        statusCode: 500,
        message: error.message
      })
    } else {
      return createError({
        statusCode: 500,
        message: 'Internal Server Error'
      })
    }
  }
})


