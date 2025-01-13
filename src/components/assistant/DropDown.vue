<template>
	<div class="relative w-full" @click.stop>
		<ClientOnly>
			<DropdownMenuRoot>
				<DropdownMenuTrigger class="border border-[#BFA5F8] bg-tertiary rounded-3xl px-3.5 py-2 flex items-center gap-2">
					<IconsStick />
					<span class="text-xs font-semibold text-primary">Goalmatic 1.0</span>
					<ChevronDown class="size-3" />
				</DropdownMenuTrigger>
				<DropdownMenuPortal>
					<DropdownMenuContent align="start" class="w-[247px] my-2 p-2 border border-[#BFA5F8]  rounded-2xl  bg-tertiary ">
						<DropdownMenuItem class="flex items-center gap-2 p-2  rounded-lg cursor-pointer hover:bg-[#601DED1A]">
							<IconsStick />
							<div class="flex flex-col">
								<span class="text-xs font-semibold text-primary">Goalmatic 1.0</span>
								<span class="text-[10px] font-medium text-primary">Default Agent</span>
							</div>
							<div class="ml-auto">
								<Eye class="size-4 text-[#1300A0]" />
							</div>
						</DropdownMenuItem>

						<hr class="border-t border-[#601DED24] my-2">
						<DropdownMenuItem class="flex items-center gap-2 p-2  rounded-lg cursor-pointer hover:bg-[#601DED1A]">
							<IconsCompass />
							<div class="flex flex-col">
								<span class="text-xs font-semibold text-primary">Discover More Agent</span>
								<span class="text-[10px] font-medium text-primary">Find the agent for you</span>
							</div>
							<div class="ml-auto">
								<ArrowRight class="size-4 text-[#1300A0]" />
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenuPortal>
			</DropdownMenuRoot>
		</ClientOnly>
	</div>
</template>

<script setup>
import { ChevronDown, Eye, Compass, ArrowRight } from 'lucide-vue-next'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'radix-vue'
</script>

<style scoped>
:deep(.DropdownMenuContent) {
	@apply !z-[999] !opacity-100;
}
</style>
