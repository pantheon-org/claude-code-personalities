import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let tmpRoot: string;
let dataDir: string;
let homeDir: string;
let personalities: typeof import("./personalities.js");

beforeEach(async () => {
	tmpRoot = mkdtempSync(join(tmpdir(), "personalities-test-"));
	dataDir = join(tmpRoot, "data");
	homeDir = join(tmpRoot, "home");
	// saveState() does not create its parent directory itself, so the state
	// file's parent must already exist — matches a real ~/.config/claude.
	mkdirSync(join(homeDir, ".config/claude"), { recursive: true });
	process.env.CLAUDE_PLUGIN_DATA_DIR = dataDir;
	process.env.HOME = homeDir;
	// Force a fresh module instance so PERSONALITIES_DIR/STATE_FILE are
	// recomputed from the env vars set above rather than reused from cache.
	personalities = await import(
		`./personalities.js?t=${Date.now()}-${Math.random()}`
	);
});

afterEach(() => {
	rmSync(tmpRoot, { recursive: true, force: true });
});

describe("getAvailablePersonalities", () => {
	test("creates the data dir and returns an empty list when missing", async () => {
		const result = await personalities.getAvailablePersonalities();
		expect(result).toEqual([]);
	});

	test("returns json file basenames, sorted, excluding non-json files", async () => {
		mkdirSync(dataDir, { recursive: true });
		writeFileSync(join(dataDir, "yoda.json"), "{}");
		writeFileSync(join(dataDir, "bender.json"), "{}");
		writeFileSync(join(dataDir, "notes.txt"), "ignore me");

		const result = await personalities.getAvailablePersonalities();
		expect(result).toEqual(["bender", "yoda"]);
	});
});

describe("loadState / saveState", () => {
	test("loadState returns null when no state file exists", async () => {
		expect(await personalities.loadState()).toBeNull();
	});

	test("saveState writes state that loadState reads back", async () => {
		await personalities.saveState("bender");
		expect(await personalities.loadState()).toEqual({ current: "bender" });
	});

	test("loadState throws on a state file that fails schema validation", async () => {
		writeFileSync(personalities.STATE_FILE, JSON.stringify({ bogus: true }));
		await expect(personalities.loadState()).rejects.toThrow();
	});

	test("saveState rejects when its parent config directory does not exist", async () => {
		// Known fragility: saveState() never creates STATE_FILE's parent dir,
		// so a $HOME without a pre-existing ~/.config/claude makes this throw.
		rmSync(join(homeDir, ".config"), { recursive: true, force: true });
		await expect(personalities.saveState("bender")).rejects.toThrow();
	});
});

describe("loadPersonality", () => {
	test("loads and validates a personality config by name", async () => {
		mkdirSync(dataDir, { recursive: true });
		const config = { description: "A test personality." };
		writeFileSync(join(dataDir, "test.json"), JSON.stringify(config));

		expect(await personalities.loadPersonality("test")).toEqual(config);
	});

	test("rejects a config that fails schema validation", async () => {
		mkdirSync(dataDir, { recursive: true });
		writeFileSync(join(dataDir, "bad.json"), JSON.stringify({ bogus: true }));

		await expect(personalities.loadPersonality("bad")).rejects.toThrow();
	});

	test("rejects a missing personality file", async () => {
		mkdirSync(dataDir, { recursive: true });
		await expect(personalities.loadPersonality("missing")).rejects.toThrow();
	});
});

describe("buildPrompt", () => {
	test("always includes the persona directive", () => {
		const prompt = personalities.buildPrompt({ description: "A tester." });
		expect(prompt).toContain("You MUST maintain the following persona");
	});

	test("includes name and description together when both are set", () => {
		const prompt = personalities.buildPrompt({
			name: "Bender",
			description: "Bending unit 22.",
		});
		expect(prompt).toContain("Persona: Bender — Bending unit 22.");
	});

	test("falls back to description only when name is absent", () => {
		const prompt = personalities.buildPrompt({ description: "Just a vibe." });
		expect(prompt).toContain("Persona: Just a vibe.");
		expect(prompt).not.toContain("Persona: undefined");
	});

	test("instructs the model to refer to itself by name when set", () => {
		const prompt = personalities.buildPrompt({
			name: "Bender",
			description: "x",
		});
		expect(prompt).toContain(
			"Refer to yourself as Bender when asked who you are.",
		);
	});

	test("adds emoji usage guidance when an emoji is set", () => {
		const prompt = personalities.buildPrompt({
			description: "x",
			emoji: "🤖",
		});
		expect(prompt).toContain("Use 🤖 and other fitting emojis naturally");
	});

	test("omits emoji guidance when no emoji is set", () => {
		const prompt = personalities.buildPrompt({ description: "x" });
		expect(prompt).not.toContain("emojis naturally");
	});

	test("omits slang guidance when slangIntensity is unset", () => {
		const prompt = personalities.buildPrompt({ description: "x" });
		expect(prompt).not.toContain("slang");
	});

	test("omits slang guidance when slangIntensity is 0", () => {
		const prompt = personalities.buildPrompt({
			description: "x",
			slangIntensity: 0,
		});
		expect(prompt).not.toContain("slang");
	});

	test("uses light slang wording at low intensity", () => {
		const prompt = personalities.buildPrompt({
			description: "x",
			slangIntensity: 0.2,
		});
		expect(prompt).toContain("Use light slang");
	});

	test("uses moderate slang wording at mid intensity", () => {
		const prompt = personalities.buildPrompt({
			description: "x",
			slangIntensity: 0.5,
		});
		expect(prompt).toContain("Use moderate slang");
	});

	test("uses heavy slang wording at high intensity", () => {
		const prompt = personalities.buildPrompt({
			description: "x",
			slangIntensity: 0.9,
		});
		expect(prompt).toContain("Use heavy slang");
	});

	test("omits mood line when mood is not enabled", () => {
		const prompt = personalities.buildPrompt({
			description: "x",
			mood: { enabled: false, default: "lazy" },
		});
		expect(prompt).not.toContain("Current mood");
	});

	test("reports the default mood and its hint when enabled with no override", () => {
		const prompt = personalities.buildPrompt({
			description: "x",
			mood: { enabled: true, default: "lazy" },
			moods: [{ name: "lazy", hint: "Minimal effort mode.", score: 0 }],
		});
		expect(prompt).toContain("Current mood: lazy. Minimal effort mode.");
	});

	test("reports the override mood instead of the default when set", () => {
		const prompt = personalities.buildPrompt({
			description: "x",
			mood: { enabled: true, default: "lazy", override: "angry" },
			moods: [
				{ name: "lazy", hint: "Minimal effort mode.", score: 0 },
				{ name: "angry", hint: "Threatens violence.", score: -2 },
			],
		});
		expect(prompt).toContain("Current mood: angry. Threatens violence.");
	});

	test("reports an empty hint when the active mood has no matching entry", () => {
		const prompt = personalities.buildPrompt({
			description: "x",
			mood: { enabled: true, default: "lazy" },
		});
		expect(prompt).toContain("Current mood: lazy.");
	});
});
