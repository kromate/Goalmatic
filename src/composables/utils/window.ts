import { useResizeObserver } from '@vueuse/core'

export const windowWidth = ref(0)
export const windowHeight = ref(0)

export const initializeResizeObserver = () => {
  if (!process.client) return

  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight

  useResizeObserver(window.document.body, (entries) => {
    const entry = entries[0]
    const { width, height } = entry.contentRect
    windowWidth.value = width
    windowHeight.value = height
  })
}
