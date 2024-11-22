import { Link, Brain, Settings, Grid3X3, CheckCheck, StickyNote, Calendar } from 'lucide-vue-next'

export const dashboardRoutes = () => [

	{
		icon: Link,
		name: 'Goals',
		route: '/goals',
		main: true,
		bg: '#e5e7eb',
		color: '#18181B'
	},
	{
		icon: CheckCheck,
		name: 'Todos',
		route: '/todos',
		main: true,
		bg: '#e5e7eb',
		color: '#18181B'
	},
	{
		icon: StickyNote,
		name: 'Notes',
		route: '/notes',
		main: true,
		bg: '#e5e7eb',
		color: '#18181B'
	},
	{
		icon: Calendar,
		name: 'Calendar',
		route: '/calendar',
		main: true,
		bg: '#e5e7eb',
		color: '#18181B'
	},


	// {
	// 	icon: User,
	// 	name: 'Partners',
	// 	route: '/contacts',
	// 	main: true,
	// 	type: 'all',
	// 	bg: '#e5e7eb',
	// 	color: '#18181B'
	// },

	{
		icon: Grid3X3,
		name: 'Integrations',
		route: '/integrations',
		type: 'all',
		bg: '#e5e7eb',
		color: '#18181B'
	},
	{
		icon: Brain,
		name: 'Assistant',
		route: '/assistant',
		type: 'all',
		bg: '#e5e7eb',
		color: '#18181B'
	},
	{
		icon: Settings,
		name: 'Settings',
		route: '/settings',
		type: 'all',
		bg: '#e5e7eb',
		color: '#18181B'
	}

]
