<template>
	<div
		class="flex flex-col gap-4 center pt-10 px-4 md:px-10 2xl:max-w-5xl max-w-7xl mx-auto w-full"
	>
		<section id="header" class="card">
			<div class="flex flex-col md:flex-row gap-4 md:items-center">
				<div class="flex items-center gap-2">
					<button
						class="btn-icon gap-2 hidden md:block"
						@click="$router.back()"
					>
						<CircleArrowLeft :size="16" color="#601DED" />
					</button>
					<img src="/bot.png" alt="agent" class="size-14">
				</div>

				<div class="flex flex-col gap-2 items-start">
					<h2 class="text-sm font-semibold text-textHeadline">
						{{ agentDetails.name }}
					</h2>
					<div class="info">
						{{ agentDetails.user.name }} <span class="dot" />
						{{
							formatDateString(agentDetails.created_at, {
								month: 'short',
								day: 'numeric',
								year: 'numeric',
							})
						}}
						<span class="dot" />
						<div
							class="flex items-center gap-1.5 bg-[#EFE8FD] border border-[#CFBBFA] text-[#601DED] px-2 py-1 rounded-lg text-sm font-semibold"
						>
							<span>{{ agentDetails.published ? 'Public' : 'Private' }}</span>
							<EyeClosed v-if="!agentDetails.published" :size="16" />
							<Eye v-else :size="16" />
						</div>
					</div>
				</div>

				<div class="flex md:ml-auto gap-2">
					<button class="btn-primary gap-2 w-full md:w-auto" @click="selectAgent(agentDetails)">
						Use agent
						<MoveUpRight :size="16" />
					</button>
					<button class="btn-icon gap-2" @click="setDeleteAgentData(agentDetails)">
						<Trash :size="16" color="#601DED" />
					</button>
				</div>
			</div>
		</section>


		<section id="about" class="card md:mt-8 mt-4 gap-2">
			<h1 class="text-textHeadline text-base font-semibold">
				About
			</h1>
			<p class="text-subText md:text-[15px] text-xs">
				{{ agentDetails?.description || 'No description provided' }}
			</p>
		</section>

		<section id="system-info" class="card border md:mt-8 mt-4 gap-2">
			<div class="flex justify-between items-center">
				<h1 class="text-textHeadline text-base font-semibold">
					System Information
				</h1>
				<button
					v-if="!isEditingSystemInfo"
					class="btn-text"
					@click="editSystemInfo"
				>
					Edit
				</button>
				<div v-else class="flex gap-2">
					<button class="btn-text" @click="isEditingSystemInfo = false">
						Cancel
					</button>
					<button
						class="btn-text btn !bg-primary disabled:!bg-gray-500 text-light"
						:disabled="updateSystemInfoLoading"
						@click="updateSystemInfo(id as string, agentDetails.spec)"
					>
						<span v-if="!updateSystemInfoLoading">save</span>
						<Spinner v-else size="14px" />
					</button>
				</div>
			</div>
			<div
				v-if="!isEditingSystemInfo"
				class="text-subText md:text-[15px] text-xs whitespace-pre-wrap"
			>
				{{ agentDetails?.spec?.systemInfo || 'No system information provided' }}
			</div>
			<textarea
				v-else
				v-model="systemInfoModel"
				rows="5"
				class="input-textarea"
				placeholder="Enter system information..."
			/>
		</section>

		<section id="tools" class="card border md:mt-10 mt-4 gap-2">
			<div class="flex justify-between items-center">
				<h1 class="text-textHeadline text-base font-semibold">
					Agent Tool Library
				</h1>
				<button
					v-if="!isEditingTools"
					class="btn-text"
					@click="editTools"
				>
					Edit
				</button>
				<div v-else class="flex gap-2">
					<button class="btn-text" @click="isEditingTools = false">
						Cancel
					</button>
					<button
						class="btn-text btn !bg-primary disabled:!bg-gray-500 text-light"
						:disabled="updateToolsLoading"
						@click="updateTools(id as string, agentDetails.spec)"
					>
						<span v-if="!updateToolsLoading">save</span>
						<Spinner v-else size="14px" />
					</button>
				</div>
			</div>


			<div v-if="!isEditingTools" class="text-subText md:text-[15px] text-xs">
				<div
					v-if="!agentDetails?.spec?.tools?.length"
					class="flex flex-col items-center gap-2 "
				>
					<PencilRuler :size="24" color="#601DED" />
					<span class="text-textHeadline text-lg font-semibold"
					>No tools added</span
					>
				</div>
				<div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div
						v-for="tool in agentDetails.spec.tools"
						:key="tool.id"
						class="bg-white rounded-lg p-4 border"
					>
						<div class="flex items-center gap-2">
							<img :src="tool.icon" alt="google calendar" class="size-7">
							<div class="flex flex-col">
								<span class="text-textHeadline text-sm font-bold">{{ tool.name }}</span>
								<span class="text-subText text-[10px]  font-semibold">{{ tool.id.split('_')[0] }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>


			<div v-else class="mt-4">
				<section v-if="toolsModel.length" class="flex flex-wrap p-3 rounded-md border border-primary my-3 gap-2">
					<div v-for="tool in toolsModel" :key="tool.id" class="card2">
						<img :src="tool.icon" alt="google calendar" class="size-7">
						<div class="flex flex-col">
							<span class="text-textHeadline text-sm font-bold">{{ tool.name }}</span>
							<span class="text-subText text-xs  font-normal">{{ tool.id.split('_')[0] }}</span>
						</div>
						<button class="gap-2 ml-4" @click="removeTool(tool)">
							<XCircle :size="16" color="#601DED" />
						</button>
					</div>
				</section>
				<div class="flex flex-col gap-4">
					<div class="relative">
						<input
							v-model="toolSearch"
							type="text"
							class="input-field w-full !pl-10"
							placeholder="Search for a Tool"
						>
						<Search
							class="absolute left-3 top-1/2 -translate-y-1/2"
							:size="18"
							color="#8F95B2"
						/>
					</div>


					<div class="flex flex-col gap-4">
						<div
							v-for="tool in filteredTools"
							:key="tool.id"
							class="bg-white rounded-lg p-4 border"
						>
							<div class="flex gap-4 w-full">
								<img :src="tool.icon" :alt="tool.name" class="w-8 h-8">
								<div class="flex flex-col gap-2 w-full">
									<div class="flex justify-between items-center w-full">
										<h3 class="text-sm font-semibold text-textHeadline">
											{{ tool.name }}
										</h3>
										<div class="flex items-center gap-1 text-xs">
											<span class="btn-status" :class="{ 'bg-[#EFE8FD] text-primary': tool.status, 'bg-line text-secondary': !tool.status }">{{ tool.status ? 'Connected' : 'Not Connected' }}</span>
											<button v-if="!tool.status" class="btn-text btn !bg-primary text-light" @click="connectIntegration(tool.id)">
												Connect
											</button>
										</div>
									</div>
									<p class="text-xs text-subText">
										{{ tool.description }}
									</p>

									<div class="flex flex-wrap gap-2 mt-1">
										<label
											v-for="ability in tool.abilities"
											:key="ability.name"
											class="flex items-center gap-2 bg-[#EFE8FD] border border-[#CFBBFA] text-[#601DED] px-2 py-1 rounded-lg text-xs"
											:class="{ 'opacity-50': !tool.status }"
										>
											<input
												v-model="toolsModel"
												type="checkbox"
												:value="ability"
												:disabled="!tool.status"
												class="form-checkbox h-3 w-3 text-primary rounded border-primary focus:ring-primary"
											>
											<div class="flex items-center gap-1.5">
												<span>{{ ability.name }}</span>
											</div>
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { EyeClosed, MoveUpRight, Trash, CircleArrowLeft, Eye, PencilRuler, Search, CheckCircle2, XCircle } from 'lucide-vue-next'
import { useFetchAgentsById } from '@/composables/dashboard/assistant/agents/id'
import { useEditAgent } from '@/composables/dashboard/assistant/agents/edit'
import { formatDateString } from '@/composables/utils/formatter'
import { useSelectAgent } from '@/composables/dashboard/assistant/agents/select'
import { useDeleteAgent } from '@/composables/dashboard/assistant/agents/delete'
import { useConnectIntegration } from '~/src/composables/dashboard/integrations/connect'

const { connectIntegration, loading: connectLoading } = useConnectIntegration()

const { setDeleteAgentData, loading: deleteLoading } = useDeleteAgent()
const { selectAgent, loading: selectLoading } = useSelectAgent()
const { fetchAgentsById, agentDetails, loading: fetchLoading, defaultGoalmaticAgent } = useFetchAgentsById()
const {
 updateSystemInfoLoading, isEditingSystemInfo, systemInfoModel, updateSystemInfo,
	isEditingTools, updateToolsLoading, toolsModel, updateTools, filteredTools, toolSearch
} = useEditAgent()


const { id } = useRoute().params


id === '0' ? (agentDetails.value = defaultGoalmaticAgent) : await fetchAgentsById(id as string)

const connectTool = (tool) => {
	console.log(tool)
}
const removeTool = (toolToRemove) => {
    toolsModel.value = toolsModel.value.filter((tool) => tool.id !== toolToRemove.id)
}

const editSystemInfo = () => {
	isEditingSystemInfo.value = true
	systemInfoModel.value = agentDetails.value?.spec?.systemInfo || ''
}

const editTools = () => {
	isEditingTools.value = true
	toolsModel.value = agentDetails.value?.spec?.tools || []
}

definePageMeta({
	layout: 'dashboard',
	middleware: 'is-authenticated'
})

</script>

<style scoped lang="scss">
.card {
	@apply bg-[#f6f5ffa3]   rounded-lg py-4 px-3.5 w-full flex flex-col;
	h2 {
		@apply text-textHeadline text-2xl font-semibold;
	}
	.info {
		@apply text-subText text-xs flex items-center gap-1;
		.dot {
			@apply w-1 h-1 bg-primary rounded-full inline-block mx-2;
		}
	}
}
.card2 {
	@apply bg-[#EFE8FD] border border-[#CFBBFA] text-primary flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium;
}
.btn-text {
	@apply border rounded gap-2 bg-light !py-1 !px-3 text-xs font-semibold;
}
.input-text {
	@apply border rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary;
}
.btn-status {
	@apply  border border-[#CFBBFA]  px-2 py-1 rounded-lg text-xs font-medium;
}
.form-checkbox {
	@apply rounded border-primary text-primary focus:ring-primary;
	&:checked {
		background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
		@apply bg-primary;
	}
}
</style>
