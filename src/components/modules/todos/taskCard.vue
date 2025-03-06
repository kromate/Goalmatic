<template>
	<div>
		<div
			class="bg-white p-3 shadow rounded-lg flex items-center gap-3 justify-between"
			:draggable="draggable"
			:class="{ 'opacity-75': todo.completed, 'border-l-4 border-purple-500': !todo.completed && !todo.later, 'border-l-4 border-orange-300': todo.later }"
			@dragstart="$emit('dragstart', $event)"
			@click="highlightTodo(todo)"
		>
			<div class="flex items-center gap-3 flex-grow">
				<button
					class="w-5 h-5 rounded-full border flex-shrink-0"
					:class="todo.completed ? 'bg-[#8F61F2] border-[#8F61F2]' : 'border-[#E9E9E9]'"
					@click.stop="toggleComplete"
				>
					<Check v-if="todo.completed" class="w-full h-full" />
				</button>
				<p class="text-[#4D4D53] text-sm" :class="{'line-through': todo.completed}">
					{{ todo.title }}
				</p>
			</div>

			<div class="flex items-center gap-2">
				<span v-if="todo.later" class="text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded">Later</span>
				<button v-if="hasSubtasks" @click.stop="toggleSubtasks">
					<ChevronDown :size="14" class="text-gray-400" :class="{'rotate-180': showSubtasks}" />
				</button>
				<button @click.stop="setDeleteTodoData(todo)">
					<Trash2 :size="14" class="text-gray-400 hover:text-red-500" />
				</button>
			</div>
		</div>

		<!-- Subtasks section -->
		<div v-if="showSubtasks && hasSubtasks" class="pl-8 mt-1 space-y-2">
			<div
				v-for="subtask in todo.subtasks"
				:key="subtask.id"
				class="bg-white p-2 shadow-sm rounded-lg flex items-center gap-2 justify-between border-l-2 border-purple-300"
			>
				<div class="flex items-center gap-2 flex-grow">
					<button
						class="w-4 h-4 rounded-full border flex-shrink-0"
						:class="subtask.completed ? 'bg-[#8F61F2] border-[#8F61F2]' : 'border-[#E9E9E9]'"
						@click.stop="toggleSubtaskComplete(subtask)"
					>
						<Check v-if="subtask.completed" class="w-full h-full" />
					</button>
					<p class="text-[#4D4D53] text-xs" :class="{'line-through': subtask.completed}">
						{{ subtask.title }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Check, Trash2, ChevronDown } from 'lucide-vue-next'
import { ref, computed } from 'vue'

import { useEditTodo } from '@/composables/dashboard/todo/edit'
import { useDeleteTodo } from '@/composables/dashboard/todo/delete'

const { updateTodo, highlightTodo } = useEditTodo()
const { setDeleteTodoData } = useDeleteTodo()

const showSubtasks = ref(false)

const hasSubtasks = computed(() => {
	return props.todo.subtasks && props.todo.subtasks.length > 0
})

const toggleSubtasks = () => {
	showSubtasks.value = !showSubtasks.value
}

const toggleComplete = async () => {
	await updateTodo({
		...props.todo,
		completed: !props.todo.completed,
		later: props.todo.later && !props.todo.completed ? false : props.todo.later
	})
}

const toggleSubtaskComplete = async (subtask: any) => {
	// Create a new array with the updated subtask
	const updatedSubtasks = props.todo.subtasks.map((st: any) => {
		if (st.id === subtask.id) {
			return { ...st, completed: !st.completed }
		}
		return st
	})

	// Update the todo with the new subtasks array
	await updateTodo({
		...props.todo,
		subtasks: updatedSubtasks
	})
}

const props = defineProps<{
	todo: Record<string, any>,
	draggable: boolean
}>()

const emit = defineEmits(['dragstart', 'delete'])
</script>
