<template>
	<Modal
		modal="$atts.modal"
		title="Sign Out"
		:is-full-height="false"
	>
		<IconsSmiley class="size-10 mx-auto mb-3" />
		<p class="text-dark text-lg font-medium text-center">
			Are you sure you want to sign out?
		</p>

		<div class="flex gap-4 mt-5">
			<button class="btn-primary text-light flex-1" @click="useAuthModal().closeLogout()">
				No, Cancel
			</button>
			<button class="btn-primary !border-red !bg-red text-light flex-1" @click="signOut">
				Yes, Sign Out
			</button>
		</div>
	</Modal>
</template>

<script setup lang="ts">

import { useAuthModal } from '@/composables/core/modals'
import { useSignin } from '@/composables/auth/auth'
import Modal from '@/components/core/modal/Modal.vue'

const { signOut, loading } = useSignin()

</script>

<style>

</style>
