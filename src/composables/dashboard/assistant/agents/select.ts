import { useStorage } from '@vueuse/core'
import { defaultGoalmaticAgent } from './fetch'
import { updateFirestoreDocument } from '@/firebase/firestore/edit'
import { getSingleFirestoreDocument } from '@/firebase/firestore/fetch'
import { useUser } from '@/composables/auth/user'



export const selectedAgent = useStorage('selectedAgent', defaultGoalmaticAgent as Record<string, any>)


export const useSelectAgent = () => {
    const { id: user_id } = useUser()
    const loading = ref(false)

    const selectAgent = async (agentDetails: Record<string, any>) => {
        loading.value = true
        console.log(agentDetails)
        await updateFirestoreDocument('users', user_id.value!, { selected_agent: agentDetails })
        selectedAgent.value = agentDetails
        loading.value = false
        useRouter().push('/assistant')
    }
    return { loading, selectAgent, selectedAgent }
}


export const useOnAssistantLoad = () => {
    const { id: user_id } = useUser()
    const selectedUser = ref()
    const fetchSelectedAgent = async () => {
        await getSingleFirestoreDocument('users', user_id.value!, selectedUser)
        if (selectedUser.value?.selected_agent) {
            console.log(selectedUser.value?.selected_agent)
            selectedAgent.value = selectedUser.value.selected_agent
        }
    }

    return { fetchSelectedAgent, selectedAgent }
}
