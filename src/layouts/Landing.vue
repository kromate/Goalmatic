<template>
	<div class=" min-h-screen max-w-screen relative  w-full">
		<section class="flex flex-col z-10">
			<LayoutsLandingHeroHeader />
			<slot />
		</section>


		<ModalBase />
		<Alert />
	</div>
</template>

<script setup lang="ts">



</script>

<style scoped>


</style>
