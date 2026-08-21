import { describe, expect, test } from "bun:test";
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "../..");

async function runInject(dataDir: string, homeDir: string) {
	const proc = Bun.spawn(["bun", "run", "src/hooks/inject.ts"], {
		cwd: REPO_ROOT,
		env: {
			...process.env,
			HOME: homeDir,
			USERPROFILE: homeDir,
			CLAUDE_PLUGIN_DATA_DIR: dataDir,
		},
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

function setUp() {
	const tmpRoot = mkdtempSync(join(tmpdir(), "inject-test-"));
	const dataDir = join(tmpRoot, "data");
	const homeDir = join(tmpRoot, "home");
	// saveState() requires its parent dir to pre-exist — see
	// personalities.test.ts's "saveState rejects when its parent config
	// directory does not exist" for the fragility this works around.
	mkdirSync(join(homeDir, ".config/claude"), { recursive: true });
	return { tmpRoot, dataDir, homeDir };
}

describe("inject hook", () => {
	test("exits silently with no output when no personalities are installed", async () => {
		const { tmpRoot, dataDir, homeDir } = setUp();
		try {
			const { stdout, exitCode } = await runInject(dataDir, homeDir);
			expect(exitCode).toBe(0);
			expect(stdout.trim()).toBe("");
		} finally {
			rmSync(tmpRoot, { recursive: true, force: true });
		}
	});

	test("prints additionalContext built from the sole available personality", async () => {
		const { tmpRoot, dataDir, homeDir } = setUp();
		try {
			mkdirSync(dataDir, { recursive: true });
			writeFileSync(
				join(dataDir, "solo.json"),
				JSON.stringify({ name: "Solo", description: "The only option." }),
			);

			const { stdout, exitCode } = await runInject(dataDir, homeDir);
			expect(exitCode).toBe(0);

			const output = JSON.parse(stdout);
			expect(output.hookSpecificOutput.hookEventName).toBe("SessionStart");
			expect(output.hookSpecificOutput.additionalContext).toContain(
				"Persona: Solo — The only option.",
			);

			const state = JSON.parse(
				readFileSync(
					join(homeDir, ".config/claude/personality-state.json"),
					"utf8",
				),
			);
			expect(state.current).toBe("solo");
		} finally {
			rmSync(tmpRoot, { recursive: true, force: true });
		}
	});

	test("re-picks when the saved state references an unavailable personality", async () => {
		const { tmpRoot, dataDir, homeDir } = setUp();
		try {
			mkdirSync(dataDir, { recursive: true });
			writeFileSync(
				join(dataDir, "solo.json"),
				JSON.stringify({ description: "The only option." }),
			);
			mkdirSync(join(homeDir, ".config/claude"), { recursive: true });
			writeFileSync(
				join(homeDir, ".config/claude/personality-state.json"),
				JSON.stringify({ current: "ghost" }),
			);

			const { stdout, exitCode } = await runInject(dataDir, homeDir);
			expect(exitCode).toBe(0);

			const output = JSON.parse(stdout);
			expect(output.hookSpecificOutput.additionalContext).toContain(
				"Persona: The only option.",
			);
		} finally {
			rmSync(tmpRoot, { recursive: true, force: true });
		}
	});

	test("reuses a saved state that references an available personality", async () => {
		const { tmpRoot, dataDir, homeDir } = setUp();
		try {
			mkdirSync(dataDir, { recursive: true });
			writeFileSync(
				join(dataDir, "a.json"),
				JSON.stringify({ description: "Personality A." }),
			);
			writeFileSync(
				join(dataDir, "b.json"),
				JSON.stringify({ description: "Personality B." }),
			);
			mkdirSync(join(homeDir, ".config/claude"), { recursive: true });
			writeFileSync(
				join(homeDir, ".config/claude/personality-state.json"),
				JSON.stringify({ current: "b" }),
			);

			const { stdout, exitCode } = await runInject(dataDir, homeDir);
			expect(exitCode).toBe(0);

			const output = JSON.parse(stdout);
			expect(output.hookSpecificOutput.additionalContext).toContain(
				"Persona: Personality B.",
			);
		} finally {
			rmSync(tmpRoot, { recursive: true, force: true });
		}
	});
});
