import { useAlert } from '@/composables/core/notification'
import { useAssistantModal } from '@/composables/core/modals'

const modalData = ref({
  title: 'Edit Tool Config',
  fields: [] as any[],
  config: {} as Record<string, any>
})

const selectedTool = ref<any>(null)

// Store tool configs in memory
export const agentToolConfigs = ref<Record<string, any>>({})

export const useEditToolConfig = () => {
  const loading = ref(false)

  const editToolConfig = (tool: any) => {
    selectedTool.value = tool
    modalData.value.title = `Edit ${tool.name} Config`
    modalData.value.fields = tool.config

    // Initialize or use existing config from memory
    if (!agentToolConfigs.value?.[tool.id]) {
      agentToolConfigs.value[tool.id] = tool.config.reduce((acc: Record<string, any>, field: any) => {
        acc[field.key] = field.value || ''
        return acc
      }, {})
    }

    modalData.value.config = agentToolConfigs.value[tool.id]

    useAssistantModal().openEditToolConfig()
  }

  const updateConfig = async () => {
    try {
      loading.value = true

      // Update config in memory
      agentToolConfigs.value[selectedTool.value.id] = { ...modalData.value.config }


      loading.value = false
      useAlert().openAlert({ type: 'SUCCESS', msg: 'Config updated successfully' })
      useAssistantModal().closeEditToolConfig()
    } catch (error) {
      loading.value = false
      useAlert().openAlert({ type: 'ERROR', msg: `Error: ${error}` })
    }
  }

  // Helper function to get tool config
  const getToolConfig = (toolId: string) => {
    return agentToolConfigs.value[toolId] || {}
  }

  // Function to get all configured tools with their abilities
  const getConfiguredTools = () => {
    return agentToolConfigs.value
  }

  return {
    loading,
    editToolConfig,
    modalData,
    updateConfig,
    getToolConfig,
    getConfiguredTools,
    agentToolConfigs
  }
}
