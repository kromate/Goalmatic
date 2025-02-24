<template>
	<div class="h-full p-4 overflow-auto" :class="windowHeight < 650 ? 'py-8' : 'center'">
		<div v-if="step === 1" class="flex flex-col gap-8 w-full max-w-[400px] mx-auto transition-all">
			<div class="flex flex-col gap-2.5 text-center">
				<h2 class="text-headline text-[34px] font-bold leading-[40px]">
					Forgot Password
				</h2>
				<p class="text-textSecondary text-base font-semibold">
					No worries, Enter your email to reset your password.
				</p>
			</div>

			<form class="flex flex-col gap-8 mt-3" @submit.prevent="sendRestEmail">
				<div class="flex flex-col gap-0.5">
					<label class="label">Email</label>
					<input v-model.trim="authCredentienalsForm.email.value" required type="email" class="input-field" placeholder="Enter email">
				</div>

				<button type="submit" class="btn-primary" :disabled="authCredentienalsForm.loading.value">
					<Spinner v-if="authCredentienalsForm.loading.value" />
					<span v-else>Reset Password</span>
				</button>
				<NuxtLink to="/auth/login" class="text-dark text-sm font-bold text-center center gap-1.5">
					<MoveLeft :size="15" :stroke-width="2.6" class="" />
					Back to login
				</NuxtLink>
			</form>
		</div>

		<div v-else class="flex flex-col gap-7 max-w-[300px] mx-auto">
			<h2 class="text-[28px] font-bold text-headline text-center leading-[33px]">
				We’ve sent a reset <br> link to your email
			</h2>
			<p class="font-medium leading-[28px] text-sm text-textSecondary text-center">
				Didn't get the email? <br> Check your spam or junk folder. <br> Still no luck? <span class="text-primary">Resend link</span> or <span class="text-primary">contact us</span>
			</p>
			<NuxtLink to="/auth/login" class="text-dark text-sm font-bold text-center center gap-1.5">
				<MoveLeft :size="15" :stroke-width="2.6" class="" />
				Back to login
			</NuxtLink>
		</div>
	</div>
</template>

<script setup lang="ts">
import { MoveLeft } from 'lucide-vue-next'
import { windowHeight } from '@/composables/utils/window'
import { useForgotPassword } from '@/composables/auth/forgot'
import { authCredentienalsForm } from '@/composables/auth/auth'
import { usePasswordlessSignin } from '@/composables/auth/passwordless'

const { sendRestEmail, step } = useForgotPassword()
const { valid_email } = usePasswordlessSignin()


const referred = ref('')
onMounted(() => {
	referred.value = useRoute().query.refer as string
	localStorage.setItem('taaskly_referral', referred.value)
})


definePageMeta({
	layout: 'auth2',
	middleware: 'is-not-authenticated'
})
</script>
