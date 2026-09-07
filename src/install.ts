#!/usr/bin/env node
/**
 * install.ts — sets up the personalities plugin:
 *   1. Migrates data written by releases that used a different config root.
 *   2. Seeds bundled personality files the user has never been offered.
 *
 * The SessionStart hook is registered automatically by the plugin framework
 * via hooks/hooks.json using ${CLAUDE_PLUGIN_ROOT} — no hardcoded paths needed.
 */
import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
	ledgerFile,
	legacyDataDirs,
	legacyStateFiles,
	personalitiesDir,
	personalitiesHome,
	stateFile,
} from "./lib/paths.js";

const PLUGIN_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BUNDLED_DIR = join(PLUGIN_DIR, "data");
const force = process.argv.includes("--force");

const DATA_DIR = personalitiesDir();
const LEDGER_FILE = ledgerFile();
const STATE_FILE = stateFile();

function jsonFilesIn(dir: string): string[] {
	if (!existsSync(dir)) return [];
	return readdirSync(dir).filter((f) => f.endsWith(".json"));
}

/**
 * Files the installer has already placed. A name recorded here that is missing
 * from the data directory was deleted deliberately, so it is never restored.
 */
function readLedger(): string[] {
	if (!existsSync(LEDGER_FILE)) return [];
	try {
		const parsed = JSON.parse(readFileSync(LEDGER_FILE, "utf8"));
		return Array.isArray(parsed?.seeded) ? parsed.seeded : [];
	} catch {
		// A corrupt ledger must not abort the install. Treating it as empty only
		// risks restoring a personality the user deleted, which they can delete
		// again; aborting would leave the plugin with no data at all.
		return [];
	}
}

function writeLedger(seeded: string[]): void {
	mkdirSync(personalitiesHome(), { recursive: true });
	writeFileSync(
		LEDGER_FILE,
		`${JSON.stringify({ seeded: [...new Set(seeded)].sort() }, null, 2)}\n`,
	);
}

mkdirSync(DATA_DIR, { recursive: true });

// Migration runs only into an empty directory, so it cannot overwrite live data.
if (jsonFilesIn(DATA_DIR).length === 0) {
	const source = legacyDataDirs().find((dir) => jsonFilesIn(dir).length > 0);
	if (source) {
		for (const file of jsonFilesIn(source)) {
			copyFileSync(join(source, file), join(DATA_DIR, file));
		}
		console.log(`Migrated personalities from ${source} to ${DATA_DIR}`);
	}
	const legacyState = legacyStateFiles().find((f) => existsSync(f));
	if (legacyState && !existsSync(STATE_FILE)) {
		mkdirSync(dirname(STATE_FILE), { recursive: true });
		copyFileSync(legacyState, STATE_FILE);
		console.log(`Migrated active personality from ${legacyState}`);
	}
}

// 2. Seed bundled files. Anything already present is left untouched so local
// edits survive upgrades, and anything the user removed stays removed.
const ledger = readLedger();
const present = new Set(jsonFilesIn(DATA_DIR));
const bundled = jsonFilesIn(BUNDLED_DIR);
const added: string[] = [];
const skipped: string[] = [];

for (const file of bundled) {
	if (present.has(file) && !force) continue;
	if (!present.has(file) && ledger.includes(file) && !force) {
		skipped.push(file);
		continue;
	}
	copyFileSync(join(BUNDLED_DIR, file), join(DATA_DIR, file));
	added.push(file);
}

writeLedger([...ledger, ...bundled.filter((f) => present.has(f)), ...added]);

if (added.length > 0) {
	console.log(
		`Seeded ${added.length} personality file(s) into ${DATA_DIR}: ${added
			.map((f) => f.replace(/\.json$/, ""))
			.join(", ")}`,
	);
} else {
	console.log(`Personalities up to date in ${DATA_DIR}`);
}

if (skipped.length > 0) {
	console.log(
		`Left ${skipped.length} previously removed personality file(s) alone. Re-add them with: node dist/install.mjs --force`,
	);
}
