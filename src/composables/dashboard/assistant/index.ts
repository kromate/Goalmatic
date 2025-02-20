import { selectedAgent } from './agents/select'
import { useAlert } from '@/composables/core/notification'
import { callFirebaseFunction } from '~~/src/firebase/functions'

const conversationHistory = ref([] as any)
const ai_loading = ref(false)
const sessionId = ref<string | null>(null)


export const useChatAssistant = () => {
  const userInput = ref<string>('')

  const sendMessage = async () => {
    if (!userInput.value.trim()) return

    const sentUserInput = userInput.value.trim()
    userInput.value = ''
    ai_loading.value = true

    conversationHistory.value.push({
      role: 'user',
      parts: sentUserInput
    })


    try {
      const sent_data = {
        prompt: sentUserInput,
        history: conversationHistory.value,
        sessionId: sessionId.value,
        agent: selectedAgent.value
      }

      console.log(sent_data)
      const data = await callFirebaseFunction('messageAgent', sent_data) as any

      if (data.sessionId) {
        sessionId.value = data.sessionId
      }


      conversationHistory.value.push({
        role: 'assistant',
        parts: data.response
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

