<template>
	<section>
		<section v-if="!goalDetails.started" class="center flex-col  gap-4">
			<CheckSquare :size="80" />
			<h1 class="text-xl font-bold mt-3">
				Start the goal to generate todos
			</h1>
			<p> Click the button below to start this Goal </p>
			<button class="btn-primary" @click="initStartGoal(goalDetails)">
				Start Goal
			</button>
		</section>

		<section v-if="todos.length > 0 && !loading" class="flex flex-col gap-2 rounded-lg bg-[#F9F8FB] p-2">
			<ModulesGoalsTodocard v-for="(todo, idx) in todos" :key="todo.title" :todo="todo" :idx="idx" />
		</section>


		<section v-if="todos.length === 0 && goalDetails.started && !loading" class="center flex-col  gap-4">
			<CheckSquare :size="80" />
			<h1 class="text-xl font-bold mt-3">
				No Todos have been created yet
			</h1>
			<p>
				This is weird, you should have some Todos by now. Contact support if you think this is an error
			</p>
		</section>
	</section>
</template>

<script setup>
import { CheckSquare } from 'lucide-vue-next'
import { useFetchUserTodosByGoalId } from '@/composables/dashboard/todo/fetch'
import { useFetchGoalsById } from '@/composables/dashboard/goals/id'
import { useStartGoal } from '@/composables/dashboard/goals/start'



const { initStartGoal } = useStartGoal()
const { goalDetails } = useFetchGoalsById()
const { fetchTodosByGoalId, todos, loading } = useFetchUserTodosByGoalId()

watch(goalDetails, async (value) => {
	if (value.id) {
		await fetchTodosByGoalId(value.id)
	}
})

</script>

<style lang="scss" scoped></style>
