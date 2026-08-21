import { describe, expect, test } from "bun:test";
import {
	MoodSchema,
	PersonalityConfigSchema,
	PersonalityStateSchema,
} from "./types.js";

describe("MoodSchema", () => {
	test("accepts a valid mood", () => {
		const mood = { name: "lazy", hint: "Minimal effort mode.", score: 0 };
		expect(MoodSchema.parse(mood)).toEqual(mood);
	});

	test("rejects an empty name", () => {
		expect(() => MoodSchema.parse({ name: "", hint: "x", score: 0 })).toThrow();
	});

	test("rejects an empty hint", () => {
		expect(() =>
			MoodSchema.parse({ name: "lazy", hint: "", score: 0 }),
		).toThrow();
	});

	test("rejects a non-numeric score", () => {
		expect(() =>
			MoodSchema.parse({ name: "lazy", hint: "x", score: "0" }),
		).toThrow();
	});

	test("rejects unknown keys", () => {
		expect(() =>
			MoodSchema.parse({ name: "lazy", hint: "x", score: 0, extra: true }),
		).toThrow();
	});
});

describe("PersonalityConfigSchema", () => {
	test("accepts the minimal valid config", () => {
		const config = { description: "A minimal personality." };
		expect(PersonalityConfigSchema.parse(config)).toEqual(config);
	});

	test("accepts a fully populated config", () => {
		const config = {
			$schema: "https://example.com/schema.json",
			name: "Bender",
			description: "Bending unit 22.",
			emoji: "🤖",
			slangIntensity: 0.3,
			moods: [{ name: "lazy", hint: "Minimal effort.", score: 0 }],
			mood: {
				enabled: true,
				default: "lazy",
				override: null,
				drift: 0.4,
			},
		};
		expect(PersonalityConfigSchema.parse(config)).toEqual(config);
	});

	test("rejects a missing description", () => {
		expect(() => PersonalityConfigSchema.parse({})).toThrow();
	});

	test("rejects an empty description", () => {
		expect(() => PersonalityConfigSchema.parse({ description: "" })).toThrow();
	});

	test("rejects slangIntensity above 1", () => {
		expect(() =>
			PersonalityConfigSchema.parse({
				description: "x",
				slangIntensity: 1.1,
			}),
		).toThrow();
	});

	test("rejects slangIntensity below 0", () => {
		expect(() =>
			PersonalityConfigSchema.parse({
				description: "x",
				slangIntensity: -0.1,
			}),
		).toThrow();
	});

	test("rejects a mood.drift above 1", () => {
		expect(() =>
			PersonalityConfigSchema.parse({
				description: "x",
				mood: { enabled: true, default: "lazy", drift: 1.5 },
			}),
		).toThrow();
	});

	test("rejects a mood block missing default", () => {
		expect(() =>
			PersonalityConfigSchema.parse({
				description: "x",
				mood: { enabled: true },
			}),
		).toThrow();
	});

	test("rejects unknown top-level keys", () => {
		expect(() =>
			PersonalityConfigSchema.parse({ description: "x", bogus: true }),
		).toThrow();
	});

	test("rejects unknown keys inside mood", () => {
		expect(() =>
			PersonalityConfigSchema.parse({
				description: "x",
				mood: { enabled: true, default: "lazy", bogus: true },
			}),
		).toThrow();
	});
});

describe("PersonalityStateSchema", () => {
	test("accepts a valid state", () => {
		expect(PersonalityStateSchema.parse({ current: "bender" })).toEqual({
			current: "bender",
		});
	});

	test("rejects a missing current field", () => {
		expect(() => PersonalityStateSchema.parse({})).toThrow();
	});

	test("rejects a non-string current field", () => {
		expect(() => PersonalityStateSchema.parse({ current: 1 })).toThrow();
	});
});
