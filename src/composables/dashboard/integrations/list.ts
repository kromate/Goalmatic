import { EditConfigField } from './editConfig'
import { fetchUserAgentsForIntegration } from '@/composables/dashboard/assistant/agents/fetch'

export const availableIntegrations = () => {
    return [
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
            id: 'WHATSAPP',
            hasGlobalConfig: true,
            globalConfig: [
                {
                    name: 'Selected Agent',
                    key: 'selected_agent_id',
                    type: 'SELECT',
                    required: true,
                    options: fetchUserAgentsForIntegration
                }
            ] as EditConfigField[]
        },
        {
            name: 'Google Sheets',
            icon: '/icons/googleSheets.svg',
            description: 'Access and manage your spreadsheets directly from the app.',
            type: 'SPREADSHEET',
            provider: 'GOOGLE',
            id: 'GOOGLESHEETS'
        }
    ]
}

export const formattedAvailableIntegrations = (UserIntegrations: Record<string, any>[]) => {
    return availableIntegrations().map((integration) => {
        const matchingIntegration = UserIntegrations.find(
            (userIntegration: Record<string, any>) =>
                userIntegration.provider === integration.provider &&
                userIntegration.type === integration.type
        )

        return {
            ...integration,
            integration_id: integration?.id,
            id: matchingIntegration?.id,
            status: !!matchingIntegration,
            phone: matchingIntegration?.phone,
            email: matchingIntegration?.email,
            config: matchingIntegration?.config ?? {}
        }
    })
}
