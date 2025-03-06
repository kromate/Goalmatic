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

		<div class="w-full  flex flex-col gap-8">
			<div class="flex flex-col gap-4">
				<div class="flex items-center gap-4 justify-between bg-[#F9F8FB] rounded-full p-[3px]">
					<button class="h-11 center bg-white border border-[#E9E9E9] px-4 shadow rounded-full" @click="getNextMonth(false)">
						<ChevronLeft :size="16" :stroke-width="2.5" />
					</button>
					<div class="flex items-center gap-2">
						<p class="text-lg text-[#1F1F1F] font-semibold">
							{{ day }} {{ month }} {{ year }}
						</p>
						<button
							class="h-8 center bg-[#8F61F2] text-white border border-[#E9E9E9] px-3 shadow rounded-full text-sm"
							@click="goToToday"
						>
							Today
						</button>
					</div>
					<button class="h-11 center bg-white border border-[#E9E9E9] px-4 shadow rounded-full" @click="getNextMonth(true)">
						<ChevronRight :size="16" :stroke-width="2.5" />
					</button>
				</div>

				<div class="grid grid-cols-9 items-end gap-1">
					<button class="week_btn center" :disabled="week <= 1" @click="displayAnotherWeek(false)">
						<ChevronLeft :size="14" :stroke-width="2.5" />
					</button>
					<div v-for="(dayInfo, i) in paginatedDays" :key="i" class="flex flex-col gap-2 items-center">
						<p class="text-[#798494] text-sm font-semibold">
							{{ capitalize(dayInfo?.day).substring(0,2) }}
						</p>
						<button class="border border-[#E9E9E9] rounded center h-10 p-2 w-full"
							:class="dayInfo?.date === day ? 'bg-[#8F61F2] text-light' : 'bg-[#F6F5FF] text-[#1F1F1F]'"
							@click="day = dayInfo?.date"
						>
							<span class="text-sm font-medium">
								{{ dayInfo?.date }}
							</span>
						</button>
					</div>
					<button class="week_btn center" :disabled="week >= totalWeeksInSelectedMonth" @click="displayAnotherWeek(true)">
						<ChevronRight :size="14" :stroke-width="2.5" />
					</button>
				</div>
			</div>
			<Skeleton v-if="loading" height="200px" radius="10px" class="border-0" />
			<div v-else class="flex flex-col gap-2">
				<div class="flex flex-col gap-6 py-5 px-4 bg-[#F9F8FB] rounded-lg">
					<div class="flex flex-col gap-0.5">
						<p class="text-[#4D4D53] font-semibold text-lg">
							{{ isToday ? "Today's task" : `${day} ${month}'s task` }}
						</p>
						<p class="text-sm font-medium text-[#908F93]">
							{{ isToday ? 'Here are your tasks for today' : `Here are your tasks for ${day} ${month}` }}
						</p>
					</div>

					<div class="relative flex items-center gap-2">
						<input
							v-model.trim="title"
							type="text"
							class="input-field "
							placeholder="Add a custom to do for the day"
							@keyup.enter="title.length && createNewTodo()"
						>
						<button class="btn-primary !px-2.5 !py-2 absolute right-4" :disabled="!title?.length" @click="createNewTodo">
							<ArrowRight :size="14" />
						</button>
					</div>

					<div
						class=" flex flex-col gap-2 min-h-[100px]"
						@dragover.prevent
						@drop="onDropToday"
					>
						<template v-for="todo in todayTasks" :key="todo?.id">
							<ModulesTodosTaskCard
								:todo="todo"
								:draggable="true"
								@dragstart="onDragStart($event, todo)"
							/>
						</template>
						<div v-if="completedTasks.length > 0" class="mt-4 pt-4 border-t border-dashed border-gray-200">
							<p class="text-sm text-[#908F93] mb-2">
								Completed
							</p>
							<template v-for="todo in completedTasks" :key="todo?.id">
								<ModulesTodosTaskCard
									:todo="todo"
									:draggable="true"
									@dragstart="onDragStart($event, todo)"
								/>
							</template>
						</div>
					</div>
				</div>
				<div class="p-4 bg-[#F2F2F2] flex flex-col gap-4 rounded-lg">
					<div class="flex items-center gap-4 justify-between">
						<div class="flex items-center gap-3">
							<ClockIcon :size="18" class="text-[#4D4D53]" />
							<p class="text-[#4D4D53] text-lg font-semibold">
								Later
							</p>
						</div>
						<button class="bg-white py-1 px-2 shadow rounded">
							<ChevronDown :size="14" />
						</button>
					</div>

					<div
						class="px-2 flex flex-col gap-2 min-h-[100px]"
						@dragover.prevent
						@drop="onDropLater"
					>
						<template v-for="todo in laterTasks" :key="todo?.id">
							<ModulesTodosTaskCard
								:todo="todo"
								:draggable="true"
								@dragstart="onDragStart($event, todo)"
							/>
						</template>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, CircleArrowLeft, CircleArrowRight, CirclePlus, Clock as ClockIcon } from 'lucide-vue-next'
import { useFetchUserTodos } from '@/composables/dashboard/todo/fetch'
import { capitalize } from '@/composables/utils/formatter'
import { useTodoDate } from '@/composables/dashboard/todo/date_logic'
import { useCreateTodo } from '@/composables/dashboard/todo/create'
import { useEditTodo } from '@/composables/dashboard/todo/edit'

const title = ref('')
const { createTodo, createBoardForm } = useCreateTodo()
const { loading, groupTodosByDate, userTodos } = useFetchUserTodos()
const { onDragStart, onDropToday, onDropLater } = useEditTodo()


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
	return currentDayTodo.value?.filter((todo) => !todo.completed && !todo.later)
})

// Filter for completed tasks
const completedTasks = computed(() => {
	return currentDayTodo.value?.filter((todo) => todo.completed)
})

// Filter for "later" tasks
const laterTasks = computed(() => {
	return currentDayTodo.value?.filter((todo) => todo.later)
})

function isSameDay(date1: Date, date2: Date) {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	)
}

const createNewTodo = async () => {
	const current_date = new Date(`${day.value}/${month.value}/${year.value}`)
	createBoardForm.date = current_date.toISOString()
	createBoardForm.title = title.value
	createBoardForm.later = false
	await createTodo()
	createBoardForm.date = ''
	title.value = ''
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

.week_btn {
	@apply border border-[#E9E9E9] rounded  h-10 p-2 text-[#798494] disabled:cursor-not-allowed
}
</style>
