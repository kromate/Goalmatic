<template>
	<div class="flex flex-col gap-2">
		<ColorBadge v-if="!calendarConnected && !badgeDismissed" color="#2F804A" bg="#EAFFF1" name="nill">
			<div class="flex items-center gap-2 w-full justify-between">
				<span>connect your google calendar</span>
				<XCircle class="w-4 h-4 cursor-pointer" @click="dismissBadge" />
			</div>
		</ColorBadge>
		<vue-cal v-bind="config" :events="calendarEvents" @view-change="onViewChange" @day-focus="onDayChange" @event-drop="onEventDrop">
			<template #time-cell="{ hours, minutes }">
				<strong v-if="minutes" class="text-xs hidden ">{{ hours }}</strong>
			</template>
			<template #event="{ event, view }">
				<div class="flex flex-col h-full">
					<div class="font-semibold text-sm">
						{{ event.title }}
					</div>
					<div v-if="view !== 'month' && event.description" class="text-xs">
						{{ event.description }}
					</div>
				</div>
			</template>
		</vue-cal>
	</div>
</template>

<script setup lang="ts">
import { XCircle } from 'lucide-vue-next'
import { VueCal } from 'vue-cal'
import { onMounted, ref, computed, watch } from 'vue'
import { useFetchAllCalendarEvents } from '@/composables/dashboard/integrations/googleCalendar/fetch'


const onEventDrop = (event) => {
	console.log(event)
}

const props = defineProps({
	month: Number,
	year: Number,
	todos: Array,
	loading: Boolean
})

const emit = defineEmits(['date-selected', 'drop-on-date'])

const config = {
	view: 'day',
	'today-button': false,
	'views-bar': false,
	'title-bar': false,
	'time-step': 30,
	'time-at-cursor': true,
	'watch-real-time': true,
	'editable-events': true
}

// Track current view and date
const currentView = ref('day')
const currentDate = ref(new Date())

// Google Calendar integration
const { loading: calendarLoading, fetchedEvents, fetchCalendarEvents, calendarConnected } = useFetchAllCalendarEvents()

// Format events for Vue-Cal
const calendarEvents = computed(() => {
	return fetchedEvents.value.map((event) => {
		const startDate = event.start?.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date)
		const endDate = event.end?.dateTime ? new Date(event.end.dateTime) : new Date(event.end.date)

		return {
			start: startDate,
			end: endDate,
			title: event.summary || 'Untitled Event',
			description: event.description || '',
			class: 'calCard',
			background: false,
			split: event.start?.date && !event.start?.dateTime // For all-day events
		}
	})
})

// Handle view changes
const onViewChange = (view) => {
	currentView.value = view
	fetchEventsForCurrentView()
}

// Handle day focus/change
const onDayChange = (date) => {
	currentDate.value = new Date(date)
	fetchEventsForCurrentView()
}

// Fetch events based on current view and date
const fetchEventsForCurrentView = async () => {
	const date = currentDate.value
	const year = date.getFullYear()
	const month = date.getMonth() + 1 // JavaScript months are 0-based
	const day = date.getDate()

	await fetchCalendarEvents({
		view: currentView.value,
		year,
		month,
		day
	})
}

onMounted(async () => {
	// Initialize with current date
	currentDate.value = props.year && props.month
		? new Date(props.year, props.month - 1, 1)
		: new Date()

	await fetchEventsForCurrentView()
})

// Watch for year/month changes from parent
watch([() => props.year, () => props.month], ([newYear, newMonth]) => {
	if (newYear && newMonth) {
		currentDate.value = new Date(newYear, newMonth - 1, 1)
		fetchEventsForCurrentView()
	}
})

const badgeDismissed = ref(false)

const dismissBadge = () => {
	badgeDismissed.value = true
}
</script>

<style>
@import url('@/assets/css/vue-cal.css');
.vuecal {
  --vuecal-primary-color: var(--primary);
  --vuecal-time-cell-height: 50px !important;
  --vuecal-height: 100% !important;
}
.vuecal__now-line {border-color: var(--primary) !important;}

/* Style for Google Calendar events */
.google-calendar-event {
  background-color: #4285F4;
  color: white;
  border-radius: 3px;
}
</style>
