import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Header, HEADER_HEIGHT } from '../components/Header'
import { POKEMON_DATA } from '../data/pokemon-data'
import { useConvexAuth, useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

const SIGNIN_URL = '/api/auth/signin'

export const Route = createFileRoute('/pokedex')({
	component: PokedexTracker,
})

const mockPokemon = POKEMON_DATA.map((pokemon) => ({
		...pokemon,
		location: 'Unknown',
		caught: false,
		favorite: false,
		notes: '',
	}))

const allTypes = [
	'Normal',
	'Fire',
	'Water',
	'Electric',
	'Grass',
	'Ice',
	'Fighting',
	'Poison',
	'Ground',
	'Flying',
	'Psychic',
	'Bug',
	'Rock',
	'Ghost',
	'Dragon',
	'Dark',
	'Steel',
	'Fairy',
]

function PokedexTracker() {
	const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
	const caughtPokemon = useQuery(api.caughtPokemon.getCaughtPokemon, {})
	const toggleCaught = useMutation(api.caughtPokemon.toggleCaught)

	const [searchQuery, setSearchQuery] = useState('')
	const [selectedTypes, setSelectedTypes] = useState<string[]>([])
	const [showOnlyCaught, setShowOnlyCaught] = useState(false)
	const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
	const [sortBy, setSortBy] = useState<'number' | 'name' | 'location'>('number')
	const [togglingPokemonId, setTogglingPokemonId] = useState<number | null>(null)
	const [error, setError] = useState<string | null>(null)

	const caughtPokemonSet = new Set(caughtPokemon ?? [])

	const filteredPokemon = mockPokemon
		.filter((pokemon) => {
			const matchesSearch =
				pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				pokemon.number.includes(searchQuery) ||
				pokemon.location.toLowerCase().includes(searchQuery.toLowerCase())
			const matchesType =
				selectedTypes.length === 0 ||
				pokemon.types.some((type) => selectedTypes.includes(type))
			const isCaught = caughtPokemonSet.has(pokemon.id)
			const matchesCaught = !showOnlyCaught || isCaught
			const matchesFavorites = !showOnlyFavorites || pokemon.favorite
			return matchesSearch && matchesType && matchesCaught && matchesFavorites
		})
		.sort((a, b) => {
			if (sortBy === 'number') {
				return parseInt(a.number, 10) - parseInt(b.number, 10)
			}
			if (sortBy === 'name') {
				return a.name.localeCompare(b.name)
			}
			return a.location.localeCompare(b.location)
		})

	const caughtCount = caughtPokemonSet.size

	const handleToggleCaught = async (pokemonId: number) => {
		if (!isAuthenticated || togglingPokemonId !== null) {
			return
		}

		setError(null)
		setTogglingPokemonId(pokemonId)

		try {
			await toggleCaught({ pokemonId })
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to update caught status')
		} finally {
			setTogglingPokemonId(null)
		}
	}

	return (
		<>
			<Header />
			<div className="min-h-screen bg-[#0a0a0a] text-white" style={{ paddingTop: HEADER_HEIGHT }}>
				{/* Header */}
				<header className="border-b border-white/10">
				<div className="max-w-6xl mx-auto px-6 py-8">
					<div className="flex items-baseline justify-between">
						<div>
							<h1 className="text-sm font-medium tracking-widest text-neutral-500 uppercase mb-1">
								Legends: Z-A
							</h1>
							<p className="text-2xl font-light tracking-tight">Kalos Region</p>
						</div>
						<div className="text-right">
							<p className="text-3xl font-light tabular-nums">
								{caughtCount}<span className="text-neutral-600">/{mockPokemon.length}</span>
							</p>
							<p className="text-xs tracking-widest text-neutral-500 uppercase mt-1">
								Caught
							</p>
						</div>
					</div>
					{/* Auth Status */}
					<div className="mt-4">
						{authLoading ? (
							<p className="text-xs text-neutral-600">Loading...</p>
						) : !isAuthenticated ? (
							<p className="text-xs text-neutral-600">
								<a
									href={SIGNIN_URL}
									className="text-neutral-400 hover:text-white underline"
								>
									Sign in
								</a>
								{' '}to track your collection
							</p>
						) : (
							<p className="text-xs text-neutral-500">Tracking your collection</p>
						)}
						{error && (
							<p className="text-xs text-red-500 mt-2">{error}</p>
						)}
					</div>
				</div>
			</header>

			{/* Controls */}
			<div className="border-b border-white/10 sticky top-0 bg-[#0a0a0a] z-10">
				<div className="max-w-6xl mx-auto px-6 py-4">
					<div className="flex flex-col gap-4">
						{/* Search */}
						<div className="flex gap-4">
							<input
								type="text"
								placeholder="Search..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="flex-1 bg-transparent border-none text-white placeholder:text-neutral-600 focus:outline-none text-sm"
							/>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value as any)}
								className="bg-transparent text-neutral-500 text-xs tracking-widest uppercase focus:outline-none cursor-pointer"
							>
								<option value="number" className="bg-[#0a0a0a]">
									By Number
								</option>
								<option value="name" className="bg-[#0a0a0a]">
									By Name
								</option>
								<option value="location" className="bg-[#0a0a0a]">
									By Location
								</option>
							</select>
						</div>

						{/* Filters */}
						<div className="flex items-center gap-6 text-xs">
							<button
								onClick={() => setShowOnlyCaught(!showOnlyCaught)}
								className={`tracking-widest uppercase transition-colors ${
									showOnlyCaught ? 'text-white' : 'text-neutral-600 hover:text-neutral-400'
								}`}
							>
								Caught
							</button>
							<button
								onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
								className={`tracking-widest uppercase transition-colors ${
									showOnlyFavorites
										? 'text-white'
										: 'text-neutral-600 hover:text-neutral-400'
								}`}
							>
								Favorites
							</button>
							<div className="flex items-center gap-2 flex-wrap">
								{selectedTypes.length > 0 ? (
									<>
										{selectedTypes.map((type) => (
											<button
												key={type}
												onClick={() =>
													setSelectedTypes(selectedTypes.filter((t) => t !== type))
												}
												className="text-neutral-400 hover:text-white transition-colors"
											>
												{type} ×
											</button>
										))}
										<button
											onClick={() => setSelectedTypes([])}
											className="text-neutral-600 hover:text-neutral-400 transition-colors"
										>
											Clear
										</button>
									</>
								) : (
									allTypes.map((type) => (
										<button
											key={type}
											onClick={() =>
												setSelectedTypes([...selectedTypes, type] as string[])
											}
											className="text-neutral-700 hover:text-neutral-400 transition-colors"
										>
											{type}
										</button>
									))
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Results */}
			<div className="max-w-6xl mx-auto px-6 py-4">
				<p className="text-xs tracking-widest text-neutral-600 uppercase mb-6">
					{filteredPokemon.length} of {mockPokemon.length}
				</p>

				{filteredPokemon.length === 0 ? (
					<div className="text-center py-32">
						<p className="text-neutral-600 text-sm">No results</p>
					</div>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-white/5">
						{filteredPokemon.map((pokemon) => (
							<PokemonCard
								key={pokemon.id}
								pokemon={pokemon}
								isCaught={caughtPokemonSet.has(pokemon.id)}
								isAuthenticated={isAuthenticated}
								isToggling={togglingPokemonId === pokemon.id}
								onToggleCaught={() => handleToggleCaught(pokemon.id)}
							/>
						))}
					</div>
				)}
			</div>

			{/* Footer */}
			<footer className="border-t border-white/10 mt-12">
				<div className="max-w-6xl mx-auto px-6 py-6">
					<p className="text-xs text-neutral-700">Pokédex Tracker • Kalos Region</p>
				</div>
			</footer>
		</div>
		</>
	)
}

