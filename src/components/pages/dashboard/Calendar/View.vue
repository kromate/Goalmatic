<template>
	<div class="min-h-screen bg-white p-6 flex flex-col gap-6">
		<!-- Calendar Header Controls -->
		<div
			class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
		>
			<div class="flex items-center gap-3">
				<h3 class="text-2xl text-[#212028] font-bold">
					{{ moment().format('LL') }}
				</h3>
				<select
					class="!py-2 px-3 rounded-lg text-sm text-[#646368] font-medium border border-[#E9E9E9] w-fit min-w-[80px]"
				>
					<option value="">
						Today
					</option>
				</select>
			</div>
			<div class="flex items-center gap-8">
				<div class="flex items-center bg-[#F9F8FB] rounded-xl p-1">
					<button
						v-for="(n, i) in calendar_filter"
						:key="i"
						class="px-3 py-2.5 text-sm font-semibold rounded-lg"
						:class="[
							n?.value === currentView
								? 'text-[#37363D] bg-white border border-[#E9E9E9]'
								: 'text-[#908F93]',
						]"
						@click="currentView = n?.value"
					>
						{{ n?.text }}
					</button>
				</div>
				<button class="custom-btn" @click="handleNewEvent">
					New event
				</button>
			</div>
		</div>

		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-4 justify-between">
				<p class="text-base font-semibold text-[#37363D]">
					What's Next on Your Schedule?
				</p>
				<button
					class="p-2.5 py-1.5 border border-[#E9E9E9] rounded-lg text-[#798494]"
				>
					<ChevronDown :size="18" />
				</button>
			</div>
			<div
				class="p-4 rounded-lg bg-[#FCFAFF] border border-[#AF8EF6] flex flex-col gap-6"
			>
				<div class="flex items-center justify-between gap-4">
					<div class="flex flex-col gap-0.5 text-[#00006E]">
						<p class="text-base font-semibold">
							Review Thermodynamics Notes
						</p>
						<p class="text-sm">
							This item is linked to a goal
						</p>
					</div>
					<button class="custom-btn bg-white text-primary">
						Mark complete
					</button>
				</div>
				<div class="flex flex-col gap-1.5">
					<div
						class="flex items-center gap-4 justify-between text-[#00006E] text-sm font-semibold"
					>
						<p>11:00 AM</p>
						<p>11:45 AM</p>
					</div>
					<div class="border border-[#00006E]" />
				</div>
			</div>
		</div>

		<div class="flex flex-col md:flex-row">
			<div class="flex items-center gap-2 w-fit">
				<button
					class="p-3 rounded-md bg-white border border-[#E9E9E9] text-[#798494]"
					@click="handlePrev"
				>
					<ChevronLeft :size="15" :stroke-width="2.5" />
				</button>
				<button
					class="p-3 rounded-md bg-white border border-[#E9E9E9] text-[#798494]"
					@click="handleNext"
				>
					<ChevronRight :size="15" :stroke-width="2.5" />
				</button>
			</div>
		</div>

		<!-- Schedule-X Calendar Component -->
		<ClientOnly>
			<template v-if="loading">
				<Skeleton height="200px" radius="10px" class="border-0" />
			</template>
			<ScheduleXCalendar
				v-else
				:calendar-app="calendarApp"
				@event-click="handleEventClick"
				@date-click="handleDateClick"
				@event-drag="handleEventDrag"
				@event-resize="handleEventResize"
			/>
		</ClientOnly>
	</div>
</template>

<script setup>
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
	createCalendar,
	createViewDay,
	createViewWeek,
	createViewMonthAgenda,
	createViewMonthGrid
} from '@schedule-x/calendar'
import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createResizePlugin } from '@schedule-x/resize'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createScrollControllerPlugin } from '@schedule-x/scroll-controller'
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import '@schedule-x/theme-default/dist/index.css'
import moment from 'moment'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { onMounted, ref, computed, watch, shallowRef, nextTick } from 'vue'
import task from '@/assets/icons/task.vue'

