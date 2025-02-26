import { nanoid } from 'nanoid'
import { writeBatch, doc, Timestamp } from 'firebase/firestore'
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
const milestoneConversationHistory = ref([] as any[])
const todoConversationHistory = ref([] as any[])

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


    return {
        startGoal,
        initStartGoal,
        start_date,
        goalDetails,
        loading,
        milestones,
        todos,
        milestoneConversationHistory,
        todoConversationHistory
    }
}


const createMilestone = async () => {
    try {
        const { id: user_id } = useUser()

        // Create the prompt data
        const promptData = JSON.stringify({
            goal: goalDetails.value.desc,
            steps: JSON.stringify(goalDetails.value.steps),
            start_date: start_date.value
        })

        // Add the prompt to conversation history
        milestoneConversationHistory.value.push({
            role: 'user',
            parts: promptData
        })

        const { data, error: fetchError } = await useFetch('/api/gemini/generate-milestone', {
            method: 'POST',
            body: JSON.stringify({
                prompt: promptData,
                history: milestoneConversationHistory.value,
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
        const parsedResponse = JSON.parse(data.value.text)

        // Add the AI response to conversation history
        milestoneConversationHistory.value.push({
            role: 'assistant',
            parts: data.value.text
        })

        milestones.value = parsedResponse.milestones.map((milestone: any) => ({
            ...milestone,
            id: nanoid(),
            goal_id: goalDetails.value.id,
            user_id: user_id.value!
        }))
    } catch (e:any) {
        useAlert().openAlert({ type: 'ERROR', msg: e instanceof Error ? e.message : 'An unexpected error occurred, please try again' })
        throw new Error(e)
    }
}

const createTodo = async () => {
    try {
        const { id: user_id } = useUser()

        // Create the prompt data
        const promptData = JSON.stringify({
            goal: goalDetails.value.desc,
            steps: JSON.stringify(goalDetails.value.steps),
            start_date: start_date.value,
            milestones: JSON.stringify(milestones.value)
        })

        // Add the prompt to conversation history
        todoConversationHistory.value.push({
            role: 'user',
            parts: promptData
        })

        const { data, error: fetchError } = await useFetch('/api/gemini/generate-todo', {
            method: 'POST',
            body: JSON.stringify({
                prompt: promptData,
                history: todoConversationHistory.value,
                sessionId: sessionId.value
            })
        }) as { data: Ref<{ text: string, sessionId: string }>, error: any }

        if (fetchError.value) {
            throw new Error(fetchError.value.message || 'An error occurred while fetching data for the todo')
        }

        if (data.value === undefined) {
            throw new Error('No response received from the server for the todo')
        }

        const parsedResponse = JSON.parse(data.value.text)

        // Add the AI response to conversation history
        todoConversationHistory.value.push({
            role: 'assistant',
            parts: data.value.text
        })

        todos.value = parsedResponse.todos.map((todo: any) => ({
            ...todo,
            id: nanoid(),
            goal_id: goalDetails.value.id,
            user_id: user_id.value!
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
            started: true,
            updated_at: Timestamp.fromDate(new Date()),
            user_id: user_id.value!
        })

        // Create todos as sub-documents under the user
        for (const todo of todos.value) {
            const todoRef = doc(db, 'users', user_id.value!, 'todos', todo.id)
            batch.set(todoRef, {
                ...todo,
                created_at: Timestamp.fromDate(new Date()),
                updated_at: Timestamp.fromDate(new Date()),
                user_id: user_id.value!
            })
        }

        await batch.commit()
    } catch (e:any) {
        useAlert().openAlert({ type: 'ERROR', msg: e instanceof Error ? e.message : 'An unexpected error occurred, please try again' })
        throw new Error(e)
    }
}
