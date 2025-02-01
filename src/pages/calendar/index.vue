<template>
	<div>
		<PagesDashboardCalendarView :events="fetchedEvents" :loading="loading" :fetch-all-calendar-events="fetchAllCalendarEvents" />
	</div>
</template>

<script setup lang="ts">
import { usePageHeader } from '@/composables/utils/header'
import { useFetchAllCalendarEvents } from '~/src/composables/dashboard/integrations/googleCalendar/fetch'

const { fetchedEvents, fetchAllCalendarEvents, loading } = useFetchAllCalendarEvents()

fetchAllCalendarEvents()
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
