import { getFirestoreSubCollection } from '@/firebase/firestore/fetch'
import { getFirestoreSubCollectionWithWhereQuery } from '@/firebase/firestore/query'
import { useAlert } from '@/composables/core/notification'
import { useUser } from '@/composables/auth/user'





const fetchedIntegrations = ref([] as any[])



export const useFetchIntegrations = () => {
    const { id: user_id } = useUser()
    const loading = ref(false)

    const fetchUserIntegrations = async () => {
        loading.value = true
        fetchedIntegrations.value = []

        try {
            await getFirestoreSubCollection('users', user_id.value!, 'integrations', fetchedIntegrations)
            loading.value = false
        } catch (e: any) {
            loading.value = false
            useAlert().openAlert({ type: 'ERROR', msg: `Error: ${e.message}` })
        }
    }
    return { loading, fetchedIntegrations, fetchUserIntegrations }
}




export const useFetchCalendarIntegrations = () => {
    const { id: user_id } = useUser()
    const calendarIntegrations = ref([])
    const STORAGE_KEY = 'calendarIntegrations'

    // Get initial data from localStorage if available
    const getStoredIntegrations = () => {
        if (process.client) {
            const stored = localStorage.getItem(STORAGE_KEY)
            return stored ? JSON.parse(stored) : null
        }
        return null
    }

    const fetchCalendarIntegrations = async () => {
        await getFirestoreSubCollectionWithWhereQuery('users', user_id.value!, 'integrations', calendarIntegrations, { name: 'type', operator: '==', value: 'CALENDAR' })
        if (calendarIntegrations.value.length) {
            setAllCalendarIntegrationsStorage(calendarIntegrations.value)
        }
    }

    const setAllCalendarIntegrationsStorage = (data) => {
        if (!data.length) return
        if (process.client) {
            // Convert array to object using ID as key
            const integrationsMap = data.reduce((acc, integration) => {
                acc[integration.id] = integration
                return acc
            }, {})
            localStorage.setItem(STORAGE_KEY, JSON.stringify(integrationsMap))
        }
    }

    const getCalendarIntegrationsStorage = async () => {
        const stored = getStoredIntegrations()
        if (!stored) {
            await fetchCalendarIntegrations()
            return Object.values(getStoredIntegrations())
        }
        return Object.values(stored)
    }

    return { fetchCalendarIntegrations, getCalendarIntegrationsStorage }
}

