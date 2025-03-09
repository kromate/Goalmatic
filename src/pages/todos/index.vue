<template>
	<main class="p-6 flex flex-col gap-8">
		<div class="flex flex-col gap-1">
			<h3 class="text-headline font-semibold text-2xl md:text-[28px]">
				Your To-do's
			</h3>
			<p class="text-base text-[#37363D]">
				Manage your todo
			</p>
		</div>

		<div class="flex flex-col lg:flex-row gap-6">
			<!-- Todo View Column -->
			<div class="w-full lg:w-1/2">
				<ModulesTodosTodoView
					v-model:day="day"
					:month="month"
					:year="year"
					:week="week"
					:paginated-days="paginatedDays"
					:total-weeks-in-selected-month="totalWeeksInSelectedMonth"
					:loading="loading"
					:today-tasks="todayTasks"
					:completed-tasks="completedTasks"
					:later-tasks="laterTasks"
					:is-today="isToday"
					@get-next-month="getNextMonth"
					@display-another-week="displayAnotherWeek"
					@go-to-today="goToToday"
					@create-new-todo="handleCreateNewTodo"
					@drag-start="onDragStart"
					@drop-today="onDropToday"
					@drop-later="onDropLater"
				/>
			</div>

			<!-- Calendar Column -->
			<div class="w-full lg:w-1/2  md:h-[calc(100vh-190px)]">
				<ModulesTodosCalendarView
					:month="Number(month)"
					:year="year"
					:todos="userTodos"
					:loading="loading"
					@date-selected="handleDateSelected"
					@drop-on-date="handleDropOnCalendar"
				/>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
import { useFetchUserTodos } from '@/composables/dashboard/todo/fetch'
import type { Todo } from '@/types/todo'
import { useTodoDate } from '@/composables/dashboard/todo/date_logic'
import { useCreateTodo } from '@/composables/dashboard/todo/create'
import { useEditTodo } from '@/composables/dashboard/todo/edit'

const title = ref('')
const { createTodo, createBoardForm } = useCreateTodo()
const { loading, groupTodosByDate, userTodos } = useFetchUserTodos()
const { onDragStart, onDropToday, onDropLater, updateTodoDate } = useEditTodo()

// Destructure the date logic composable
const {
	day,
	month,
	year,
	week,
	getNextMonth,
	getCurrentMonthAndYear,
	displayAnotherWeek,
	paginatedDays,
	totalWeeksInSelectedMonth
} = useTodoDate()

const currentDayTodo = computed(() => {
	return userTodos.value?.filter((el) => {
		const current_date = new Date(`${day.value}/${month.value}/${year.value}`)
		const created_date = new Date(el?.date)
		return isSameDay(current_date, created_date)
	})
})

// Filter for today's tasks (not completed and not marked as "later")
const todayTasks = computed(() => {
	return currentDayTodo.value?.filter((todo) => !todo.completed && !todo.later) as Todo[]
})

// Filter for completed tasks
const completedTasks = computed(() => {
	return currentDayTodo.value?.filter((todo) => todo.completed) as Todo[]
})

// Filter for "later" tasks
const laterTasks = computed(() => {
	return currentDayTodo.value?.filter((todo) => todo.later) as Todo[]
})

function isSameDay(date1: Date, date2: Date) {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	)
}

const handleCreateNewTodo = async (todoTitle: string) => {
	const current_date = new Date(`${day.value}/${month.value}/${year.value}`)
	createBoardForm.date = current_date.toISOString()
	createBoardForm.title = todoTitle
	createBoardForm.later = false
	await createTodo()
	createBoardForm.date = ''
}

const isToday = computed(() => {
	const today = new Date()
	return isSameDay(today, new Date(`${day.value}/${month.value}/${year.value}`))
})

const goToToday = () => {
	getCurrentMonthAndYear()
	const today = new Date()
	day.value = today.getDate()
}

// Calendar functionality
const handleDateSelected = (selectedDate: { day: number, month: number, year: number }) => {
	day.value = selectedDate.day
	month.value = selectedDate.month.toString()
	year.value = selectedDate.year
}

const handleDropOnCalendar = async (todo: Todo, targetDate: { day: number, month: number, year: number }) => {
	const newDate = new Date(targetDate.year, targetDate.month - 1, targetDate.day)
	await updateTodoDate(todo, newDate.toISOString())
}

// Initialize
getCurrentMonthAndYear()

definePageMeta({
	layout: 'dashboard',
	middleware: ['is-authenticated']
})
</script>

<style scoped>
.kanban-columns {
	@apply flex overflow-x-auto items-start;
}

.kanban-columns::-webkit-scrollbar {
	display: none;
}
</style>
