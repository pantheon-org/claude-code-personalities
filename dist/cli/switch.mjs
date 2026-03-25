#!/usr/bin/env node
import { access as e, mkdir as t, readFile as n, readdir as r, writeFile as i } from "node:fs/promises";
import { join as a } from "node:path";
Object.freeze({ status: "aborted" });
function o(e, t, n) {
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
var s = class extends Error {
	constructor() {
		super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
	}
}, c = class extends Error {
	constructor(e) {
		super(`Encountered unidirectional transform during encode: ${e}`), this.name = "ZodEncodeError";
	}
}, l = {};
function u(e) {
	return e && Object.assign(l, e), l;
}
//#endregion
//#region node_modules/zod/v4/core/util.js
function d(e) {
	let t = Object.values(e).filter((e) => typeof e == "number");
	return Object.entries(e).filter(([e, n]) => t.indexOf(+e) === -1).map(([e, t]) => t);
}
function f(e, t) {
	return typeof t == "bigint" ? t.toString() : t;
}
function p(e) {
	return { get value() {
		{
			let t = e();
			return Object.defineProperty(this, "value", { value: t }), t;
		}
		throw Error("cached value already set");
	} };
}
function ee(e) {
	return e == null;
}
function te(e) {
	let t = e.startsWith("^") ? 1 : 0, n = e.endsWith("$") ? e.length - 1 : e.length;
	return e.slice(t, n);
}
function ne(e, t) {
	let n = (e.toString().split(".")[1] || "").length, r = t.toString(), i = (r.split(".")[1] || "").length;
	if (i === 0 && /\d?e-\d?/.test(r)) {
		let e = r.match(/\d?e-(\d?)/);
		e?.[1] && (i = Number.parseInt(e[1]));
	}
	let a = n > i ? n : i;
	return Number.parseInt(e.toFixed(a).replace(".", "")) % Number.parseInt(t.toFixed(a).replace(".", "")) / 10 ** a;
}
var re = Symbol("evaluating");
function m(e, t, n) {
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
function h(e, t, n) {
	Object.defineProperty(e, t, {
		value: n,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
function g(...e) {
	let t = {};
	for (let n of e) Object.assign(t, Object.getOwnPropertyDescriptors(n));
	return Object.defineProperties({}, t);
}
function ie(e) {
	return JSON.stringify(e);
}
function ae(e) {
	return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var oe = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {};
function _(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
var se = p(() => {
	if (typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return !1;
	try {
		return Function(""), !0;
	} catch {
		return !1;
	}
});
function v(e) {
	if (_(e) === !1) return !1;
	let t = e.constructor;
	if (t === void 0 || typeof t != "function") return !0;
	let n = t.prototype;
	return !(_(n) === !1 || Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") === !1);
}
function ce(e) {
	return v(e) ? { ...e } : Array.isArray(e) ? [...e] : e;
}
var le = new Set([
	"string",
	"number",
	"symbol"
]);
function y(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function b(e, t, n) {
	let r = new e._zod.constr(t ?? e._zod.def);
	return (!t || n?.parent) && (r._zod.parent = e), r;
}
function x(e) {
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
	return b(e, g(e._zod.def, {
		get shape() {
			let e = {};
			for (let r in t) {
				if (!(r in n.shape)) throw Error(`Unrecognized key: "${r}"`);
				t[r] && (e[r] = n.shape[r]);
			}
			return h(this, "shape", e), e;
		},
		checks: []
	}));
}
function pe(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".omit() cannot be used on object schemas containing refinements");
	return b(e, g(e._zod.def, {
		get shape() {
			let r = { ...e._zod.def.shape };
			for (let e in t) {
				if (!(e in n.shape)) throw Error(`Unrecognized key: "${e}"`);
				t[e] && delete r[e];
			}
			return h(this, "shape", r), r;
		},
		checks: []
	}));
}
function me(e, t) {
	if (!v(t)) throw Error("Invalid input to extend: expected a plain object");
	let n = e._zod.def.checks;
	if (n && n.length > 0) {
		let n = e._zod.def.shape;
		for (let e in t) if (Object.getOwnPropertyDescriptor(n, e) !== void 0) throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return b(e, g(e._zod.def, { get shape() {
		let n = {
			...e._zod.def.shape,
			...t
		};
		return h(this, "shape", n), n;
	} }));
}
function he(e, t) {
	if (!v(t)) throw Error("Invalid input to safeExtend: expected a plain object");
	return b(e, g(e._zod.def, { get shape() {
		let n = {
			...e._zod.def.shape,
			...t
		};
		return h(this, "shape", n), n;
	} }));
}
function ge(e, t) {
	return b(e, g(e._zod.def, {
		get shape() {
			let n = {
				...e._zod.def.shape,
				...t._zod.def.shape
			};
			return h(this, "shape", n), n;
		},
		get catchall() {
			return t._zod.def.catchall;
		},
		checks: []
	}));
}
function _e(e, t, n) {
	let r = t._zod.def.checks;
	if (r && r.length > 0) throw Error(".partial() cannot be used on object schemas containing refinements");
	return b(t, g(t._zod.def, {
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
			return h(this, "shape", i), i;
		},
		checks: []
	}));
}
function ve(e, t, n) {
	return b(t, g(t._zod.def, { get shape() {
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
		return h(this, "shape", i), i;
	} }));
}
function S(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue !== !0) return !0;
	return !1;
}
function ye(e, t) {
	return t.map((t) => {
		var n;
		return (n = t).path ?? (n.path = []), t.path.unshift(e), t;
	});
}
function C(e) {
	return typeof e == "string" ? e : e?.message;
}
function w(e, t, n) {
	let r = {
		...e,
		path: e.path ?? []
	};
	return e.message || (r.message = C(e.inst?._zod.def?.error?.(e)) ?? C(t?.error?.(e)) ?? C(n.customError?.(e)) ?? C(n.localeError?.(e)) ?? "Invalid input"), delete r.inst, delete r.continue, t?.reportInput || delete r.input, r;
}
function T(e) {
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
var be = (e, t) => {
	e.name = "$ZodError", Object.defineProperty(e, "_zod", {
		value: e._zod,
		enumerable: !1
	}), Object.defineProperty(e, "issues", {
		value: t,
		enumerable: !1
	}), e.message = JSON.stringify(t, f, 2), Object.defineProperty(e, "toString", {
		value: () => e.message,
		enumerable: !1
	});
}, xe = o("$ZodError", be), Se = o("$ZodError", be, { Parent: Error });
function Ce(e, t = (e) => e.message) {
	let n = {}, r = [];
	for (let i of e.issues) i.path.length > 0 ? (n[i.path[0]] = n[i.path[0]] || [], n[i.path[0]].push(t(i))) : r.push(t(i));
	return {
		formErrors: r,
		fieldErrors: n
	};
}
function we(e, t = (e) => e.message) {
	let n = { _errors: [] }, r = (e) => {
		for (let i of e.issues) if (i.code === "invalid_union" && i.errors.length) i.errors.map((e) => r({ issues: e }));
		else if (i.code === "invalid_key") r({ issues: i.issues });
		else if (i.code === "invalid_element") r({ issues: i.issues });
		else if (i.path.length === 0) n._errors.push(t(i));
		else {
			let e = n, r = 0;
			for (; r < i.path.length;) {
				let n = i.path[r];
				r === i.path.length - 1 ? (e[n] = e[n] || { _errors: [] }, e[n]._errors.push(t(i))) : e[n] = e[n] || { _errors: [] }, e = e[n], r++;
			}
		}
	};
	return r(e), n;
}
//#endregion
//#region node_modules/zod/v4/core/parse.js
var D = (e) => (t, n, r, i) => {
	let a = r ? Object.assign(r, { async: !1 }) : { async: !1 }, o = t._zod.run({
		value: n,
		issues: []
	}, a);
	if (o instanceof Promise) throw new s();
	if (o.issues.length) {
		let t = new (i?.Err ?? e)(o.issues.map((e) => w(e, a, u())));
		throw oe(t, i?.callee), t;
	}
	return o.value;
}, O = (e) => async (t, n, r, i) => {
	let a = r ? Object.assign(r, { async: !0 }) : { async: !0 }, o = t._zod.run({
		value: n,
		issues: []
	}, a);
	if (o instanceof Promise && (o = await o), o.issues.length) {
		let t = new (i?.Err ?? e)(o.issues.map((e) => w(e, a, u())));
		throw oe(t, i?.callee), t;
	}
	return o.value;
}, k = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		async: !1
	} : { async: !1 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	if (a instanceof Promise) throw new s();
	return a.issues.length ? {
		success: !1,
		error: new (e ?? xe)(a.issues.map((e) => w(e, i, u())))
	} : {
		success: !0,
		data: a.value
	};
}, Te = /* @__PURE__ */ k(Se), A = (e) => async (t, n, r) => {
	let i = r ? Object.assign(r, { async: !0 }) : { async: !0 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	return a instanceof Promise && (a = await a), a.issues.length ? {
		success: !1,
		error: new e(a.issues.map((e) => w(e, i, u())))
	} : {
		success: !0,
		data: a.value
	};
}, Ee = /* @__PURE__ */ A(Se), De = (e) => (t, n, r) => {
	let i = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
	return D(e)(t, n, i);
}, Oe = (e) => (t, n, r) => D(e)(t, n, r), ke = (e) => async (t, n, r) => {
	let i = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
	return O(e)(t, n, i);
}, Ae = (e) => async (t, n, r) => O(e)(t, n, r), je = (e) => (t, n, r) => {
	let i = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
	return k(e)(t, n, i);
}, Me = (e) => (t, n, r) => k(e)(t, n, r), Ne = (e) => async (t, n, r) => {
	let i = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
	return A(e)(t, n, i);
}, Pe = (e) => async (t, n, r) => A(e)(t, n, r), Fe = /^[cC][^\s-]{8,}$/, Ie = /^[0-9a-z]+$/, Le = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, Re = /^[0-9a-vA-V]{20}$/, ze = /^[A-Za-z0-9]{27}$/, Be = /^[a-zA-Z0-9_-]{21}$/, Ve = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, He = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, Ue = (e) => e ? RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, We = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, Ge = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function Ke() {
	return new RegExp(Ge, "u");
}
var qe = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Je = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, Ye = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, Xe = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Ze = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, Qe = /^[A-Za-z0-9_-]*$/, $e = /^\+[1-9]\d{6,14}$/, et = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", tt = /* @__PURE__ */ RegExp(`^${et}$`);
function nt(e) {
	let t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
	return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function rt(e) {
	return RegExp(`^${nt(e)}$`);
}
function it(e) {
	let t = nt({ precision: e.precision }), n = ["Z"];
	e.local && n.push(""), e.offset && n.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
	let r = `${t}(?:${n.join("|")})`;
	return RegExp(`^${et}T(?:${r})$`);
}
var at = (e) => {
	let t = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ""}}` : "[\\s\\S]*";
	return RegExp(`^${t}$`);
}, ot = /^-?\d+$/, st = /^-?\d+(?:\.\d+)?$/, ct = /^(?:true|false)$/i, lt = /^[^A-Z]*$/, ut = /^[^a-z]*$/, j = /* @__PURE__ */ o("$ZodCheck", (e, t) => {
	var n;
	e._zod ??= {}, e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
}), dt = {
	number: "number",
	bigint: "bigint",
	object: "date"
}, ft = /* @__PURE__ */ o("$ZodCheckLessThan", (e, t) => {
	j.init(e, t);
	let n = dt[typeof t.value];
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
}), pt = /* @__PURE__ */ o("$ZodCheckGreaterThan", (e, t) => {
	j.init(e, t);
	let n = dt[typeof t.value];
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
}), mt = /* @__PURE__ */ o("$ZodCheckMultipleOf", (e, t) => {
	j.init(e, t), e._zod.onattach.push((e) => {
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
}), ht = /* @__PURE__ */ o("$ZodCheckNumberFormat", (e, t) => {
	j.init(e, t), t.format = t.format || "float64";
	let n = t.format?.includes("int"), r = n ? "int" : "number", [i, a] = de[t.format];
	e._zod.onattach.push((e) => {
		let r = e._zod.bag;
		r.format = t.format, r.minimum = i, r.maximum = a, n && (r.pattern = ot);
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
}), gt = /* @__PURE__ */ o("$ZodCheckMaxLength", (e, t) => {
	var n;
	j.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !ee(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag.maximum ?? Infinity;
		t.maximum < n && (e._zod.bag.maximum = t.maximum);
	}), e._zod.check = (n) => {
		let r = n.value;
		if (r.length <= t.maximum) return;
		let i = T(r);
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
}), _t = /* @__PURE__ */ o("$ZodCheckMinLength", (e, t) => {
	var n;
	j.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !ee(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag.minimum ?? -Infinity;
		t.minimum > n && (e._zod.bag.minimum = t.minimum);
	}), e._zod.check = (n) => {
		let r = n.value;
		if (r.length >= t.minimum) return;
		let i = T(r);
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
}), vt = /* @__PURE__ */ o("$ZodCheckLengthEquals", (e, t) => {
	var n;
	j.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !ee(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag;
		n.minimum = t.length, n.maximum = t.length, n.length = t.length;
	}), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if (i === t.length) return;
		let a = T(r), o = i > t.length;
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
}), M = /* @__PURE__ */ o("$ZodCheckStringFormat", (e, t) => {
	var n, r;
	j.init(e, t), e._zod.onattach.push((e) => {
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
}), yt = /* @__PURE__ */ o("$ZodCheckRegex", (e, t) => {
	M.init(e, t), e._zod.check = (n) => {
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
}), bt = /* @__PURE__ */ o("$ZodCheckLowerCase", (e, t) => {
	t.pattern ??= lt, M.init(e, t);
}), xt = /* @__PURE__ */ o("$ZodCheckUpperCase", (e, t) => {
	t.pattern ??= ut, M.init(e, t);
}), St = /* @__PURE__ */ o("$ZodCheckIncludes", (e, t) => {
	j.init(e, t);
	let n = y(t.includes), r = new RegExp(typeof t.position == "number" ? `^.{${t.position}}${n}` : n);
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
}), Ct = /* @__PURE__ */ o("$ZodCheckStartsWith", (e, t) => {
	j.init(e, t);
	let n = RegExp(`^${y(t.prefix)}.*`);
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
}), wt = /* @__PURE__ */ o("$ZodCheckEndsWith", (e, t) => {
	j.init(e, t);
	let n = RegExp(`.*${y(t.suffix)}$`);
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
}), Tt = /* @__PURE__ */ o("$ZodCheckOverwrite", (e, t) => {
	j.init(e, t), e._zod.check = (e) => {
		e.value = t.tx(e.value);
	};
}), Et = class {
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
}, Dt = {
	major: 4,
	minor: 3,
	patch: 6
}, N = /* @__PURE__ */ o("$ZodType", (e, t) => {
	var n;
	e ??= {}, e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = Dt;
	let r = [...e._zod.def.checks ?? []];
	e._zod.traits.has("$ZodCheck") && r.unshift(e);
	for (let t of r) for (let n of t._zod.onattach) n(e);
	if (r.length === 0) (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
		e._zod.run = e._zod.parse;
	});
	else {
		let t = (e, t, n) => {
			let r = S(e), i;
			for (let a of t) {
				if (a._zod.def.when) {
					if (!a._zod.def.when(e)) continue;
				} else if (r) continue;
				let t = e.issues.length, o = a._zod.check(e);
				if (o instanceof Promise && n?.async === !1) throw new s();
				if (i || o instanceof Promise) i = (i ?? Promise.resolve()).then(async () => {
					await o, e.issues.length !== t && (r ||= S(e, t));
				});
				else {
					if (e.issues.length === t) continue;
					r ||= S(e, t);
				}
			}
			return i ? i.then(() => e) : e;
		}, n = (n, i, a) => {
			if (S(n)) return n.aborted = !0, n;
			let o = t(i, r, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new s();
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
				if (a.async === !1) throw new s();
				return o.then((e) => t(e, r, a));
			}
			return t(o, r, a);
		};
	}
	m(e, "~standard", () => ({
		validate: (t) => {
			try {
				let n = Te(e, t);
				return n.success ? { value: n.data } : { issues: n.error?.issues };
			} catch {
				return Ee(e, t).then((e) => e.success ? { value: e.data } : { issues: e.error?.issues });
			}
		},
		vendor: "zod",
		version: 1
	}));
}), Ot = /* @__PURE__ */ o("$ZodString", (e, t) => {
	N.init(e, t), e._zod.pattern = [...e?._zod.bag?.patterns ?? []].pop() ?? at(e._zod.bag), e._zod.parse = (n, r) => {
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
}), P = /* @__PURE__ */ o("$ZodStringFormat", (e, t) => {
	M.init(e, t), Ot.init(e, t);
}), kt = /* @__PURE__ */ o("$ZodGUID", (e, t) => {
	t.pattern ??= He, P.init(e, t);
}), At = /* @__PURE__ */ o("$ZodUUID", (e, t) => {
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
		t.pattern ??= Ue(e);
	} else t.pattern ??= Ue();
	P.init(e, t);
}), jt = /* @__PURE__ */ o("$ZodEmail", (e, t) => {
	t.pattern ??= We, P.init(e, t);
}), Mt = /* @__PURE__ */ o("$ZodURL", (e, t) => {
	P.init(e, t), e._zod.check = (n) => {
		try {
			let r = n.value.trim(), i = new URL(r);
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
			})), t.normalize ? n.value = i.href : n.value = r;
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
}), Nt = /* @__PURE__ */ o("$ZodEmoji", (e, t) => {
	t.pattern ??= Ke(), P.init(e, t);
}), Pt = /* @__PURE__ */ o("$ZodNanoID", (e, t) => {
	t.pattern ??= Be, P.init(e, t);
}), Ft = /* @__PURE__ */ o("$ZodCUID", (e, t) => {
	t.pattern ??= Fe, P.init(e, t);
}), It = /* @__PURE__ */ o("$ZodCUID2", (e, t) => {
	t.pattern ??= Ie, P.init(e, t);
}), Lt = /* @__PURE__ */ o("$ZodULID", (e, t) => {
	t.pattern ??= Le, P.init(e, t);
}), Rt = /* @__PURE__ */ o("$ZodXID", (e, t) => {
	t.pattern ??= Re, P.init(e, t);
}), zt = /* @__PURE__ */ o("$ZodKSUID", (e, t) => {
	t.pattern ??= ze, P.init(e, t);
}), Bt = /* @__PURE__ */ o("$ZodISODateTime", (e, t) => {
	t.pattern ??= it(t), P.init(e, t);
}), Vt = /* @__PURE__ */ o("$ZodISODate", (e, t) => {
	t.pattern ??= tt, P.init(e, t);
}), Ht = /* @__PURE__ */ o("$ZodISOTime", (e, t) => {
	t.pattern ??= rt(t), P.init(e, t);
}), Ut = /* @__PURE__ */ o("$ZodISODuration", (e, t) => {
	t.pattern ??= Ve, P.init(e, t);
}), Wt = /* @__PURE__ */ o("$ZodIPv4", (e, t) => {
	t.pattern ??= qe, P.init(e, t), e._zod.bag.format = "ipv4";
}), Gt = /* @__PURE__ */ o("$ZodIPv6", (e, t) => {
	t.pattern ??= Je, P.init(e, t), e._zod.bag.format = "ipv6", e._zod.check = (n) => {
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
}), Kt = /* @__PURE__ */ o("$ZodCIDRv4", (e, t) => {
	t.pattern ??= Ye, P.init(e, t);
}), qt = /* @__PURE__ */ o("$ZodCIDRv6", (e, t) => {
	t.pattern ??= Xe, P.init(e, t), e._zod.check = (n) => {
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
function Jt(e) {
	if (e === "") return !0;
	if (e.length % 4 != 0) return !1;
	try {
		return atob(e), !0;
	} catch {
		return !1;
	}
}
var Yt = /* @__PURE__ */ o("$ZodBase64", (e, t) => {
	t.pattern ??= Ze, P.init(e, t), e._zod.bag.contentEncoding = "base64", e._zod.check = (n) => {
		Jt(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
});
function Xt(e) {
	if (!Qe.test(e)) return !1;
	let t = e.replace(/[-_]/g, (e) => e === "-" ? "+" : "/");
	return Jt(t.padEnd(Math.ceil(t.length / 4) * 4, "="));
}
var Zt = /* @__PURE__ */ o("$ZodBase64URL", (e, t) => {
	t.pattern ??= Qe, P.init(e, t), e._zod.bag.contentEncoding = "base64url", e._zod.check = (n) => {
		Xt(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Qt = /* @__PURE__ */ o("$ZodE164", (e, t) => {
	t.pattern ??= $e, P.init(e, t);
});
function $t(e, t = null) {
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
var en = /* @__PURE__ */ o("$ZodJWT", (e, t) => {
	P.init(e, t), e._zod.check = (n) => {
		$t(n.value, t.alg) || n.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), tn = /* @__PURE__ */ o("$ZodNumber", (e, t) => {
	N.init(e, t), e._zod.pattern = e._zod.bag.pattern ?? st, e._zod.parse = (n, r) => {
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
}), nn = /* @__PURE__ */ o("$ZodNumberFormat", (e, t) => {
	ht.init(e, t), tn.init(e, t);
}), rn = /* @__PURE__ */ o("$ZodBoolean", (e, t) => {
	N.init(e, t), e._zod.pattern = ct, e._zod.parse = (n, r) => {
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
}), an = /* @__PURE__ */ o("$ZodUnknown", (e, t) => {
	N.init(e, t), e._zod.parse = (e) => e;
}), on = /* @__PURE__ */ o("$ZodNever", (e, t) => {
	N.init(e, t), e._zod.parse = (t, n) => (t.issues.push({
		expected: "never",
		code: "invalid_type",
		input: t.value,
		inst: e
	}), t);
});
function sn(e, t, n) {
	e.issues.length && t.issues.push(...ye(n, e.issues)), t.value[n] = e.value;
}
var cn = /* @__PURE__ */ o("$ZodArray", (e, t) => {
	N.init(e, t), e._zod.parse = (n, r) => {
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
			s instanceof Promise ? a.push(s.then((t) => sn(t, n, e))) : sn(s, n, e);
		}
		return a.length ? Promise.all(a).then(() => n) : n;
	};
});
function F(e, t, n, r, i) {
	if (e.issues.length) {
		if (i && !(n in r)) return;
		t.issues.push(...ye(n, e.issues));
	}
	e.value === void 0 ? n in r && (t.value[n] = void 0) : t.value[n] = e.value;
}
function ln(e) {
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
function un(e, t, n, r, i, a) {
	let o = [], s = i.keySet, c = i.catchall._zod, l = c.def.type, u = c.optout === "optional";
	for (let i in t) {
		if (s.has(i)) continue;
		if (l === "never") {
			o.push(i);
			continue;
		}
		let a = c.run({
			value: t[i],
			issues: []
		}, r);
		a instanceof Promise ? e.push(a.then((e) => F(e, n, i, t, u))) : F(a, n, i, t, u);
	}
	return o.length && n.issues.push({
		code: "unrecognized_keys",
		keys: o,
		input: t,
		inst: a
	}), e.length ? Promise.all(e).then(() => n) : n;
}
var dn = /* @__PURE__ */ o("$ZodObject", (e, t) => {
	if (N.init(e, t), !Object.getOwnPropertyDescriptor(t, "shape")?.get) {
		let e = t.shape;
		Object.defineProperty(t, "shape", { get: () => {
			let n = { ...e };
			return Object.defineProperty(t, "shape", { value: n }), n;
		} });
	}
	let n = p(() => ln(t));
	m(e._zod, "propValues", () => {
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
	let r = _, i = t.catchall, a;
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
			let n = l[e], r = n._zod.optout === "optional", i = n._zod.run({
				value: s[e],
				issues: []
			}, o);
			i instanceof Promise ? c.push(i.then((n) => F(n, t, e, s, r))) : F(i, t, e, s, r);
		}
		return i ? un(c, s, t, o, n.value, e) : c.length ? Promise.all(c).then(() => t) : t;
	};
}), fn = /* @__PURE__ */ o("$ZodObjectJIT", (e, t) => {
	dn.init(e, t);
	let n = e._zod.parse, r = p(() => ln(t)), i = (e) => {
		let t = new Et([
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
			let n = a[r], o = ie(r), s = e[r]?._zod?.optout === "optional";
			t.write(`const ${n} = ${i(r)};`), s ? t.write(`
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
        
      `) : t.write(`
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
        
      `);
		}
		t.write("payload.value = newResult;"), t.write("return payload;");
		let s = t.compile();
		return (t, n) => s(e, t, n);
	}, a, o = _, s = !l.jitless, c = s && se.value, u = t.catchall, d;
	e._zod.parse = (l, f) => {
		d ??= r.value;
		let p = l.value;
		return o(p) ? s && c && f?.async === !1 && f.jitless !== !0 ? (a ||= i(t.shape), l = a(l, f), u ? un([], p, l, f, d, e) : l) : n(l, f) : (l.issues.push({
			expected: "object",
			code: "invalid_type",
			input: p,
			inst: e
		}), l);
	};
});
function pn(e, t, n, r) {
	for (let n of e) if (n.issues.length === 0) return t.value = n.value, t;
	let i = e.filter((e) => !S(e));
	return i.length === 1 ? (t.value = i[0].value, i[0]) : (t.issues.push({
		code: "invalid_union",
		input: t.value,
		inst: n,
		errors: e.map((e) => e.issues.map((e) => w(e, r, u())))
	}), t);
}
var mn = /* @__PURE__ */ o("$ZodUnion", (e, t) => {
	N.init(e, t), m(e._zod, "optin", () => t.options.some((e) => e._zod.optin === "optional") ? "optional" : void 0), m(e._zod, "optout", () => t.options.some((e) => e._zod.optout === "optional") ? "optional" : void 0), m(e._zod, "values", () => {
		if (t.options.every((e) => e._zod.values)) return new Set(t.options.flatMap((e) => Array.from(e._zod.values)));
	}), m(e._zod, "pattern", () => {
		if (t.options.every((e) => e._zod.pattern)) {
			let e = t.options.map((e) => e._zod.pattern);
			return RegExp(`^(${e.map((e) => te(e.source)).join("|")})$`);
		}
	});
	let n = t.options.length === 1, r = t.options[0]._zod.run;
	e._zod.parse = (i, a) => {
		if (n) return r(i, a);
		let o = !1, s = [];
		for (let e of t.options) {
			let t = e._zod.run({
				value: i.value,
				issues: []
			}, a);
			if (t instanceof Promise) s.push(t), o = !0;
			else {
				if (t.issues.length === 0) return t;
				s.push(t);
			}
		}
		return o ? Promise.all(s).then((t) => pn(t, i, e, a)) : pn(s, i, e, a);
	};
}), hn = /* @__PURE__ */ o("$ZodIntersection", (e, t) => {
	N.init(e, t), e._zod.parse = (e, n) => {
		let r = e.value, i = t.left._zod.run({
			value: r,
			issues: []
		}, n), a = t.right._zod.run({
			value: r,
			issues: []
		}, n);
		return i instanceof Promise || a instanceof Promise ? Promise.all([i, a]).then(([t, n]) => gn(e, t, n)) : gn(e, i, a);
	};
});
function I(e, t) {
	if (e === t || e instanceof Date && t instanceof Date && +e == +t) return {
		valid: !0,
		data: e
	};
	if (v(e) && v(t)) {
		let n = Object.keys(t), r = Object.keys(e).filter((e) => n.indexOf(e) !== -1), i = {
			...e,
			...t
		};
		for (let n of r) {
			let r = I(e[n], t[n]);
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
			let i = e[r], a = t[r], o = I(i, a);
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
function gn(e, t, n) {
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
	}), S(e)) return e;
	let o = I(t.value, n.value);
	if (!o.valid) throw Error(`Unmergable intersection. Error path: ${JSON.stringify(o.mergeErrorPath)}`);
	return e.value = o.data, e;
}
var _n = /* @__PURE__ */ o("$ZodEnum", (e, t) => {
	N.init(e, t);
	let n = d(t.entries), r = new Set(n);
	e._zod.values = r, e._zod.pattern = RegExp(`^(${n.filter((e) => le.has(typeof e)).map((e) => typeof e == "string" ? y(e) : e.toString()).join("|")})$`), e._zod.parse = (t, i) => {
		let a = t.value;
		return r.has(a) || t.issues.push({
			code: "invalid_value",
			values: n,
			input: a,
			inst: e
		}), t;
	};
}), vn = /* @__PURE__ */ o("$ZodTransform", (e, t) => {
	N.init(e, t), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new c(e.constructor.name);
		let i = t.transform(n.value, n);
		if (r.async) return (i instanceof Promise ? i : Promise.resolve(i)).then((e) => (n.value = e, n));
		if (i instanceof Promise) throw new s();
		return n.value = i, n;
	};
});
function yn(e, t) {
	return e.issues.length && t === void 0 ? {
		issues: [],
		value: void 0
	} : e;
}
var bn = /* @__PURE__ */ o("$ZodOptional", (e, t) => {
	N.init(e, t), e._zod.optin = "optional", e._zod.optout = "optional", m(e._zod, "values", () => t.innerType._zod.values ? new Set([...t.innerType._zod.values, void 0]) : void 0), m(e._zod, "pattern", () => {
		let e = t.innerType._zod.pattern;
		return e ? RegExp(`^(${te(e.source)})?$`) : void 0;
	}), e._zod.parse = (e, n) => {
		if (t.innerType._zod.optin === "optional") {
			let r = t.innerType._zod.run(e, n);
			return r instanceof Promise ? r.then((t) => yn(t, e.value)) : yn(r, e.value);
		}
		return e.value === void 0 ? e : t.innerType._zod.run(e, n);
	};
}), xn = /* @__PURE__ */ o("$ZodExactOptional", (e, t) => {
	bn.init(e, t), m(e._zod, "values", () => t.innerType._zod.values), m(e._zod, "pattern", () => t.innerType._zod.pattern), e._zod.parse = (e, n) => t.innerType._zod.run(e, n);
}), Sn = /* @__PURE__ */ o("$ZodNullable", (e, t) => {
	N.init(e, t), m(e._zod, "optin", () => t.innerType._zod.optin), m(e._zod, "optout", () => t.innerType._zod.optout), m(e._zod, "pattern", () => {
		let e = t.innerType._zod.pattern;
		return e ? RegExp(`^(${te(e.source)}|null)$`) : void 0;
	}), m(e._zod, "values", () => t.innerType._zod.values ? new Set([...t.innerType._zod.values, null]) : void 0), e._zod.parse = (e, n) => e.value === null ? e : t.innerType._zod.run(e, n);
}), Cn = /* @__PURE__ */ o("$ZodDefault", (e, t) => {
	N.init(e, t), e._zod.optin = "optional", m(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		if (e.value === void 0) return e.value = t.defaultValue, e;
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => wn(e, t)) : wn(r, t);
	};
});
function wn(e, t) {
	return e.value === void 0 && (e.value = t.defaultValue), e;
}
var Tn = /* @__PURE__ */ o("$ZodPrefault", (e, t) => {
	N.init(e, t), e._zod.optin = "optional", m(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => (n.direction === "backward" || e.value === void 0 && (e.value = t.defaultValue), t.innerType._zod.run(e, n));
}), En = /* @__PURE__ */ o("$ZodNonOptional", (e, t) => {
	N.init(e, t), m(e._zod, "values", () => {
		let e = t.innerType._zod.values;
		return e ? new Set([...e].filter((e) => e !== void 0)) : void 0;
	}), e._zod.parse = (n, r) => {
		let i = t.innerType._zod.run(n, r);
		return i instanceof Promise ? i.then((t) => Dn(t, e)) : Dn(i, e);
	};
});
function Dn(e, t) {
	return !e.issues.length && e.value === void 0 && e.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: e.value,
		inst: t
	}), e;
}
var On = /* @__PURE__ */ o("$ZodCatch", (e, t) => {
	N.init(e, t), m(e._zod, "optin", () => t.innerType._zod.optin), m(e._zod, "optout", () => t.innerType._zod.optout), m(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((r) => (e.value = r.value, r.issues.length && (e.value = t.catchValue({
			...e,
			error: { issues: r.issues.map((e) => w(e, n, u())) },
			input: e.value
		}), e.issues = []), e)) : (e.value = r.value, r.issues.length && (e.value = t.catchValue({
			...e,
			error: { issues: r.issues.map((e) => w(e, n, u())) },
			input: e.value
		}), e.issues = []), e);
	};
}), kn = /* @__PURE__ */ o("$ZodPipe", (e, t) => {
	N.init(e, t), m(e._zod, "values", () => t.in._zod.values), m(e._zod, "optin", () => t.in._zod.optin), m(e._zod, "optout", () => t.out._zod.optout), m(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (e, n) => {
		if (n.direction === "backward") {
			let r = t.out._zod.run(e, n);
			return r instanceof Promise ? r.then((e) => L(e, t.in, n)) : L(r, t.in, n);
		}
		let r = t.in._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => L(e, t.out, n)) : L(r, t.out, n);
	};
});
function L(e, t, n) {
	return e.issues.length ? (e.aborted = !0, e) : t._zod.run({
		value: e.value,
		issues: e.issues
	}, n);
}
var An = /* @__PURE__ */ o("$ZodReadonly", (e, t) => {
	N.init(e, t), m(e._zod, "propValues", () => t.innerType._zod.propValues), m(e._zod, "values", () => t.innerType._zod.values), m(e._zod, "optin", () => t.innerType?._zod?.optin), m(e._zod, "optout", () => t.innerType?._zod?.optout), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then(jn) : jn(r);
	};
});
function jn(e) {
	return e.value = Object.freeze(e.value), e;
}
var Mn = /* @__PURE__ */ o("$ZodCustom", (e, t) => {
	j.init(e, t), N.init(e, t), e._zod.parse = (e, t) => e, e._zod.check = (n) => {
		let r = n.value, i = t.fn(r);
		if (i instanceof Promise) return i.then((t) => Nn(t, n, r, e));
		Nn(i, n, r, e);
	};
});
function Nn(e, t, n, r) {
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
var Pn, Fn = class {
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
function In() {
	return new Fn();
}
(Pn = globalThis).__zod_globalRegistry ?? (Pn.__zod_globalRegistry = In());
var R = globalThis.__zod_globalRegistry;
//#endregion
//#region node_modules/zod/v4/core/api.js
/* @__NO_SIDE_EFFECTS__ */
function Ln(e, t) {
	return new e({
		type: "string",
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Rn(e, t) {
	return new e({
		type: "string",
		format: "email",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function zn(e, t) {
	return new e({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Bn(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Vn(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v4",
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Hn(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v6",
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Un(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v7",
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Wn(e, t) {
	return new e({
		type: "string",
		format: "url",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Gn(e, t) {
	return new e({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Kn(e, t) {
	return new e({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function qn(e, t) {
	return new e({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Jn(e, t) {
	return new e({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Yn(e, t) {
	return new e({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Xn(e, t) {
	return new e({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Zn(e, t) {
	return new e({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Qn(e, t) {
	return new e({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function $n(e, t) {
	return new e({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function er(e, t) {
	return new e({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function tr(e, t) {
	return new e({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function nr(e, t) {
	return new e({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function rr(e, t) {
	return new e({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function ir(e, t) {
	return new e({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function ar(e, t) {
	return new e({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: !1,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function or(e, t) {
	return new e({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: !1,
		local: !1,
		precision: null,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function sr(e, t) {
	return new e({
		type: "string",
		format: "date",
		check: "string_format",
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function cr(e, t) {
	return new e({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function lr(e, t) {
	return new e({
		type: "string",
		format: "duration",
		check: "string_format",
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function ur(e, t) {
	return new e({
		type: "number",
		checks: [],
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function dr(e, t) {
	return new e({
		type: "number",
		check: "number_format",
		abort: !1,
		format: "safeint",
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function fr(e, t) {
	return new e({
		type: "boolean",
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function pr(e) {
	return new e({ type: "unknown" });
}
/* @__NO_SIDE_EFFECTS__ */
function mr(e, t) {
	return new e({
		type: "never",
		...x(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function hr(e, t) {
	return new ft({
		check: "less_than",
		...x(t),
		value: e,
		inclusive: !1
	});
}
/* @__NO_SIDE_EFFECTS__ */
function z(e, t) {
	return new ft({
		check: "less_than",
		...x(t),
		value: e,
		inclusive: !0
	});
}
/* @__NO_SIDE_EFFECTS__ */
function gr(e, t) {
	return new pt({
		check: "greater_than",
		...x(t),
		value: e,
		inclusive: !1
	});
}
/* @__NO_SIDE_EFFECTS__ */
function B(e, t) {
	return new pt({
		check: "greater_than",
		...x(t),
		value: e,
		inclusive: !0
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _r(e, t) {
	return new mt({
		check: "multiple_of",
		...x(t),
		value: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function vr(e, t) {
	return new gt({
		check: "max_length",
		...x(t),
		maximum: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function V(e, t) {
	return new _t({
		check: "min_length",
		...x(t),
		minimum: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function yr(e, t) {
	return new vt({
		check: "length_equals",
		...x(t),
		length: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function br(e, t) {
	return new yt({
		check: "string_format",
		format: "regex",
		...x(t),
		pattern: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function xr(e) {
	return new bt({
		check: "string_format",
		format: "lowercase",
		...x(e)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Sr(e) {
	return new xt({
		check: "string_format",
		format: "uppercase",
		...x(e)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Cr(e, t) {
	return new St({
		check: "string_format",
		format: "includes",
		...x(t),
		includes: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function wr(e, t) {
	return new Ct({
		check: "string_format",
		format: "starts_with",
		...x(t),
		prefix: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Tr(e, t) {
	return new wt({
		check: "string_format",
		format: "ends_with",
		...x(t),
		suffix: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function H(e) {
	return new Tt({
		check: "overwrite",
		tx: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Er(e) {
	return /* @__PURE__ */ H((t) => t.normalize(e));
}
/* @__NO_SIDE_EFFECTS__ */
function Dr() {
	return /* @__PURE__ */ H((e) => e.trim());
}
/* @__NO_SIDE_EFFECTS__ */
function Or() {
	return /* @__PURE__ */ H((e) => e.toLowerCase());
}
/* @__NO_SIDE_EFFECTS__ */
function kr() {
	return /* @__PURE__ */ H((e) => e.toUpperCase());
}
/* @__NO_SIDE_EFFECTS__ */
function Ar() {
	return /* @__PURE__ */ H((e) => ae(e));
}
/* @__NO_SIDE_EFFECTS__ */
function jr(e, t, n) {
	return new e({
		type: "array",
		element: t,
		...x(n)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Mr(e, t, n) {
	return new e({
		type: "custom",
		check: "custom",
		fn: t,
		...x(n)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Nr(e) {
	let t = /* @__PURE__ */ Pr((n) => (n.addIssue = (e) => {
		if (typeof e == "string") n.issues.push(E(e, n.value, t._zod.def));
		else {
			let r = e;
			r.fatal && (r.continue = !1), r.code ??= "custom", r.input ??= n.value, r.inst ??= t, r.continue ??= !t._zod.def.abort, n.issues.push(E(r));
		}
	}, e(n.value, n)));
	return t;
}
/* @__NO_SIDE_EFFECTS__ */
function Pr(e, t) {
	let n = new j({
		check: "custom",
		...x(t)
	});
	return n._zod.check = e, n;
}
//#endregion
//#region node_modules/zod/v4/core/to-json-schema.js
function Fr(e) {
	let t = e?.target ?? "draft-2020-12";
	return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
		processors: e.processors ?? {},
		metadataRegistry: e?.metadata ?? R,
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
function U(e, t, n = {
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
		a && (o.ref ||= a, U(a, t, r), t.seen.get(a).isParent = !0);
	}
	let c = t.metadataRegistry.get(e);
	return c && Object.assign(o.schema, c), t.io === "input" && W(e) && (delete o.schema.examples, delete o.schema.default), t.io === "input" && o.schema._prefault && ((r = o.schema).default ?? (r.default = o.schema._prefault)), delete o.schema._prefault, t.seen.get(e).schema;
}
function Ir(e, t) {
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
function Lr(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	let r = (t) => {
		let n = e.seen.get(t);
		if (n.ref === null) return;
		let i = n.def ?? n.schema, a = { ...i }, o = n.ref;
		if (n.ref = null, o) {
			r(o);
			let n = e.seen.get(o), s = n.schema;
			if (s.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (i.allOf = i.allOf ?? [], i.allOf.push(s)) : Object.assign(i, s), Object.assign(i, a), t._zod.parent === o) for (let e in i) e === "$ref" || e === "allOf" || e in a || delete i[e];
			if (s.$ref && n.def) for (let e in i) e === "$ref" || e === "allOf" || e in n.def && JSON.stringify(i[e]) === JSON.stringify(n.def[e]) && delete i[e];
		}
		let s = t._zod.parent;
		if (s && s !== o) {
			r(s);
			let t = e.seen.get(s);
			if (t?.schema.$ref && (i.$ref = t.schema.$ref, t.def)) for (let e in i) e === "$ref" || e === "allOf" || e in t.def && JSON.stringify(i[e]) === JSON.stringify(t.def[e]) && delete i[e];
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
	let a = e.external?.defs ?? {};
	for (let t of e.seen.entries()) {
		let e = t[1];
		e.def && e.defId && (a[e.defId] = e.def);
	}
	e.external || Object.keys(a).length > 0 && (e.target === "draft-2020-12" ? i.$defs = a : i.definitions = a);
	try {
		let n = JSON.parse(JSON.stringify(i));
		return Object.defineProperty(n, "~standard", {
			value: {
				...t["~standard"],
				jsonSchema: {
					input: G(t, "input", e.processors),
					output: G(t, "output", e.processors)
				}
			},
			enumerable: !1,
			writable: !1
		}), n;
	} catch {
		throw Error("Error converting schema to JSON.");
	}
}
function W(e, t) {
	let n = t ?? { seen: /* @__PURE__ */ new Set() };
	if (n.seen.has(e)) return !1;
	n.seen.add(e);
	let r = e._zod.def;
	if (r.type === "transform") return !0;
	if (r.type === "array") return W(r.element, n);
	if (r.type === "set") return W(r.valueType, n);
	if (r.type === "lazy") return W(r.getter(), n);
	if (r.type === "promise" || r.type === "optional" || r.type === "nonoptional" || r.type === "nullable" || r.type === "readonly" || r.type === "default" || r.type === "prefault") return W(r.innerType, n);
	if (r.type === "intersection") return W(r.left, n) || W(r.right, n);
	if (r.type === "record" || r.type === "map") return W(r.keyType, n) || W(r.valueType, n);
	if (r.type === "pipe") return W(r.in, n) || W(r.out, n);
	if (r.type === "object") {
		for (let e in r.shape) if (W(r.shape[e], n)) return !0;
		return !1;
	}
	if (r.type === "union") {
		for (let e of r.options) if (W(e, n)) return !0;
		return !1;
	}
	if (r.type === "tuple") {
		for (let e of r.items) if (W(e, n)) return !0;
		return !!(r.rest && W(r.rest, n));
	}
	return !1;
}
var Rr = (e, t = {}) => (n) => {
	let r = Fr({
		...n,
		processors: t
	});
	return U(e, r), Ir(r, e), Lr(r, e);
}, G = (e, t, n = {}) => (r) => {
	let { libraryOptions: i, target: a } = r ?? {}, o = Fr({
		...i ?? {},
		target: a,
		io: t,
		processors: n
	});
	return U(e, o), Ir(o, e), Lr(o, e);
}, zr = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
}, Br = (e, t, n, r) => {
	let i = n;
	i.type = "string";
	let { minimum: a, maximum: o, format: s, patterns: c, contentEncoding: l } = e._zod.bag;
	if (typeof a == "number" && (i.minLength = a), typeof o == "number" && (i.maxLength = o), s && (i.format = zr[s] ?? s, i.format === "" && delete i.format, s === "time" && delete i.format), l && (i.contentEncoding = l), c && c.size > 0) {
		let e = [...c];
		e.length === 1 ? i.pattern = e[0].source : e.length > 1 && (i.allOf = [...e.map((e) => ({
			...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: e.source
		}))]);
	}
}, Vr = (e, t, n, r) => {
	let i = n, { minimum: a, maximum: o, format: s, multipleOf: c, exclusiveMaximum: l, exclusiveMinimum: u } = e._zod.bag;
	typeof s == "string" && s.includes("int") ? i.type = "integer" : i.type = "number", typeof u == "number" && (t.target === "draft-04" || t.target === "openapi-3.0" ? (i.minimum = u, i.exclusiveMinimum = !0) : i.exclusiveMinimum = u), typeof a == "number" && (i.minimum = a, typeof u == "number" && t.target !== "draft-04" && (u >= a ? delete i.minimum : delete i.exclusiveMinimum)), typeof l == "number" && (t.target === "draft-04" || t.target === "openapi-3.0" ? (i.maximum = l, i.exclusiveMaximum = !0) : i.exclusiveMaximum = l), typeof o == "number" && (i.maximum = o, typeof l == "number" && t.target !== "draft-04" && (l <= o ? delete i.maximum : delete i.exclusiveMaximum)), typeof c == "number" && (i.multipleOf = c);
}, Hr = (e, t, n, r) => {
	n.type = "boolean";
}, Ur = (e, t, n, r) => {
	n.not = {};
}, Wr = (e, t, n, r) => {
	let i = e._zod.def, a = d(i.entries);
	a.every((e) => typeof e == "number") && (n.type = "number"), a.every((e) => typeof e == "string") && (n.type = "string"), n.enum = a;
}, Gr = (e, t, n, r) => {
	if (t.unrepresentable === "throw") throw Error("Custom types cannot be represented in JSON Schema");
}, Kr = (e, t, n, r) => {
	if (t.unrepresentable === "throw") throw Error("Transforms cannot be represented in JSON Schema");
}, qr = (e, t, n, r) => {
	let i = n, a = e._zod.def, { minimum: o, maximum: s } = e._zod.bag;
	typeof o == "number" && (i.minItems = o), typeof s == "number" && (i.maxItems = s), i.type = "array", i.items = U(a.element, t, {
		...r,
		path: [...r.path, "items"]
	});
}, Jr = (e, t, n, r) => {
	let i = n, a = e._zod.def;
	i.type = "object", i.properties = {};
	let o = a.shape;
	for (let e in o) i.properties[e] = U(o[e], t, {
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
	c.size > 0 && (i.required = Array.from(c)), a.catchall?._zod.def.type === "never" ? i.additionalProperties = !1 : a.catchall ? a.catchall && (i.additionalProperties = U(a.catchall, t, {
		...r,
		path: [...r.path, "additionalProperties"]
	})) : t.io === "output" && (i.additionalProperties = !1);
}, Yr = (e, t, n, r) => {
	let i = e._zod.def, a = i.inclusive === !1, o = i.options.map((e, n) => U(e, t, {
		...r,
		path: [
			...r.path,
			a ? "oneOf" : "anyOf",
			n
		]
	}));
	a ? n.oneOf = o : n.anyOf = o;
}, Xr = (e, t, n, r) => {
	let i = e._zod.def, a = U(i.left, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			0
		]
	}), o = U(i.right, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			1
		]
	}), s = (e) => "allOf" in e && Object.keys(e).length === 1;
	n.allOf = [...s(a) ? a.allOf : [a], ...s(o) ? o.allOf : [o]];
}, Zr = (e, t, n, r) => {
	let i = e._zod.def, a = U(i.innerType, t, r), o = t.seen.get(e);
	t.target === "openapi-3.0" ? (o.ref = i.innerType, n.nullable = !0) : n.anyOf = [a, { type: "null" }];
}, Qr = (e, t, n, r) => {
	let i = e._zod.def;
	U(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, $r = (e, t, n, r) => {
	let i = e._zod.def;
	U(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.default = JSON.parse(JSON.stringify(i.defaultValue));
}, ei = (e, t, n, r) => {
	let i = e._zod.def;
	U(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, t.io === "input" && (n._prefault = JSON.parse(JSON.stringify(i.defaultValue)));
}, ti = (e, t, n, r) => {
	let i = e._zod.def;
	U(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o;
	try {
		o = i.catchValue(void 0);
	} catch {
		throw Error("Dynamic catch values are not supported in JSON Schema");
	}
	n.default = o;
}, ni = (e, t, n, r) => {
	let i = e._zod.def, a = t.io === "input" ? i.in._zod.def.type === "transform" ? i.out : i.in : i.out;
	U(a, t, r);
	let o = t.seen.get(e);
	o.ref = a;
}, ri = (e, t, n, r) => {
	let i = e._zod.def;
	U(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.readOnly = !0;
}, ii = (e, t, n, r) => {
	let i = e._zod.def;
	U(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, ai = /* @__PURE__ */ o("ZodISODateTime", (e, t) => {
	Bt.init(e, t), Y.init(e, t);
});
function oi(e) {
	return /* @__PURE__ */ or(ai, e);
}
var si = /* @__PURE__ */ o("ZodISODate", (e, t) => {
	Vt.init(e, t), Y.init(e, t);
});
function ci(e) {
	return /* @__PURE__ */ sr(si, e);
}
var li = /* @__PURE__ */ o("ZodISOTime", (e, t) => {
	Ht.init(e, t), Y.init(e, t);
});
function ui(e) {
	return /* @__PURE__ */ cr(li, e);
}
var di = /* @__PURE__ */ o("ZodISODuration", (e, t) => {
	Ut.init(e, t), Y.init(e, t);
});
function fi(e) {
	return /* @__PURE__ */ lr(di, e);
}
//#endregion
//#region node_modules/zod/v4/classic/errors.js
var pi = (e, t) => {
	xe.init(e, t), e.name = "ZodError", Object.defineProperties(e, {
		format: { value: (t) => we(e, t) },
		flatten: { value: (t) => Ce(e, t) },
		addIssue: { value: (t) => {
			e.issues.push(t), e.message = JSON.stringify(e.issues, f, 2);
		} },
		addIssues: { value: (t) => {
			e.issues.push(...t), e.message = JSON.stringify(e.issues, f, 2);
		} },
		isEmpty: { get() {
			return e.issues.length === 0;
		} }
	});
};
o("ZodError", pi);
var K = o("ZodError", pi, { Parent: Error }), mi = /* @__PURE__ */ D(K), hi = /* @__PURE__ */ O(K), gi = /* @__PURE__ */ k(K), _i = /* @__PURE__ */ A(K), vi = /* @__PURE__ */ De(K), yi = /* @__PURE__ */ Oe(K), bi = /* @__PURE__ */ ke(K), xi = /* @__PURE__ */ Ae(K), Si = /* @__PURE__ */ je(K), Ci = /* @__PURE__ */ Me(K), wi = /* @__PURE__ */ Ne(K), Ti = /* @__PURE__ */ Pe(K), q = /* @__PURE__ */ o("ZodType", (e, t) => (N.init(e, t), Object.assign(e["~standard"], { jsonSchema: {
	input: G(e, "input"),
	output: G(e, "output")
} }), e.toJSONSchema = Rr(e, {}), e.def = t, e.type = t.type, Object.defineProperty(e, "_def", { value: t }), e.check = (...n) => e.clone(g(t, { checks: [...t.checks ?? [], ...n.map((e) => typeof e == "function" ? { _zod: {
	check: e,
	def: { check: "custom" },
	onattach: []
} } : e)] }), { parent: !0 }), e.with = e.check, e.clone = (t, n) => b(e, t, n), e.brand = () => e, e.register = ((t, n) => (t.add(e, n), e)), e.parse = (t, n) => mi(e, t, n, { callee: e.parse }), e.safeParse = (t, n) => gi(e, t, n), e.parseAsync = async (t, n) => hi(e, t, n, { callee: e.parseAsync }), e.safeParseAsync = async (t, n) => _i(e, t, n), e.spa = e.safeParseAsync, e.encode = (t, n) => vi(e, t, n), e.decode = (t, n) => yi(e, t, n), e.encodeAsync = async (t, n) => bi(e, t, n), e.decodeAsync = async (t, n) => xi(e, t, n), e.safeEncode = (t, n) => Si(e, t, n), e.safeDecode = (t, n) => Ci(e, t, n), e.safeEncodeAsync = async (t, n) => wi(e, t, n), e.safeDecodeAsync = async (t, n) => Ti(e, t, n), e.refine = (t, n) => e.check(Ma(t, n)), e.superRefine = (t) => e.check(Na(t)), e.overwrite = (t) => e.check(/* @__PURE__ */ H(t)), e.optional = () => ma(e), e.exactOptional = () => ga(e), e.nullable = () => va(e), e.nullish = () => ma(va(e)), e.nonoptional = (t) => wa(e, t), e.array = () => ra(e), e.or = (t) => oa([e, t]), e.and = (t) => ca(e, t), e.transform = (t) => Oa(e, fa(t)), e.default = (t) => ba(e, t), e.prefault = (t) => Sa(e, t), e.catch = (t) => Ea(e, t), e.pipe = (t) => Oa(e, t), e.readonly = () => Aa(e), e.describe = (t) => {
	let n = e.clone();
	return R.add(n, { description: t }), n;
}, Object.defineProperty(e, "description", {
	get() {
		return R.get(e)?.description;
	},
	configurable: !0
}), e.meta = (...t) => {
	if (t.length === 0) return R.get(e);
	let n = e.clone();
	return R.add(n, t[0]), n;
}, e.isOptional = () => e.safeParse(void 0).success, e.isNullable = () => e.safeParse(null).success, e.apply = (t) => t(e), e)), Ei = /* @__PURE__ */ o("_ZodString", (e, t) => {
	Ot.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => Br(e, t, n, r);
	let n = e._zod.bag;
	e.format = n.format ?? null, e.minLength = n.minimum ?? null, e.maxLength = n.maximum ?? null, e.regex = (...t) => e.check(/* @__PURE__ */ br(...t)), e.includes = (...t) => e.check(/* @__PURE__ */ Cr(...t)), e.startsWith = (...t) => e.check(/* @__PURE__ */ wr(...t)), e.endsWith = (...t) => e.check(/* @__PURE__ */ Tr(...t)), e.min = (...t) => e.check(/* @__PURE__ */ V(...t)), e.max = (...t) => e.check(/* @__PURE__ */ vr(...t)), e.length = (...t) => e.check(/* @__PURE__ */ yr(...t)), e.nonempty = (...t) => e.check(/* @__PURE__ */ V(1, ...t)), e.lowercase = (t) => e.check(/* @__PURE__ */ xr(t)), e.uppercase = (t) => e.check(/* @__PURE__ */ Sr(t)), e.trim = () => e.check(/* @__PURE__ */ Dr()), e.normalize = (...t) => e.check(/* @__PURE__ */ Er(...t)), e.toLowerCase = () => e.check(/* @__PURE__ */ Or()), e.toUpperCase = () => e.check(/* @__PURE__ */ kr()), e.slugify = () => e.check(/* @__PURE__ */ Ar());
}), Di = /* @__PURE__ */ o("ZodString", (e, t) => {
	Ot.init(e, t), Ei.init(e, t), e.email = (t) => e.check(/* @__PURE__ */ Rn(Oi, t)), e.url = (t) => e.check(/* @__PURE__ */ Wn(Ai, t)), e.jwt = (t) => e.check(/* @__PURE__ */ ar(Gi, t)), e.emoji = (t) => e.check(/* @__PURE__ */ Gn(ji, t)), e.guid = (t) => e.check(/* @__PURE__ */ zn(ki, t)), e.uuid = (t) => e.check(/* @__PURE__ */ Bn(X, t)), e.uuidv4 = (t) => e.check(/* @__PURE__ */ Vn(X, t)), e.uuidv6 = (t) => e.check(/* @__PURE__ */ Hn(X, t)), e.uuidv7 = (t) => e.check(/* @__PURE__ */ Un(X, t)), e.nanoid = (t) => e.check(/* @__PURE__ */ Kn(Mi, t)), e.guid = (t) => e.check(/* @__PURE__ */ zn(ki, t)), e.cuid = (t) => e.check(/* @__PURE__ */ qn(Ni, t)), e.cuid2 = (t) => e.check(/* @__PURE__ */ Jn(Pi, t)), e.ulid = (t) => e.check(/* @__PURE__ */ Yn(Fi, t)), e.base64 = (t) => e.check(/* @__PURE__ */ nr(Hi, t)), e.base64url = (t) => e.check(/* @__PURE__ */ rr(Ui, t)), e.xid = (t) => e.check(/* @__PURE__ */ Xn(Ii, t)), e.ksuid = (t) => e.check(/* @__PURE__ */ Zn(Li, t)), e.ipv4 = (t) => e.check(/* @__PURE__ */ Qn(Ri, t)), e.ipv6 = (t) => e.check(/* @__PURE__ */ $n(zi, t)), e.cidrv4 = (t) => e.check(/* @__PURE__ */ er(Bi, t)), e.cidrv6 = (t) => e.check(/* @__PURE__ */ tr(Vi, t)), e.e164 = (t) => e.check(/* @__PURE__ */ ir(Wi, t)), e.datetime = (t) => e.check(oi(t)), e.date = (t) => e.check(ci(t)), e.time = (t) => e.check(ui(t)), e.duration = (t) => e.check(fi(t));
});
function J(e) {
	return /* @__PURE__ */ Ln(Di, e);
}
var Y = /* @__PURE__ */ o("ZodStringFormat", (e, t) => {
	P.init(e, t), Ei.init(e, t);
}), Oi = /* @__PURE__ */ o("ZodEmail", (e, t) => {
	jt.init(e, t), Y.init(e, t);
}), ki = /* @__PURE__ */ o("ZodGUID", (e, t) => {
	kt.init(e, t), Y.init(e, t);
}), X = /* @__PURE__ */ o("ZodUUID", (e, t) => {
	At.init(e, t), Y.init(e, t);
}), Ai = /* @__PURE__ */ o("ZodURL", (e, t) => {
	Mt.init(e, t), Y.init(e, t);
}), ji = /* @__PURE__ */ o("ZodEmoji", (e, t) => {
	Nt.init(e, t), Y.init(e, t);
}), Mi = /* @__PURE__ */ o("ZodNanoID", (e, t) => {
	Pt.init(e, t), Y.init(e, t);
}), Ni = /* @__PURE__ */ o("ZodCUID", (e, t) => {
	Ft.init(e, t), Y.init(e, t);
}), Pi = /* @__PURE__ */ o("ZodCUID2", (e, t) => {
	It.init(e, t), Y.init(e, t);
}), Fi = /* @__PURE__ */ o("ZodULID", (e, t) => {
	Lt.init(e, t), Y.init(e, t);
}), Ii = /* @__PURE__ */ o("ZodXID", (e, t) => {
	Rt.init(e, t), Y.init(e, t);
}), Li = /* @__PURE__ */ o("ZodKSUID", (e, t) => {
	zt.init(e, t), Y.init(e, t);
}), Ri = /* @__PURE__ */ o("ZodIPv4", (e, t) => {
	Wt.init(e, t), Y.init(e, t);
}), zi = /* @__PURE__ */ o("ZodIPv6", (e, t) => {
	Gt.init(e, t), Y.init(e, t);
}), Bi = /* @__PURE__ */ o("ZodCIDRv4", (e, t) => {
	Kt.init(e, t), Y.init(e, t);
}), Vi = /* @__PURE__ */ o("ZodCIDRv6", (e, t) => {
	qt.init(e, t), Y.init(e, t);
}), Hi = /* @__PURE__ */ o("ZodBase64", (e, t) => {
	Yt.init(e, t), Y.init(e, t);
}), Ui = /* @__PURE__ */ o("ZodBase64URL", (e, t) => {
	Zt.init(e, t), Y.init(e, t);
}), Wi = /* @__PURE__ */ o("ZodE164", (e, t) => {
	Qt.init(e, t), Y.init(e, t);
}), Gi = /* @__PURE__ */ o("ZodJWT", (e, t) => {
	en.init(e, t), Y.init(e, t);
}), Ki = /* @__PURE__ */ o("ZodNumber", (e, t) => {
	tn.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => Vr(e, t, n, r), e.gt = (t, n) => e.check(/* @__PURE__ */ gr(t, n)), e.gte = (t, n) => e.check(/* @__PURE__ */ B(t, n)), e.min = (t, n) => e.check(/* @__PURE__ */ B(t, n)), e.lt = (t, n) => e.check(/* @__PURE__ */ hr(t, n)), e.lte = (t, n) => e.check(/* @__PURE__ */ z(t, n)), e.max = (t, n) => e.check(/* @__PURE__ */ z(t, n)), e.int = (t) => e.check(Yi(t)), e.safe = (t) => e.check(Yi(t)), e.positive = (t) => e.check(/* @__PURE__ */ gr(0, t)), e.nonnegative = (t) => e.check(/* @__PURE__ */ B(0, t)), e.negative = (t) => e.check(/* @__PURE__ */ hr(0, t)), e.nonpositive = (t) => e.check(/* @__PURE__ */ z(0, t)), e.multipleOf = (t, n) => e.check(/* @__PURE__ */ _r(t, n)), e.step = (t, n) => e.check(/* @__PURE__ */ _r(t, n)), e.finite = () => e;
	let n = e._zod.bag;
	e.minValue = Math.max(n.minimum ?? -Infinity, n.exclusiveMinimum ?? -Infinity) ?? null, e.maxValue = Math.min(n.maximum ?? Infinity, n.exclusiveMaximum ?? Infinity) ?? null, e.isInt = (n.format ?? "").includes("int") || Number.isSafeInteger(n.multipleOf ?? .5), e.isFinite = !0, e.format = n.format ?? null;
});
function qi(e) {
	return /* @__PURE__ */ ur(Ki, e);
}
var Ji = /* @__PURE__ */ o("ZodNumberFormat", (e, t) => {
	nn.init(e, t), Ki.init(e, t);
});
function Yi(e) {
	return /* @__PURE__ */ dr(Ji, e);
}
var Xi = /* @__PURE__ */ o("ZodBoolean", (e, t) => {
	rn.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => Hr(e, t, n, r);
});
function Zi(e) {
	return /* @__PURE__ */ fr(Xi, e);
}
var Qi = /* @__PURE__ */ o("ZodUnknown", (e, t) => {
	an.init(e, t), q.init(e, t), e._zod.processJSONSchema = (e, t, n) => void 0;
});
function $i() {
	return /* @__PURE__ */ pr(Qi);
}
var ea = /* @__PURE__ */ o("ZodNever", (e, t) => {
	on.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ur(e, t, n, r);
});
function ta(e) {
	return /* @__PURE__ */ mr(ea, e);
}
var na = /* @__PURE__ */ o("ZodArray", (e, t) => {
	cn.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => qr(e, t, n, r), e.element = t.element, e.min = (t, n) => e.check(/* @__PURE__ */ V(t, n)), e.nonempty = (t) => e.check(/* @__PURE__ */ V(1, t)), e.max = (t, n) => e.check(/* @__PURE__ */ vr(t, n)), e.length = (t, n) => e.check(/* @__PURE__ */ yr(t, n)), e.unwrap = () => e.element;
});
function ra(e, t) {
	return /* @__PURE__ */ jr(na, e, t);
}
var ia = /* @__PURE__ */ o("ZodObject", (e, t) => {
	fn.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => Jr(e, t, n, r), m(e, "shape", () => t.shape), e.keyof = () => ua(Object.keys(e._zod.def.shape)), e.catchall = (t) => e.clone({
		...e._zod.def,
		catchall: t
	}), e.passthrough = () => e.clone({
		...e._zod.def,
		catchall: $i()
	}), e.loose = () => e.clone({
		...e._zod.def,
		catchall: $i()
	}), e.strict = () => e.clone({
		...e._zod.def,
		catchall: ta()
	}), e.strip = () => e.clone({
		...e._zod.def,
		catchall: void 0
	}), e.extend = (t) => me(e, t), e.safeExtend = (t) => he(e, t), e.merge = (t) => ge(e, t), e.pick = (t) => fe(e, t), e.omit = (t) => pe(e, t), e.partial = (...t) => _e(pa, e, t[0]), e.required = (...t) => ve(Ca, e, t[0]);
});
function Z(e, t) {
	return new ia({
		type: "object",
		shape: e ?? {},
		...x(t)
	});
}
var aa = /* @__PURE__ */ o("ZodUnion", (e, t) => {
	mn.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => Yr(e, t, n, r), e.options = t.options;
});
function oa(e, t) {
	return new aa({
		type: "union",
		options: e,
		...x(t)
	});
}
var sa = /* @__PURE__ */ o("ZodIntersection", (e, t) => {
	hn.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => Xr(e, t, n, r);
});
function ca(e, t) {
	return new sa({
		type: "intersection",
		left: e,
		right: t
	});
}
var la = /* @__PURE__ */ o("ZodEnum", (e, t) => {
	_n.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => Wr(e, t, n, r), e.enum = t.entries, e.options = Object.values(t.entries);
	let n = new Set(Object.keys(t.entries));
	e.extract = (e, r) => {
		let i = {};
		for (let r of e) if (n.has(r)) i[r] = t.entries[r];
		else throw Error(`Key ${r} not found in enum`);
		return new la({
			...t,
			checks: [],
			...x(r),
			entries: i
		});
	}, e.exclude = (e, r) => {
		let i = { ...t.entries };
		for (let t of e) if (n.has(t)) delete i[t];
		else throw Error(`Key ${t} not found in enum`);
		return new la({
			...t,
			checks: [],
			...x(r),
			entries: i
		});
	};
});
function ua(e, t) {
	return new la({
		type: "enum",
		entries: Array.isArray(e) ? Object.fromEntries(e.map((e) => [e, e])) : e,
		...x(t)
	});
}
var da = /* @__PURE__ */ o("ZodTransform", (e, t) => {
	vn.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => Kr(e, t, n, r), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new c(e.constructor.name);
		n.addIssue = (r) => {
			if (typeof r == "string") n.issues.push(E(r, n.value, t));
			else {
				let t = r;
				t.fatal && (t.continue = !1), t.code ??= "custom", t.input ??= n.value, t.inst ??= e, n.issues.push(E(t));
			}
		};
		let i = t.transform(n.value, n);
		return i instanceof Promise ? i.then((e) => (n.value = e, n)) : (n.value = i, n);
	};
});
function fa(e) {
	return new da({
		type: "transform",
		transform: e
	});
}
var pa = /* @__PURE__ */ o("ZodOptional", (e, t) => {
	bn.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => ii(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function ma(e) {
	return new pa({
		type: "optional",
		innerType: e
	});
}
var ha = /* @__PURE__ */ o("ZodExactOptional", (e, t) => {
	xn.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => ii(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function ga(e) {
	return new ha({
		type: "optional",
		innerType: e
	});
}
var _a = /* @__PURE__ */ o("ZodNullable", (e, t) => {
	Sn.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => Zr(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function va(e) {
	return new _a({
		type: "nullable",
		innerType: e
	});
}
var ya = /* @__PURE__ */ o("ZodDefault", (e, t) => {
	Cn.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => $r(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function ba(e, t) {
	return new ya({
		type: "default",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : ce(t);
		}
	});
}
var xa = /* @__PURE__ */ o("ZodPrefault", (e, t) => {
	Tn.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => ei(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Sa(e, t) {
	return new xa({
		type: "prefault",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : ce(t);
		}
	});
}
var Ca = /* @__PURE__ */ o("ZodNonOptional", (e, t) => {
	En.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => Qr(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function wa(e, t) {
	return new Ca({
		type: "nonoptional",
		innerType: e,
		...x(t)
	});
}
var Ta = /* @__PURE__ */ o("ZodCatch", (e, t) => {
	On.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => ti(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function Ea(e, t) {
	return new Ta({
		type: "catch",
		innerType: e,
		catchValue: typeof t == "function" ? t : () => t
	});
}
var Da = /* @__PURE__ */ o("ZodPipe", (e, t) => {
	kn.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => ni(e, t, n, r), e.in = t.in, e.out = t.out;
});
function Oa(e, t) {
	return new Da({
		type: "pipe",
		in: e,
		out: t
	});
}
var ka = /* @__PURE__ */ o("ZodReadonly", (e, t) => {
	An.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => ri(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Aa(e) {
	return new ka({
		type: "readonly",
		innerType: e
	});
}
var ja = /* @__PURE__ */ o("ZodCustom", (e, t) => {
	Mn.init(e, t), q.init(e, t), e._zod.processJSONSchema = (t, n, r) => Gr(e, t, n, r);
});
function Ma(e, t = {}) {
	return /* @__PURE__ */ Mr(ja, e, t);
}
function Na(e) {
	return /* @__PURE__ */ Nr(e);
}
//#endregion
//#region src/lib/types.ts
var Pa = Z({
	name: J(),
	hint: J(),
	score: qi()
}), Fa = Z({
	name: J().optional(),
	description: J().optional(),
	emoji: J().optional(),
	slangIntensity: qi().min(0).max(1).optional(),
	moods: ra(Pa).optional(),
	mood: Z({
		enabled: Zi().optional(),
		default: J().optional(),
		override: J().nullable().optional(),
		drift: qi().optional()
	}).optional()
}), Ia = Z({ current: J() }), La = process.env.HOME ?? process.env.USERPROFILE ?? "~", Q = a(La, ".config/claude/personalities/data"), Ra = a(La, ".config/claude/personality-state.json");
async function za(t) {
	return e(t).then(() => !0).catch(() => !1);
}
async function Ba() {
	return await za(Q) ? (await r(Q)).filter((e) => e.endsWith(".json")).map((e) => e.slice(0, -5)).sort() : (await t(Q, { recursive: !0 }), []);
}
async function Va() {
	return await za(Ra) ? Ia.parse(JSON.parse(await n(Ra, "utf8"))) : null;
}
async function Ha(e) {
	await i(Ra, JSON.stringify({ current: e }));
}
async function Ua(e) {
	let t = await n(a(Q, `${e}.json`), "utf8");
	return Fa.parse(JSON.parse(t));
}
//#endregion
//#region src/cli/switch.ts
var [, , Wa] = process.argv, $ = await Ba(), Ga = (await Va())?.current ?? "none";
if (Wa) {
	let e = Wa.trim().toLowerCase();
	$.includes(e) || (console.error(`Unknown personality: "${e}"`), $.length > 0 && console.error(`Available: ${$.join(", ")}`), process.exit(1));
	let t = await Ua(e);
	await Ha(e), console.log(`Switched to ${t.emoji ?? ""} ${t.name ?? e}`), t.description && console.log(`Description: ${t.description.slice(0, 120)}...`), console.log("Personality will take effect on your next message.");
} else if (console.log(`Active personality: ${Ga}\n`), $.length === 0) console.log("No personalities installed."), console.log("Add JSON files to ~/.config/claude/personalities/data/");
else {
	console.log("Available personalities:");
	for (let e of $) {
		let t = await Ua(e), n = e === Ga ? " ← active" : "";
		console.log(`  ${t.emoji ?? ""} ${e} — ${t.name ?? e}${n}`);
	}
	console.log("\nUsage: /personality <name>");
}
//#endregion
