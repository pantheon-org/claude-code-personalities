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

async function runSwitch(dataDir: string, homeDir: string, arg?: string) {
	const args = arg === undefined ? [] : [arg];
	const proc = Bun.spawn(["bun", "run", "src/cli/switch.ts", ...args], {
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
	const tmpRoot = mkdtempSync(join(tmpdir(), "switch-test-"));
	const dataDir = join(tmpRoot, "data");
	const homeDir = join(tmpRoot, "home");
	// saveState() requires its parent dir to pre-exist — see
	// personalities.test.ts's "saveState rejects when its parent config
	// directory does not exist" for the fragility this works around.
	mkdirSync(join(homeDir, ".config/claude"), { recursive: true });
	return { tmpRoot, dataDir, homeDir };
}

describe("switch CLI", () => {
	test("reports no personalities installed when the data dir is empty", async () => {
		const { tmpRoot, dataDir, homeDir } = setUp();
		try {
			const { stdout, exitCode } = await runSwitch(dataDir, homeDir);
			expect(exitCode).toBe(0);
			expect(stdout).toContain("Active personality: none");
			expect(stdout).toContain("No personalities installed.");
		} finally {
			rmSync(tmpRoot, { recursive: true, force: true });
		}
	});

	test("lists available personalities with the active one marked", async () => {
		const { tmpRoot, dataDir, homeDir } = setUp();
		try {
			mkdirSync(dataDir, { recursive: true });
			writeFileSync(
				join(dataDir, "bender.json"),
				JSON.stringify({ name: "Bender", description: "x", emoji: "🤖" }),
			);
			writeFileSync(
				join(dataDir, "yoda.json"),
				JSON.stringify({ name: "Yoda", description: "x" }),
			);
			mkdirSync(join(homeDir, ".config/claude"), { recursive: true });
			writeFileSync(
				join(homeDir, ".config/claude/personality-state.json"),
				JSON.stringify({ current: "bender" }),
			);

			const { stdout, exitCode } = await runSwitch(dataDir, homeDir);
			expect(exitCode).toBe(0);
			expect(stdout).toContain("Active personality: bender");
			expect(stdout).toContain("bender — Bender ← active");
			expect(stdout).toContain("yoda — Yoda");
			expect(stdout).not.toContain("yoda — Yoda ← active");
		} finally {
			rmSync(tmpRoot, { recursive: true, force: true });
		}
	});

	test("switches to a known personality and persists the state", async () => {
		const { tmpRoot, dataDir, homeDir } = setUp();
		try {
			mkdirSync(dataDir, { recursive: true });
			writeFileSync(
				join(dataDir, "yoda.json"),
				JSON.stringify({ name: "Yoda", description: "Wise Jedi Master." }),
			);

			const { stdout, exitCode } = await runSwitch(dataDir, homeDir, "yoda");
			expect(exitCode).toBe(0);
			expect(stdout).toContain("Switched to");
			expect(stdout).toContain("Yoda");

			const state = JSON.parse(
				readFileSync(
					join(homeDir, ".config/claude/personality-state.json"),
					"utf8",
				),
			);
			expect(state.current).toBe("yoda");
		} finally {
			rmSync(tmpRoot, { recursive: true, force: true });
		}
	});

	test("normalizes case and surrounding whitespace in the requested name", async () => {
		const { tmpRoot, dataDir, homeDir } = setUp();
		try {
			mkdirSync(dataDir, { recursive: true });
			writeFileSync(
				join(dataDir, "yoda.json"),
				JSON.stringify({ name: "Yoda", description: "x" }),
			);

			const { exitCode } = await runSwitch(dataDir, homeDir, "  YODA  ");
			expect(exitCode).toBe(0);

			const state = JSON.parse(
				readFileSync(
					join(homeDir, ".config/claude/personality-state.json"),
					"utf8",
				),
			);
			expect(state.current).toBe("yoda");
		} finally {
			rmSync(tmpRoot, { recursive: true, force: true });
		}
	});

	test("errors on an unknown personality name and lists the alternatives", async () => {
		const { tmpRoot, dataDir, homeDir } = setUp();
		try {
			mkdirSync(dataDir, { recursive: true });
			writeFileSync(
				join(dataDir, "yoda.json"),
				JSON.stringify({ name: "Yoda", description: "x" }),
			);

			const { stderr, exitCode } = await runSwitch(dataDir, homeDir, "ghost");
			expect(exitCode).toBe(1);
			expect(stderr).toContain('Unknown personality: "ghost"');
			expect(stderr).toContain("Available: yoda");
		} finally {
			rmSync(tmpRoot, { recursive: true, force: true });
		}
	});

	test("errors on an unknown personality without listing alternatives when none exist", async () => {
		const { tmpRoot, dataDir, homeDir } = setUp();
		try {
			const { stderr, exitCode } = await runSwitch(dataDir, homeDir, "ghost");
			expect(exitCode).toBe(1);
			expect(stderr).toContain('Unknown personality: "ghost"');
			expect(stderr).not.toContain("Available:");
		} finally {
			rmSync(tmpRoot, { recursive: true, force: true });
		}
	});
});
