import { updateFirestoreSubDocument } from '@/firebase/firestore/edit'
import { useUser } from '@/composables/auth/user'

export const useMoveTodo = () => {
    const { id: user_id } = useUser()
    const loading = ref(false)

    const moveTodo = async (evt: any, date: string) => {
        loading.value = true

        try {
            if (evt.added) {
                const { element, newIndex } = evt.added

                await updateFirestoreSubDocument(
                    'users',
                    user_id.value!,
                    'todos',
                    element.id,
                    { date: new Date(date).toISOString() }
                )
            }
        } finally {
            loading.value = false
        }
    }

    return { moveTodo, loading }
}
