import { Link, Brain, Settings, Grid3X3, CheckCheck, StickyNote } from 'lucide-vue-next'
import Home from '@/assets/icons/Home.vue'
import Goal from '@/assets/icons/Goal.vue'
import Note from '@/assets/icons/Note.vue'
import Todo from '@/assets/icons/Todo.vue'
import Bot from '@/assets/icons/Bot.vue'
import Calendar from '@/assets/icons/Calendar2.vue'

export const dashboardRoutes = () => [

	// {
	// 	icon: Home,
	// 	name: 'Home',
	// 	route: '/dashboard',
	// 	main: true
	// },
	{
		icon: Goal,
		name: 'Goals',
		route: '/goals',
		main: true
	},
	{
		icon: Todo,
		name: 'Todos',
		route: '/todos',
		main: true
	},
	// {
	// 	icon: Note,
	// 	name: 'Notes',
	// 	route: '/notes',
	// 	main: true
	// },
	// {
	// 	icon: Calendar,
	// 	name: 'Calendar',
	// 	route: '/calendar',
	// 	main: true
	// },
	{
		icon: Grid3X3,
		name: 'Integrations',
		route: '/integrations',
		type: 'all'
	},
	{
		icon: Bot,
		name: 'Assistant',
		route: '/assistant',
		type: 'all',
		main: true
	},
	{
		icon: Settings,
		name: 'Settings',
		route: '/settings',
		type: 'all'
	}

]
