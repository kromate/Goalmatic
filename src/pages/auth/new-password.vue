<template>
	<div class="h-full p-4 overflow-auto" :class="windowHeight < 650 ? 'py-8' : 'center'">
		<div class="flex flex-col gap-8 w-full max-w-[420px] mx-auto">
			<div class="flex flex-col gap-2.5 text-center">
				<h2 class="text-textHeadline text-[30px] font-bold leading-[40px]">
					Set your new password
				</h2>
				<p class="text-textSecondary text-base font-semibold">
					Almost there! Make sure your new password is unique
				</p>
			</div>

			<form class="flex flex-col gap-6 mt-3">
				<div class="flex flex-col gap-0.5">
					<label class="label">New Password</label>
					<div class="w-full h-fit relative">
						<input :type="show ? 'text' : 'password'" class="input-field" placeholder="Enter password">
						<component :is="!show ? EyeOff : Eye" class="text-grey_six absolute top-1/2 -translate-y-1/2 right-4 w-5 cursor-pointer" @click="show = !show" />
					</div>
				</div>

				<div class="flex flex-col gap-0.5">
					<label class="label">Confirm Password</label>
					<div class="w-full h-fit relative">
						<input :type="show ? 'text' : 'password'" class="input-field" placeholder="Enter password">
						<component :is="!show ? EyeOff : Eye" class="text-grey_six absolute top-1/2 -translate-y-1/2 right-4 w-5 cursor-pointer" @click="show = !show" />
					</div>
				</div>

				<div class="flex flex-col gap-3">
					<div class="flex items-center gap-2">
						<div class="w-[18px] h-[18px] center rounded-full border border-grey_eight text-grey_eight">
							<X :size="14" :stroke-width="2.2" />
						</div>
						<p class="text-textSecondary text-[13px] font-medium">
							Password should be at least 8 characters long.
						</p>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-[18px] h-[18px] center rounded-full border border-grey_eight text-grey_eight">
							<X v-if="false" :size="14" :stroke-width="2.2" />
						</div>
						<p class="text-textSecondary text-[13px] font-medium">
							Include a mix of letters, numbers, and symbols.
						</p>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-[18px] h-[18px] center rounded-full border border-grey_eight text-grey_eight">
							<X v-if="false" :size="14" :stroke-width="2.2" />
						</div>
						<p class="text-textSecondary text-[13px] font-medium">
							Password must match.
						</p>
					</div>
				</div>

				<button class="btn-primary mt-2">
					Change Password
				</button>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { EyeOff, X, Eye } from 'lucide-vue-next'
import { windowHeight } from '@/composables/utils/window'

const show = ref(false)

definePageMeta({
	layout: 'auth2',
	middleware: 'is-not-authenticated'
})
</script>
