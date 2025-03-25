import { v4 as uuidv4 } from 'uuid'
import { Timestamp } from 'firebase/firestore'
import { useTodoDate } from './date_logic'
import { setFirestoreSubDocument } from '@/firebase/firestore/create'
import { useUser } from '@/composables/auth/user'

const createTodoForm = reactive({
    title: '',
    desc: '',
    date: '',
    later: false,
    completed: false
})



export const useCreateTodo = () => {
    const { dateState } = useTodoDate()
    const { id: user_id } = useUser()

    const loading = ref(false)

    const createTodo = async (todoTitle: string) => {
        loading.value = true
        const id = uuidv4()
        const current_date = new Date(`${dateState.day}/${dateState.month}/${dateState.year}`)
        createTodoForm.date = current_date.toISOString()
        createTodoForm.title = todoTitle
        const sent_data = {
            ...createTodoForm,
            created_at: Timestamp.fromDate(new Date()),
            updated_at: Timestamp.fromDate(new Date()),
            user_id: user_id.value!,
            id
        }

        await setFirestoreSubDocument('users', user_id.value!, 'todos', id, sent_data)
        loading.value = false
        createTodoForm.date = ''
    }

    return { createTodo, createTodoForm }
}
