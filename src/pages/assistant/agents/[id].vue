
<template>
	<div class="flex flex-col gap-4 center pt-10 px-4 2xl:max-w-5xl max-w-3xl mx-auto w-full">
		<div class="card">
			<div class="flex flex-col md:flex-row gap-4 md:items-center">
				<img src="/bot.png" alt="agent" class="size-14">
				<div class="flex flex-col gap-2 items-start">
					<h2 class="text-sm font-semibold text-textHeadline ">
						Focus Guru
					</h2>
					<div class="info">
						Idris Z. <span class="dot" /> 22 Nov 2024
					</div>
					<div class="flex items-center gap-1.5 bg-[#EFE8FD] text-[#601DED] px-2 py-1 rounded-lg text-sm font-semibold">
						<span>Private</span>
						<EyeClosed :size="16" />
					</div>
				</div>

				<div class="flex md:ml-auto gap-2">
					<button class="btn-primary gap-2 w-full md:w-auto">
						Use agent
						<MoveUpRight :size="16" />
					</button>
					<button class="btn-icon gap-2">
						<SquarePen :size="16" color="#601DED" />
					</button>
					<button class="btn-icon gap-2">
						<Trash :size="16" color="#601DED" />
					</button>
				</div>
			</div>
		</div>

		<div class="card md:mt-10 mt-4 gap-2">
			<h1 class="text-textHeadline text-base font-semibold">
				Description
			</h1>
			<p class="text-subText md:text-[15px] text-xs">
				Focus Guru helps you plan your day, block distractions, and stay on track.
			</p>
		</div>
		<div class="card md:mt-10 mt-4 gap-2">
			<h1 class="text-textHeadline text-base font-semibold">
				System Prompt
			</h1>
			<p class="text-subText md:text-[15px] text-xs">
				Focus Guru helps you plan your day, block distractions, and stay on track.
			</p>
		</div>
		<div class="card md:mt-10 mt-4 gap-2">
			<h1 class="text-textHeadline text-base font-semibold">
				Tools
			</h1>
			<p class="text-subText md:text-[15px] text-xs">
				Focus Guru helps you plan your day, block distractions, and stay on track.
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { EyeClosed, MoveUpRight, SquarePen, Trash } from 'lucide-vue-next'
import { useFetchAgentsById } from '@/composables/dashboard/assistant/agents/id'

const { fetchAgentsById, agentDetails, loading } = useFetchAgentsById()
const { id } = useRoute().params

await fetchAgentsById(id as string)

definePageMeta({
	layout: 'dashboard',
	middleware: 'is-authenticated'
})

</script>


<style scoped lang="scss">

.card {
    @apply bg-[#F6F5FF] border border-[#EFE8FD] rounded-lg py-4 px-3.5 cursor-pointer w-full flex flex-col ;
	h2{
		@apply text-textHeadline text-2xl font-semibold;
	}
	.info{
		@apply text-subText text-xs flex items-center gap-1;
		.dot{
			@apply w-1 h-1 bg-primary rounded-full inline-block;
		}
	}
}
</style>
