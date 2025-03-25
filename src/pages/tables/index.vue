<template>
	<div class="flex justify-center items-center min-h-[60vh] p-8">
		<div class="max-w-[600px] text-center center flex-col">
			<Database class="text-primary mb-6" :size="64" />
			<h1 class="text-3xl mb-4 text-heading font-bold">
				Tables Coming Soon
			</h1>
			<p class="text-text-secondary mb-8 text-lg">
				We're developing powerful data management capabilities to help you organize your information effectively.
			</p>
			<div class="flex flex-col gap-4 text-left mt-8">
				<div class="flex items-center gap-3">
					<Grid class="text-primary" />
					<span>Create custom data tables</span>
				</div>
				<div class="flex items-center gap-3">
					<Table2 class="text-primary" />
					<span>Organize and filter your information</span>
				</div>
				<div class="flex items-center gap-3">
					<FileSpreadsheet class="text-primary" />
					<span>Export and share your data</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Database, Grid, Table2, FileSpreadsheet } from 'lucide-vue-next'
import { usePageHeader } from '@/composables/utils/header'

definePageMeta({
	layout: 'dashboard',
	middleware: ['is-authenticated', () => {
		usePageHeader().setPageHeader({
			title: 'Tables',
			description: 'Manage your data tables here',
			btnText: 'Create New Table',
			btnCall: () => useRouter().push('/tables/create'),
			shouldShowFab: true,
			shouldShowTab: usePageHeader().isLargeScreen.value
		})
	}]
})
</script>
