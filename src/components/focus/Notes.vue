<template>
	<ClientOnly>
		<QuillEditor
			v-model:content="editorData"
			:options="options"
			toolbar="essential"
			content-type="html"
		/>
	</ClientOnly>
</template>

<script setup lang="ts">
// import { QuillEditor } from '@vueup/vue-quill'
// import '@vueup/vue-quill/dist/vue-quill.snow.css'

const editorData = ref('')

const toolbarOptions = ['bold', 'italic', 'underline', 'strike']
const options = ref({
  placeholder: 'Write something...',
	theme: 'snow',
  modules: {
    toolbar: toolbarOptions
  }
})


</script>

<style>
.ql-editor {
  font-size:16px;
}
</style>
