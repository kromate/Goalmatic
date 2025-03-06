<template>
	<div>
		<div
			class="bg-white p-3 shadow rounded-md flex flex-col gap-3"
			:draggable="draggable"
			:class="{ 'opacity-75': todo.completed }"
			@dragstart="$emit('dragstart', $event)"
			@click="highlightTodo(todo)"
		>
			<div class="flex items-center gap-3 justify-between">
				<div class="flex items-center gap-3 flex-grow">
					<button
						class="w-5 h-5 rounded-full border flex-shrink-0 text-light"
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
					<span v-if="todo.later" class="text-xs text-orange-500 bg-orange-50 px-2 py-1">Later</span>

					<button @click.stop="setDeleteTodoData(todo)">
						<Trash2 :size="14" class="text-gray-400 hover:text-red-500" />
					</button>
				</div>
			</div>

			<!-- Due date/time and duration information -->
			<div v-if="hasDueDate || hasDuration" class="flex flex-wrap gap-2 ml-8 mt-1">
				<div v-if="hasDueDate" class="flex items-center gap-1 text-xs text-gray-500">
					<Calendar :size="12" />
					<span>{{ formattedDueDate }}</span>
					<span v-if="todo.dueTime">at {{ todo.dueTime }}</span>
				</div>

				<div v-if="hasDuration" class="flex items-center gap-1 text-xs text-gray-500">
					<Clock :size="12" />
					<span v-if="todo.estimatedDuration">Est: {{ todo.estimatedDuration }}m</span>
					<span v-if="todo.actualDuration" class="ml-1">
						Actual: {{ todo.actualDuration }}m
						<span v-if="durationDifference !== 0"
							:class="durationDifference > 0 ? 'text-red-500' : 'text-green-500'">
							({{ durationDifference > 0 ? '+' : '' }}{{ durationDifference }}m)
						</span>
					</span>
				</div>
			</div>
			<!-- Subtasks section -->
			<div v-if="hasSubtasks" class="pl-8 mt-1 space-y-2 border-t border-[#E9E9E9]">
				<div class="flex items-center justify-between gap-2 text-grey_four text-sm pt-2" @click.stop="toggleSubtasks">
					<p>{{ props.todo.subtasks.length }} sub task ({{ props.todo.subtasks.filter((subtask: any) => subtask.completed).length }} completed)</p>
					<button class="bg-hover py-1 px-2 border border-line rounded">
						<ChevronDown :size="14" :class="{'rotate-180 transite': showSubtasks}" />
					</button>
				</div>
				<transition name="fade">
					<div v-if="showSubtasks" class="flex flex-col gap-2">
						<div
							v-for="subtask in todo.subtasks"
							:key="subtask.id"
							class="bg-white p-2 shadow rounded-md flex items-center gap-2 justify-between "
						>
							<div class="flex items-center gap-2 flex-grow">
								<button
									class="w-4 h-4 rounded-full border flex-shrink-0 text-light"
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
				</transition>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Check, Trash2, ChevronDown, Calendar, Clock } from 'lucide-vue-next'
import { ref, computed } from 'vue'

import { useEditTodo } from '@/composables/dashboard/todo/edit'
import { useDeleteTodo } from '@/composables/dashboard/todo/delete'

const { updateTodo, highlightTodo } = useEditTodo()
const { setDeleteTodoData } = useDeleteTodo()

const showSubtasks = ref(false)

const hasSubtasks = computed(() => {
	return props.todo.subtasks && props.todo.subtasks.length > 0
})

const hasDueDate = computed(() => {
	return props.todo.dueDate && props.todo.dueDate !== ''
})

const hasDuration = computed(() => {
	return (props.todo.estimatedDuration && props.todo.estimatedDuration > 0) ||
		(props.todo.actualDuration && props.todo.actualDuration > 0)
})

const durationDifference = computed(() => {
	if (props.todo.actualDuration && props.todo.estimatedDuration) {
		return props.todo.actualDuration - props.todo.estimatedDuration
	}
	return 0
})

const formattedDueDate = computed(() => {
	if (!props.todo.dueDate) return ''

	try {
		const date = new Date(props.todo.dueDate)
		return date.toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
			year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
		})
	} catch (e) {
		return props.todo.dueDate
	}
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


