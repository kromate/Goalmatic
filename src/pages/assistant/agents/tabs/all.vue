<template>
	<div v-if="loading" class="flex justify-center items-center min-h-[200px]">
		<Skeleton />
	</div>



	<div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		<div v-for="agent in [defaultGoalmaticAgent, ...agents]" :key="agent.id" class="flex flex-col card" @click="$router.push(`/assistant/agents/${agent.id}`)">
			<img src="/bot.png" alt="agent">
			<h2 class="text-sm font-semibold text-headline mt-4 mb-2">
				{{ agent.name }}
			</h2>
			<p class="text-xs text-subText">
				{{ agent.description }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useFetchAgents } from '@/composables/dashboard/assistant/agents/fetch'


const { loading, fetchedAllAgents, fetchAllAgents, defaultGoalmaticAgent } = useFetchAgents()
const agents = fetchedAllAgents

onMounted(() => {
	fetchAllAgents()
})
</script>

<style scoped lang="scss">
.card{
	@apply bg-[#FCFAFF] border border-[#EFE8FD] rounded-lg py-4 px-3.5 cursor-pointer;
	img{
		@apply size-8 border border-[#EFE8FD] rounded-md;
	}
}
</style>
