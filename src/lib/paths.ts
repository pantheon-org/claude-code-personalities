import { homedir } from "node:os";
import { join } from "node:path";

// Resolved on each call rather than at module scope so a caller that changes
// HOME or CLAUDE_CONFIG_DIR (the test suite, and Claude Code itself when it
// relocates its config) sees the new value instead of a cached one.
function home(): string {
	return process.env.HOME ?? process.env.USERPROFILE ?? homedir();
}

/**
 * Claude Code resolves its own config directory from CLAUDE_CONFIG_DIR and
 * falls back to ~/.claude, so the plugin follows the same rule. Every path the
 * plugin reads or writes hangs off this one root: the installer and the runtime
 * previously computed their directories independently and drifted apart, which
 * left the installer seeding a directory nothing ever read.
 */
export function configDir(): string {
	return process.env.CLAUDE_CONFIG_DIR ?? join(home(), ".claude");
}

export function personalitiesHome(): string {
	return join(configDir(), "personalities");
}

export function personalitiesDir(): string {
	return (
		process.env.CLAUDE_PLUGIN_DATA_DIR ?? join(personalitiesHome(), "data")
	);
}

export function stateFile(): string {
	return join(configDir(), "personality-state.json");
}

/**
 * Records which personality files the installer has placed. Kept outside the
 * data directory because that directory is scanned for `*.json` and every match
 * is offered to the user as a personality.
 */
export function ledgerFile(): string {
	return join(personalitiesHome(), "seeded.json");
}

/** Data directories written by releases that predate the shared config root. */
export function legacyDataDirs(): string[] {
	const current = personalitiesDir();
	return [
		join(home(), ".config/claude/personalities/data"),
		join(home(), ".claude/personalities/data"),
	].filter((dir) => dir !== current);
}

/** State files written by releases that predate the shared config root. */
export function legacyStateFiles(): string[] {
	const current = stateFile();
	return [
		join(home(), ".config/claude/personality-state.json"),
		join(home(), ".claude/personality-state.json"),
	].filter((file) => file !== current);
}
