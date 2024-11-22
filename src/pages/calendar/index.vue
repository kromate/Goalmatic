<template>
	<div>
		Calendar
	</div>
</template>

<script setup lang="ts">
import { usePageHeader } from '@/composables/utils/header'


definePageMeta({
	layout: 'dashboard',
	middleware: [
		'is-authenticated',
		() => {
			usePageHeader().setPageHeader({
				title: 'Calendar',
				description: 'Manage your calendar here',
				shouldShowFab: false,
				shouldShowTab: false
			})
		}
	]
})
</script>

<style scoped>

</style>
