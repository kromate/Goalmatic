<template>
	<div class="w-full flex flex-col gap-8">
		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-4 justify-between bg-[#F9F8FB] rounded-full p-[3px]">
				<button class="h-11 center bg-white border border-[#E9E9E9] px-4 shadow rounded-full" @click="getNextMonth(false)">
					<ChevronLeft :size="16" :stroke-width="2.5" />
				</button>
				<div class="flex items-center gap-2">
					<p class="text-lg text-[#1F1F1F] font-semibold">
						{{ day }} {{ month }} {{ year }}
					</p>
					<button
						class="h-8 center bg-[#8F61F2] text-white border border-[#E9E9E9] px-3 shadow rounded-full text-sm"
						@click="$emit('go-to-today')"
					>
						Today
					</button>
				</div>
				<button class="h-11 center bg-white border border-[#E9E9E9] px-4 shadow rounded-full" @click="getNextMonth(true)">
					<ChevronRight :size="16" :stroke-width="2.5" />
				</button>
			</div>

			<div class="grid grid-cols-9 items-end gap-1">
				<button class="week_btn center" :disabled="week <= 1" @click="displayAnotherWeek(false)">
					<ChevronLeft :size="14" :stroke-width="2.5" />
				</button>
				<div v-for="(dayInfo, i) in paginatedDays" :key="i" class="flex flex-col gap-2 items-center">
					<p class="text-[#798494] text-sm font-semibold">
						{{ capitalize(dayInfo?.day).substring(0,2) }}
					</p>
					<button class="border border-[#E9E9E9] rounded center h-10 p-2 w-full"
						:class="dayInfo?.date === day ? 'bg-[#8F61F2] text-light' : 'bg-[#F6F5FF] text-[#1F1F1F]'"
						@click="day = dayInfo?.date"
					>
						<span class="text-sm font-medium">
							{{ dayInfo?.date }}
						</span>
					</button>
				</div>
				<button class="week_btn center" :disabled="week >= totalWeeksInSelectedMonth" @click="displayAnotherWeek(true)">
					<ChevronRight :size="14" :stroke-width="2.5" />
				</button>
			</div>
		</div>
		<Skeleton v-if="loading" height="200px" radius="10px" class="border-0" />
		<div v-else class="flex flex-col gap-2">
			<div class="flex flex-col gap-6 py-5 px-4 bg-[#F9F8FB] rounded-lg">
				<div class="flex flex-col gap-0.5">
					<p class="text-[#4D4D53] font-semibold text-lg">
						{{ isToday ? "Today's task" : `${day} ${month}'s task` }}
					</p>
					<p class="text-sm font-medium text-[#908F93]">
						{{ isToday ? 'Here are your tasks for today' : `Here are your tasks for ${day} ${month}` }}
					</p>
				</div>

				<div class="relative flex items-center gap-2">
					<input
						v-model.trim="title"
						type="text"
						class="input-field "
						placeholder="Add a custom to do for the day"
						@keyup.enter="title.length && createNewTodo()"
					>
					<button class="btn-primary !px-2.5 !py-2 absolute right-4" :disabled="!title?.length" @click="createNewTodo">
						<ArrowRight :size="14" />
					</button>
				</div>

				<div
					class="flex flex-col gap-2 min-h-[100px]"
					@dragover.prevent
					@drop="onDropToday"
				>
					<template v-if="todayTasks.length > 0">
						<template v-for="todo in todayTasks" :key="todo?.id">
							<ModulesTodosTaskCard
								:todo="todo"
								:draggable="true"
								@dragstart="onDragStart($event, todo)"
							/>
						</template>
					</template>
					<div v-else class="flex flex-col items-center justify-center py-6 text-center">
						<div class="mb-2 p-3 rounded-full bg-[#F2F2F2] inline-block">
							<CheckSquare :size="24" class="text-[#8F61F2]" />
						</div>
						<p class="text-[#4D4D53] font-medium">
							No tasks for today
						</p>
						<p class="text-sm text-[#908F93] mt-1">
							Add a task using the input field above
						</p>
					</div>

					<div v-if="completedTasks.length > 0" class="mt-4 pt-4 border-t border-dashed border-gray-200">
						<p class="text-sm text-[#908F93] mb-2">
							Completed
						</p>
						<template v-for="todo in completedTasks" :key="todo?.id">
							<ModulesTodosTaskCard
								:todo="todo"
								:draggable="true"
								@dragstart="onDragStart($event, todo)"
							/>
						</template>
					</div>
				</div>
			</div>
			<div class="p-4 bg-[#F2F2F2] flex flex-col gap-4 rounded-lg">
				<div class="flex items-center gap-4 justify-between">
					<div class="flex items-center gap-3">
						<ClockIcon :size="18" class="text-[#4D4D53]" />
						<p class="text-[#4D4D53] text-lg font-semibold">
							To-do Later
						</p>
						<span class="text-sm text-[#908F93]">({{ laterTasks.length }} tasks)</span>
					</div>
					<button class="bg-white py-1 px-2 shadow rounded" @click="toggleLaterSection">
						<ChevronDown :size="14" :class="{'rotate-180 transition-transform duration-200': showLaterSection}" />
					</button>
				</div>

				<div
					v-if="showLaterSection"
					class="px-2 flex flex-col gap-2 min-h-[100px]"
					@dragover.prevent
					@drop="onDropLater"
				>
					<transition name="fade">
						<div v-if="laterTasks.length > 0" class="flex flex-col gap-2">
							<template v-for="todo in laterTasks" :key="todo?.id">
								<ModulesTodosTaskCard
									:todo="todo"
									:draggable="true"
									@dragstart="onDragStart($event, todo)"
								/>
							</template>
						</div>
					</transition>
					<div v-if="!laterTasks.length" class="flex flex-col items-center justify-center py-6 text-center">
						<div class="mb-2 p-3 rounded-full bg-white inline-block">
							<Clock :size="24" class="text-[#8F61F2]" />
						</div>
						<p class="text-[#4D4D53] font-medium">
							No tasks for later
						</p>
						<p class="text-sm text-[#908F93] mt-1">
							Drag tasks here to save them for later
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Clock as ClockIcon, Clock, CheckSquare } from 'lucide-vue-next'
import { ref, computed, PropType } from 'vue'
import type { Todo } from '@/types/todo'

