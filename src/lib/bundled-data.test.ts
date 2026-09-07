import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildPrompt } from "./personalities.js";
import { PersonalityConfigSchema } from "./types.js";

// The bundled data/*.json files are shipped verbatim to users' machines by
// src/install.ts, so a malformed one is a broken install rather than a failed
// build. Validate the real files rather than fixtures.
const DATA_DIR = join(import.meta.dir, "../../data");

const files = readdirSync(DATA_DIR)
	.filter((f) => f.endsWith(".json"))
	.sort();

describe("bundled personalities", () => {
	test("the data directory is not empty", () => {
		expect(files.length).toBeGreaterThan(0);
	});

	test.each(files)("%s parses against PersonalityConfigSchema", (file) => {
		const raw = JSON.parse(readFileSync(join(DATA_DIR, file), "utf8"));
		const result = PersonalityConfigSchema.safeParse(raw);
		expect(result.error?.issues ?? []).toEqual([]);
		expect(result.success).toBe(true);
	});

	test.each(files)("%s resolves its default mood", (file) => {
		const config = PersonalityConfigSchema.parse(
			JSON.parse(readFileSync(join(DATA_DIR, file), "utf8")),
		);
		if (!config.mood?.enabled) return;
		const names = (config.moods ?? []).map((m) => m.name);
		expect(names).toContain(config.mood.default);
	});

	test.each(files)("%s has unique mood names", (file) => {
		const config = PersonalityConfigSchema.parse(
			JSON.parse(readFileSync(join(DATA_DIR, file), "utf8")),
		);
		const names = (config.moods ?? []).map((m) => m.name);
		expect(names).toEqual([...new Set(names)]);
	});

	test.each(files)("%s builds a prompt naming the persona", (file) => {
		const config = PersonalityConfigSchema.parse(
			JSON.parse(readFileSync(join(DATA_DIR, file), "utf8")),
		);
		const prompt = buildPrompt(config);
		expect(prompt).toContain("Persona:");
		if (config.name) expect(prompt).toContain(config.name);
	});
});
