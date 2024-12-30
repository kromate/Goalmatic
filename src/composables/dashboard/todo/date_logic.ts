import { useFetchUserTodos } from './fetch'

const current_week = ref(1)
const current_month = ref('')
const current_year = ref(0)
const days_arr = ref([] as Record<string, any>[])

export const useTodoDate = () => {
    const getTodos = () => {
        const { fetchTodos } = useFetchUserTodos()
        fetchTodos(paginatedDays.value, current_month.value, current_year.value)
    }
    function getNextMonth(forward:boolean) {
        current_week.value = 1
        const currentDate = new Date(`${current_month.value} 1, ${current_year.value}`)
        if (forward) {
            currentDate.setMonth(currentDate.getMonth() + 1)
        } else {
            currentDate.setMonth(currentDate.getMonth() - 1)
        }
        current_month.value = currentDate.toLocaleString('default', { month: 'long' })
        current_year.value = currentDate.getFullYear()
        getDaysInMonth(current_month.value, current_year.value)
        getTodos()
    }

    function getCurrentMonthAndYear() {
        const currentDate = new Date()
        current_month.value = currentDate.toLocaleString('default', { month: 'long' })
        current_year.value = currentDate.getFullYear()
        const todays_date = currentDate.getDate()
        current_week.value = Math.ceil(todays_date / 7)
        getDaysInMonth(current_month.value, current_year.value)
        getTodos()
    }

    function getDaysInMonth(month:string, year:number) {
        days_arr.value = []
        const date = new Date(`${month} 1, ${year}`)
        const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate() // Get number of days in the month
        const daysArray:Record<string, any>[] = []

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, date.getMonth(), day)
            const dayName = currentDate.toLocaleString('default', { weekday: 'long' })
            daysArray.push({ day: dayName.toLowerCase(), date: day })
        }

        // return daysArray
        days_arr.value = daysArray
    }

    const paginatedDays = computed(() => {
        const startIndex = (current_week.value - 1) * 7
        const endIndex = startIndex + 7
        return days_arr.value.slice(startIndex, endIndex)
    })

    const totalWeeksInSelectedMonth = computed(() => {
        return Math.ceil(days_arr.value?.length / 7)
    })

    const displayAnotherWeek = (forward:boolean) => {
        if (forward === true) {
            if (current_week.value < totalWeeksInSelectedMonth.value) current_week.value++
        } else if (forward === false) {
            if (current_week.value > 1) current_week.value--
        }
        getTodos()
    }

    return { current_month, current_year, current_week, days_arr, getNextMonth, getCurrentMonthAndYear, getDaysInMonth, paginatedDays, totalWeeksInSelectedMonth, displayAnotherWeek }
}
