import { describe, expect, test } from "bun:test";
import { homedir } from "node:os";
import { join } from "node:path";
import { CLAUDE_CODE_CONFIG_DIR, CLAUDE_CODE_CONFIG_FILE } from "./contants.js";

describe("contants", () => {
	test("CLAUDE_CODE_CONFIG_FILE is settings.json", () => {
		expect(CLAUDE_CODE_CONFIG_FILE).toBe("settings.json");
	});

	test("CLAUDE_CODE_CONFIG_DIR falls back to ~/.claude", () => {
		const home = process.env.HOME ?? process.env.USERPROFILE ?? homedir();
		// Built with join, as the production code is: on Windows a template
		// literal would produce a forward slash the real value never has.
		const expected = process.env.CLAUDE_CONFIG_DIR ?? join(home, ".claude");
		expect(CLAUDE_CODE_CONFIG_DIR).toBe(expected);
	});
});
