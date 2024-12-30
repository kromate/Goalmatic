<template>
	<section class="border rounded-lg border-[#E4E7EC] p-4 flex flex-col gap-4">
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
			<ModulesGoalsStepCard v-for="(step, idx) in goalDetails.steps" :key="idx" :step="step" :idx="idx" />
		</div>
	</section>
</template>

<script setup>
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
