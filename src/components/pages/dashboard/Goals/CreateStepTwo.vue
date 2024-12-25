<template>
	<section class=" flex flex-col items-center gap-4">
		<div class="flex gap-4 items-center justify-center flex-wrap mt-16 mb-10">
			<h1 class="outline text-4xl text-center font-black sm:text-5xl md:text-4xl lg:text-6xl xl:text-7xl tracking-normal text-dark poppins w-full center">
				{{ loading ? 'Generating' : 'Generated' }} Actionable Steps
			</h1>
		</div>




		<transition name="show" appear>
			<section v-if="steps.length && !loading" class="flex flex-col gap-8 max-w-[1500px]">
				<div class="flex flex-col gap-8 w-full border border-line mx-auto p-4 px-4 shadow-md rounded-lg ">
					<div class="field">
						<h4 class="heading">
							Your Goal:
						</h4>
						<span class="card_ans bg-hover">{{ userGoal }}</span>
					</div>
					<div class="flex flex-col ">
						<h4 class="heading">
							Actionable Step:
						</h4>
						<div v-if="steps.length && !loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-x-4 gap-y-6 ">
							<div v-for="(step, idx) in steps" :key="step.title" class="field h-full">
								<h4 class="pill text-base border-line bg-[#b8e3b8] mb-2.5">
									Steps {{ idx + 1 }}:
								</h4>
								<div class="card_ans h-full justify-between flex flex-col gap-2">
									<h1 class="font-semibold  underline">
										{{ step.title }}
									</h1>
									<p class="mb-5">
										{{ step.description }}
									</p>
									<footer class=" italic mt-auto flex flex-col ">
										<span><b>Frequency:</b> {{ transformString(step.frequency) }}</span>
										<span><b>Frequency Count:</b> {{ step.frequency_count }}</span>
										<span><b>Estimated Duration:</b> {{ step.estimated_duration }}</span>
									</footer>
								</div>
							</div>
						</div>
					</div>
				</div>

				<button class="btn bg-dark text-light" :disabled="createLoading" @click="createGoals">
					<span v-if="!createLoading">	Save and proceed</span>
					<Spinner v-else />
				</button>
			</section>
		</transition>
		<div v-if="loading" class="flex px-4 w-full">
			<Skeleton radius="12px" height="280px" width="700px" class=" mx-auto px-4 max-w-[90%]" />
		</div>
	</section>
</template>

<script setup lang="ts">
import { useSmartGoal } from '@/composables/genericGoals/smart'
import { useGenerateGoalActionableStep } from '@/composables/genericGoals/timeline'
import { transformString } from '@/composables/utils/formatter'
import { useCreateGoals } from '@/composables/dashboard/goals/create'

const { userGoal } = useSmartGoal()
const { steps, loading } = useGenerateGoalActionableStep()

const { createGoals, loading: createLoading } = useCreateGoals()

</script>

<style scoped>
.heading {
	@apply text-xl font-medium underline mb-4
}

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

.card_ans {
	@apply p-4 border border-line w-full rounded-md
}

.card_ans_sm {
	@apply px-2 py-1.5 border border-line w-auto rounded-md
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
