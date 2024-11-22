<template>
	<main class="flex  h-dvh w-full overflow-hidden">
		<section id="todo" class="w-full">
			<!-- <FocusTodoMain /> -->
		</section>
		<section id="calendar" class="w-full">
			<FocusCalendar />
		</section>
		<section id="notes" class="w-full">
			<FocusNotes />
		</section>
	</main>
</template>

<script setup lang="ts">
import Split from 'split.js'


onMounted(() => {
    Split(['#todo', '#calendar', '#notes'], {
    gutterSize: 5
})
})

definePageMeta({
    layout: 'foucs'
})
</script>

<style>
.gutter {
    /* background-color: #eee; */
    background-repeat: no-repeat;
    background-position: 50%;
}

.gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    cursor: col-resize;
}
</style>
