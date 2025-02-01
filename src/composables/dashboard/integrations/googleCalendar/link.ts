
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { setFirestoreSubDocument } from '@/firebase/firestore/create'
import { getFirestoreSubCollection } from '@/firebase/firestore/fetch'
import { useAlert } from '@/composables/core/notification'
import { useUser } from '@/composables/auth/user'


const integrationKeys = {
    GOOGLECALENDAR: 'GOOGLECALENDAR'

}



export const useLinkGoogleCalendar = () => {
    const { id: user_id } = useUser()
    const loading = ref(false)

    const link = async () => {
        loading.value = true

        try {
            const { data } = await axios.get('/api/getAuthUrl')
            if (data.authUrl) {
                const authWindow = window.open(data.authUrl, '_blank')
                const id = uuidv4()

                window.addEventListener('message', async (event) => {
                    if (event.origin === window.location.origin) {
                        const oauthResult = JSON.parse(localStorage.getItem('oauth_result') as string)
                        if (oauthResult && oauthResult.success) {
                            const isDefaultCalendar = await shouldCalendarBeSetAsDefault()
                            setFirestoreSubDocument('users', user_id.value!, 'integrations', id, {
                                id,
                                access_token: oauthResult.access_token,
                                refresh_token: oauthResult.refresh_token,
                                type: 'CALENDAR',
                                provider: 'GOOGLE',
                                email: oauthResult.email,
                                expiry_date: oauthResult.expiry_date,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                                is_default: isDefaultCalendar,
                                integration_id: integrationKeys.GOOGLECALENDAR,
                                user_id: user_id.value!
                            })
                            localStorage.setItem('oauth_result', '')
                        } else {
                            // useAlert().openAlert({ type: 'ERROR', msg: 'Error during token exchange' })
                        }
                        loading.value = false
                    }
                }, { once: true })
            } else {
                throw new Error('Authorization URL not received')
            }
        } catch (error) {
            useAlert().openAlert({ type: 'ERROR', msg: 'Error getting authorization URL' })
            loading.value = false
        }
    }

    return { loading, link }
}

const shouldCalendarBeSetAsDefault = async () => {
    const { id: user_id } = useUser()
    const fetchedIntegrations = ref([])
    await getFirestoreSubCollection('users', user_id.value!, 'integrations', fetchedIntegrations)
    return fetchedIntegrations.value.length === 0
}
