const availableIntegrations = [
    {
        name: 'Google Calendar',
        icon: '/icons/googleCalendar.svg',
        description: 'Sync your tasks and deadlines directly to your calendar to stay on top of your schedule.',
        type: 'CALENDAR',
        provider: 'GOOGLE',
        id: 'GOOGLECALENDAR'
    },
    {
        name: 'WhatsApp',
        icon: '/icons/whatsapp.svg',
        description: 'Use whatsapp to communicate with your assistant and get notifications on your phone.',
        type: 'MESSAGING',
        provider: 'WHATSAPP',
        id: 'WHATSAPP'
    }
]



export const formattedAvailableIntegrations = (UserIntegrations: Record<string, any>[]) => {
    return availableIntegrations.map((integration) => {
        return {
            ...integration,
            status: UserIntegrations.some((userIntegration: Record<string, any>) => (userIntegration.provider === integration.provider) && (userIntegration.type === integration.type))
        }
    })
}
