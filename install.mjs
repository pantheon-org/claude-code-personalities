#!/usr/bin/env node
/**
 * install.mjs — installs claude-code-personalities plugin
 *
 * What this does:
 *   1. Creates ~/.config/claude/personalities/data/ if missing
 *   2. Copies hook and CLI to ~/.config/claude/personalities/
 *   3. Adds the UserPromptSubmit hook to settings.json
 *   4. Symlinks skills/personality into ~/.config/claude/skills/
 *   5. Seeds example personality data if data dir is empty
 */
import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	symlinkSync,
	unlinkSync,
	writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PLUGIN_DIR = dirname(fileURLToPath(import.meta.url));
const HOME = homedir();
const CLAUDE_DIR = join(HOME, ".config/claude");
const PERSONALITIES_DIR = join(CLAUDE_DIR, "personalities");
const DATA_DIR = join(PERSONALITIES_DIR, "data");
const SETTINGS_FILE = join(CLAUDE_DIR, "settings.json");
const SKILLS_DIR = join(CLAUDE_DIR, "skills");

const INJECT_DEST = join(PERSONALITIES_DIR, "inject.mjs");
const SWITCH_DEST = join(PERSONALITIES_DIR, "switch.mjs");
const SKILL_LINK = join(SKILLS_DIR, "personality");

function log(msg) {
	console.log(`  ${msg}`);
}

// 1. Create directories
mkdirSync(DATA_DIR, { recursive: true });
mkdirSync(SKILLS_DIR, { recursive: true });
log("Created ~/.config/claude/personalities/data/");

// 2. Copy compiled scripts to fixed location
copyFileSync(join(PLUGIN_DIR, "dist", "hooks", "inject.mjs"), INJECT_DEST);
copyFileSync(join(PLUGIN_DIR, "dist", "cli", "switch.mjs"), SWITCH_DEST);
log(`Installed inject.mjs → ${INJECT_DEST}`);
log(`Installed switch.mjs → ${SWITCH_DEST}`);

// 3. Seed example data if the data dir is empty
const existing = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
if (existing.length === 0) {
	const exampleSrc = join(PLUGIN_DIR, "data");
	if (existsSync(exampleSrc)) {
		for (const file of readdirSync(exampleSrc).filter((f) =>
			f.endsWith(".json"),
		)) {
			copyFileSync(join(exampleSrc, file), join(DATA_DIR, file));
		}
		log(`Seeded example personalities into ${DATA_DIR}`);
	}
}

// 4. Update settings.json — add UserPromptSubmit hook
const hookCommand = `node "${INJECT_DEST}"`;
let settings = {};
if (existsSync(SETTINGS_FILE)) {
	settings = JSON.parse(readFileSync(SETTINGS_FILE, "utf8"));
}

settings.hooks ??= {};
settings.hooks.UserPromptSubmit ??= [];

// Remove any existing personalities inject hook to avoid duplicates
const INJECT_MARKERS = ["personalities/inject", "personality-inject"];
settings.hooks.UserPromptSubmit = settings.hooks.UserPromptSubmit.filter(
	(entry) => {
		const topCmd = entry.command ?? "";
		const nestedCmds = (entry.hooks ?? []).map((h) => h.command ?? "");
		const allCmds = [topCmd, ...nestedCmds];
		return !INJECT_MARKERS.some((marker) =>
			allCmds.some((cmd) => cmd.includes(marker)),
		);
	},
);

settings.hooks.UserPromptSubmit.push({
	matcher: "",
	hooks: [{ type: "command", command: hookCommand }],
});

writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
log(`Updated ${SETTINGS_FILE} with UserPromptSubmit hook`);

// 5. Symlink skill
const skillSrc = join(PLUGIN_DIR, "skills", "personality");
if (existsSync(SKILL_LINK)) {
	unlinkSync(SKILL_LINK);
}
symlinkSync(skillSrc, SKILL_LINK);
log(`Linked skills/personality → ${SKILL_LINK}`);

console.log("\nDone! The personality plugin is installed.");
console.log("Add personality JSON files to:");
console.log(`  ${DATA_DIR}`);
console.log("Then use /personality to switch between them.");
