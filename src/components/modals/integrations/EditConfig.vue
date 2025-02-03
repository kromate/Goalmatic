
<template>
	<Modal
		modal="$atts.modal"
		:title="modalData.title"
		:is-full-height="false"
	>
		<form class="auth-form mt-4 p-1" @submit.prevent="">
			<div v-for="field in modalData.fields" :key="field.key" class="field relative">
				<label for="start">{{ field.name }}</label>
				<Select
					v-model="modalData.config[field.key]"
					:options="field.options ? field.options : [] as any"
					class="input-field"
				/>
			</div>

			<!-- {{ modalData.config }} -->

			<div class="grid grid-cols-1 gap-4 mt-6 w-full ">
				<button class="btn-primary text-light" :disabled="loading">
					<span v-if="!loading"> Update </span>
					<Spinner v-else />
				</button>
			</div>
		</form>
	</Modal>
</template>

<script setup lang="ts">

import { useEditIntegrationsConfig } from '@/composables/dashboard/integrations/editConfig'

const { modalData, loading } = useEditIntegrationsConfig()



</script>

<style>

</style>
