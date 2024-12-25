<template>
	<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-x-4 gap-y-6 ">
		<div v-for="(step, idx) in goalDetails.steps" :key="step.title" class="field h-full">
			<h4 class="pill text-base border-line bg-[#b8e3b8] mb-2.5">
				Steps {{ idx + 1 }}:
			</h4>
			<div class="card_ans h-full justify-between flex flex-col gap-2">
				<h1 class="font-semibold  underline">
					{{ step.title }}
				</h1>
				<p class="mb-5">
					{{ step.description }}
				</p>
				<footer class="italic mt-auto flex flex-col ">
					<span><b>Frequency:</b> {{ transformString(step.frequency) }}</span>
					<span><b>Frequency Count:</b> {{ step.frequency_count }}</span>
					<span><b>Estimated Duration:</b> {{ step.estimated_duration }}</span>
				</footer>
			</div>
		</div>
	</section>
</template>

<script setup>
import { transformString } from '@/composables/utils/formatter'
import { useFetchGoalsById } from '@/composables/dashboard/goals/id'

const { goalDetails } = useFetchGoalsById()
</script>

<style lang="scss" scoped>
    .card_ans {
        @apply p-4 border border-line w-full rounded-md;
    }

    .card_ans_sm {
        @apply px-2 py-1.5 border border-line w-auto rounded-md;
    }
</style>
