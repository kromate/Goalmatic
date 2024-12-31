import { useFetchUserTodos } from './fetch'

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

    const getTodos = () => {
        const { fetchTodos } = useFetchUserTodos()
        fetchTodos(paginatedDays.value, dateState.month, dateState.year)
    }

    const getNextMonth = (forward: boolean) => {
        dateState.week = 1
        const newDate = new Date(`${dateState.month} 1, ${dateState.year}`)
        newDate.setMonth(newDate.getMonth() + (forward ? 1 : -1))

        setMonthAndYear(newDate)
        dateState.date = newDate
        updateCurrentDay()

        getDaysInMonth(dateState.month, dateState.year)
        getTodos()
    }

    const getCurrentMonthAndYear = () => {
        const currentDate = new Date()
        setMonthAndYear(currentDate)

        dateState.day = currentDate.getDate()
        dateState.week = Math.ceil(dateState.day / 7)

        getDaysInMonth(dateState.month, dateState.year)
        getTodos()
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
        getTodos()
    }

    return {
        ...toRefs(dateState),
        getNextMonth,
        getCurrentMonthAndYear,
        getDaysInMonth,
        paginatedDays,
        totalWeeksInSelectedMonth,
        displayAnotherWeek
    }
}
