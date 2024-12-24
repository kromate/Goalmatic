<template>
	<div class="bg-white shadow rounded-lg p-4 flex flex-col gap-2">
		<p class="bg-[#F4F3FF] text-xs text-[#8F61F2] px-2 py-0.5 rounded-md font-medium w-fit">
			Recurring
		</p>

		<div class="flex flex-col md:flex-row md:items-center  md:justify-between gap-y-7 gap-x-5">
			<div class="flex flex-col gap-1">
				<h3 class="text-lg font-semibold text-[#4D4D53]">
					Practice interview skills
				</h3>
				<p class="text-sm font-medium text-[#908F93]">
					Prepare for behavioral and technical questions through mock interviews.
				</p>
			</div>

			<div class="flex items-center gap-3 text-[#7285A1] text-sm font-medium">
				<div class="flex items-center gap-1">
					<Clock :size="14" />
					<p class="mt-[2px]">15 min</p>
				</div>
                <div class="flex items-center gap-1">
					<CalendarCheck :size="14" />
					<p class="mt-[2px]">Wed, Dec 11, 2024</p>
				</div>
			<!-- <p class="flex items-center gap-3 text-[#37363D] text-xs font-semibold">
				<CalendarCheck :size="14" />
				<span>Due: Sun, January 5, 2025</span>
			</p> -->
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { CalendarCheck, Clock } from 'lucide-vue-next'

</script>
