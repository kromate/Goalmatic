import { ref } from 'vue'
import { useUser } from '../../auth/user'
import { deleteFirestoreSubCollectionDocument } from '@/firebase/firestore/delete'
import { useAlert } from '@/composables/core/notification'
import { useConfirmationModal } from '@/composables/core/confirmation'

const deleteTodoData = ref()

export const useDeleteTodo = () => {
    const loading = ref(false)
    const { id: user_id } = useUser()

    const setDeleteTodoData = (todo: any) => {
        deleteTodoData.value = todo

        useConfirmationModal().openAlert({
            type: 'Alert',
            title: 'Delete Todo',
            desc: `Are you sure you want to delete "${deleteTodoData.value.title || 'this todo'}"?`,
            call_function: deleteTodo,
            loading
        })
    }

    const deleteTodo = async () => {
        loading.value = true
        try {
            await deleteFirestoreSubCollectionDocument('users', user_id.value!, 'todos', deleteTodoData.value.id)
            loading.value = false
            useConfirmationModal().closeAlert()
            useAlert().openAlert({ type: 'SUCCESS', msg: 'Todo deleted successfully' })
        } catch (e: any) {
            loading.value = false
            useAlert().openAlert({ type: 'ERROR', msg: `Error: ${e.message}` })
        }
    }

    return { loading, deleteTodo, setDeleteTodoData }
}
