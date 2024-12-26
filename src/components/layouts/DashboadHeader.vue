<template>
	<header class=" flex items-center justify-between py-2 md:px-5 px-4 bg-transparent border-b border-[#E9E9E9]">
		<!-- <div class="flex flex-col">
			<h3 class="font-cal max-w-36 sm:max-w-72 md:max-w-80 text-emphasis truncate font-semibold tracking-wide sm:text-xl md:block xl:max-w-full text-xl ">
				{{ headstate.title.value }}
			</h3>
			<span class="hidden text-sm md:block">
				{{ headstate.description.value }}
			</span>
		</div> -->
		<span class="hidden md:flex" />
		<img src="@/assets/img/logo.svg" alt="" class="w-[130px] md:hidden">

		<div class="flex items-center gap-4">
			<button class="bg-[#FCFAFF] rounded-lg p-2 border border-[#F5F1FE] ">
				<IconsBell />
			</button>
			<button class="bg-[#F5F1FE] text-[#2D00BA] rounded-lg p-2 px-4 border border-[#F5F1FE] center gap-2 md:flex hidden">
				<IconsSpeaker />
				<span class="text-sm">Refer a friend</span>
			</button>
			<button class=" text-[#7A797E] rounded-lg p-2n center gap-2 md:flex hidden">
				<IconsHeadset />
				<span class="text-sm">Support</span>
			</button>
			<Avatar :size="30" class="md:hidden" />
		</div>

		<!-- <button v-if="headstate.shouldShowTab.value && headstate.btnText.value" class="btn-primary" :disabled="headstate.loading.value" @click="headstate.btnCall.value">
			<span v-if="!headstate.loading.value">	{{ headstate.btnText.value }}</span>
			<Spinner v-else />
		</button> -->

		<!-- <div v-else class="w-auto md:hidden block">
			<AvatarDropdown />
		</div> -->
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
