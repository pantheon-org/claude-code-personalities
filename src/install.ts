#!/usr/bin/env node
/**
 * install.ts — seeds bundled personality data into the user's personalities directory.
 *
 * The plugin handles hook registration and skill loading automatically.
 * This script only runs once to copy the example personalities if none exist yet.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PLUGIN_DIR = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(homedir(), ".config/claude/personalities/data");

mkdirSync(DATA_DIR, { recursive: true });

const existing = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
if (existing.length === 0) {
	const srcDir = join(PLUGIN_DIR, "..", "data");
	if (existsSync(srcDir)) {
		for (const file of readdirSync(srcDir).filter((f) => f.endsWith(".json"))) {
			copyFileSync(join(srcDir, file), join(DATA_DIR, file));
		}
		console.log(`Seeded example personalities into ${DATA_DIR}`);
	}
} else {
	console.log(
		`Personalities already installed in ${DATA_DIR} — skipping seed.`,
	);
}
