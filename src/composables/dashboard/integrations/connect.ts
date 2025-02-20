import { useLinkGoogleCalendar } from './googleCalendar/link'
import { useLinkWhatsapp } from './whatsapp/link'
import { useLinkGoogleSheets } from './googleSheets/link'




const formattedIntegrationsObjectMap = () => {
    const { link: GClink, loading: GClinkLoading } = useLinkGoogleCalendar()
    const { link: whatsappLink, loading: whatsappLinkLoading } = useLinkWhatsapp()
    const { link: GSheetsLink, loading: GSheetsLinkLoading } = useLinkGoogleSheets()
    return [
    {
        id: 'GOOGLECALENDAR',
        link: GClink,
        loading: GClinkLoading
    },
    {
        id: 'WHATSAPP',
        link: whatsappLink,
        loading: whatsappLinkLoading
    },
    {
        id: 'GOOGLESHEETS',
        link: GSheetsLink,
        loading: GSheetsLinkLoading
    }
]
}


export const useConnectIntegration = () => {
    let loading = ref(false)

    const connectIntegration = async (id: string) => {
        loading.value = true
        const formattedIntegrationObj = formattedIntegrationsObjectMap()
        const integration = formattedIntegrationObj.find((integration) => integration.id === id)
        if (integration) {
            loading = integration.loading
            try {
                await integration.link()
            } catch (error) {
                loading.value = false
                // console.error(error)
            }
        }
    }

    return { connectIntegration, loading }
}
