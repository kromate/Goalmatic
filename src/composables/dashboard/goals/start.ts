import { nanoid } from 'nanoid'
import { writeBatch, doc } from 'firebase/firestore'
import { useAlert } from '@/composables/core/notification'
import { useDashboardModal } from '@/composables/core/modals'
import { db } from '@/firebase/init'
import { useUser } from '@/composables/auth/user'

const start_date = ref()
const goalDetails = ref()
const milestones = ref([])
const todos = ref([] as Record<string, any>[])
const loading = ref(false)
const sessionId = ref('')

export const useStartGoal = () => {
    const initStartGoal = async (data: Record<string, any>) => {
        goalDetails.value = data
        useDashboardModal().openStartGoal()
    }

    const startGoal = async () => {
        loading.value = true
        await createMilestone()
        await createTodo()
        await updateGoalDocument()
        loading.value = false
        useDashboardModal().closeStartGoal()
        useAlert().openAlert({ type: 'SUCCESS', msg: 'Milestone and todos generated sucessfully. Goal Started!' })
    }


    return { startGoal, initStartGoal, start_date, goalDetails, loading, milestones, todos }
}


const createMilestone = async () => {
    try {
        const { data, error: fetchError } = await useFetch('/api/gemini/chat', {
            method: 'POST',
            body: JSON.stringify({
                prompt: JSON.stringify({
                    goal: goalDetails.value.desc,
                    steps: JSON.stringify(goalDetails.value.steps),
                    start_date: start_date.value
                }),
                promptType: 'SMART_MILESTONE',
                sessionId: sessionId.value
            })
        }) as { data: Ref<{ text: string, sessionId: string }>, error: any }

        if (fetchError.value) {
            throw new Error(fetchError.value.message || 'An error occurred while fetching data for the milestone')
        }

        if (data.value === undefined) {
            throw new Error('No response received from the server for the milestone')
        }

        sessionId.value = data.value.sessionId
        milestones.value = JSON.parse(data.value.text).milestones.map((milestone: any) => ({
            ...milestone,
            id: nanoid(),
            goal_id: goalDetails.value.id
        }))
    } catch (e:any) {
        useAlert().openAlert({ type: 'ERROR', msg: e instanceof Error ? e.message : 'An unexpected error occurred, please try again' })
        throw new Error(e)
    }
}

const createTodo = async () => {
    try {
        const { data, error: fetchError } = await useFetch('/api/gemini/chat', {
            method: 'POST',
            body: JSON.stringify({
                prompt: JSON.stringify({
                    goal: goalDetails.value.desc,
                    steps: JSON.stringify(goalDetails.value.steps),
                    start_date: start_date.value,
                    milestones: JSON.stringify(milestones.value)
                }),
                promptType: 'SMART_TODO',
                sessionId: sessionId.value
            })
        }) as { data: Ref<{ text: string, sessionId: string }>, error: any }

        if (fetchError.value) {
            throw new Error(fetchError.value.message || 'An error occurred while fetching data for the todo')
        }

        if (data.value === undefined) {
            throw new Error('No response received from the server for the todo')
        }

        todos.value = JSON.parse(data.value.text).todos.map((todo: any) => ({
            ...todo,
            id: nanoid(),
            goal_id: goalDetails.value.id
        }))
    } catch (e:any) {
        useAlert().openAlert({ type: 'ERROR', msg: e instanceof Error ? e.message : 'An unexpected error occurred, please try again' })
        throw new Error(e)
    }
}


const updateGoalDocument = async () => {
    try {
        const { id: user_id } = useUser()
        const batch = writeBatch(db)

        // Update goal document
        const goalRef = doc(db, 'goals', goalDetails.value.id)
        batch.update(goalRef, {
            start_date: start_date.value,
            milestones: milestones.value,
            started: true
        })

        // Create todos as sub-documents under the user
        for (const todo of todos.value) {
            const todoRef = doc(db, 'users', user_id.value!, 'todos', todo.id)
            batch.set(todoRef, {
                ...todo,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
        }

        await batch.commit()
    } catch (e:any) {
        useAlert().openAlert({ type: 'ERROR', msg: e instanceof Error ? e.message : 'An unexpected error occurred, please try again' })
        throw new Error(e)
    }
}
