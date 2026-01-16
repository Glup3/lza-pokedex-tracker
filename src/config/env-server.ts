import { z } from 'zod'

const envSchema = z.object({
	CONVEX_SITE_URL: z.string().default('http://127.0.0.1:3211'),
	CONVEX_URL: z.string().default('http://127.0.0.1:3210'),
})

export const serverEnv = envSchema.parse(process.env)
