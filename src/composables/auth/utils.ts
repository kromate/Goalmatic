import { User } from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'
import { unauthorisedGoalSync, syncAfterAuth } from '../genericGoals/timeline'
import { useUser } from './user'
import { setFirestoreDocument } from '@/firebase/firestore/create'


export const afterAuthCheck = async (user: User | null) => {
    if (user) {
        const { fetchUserProfile } = useUser()
        const userProfile = await fetchUserProfile(user.uid) as any
        if (!userProfile?.value?.name) {
            await setFirestoreDocument('users', user.uid, {
                id: user.uid,
                name: user.displayName,
                photo_url: user.photoURL,
                email: user.email,
                phone: user.phoneNumber,
                username: user.displayName,
                created_at: Timestamp.fromDate(new Date()),
                updated_at: Timestamp.fromDate(new Date()),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            })
        }
        if (unauthorisedGoalSync.value.steps) {
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

