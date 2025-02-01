<template>
	<header class=" flex items-center justify-between py-4 md:px-5 px-4 bg-transparent border-b border-[#E9E9E9]">
		<span class="hidden md:flex" />
		<img src="/lt.svg" alt="" class="w-[130px] md:hidden">

		<div class="flex items-center gap-4">
			<div class="relative" @click.stop>
				<ClientOnly>
					<DropdownMenuRoot>
						<DropdownMenuTrigger class="bg-tertiary text-[#2D00BA] rounded-lg p-2 px-4 border border-line center gap-2 pc">
							<IconsHeadset />
							<span class="text-sm">Support</span>
						</DropdownMenuTrigger>
						<DropdownMenuPortal>
							<DropdownMenuContent class="w-[280px] my-2 p-2 border border-line rounded-lg bg-white shadow-lg z-[999]">
								<div class="p-2 space-y-2">
									<div class="flex items-center justify-between gap-2">
										<DropdownMenuItem as="a" href="mailto:support@taaskly.com" class="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-tertiary flex-1">
											<Mail class="size-4 text-[#2D00BA]" />
											<span class="text-sm">Email Support</span>
										</DropdownMenuItem>
										<button class="p-2 hover:bg-tertiary rounded-lg" @click="copyToClipboard('support@goalmatic.io')">
											<Copy class="size-4 text-[#2D00BA]" />
										</button>
									</div>
									<div class="flex items-center justify-between gap-2">
										<DropdownMenuItem as="a" href="https://wa.me/+2348146923944" target="_blank" class="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-tertiary flex-1">
											<MessageSquare class="size-4 text-[#2D00BA]" />
											<span class="text-sm">WhatsApp Support</span>
										</DropdownMenuItem>
										<button class="p-2 hover:bg-tertiary rounded-lg" @click="copyToClipboard('https://wa.me/+2348146923944')">
											<Copy class="size-4 text-[#2D00BA]" />
										</button>
									</div>
								</div>
							</DropdownMenuContent>
						</DropdownMenuPortal>
					</DropdownMenuRoot>
				</ClientOnly>
			</div>
			<AvatarDropdown class="md:hidden" />
		</div>
	</header>
</template>

<script setup lang="ts">
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'radix-vue'
import { Mail, MessageSquare, Copy } from 'lucide-vue-next'
import { usePageHeader } from '@/composables/utils/header'
import AvatarDropdown from '@/components/core/AvatarDropdown.vue'
import { useAlert } from '@/composables/core/notification'

const { headstate } = usePageHeader()
const { openAlert } = useAlert()

const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text)
		openAlert({
			msg: 'Copied to clipboard!',
			type: 'SUCCESS'
		})
	} catch (err) {
		openAlert({
			msg: 'Failed to copy to clipboard',
			type: 'ERROR'
		})
	}
}
</script>

<style scoped>
.btn-primary{
@apply text-sm px-5 py-3 md:text-base md:px-10
}
</style>
