import axios from 'axios'
import { useFetchCalendarIntegrations } from '../fetch'
import { useUser } from '@/composables/auth/user'
import { useAlert } from '@/composables/core/notification'


    const fetchedEvents = ref([] as any[])

export const useFetchAllCalendarEvents = () => {
    const { getCalendarIntegrationsCookie } = useFetchCalendarIntegrations()


    const loading = ref(false)


    const fetchAllCalendarEvents = async (year?: number) => {
        try {
            const currentYear = year || new Date().getFullYear()
            const timeMin = new Date(currentYear - 1, 11, 31).toISOString()
            const timeMax = new Date(currentYear + 1, 0, 1).toISOString()

            const calendarIntegrations = await getCalendarIntegrationsCookie() as any
            loading.value = true


            const queryParams = {
                orderBy: 'startTime',
                singleEvents: true,
                timeMin,
                timeMax,
                maxResults: 2500
            }

            // Fetch events from all Google Calendar integrations
            const promises = calendarIntegrations
                .filter((integration) => integration.provider === 'GOOGLE')
                .map((integration) =>
                    axios.post('/api/googleCal/fetch', {
                        credentials: {
                            access_token: integration.access_token,
                            refresh_token: integration.refresh_token,
                            expiry_date: integration.expiry_date
                        },
                        queryParams
                    })
                )

            const responses = await Promise.all(promises)

            // Combine all events from different calendars
            responses.forEach((response) => {
                if (response.data?.data) {
                    fetchedEvents.value.push(...response.data.data)
                }
            })

            // Sort combined events by start time
            fetchedEvents.value.sort((a, b) =>
                new Date(a.start?.dateTime || a.start?.date).getTime() -
                new Date(b.start?.dateTime || b.start?.date).getTime()
            )
        } catch (error: any) {
            useAlert().openAlert({ type: 'ERROR', msg: error.message || 'Failed to fetch calendar events' })
        } finally {
            loading.value = false
        }
    }

    return { loading, fetchedEvents, fetchAllCalendarEvents }
}
