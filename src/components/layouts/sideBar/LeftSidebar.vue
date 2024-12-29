<template>
	<aside class="hidden md:flex min-h-screen flex-col">
		<div class="h-full relative pt-6 pb-2 w-full flex flex-col gap-8 justify-start overflow-auto border-r border-[#E9E9E9]">
			<div class="w-full flex justify-start ">
				<img src="/lt.svg" alt="" class="w-[190px] pl-6">
			</div>

			<div class="flex flex-col gap-3 px-3">
				<div class="flex flex-col gap-2">
					<NuxtLink v-for="n,i in routes" :key="i" :to="n?.route" active-class="link_active" class="link">
						<component :is="n.icon" class="w-5 h-5" />
						<span class="text-sm">
							{{ n.name }}
						</span>
					</NuxtLink>
				</div>
			</div>

			<div class="border-t mx-2 mt-auto p-4">
				<div class="flex items-center gap-4 justify-between">
					<div class="flex items-center gap-3">
						<Avatar :src="user!.photoURL" :name="user!.displayName ?? userProfile!.name" :size="30" />
						<p class="text-[#101928] text-sm font-medium">
							{{ user!.displayName ?? userProfile!.name }}
						</p>
					</div>
					<button @click="useAuthModal().openLogout()">
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
import { useAuthModal } from '@/composables/core/modals'

const { user, userProfile } = useUser()

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
