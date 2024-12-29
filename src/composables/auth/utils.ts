import { User } from 'firebase/auth'
import { unauthorisedGoalSync, syncAfterAuth } from '../genericGoals/timeline'
import { useUser } from './user'


export const afterAuthCheck = async (user: User | null) => {
    if (user) {
        const { fetchUserProfile } = useUser()
        const userProfile = await fetchUserProfile(user.uid) as any
        if (!userProfile?.value?.name) {
            useRouter().push('/auth/profile')
            return
        }
        if (unauthorisedGoalSync.value.step) {
            useRouter().push('/create')
            setTimeout(() => {
                syncAfterAuth()
            }, 100)
            return
        }
         const redirectUrl = useUser().redirectUrl.value
         useUser().redirectUrl.value = null
         useRouter().push(redirectUrl ?? '/goals')
    }
}

