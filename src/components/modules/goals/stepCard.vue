<script setup lang="ts">
import { CalendarCheck, Clock } from 'lucide-vue-next'

</script>

<template>
	<div class="bg-[#F7F7F7] rounded-md p-4 flex flex-col gap-3">
		<h3 class="text-base font-bold text-textHeadline">
			1. Calculate Target Grades
		</h3>
		<div class="flex items-center gap-3 flex-wrap">
			<p class="text-xs font-semibold text-[#37363D] center gap-1.5 w-fit">
				<Clock :size="14" />
				<span>2 Hours</span>
			</p>
			<p class="text-xs font-semibold text-[#37363D] center gap-1.5 w-fit">
				<CalendarCheck :size="14" />
				<span>Weekly</span>
			</p>
			<p class="text-xs font-semibold text-[#37363D] center gap-1.5 w-fit">
				<IconsSignal />
				<span>Once</span>
			</p>
		</div>
		<p class="text-xs text-[#4D4D53]">
			Calculate the exact grades needed in each course to achieve a 4.5 CGPA.
		</p>
	</div>
</template>
