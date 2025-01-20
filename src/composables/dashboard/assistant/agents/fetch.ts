import { getFirestoreCollectionWithWhereQuery } from '@/firebase/firestore/query'
import { useAlert } from '@/composables/core/notification'
import { useUser } from '@/composables/auth/user'

const defaultAgent = {
    id: 0,
    name: 'Goalmatic 1.0',
    description: 'The Default plain agent for Goalmatic',
    spec: {
        systemInfo: 'You are a helpful assistant',
        tools: []
    }
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
    return { loading, fetchedAllAgents, fetchedUserAgents, fetchAllAgents, defaultAgent }
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
    }

    return { loading, fetchedUserAgents, fetchUserAgents }
}
