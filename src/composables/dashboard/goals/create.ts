import { v4 as uuidv4 } from 'uuid'
import { useGenerateGoalActionableStep } from '@/composables/genericGoals/timeline'
import { setFirestoreDocument } from '@/firebase/firestore/create'
import { useAlert } from '@/composables/core/notification'
import { useUser } from '@/composables/auth/user'

export const useCreateGoals = () => {
    const { steps, userGoal, step } = useGenerateGoalActionableStep()
    const title = ref('')
    const loading = ref(false)

    const createGoals = async () => {
        const { id: user_id } = useUser()

        loading.value = true

        const id = uuidv4()
        try {
            const { data, error: fetchError } = await useFetch('/api/gemini/chat', {
                method: 'POST',
                body: JSON.stringify({ prompt: userGoal.value, promptType: 'SMART_TITLE' })
            }) as { data: Ref<string>, error: any }


            if (fetchError.value) {
                throw new Error(fetchError.value.message || 'An error occurred while fetching data')
            }

            if (data.value === undefined) {
                throw new Error('No response received from the server')
            }


                title.value = JSON.parse(data.value).title
        } catch (e) {
            loading.value = false
            useAlert().openAlert({ type: 'ERROR', msg: e instanceof Error ? e.message : 'An unexpected error occurred, please try again' })
        }
        const sent_data = {
            id,
            title: title.value,
            desc: userGoal.value,
            steps: steps.value.map((step) => { return { ...step, id: uuidv4() } }),
            user_id: user_id.value,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            started: false
        }

        await setFirestoreDocument('goals', sent_data.id, sent_data)
        useRouter().push(`/goals/${sent_data.id}`)
        loading.value = false
    }

    const resetForm = () => {
        step.value = 1
        userGoal.value = ''
        steps.value = []
    }

    return { createGoals, resetForm, loading }
}
