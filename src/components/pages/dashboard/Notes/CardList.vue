<template>
	<div class="notes-grid">
		<PagesDashboardNotesCard v-for="note in [...notes, ...notes, ...notes, ...notes]" :key="note.id" :note="note" />
	</div>
</template>

<script setup lang="ts">
import { isLargeScreen } from '@/composables/utils/system'




// Add this type declaration
declare const Masonry: any

const masonryInstance = ref(null)

onMounted(async () => {
    masonryInstance.value = new Masonry('.notes-grid', {
		itemSelector: '.note-card',
		columnWidth: 24,
		horizontalOrder: true,
		fitWidth: true,
		gutter: isLargeScreen.value ? 7 : 0
	})
})

const notes = [
  {
    id: 1,
    title: 'Meeting with Sharon',
    content: 'Discuss project timeline and deliverables for the new feature implementation. timeline and deliverables for the new feature implementation timeline and deliverables for the new feature implementation',
    date: '10th Nov 2024'
  },
  {
    id: 2,
    title: 'Product Updates',
    content: 'Review the latest changes in v2.0 and prepare release notes.',
    date: '15th Nov 2024'
  },
  {
    id: 3,
    title: 'Client Feedback',
    content: 'Collect and analyze user feedback from the latest feature release. feedback from the latest feature release.',
    date: '20th Nov 2024'
  },
  {
    id: 4,
    title: 'Team Sync',
    content: 'Weekly team sync to discuss progress and blockers.',
    date: '25th Nov 2024'
  }
]
</script>

<style scoped>

.notes-grid {
	@apply md:p-4 py-4 mx-auto w-full flex justify-center items-center
	/* @apply grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 p-4 items-start; */
}

.note-card {
	/* @apply inline-block; */
	@apply  mb-2.5 w-[92vw] md:w-[240px]

}
</style>
