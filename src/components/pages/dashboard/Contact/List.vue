<template>
	<section class="p-4 grid md:grid-cols-2 gap-4">
		<article v-for="contact in contacts" :key="contact.email" to="#" class="flex border border-line rounded-md hover:btn_shadow p-4">
			<div class="flex flex-col md:flex-row md:gap-14 gap-7">
				<div class="flex flex-col  gap-2.5  justify-between items-start">
					<h1 class="text-sm font-semibold flex items-center gap-4">
						<span>{{ contact.name }} </span>
						<span class="items-start pill">
							{{ contact.booking_count }} {{ contact.booking_count > 1 ? 'bookings' : 'booking' }}
						</span>
					</h1>
					<p class="text-sm">
						{{ contact.email }}
					</p>
					<p class="text-sm">
						{{ contact.phone }}
					</p>

					<div class="flex items-center text-sm">
						<span class="font-medium">Created at:</span>
						<span class=" ml-2">{{ formatDateString(contact.created_at) }}</span>
					</div>
				</div>
			</div>
		</article>
	</section>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/auth/user'
import { formatDateString } from '@/composables/utils/formatter'

const { userProfile } = useUser()


defineProps({
	contacts: {
		type: Array,
		required: true
	}
})


</script>

<style scoped></style>
