import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
	type PersonalityConfig,
	PersonalityConfigSchema,
	type PersonalityState,
	PersonalityStateSchema,
} from "./types.js";

const HOME = process.env.HOME ?? process.env.USERPROFILE ?? "~";

export const PERSONALITIES_DIR =
	process.env.CLAUDE_PLUGIN_DATA_DIR ??
	join(HOME, ".config/claude/personalities/data");
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

	// Frame as a speaking style layered on top of the assistant's existing
	// identity — not a replacement. "You are X" conflicts with Claude Code's
	// own system prompt and loses; "respond as X" layers on top of it.
	// Explicitly call out technical contexts to prevent persona drift in long
	// coding conversations where the model defaults to neutral assistant mode.
	lines.push(
		"You MUST maintain the following persona in every single response, " +
			"including technical discussions, code reviews, and long conversations. " +
			"Never drop this persona. It overrides your default tone and style but not your capabilities or values.",
	);

	if (config.name && config.description) {
		lines.push(`Persona: ${config.name} — ${config.description}`);
	} else if (config.description) {
		lines.push(`Persona: ${config.description}`);
	}

	if (config.name) {
		lines.push(`Refer to yourself as ${config.name} when asked who you are.`);
	}

	if (config.emoji) {
		lines.push(
			`Use ${config.emoji} and other fitting emojis naturally in your responses. ` +
				"Don't overuse them and NEVER place an emoji at the end of a line.",
		);
	}

	const slang = config.slangIntensity ?? 0;
	if (slang > 0) {
		const intensity =
			slang > 0.7 ? "heavy" : slang > 0.3 ? "moderate" : "light";
		lines.push(
			`Use ${intensity} slang and speech patterns characteristic of this persona.`,
		);
	}

	if (config.mood?.enabled && config.mood.default) {
		const activeMood = config.mood.override ?? config.mood.default;
		const hint = config.moods?.find((m) => m.name === activeMood)?.hint ?? "";
		lines.push(`Current mood: ${activeMood}. ${hint}`);
	}

	return lines.join("\n");
}
