import { getFirestoreSubCollection } from '@/firebase/firestore/fetch'
import { useAlert } from '@/composables/core/notification'
import { useUser } from '@/composables/auth/user'





const fetchedContacts = ref([] as any[])

const contactIsEmpty = computed(() => {
    return fetchedContacts.value.length === 0
})

export const useFetchContacts = () => {
    const { id: user_id } = useUser()
    const loading = ref(false)

    const fetchUserContacts = async () => {
        loading.value = true
        fetchedContacts.value = []

        try {
            await getFirestoreSubCollection('users', user_id.value!, 'contacts', fetchedContacts)


            loading.value = false
        } catch (e: any) {
            loading.value = false
            useAlert().openAlert({ type: 'ERROR', msg: `Error: ${e.message}` })
        }
    }

    return { loading, fetchedContacts, fetchUserContacts, contactIsEmpty }
}

