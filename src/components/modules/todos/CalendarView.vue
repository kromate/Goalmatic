<template>
	<div class="flex flex-col gap-4">
		<ColorBadge v-if="!calendarConnected && !badgeDismissed" color="#2F804A" bg="#EAFFF1" name="nill">
			<div class="flex items-center gap-2 w-full justify-between">
				<span>connect your google calendar</span>
				<XCircle class="w-4 h-4 cursor-pointer" @click="dismissBadge" />
			</div>
		</ColorBadge>

		<!-- Demo controls -->
		<div v-if="calendarConnected" class="flex gap-2">
			<button class="btn-primary w-full"
				@click="useDashboardModal().openCreateEvent()">
				Create Event
			</button>
			<!-- <button v-if="selectedEvent" class="px-3 py-1 text-sm font-medium bg-amber-500 text-white rounded-md hover:bg-opacity-90 transition-colors"
				@click="showUpdateEventModal = true">
				Update Selected
			</button>
			<button v-if="selectedEvent" class="px-3 py-1 text-sm font-medium bg-red text-white rounded-md hover:bg-opacity-90 transition-colors"
				@click="deleteSelectedEvent">
				Delete Selected
			</button> -->
		</div>
		<div class="flex  space-y-7 justify-end">
			<Spinner v-if="calendarLoading" :light="false" size="18px" />
		</div>

		<vue-cal v-bind="config"
			:events="calendarEvents"
			:editable-events="{create: false, delete: false}"
			@event-click="onEventClick"
			@event-create="null"
			@event-drop="onEventDrop"
			@event-resize-end="onEventResizeEnd"
			@ready="({ view }) => scrollToCurrentTime(view)"
		>
			<template #time-cell="{ hours, minutes }">
				<strong v-if="minutes" class="text-xs hidden ">{{ hours }}</strong>
			</template>
			<template #event="{ event, view }">
				<section class="flex flex-col h-full relative">
					<div class="font-semibold text-base">
						{{ event.title }}
					</div>
					<div v-if="view !== 'month' && event.description" class="text-xs">
						{{ event.description }}
					</div>
					<small class="mt-2 font-semibold text-xs">
						<span>{{ event._.startTimeFormatted12 }}</span> - <span>{{ event._.endTimeFormatted12 }}</span>
					</small>
					<div class="absolute top-0 right-0">
						<IconDropdown
							:data="event"
							:children="dropdownChildren()"
						/>
					</div>
				</section>
			</template>
		</vue-cal>


		<!-- Update Event Modal -->
		<div v-if="showUpdateEventModal && selectedEvent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-white p-6 rounded-lg w-full max-w-md">
				<h2 class="text-xl font-bold mb-4">
					Update Event
				</h2>
				<div class="mb-4">
					<label class="block text-sm font-medium mb-1">Title</label>
					<input v-model="updatedEvent.title" class="w-full px-3 py-2 border rounded-md">
				</div>
				<div class="mb-4">
					<label class="block text-sm font-medium mb-1">Description</label>
					<textarea v-model="updatedEvent.description" class="w-full px-3 py-2 border rounded-md" />
				</div>
				<div class="mb-4 grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium mb-1">Start Time</label>
						<input v-model="updatedEvent.startTime" type="datetime-local" class="w-full px-3 py-2 border rounded-md">
					</div>
					<div>
						<label class="block text-sm font-medium mb-1">End Time</label>
						<input v-model="updatedEvent.endTime" type="datetime-local" class="w-full px-3 py-2 border rounded-md">
					</div>
				</div>
				<div class="flex justify-end gap-3">
					<button class="px-4 py-2 text-gray-600 hover:text-gray-800" @click="showUpdateEventModal = false">
						Cancel
					</button>
					<button class="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-opacity-90" @click="updateEvent">
						Update
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { XCircle } from 'lucide-vue-next'
import { VueCal } from 'vue-cal'
import { onMounted, ref, computed, watch } from 'vue'
import { useFetchAllCalendarEvents } from '@/composables/dashboard/integrations/googleCalendar/fetch'
import { useCreateCalendarEvent } from '@/composables/dashboard/integrations/googleCalendar/create'
import { useUpdateCalendarEvent } from '@/composables/dashboard/integrations/googleCalendar/update'
import { useDeleteCalendarEvent } from '@/composables/dashboard/integrations/googleCalendar/delete'
import { useDashboardModal } from '@/composables/core/modals'
import { formatDateTimeForInput } from '@/composables/utils/formatter'
import { useTodoDate } from '@/composables/dashboard/todo/date_logic'


const vuecalView = ref<InstanceType<typeof VueCal> | null>(null)
// Define event type interfaces
interface CalendarEventData {
	id?: string;
	summary?: string;
	description?: string;
	start?: {
		date?: string;
		dateTime?: string;
	};
	end?: {
		date?: string;
		dateTime?: string;
	};
	[key: string]: any;
}

interface VueCalEvent {
	id?: string;
	title?: string;
	description?: string;
	start: Date;
	end: Date;
	class?: string;
	background?: boolean;
	split?: boolean;
	[key: string]: any;
}

const onEventDrop = (event: VueCalEvent) => {
	console.log(event)
}

