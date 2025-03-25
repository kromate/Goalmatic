import { useTodoDate } from './date_logic'
import { getFirestoreSubCollectionWithWhereQuery } from '@/firebase/firestore/query'
import { useUser } from '@/composables/auth/user'
import type { Todo } from '@/types/todo'


const userTodos = ref([] as Todo[])
const laterTodos = ref([] as Todo[])
const loading = ref(false)

// Track fetched months to avoid redundant calls
const fetchedMonths = ref(new Set<string>())


export const useFetchUserTodos = () => {
    const { dateState, isSameDay } = useTodoDate()
    const { id: user_id } = useUser()
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
            'users', user_id.value!, 'todos', userTodos,
            { name: 'date', operator: '>=', value: startOfWeek.toISOString() },
            { name: 'date', operator: '<=', value: endOfWeek.toISOString() }
        )

        // Mark this week as fetched
        fetchedWeeks.value.add(currentWeekOffset.value)
    }

    const fetchMonthTodos = async (month: string, year: number) => {
        // Create a unique key for this month/year combination
        const monthKey = `${month}-${year}`

        // Skip if we've already fetched this month
        if (fetchedMonths.value.has(monthKey)) {
            return
        }

        loading.value = true
        // userTodos.value = [] // Clear existing todos

        // Calculate start and end of month
        const monthIndex = new Date(`${month} 1, ${year}`).getMonth()
        const startOfMonth = new Date(year, monthIndex, 1)
        startOfMonth.setHours(0, 0, 0, 0)

        const endOfMonth = new Date(year, monthIndex + 1, 0)
        endOfMonth.setHours(23, 59, 59, 999)

        try {
            await getFirestoreSubCollectionWithWhereQuery(
                'users',
                user_id.value!,
                'todos',
                userTodos,
                { name: 'date', operator: '>=', value: startOfMonth.toISOString() },
                { name: 'date', operator: '<=', value: endOfMonth.toISOString() }
            )

            // Mark this month as fetched
            fetchedMonths.value.add(monthKey)
            console.log(`Fetched todos for ${monthKey}`)
        } catch (error) {
            console.error(`Error fetching todos for ${monthKey}:`, error)
        } finally {
            loading.value = false
        }
    }

    // Legacy function kept for backward compatibility
    const fetchTodos = async (paginatedDays: Record<string, any>[], current_month: string, current_year: number) => {
        // This now just delegates to the optimized version
        await fetchMonthTodos(current_month, current_year)
    }

    const currentDayTodo = computed(() => {
        return userTodos.value?.filter((el) => {
            const current_date = new Date(`${dateState.day}/${dateState.month}/${dateState.year}`)
            const created_date = new Date(el?.date)
            return isSameDay(current_date, created_date)
        })
    })

    const todayTasks = computed(() => {
        return currentDayTodo.value?.filter((todo) => !todo.completed && !todo.later) as Todo[]
    })

    // Filter for completed tasks
    const completedTasks = computed(() => {
        return currentDayTodo.value?.filter((todo) => todo.completed) as Todo[]
    })

    return {
        loading,
        todayTasks,
        completedTasks,
        fetchUsersTodos,
        currentWeekOffset,
        fetchedWeeks,
        userTodos,
        fetchTodos,
        fetchMonthTodos,
        fetchedMonths
    }
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

export const useFetchUserLaterTodos = () => {
    const loading = ref(false)
    const { id: user_id } = useUser()


    const fetchlaterTodos = async () => {
        loading.value = true
        try {
            await getFirestoreSubCollectionWithWhereQuery(
                'users',
                user_id.value!,
                'todos',
                laterTodos,
                { name: 'later', operator: '==', value: true }
            )
        } catch (error: any) {
            console.error('Error fetching later tasks:', error)
        } finally {
            loading.value = false
        }
    }

    return { fetchlaterTodos, laterTodos, loading }
}
