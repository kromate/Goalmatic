<template>
	<Avatar :src="userProfile?.photo_url ?? user!.photoURL" :name="userProfile!.name ?? user!.displayName" :size="size" />
</template>

<script setup lang="ts">
import { useUser } from '@/composables/auth/user'
const { user, userProfile } = useUser()

defineProps({
		size: {
			required: false,
			type: Number,
			default: 28
		}
})

</script>

<style scoped>
</style>
