import { z } from 'zod'

const clientEnvSchema = z.object({
	VITE_CONVEX_URL: z.string(),
})

export const clientEnv = clientEnvSchema.parse(import.meta.env)
