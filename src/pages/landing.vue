<template>
	<main id="landing_bg" class="min-h-screen center p-4 relative">
		<div class="flex items-center gap-4 justify-between bg-transparent absolute px-4 md:px-8 py-6 top-0 w-full">
			<img src="@/assets/img/logo-white.svg">
			<div class="hidden md:flex items-center gap-8">
				<NuxtLink v-for="n,i in links" :key="i" :to="n?.route" class="text-white text-base font-semibold">
					{{ n?.text }}
				</NuxtLink>
			</div>
			<NuxtLink to="/auth/login" class="hidden md:flex px-4 py-2.5 rounded-lg bg-primary text-white text-sm border border-white font-semibold button_shadow">
				Sign In
			</NuxtLink>
			<button class="flex md:hidden">
				<IconsHamburger />
			</button>
		</div>
		<div class="flex flex-col items-center gap-10">
			<h1 class="text-white font-bold text-[49px] md:text-[80px] text-center leading-[60px] md:leading-[80px]">
				Your Goals Redefined
			</h1>
			<p class="text-sm md:text-[18px] text-white text-center max-w-[300px] md:max-w-[570px]">
				Take control of your life with GoalMatic. Build SMART goals, track progress, and achieve more effortlessly.
			</p>
			<div class="bg-white rounded-lg px-4 py-2 md:py-3 flex items-center gap-4 justify-between w-full max-w-[600px]">
				<input type="text" placeholder="What’s your goal today?" class="h-full flex-grow focus:outline-none text-[#344054]">
				<button class="px-4 py-2 md:py-2.5 rounded-lg bg-primary text-white text-sm center gap-2 border border-white font-semibold button_shadow">
					Go
					<MoveRight :stroke-width="2.5" :size="14" />
				</button>
			</div>
			<button class="text-sm font-semibold text-[#F5F1FE] center gap-0.5 mt-4 py-2 px-3 hover:bg-[rgba(212,212,212,0.1)] transition-all duration-500 rounded-md custom_shadow">
				<IconsMagicwand />
				No Goal in Mind? Try a Sample Goal!
			</button>
		</div>
	</main>
</template>

<script setup lang="ts">
import { MoveRight } from 'lucide-vue-next'
import { watchUserStateChange } from '@/firebase/auth'

const links = [
    { text: 'Home', route: '/landing' },
    { text: 'How it works', route: '/landing' },
    { text: 'Pricing', route: '/landing' },
    { text: 'FAQ\'s', route: '/landing' }
]

definePageMeta({
	layout: false
})

onMounted(() => watchUserStateChange())

</script>

<style scoped>
#landing_bg {
    background-image: url('@/assets/img/landing-bg.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.button_shadow {
    box-shadow: 0px 0px 4px 0.3px #A11DED;
}

.custom_shadow:hover {
    box-shadow: -1px -1px 1px 0.3px rgba(255, 255, 255, 0.25);
}
</style>
