#!/usr/bin/env node
import { copyFileSync as e, existsSync as t, mkdirSync as n, readdirSync as r } from "node:fs";
import { dirname as i, join as a, resolve as o } from "node:path";
import { fileURLToPath as s } from "node:url";
import { homedir as c } from "node:os";
//#region src/contants.ts
var l = `${c()}/.claude`, u = o(i(s(import.meta.url)), ".."), d = process.env.CLAUDE_PLUGIN_DATA_DIR ?? a(l, "personalities/data");
if (n(d, { recursive: !0 }), r(d).filter((e) => e.endsWith(".json")).length === 0) {
	let n = a(u, "data");
	if (t(n)) {
		for (let t of r(n).filter((e) => e.endsWith(".json"))) e(a(n, t), a(d, t));
		console.log(`Seeded example personalities into ${d}`);
	}
} else console.log(`Personalities already installed in ${d} — skipping seed.`);
//#endregion
