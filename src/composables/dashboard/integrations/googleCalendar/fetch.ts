import axios from 'axios'
import { Timestamp } from 'firebase/firestore'
import { useFetchCalendarIntegrations } from '../fetch'
import { useUser } from '@/composables/auth/user'
import { useAlert } from '@/composables/core/notification'
import { setFirestoreSubDocument } from '@/firebase/firestore/create'
const fetchedEvents = ref([] as any[])

export const useFetchAllCalendarEvents = () => {
    const { getCalendarIntegrationsStorage, fetchCalendarIntegrations } = useFetchCalendarIntegrations()
    const { id: user_id } = useUser()
    const loading = ref(false)
    const calendarConnected = ref(true)

    // Flexible function to fetch events by year, month, or specific date range
    const fetchCalendarEvents = async (options: {
        view?: string; // 'day', 'week', 'month', 'year'
        year?: number;
        month?: number;
        day?: number;
        startDate?: Date;
        endDate?: Date;
    } = {}) => {
        try {
            // Clear previous events
            fetchedEvents.value = []

            let timeMin: Date, timeMax: Date

            // Determine date range based on options
            if (options.startDate && options.endDate) {
                // Use explicit date range if provided
                timeMin = options.startDate
                timeMax = options.endDate
            } else if (options.view === 'day' && options.year && options.month && options.day) {
                // Single day view
                timeMin = new Date(options.year, options.month - 1, options.day)
                timeMax = new Date(options.year, options.month - 1, options.day + 1)
            } else if (options.view === 'week' && options.year && options.month && options.day) {
                // Week view - start from the given day and extend 7 days
                timeMin = new Date(options.year, options.month - 1, options.day)
                timeMax = new Date(options.year, options.month - 1, options.day + 7)
            } else if (options.view === 'month' && options.year && options.month) {
                // Month view
                timeMin = new Date(options.year, options.month - 1, 1)
                timeMax = new Date(options.year, options.month, 0) // Last day of month
            } else {
                // Default: fetch entire year (as before)
                const currentYear = options.year || new Date().getFullYear()
                timeMin = new Date(currentYear - 1, 11, 31)
                timeMax = new Date(currentYear + 1, 0, 1)
            }

            // Get calendar integrations
            const calendarIntegrations = await getCalendarIntegrationsStorage() as any
            loading.value = true

            if (!calendarIntegrations || calendarIntegrations.length === 0) {
                calendarConnected.value = false
                // useAlert().openAlert({ type: 'Alert', msg: 'No Google Calendar integrations found. Please connect your Google Calendar first.' })
                loading.value = false
                return
            }

            const queryParams = {
                orderBy: 'startTime',
                singleEvents: true,
                timeMin: timeMin.toISOString(),
                timeMax: timeMax.toISOString(),
                maxResults: 2500
            }

            // Fetch events from all Google Calendar integrations
            const promises = calendarIntegrations
                .filter((integration) => integration.provider === 'GOOGLE')
                .map(async (integration) => {
                    const response = await axios.post('/api/googleCal/fetch', {
                        credentials: {
                            access_token: integration.access_token,
                            refresh_token: integration.refresh_token,
                            expiry_date: integration.expiry_date
                        },
                        queryParams
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

                    return response
                })

            const responses = await Promise.all(promises)

            // Create a map to track unique events by ID
            const uniqueEvents = new Map()

            responses.forEach((response) => {
                if (response.data?.data) {
                    response.data.data.forEach((event: any) => {
                        // Create a unique key using event ID and calendar ID
                        const uniqueKey = `${event.calendarId || ''}_${event.id}`
                        // Only add if this event hasn't been seen before
                        if (!uniqueEvents.has(uniqueKey)) {
                            uniqueEvents.set(uniqueKey, event)
                        }
                    })
                }
            })

            // Convert map values back to array
            fetchedEvents.value = Array.from(uniqueEvents.values())

            // Sort combined events by start time
            fetchedEvents.value.sort((a, b) =>
                new Date(a.start?.dateTime || a.start?.date).getTime() -
                new Date(b.start?.dateTime || b.start?.date).getTime()
            )
        } catch (error: any) {
            console.error('Error fetching calendar events:', error)
            useAlert().openAlert({ type: 'ERROR', msg: error.message || 'Failed to fetch calendar events' })
        } finally {
            loading.value = false
        }
    }

    // Keep the original function for backward compatibility
    const fetchAllCalendarEvents = async (year?: number) => {
        await fetchCalendarEvents({ year })
    }

    return {
        loading,
        fetchedEvents,
        fetchAllCalendarEvents,
        fetchCalendarEvents, calendarConnected
    }
}

