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

    // Cache object to store events by year and month
    const eventsCache = ref<{
        [key: string]: {
            events: any[];
            timestamp: number;
            timeMin: string;
            timeMax: string;
        }
    }>({})

    // Generate cache key from options
    const generateCacheKey = (timeMin: Date, timeMax: Date): string => {
        return `${timeMin.getFullYear()}_${timeMin.getMonth() + 1}_${timeMax.getFullYear()}_${timeMax.getMonth() + 1}`
    }

    // Flexible function to fetch events by year, month, or specific date range
    const fetchCalendarEvents = async (options: {
        view?: string; // 'day', 'week', 'month', 'year'
        year?: number;
        month?: number;
        day?: number;
        startDate?: Date;
        endDate?: Date;
        forceRefresh?: boolean; // Option to bypass cache
    } = {}) => {
        try {
            let timeMin: Date, timeMax: Date

            console.log(options)
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
                timeMax = new Date(options.year, options.month, 1) // Last day of month
            } else {
                // Default: fetch entire year (as before)
                const currentYear = options.year || new Date().getFullYear()
                timeMin = new Date(currentYear - 1, 11, 31)
                timeMax = new Date(currentYear + 1, 0, 1)
            }

            // Generate a cache key for this date range
            const cacheKey = generateCacheKey(timeMin, timeMax)

            // Check if we have cached data for this month/year combination and it's not being forced to refresh
            if (!options.forceRefresh && eventsCache.value[cacheKey]) {
                const cachedData = eventsCache.value[cacheKey]

                // If it's the same date range and the cache is less than 10 minutes old
                const isCacheFresh = Date.now() - cachedData.timestamp < 10 * 60 * 1000 // 10 minutes in milliseconds
                const timeMinMatch = cachedData.timeMin === timeMin.toISOString()
                const timeMaxMatch = cachedData.timeMax === timeMax.toISOString()

                if (isCacheFresh && timeMinMatch && timeMaxMatch) {
                    console.log('Using cached calendar events for', cacheKey)
                    fetchedEvents.value = cachedData.events
                    return
                }
            }

            // If no cache hit or refresh is forced, clear previous events
            fetchedEvents.value = []

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

            // Store the fetched events in cache
            eventsCache.value[cacheKey] = {
                events: [...fetchedEvents.value],
                timestamp: Date.now(),
                timeMin: timeMin.toISOString(),
                timeMax: timeMax.toISOString()
            }

            console.log('Cached calendar events for', cacheKey)
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

    // Fetch events based on current view and date
    const fetchEventsForCurrentView = async (currentDate: Date, currentView: string) => {
        const date = currentDate
        const year = date.getFullYear()
        const month = date.getMonth() + 1 // JavaScript months are 0-based
        const day = date.getDate()

        await fetchCalendarEvents({
            view: currentView,
            year,
            month,
            day
        })
    }

    const fetchEventsForCurrentViewMonth = async (currentDate: Date) => {
        const date = currentDate
        const year = date.getFullYear()
        const month = date.getMonth() + 1 // JavaScript months are 0-based
        const day = date.getDate()

        await fetchCalendarEvents({
            view: 'month',
            year,
            month,
            day
        })
    }

    // Add a method to clear the cache if needed
    const clearCache = () => {
        eventsCache.value = {}
    }

    return {
        fetchEventsForCurrentView, fetchEventsForCurrentViewMonth,
        loading,
        fetchedEvents,
        fetchAllCalendarEvents,
        fetchCalendarEvents,
        calendarConnected,
        clearCache // Export the clearCache method for manual cache clearing
    }
}

