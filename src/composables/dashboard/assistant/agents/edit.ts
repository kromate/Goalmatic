import { Timestamp } from 'firebase/firestore'
import { useEditToolConfig } from './tools/config'
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
    const { getConfiguredTools } = useEditToolConfig()

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
                updated_at: Timestamp.fromDate(new Date())
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

    const updateTools = async (id: string, spec: any) => {
        try {
            updateToolsLoading.value = true

            // Get configured tools
            const configuredTools = getConfiguredTools()



            await updateFirestoreDocument('agents', id, {
                spec: {
                    ...spec,
                    tools: toolsModel.value,
                    toolsConfig: configuredTools
                }
            })

            isEditingTools.value = false
            updateToolsLoading.value = false
            useAlert().openAlert({ type: 'SUCCESS', msg: 'Tools updated successfully' })
        } catch (error) {
            updateToolsLoading.value = false
            useAlert().openAlert({ type: 'ERROR', msg: `Error: ${error}` })
        }
    }

    return {
        systemInfoModel, updateSystemInfoLoading, updateToolsLoading,
        updateSystemInfo, updateTools, isEditingSystemInfo, isEditingTools,
        toolsModel, filteredTools, toolSearch
    }
}
