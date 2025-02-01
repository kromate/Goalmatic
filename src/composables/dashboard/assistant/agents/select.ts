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
        await updateFirestoreDocument('users', user_id.value!, { selected_agent_id: agentDetails.id })
        selectedAgent.value = agentDetails
        loading.value = false
        useRouter().push('/assistant')
    }

    return { loading, selectAgent, selectedAgent }
}

export const updateSelectedAgent = (agentDetails: Record<string, any>) => {
    console.log(agentDetails)
    selectedAgent.value = agentDetails
}

export const useOnAssistantLoad = () => {
    const { id: user_id } = useUser()
    const selectedUser = ref()
    const selectedAgentRef = ref()
    const fetchSelectedAgent = async () => {
        await getSingleFirestoreDocument('users', user_id.value!, selectedUser)
        if (selectedUser.value?.selected_agent_id) {
        await getSingleFirestoreDocument('agents', selectedUser.value?.selected_agent_id, selectedAgentRef)
            selectedAgent.value = selectedAgentRef.value
            console.log(selectedAgent.value)
        }
    }

    return { fetchSelectedAgent, selectedAgent }
}
