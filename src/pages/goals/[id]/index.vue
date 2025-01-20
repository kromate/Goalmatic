<template>
	<main class="p-4 flex flex-col gap-6">
		<section class="flex flex-col gap-4 ">
			<!-- <div class="rounded-lg p-4 px-5 flex flex-col gap-2 bg-tertiary text-subText">
				<div class="flex flex-col gap-2">
					<p class="text-2xl font-bold flex items-center gap-2">
						<span>Your Plan is ready </span>
						<IconsSmiley />
					</p>
					<p class="text-base font-medium">
						Your plans are ready! Add your tasks to your calendar, and we’ll send you daily reminders to keep you on track.
					</p>
				</div>
				<div class="flex items-center gap-8 text-sm">
					<button class="custom-btn gap-2">
						<span>Add Tasks to your calendar</span>
						<ArrowRight :size="15" :stroke-width="3" />
					</button>
					<button class="text-[#7A797E] font-medium">
						Dismiss
					</button>
				</div>
			</div> -->

			<div v-if="!loading && goalDetails" class="border border-[#E4E7EC] p-4 rounded-lg flex flex-col gap-3">
				<div class="flex flex-col gap-3">
					<p class="text-sm text-[#908F93] font-semibold">
						Goal Overview
					</p>
				</div>
				<p class="text-lg font-semibold text-[#4D4D53]">
					{{ goalDetails.title }}
				</p>
				<div class="flex flex-col md:flex-row md:items-center gap-3 mt-2 pb-1.5 border-b border-[rgba(143,149,166,0.2)]">
					<div class="flex items-center gap-1.5 text-sm">
						<IconsStart />
						<p class="flex items-center gap-1">
							<span class="text-[#908F93]">Start</span>
							<span class="text-[#646368]">{{ goalDetails.start_date ? formatDate(goalDetails.start_date) : 'N/A' }}</span>
						</p>
					</div>
					<div class="flex items-center gap-1.5 text-sm">
						<IconsCalendar />
						<p class="flex items-center gap-1">
							<span class="text-[#908F93]">End</span>
							<span class="text-[#646368]">{{ goalDetails.end_date ? formatDate(goalDetails.end_date) : 'N/A' }}</span>
						</p>
					</div>
				</div>
				<p class="text-sm text-[#37363D] mt-2 mb-1">
					{{ goalDetails.desc }}
				</p>
				<button v-if="!goalDetails.started" class="btn w-full bg-primary text-light" @click="initStartGoal(goalDetails)">
					Click to start this goal
				</button>
			</div>
			<Skeleton v-else height="150px" />
		</section>

		<section v-if="true || !loading" class="">
			<div class="flex w-full justify-start">
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
import { ArrowRight } from 'lucide-vue-next'
import { useTabs } from '@/composables/utils/tabs'
import { usePageHeader } from '@/composables/utils/header'
import step from '@/pages/goals/[id]/steps.vue'
import milestone from '@/pages/goals/[id]/milestone.vue'
import todo from '@/pages/goals/[id]/todo.vue'
import accountability_partner from '@/pages/goals/[id]/partner.vue'
import { useFetchGoalsById } from '@/composables/dashboard/goals/id'
import { useStartGoal } from '@/composables/dashboard/goals/start'
import { formatDate } from '@/composables/utils/formatter'

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
	'step',
	// ['actionable_step', 'milestone', 'todo', 'accountability_partner'],
	['step', 'milestone', 'todo'],
	markRaw({ step, milestone, todo, accountability_partner })
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
