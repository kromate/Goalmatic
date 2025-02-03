<template>
	<select
		:value="modelValue"
		class="input-field w-full"
		@input="(e) => emit('update:modelValue', (e.target as HTMLSelectElement).value)"
	>
		<option value="">
			{{ placeholder ?? 'Select an option...' }}
		</option>
		<option
			v-for="option in options"
			:key="option.value"
			:value="option.value"
		>
			{{ option.label }}
		</option>
	</select>
</template>

<script setup lang="ts">
interface Props {
	modelValue: string | undefined
	options: Array<{
		label: string
		value: string
	}>
	placeholder?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
	'update:modelValue': [value: string]
}>()
</script>
