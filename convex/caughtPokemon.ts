import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { authComponent } from './auth'

// Get all caught pokemon IDs for the current user
export const getCaughtPokemon = query({
	args: {},
	handler: async (ctx) => {
		let user
		try {
			user = await authComponent.getAuthUser(ctx)
		} catch {
			return []
		}
		if (!user) {
			return []
		}

		const caught = await ctx.db
			.query('caughtPokemon')
			.withIndex('by_user', (q) => q.eq('userId', user._id.toString()))
			.collect()

		return caught.map((c) => c.pokemonId)
	},
})

// Check if a specific pokemon is caught by the current user
export const isPokemonCaught = query({
	args: { pokemonId: v.number() },
	handler: async (ctx, args) => {
		let user
		try {
			user = await authComponent.getAuthUser(ctx)
		} catch {
			return false
		}
		if (!user) {
			return false
		}

		const caught = await ctx.db
			.query('caughtPokemon')
			.withIndex('by_user_pokemon', (q) =>
				q.eq('userId', user._id.toString()).eq('pokemonId', args.pokemonId)
			)
			.first()

		return !!caught
	},
})

// Toggle caught status for a pokemon
export const toggleCaught = mutation({
	args: { pokemonId: v.number() },
	handler: async (ctx, args) => {
		let user
		try {
			user = await authComponent.getAuthUser(ctx)
		} catch {
			throw new Error('You must be signed in to track caught pokemon')
		}
		if (!user) {
			throw new Error('You must be signed in to track caught pokemon')
		}

		const userId = user._id.toString()

		const existing = await ctx.db
			.query('caughtPokemon')
			.withIndex('by_user_pokemon', (q) =>
				q.eq('userId', userId).eq('pokemonId', args.pokemonId)
			)
			.first()

		if (existing) {
			// Remove from caught list
			await ctx.db.delete(existing._id)
			return false
		} else {
			// Add to caught list
			await ctx.db.insert('caughtPokemon', {
				userId,
				pokemonId: args.pokemonId,
				caughtAt: Date.now(),
			})
			return true
		}
	},
})
