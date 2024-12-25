<template>
	<main class="p-4">
		<article v-if="!loading" class="flex flex-col gap-3 items-start p-4 border border-line rounded-md">
			<h2 class="font-medium  text-base md:text-2xl">
				{{ goalDetails.title }}
			</h2>
			<h4 class="!border-dark bg-hover card_ans text-base md:text-xl font-normal">
				{{ goalDetails.desc }}
			</h4>
			<button v-if="!goalDetails.started" class="btn w-full bg-dark text-light" @click="initStartGoal(goalDetails)">
				Click to start this goal
			</button>
		</article>

		<Skeleton v-else height="150px" />

		<section v-if="!loading" class="">
			<div class="flex w-full  justify-start mt-10">
				<Tabs :selected="selected" :tabs="tabViews" @changed="updateTab($event)" />
			</div>
			<div class="mb-12 pt-10">
				<keep-alive>
					<component :is="tabs[selected]" @changed="updateTab($event)" />
				</keep-alive>
			</div>
		</section>
		<Skeleton v-else height="150px" class="mt-10" />
	</main>
</template>

<script setup lang="ts">
import { useTabs } from '@/composables/utils/tabs'
import { usePageHeader } from '@/composables/utils/header'
import actionable_step from '@/pages/goals/[id]/steps.vue'
import milestone from '@/pages/goals/[id]/milestone.vue'
import todo from '@/pages/goals/[id]/todo.vue'
import accountability_partner from '@/pages/goals/[id]/partner.vue'
import { useFetchGoalsById } from '@/composables/dashboard/goals/id'
import { useStartGoal } from '@/composables/dashboard/goals/start'

const { initStartGoal } = useStartGoal()
const { fetchGoalsById, goalDetails, loading } = useFetchGoalsById()


watch(() => useRoute().params.id, async (newId) => {
	if (newId) {
		fetchGoalsById(newId as string)
	}
	}, { immediate: true }
)



const { initTabs, selected, tabViews, updateTab, tabs, onTabMounted } = useTabs()

initTabs(
	'actionable_step',
	// ['actionable_step', 'milestone', 'todo', 'accountability_partner'],
	['actionable_step', 'milestone', 'todo'],
	markRaw({ actionable_step, milestone, todo, accountability_partner })
)

onTabMounted()

definePageMeta({
	layout: 'dashboard',
	middleware: ['is-authenticated', () => {
		usePageHeader().setPageHeader({
			title: 'View Goal',
			description: 'View your goal and details of the actionable steps you need to take to achieve it.',
			btnText: '',
			btnCall: () => useRouter().push('/booking-types/create'),
			shouldShowFab: false,
			shouldShowTab: false

		})
	}]
})
</script>

<style scoped></style>
