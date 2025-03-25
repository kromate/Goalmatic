import axios from 'axios'
import { Timestamp } from 'firebase/firestore'
import { useFetchCalendarIntegrations } from '../fetch'
import { useUser } from '@/composables/auth/user'
import { useAlert } from '@/composables/core/notification'
import { setFirestoreSubDocument } from '@/firebase/firestore/create'


const updateCalendarEventData = ref()

export const useUpdateCalendarEvent = () => {
    const { getCalendarIntegrationsStorage, fetchCalendarIntegrations } = useFetchCalendarIntegrations()
    const { id: user_id } = useUser()
    const loading = ref(false)
    const updatedEvent = ref(null)

    const setUpdateCalendarEventData = (event: any) => {
        updateCalendarEventData.value = event
    }

    const updateCalendarEvent = async (eventId: string, eventData: any, calendarId = 'primary') => {
        try {
            loading.value = true

            // Get calendar integrations
            const calendarIntegrations = await getCalendarIntegrationsStorage() as any

            if (!calendarIntegrations || calendarIntegrations.length === 0) {
                useAlert().openAlert({
                    type: 'ERROR',
                    msg: 'No Google Calendar integrations found. Please connect your Google Calendar first.'
                })
                return null
            }

            // Find the first Google Calendar integration
            const integration = calendarIntegrations
                .find((integration) => integration.provider === 'GOOGLE')

            if (!integration) {
                useAlert().openAlert({
                    type: 'ERROR',
                    msg: 'No Google Calendar integration found. Please connect your Google Calendar first.'
                })
                return null
            }

            // Prepare event data with calendar ID
            const eventWithCalendarId = {
                ...eventData,
                calendarId
            }

            // Call the server API endpoint to update the event
            const response = await axios.post('/api/googleCal/update', {
                credentials: {
                    access_token: integration.access_token,
                    refresh_token: integration.refresh_token,
                    expiry_date: integration.expiry_date
                },
                eventId,
                eventData: eventWithCalendarId
            })

            // If the API returned refreshed credentials, update the stored credentials
            if (response.data?.credentials &&
                response.data.credentials.access_token &&
                response.data.credentials.access_token !== integration.access_token) {
                // Update integration in Firestore and cookie storage
                const updatedIntegration = {
                    ...integration,
                    access_token: response.data.credentials.access_token,
                    expiry_date: response.data.credentials.expiry_date,
                    updated_at: Timestamp.fromDate(new Date())
                }

                if (user_id.value) {
                    await setFirestoreSubDocument(
                        'users',
                        user_id.value,
                        'integrations',
                        integration.id,
                        updatedIntegration
                    )

                    // Refresh calendar integrations in cookie
                    await fetchCalendarIntegrations()
                }
            }

            // Store the updated event and return it
            updatedEvent.value = response.data.data
            useAlert().openAlert({ type: 'SUCCESS', msg: 'Calendar event updated successfully' })

            return response.data.data
        } catch (error: any) {
            console.error('Error updating calendar event:', error)
            useAlert().openAlert({ type: 'ERROR', msg: error.message || 'Failed to update calendar event' })
            return null
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        updatedEvent,
        updateCalendarEvent
    }
}
