
import { updateFirestoreSubDocument } from '@/firebase/firestore/edit'
import { useUser } from '@/composables/auth/user'

export const useUpdateCompleteStatusOfTodo = () => {
    const { id: user_id } = useUser()

    const updateCompleteStatusOfTodo = async (todo: any, completed: boolean) => {
        await updateFirestoreSubDocument('users', user_id.value!, 'todos', todo.id, { completed })
    }

    return { updateCompleteStatusOfTodo }
}



