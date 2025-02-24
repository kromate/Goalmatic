<template>
	<div class="bg-[#F7F7F7] rounded-md p-4 flex flex-col gap-3">
		<p class="bg-white text-xs text-headline px-2 py-0.5 rounded-md font-medium w-fit">
			Milestones {{ idx + 1 }}
		</p>
		<div class="flex flex-col gap-1.5">
			<h3 class="text-base font-bold text-headline">
				{{ milestone.title }}
			</h3>
			<p class="text-xs text-[#4D4D53]">
				{{ milestone.description }}
			</p>
		</div>

		<div class="flex flex-col gap-1.5">
			<p class="flex items-center gap-3 text-[#37363D] text-xs font-semibold">
				<IconsProgressBar />
				<span>Percentage Complete: {{ milestone.percentage_complete }}%</span>
			</p>
			<p class="flex items-center gap-3 text-[#37363D] text-xs font-semibold">
				<CalendarCheck :size="14" />
				<span>Due: {{ formatDateString(milestone.estimated_due_date) }}</span>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { CalendarCheck, Clock } from 'lucide-vue-next'
import { formatDateString } from '@/composables/utils/formatter'
const props = defineProps({
	milestone: {
		type: Object,
		required: true
	},
	idx: {
		type: Number,
		required: true
	}
})
</script>
