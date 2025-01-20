import { getSingleFirestoreDocument } from '@/firebase/firestore/fetch'
import { useAlert } from '@/composables/core/notification'


    const agentDetails = ref({} as Record<string, any>)
    const loading = ref(false)

export const useFetchAgentsById = () => {
    const fetchAgentsById = async (id:string) => {
        loading.value = true


        try {
            await getSingleFirestoreDocument('agents', id, agentDetails)
            loading.value = false
        } catch (e: any) {
			loading.value = false
			useAlert().openAlert({ type: 'ERROR', msg: `Error: ${e.message}` })
		}
    }


        return { fetchAgentsById, agentDetails, loading }
 }
