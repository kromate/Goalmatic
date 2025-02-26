import { useRefHistory } from '@vueuse/core'
import type { Ref } from 'vue'

/**
 * Creates a history tracker for a ref with undo and redo functionality
 *
 * @param source The ref to track history for
 * @param options Optional configuration options
 * @returns History tracking object with undo, redo, and history state
 */
export function useHistoryTracker<T>(source: Ref<T>, options = { deep: true }) {
  const {
    history,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    commit
  } = useRefHistory(source, {
    deep: options.deep,
    capacity: 50 // Limit history to 50 entries to prevent memory issues
  })

  return {
    history,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    commit
  }
}
