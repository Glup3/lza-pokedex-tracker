import { createRouter } from '@tanstack/react-router'
import { QueryClient, notifyManager } from '@tanstack/react-query'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { ConvexQueryClient } from '@convex-dev/react-query'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { clientEnv } from './config/env-client'

// Create a new router instance
export const getRouter = () => {
	if (typeof document !== 'undefined') {
		notifyManager.setScheduler(window.requestAnimationFrame)
	}

	const convexQueryClient = new ConvexQueryClient(clientEnv.VITE_CONVEX_URL, {
		expectAuth: true,
	})

	const queryClient: QueryClient = new QueryClient({
		defaultOptions: {
			queries: {
				queryKeyHashFn: convexQueryClient.hashFn(),
				queryFn: convexQueryClient.queryFn(),
			},
		},
	})
	convexQueryClient.connect(queryClient)

	const router = createRouter({
		routeTree,
		defaultPreload: 'intent',
		context: { queryClient, convexQueryClient },
		scrollRestoration: true,
		defaultErrorComponent: (err) => <p>{err.error.stack}</p>,
		defaultNotFoundComponent: () => <p>not found</p>,
	})

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	})

	return router
}
