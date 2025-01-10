<template>
	<header class=" flex items-center justify-between py-4 md:px-5 px-4 bg-transparent border-b border-[#E9E9E9]">
		<span class="hidden md:flex" />
		<img src="/lt.svg" alt="" class="w-[130px] md:hidden">

		<div class="flex items-center gap-4">
			<button class="bg-[#FCFAFF] rounded-lg p-2 border border-tertiary pc">
				<IconsBell />
			</button>
			<button class="bg-tertiary text-[#2D00BA] rounded-lg p-2 px-4 border border-tertiary center gap-2 pc">
				<IconsSpeaker />
				<span class="text-sm">Refer a friend</span>
			</button>
			<button class=" text-[#7A797E] rounded-lg p-2 center gap-2 pc">
				<IconsHeadset />
				<span class="text-sm">Support</span>
			</button>
			<AvatarDropdown class="md:hidden" />
		</div>
	</header>
</template>

<script setup lang="ts">

import { usePageHeader } from '@/composables/utils/header'

import AvatarDropdown from '@/components/core/AvatarDropdown.vue'

const { headstate } = usePageHeader()


</script>

<style scoped>
.btn-primary{
@apply text-sm px-5 py-3 md:text-base md:px-10
}
</style>
