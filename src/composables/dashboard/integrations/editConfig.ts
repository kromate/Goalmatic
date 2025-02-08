import { availableIntegrations } from '@/composables/dashboard/integrations/list'
import { updateFirestoreSubDocument } from '@/firebase/firestore/edit'
import { useUser } from '@/composables/auth/user'
import { useAlert } from '@/composables/core/notification'



export type EditConfigField = {
    name: string,
    key: string,
    type: EditConfigFieldType,
    required: boolean,
    options?: () => Promise<any>
}

type EditConfigFieldType = 'TEXT' | 'SELECT' | 'LINK'

const modalData = ref({
    title: 'Edit Config',
    updateFn: () => { },
    fields: [] as EditConfigField[],
    options: [] as { label: string, value: string }[] | undefined,
    config: {} as Record<string, any>
})


const selectedIntegrationId = ref('')


export const useEditIntegrationsConfig = () => {
    const loading = ref(false)
    const { id: user_id } = useUser()

    const editConfig = async (data: { id: string, integration_id: string, config?: Record<string, any> }) => {
        selectedIntegrationId.value = data.id
        modalData.value.config = data.config ?? {}

        const integration = availableIntegrations().find((integration) => integration.id === data.integration_id)
        if (integration) {
            modalData.value.title = `Edit ${integration.name} Config`
            modalData.value.fields = integration.globalConfig ?? []
            for (const field of modalData.value.fields) {
                if (field.options) {
                    field.options = (await field.options()).map((option) => ({ label: option.name, value: option.id }))
                }
            }
        }
        const { useIntegrationsModal } = await import('@/composables/core/modals')
        useIntegrationsModal().openEditConfig()
        loading.value = true
    }

    const updateConfig = async () => {
        try {
            loading.value = true
            updateFirestoreSubDocument('users', user_id.value!, 'integrations', selectedIntegrationId.value, {
                config: modalData.value.config
            })
            loading.value = false
            useAlert().openAlert({ type: 'SUCCESS', msg: 'Config updated successfully' })
        } catch (error) {
            loading.value = false
            useAlert().openAlert({ type: 'ERROR', msg: `Error: ${error}` })
        } finally {
            const { useIntegrationsModal } = await import('@/composables/core/modals')
            useIntegrationsModal().closeEditConfig()
        }
    }
    return { loading, editConfig, modalData, updateConfig }
}


