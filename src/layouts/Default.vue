<template>
	<div class=" min-h-screen max-w-screen relative isolate  w-full">
		<section class="flex flex-col z-10">
			<slot />
		</section>


		<ModalBase />
		<Alert />
		<div class="flex items-center absolute justify-center gap-5 text-white  w-full bottom-4 z-0">
			<nuxt-link to="/privacy" class="underline">
				Privacy Policy
			</nuxt-link>
			<nuxt-link to="/terms" class="underline">
				Terms of Service
			</nuxt-link>
		</div>
	</div>
</template>

<script setup lang="ts">

</script>

<style scoped>


</style>
