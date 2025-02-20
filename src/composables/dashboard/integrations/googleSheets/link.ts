import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { setFirestoreSubDocument } from '@/firebase/firestore/create'
import { getFirestoreSubCollection } from '@/firebase/firestore/fetch'
import { useAlert } from '@/composables/core/notification'
import { useUser } from '@/composables/auth/user'

const integrationKeys = {
    GOOGLESHEETS: 'GOOGLESHEETS'
}

export const useLinkGoogleSheets = () => {
    const { id: user_id } = useUser()
    const loading = ref(false)

    const link = async () => {
        loading.value = true

        try {
            const { data } = await axios.get('/api/getAuthUrl?integration=spreadsheet')
            console.log(data)
            if (data.authUrl) {
                const authWindow = window.open(data.authUrl, '_blank')
                const id = uuidv4()

                window.addEventListener('message', async (event) => {
                    if (event.origin === window.location.origin) {
                        const oauthResult = JSON.parse(localStorage.getItem('oauth_result') as string)
                        if (oauthResult && oauthResult.success) {
                            const isDefaultSheets = await shouldSheetsBeSetAsDefault()
                            setFirestoreSubDocument('users', user_id.value!, 'integrations', id, {
                                id,
                                access_token: oauthResult.access_token,
                                refresh_token: oauthResult.refresh_token,
                                type: 'SPREADSHEET',
                                provider: 'GOOGLE',
                                email: oauthResult.email,
                                expiry_date: oauthResult.expiry_date,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                                is_default: isDefaultSheets,
                                integration_id: integrationKeys.GOOGLESHEETS,
                                user_id: user_id.value!
                            })
                            localStorage.setItem('oauth_result', '')
                        } else {
                            console.log('error')
                            // Optionally handle error with useAlert()
                        }
                        loading.value = false
                    }
                }, { once: true })
            } else {
                throw new Error('Authorization URL not received')
            }
        } catch (error) {
            useAlert().openAlert({ type: 'ERROR', msg: 'Error getting authorization URL for Google Sheets' })
            loading.value = false
        }
    }

    return { loading, link }
}

const shouldSheetsBeSetAsDefault = async () => {
    const { id: user_id } = useUser()
    const fetchedIntegrations = ref([])
    await getFirestoreSubCollection('users', user_id.value!, 'integrations', fetchedIntegrations)
    return fetchedIntegrations.value.length === 0
}
