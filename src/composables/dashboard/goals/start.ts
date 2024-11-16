import { nanoid } from 'nanoid'
import { useAlert } from '@/composables/core/notification'
import { useDashboardModal } from '@/composables/core/modals'
import { updateFirestoreDocument } from '@/firebase/firestore/edit'

const start_date = ref()
const goalDetails = ref()
const milestones = ref([])
const todos = ref([])
const loading = ref(false)
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
                promptType: 'SMART_MILESTONE'
            })
        }) as { data: Ref<string>, error: any }

        if (fetchError.value) {
            throw new Error(fetchError.value.message || 'An error occurred while fetching data for the milestone')
        }

        if (data.value === undefined) {
            throw new Error('No response received from the server for the milestone')
        }


        milestones.value = JSON.parse(data.value).milestones.map((milestone: any) => ({
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
                promptType: 'SMART_TODO'
            })
        }) as { data: Ref<string>, error: any }

        if (fetchError.value) {
            throw new Error(fetchError.value.message || 'An error occurred while fetching data for the todo')
        }

        if (data.value === undefined) {
            throw new Error('No response received from the server for the todo')
        }

        todos.value = JSON.parse(data.value).todos.map((todo: any) => ({
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
        await updateFirestoreDocument('goals', goalDetails.value.id, {
            start_date: start_date.value,
            milestones: milestones.value,
            todos: todos.value,
            started: true
        })
    } catch (e:any) {
        useAlert().openAlert({ type: 'ERROR', msg: e instanceof Error ? e.message : 'An unexpected error occurred, please try again' })
        throw new Error(e)
    }
}
