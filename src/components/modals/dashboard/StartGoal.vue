
<template>
	<Modal
		modal="$atts.modal"
		title="Start Goal"
		:is-full-height="false"

	>
		<div class="field relative">
			<label for="start">Start Date</label>
			<DateInput id="start" v-model="start_date" placeholder="When do you want to start?" type="date" />
		</div>
		<transition name="scale" appear>
			<div v-if="loading" class="card_ans !border-greenx bg-[#b8e3b8] mt-4">
				{{ milestones.length === 0 ? 'Generating Milestones...' : todos.length === 0 ? 'Generating Todos....' : 'Saving to database' }}
			</div>
		</transition>

		<div class="grid grid-cols-1 gap-4 mt-6">
			<button class="modal-btn text-light " :disabled="loading || !start_date" @click="startGoal()">
				<span v-if="!loading"> Start </span>
				<Spinner v-else />
			</button>
		</div>
	</Modal>
</template>

<script setup lang="ts">

import { useStartGoal } from '@/composables/dashboard/goals/start'


const { initStartGoal, loading, startGoal, start_date, milestones, todos } = useStartGoal()


</script>

<style>

</style>
