#!/usr/bin/env node
/**
 * SessionStart hook — injects the active personality once at session open.
 * Output: { "additionalContext": "<prompt>" }
 * If no personalities are installed, exits silently with no output.
 */
import {
	buildPrompt,
	getAvailablePersonalities,
	loadPersonality,
	loadState,
	saveState,
} from "../lib/personalities.js";

const available = await getAvailablePersonalities();

if (available.length === 0) {
	process.exit(0);
}

let state = await loadState();

if (!state || !available.includes(state.current)) {
	const chosen = available[
		Math.floor(Math.random() * available.length)
	] as string;
	await saveState(chosen);
	state = { current: chosen };
}

const config = await loadPersonality(state.current);
console.log(JSON.stringify({ additionalContext: buildPrompt(config) }));
