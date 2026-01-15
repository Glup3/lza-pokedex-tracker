import { convexBetterAuthReactStart } from '@convex-dev/better-auth/react-start'
import { serverEnv } from '@/config/env-server'

export const {
	handler,
	getToken,
	fetchAuthQuery,
	fetchAuthMutation,
	fetchAuthAction,
} = convexBetterAuthReactStart({
	convexUrl: serverEnv.CONVEX_URL,
	convexSiteUrl: serverEnv.CONVEX_SITE_URL,
})
