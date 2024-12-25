



export const useWeekDates = () => {
    const currentDate = ref(new Date())

  const getWeekDates = (date: Date): string[] => {
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1)
    const weekStart = new Date(date.setDate(diff))

    return Array(7).fill(null).map((_, i) => {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      return date.toISOString().split('T')[0]
    })
  }

  const weekDates = computed(() => getWeekDates(currentDate.value))

  const nextWeek = () => {
    currentDate.value = new Date(currentDate.value.setDate(currentDate.value.getDate() + 7))
  }

  const previousWeek = () => {
    currentDate.value = new Date(currentDate.value.setDate(currentDate.value.getDate() - 7))
  }

  return { weekDates, nextWeek, previousWeek }
}
