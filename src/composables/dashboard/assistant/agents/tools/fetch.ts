export const availableTools = ref([
	{
		id: 'GOOGLECALENDAR',
		name: 'Google Calendar',
		icon: '/icons/googleCalendar.svg',
		status: 'Connected',
		description: 'Manage Google Calendar Events',
		abilities: [
			{ name: 'Create Events', id: 'GOOGLECALENDAR_CREATE_EVENT', icon: '/icons/googleCalendar.svg' },
			{ name: 'Read Events', id: 'GOOGLECALENDAR_READ_EVENT', icon: '/icons/googleCalendar.svg' }
			// { name: 'Update Events', id: 'GOOGLECALENDAR_UPDATE_EVENT', icon: '/icons/googleCalendar.svg' },
			// { name: 'Delete Events', id: 'GOOGLECALENDAR_DELETE_EVENT', icon: '/icons/googleCalendar.svg' }
		]
	}
	// {
	// 	id: 'GOOGLESHEETS',
	// 	name: 'Google Sheets',
	// 	icon: '/icons/googleSheets.svg',
	// 	status: 'Connected',
	// 	description: 'Manage Google Sheets',
	// 	abilities: [
	// 		{ name: 'Create Sheets', id: 'GOOGLESHEETS_CREATE_SHEET', icon: '/icons/googleSheets.svg' },
	// 		{ name: 'Read Sheets', id: 'GOOGLESHEETS_READ_SHEET', icon: '/icons/googleSheets.svg' },
	// 		{ name: 'Update Sheets', id: 'GOOGLESHEETS_UPDATE_SHEET', icon: '/icons/googleSheets.svg' },
	// 		{ name: 'Delete Sheets', id: 'GOOGLESHEETS_DELETE_SHEET', icon: '/icons/googleSheets.svg' }
	// 	]
	// }

])
