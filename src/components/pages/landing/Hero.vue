<template>
	<main class="min-h-screen p-4 pt-40 relative overflow-hidden flex flex-col items-center">
		<PagesLandingInteractiveGridPattern

			:width="80"
			:height="80"
			:squares="[200, 200]"
			squares-class-name="hover:fill-blue-500"
		/>

		<div class="flex flex-col items-center md:gap-10 gap-7 z-30 2xl:mt-64  mt-16">
			<h1 class="text-headline font-bold text-[49px] md:text-[80px] lg:max-w-[800px] text-center leading-[40px] md:leading-[80px]">
				Your AI-Powered Goal Assistant
			</h1>
			<p class="text-sm md:text-[18px] text-dark text-center  md:max-w-[760px] leading-[30px]">
				Goalmatic transforms your aspirations into clear, actionable steps—complete with milestones, to-dos, and an AI assistant that keeps you on track. Stay focused on what matters most, and let us handle the rest.
			</p>
			<div class="bg-transparent border border-dark rounded-lg px-4 py-2 md:py-3 flex items-center gap-4 justify-between w-full max-w-[600px]">
				<textarea
					ref="textarea"
					v-model="userGoal"
					placeholder="What's your goal today?"
					class="h-full flex-grow focus:outline-none text-subText resize-none overflow-hidden bg-transparent"
					rows="1"
					@input="adjustTextareaHeight"
					@keydown="handleKeyDown"
				/>
				<button
					:disabled="!userGoal"
					class="btn-primary"
					@click="urlRedirect"
				>
					Go
					<MoveRight :stroke-width="2.5" :size="14" />
				</button>
			</div>
			<button class="text-sm font-semibold text-secondary center gap-0.5 mt-4 py-2 px-3 bg-secondaryLight hover:bg-[#ccc2efc4] bordertransition-all duration-500 rounded-md custom_shadow" @click="generateSampleGoal">
				<IconsMagicwand />
				No Goal in Mind? Try a Sample Goal!
			</button>
		</div>
	</main>
</template>

<script setup lang="ts">
import { MoveRight } from 'lucide-vue-next'
import { watchUserStateChange } from '@/firebase/auth'
import { useUser } from '@/composables/auth/user'
import { useSmartGoal, smartGoals } from '@/composables/genericGoals/smart'


const { isLoggedIn } = useUser()
const { userGoal } = useSmartGoal()
const textarea = ref()

const generateSampleGoal = () => {
	const randomIndex = Math.floor(Math.random() * smartGoals.length)
	userGoal.value = smartGoals[randomIndex]
	setTimeout(() => {
		adjustTextareaHeight()
	}, 200)
}

const adjustTextareaHeight = () => {
	if (textarea.value) {
		textarea.value.style.height = 'auto'
		textarea.value.style.height = textarea.value.scrollHeight + 'px'
	}
}

const urlRedirect = () => {
	const encodedGoal = encodeURIComponent(userGoal.value)
	useRouter().push(`/create?goal=${encodedGoal}`)
}
const handleKeyDown = (event: KeyboardEvent) => {
	if (event.key === 'Enter' && !event.shiftKey) {
		event.preventDefault()
		urlRedirect()
	}
}


definePageMeta({
	layout: false
})

onMounted(() => watchUserStateChange())

</script>

<style scoped>
#landing_bg {
	/* background-color: #dcd7df; */
	/* background-image: url('@/assets/img/landing-bg.svg'); */
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	width: 100vw;
}

.button_shadow {
	box-shadow: 0px 0px 4px 0.3px #A11DED;
}

.custom_shadow:hover {
	box-shadow: -1px -1px 1px 0.3px rgba(255, 255, 255, 0.25);
}
</style>
