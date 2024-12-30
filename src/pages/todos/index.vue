<template>
	<!-- <div
		class="min-w-full h-full p-4 flex flex-col gap-5 items-start justify-start hide-scrollbar overflow-x-auto"
	>
		<div class="flex items-center gap-4 ">
			<CircleArrowLeft class="cursor-pointer" @click="() => navigateWeek('prev')" />
			<ColorBadge :name="weekLabel" class="text-lg flex-grow text-center" />
			<CircleArrowRight class="cursor-pointer" @click="() => navigateWeek('next')" />
		</div>
		<main v-if="!loading" class="kanban-columns gap-4">
			<PagesDashboardTodosColumn
				v-for="column in groupTodosByDate"
				:key="column.date"
				:date="column.date"
				:todo="column.tasks"
			/>
		</main>
	</div> -->

	<!-- {{ userTodos }} <br><br>

	{{ currentDayTodo }} -->

	<main class="p-4 flex flex-col gap-8">
		<div class="flex flex-col gap-1">
			<h3 class="text-textHeadline font-semibold text-2xl md:text-[28px]">
				Your To-do's
			</h3>
			<p class="text-base text-[#37363D]">
				Manage your todo
			</p>
		</div>

		<div class="w-full max-w-[720px] flex flex-col gap-8">
			<div class="flex flex-col gap-4">
				<div class="flex items-center gap-4 justify-between bg-[#F9F8FB] rounded-full p-[3px]">
					<button class="h-11 center bg-white border border-[#E9E9E9] px-4 shadow rounded-full" @click="getNextMonth(false)">
						<ChevronLeft :size="16" :stroke-width="2.5" />
					</button>
					<p class="text-lg text-[#1F1F1F] font-semibold">
						{{ current_day }} {{ current_month }} {{ current_year }}
					</p>
					<button class="h-11 center bg-white border border-[#E9E9E9] px-4 shadow rounded-full" @click="getNextMonth(true)">
						<ChevronRight :size="16" :stroke-width="2.5" />
					</button>
				</div>

				<div class="grid grid-cols-9 items-end gap-1">
					<button class="week_btn" :disabled="current_week <= 1" @click="displayAnotherWeek(false)">
						<ChevronLeft :size="14" :stroke-width="2.5" />
					</button>
					<div v-for="n,i in paginatedDays" :key="i" class="flex flex-col gap-2 items-center">
						<p class="text-[#798494] text-sm font-semibold">
							{{ capitalize(n?.day).substring(0,2) }}
						</p>
						<button class="border border-[#E9E9E9] rounded center h-10 p-2 w-full"
							:class="n?.date === current_day ? 'bg-[#8F61F2] text-light' : 'bg-[#F6F5FF] text-[#1F1F1F]'"
							@click="current_day = n?.date"
						>
							<span class="text-sm font-medium">
								{{ n?.date }}
							</span>
						</button>
					</div>
					<button class="week_btn" :disabled="current_week >= totalWeeksInSelectedMonth" @click="displayAnotherWeek(true)">
						<ChevronRight :size="14" :stroke-width="2.5" />
					</button>
				</div>
			</div>
			<Skeleton v-if="loading" height="200px" />
			<div v-else class="flex flex-col gap-2">
				<div class="flex flex-col gap-6 py-5 px-4 bg-[#F9F8FB] rounded-lg">
					<div class="flex flex-col gap-0.5">
						<p class="text-[#4D4D53] font-semibold text-lg">
							Today's task
						</p>
						<p class="text-sm font-medium text-[#908F93]">
							Here are your tasks for today
						</p>
					</div>

					<div class="bg-white p-4 shadow rounded-lg flex items-center gap-2 justify-between">
						<CirclePlus :size="16" class="text-[#4D4D53]" />
						<input type="text" class="flex-grow focus:outline-none" placeholder="Add a custom to do for the day">
						<button class="bg-[#F9F8FB] p-1.5 px-2.5 border border-[#E9E9E9] rounded-md">
							<ArrowRight :size="14" />
						</button>
					</div>

					<div class="px-2 flex flex-col gap-2">
						<ModulesTodosTaskCard v-for="n in currentDayTodo" :key="n?.id" :todo="n" />
					</div>
				</div>
				<div class="p-4 bg-[#F2F2F2] flex items-center gap-4 justify-between rounded-lg">
					<div class="flex items-center gap-3">
						<IconsCheck />
						<p class="text-[#4D4D53] text-lg font-semibold">
							Completed Tasks
						</p>
					</div>
					<button class="bg-white py-1 px-2 shadow rounded">
						<ChevronDown :size="14" />
					</button>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, CircleArrowLeft, CircleArrowRight, CirclePlus } from 'lucide-vue-next'
import { useFetchUserTodos } from '@/composables/dashboard/todo/fetch'
import { capitalize } from '@/composables/utils/formatter'
import { useTodoDate } from '@/composables/dashboard/todo/date_logic'

const { loading, groupTodosByDate, navigateWeek, weekLabel, userTodos } = useFetchUserTodos()
const { current_month, current_year, current_day, getCurrentMonthAndYear, getNextMonth, displayAnotherWeek, paginatedDays, current_week, totalWeeksInSelectedMonth } = useTodoDate()

const currentDayTodo = computed(() => {
	const x = userTodos.value?.filter((el) => {
		const current_date = new Date(`${current_day.value}/${current_month.value}/${current_year.value}`)
		const created_date = new Date(el?.date)
		return isSameDay(current_date, created_date)
	})
	return x
})

function isSameDay(date1:Date, date2:Date) {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	)
}

getCurrentMonthAndYear()
definePageMeta({
	layout: 'dashboard',
	middleware: [
		'is-authenticated'
	]
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
	@apply border border-[#E9E9E9] rounded center h-10 p-2 text-[#798494] disabled:cursor-not-allowed
}
</style>
