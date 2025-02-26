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


    const { prompt } = await readBody(event)
    if (!prompt) {
      throw new Error('Missing required parameter: prompt')
    }




    // ===========================================================================
    const [errorCheck, goalAdjustment, criteriaEvaluation] = await Promise.all([
      // 1. Error checking
      generateObject({
        model: systemPrompts.SMART_ERROR_CHECKER.model,
        schema: systemPrompts.SMART_ERROR_CHECKER.schema,
        prompt,
        system: systemPrompts.SMART_ERROR_CHECKER.info
      }),

      // 2. Goal adjustment
      generateObject({
        model: systemPrompts.SMART_GOAL_ADJUSTER.model,
        schema: systemPrompts.SMART_GOAL_ADJUSTER.schema,
        prompt,
        system: systemPrompts.SMART_GOAL_ADJUSTER.info
      }),

      // 3. SMART criteria evaluation
      generateObject({
        model: systemPrompts.SMART_CRITERIA_EVALUATOR.model,
        schema: systemPrompts.SMART_CRITERIA_EVALUATOR.schema,
        prompt,
        system: systemPrompts.SMART_CRITERIA_EVALUATOR.info
      })
    ])

    // Combine the results
    // ===========================================================================
    const combinedResponse = {
      has_error: errorCheck.object.has_error,
      error_msg: errorCheck.object.error_msg,
      is_smart: goalAdjustment.object.is_smart,
      adjusted_goal: goalAdjustment.object.adjusted_goal,
      is_specific: criteriaEvaluation.object.is_specific,
      is_measurable: criteriaEvaluation.object.is_measurable,
      is_achievable: criteriaEvaluation.object.is_achievable,
      is_relevant: criteriaEvaluation.object.is_relevant,
      is_time_bound: criteriaEvaluation.object.is_time_bound,
      percentage: criteriaEvaluation.object.percentage
    }

    return {
      response: combinedResponse
    }
  } catch (error) {
    // Error Handling
    // ===========================================================================
    console.error('Error in Parallel SMART Goal API handler:', error)

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
