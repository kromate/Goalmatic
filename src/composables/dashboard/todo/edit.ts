import { Timestamp } from 'firebase/firestore'
import { useTodoDate } from './date_logic'
import { updateFirestoreSubDocument } from '@/firebase/firestore/edit'
import { useUser } from '@/composables/auth/user'
import { useDashboardModal } from '@/composables/core/modals'
import { Todo } from '@/types/todo'
const selectedTodo = ref()


export const useEditTodo = () => {
    const { dateState } = useTodoDate()
    const draggedTodo = ref()
    const showSubtasks = ref(false)
    const { id: user_id } = useUser()
    const loading = ref(false)
    const highlightTodo = (todo: Record<string, any>) => {
        selectedTodo.value = todo
        useDashboardModal().openEditTodo()
    }

    const updateTodo = async (data: Record<string, any>) => {
        loading.value = true
        const sent_data = {
            ...data,
            user_id: user_id.value,
            updated_at: Timestamp.fromDate(new Date())
        } as Record<string, any>

        await updateFirestoreSubDocument('users', user_id.value!, 'todos', sent_data?.id, sent_data)
        useDashboardModal().closeEditTodo()
        loading.value = false
    }

    // Drag and drop functionality
    function onDragStart(event, todo) {
        draggedTodo.value = todo
        event.dataTransfer.effectAllowed = 'move'
    }

    async function onDropToday() {
        if (draggedTodo.value && draggedTodo.value.later) {
            const targetDate = new Date(`${dateState.day}/${dateState.month}/${dateState.year}`)
            await updateTodo({
                ...draggedTodo.value,
                former_date: draggedTodo.value.date,
                date: targetDate.toISOString(),
                later: false
            })
        }
        draggedTodo.value = null
    }

    async function onDropLater() {
        if (draggedTodo.value && !draggedTodo.value.later && !draggedTodo.value.completed) {
            await updateTodo({
                ...draggedTodo.value,
                later: true
            })
        }
        draggedTodo.value = null
    }

    const toggleSubtasks = () => {
	showSubtasks.value = !showSubtasks.value
}

    const toggleComplete = async (props) => {
	await updateTodo({
		...props.todo,
		completed: !props.todo.completed,
		later: props.todo.later && !props.todo.completed ? false : props.todo.later
	})
}

const toggleSubtaskComplete = async (props: any, subtask: any) => {
	const updatedSubtasks = props.todo.subtasks?.map((st: any) => {
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


    return { highlightTodo, selectedTodo, updateTodo, loading, draggedTodo, onDragStart, onDropToday, onDropLater, showSubtasks, toggleSubtasks, toggleComplete, toggleSubtaskComplete }
}
