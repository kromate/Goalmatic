<template>
	<div class="card">
		<div class="flex justify-between items-start mb-4">
			<img :src="icon" :alt="name" class="w-8 h-8">
			<div class="flex gap-2">
				<button v-if="status && hasGlobalConfig" class="btn-text !py-1" @click="emit('editConfig', { id, integration_id, config })">
					Edit config
				</button>
				<div class="integration-button-container">
					<button
						:class="[
							'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200',
							status
								? isHovering
									? 'text-light bg-red border-red-700'
									: 'text-green-700 bg-green-50'
								: 'text-light bg-primary',
						]"
						@click="emit('update', { integration_id, status: !status, id })"
						@mouseenter="isHovering = true"
						@mouseleave="isHovering = false"
					>
						<span v-if="status && isHovering">Disconnect</span>
						<span v-else>{{ status ? 'Connected' : 'Connect' }}</span>
					</button>
				</div>
			</div>
		</div>
		<div class="flex flex-col items-start  mb-2">
			<h3 class="text-lg font-semibold text-gray-900 ">
				{{ name }}
			</h3>
			<span class="text-xs italic font-medium text-grey_four">
				{{ phone || email }}
			</span>
		</div>

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
	id: string | undefined;
	phone?: string;
	email?: string;
	hasGlobalConfig?: boolean;
	integration_id: string | undefined;
	config?: Record<string, any>;
}

defineProps<Props>()
const emit = defineEmits(['update', 'editConfig'])

const isHovering = ref(false)
</script>

<style scoped>
.card {
    @apply  rounded-lg p-4 gap-2 shadow-[0px_2px_10px_0px_#0000000A] border border-line;

}
</style>
