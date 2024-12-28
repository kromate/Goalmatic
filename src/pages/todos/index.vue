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
						{{ current_month }} {{ current_year }}
					</p>
					<button class="h-11 center bg-white border border-[#E9E9E9] px-4 shadow rounded-full" @click="getNextMonth(true)">
						<ChevronRight :size="16" :stroke-width="2.5" />
					</button>
				</div>

				<div class="grid grid-cols-9 items-end gap-1">
					<button class="border border-[#E9E9E9] rounded center h-10 p-2 text-[#798494]" @click="displayAnotherWeek(false)">
						<ChevronLeft :size="14" :stroke-width="2.5" />
					</button>
					<div v-for="n,i in paginatedDays" :key="i" class="flex flex-col gap-2 items-center">
						<p class="text-[#798494] text-sm font-semibold">
							{{ capitalize(n?.day).substring(0,2) }}
						</p>
						<button class="border border-[#E9E9E9] bg-[#F6F5FF] rounded center h-10 p-2 text-[#798494] w-full">
							<span class="text-[#1F1F1F] text-sm font-medium">
								{{ n?.date }}
							</span>
						</button>
					</div>
					<button class="border border-[#E9E9E9] rounded center h-10 p-2 text-[#798494]" @click="displayAnotherWeek(true)">
						<ChevronRight :size="14" :stroke-width="2.5" />
					</button>
				</div>
			</div>

			<div class="flex flex-col gap-2">
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
						<ModulesTodosTaskCard v-for="n in 4" :key="n" />
					</div>
				</div>
				<div class="p-4 bg-[#F2F2F2] flex items-center gap-4 justify-between rounded-lg">
					<div class="flex items-center gap-3">
						<IconsCheck />
						<p class="text-[#4D4D53] text-lg font-semibold">Completed Tasks</p>
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
import { usePageHeader } from '@/composables/utils/header'
import { useFetchUserTodos } from '@/composables/dashboard/todo/fetch'
import { capitalize } from '@/composables/utils/formatter'
import { useTodoDate } from '@/composables/dashboard/todo/date_logic'
// import { useUser } from '~/src/composables/auth/user'
// const { fetchUsersTodos, loading, groupTodosByDate, navigateWeek, weekLabel } = useFetchUserTodos()

// await fetchUsersTodos()
// const { user } = useUser()
const { current_month, current_year, getCurrentMonthAndYear, getNextMonth, displayAnotherWeek, paginatedDays } = useTodoDate()



getCurrentMonthAndYear()
definePageMeta({
	layout: 'dashboard',
	middleware: [
		'is-authenticated',
		() => {
			usePageHeader().setPageHeader({
				title: 'Todos',
				description: 'Manage your todos here',
				shouldShowFab: false,
				shouldShowTab: false
			})
		}
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
</style>
