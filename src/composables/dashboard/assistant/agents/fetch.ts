import { getFirestoreCollectionWithWhereQuery } from '@/firebase/firestore/query'
import { useAlert } from '@/composables/core/notification'
import { useUser } from '@/composables/auth/user'

export const defaultGoalmaticAgent = {
    id: 0,
    name: 'Goalmatic 1.0',
    description: 'The Default plain agent for Goalmatic',
    published: true,
    user: {
        name: 'goalmatic'
    },
    spec: {
        systemInfo: 'You are a helpful assistant',
        tools: []
    },
    created_at: new Date('2025-01-01').toISOString()
}



const fetchedAllAgents = ref([] as any[])
const fetchedUserAgents = ref([] as any[])



export const useFetchAgents = () => {
    const loading = ref(false)

    const fetchAllAgents = async () => {
        try {
            await getFirestoreCollectionWithWhereQuery('agents', fetchedAllAgents, { name: 'public', operator: '==', value: true }, { name: 'status', operator: '==', value: 'APPROVED' })
            loading.value = false
        } catch (e: any) {
            loading.value = false
            useAlert().openAlert({ type: 'ERROR', msg: `Error: ${e.message}` })
        }
    }
    return { loading, fetchedAllAgents, fetchedUserAgents, fetchAllAgents, defaultGoalmaticAgent }
}



export const useFetchUserAgents = () => {
    const { id: user_id } = useUser()
    const loading = ref(false)
    fetchedUserAgents.value = []

    const fetchUserAgents = async () => {
        try {
            await getFirestoreCollectionWithWhereQuery('agents', fetchedUserAgents, { name: 'user_id', operator: '==', value: user_id.value! })
            loading.value = false
        } catch (e: any) {
            loading.value = false
            useAlert().openAlert({ type: 'ERROR', msg: `Error: ${e.message}` })
        }
        return fetchedUserAgents.value
    }

    return { loading, fetchedUserAgents, fetchUserAgents }
}

export const fetchUserAgentsForIntegration = async () => {
    try {
        fetchedUserAgents.value = []
        await getFirestoreCollectionWithWhereQuery('agents', fetchedUserAgents, { name: 'user_id', operator: '==', value: useUser().id.value! })
        return fetchedUserAgents.value
    } catch (e: any) {
        useAlert().openAlert({ type: 'ERROR', msg: `Error: ${e.message}` })
    }
}
