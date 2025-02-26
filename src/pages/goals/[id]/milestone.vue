<template>
	<section>
		<section v-if="!goalDetails.started && milestones.length === 0" class="center flex-col  gap-4">
			<Milestone :size="80" />
			<h1 class="text-xl font-bold mt-3">
				Start the goal to generate milestones
			</h1>
			<p> Click the button below to start this Goal </p>
			<button class="btn-primary" @click="initStartGoal(goalDetails)">
				Start Goal
			</button>
		</section>

		<section v-if="milestones.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			<ModulesGoalsMilestoneCard v-for="(milestone, idx) in milestones" :key="idx" :milestone="milestone" :idx="idx" />
		</section>



		<section v-if="milestones.length === 0 && goalDetails.started" class="center flex-col  gap-4">
			<Milestone :size="80" />
			<h1 class="text-xl font-bold mt-3">
				No Milesstones have been created yet
			</h1>
			<p>
				This is weird, you should have some milestones by now. Contact support if you think this is an error
			</p>
		</section>
	</section>
</template>

<script setup>
import { Milestone } from 'lucide-vue-next'
import { useFetchGoalsById } from '@/composables/dashboard/goals/id'
import { useStartGoal } from '@/composables/dashboard/goals/start'
import { formatDateString } from '@/composables/utils/formatter'



const { initStartGoal } = useStartGoal()
const { goalDetails, milestones } = useFetchGoalsById()
</script>

<style lang="scss" scoped></style>
