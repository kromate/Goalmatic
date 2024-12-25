import { watchDebounced } from '@vueuse/core'
import { ProfileType } from '../types/profile'
import { afterAuthCheck } from '../utils'
import { convertObjWithRefToObj } from '@/composables/utils/formatter'
import { useAlert } from '@/composables/core/notification'
import { useUser } from '@/composables/auth/user'
import { callFirebaseFunction } from '@/firebase/functions'
import { useGenerateGoalActionableStep } from '@/composables/genericGoals/timeline'
import { getSingleFirestoreDocument } from '@/firebase/firestore/fetch'



const profileFormState = {
	username: ref(''),
	name: ref(''),
	email: ref(''),
	phone: ref('')

}



export const useCreateProfile = () => {
	const { unauthorisedGoalSync } = useGenerateGoalActionableStep()
	const { id, setUserProfile } = useUser()
	const loading = ref(false)
	const phoneNumError = ref()
	watch(profileFormState.phone, (val) => {
		if (val && val.length < 10) {
			phoneNumError.value = 'Invalid Phone Number'
		} else {
			phoneNumError.value = null
		}
	})
	const createProfile = async () => {
		loading.value = true



		try {
			const sent_date = { id: id.value, ...convertObjWithRefToObj(profileFormState), created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as ProfileType

			const res = await callFirebaseFunction('createUserProfileForGoals', sent_date) as any
			if (res.success) {
				setUserProfile(sent_date)
				const redirectUrl = useUser().redirectUrl.value
				useUser().redirectUrl.value = null
				useRouter().push(redirectUrl ?? '/goals')
			} else {
				useAlert().openAlert({ type: 'ERROR', msg: res.msg })
				loading.value = false
			}
		} catch (e: any) {
			loading.value = false
			useAlert().openAlert({ type: 'ERROR', msg: `Error: ${e.message}` })
		}
	}

	const initForm = () => {
		profileFormState.phone.value = useUser().user.value?.phoneNumber as string
		profileFormState.email.value = useUser().user.value?.email as string
		profileFormState.name.value = useUser().user.value?.displayName as string
	}

	const checkIfProfileExists = async () => {
		const { id: user_id } = useUser()
		const userProfile = ref<ProfileType>()
		await getSingleFirestoreDocument('users', user_id.value as string, userProfile)
		if (userProfile.value?.id) {
			const redirectUrl = useUser().redirectUrl.value
			useUser().redirectUrl.value = null
			useRouter().push(redirectUrl ?? '/goals')
		}
	}

	return {
		createProfile, checkIfProfileExists,
		profileFormState,
		loading,
		initForm,
		phoneNumError
	}
}





export const useUsername = () => {
	const isUsernameAvailable = ref(true)
	const loading = ref(false)

	const checkUsername = async () => {
		loading.value = true
		profileFormState.username.value = profileFormState.username.value.replace(/ /g, '').toLowerCase()


		const { exists } = await callFirebaseFunction('checkUsernameForGoals', { username: profileFormState.username.value }) as any



		if (exists) {
			isUsernameAvailable.value = false
		} else {
			isUsernameAvailable.value = true
		}
		loading.value = false
	}

	watchDebounced(profileFormState.username, checkUsername, { debounce: 500 })

	return { isUsernameAvailable, checkUsername, loading }
}


