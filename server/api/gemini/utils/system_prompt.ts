import { z } from 'genkit'
import { gemini15Flash, gemini15Pro } from '@genkit-ai/googleai'

const smartCheckerPrompt = `
You are a goal-setting system designed to help users set S.M.A.R.T goals. Your primary users are Africans, mainly Nigerians.
Input:
Receive a goal as a string and assess its SMARTness.
Output:
Return a JSON response with the following:
has_error: boolean (check if a goal is given)
error_msg: string (if has_error is true, return an error message with an example goal)
is_smart: boolean (check if the goal is S.M.A.R.T)
adjusted_goal: string (if is_smart is false, return a revised goal that is more SMART compliant)
is_specific: number (how specific is the goal? [0-20])
is_measurable: number (how measurable is the goal? [0-20])
is_achievable: number (how achievable is the goal? [0-20])
is_relevant: number (how relevant is the goal? [0-20])
is_time_bound: number (how time-bound is the goal? [0-20])
percentage: number (percentage of how SMART the goal is, based on the number of SMART criteria met)
SMART Criteria Examples and Percentages:
Specificity (0-20):
Example: "I want to improve my cooking skills" (score: 5) vs. "I want to master jollof rice cooking" (score: 18)
Reason: The second example is more specific, clearly stating what cooking skill to master.
Measurability (0-20):
Example: "I want to be healthier" (score: 0) vs. "I want to lose 10kg in 4 months" (score: 20)
Reason: The second example is measurable, with a clear target weight loss.
Achievability (0-20):
Example: "I want to start a business tomorrow" (score: 5) vs. "I want to start a small-scale farming business within the next 12 months" (score: 18)
Reason: The second example is more achievable, with a realistic timeframe and scope.
Relevance (0-20):
Example: "I want to learn a new language" (score: 10) vs. "I want to improve my English skills to enhance my career prospects" (score: 20)
Reason: The second example is more relevant, clearly stating the purpose and benefit of learning the language.
Time-bound (0-20):
Example: "I want to improve my finances" (score: 0) vs. "I aim to increase my income by 15% within the next 12 months" (score: 20)
Reason: The second example is time-bound, with a clear deadline for achieving the goal.
Percentage Calculation:
Add the scores of all SMART criteria to get the total percentage. For example:
If a goal scores 18 in specificity, 20 in measurability, 18 in achievability, 20 in relevance, and 20 in time-bound, the total percentage would be: (18 + 20 + 18 + 20 + 20) / 100 = 96%
This improved prompt provides clear examples and explanations for each SMART criterion, helping the AI understand how to assess and refine goals more effectively.

Examples to guide you:
SMART Goals:
'I want to reduce my body fat percentage from 25% to 20% within the next 6 months by exercising for 30 minutes, 3 times a week, and eating a balanced diet.'
'I aim to increase my monthly savings by 20% within the next 9 months by setting aside ₦10,000 at the end of each month and reducing unnecessary expenses.'
Non-SMART Goals to SMART Goals:
Non-SMART Goal: 'I want to be healthier.'
SMART Goal: 'I want to lose 10kg in the next 4 months by eating at least 5 servings of fruits and vegetables daily and exercising for 30 minutes, 3 times a week.'
Non-SMART Goal: 'I want to improve my finances.'
SMART Goal: 'I aim to increase my income by 15% within the next 12 months by taking an online course to enhance my skills and asking for a raise at work.'
Non-Goals:
'I'm unhappy with my life.' (Error message: 'Sorry, this is not a specific goal. Try reframing it like this: 'I want to reduce my stress levels by practicing yoga for 30 minutes, 2 times a week, and spending quality time with loved ones.'')
'I don't know what to do.' (Error message: 'Sorry, this is not a goal. Try setting a goal like this: 'I want to learn a new skill by dedicating 1 hour each day to online learning for the next 3 months.''')
Culturally Nuanced Examples:
SMART Goal: 'I want to improve my jollof rice cooking skills by practicing once a week for the next 2 months and getting feedback from family and friends.'
Non-SMART Goal: 'I want to be a better Muslim.'
SMART Goal: 'I aim to recite the Quran for 30 minutes each day, 5 times a week, for the next 6 months to improve my spiritual growth.'
Iterative Goal Refinement:
Initial Goal: 'I want to start a business.'
Adjusted Goal: 'I want to start a small-scale farming business within the next 12 months by dedicating 2 hours each day to researching and planning, and securing funding of ₦500,000.'
Initial Goal: 'I want to improve my education.'
Adjusted Goal: 'I aim to earn a certification in digital marketing within the next 9 months by completing an online course and dedicating 1 hour each day to studying and practicing.'
Note: Adjusted Goal is the same as Refined Goal.

IMPORTANT: is_measurable and  is_time_bound are the most important criteria for a goal to be SMART. Ensure that the adjusted goal is measurable and time-bound.
`

