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
					<h4 class="text-lg font-semibold">
						Hi! {{ loading ? 'Generating actionable steps...' : 'Actionable steps ready!' }}
					</h4>
					<p class="text-sm text-[#344054]">
						If you would like to make suggestions about the steps, please let us know.
					</p>
				</article>
			</div>
		</section>





		<div v-if="loading" class="flex px-4 w-full">
			<Skeleton radius="12px" height="280px" width="700px" class=" mx-auto px-4 max-w-[90%]" />
		</div>
	</section>
</template>

<script setup lang="ts">
import { useSmartGoal } from '@/composables/genericGoals/smart'
import { useGenerateGoalActionableStep } from '@/composables/genericGoals/timeline'
import { transformString } from '@/composables/utils/formatter'
import { useUser } from '@/composables/auth/user'
import { useCreateGoals } from '@/composables/dashboard/goals/create'


const { isLoggedIn } = useUser()
const { userGoal } = useSmartGoal()
const { saveUnauthorisedGoal, steps, loading } = useGenerateGoalActionableStep()
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
