<template>
	<div>
		<PagesDashboardNotesCardList />
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
				title: 'Notes',
				description: 'Manage your notes here',
				shouldShowFab: false,
				shouldShowTab: false
			})
		}
	]
})
</script>

<style scoped>

</style>
