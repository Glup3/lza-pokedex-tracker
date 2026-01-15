import { z } from 'zod'

const envSchema = z.object({
	CONVEX_SITE_URL: z.string(),
	CONVEX_URL: z.string(),
})

export const serverEnv = envSchema.parse(process.env)
