import axios from 'axios'
import { Timestamp } from 'firebase/firestore'
import { useFetchCalendarIntegrations } from '../fetch'
import { useUser } from '@/composables/auth/user'
import { useAlert } from '@/composables/core/notification'
import { setFirestoreSubDocument } from '@/firebase/firestore/create'
import { formatDateTimeForInput } from '@/composables/utils/formatter'
import { useDashboardModal } from '@/composables/core/modals'
import { useFetchAllCalendarEvents } from '@/composables/dashboard/integrations/googleCalendar/fetch'
import { useTodoDate } from '@/composables/dashboard/todo/date_logic'

export const useCreateCalendarEvent = () => {
    const { getCalendarIntegrationsStorage, fetchCalendarIntegrations } = useFetchCalendarIntegrations()
    const { fetchedEvents } = useFetchAllCalendarEvents()

    const { id: user_id } = useUser()
    const loading = ref(false)
    const createdEvent = ref(null)
    const eventFormData = ref({
        title: '',
        description: '',
        startTime: formatDateTimeForInput(new Date(new Date().setMinutes(Math.ceil(new Date().getMinutes() / 30) * 30))),
        endTime: formatDateTimeForInput(new Date(new Date(new Date().setMinutes(Math.ceil(new Date().getMinutes() / 30) * 30)).setHours(new Date().getHours() + 1)))
    })




    // Create new calendar event from form data
    const createEventFromForm = async () => {
        try {
            const startTime = new Date(eventFormData.value.startTime)
            const endTime = new Date(eventFormData.value.endTime)

            const eventData = {
                summary: eventFormData.value.title,
                description: eventFormData.value.description,
                start: {
                    dateTime: startTime.toISOString()
                },
                end: {
                    dateTime: endTime.toISOString()
                }
            }

            const result = await createCalendarEvent(eventData)
            if (result) {
                useDashboardModal().closeCreateEvent()
                console.log(result)
                fetchedEvents.value = [...fetchedEvents.value, result]
            }
            return null
        } catch (error) {
            console.error('Error creating event:', error)
            return null
        }
    }

    /**
     * Create a new Google Calendar event
     * @param eventData - The event data to create
     * @param calendarId - Optional calendar ID (defaults to 'primary')
     */



    const createCalendarEvent = async (eventData, calendarId = 'primary') => {
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

            // Call the server API endpoint to create the event
            const response = await axios.post('/api/googleCal/create', {
                credentials: {
                    access_token: integration.access_token,
                    refresh_token: integration.refresh_token,
                    expiry_date: integration.expiry_date
                },
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

            // Store the created event and return it
            createdEvent.value = response.data.data
            useAlert().openAlert({ type: 'SUCCESS', msg: 'Calendar event created successfully' })

            return response.data.data
        } catch (error: any) {
            console.error('Error creating calendar event:', error)
            useAlert().openAlert({ type: 'ERROR', msg: error.message || 'Failed to create calendar event' })
            return null
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        createdEvent,
        createCalendarEvent,
        eventFormData,
        createEventFromForm
    }
}
