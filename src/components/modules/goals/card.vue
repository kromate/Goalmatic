<template>
	<div class="border border-[#E4E7EC] p-4 rounded-lg flex flex-col gap-3" @click="$router.push('/goals/1')">
		<div class="flex items-center gap-4 justify-between">
			<p class="text-sm text-[#908F93] font-semibold">
				Goal Overview
			</p>
			<p class="text-[11px] text-textHeadline font-medium bg-[#F2F2F2] rounded-full py-1 px-2">
				Ongoing
			</p>
		</div>
		<p class="text-lg font-semibold text-[#4D4D53]">
			Increase GPA and get Internship
		</p>
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-4 justify-between text-sm font-semibold">
				<p class="text-[#333D54]">
					50% Complete
				</p>
				<p class="text-[#7A797E]">
					12 weeks left
				</p>
			</div>
			<Progressbar />
		</div>

		<div class="flex flex-col gap-3 mt-2">
			<div class="flex items-center gap-1.5 text-sm">
				<IconsStart />
				<p class="flex items-center gap-1">
					<span class="text-[#908F93]">Start</span>
					<span class="text-[#646368]">Tomorrow, Dec 1st. 2024</span>
				</p>
			</div>
			<div class="flex items-center gap-1.5 text-sm">
				<IconsCalendar />
				<p class="flex items-center gap-1">
					<span class="text-[#908F93]">End</span>
					<span class="text-[#646368]">Tomorrow, Dec 1st. 2024</span>
				</p>
			</div>
		</div>
	</div>
</template>
