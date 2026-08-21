#!/usr/bin/env node
import { access as e, mkdir as t, readFile as n, readdir as r, writeFile as i } from "node:fs/promises";
import { join as a } from "node:path";
//#region node_modules/zod/v4/core/core.js
var o;
function s(e, t, n) {
	function r(n, r) {
		if (n._zod || Object.defineProperty(n, "_zod", {
			value: {
				def: r,
				constr: o,
				traits: /* @__PURE__ */ new Set()
			},
			enumerable: !1
		}), n._zod.traits.has(e)) return;
		n._zod.traits.add(e), t(n, r);
		let i = o.prototype, a = Object.keys(i);
		for (let e = 0; e < a.length; e++) {
			let t = a[e];
			t in n || (n[t] = i[t].bind(n));
		}
	}
	let i = n?.Parent ?? Object;
	class a extends i {}
	Object.defineProperty(a, "name", { value: e });
	function o(e) {
		var t;
		let i = n?.Parent ? new a() : this;
		r(i, e), (t = i._zod).deferred ?? (t.deferred = []);
		for (let e of i._zod.deferred) e();
		return i;
	}
	return Object.defineProperty(o, "init", { value: r }), Object.defineProperty(o, Symbol.hasInstance, { value: (t) => n?.Parent && t instanceof n.Parent ? !0 : t?._zod?.traits?.has(e) }), Object.defineProperty(o, "name", { value: e }), o;
}
var c = class extends Error {
	constructor() {
		super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
	}
}, l = class extends Error {
	constructor(e) {
		super(`Encountered unidirectional transform during encode: ${e}`), this.name = "ZodEncodeError";
	}
};
(o = globalThis).__zod_globalConfig ?? (o.__zod_globalConfig = {});
var u = globalThis.__zod_globalConfig;
function d(e) {
	return e && Object.assign(u, e), u;
}
//#endregion
//#region node_modules/zod/v4/core/util.js
function f(e) {
	let t = Object.values(e).filter((e) => typeof e == "number");
	return Object.entries(e).filter(([e, n]) => t.indexOf(+e) === -1).map(([e, t]) => t);
}
function p(e, t) {
	return typeof t == "bigint" ? t.toString() : t;
}
function m(e) {
	return { get value() {
		{
			let t = e();
			return Object.defineProperty(this, "value", { value: t }), t;
		}
	} };
}
function ee(e) {
	return e == null;
}
function te(e) {
	let t = +!!e.startsWith("^"), n = e.endsWith("$") ? e.length - 1 : e.length;
	return e.slice(t, n);
}
function ne(e, t) {
	let n = e / t, r = Math.round(n), i = 2 ** -52 * Math.max(Math.abs(n), 1);
	return Math.abs(n - r) < i ? 0 : n - r;
}
var re = /* @__PURE__*/ Symbol("evaluating");
function h(e, t, n) {
	let r;
	Object.defineProperty(e, t, {
		get() {
			if (r !== re) return r === void 0 && (r = re, r = n()), r;
		},
		set(n) {
			Object.defineProperty(e, t, { value: n });
		},
		configurable: !0
	});
}
function g(e, t, n) {
	Object.defineProperty(e, t, {
		value: n,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
function _(...e) {
	let t = {};
	for (let n of e) {
		let e = Object.getOwnPropertyDescriptors(n);
		Object.assign(t, e);
	}
	return Object.defineProperties({}, t);
}
function ie(e) {
	return JSON.stringify(e);
}
function ae(e) {
	return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var oe = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {};
function v(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
var se = /* @__PURE__*/ m(() => {
	if (u.jitless || typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return !1;
	try {
		return Function(""), !0;
	} catch {
		return !1;
	}
});
function y(e) {
	if (v(e) === !1) return !1;
	let t = e.constructor;
	if (t === void 0 || typeof t != "function") return !0;
	let n = t.prototype;
	return v(n) !== !1 && Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") !== !1;
}
function ce(e) {
	return y(e) ? { ...e } : Array.isArray(e) ? [...e] : e instanceof Map ? new Map(e) : e instanceof Set ? new Set(e) : e;
}
var le = /* @__PURE__*/ new Set([
	"string",
	"number",
	"symbol"
]);
function b(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function x(e, t, n) {
	let r = new e._zod.constr(t ?? e._zod.def);
	return (!t || n?.parent) && (r._zod.parent = e), r;
}
function S(e) {
	let t = e;
	if (!t) return {};
	if (typeof t == "string") return { error: () => t };
	if (t?.message !== void 0) {
		if (t?.error !== void 0) throw Error("Cannot specify both `message` and `error` params");
		t.error = t.message;
	}
	return delete t.message, typeof t.error == "string" ? {
		...t,
		error: () => t.error
	} : t;
}
function ue(e) {
	return Object.keys(e).filter((t) => e[t]._zod.optin === "optional" && e[t]._zod.optout === "optional");
}
var de = {
	safeint: [-(2 ** 53 - 1), 2 ** 53 - 1],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function fe(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".pick() cannot be used on object schemas containing refinements");
	return x(e, _(e._zod.def, {
		get shape() {
			let e = {};
			for (let r in t) {
				if (!(r in n.shape)) throw Error(`Unrecognized key: "${r}"`);
				t[r] && (e[r] = n.shape[r]);
			}
			return g(this, "shape", e), e;
		},
		checks: []
	}));
}
function pe(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".omit() cannot be used on object schemas containing refinements");
	return x(e, _(e._zod.def, {
		get shape() {
			let r = { ...e._zod.def.shape };
			for (let e in t) {
				if (!(e in n.shape)) throw Error(`Unrecognized key: "${e}"`);
				t[e] && delete r[e];
			}
			return g(this, "shape", r), r;
		},
		checks: []
	}));
}
function me(e, t) {
	if (!y(t)) throw Error("Invalid input to extend: expected a plain object");
	let n = e._zod.def.checks;
	if (n && n.length > 0) {
		let n = e._zod.def.shape;
		for (let e in t) if (Object.getOwnPropertyDescriptor(n, e) !== void 0) throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return x(e, _(e._zod.def, { get shape() {
		let n = {
			...e._zod.def.shape,
			...t
		};
		return g(this, "shape", n), n;
	} }));
}
function he(e, t) {
	if (!y(t)) throw Error("Invalid input to safeExtend: expected a plain object");
	return x(e, _(e._zod.def, { get shape() {
		let n = {
			...e._zod.def.shape,
			...t
		};
		return g(this, "shape", n), n;
	} }));
}
function ge(e, t) {
	if (e._zod.def.checks?.length) throw Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	return x(e, _(e._zod.def, {
		get shape() {
			let n = {
				...e._zod.def.shape,
				...t._zod.def.shape
			};
			return g(this, "shape", n), n;
		},
		get catchall() {
			return t._zod.def.catchall;
		},
		checks: t._zod.def.checks ?? []
	}));
}
function _e(e, t, n) {
	let r = t._zod.def.checks;
	if (r && r.length > 0) throw Error(".partial() cannot be used on object schemas containing refinements");
	return x(t, _(t._zod.def, {
		get shape() {
			let r = t._zod.def.shape, i = { ...r };
			if (n) for (let t in n) {
				if (!(t in r)) throw Error(`Unrecognized key: "${t}"`);
				n[t] && (i[t] = e ? new e({
					type: "optional",
					innerType: r[t]
				}) : r[t]);
			}
			else for (let t in r) i[t] = e ? new e({
				type: "optional",
				innerType: r[t]
			}) : r[t];
			return g(this, "shape", i), i;
		},
		checks: []
	}));
}
function ve(e, t, n) {
	return x(t, _(t._zod.def, { get shape() {
		let r = t._zod.def.shape, i = { ...r };
		if (n) for (let t in n) {
			if (!(t in i)) throw Error(`Unrecognized key: "${t}"`);
			n[t] && (i[t] = new e({
				type: "nonoptional",
				innerType: r[t]
			}));
		}
		else for (let t in r) i[t] = new e({
			type: "nonoptional",
			innerType: r[t]
		});
		return g(this, "shape", i), i;
	} }));
}
function C(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue !== !0) return !0;
	return !1;
}
function ye(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue === !1) return !0;
	return !1;
}
function be(e, t) {
	return t.map((t) => {
		var n;
		return (n = t).path ?? (n.path = []), t.path.unshift(e), t;
	});
}
function w(e) {
	return typeof e == "string" ? e : e?.message;
}
function T(e, t, n) {
	let r = e.message ? e.message : w(e.inst?._zod.def?.error?.(e)) ?? w(t?.error?.(e)) ?? w(n.customError?.(e)) ?? w(n.localeError?.(e)) ?? "Invalid input", { inst: i, continue: a, input: o, ...s } = e;
	return s.path ??= [], s.message = r, t?.reportInput && (s.input = o), s;
}
function xe(e) {
	return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function E(...e) {
	let [t, n, r] = e;
	return typeof t == "string" ? {
		message: t,
		code: "custom",
		input: n,
		inst: r
	} : { ...t };
}
//#endregion
//#region node_modules/zod/v4/core/errors.js
var Se = (e, t) => {
	e.name = "$ZodError", Object.defineProperty(e, "_zod", {
		value: e._zod,
		enumerable: !1
	}), Object.defineProperty(e, "issues", {
		value: t,
		enumerable: !1
	}), e.message = JSON.stringify(t, p, 2), Object.defineProperty(e, "toString", {
		value: () => e.message,
		enumerable: !1
	});
}, Ce = s("$ZodError", Se), we = s("$ZodError", Se, { Parent: Error });
function Te(e, t = (e) => e.message) {
	let n = {}, r = [];
	for (let i of e.issues) i.path.length > 0 ? (n[i.path[0]] = n[i.path[0]] || [], n[i.path[0]].push(t(i))) : r.push(t(i));
	return {
		formErrors: r,
		fieldErrors: n
	};
}
function Ee(e, t = (e) => e.message) {
	let n = { _errors: [] }, r = (e, i = []) => {
		for (let a of e.issues) if (a.code === "invalid_union" && a.errors.length) a.errors.map((e) => r({ issues: e }, [...i, ...a.path]));
		else if (a.code === "invalid_key") r({ issues: a.issues }, [...i, ...a.path]);
		else if (a.code === "invalid_element") r({ issues: a.issues }, [...i, ...a.path]);
		else {
			let e = [...i, ...a.path];
			if (e.length === 0) n._errors.push(t(a));
			else {
				let r = n, i = 0;
				for (; i < e.length;) {
					let n = e[i];
					i === e.length - 1 ? (r[n] = r[n] || { _errors: [] }, r[n]._errors.push(t(a))) : r[n] = r[n] || { _errors: [] }, r = r[n], i++;
				}
			}
		}
	};
	return r(e), n;
}
//#endregion
//#region node_modules/zod/v4/core/parse.js
var De = (e) => (t, n, r, i) => {
	let a = r ? {
		...r,
		async: !1
	} : { async: !1 }, o = t._zod.run({
		value: n,
		issues: []
	}, a);
	if (o instanceof Promise) throw new c();
	if (o.issues.length) {
		let t = new ((i?.Err) ?? e)(o.issues.map((e) => T(e, a, d())));
		throw oe(t, i?.callee), t;
	}
	return o.value;
}, Oe = (e) => async (t, n, r, i) => {
	let a = r ? {
		...r,
		async: !0
	} : { async: !0 }, o = t._zod.run({
		value: n,
		issues: []
	}, a);
	if (o instanceof Promise && (o = await o), o.issues.length) {
		let t = new ((i?.Err) ?? e)(o.issues.map((e) => T(e, a, d())));
		throw oe(t, i?.callee), t;
	}
	return o.value;
}, D = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		async: !1
	} : { async: !1 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	if (a instanceof Promise) throw new c();
	return a.issues.length ? {
		success: !1,
		error: new (e ?? Ce)(a.issues.map((e) => T(e, i, d())))
	} : {
		success: !0,
		data: a.value
	};
}, ke = /* @__PURE__*/ D(we), O = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		async: !0
	} : { async: !0 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	return a instanceof Promise && (a = await a), a.issues.length ? {
		success: !1,
		error: new e(a.issues.map((e) => T(e, i, d())))
	} : {
		success: !0,
		data: a.value
	};
}, Ae = /* @__PURE__*/ O(we), je = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return De(e)(t, n, i);
}, Me = (e) => (t, n, r) => De(e)(t, n, r), Ne = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return Oe(e)(t, n, i);
}, Pe = (e) => async (t, n, r) => Oe(e)(t, n, r), Fe = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return D(e)(t, n, i);
}, Ie = (e) => (t, n, r) => D(e)(t, n, r), Le = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return O(e)(t, n, i);
}, Re = (e) => async (t, n, r) => O(e)(t, n, r), ze = /^[cC][0-9a-z]{6,}$/, Be = /^[0-9a-z]+$/, Ve = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, He = /^[0-9a-vA-V]{20}$/, Ue = /^[A-Za-z0-9]{27}$/, We = /^[a-zA-Z0-9_-]{21}$/, Ge = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, Ke = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, qe = (e) => e ? RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, Je = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, Ye = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function Xe() {
	return new RegExp(Ye, "u");
}
var Ze = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Qe = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, $e = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, et = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, tt = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, nt = /^[A-Za-z0-9_-]*$/, rt = /^https?$/, it = /^\+[1-9]\d{6,14}$/, at = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", ot = /*@__PURE__*/ RegExp(`^${at}$`);
function st(e) {
	let t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
	return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function ct(e) {
	return RegExp(`^${st(e)}$`);
}
function lt(e) {
	let t = st({ precision: e.precision }), n = ["Z"];
	e.local && n.push(""), e.offset && n.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
	let r = `${t}(?:${n.join("|")})`;
	return RegExp(`^${at}T(?:${r})$`);
}
var ut = (e) => {
	let t = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ""}}` : "[\\s\\S]*";
	return RegExp(`^${t}$`);
}, dt = /^-?\d+$/, ft = /^-?\d+(?:\.\d+)?$/, pt = /^(?:true|false)$/i, mt = /^[^A-Z]*$/, ht = /^[^a-z]*$/, k = /*@__PURE__*/ s("$ZodCheck", (e, t) => {
	var n;
	e._zod ??= {}, e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
}), gt = {
	number: "number",
	bigint: "bigint",
	object: "date"
}, _t = /*@__PURE__*/ s("$ZodCheckLessThan", (e, t) => {
	k.init(e, t);
	let n = gt[typeof t.value];
	e._zod.onattach.push((e) => {
		let n = e._zod.bag, r = (t.inclusive ? n.maximum : n.exclusiveMaximum) ?? Infinity;
		t.value < r && (t.inclusive ? n.maximum = t.value : n.exclusiveMaximum = t.value);
	}), e._zod.check = (r) => {
		(t.inclusive ? r.value <= t.value : r.value < t.value) || r.issues.push({
			origin: n,
			code: "too_big",
			maximum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), vt = /*@__PURE__*/ s("$ZodCheckGreaterThan", (e, t) => {
	k.init(e, t);
	let n = gt[typeof t.value];
	e._zod.onattach.push((e) => {
		let n = e._zod.bag, r = (t.inclusive ? n.minimum : n.exclusiveMinimum) ?? -Infinity;
		t.value > r && (t.inclusive ? n.minimum = t.value : n.exclusiveMinimum = t.value);
	}), e._zod.check = (r) => {
		(t.inclusive ? r.value >= t.value : r.value > t.value) || r.issues.push({
			origin: n,
			code: "too_small",
			minimum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), yt = /*@__PURE__*/ s("$ZodCheckMultipleOf", (e, t) => {
	k.init(e, t), e._zod.onattach.push((e) => {
		var n;
		(n = e._zod.bag).multipleOf ?? (n.multipleOf = t.value);
	}), e._zod.check = (n) => {
		if (typeof n.value != typeof t.value) throw Error("Cannot mix number and bigint in multiple_of check.");
		(typeof n.value == "bigint" ? n.value % t.value === BigInt(0) : ne(n.value, t.value) === 0) || n.issues.push({
			origin: typeof n.value,
			code: "not_multiple_of",
			divisor: t.value,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), bt = /*@__PURE__*/ s("$ZodCheckNumberFormat", (e, t) => {
	k.init(e, t), t.format = t.format || "float64";
	let n = t.format?.includes("int"), r = n ? "int" : "number", [i, a] = de[t.format];
	e._zod.onattach.push((e) => {
		let r = e._zod.bag;
		r.format = t.format, r.minimum = i, r.maximum = a, n && (r.pattern = dt);
	}), e._zod.check = (o) => {
		let s = o.value;
		if (n) {
			if (!Number.isInteger(s)) {
				o.issues.push({
					expected: r,
					format: t.format,
					code: "invalid_type",
					continue: !1,
					input: s,
					inst: e
				});
				return;
			}
			if (!Number.isSafeInteger(s)) {
				s > 0 ? o.issues.push({
					input: s,
					code: "too_big",
					maximum: 2 ** 53 - 1,
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				}) : o.issues.push({
					input: s,
					code: "too_small",
					minimum: -(2 ** 53 - 1),
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				});
				return;
			}
		}
		s < i && o.issues.push({
			origin: "number",
			input: s,
			code: "too_small",
			minimum: i,
			inclusive: !0,
			inst: e,
			continue: !t.abort
		}), s > a && o.issues.push({
			origin: "number",
			input: s,
			code: "too_big",
			maximum: a,
			inclusive: !0,
			inst: e,
			continue: !t.abort
		});
	};
}), xt = /*@__PURE__*/ s("$ZodCheckMaxLength", (e, t) => {
	var n;
	k.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !ee(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag.maximum ?? Infinity;
		t.maximum < n && (e._zod.bag.maximum = t.maximum);
	}), e._zod.check = (n) => {
		let r = n.value;
		if (r.length <= t.maximum) return;
		let i = xe(r);
		n.issues.push({
			origin: i,
			code: "too_big",
			maximum: t.maximum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), St = /*@__PURE__*/ s("$ZodCheckMinLength", (e, t) => {
	var n;
	k.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !ee(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag.minimum ?? -Infinity;
		t.minimum > n && (e._zod.bag.minimum = t.minimum);
	}), e._zod.check = (n) => {
		let r = n.value;
		if (r.length >= t.minimum) return;
		let i = xe(r);
		n.issues.push({
			origin: i,
			code: "too_small",
			minimum: t.minimum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), Ct = /*@__PURE__*/ s("$ZodCheckLengthEquals", (e, t) => {
	var n;
	k.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !ee(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag;
		n.minimum = t.length, n.maximum = t.length, n.length = t.length;
	}), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if (i === t.length) return;
		let a = xe(r), o = i > t.length;
		n.issues.push({
			origin: a,
			...o ? {
				code: "too_big",
				maximum: t.length
			} : {
				code: "too_small",
				minimum: t.length
			},
			inclusive: !0,
			exact: !0,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), A = /*@__PURE__*/ s("$ZodCheckStringFormat", (e, t) => {
	var n, r;
	k.init(e, t), e._zod.onattach.push((e) => {
		let n = e._zod.bag;
		n.format = t.format, t.pattern && (n.patterns ??= /* @__PURE__ */ new Set(), n.patterns.add(t.pattern));
	}), t.pattern ? (n = e._zod).check ?? (n.check = (n) => {
		t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: t.format,
			input: n.value,
			...t.pattern ? { pattern: t.pattern.toString() } : {},
			inst: e,
			continue: !t.abort
		});
	}) : (r = e._zod).check ?? (r.check = () => {});
}), wt = /*@__PURE__*/ s("$ZodCheckRegex", (e, t) => {
	A.init(e, t), e._zod.check = (n) => {
		t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: n.value,
			pattern: t.pattern.toString(),
			inst: e,
			continue: !t.abort
		});
	};
}), Tt = /*@__PURE__*/ s("$ZodCheckLowerCase", (e, t) => {
	t.pattern ??= mt, A.init(e, t);
}), Et = /*@__PURE__*/ s("$ZodCheckUpperCase", (e, t) => {
	t.pattern ??= ht, A.init(e, t);
}), Dt = /*@__PURE__*/ s("$ZodCheckIncludes", (e, t) => {
	k.init(e, t);
	let n = b(t.includes), r = new RegExp(typeof t.position == "number" ? `^.{${t.position}}${n}` : n);
	t.pattern = r, e._zod.onattach.push((e) => {
		let t = e._zod.bag;
		t.patterns ??= /* @__PURE__ */ new Set(), t.patterns.add(r);
	}), e._zod.check = (n) => {
		n.value.includes(t.includes, t.position) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: t.includes,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Ot = /*@__PURE__*/ s("$ZodCheckStartsWith", (e, t) => {
	k.init(e, t);
	let n = RegExp(`^${b(t.prefix)}.*`);
	t.pattern ??= n, e._zod.onattach.push((e) => {
		let t = e._zod.bag;
		t.patterns ??= /* @__PURE__ */ new Set(), t.patterns.add(n);
	}), e._zod.check = (n) => {
		n.value.startsWith(t.prefix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: t.prefix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), kt = /*@__PURE__*/ s("$ZodCheckEndsWith", (e, t) => {
	k.init(e, t);
	let n = RegExp(`.*${b(t.suffix)}$`);
	t.pattern ??= n, e._zod.onattach.push((e) => {
		let t = e._zod.bag;
		t.patterns ??= /* @__PURE__ */ new Set(), t.patterns.add(n);
	}), e._zod.check = (n) => {
		n.value.endsWith(t.suffix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: t.suffix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), At = /*@__PURE__*/ s("$ZodCheckOverwrite", (e, t) => {
	k.init(e, t), e._zod.check = (e) => {
		e.value = t.tx(e.value);
	};
}), jt = class {
	constructor(e = []) {
		this.content = [], this.indent = 0, this && (this.args = e);
	}
	indented(e) {
		this.indent += 1, e(this), --this.indent;
	}
	write(e) {
		if (typeof e == "function") {
			e(this, { execution: "sync" }), e(this, { execution: "async" });
			return;
		}
		let t = e.split("\n").filter((e) => e), n = Math.min(...t.map((e) => e.length - e.trimStart().length)), r = t.map((e) => e.slice(n)).map((e) => " ".repeat(this.indent * 2) + e);
		for (let e of r) this.content.push(e);
	}
	compile() {
		let e = Function, t = this?.args, n = [...(this?.content ?? [""]).map((e) => `  ${e}`)];
		return new e(...t, n.join("\n"));
	}
}, Mt = {
	major: 4,
	minor: 4,
	patch: 3
}, j = /*@__PURE__*/ s("$ZodType", (e, t) => {
	var n;
	e ??= {}, e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = Mt;
	let r = [...e._zod.def.checks ?? []];
	e._zod.traits.has("$ZodCheck") && r.unshift(e);
	for (let t of r) for (let n of t._zod.onattach) n(e);
	if (r.length === 0) (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
		e._zod.run = e._zod.parse;
	});
	else {
		let t = (e, t, n) => {
			let r = C(e), i;
			for (let a of t) {
				if (a._zod.def.when) {
					if (ye(e) || !a._zod.def.when(e)) continue;
				} else if (r) continue;
				let t = e.issues.length, o = a._zod.check(e);
				if (o instanceof Promise && n?.async === !1) throw new c();
				if (i || o instanceof Promise) i = (i ?? Promise.resolve()).then(async () => {
					await o, e.issues.length !== t && (r ||= C(e, t));
				});
				else {
					if (e.issues.length === t) continue;
					r ||= C(e, t);
				}
			}
			return i ? i.then(() => e) : e;
		}, n = (n, i, a) => {
			if (C(n)) return n.aborted = !0, n;
			let o = t(i, r, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new c();
				return o.then((t) => e._zod.parse(t, a));
			}
			return e._zod.parse(o, a);
		};
		e._zod.run = (i, a) => {
			if (a.skipChecks) return e._zod.parse(i, a);
			if (a.direction === "backward") {
				let t = e._zod.parse({
					value: i.value,
					issues: []
				}, {
					...a,
					skipChecks: !0
				});
				return t instanceof Promise ? t.then((e) => n(e, i, a)) : n(t, i, a);
			}
			let o = e._zod.parse(i, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new c();
				return o.then((e) => t(e, r, a));
			}
			return t(o, r, a);
		};
	}
	h(e, "~standard", () => ({
		validate: (t) => {
			try {
				let n = ke(e, t);
				return n.success ? { value: n.data } : { issues: n.error?.issues };
			} catch {
				return Ae(e, t).then((e) => e.success ? { value: e.data } : { issues: e.error?.issues });
			}
		},
		vendor: "zod",
		version: 1
	}));
}), Nt = /*@__PURE__*/ s("$ZodString", (e, t) => {
	j.init(e, t), e._zod.pattern = [...e?._zod.bag?.patterns ?? []].pop() ?? ut(e._zod.bag), e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = String(n.value);
		} catch {}
		return typeof n.value == "string" || n.issues.push({
			expected: "string",
			code: "invalid_type",
			input: n.value,
			inst: e
		}), n;
	};
}), M = /*@__PURE__*/ s("$ZodStringFormat", (e, t) => {
	A.init(e, t), Nt.init(e, t);
}), Pt = /*@__PURE__*/ s("$ZodGUID", (e, t) => {
	t.pattern ??= Ke, M.init(e, t);
}), Ft = /*@__PURE__*/ s("$ZodUUID", (e, t) => {
	if (t.version) {
		let e = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[t.version];
		if (e === void 0) throw Error(`Invalid UUID version: "${t.version}"`);
		t.pattern ??= qe(e);
	} else t.pattern ??= qe();
	M.init(e, t);
}), It = /*@__PURE__*/ s("$ZodEmail", (e, t) => {
	t.pattern ??= Je, M.init(e, t);
}), Lt = /*@__PURE__*/ s("$ZodURL", (e, t) => {
	M.init(e, t), e._zod.check = (n) => {
		try {
			let r = n.value.trim();
			if (!t.normalize && t.protocol?.source === rt.source && !/^https?:\/\//i.test(r)) {
				n.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid URL format",
					input: n.value,
					inst: e,
					continue: !t.abort
				});
				return;
			}
			let i = new URL(r);
			t.hostname && (t.hostname.lastIndex = 0, t.hostname.test(i.hostname) || n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid hostname",
				pattern: t.hostname.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			})), t.protocol && (t.protocol.lastIndex = 0, t.protocol.test(i.protocol.endsWith(":") ? i.protocol.slice(0, -1) : i.protocol) || n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid protocol",
				pattern: t.protocol.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			})), n.value = t.normalize ? i.href : r;
			return;
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "url",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
}), Rt = /*@__PURE__*/ s("$ZodEmoji", (e, t) => {
	t.pattern ??= Xe(), M.init(e, t);
}), zt = /*@__PURE__*/ s("$ZodNanoID", (e, t) => {
	t.pattern ??= We, M.init(e, t);
}), Bt = /*@__PURE__*/ s("$ZodCUID", (e, t) => {
	t.pattern ??= ze, M.init(e, t);
}), Vt = /*@__PURE__*/ s("$ZodCUID2", (e, t) => {
	t.pattern ??= Be, M.init(e, t);
}), Ht = /*@__PURE__*/ s("$ZodULID", (e, t) => {
	t.pattern ??= Ve, M.init(e, t);
}), Ut = /*@__PURE__*/ s("$ZodXID", (e, t) => {
	t.pattern ??= He, M.init(e, t);
}), Wt = /*@__PURE__*/ s("$ZodKSUID", (e, t) => {
	t.pattern ??= Ue, M.init(e, t);
}), Gt = /*@__PURE__*/ s("$ZodISODateTime", (e, t) => {
	t.pattern ??= lt(t), M.init(e, t);
}), Kt = /*@__PURE__*/ s("$ZodISODate", (e, t) => {
	t.pattern ??= ot, M.init(e, t);
}), qt = /*@__PURE__*/ s("$ZodISOTime", (e, t) => {
	t.pattern ??= ct(t), M.init(e, t);
}), Jt = /*@__PURE__*/ s("$ZodISODuration", (e, t) => {
	t.pattern ??= Ge, M.init(e, t);
}), Yt = /*@__PURE__*/ s("$ZodIPv4", (e, t) => {
	t.pattern ??= Ze, M.init(e, t), e._zod.bag.format = "ipv4";
}), Xt = /*@__PURE__*/ s("$ZodIPv6", (e, t) => {
	t.pattern ??= Qe, M.init(e, t), e._zod.bag.format = "ipv6", e._zod.check = (n) => {
		try {
			new URL(`http://[${n.value}]`);
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "ipv6",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
}), Zt = /*@__PURE__*/ s("$ZodCIDRv4", (e, t) => {
	t.pattern ??= $e, M.init(e, t);
}), Qt = /*@__PURE__*/ s("$ZodCIDRv6", (e, t) => {
	t.pattern ??= et, M.init(e, t), e._zod.check = (n) => {
		let r = n.value.split("/");
		try {
			if (r.length !== 2) throw Error();
			let [e, t] = r;
			if (!t) throw Error();
			let n = Number(t);
			if (`${n}` !== t || n < 0 || n > 128) throw Error();
			new URL(`http://[${e}]`);
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "cidrv6",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
});
function $t(e) {
	if (e === "") return !0;
	if (/\s/.test(e) || e.length % 4 != 0) return !1;
	try {
		return atob(e), !0;
	} catch {
		return !1;
	}
}
var en = /*@__PURE__*/ s("$ZodBase64", (e, t) => {
	t.pattern ??= tt, M.init(e, t), e._zod.bag.contentEncoding = "base64", e._zod.check = (n) => {
		$t(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
});
function tn(e) {
	if (!nt.test(e)) return !1;
	let t = e.replace(/[-_]/g, (e) => e === "-" ? "+" : "/");
	return $t(t.padEnd(Math.ceil(t.length / 4) * 4, "="));
}
var nn = /*@__PURE__*/ s("$ZodBase64URL", (e, t) => {
	t.pattern ??= nt, M.init(e, t), e._zod.bag.contentEncoding = "base64url", e._zod.check = (n) => {
		tn(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), rn = /*@__PURE__*/ s("$ZodE164", (e, t) => {
	t.pattern ??= it, M.init(e, t);
});
function an(e, t = null) {
	try {
		let n = e.split(".");
		if (n.length !== 3) return !1;
		let [r] = n;
		if (!r) return !1;
		let i = JSON.parse(atob(r));
		return !("typ" in i && i?.typ !== "JWT" || !i.alg || t && (!("alg" in i) || i.alg !== t));
	} catch {
		return !1;
	}
}
var on = /*@__PURE__*/ s("$ZodJWT", (e, t) => {
	M.init(e, t), e._zod.check = (n) => {
		an(n.value, t.alg) || n.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), sn = /*@__PURE__*/ s("$ZodNumber", (e, t) => {
	j.init(e, t), e._zod.pattern = e._zod.bag.pattern ?? ft, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = Number(n.value);
		} catch {}
		let i = n.value;
		if (typeof i == "number" && !Number.isNaN(i) && Number.isFinite(i)) return n;
		let a = typeof i == "number" ? Number.isNaN(i) ? "NaN" : Number.isFinite(i) ? void 0 : "Infinity" : void 0;
		return n.issues.push({
			expected: "number",
			code: "invalid_type",
			input: i,
			inst: e,
			...a ? { received: a } : {}
		}), n;
	};
}), cn = /*@__PURE__*/ s("$ZodNumberFormat", (e, t) => {
	bt.init(e, t), sn.init(e, t);
}), ln = /*@__PURE__*/ s("$ZodBoolean", (e, t) => {
	j.init(e, t), e._zod.pattern = pt, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = !!n.value;
		} catch {}
		let i = n.value;
		return typeof i == "boolean" || n.issues.push({
			expected: "boolean",
			code: "invalid_type",
			input: i,
			inst: e
		}), n;
	};
}), un = /*@__PURE__*/ s("$ZodUnknown", (e, t) => {
	j.init(e, t), e._zod.parse = (e) => e;
}), dn = /*@__PURE__*/ s("$ZodNever", (e, t) => {
	j.init(e, t), e._zod.parse = (t, n) => (t.issues.push({
		expected: "never",
		code: "invalid_type",
		input: t.value,
		inst: e
	}), t);
});
function fn(e, t, n) {
	e.issues.length && t.issues.push(...be(n, e.issues)), t.value[n] = e.value;
}
var pn = /*@__PURE__*/ s("$ZodArray", (e, t) => {
	j.init(e, t), e._zod.parse = (n, r) => {
		let i = n.value;
		if (!Array.isArray(i)) return n.issues.push({
			expected: "array",
			code: "invalid_type",
			input: i,
			inst: e
		}), n;
		n.value = Array(i.length);
		let a = [];
		for (let e = 0; e < i.length; e++) {
			let o = i[e], s = t.element._zod.run({
				value: o,
				issues: []
			}, r);
			s instanceof Promise ? a.push(s.then((t) => fn(t, n, e))) : fn(s, n, e);
		}
		return a.length ? Promise.all(a).then(() => n) : n;
	};
});
function N(e, t, n, r, i, a) {
	let o = n in r;
	if (e.issues.length) {
		if (i && a && !o) return;
		t.issues.push(...be(n, e.issues));
	}
	if (!o && !i) {
		e.issues.length || t.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [n]
		});
		return;
	}
	e.value === void 0 ? o && (t.value[n] = void 0) : t.value[n] = e.value;
}
function mn(e) {
	let t = Object.keys(e.shape);
	for (let n of t) if (!e.shape?.[n]?._zod?.traits?.has("$ZodType")) throw Error(`Invalid element at key "${n}": expected a Zod schema`);
	let n = ue(e.shape);
	return {
		...e,
		keys: t,
		keySet: new Set(t),
		numKeys: t.length,
		optionalKeys: new Set(n)
	};
}
function hn(e, t, n, r, i, a) {
	let o = [], s = i.keySet, c = i.catchall._zod, l = c.def.type, u = c.optin === "optional", d = c.optout === "optional";
	for (let i in t) {
		if (i === "__proto__" || s.has(i)) continue;
		if (l === "never") {
			o.push(i);
			continue;
		}
		let a = c.run({
			value: t[i],
			issues: []
		}, r);
		a instanceof Promise ? e.push(a.then((e) => N(e, n, i, t, u, d))) : N(a, n, i, t, u, d);
	}
	return o.length && n.issues.push({
		code: "unrecognized_keys",
		keys: o,
		input: t,
		inst: a
	}), e.length ? Promise.all(e).then(() => n) : n;
}
var gn = /*@__PURE__*/ s("$ZodObject", (e, t) => {
	if (j.init(e, t), !Object.getOwnPropertyDescriptor(t, "shape")?.get) {
		let e = t.shape;
		Object.defineProperty(t, "shape", { get: () => {
			let n = { ...e };
			return Object.defineProperty(t, "shape", { value: n }), n;
		} });
	}
	let n = m(() => mn(t));
	h(e._zod, "propValues", () => {
		let e = t.shape, n = {};
		for (let t in e) {
			let r = e[t]._zod;
			if (r.values) {
				n[t] ?? (n[t] = /* @__PURE__ */ new Set());
				for (let e of r.values) n[t].add(e);
			}
		}
		return n;
	});
	let r = v, i = t.catchall, a;
	e._zod.parse = (t, o) => {
		a ??= n.value;
		let s = t.value;
		if (!r(s)) return t.issues.push({
			expected: "object",
			code: "invalid_type",
			input: s,
			inst: e
		}), t;
		t.value = {};
		let c = [], l = a.shape;
		for (let e of a.keys) {
			let n = l[e], r = n._zod.optin === "optional", i = n._zod.optout === "optional", a = n._zod.run({
				value: s[e],
				issues: []
			}, o);
			a instanceof Promise ? c.push(a.then((n) => N(n, t, e, s, r, i))) : N(a, t, e, s, r, i);
		}
		return i ? hn(c, s, t, o, n.value, e) : c.length ? Promise.all(c).then(() => t) : t;
	};
}), _n = /*@__PURE__*/ s("$ZodObjectJIT", (e, t) => {
	gn.init(e, t);
	let n = e._zod.parse, r = m(() => mn(t)), i = (e) => {
		let t = new jt([
			"shape",
			"payload",
			"ctx"
		]), n = r.value, i = (e) => {
			let t = ie(e);
			return `shape[${t}]._zod.run({ value: input[${t}], issues: [] }, ctx)`;
		};
		t.write("const input = payload.value;");
		let a = Object.create(null), o = 0;
		for (let e of n.keys) a[e] = `key_${o++}`;
		t.write("const newResult = {};");
		for (let r of n.keys) {
			let n = a[r], o = ie(r), s = e[r], c = s?._zod?.optin === "optional", l = s?._zod?.optout === "optional";
			t.write(`const ${n} = ${i(r)};`), c && l ? t.write(`
        if (${n}.issues.length) {
          if (${o} in input) {
            payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${o}, ...iss.path] : [${o}]
            })));
          }
        }

        if (${n}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${n}.value;
        }

      `) : c ? t.write(`
        if (${n}.issues.length) {
          payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${o}, ...iss.path] : [${o}]
          })));
        }

        if (${n}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${n}.value;
        }

      `) : t.write(`
        const ${n}_present = ${o} in input;
        if (${n}.issues.length) {
          payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${o}, ...iss.path] : [${o}]
          })));
        }
        if (!${n}_present && !${n}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${o}]
          });
        }

        if (${n}_present) {
          if (${n}.value === undefined) {
            newResult[${o}] = undefined;
          } else {
            newResult[${o}] = ${n}.value;
          }
        }

      `);
		}
		t.write("payload.value = newResult;"), t.write("return payload;");
		let s = t.compile();
		return (t, n) => s(e, t, n);
	}, a, o = v, s = !u.jitless, c = s && se.value, l = t.catchall, d;
	e._zod.parse = (u, f) => {
		d ??= r.value;
		let p = u.value;
		return o(p) ? s && c && f?.async === !1 && f.jitless !== !0 ? (a ||= i(t.shape), u = a(u, f), l ? hn([], p, u, f, d, e) : u) : n(u, f) : (u.issues.push({
			expected: "object",
			code: "invalid_type",
			input: p,
			inst: e
		}), u);
	};
});
function vn(e, t, n, r) {
	for (let n of e) if (n.issues.length === 0) return t.value = n.value, t;
	let i = e.filter((e) => !C(e));
	return i.length === 1 ? (t.value = i[0].value, i[0]) : (t.issues.push({
		code: "invalid_union",
		input: t.value,
		inst: n,
		errors: e.map((e) => e.issues.map((e) => T(e, r, d())))
	}), t);
}
var yn = /*@__PURE__*/ s("$ZodUnion", (e, t) => {
	j.init(e, t), h(e._zod, "optin", () => t.options.some((e) => e._zod.optin === "optional") ? "optional" : void 0), h(e._zod, "optout", () => t.options.some((e) => e._zod.optout === "optional") ? "optional" : void 0), h(e._zod, "values", () => {
		if (t.options.every((e) => e._zod.values)) return new Set(t.options.flatMap((e) => Array.from(e._zod.values)));
	}), h(e._zod, "pattern", () => {
		if (t.options.every((e) => e._zod.pattern)) {
			let e = t.options.map((e) => e._zod.pattern);
			return RegExp(`^(${e.map((e) => te(e.source)).join("|")})$`);
		}
	});
	let n = t.options.length === 1 ? t.options[0]._zod.run : null;
	e._zod.parse = (r, i) => {
		if (n) return n(r, i);
		let a = !1, o = [];
		for (let e of t.options) {
			let t = e._zod.run({
				value: r.value,
				issues: []
			}, i);
			if (t instanceof Promise) o.push(t), a = !0;
			else {
				if (t.issues.length === 0) return t;
				o.push(t);
			}
		}
		return a ? Promise.all(o).then((t) => vn(t, r, e, i)) : vn(o, r, e, i);
	};
}), bn = /*@__PURE__*/ s("$ZodIntersection", (e, t) => {
	j.init(e, t), e._zod.parse = (e, n) => {
		let r = e.value, i = t.left._zod.run({
			value: r,
			issues: []
		}, n), a = t.right._zod.run({
			value: r,
			issues: []
		}, n);
		return i instanceof Promise || a instanceof Promise ? Promise.all([i, a]).then(([t, n]) => xn(e, t, n)) : xn(e, i, a);
	};
});
function P(e, t) {
	if (e === t || e instanceof Date && t instanceof Date && +e == +t) return {
		valid: !0,
		data: e
	};
	if (y(e) && y(t)) {
		let n = Object.keys(t), r = Object.keys(e).filter((e) => n.indexOf(e) !== -1), i = {
			...e,
			...t
		};
		for (let n of r) {
			let r = P(e[n], t[n]);
			if (!r.valid) return {
				valid: !1,
				mergeErrorPath: [n, ...r.mergeErrorPath]
			};
			i[n] = r.data;
		}
		return {
			valid: !0,
			data: i
		};
	}
	if (Array.isArray(e) && Array.isArray(t)) {
		if (e.length !== t.length) return {
			valid: !1,
			mergeErrorPath: []
		};
		let n = [];
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = t[r], o = P(i, a);
			if (!o.valid) return {
				valid: !1,
				mergeErrorPath: [r, ...o.mergeErrorPath]
			};
			n.push(o.data);
		}
		return {
			valid: !0,
			data: n
		};
	}
	return {
		valid: !1,
		mergeErrorPath: []
	};
}
function xn(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i;
	for (let n of t.issues) if (n.code === "unrecognized_keys") {
		i ??= n;
		for (let e of n.keys) r.has(e) || r.set(e, {}), r.get(e).l = !0;
	} else e.issues.push(n);
	for (let t of n.issues) if (t.code === "unrecognized_keys") for (let e of t.keys) r.has(e) || r.set(e, {}), r.get(e).r = !0;
	else e.issues.push(t);
	let a = [...r].filter(([, e]) => e.l && e.r).map(([e]) => e);
	if (a.length && i && e.issues.push({
		...i,
		keys: a
	}), C(e)) return e;
	let o = P(t.value, n.value);
	if (!o.valid) throw Error(`Unmergable intersection. Error path: ${JSON.stringify(o.mergeErrorPath)}`);
	return e.value = o.data, e;
}
var Sn = /*@__PURE__*/ s("$ZodEnum", (e, t) => {
	j.init(e, t);
	let n = f(t.entries), r = new Set(n);
	e._zod.values = r, e._zod.pattern = RegExp(`^(${n.filter((e) => le.has(typeof e)).map((e) => typeof e == "string" ? b(e) : e.toString()).join("|")})$`), e._zod.parse = (t, i) => {
		let a = t.value;
		return r.has(a) || t.issues.push({
			code: "invalid_value",
			values: n,
			input: a,
			inst: e
		}), t;
	};
}), Cn = /*@__PURE__*/ s("$ZodTransform", (e, t) => {
	j.init(e, t), e._zod.optin = "optional", e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new l(e.constructor.name);
		let i = t.transform(n.value, n);
		if (r.async) return (i instanceof Promise ? i : Promise.resolve(i)).then((e) => (n.value = e, n.fallback = !0, n));
		if (i instanceof Promise) throw new c();
		return n.value = i, n.fallback = !0, n;
	};
});
function wn(e, t) {
	return t === void 0 && (e.issues.length || e.fallback) ? {
		issues: [],
		value: void 0
	} : e;
}
var Tn = /*@__PURE__*/ s("$ZodOptional", (e, t) => {
	j.init(e, t), e._zod.optin = "optional", e._zod.optout = "optional", h(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, void 0]) : void 0), h(e._zod, "pattern", () => {
		let e = t.innerType._zod.pattern;
		return e ? RegExp(`^(${te(e.source)})?$`) : void 0;
	}), e._zod.parse = (e, n) => {
		if (t.innerType._zod.optin === "optional") {
			let r = e.value, i = t.innerType._zod.run(e, n);
			return i instanceof Promise ? i.then((e) => wn(e, r)) : wn(i, r);
		}
		return e.value === void 0 ? e : t.innerType._zod.run(e, n);
	};
}), En = /*@__PURE__*/ s("$ZodExactOptional", (e, t) => {
	Tn.init(e, t), h(e._zod, "values", () => t.innerType._zod.values), h(e._zod, "pattern", () => t.innerType._zod.pattern), e._zod.parse = (e, n) => t.innerType._zod.run(e, n);
}), Dn = /*@__PURE__*/ s("$ZodNullable", (e, t) => {
	j.init(e, t), h(e._zod, "optin", () => t.innerType._zod.optin), h(e._zod, "optout", () => t.innerType._zod.optout), h(e._zod, "pattern", () => {
		let e = t.innerType._zod.pattern;
		return e ? RegExp(`^(${te(e.source)}|null)$`) : void 0;
	}), h(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, null]) : void 0), e._zod.parse = (e, n) => e.value === null ? e : t.innerType._zod.run(e, n);
}), On = /*@__PURE__*/ s("$ZodDefault", (e, t) => {
	j.init(e, t), e._zod.optin = "optional", h(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		if (e.value === void 0) return e.value = t.defaultValue, e;
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => kn(e, t)) : kn(r, t);
	};
});
function kn(e, t) {
	return e.value === void 0 && (e.value = t.defaultValue), e;
}
var An = /*@__PURE__*/ s("$ZodPrefault", (e, t) => {
	j.init(e, t), e._zod.optin = "optional", h(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => (n.direction === "backward" || e.value === void 0 && (e.value = t.defaultValue), t.innerType._zod.run(e, n));
}), jn = /*@__PURE__*/ s("$ZodNonOptional", (e, t) => {
	j.init(e, t), h(e._zod, "values", () => {
		let e = t.innerType._zod.values;
		return e ? new Set([...e].filter((e) => e !== void 0)) : void 0;
	}), e._zod.parse = (n, r) => {
		let i = t.innerType._zod.run(n, r);
		return i instanceof Promise ? i.then((t) => Mn(t, e)) : Mn(i, e);
	};
});
function Mn(e, t) {
	return !e.issues.length && e.value === void 0 && e.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: e.value,
		inst: t
	}), e;
}
var Nn = /*@__PURE__*/ s("$ZodCatch", (e, t) => {
	j.init(e, t), e._zod.optin = "optional", h(e._zod, "optout", () => t.innerType._zod.optout), h(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((r) => (e.value = r.value, r.issues.length && (e.value = t.catchValue({
			...e,
			error: { issues: r.issues.map((e) => T(e, n, d())) },
			input: e.value
		}), e.issues = [], e.fallback = !0), e)) : (e.value = r.value, r.issues.length && (e.value = t.catchValue({
			...e,
			error: { issues: r.issues.map((e) => T(e, n, d())) },
			input: e.value
		}), e.issues = [], e.fallback = !0), e);
	};
}), Pn = /*@__PURE__*/ s("$ZodPipe", (e, t) => {
	j.init(e, t), h(e._zod, "values", () => t.in._zod.values), h(e._zod, "optin", () => t.in._zod.optin), h(e._zod, "optout", () => t.out._zod.optout), h(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (e, n) => {
		if (n.direction === "backward") {
			let r = t.out._zod.run(e, n);
			return r instanceof Promise ? r.then((e) => F(e, t.in, n)) : F(r, t.in, n);
		}
		let r = t.in._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => F(e, t.out, n)) : F(r, t.out, n);
	};
});
function F(e, t, n) {
	return e.issues.length ? (e.aborted = !0, e) : t._zod.run({
		value: e.value,
		issues: e.issues,
		fallback: e.fallback
	}, n);
}
var Fn = /*@__PURE__*/ s("$ZodReadonly", (e, t) => {
	j.init(e, t), h(e._zod, "propValues", () => t.innerType._zod.propValues), h(e._zod, "values", () => t.innerType._zod.values), h(e._zod, "optin", () => t.innerType?._zod?.optin), h(e._zod, "optout", () => t.innerType?._zod?.optout), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then(In) : In(r);
	};
});
function In(e) {
	return e.value = Object.freeze(e.value), e;
}
var Ln = /*@__PURE__*/ s("$ZodCustom", (e, t) => {
	k.init(e, t), j.init(e, t), e._zod.parse = (e, t) => e, e._zod.check = (n) => {
		let r = n.value, i = t.fn(r);
		if (i instanceof Promise) return i.then((t) => Rn(t, n, r, e));
		Rn(i, n, r, e);
	};
});
function Rn(e, t, n, r) {
	if (!e) {
		let e = {
			code: "custom",
			input: n,
			inst: r,
			path: [...r._zod.def.path ?? []],
			continue: !r._zod.def.abort
		};
		r._zod.def.params && (e.params = r._zod.def.params), t.issues.push(E(e));
	}
}
//#endregion
//#region node_modules/zod/v4/core/registries.js
var zn, Bn = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
	}
	add(e, ...t) {
		let n = t[0];
		return this._map.set(e, n), n && typeof n == "object" && "id" in n && this._idmap.set(n.id, e), this;
	}
	clear() {
		return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
	}
	remove(e) {
		let t = this._map.get(e);
		return t && typeof t == "object" && "id" in t && this._idmap.delete(t.id), this._map.delete(e), this;
	}
	get(e) {
		let t = e._zod.parent;
		if (t) {
			let n = { ...this.get(t) ?? {} };
			delete n.id;
			let r = {
				...n,
				...this._map.get(e)
			};
			return Object.keys(r).length ? r : void 0;
		}
		return this._map.get(e);
	}
	has(e) {
		return this._map.has(e);
	}
};
function Vn() {
	return new Bn();
}
(zn = globalThis).__zod_globalRegistry ?? (zn.__zod_globalRegistry = Vn());
var I = globalThis.__zod_globalRegistry;
//#endregion
//#region node_modules/zod/v4/core/api.js
// @__NO_SIDE_EFFECTS__
function Hn(e, t) {
	return new e({
		type: "string",
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Un(e, t) {
	return new e({
		type: "string",
		format: "email",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Wn(e, t) {
	return new e({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Gn(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Kn(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v4",
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function qn(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v6",
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Jn(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v7",
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Yn(e, t) {
	return new e({
		type: "string",
		format: "url",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Xn(e, t) {
	return new e({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Zn(e, t) {
	return new e({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Qn(e, t) {
	return new e({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function $n(e, t) {
	return new e({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function er(e, t) {
	return new e({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function tr(e, t) {
	return new e({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function nr(e, t) {
	return new e({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function rr(e, t) {
	return new e({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ir(e, t) {
	return new e({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ar(e, t) {
	return new e({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function or(e, t) {
	return new e({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function sr(e, t) {
	return new e({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function cr(e, t) {
	return new e({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function lr(e, t) {
	return new e({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ur(e, t) {
	return new e({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: !1,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function dr(e, t) {
	return new e({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: !1,
		local: !1,
		precision: null,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function fr(e, t) {
	return new e({
		type: "string",
		format: "date",
		check: "string_format",
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function pr(e, t) {
	return new e({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function mr(e, t) {
	return new e({
		type: "string",
		format: "duration",
		check: "string_format",
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function hr(e, t) {
	return new e({
		type: "number",
		checks: [],
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function gr(e, t) {
	return new e({
		type: "number",
		check: "number_format",
		abort: !1,
		format: "safeint",
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function _r(e, t) {
	return new e({
		type: "boolean",
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function vr(e) {
	return new e({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function yr(e, t) {
	return new e({
		type: "never",
		...S(t)
	});
}
// @__NO_SIDE_EFFECTS__
function br(e, t) {
	return new _t({
		check: "less_than",
		...S(t),
		value: e,
		inclusive: !1
	});
}
// @__NO_SIDE_EFFECTS__
function xr(e, t) {
	return new _t({
		check: "less_than",
		...S(t),
		value: e,
		inclusive: !0
	});
}
// @__NO_SIDE_EFFECTS__
function Sr(e, t) {
	return new vt({
		check: "greater_than",
		...S(t),
		value: e,
		inclusive: !1
	});
}
// @__NO_SIDE_EFFECTS__
function Cr(e, t) {
	return new vt({
		check: "greater_than",
		...S(t),
		value: e,
		inclusive: !0
	});
}
// @__NO_SIDE_EFFECTS__
function wr(e, t) {
	return new yt({
		check: "multiple_of",
		...S(t),
		value: e
	});
}
// @__NO_SIDE_EFFECTS__
function Tr(e, t) {
	return new xt({
		check: "max_length",
		...S(t),
		maximum: e
	});
}
// @__NO_SIDE_EFFECTS__
function L(e, t) {
	return new St({
		check: "min_length",
		...S(t),
		minimum: e
	});
}
// @__NO_SIDE_EFFECTS__
function Er(e, t) {
	return new Ct({
		check: "length_equals",
		...S(t),
		length: e
	});
}
// @__NO_SIDE_EFFECTS__
function Dr(e, t) {
	return new wt({
		check: "string_format",
		format: "regex",
		...S(t),
		pattern: e
	});
}
// @__NO_SIDE_EFFECTS__
function Or(e) {
	return new Tt({
		check: "string_format",
		format: "lowercase",
		...S(e)
	});
}
// @__NO_SIDE_EFFECTS__
function kr(e) {
	return new Et({
		check: "string_format",
		format: "uppercase",
		...S(e)
	});
}
// @__NO_SIDE_EFFECTS__
function Ar(e, t) {
	return new Dt({
		check: "string_format",
		format: "includes",
		...S(t),
		includes: e
	});
}
// @__NO_SIDE_EFFECTS__
function jr(e, t) {
	return new Ot({
		check: "string_format",
		format: "starts_with",
		...S(t),
		prefix: e
	});
}
// @__NO_SIDE_EFFECTS__
function Mr(e, t) {
	return new kt({
		check: "string_format",
		format: "ends_with",
		...S(t),
		suffix: e
	});
}
// @__NO_SIDE_EFFECTS__
function R(e) {
	return new At({
		check: "overwrite",
		tx: e
	});
}
// @__NO_SIDE_EFFECTS__
function Nr(e) {
	return /* @__PURE__ */ R((t) => t.normalize(e));
}
// @__NO_SIDE_EFFECTS__
function Pr() {
	return /* @__PURE__ */ R((e) => e.trim());
}
// @__NO_SIDE_EFFECTS__
function Fr() {
	return /* @__PURE__ */ R((e) => e.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function Ir() {
	return /* @__PURE__ */ R((e) => e.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function Lr() {
	return /* @__PURE__ */ R((e) => ae(e));
}
// @__NO_SIDE_EFFECTS__
function Rr(e, t, n) {
	return new e({
		type: "array",
		element: t,
		...S(n)
	});
}
// @__NO_SIDE_EFFECTS__
function zr(e, t, n) {
	return new e({
		type: "custom",
		check: "custom",
		fn: t,
		...S(n)
	});
}
// @__NO_SIDE_EFFECTS__
function Br(e, t) {
	let n = /* @__PURE__ */ Vr((t) => (t.addIssue = (e) => {
		if (typeof e == "string") t.issues.push(E(e, t.value, n._zod.def));
		else {
			let r = e;
			r.fatal && (r.continue = !1), r.code ??= "custom", r.input ??= t.value, r.inst ??= n, r.continue ??= !n._zod.def.abort, t.issues.push(E(r));
		}
	}, e(t.value, t)), t);
	return n;
}
// @__NO_SIDE_EFFECTS__
function Vr(e, t) {
	let n = new k({
		check: "custom",
		...S(t)
	});
	return n._zod.check = e, n;
}
//#endregion
//#region node_modules/zod/v4/core/to-json-schema.js
function Hr(e) {
	let t = e?.target ?? "draft-2020-12";
	return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
		processors: e.processors ?? {},
		metadataRegistry: e?.metadata ?? I,
		target: t,
		unrepresentable: e?.unrepresentable ?? "throw",
		override: e?.override ?? (() => {}),
		io: e?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		cycles: e?.cycles ?? "ref",
		reused: e?.reused ?? "inline",
		external: e?.external ?? void 0
	};
}
function z(e, t, n = {
	path: [],
	schemaPath: []
}) {
	var r;
	let i = e._zod.def, a = t.seen.get(e);
	if (a) return a.count++, n.schemaPath.includes(e) && (a.cycle = n.path), a.schema;
	let o = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: n.path
	};
	t.seen.set(e, o);
	let s = e._zod.toJSONSchema?.();
	if (s) o.schema = s;
	else {
		let r = {
			...n,
			schemaPath: [...n.schemaPath, e],
			path: n.path
		};
		if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, o.schema, r);
		else {
			let n = o.schema, a = t.processors[i.type];
			if (!a) throw Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);
			a(e, t, n, r);
		}
		let a = e._zod.parent;
		a && (o.ref ||= a, z(a, t, r), t.seen.get(a).isParent = !0);
	}
	let c = t.metadataRegistry.get(e);
	return c && Object.assign(o.schema, c), t.io === "input" && B(e) && (delete o.schema.examples, delete o.schema.default), t.io === "input" && "_prefault" in o.schema && ((r = o.schema).default ?? (r.default = o.schema._prefault)), delete o.schema._prefault, t.seen.get(e).schema;
}
function Ur(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	let r = /* @__PURE__ */ new Map();
	for (let t of e.seen.entries()) {
		let n = e.metadataRegistry.get(t[0])?.id;
		if (n) {
			let e = r.get(n);
			if (e && e !== t[0]) throw Error(`Duplicate schema id "${n}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			r.set(n, t[0]);
		}
	}
	let i = (t) => {
		let r = e.target === "draft-2020-12" ? "$defs" : "definitions";
		if (e.external) {
			let n = e.external.registry.get(t[0])?.id, i = e.external.uri ?? ((e) => e);
			if (n) return { ref: i(n) };
			let a = t[1].defId ?? t[1].schema.id ?? `schema${e.counter++}`;
			return t[1].defId = a, {
				defId: a,
				ref: `${i("__shared")}#/${r}/${a}`
			};
		}
		if (t[1] === n) return { ref: "#" };
		let i = `#/${r}/`, a = t[1].schema.id ?? `__schema${e.counter++}`;
		return {
			defId: a,
			ref: i + a
		};
	}, a = (e) => {
		if (e[1].schema.$ref) return;
		let t = e[1], { ref: n, defId: r } = i(e);
		t.def = { ...t.schema }, r && (t.defId = r);
		let a = t.schema;
		for (let e in a) delete a[e];
		a.$ref = n;
	};
	if (e.cycles === "throw") for (let t of e.seen.entries()) {
		let e = t[1];
		if (e.cycle) throw Error(`Cycle detected: #/${e.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (let n of e.seen.entries()) {
		let r = n[1];
		if (t === n[0]) {
			a(n);
			continue;
		}
		if (e.external) {
			let r = e.external.registry.get(n[0])?.id;
			if (t !== n[0] && r) {
				a(n);
				continue;
			}
		}
		if (e.metadataRegistry.get(n[0])?.id) {
			a(n);
			continue;
		}
		if (r.cycle) {
			a(n);
			continue;
		}
		if (r.count > 1 && e.reused === "ref") {
			a(n);
			continue;
		}
	}
}
function Wr(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	let r = (t) => {
		let n = e.seen.get(t);
		if (n.ref === null) return;
		let i = n.def ?? n.schema, a = { ...i }, o = n.ref;
		if (n.ref = null, o) {
			r(o);
			let n = e.seen.get(o), s = n.schema;
			if (s.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (i.allOf = i.allOf ?? [], i.allOf.push(s)) : Object.assign(i, s), Object.assign(i, a), t._zod.parent === o) for (let e in i) e !== "$ref" && e !== "allOf" && (e in a || delete i[e]);
			if (s.$ref && n.def) for (let e in i) e !== "$ref" && e !== "allOf" && e in n.def && JSON.stringify(i[e]) === JSON.stringify(n.def[e]) && delete i[e];
		}
		let s = t._zod.parent;
		if (s && s !== o) {
			r(s);
			let t = e.seen.get(s);
			if (t?.schema.$ref && (i.$ref = t.schema.$ref, t.def)) for (let e in i) e !== "$ref" && e !== "allOf" && e in t.def && JSON.stringify(i[e]) === JSON.stringify(t.def[e]) && delete i[e];
		}
		e.override({
			zodSchema: t,
			jsonSchema: i,
			path: n.path ?? []
		});
	};
	for (let t of [...e.seen.entries()].reverse()) r(t[0]);
	let i = {};
	if (e.target === "draft-2020-12" ? i.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? i.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? i.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
		let n = e.external.registry.get(t)?.id;
		if (!n) throw Error("Schema is missing an `id` property");
		i.$id = e.external.uri(n);
	}
	Object.assign(i, n.def ?? n.schema);
	let a = e.metadataRegistry.get(t)?.id;
	a !== void 0 && i.id === a && delete i.id;
	let o = e.external?.defs ?? {};
	for (let t of e.seen.entries()) {
		let e = t[1];
		e.def && e.defId && (e.def.id === e.defId && delete e.def.id, o[e.defId] = e.def);
	}
	e.external || Object.keys(o).length > 0 && (e.target === "draft-2020-12" ? i.$defs = o : i.definitions = o);
	try {
		let n = JSON.parse(JSON.stringify(i));
		return Object.defineProperty(n, "~standard", {
			value: {
				...t["~standard"],
				jsonSchema: {
					input: V(t, "input", e.processors),
					output: V(t, "output", e.processors)
				}
			},
			enumerable: !1,
			writable: !1
		}), n;
	} catch {
		throw Error("Error converting schema to JSON.");
	}
}
function B(e, t) {
	let n = t ?? { seen: /* @__PURE__ */ new Set() };
	if (n.seen.has(e)) return !1;
	n.seen.add(e);
	let r = e._zod.def;
	if (r.type === "transform") return !0;
	if (r.type === "array") return B(r.element, n);
	if (r.type === "set") return B(r.valueType, n);
	if (r.type === "lazy") return B(r.getter(), n);
	if (r.type === "promise" || r.type === "optional" || r.type === "nonoptional" || r.type === "nullable" || r.type === "readonly" || r.type === "default" || r.type === "prefault") return B(r.innerType, n);
	if (r.type === "intersection") return B(r.left, n) || B(r.right, n);
	if (r.type === "record" || r.type === "map") return B(r.keyType, n) || B(r.valueType, n);
	if (r.type === "pipe") return e._zod.traits.has("$ZodCodec") ? !0 : B(r.in, n) || B(r.out, n);
	if (r.type === "object") {
		for (let e in r.shape) if (B(r.shape[e], n)) return !0;
		return !1;
	}
	if (r.type === "union") {
		for (let e of r.options) if (B(e, n)) return !0;
		return !1;
	}
	if (r.type === "tuple") {
		for (let e of r.items) if (B(e, n)) return !0;
		return !!(r.rest && B(r.rest, n));
	}
	return !1;
}
var Gr = (e, t = {}) => (n) => {
	let r = Hr({
		...n,
		processors: t
	});
	return z(e, r), Ur(r, e), Wr(r, e);
}, V = (e, t, n = {}) => (r) => {
	let { libraryOptions: i, target: a } = r ?? {}, o = Hr({
		...i ?? {},
		target: a,
		io: t,
		processors: n
	});
	return z(e, o), Ur(o, e), Wr(o, e);
}, Kr = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
}, qr = (e, t, n, r) => {
	let i = n;
	i.type = "string";
	let { minimum: a, maximum: o, format: s, patterns: c, contentEncoding: l } = e._zod.bag;
	if (typeof a == "number" && (i.minLength = a), typeof o == "number" && (i.maxLength = o), s && (i.format = Kr[s] ?? s, i.format === "" && delete i.format, s === "time" && delete i.format), l && (i.contentEncoding = l), c && c.size > 0) {
		let e = [...c];
		e.length === 1 ? i.pattern = e[0].source : e.length > 1 && (i.allOf = [...e.map((e) => ({
			...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: e.source
		}))]);
	}
}, Jr = (e, t, n, r) => {
	let i = n, { minimum: a, maximum: o, format: s, multipleOf: c, exclusiveMaximum: l, exclusiveMinimum: u } = e._zod.bag;
	i.type = typeof s == "string" && s.includes("int") ? "integer" : "number";
	let d = typeof u == "number" && u >= (a ?? -Infinity), f = typeof l == "number" && l <= (o ?? Infinity), p = t.target === "draft-04" || t.target === "openapi-3.0";
	d ? p ? (i.minimum = u, i.exclusiveMinimum = !0) : i.exclusiveMinimum = u : typeof a == "number" && (i.minimum = a), f ? p ? (i.maximum = l, i.exclusiveMaximum = !0) : i.exclusiveMaximum = l : typeof o == "number" && (i.maximum = o), typeof c == "number" && (i.multipleOf = c);
}, Yr = (e, t, n, r) => {
	n.type = "boolean";
}, Xr = (e, t, n, r) => {
	n.not = {};
}, Zr = (e, t, n, r) => {
	let i = e._zod.def, a = f(i.entries);
	a.every((e) => typeof e == "number") && (n.type = "number"), a.every((e) => typeof e == "string") && (n.type = "string"), n.enum = a;
}, Qr = (e, t, n, r) => {
	if (t.unrepresentable === "throw") throw Error("Custom types cannot be represented in JSON Schema");
}, $r = (e, t, n, r) => {
	if (t.unrepresentable === "throw") throw Error("Transforms cannot be represented in JSON Schema");
}, ei = (e, t, n, r) => {
	let i = n, a = e._zod.def, { minimum: o, maximum: s } = e._zod.bag;
	typeof o == "number" && (i.minItems = o), typeof s == "number" && (i.maxItems = s), i.type = "array", i.items = z(a.element, t, {
		...r,
		path: [...r.path, "items"]
	});
}, ti = (e, t, n, r) => {
	let i = n, a = e._zod.def;
	i.type = "object", i.properties = {};
	let o = a.shape;
	for (let e in o) i.properties[e] = z(o[e], t, {
		...r,
		path: [
			...r.path,
			"properties",
			e
		]
	});
	let s = new Set(Object.keys(o)), c = new Set([...s].filter((e) => {
		let n = a.shape[e]._zod;
		return t.io === "input" ? n.optin === void 0 : n.optout === void 0;
	}));
	c.size > 0 && (i.required = Array.from(c)), a.catchall?._zod.def.type === "never" ? i.additionalProperties = !1 : a.catchall ? a.catchall && (i.additionalProperties = z(a.catchall, t, {
		...r,
		path: [...r.path, "additionalProperties"]
	})) : t.io === "output" && (i.additionalProperties = !1);
}, ni = (e, t, n, r) => {
	let i = e._zod.def, a = i.inclusive === !1, o = i.options.map((e, n) => z(e, t, {
		...r,
		path: [
			...r.path,
			a ? "oneOf" : "anyOf",
			n
		]
	}));
	a ? n.oneOf = o : n.anyOf = o;
}, ri = (e, t, n, r) => {
	let i = e._zod.def, a = z(i.left, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			0
		]
	}), o = z(i.right, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			1
		]
	}), s = (e) => "allOf" in e && Object.keys(e).length === 1;
	n.allOf = [...s(a) ? a.allOf : [a], ...s(o) ? o.allOf : [o]];
}, ii = (e, t, n, r) => {
	let i = e._zod.def, a = z(i.innerType, t, r), o = t.seen.get(e);
	t.target === "openapi-3.0" ? (o.ref = i.innerType, n.nullable = !0) : n.anyOf = [a, { type: "null" }];
}, ai = (e, t, n, r) => {
	let i = e._zod.def;
	z(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, oi = (e, t, n, r) => {
	let i = e._zod.def;
	z(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.default = JSON.parse(JSON.stringify(i.defaultValue));
}, si = (e, t, n, r) => {
	let i = e._zod.def;
	z(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, t.io === "input" && (n._prefault = JSON.parse(JSON.stringify(i.defaultValue)));
}, ci = (e, t, n, r) => {
	let i = e._zod.def;
	z(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o;
	try {
		o = i.catchValue(void 0);
	} catch {
		throw Error("Dynamic catch values are not supported in JSON Schema");
	}
	n.default = o;
}, li = (e, t, n, r) => {
	let i = e._zod.def, a = i.in._zod.traits.has("$ZodTransform"), o = t.io === "input" ? a ? i.out : i.in : i.out;
	z(o, t, r);
	let s = t.seen.get(e);
	s.ref = o;
}, ui = (e, t, n, r) => {
	let i = e._zod.def;
	z(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.readOnly = !0;
}, di = (e, t, n, r) => {
	let i = e._zod.def;
	z(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, fi = /*@__PURE__*/ s("ZodISODateTime", (e, t) => {
	Gt.init(e, t), K.init(e, t);
});
function pi(e) {
	return /* @__PURE__ */ dr(fi, e);
}
var mi = /*@__PURE__*/ s("ZodISODate", (e, t) => {
	Kt.init(e, t), K.init(e, t);
});
function hi(e) {
	return /* @__PURE__ */ fr(mi, e);
}
var gi = /*@__PURE__*/ s("ZodISOTime", (e, t) => {
	qt.init(e, t), K.init(e, t);
});
function _i(e) {
	return /* @__PURE__ */ pr(gi, e);
}
var vi = /*@__PURE__*/ s("ZodISODuration", (e, t) => {
	Jt.init(e, t), K.init(e, t);
});
function yi(e) {
	return /* @__PURE__ */ mr(vi, e);
}
var H = /*@__PURE__*/ s("ZodError", (e, t) => {
	Ce.init(e, t), e.name = "ZodError", Object.defineProperties(e, {
		format: { value: (t) => Ee(e, t) },
		flatten: { value: (t) => Te(e, t) },
		addIssue: { value: (t) => {
			e.issues.push(t), e.message = JSON.stringify(e.issues, p, 2);
		} },
		addIssues: { value: (t) => {
			e.issues.push(...t), e.message = JSON.stringify(e.issues, p, 2);
		} },
		isEmpty: { get() {
			return e.issues.length === 0;
		} }
	});
}, { Parent: Error }), bi = /* @__PURE__ */ De(H), xi = /* @__PURE__ */ Oe(H), Si = /* @__PURE__ */ D(H), Ci = /* @__PURE__ */ O(H), wi = /* @__PURE__ */ je(H), Ti = /* @__PURE__ */ Me(H), Ei = /* @__PURE__ */ Ne(H), Di = /* @__PURE__ */ Pe(H), Oi = /* @__PURE__ */ Fe(H), ki = /* @__PURE__ */ Ie(H), Ai = /* @__PURE__ */ Le(H), ji = /* @__PURE__ */ Re(H), Mi = /* @__PURE__ */ new WeakMap();
function U(e, t, n) {
	let r = Object.getPrototypeOf(e), i = Mi.get(r);
	if (i || (i = /* @__PURE__ */ new Set(), Mi.set(r, i)), !i.has(t)) {
		i.add(t);
		for (let e in n) {
			let t = n[e];
			Object.defineProperty(r, e, {
				configurable: !0,
				enumerable: !1,
				get() {
					let n = t.bind(this);
					return Object.defineProperty(this, e, {
						configurable: !0,
						writable: !0,
						enumerable: !0,
						value: n
					}), n;
				},
				set(t) {
					Object.defineProperty(this, e, {
						configurable: !0,
						writable: !0,
						enumerable: !0,
						value: t
					});
				}
			});
		}
	}
}
var W = /*@__PURE__*/ s("ZodType", (e, t) => (j.init(e, t), Object.assign(e["~standard"], { jsonSchema: {
	input: V(e, "input"),
	output: V(e, "output")
} }), e.toJSONSchema = Gr(e, {}), e.def = t, e.type = t.type, Object.defineProperty(e, "_def", { value: t }), e.parse = (t, n) => bi(e, t, n, { callee: e.parse }), e.safeParse = (t, n) => Si(e, t, n), e.parseAsync = async (t, n) => xi(e, t, n, { callee: e.parseAsync }), e.safeParseAsync = async (t, n) => Ci(e, t, n), e.spa = e.safeParseAsync, e.encode = (t, n) => wi(e, t, n), e.decode = (t, n) => Ti(e, t, n), e.encodeAsync = async (t, n) => Ei(e, t, n), e.decodeAsync = async (t, n) => Di(e, t, n), e.safeEncode = (t, n) => Oi(e, t, n), e.safeDecode = (t, n) => ki(e, t, n), e.safeEncodeAsync = async (t, n) => Ai(e, t, n), e.safeDecodeAsync = async (t, n) => ji(e, t, n), U(e, "ZodType", {
	check(...e) {
		let t = this.def;
		return this.clone(_(t, { checks: [...t.checks ?? [], ...e.map((e) => typeof e == "function" ? { _zod: {
			check: e,
			def: { check: "custom" },
			onattach: []
		} } : e)] }), { parent: !0 });
	},
	with(...e) {
		return this.check(...e);
	},
	clone(e, t) {
		return x(this, e, t);
	},
	brand() {
		return this;
	},
	register(e, t) {
		return e.add(this, t), this;
	},
	refine(e, t) {
		return this.check(Ra(e, t));
	},
	superRefine(e, t) {
		return this.check(za(e, t));
	},
	overwrite(e) {
		return this.check(/* @__PURE__ */ R(e));
	},
	optional() {
		return ba(this);
	},
	exactOptional() {
		return Sa(this);
	},
	nullable() {
		return wa(this);
	},
	nullish() {
		return ba(wa(this));
	},
	nonoptional(e) {
		return Aa(this, e);
	},
	array() {
		return la(this);
	},
	or(e) {
		return fa([this, e]);
	},
	and(e) {
		return ma(this, e);
	},
	transform(e) {
		return Pa(this, va(e));
	},
	default(e) {
		return Ea(this, e);
	},
	prefault(e) {
		return Oa(this, e);
	},
	catch(e) {
		return Ma(this, e);
	},
	pipe(e) {
		return Pa(this, e);
	},
	readonly() {
		return Ia(this);
	},
	describe(e) {
		let t = this.clone();
		return I.add(t, { description: e }), t;
	},
	meta(...e) {
		if (e.length === 0) return I.get(this);
		let t = this.clone();
		return I.add(t, e[0]), t;
	},
	isOptional() {
		return this.safeParse(void 0).success;
	},
	isNullable() {
		return this.safeParse(null).success;
	},
	apply(e) {
		return e(this);
	}
}), Object.defineProperty(e, "description", {
	get() {
		return I.get(e)?.description;
	},
	configurable: !0
}), e)), Ni = /*@__PURE__*/ s("_ZodString", (e, t) => {
	Nt.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => qr(e, t, n, r);
	let n = e._zod.bag;
	e.format = n.format ?? null, e.minLength = n.minimum ?? null, e.maxLength = n.maximum ?? null, U(e, "_ZodString", {
		regex(...e) {
			return this.check(/* @__PURE__ */ Dr(...e));
		},
		includes(...e) {
			return this.check(/* @__PURE__ */ Ar(...e));
		},
		startsWith(...e) {
			return this.check(/* @__PURE__ */ jr(...e));
		},
		endsWith(...e) {
			return this.check(/* @__PURE__ */ Mr(...e));
		},
		min(...e) {
			return this.check(/* @__PURE__ */ L(...e));
		},
		max(...e) {
			return this.check(/* @__PURE__ */ Tr(...e));
		},
		length(...e) {
			return this.check(/* @__PURE__ */ Er(...e));
		},
		nonempty(...e) {
			return this.check(/* @__PURE__ */ L(1, ...e));
		},
		lowercase(e) {
			return this.check(/* @__PURE__ */ Or(e));
		},
		uppercase(e) {
			return this.check(/* @__PURE__ */ kr(e));
		},
		trim() {
			return this.check(/* @__PURE__ */ Pr());
		},
		normalize(...e) {
			return this.check(/* @__PURE__ */ Nr(...e));
		},
		toLowerCase() {
			return this.check(/* @__PURE__ */ Fr());
		},
		toUpperCase() {
			return this.check(/* @__PURE__ */ Ir());
		},
		slugify() {
			return this.check(/* @__PURE__ */ Lr());
		}
	});
}), Pi = /*@__PURE__*/ s("ZodString", (e, t) => {
	Nt.init(e, t), Ni.init(e, t), e.email = (t) => e.check(/* @__PURE__ */ Un(Fi, t)), e.url = (t) => e.check(/* @__PURE__ */ Yn(Li, t)), e.jwt = (t) => e.check(/* @__PURE__ */ ur(Qi, t)), e.emoji = (t) => e.check(/* @__PURE__ */ Xn(Ri, t)), e.guid = (t) => e.check(/* @__PURE__ */ Wn(Ii, t)), e.uuid = (t) => e.check(/* @__PURE__ */ Gn(q, t)), e.uuidv4 = (t) => e.check(/* @__PURE__ */ Kn(q, t)), e.uuidv6 = (t) => e.check(/* @__PURE__ */ qn(q, t)), e.uuidv7 = (t) => e.check(/* @__PURE__ */ Jn(q, t)), e.nanoid = (t) => e.check(/* @__PURE__ */ Zn(zi, t)), e.guid = (t) => e.check(/* @__PURE__ */ Wn(Ii, t)), e.cuid = (t) => e.check(/* @__PURE__ */ Qn(Bi, t)), e.cuid2 = (t) => e.check(/* @__PURE__ */ $n(Vi, t)), e.ulid = (t) => e.check(/* @__PURE__ */ er(Hi, t)), e.base64 = (t) => e.check(/* @__PURE__ */ sr(Yi, t)), e.base64url = (t) => e.check(/* @__PURE__ */ cr(Xi, t)), e.xid = (t) => e.check(/* @__PURE__ */ tr(Ui, t)), e.ksuid = (t) => e.check(/* @__PURE__ */ nr(Wi, t)), e.ipv4 = (t) => e.check(/* @__PURE__ */ rr(Gi, t)), e.ipv6 = (t) => e.check(/* @__PURE__ */ ir(Ki, t)), e.cidrv4 = (t) => e.check(/* @__PURE__ */ ar(qi, t)), e.cidrv6 = (t) => e.check(/* @__PURE__ */ or(Ji, t)), e.e164 = (t) => e.check(/* @__PURE__ */ lr(Zi, t)), e.datetime = (t) => e.check(pi(t)), e.date = (t) => e.check(hi(t)), e.time = (t) => e.check(_i(t)), e.duration = (t) => e.check(yi(t));
});
function G(e) {
	return /* @__PURE__ */ Hn(Pi, e);
}
var K = /*@__PURE__*/ s("ZodStringFormat", (e, t) => {
	M.init(e, t), Ni.init(e, t);
}), Fi = /*@__PURE__*/ s("ZodEmail", (e, t) => {
	It.init(e, t), K.init(e, t);
}), Ii = /*@__PURE__*/ s("ZodGUID", (e, t) => {
	Pt.init(e, t), K.init(e, t);
}), q = /*@__PURE__*/ s("ZodUUID", (e, t) => {
	Ft.init(e, t), K.init(e, t);
}), Li = /*@__PURE__*/ s("ZodURL", (e, t) => {
	Lt.init(e, t), K.init(e, t);
}), Ri = /*@__PURE__*/ s("ZodEmoji", (e, t) => {
	Rt.init(e, t), K.init(e, t);
}), zi = /*@__PURE__*/ s("ZodNanoID", (e, t) => {
	zt.init(e, t), K.init(e, t);
}), Bi = /*@__PURE__*/ s("ZodCUID", (e, t) => {
	Bt.init(e, t), K.init(e, t);
}), Vi = /*@__PURE__*/ s("ZodCUID2", (e, t) => {
	Vt.init(e, t), K.init(e, t);
}), Hi = /*@__PURE__*/ s("ZodULID", (e, t) => {
	Ht.init(e, t), K.init(e, t);
}), Ui = /*@__PURE__*/ s("ZodXID", (e, t) => {
	Ut.init(e, t), K.init(e, t);
}), Wi = /*@__PURE__*/ s("ZodKSUID", (e, t) => {
	Wt.init(e, t), K.init(e, t);
}), Gi = /*@__PURE__*/ s("ZodIPv4", (e, t) => {
	Yt.init(e, t), K.init(e, t);
}), Ki = /*@__PURE__*/ s("ZodIPv6", (e, t) => {
	Xt.init(e, t), K.init(e, t);
}), qi = /*@__PURE__*/ s("ZodCIDRv4", (e, t) => {
	Zt.init(e, t), K.init(e, t);
}), Ji = /*@__PURE__*/ s("ZodCIDRv6", (e, t) => {
	Qt.init(e, t), K.init(e, t);
}), Yi = /*@__PURE__*/ s("ZodBase64", (e, t) => {
	en.init(e, t), K.init(e, t);
}), Xi = /*@__PURE__*/ s("ZodBase64URL", (e, t) => {
	nn.init(e, t), K.init(e, t);
}), Zi = /*@__PURE__*/ s("ZodE164", (e, t) => {
	rn.init(e, t), K.init(e, t);
}), Qi = /*@__PURE__*/ s("ZodJWT", (e, t) => {
	on.init(e, t), K.init(e, t);
}), $i = /*@__PURE__*/ s("ZodNumber", (e, t) => {
	sn.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => Jr(e, t, n, r), U(e, "ZodNumber", {
		gt(e, t) {
			return this.check(/* @__PURE__ */ Sr(e, t));
		},
		gte(e, t) {
			return this.check(/* @__PURE__ */ Cr(e, t));
		},
		min(e, t) {
			return this.check(/* @__PURE__ */ Cr(e, t));
		},
		lt(e, t) {
			return this.check(/* @__PURE__ */ br(e, t));
		},
		lte(e, t) {
			return this.check(/* @__PURE__ */ xr(e, t));
		},
		max(e, t) {
			return this.check(/* @__PURE__ */ xr(e, t));
		},
		int(e) {
			return this.check(ta(e));
		},
		safe(e) {
			return this.check(ta(e));
		},
		positive(e) {
			return this.check(/* @__PURE__ */ Sr(0, e));
		},
		nonnegative(e) {
			return this.check(/* @__PURE__ */ Cr(0, e));
		},
		negative(e) {
			return this.check(/* @__PURE__ */ br(0, e));
		},
		nonpositive(e) {
			return this.check(/* @__PURE__ */ xr(0, e));
		},
		multipleOf(e, t) {
			return this.check(/* @__PURE__ */ wr(e, t));
		},
		step(e, t) {
			return this.check(/* @__PURE__ */ wr(e, t));
		},
		finite() {
			return this;
		}
	});
	let n = e._zod.bag;
	e.minValue = Math.max(n.minimum ?? -Infinity, n.exclusiveMinimum ?? -Infinity) ?? null, e.maxValue = Math.min(n.maximum ?? Infinity, n.exclusiveMaximum ?? Infinity) ?? null, e.isInt = (n.format ?? "").includes("int") || Number.isSafeInteger(n.multipleOf ?? .5), e.isFinite = !0, e.format = n.format ?? null;
});
function J(e) {
	return /* @__PURE__ */ hr($i, e);
}
var ea = /*@__PURE__*/ s("ZodNumberFormat", (e, t) => {
	cn.init(e, t), $i.init(e, t);
});
function ta(e) {
	return /* @__PURE__ */ gr(ea, e);
}
var na = /*@__PURE__*/ s("ZodBoolean", (e, t) => {
	ln.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => Yr(e, t, n, r);
});
function ra(e) {
	return /* @__PURE__ */ _r(na, e);
}
var ia = /*@__PURE__*/ s("ZodUnknown", (e, t) => {
	un.init(e, t), W.init(e, t), e._zod.processJSONSchema = (e, t, n) => void 0;
});
function aa() {
	return /* @__PURE__ */ vr(ia);
}
var oa = /*@__PURE__*/ s("ZodNever", (e, t) => {
	dn.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => Xr(e, t, n, r);
});
function sa(e) {
	return /* @__PURE__ */ yr(oa, e);
}
var ca = /*@__PURE__*/ s("ZodArray", (e, t) => {
	pn.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => ei(e, t, n, r), e.element = t.element, U(e, "ZodArray", {
		min(e, t) {
			return this.check(/* @__PURE__ */ L(e, t));
		},
		nonempty(e) {
			return this.check(/* @__PURE__ */ L(1, e));
		},
		max(e, t) {
			return this.check(/* @__PURE__ */ Tr(e, t));
		},
		length(e, t) {
			return this.check(/* @__PURE__ */ Er(e, t));
		},
		unwrap() {
			return this.element;
		}
	});
});
function la(e, t) {
	return /* @__PURE__ */ Rr(ca, e, t);
}
var ua = /*@__PURE__*/ s("ZodObject", (e, t) => {
	_n.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => ti(e, t, n, r), h(e, "shape", () => t.shape), U(e, "ZodObject", {
		keyof() {
			return ga(Object.keys(this._zod.def.shape));
		},
		catchall(e) {
			return this.clone({
				...this._zod.def,
				catchall: e
			});
		},
		passthrough() {
			return this.clone({
				...this._zod.def,
				catchall: aa()
			});
		},
		loose() {
			return this.clone({
				...this._zod.def,
				catchall: aa()
			});
		},
		strict() {
			return this.clone({
				...this._zod.def,
				catchall: sa()
			});
		},
		strip() {
			return this.clone({
				...this._zod.def,
				catchall: void 0
			});
		},
		extend(e) {
			return me(this, e);
		},
		safeExtend(e) {
			return he(this, e);
		},
		merge(e) {
			return ge(this, e);
		},
		pick(e) {
			return fe(this, e);
		},
		omit(e) {
			return pe(this, e);
		},
		partial(...e) {
			return _e(ya, this, e[0]);
		},
		required(...e) {
			return ve(ka, this, e[0]);
		}
	});
});
function Y(e, t) {
	return new ua({
		type: "object",
		shape: e ?? {},
		...S(t)
	});
}
var da = /*@__PURE__*/ s("ZodUnion", (e, t) => {
	yn.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => ni(e, t, n, r), e.options = t.options;
});
function fa(e, t) {
	return new da({
		type: "union",
		options: e,
		...S(t)
	});
}
var pa = /*@__PURE__*/ s("ZodIntersection", (e, t) => {
	bn.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => ri(e, t, n, r);
});
function ma(e, t) {
	return new pa({
		type: "intersection",
		left: e,
		right: t
	});
}
var ha = /*@__PURE__*/ s("ZodEnum", (e, t) => {
	Sn.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => Zr(e, t, n, r), e.enum = t.entries, e.options = Object.values(t.entries);
	let n = new Set(Object.keys(t.entries));
	e.extract = (e, r) => {
		let i = {};
		for (let r of e) if (n.has(r)) i[r] = t.entries[r];
		else throw Error(`Key ${r} not found in enum`);
		return new ha({
			...t,
			checks: [],
			...S(r),
			entries: i
		});
	}, e.exclude = (e, r) => {
		let i = { ...t.entries };
		for (let t of e) if (n.has(t)) delete i[t];
		else throw Error(`Key ${t} not found in enum`);
		return new ha({
			...t,
			checks: [],
			...S(r),
			entries: i
		});
	};
});
function ga(e, t) {
	return new ha({
		type: "enum",
		entries: Array.isArray(e) ? Object.fromEntries(e.map((e) => [e, e])) : e,
		...S(t)
	});
}
var _a = /*@__PURE__*/ s("ZodTransform", (e, t) => {
	Cn.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => $r(e, t, n, r), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new l(e.constructor.name);
		n.addIssue = (r) => {
			if (typeof r == "string") n.issues.push(E(r, n.value, t));
			else {
				let t = r;
				t.fatal && (t.continue = !1), t.code ??= "custom", t.input ??= n.value, t.inst ??= e, n.issues.push(E(t));
			}
		};
		let i = t.transform(n.value, n);
		return i instanceof Promise ? i.then((e) => (n.value = e, n.fallback = !0, n)) : (n.value = i, n.fallback = !0, n);
	};
});
function va(e) {
	return new _a({
		type: "transform",
		transform: e
	});
}
var ya = /*@__PURE__*/ s("ZodOptional", (e, t) => {
	Tn.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => di(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function ba(e) {
	return new ya({
		type: "optional",
		innerType: e
	});
}
var xa = /*@__PURE__*/ s("ZodExactOptional", (e, t) => {
	En.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => di(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Sa(e) {
	return new xa({
		type: "optional",
		innerType: e
	});
}
var Ca = /*@__PURE__*/ s("ZodNullable", (e, t) => {
	Dn.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => ii(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function wa(e) {
	return new Ca({
		type: "nullable",
		innerType: e
	});
}
var Ta = /*@__PURE__*/ s("ZodDefault", (e, t) => {
	On.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => oi(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function Ea(e, t) {
	return new Ta({
		type: "default",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : ce(t);
		}
	});
}
var Da = /*@__PURE__*/ s("ZodPrefault", (e, t) => {
	An.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => si(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Oa(e, t) {
	return new Da({
		type: "prefault",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : ce(t);
		}
	});
}
var ka = /*@__PURE__*/ s("ZodNonOptional", (e, t) => {
	jn.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => ai(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Aa(e, t) {
	return new ka({
		type: "nonoptional",
		innerType: e,
		...S(t)
	});
}
var ja = /*@__PURE__*/ s("ZodCatch", (e, t) => {
	Nn.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => ci(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function Ma(e, t) {
	return new ja({
		type: "catch",
		innerType: e,
		catchValue: typeof t == "function" ? t : () => t
	});
}
var Na = /*@__PURE__*/ s("ZodPipe", (e, t) => {
	Pn.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => li(e, t, n, r), e.in = t.in, e.out = t.out;
});
function Pa(e, t) {
	return new Na({
		type: "pipe",
		in: e,
		out: t
	});
}
var Fa = /*@__PURE__*/ s("ZodReadonly", (e, t) => {
	Fn.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => ui(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Ia(e) {
	return new Fa({
		type: "readonly",
		innerType: e
	});
}
var La = /*@__PURE__*/ s("ZodCustom", (e, t) => {
	Ln.init(e, t), W.init(e, t), e._zod.processJSONSchema = (t, n, r) => Qr(e, t, n, r);
});
function Ra(e, t = {}) {
	return /* @__PURE__ */ zr(La, e, t);
}
function za(e, t) {
	return /* @__PURE__ */ Br(e, t);
}
//#endregion
//#region src/lib/types.ts
var Ba = Y({
	name: G().min(1),
	hint: G().min(1),
	score: J()
}).strict(), Va = Y({
	$schema: G().optional(),
	name: G().optional(),
	description: G().min(1),
	emoji: G().optional(),
	slangIntensity: J().min(0).max(1).optional(),
	moods: la(Ba).optional(),
	mood: Y({
		enabled: ra(),
		default: G().min(1),
		override: G().nullable().optional(),
		drift: J().min(0).max(1).optional()
	}).strict().optional()
}).strict(), Ha = Y({ current: G() }), Ua = process.env.HOME ?? process.env.USERPROFILE ?? "~", X = process.env.CLAUDE_PLUGIN_DATA_DIR ?? a(Ua, ".config/claude/personalities/data"), Z = a(Ua, ".config/claude/personality-state.json");
async function Wa(t) {
	return e(t).then(() => !0).catch(() => !1);
}
async function Ga() {
	return await Wa(X) ? (await r(X)).filter((e) => e.endsWith(".json")).map((e) => e.slice(0, -5)).sort() : (await t(X, { recursive: !0 }), []);
}
async function Ka() {
	return await Wa(Z) ? Ha.parse(JSON.parse(await n(Z, "utf8"))) : null;
}
async function qa(e) {
	await i(Z, JSON.stringify({ current: e }));
}
async function Ja(e) {
	let t = await n(a(X, `${e}.json`), "utf8");
	return Va.parse(JSON.parse(t));
}
function Ya(e) {
	let t = [];
	t.push("You MUST maintain the following persona in every single response, including technical discussions, code reviews, and long conversations. Never drop this persona. It overrides your default tone and style but not your capabilities or values."), e.name && e.description ? t.push(`Persona: ${e.name} — ${e.description}`) : e.description && t.push(`Persona: ${e.description}`), e.name && t.push(`Refer to yourself as ${e.name} when asked who you are.`), e.emoji && t.push(`Use ${e.emoji} and other fitting emojis naturally in your responses. Don't overuse them and NEVER place an emoji at the end of a line.`);
	let n = e.slangIntensity ?? 0;
	if (n > 0) {
		let e = n > .7 ? "heavy" : n > .3 ? "moderate" : "light";
		t.push(`Use ${e} slang and speech patterns characteristic of this persona.`);
	}
	if (e.mood?.enabled && e.mood.default) {
		let n = e.mood.override ?? e.mood.default, r = e.moods?.find((e) => e.name === n)?.hint ?? "";
		t.push(`Current mood: ${n}. ${r}`);
	}
	return t.join("\n");
}
//#endregion
//#region src/hooks/inject.ts
var Q = await Ga();
Q.length === 0 && process.exit(0);
var $ = await Ka();
if (!$ || !Q.includes($.current)) {
	let e = Q[Math.floor(Math.random() * Q.length)];
	await qa(e), $ = { current: e };
}
var Xa = await Ja($.current);
console.log(JSON.stringify({ hookSpecificOutput: {
	hookEventName: "SessionStart",
	additionalContext: Ya(Xa)
} }));
//#endregion
