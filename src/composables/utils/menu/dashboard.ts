import { Settings, Grid3X3, FileSpreadsheetIcon, Workflow } from 'lucide-vue-next'

import Goal from '@/assets/icons/Goal.vue'
import Todo from '@/assets/icons/Todo.vue'
import Bot from '@/assets/icons/Bot.vue'


export const dashboardRoutes = () => [

	{
		icon: Goal,
		name: 'Goals',
		route: '/goals',
		main: true,
		subRoutes: [
			{ url: '/', propagate: true }
		]
	},
	{
		icon: Todo,
		name: 'Todos',
		route: '/todos',
		main: true
	},

		{
		icon: Bot,
		name: 'Assistant',
		route: '/assistant',
		type: 'all',
		main: true,
		subRoutes: [
			{ url: '/', propagate: true }
		]
	},
		{
		icon: Workflow,
		name: 'Flows',
		route: '/flows',
		type: 'all',
		main: false,
		subRoutes: [
			{ url: '/', propagate: true }
		]
	},
		{
		icon: FileSpreadsheetIcon,
		name: 'Tables',
		route: '/tables',
		type: 'all',
		main: true,
		subRoutes: [
			{ url: '/', propagate: true }
		]
	},
	{
		icon: Grid3X3,
		name: 'Integrations',
		route: '/integrations',
		type: 'all'
	},
	{
		icon: Settings,
		name: 'Settings',
		route: '/settings',
		type: 'all'
	}
]
