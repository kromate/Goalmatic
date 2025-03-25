import { InvalidPromptError, generateObject } from 'ai'
import { systemPrompts } from './utils/system_prompt'

export default defineEventHandler(async (event) => {
  try {
    // Request Body Parsing and Validation
    // ===========================================================================
    const { prompt } = await readBody(event)
    if (!prompt) {
      throw new Error('Missing required parameter: prompt')
    }

    // Test both implementations
    // ===========================================================================
    console.time('original')
    const originalStart = Date.now()

    // Original implementation - using a direct approach
    const original = await generateObject({
      model: systemPrompts.SMART_CHECKER.model,
      schema: systemPrompts.SMART_CHECKER.schema,
      messages: [{ role: 'user', content: prompt }] as any,
      system: systemPrompts.SMART_CHECKER.info
    })

    const originalTime = Date.now() - originalStart
    console.timeEnd('original')

    // Parallel implementation
    console.time('parallel')
    const parallelStart = Date.now()

    // Using the same message format for all parallel calls
    const messages = [{ role: 'user', content: prompt }] as any

    const [errorCheck, goalAdjustment, criteriaEvaluation] = await Promise.all([
      // 1. Error checking
      generateObject({
        model: systemPrompts.SMART_ERROR_CHECKER.model,
        schema: systemPrompts.SMART_ERROR_CHECKER.schema,
        messages,
        system: systemPrompts.SMART_ERROR_CHECKER.info
      }),

      // 2. Goal adjustment
      generateObject({
        model: systemPrompts.SMART_GOAL_ADJUSTER.model,
        schema: systemPrompts.SMART_GOAL_ADJUSTER.schema,
        messages,
        system: systemPrompts.SMART_GOAL_ADJUSTER.info
      }),

      // 3. SMART criteria evaluation
      generateObject({
        model: systemPrompts.SMART_CRITERIA_EVALUATOR.model,
        schema: systemPrompts.SMART_CRITERIA_EVALUATOR.schema,
        messages,
        system: systemPrompts.SMART_CRITERIA_EVALUATOR.info
      })
    ])

    const parallelTime = Date.now() - parallelStart
    console.timeEnd('parallel')

    // Combine the parallel results
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

    // Return comparison results
    return {
      originalTime,
      parallelTime,
      speedup: originalTime / parallelTime,
      originalResponse: original.object,
      parallelResponse: combinedResponse
    }
  } catch (error) {
    // Error Handling
    // ===========================================================================
    console.error('Error in Test Parallel API handler:', error)

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
