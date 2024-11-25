<template>
	<div class="note-card bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-3 transition-colors border border-line">
		<h3 class="text-lg font-semibold mb-2">
			{{ note.title }}
		</h3>
		<p class="text-gray-600 text-sm mb-4 ">
			{{ note.content }}
		</p>
		<div class="flex justify-between items-center text-sm text-gray-500">
			<span>{{ note.date }}</span>
			<div class="flex gap-2">
				<button class="hover:text-primary">
					<i class="i-heroicons-pencil-square-20-solid" />
				</button>
				<button class="hover:text-red-500">
					<i class="i-heroicons-trash-20-solid" />
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
  note: {
    id: number
    title: string
    content: string
    date: string
  }
}>()
</script>

<style scoped>
.note-card {
	/* @apply inline-block; */
	@apply min-w-[20px] mb-4 max-w-full;

}
</style>
