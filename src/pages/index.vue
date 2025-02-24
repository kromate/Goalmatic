<template>
	<PagesLandingHero />
</template>

<script setup lang="ts">
import { watchUserStateChange } from '@/firebase/auth'

onMounted(() => watchUserStateChange())

definePageMeta({
	layout: 'landing'
})

</script>

<style scoped>

</style>
