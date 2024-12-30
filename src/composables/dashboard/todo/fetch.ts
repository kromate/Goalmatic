import { getFirestoreCollectionWithWhereQuery, getFirestoreSubCollectionWithWhereQuery } from '@/firebase/firestore/query'
import { getFirestoreSubCollection } from '@/firebase/firestore/fetch'
import { useAlert } from '@/composables/core/notification'
import { useUser } from '@/composables/auth/user'




export const useFetchUserTodos = () => {
    const { id: user_id } = useUser()

    const userTodos = ref([] as any)

    const loading = ref(false)

    const currentWeekOffset = ref(0)

    const fetchedWeeks = ref(new Set<number>())

    const fetchUsersTodos = async () => {
        // Skip if we've already fetched this week
        if (fetchedWeeks.value.has(currentWeekOffset.value)) {
            return
        }

        // Get start of current week (Sunday) with offset
        const today = new Date()
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay() + (currentWeekOffset.value * 7))
        startOfWeek.setHours(0, 0, 0, 0)

        // Get end of week (Saturday) at end of day
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        endOfWeek.setHours(23, 59, 59, 999)

        await getFirestoreSubCollectionWithWhereQuery(
            'users',
            user_id.value!,
            'todos',
            userTodos,
            {
                name: 'date',
                operator: '>=',
                value: startOfWeek.toISOString()
            },
            {
                name: 'date',
                operator: '<=',
                value: endOfWeek.toISOString()
            }
        )

        // Mark this week as fetched
        fetchedWeeks.value.add(currentWeekOffset.value)
    }

    const navigateWeek = (direction: 'prev' | 'next') => {
        currentWeekOffset.value += direction === 'next' ? 1 : -1
        fetchUsersTodos()
    }

    const weekLabel = computed(() => {
        const today = new Date()
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay() + (currentWeekOffset.value * 7))

        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)

        const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`
    })

    const groupTodosByDate = computed(() => {
        const groupedTasks = {} as Record<string, any>
        const allTodos = [...userTodos.value]

        // Generate dates for the week starting from Sunday with offset
        const today = new Date()
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay() + (currentWeekOffset.value * 7))

        const weekDays = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek.getTime())
            date.setDate(startOfWeek.getDate() + i)
            return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
        })

        // Initialize groupedTasks with empty arrays for each day of the week
        weekDays.forEach((date) => {
            groupedTasks[date] = { date, tasks: [] }
        })

        // Add all todos to their respective dates
        allTodos.forEach((todo) => {
            const date = new Date(todo.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
            if (groupedTasks[date]) {
                groupedTasks[date].tasks.push(todo)
                // Sort tasks array: uncompleted first, then completed
                groupedTasks[date].tasks.sort((a: any, b: any) => {
                    if (a.completed === b.completed) return 0
                    return a.completed ? 1 : -1
                })
            }
        })

        return Object.values(groupedTasks)
    })

    return { loading, groupTodosByDate, fetchUsersTodos, navigateWeek, weekLabel, currentWeekOffset, fetchedWeeks }
}


export const useFetchUserTodosByGoalId = () => {
    const loading = ref(false)
    const { id: user_id } = useUser()
    const todos = ref([])

    const fetchTodosByGoalId = async (goal_id: string) => {
        loading.value = true
        await getFirestoreSubCollectionWithWhereQuery('users', user_id.value!, 'todos', todos, { name: 'goal_id', operator: '==', value: goal_id })
        loading.value = false
    }

    return { fetchTodosByGoalId, todos, loading }
}
