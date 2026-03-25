import { z } from "zod";

export const MoodSchema = z
	.object({
		name: z.string().min(1),
		hint: z.string().min(1),
		score: z.number(),
	})
	.strict();

export const PersonalityConfigSchema = z
	.object({
		$schema: z.string().optional(),
		name: z.string().optional(),
		description: z.string().min(1),
		emoji: z.string().optional(),
		slangIntensity: z.number().min(0).max(1).optional(),
		moods: z.array(MoodSchema).optional(),
		mood: z
			.object({
				enabled: z.boolean(),
				default: z.string().min(1),
				override: z.string().nullable().optional(),
				drift: z.number().min(0).max(1).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

export const PersonalityStateSchema = z.object({
	current: z.string(),
});

export type Mood = z.infer<typeof MoodSchema>;
export type PersonalityConfig = z.infer<typeof PersonalityConfigSchema>;
export type PersonalityState = z.infer<typeof PersonalityStateSchema>;
