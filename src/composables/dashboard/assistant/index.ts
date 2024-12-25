import { useAlert } from '@/composables/core/notification'

const conversationHistory = ref([] as any)
const ai_loading = ref(false)

export const useChatAssistant = () => {
  const userInput = ref<string>('')

  const sendMessage = async () => {
    if (!userInput.value.trim()) return

    const sentUserInput = userInput.value.trim()
    userInput.value = ''
    ai_loading.value = true

    conversationHistory.value.push({
      role: 'user',
      parts: [{ text: sentUserInput }]
    })

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: sentUserInput,
          history: conversationHistory.value
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to get response')
      }

      const data = await response.json()

      conversationHistory.value.push({
        role: 'model',
        parts: [{ text: data.response }]
      })

      ai_loading.value = false
    } catch (error) {
      ai_loading.value = false
      console.error('Error sending message:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error sending message'
      useAlert().openAlert({ type: 'ERROR', msg: errorMessage })
    }
  }

  return { userInput, conversationHistory, sendMessage, ai_loading }
}

