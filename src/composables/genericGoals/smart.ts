import { GoalEvaluation } from './types'
import { useAlert } from '@/composables/core/notification'

const isComponentOpen = ref(false)
const ex_userGoal = ref('')
const userGoal = ref('')
const gemini_response = ref<GoalEvaluation | Record<string, any>>({})
const loading = ref(false)
const step = ref(1)
const sessionId = ref('')


export const useSmartGoal = () => {
    const hasUserGoalChanged = computed(() => {
        return ex_userGoal.value !== userGoal.value
    })

    const smartPercentage = computed(() => {
        if (!gemini_response.value || !!gemini_response.value.error_msg) return 0
        return gemini_response.value.is_specific + gemini_response.value.is_measurable + gemini_response.value.is_achievable + gemini_response.value.is_relevant + gemini_response.value.is_time_bound
    })

    const closeModal = () => {
        isComponentOpen.value = false
        userGoal.value = ''
        ex_userGoal.value = ''
        gemini_response.value = {}
        step.value = 1
    }
    const checkIfGoalIsSmart = async () => {
        loading.value = true
        isComponentOpen.value = true
        gemini_response.value = {}
        try {
            const { data, error: fetchError } = await useFetch('/api/gemini/chat', {
                method: 'POST',
                body: JSON.stringify({
                    prompt: userGoal.value,
                    promptType: 'SMART_CHECKER',
                    sessionId: sessionId.value
                })
            }) as { data: Ref<{ text: string, sessionId: string }>, error: any }

            sessionId.value = data.value?.sessionId
            ex_userGoal.value = userGoal.value
            gemini_response.value = JSON.parse(data.value.text) as GoalEvaluation
        } catch (e) {
            gemini_response.value!.has_error = true
            gemini_response.value!.error_msg = e instanceof Error ? e.message : 'An unexpected error occurred, please try again'
            useAlert().openAlert({ type: 'ERROR', msg: e instanceof Error ? e.message : 'An unexpected error occurred, please try again' })
        } finally {
            loading.value = false
        }
    }


    return { closeModal, isComponentOpen, userGoal, checkIfGoalIsSmart, loading, gemini_response, hasUserGoalChanged, smartPercentage, step, sessionId }
}

export const smartGoals = [
  'Run a 5K race by April 2025',
  'Read 12 books by December 2025, one each month',
  'Save $5,000 for a vacation by August 2025',
  'Learn to cook 10 new recipes by June 2025',
  'Meditate for 10 minutes daily for 100 consecutive days by March 2025',
  'Complete an online course in a new skill by May 2025',
  'Lose 10 pounds through healthy eating and exercise by September 2025',
  'Volunteer at a local charity at least once a month in 2025',
  'Launch a side hustle and earn $1,000 by October 2025',
  'Declutter and organize your home by February 2025',
  'Learn to play a musical instrument and perform one song by November 2025',
  'Grow a garden with at least 5 different plants by July 2025',
  'Build a professional LinkedIn profile by March 2025',
  'Spend at least 30 minutes outdoors daily for 60 days by June 2025',
  'Complete a digital detox for one weekend every month in 2025',
  'Improve sleep quality by sticking to a consistent bedtime by May 2025',
  'Write a daily journal entry for 6 months by December 2025',
  'Plan and execute a memorable birthday celebration by September 2025',
  'Learn basic conversational phrases in a new language by July 2025',
  'Create a personal budget and save 20% of your income each month in 2025'
]
