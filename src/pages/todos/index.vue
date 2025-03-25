<template>
	<main class="p-6 flex flex-col gap-8 h-full">
		<div class="flex flex-col gap-1">
			<h3 class="text-headline font-semibold text-2xl md:text-[28px]">
				Your To-do's
			</h3>
			<p class="text-base text-[#37363D]">
				Manage your todo
			</p>
		</div>

		<div class="flex flex-col lg:flex-row gap-6 h-full">
			<!-- Todo View Column -->
			<div class="w-full lg:w-1/2">
				<ModulesTodosTodoView
					v-model:day="dateState.day"
					:month="dateState.month"
					:year="dateState.year"
					:week="dateState.week"
					:paginated-days="paginatedDays"
					:total-weeks-in-selected-month="totalWeeksInSelectedMonth"
					:loading="loading"
					:today-tasks="todayTasks"
					:completed-tasks="completedTasks"
					:later-tasks="laterTodos"
					:is-today="isToday"
					@get-next-month="getNextMonth"
					@display-another-week="displayAnotherWeek"
					@go-to-today="goToToday"
					@create-new-todo="createTodo"
					@drag-start="onDragStart"
					@drop-today="onDropToday"
					@drop-later="onDropLater"
				/>
			</div>

			<!-- Calendar Column -->
			<div class="w-full lg:w-1/2  ">
				<ModulesTodosCalendarView
					:month="Number(dateState.month)"
					:year="dateState.year"
					:loading="loading"
				/>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
import { useFetchUserTodos, useFetchUserLaterTodos } from '@/composables/dashboard/todo/fetch'
import type { Todo } from '@/types/todo'
import { useTodoDate } from '@/composables/dashboard/todo/date_logic'
import { useCreateTodo } from '@/composables/dashboard/todo/create'
import { useEditTodo } from '@/composables/dashboard/todo/edit'


const { createTodo } = useCreateTodo()
const { loading, todayTasks, completedTasks } = useFetchUserTodos()
const { laterTodos, fetchlaterTodos, loading: laterTodosLoading } = useFetchUserLaterTodos()
const { onDragStart, onDropToday, onDropLater } = useEditTodo()

const { dateState, isToday, goToToday, getNextMonth, getCurrentMonthAndYear, displayAnotherWeek, paginatedDays, totalWeeksInSelectedMonth } = useTodoDate()


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
