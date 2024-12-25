<template>
	<client-only>
		<date-picker
			:value="dateInput"
			:format="format"
			:type="type"
			:placeholder="placeholder"
			:required="true"
			:range="range"
			:disabled-date="disabledDate"
			class="w-full"
			:value-type="valueType"
			:disabled="disabled"
			:editable="editable"
			:clearable="clearable"
			:time-picker-options="timePickerOptions"
			:show-time-panel="showTimePanel"
			@update:value="handleDate"
		>
			<template v-if="showToday" #header="{ emit }">
				<button class="mx-btn mx-btn-text" @click="emit(new Date())">
					Today
				</button>
			</template>
		</date-picker>
	</client-only>
</template>

<script setup lang="ts">
import DatePicker from 'vue-datepicker-next'
import './themes/styles.css'
import props from './props'

const emit = defineEmits(['update:modelValue'])

const propsValue = defineProps({
  ...props
})

const dateInput = ref(propsValue.modelValue || new Date())

const handleDate = (date: string) => {
dateInput.value = date
emit('update:modelValue', date)
}


</script>

<style scoped>
.date-picker {
  background-color: blue;
}
</style>
