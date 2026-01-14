import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Header, HEADER_HEIGHT } from '../components/Header'

export const Route = createFileRoute('/pokedex')({
	component: PokedexTracker,
})

const mockPokemon = [
	{
		id: 1,
		name: 'Rowlet',
		number: '001',
		types: ['Grass', 'Flying'],
		location: 'Santalune Forest',
		image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/722.png',
		caught: false,
		favorite: false,
		notes: '',
	},
	{
		id: 2,
		name: 'Litten',
		number: '004',
		types: ['Fire'],
		location: 'Route 4',
		image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/725.png',
		caught: true,
		favorite: true,
		notes: 'Found near Lumiose City',
	},
	{
		id: 3,
		name: 'Popplio',
		number: '007',
		types: ['Water'],
		location: 'Route 7',
		image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/728.png',
		caught: true,
		favorite: false,
		notes: '',
	},
	{
		id: 4,
		name: 'Pikachu',
		number: '025',
		types: ['Electric'],
		location: 'Route 3',
		image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
		caught: false,
		favorite: false,
		notes: '',
	},
	{
		id: 5,
		name: 'Eevee',
		number: '133',
		types: ['Normal'],
		location: 'Route 6',
		image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png',
		caught: true,
		favorite: true,
		notes: 'Rare encounter in the tall grass',
	},
	{
		id: 6,
		name: 'Snorlax',
		number: '143',
		types: ['Normal'],
		location: 'Route 7',
		image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png',
		caught: false,
		favorite: false,
		notes: 'Blocks the path',
	},
	{
		id: 7,
		name: 'Charizard',
		number: '006',
		types: ['Fire', 'Flying'],
		location: 'Victory Road',
		image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
		caught: false,
		favorite: true,
		notes: '',
	},
	{
		id: 8,
		name: 'Gyarados',
		number: '130',
		types: ['Water', 'Flying'],
		location: 'Route 22',
		image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png',
		caught: true,
		favorite: false,
		notes: 'Evolved from Magikarp',
	},
	{
		id: 9,
		name: 'Mewtwo',
		number: '150',
		types: ['Psychic'],
		location: 'Pokemon Village',
		image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
		caught: false,
		favorite: true,
		notes: 'Legendary',
	},
	{
		id: 10,
		name: 'Greninja',
		number: '658',
		types: ['Water', 'Dark'],
		location: 'Route 15',
		image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/658.png',
		caught: true,
		favorite: false,
		notes: '',
	},
	{
		id: 11,
		name: 'Lucario',
		number: '448',
		types: ['Fighting', 'Steel'],
		location: 'Tower of Mastery',
		image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png',
		caught: false,
		favorite: true,
		notes: '',
	},
	{
		id: 12,
		name: 'Sylveon',
		number: '700',
		types: ['Fairy'],
		location: 'Route 8',
		image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/700.png',
		caught: true,
		favorite: true,
		notes: 'Eevee evolution',
	},
]

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
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedTypes, setSelectedTypes] = useState<string[]>([])
	const [showOnlyCaught, setShowOnlyCaught] = useState(false)
	const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
	const [sortBy, setSortBy] = useState<'number' | 'name' | 'location'>('number')

	const filteredPokemon = mockPokemon
		.filter((pokemon) => {
			const matchesSearch =
				pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				pokemon.number.includes(searchQuery) ||
				pokemon.location.toLowerCase().includes(searchQuery.toLowerCase())
			const matchesType =
				selectedTypes.length === 0 ||
				pokemon.types.some((type) => selectedTypes.includes(type))
			const matchesCaught = !showOnlyCaught || pokemon.caught
			const matchesFavorites = !showOnlyFavorites || pokemon.favorite
			return matchesSearch && matchesType && matchesCaught && matchesFavorites
		})
		.sort((a, b) => {
			if (sortBy === 'number') {
				return parseInt(a.number) - parseInt(b.number)
			}
			if (sortBy === 'name') {
				return a.name.localeCompare(b.name)
			}
			return a.location.localeCompare(b.location)
		})

	const caughtCount = mockPokemon.filter((p) => p.caught).length

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
							<PokemonCard key={pokemon.id} pokemon={pokemon} />
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

function PokemonCard({ pokemon }: { pokemon: typeof mockPokemon[0] }) {
	return (
		<div className="group bg-[#0a0a0a] p-4 hover:bg-white/[0.02] transition-colors cursor-pointer flex flex-col">
			{/* Status indicator */}
			<div className="flex justify-between items-start mb-3">
				{pokemon.favorite && (
					<span className="w-1.5 h-1.5 bg-[#d4c86a] rounded-full"></span>
				)}
				{pokemon.caught ? (
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
					{pokemon.number}
				</p>
				<p className="text-sm font-light tracking-tight mb-2">{pokemon.name}</p>
				<p className="text-[10px] text-neutral-500 leading-tight">
					{pokemon.types.join(' · ')}
				</p>
			</div>
		</div>
	)
}
