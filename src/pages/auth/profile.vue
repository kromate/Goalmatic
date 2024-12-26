<template>
	<div class="h-full p-4 overflow-auto" :class="windowHeight < 650 ? 'py-8' : 'center'">
		<div class="flex flex-col gap-8 w-full max-w-[400px] mx-auto">
			<div class="flex flex-col gap-2.5 text-center">
				<h2 class="text-textHeadline text-[34px] font-bold leading-[40px]">
					Create your profile
				</h2>
				<p class="text-textSecondary text-base font-semibold">
					Email: {{ profileFormState.email.value || 'No Email' }}
				</p>
			</div>

			<form class="flex flex-col gap-6 mt-3" @submit.prevent="createProfile">
				<div class="flex flex-col gap-0.5">
					<label class="label">Full name</label>
					<input v-model.trim="profileFormState.name.value" required type="text" class="input-field" placeholder="Enter fullname">
				</div>
				<div class="flex flex-col gap-0.5">
					<label class="label">Username</label>
					<div class="w-full h-fit relative">
						<span class="absolute top-1/2 -translate-y-1/2 left-4 text-sm text-[#908F93]">@</span>
						<input v-model.trim="profileFormState.username.value" required type="text" class="input-field pl-9" placeholder="Enter username"
							:class="[!isUsernameAvailable ? '!border-red' : '']"
						>
						<span v-if="!isUsernameAvailable" class="absolute top-1/2 -translate-y-1/2 right-3 whitespace-nowrap text-sm text-red">
							Username taken
						</span>
						<Spinner v-if="usernameLoading" class="!border-t-primary !border-[#0c030366] !h-6 !w-6 absolute right-4 top-[12px]" />
					</div>
				</div>
				<div class="flex flex-col gap-0.5">
					<label class="label">Phone No (Whatsapp Preferred)</label>
					<NewPhoneInput v-model="profileFormState.phone.value" />
				</div>
				<!-- <div class="h-[500px]" /> -->

				<button type="submit" class="btn-primary mt-3" :disabled="loading || disabled">
					<Spinner v-if="loading" />
					<span v-else>Create Profile</span>
				</button>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { windowHeight } from '@/composables/utils/window'
import { useCreateProfile, useUsername } from '@/composables/auth/profile/create'
import { useUser } from '@/composables/auth/user'

const { loading, profileFormState, createProfile, initForm, phoneNumError, checkIfProfileExists } = useCreateProfile()
const { isUsernameAvailable, loading: usernameLoading } = useUsername()


initForm()

const { user } = useUser()

onMounted(() => {
	checkIfProfileExists()
})

const disabled = computed(() => {
	return !isUsernameAvailable.value || usernameLoading.value || phoneNumError.value || loading.value
})


definePageMeta({
	layout: 'auth2',
	middleware: 'is-authenticated'
})
</script>