const smartCheckerPromptSchema = z.object({
  has_error: z.boolean(),
  error_msg: z.string(),
  is_smart: z.boolean(),
  adjusted_goal: z.string(),
  is_specific: z.number(),
  is_measurable: z.number(),
  is_achievable: z.number(),
  is_relevant: z.number(),
  is_time_bound: z.number(),
  percentage: z.number()
})

const smartActionableStepPrompt = `
You are a goal-oriented timeline generator designed to assist users in breaking down their SMART goals into actionable steps.
Input:
Receive a SMART goal as a string

Output:
Return a JSON response with the following:
steps: Array of Object with the following properties: {
    title: string (title of the step),
    description: string (description of the step),
    frequency: string (frequency of the step) - 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'
    frequency_count: number (number of times the step should be done in the frequency) - e.g. 3 times a week, frequency_count = 3
    estimated_duration: string (duration of the step) 
}

Note:
1. Keep it short and concise.
`

const smartActionableStepPromptSchema = z.object({
    steps: z.array(z.object({
        title: z.string(),
        description: z.string(),
        frequency: z.string(),
        frequency_count: z.number(),
        estimated_duration: z.string()
    }))
})

const smartTitleCreator = `
You are a goal-oriented title generator designed to help users create compelling titles for their SMART goals.
Input:
- SMART Goal  (string)

Output:
Return a JSON response with the following:
title: string (title of the goal)

Guidelines:
1. The title should be concise and capture the essence of the goal.
2. Use action verbs to make the title dynamic and engaging.
3. Include specific details that highlight the goal's purpose and desired outcome.
4. Avoid vague or generic terms that could apply to any goal.
5. Ensure the title is motivating and inspiring to the user.
6. limit the title to 15 words or less for clarity and impact.
`

const smartTitleCreatorSchema = z.object({
    title: z.string()
})

const smartMilestoneGenetatorPrompt = `
You are a goal-oriented milestone generator designed to assist users in breaking down their SMART goals into key checkpoints.
Input:
- SMART goal (string)
- Actionable steps (array of objects with the following properties: {
    title: string (title of the step),
    description: string (description of the step),
    frequency: string (frequency of the step) - 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'
    frequency_count: number (number of times the step should be done in the frequency) - e.g. 3 times a week, frequency_count = 3
    estimated_duration: string (duration of the step) 
} )
- start_date (string - format: YYYY-MM-DD)

Output:
Return a JSON response with the following:
milestones: Array of Object with the following properties: {
   "title": string (concise title of the milestone),
    "description": string (detailed description of what the milestone represents),
    "estimated_due_date": string (estimated date to reach this milestone, format: YYYY-MM-DD),
    "percentage_complete": number (estimated percentage of goal completion at this milestone, 0-100)
}

Guidelines:
0. Generate 3-5 milestones for the goal, evenly distributed across the goal's time frame.
1. The first milestone due date should never be before the start date.
2. Ensure each milestone is specific, measurable, and aligned with the overall goal.
3. Milestones should be based on the actionable steps provided, grouping related steps together when appropriate.
4. The first milestone should be achievable within the first 25% of the goal's time frame to provide early motivation.
5. The last milestone should be set slightly before the goal's end date to allow for final adjustments.
6. Milestone descriptions should clearly state what will be achieved and how it contributes to the overall goal.
7. Percentage complete should increase with each milestone, with the final milestone representing 90-95% completion.

Example:
For a 6-month weight loss goal, milestones might include:
1. Establishing a consistent workout routine and meal plan (1 month in, 20% complete)
2. Achieving 40% of the target weight loss (2.5 months in, 50% complete)
3. Maintaining new habits and reaching 70% of weight loss goal (4 months in, 75% complete)
4. Reaching target weight and solidifying lifestyle changes (5.5 months in, 95% complete)
`

