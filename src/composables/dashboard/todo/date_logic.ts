import { useFetchUserTodos, useFetchUserLaterTodos } from './fetch'

interface DayInfo {
    day: string
    date: number
}

const dateState = reactive({
    day: 1,
    date: new Date(),
    week: 1,
    month: '',
    year: 0,
    days: [] as DayInfo[]
})

export const useTodoDate = () => {
    const updateCurrentDay = () => {
        dateState.day = paginatedDays.value?.[0]?.date
    }

    const setMonthAndYear = (date: Date) => {
        dateState.month = date.toLocaleString('default', { month: 'long' })
        dateState.year = date.getFullYear()
    }

    const getTodos = (type: string | null = null) => {
        const { fetchMonthTodos } = useFetchUserTodos()
        const { fetchlaterTodos } = useFetchUserLaterTodos()

        // Fetch todos for the entire month instead of just the week
        fetchMonthTodos(dateState.month, dateState.year)

        if (!type) {
            fetchlaterTodos()
        }
    }

    const getNextMonth = (forward: boolean) => {
        dateState.week = 1
        const newDate = new Date(`${dateState.month} 1, ${dateState.year}`)
        newDate.setMonth(newDate.getMonth() + (forward ? 1 : -1))

        setMonthAndYear(newDate)
        dateState.date = newDate
        updateCurrentDay()

        getDaysInMonth(dateState.month, dateState.year)
        getTodos('MONTH') // This will only fetch if the month hasn't been fetched before
    }

    const getCurrentMonthAndYear = (type: string | null = null) => {
        const currentDate = new Date()
        setMonthAndYear(currentDate)

        dateState.day = currentDate.getDate()
        dateState.week = Math.ceil(dateState.day / 7)

        getDaysInMonth(dateState.month, dateState.year)
        getTodos(type) // This will only fetch if the month hasn't been fetched before
    }

    const getDaysInMonth = (month: string, year: number) => {
        const date = new Date(`${month} 1, ${year}`)
        const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate()

        dateState.days = Array.from({ length: daysInMonth }, (_, i) => {
            const currentDate = new Date(year, date.getMonth(), i + 1)
            return {
                day: currentDate.toLocaleString('default', { weekday: 'long' }).toLowerCase(),
                date: i + 1
            }
        })
    }

    const paginatedDays = computed(() => {
        const startIndex = (dateState.week - 1) * 7
        return dateState.days.slice(startIndex, startIndex + 7)
    })

    const totalWeeksInSelectedMonth = computed(() =>
        Math.ceil(dateState.days.length / 7)
    )

    const displayAnotherWeek = (forward: boolean) => {
        if (forward && dateState.week < totalWeeksInSelectedMonth.value) {
            dateState.week++
        } else if (!forward && dateState.week > 1) {
            dateState.week--
        }
        updateCurrentDay()
        // Note: We don't need to fetch todos here anymore as we already have the month's data
        // The TodoView will automatically filter the todos for the selected day
    }
    const isSameDay = (date1: Date, date2: Date) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        )
    }

    const isToday = computed(() => {
        const today = new Date()
        return isSameDay(today, new Date(`${dateState.day}/${dateState.month}/${dateState.year}`))
    })

    const goToToday = () => {
	getCurrentMonthAndYear('TODAY')
	const today = new Date()
	dateState.day = today.getDate()
    }

    return {
        dateState, isSameDay, isToday,
        getNextMonth, goToToday,
        getCurrentMonthAndYear,
        getDaysInMonth,
        paginatedDays,
        totalWeeksInSelectedMonth,
        displayAnotherWeek
    }
}
