<template>
	<div class="h-full p-4 overflow-auto" :class="windowHeight < 650 ? 'py-8' : 'center'">
		<div class="flex flex-col gap-8 w-full max-w-[400px] mx-auto">
			<div class="flex flex-col gap-2.5 text-center">
				<h2 class="text-textHeadline text-[34px] font-bold leading-[40px]">
					Login to your account
				</h2>
				<p class="text-textSecondary text-base font-semibold">
					Create your free account
				</p>
			</div>

			<form class="flex flex-col gap-6 mt-3" @submit.prevent="signIn">
				<div class="flex flex-col gap-0.5">
					<div class="flex items-center gap-4 justify-between">
						<label class="label">{{ isEmail ? 'Email Address' : 'Phone Number' }}</label>
						<button type="button" class="text-sm font-semibold text-grey_four" @click="isEmail = !isEmail">
							{{ isEmail ? 'Use Phone Number' : 'Use Email' }}
						</button>
					</div>
					<input v-if="isEmail" v-model.trim="authCredentienalsForm.email.value" required type="email" class="input-field" placeholder="Enter email">
					<PhoneInput v-else />
				</div>

				<div class="flex flex-col gap-0.5">
					<label class="label">Password</label>
					<div class="w-full h-fit relative">
						<input v-model.trim="authCredentienalsForm.passord.value" :type="show ? 'text' : 'password'" required class="input-field" placeholder="Enter password">
						<component :is="!show ? EyeOff : Eye" class="text-grey_six absolute top-1/2 -translate-y-1/2 right-4 w-5 cursor-pointer" @click="show = !show" />
					</div>
					<div class="flex justify-end mt-0.5">
						<NuxtLink to="/auth/forgot" class="text-sm font-semibold text-grey_four">
							Forgot password?
						</NuxtLink>
					</div>
				</div>

				<button :disabled="authCredentienalsForm.loading.value" class="btn-primary" type="submit">
					<Spinner v-if="authCredentienalsForm.loading.value" />
					<span v-else>Login</span>
				</button>
			</form>

			<div class="flex flex-col gap-6">
				<div class="flex items-center gap-2 justify-between">
					<div class="flex flex-grow border-b" />
					<span class="text-sm font-bold text-[#667185]">Or</span>
					<div class="flex flex-grow border-b" />
				</div>

				<button type="button" :disabled="loading" class="btn border bg-light gap-3" @click="googleSignin()">
					<template v-if="!loading">
						<IconsGoogle class="w-5 h-5" />
						<span class="text-base font-semibold text-subText">Continue with Google</span>
					</template>
					<Spinner v-else />
				</button>
				<div class="text-center text-sm font-bold flex items-center justify-center gap-2">
					<span class="text-[#667185]">New to Goalmatic?</span>
					<NuxtLink to="/auth/signup">
						Create an account
					</NuxtLink>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { EyeOff, Eye } from 'lucide-vue-next'
import { windowHeight } from '@/composables/utils/window'
import { useSignin, authCredentienalsForm } from '@/composables/auth/auth'
import { usePasswordlessSignin } from '@/composables/auth/passwordless'
import { useEmailAndPassword } from '@/composables/auth/email_password'


const { googleSignin, loading } = useSignin()
const { disabled, send_email, valid_email } = usePasswordlessSignin()

const { signIn } = useEmailAndPassword()

const show = ref(false)
const isEmail = ref(true)

definePageMeta({
	layout: 'auth2',
	middleware: 'is-not-authenticated'
})
</script>
