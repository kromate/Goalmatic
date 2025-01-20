<template>
	<section class=" flex flex-col items-center gap-4 pt-20 p-4 w-full pb-48">
		<section class="w-full md:max-w-[var(--mw)] overflow-auto flex flex-col gap-6 items-start overflow-x-hidden ">
			<div class="flex flex-col gap-4 w-full">
				<div class="flex gap-2 text-[#374151]">
					<div class="bg-[#eaeaef] flex size-[30px] shrink-0  center rounded-full p-0.5  border-2">
						<img class="size-5" src="/og.png" alt="goalmatic logo">
					</div>
					<p class="w-full overflow-x-hidden font-semibold mt-0.5">
						Goalmatic
					</p>
				</div>
				<article class="bg-[#F4F3FF] p-4 rounded-lg ">
					<h4 class="text-lg font-semibold flex items-center gap-2">
						Hi! Welcome to Goalmatic! <IconsSmiley2 :size="14" />
					</h4>
					<p class="text-sm text-subText">
						Goalmatic is a tool that helps you achieve your goals, by making them S.M.A.R.T. and actionable.
					</p>
				</article>
			</div>
		</section>


		<transition name="show" appear>
			<div v-if="!loading && gemini_response?.has_error" class="flex flex-col gap-4 max-w-[var(--mw)] bg-[#f9d8d8] w-full border border-red mx-auto p-4 px-4 shadow-md rounded-lg  ">
				<p class="text-base">
					{{ gemini_response?.error_msg }}
				</p>
			</div>
		</transition>
		<transition name="show" appear>
			<div v-if="!loading && smartPercentage" class="flex flex-col gap-4 max-w-[var(--mw)] w-full border border-[#E4E7EC] mx-auto p-4 rounded-lg mb-4">
				<div class="field">
					<h4 class="text-base font-semibold text-[#4D4D53]">
						Your Current Goal
					</h4>
					<span class="text-sm text-grey_four">{{ userGoal }}</span>
					<hr class="w-full mt-3">

					<section class="w-full p-0.5 py-4 flex flex-col mt-3">
						<div class="flex  justify-between w-full text-xs text-[#4D4D53] font-semibold mb-2">
							<span>{{ smartPercentage }}% SMART</span>
							<span>{{ 100 - smartPercentage }}% Left</span>
						</div>
						<Progressbar v-model="smartPercentage" />
					</section>

					<div class="flex flex-wrap gap-2.5 text-xs mt-2 items-center justify-start">
						<span class="card_ans_sm"><b>Specific:</b> <span class="badge">{{ errorExists ? 0 : gemini_response?.is_specific }}/20 </span></span>
						<span class="card_ans_sm"><b>Measurable:</b> <span class="badge">{{ errorExists ? 0 : gemini_response?.is_measurable }}/20 </span></span>
						<span class="card_ans_sm"><b>Achievable:</b> <span class="badge">{{ errorExists ? 0 : gemini_response?.is_achievable }}/20 </span></span>
						<span class="card_ans_sm"><b>Relevant:</b> <span class="badge">{{ errorExists ? 0 : gemini_response?.is_relevant }}/20 </span></span>
						<span class="card_ans_sm"><b>Time-bound:</b> <span class="badge">{{ errorExists ? 0 : gemini_response?.is_time_bound }}/20 </span></span>
					</div>

					<div v-if="gemini_response?.percentage && gemini_response?.percentage <= 85" class="card_ans flex items-center mt-4 gap-2 px-4 !border-[#FFD3AA] bg-[#FFF4EB] rounded-lg">
						<Info class="size-4" />
						You need at least 85% smart goal in order to generate a timeline
					</div>
				</div>
			</div>
		</transition>

		<transition name="glide_up" appear>
			<section v-if="!loading && gemini_response?.adjusted_goal && gemini_response?.percentage <= 85" class="w-full md:max-w-[var(--mw)] overflow-auto flex flex-col gap-6 items-start overflow-x-hidden ">
				<div class="flex flex-col gap-4 w-full">
					<div class="flex gap-2 text-[#374151]">
						<div class="bg-[#eaeaef] flex size-[30px] shrink-0  center rounded-full p-0.5  border-2">
							<img class="size-5" src="/og.png" alt="goalmatic logo">
						</div>
						<p class="w-full overflow-x-hidden font-semibold mt-0.5">
							Hi!, {{ gemini_response.error_msg ? 'You can try out a sample goal below': 'here is a refined version of your goal' }}
						</p>
					</div>
					<div class="flex flex-col gap-2 justify-end items-end pt-0 p-2">
						<article class="bg-[#F4F3FF] p-4 rounded-lg ml-8">
							<p class="text-sm text-subText">
								{{ gemini_response?.adjusted_goal }}
							</p>
						</article>
						<button
							class="disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 md:py-2.5 rounded-lg bg-primary text-white text-sm center gap-2 border border-white font-semibold button_shadow"
							@click="userGoal = gemini_response?.adjusted_goal">
							Use this goal
						</button>
					</div>
				</div>
			</section>
		</transition>

		<transition name="glide_up" appear>
			<section v-if="!loading && gemini_response?.percentage >= 85" class="w-full md:max-w-[var(--mw)] overflow-auto flex flex-col gap-6 items-start overflow-x-hidden ">
				<div class="flex flex-col gap-4 w-full">
					<div class="flex gap-2 text-[#374151]">
						<div class="bg-[#eaeaef] flex size-[30px] shrink-0  center rounded-full p-0.5  border-2">
							<img class="size-5" src="/og.png" alt="goalmatic logo">
						</div>
						<p class="w-full overflow-x-hidden font-semibold mt-0.5">
							Your goal is SMART!
						</p>
					</div>
					<div class="flex flex-col gap-2 justify-end items-end p-2">
						<article class="bg-[#F4F3FF] p-4 rounded-lg ml-8 w-full">
							<p class="text-sm text-subText">
								You can now generate actionable steps to achieve your goal
							</p>
						</article>
						<button :disabled="!userGoal"
							class="disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 md:py-2.5 rounded-lg bg-primary text-white text-sm center gap-2 border border-white font-semibold button_shadow"
							@click="generateGoalTimeline(userGoal)">
							Proceed to generate steps
						</button>
					</div>
				</div>
			</section>
		</transition>





		<div v-if="loading" class="flex  w-full ">
			<Skeleton radius="12px" height="280px" width="720px" class=" mx-auto" />
		</div>


		<div class="fixed  bg-white pt-2.5 px-3 center z-20" :class="isHomePage ? 'md:w-[800px] w-full mx-auto bottom-20  md:bottom-4 ' : 'inset-x-0 bottom-4'">
			<form class="relative w-full md:max-w-[var(--mw)] flex flex-wrap mt-auto" @submit.prevent="checkIfGoalIsSmart">
				<textarea ref="textarea" v-model="userGoal" class="input-field  !pb-4 !pt-4 !pr-16 w-full resize-none overflow-hidden h-auto  transition-all duration-300 ease-in-out" placeholder="Enter a goal" rows="1" @input="adjustTextareaHeight"
					@keydown="handleKeyDown" />
				<button
					:disabled="!userGoal"
					class="absolute bottom-2.5 right-4 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 md:py-2.5 rounded-lg bg-primary text-white text-sm center gap-2 border border-white font-semibold button_shadow"
					type="submit"
				>
					<MoveRight :stroke-width="2.5" :size="14" class="-rotate-90" />
				</button>
			</form>
		</div>
	</section>
