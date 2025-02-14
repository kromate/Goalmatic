import { updateFirestoreDocument } from '@/firebase/firestore/edit'
import { useAlert } from '@/composables/core/notification'
import { formattedAvailableTools } from '@/composables/dashboard/assistant/agents/tools/fetch'
import { useSelectAgent } from '@/composables/dashboard/assistant/agents/select'
import { useFetchIntegrations } from '@/composables/dashboard/integrations/fetch'

const isEditingSystemInfo = ref(false)
const systemInfoModel = ref('')
const isEditingTools = ref(false)
const toolsModel = ref([] as any[])
const toolSearch = ref('')
const UserIntegrations = ref<Record<string, any>[]>([])

const filteredTools = computed(() => {
    return formattedAvailableTools(UserIntegrations.value).filter((tool) => {
        return tool.name.toLowerCase().includes(toolSearch.value.toLowerCase())
    })
})

export const useEditAgent = () => {
    const updateSystemInfoLoading = ref(false)
    const updateToolsLoading = ref(false)
    const { selectedAgent } = useSelectAgent()

    watch(isEditingTools, async () => {
        if (isEditingTools.value) {
            const { fetchedIntegrations, fetchUserIntegrations } = useFetchIntegrations()
            await fetchUserIntegrations()
            UserIntegrations.value = fetchedIntegrations.value
        }
    })

    const updateSystemInfo = async (id: string, spec: Record<string, any>) => {
        if (id === '0') return

        updateSystemInfoLoading.value = true
        try {
            const updatedSpec = {
                ...spec,
                systemInfo: systemInfoModel.value
            }

            await updateFirestoreDocument('agents', id, {
                spec: updatedSpec,
                updated_at: new Date().toISOString()
            })
            isEditingSystemInfo.value = false
            useAlert().openAlert({ type: 'SUCCESS', msg: 'System information updated successfully' })

            if (selectedAgent.value?.id === id) {
                selectedAgent.value.spec = updatedSpec
            }

            return updatedSpec
        } catch (error: any) {
            useAlert().openAlert({ type: 'ERROR', msg: `Error updating system information: ${error.message}` })
            throw error
        } finally {
            updateSystemInfoLoading.value = false
        }
    }

    const updateTools = async (id: string, spec: Record<string, any>) => {
        if (id === '0') return

        updateToolsLoading.value = true
        try {
            const updatedSpec = {
                ...spec,
                tools: toolsModel.value
            }

            await updateFirestoreDocument('agents', id, {
                spec: updatedSpec,
                updated_at: new Date().toISOString()
            })
            isEditingTools.value = false
            useAlert().openAlert({ type: 'SUCCESS', msg: 'Tools updated successfully' })

            if (selectedAgent.value?.id === id) {
                selectedAgent.value.spec = updatedSpec
            }

            return updatedSpec
        } catch (error: any) {
            useAlert().openAlert({ type: 'ERROR', msg: `Error updating tools: ${error.message}` })
            throw error
        } finally {
            updateToolsLoading.value = false
        }
    }

    return {
        systemInfoModel, updateSystemInfoLoading, updateToolsLoading,
        updateSystemInfo, updateTools, isEditingSystemInfo, isEditingTools,
        toolsModel, filteredTools, toolSearch
    }
}
