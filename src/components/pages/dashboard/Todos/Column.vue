<template>
	<article class="column">
		<header>
			<div class="flex items-center justify-start gap-4">
				<h2 class="text-lg font-semibold text-gray-900">
					{{ formattedDate }}
				</h2>
				<ColorBadge v-if="isToday(props.date)" name="today" class="text-lg  text-center !px-3 !py-1 !text-xs" />
			</div>

			<p class="text-sm text-gray-500">
				{{ dayOfWeek }}
			</p>
		</header>

		<div class="relative">
			<input
				v-model="title"
				type="text"
				class="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg  input-field"
				placeholder="Enter a todo for the day"
				@keyup.enter="createNewTodo"
			>
			<button class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors">
				<SendHorizonal v-if="title" class="w-6 h-6 text-primary" @click="createNewTodo" />
				<PlusCircle v-else class="w-6 h-6 text-primary" />
			</button>
		</div>


		<TransitionGroup
			name="todo-list"
			tag="div"
			class="flex flex-col gap-4"
		>
			<draggable :key="'draggable-' + props.date" :list="todo" group="tasks" item-key="id" class="flex flex-col gap-4" @change="moveTodo($event, props.date)">
				<div v-for="element in todo" :key="element.id">
					<PagesDashboardTodosColumnCard :todo="element" />
				</div>
			</draggable>
			<div v-if="todo.length === 0" :key="'empty-' + props.date" class="items-center justify-center flex flex-col gap-2">
				<ListTodo :size="40" class="text-gray-400" />
				<p class="text-gray-500">
					You have no todos for this day
				</p>
			</div>
		</TransitionGroup>
	</article>
</template>

<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { ListTodo, PlusCircle, SendHorizonal } from 'lucide-vue-next'
import { Todo } from '@/composables/types'
import { useCreateTodo } from '@/composables/dashboard/todo/create'
import { isToday } from '@/composables/utils/formatter'
import { useMoveTodo } from '@/composables/dashboard/todo/move'

const { createTodo, createBoardForm } = useCreateTodo()
const { moveTodo } = useMoveTodo()
const title = ref('')

const props = defineProps({
	date: {
		type: String,
		required: true
	},
	todo: {
		type: Array as PropType<Todo[]>,
		required: true
	}
})

const createNewTodo = async () => {
	createBoardForm.date = new Date(props.date).toISOString()
	createBoardForm.title = title.value
	await createTodo()
	createBoardForm.date = ''
	title.value = ''
}

const emit = defineEmits(['addTodo', 'updateTodo', 'deleteTodo'])


const formattedDate = computed(() => {
	return useDateFormat(props.date, 'MMM D, YYYY').value
})

const dayOfWeek = computed(() => {
	return useDateFormat(props.date, 'dddd').value
})

</script>

<style scoped>
.column {
	@apply flex flex-col border border-line rounded-lg p-4 gap-4;
  flex: 0 0 300px;

}

.todo-list-move,
.todo-list-enter-active,
.todo-list-leave-active {
	transition: all 0.3s ease;
}

.todo-list-enter-from,
.todo-list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}

.todo-list-leave-active {
	position: absolute;
}
</style>
