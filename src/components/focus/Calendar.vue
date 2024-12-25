<template>
	<div class="calendar-container">
		<FullCalendar :options="calendarOptions" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { CalendarOptions } from '@fullcalendar/core'

const calendarOptions = ref<CalendarOptions>({
  plugins: [timeGridPlugin, interactionPlugin],
  initialView: 'timeGridDay',
  headerToolbar: false,
  slotDuration: '01:00:00',
  slotLabelInterval: '01:00:00',
  allDaySlot: false,
  scrollTime: '00:00:00',
  height: '100%',
  dayHeaderFormat: {
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
    omitCommas: true
  },
  slotLabelFormat: {
    hour: 'numeric',
    minute: '2-digit',
    omitZeroMinute: true,
    meridiem: 'short'
  },
  nowIndicator: true,
//   now: '2023-08-24T00:00:00', // Set to match the image date
  themeSystem: 'standard'
})
</script>

<style>
.fc > * > * > * > * {
 width: 100% !important;
}
.fc .fc-toolbar.fc-header-toolbar{
	  display: none;
}
.calendar-container {
  height: 100vh;
  background-color: transparent;
  color: black;
}

.fc .fc-timegrid-slot-label {
  color: #000;
  font-size: 0.8em;
}

.fc .fc-col-header-cell-cushion {
  color: #000;
  font-size: 0.9em;
}

.fc .fc-timegrid-axis-cushion {
  color: #000;
  font-size: 0.8em;
}

.fc .fc-timegrid-slot {
  height: 60px !important;
}

.fc .fc-timegrid-slot-label-cushion {
  padding: 0 4px;
}

.fc .fc-timegrid-axis {
  padding: 0 4px;
}

.fc-theme-custom .fc-scrollgrid,
.fc-theme-custom .fc-scrollgrid-section > td,
.fc-theme-custom .fc-timegrid-axis,
.fc-theme-custom .fc-timegrid-slot,
.fc-theme-custom .fc-timegrid-slot-label,
.fc-theme-custom .fc-col-header {
  border-color: #333 !important;
}

.fc .fc-timegrid-now-indicator-line {
  border-color: red;
    border-width: 2px;
}

.fc .fc-timegrid-now-indicator-arrow {
  border-color: red;
    border-width: 0px;

}

.fc .fc-col-header {
  background-color: transparent;
}

.fc .fc-timegrid-axis {
  background-color: transparent;
}

.fc .fc-timegrid-slot-label {
  background-color: transparent;
}

.fc .fc-timegrid-slot {
  background-color: white;
}
</style>
