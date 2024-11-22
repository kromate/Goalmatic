import { v4 as uuidv4 } from 'uuid'
import { setFirestoreSubDocument } from '@/firebase/firestore/create'
import { useUser } from '@/composables/auth/user'

const createBoardForm = reactive({
    title: '',
    desc: '',
    date: ''
})



export const useCreateTodo = () => {
    const { id: user_id } = useUser()

    const loading = ref(false)
    const createTodo = async () => {
        loading.value = true
        const id = uuidv4()

        const sent_data = {
            ...createBoardForm,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            id
        }

        await setFirestoreSubDocument('users', user_id.value!, 'todos', id, sent_data)
        loading.value = false
    }

    return { createTodo, createBoardForm }
}
