import { getFirestoreCollectionWithWhereQuery } from '@/firebase/firestore/query'
import { useAlert } from '@/composables/core/notification'
import { useUser } from '@/composables/auth/user'




export const fetchAllUserActiveTodos = () => {
    const { id: user_id } = useUser()
    const usersActiveGoal = ref([] as any)

    const usersActiveTodo = computed(() => usersActiveGoal.value.map((goal: any) => goal.todos))
    const loading = ref(false)

    const fetchUsersTodos = async () => {
        loading.value = true

        try {
            await getFirestoreCollectionWithWhereQuery('goals', usersActiveGoal, { name: 'user_id', operator: '==', value: user_id.value }, { name: 'started', operator: '==', value: true })

            loading.value = false
        } catch (e: any) {
            loading.value = false
            useAlert().openAlert({ type: 'ERROR', msg: `Error: ${e.message}` })
        }
    }


    const groupTodosByDate = computed(() => {
        const groupedTasks = {} as Record<string, any>
        const activeTodo = usersActiveGoal.value.map((goal: any) => goal.todos).flat()

        // Generate dates for the next 7 days starting from today
        const today = new Date()
        const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today)
            date.setDate(today.getDate() + i)
            return date.toISOString().split('T')[0]
        })

        // Initialize groupedTasks with empty arrays for each day of the week
        nextSevenDays.forEach((date) => {
            groupedTasks[date] = { date, tasks: [] }
        })

        // Add todos to their respective dates
        activeTodo.forEach((todo) => {
            const date = new Date(todo.date).toISOString().split('T')[0]
            if (groupedTasks[date]) {
                groupedTasks[date].tasks.push(todo)
            }
        })

        return Object.values(groupedTasks)
    })



    return { fetchUsersTodos, usersActiveTodo, loading, groupTodosByDate }
}
