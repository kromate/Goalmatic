import { v4 as uuidv4 } from 'uuid'
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
    const { prompt, promptType, history } = await readBody(event)
    if (!prompt || !promptType) {
      throw new Error('Missing required parameters: prompt or promptType')
    }


    const conversationHistory = history.map((msg: Record<string, any>) => ({
      role: msg.role,
      content: msg.parts ?? 'null'
    }))



    const systemPrompt = systemPrompts[promptType].info
    if (!systemPrompt) {
      throw new Error(`Invalid promptType: ${promptType}`)
    }

    const systemModel = systemPrompts[promptType].model
    const systemSchema = systemPrompts[promptType].schema



    const { object } = await generateObject({
      model: systemModel,
      schema: systemSchema,
      messages: conversationHistory,
      system: systemPrompt
    })

    return {
      response: object
    }
  } catch (error) {
    // Error Handling
    // ===========================================================================
    console.error('Error in Gemini API handler:', error)

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


