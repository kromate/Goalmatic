
import { deleteFirestoreDocument } from '@/firebase/firestore/delete'
import { useAlert } from '@/composables/core/notification'
import { useConfirmationModal } from '@/composables/core/confirmation'
import { useUser } from '@/composables/auth/user'

const deleteAgentData = ref()


export const useDeleteAgent = () => {
	const loading = ref(false)
	const { id: user_id } = useUser()

	const setDeleteAgentData = (data: Record<string, any>) => {
		deleteAgentData.value = data

		useConfirmationModal().openAlert({ type: 'Alert', title: 'Delete Agent', desc: `Are you sure you want to delete  "${deleteAgentData.value.name}" Agent? `, call_function: deleteAgent, loading })
	}
	const deleteAgent = async () => {
		loading.value = true
		try {
			await deleteFirestoreDocument('agents', deleteAgentData.value.id)
			loading.value = false
			useConfirmationModal().closeAlert()
			useAlert().openAlert({ type: 'SUCCESS', msg: 'Agent Deleted successfully' })
			useRouter().push('/assistant/agents')
		} catch (e: any) {
			loading.value = false
			useAlert().openAlert({ type: 'ERROR', msg: `Error: ${e.message}` })
		}
	}
	return { loading, deleteAgent, setDeleteAgentData }
}
