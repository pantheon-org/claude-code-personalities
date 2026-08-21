import { describe, expect, test } from "bun:test";
import { homedir } from "node:os";
import { CLAUDE_CODE_CONFIG_DIR, CLAUDE_CODE_CONFIG_FILE } from "./contants.js";

describe("contants", () => {
	test("CLAUDE_CODE_CONFIG_FILE is settings.json", () => {
		expect(CLAUDE_CODE_CONFIG_FILE).toBe("settings.json");
	});

	test("CLAUDE_CODE_CONFIG_DIR is under the user's home directory", () => {
		expect(CLAUDE_CODE_CONFIG_DIR).toBe(`${homedir()}/.claude`);
	});
});
