<template>
	<div class="max-w-screen relative isolate bg-[#e0e7ff] w-full overflow-hidden">
		<!-- <BG /> -->
		<section class="flex flex-col ">
			<slot />
		</section>
		<ModalBase />
		<Alert />
	</div>
</template>

<script setup lang="ts">
import HeroNav from '@/components/layouts/HeroNav.vue'

</script>

<style scoped>


</style>
