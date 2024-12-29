<template>
	<div>
		<PagesSmartCheckerStepOne v-if="step === 1" />
		<PagesSmartCheckerStepTwo v-if="step === 2" />
	</div>
</template>

<script setup lang="ts">
import { useSmartGoal } from '@/composables/genericGoals/smart'

const { step } = useSmartGoal()

definePageMeta({
	layout: 'landing'
})
</script>

<style scoped>

</style>
