<template>
	<Modal
		modal="$atts.modal"
		:title="modalData.title"
		:is-full-height="false"
	>
		<form class="auth-form mt-4 p-1" @submit.prevent="">
			<div v-for="field in modalData.fields" :key="field.key" class="field relative">
				<label>{{ field.name }}</label>
				<template v-if="field.type === 'TEXT'">
					<input
						v-model="modalData.config[field.key]"
						type="text"
						class="input-field"
						:placeholder="`Enter ${field.name.toLowerCase()}`"
					>
				</template>
				<template v-else-if="field.type === 'SELECT'">
					<Select
						v-model="modalData.config[field.key]"
						:options="field.options ? field.options : []"
						class="input-field"
					/>
				</template>
			</div>

			<div class="grid grid-cols-1 gap-4 mt-6 w-full">
				<button class="btn-primary text-light" :disabled="loading" @click="updateConfig">
					<span v-if="!loading">Update</span>
					<Spinner v-else />
				</button>
			</div>
		</form>
	</Modal>
</template>

<script setup lang="ts">
import { useEditToolConfig } from '@/composables/dashboard/assistant/agents/tools/config'

const { modalData, loading, updateConfig } = useEditToolConfig()
</script>

<style scoped>
.field {
	@apply flex flex-col gap-2 mb-4;
}

label {
	@apply text-sm font-medium text-gray-700;
}

.input-field {
	@apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary;
}
</style>
