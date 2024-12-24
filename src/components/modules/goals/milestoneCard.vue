<script setup lang="ts">
import { CalendarCheck, Clock } from 'lucide-vue-next'

</script>

<template>
	<div class="bg-[#F7F7F7] rounded-md p-4 flex flex-col gap-3">
		<p class="bg-white text-xs text-textHeadline px-2 py-0.5 rounded-md font-medium w-fit">
			Milestones 1
		</p>
		<div class="flex flex-col gap-1.5">
			<h3 class="text-base font-bold text-textHeadline">
				Calculate Target Grades
			</h3>
			<p class="text-xs text-[#4D4D53]">
				Successfully complete the first 25% of the semester's coursework with grades that are on track to achieve a 4.5 CGPA. This involves consistent execution of the study plan, active participation in class, and seeking help when needed. This will build a strong base for the rest of the semester.
			</p>
		</div>

		<div class="flex flex-col gap-1.5">
			<p class="flex items-center gap-3 text-[#37363D] text-xs font-semibold">
				<IconsProgressBar />
				<span>Percentage Complete: 25%</span>
			</p>
			<p class="flex items-center gap-3 text-[#37363D] text-xs font-semibold">
				<CalendarCheck :size="14" />
				<span>Due: Sun, January 5, 2025</span>
			</p>
		</div>
	</div>
</template>