const onEventResizeEnd = (event: VueCalEvent) => {
	console.log(event)
}

const props = defineProps({
	month: Number,
	year: Number,
	loading: Boolean
})

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

const scrollToCurrentTime = (view) => {
	if (!vuecalView.value) {
		vuecalView.value = view
	}

	const currentTimeInMinutes = new Date().getHours() * 60 + new Date().getMinutes()
	const offset = 0
	const targetTimeInMinutes = currentTimeInMinutes + offset
	view.scrollToTime(targetTimeInMinutes)
}


// Track current view and date
const currentView = ref('day')
const { dateState } = useTodoDate()
const currentDate = computed(() => dateState.date)

// Google Calendar integration
const { loading: calendarLoading, fetchedEvents, fetchEventsForCurrentViewMonth, calendarConnected } = useFetchAllCalendarEvents()
const { updateCalendarEvent, loading: updateLoading } = useUpdateCalendarEvent()
const { setDeleteCalendarEventData } = useDeleteCalendarEvent()

// Selected event for update/delete operations
const selectedEvent = ref<VueCalEvent | null>(null)

const showUpdateEventModal = ref(false)

const dropdownChildren = () => {
	const res = [
		{ name: 'Delete Event', func: (data) => setDeleteCalendarEventData(data), class: '!text-red hover:!bg-red hover:!text-white' }
	]
	return res
}

const updatedEvent = ref({
	title: '',
	description: '',
	startTime: '',
	endTime: ''
})

// Parse datetime from input field
const parseDateTime = (dateTimeString) => {
	return new Date(dateTimeString)
}

// Event click handler
const onEventClick = (data) => {
	selectedEvent.value = data.event
	console.log('Selected event:', data.event)
}



// Update selected calendar event
const updateEvent = async () => {
	try {
		if (!selectedEvent.value || !selectedEvent.value.id) return

		const startTime = parseDateTime(updatedEvent.value.startTime)
		const endTime = parseDateTime(updatedEvent.value.endTime)

		const eventData = {
			summary: updatedEvent.value.title,
			description: updatedEvent.value.description,
			start: {
				dateTime: startTime.toISOString()
			},
			end: {
				dateTime: endTime.toISOString()
			}
		}

		const result = await updateCalendarEvent(selectedEvent.value.id, eventData)
		if (result) {
			showUpdateEventModal.value = false
			// Refresh events to show the updated one
			await fetchEventsForCurrentViewMonth(currentDate.value)
		}
	} catch (error) {
		console.error('Error updating event:', error)
	}
}



// Initialize update form with selected event data
watch(selectedEvent, (event) => {
	if (event) {
		updatedEvent.value = {
			title: event.title || '',
			description: event.description || '',
			startTime: formatDateTimeForInput(event.start),
			endTime: formatDateTimeForInput(event.end)
		}
	} else {
		updatedEvent.value = {
			title: '',
			description: '',
			startTime: '',
			endTime: ''
		}
	}
})

// Format events for Vue-Cal
const calendarEvents = computed(() => {
	return fetchedEvents.value.map((event: CalendarEventData) => {
		const startDate = event.start?.dateTime ? new Date(event.start.dateTime) : new Date(event.start?.date || new Date())
		const endDate = event.end?.dateTime ? new Date(event.end.dateTime) : new Date(event.end?.date || new Date())

		return {
			...event,
			id: event.id,
			start: startDate,
			end: endDate,
			title: event.summary || 'Untitled Event',
			description: event.description || '',
			class: 'calCard',
			background: false,
			split: event.start?.date && !event.start?.dateTime // For all-day events
		} as VueCalEvent
	})
})

watch(dateState, () => {
	const updatedDate = new Date(`${dateState.day}/${dateState.month}/${dateState.year}`)
	console.log(updatedDate)
	console.log(vuecalView.value)
	vuecalView.value!.updateViewDate(updatedDate)
	setTimeout(() => {
		scrollToCurrentTime(vuecalView.value)
	}, 300)
	fetchEventsForCurrentViewMonth(updatedDate)
})


onMounted(async () => {
	// Initialize with current date from props or use the one from dateState
	if (props.year && props.month) {
		dateState.date = new Date(props.year, props.month - 1, 1)
	} // otherwise use the existing dateState.date

	await fetchEventsForCurrentViewMonth(currentDate.value)
})

// Watch for year/month changes from parent
watch([() => props.year, () => props.month], ([newYear, newMonth]) => {
	if (newYear && newMonth) {
		dateState.date = new Date(newYear, newMonth - 1, 1)
		fetchEventsForCurrentViewMonth(currentDate.value)
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
  --vuecal-time-cell-height: 75px !important;
  --vuecal-height: 500px !important;
  /* --vuecal-height: 100dvh !important; */
}
.vuecal__now-line {border-color: var(--primary) !important;}

/* Style for Google Calendar events */
.google-calendar-event {
  background-color: #4285F4;
  color: white;
  border-radius: 3px;
}
.vuecal__event{
box-shadow: 0px 0px 0px 1px #1B1F2326 !important;
border: 0.5px solid var(--primary) !important;
background: var(--secondaryLight) !important;
border-radius: 8px !important;
color: #37363D !important;
margin-left: 3px !important;
padding: 12px 16px !important;
}
</style>
