import { ref } from 'vue'
import { useFetchIntegrations } from './fetch'
import { useAlert } from '@/composables/core/notification'
import { useUser } from '@/composables/auth/user'
import { deleteFirestoreSubCollectionDocument } from '@/firebase/firestore/delete'

export const useDisconnectIntegration = () => {
  const { id: user_id } = useUser()
  const loading = ref(false)
  const { fetchUserIntegrations } = useFetchIntegrations()

  const disconnectIntegration = async (id: string) => {
    loading.value = true

    try {
      // Delete the integration document from the user's integrations subcollection
      await deleteFirestoreSubCollectionDocument('users', user_id.value!, 'integrations', id)

      useAlert().openAlert({ type: 'SUCCESS', msg: 'Integration disconnected successfully' })

      // Refresh the integrations list
      await fetchUserIntegrations()
    } catch (error: any) {
      console.error('Failed to disconnect integration:', error)
      useAlert().openAlert({ type: 'ERROR', msg: `Error: ${error.message || 'Failed to disconnect integration'}` })
    } finally {
      loading.value = false
    }
  }

  return {
    disconnectIntegration,
    loading
  }
}
