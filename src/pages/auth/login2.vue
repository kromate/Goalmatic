<template>
	<div class="auth-box">
		<nuxt-link to="/">
			<img src="/lt.svg" alt="logo">
		</nuxt-link>

		<h1 class="auth-title">
			Welcome Home
		</h1>
		<p class="text-2xl text-dark text-center font-semibold  tracking-wide -mt-3">
			Login to your account
		</p>
		<AuthTabs v-model="authType" />

		<form v-if="authType=== 'email'" class="auth-form" @submit.prevent="signIn()">
			<div class="field">
				<label for="email">Email Address</label>
				<input
					id="email"
					v-model="authCredentienalsForm.email.value"
					placeholder="Enter a valid Email address"
					type="email"
					class="input-field"
					autocomplete="off"
					required
				>
			</div>
			<div class="field relative">
				<section class="flex w-full justify-between">
					<label for="password">Password</label>
					<button class="font-medium text-primary underline disabled:text-grey_four disabled:cursor-not-allowed text-sm" :disabled="authCredentienalsForm.loading.value || valid_email" type="button" @click="send_email">
						login with email link
					</button>
				</section>

				<input
					id="passowrd"
					v-model="authCredentienalsForm.passord.value"
					autocomplete="off"
					placeholder="Enter password"
					:type="showPassword ? 'text' : 'Password'"
					class="input-field"
					required
				>
				<EyeIcon class="w-5 h-5 absolute top-[53%] right-4" @click="toggleShow" />
			</div>
			<div class="flex justify-between items-center text-xs w-full">
				<label for="remember" class="mb-0">
					<input id="remember" type="checkbox">
					<span class="text-grey6">Remember me</span>
				</label>

				<nuxt-link to="/auth/forgot" class="text-primary underline font-medium">
					Forgot Password?
				</nuxt-link>
			</div>
			<button class="btn-primary w-full mt-2" :disabled="authCredentienalsForm.loading.value || disabled" type="submit">
				<span v-if="!authCredentienalsForm.loading.value">Login</span>
				<Spinner v-else />
			</button>
		</form>
		<AuthPhoneForm v-else />

		<div class="flex justify-between items-center gap-2 my-2 w-full">
			<div class="border-line border-b h-1 flex-1" />
			<span class="text-dark leading-none font-bold">OR</span>
			<div class="border-line border-b h-1 flex-1" />
		</div>
		<button class="btn_flat w-full bg-dark text-light" :disabled="loading" type="button" @click="googleSignin()">
			<span v-if="!loading" class="flex items-center gap-3">	Continue with Google</span>
			<Spinner v-else />
		</button>

		<p class="text-sm mt-4 text-dark text-center">
			Don't have an Account? <nuxt-link to="/auth/register" class="font-bold underline text-dark">
				Sign up
			</nuxt-link>
		</p>
	</div>
</template>

<script setup lang="ts">
import { EyeIcon } from 'lucide-vue-next'
import { useSignin, authCredentienalsForm } from '@/composables/auth/auth'
import { usePasswordlessSignin } from '@/composables/auth/passwordless'
import { useEmailAndPassword } from '@/composables/auth/email_password'


const authType = ref('email')

const { googleSignin, loading } = useSignin()
const { disabled, send_email, valid_email } = usePasswordlessSignin()

const { signIn } = useEmailAndPassword()

const showPassword = ref(false)
const toggleShow = () => showPassword.value = !showPassword.value

definePageMeta({
	layout: 'auth',
	middleware: 'is-not-authenticated'
})
</script>

<style scoped>


</style>
