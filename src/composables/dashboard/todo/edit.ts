import { Timestamp } from 'firebase/firestore'
import { updateFirestoreSubDocument } from '@/firebase/firestore/edit'
import { useUser } from '@/composables/auth/user'
import { useDashboardModal } from '@/composables/core/modals'
import { Todo } from '@/types/todo'

const selectedTodo = ref()

export const useEditTodo = () => {
    const draggedTodo = ref()

    const { id: user_id } = useUser()
    const loading = ref(false)
    const highlightTodo = (todo: Record<string, any>) => {
        selectedTodo.value = todo
        useDashboardModal().openEditTodo()
    }

    const updateTodo = async (data: Record<string, any>) => {
        loading.value = true
        const sent_data = {
            ...data,
            user_id: user_id.value,
            updated_at: Timestamp.fromDate(new Date())
        } as Record<string, any>

        await updateFirestoreSubDocument('users', user_id.value!, 'todos', sent_data?.id, sent_data)
        useDashboardModal().closeEditTodo()
        loading.value = false
    }

    // Drag and drop functionality
    function onDragStart(event, todo) {
        draggedTodo.value = todo
        event.dataTransfer.effectAllowed = 'move'
    }

    async function onDropToday() {
        if (draggedTodo.value && draggedTodo.value.later) {
            // When moving from Later to Today, update the task's date to the current selected date
            // and set later to false
            await updateTodo({
                ...draggedTodo.value,
                later: false
            })
        }
        draggedTodo.value = null
    }

    async function onDropLater() {
        if (draggedTodo.value && !draggedTodo.value.later && !draggedTodo.value.completed) {
            // Move from "Today" to "Later" only if it's not completed
            // When moving to Later, keep the original due date but mark it as later
            await updateTodo({
                ...draggedTodo.value,
                later: true
            })
        }
        draggedTodo.value = null
    }

    const updateTodoDate = async (todo: Todo, newDate: string) => {
        try {
            // Make a copy of the todo to avoid reference issues
            const updatedTodo = { ...todo, date: newDate }

            // If task is moved to a new date, it shouldn't be in the "Later" section
            if (todo.later) {
                updatedTodo.later = false
            }

            // Call your API to update the todo
            await updateTodo(updatedTodo)

            return true
        } catch (error) {
            console.error('Error updating todo date:', error)
            return false
        }
    }

    return { highlightTodo, selectedTodo, updateTodo, loading, draggedTodo, onDragStart, onDropToday, onDropLater, updateTodoDate }
}
