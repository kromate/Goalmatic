<template>
	<div class="bg-white shadow rounded-lg p-4 flex flex-col gap-2">
		<p class="bg-[#F4F3FF] text-xs text-[#8F61F2] px-2 py-0.5 rounded-md font-medium w-fit">
			{{ todo.is_reccuring ? 'Recurring' : 'One-time' }}
		</p>

		<div class="flex flex-col md:flex-row md:items-center  md:justify-between gap-y-7 gap-x-5">
			<div class="flex flex-col gap-1">
				<h3 class="text-lg font-semibold text-[#4D4D53]">
					{{ todo.title }}
				</h3>
				<p class="text-sm font-medium text-[#908F93]">
					{{ todo.description }}
				</p>
			</div>

			<div class="flex items-center gap-3 text-[#7285A1] text-sm font-medium">
				<div class="flex items-center gap-1">
					<Clock :size="14" />
					<p class="mt-[2px]">
						{{ todo.estimated_duration }}
					</p>
				</div>
				<div class="flex items-center gap-1">
					<CalendarCheck :size="14" />
					<p class="mt-[2px]">
						{{ formatDateString(todo.date) }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { CalendarCheck, Clock } from 'lucide-vue-next'
import { formatDateString } from '@/composables/utils/formatter'

const props = defineProps({
	todo: {
		type: Object,
		required: true
	},
	idx: {
		type: Number,
		required: true
	}
})
</script>
