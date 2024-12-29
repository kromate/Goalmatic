<template>
	<main class="p-4 flex flex-col gap-4">
		<PagesSmartCheckerStepOne v-if="step === 1" :isHomePage='true'/>
		<PagesSmartCheckerStepTwo v-if="step === 2" />
	</main>
</template>

<script setup lang="ts">
import { usePageHeader } from '@/composables/utils/header'
import { useSmartGoal } from '@/composables/genericGoals/smart'


const { isComponentOpen, step, closeModal } = useSmartGoal()

definePageMeta({
    layout: 'dashboard',
    middleware: ['is-authenticated', () => {
        usePageHeader().setPageHeader({
            title: 'Create Goal',
            description: 'Create a new goal here',
            btnText: '',
            btnCall: () => useRouter().push('/booking-types/create'),
            shouldShowFab: false,
            shouldShowTab: false

        })
    }]
})
</script>

<style scoped></style>
