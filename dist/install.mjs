#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readdirSync, symlinkSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
//#region src/install.ts
/**
* install.ts — sets up the personalities plugin:
*   1. Seeds bundled personality data into the user's personalities directory.
*   2. Creates a skill symlink in ~/.claude/skills/personality.
*/
var PLUGIN_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
var DATA_DIR = process.env.CLAUDE_PLUGIN_DATA_DIR ?? join(homedir(), ".config/claude/personalities/data");
var SKILLS_DIR = join(homedir(), ".claude/skills");
mkdirSync(DATA_DIR, { recursive: true });
if (readdirSync(DATA_DIR).filter((f) => f.endsWith(".json")).length === 0) {
	const srcDir = join(PLUGIN_DIR, "data");
	if (existsSync(srcDir)) {
		for (const file of readdirSync(srcDir).filter((f) => f.endsWith(".json"))) copyFileSync(join(srcDir, file), join(DATA_DIR, file));
		console.log(`Seeded example personalities into ${DATA_DIR}`);
	}
} else console.log(`Personalities already installed in ${DATA_DIR} — skipping seed.`);
mkdirSync(SKILLS_DIR, { recursive: true });
var skillLink = join(SKILLS_DIR, "personality");
var skillTarget = join(PLUGIN_DIR, "skills/personality");
if (!existsSync(skillLink)) {
	symlinkSync(skillTarget, skillLink);
	console.log(`Created skill symlink: ${skillLink} → ${skillTarget}`);
} else console.log(`Skill symlink already exists at ${skillLink} — skipping.`);
//#endregion