function PokemonCard({
	pokemon,
	isCaught,
	isAuthenticated,
	isToggling,
	onToggleCaught,
}: {
	pokemon: typeof mockPokemon[0]
	isCaught: boolean
	isAuthenticated: boolean
	isToggling: boolean
	onToggleCaught: () => void
}) {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			if (isAuthenticated) {
				onToggleCaught()
			}
		}
	}

	return (
		<div
			className="group relative bg-[#0a0a0a] p-4 hover:bg-white/[0.02] transition-colors flex flex-col cursor-pointer"
			onClick={isAuthenticated && !isToggling ? onToggleCaught : undefined}
			onKeyDown={handleKeyDown}
			role={isAuthenticated ? 'button' : undefined}
			tabIndex={isAuthenticated ? 0 : undefined}
			aria-pressed={isAuthenticated ? isCaught : undefined}
			aria-label={isAuthenticated ? `${pokemon.name}, ${isCaught ? 'caught' : 'not caught'}` : pokemon.name}
		>
			{/* Status indicator */}
			<div className="flex justify-between items-start mb-3">
				{pokemon.favorite && (
					<span className="w-1.5 h-1.5 bg-[#d4c86a] rounded-full"></span>
				)}
				{isToggling ? (
					<span className="w-1.5 h-1.5 bg-neutral-600 rounded-full ml-auto animate-pulse"></span>
				) : isCaught ? (
					<span className="w-1.5 h-1.5 bg-white rounded-full ml-auto"></span>
				) : (
					<span className="w-1.5 h-1.5 border border-neutral-700 rounded-full ml-auto"></span>
				)}
			</div>

			{/* Sprite */}
			<div className="aspect-square flex items-center justify-center mb-3">
				<img
					src={pokemon.image}
					alt={pokemon.name}
					className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
				/>
			</div>

			{/* Info */}
			<div className="mt-auto">
				<p className="text-[10px] text-neutral-600 font-mono tabular-nums mb-0.5">
					#{pokemon.regionalNumber}
				</p>
				<p className="text-sm font-light tracking-tight mb-2">{pokemon.name}</p>
				<p className="text-[10px] text-neutral-500 leading-tight">
					{pokemon.types.join(' · ')}
				</p>
			</div>

			{/* Badge for non-authenticated users - less intrusive than overlay */}
			{!isAuthenticated && (
				<div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
					<p className="text-[10px] text-white">Sign in to track</p>
				</div>
			)}
		</div>
	)
}
