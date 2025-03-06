<template>
	<Modal
		modal="$atts.modal"
		title="Edit Todo"
		:is-full-height="false"

	>
		<form class="auth-form" @submit.prevent="updateTodo(selectedTodo)">
			<div class="field relative">
				<label for="start">Title</label>
				<input id="start" v-model="selectedTodo.title" type="text" autocomplete="off" class="input-field">
			</div>
			<div class="field relative">
				<label for="start">Description</label>
				<textarea id="start" v-model="selectedTodo.description" class="input-textarea" autocomplete="off" />
			</div>

			<!-- Subtasks Section -->
			<div class="field relative mt-4">
				<label class="flex justify-between items-center">
					<span>Subtasks</span>
					<button
						type="button"
						class="text-sm text-purple-600 hover:text-purple-800"
						@click="addSubtask"
					>
						+ Add subtask
					</button>
				</label>

				<div v-if="!selectedTodo.subtasks || selectedTodo.subtasks.length === 0" class="text-sm text-gray-500 mt-2">
					No subtasks yet. Add one to break down this task.
				</div>

				<div v-for="(subtask, index) in selectedTodo.subtasks" :key="index" class="flex items-center gap-2 mt-2">
					<input
						v-model="subtask.title"
						type="text"
						placeholder="Subtask title"
						class="input-field text-sm flex-grow"
					>
					<button
						type="button"
						class="text-red-500 hover:text-red-700"
						@click="removeSubtask(index)"
					>
						<Trash2 :size="16" />
					</button>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-4 mt-6 w-full">
				<button class="btn-primary text-light " :disabled="loading">
					<span v-if="!loading"> Update </span>
					<Spinner v-else />
				</button>
			</div>
		</form>
	</Modal>
</template>

<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { onMounted } from 'vue'
import { useEditTodo } from '@/composables/dashboard/todo/edit'

const { selectedTodo, updateTodo, loading } = useEditTodo()

// Initialize subtasks array if it doesn't exist
onMounted(() => {
  if (!selectedTodo.value.subtasks) {
    selectedTodo.value.subtasks = []
  }
})

// Add a new empty subtask
const addSubtask = () => {
  if (!selectedTodo.value.subtasks) {
    selectedTodo.value.subtasks = []
  }
  selectedTodo.value.subtasks.push({
    id: Date.now().toString(), // Generate a temporary ID
    title: '',
    completed: false,
    parentId: selectedTodo.value.id
  })
}

// Remove a subtask at the given index
const removeSubtask = (index: number) => {
  selectedTodo.value.subtasks.splice(index, 1)
}
</script>

<style>
/* Add any styles if needed */
</style>
