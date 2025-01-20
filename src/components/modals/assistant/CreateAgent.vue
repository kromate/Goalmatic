
<template>
	<Modal
		modal="$atts.modal"
		title="Create Agent"
		:is-full-height="false"

	>
		<form class="flex flex-col gap-4" @submit.prevent="createAgent()">
			<div class="field relative">
				<label for="name">Agent Name</label>
				<input v-model="createAgentForm.name" required class="input-field" placeholder="Choose a name">
			</div>
			<div class="field relative">
				<label for="name">Description</label>
				<textarea v-model="createAgentForm.description" required class="input-textarea !h-auto" rows="3" placeholder="What does this agent do?" />
			</div>

			<button class="btn-primary mt-4 w-full " :disabled="isDisabled || loading">
				<span v-if="!loading"> Create </span>
				<Spinner v-else />
			</button>
		</form>
	</Modal>
</template>

<script setup lang="ts">
import { useCreateAgent } from '@/composables/dashboard/assistant/agents/create'

const { createAgent, loading, createAgentForm, isDisabled } = useCreateAgent()
</script>

<style>

</style>
