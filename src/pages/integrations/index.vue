<template>
	<main class="p-6 flex flex-col gap-8">
		<div class="flex flex-col gap-1">
			<h3 class="text-headline font-semibold text-2xl md:text-[28px]">
				Your Integrations
			</h3>
			<p class="text-base text-[#37363D]">
				Improve your experience by integrating your favourite integration.
			</p>
		</div>

		<div class="flex flex-wrap gap-6">
			<template v-if="IntegrationListLoading">
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
					<Skeleton v-for="i in 2" :key="i" width="100%" height="200px" radius="8px" />
				</div>
			</template>
			<template v-else>
				<IntegrationsCard
					v-for="integration in formattedAvailableIntegrations(fetchedIntegrations)"
					:key="integration.name"
					v-bind="integration"
					class="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
					@update="updateIntegration($event)"
					@editConfig="editConfig($event)"
				/>
			</template>
		</div>
	</main>
</template>

<script setup lang="ts">
import { useFetchIntegrations } from '@/composables/dashboard/integrations/fetch'
import { usePageHeader } from '@/composables/utils/header'
import { formattedAvailableIntegrations } from '@/composables/dashboard/integrations/list'
import { useConnectIntegration } from '@/composables/dashboard/integrations/connect'
import { useDisconnectIntegration } from '@/composables/dashboard/integrations/disconnect'
import { useEditIntegrationsConfig } from '@/composables/dashboard/integrations/editConfig'


const { connectIntegration, loading: connectIntegrationLoading } = useConnectIntegration()
const { disconnectIntegration, loading: disconnectIntegrationLoading } = useDisconnectIntegration()
const { fetchUserIntegrations, loading: IntegrationListLoading, fetchedIntegrations } = useFetchIntegrations()
const { editConfig } = useEditIntegrationsConfig()

fetchUserIntegrations()

const updateIntegration = (data: any) => {
	if (data.status) {
		connectIntegration(data.integration_id)
	} else {
		disconnectIntegration(data.id)
	}
}

definePageMeta({
	layout: 'dashboard',
	middleware: [
		'is-authenticated',
		() => {
			usePageHeader().setPageHeader({
				title: 'Integrations',
				description: 'Connect your account with other services',

				shouldShowFab: false,
				shouldShowTab: false
			})
		}
	]
})
</script>

<style scoped></style>
