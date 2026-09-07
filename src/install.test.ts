import { describe, expect, test } from "bun:test";
import {
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "..");

const BUNDLED = readdirSync(join(REPO_ROOT, "data"))
	.filter((f) => f.endsWith(".json"))
	.sort();

/**
 * CLAUDE_CONFIG_DIR is what the installer and the runtime both derive their
 * paths from, so pointing it at a temp dir exercises the real resolution rather
 * than an override that only the installer honours.
 */
function envFor(configDir: string): Record<string, string> {
	const env: Record<string, string> = {};
	for (const [key, value] of Object.entries(process.env)) {
		// CLAUDE_PLUGIN_DATA_DIR takes precedence over CLAUDE_CONFIG_DIR, so an
		// inherited one would silently point the install at the real data
		// directory instead of the temp dir under test.
		if (key === "CLAUDE_PLUGIN_DATA_DIR" || value === undefined) continue;
		env[key] = value;
	}
	env.CLAUDE_CONFIG_DIR = configDir;
	return env;
}

async function runInstall(configDir: string, args: string[] = []) {
	const proc = Bun.spawn(["bun", "run", "src/install.ts", ...args], {
		cwd: REPO_ROOT,
		env: envFor(configDir),
		stdout: "pipe",
		stderr: "pipe",
	});
	const [stdout, stderr, exitCode] = await Promise.all([
		new Response(proc.stdout).text(),
		new Response(proc.stderr).text(),
		proc.exited,
	]);
	return { stdout, stderr, exitCode };
}

function withTmp(fn: (root: string) => Promise<void>) {
	return async () => {
		const root = mkdtempSync(join(tmpdir(), "install-test-"));
		try {
			await fn(root);
		} finally {
			rmSync(root, { recursive: true, force: true });
		}
	};
}

const dataDirOf = (root: string) => join(root, "personalities/data");
const ledgerOf = (root: string) => join(root, "personalities/seeded.json");
const listData = (root: string) =>
	readdirSync(dataDirOf(root))
		.filter((f) => f.endsWith(".json"))
		.sort();

describe("install script", () => {
	test(
		"seeds every bundled personality into a fresh config dir",
		withTmp(async (root) => {
			const { exitCode } = await runInstall(root);
			expect(exitCode).toBe(0);
			expect(listData(root)).toEqual(BUNDLED);
		}),
	);

	test(
		"seeds into the directory the runtime actually reads",
		withTmp(async (root) => {
			await runInstall(root);

			// Regression guard: the installer and the runtime once computed their
			// directories from different roots, so the installer populated a
			// directory the hook never opened and a fresh install had no
			// personalities at all. Ask the runtime itself where it looks.
			const probe = Bun.spawn(
				[
					"bun",
					"-e",
					'import("./src/lib/personalities.js").then(m => process.stdout.write(m.PERSONALITIES_DIR))',
				],
				{ cwd: REPO_ROOT, env: envFor(root), stdout: "pipe" },
			);
			const runtimeDir = await new Response(probe.stdout).text();
			await probe.exited;

			expect(runtimeDir).toBe(dataDirOf(root));
			expect(listData(root)).toEqual(BUNDLED);
		}),
	);

	test(
		"delivers newly bundled personalities on a later run",
		withTmp(async (root) => {
			mkdirSync(dataDirOf(root), { recursive: true });
			// An older install that only ever received one personality.
			writeFileSync(
				join(dataDirOf(root), "rick.json"),
				readFileSync(join(REPO_ROOT, "data/rick.json"), "utf8"),
			);

			const { stdout, exitCode } = await runInstall(root);
			expect(exitCode).toBe(0);
			expect(listData(root)).toEqual(BUNDLED);
			expect(stdout).toContain("Seeded");
		}),
	);

	test(
		"never overwrites a personality the user has edited",
		withTmp(async (root) => {
			mkdirSync(dataDirOf(root), { recursive: true });
			const custom = JSON.stringify({ description: "my own rick" });
			writeFileSync(join(dataDirOf(root), "rick.json"), custom);

			await runInstall(root);

			expect(readFileSync(join(dataDirOf(root), "rick.json"), "utf8")).toBe(
				custom,
			);
		}),
	);

	test(
		"leaves a deleted personality deleted on the next run",
		withTmp(async (root) => {
			await runInstall(root);
			rmSync(join(dataDirOf(root), "rick.json"));

			const { stdout } = await runInstall(root);

			expect(listData(root)).not.toContain("rick.json");
			expect(stdout).toContain("previously removed");
		}),
	);

	test(
		"--force restores a deleted personality",
		withTmp(async (root) => {
			await runInstall(root);
			rmSync(join(dataDirOf(root), "rick.json"));

			await runInstall(root, ["--force"]);

			expect(listData(root)).toEqual(BUNDLED);
		}),
	);

	test(
		"records what it seeded in the ledger",
		withTmp(async (root) => {
			await runInstall(root);
			const ledger = JSON.parse(readFileSync(ledgerOf(root), "utf8"));
			expect(ledger.seeded.sort()).toEqual(BUNDLED);
		}),
	);

	test(
		"survives a corrupt ledger rather than aborting",
		withTmp(async (root) => {
			mkdirSync(join(root, "personalities"), { recursive: true });
			writeFileSync(ledgerOf(root), "{ not json");

			const { exitCode } = await runInstall(root);

			expect(exitCode).toBe(0);
			expect(listData(root)).toEqual(BUNDLED);
		}),
	);

	test(
		"migrates data left behind by a release that used a different config root",
		withTmp(async (root) => {
			// An install from before the config root was unified: data and state
			// sit under ~/.config/claude, which nothing reads any more.
			const fakeHome = join(root, "home");
			const legacyDir = join(fakeHome, ".config/claude/personalities/data");
			mkdirSync(legacyDir, { recursive: true });
			writeFileSync(join(legacyDir, "rick.json"), '{"description":"mine"}');
			writeFileSync(
				join(fakeHome, ".config/claude/personality-state.json"),
				JSON.stringify({ current: "rick" }),
			);

			const env = envFor(join(fakeHome, ".claude"));
			env.HOME = fakeHome;
			const proc = Bun.spawn(["bun", "run", "src/install.ts"], {
				cwd: REPO_ROOT,
				env,
				stdout: "pipe",
				stderr: "pipe",
			});
			const stdout = await new Response(proc.stdout).text();
			await proc.exited;

			const migrated = join(fakeHome, ".claude/personalities/data");
			expect(stdout).toContain("Migrated personalities");
			// The user's own edit survives the move rather than being replaced by
			// the bundled copy of the same name.
			expect(readFileSync(join(migrated, "rick.json"), "utf8")).toBe(
				'{"description":"mine"}',
			);
			expect(
				JSON.parse(
					readFileSync(
						join(fakeHome, ".claude/personality-state.json"),
						"utf8",
					),
				),
			).toEqual({ current: "rick" });
			// And the rest of the bundle lands alongside it.
			expect(
				readdirSync(migrated)
					.filter((f) => f.endsWith(".json"))
					.sort(),
			).toEqual(BUNDLED);
		}),
	);

	test(
		"is idempotent across repeated runs",
		withTmp(async (root) => {
			await runInstall(root);
			const first = listData(root);
			const { stdout, exitCode } = await runInstall(root);

			expect(exitCode).toBe(0);
			expect(listData(root)).toEqual(first);
			expect(stdout).toContain("up to date");
		}),
	);
});
