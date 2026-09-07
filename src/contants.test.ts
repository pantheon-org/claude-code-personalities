import { describe, expect, test } from "bun:test";
import { homedir } from "node:os";
import { CLAUDE_CODE_CONFIG_DIR, CLAUDE_CODE_CONFIG_FILE } from "./contants.js";

describe("contants", () => {
	test("CLAUDE_CODE_CONFIG_FILE is settings.json", () => {
		expect(CLAUDE_CODE_CONFIG_FILE).toBe("settings.json");
	});

	test("CLAUDE_CODE_CONFIG_DIR falls back to ~/.claude", () => {
		const home = process.env.HOME ?? process.env.USERPROFILE ?? homedir();
		const expected = process.env.CLAUDE_CONFIG_DIR ?? `${home}/.claude`;
		expect(CLAUDE_CODE_CONFIG_DIR).toBe(expected);
	});
});
