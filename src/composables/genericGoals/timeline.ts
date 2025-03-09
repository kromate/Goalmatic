import { useStorage } from '@vueuse/core'
import { useSmartGoal } from './smart'
import { TimeLineObject } from './types'
import { useAlert } from '@/composables/core/notification'




const loading = ref(false)
const steps = ref<TimeLineObject[]>([])
export const unauthorisedGoalSync = useStorage('unauthorisedGoalSync', {} as any)

export const syncAfterAuth = () => {
    const { step, userGoal } = useSmartGoal()
    step.value = 2
    userGoal.value = unauthorisedGoalSync.value.goal
    steps.value = unauthorisedGoalSync.value.steps
    unauthorisedGoalSync.value = {}
    useRouter().push('/goals/create')
}

export const useGenerateGoalActionableStep = () => {
    const { step, userGoal, conversationHistory } = useSmartGoal()
    const suggestionLoading = ref(false)
    const stepSuggestion = ref('')

    const generateGoalTimeline = async (goal) => {
        loading.value = true
        steps.value = []
        step.value = 2

        try {
            // Add the initial goal to conversation history if it's not already there
            if (conversationHistory.value.length === 0 ||
                conversationHistory.value[conversationHistory.value.length - 1].parts !== goal) {
                conversationHistory.value.push({
                    role: 'user',
                    parts: goal
                })
            }

            const { data, error: fetchError } = await useFetch('/api/gemini/generate-steps', {
                method: 'POST',
                body: JSON.stringify({
                    prompt: goal,
                    history: conversationHistory.value
                })
            }) as { data: Ref<{ response: { steps: TimeLineObject[] } }>, error: any }

            if (fetchError.value) {
                throw new Error(fetchError.value.message || 'An error occurred while fetching data')
            }

            if (data.value === undefined) {
                throw new Error('No response received from the server')
            }


            steps.value = data.value.response.steps as TimeLineObject[]

            // Add the AI response to conversation history
            conversationHistory.value.push({
                role: 'assistant',
                parts: JSON.stringify(data.value.response)
            })
        } catch (e) {
            useAlert().openAlert({ type: 'ERROR', msg: e instanceof Error ? e.message : 'An unexpected error occurred, please try again' })
        } finally {
            loading.value = false
        }
    }

    const submitStepSuggestion = async (suggestion: string) => {
        if (!suggestion || suggestionLoading.value) return

        suggestionLoading.value = true

        try {
            // Add the user's suggestion to the conversation history
            conversationHistory.value.push({
                role: 'user',
                parts: suggestion
            })

            const { data, error: fetchError } = await useFetch('/api/gemini/edit-steps', {
                method: 'POST',
                body: JSON.stringify({
                    feedback: suggestion,
                    currentSteps: steps.value,
                    history: conversationHistory.value
                })
            }) as { data: Ref<{ response: { steps: TimeLineObject[] } }>, error: any }

            if (fetchError.value) {
                throw new Error(fetchError.value.message || 'An error occurred while fetching data')
            }

            if (data.value === undefined) {
                throw new Error('No response received from the server')
            }

            // Update the steps with the new ones from the AI
            steps.value = data.value.response.steps as TimeLineObject[]

            // Add the AI response to conversation history
            conversationHistory.value.push({
                role: 'assistant',
                parts: JSON.stringify(data.value.response)
            })

            // Show success message
            useAlert().openAlert({ type: 'SUCCESS', msg: 'Steps updated successfully!' })

            return true
        } catch (e) {
            useAlert().openAlert({
                type: 'ERROR',
                msg: e instanceof Error ? e.message : 'An unexpected error occurred, please try again'
            })
            return false
        } finally {
            suggestionLoading.value = false
        }
    }

    const saveUnauthorisedGoal = (url:string) => {
        unauthorisedGoalSync.value = {
            goal: userGoal.value,
            steps: steps.value
        }

        useRouter().push(url)
    }


    return {
        unauthorisedGoalSync, userGoal,
        saveUnauthorisedGoal, step,
        generateGoalTimeline,
        loading,
        steps,
        submitStepSuggestion,
        suggestionLoading
    }
}
