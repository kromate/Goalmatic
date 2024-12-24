<template>
	<div class="border border-[#E9E9E9] flex items-center rounded-md">
		<button v-for="tab,i in (tabs as string[])" :key="tab" class="px-4 py-2.5 capitalize text-sm font-semibold"
			:class="['text-[#908F93] transite', tab == selected ? 'active' : '', i === 1 ? 'border-l border-r border-[#E9E9E9]' : '']" @click="onClick(tab)"
		>
			{{ formatTabText(tab) }}
		</button>
	</div>
</template>

<script setup lang="ts">
import { transformString } from '@/composables/utils/formatter'

const formatTabText = (text: string) => {
    return text.replace(/_/g, ' ')
}

defineProps({
    tabs: {
        type: Array,
        default: () => [],
        reuired: true
    },
    selected: {
        type: String,
        default: '',
        required: false
    }
})

const emit = defineEmits(['changed'])

const onClick = (selected) => {
    emit('changed', selected)
}
</script>

<style scoped lang="scss">
.tab-body {
    @apply inline-flex items-center w-full z-10 border border-line rounded-lg outline-none overflow-auto bg-light text-grey_two p-1;
}

.tab-item {
    @apply text-grey_two cursor-pointer flex-1 justify-center text-center font-semibold bg-transparent transition-opacity duration-500 ease-linear capitalize py-3 px-5 whitespace-nowrap;
}

.active {
    @apply text-[#00003B] bg-[#F5F1FE];
}
</style>
