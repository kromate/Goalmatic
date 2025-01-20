
<template>
	<Modal
		modal="$atts.modal"
		title="Edit Todo"
		:is-full-height="false"

	>
		<form class="auth-form" @submit.prevent="updateTodo()">
			<div class="field relative">
				<label for="start">Title</label>
				<input id="start" v-model="selectedTodo.title" type="text" class="input-field">
			</div>
			<div class="field relative">
				<label for="start">Description</label>
				<textarea id="start" v-model="selectedTodo.description" class="input-textarea" />
			</div>

			<div class="grid grid-cols-1 gap-4 mt-6 w-full">
				<button class="btn-primary text-light " :disabled="loading">
					<span v-if="!loading"> Update </span>
					<Spinner v-else />
				</button>
			</div>
		</form>
	</Modal>
</template>

<script setup lang="ts">
import { useEditTodo } from '@/composables/dashboard/todo/edit'

const { selectedTodo, updateTodo, loading } = useEditTodo()


</script>

<style>

</style>
