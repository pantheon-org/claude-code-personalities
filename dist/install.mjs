#!/usr/bin/env node
import { createHash as e } from "node:crypto";
import { copyFileSync as t, existsSync as n, mkdirSync as r, readFileSync as i, readdirSync as a, writeFileSync as o } from "node:fs";
import { dirname as s, join as c, resolve as l } from "node:path";
import { fileURLToPath as u } from "node:url";
import { homedir as d } from "node:os";
//#region src/lib/paths.ts
function f() {
	return process.env.HOME ?? process.env.USERPROFILE ?? d();
}
function p() {
	return process.env.CLAUDE_CONFIG_DIR ?? c(f(), ".claude");
}
function m() {
	return c(p(), "personalities");
}
function h() {
	return process.env.CLAUDE_PLUGIN_DATA_DIR ?? c(m(), "data");
}
function g() {
	return c(p(), "personality-state.json");
}
function _() {
	return c(m(), "seeded.json");
}
function v() {
	let e = h();
	return [c(f(), ".config/claude/personalities/data"), c(f(), ".claude/personalities/data")].filter((t) => t !== e);
}
function y() {
	let e = g();
	return [c(f(), ".config/claude/personality-state.json"), c(f(), ".claude/personality-state.json")].filter((t) => t !== e);
}
//#endregion
//#region src/install.ts
var b = l(s(u(import.meta.url)), ".."), x = c(b, "data"), S = process.env.CLAUDE_PLUGIN_HASHES_FILE ?? c(b, "schema", "shipped-hashes.json"), C = process.argv.includes("--force"), w = h(), T = _(), E = g();
function D(e) {
	return n(e) ? a(e).filter((e) => e.endsWith(".json")) : [];
}
function O(t) {
	return e("sha256").update(i(t, "utf8"), "utf8").digest("hex");
}
function k() {
	if (!n(S)) return {};
	try {
		return JSON.parse(i(S, "utf8"));
	} catch {
		return {};
	}
}
function A() {
	if (!n(T)) return {};
	try {
		let e = JSON.parse(i(T, "utf8"));
		return e?.files && typeof e.files == "object" ? e.files : Array.isArray(e?.seeded) ? Object.fromEntries(e.seeded.map((e) => [e, ""])) : {};
	} catch {
		return {};
	}
}
function j(e) {
	r(m(), { recursive: !0 });
	let t = Object.fromEntries(Object.entries(e).sort(([e], [t]) => e.localeCompare(t)));
	o(T, `${JSON.stringify({
		version: 2,
		files: t
	}, null, 2)}\n`);
}
if (r(w, { recursive: !0 }), D(w).length === 0) {
	let e = v().find((e) => D(e).length > 0);
	if (e) {
		for (let n of D(e)) t(c(e, n), c(w, n));
		console.log(`Migrated personalities from ${e} to ${w}`);
	}
	let i = y().find((e) => n(e));
	i && !n(E) && (r(s(E), { recursive: !0 }), t(i, E), console.log(`Migrated active personality from ${i}`));
}
var M = A(), N = k(), P = new Set(D(w)), F = D(x), I = [], L = [], R = [], z = [];
function B(e, t) {
	return M[e] && M[e] === t ? !0 : (N[e] ?? []).includes(t);
}
for (let e of F) {
	let n = c(w, e), r = O(c(x, e));
	if (!P.has(e)) {
		if (e in M && !C) {
			z.push(e);
			continue;
		}
		t(c(x, e), n), M[e] = r, I.push(e);
		continue;
	}
	let i = O(n);
	if (i === r) {
		M[e] = r;
		continue;
	}
	if (C || B(e, i)) {
		t(c(x, e), n), M[e] = r, L.push(e);
		continue;
	}
	R.push(e), e in M || (M[e] = "");
}
j(M);
var V = (e) => e.replace(/\.json$/, "");
I.length > 0 && console.log(`Added ${I.length} personality file(s): ${I.map(V).join(", ")}`), L.length > 0 && console.log(`Updated ${L.length} unmodified personality file(s): ${L.map(V).join(", ")}`), I.length === 0 && L.length === 0 && console.log(`Personalities up to date in ${w}`), R.length > 0 && console.log(`Kept your edited version of: ${R.map(V).join(", ")}. A newer bundled version exists; overwrite with --force.`), z.length > 0 && console.log(`Left ${z.length} previously removed personality file(s) alone. Re-add them with: node dist/install.mjs --force`);
//#endregion
