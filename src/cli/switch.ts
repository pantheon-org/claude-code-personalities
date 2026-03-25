#!/usr/bin/env node
/**
 * CLI for switching the active personality.
 * Usage:
 *   switch           — list all personalities
 *   switch <name>    — activate a personality
 */
import {
	getAvailablePersonalities,
	loadPersonality,
	loadState,
	PERSONALITIES_DIR,
	saveState,
} from "../lib/personalities.js";

const [, , arg] = process.argv;
const available = await getAvailablePersonalities();
const state = await loadState();
const current = state?.current ?? "none";

if (!arg) {
	console.log(`Active personality: ${current}\n`);
	if (available.length === 0) {
		console.log("No personalities installed.");
		console.log(`Add JSON files to ${PERSONALITIES_DIR}/`);
	} else {
		console.log("Available personalities:");
		for (const name of available) {
			const cfg = await loadPersonality(name);
			const marker = name === current ? " ← active" : "";
			console.log(
				`  ${cfg.emoji ?? ""} ${name} — ${cfg.name ?? name}${marker}`,
			);
		}
		console.log("\nUsage: /personality <name>");
	}
} else {
	const name = arg.trim().toLowerCase();
	if (!available.includes(name)) {
		console.error(`Unknown personality: "${name}"`);
		if (available.length > 0) {
			console.error(`Available: ${available.join(", ")}`);
		}
		process.exit(1);
	}
	const cfg = await loadPersonality(name);
	await saveState(name);
	console.log(`Switched to ${cfg.emoji ?? ""} ${cfg.name ?? name}`);
	if (cfg.description) {
		console.log(`Description: ${cfg.description.slice(0, 120)}...`);
	}
	console.log("Personality will take effect on your next message.");
}
