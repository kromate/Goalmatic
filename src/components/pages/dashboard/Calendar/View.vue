<template>
	<div class="min-h-screen bg-white p-6">
		<!-- Calendar Header Controls -->
		<div class="flex flex-wrap items-center justify-between mb-6 gap-4">
			<div class="flex items-center gap-2">
				<button
					class="px-4 py-2 bg-white hover:bg-gray-50 rounded-lg transition-colors border"
					@click="handlePrev"
				>
					Previous
				</button>
				<button
					class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
					@click="handleNext"
				>
					Next
				</button>
				<button
					class="px-4 py-2 bg-dark text-white hover:bg-blue-600 rounded-lg transition-colors"
					@click="handleToday"
				>
					Today
				</button>
				<Spinner v-if="loading" :light="false" size="20px" class="ml-3" />
			</div>

			<h1 class="text-2xl font-semibold text-gray-900">
				{{ currentTitle }}
			</h1>

			<select
				v-model="currentView"
				class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<option value="timeGridDay">
					Day
				</option>
				<option value="timeGridWeek">
					Week
				</option>
				<option value="dayGridMonth">
					Month
				</option>
				<option value="dayGridYear">
					Year
				</option>
			</select>
		</div>

		<!-- FullCalendar Component -->
		<FullCalendar
			ref="fullCalendar"
			:options="calendarOptions"
			class="calendar-container"
		/>
	</div>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'



const fullCalendar = ref(null)


const currentView = ref('dayGridMonth')

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

// Track the last fetched year to avoid duplicate fetches
const lastFetchedYear = ref(new Date().getFullYear())

// Add this event formatting function
const formatEvents = computed(() => {
	return props.events.map((event) => {
		return ({
			id: event.id,
			title: event.summary,
			start: event.start.dateTime || event.start.date,
			end: event.end.dateTime || event.end.date,
			description: event.description,
			backgroundColor: event.colorId ? `var(--calendar-color-${event.colorId})` : '#3788d8',
			borderColor: 'transparent',
			extendedProps: {
				...event.extendedProperties?.private,
				htmlLink: event.htmlLink,
				visibility: event.visibility
			}
		})
	})
})

// Calendar configuration
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
  initialView: currentView.value,
  headerToolbar: false, // We're using custom header controls
  events: formatEvents.value,
  eventClick: handleEventClick,
  height: 'auto',
  editable: true,
  selectable: true,
  weekends: true,
  // Responsive settings
  windowResize: (view) => {
    if (window.innerWidth < 768) {
      fullCalendar.value.getApi().setOption('headerToolbar', false)
    }
  },
  slotMinTime: '07:00:00', // Start time of day
  slotMaxTime: '21:00:00', // End time of day
  expandRows: true,
  dayMaxEvents: true,
  allDaySlot: false,
  slotDuration: '01:00:00',
  // Add these options for the modern look
  dayHeaderFormat: { weekday: 'short', day: 'numeric' },
  slotLabelFormat: {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  },
  datesSet: (dateInfo) => {
    currentTitle.value = dateInfo.view.title
  }
}))

// Navigation handlers
const handlePrev = () => {
  fullCalendar.value.getApi().prev()
}

const handleNext = () => {
  fullCalendar.value.getApi().next()
}

const handleToday = () => {
  fullCalendar.value.getApi().today()
}

// Event click handler
const handleEventClick = (info) => {
  // Open event link in new tab if available
  if (info.event.extendedProps.htmlLink) {
    window.open(info.event.extendedProps.htmlLink, '_blank')
  }
}

// Watch for changes in currentView
watch(currentView, (newView) => {
  fullCalendar.value?.getApi().changeView(newView)
})

// Watch for calendar title changes to fetch future years
watch(currentTitle, (newTitle) => {
    if (newTitle.toLowerCase().includes('december')) {
        const currentViewDate = fullCalendar.value.getApi().getDate()
        const viewYear = currentViewDate.getFullYear()

        // Only fetch if we haven't fetched this next year yet
        if (viewYear >= lastFetchedYear.value) {
            const nextYear = viewYear + 1
            props.fetchAllCalendarEvents(nextYear)
            lastFetchedYear.value = nextYear
        }
    }
})




</script>

<style>
  :root {
    --calendar-color-1: #694539;  /* Darker brown */
    --calendar-color-2: #8B4440;  /* Darker red */
    --calendar-color-3: #B82213;  /* Darker bright red */
    --calendar-color-4: #C13821;  /* Darker orange-red */
    --calendar-color-5: #CC4411;  /* Darker orange */
    --calendar-color-6: #CC7A14;  /* Darker amber */
    --calendar-color-7: #2A8B5F;  /* Darker green */
    --calendar-color-8: #0F6640;  /* Darker forest green */
    --calendar-color-9: #4F8B2F;  /* Darker lime green */
    --calendar-color-10: #789339; /* Darker yellow-green */
    --calendar-color-11: #C7B52F;  /* Darker yellow */
  }
/* Update calendar styles */
:deep(.fc) {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont;
  --fc-border-color: #f3f4f6;
  --fc-today-bg-color: #ffffff;
  --fc-neutral-bg-color: #ffffff;
}

:deep(.fc-timegrid-slot) {
  height: 48px !important;
}

:deep(.fc-col-header-cell) {
  padding: 8px 0;
  background: white;
}

:deep(.fc-timegrid-axis) {
  padding: 8px;
}

:deep(.fc-timegrid-slot-label) {
  color: #6b7280;
  font-size: 0.875rem;
}

:deep(.fc-day-today) {
  background-color: white !important;
}

:deep(.fc-day-today .fc-col-header-cell-cushion) {
  background-color: #3b82f6;
  color: white;
  padding: 4px 8px;
  border-radius: 9999px;
  display: inline-block;
}

:deep(.fc-scrollgrid-section-header) {
  background-color: white;
}

:deep(.fc-event) {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  border: none;
  font-size: 0.875rem;
}

:deep(.fc-event:hover) {
  opacity: 0.9;
}

:deep(.fc-timegrid-event) {
  border-radius: 6px;
  margin: 2px;
}

/* Add border radius to the calendar corners */
:deep(.fc-scrollgrid) {
  border-radius: 8px;
  border: 1px solid #f3f4f6;
}
</style>
