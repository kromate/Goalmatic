<template>
	<div class="bg-[#F7F7F7] rounded-md p-4 flex flex-col gap-3">
		<h3 class="text-base font-bold text-textHeadline">
			{{ idx + 1 }}. {{ step.title }}
		</h3>
		<div class="flex items-center gap-3 flex-wrap">
			<p class="text-xs font-semibold text-[#37363D] center gap-1.5 w-fit">
				<Clock :size="14" />
				<span>{{ step.estimated_duration }}</span>
			</p>
			<p class="text-xs font-semibold text-[#37363D] center gap-1.5 w-fit">
				<CalendarCheck :size="14" />
				<span>{{ transformString(step.frequency) }}</span>
			</p>
			<p class="text-xs font-semibold text-[#37363D] center gap-1.5 w-fit">
				<IconsSignal />
				<span>{{ numberToString(step.frequency_count) }}</span>
			</p>
		</div>
		<p class="text-xs text-[#4D4D53]">
			{{ step.description }}
		</p>
	</div>
</template>


<script setup lang="ts">
import { CalendarCheck, Clock } from 'lucide-vue-next'
import { transformString, numberToString } from '@/composables/utils/formatter'

const props = defineProps({
	step: {
		type: Object,
		required: true
	},
	idx: {
		type: Number,
		required: true
	}
})
</script>
