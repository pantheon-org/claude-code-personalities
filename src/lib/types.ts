import { z } from "zod";

export const MoodSchema = z.object({
	name: z.string(),
	hint: z.string(),
	score: z.number(),
});

export const PersonalityConfigSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	emoji: z.string().optional(),
	slangIntensity: z.number().min(0).max(1).optional(),
	moods: z.array(MoodSchema).optional(),
	mood: z
		.object({
			enabled: z.boolean().optional(),
			default: z.string().optional(),
			override: z.string().nullable().optional(),
			drift: z.number().optional(),
		})
		.optional(),
});

export const PersonalityStateSchema = z.object({
	current: z.string(),
});

export type Mood = z.infer<typeof MoodSchema>;
export type PersonalityConfig = z.infer<typeof PersonalityConfigSchema>;
export type PersonalityState = z.infer<typeof PersonalityStateSchema>;
