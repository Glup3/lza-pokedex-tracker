import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
	return (
		<div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-6">
			<div className="max-w-2xl w-full text-center">
				<h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">
					POKÉDEX
				</h1>
				<p className="text-xl text-neutral-400 mb-12">
					Track your collection
				</p>
				<Link
					to="/pokedex"
					className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold text-lg rounded hover:bg-neutral-200 transition-colors"
				>
					OPEN TRACKER
					<ArrowRight size={20} />
				</Link>
			</div>
		</div>
	)
}
