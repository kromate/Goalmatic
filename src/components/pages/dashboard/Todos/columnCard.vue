<template>
	<div
		class="group bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors border border-line cursor-pointer"
		:class="{ 'bg-gray-100/50': props.todo.completed }"
		@click="highlightTodo(props.todo)"
	>
		<div class="flex items-start justify-between">
			<div class="flex items-start gap-2 flex-1">
				<div class="flex h-6 items-center">
					<input
						:id="props.todo.id"
						:checked="props.todo.completed"
						type="checkbox"
						class="size-4 mt-0 rounded border-gray-300 text-indigo-600 !ring-0 !outline-none border-line form-checkbox cursor-pointer hover:shadow hover:border-indigo-600 border-[2px]"
						@change="toggleComplete"
						@click.stop
					>
				</div>
				<div :class="{ 'opacity-50': props.todo.completed }">
					<h4 class="font-medium text-gray-900" :class="{ 'line-through': props.todo.completed }">
						{{ todo.title }}
					</h4>
					<p class="mt-1 text-sm text-gray-600" :class="{ 'line-through': props.todo.completed }">
						{{ todo.description }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import { useEditTodo } from '@/composables/dashboard/todo/edit'




const { highlightTodo } = useEditTodo()

const props = defineProps<{
  todo: {
    id: string;
    title: string;
    description: string;
    completed?: boolean;
  };
}>()

const toggleComplete = () => {

}
</script>

<style scoped>
.column-card {
  @apply p-4 rounded-lg shadow-sm;

}

.column-card-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.column-card-desc {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.column-card-badge {
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
}

.column-card-icon,
.column-card-icon-del {
  float: right;
  cursor: pointer;
  margin-left: 0.5rem;
}
</style>
