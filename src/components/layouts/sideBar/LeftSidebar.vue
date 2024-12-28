<template>
	<aside class="hidden md:flex min-h-screen flex-col">
		<div class="h-full relative pt-6 pb-2 w-full flex flex-col gap-8 justify-between overflow-auto border-r border-[#E9E9E9]">
			<div class="w-full flex justify-start ">
				<!-- <img src="/lt.svg" alt="logo" class="w-36 pc pl-6"> -->
				<!-- <img src="/og.png" alt="logo" class="w-8 mobile mx-auto"> -->
				<img src="@/assets/img/logo.svg" alt="" class="w-[190px] pl-6">
			</div>

			<div class="flex flex-col gap-3 px-3">
				<div class="flex flex-col">
					<NuxtLink v-for="n,i in links" :key="i" :to="n?.route" active-class="link_active" class="link">
						<component :is="n.icon" class="w-5 h-5" />
						<span class="text-sm">
							{{ n.name }}
						</span>
					</NuxtLink>
				</div>
				<div class="border-b border-[#E9E9E9] px-4" />
				<div class="flex flex-col gap-3">
					<NuxtLink to="/settings" active-class="link_active" class="link">
						<component :is="Settings" class="w-5 h-5" />
						<span class="text-sm">
							Settings
						</span>
					</NuxtLink>
					<div class="rounded-lg p-4 flex flex-col gap-2 bg-[#F5F1FE]">
						<IconsSmiley />
						<div class="flex flex-col gap-0 text-textHeadline">
							<p class="text-sm font-medium">
								You’re running out of credits
							</p>
							<p class="text-[11px] text-textHeadline">
								Upgrade to Goalmatic Pro+ for unlimited access or wait for your credits to refresh next month.
							</p>
						</div>
						<div class="flex items-center gap-4 text-sm">
							<button class="text-[#7A797E] font-medium">
								Dismiss
							</button>
							<button class="text-primary font-medium">
								Upgrade Plan
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- <div class="relative mt-[40px] flex flex-col lg:gap-2 gap-1">
				<div v-for="n in routes" :key="n.name" class="relative lg:px-4">
					<span class="w-full flex flex-col gap-4  px-2 lg:p-0">

						<nuxt-link :to="n.route" class="flex items-center black use-hover text-textHeadline" :style="{
							backgroundColor: $route.path === n.route ? n.bg : '',
							color: $route.path === n.route ? n.color : '',
							'--link-bg-color': $route.path === n.route ? n.color : ''
						}">
							<component :is="n.icon" class="lg:mr-4 lg:ml-0 mx-auto lg:w-5 lg:h-5 w-[18px] h-[18px]" />
							<p class="text-sm hidden lg:block">
								{{ n.name }}
							</p>
						</nuxt-link>



					</span>
				</div>
			</div> -->


			<!-- <div class=" absolute bottom-0 flex flex-col gap-2 w-full p-4">
				<slot name="footer">
					<nuxt-link to="/focus" class="btn">
						Focus Mode
					</nuxt-link>
					<AvatarDropdown />
				</slot>
			</div> -->
			<div class="border-t mx-2 p-4">
				<div class="flex items-center gap-4 justify-between">
					<div class="flex items-center gap-3">
						<Avatar :size="30" />
						<p class="text-[#101928] text-sm font-medium">
							{{ user?.displayName || 'N/A' }}
						</p>
					</div>
					<button @click="useSignin().signOut()">
						<IconsLogout />
					</button>
				</div>
			</div>
		</div>
	</aside>
</template>

<script lang="ts" setup>
import { Link, Brain, Settings, Grid3X3, CheckCheck, StickyNote, Calendar } from 'lucide-vue-next'
import AvatarDropdown from '@/components/core/AvatarDropdown.vue'
import { useSignin } from '@/composables/auth/auth'
import { useUser } from '@/composables/auth/user'

const { user } = useUser()

type RouteType = {
	route: string;
	name: string;
	icon: string | any;
	bg?: string;
	color?: string;
}

defineProps({
	routes: {
		type: Array as PropType<RouteType[]>,
		required: true,
		default: () => []
	}
})

const links = [

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
}
// {
// 	icon: Settings,
// 	name: 'Settings',
// 	route: '/settings',
// 	type: 'all',
// 	bg: '#e5e7eb',
// 	color: '#18181B'
// }
]

</script>

<style scoped lang="scss">
:deep(a) {
	@apply text-grey_two w-full lg:h-11 h-10 lg:px-6 lg:pr-3 duration-75 rounded-md;

	&:hover.use-hover {
		@apply bg-hover;
	}
}


/* exact link will show the primary color for only the exact matching link */
:deep(a.router-link-exact-active.black) {
	@apply text-dark font-semibold;
	// color: var(--primary);
	border-color: var(--primary);
	background-color: #F4F3FF;

	// & > svg {
	// 	color: var(--primary);
	// }
	& ::before {
		content: '';
		@apply absolute left-0 top-0 w-1.5 h-full border border-dark rounded-full;
		background-color: var(--link-bg-color);

	}
}

:deep(:focus) {
	outline: none;
}

.link {
	@apply flex items-center gap-2.5 text-textHeadline py-3 !px-4 rounded-lg hover:text-primary hover:font-medium hover:border hover:bg-[#F5F1FE] border-primary
}

.link_active {
	@apply text-primary font-medium border bg-[#F5F1FE] border-primary
}
</style>
