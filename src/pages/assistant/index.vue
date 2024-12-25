<template>
	<section class="flex flex-col items-center gap-4 relative h-[calc(100vh-140px)] w-full mt-12">
		<section class="p-4 w-full md:max-w-[800px] h-[72vh] overflow-auto flex flex-col gap-6 items-start overflow-x-hidden ">
			<div v-for="(message, index) in conversationHistory" :key="index" class="flex gap-2 text-[#374151]">
				<div v-if="message.role === 'user' && index !== 0" class="bg-background flex size-[25px] shrink-0 select-none items-center justify-center rounded-lg border shadow-sm ">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" class="size-4"><path d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8ZM72 96a56 56 0 1 1 56 56 56.06 56.06 0 0 1-56-56Z" /></svg>
				</div>
				<div v-else class="bg-background flex size-[25px] shrink-0 select-none items-center justify-center rounded-lg border shadow-sm">
					<img class="size-6" src="/gemini.png" alt="gemini logo">
				</div>
				<p class="md:w-full overflow-x-hidden w-[100%]">
					{{ message.parts[0].text }}
				</p>
			</div>

			<div v-if="typewriterText" class="flex gap-2 text-[#374151] w-full">
				<div class="bg-background flex size-[25px] shrink-0 select-none items-center justify-center rounded-lg border shadow-sm">
					<img class="size-6" src="/gemini.png" alt="gemini logo">
				</div>
				<p class="w-full">
					{{ typewriterText }}
				</p>
			</div>
		</section>


		<div class="fixed  max-w-full w-[800px] bottom-20 md:bottom-5  bg-transparent pt-2.5 center px-4">
			<form class="relative w-full md:max-w-[840px] flex flex-wrap mt-auto bg-light" @submit.prevent="sendMessage">
				<textarea ref="textarea" v-model="userInput" class="input-field  !pb-4 !pt-4 pr-36 w-full resize-none overflow-hidden h-auto  transition-all duration-300 ease-in-out" placeholder="Enter your goal (e.g., Learn a new language)" rows="1" @input="adjustTextareaHeight"
					@keydown="handleKeyDown" />

				<button class="btn-sm bg-dark text-light rounded-full absolute bottom-2.5 right-4" type="submit" :disabled="!userInput || ai_loading">
					<span v-if="!ai_loading">Generate</span>
					<Spinner v-else />
				</button>
			</form>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useChatAssistant } from '@/composables/dashboard/assistant'
import { usePageHeader } from '@/composables/utils/header'


const { conversationHistory, userInput, sendMessage, ai_loading } = useChatAssistant()
const textarea = ref()
const typewriterText = ref('')





const adjustTextareaHeight = () => {
	setTimeout(() => {
		if (textarea.value) {
			textarea.value.style.height = 'auto'
			textarea.value.style.height = textarea.value.scrollHeight + 'px'
		}
	}, 100)
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

watch(userInput, () => {
  adjustTextareaHeight()
}, { deep: true })

definePageMeta({
    layout: 'dashboard',
    middleware: ['is-authenticated', () => {
        usePageHeader().setPageHeader({
            title: 'Assistant',
            description: 'Your personal goal assistant',
            btnText: '',
            btnCall: () => useRouter().push('/booking-types/create'),
            shouldShowFab: false,
            shouldShowTab: false

        })
    }]
})

</script>

<style scoped>

</style>
