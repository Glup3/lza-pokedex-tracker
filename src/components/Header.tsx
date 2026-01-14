import { Link } from '@tanstack/react-router'
import { authClient } from '../lib/auth-client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from './ui/button'

const HEADER_HEIGHT = '72px'

export function Header() {
	const { data: session } = useQuery({
		queryKey: ['auth-session'],
		queryFn: async () => authClient.getSession(),
	})

	const signIn = useMutation({
		mutationFn: async () => {
			await authClient.signIn.social({
				provider: 'github',
				callbackURL: '/',
			})
		},
	})

	const signOut = useMutation({
		mutationFn: async () => {
			await authClient.signOut()
			window.location.href = '/'
		},
	})

	return (
		<header
			className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-white/5"
			style={{ height: HEADER_HEIGHT }}
		>
			<div className="h-full flex items-center justify-between px-6 md:px-12">
				{/* Logo/Brand */}
				<Link
					to="/"
					className="flex items-baseline gap-3 group"
				>
					<span className="text-xl font-black text-white tracking-tighter group-hover:tracking-tight transition-all duration-300">
						POKÉDEX
					</span>
					<span className="hidden sm:inline-block text-xs text-neutral-600 tracking-[0.2em] uppercase font-light">
						Tracker
					</span>
				</Link>

				{/* Auth Button */}
				{session?.data?.user ? (
					<div className="flex items-center gap-4">
						<span className="hidden md:block text-xs text-neutral-500 tracking-wider">
							{session.data.user.name}
						</span>
						<Button
							variant="brutalist-ghost"
							size="sm"
							onClick={() => signOut.mutate()}
							className="group"
						>
							<span className="relative z-10">Sign Out</span>
							<div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none" />
						</Button>
					</div>
				) : (
					<Button
						variant="brutalist"
						size="sm"
						onClick={() => signIn.mutate()}
						disabled={signIn.isPending}
						className="px-6 py-2.5 group"
					>
						<span className="relative z-10 flex items-center gap-2">
							{signIn.isPending ? (
								<>
									<span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
									Connecting
								</>
							) : (
								'Sign In'
							)}
						</span>
					</Button>
				)}
			</div>
		</header>
	)
}

export { HEADER_HEIGHT }
