<template>
	<section class=" flex flex-col items-center gap-4 pt-20 p-4 w-full pb-48">
		<section class="w-full md:max-w-[var(--mw2)] overflow-auto flex flex-col gap-6 items-start overflow-x-hidden ">
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
						Hi! {{ loading ? 'Generating actionable steps...' : 'Actionable steps ready!' }}
						<IconsSmiley2 :size="14" />
					</h4>
					<p class="text-sm text-[#344054]">
						If you would like to make suggestions about the steps, please let us know.
					</p>
				</article>
			</div>
		</section>

		<transition name="show" appear>
			<section v-if="steps.length && !loading" class="flex flex-col gap-8 max-w-[var(--mw2)] w-full">
				<div class="flex flex-col gap-8 w-full border border-line mx-auto p-4 px-4  rounded-lg w-full">
					<div class="field">
						<h4 class="text-base font-semibold text-[#4D4D53]">
							Your Current Goal
						</h4>
						<span class="text-sm text-grey_four">{{ userGoal }}</span>
						<hr class="w-full mt-3">
					</div>
					<div class="flex flex-col w-full">
						<div v-if="steps.length && !loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-2 w-full">
							<ModulesGoalsStepCard v-for="(step, idx) in steps" :key="idx" :step="step" :idx="idx" />
						</div>
					</div>
				</div>
			</section>
		</transition>

		<transition name="glide_up" appear>
			<section v-if="!loading && steps.length " class="w-full md:max-w-[var(--mw2)] overflow-auto flex flex-col gap-6 items-start overflow-x-hidden ">
				<div class="flex flex-col gap-4 w-full">
					<div class="flex gap-2 text-[#374151]">
						<div class="bg-[#eaeaef] flex size-[30px] shrink-0  center rounded-full p-0.5  border-2">
							<img class="size-5" src="/og.png" alt="goalmatic logo">
						</div>
						<p class="w-full overflow-x-hidden font-semibold mt-0.5">
							Goalmatic
						</p>
					</div>
					<div class="flex flex-col gap-2 justify-end items-end p-2">
						<article v-if="isLoggedIn" class="bg-[#F4F3FF] p-4 rounded-lg  w-full">
							<p class="text-sm text-[#344054]">
								If you are happy with the steps, you can save and proceed to the next step.
							</p>
						</article>
						<article v-else class="bg-[#F4F3FF] p-4 rounded-lg w-full ">
							<h4 class="text-lg font-semibold flex items-center gap-2">
								Looks like you’re not signed in
								<IconsSadface :size="14" />
							</h4>
							<p class="text-sm text-[#344054] mt-2">
								To continue setting your goals, please sign in or create an account so we can save your progress and remind you of your tasks.
							</p>
							<button
								:disabled="!userGoal"
								class="btn-primary mt-3 w-full"
								@click="saveUnauthorisedGoal('/auth/login')">
								<span v-if="!createLoading">Login/Signup</span>
								<Spinner v-else />
							</button>
						</article>
						<button
							v-if="isLoggedIn"
							:disabled="!userGoal"
							class="disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 md:py-2.5 rounded-lg bg-primary text-white text-sm center gap-2 border border-white font-semibold button_shadow"
							@click="createGoals">
							<span v-if="!createLoading">Save and proceed</span>
							<Spinner v-else />
						</button>
					</div>
				</div>
			</section>
		</transition>





		<div v-if="loading" class="flex  w-full ">
			<Skeleton radius="12px" height="280px" width="920px" class=" mx-auto" />
		</div>
	</section>
</template>

<script setup lang="ts">
import { Clock, CalendarCheck, RadioTower } from 'lucide-vue-next'
import { useSmartGoal } from '@/composables/genericGoals/smart'
import { useGenerateGoalActionableStep } from '@/composables/genericGoals/timeline'
import { transformString, numberToString } from '@/composables/utils/formatter'
import { useUser } from '@/composables/auth/user'
import { useCreateGoals } from '@/composables/dashboard/goals/create'


const { isLoggedIn } = useUser()
const { userGoal } = useSmartGoal()
const { saveUnauthorisedGoal, steps, loading } = useGenerateGoalActionableStep()
const { createGoals, loading: createLoading } = useCreateGoals()



</script>

<style>
:root {
	--mw2: 920px;
}
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
