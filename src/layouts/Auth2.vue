<template>
	<main class="!bg-[#FBFBFE]">
		<div class="min-h-screen h-full w-full flex flex-col">
			<div class="bg-light h-[60px] flex items-center gap-4 px-5 md:px-14 border-b shrink-0">
				<img src="@/assets/img/logo.svg" alt="" class="h-7">
			</div>
			<div class="flex-grow h-[calc(100vh-60px)]">
				<slot />
			</div>
		</div>
	</main>
	<Alert />
	<ModalBase />
</template>

<script setup lang="ts">
import { initializeResizeObserver } from '@/composables/utils/window'

onMounted(() => {
	initializeResizeObserver()
})
</script>

<style scoped>

</style>
