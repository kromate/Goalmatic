<template>
	<div class="bg-white shadow rounded-md p-4 flex flex-col">
		<div class="flex items-center gap-4 justify-between">
			<div class="flex items-start gap-3">
				<input type="checkbox">
				<div class="flex flex-col gap-0.5 -mt-2">
					<p class="text-[#4D4D53] text-base md:text-lg font-semibold">
						{{ todo?.title }}
					</p>
					<p class="text-[#89898B] text-sm font-medium">
						{{ todo?.description || '' }}
					</p>
					<!-- <p class="text-[#89898B] text-sm font-medium">
						2 sub tasks(0/2 completed)
					</p> -->
				</div>
			</div>
			<div class="flex items-center gap-1 text-sm text-[#7285A1] font-medium shrink-0">
				<Clock :size="14" />
				<p class="mt-[2px]">
					{{ todo?.estimated_duration || 'N/A' }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Clock } from 'lucide-vue-next'

const props = defineProps<{
  todo: Record<string, any>
}>()

</script>
