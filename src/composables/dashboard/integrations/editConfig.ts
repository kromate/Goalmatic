import { availableIntegrations } from '@/composables/dashboard/integrations/list'




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





export const useEditIntegrationsConfig = () => {
    const loading = ref(false)

    const editConfig = async (data: { id: string }) => {
        const integration = availableIntegrations().find((integration) => integration.id === data.id)
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

    return { loading, editConfig, modalData }
}


