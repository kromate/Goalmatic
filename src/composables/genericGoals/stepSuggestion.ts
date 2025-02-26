import { ref } from 'vue'
import { TimeLineObject } from './types'
import { useSmartGoal } from './smart'
import { useAlert } from '@/composables/core/notification'

export function useStepSuggestion() {
  const { conversationHistory } = useSmartGoal()
  const suggestionLoading = ref(false)
  const textarea = ref()
  const stepSuggestion = ref('')

  const adjustTextareaHeight = () => {
    setTimeout(() => {
      if (textarea.value) {
        textarea.value.style.height = 'auto'
        textarea.value.style.height = textarea.value.scrollHeight + 'px'
      }
    }, 100)
  }



  return {
    textarea,
    stepSuggestion,
    suggestionLoading,
    adjustTextareaHeight

  }
}
