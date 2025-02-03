import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@/composables/auth/user'
import { useAlert } from '~/src/composables/core/notification'
import { callFirebaseFunction } from '~/src/firebase/functions'
import { getSingleFirestoreDocument } from '~/src/firebase/firestore/fetch'
import { setFirestoreSubDocument } from '@/firebase/firestore/create'
import { useIntegrationsModal } from '~/src/composables/core/modals'


const loading = ref(false)
const step = ref(1)
const phoneNumber = ref('')
const otp = ref([])

export const useLinkWhatsapp = () => {
    const { id: user_id } = useUser()


    const link = async () => {
        useIntegrationsModal().openConnectWhatsapp()
    }

    const sendOTP = async () => {
        if (!validatePhoneNumber(phoneNumber.value)) {
            useAlert().openAlert({ type: 'ERROR', msg: 'Invalid phone number' })
            return
        }
        loading.value = true
        const res = await callFirebaseFunction('sendWhatsappOTP', { phoneNumber: phoneNumber.value }) as any
        if (res.code === 200) {
            step.value = 2
            useAlert().openAlert({ type: 'SUCCESS', msg: res?.msg || 'OTP sent to whatsapp' })
        } else {
            useAlert().openAlert({ type: 'ERROR', msg: res?.msg || 'Failed to send OTP' })
        }
        loading.value = false
    }

    const confirmOTP = async () => {
        const otpCode = otp.value.join('')
        const userRef = ref()
        await getSingleFirestoreDocument('users', user_id.value!, userRef)
        const sentOTP = userRef.value?.otp
        if (otpCode !== sentOTP) {
            useAlert().openAlert({ type: 'ERROR', msg: 'Invalid OTP' })
            return
        }

        const id = uuidv4()
        setFirestoreSubDocument('users', user_id.value!, 'integrations', id, {
            id,
            type: 'MESSAGING',
            provider: 'WHATSAPP',
            phone: phoneNumber.value.replace('+', '').trim(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            integration_id: 'WHATSAPP',
            user_id: user_id.value!
        })

        useIntegrationsModal().closeConnectWhatsapp()
        useAlert().openAlert({ type: 'SUCCESS', msg: 'Whatsapp connected successfully' })
    }

    return { loading, link, sendOTP, confirmOTP, step, phoneNumber, otp }
}

const validatePhoneNumber = (phone: string): boolean => {
    // Basic validation for length and digits
    if (phone.length < 10) {
        return false
    }
    return true
}
