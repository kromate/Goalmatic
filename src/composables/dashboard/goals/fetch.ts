import { getFirestoreCollectionWithWhereQuery } from '@/firebase/firestore/query'
import { useAlert } from '@/composables/core/notification'
import { useUser } from '@/composables/auth/user'



export const useFetchUserGoals = () => {
    const { id: user_id } = useUser()
    const userGoals = ref([] as any)
    const loading = ref(false)



    const fetchUserGoals = async () => {
        loading.value = true


        try {
            await getFirestoreCollectionWithWhereQuery('goals', userGoals, { name: 'user_id', operator: '==', value: user_id.value })
            loading.value = false
        } catch (e: any) {
			loading.value = false
			useAlert().openAlert({ type: 'ERROR', msg: `Error: ${e.message}` })
		}
    }

    return { fetchUserGoals, userGoals, loading }
 }
