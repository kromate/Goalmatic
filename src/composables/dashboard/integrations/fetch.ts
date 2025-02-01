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
    const _calendarIntegrationsCookie = useCookie('calendarIntegrations')

    const fetchCalendarIntegrations = async () => {
        await getFirestoreSubCollectionWithWhereQuery('users', user_id.value!, 'integrations', calendarIntegrations, { name: 'type', operator: '==', value: 'CALENDAR' })
        if (calendarIntegrations.value.length) {
            setAllCalendarIntegrationsCookie(calendarIntegrations.value)
        }
    }

    const setAllCalendarIntegrationsCookie = (data) => {
        if (!data.length) return
        _calendarIntegrationsCookie.value = data
    }

    const getCalendarIntegrationsCookie = async () => {
        if (!_calendarIntegrationsCookie.value) {
            await fetchCalendarIntegrations()
            return _calendarIntegrationsCookie.value
        }
        return _calendarIntegrationsCookie.value
    }

    return { fetchCalendarIntegrations, getCalendarIntegrationsCookie }
}

