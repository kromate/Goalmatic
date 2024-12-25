<template>
	<div class="tab-body border-b border-dark hide-scrollbar">
		<span v-for="tab in (tabs as string[])" :key="tab" :class="['tab-item transite', tab == selected ? 'active' : '']" @click="onClick(tab)">{{ formatTabText(tab) }}</span>
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
    @apply opacity-100 border-[2px] rounded-lg border-dark text-primary bg-light;
}
</style>
