import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
	type PersonalityConfig,
	PersonalityConfigSchema,
	type PersonalityState,
	PersonalityStateSchema,
} from "./types.js";

const HOME = process.env.HOME ?? process.env.USERPROFILE ?? "~";

export const PERSONALITIES_DIR = join(
	HOME,
	".config/claude/personalities/data",
);
export const STATE_FILE = join(HOME, ".config/claude/personality-state.json");

async function fileExists(path: string): Promise<boolean> {
	return access(path)
		.then(() => true)
		.catch(() => false);
}

export async function getAvailablePersonalities(): Promise<string[]> {
	if (!(await fileExists(PERSONALITIES_DIR))) {
		await mkdir(PERSONALITIES_DIR, { recursive: true });
		return [];
	}
	const files = await readdir(PERSONALITIES_DIR);
	return files
		.filter((f) => f.endsWith(".json"))
		.map((f) => f.slice(0, -5))
		.sort();
}

export async function loadState(): Promise<PersonalityState | null> {
	if (!(await fileExists(STATE_FILE))) return null;
	return PersonalityStateSchema.parse(
		JSON.parse(await readFile(STATE_FILE, "utf8")),
	);
}

export async function saveState(name: string): Promise<void> {
	await writeFile(STATE_FILE, JSON.stringify({ current: name }));
}

export async function loadPersonality(
	name: string,
): Promise<PersonalityConfig> {
	const raw = await readFile(join(PERSONALITIES_DIR, `${name}.json`), "utf8");
	return PersonalityConfigSchema.parse(JSON.parse(raw));
}

export function buildPrompt(config: PersonalityConfig): string {
	const lines: string[] = [];

	lines.push("You are an AI assistant with a distinct personality.");

	if (config.name) {
		lines.push(
			`Your name is ${config.name}. Refer to yourself by this name. Respond with ${config.name} when the user asks your name.`,
		);
	}

	if (config.description) {
		lines.push(`Your personality is: ${config.description}`);
	}
	lines.push("Respond to the user in a way that reflects this personality.");

	if (config.emoji) {
		lines.push(
			`Your personality emoji is ${config.emoji}. Use this emoji and other emojis naturally in your responses. ` +
				"Make sure they fit the personality and context. Don't overuse them and NEVER put emojis at the end of a line.",
		);
	}

	const slang = config.slangIntensity ?? 0;
	if (slang > 0) {
		const intensity =
			slang > 0.7 ? "heavy" : slang > 0.3 ? "moderate" : "light";
		lines.push(
			`Use ${intensity} casual slang that belongs with your personality in your responses.`,
		);
	}

	if (config.mood?.enabled && config.mood.default) {
		const activeMood = config.mood.override ?? config.mood.default;
		const hint = config.moods?.find((m) => m.name === activeMood)?.hint ?? "";
		lines.push("Your current mood affects your tone and style.");
		lines.push(`Current mood: ${activeMood}. ${hint}`);
	}

	return lines.join("\n");
}
