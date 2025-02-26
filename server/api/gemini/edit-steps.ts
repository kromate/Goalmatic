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
        statusCode: 429,
        message: 'Too Many Requests'
      })
    }

    // Request Body Parsing and Validation
    // ===========================================================================
    const { feedback, currentSteps, history } = await readBody(event)

    if (!feedback) {
      throw new Error('Missing required parameter: feedback')
    }

    if (!currentSteps || !Array.isArray(currentSteps) || currentSteps.length === 0) {
      throw new Error('Missing or invalid required parameter: currentSteps')
    }

    // Format the conversation history if provided
    const conversationHistory = history?.map((msg: Record<string, any>) => ({
      role: msg.role,
      content: msg.parts ?? 'null'
    })) || []

    // Add the current steps and feedback to the conversation
    conversationHistory.push({
      role: 'user',
      content: JSON.stringify({
        currentSteps,
        feedback
      })
    })

    const systemPrompt = systemPrompts.SMART_STEP_EDITOR.info
    const systemModel = systemPrompts.SMART_STEP_EDITOR.model
    const systemSchema = systemPrompts.SMART_STEP_EDITOR.schema

    const { object } = await generateObject({
      model: systemModel,
      schema: systemSchema,
      messages: conversationHistory,
      system: systemPrompt
    })

    // Safety check: If the response doesn't have steps or they're not an array, return the original steps
    if (!object || !object.steps || !Array.isArray(object.steps) || object.steps.length === 0) {
      return {
        response: { steps: currentSteps }
      }
    }

    // Safety check: Ensure we don't have too many changes
    const originalStepCount = currentSteps.length
    const newStepCount = object.steps.length

    // If the number of steps has changed too drastically, revert to original steps
    if (Math.abs(originalStepCount - newStepCount) > 2) {
      console.warn('Step editor attempted to make too many changes. Reverting to original steps.')
      return {
        response: { steps: currentSteps }
      }
    }

    return {
      response: object
    }
  } catch (error) {
    // Error Handling
    // ===========================================================================
    console.error('Error in Edit Steps API handler:', error)

    if (error instanceof InvalidPromptError) {
      return createError({
        statusCode: 400,
        message: 'Invalid prompt: ' + error.message
      })
    } else if (error instanceof Error) {
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
