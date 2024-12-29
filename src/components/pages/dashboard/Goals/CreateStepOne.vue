<template>
	<section class=" flex flex-col items-center gap-4 relative h-[calc(100vh-140px)] w-full ">
		<div class="flex gap-4 items-center justify-center flex-wrap mt-16">
			<h1 class="outline text-4xl text-center font-black sm:text-5xl md:text-4xl lg:text-6xl xl:text-7xl text-dark poppins w-full center">
				{{ loading ? 'Checking if your goal is S.M.A.R.T?' : 'S.M.A.R.T-ify Goal' }}
			</h1>
		</div>


		<ul class="list-image-none list-inside flex gap-3  flex-wrap justify-center text-lg md:text-2xl mb-12">
			<li>Specific</li>
			<li>Measurable</li>
			<li>Achievable</li>
			<li>Relevant</li>
			<li>Time-bound</li>
		</ul>


		<transition name="show" appear>
			<div v-if="!loading && gemini_response?.has_error" class="flex flex-col gap-4 max-w-[560px] bg-[#f8c2c2] w-full border border-red mx-auto p-4 px-4 shadow-md rounded-lg  text-center">
				<p class="text-base">
					{{ gemini_response?.error_msg }}
				</p>
			</div>
		</transition>
		<transition name="show" appear>
			<section v-if="userGoal && !loading && !hasUserGoalChanged" class="pb-96">
				<div class="flex flex-col gap-4 max-w-[560px] w-full border border-line mx-auto p-4 px-4 shadow-md rounded-lg mb-12 ">
					<div class="field">
						<h4>Your Goal:</h4>
						<span class="card_ans">{{ userGoal }}</span>
						<div class="flex flex-wrap gap-2.5 text-xs mt-2 items-center justify-start">
							<span class="card_ans_sm"><b>Specific:</b> {{ gemini_response?.is_specific }} </span>
							<span class="card_ans_sm"><b>Measurable:</b> {{ gemini_response?.is_measurable }} </span>
							<span class="card_ans_sm"><b>Achievable:</b> {{ gemini_response?.is_achievable }} </span>
							<span class="card_ans_sm"><b>Relevant:</b> {{ gemini_response?.is_relevant }} </span>
							<span class="card_ans_sm"><b>Time-bound:</b> {{ gemini_response?.is_time_bound }} </span>
						</div>
					</div>
					<transition name="glide_up" appear>
						<section v-if="gemini_response?.percentage" class="flex flex-col gap-4">
							<div class="field">
								<h4>How SMART is your Goal:</h4>
								<span class="card_ans">{{ smartPercentage }}%</span>
							</div>
							<div class="card_ans !border-greenx bg-[#b8e3b8]">
								You need at least 85% smart gaol in order to generate a timeline
							</div>
							<div v-if="gemini_response && gemini_response!.percentage < 85" class="field">
								<h4 class="flex justify-between w-full ">
									Refined Goal:
								</h4>
								<span class="card_ans">{{ gemini_response?.adjusted_goal }}</span>
								<button class="btn bg-dark text-light w-full mt-4" @click="userGoal = gemini_response?.adjusted_goal">
									Use this goal instead
								</button>
							</div>


							<button v-if="gemini_response && gemini_response!.percentage >= 85" class="btn bg-dark text-light w-full" type="submit" :disabled="!userGoal" @click="generateGoalTimeline(userGoal)">
								Create actionable steps
							</button>
						</section>
					</transition>
				</div>
			</section>
		</transition>



		<div v-if="loading" class="flex px-4 w-full">
			<Skeleton radius="12px" height="280px" width="700px" class=" mx-auto px-4 max-w-[90%]" />
		</div>
		<div class="fixed  max-w-full w-[800px] bottom-20 md:bottom-5  bg-transparent pt-2.5 center px-4">
			<form class="relative w-full md:max-w-[840px] flex flex-wrap mt-auto bg-light" @submit.prevent="checkIfGoalIsSmart">
				<textarea ref="textarea" v-model="userGoal" class="input-field  !pb-4 !pt-4 pr-36 w-full resize-none overflow-hidden h-auto  transition-all duration-300 ease-in-out" placeholder="Enter your goal (e.g., Learn a new language)" rows="1" @input="adjustTextareaHeight"
					@keydown="handleKeyDown" />

				<button class="btn-sm bg-dark text-light rounded-full absolute bottom-2.5 right-4" type="submit" :disabled="!userGoal">
					Generate
				</button>
			</form>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useSmartGoal } from '@/composables/genericGoals/smart'
import { useGenerateGoalActionableStep } from '@/composables/genericGoals/timeline'

const { generateGoalTimeline } = useGenerateGoalActionableStep()
const { loading, userGoal, gemini_response, checkIfGoalIsSmart, hasUserGoalChanged, smartPercentage } = useSmartGoal()

const textarea = ref()

const adjustTextareaHeight = () => {
	setTimeout(() => {
		if (textarea.value) {
			textarea.value.style.height = 'auto'
			if (textarea.value.scrollHeight > 200) {
				textarea.value.style.height = '200px'
			} else {
				textarea.value.style.height = textarea.value.scrollHeight + 'px'
			}
		}
	}, 100)
}

const handleKeyDown = (event: KeyboardEvent) => {
	if (event.key === 'Enter' && !event.shiftKey) {
		event.preventDefault()
		checkIfGoalIsSmart()
	}
}

watch([userGoal, gemini_response], () => {
	adjustTextareaHeight()
}, { deep: true })
</script>

<style scoped>
textarea::placeholder {
	@apply text-[#252525ea] font-semibold text-lg text-nowrap truncate
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