const currentView = ref('month-grid')
const calendarApp = shallowRef(null)
const calendarControls = shallowRef(null)
const eventsService = shallowRef(null)
const eventModal = shallowRef(null)
const scrollController = shallowRef(null)

const props = defineProps({
	events: {
		type: Array,
		required: true
	},
	loading: {
		type: Boolean,
		required: true
	},
	fetchAllCalendarEvents: {
		type: Function,
		required: true
	}
})

const currentTitle = ref('')

const calendar_filter = [
	{ text: 'Monthly', value: 'month-grid' },
	{ text: 'Weekly', value: 'week' },
	{ text: 'Daily', value: 'day' }
]

// Track the last fetched year to avoid duplicate fetches
const lastFetchedYear = ref(new Date().getFullYear())

// Format events for Schedule-X
const formattedEvents = computed(() => {
	if (!props.events) return []

	return props.events.map((event) => {
		const startDateTime = event.start.dateTime || event.start.date
		const endDateTime = event.end.dateTime || event.end.date
		const isAllDay = !event.start.dateTime

		return {
			id: event.id,
			title: event.summary || 'Untitled Event',
			start: isAllDay
				? moment(startDateTime).format('YYYY-MM-DD')
				: moment(startDateTime).format('YYYY-MM-DD HH:mm'),
			end: isAllDay
				? moment(endDateTime).format('YYYY-MM-DD')
				: moment(endDateTime).format('YYYY-MM-DD HH:mm'),
			description: event.description || '',
			color: event.colorId ? `var(--calendar-color-${event.colorId})` : '#3788d8',
			allDay: isAllDay,
			extendedProps: {
				...event.extendedProperties?.private,
				htmlLink: event.htmlLink,
				visibility: event.visibility,
				originalEvent: event
			}
		}
	})
})

// Initialize calendar when component is mounted
onMounted(async () => {
	// Create plugins
	const controls = createCalendarControlsPlugin()
	const events = createEventsServicePlugin()
	const dragAndDrop = createDragAndDropPlugin(15) // 15-minute intervals for dragging
	const resize = createResizePlugin(15) // 15-minute intervals for resizing
	const modal = createEventModalPlugin()
	const scroll = createScrollControllerPlugin({
		initialScroll: '07:00' // Match dayBoundaries.start
	})
	const currentTime = createCurrentTimePlugin({
		fullWeekWidth: true // Show time indicator across full week width
	})

	// Store plugin references
	calendarControls.value = controls
	eventsService.value = events
	eventModal.value = modal
	scrollController.value = scroll

	// Create the calendar instance with all plugins
	const calendar = createCalendar(
		{
			selectedDate: moment().format('YYYY-MM-DD'),
			events: [], // Start with empty events
			views: [createViewMonthGrid(), createViewWeek(), createViewDay()],
			defaultView: currentView.value,
			locale: 'en-US',
			firstDayOfWeek: 0,
			dayBoundaries: {
				start: '07:00',
				end: '21:00'
			},
			slotDuration: 60,
			height: 'auto',
			editable: true,
			selectable: true,
			weekends: true
		},
		[controls, events, dragAndDrop, resize, modal, scroll, currentTime]
	)

	// Store the calendar instance
	calendarApp.value = calendar

	// Wait for next tick to ensure calendar is mounted
	await nextTick()

	// Set initial events if available
	if (formattedEvents.value.length > 0) {
		try {
			eventsService.value.set(formattedEvents.value)
			console.log('Initial events set:', formattedEvents.value)
		} catch (error) {
			console.warn('Could not set initial events:', error)
		}
	}

	// Watch for events changes to update calendar
	watch(
		() => props.events,
		(newEvents) => {
			console.log('Events changed:', newEvents?.length)
			if (eventsService.value) {
				try {
					eventsService.value.set(formattedEvents.value)
					console.log('Events updated:', formattedEvents.value)
				} catch (error) {
					console.warn('Could not update calendar events:', error)
				}
			}
		},
		{ deep: true, immediate: true }
	)

	// Set up watchers that depend on calendar instance
	watch(
		() => calendarApp.value?.api?.getDate(),
		(newDate) => {
			if (!newDate) return

			const date = new Date(newDate)
			if (date && date.getMonth() === 11) {
				const viewYear = date.getFullYear()
				if (viewYear >= lastFetchedYear.value) {
					const nextYear = viewYear + 1
					props.fetchAllCalendarEvents(nextYear)
					lastFetchedYear.value = nextYear
				}
			}
		}
	)
})

