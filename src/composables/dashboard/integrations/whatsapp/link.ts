import { useUser } from '@/composables/auth/user'



export const useLinkWhatsapp = () => {
    const { id: user_id } = useUser()
    const loading = ref(false)

    const link = async () => {
        console.log('link whatsapp')
        loading.value = true
    }

    return { loading, link }
}
