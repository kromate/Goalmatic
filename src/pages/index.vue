<template>
	<PagesHero />
	<PagesSmartChecker />
</template>

<script setup lang="ts">
import { watchUserStateChange } from '@/firebase/auth'

useRouter().push('/landing')
onMounted(() => watchUserStateChange())

</script>

<style scoped>

</style>