// Navigation handlers
const handlePrev = () => {
	if (calendarControls.value) {
		const currentDate = calendarControls.value.getDate()
		const newDate = moment(currentDate)
			.subtract(1, currentView.value === 'month-grid' ? 'month' : 'week')
			.format('YYYY-MM-DD')
		calendarControls.value.setDate(newDate)
	}
}

const handleNext = () => {
	if (calendarControls.value) {
		const currentDate = calendarControls.value.getDate()
		const newDate = moment(currentDate)
			.add(1, currentView.value === 'month-grid' ? 'month' : 'week')
			.format('YYYY-MM-DD')
		calendarControls.value.setDate(newDate)
	}
}

const handleToday = () => {
	if (calendarControls.value) {
		calendarControls.value.setDate(moment().format('YYYY-MM-DD'))
	}
}

const handleNewEvent = () => {
	// Implement new event creation logic
}

// Event click handler
const handleEventClick = (info) => {
	// Open event in modal instead of new tab
	if (info.event?.extendedProps?.originalEvent) {
		// You can customize what's shown in the modal by setting properties
		// on the event when formatting it
		eventModal.value?.open(info.event)
	}
}

const handleDateClick = (info) => {
	// Implement date click logic if needed
}

// Event drag handler
const handleEventDrag = async (info) => {
	if (eventsService.value) {
		try {
			await eventsService.value.update(info.event)
			// Additional logic for updating the backend can go here
		} catch (error) {
			// console.warn('Could not update dragged event:', error)
		}
	}
}

// Event resize handler
const handleEventResize = async (info) => {
	if (eventsService.value) {
		try {
			await eventsService.value.update(info.event)
			// Additional logic for updating the backend can go here
		} catch (error) {
			// console.warn('Could not update resized event:', error)
		}
	}
}

// Add scroll to time method
const scrollToTime = (time) => {
	if (scrollController.value) {
		scrollController.value.scrollTo(time)
	}
}

// Watch for changes in currentView
watch(currentView, (newView) => {
	if (calendarControls.value) {
		calendarControls.value.setView(newView)
	}
})
</script>

<style lang="scss">
.sx__calendar-header {
	display: none;
}
:root {
	--calendar-color-1: #694539; /* Darker brown */
	--calendar-color-2: #8b4440; /* Darker red */
	--calendar-color-3: #b82213; /* Darker bright red */
	--calendar-color-4: #c13821; /* Darker orange-red */
	--calendar-color-5: #cc4411; /* Darker orange */
	--calendar-color-6: #cc7a14; /* Darker amber */
	--calendar-color-7: #2a8b5f; /* Darker green */
	--calendar-color-8: #0f6640; /* Darker forest green */
	--calendar-color-9: #4f8b2f; /* Darker lime green */
	--calendar-color-10: #789339; /* Darker yellow-green */
	--calendar-color-11: #c7b52f; /* Darker yellow */
}
.sx__month-grid-day__header-day-name {
	@apply  justify-between items-center font-medium text-lg text-dark  w-full;
}
.sx__calendar {
	@apply rounded-none;
}
.sx__month-grid-day {
	min-height: 129px;
}

.sx__month-grid-day__header {
	@apply items-start pl-2;

	.sx__month-grid-day__header-date {
		@apply font-semibold text-xl ;
	}
}
</style>
