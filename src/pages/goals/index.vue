<template>
	<main>
		<!-- <section v-if="!loading" class="p-4 grid md:grid-cols-2 gap-4">
			<nuxt-link v-for="goal in userGoals" :key="goal.id" class="flex flex-col gap-3 items-start p-4 border border-line rounded-md " :to="`/goals/${goal.id}`">
				<h2 class="font-medium  text-base md:text-xl">
					{{ goal.title }}
				</h2>
				<h4 class="!border-dark bg-hover card_ans text-sm md:text-base h-full font-normal">
					{{ goal.desc }}
				</h4>
			</nuxt-link>
		</section>

		<section v-else class="p-4">
			<Skeleton height="50px" />
		</section>

		<section v-if="userGoals.length === 0 && !loading" class="center flex-col min-h-[70vh] gap-4">
			<Target :size="80" />
			<h1 class="text-xl font-bold mt-3">
				You currently have no Goals yet
			</h1>
			<p> Click the button below to create a goal </p>
			<nuxt-link to="/goals/create" class="btn-primary">
				Create
			</nuxt-link>
		</section> -->

		<section class="p-4 flex flex-col gap-10">
			<div class="flex justify-between items-center flex-wrap gap-4">
				<div class="flex flex-col gap-1">
					<h3 class="text-textHeadline font-semibold text-2xl md:text-[28px]">
						Welcome to your goals
					</h3>
					<p class="text-base text-[#37363D]">
						View your goal and details of the actionable steps you need to take to achieve it.
					</p>
				</div>
				<nuxt-link to="/goals/create" class="custom-btn gap-2 w-full lg:w-auto">
					<span>Create a new goal</span>
					<ArrowRight :size="15" />
				</nuxt-link>
			</div>



			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<ModulesGoalsCard v-for="goal in userGoals" :key="goal.id" :goal="goal" />
			</div>
		</section>
	</main>
</template>

<script setup lang="ts">
import { Target, Search, ArrowRight } from 'lucide-vue-next'
import { usePageHeader } from '@/composables/utils/header'
import { useFetchUserGoals } from '@/composables/dashboard/goals/fetch'
import { useCreateGoals } from '@/composables/dashboard/goals/create'


const { fetchUserGoals, loading, userGoals } = useFetchUserGoals()

fetchUserGoals()

definePageMeta({
	layout: 'dashboard',
	middleware: ['is-authenticated', () => {
		 useCreateGoals().resetForm()
		usePageHeader().setPageHeader({
			title: 'Goals',
			description: 'Manage your goals here',
			btnText: 'Create New Goal',
			btnCall: () => useRouter().push('/goals/create'),
			shouldShowFab: true,
			shouldShowTab: usePageHeader().isLargeScreen.value

		})
	}]
})
</script>

<style scoped></style>
