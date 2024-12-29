<template>
	<ProgressRoot
		v-model="progress"
		class="relative overflow-hidden bg-[#18bf1527] rounded-full w-full h-[5px]"
		style="transform: translateZ(0)"
	>
		<ProgressIndicator
			class="bg-[#19BF15] rounded-full w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
			:style="`transform: translateX(-${100 - progress}%)`"
		/>
	</ProgressRoot>
</template>

<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'radix-vue'

const progress = defineModel<number>({ required: true })
</script>
