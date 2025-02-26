import { v4 as uuidv4 } from 'uuid'
import { Timestamp } from 'firebase/firestore'
import { useGenerateGoalActionableStep } from '@/composables/genericGoals/timeline'
import { setFirestoreDocument } from '@/firebase/firestore/create'
import { useAlert } from '@/composables/core/notification'
import { useUser } from '@/composables/auth/user'

export const useCreateGoals = () => {
    const { steps, userGoal, step } = useGenerateGoalActionableStep()
    const title = ref('')
    const loading = ref(false)
    const sessionId = ref('')
    const titleConversationHistory = ref([] as any[])

    const createGoals = async () => {
        const { id: user_id } = useUser()

        loading.value = true

        const id = uuidv4()
        try {
            // Add the prompt to conversation history
            titleConversationHistory.value.push({
                role: 'user',
                parts: userGoal.value
            })

            const { data, error: fetchError } = await useFetch('/api/gemini/generate-title', {
                method: 'POST',
                body: JSON.stringify({
                    prompt: userGoal.value,
                    history: titleConversationHistory.value,
                    sessionId: sessionId.value
                })
            }) as { data: Ref<{ text: string, sessionId: string }>, error: any }

            if (fetchError.value) {
                throw new Error(fetchError.value.message || 'An error occurred while fetching data')
            }

            if (data.value === undefined) {
                throw new Error('No response received from the server')
            }

            sessionId.value = data.value.sessionId
            const parsedResponse = JSON.parse(data.value.text)

            // Add the AI response to conversation history
            titleConversationHistory.value.push({
                role: 'assistant',
                parts: data.value.text
            })

            title.value = parsedResponse.title

                const sent_data = {
            id,
            title: title.value,
            desc: userGoal.value,
            steps: steps.value.map((step) => { return { ...step, id: uuidv4() } }),
            user_id: user_id.value,
            created_at: Timestamp.fromDate(new Date()),
            updated_at: Timestamp.fromDate(new Date()),
            started: false
        }

            await setFirestoreDocument('goals', sent_data.id, sent_data)
                useRouter().push(`/goals/${sent_data.id}`)
        } catch (e) {
            loading.value = false
            useAlert().openAlert({ type: 'ERROR', msg: e instanceof Error ? e.message : 'An unexpected error occurred, please try again' })
        } finally {
            loading.value = false
        }
    }

    const resetForm = () => {
        step.value = 1
        userGoal.value = ''
        steps.value = []
        titleConversationHistory.value = []
    }

    return { createGoals, resetForm, loading, titleConversationHistory }
}
