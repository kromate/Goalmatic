import { getSingleFirestoreDocument } from '@/firebase/firestore/fetch'
import { useAlert } from '@/composables/core/notification'


    const goalDetails = ref({} as Record<string, any>)
    const loading = ref(false)

export const useFetchGoalsById = () => {
    const fetchGoalsById = async (id:string) => {
        loading.value = true


        try {
            await getSingleFirestoreDocument('goals', id, goalDetails)
            loading.value = false
        } catch (e: any) {
			loading.value = false
			useAlert().openAlert({ type: 'ERROR', msg: `Error: ${e.message}` })
		}
    }

    const milestones = computed(() => goalDetails.value?.milestones || [])
    const todos = computed(() => goalDetails.value?.todos || [])

    return { fetchGoalsById, goalDetails, loading, milestones, todos }
 }
