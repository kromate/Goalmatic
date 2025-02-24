<template>
	<svg
		:width="gridWidth"
		:height="gridHeight"
		v-bind="restProps"
		:class="svgClass"
	>
		<rect
			v-for="(_, index) in totalSquares"
			:key="index"
			:x="getX(index)"
			:y="getY(index)"
			:width="width"
			:height="height"
			class="stroke-[#e2dce240] hover:fill-gray-300/30 fill-transparent transition-all duration-75 ease-in-out [&:not(:hover)]:duration-1000"
		/>
	</svg>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface InteractiveGridPatternProps {
  className?: HTMLAttributes['class'];
  squaresClassName?: HTMLAttributes['class'];
  width?: number;
  height?: number;
  squares?: [number, number];
}

const props = withDefaults(defineProps<InteractiveGridPatternProps>(), {
  width: 40,
  height: 40,
  squares: () => [24, 24]
})

const width = computed(() => props.width)
const height = computed(() => props.height)
const squares = computed(() => props.squares)
const className = computed(() => props.className)
const squaresClassName = computed(() => props.squaresClassName)

const restProps = computed(() => {
  const { width, height, squares, className, squaresClassName, ...rest } = props
  return rest
})

const horizontal = computed(() => squares.value[0])
const vertical = computed(() => squares.value[1])

const totalSquares = computed(() => horizontal.value * vertical.value)

const hoveredSquare = ref<number | null>(null)

const gridWidth = computed(() => width.value * horizontal.value)
const gridHeight = computed(() => height.value * vertical.value)

function getX(index: number) {
  return (index % horizontal.value) * width.value
}

function getY(index: number) {
  return Math.floor(index / horizontal.value) * height.value
}

const svgClass = computed(() =>
  cn('absolute inset-0 h-full w-full border border-gray-400/30', className.value)
)

</script>
