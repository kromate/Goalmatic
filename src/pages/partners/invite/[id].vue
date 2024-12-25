<template>
	<div class="mx-auto max-w-3xl w-full px-4 py-24">
		<div class="flex flex-col items-center gap-4 mb-8 text-center">
			<img :alt="data.name" class="aspect-square rounded-full w-24 h-24 min-w-24 min-h-24 border border-line" :src="data.photo_url ?? '/filler.svg'">


			<h1 class=" text-lg md:text-2xl">
				Your Friend <span class="underline font-semibold"> {{ data.user.name }} </span>  is inviting you to be their accountability partner for the goal below
			</h1>
			<div class="field mt-5">
				<h4 class="!border-greenx bg-[#b8e3b8] p-4 card_ans text-base md:text-lg font-normal">
					{{ data.desc }}
				</h4>
				<button class="btn bg-dark text-light mt-4 w-full" :disabled="loading" @click="acceptInvite">
					<span v-if="!loading"> Accept Invitation	</span>
					<Spinner v-else />
				</button>
			</div>
		</div>
	</div>
</template>
<!-- getUserGoalDetails -->


<script setup lang="ts">
import { useAPI } from '@/api_factory'
import { useCustomHead } from '@/composables/core/head'
import { useAlert } from '@/composables/core/notification'

const loading = ref(false)

const acceptInvite = async () => {
    loading.value = true
    setTimeout(() => {
        loading.value = false
        useAlert().openAlert({ type: 'SUCCESS', msg: 'You have accepted the invite' })
    }, 2000)
}


const goal_id = useRoute().params.id as string


	const { data, error } = await useAPI('/getUserGoalDetails', {
			method: 'POST',
			body: { id: goal_id }
	}) as { data: Ref<any>, error: any }

useCustomHead({
    title: 'Accountability Partner Invite',
    desc: `${data.value.user.name} is inviting you to be their accountability partner on Taaskly`,
    img: data.value.user.photo_url || '/lt.svg'

})
</script>

<style scoped>

</style>
