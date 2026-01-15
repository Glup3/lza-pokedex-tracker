import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexProvider } from 'convex/react'
import { clientEnv } from '@/config/env-client'

const convexQueryClient = new ConvexQueryClient(clientEnv.VITE_CONVEX_URL)

export default function AppConvexProvider({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ConvexProvider client={convexQueryClient.convexClient}>
			{children}
		</ConvexProvider>
	)
}
