import { describe, expect, test } from "bun:test";
import {
	mkdirSync,
	mkdtempSync,
	readdirSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "..");

async function runInstall(dataDir: string) {
	const proc = Bun.spawn(["bun", "run", "src/install.ts"], {
		cwd: REPO_ROOT,
		env: { ...process.env, CLAUDE_PLUGIN_DATA_DIR: dataDir },
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

describe("install script", () => {
	test("seeds bundled personality data into an empty data dir", async () => {
		const tmpRoot = mkdtempSync(join(tmpdir(), "install-test-"));
		const dataDir = join(tmpRoot, "data");
		try {
			const { stdout, exitCode } = await runInstall(dataDir);
			expect(exitCode).toBe(0);
			expect(stdout).toContain(`Seeded example personalities into ${dataDir}`);

			const seeded = readdirSync(dataDir).filter((f) => f.endsWith(".json"));
			const bundled = readdirSync(join(REPO_ROOT, "data")).filter((f) =>
				f.endsWith(".json"),
			);
			expect(seeded.sort()).toEqual(bundled.sort());
			expect(seeded.length).toBeGreaterThan(0);
		} finally {
			rmSync(tmpRoot, { recursive: true, force: true });
		}
	});

	test("skips seeding when the data dir already has personality files", async () => {
		const tmpRoot = mkdtempSync(join(tmpdir(), "install-test-"));
		const dataDir = join(tmpRoot, "data");
		try {
			mkdirSync(dataDir, { recursive: true });
			writeFileSync(
				join(dataDir, "custom.json"),
				JSON.stringify({ description: "x" }),
			);

			const { stdout, exitCode } = await runInstall(dataDir);
			expect(exitCode).toBe(0);
			expect(stdout).toContain(
				`Personalities already installed in ${dataDir} — skipping seed.`,
			);

			const files = readdirSync(dataDir);
			expect(files).toEqual(["custom.json"]);
		} finally {
			rmSync(tmpRoot, { recursive: true, force: true });
		}
	});
});
