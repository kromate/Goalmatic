<template>
	<div>
		<PagesDashboardTodosColumn
			:date="today"
			:tasks="[]"
		/>
	</div>
</template>

<script setup lang="ts">
const today = new Date().toISOString()
const task = []
</script>

<style scoped>

</style>