const props = defineProps({
  day: {
    type: Number,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  week: {
    type: Number,
    required: true
  },
  paginatedDays: {
    type: Array as PropType<{ day: string; date: number }[]>,
    required: true
  },
  totalWeeksInSelectedMonth: {
    type: Number,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  todayTasks: {
    type: Array as PropType<Todo[]>,
    default: () => []
  },
  completedTasks: {
    type: Array as PropType<Todo[]>,
    default: () => []
  },
  laterTasks: {
    type: Array as PropType<Todo[]>,
    default: () => []
  },
  isToday: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:day',
  'get-next-month',
  'display-another-week',
  'go-to-today',
  'create-new-todo',
  'drag-start',
  'drop-today',
  'drop-later'
])

const title = ref('')

// Proxy props to emit updates
const day = computed({
  get: () => props.day,
  set: (value) => emit('update:day', value)
})

// Methods to emit parent actions
const getNextMonth = (forward: boolean) => {
  emit('get-next-month', forward)
}

const displayAnotherWeek = (forward: boolean) => {
  emit('display-another-week', forward)
}



const createNewTodo = () => {
  emit('create-new-todo', title.value)
  title.value = ''
}

const onDragStart = (event: DragEvent, todo: Todo) => {
  emit('drag-start', event, todo)
}

const onDropToday = (event: DragEvent) => {
  emit('drop-today', event)
}

const onDropLater = (event: DragEvent) => {
  emit('drop-later', event)
}

const capitalize = (str: string) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Add state for controlling visibility of Later section
const showLaterSection = ref(true)

// Add function to toggle Later section
const toggleLaterSection = () => {
  showLaterSection.value = !showLaterSection.value
}
</script>

<style scoped>
.week_btn {
  @apply border border-[#E9E9E9] rounded h-10 p-2 text-[#798494] disabled:cursor-not-allowed
}
</style>
