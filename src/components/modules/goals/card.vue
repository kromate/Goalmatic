<template>
	<nuxt-link :to="`/goals/${goal.id}`" class="border border-[#E4E7EC] p-4 rounded-lg flex flex-col gap-3">
		<div class="flex items-center gap-4 justify-between">
			<p class="text-sm text-[#908F93] font-semibold">
				Goal Overview
			</p>
			<p class="text-[11px] text-textHeadline font-medium bg-[#F2F2F2] rounded-full py-1 px-2">
				{{ goal.started === true ? 'Ongoing' : 'Not Started' }}
			</p>
		</div>

		<p class="text-lg font-semibold text-[#4D4D53]">
			{{ goal.title }}
		</p>
		<!-- <div class="flex flex-col gap-1">
			<div class="flex items-center gap-4 justify-between text-sm font-semibold">
				<p class="text-[#333D54]">
					50% Complete
				</p>
				<p class="text-[#7A797E]">
					12 weeks left
				</p>
			</div>
			<Progressbar />
		</div> -->

		<div class="flex flex-col gap-3 mt-auto">
			<div class="flex items-center gap-1.5 text-sm">
				<IconsStart />
				<p class="flex items-center gap-1">
					<span class="text-[#908F93]">Start:</span>
					<span class="text-[#646368]">{{ goal.start_date ? formatDate(goal.start_date) : 'N/A' }}</span>
				</p>
			</div>
			<div class="flex items-center gap-1.5 text-sm">
				<IconsCalendar />
				<p class="flex items-center gap-1">
					<span class="text-[#908F93]">End:</span>
					<span class="text-[#646368]">{{ goal.end_date ? formatDate(goal.end_date) : 'N/A' }}</span>
				</p>
			</div>
		</div>
	</nuxt-link>
</template>

<script setup lang="ts">
import { formatDate } from '@/composables/utils/formatter'

formatDate
const props = defineProps({
	goal: {
		type: Object,
		required: true
	}
})
</script>
