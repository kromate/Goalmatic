import { gemini15Flash, googleAI } from '@genkit-ai/googleai'
import { genkit } from 'genkit'
import { v4 as uuidv4 } from 'uuid'
import { systemPrompts } from './utils/system_prompt'
import { isRateLimited } from './utils/rateLimit'
// Store active sessions
const sessions = new Map<string, any>()

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

    const { prompt, promptType, sessionId } = await readBody(event)
    if (!prompt || !promptType) {
      throw new Error('Missing required parameters: prompt or promptType')
    }


    // Initialize Genkit with Google AI plugin
    const ai = genkit({
      plugins: [googleAI({ apiKey: GEMINI_API_KEY })],
      model: systemPrompts[promptType].model
    })

    const systemInst = systemPrompts[promptType].info
    if (!systemInst) {
      throw new Error(`Invalid promptType: ${promptType}`)
    }

    let chat
    let newSessionId
    if (sessionId && sessions.has(sessionId)) {
      // Load existing session
      const existingChat = sessions.get(sessionId)
      // Check if promptType has changed
      if (existingChat.config?.system === systemInst) {
        chat = existingChat
      } else {
        // Create new chat session if promptType is different
        chat = ai.chat({
          system: systemInst,
          output: { schema: systemPrompts[promptType].schema },
          config: {
            temperature: 1.0,
            topP: 0.95,
            topK: 40
          }
        })
        // Generate new session ID
        newSessionId = uuidv4()
        sessions.set(newSessionId, chat)
      }
    } else {
      // Create new chat session
      chat = ai.chat({
        system: systemInst,
        output: { schema: systemPrompts[promptType].schema },
        config: {
          temperature: 1.0,
          topP: 0.95,
          topK: 40
        }
      })

      // Store new session with a unique ID if none provided
      newSessionId = uuidv4()
      sessions.set(newSessionId, chat)
    }

    // Send message and get response
    const { text } = await chat.send(prompt)

    return {
      text,
      sessionId: sessionId || newSessionId
    }
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


