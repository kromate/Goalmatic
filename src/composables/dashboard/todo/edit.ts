import { Timestamp } from 'firebase/firestore'
import { updateFirestoreSubDocument } from '@/firebase/firestore/edit'
import { useUser } from '@/composables/auth/user'
import { useDashboardModal } from '@/composables/core/modals'
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
            await updateTodo({
                ...draggedTodo.value,
                later: true
            })
        }
        draggedTodo.value = null
    }

    return { highlightTodo, selectedTodo, updateTodo, loading, draggedTodo, onDragStart, onDropToday, onDropLater }
}
