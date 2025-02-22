import { useStorage } from '@vueuse/core'
import { useSmartGoal } from './smart'
import { TimeLineObject } from './types'
import { useAlert } from '@/composables/core/notification'




const loading = ref(false)
const steps = ref<TimeLineObject[]>([])
export const unauthorisedGoalSync = useStorage('unauthorisedGoalSync', {} as any)

export const syncAfterAuth = () => {
    const { step, userGoal, sessionId } = useSmartGoal()
    step.value = 2
    userGoal.value = unauthorisedGoalSync.value.goal
    steps.value = unauthorisedGoalSync.value.steps
    unauthorisedGoalSync.value = {}
    useRouter().push('/goals/create')
}

export const useGenerateGoalActionableStep = () => {
    const { step, userGoal, sessionId } = useSmartGoal()

    const generateGoalTimeline = async (goal) => {
        loading.value = true
        steps.value = []
        step.value = 2

        try {
            const { data, error: fetchError } = await useFetch('/api/gemini/chat', {
                method: 'POST',
                body: JSON.stringify({
                    prompt: goal,
                    promptType: 'SMART_TIMELINE',
                    sessionId: sessionId.value
                })
            }) as { data: Ref<{ text: string, sessionId: string }>, error: any }

            if (fetchError.value) {
                throw new Error(fetchError.value.message || 'An error occurred while fetching data')
            }

            if (data.value === undefined) {
                throw new Error('No response received from the server')
            }

            steps.value = JSON.parse(data.value.text).steps as TimeLineObject[]
        } catch (e) {
            useAlert().openAlert({ type: 'ERROR', msg: e instanceof Error ? e.message : 'An unexpected error occurred, please try again' })
        } finally {
            loading.value = false
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
        steps
    }
}
