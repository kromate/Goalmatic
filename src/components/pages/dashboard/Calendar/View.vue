<template>
	<div class="min-h-screen bg-white p-6 flex flex-col gap-6">
		<!-- Calendar Header Controls -->
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div class="flex items-center gap-3">
				<h3 class="text-2xl text-[#212028] font-bold">
					{{ moment().format('LL') }}
				</h3>
				<select class="!py-2 px-3 rounded-lg text-sm text-[#646368] font-medium border border-[#E9E9E9] w-fit min-w-[80px]">
					<option value="">
						Today
					</option>
				</select>
			</div>
			<div class="flex items-center gap-8">
				<div class="flex items-center bg-[#F9F8FB] rounded-xl p-1">
					<button v-for="n,i in calendar_filter" :key="i" class="px-3 py-2.5 text-sm font-semibold rounded-lg"
						:class="[n?.value === currentView ? 'text-[#37363D] bg-white border border-[#E9E9E9]' : 'text-[#908F93]']"
						@click="currentView = n?.value"
					>
						{{ n?.text }}
					</button>
				</div>
				<button class="custom-btn">
					New event
				</button>
			</div>
		</div>

		<!-- <div class="flex flex-wrap items-center justify-between mb-6 gap-4">
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
		</div> -->

		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-4 justify-between">
				<p class="text-base font-semibold text-[#37363D]">
					What’s Next on Your Schedule?
				</p>
				<button class="p-2.5 py-1.5 border border-[#E9E9E9] rounded-lg text-[#798494]">
					<ChevronDown :size="18" />
				</button>
			</div>
			<div class="p-4 rounded-lg bg-[#FCFAFF] border border-[#AF8EF6] flex flex-col gap-6">
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
					<div class="flex items-center gap-4 justify-between text-[#00006E] text-sm font-semibold">
						<p>11:00 AM</p>
						<p>11:45 AM</p>
					</div>
					<div class="border border-[#00006E]" />
				</div>
			</div>
		</div>

		<div class="flex flex-col md:flex-row">
			<div class="flex items-center gap-2 w-fit">
				<button class="p-3 rounded-md bg-white border border-[#E9E9E9] text-[#798494]" @click="handlePrev">
					<ChevronLeft :size="15" :stroke-width="2.5" />
				</button>
				<button class="p-3 rounded-md bg-white border border-[#E9E9E9] text-[#798494]" @click="handleNext">
					<ChevronRight :size="15" :stroke-width="2.5" />
				</button>
			</div>
		</div>

		<!-- FullCalendar Component -->
		<Skeleton v-if="loading" height="200px" radius="10px" class="border-0" />
		<FullCalendar
			v-else
			ref="fullCalendar"
			:options="calendarOptions"
			class="calendar-container"
		>
			<template #eventContent="arg">
				<!-- <b>{{ arg.event.title }}</b> -->
				<div v-if="currentView === 'dayGridMonth'" class="flex flex-col gap-6 px-2 w-full" :title="arg?.event?.title">
					<div class="flex items-center gap-1.5 text-xs text-[#7A797E] font-medium">
						<div class="bg-[#F5F1FE] rounded py-0.5 px-0.5">
							<task class="w-4 h-4" />
						</div>
						<p class="shrink-0">
							{{ moment(arg.event.start).format('LT') }}
						</p>
						<p class="text-ellipsis overflow-hidden flex-grow">
							{{ arg?.event?.title }}
						</p>
					</div>
				</div>

				<div v-if="currentView === 'timeGridDay'" class="flex flex-col gap-2 px-2 min-w-[100px] border border-[#DFD2FB] !bg-[#FCFAFF] w-fit rounded-lg">
					<p class="text-[#37363D] text-sm font-semibold">
						{{ arg?.event?.title }}
					</p>
					<p class="text-[#212028] text-xs">
						{{ moment(arg.event.start).format('LT') }} - {{ moment(arg.event.end).format('LT') }}
					</p>
				</div>
			</template>
		</FullCalendar>
	</div>
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import moment from 'moment'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import task from '@/assets/icons/task.vue'



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

const calendar_filter = [
  { text: 'Monthly', value: 'dayGridMonth' },
//   { text: 'Weekly', value: 'timeGridWeek' },
  { text: 'Weekly', value: 'timeGridDay' },
  { text: 'Daily', value: 'timeGridDay' }
]
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
.fc-daygrid-day-top {
	@apply flex !flex-row items-center px-2 text-[20px] text-[#4D4D53] font-semibold
}

.fc-scrollgrid-sync-inner {
	@apply text-[#212028] text-sm font-medium
}

a.fc-event {
	@apply !bg-transparent
}

div.fc-timegrid-event-harness {
	@apply !h-[100px]
}
</style>
