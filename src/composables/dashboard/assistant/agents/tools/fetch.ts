const availableTools = ref([
	{
		id: 'GOOGLECALENDAR',
		name: 'Google Calendar',
		icon: '/icons/googleCalendar.svg',
		description: 'Manage Google Calendar Events',
		checkStatus: true,
		abilities: [
			{ name: 'Create Events', id: 'GOOGLECALENDAR_CREATE_EVENT', icon: '/icons/googleCalendar.svg' },
			{ name: 'Read Events', id: 'GOOGLECALENDAR_READ_EVENT', icon: '/icons/googleCalendar.svg' }
			// { name: 'Update Events', id: 'GOOGLECALENDAR_UPDATE_EVENT', icon: '/icons/googleCalendar.svg' },
			// { name: 'Delete Events', id: 'GOOGLECALENDAR_DELETE_EVENT', icon: '/icons/googleCalendar.svg' }
		]
	},
	{
		id: 'DATETIME',
		name: 'Date Time',
		icon: '/icons/dateTime.svg',
		description: 'Get the current date and time',
		checkStatus: false,
		abilities: [
			{ name: 'Get Current Date Time', id: 'DATETIME_TOOL', icon: '/icons/dateTime.svg' }
		]
	}

])


export const formattedAvailableTools = (UserIntegrations: Record<string, any>[]) => {
	return availableTools.value.map((tool) => {
		return {
			...tool,
			status: tool.checkStatus ? UserIntegrations.some((userIntegration: Record<string, any>) => userIntegration.integration_id === tool.id) : true
		}
	})
}


