<template>
	<main class="flex justify-center items-center min-h-[60vh] p-8">
		<div class="max-w-[600px] text-center center flex-col">
			<Target class="text-primary mb-6" :size="64" />
			<h1 class="text-3xl mb-4 text-heading font-bold">
				Flows Coming Soon
			</h1>
			<p class="text-text-secondary mb-8 text-lg">
				We're working hard to bring you powerful workflow automation capabilities.
			</p>
			<div class="flex flex-col gap-4 text-left mt-8">
				<div class="flex items-center gap-3">
					<ArrowRight class="text-primary" />
					<span>Create automated sequences</span>
				</div>
				<div class="flex items-center gap-3">
					<ArrowRight class="text-primary" />
					<span>Connect your goals with actions</span>
				</div>
				<div class="flex items-center gap-3">
					<ArrowRight class="text-primary" />
					<span>Streamline your productivity</span>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
import { Target, Search, ArrowRight } from 'lucide-vue-next'
import { usePageHeader } from '@/composables/utils/header'

definePageMeta({
	layout: 'dashboard',
	middleware: ['is-authenticated', () => {
		usePageHeader().setPageHeader({
			title: 'Flows',
			description: 'Manage your flows here',
			btnText: 'Create New Flow',
			btnCall: () => useRouter().push('/flows/create'),
			shouldShowFab: true,
			shouldShowTab: usePageHeader().isLargeScreen.value
		})
	}]
})
</script>
