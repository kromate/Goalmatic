<template>
	<section>
		<section v-if="!goalDetails.started" class="center flex-col  gap-4">
			<Milestone :size="80" />
			<h1 class="text-xl font-bold mt-3">
				Start the goal to generate milestones
			</h1>
			<p> Click the button below to start this Goal </p>
			<button class="btn-primary" @click="initStartGoal(goalDetails)">
				Start Goal
			</button>
		</section>



		<section v-if="milestones.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-x-4 gap-y-6 ">
			<div v-for="(milestone, idx) in milestones" :key="milestone.title" class="field h-full">
				<h4 class="pill text-base border-line bg-[#b8e3b8] mb-2.5">
					Milestone {{ idx + 1 }}:
				</h4>
				<div class="card_ans h-full justify-between flex flex-col gap-2">
					<h1 class="font-semibold  underline">
						{{ milestone.title }}
					</h1>
					<p class="mb-5">
						{{ milestone.description }}
					</p>
					<footer class=" italic mt-auto flex flex-col ">
						<span><b>Percentage Complete:</b> {{ milestone.percentage_complete }}%</span>
						<span><b>Estimated Due Date:</b> {{ formatDateString(milestone.estimated_due_date) }}</span>
					</footer>
				</div>
			</div>
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
