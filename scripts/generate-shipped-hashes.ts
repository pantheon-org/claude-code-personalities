/**
 * Records the SHA-256 of every version of every bundled personality this repo
 * has ever published.
 *
 * The installer uses it to answer one question: is the file on a user's disk
 * one we shipped, or one they wrote? A file matching any historical hash is
 * untouched and safe to update; a file matching none has been customised and
 * must be left alone. Users who installed before the ledger existed have no
 * per-file record, so this manifest is the only way to tell those two cases
 * apart for them.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function git(...args: string[]): string {
	return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" });
}

function sha256(content: string): string {
	return createHash("sha256").update(content, "utf8").digest("hex");
}

const DEST = join(ROOT, "schema", "shipped-hashes.json");

// The manifest is append-only. A shallow CI checkout sees only the tip commit,
// so regenerating from git history alone would silently drop every older hash
// and make previously shipped files look like user edits.
const hashes: Record<string, Set<string>> = {};
if (existsSync(DEST)) {
	try {
		const prior: Record<string, string[]> = JSON.parse(
			readFileSync(DEST, "utf8"),
		);
		for (const [file, list] of Object.entries(prior)) {
			hashes[file] = new Set(list);
		}
	} catch {
		// An unreadable manifest is rebuilt from whatever history is available.
	}
}

const commits = git("rev-list", "HEAD", "--", "data").trim().split("\n");

function record(file: string, content: string): void {
	if (!hashes[file]) hashes[file] = new Set();
	hashes[file].add(sha256(content));
}

for (const commit of commits.filter(Boolean)) {
	const listing = git("ls-tree", "-r", "--name-only", commit, "--", "data");
	for (const path of listing.trim().split("\n").filter(Boolean)) {
		if (!path.endsWith(".json")) continue;
		try {
			record(path.replace(/^data\//, ""), git("show", `${commit}:${path}`));
		} catch {
			// A path listed in the tree but unreadable is not worth aborting over;
			// a missing historical hash only means the installer is more cautious.
		}
	}
}

// The working tree may hold changes that are not committed yet.
for (const file of readdirSync(join(ROOT, "data"))) {
	if (!file.endsWith(".json")) continue;
	record(file, readFileSync(join(ROOT, "data", file), "utf8"));
}

const manifest = Object.fromEntries(
	Object.entries(hashes)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([file, set]) => [file, [...set].sort()]),
);

writeFileSync(DEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
	`Generated ${DEST} (${Object.keys(manifest).length} personalities, ${Object.values(
		manifest,
	).reduce((n, v) => n + v.length, 0)} published versions)`,
);
