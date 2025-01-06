<template>
	<div>
		<PagesDashboardCalendarView :events="fetchedEvents" :loading="loading" :fetch-all-calendar-events="fetchAllCalendarEvents" />
		{{ fetchedEvents[0] }}
	</div>
</template>

<script setup lang="ts">
import { usePageHeader } from '@/composables/utils/header'
import { useFetchAllCalendarEvents } from '@/composables/dashboard/integrations/calendar/fetch'

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
