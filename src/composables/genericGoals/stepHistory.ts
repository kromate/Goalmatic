import { ref, watch } from 'vue'
import { TimeLineObject } from './types'
import { useHistoryTracker } from '@/lib/history'
import { useAlert } from '@/composables/core/notification'

export function useStepHistory(originalSteps: Ref<TimeLineObject[]>, loading: Ref<boolean>) {
  // Create a reactive reference to steps that we can track with history
  const steps = ref<TimeLineObject[]>([])

  // Set up history tracking for steps
  const stepsHistory = useHistoryTracker(steps, { deep: true })
  const { canUndo, canRedo, history } = stepsHistory

  // Watch for changes in the original steps and update our tracked steps
  watch(originalSteps, (newSteps) => {
    steps.value = newSteps
    if (!loading.value) {
      stepsHistory.commit()
    }
  }, { deep: true })

  // Undo and redo functions
  const undoStepChanges = () => {
    stepsHistory.undo()
    useAlert().openAlert({
      type: 'SUCCESS',
      msg: 'Changes undone'
    })
  }

  const redoStepChanges = () => {
    stepsHistory.redo()
    useAlert().openAlert({
      type: 'SUCCESS',
      msg: 'Changes redone'
    })
  }

  return {
    steps,
    canUndo,
    canRedo,
    history,
    undoStepChanges,
    redoStepChanges
  }
}
