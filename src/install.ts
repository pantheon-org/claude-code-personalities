#!/usr/bin/env node
/**
 * install.ts — sets up the personalities plugin:
 *   1. Migrates data written by releases that used a different config root.
 *   2. Seeds bundled personality files the user has never been offered.
 *   3. Updates bundled files the user has not edited.
 *
 * The SessionStart hook is registered automatically by the plugin framework
 * via hooks/hooks.json using ${CLAUDE_PLUGIN_ROOT} — no hardcoded paths needed.
 */
import { createHash } from "node:crypto";
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
const HASHES_FILE =
	process.env.CLAUDE_PLUGIN_HASHES_FILE ??
	join(PLUGIN_DIR, "schema", "shipped-hashes.json");
const force = process.argv.includes("--force");

const DATA_DIR = personalitiesDir();
const LEDGER_FILE = ledgerFile();
const STATE_FILE = stateFile();

function jsonFilesIn(dir: string): string[] {
	if (!existsSync(dir)) return [];
	return readdirSync(dir).filter((f) => f.endsWith(".json"));
}

function hashOf(path: string): string {
	return createHash("sha256")
		.update(readFileSync(path, "utf8"), "utf8")
		.digest("hex");
}

/**
 * Every hash this plugin has ever published for a given personality. A user's
 * file matching one of them is a copy we shipped, however old; a file matching
 * none has been edited and must never be overwritten.
 */
function readShippedHashes(): Record<string, string[]> {
	if (!existsSync(HASHES_FILE)) return {};
	try {
		return JSON.parse(readFileSync(HASHES_FILE, "utf8"));
	} catch {
		// Without the manifest the installer simply stops updating files, which
		// is the safe direction to fail in.
		return {};
	}
}

type Ledger = Record<string, string>;

/**
 * Maps each personality file the installer has placed to the hash it wrote.
 * A name recorded here that is missing from the data directory was deleted
 * deliberately, so it is never restored.
 */
function readLedger(): Ledger {
	if (!existsSync(LEDGER_FILE)) return {};
	try {
		const parsed = JSON.parse(readFileSync(LEDGER_FILE, "utf8"));
		if (parsed?.files && typeof parsed.files === "object") return parsed.files;
		// Ledgers written before hashes were tracked list names only. Recording
		// them with no hash keeps deletions sticky while leaving the files
		// themselves to be identified from the shipped-hash manifest.
		if (Array.isArray(parsed?.seeded)) {
			return Object.fromEntries(parsed.seeded.map((f: string) => [f, ""]));
		}
		return {};
	} catch {
		// A corrupt ledger must not abort the install. Treating it as empty only
		// risks restoring a personality the user deleted, which they can delete
		// again; aborting would leave the plugin with no data at all.
		return {};
	}
}

function writeLedger(files: Ledger): void {
	mkdirSync(personalitiesHome(), { recursive: true });
	const sorted = Object.fromEntries(
		Object.entries(files).sort(([a], [b]) => a.localeCompare(b)),
	);
	writeFileSync(
		LEDGER_FILE,
		`${JSON.stringify({ version: 2, files: sorted }, null, 2)}\n`,
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

const ledger = readLedger();
const shipped = readShippedHashes();
const present = new Set(jsonFilesIn(DATA_DIR));
const bundled = jsonFilesIn(BUNDLED_DIR);

const added: string[] = [];
const updated: string[] = [];
const customised: string[] = [];
const removed: string[] = [];

/** True when the user's copy is one this plugin published, rather than theirs. */
function isOurs(file: string, current: string): boolean {
	if (ledger[file] && ledger[file] === current) return true;
	return (shipped[file] ?? []).includes(current);
}

for (const file of bundled) {
	const dest = join(DATA_DIR, file);
	const bundledHash = hashOf(join(BUNDLED_DIR, file));

	if (!present.has(file)) {
		// Absent but recorded means the user deleted it on purpose.
		if (file in ledger && !force) {
			removed.push(file);
			continue;
		}
		copyFileSync(join(BUNDLED_DIR, file), dest);
		ledger[file] = bundledHash;
		added.push(file);
		continue;
	}

	const currentHash = hashOf(dest);
	if (currentHash === bundledHash) {
		ledger[file] = bundledHash;
		continue;
	}

	if (force || isOurs(file, currentHash)) {
		copyFileSync(join(BUNDLED_DIR, file), dest);
		ledger[file] = bundledHash;
		updated.push(file);
		continue;
	}

	customised.push(file);
	if (!(file in ledger)) ledger[file] = "";
}

writeLedger(ledger);

const name = (f: string) => f.replace(/\.json$/, "");

if (added.length > 0) {
	console.log(
		`Added ${added.length} personality file(s): ${added.map(name).join(", ")}`,
	);
}
if (updated.length > 0) {
	console.log(
		`Updated ${updated.length} unmodified personality file(s): ${updated
			.map(name)
			.join(", ")}`,
	);
}
if (added.length === 0 && updated.length === 0) {
	console.log(`Personalities up to date in ${DATA_DIR}`);
}
if (customised.length > 0) {
	console.log(
		`Kept your edited version of: ${customised
			.map(name)
			.join(", ")}. A newer bundled version exists; overwrite with --force.`,
	);
}
if (removed.length > 0) {
	console.log(
		`Left ${removed.length} previously removed personality file(s) alone. Re-add them with: node dist/install.mjs --force`,
	);
}
