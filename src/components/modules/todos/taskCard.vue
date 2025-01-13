<template>
	<div class="bg-white shadow rounded-md p-4 flex flex-col">
		<div class="flex items-center gap-4 justify-between" @click="highlightTodo(props.todo)">
			<div class="flex items-start gap-3">
				<input
					:id="props.todo.id"
					:checked="props.todo.completed"
					type="checkbox"
					class="size-4 mt-0 rounded border-gray-300 text-indigo-600 !ring-0 !outline-none border-line form-checkbox cursor-pointer hover:shadow hover:border-indigo-600 border-[2px]"
					@change="toggleComplete"
					@click.stop
				>
				<div class="flex flex-col gap-0.5 -mt-2">
					<p class="text-[#4D4D53] text-base md:text-lg font-semibold" :class="{ 'line-through': todo?.completed }">
						{{ todo?.title }}
					</p>
					<p class="text-[#89898B] text-sm font-medium" :class="{ 'line-through': todo?.completed }">
						{{ todo?.description || '' }}
					</p>
					<!-- <p class="text-[#89898B] text-sm font-medium">
						2 sub tasks(0/2 completed)
					</p> -->
				</div>
			</div>
			<div class="flex items-center gap-1 text-sm text-[#7285A1] font-medium shrink-0">
				<Clock :size="14" />
				<p class="mt-[2px]">
					{{ todo?.estimated_duration || 'N/A' }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Clock } from 'lucide-vue-next'
import { useUpdateCompleteStatusOfTodo } from '@/composables/dashboard/todo/completed'
import { useEditTodo } from '@/composables/dashboard/todo/edit'

const { updateCompleteStatusOfTodo } = useUpdateCompleteStatusOfTodo()
const { highlightTodo } = useEditTodo()

const toggleComplete = () => {
  updateCompleteStatusOfTodo(props.todo, !props.todo.completed)
}

const props = defineProps<{
  todo: Record<string, any>
}>()

</script>
