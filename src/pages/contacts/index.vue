

<template>
	<main v-if="!contactIsEmpty && !loading">
		<DashboardContactList :contacts="fetchedContacts" />
	</main>
	<section v-if="contactIsEmpty && !loading" class="center flex-col min-h-[70vh] gap-4">
		<Contact2 :size="80" />
		<h1 class="text-xl font-mediumm mt-3">
			You currently have no contacts
		</h1>
		<p>Share your booking links to acquire contacts</p>
		<nuxt-link to="booking-types" class="btn-primary">
			Go to booking type
		</nuxt-link>
	</section>
	<Skeleton v-if="loading" height="70vh" />
</template>

<script setup lang="ts">
import { Contact2 } from 'lucide-vue-next'
import { usePageHeader } from '@/composables/utils/header'
import { useFetchContacts } from '@/composables/dashboard/contact/fetch'



const { contactIsEmpty, fetchUserContacts, fetchedContacts, loading } = useFetchContacts()

fetchUserContacts()



definePageMeta({
	layout: 'dashboard',
	middleware: ['is-authenticated', () => {
usePageHeader().setPageHeader({
	title: 'Contacts',
	description: 'Record of individuals who have booked with you',

	shouldShowFab: false,
	shouldShowTab: false

})
	}]
})
</script>

<style scoped>

</style>
