<template>
	<main v-if="!IntegrationListLoading" class="w-full">
		<section class="flex flex-col p-4 gap-4">
			<header class="flex  justify-between items-center">
				<h1 class="text-lg font-medium ">
					Calendar Integrations
				</h1>
				<button class="btn-sm btn-primary text-sm px-3 py-2" @click="link">
					Add Integration
				</button>
			</header>
			<div class="grid md:grid-cols-2  xl:grid-cols-3 gap-4 w-full">
				<article v-for="integration in fetchedIntegrations" :key="integration.id" class="flex flex-wrap border border-line rounded-md  p-4 gap-4 items-center">
					<GoogleIcon class="w-10 h-10" />
					<div class="flex flex-col gap-2">
						<h1 class="font-medium">
							{{ capitalize(integration.provider) }} Calendar
						</h1>
						<span class="text-sm link">
							{{ integration.email }}
						</span>
					</div>


					<button class="btn-sm ml-auto" :disabled="true">
						<span>
							{{ 'Connected' }}
						</span>
					</button>
				</article>
			</div>
		</section>
	</main>

	<Skeleton v-if="IntegrationListLoading" height="70vh" />
</template>

<script setup lang="ts">

import GoogleIcon from '@/assets/icons/Google.vue'
import { useFetchIntegrations } from '@/composables/dashboard/integrations/fetch'
import { usePageHeader } from '@/composables/utils/header'
import { useLinkGoogleCalendar } from '@/composables/dashboard/integrations/link'
import { capitalize } from '@/composables/utils/formatter'





const { fetchUserIntegrations, loading: IntegrationListLoading, fetchedIntegrations, hasIntegration } = useFetchIntegrations()

const { link, loading: linkGoogleCalLoading, integrationKeys } = useLinkGoogleCalendar()



const hasGoogleCal = computed(() => {
	if (hasIntegration(integrationKeys.google_calendar).value) {
		const data = fetchedIntegrations.value.filter((integration) => integration.id === integrationKeys.google_calendar)
		return {
			status: true,
			...data[0]
		}
	} else {
		return {
			status: false
		}
	}
})

fetchUserIntegrations()



definePageMeta({
	layout: 'dashboard',
	middleware: ['is-authenticated', () => {
		usePageHeader().setPageHeader({
			title: 'Integrations',
			description: 'Connect your account with other services',

			shouldShowFab: false,
			shouldShowTab: false

		})
	}]
})
</script>

<style scoped></style>
