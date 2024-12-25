<template>
	<div
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
	</div>
</template>

<script setup lang="ts">
import { CircleArrowLeft, CircleArrowRight } from 'lucide-vue-next'
import { usePageHeader } from '@/composables/utils/header'
import { useFetchUserTodos } from '@/composables/dashboard/todo/fetch'
const { fetchUsersTodos, loading, groupTodosByDate, navigateWeek, weekLabel } = useFetchUserTodos()

await fetchUsersTodos()

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
