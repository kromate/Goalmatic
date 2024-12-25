<template>
	<section>
		<section class="center flex-col  gap-4">
			<Users :size="80" />
			<h1 class="text-xl font-bold mt-3">
				Find an Accountability Partner
			</h1>
			<p>
				Click the button below to copy the invite link and send it to a friend to become your accountability partner
			</p>
			<button class="btn-primary" @click="copyInviteCode">
				Copy Invite Link
			</button>
		</section>
	</section>
</template>

<script setup>
import { Users } from 'lucide-vue-next'
import { useCopyToClipboard } from '@/composables/utils/share'
import { useFetchGoalsById } from '@/composables/dashboard/goals/id'

const { goalDetails } = useFetchGoalsById()
const { copyData } = useCopyToClipboard()

const copyInviteCode = () => {
	copyData({ info: `${location.host}/partners/invite/${goalDetails.value.id}`, msg: 'Invite link copied to clipboard' })
}
</script>

<style lang="scss" scoped></style>
