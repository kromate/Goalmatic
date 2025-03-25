import { InvalidPromptError, generateObject } from 'ai'
import { systemPrompts } from './utils/system_prompt'
import { isRateLimited } from './utils/rateLimit'

export default defineEventHandler(async (event) => {
  try {
    // Rate Limiting
    // ===========================================================================
    const ip = event.node.req.headers['x-forwarded-for'] as string || event.node.req.socket.remoteAddress as string

    if (isRateLimited(ip)) {
      throw createError({
        status: 429,
        message: 'Too Many Requests'
      })
    }

    // Request Body Parsing and Validation
    // ===========================================================================
    const { prompt, history, sessionId } = await readBody(event)
    if (!prompt) {
      throw new Error('Missing required parameter: prompt')
    }

    const conversationHistory = history?.map((msg: Record<string, any>) => ({
      role: msg.role,
      content: msg.parts ?? 'null'
    })) || []

    const systemPrompt = systemPrompts.SMART_TODO.info
    const systemModel = systemPrompts.SMART_TODO.model
    const systemSchema = systemPrompts.SMART_TODO.schema

    const { object } = await generateObject({
      model: systemModel,
      schema: systemSchema,
      messages: conversationHistory,
      system: systemPrompt
    })

    return {
      text: JSON.stringify(object),
      sessionId: sessionId || ''
    }
  } catch (error) {
    // Error Handling
    // ===========================================================================
    console.error('Error in Generate Todo API handler:', error)

    if (error instanceof InvalidPromptError) {
      return createError({
        status: 400,
        message: 'Invalid prompt: ' + error.message
      })
    } else if (error instanceof Error) {
      return createError({
        status: 500,
        message: error.message
      })
    } else {
      return createError({
        status: 500,
        message: 'Internal Server Error'
      })
    }
  }
})
