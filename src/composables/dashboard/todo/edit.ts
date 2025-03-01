import { Timestamp } from 'firebase/firestore'
import { updateFirestoreSubDocument } from '@/firebase/firestore/edit'
import { useUser } from '@/composables/auth/user'
import { useDashboardModal } from '@/composables/core/modals'
const selectedTodo = ref()

export const useEditTodo = () => {
    const { id: user_id } = useUser()
    const loading = ref(false)
    const highlightTodo = (todo: Record<string, any>) => {
        selectedTodo.value = todo
        useDashboardModal().openEditTodo()
    }

    const updateTodo = async () => {
        loading.value = true
        const sent_data = {
            title: selectedTodo.value.title,
            description: selectedTodo.value.description || '',
            updated_at: Timestamp.fromDate(new Date())
        }

        console.log(sent_data)
        await updateFirestoreSubDocument('users', user_id.value!, 'todos', selectedTodo.value.id, sent_data)
        useDashboardModal().closeEditTodo()
        loading.value = false
    }

    return { highlightTodo, selectedTodo, updateTodo, loading }
}