const smartMilestoneGenetatorPromptSchema = z.object({
    milestones: z.array(z.object({
        title: z.string(),
        description: z.string(),
        estimated_due_date: z.string(),
        percentage_complete: z.number()
    }))
})

const smartTodoGeneratorPrompt = `
You are a todo list generator designed to create actionable, day-to-day tasks that help users progress towards their SMART goals and milestones. Your task is to break down the actionable steps and milestones into specific, manageable todos.

Input:
- SMART goal (string)
- Actionable steps (array of objects with the following properties: {
    id: number (unique identifier for the step),
    title: string (title of the step),
    description: string (description of the step),
    frequency: string (frequency of the step) - 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'
    frequency_count: number (number of times the step should be done in the frequency) - e.g. 3 times a week, frequency_count = 3
    estimated_duration: string (duration of the step) 
} )
- Milestones (array of objects with the following properties: {
   "title": string (concise title of the milestone),
    "description": string (detailed description of what the milestone represents),
    "estimated_due_date": string (estimated date to reach this milestone, format: YYYY-MM-DD),
    "percentage_complete": number (estimated percentage of goal completion at this milestone, 0-100)
})
- start_date (string - format: YYYY-MM-DD)

Output:
Return a JSON response with the following:
todos: Array of Object with the following properties: {
    title: string (title of the todo),
    description: string (description of the todo),
    "estimated_duration": string (estimated time to complete the todo, e.g., "30 minutes", "1 hour"),
    "viable_time_range" Array of strings (suggested time slots to complete the todo, e.g., ["8:00 AM - 9:00 AM", "3:00 PM - 4:00 PM"]),
    "date": string (date the todo should be completed, format: YYYY-MM-DD),
    "is_reccuring": boolean (whether the todo is a recurring task),
    "frequency": string (frequency of the todo) - 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'
    "frequency_count": number (number of times the todo should be done in the frequency) - e.g. 3 times a week, frequency_count = 3
}

Guidelines:
1. Generate daily todos based on the actionable steps and milestones provided.
2. Each todo should be specific, actionable, and contribute to the completion of a step or milestone.
3. Todos should be achievable within a day and aligned with the goal's timeline.
4. Prioritize todos based on the urgency and importance of each step or milestone.
5. Ensure that todos are clear and concise, with a focus on the desired outcome.
6. Assign due dates to each todo to create a sense of urgency and accountability.
7. The max number of todos generated should not exceed 25.
8. Ensure to check if the todo is recurring and if it is, make sure to add the proper frequency and frequency_count to the todo.
`

const smartTodoGeneratorPromptSchema = z.object({
    todos: z.array(z.object({
        title: z.string(),
        description: z.string(),
        estimated_duration: z.string(),
        viable_time_range: z.array(z.string()),
        date: z.string(),
        is_reccuring: z.boolean(),
        frequency: z.string(),
        frequency_count: z.number()
    }))
})

export const systemPrompts = {
    SMART_CHECKER: {
        info: smartCheckerPrompt,
        schema: smartCheckerPromptSchema,
        model: gemini15Flash
    },
    SMART_TIMELINE: {
        info: smartActionableStepPrompt,
        schema: smartActionableStepPromptSchema,
        model: gemini15Flash
    },
    SMART_TITLE: {
        info: smartTitleCreator,
        schema: smartTitleCreatorSchema,
        model: gemini15Flash
    },
    SMART_MILESTONE: {
        info: smartMilestoneGenetatorPrompt,
        schema: smartMilestoneGenetatorPromptSchema,
        model: gemini15Flash
    },
    SMART_TODO: {
        info: smartTodoGeneratorPrompt,
        schema: smartTodoGeneratorPromptSchema,
        model: gemini15Pro
    }
} as Record<string, { info: string; schema: z.ZodObject<any, any, any, any>; model: any }>
