import posthog from 'posthog-js'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()

  // Skip PostHog initialization in development
  if (import.meta.env.MODE === 'development') {
    return {
      provide: {
        posthog: () => ({
          capture: () => {}, // No-op function
          identify: () => {},
          reset: () => {}
        })
      }
    }
  }

  const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
    api_host: runtimeConfig.public.posthogHost,
    person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
    capture_pageview: false, // we add manual pageview capturing below
    loaded: (posthog) => {
      if (import.meta.env.MODE === 'development') posthog.debug()
    }
  })

  // Make sure that pageviews are captured with each route change
  const router = useRouter()
  router.afterEach((to) => {
    nextTick(() => {
      posthog.capture('$pageview', {
        current_url: to.fullPath
      })
    })
  })

  return {
    provide: {
      posthog: () => posthogClient
    }
  }
})

// posthog.capture('my event', { property: 'value' })
