import axios from 'axios'
import { Timestamp } from 'firebase/firestore'
import { useFetchCalendarIntegrations } from '../fetch'
import { useFetchAllCalendarEvents } from './fetch'
import { useUser } from '@/composables/auth/user'
import { useAlert } from '@/composables/core/notification'
import { setFirestoreSubDocument } from '@/firebase/firestore/create'
import { useConfirmationModal } from '@/composables/core/confirmation'




const deleteCalendarEventData = ref()
const loading = ref(false)

export const useDeleteCalendarEvent = () => {
    const { fetchedEvents } = useFetchAllCalendarEvents()

    const setDeleteCalendarEventData = (event: any) => {
        deleteCalendarEventData.value = event
        useConfirmationModal().openAlert({
            type: 'Alert',
            title: 'Delete Calendar Event',
            desc: `Are you sure you want to delete "${deleteCalendarEventData.value.title || 'this event'}"?`,
            call_function: deleteCalendarEvent,
            loading
        })
    }

    const { getCalendarIntegrationsStorage, fetchCalendarIntegrations } = useFetchCalendarIntegrations()
    const { id: user_id } = useUser()




    const deleteCalendarEvent = async (calendarId = 'primary') => {
        try {
            loading.value = true
            // Get calendar integrations
            const calendarIntegrations = await getCalendarIntegrationsStorage() as any

            if (!calendarIntegrations || calendarIntegrations.length === 0) {
                useAlert().openAlert({
                    type: 'ERROR',
                    msg: 'No Google Calendar integrations found. Please connect your Google Calendar first.'
                })
                return false
            }

            // Find the first Google Calendar integration
            const integration = calendarIntegrations
                .find((integration) => integration.provider === 'GOOGLE')

            if (!integration) {
                useAlert().openAlert({
                    type: 'ERROR',
                    msg: 'No Google Calendar integration found. Please connect your Google Calendar first.'
                })
                return false
            }

            // Call the server API endpoint to delete the event
            const response = await axios.post('/api/googleCal/delete', {
                credentials: {
                    access_token: integration.access_token,
                    refresh_token: integration.refresh_token,
                    expiry_date: integration.expiry_date
                },
                eventId: deleteCalendarEventData.value.id,
                calendarId
            })

            if (response.status === 200) {
                useAlert().openAlert({ type: 'SUCCESS', msg: 'Calendar event deleted successfully' })
                fetchedEvents.value = fetchedEvents.value.filter((event) => event.id !== deleteCalendarEventData.value.id)
                useConfirmationModal().closeAlert()
                return true
            }

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

            useAlert().openAlert({ type: 'SUCCESS', msg: 'Calendar event deleted successfully' })
            return true
        } catch (error: any) {
            console.error('Error deleting calendar event:', error)
            useAlert().openAlert({ type: 'ERROR', msg: error.message || 'Failed to delete calendar event' })
            return false
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        deleteCalendarEvent, setDeleteCalendarEventData
    }
}
