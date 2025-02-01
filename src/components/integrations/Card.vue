<template>
	<div class="card">
		<div class="flex justify-between items-start mb-4">
			<img :src="icon" :alt="name" class="w-8 h-8">
			<button
				:class="[
					'px-3.5 py-1.5 rounded-full text-sm font-medium border',
					status ? 'text-green-700 bg-green-50' : 'text-light bg-primary',
				]" @click="emit('update', { id, status: !status })">
				<span>{{ status ? 'Connected' : 'Connect' }}</span>
			</button>
		</div>
		<h3 class="text-lg font-semibold text-gray-900 mb-2">
			{{ name }}
		</h3>
		<p class="text-[#7285A1] text-sm">
			{{ description }}
		</p>
	</div>
</template>

<script setup lang="ts">
interface Props {
    name: string;
    icon: string;
    description: string;
    status: boolean;
    id: string;
}

defineProps<Props>()
const emit = defineEmits(['update'])
</script>

<style scoped>
.card {
    @apply  rounded-lg p-4 gap-2 shadow-[0px_2px_10px_0px_#0000000A] border border-line;

}
</style>