</template>

<script setup lang="ts">
import { MoveRight, Info } from 'lucide-vue-next'
import { useSmartGoal } from '@/composables/genericGoals/smart'
import { useGenerateGoalActionableStep } from '@/composables/genericGoals/timeline'

defineProps<{
	isHomePage?: boolean
}>()

const { generateGoalTimeline } = useGenerateGoalActionableStep()
const { loading, userGoal, gemini_response, checkIfGoalIsSmart, hasUserGoalChanged, smartPercentage } = useSmartGoal()

const textarea = ref()

const errorExists = computed(() => {
	return gemini_response?.value?.has_error
})

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
		checkIfGoalIsSmart()
	}
}

onMounted(() => {
	adjustTextareaHeight()
	const goalQuery = useRoute().query.goal
	if (goalQuery) {
		userGoal.value = goalQuery as string
		setTimeout(() => {
			checkIfGoalIsSmart()
		}, 50)
	}
})
watch([userGoal, gemini_response], () => {
	adjustTextareaHeight()
}, { deep: true })
</script>

<style lang="scss">
.mx {
	margin-left: min(20%, 15rem);

	@media (max-width:1024px) {
		margin-left: 3.5rem;
		margin-right: 0;
	}
	@media (max-width:768px) {
		margin-left: 0;
		margin-right: 0;
	}
}


.badge{
	@apply  bg-[#F2F2F2] font-medium py-0.5 px-2 rounded-full
}
.card_ans_sm > b{
	@apply text-grey_four font-medium
}
textarea::placeholder {
	@apply text-[#252525ea] text-base text-nowrap truncate
}

.outline {
	line-height: 1.2;
	text-decoration: none;
	color: transparent;
	-webkit-text-stroke: 1.5px #000;

	@media screen and (max-width: 768px) {
		color: black;
		outline: none;
		border: none;
	}
}

li::first-letter {
	font-size: 1.25em;
	/* Adjust font size as desired */
	font-weight: bold;
	color: #845bd8
}



.show-enter-active {
	transition: all 0.3s ease-out;
}

.show-enter-from {
	opacity: 0;
	transform: scale(0.5);
}

.show-leave-active {
	transition: all 0.3s ease-in;
}

.show-leave-to {
	opacity: 0;
	transform: scale(0.5);
}
</style>
