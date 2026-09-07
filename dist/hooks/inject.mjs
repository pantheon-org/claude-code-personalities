#!/usr/bin/env node
import { access as e, mkdir as t, readFile as n, readdir as r, writeFile as i } from "node:fs/promises";
import { join as a } from "node:path";
//#region node_modules/zod/v4/core/util.js
function o(e) {
	let t = Object.values(e).filter((e) => typeof e == "number");
	return Object.entries(e).filter(([e, n]) => t.indexOf(+e) === -1).map(([e, t]) => t);
}
function s(e, t = "|") {
	return e.map((e) => oe(e)).join(t);
}
function c(e, t) {
	return typeof t == "bigint" ? t.toString() : t;
}
function l(e) {
	return { get value() {
		{
			let t = e();
			return Object.defineProperty(this, "value", { value: t }), t;
		}
	} };
}
function u(e) {
	return e == null;
}
function d(e) {
	let t = +!!e.startsWith("^"), n = e.endsWith("$") ? e.length - 1 : e.length;
	return e.slice(t, n);
}
function f(e, t) {
	let n = e / t, r = Math.round(n), i = 4 * 2 ** -52 * Math.max(Math.abs(n), 1);
	return Math.abs(n - r) < i ? 0 : n - r;
}
function p(e, t, n) {
	Object.defineProperty(e, t, {
		value: n,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
function m(...e) {
	let t = {};
	for (let n of e) {
		let e = Object.getOwnPropertyDescriptors(n);
		Object.assign(t, e);
	}
	return Object.defineProperties({}, t);
}
function ee(e) {
	return JSON.stringify(e);
}
function te(e) {
	return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var ne = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {};
function h(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
var re = /* @__PURE__*/ l(() => {
	if (k.jitless || typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return !1;
	try {
		return Function(""), !0;
	} catch {
		return !1;
	}
});
function g(e) {
	if (h(e) === !1) return !1;
	let t = e.constructor;
	if (t === void 0 || typeof t != "function") return !0;
	let n = t.prototype;
	return h(n) !== !1 && Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") !== !1;
}
function ie(e) {
	return g(e) ? { ...e } : Array.isArray(e) ? [...e] : e instanceof Map ? new Map(e) : e instanceof Set ? new Set(e) : e;
}
var ae = /* @__PURE__*/ new Set([
	"string",
	"number",
	"symbol"
]);
function _(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function v(e, t, n) {
	let r = new e._zod.constr(t ?? e._zod.def);
	return (!t || n?.parent) && (r._zod.parent = e), r;
}
function y(e) {
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
function oe(e) {
	return typeof e == "bigint" ? e.toString() + "n" : typeof e == "string" ? `"${e}"` : `${e}`;
}
function se(e) {
	return Object.keys(e).filter((t) => e[t]._zod.optin !== void 0 && e[t]._zod.optout === "optional");
}
var ce = {
	safeint: [-(2 ** 53 - 1), 2 ** 53 - 1],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function le(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".pick() cannot be used on object schemas containing refinements");
	return v(e, m(e._zod.def, {
		get shape() {
			let e = {};
			for (let r of Reflect.ownKeys(t)) {
				if (!Object.prototype.hasOwnProperty.call(n.shape, r)) throw Error(`Unrecognized key: "${String(r)}"`);
				t[r] && p(e, r, n.shape[r]);
			}
			return p(this, "shape", e), e;
		},
		checks: []
	}));
}
function ue(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".omit() cannot be used on object schemas containing refinements");
	return v(e, m(e._zod.def, {
		get shape() {
			let r = { ...e._zod.def.shape };
			for (let e of Reflect.ownKeys(t)) {
				if (!Object.prototype.hasOwnProperty.call(n.shape, e)) throw Error(`Unrecognized key: "${String(e)}"`);
				t[e] && delete r[e];
			}
			return p(this, "shape", r), r;
		},
		checks: []
	}));
}
function de(e, t) {
	if (!g(t)) throw Error("Invalid input to extend: expected a plain object");
	let n = e._zod.def.checks;
	if (n && n.length > 0) {
		let n = e._zod.def.shape;
		for (let e of Reflect.ownKeys(t)) if (Object.getOwnPropertyDescriptor(n, e) !== void 0) throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return v(e, m(e._zod.def, { get shape() {
		let n = {
			...e._zod.def.shape,
			...t
		};
		return p(this, "shape", n), n;
	} }));
}
function fe(e, t) {
	if (!g(t)) throw Error("Invalid input to safeExtend: expected a plain object");
	return v(e, m(e._zod.def, { get shape() {
		let n = {
			...e._zod.def.shape,
			...t
		};
		return p(this, "shape", n), n;
	} }));
}
function pe(e, t) {
	if (!t?._zod?.def) throw Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
	if (e._zod.def.checks?.length) throw Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	return v(e, m(e._zod.def, {
		get shape() {
			let n = {
				...e._zod.def.shape,
				...t._zod.def.shape
			};
			return p(this, "shape", n), n;
		},
		get catchall() {
			return t._zod.def.catchall;
		},
		checks: t._zod.def.checks ?? []
	}));
}
function me(e, t, n, r = "partial") {
	let i = t._zod.def.checks;
	if (i && i.length > 0) throw Error(`.${r}() cannot be used on object schemas containing refinements`);
	return v(t, m(t._zod.def, {
		get shape() {
			let r = t._zod.def.shape, i = { ...r };
			if (n) for (let t of Reflect.ownKeys(n)) {
				if (!Object.prototype.hasOwnProperty.call(r, t)) throw Error(`Unrecognized key: "${String(t)}"`);
				n[t] && (i[t] = e ? new e({
					type: "optional",
					innerType: r[t]
				}) : r[t]);
			}
			else for (let t of Reflect.ownKeys(r)) i[t] = e ? new e({
				type: "optional",
				innerType: r[t]
			}) : r[t];
			return p(this, "shape", i), i;
		},
		checks: []
	}));
}
function he(e, t, n) {
	return v(t, m(t._zod.def, { get shape() {
		let r = t._zod.def.shape, i = { ...r };
		if (n) for (let t of Reflect.ownKeys(n)) {
			if (!Object.prototype.hasOwnProperty.call(i, t)) throw Error(`Unrecognized key: "${String(t)}"`);
			n[t] && (i[t] = new e({
				type: "nonoptional",
				innerType: r[t]
			}));
		}
		else for (let t of Reflect.ownKeys(r)) i[t] = new e({
			type: "nonoptional",
			innerType: r[t]
		});
		return p(this, "shape", i), i;
	} }));
}
function b(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue !== !0) return !0;
	return !1;
}
function ge(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue === !1) return !0;
	return !1;
}
function _e(e, t) {
	return t.map((t) => {
		var n;
		return (n = t).path ?? (n.path = []), t.path.unshift(e), t;
	});
}
function x(e) {
	return typeof e == "string" ? e : e?.message;
}
function ve(e, t, n) {
	var r;
	for (let i = t; i < e.length; i++) (r = e[i]).schema ?? (r.schema = n);
}
function S(e, t, n) {
	var r;
	let i = e.inst?._zod?.traits;
	i?.has("$ZodType") && (i.has("$ZodCheck") ? (r = e).schema ?? (r.schema = e.inst) : e.schema = e.inst);
	let a = e.schema === e.inst ? void 0 : e.schema?._zod.def?.error, o = e.message ? e.message : x(e.inst?._zod.def?.error?.(e)) ?? x(a?.(e)) ?? x(t?.error?.(e)) ?? x(n.customError?.(e)) ?? x(n.localeError?.(e)) ?? "Invalid input", { inst: s, schema: c, continue: l, input: u, ...d } = e;
	return d.path ??= [], d.message = o, t?.reportInput && (d.input = u), d;
}
var ye = /[\uD800-\uDBFF]/;
function be(e) {
	let t = e.length;
	if (!ye.test(e)) return t;
	let n = t;
	for (let r = 0; r < t - 1; r++) (e.charCodeAt(r) & 64512) == 55296 && (e.charCodeAt(r + 1) & 64512) == 56320 && (n--, r++);
	return n;
}
function xe(e) {
	return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function Se(e) {
	let t = typeof e;
	switch (t) {
		case "number": return Number.isNaN(e) ? "nan" : "number";
		case "object": {
			if (e === null) return "null";
			if (Array.isArray(e)) return "array";
			let t = e;
			if (t && Object.getPrototypeOf(t) !== Object.prototype && "constructor" in t && t.constructor) return t.constructor.name;
		}
	}
	return t;
}
function C(...e) {
	let [t, n, r] = e;
	return typeof t == "string" ? {
		message: t,
		code: "custom",
		input: n,
		inst: r
	} : { ...t };
}
function Ce(e, t) {
	for (let n in t) {
		let r = Object.getOwnPropertyDescriptor(t, n);
		r.get ? Object.defineProperty(e, n, {
			...r,
			enumerable: !1
		}) : Te(e, n, r.value);
	}
}
function w(e, t, n, r = !0) {
	return Object.defineProperty(e, t, {
		configurable: !0,
		writable: !0,
		enumerable: r,
		value: n
	}), n;
}
function we(e, t, n) {
	return w(e, t, n, !1);
}
function Te(e, t, n) {
	Object.defineProperty(e, t, {
		configurable: !0,
		get() {
			return this == null ? n : w(this, t, n.bind(this));
		},
		set(e) {
			w(this, t, e);
		}
	});
}
function Ee(e, t) {
	let n = Object.getPrototypeOf(e);
	return t in n ? void 0 : n;
}
var De, T = !1, Oe = {
	configurable: !0,
	get() {
		T = !0;
	}
};
function E(e, t, n) {
	let r = Object.getPrototypeOf(e._zod);
	if (t in r && De !== e._zod) {
		De = void 0;
		return;
	}
	De = e._zod, Object.defineProperty(r, t, {
		configurable: !0,
		get() {
			Object.defineProperty(this, t, Oe);
			let e = T;
			T = !1;
			try {
				let r = n(this);
				return T ? delete this[t] : Object.defineProperty(this, t, {
					configurable: !0,
					writable: !0,
					value: r
				}), T ||= e, r;
			} catch (n) {
				throw delete this[t], T ||= e, n;
			}
		},
		set(e) {
			Object.defineProperty(this, t, {
				configurable: !0,
				writable: !0,
				value: e
			});
		}
	});
}
function ke(e, t, n, r) {
	let i = Ee(e, t);
	i && Object.defineProperty(i, t, {
		configurable: !0,
		get() {
			let e = {
				configurable: !0,
				writable: !0,
				enumerable: r,
				value: void 0
			};
			return Object.defineProperty(this, t, e), e.value = n(this), Object.defineProperty(this, t, e), e.value;
		},
		set(e) {
			Object.defineProperty(this, t, {
				configurable: !0,
				writable: !0,
				enumerable: r,
				value: e
			});
		}
	});
}
var Ae = "~constantCatch";
function je(e) {
	let t = () => e;
	return t[Ae] = !0, t;
}
//#endregion
//#region node_modules/zod/v4/core/core.js
var Me, Ne = {
	value: void 0,
	enumerable: !1
}, Pe = "captureStackTrace" in Error ? Error : null;
function Fe(e) {
	let t = Pe;
	if (t) {
		let n = t.stackTraceLimit;
		if (typeof n == "number") {
			try {
				t.stackTraceLimit = 0;
			} catch {
				return Pe = null, new e();
			}
			try {
				return new e();
			} finally {
				t.stackTraceLimit = n;
			}
		}
	}
	return new e();
}
function D(e, t, n, r) {
	let i = {};
	function a(e) {
		this.def = e, this.constr = d, this.traits = /* @__PURE__ */ new Set();
	}
	a.prototype = i;
	let o = n, s = o && /* @__PURE__ */ new WeakSet();
	function c(n, r) {
		if (!n._zod) {
			Ne.value = new a(r);
			try {
				Object.defineProperty(n, "_zod", Ne);
			} finally {
				Ne.value = void 0;
			}
		}
		if (n._zod.traits.has(e)) return;
		if (n._zod.traits.add(e), t(n, r), s) {
			let e = Object.getPrototypeOf(n), t = n._zod.constr.prototype, r = e;
			for (; r && r !== t;) r = Object.getPrototypeOf(r);
			let i = r ?? e;
			s.has(i) || (s.add(i), Ce(i, o));
		}
		let i = d.prototype;
		for (let e in i) Object.prototype.hasOwnProperty.call(i, e) && (e in n || (n[e] = i[e].bind(n)));
	}
	let l = r?.Parent ?? Object;
	class u extends l {}
	Object.defineProperty(u, "name", { value: e });
	function d(e) {
		let t = r?.Parent ? Fe(u) : this;
		c(t, e);
		let n = t._zod.deferred;
		if (n) {
			for (let e of n) e();
			t._zod.deferred = void 0;
		}
		let i = globalThis.__zod_globalConfig?.postProcessor;
		return i && i(t), t;
	}
	return Object.defineProperty(d, "init", { value: c }), Object.defineProperty(d, Symbol.hasInstance, { value: (t) => r?.Parent && t instanceof r.Parent ? !0 : t?._zod?.traits?.has(e) }), Object.defineProperty(d, "name", { value: e }), d;
}
var O = class extends Error {
	constructor() {
		super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
	}
}, Ie = class extends Error {
	constructor(e) {
		super(`Encountered unidirectional transform during encode: ${e}`), this.name = "ZodEncodeError";
	}
};
(Me = globalThis).__zod_globalConfig ?? (Me.__zod_globalConfig = {});
var k = globalThis.__zod_globalConfig;
function A(e) {
	return e && Object.assign(k, e), k;
}
//#endregion
//#region node_modules/zod/v4/core/errors.js
function Le() {
	let e = this._zod;
	return e.message ??= JSON.stringify(e.def, c, 2), e.message;
}
function Re(e) {
	this._zod.message = e;
}
var ze = {
	get: Le,
	set: Re,
	enumerable: !0,
	configurable: !0
}, Be = {
	value: void 0,
	enumerable: !1
}, Ve = {
	value: void 0,
	enumerable: !1
}, He = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]), Ue = (e, t) => {
	e.name = "$ZodError", Be.value = e._zod, Object.defineProperty(e, "_zod", Be), Ve.value = t, Object.defineProperty(e, "issues", Ve), Be.value = void 0, Ve.value = void 0, Object.defineProperty(e, "message", ze);
	let n = Object.getPrototypeOf(e);
	He.has(n) || (He.add(n), Object.defineProperty(n, "toString", {
		configurable: !0,
		enumerable: !1,
		get() {
			let e = () => this.message;
			return Object.defineProperty(this, "toString", {
				value: e,
				configurable: !0,
				writable: !0
			}), e;
		},
		set(e) {
			Object.defineProperty(this, "toString", {
				value: e,
				configurable: !0,
				writable: !0
			});
		}
	}));
}, We = D("$ZodError", Ue), Ge = D("$ZodError", Ue, void 0, { Parent: Error });
function Ke(e, t, n) {
	return Object.prototype.hasOwnProperty.call(e, t) || (t === "__proto__" ? Object.defineProperty(e, t, {
		value: n(),
		writable: !0,
		enumerable: !0,
		configurable: !0
	}) : e[t] = n()), e[t];
}
function qe(e, t = (e) => e.message) {
	let n = {}, r = [];
	for (let i of e.issues) i.path.length > 0 ? Ke(n, i.path[0], () => []).push(t(i)) : r.push(t(i));
	return {
		formErrors: r,
		fieldErrors: n
	};
}
function Je(e, t = (e) => e.message) {
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
					let n = e[i], o = i === e.length - 1;
					if (n === "_errors") {
						o && r._errors.push(t(a)), i++;
						continue;
					}
					Object.prototype.hasOwnProperty.call(r, n) || Object.defineProperty(r, n, {
						value: { _errors: [] },
						enumerable: !0,
						writable: !0,
						configurable: !0
					});
					let s = r[n];
					o && s._errors.push(t(a)), r = s, i++;
				}
			}
		}
	};
	return r(e), n;
}
//#endregion
//#region node_modules/zod/v4/core/parse.js
function j(e, t) {
	return {
		callee: t?.callee ?? e,
		Err: t?.Err
	};
}
var Ye = (e) => {
	let t = (n, r, i, a) => {
		let o = i ? {
			...i,
			async: !1
		} : { async: !1 }, s = n._zod.run({
			value: r,
			issues: []
		}, o);
		if (s instanceof Promise) throw new O();
		if (s.issues.length) {
			let n = new ((a?.Err) ?? e)(s.issues.map((e) => S(e, o, A())));
			throw ne(n, a?.callee ?? t), n;
		}
		return s.value;
	};
	return t;
}, Xe = (e) => {
	let t = async (n, r, i, a) => {
		let o = i ? {
			...i,
			async: !0
		} : { async: !0 }, s = n._zod.run({
			value: r,
			issues: []
		}, o);
		if (s instanceof Promise && (s = await s), s.issues.length) {
			let n = new ((a?.Err) ?? e)(s.issues.map((e) => S(e, o, A())));
			throw ne(n, a?.callee ?? t), n;
		}
		return s.value;
	};
	return t;
}, Ze = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		async: !1
	} : { async: !1 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	if (a instanceof Promise) throw new O();
	return a.issues.length ? {
		success: !1,
		error: new (e ?? We)(a.issues.map((e) => S(e, i, A())))
	} : {
		success: !0,
		data: a.value
	};
}, Qe = /* @__PURE__*/ Ze(Ge), $e = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		async: !0
	} : { async: !0 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	return a instanceof Promise && (a = await a), a.issues.length ? {
		success: !1,
		error: new e(a.issues.map((e) => S(e, i, A())))
	} : {
		success: !0,
		data: a.value
	};
}, et = /* @__PURE__*/ $e(Ge), tt = (e) => {
	let t = Ye(e), n = (e, r, i, a) => {
		let o = i ? {
			...i,
			direction: "backward"
		} : { direction: "backward" };
		return t(e, r, o, j(n, a));
	};
	return n;
}, nt = (e) => {
	let t = Ye(e), n = (e, r, i, a) => t(e, r, i, j(n, a));
	return n;
}, rt = (e) => {
	let t = Xe(e), n = async (e, r, i, a) => {
		let o = i ? {
			...i,
			direction: "backward"
		} : { direction: "backward" };
		return await t(e, r, o, j(n, a));
	};
	return n;
}, it = (e) => {
	let t = Xe(e), n = async (e, r, i, a) => await t(e, r, i, j(n, a));
	return n;
}, at = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return Ze(e)(t, n, i);
}, ot = (e) => (t, n, r) => Ze(e)(t, n, r), st = (e) => async (t, n, r) => {
	let i = r ? {
		...r,
		direction: "backward"
	} : { direction: "backward" };
	return $e(e)(t, n, i);
}, ct = (e) => async (t, n, r) => $e(e)(t, n, r), lt = /^[cC][0-9a-z]{6,}$/, ut = /^[0-9a-z]+$/, dt = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/, ft = /^[0-9a-vA-V]{20}$/, pt = /^[A-Za-z0-9]{27}$/, mt = /^[a-zA-Z0-9_-]{21}$/;
function ht(e) {
	return RegExp(`^[a-zA-Z0-9_-]{${e}}$`);
}
var gt = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, _t = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, vt = (e) => e ? RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, yt = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, bt = "^[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$";
function xt() {
	return new RegExp(bt, "u");
}
var St = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Ct = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, wt = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, Tt = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Et = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, Dt = /^[A-Za-z0-9_-]*$/, Ot = /^https?$/, kt = /^\+[1-9]\d{6,14}$/, At = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))";
function jt(e) {
	return RegExp(`^${e}$`);
}
var Mt = /*@__PURE__*/ jt(At);
function Nt(e) {
	let t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
	return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : e.seconds ? `${t}:[0-5]\\d(?:\\.\\d+)?` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function Pt(e) {
	return RegExp(`^${Nt(e)}$`);
}
function Ft(e) {
	let t = ["Z"];
	e.offset && t.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
	let n = `${Nt({
		precision: e.precision,
		seconds: !0
	})}(?:${t.join("|")})`, r = e.local ? `${n}|${Nt({ precision: e.precision })}` : n;
	return RegExp(`^${At}T(?:${r})$`);
}
var It = (e) => {
	let t = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ""}}` : "[\\s\\S]*";
	return RegExp(`^${t}$`);
}, Lt = /^-?\d+$/, Rt = /^-?\d+(?:\.\d+)?$/, zt = /^(?:true|false)$/i, Bt = /^[^A-Z]*$/, Vt = /^[^a-z]*$/, M = /*@__PURE__*/ D("$ZodCheck", (e, t) => {
	var n;
	e._zod ??= {}, e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
}), Ht = (e) => {
	let t = e.value;
	return !u(t) && t.length !== void 0;
}, Ut = {
	number: "number",
	bigint: "bigint",
	object: "date"
}, Wt = /*@__PURE__*/ D("$ZodCheckLessThan", (e, t) => {
	M.init(e, t);
	let n = Ut[typeof t.value];
	e._zod.onattach.push((e) => {
		let n = e._zod.bag, r = (t.inclusive ? n.maximum : n.exclusiveMaximum) ?? Infinity;
		t.value < r && (t.inclusive ? n.maximum = t.value : n.exclusiveMaximum = t.value);
	}), e._zod.check = (r) => {
		(t.inclusive ? r.value <= t.value : r.value < t.value) || r.issues.push({
			origin: Ut[typeof r.value] ?? n,
			code: "too_big",
			maximum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), Gt = /*@__PURE__*/ D("$ZodCheckGreaterThan", (e, t) => {
	M.init(e, t);
	let n = Ut[typeof t.value];
	e._zod.onattach.push((e) => {
		let n = e._zod.bag, r = (t.inclusive ? n.minimum : n.exclusiveMinimum) ?? -Infinity;
		t.value > r && (t.inclusive ? n.minimum = t.value : n.exclusiveMinimum = t.value);
	}), e._zod.check = (r) => {
		(t.inclusive ? r.value >= t.value : r.value > t.value) || r.issues.push({
			origin: Ut[typeof r.value] ?? n,
			code: "too_small",
			minimum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), Kt = /*@__PURE__*/ D("$ZodCheckMultipleOf", (e, t) => {
	M.init(e, t), e._zod.onattach.push((e) => {
		var n;
		(n = e._zod.bag).multipleOf ?? (n.multipleOf = t.value);
	}), e._zod.check = (n) => {
		if (typeof n.value != typeof t.value) throw Error("Cannot mix number and bigint in multiple_of check.");
		(typeof n.value == "bigint" ? t.value !== BigInt(0) && n.value % t.value === BigInt(0) : f(n.value, t.value) === 0) || n.issues.push({
			origin: typeof n.value,
			code: "not_multiple_of",
			divisor: t.value,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), qt = /*@__PURE__*/ D("$ZodCheckNumberFormat", (e, t) => {
	M.init(e, t), t.format = t.format || "float64";
	let n = t.format?.includes("int"), r = n ? "int" : "number", [i, a] = ce[t.format];
	e._zod.onattach.push((e) => {
		let r = e._zod.bag;
		r.format = t.format, r.minimum = i, r.maximum = a, n && (r.pattern = Lt);
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
}), Jt = /*@__PURE__*/ D("$ZodCheckMaxLength", (e, t) => {
	var n;
	M.init(e, t), (n = e._zod.def).when ?? (n.when = Ht), e._zod.onattach.push((e) => {
		let n = e._zod.bag.maximum ?? Infinity;
		t.maximum < n && (e._zod.bag.maximum = t.maximum);
	}), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if ((typeof r == "string" && i > t.maximum ? be(r) : i) <= t.maximum) return;
		let a = xe(r);
		n.issues.push({
			origin: a,
			code: "too_big",
			maximum: t.maximum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), Yt = /*@__PURE__*/ D("$ZodCheckMinLength", (e, t) => {
	var n;
	M.init(e, t), (n = e._zod.def).when ?? (n.when = Ht), e._zod.onattach.push((e) => {
		let n = e._zod.bag.minimum ?? -Infinity;
		t.minimum > n && (e._zod.bag.minimum = t.minimum);
	}), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if ((typeof r == "string" && i >= t.minimum && i < t.minimum * 2 ? be(r) : i) >= t.minimum) return;
		let a = xe(r);
		n.issues.push({
			origin: a,
			code: "too_small",
			minimum: t.minimum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), Xt = /*@__PURE__*/ D("$ZodCheckLengthEquals", (e, t) => {
	var n;
	M.init(e, t), (n = e._zod.def).when ?? (n.when = Ht), e._zod.onattach.push((e) => {
		let n = e._zod.bag;
		n.minimum = t.length, n.maximum = t.length, n.length = t.length;
	}), e._zod.check = (n) => {
		let r = n.value, i = r.length, a = typeof r == "string" && i >= t.length && i <= t.length * 2 ? be(r) : i;
		if (a === t.length) return;
		let o = xe(r), s = a > t.length;
		n.issues.push({
			origin: o,
			...s ? {
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
}), N = /*@__PURE__*/ D("$ZodCheckStringFormat", (e, t) => {
	var n, r;
	M.init(e, t), e._zod.onattach.push((e) => {
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
}), Zt = /*@__PURE__*/ D("$ZodCheckRegex", (e, t) => {
	N.init(e, t), e._zod.check = (n) => {
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
}), Qt = /*@__PURE__*/ D("$ZodCheckLowerCase", (e, t) => {
	t.pattern ??= Bt, N.init(e, t);
}), $t = /*@__PURE__*/ D("$ZodCheckUpperCase", (e, t) => {
	t.pattern ??= Vt, N.init(e, t);
}), en = /*@__PURE__*/ D("$ZodCheckIncludes", (e, t) => {
	M.init(e, t);
	let n = _(t.includes), r = new RegExp(typeof t.position == "number" ? `^.{${t.position},}${n}` : n);
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
}), tn = /*@__PURE__*/ D("$ZodCheckStartsWith", (e, t) => {
	M.init(e, t);
	let n = RegExp(`^${_(t.prefix)}.*`);
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
}), nn = /*@__PURE__*/ D("$ZodCheckEndsWith", (e, t) => {
	M.init(e, t);
	let n = RegExp(`.*${_(t.suffix)}$`);
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
}), rn = /*@__PURE__*/ D("$ZodCheckOverwrite", (e, t) => {
	M.init(e, t), e._zod.check = (e) => {
		e.value = t.tx(e.value);
	};
}), an = class {
	constructor(e = [], t = {}) {
		this.content = [], this.indent = 0, this.args = e, this.closed = t;
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
		let e = Function, t = this?.content ?? [""];
		return new e(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {\n${t.join("\n")}\n};`)(...Object.values(this.closed));
	}
}, on = {
	major: 4,
	minor: 5,
	patch: 4
}, P = /*@__PURE__*/ D("$ZodType", (e, t) => {
	var n;
	e ??= {}, e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = on;
	let r = e._zod.def.checks, i = e._zod.traits.has("$ZodCheck") ? [e, ...r ?? []] : r?.length ? [...r] : [];
	for (let t of i) for (let n of t._zod.onattach) n(e);
	if (i.length === 0) (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
		e._zod.run = e._zod.parse;
	});
	else {
		let t = (t, n, r) => {
			if (t.memo) return t;
			let i = b(t), a;
			for (let o of n) {
				if (o._zod.def.when) {
					if (ge(t) || !o._zod.def.when(t)) continue;
				} else if (i) continue;
				let n = t.issues.length, s = o._zod.check(t);
				if (s instanceof Promise && r?.async === !1) throw new O();
				if (a || s instanceof Promise) a = (a ?? Promise.resolve()).then(async () => {
					await s, t.issues.length !== n && (ve(t.issues, n, e), i ||= b(t, n));
				});
				else {
					if (t.issues.length === n) continue;
					ve(t.issues, n, e), i ||= b(t, n);
				}
			}
			return a ? a.then(() => t) : t;
		}, n = (n, r, a) => {
			if (b(n)) return n.aborted = !0, n;
			let o = t(r, i, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new O();
				return o.then((t) => e._zod.parse(t, a));
			}
			return e._zod.parse(o, a);
		};
		e._zod.run = (r, a) => {
			if (a.skipChecks) return e._zod.parse(r, a);
			if (a.direction === "backward") {
				let t = e._zod.parse({
					value: r.value,
					issues: []
				}, {
					...a,
					skipChecks: !0
				});
				return t instanceof Promise ? t.then((e) => n(e, r, a)) : n(t, r, a);
			}
			let o = e._zod.parse(r, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new O();
				return o.then((e) => t(e, i, a));
			}
			return t(o, i, a);
		};
	}
}, {
	get "~standard"() {
		return we(this, "~standard", cn(this));
	},
	set "~standard"(e) {
		w(this, "~standard", e);
	}
}), sn = (e) => e.success ? { value: e.data } : { issues: e.error?.issues };
function cn(e) {
	return {
		validate: (t) => {
			try {
				return sn(Qe(e, t));
			} catch {
				return et(e, t).then(sn);
			}
		},
		vendor: "zod",
		version: 1
	};
}
var ln = /*@__PURE__*/ D("$ZodString", (e, t) => {
	P.init(e, t), e._zod.pattern = [...e?._zod.bag?.patterns ?? []].pop() ?? It(e._zod.bag), e._zod.parse = (n, r) => {
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
}), F = /*@__PURE__*/ D("$ZodStringFormat", (e, t) => {
	N.init(e, t), ln.init(e, t);
}), un = /*@__PURE__*/ D("$ZodGUID", (e, t) => {
	t.pattern ??= _t, F.init(e, t);
}), dn = /*@__PURE__*/ D("$ZodUUID", (e, t) => {
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
		t.pattern ??= vt(e);
	} else t.pattern ??= vt();
	F.init(e, t);
}), fn = /*@__PURE__*/ D("$ZodEmail", (e, t) => {
	t.pattern ??= yt, F.init(e, t);
});
function pn(e, t) {
	if (!t.normalize && t.protocol?.source === Ot.source && !/^https?:\/\//i.test(e)) return 1;
	try {
		return new URL(e);
	} catch {
		return 2;
	}
}
var mn = /[\t\n\r]/g;
function hn(e) {
	return e.replace(mn, "");
}
function gn(e, t) {
	return t.lastIndex = 0, t.test(e.hostname);
}
function _n(e, t) {
	return t.lastIndex = 0, t.test(e.protocol.endsWith(":") ? e.protocol.slice(0, -1) : e.protocol);
}
var vn = /*@__PURE__*/ D("$ZodURL", (e, t) => {
	F.init(e, t), e._zod.check = (n) => {
		try {
			let r = n.value.trim(), i = pn(r, t);
			if (i === 1) {
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
			if (i === 2) {
				n.issues.push({
					code: "invalid_format",
					format: "url",
					input: n.value,
					inst: e,
					continue: !t.abort
				});
				return;
			}
			t.hostname && !gn(i, t.hostname) && n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid hostname",
				pattern: t.hostname.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			}), t.protocol && !_n(i, t.protocol) && n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid protocol",
				pattern: t.protocol.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			}), n.value = t.normalize ? i.href : hn(r);
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
}), yn = /*@__PURE__*/ D("$ZodEmoji", (e, t) => {
	t.pattern ??= xt(), F.init(e, t);
}), bn = /*@__PURE__*/ D("$ZodNanoID", (e, t) => {
	if (t.length !== void 0 && (!Number.isInteger(t.length) || t.length < 1)) throw Error(`Invalid nanoid length: ${t.length}`);
	t.pattern ??= t.length === void 0 ? mt : ht(t.length), F.init(e, t);
}), xn = /*@__PURE__*/ D("$ZodCUID", (e, t) => {
	t.pattern ??= lt, F.init(e, t);
}), Sn = /*@__PURE__*/ D("$ZodCUID2", (e, t) => {
	t.pattern ??= ut, F.init(e, t);
}), Cn = /*@__PURE__*/ D("$ZodULID", (e, t) => {
	t.pattern ??= dt, F.init(e, t);
}), wn = /*@__PURE__*/ D("$ZodXID", (e, t) => {
	t.pattern ??= ft, F.init(e, t);
}), Tn = /*@__PURE__*/ D("$ZodKSUID", (e, t) => {
	t.pattern ??= pt, F.init(e, t);
}), En = /*@__PURE__*/ D("$ZodISODateTime", (e, t) => {
	t.pattern ??= Ft(t), F.init(e, t), (t.local || t.precision === -1) && (e._zod.bag.laxFormat = !0, e._zod.onattach.push((e) => {
		e._zod.bag.laxFormat = !0;
	}));
}), Dn = /*@__PURE__*/ D("$ZodISODate", (e, t) => {
	t.pattern ??= Mt, F.init(e, t);
}), On = /*@__PURE__*/ D("$ZodISOTime", (e, t) => {
	t.pattern ??= Pt(t), F.init(e, t);
}), kn = /*@__PURE__*/ D("$ZodISODuration", (e, t) => {
	t.pattern ??= gt, F.init(e, t);
}), An = /*@__PURE__*/ D("$ZodIPv4", (e, t) => {
	t.pattern ??= St, F.init(e, t), e._zod.bag.format = "ipv4";
}), jn = /^[0-9a-fA-F:.]+$/;
function Mn(e) {
	if (!jn.test(e)) return !1;
	try {
		return new URL(`http://[${e}]`), !0;
	} catch {
		return !1;
	}
}
var Nn = /*@__PURE__*/ D("$ZodIPv6", (e, t) => {
	t.pattern ??= Ct, F.init(e, t), e._zod.bag.format = "ipv6", e._zod.check = (n) => {
		Mn(n.value) || n.issues.push({
			code: "invalid_format",
			format: "ipv6",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Pn = /*@__PURE__*/ D("$ZodCIDRv4", (e, t) => {
	t.pattern ??= wt, F.init(e, t);
});
function Fn(e) {
	let t = e.split("/");
	if (t.length !== 2) return !1;
	let [n, r] = t;
	if (!r) return !1;
	let i = Number(r);
	return `${i}` !== r || i < 0 || i > 128 ? !1 : Mn(n);
}
var In = /*@__PURE__*/ D("$ZodCIDRv6", (e, t) => {
	t.pattern ??= Tt, F.init(e, t), e._zod.check = (n) => {
		Fn(n.value) || n.issues.push({
			code: "invalid_format",
			format: "cidrv6",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
});
function Ln(e) {
	if (e === "") return !0;
	if (/\s/.test(e) || e.length % 4 != 0) return !1;
	try {
		return atob(e), !0;
	} catch {
		return !1;
	}
}
var Rn = /*@__PURE__*/ D("$ZodBase64", (e, t) => {
	t.pattern ??= Et, F.init(e, t), e._zod.bag.contentEncoding = "base64", e._zod.check = (n) => {
		Ln(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
});
function zn(e) {
	if (!Dt.test(e)) return !1;
	let t = e.replace(/[-_]/g, (e) => e === "-" ? "+" : "/");
	return Ln(t.padEnd(Math.ceil(t.length / 4) * 4, "="));
}
var Bn = /*@__PURE__*/ D("$ZodBase64URL", (e, t) => {
	t.pattern ??= Dt, F.init(e, t), e._zod.bag.contentEncoding = "base64url", e._zod.check = (n) => {
		zn(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Vn = /*@__PURE__*/ D("$ZodE164", (e, t) => {
	t.pattern ??= kt, F.init(e, t);
});
function Hn(e, t = null) {
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
var Un = /*@__PURE__*/ D("$ZodJWT", (e, t) => {
	F.init(e, t), e._zod.check = (n) => {
		Hn(n.value, t.alg) || n.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Wn = /*@__PURE__*/ D("$ZodNumber", (e, t) => {
	P.init(e, t), e._zod.pattern = e._zod.bag.pattern ?? Rt, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = Number(n.value);
		} catch {}
		let i = n.value;
		if (typeof i == "number" && !Number.isNaN(i) && Number.isFinite(i)) return n;
		let a = typeof i == "number" ? Number.isNaN(i) ? "NaN" : Number.isFinite(i) ? void 0 : String(i) : void 0;
		return n.issues.push({
			expected: "number",
			code: "invalid_type",
			input: i,
			inst: e,
			...a ? { received: a } : {}
		}), n;
	};
}), Gn = /*@__PURE__*/ D("$ZodNumberFormat", (e, t) => {
	qt.init(e, t), Wn.init(e, t);
}), Kn = /*@__PURE__*/ D("$ZodBoolean", (e, t) => {
	P.init(e, t), e._zod.pattern = zt, e._zod.parse = (n, r) => {
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
}), qn = /*@__PURE__*/ D("$ZodUnknown", (e, t) => {
	P.init(e, t), e._zod.parse = (e) => e;
}), Jn = /*@__PURE__*/ D("$ZodNever", (e, t) => {
	P.init(e, t), e._zod.parse = (t, n) => (t.issues.push({
		expected: "never",
		code: "invalid_type",
		input: t.value,
		inst: e
	}), t);
});
function Yn(e, t, n) {
	e.issues.length && t.issues.push(..._e(n, e.issues)), t.value[n] = e.value;
}
var Xn = /*@__PURE__*/ D("$ZodArray", (e, t) => {
	P.init(e, t);
	let n = k.memoizer;
	n?.attach(e), e._zod.parse = (r, i) => {
		let a = r.value;
		if (!Array.isArray(a)) return r.issues.push({
			expected: "array",
			code: "invalid_type",
			input: a,
			inst: e
		}), r;
		r.value = n ? n.alloc(e, r, Array(a.length), i) : Array(a.length);
		let o = [];
		for (let e = 0; e < a.length; e++) {
			let n = a[e], s = t.element._zod.run({
				value: n,
				issues: []
			}, i);
			s instanceof Promise ? o.push(s.then((t) => Yn(t, r, e))) : Yn(s, r, e);
		}
		return o.length ? Promise.all(o).then(() => r) : r;
	};
});
function I(e, t, n, r, i, a) {
	let o = n in r, s = a === "optional";
	if (o || !s || i !== "optional") {
		if (e.issues.length) {
			if (i !== void 0 && s && !o) return;
			t.issues.push(..._e(n, e.issues));
		}
		if (!o && i === void 0) {
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
}
var Zn = [];
function Qn(e) {
	let t = Object.keys(e.shape), n = Object.getOwnPropertySymbols(e.shape), r = n.length ? n : Zn, i = r.length ? [...t, ...r] : t;
	for (let t of i) if (!e.shape?.[t]?._zod?.traits?.has("$ZodType")) throw Error(`Invalid element at key "${String(t)}": expected a Zod schema`);
	let a = se(e.shape);
	return {
		...e,
		allKeys: i,
		symbolKeys: r,
		keySet: new Set(t),
		numKeys: t.length,
		optionalKeys: new Set(a)
	};
}
function $n(e, t, n, r, i, a) {
	let o = [], s = i.keySet, c = i.catchall._zod, l = c.def.type, u = c.optin, d = c.optout;
	for (let i in t) {
		if (s.has(i)) continue;
		if (i === "__proto__") {
			l === "never" && o.push(i);
			continue;
		}
		if (l === "never") {
			o.push(i);
			continue;
		}
		let a = c.run({
			value: t[i],
			issues: []
		}, r);
		a instanceof Promise ? e.push(a.then((e) => I(e, n, i, t, u, d))) : I(a, n, i, t, u, d);
	}
	return o.length && n.issues.push({
		code: "unrecognized_keys",
		keys: o,
		input: t,
		inst: a,
		continue: !0
	}), e.length ? Promise.all(e).then(() => n) : n;
}
var er = /* @__PURE__ */ new WeakMap(), tr = /*@__PURE__*/ D("$ZodObject", (e, t) => {
	if (P.init(e, t), !Object.getOwnPropertyDescriptor(t, "shape")?.get) {
		let e = t.shape;
		er.set(t, e), Object.defineProperty(t, "shape", { get: () => {
			let n = { ...e };
			return Object.defineProperty(t, "shape", { value: n }), er.set(t, n), n;
		} });
	}
	let n = l(() => Qn(t));
	E(e, "propValues", (e) => {
		let t = e.def.shape, n = {};
		for (let e in t) {
			let r = t[e]._zod;
			if (r.values) {
				Object.prototype.hasOwnProperty.call(n, e) || p(n, e, /* @__PURE__ */ new Set());
				for (let t of r.values) n[e].add(t);
				r.optin !== void 0 && n[e].add(void 0);
			}
		}
		return n;
	});
	let r = h, i = t.catchall, a, o = k.memoizer;
	o?.attach(e), e._zod.parse = (t, s) => {
		a ??= n.value;
		let c = t.value;
		if (!r(c)) return t.issues.push({
			expected: "object",
			code: "invalid_type",
			input: c,
			inst: e
		}), t;
		t.value = o ? o.alloc(e, t, {}, s) : {};
		let l = [], u = a.shape;
		for (let e of a.allKeys) {
			if (e === "__proto__") continue;
			let n = u[e], r = n._zod.optin, i = n._zod.optout, a = n._zod.run({
				value: c[e],
				issues: []
			}, s);
			a instanceof Promise ? l.push(a.then((n) => I(n, t, e, c, r, i))) : I(a, t, e, c, r, i);
		}
		return i ? $n(l, c, t, s, n.value, e) : l.length ? Promise.all(l).then(() => t) : t;
	};
}), nr = /*@__PURE__*/ D("$ZodObjectJIT", (e, t) => {
	tr.init(e, t);
	let n = e._zod.parse, r = l(() => Qn(t)), i = k.memoizer, a = (t) => {
		let n = r.value, a = n.symbolKeys, o = new an(["payload", "ctx"], {
			shape: t,
			inst: e,
			memo: i,
			syms: a
		}), s = (e) => `shape[${e}]._zod.run({ value: input[${e}], issues: [] }, ctx)`, c = (e, t) => `
          for (let i = 0; i < ${e}.issues.length; i++) {
            const iss = ${e}.issues[i];
            iss.path = iss.path ? [${t}, ...iss.path] : [${t}];
            payload.issues.push(iss);
          }`;
		o.write("const input = payload.value;");
		let l = Object.create(null), u = 0;
		for (let e of n.allKeys) l[e] = `key_${u++}`;
		o.write(i ? "const newResult = memo.alloc(inst, payload, {}, ctx);" : "const newResult = {};");
		for (let e of n.allKeys) {
			if (e === "__proto__") continue;
			let n = l[e], r = typeof e == "symbol" ? `syms[${a.indexOf(e)}]` : ee(e), i = `${r} in input`, u = t[e], d = u?._zod?.optin, f = d !== void 0, p = u?._zod?.optout === "optional";
			if (o.write(`const ${n} = ${s(r)};`), f && p) {
				let e = d === "optional" ? `${n}_present` : `${n}.value !== undefined || ${n}_present`;
				o.write(`
        const ${n}_present = ${i};
        if (!${n}.issues.length || ${n}_present) {
          if (${n}.issues.length) {${c(n, r)}
          }

          if (${e}) {
            newResult[${r}] = ${n}.value;
          }
        }

      `);
			} else f ? o.write(`
        if (${n}.issues.length) {${c(n, r)}
        }

        if (${n}.value === undefined) {
          if (${i}) {
            newResult[${r}] = undefined;
          }
        } else {
          newResult[${r}] = ${n}.value;
        }

      `) : o.write(`
        const ${n}_present = ${i};
        if (${n}.issues.length) {${c(n, r)}
        }
        if (!${n}_present && !${n}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${r}]
          });
        }

        if (${n}_present) {
          newResult[${r}] = ${n}.value;
        }

      `);
		}
		return o.write("payload.value = newResult;"), o.write("return payload;"), o.compile();
	}, o, s = h, c = !k.jitless, u = c && re.value, d = t.catchall, f;
	e._zod.parse = (i, l) => {
		f ??= r.value;
		let p = i.value;
		return s(p) ? c && u && l?.async === !1 && l.jitless !== !0 ? (o ||= a(t.shape), i = o(i, l), d ? $n([], p, i, l, f, e) : i) : n(i, l) : (i.issues.push({
			expected: "object",
			code: "invalid_type",
			input: p,
			inst: e
		}), i);
	};
});
function rr(e, t, n, r) {
	for (let n of e) if (n.issues.length === 0) return t.value = n.value, t;
	let i = e.filter((e) => !b(e));
	return i.length === 1 ? (t.value = i[0].value, i[0]) : (t.issues.push({
		code: "invalid_union",
		input: t.value,
		inst: n,
		errors: e.map((e) => e.issues.map((e) => S(e, r, A())))
	}), t);
}
var ir = /*@__PURE__*/ D("$ZodUnion", (e, t) => {
	P.init(e, t), E(e, "optin", (e) => e.def.options.some((e) => e._zod.optin === "defaulted") ? "defaulted" : e.def.options.some((e) => e._zod.optin !== void 0) ? "optional" : void 0), E(e, "optout", (e) => e.def.options.some((e) => e._zod.optout === "optional") ? "optional" : void 0), E(e, "values", (e) => {
		if (e.def.options.every((e) => e._zod.values)) return new Set(e.def.options.flatMap((e) => Array.from(e._zod.values)));
	}), E(e, "pattern", (e) => {
		if (e.def.options.every((e) => e._zod.pattern)) {
			let t = e.def.options.map((e) => e._zod.pattern);
			return RegExp(`^(${t.map((e) => d(e.source)).join("|")})$`);
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
		return a ? Promise.all(o).then((t) => rr(t, r, e, i)) : rr(o, r, e, i);
	};
}), ar = /*@__PURE__*/ D("$ZodIntersection", (e, t) => {
	P.init(e, t), e._zod.parse = (e, n) => {
		let r = e.value, i = t.left._zod.run({
			value: r,
			issues: []
		}, n), a = t.right._zod.run({
			value: r,
			issues: []
		}, n);
		return i instanceof Promise || a instanceof Promise ? Promise.all([i, a]).then(([t, n]) => sr(e, t, n)) : sr(e, i, a);
	};
});
function or(e, t) {
	if (e === t || e instanceof Date && t instanceof Date && +e == +t) return {
		valid: !0,
		data: e
	};
	if (g(e) && g(t)) {
		let n = Object.keys(t), r = Object.keys(e).filter((e) => n.indexOf(e) !== -1), i = {
			...e,
			...t
		};
		Object.prototype.hasOwnProperty.call(i, "__proto__") && delete i.__proto__;
		for (let n of r) {
			if (n === "__proto__") continue;
			let r = or(e[n], t[n]);
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
			let i = e[r], a = t[r], o = or(i, a);
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
function sr(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i, a = /* @__PURE__ */ new Map(), o = (e, t) => {
		let n;
		if (e.code === "unrecognized_keys" && !e.path?.length) i ??= e, n = e.keys;
		else if (e.code === "invalid_key" && e.origin === "record" && e.path?.length === 1) {
			let t = String(e.path[0]);
			a.has(t) || a.set(t, e), n = [t];
		} else return !1;
		for (let e of n) r.has(e) || r.set(e, {}), r.get(e)[t] = !0;
		return !0;
	};
	for (let n of t.issues) o(n, "l") || e.issues.push(n);
	for (let t of n.issues) o(t, "r") || e.issues.push(t);
	let s = [...r].filter(([, e]) => e.l && e.r).map(([e]) => e);
	if (s.length) {
		let t = i ? s.filter((e) => i.keys.includes(e)) : [];
		t.length && e.issues.push({
			...i,
			keys: t
		});
		for (let n of s) !t.includes(n) && a.has(n) && e.issues.push(a.get(n));
	}
	let c = or(t.value, n.value);
	if (!c.valid) {
		if (b(e)) return e;
		throw Error(`Unmergable intersection. Error path: ${JSON.stringify(c.mergeErrorPath)}`);
	}
	return e.value = c.data, e;
}
var cr = /*@__PURE__*/ D("$ZodEnum", (e, t) => {
	P.init(e, t);
	let n = o(t.entries), r = new Set(n);
	e._zod.values = r;
	let i = n.filter((e) => ae.has(typeof e));
	e._zod.pattern = RegExp(i.length ? `^(${i.map((e) => _(e.toString())).join("|")})$` : "^[^\\s\\S]$"), e._zod.parse = (t, i) => {
		let a = t.value;
		return r.has(a) || t.issues.push({
			code: "invalid_value",
			values: n,
			input: a,
			inst: e
		}), t;
	};
}), lr = /*@__PURE__*/ D("$ZodTransform", (e, t) => {
	P.init(e, t), e._zod.optin = "optional", k.memoizer?.guard(e), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new Ie(e.constructor.name);
		let i = t.transform(n.value, n);
		if (r.async) return (i instanceof Promise ? i : Promise.resolve(i)).then((e) => (n.value = e, n));
		if (i instanceof Promise) throw new O();
		return n.value = i, n;
	};
});
function ur(e, t) {
	return e.value = t.issues.length ? void 0 : t.value, e;
}
var dr = /*@__PURE__*/ D("$ZodOptional", (e, t) => {
	P.init(e, t), E(e, "optin", (e) => e.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), e._zod.optout = "optional", E(e, "values", (e) => {
		let t = e.def.innerType._zod.values;
		return t ? /* @__PURE__ */ new Set([...t, void 0]) : void 0;
	}), E(e, "pattern", (e) => {
		let t = e.def.innerType._zod.pattern;
		return t ? RegExp(`^(${d(t.source)})?$`) : void 0;
	}), e._zod.parse = (e, n) => {
		if (e.value === void 0) {
			if (t.innerType._zod.optin !== "defaulted") return e;
			let r = t.innerType._zod.run({
				value: e.value,
				issues: []
			}, n);
			return r instanceof Promise ? r.then((t) => ur(e, t)) : ur(e, r);
		}
		return t.innerType._zod.run(e, n);
	};
}), fr = /*@__PURE__*/ D("$ZodExactOptional", (e, t) => {
	dr.init(e, t), E(e, "values", (e) => e.def.innerType._zod.values), E(e, "pattern", (e) => e.def.innerType._zod.pattern), e._zod.parse = (e, n) => t.innerType._zod.run(e, n);
}), pr = /*@__PURE__*/ D("$ZodNullable", (e, t) => {
	P.init(e, t), E(e, "optin", (e) => e.def.innerType._zod.optin), E(e, "optout", (e) => e.def.innerType._zod.optout), E(e, "pattern", (e) => {
		let t = e.def.innerType._zod.pattern;
		return t ? RegExp(`^(${d(t.source)}|null)$`) : void 0;
	}), E(e, "values", (e) => e.def.innerType._zod.values ? /* @__PURE__ */ new Set([...e.def.innerType._zod.values, null]) : void 0), e._zod.parse = (e, n) => e.value === null ? e : t.innerType._zod.run(e, n);
}), mr = /*@__PURE__*/ D("$ZodDefault", (e, t) => {
	P.init(e, t), e._zod.optin = "defaulted", E(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		if (e.value === void 0) return e.value = t.defaultValue, e;
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => hr(e, t)) : hr(r, t);
	};
});
function hr(e, t) {
	return e.value === void 0 && (e.value = t.defaultValue), e;
}
var gr = /*@__PURE__*/ D("$ZodPrefault", (e, t) => {
	P.init(e, t), e._zod.optin = "defaulted", E(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => (n.direction === "backward" || e.value === void 0 && (e.value = t.defaultValue), t.innerType._zod.run(e, n));
}), _r = /*@__PURE__*/ D("$ZodNonOptional", (e, t) => {
	P.init(e, t), E(e, "values", (e) => {
		let t = e.def.innerType._zod.values;
		return t ? new Set([...t].filter((e) => e !== void 0)) : void 0;
	}), e._zod.parse = (n, r) => {
		let i = t.innerType._zod.run(n, r);
		return i instanceof Promise ? i.then((t) => vr(t, e)) : vr(i, e);
	};
});
function vr(e, t) {
	return !e.issues.length && e.value === void 0 && e.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: e.value,
		inst: t
	}), e;
}
function yr(e, t, n, r) {
	return t.issues.length ? (e.value = n.catchValue({
		...t,
		value: e.value,
		error: { issues: t.issues.map((e) => S(e, r, A())) },
		input: e.value
	}), e) : (e.value = t.value, t.memo && (e.memo = !0), e);
}
var br = /*@__PURE__*/ D("$ZodCatch", (e, t) => {
	P.init(e, t), E(e, "optin", (e) => e.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional"), E(e, "optout", (e) => e.def.innerType._zod.optout), E(e, "values", (e) => e.def.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run({
			value: e.value,
			issues: []
		}, n);
		return r instanceof Promise ? r.then((r) => yr(e, r, t, n)) : yr(e, r, t, n);
	};
}), xr = /*@__PURE__*/ D("$ZodPipe", (e, t) => {
	P.init(e, t), E(e, "values", (e) => e.def.in._zod.values), E(e, "optin", (e) => e.def.in._zod.optin), E(e, "optout", (e) => e.def.out._zod.optout), E(e, "propValues", (e) => e.def.in._zod.propValues), e._zod.parse = (e, n) => {
		if (n.direction === "backward") {
			let r = t.out._zod.run(e, n);
			return r instanceof Promise ? r.then((e) => L(e, t.in, n)) : L(r, t.in, n);
		}
		let r = t.in._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => L(e, t.out, n)) : L(r, t.out, n);
	};
});
function L(e, t, n) {
	return e.issues.some((e) => e.code !== "unrecognized_keys") ? (e.aborted = !0, e) : t._zod.run({
		value: e.value,
		issues: e.issues
	}, n);
}
var Sr = /*@__PURE__*/ D("$ZodReadonly", (e, t) => {
	P.init(e, t), E(e, "propValues", (e) => e.def.innerType._zod.propValues), E(e, "values", (e) => e.def.innerType._zod.values), E(e, "optin", (e) => e.def.innerType?._zod?.optin), E(e, "optout", (e) => e.def.innerType?._zod?.optout), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then(Cr) : Cr(r);
	};
});
function Cr(e) {
	return e.memo || (e.value = Object.freeze(e.value)), e;
}
var wr = /*@__PURE__*/ D("$ZodCustom", (e, t) => {
	M.init(e, t), P.init(e, t), e._zod.parse = (e, t) => e, e._zod.check = (n) => {
		let r = n.value, i = t.fn(r);
		if (i instanceof Promise) return i.then((t) => Tr(t, n, r, e));
		Tr(i, n, r, e);
	};
});
function Tr(e, t, n, r) {
	if (!e) {
		let e = {
			code: "custom",
			input: n,
			inst: r,
			path: [...r._zod.def.path ?? []],
			continue: !r._zod.def.abort
		};
		r._zod.def.params && (e.params = r._zod.def.params), t.issues.push(C(e));
	}
}
//#endregion
//#region node_modules/zod/v4/core/memoizer.js
var Er = class extends Error {
	constructor() {
		super("Cannot parse a reference cycle that closes through a transform"), this.name = "ZodCyclicError";
	}
}, Dr = "~memo", Or = [];
function kr(e) {
	return e.map((e) => e.path ? {
		...e,
		path: e.path.slice()
	} : { ...e });
}
var Ar = /*@__PURE__*/ new WeakMap();
function jr(e, t) {
	let n = Ar.get(e);
	if (n !== void 0) return n;
	if (t.has(e)) return !0;
	t.add(e);
	let r = !1, i = (e) => {
		!r && e?._zod && jr(e, t) && (r = !0);
	}, a = e._zod.def;
	switch (a.type) {
		case "object":
			for (let e of Reflect.ownKeys(a.shape)) i(a.shape[e]);
			i(a.catchall);
			break;
		case "array":
			i(a.element);
			break;
		case "tuple":
			for (let e of a.items) i(e);
			i(a.rest);
			break;
		case "record":
		case "map":
			i(a.keyType), i(a.valueType);
			break;
		case "set":
			i(a.valueType);
			break;
		case "union":
			for (let e of a.options) i(e);
			break;
		case "intersection":
			i(a.left), i(a.right);
			break;
		case "optional":
		case "nullable":
		case "default":
		case "prefault":
		case "catch":
		case "readonly":
		case "nonoptional":
		case "promise":
		case "success":
			i(a.innerType);
			break;
		case "pipe":
			i(a.in), i(a.out);
			break;
		case "function":
			i(a.input), i(a.output);
			break;
		case "lazy":
			i(e._zod.innerType);
			break;
		case "template_literal":
		case "string":
		case "number":
		case "int":
		case "boolean":
		case "bigint":
		case "symbol":
		case "undefined":
		case "null":
		case "void":
		case "never":
		case "any":
		case "unknown":
		case "date":
		case "nan":
		case "enum":
		case "literal":
		case "file":
		case "transform":
		case "custom": break;
		default: for (let e in a) {
			let t = Object.getOwnPropertyDescriptor(a, e);
			if (!t || t.get) continue;
			let n = t.value;
			if (n && typeof n == "object") {
				if (n._zod) i(n);
				else if (Array.isArray(n)) for (let e of n) i(e);
			}
		}
	}
	return t.delete(e), Ar.set(e, r), r;
}
function Mr(e, t) {
	let n = e.buckets.get(t);
	return n || (n = /* @__PURE__ */ new Map(), e.buckets.set(t, n)), n;
}
var R, z = [], Nr = {
	alloc(e, t, n) {
		let r = R;
		if (!r) return n;
		R = void 0;
		let i = {
			value: n,
			issues: null
		};
		return r.set(t.value, i), z.push(i), n;
	},
	guard(e) {
		var t;
		(t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
			let t = e._zod.parse, n = (e, n) => {
				if (n.direction !== "backward" && Fr(n, e.value)) throw new Er();
				return t(e, n);
			};
			e._zod.parse = n, e._zod.run === t && (e._zod.run = n);
		});
	},
	attach(e) {
		var t;
		let n, r, i;
		(t = e._zod).deferred ?? (t.deferred = []), e._zod.deferred.push(() => {
			let t = e._zod.parse, a = (o, s) => {
				if (n === void 0 && (n = jr(e, /* @__PURE__ */ new Set()), !n)) return e._zod.parse = t, e._zod.run === a && (e._zod.run = t), t(o, s);
				let c = o.value;
				if (typeof c != "object" || !c) return t(o, s);
				let l = s[Dr];
				l || (l = {
					buckets: /* @__PURE__ */ new Map(),
					backEdges: void 0
				}, s[Dr] = l);
				let u;
				r === s ? u = i : (u = Mr(l, e), r = s, i = u);
				let d = u.get(c);
				if (d) return o.value = d.value, d.issues ? d.issues.length && o.issues.push(...kr(d.issues)) : (o.memo = !0, l.backEdges ?? (l.backEdges = /* @__PURE__ */ new Set()), l.backEdges.add(d.value)), o;
				R = u;
				let f = z.length, p = t(o, s);
				R = void 0;
				let m = z.length > f ? z.pop() : void 0;
				return p instanceof Promise ? p.then((e) => (m && (m.issues = e.issues.length ? kr(e.issues) : Or), e)) : (m && (m.issues = p.issues.length ? kr(p.issues) : Or), p);
			};
			e._zod.parse = a, e._zod.run === t && (e._zod.run = a);
		});
	}
};
function Pr() {
	return Nr;
}
function Fr(e, t) {
	let n = e[Dr]?.backEdges;
	return n !== void 0 && typeof t == "object" && !!t && n.has(t);
}
//#endregion
//#region node_modules/zod/v4/locales/en.js
var Ir = () => {
	let e = {
		string: {
			unit: "characters",
			verb: "to have"
		},
		file: {
			unit: "bytes",
			verb: "to have"
		},
		array: {
			unit: "items",
			verb: "to have"
		},
		set: {
			unit: "items",
			verb: "to have"
		},
		map: {
			unit: "entries",
			verb: "to have"
		}
	};
	function t(t) {
		return e[t] ?? null;
	}
	let n = {
		regex: "input",
		email: "email address",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO datetime",
		date: "ISO date",
		time: "ISO time",
		duration: "ISO duration",
		ipv4: "IPv4 address",
		ipv6: "IPv6 address",
		mac: "MAC address",
		cidrv4: "IPv4 range",
		cidrv6: "IPv6 range",
		base64: "base64-encoded string",
		base64url: "base64url-encoded string",
		json_string: "JSON string",
		e164: "E.164 number",
		credit_card: "credit card number",
		jwt: "JWT",
		template_literal: "input"
	}, r = { nan: "NaN" };
	function i(e, t) {
		return e === "number" && typeof t == "number" && !Number.isFinite(t) ? String(t) : r[e] ?? e;
	}
	return (e) => {
		switch (e.code) {
			case "invalid_type": return `Invalid input: expected ${i(e.expected)}, received ${i(Se(e.input), e.input)}`;
			case "invalid_value": return e.values.length === 1 ? `Invalid input: expected ${oe(e.values[0])}` : `Invalid option: expected one of ${s(e.values, "|")}`;
			case "too_big": {
				let n = e.exact ? "exactly " : e.inclusive ? "<=" : "<", r = t(e.origin);
				return r ? `Too big: expected ${e.origin ?? "value"} to have ${n}${e.maximum.toString()} ${r.unit ?? "elements"}` : `Too big: expected ${e.origin ?? "value"} to be ${n}${e.maximum.toString()}`;
			}
			case "too_small": {
				let n = e.exact ? "exactly " : e.inclusive ? ">=" : ">", r = t(e.origin);
				return r ? `Too small: expected ${e.origin} to have ${n}${e.minimum.toString()} ${r.unit}` : `Too small: expected ${e.origin} to be ${n}${e.minimum.toString()}`;
			}
			case "invalid_format": {
				let t = e;
				return t.format === "starts_with" ? `Invalid string: must start with "${t.prefix}"` : t.format === "ends_with" ? `Invalid string: must end with "${t.suffix}"` : t.format === "includes" ? `Invalid string: must include "${t.includes}"` : t.format === "regex" ? `Invalid string: must match pattern ${t.pattern}` : `Invalid ${n[t.format] ?? e.format}`;
			}
			case "not_multiple_of": return `Invalid number: must be a multiple of ${e.divisor}`;
			case "unrecognized_keys": return `Unrecognized key${e.keys.length > 1 ? "s" : ""}: ${s(e.keys, ", ")}`;
			case "invalid_key": return `Invalid key in ${e.origin}`;
			case "invalid_union": return e.options && Array.isArray(e.options) && e.options.length > 0 ? `Invalid discriminator value. Expected ${e.options.map((e) => `'${e}'`).join(" | ")}` : e.inclusive === !1 ? "Invalid input: more than one option matched" : "Invalid input";
			case "invalid_element": return `Invalid value in ${e.origin}`;
			default: return "Invalid input";
		}
	};
};
function Lr() {
	return { localeError: Ir() };
}
//#endregion
//#region node_modules/zod/v4/core/registries.js
var Rr, zr = class {
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
function Br() {
	return new zr();
}
(Rr = globalThis).__zod_globalRegistry ?? (Rr.__zod_globalRegistry = Br());
var B = globalThis.__zod_globalRegistry;
//#endregion
//#region node_modules/zod/v4/core/api.js
// @__NO_SIDE_EFFECTS__
function Vr(e, t) {
	return new e({
		type: "string",
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Hr(e, t) {
	return new e({
		type: "string",
		format: "email",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Ur(e, t) {
	return new e({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Wr(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Gr(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v4",
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Kr(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v6",
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function qr(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v7",
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Jr(e, t) {
	return new e({
		type: "string",
		format: "url",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Yr(e, t) {
	return new e({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Xr(e, t) {
	return new e({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Zr(e, t) {
	return new e({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function Qr(e, t) {
	return new e({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function $r(e, t) {
	return new e({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ei(e, t) {
	return new e({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ti(e, t) {
	return new e({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ni(e, t) {
	return new e({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ri(e, t) {
	return new e({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ii(e, t) {
	return new e({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ai(e, t) {
	return new e({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function oi(e, t) {
	return new e({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function si(e, t) {
	return new e({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ci(e, t) {
	return new e({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function li(e, t) {
	return new e({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: !1,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function ui(e, t) {
	return new e({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: !1,
		local: !1,
		precision: null,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function di(e, t) {
	return new e({
		type: "string",
		format: "date",
		check: "string_format",
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function fi(e, t) {
	return new e({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function pi(e, t) {
	return new e({
		type: "string",
		format: "duration",
		check: "string_format",
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function mi(e, t) {
	return new e({
		type: "number",
		checks: [],
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function hi(e, t) {
	return new e({
		type: "number",
		check: "number_format",
		abort: !1,
		format: "safeint",
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function gi(e, t) {
	return new e({
		type: "boolean",
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function _i(e) {
	return new e({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function vi(e, t) {
	return new e({
		type: "never",
		...y(t)
	});
}
// @__NO_SIDE_EFFECTS__
function yi(e, t) {
	return new Wt({
		check: "less_than",
		...y(t),
		value: e,
		inclusive: !1
	});
}
// @__NO_SIDE_EFFECTS__
function bi(e, t) {
	return new Wt({
		check: "less_than",
		...y(t),
		value: e,
		inclusive: !0
	});
}
// @__NO_SIDE_EFFECTS__
function xi(e, t) {
	return new Gt({
		check: "greater_than",
		...y(t),
		value: e,
		inclusive: !1
	});
}
// @__NO_SIDE_EFFECTS__
function Si(e, t) {
	return new Gt({
		check: "greater_than",
		...y(t),
		value: e,
		inclusive: !0
	});
}
// @__NO_SIDE_EFFECTS__
function Ci(e, t) {
	return new Kt({
		check: "multiple_of",
		...y(t),
		value: e
	});
}
// @__NO_SIDE_EFFECTS__
function wi(e, t) {
	return new Jt({
		check: "max_length",
		...y(t),
		maximum: e
	});
}
// @__NO_SIDE_EFFECTS__
function V(e, t) {
	return new Yt({
		check: "min_length",
		...y(t),
		minimum: e
	});
}
// @__NO_SIDE_EFFECTS__
function Ti(e, t) {
	return new Xt({
		check: "length_equals",
		...y(t),
		length: e
	});
}
// @__NO_SIDE_EFFECTS__
function Ei(e, t) {
	return new Zt({
		check: "string_format",
		format: "regex",
		...y(t),
		pattern: e
	});
}
// @__NO_SIDE_EFFECTS__
function Di(e) {
	return new Qt({
		check: "string_format",
		format: "lowercase",
		...y(e)
	});
}
// @__NO_SIDE_EFFECTS__
function Oi(e) {
	return new $t({
		check: "string_format",
		format: "uppercase",
		...y(e)
	});
}
// @__NO_SIDE_EFFECTS__
function ki(e, t) {
	return new en({
		check: "string_format",
		format: "includes",
		...y(t),
		includes: e
	});
}
// @__NO_SIDE_EFFECTS__
function Ai(e, t) {
	return new tn({
		check: "string_format",
		format: "starts_with",
		...y(t),
		prefix: e
	});
}
// @__NO_SIDE_EFFECTS__
function ji(e, t) {
	return new nn({
		check: "string_format",
		format: "ends_with",
		...y(t),
		suffix: e
	});
}
// @__NO_SIDE_EFFECTS__
function H(e) {
	return new rn({
		check: "overwrite",
		tx: e
	});
}
// @__NO_SIDE_EFFECTS__
function Mi(e) {
	return /* @__PURE__ */ H((t) => t.normalize(e));
}
// @__NO_SIDE_EFFECTS__
function Ni() {
	return /* @__PURE__ */ H((e) => e.trim());
}
// @__NO_SIDE_EFFECTS__
function Pi() {
	return /* @__PURE__ */ H((e) => e.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function Fi() {
	return /* @__PURE__ */ H((e) => e.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function Ii() {
	return /* @__PURE__ */ H((e) => te(e));
}
// @__NO_SIDE_EFFECTS__
function Li(e, t, n) {
	return new e({
		type: "array",
		element: t,
		...y(n)
	});
}
// @__NO_SIDE_EFFECTS__
function Ri(e, t, n) {
	return new e({
		type: "custom",
		check: "custom",
		fn: t,
		...y(n)
	});
}
// @__NO_SIDE_EFFECTS__
function zi(e, t) {
	let n = /* @__PURE__ */ Bi((t) => (t.addIssue = (e) => {
		if (typeof e == "string") t.issues.push(C(e, t.value, n._zod.def));
		else {
			let r = e;
			r.fatal && (r.continue = !1), r.code ??= "custom", "input" in r || (r.input = t.value), r.inst ??= n, r.continue ??= !n._zod.def.abort, t.issues.push(C(r));
		}
	}, e(t.value, t)), t);
	return n;
}
// @__NO_SIDE_EFFECTS__
function Bi(e, t) {
	let n = new M({
		check: "custom",
		...y(t)
	});
	return n._zod.check = e, n;
}
//#endregion
//#region node_modules/zod/v4/core/to-json-schema.js
function U(e, ...t) {
	for (let n of t) for (let t of Reflect.ownKeys(n)) Object.prototype.propertyIsEnumerable.call(n, t) && p(e, t, n[t]);
	return e;
}
function Vi(e) {
	let t = e?.target ?? "draft-2020-12";
	return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
		processors: e.processors ?? {},
		metadataRegistry: e?.metadata ?? B,
		target: t,
		unrepresentable: e?.unrepresentable ?? "throw",
		override: e?.override ?? (() => {}),
		io: e?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		sharedDefsExtractedFor: void 0,
		sharedEmitDoneFor: void 0,
		cycles: e?.cycles ?? "ref",
		reused: e?.reused ?? "inline",
		intersections: [],
		deferred: [],
		external: e?.external ?? void 0
	};
}
function W(e, t, n, r, i) {
	let a = typeof t.unrepresentable == "function" ? t.unrepresentable({
		zodSchema: e,
		path: r.path,
		message: i
	}) : t.unrepresentable;
	if (a === "any") return !1;
	if (a === void 0 || a === "throw") throw Error(i);
	return Object.assign(n, a), !0;
}
function G(e, t, n = {
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
	t.seen.set(e, o), t.sharedDefsExtractedFor = void 0, t.sharedEmitDoneFor = void 0;
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
		a && (o.ref ||= a, G(a, t, r), t.seen.get(a).isParent = !0);
	}
	let c = t.metadataRegistry.get(e);
	return c && U(o.schema, c), t.io === "input" && K(e) && (delete o.schema.examples, delete o.schema.default), t.io === "input" && "_prefault" in o.schema && ((r = o.schema).default ?? (r.default = o.schema._prefault)), delete o.schema._prefault, t.seen.get(e).schema;
}
function Hi(e) {
	return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
function Ui(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	if (e.external && e.sharedDefsExtractedFor === e.external) return;
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
				ref: `${i("__shared")}#/${r}/${Hi(a)}`
			};
		}
		let i = `#/${r}/`;
		if (t[1] === n && !t[1].schema.id) return { ref: "#" };
		let a = t[1].schema.id ?? `__schema${e.counter++}`;
		return {
			defId: a,
			ref: i + Hi(a)
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
	e.external && (e.sharedDefsExtractedFor = e.external);
}
function Wi(e) {
	let t = e.anyOf;
	if (!Array.isArray(t) || t.length === 0 || e.type !== void 0) return;
	let n = [];
	for (let e of t) {
		if (!e || typeof e != "object") return;
		Wi(e);
		let t = Object.keys(e);
		if (t.length !== 1 || t[0] !== "type") return;
		let r = e.type;
		for (let e of Array.isArray(r) ? r : [r]) {
			if (typeof e != "string") return;
			n.includes(e) || n.push(e);
		}
	}
	delete e.anyOf, e.type = n.length === 1 ? n[0] : n;
}
var Gi = /* @__PURE__ */ new Set([
	"type",
	"properties",
	"required",
	"additionalProperties"
]), Ki = ["oneOf", "anyOf"];
function qi(e) {
	let t = e.additionalProperties;
	return t === void 0 || t === !1 || typeof t != "object" || !t ? null : Object.keys(t).length ? t : null;
}
function Ji(e) {
	let t = [];
	for (let n of e) {
		if (typeof n != "object" || n.type !== "object") return null;
		for (let e in n) if (!Gi.has(e)) return null;
		t.push(n);
	}
	let n = {}, r = /* @__PURE__ */ new Set();
	for (let e of t) {
		for (let r in e.properties) {
			if (Object.prototype.hasOwnProperty.call(n, r)) continue;
			let e = [];
			for (let n of t) {
				let t = n.properties?.[r] ?? qi(n);
				t != null && (e.some((e) => JSON.stringify(e) === JSON.stringify(t)) || e.push(t));
			}
			p(n, r, e.length === 1 ? e[0] : Ji(e) ?? { allOf: e });
		}
		for (let t of e.required ?? []) r.add(t);
	}
	let i = {
		type: "object",
		properties: n
	};
	if (r.size && (i.required = [...r]), t.every((e) => e.additionalProperties === !1)) i.additionalProperties = !1;
	else {
		let e = [];
		for (let n of t) {
			let t = qi(n);
			t && !e.some((e) => JSON.stringify(e) === JSON.stringify(t)) && e.push(t);
		}
		e.length === 1 ? i.additionalProperties = e[0] : e.length > 1 && (i.additionalProperties = { allOf: e });
	}
	return i;
}
function Yi(e) {
	let t = e.allOf;
	if (!Array.isArray(t) || t.length < 2) return;
	for (let t of Gi) if (t in e) return;
	let n = t.filter((e) => Ki.some((t) => Array.isArray(e[t]))), r = null;
	if (!n.length) r = Ji(t);
	else {
		let e = n[0], i = Ki.find((t) => Array.isArray(e[t]));
		if (Object.keys(e).length !== 1) return;
		let a = t.filter((t) => t !== e), o = e[i].map((e) => Ji([...a, e]));
		if (o.some((e) => !e)) return;
		r = { [i]: o };
	}
	r && (delete e.allOf, U(e, r));
}
function Xi(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	let r = (t) => {
		let n = e.seen.get(t);
		if (n.ref === null) return;
		let i = n.def ?? n.schema, a = { ...i }, o = n.ref;
		if (n.ref = null, o) {
			r(o);
			let n = e.seen.get(o), s = n.schema;
			if (s.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (i.allOf = i.allOf ?? [], i.allOf.push(s)) : U(i, s), U(i, a), t._zod.parent === o) for (let e in i) e !== "$ref" && e !== "allOf" && (e in a || delete i[e]);
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
	if (!e.external || e.sharedEmitDoneFor !== e.external) {
		for (let t of [...e.seen.entries()].reverse()) r(t[0]);
		if (e.target !== "openapi-3.0") for (let t of e.seen.entries()) Wi(t[1].def ?? t[1].schema);
		for (let t of e.deferred) t();
		if (e.intersections.length) {
			let t = /* @__PURE__ */ new Map();
			for (let n of e.seen.values()) for (let e of [n.schema, n.def]) {
				let n = e?.allOf;
				if (!Array.isArray(n)) continue;
				let r = t.get(n);
				r ? r.push(e) : t.set(n, [e]);
			}
			for (let n of e.intersections) for (let e of t.get(n) ?? []) Yi(e);
		}
	}
	let i = {};
	if (e.target === "draft-2020-12" ? i.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? i.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? i.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
		let n = e.external.registry.get(t)?.id;
		if (!n) throw Error("Schema is missing an `id` property");
		i.$id = e.external.uri(n);
	}
	U(i, n.defId ? n.schema : n.def ?? n.schema);
	let a = e.metadataRegistry.get(t)?.id;
	a !== void 0 && i.id === a && delete i.id;
	let o = e.external?.defs ?? {};
	if (!e.external || e.sharedEmitDoneFor !== e.external) for (let t of e.seen.entries()) {
		let e = t[1];
		e.def && e.defId && (e.def.id === e.defId && delete e.def.id, p(o, e.defId, e.def));
	}
	e.external && (e.sharedEmitDoneFor = e.external), e.external || Object.keys(o).length > 0 && (e.target === "draft-2020-12" ? i.$defs = o : i.definitions = o);
	try {
		let n = JSON.parse(JSON.stringify(i));
		return Object.defineProperty(n, "~standard", {
			value: {
				...t["~standard"],
				jsonSchema: {
					input: q(t, "input", e.processors),
					output: q(t, "output", e.processors)
				}
			},
			enumerable: !1,
			writable: !1
		}), n;
	} catch {
		throw Error("Error converting schema to JSON.");
	}
}
function K(e, t) {
	let n = t ?? { seen: /* @__PURE__ */ new Set() };
	if (n.seen.has(e)) return !1;
	n.seen.add(e);
	let r = e._zod.def;
	if (r.type === "transform") return !0;
	if (r.type === "array") return K(r.element, n);
	if (r.type === "set") return K(r.valueType, n);
	if (r.type === "lazy") return K(r.getter(), n);
	if (r.type === "promise" || r.type === "optional" || r.type === "nonoptional" || r.type === "nullable" || r.type === "readonly" || r.type === "default" || r.type === "prefault" || r.type === "catch") return K(r.innerType, n);
	if (r.type === "intersection") return K(r.left, n) || K(r.right, n);
	if (r.type === "record" || r.type === "map") return K(r.keyType, n) || K(r.valueType, n);
	if (r.type === "pipe") return e._zod.traits.has("$ZodCodec") ? !0 : K(r.in, n) || K(r.out, n);
	if (r.type === "object") {
		for (let e in r.shape) if (K(r.shape[e], n)) return !0;
		return !1;
	}
	if (r.type === "union") {
		for (let e of r.options) if (K(e, n)) return !0;
		return !1;
	}
	if (r.type === "tuple") {
		for (let e of r.items) if (K(e, n)) return !0;
		return !!(r.rest && K(r.rest, n));
	}
	return !1;
}
var Zi = (e, t = {}) => (n) => {
	let r = Vi({
		...n,
		processors: t
	});
	return G(e, r), Ui(r, e), Xi(r, e);
}, q = (e, t, n = {}) => (r) => {
	let { libraryOptions: i, target: a } = r ?? {}, o = Vi({
		...i ?? {},
		target: a,
		io: t,
		processors: n
	});
	return G(e, o), Ui(o, e), Xi(o, e);
}, Qi = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
}, $i = (e, t, n, r) => {
	let i = n;
	i.type = "string";
	let { minimum: a, maximum: o, format: s, patterns: c, contentEncoding: l, laxFormat: u } = e._zod.bag;
	if (typeof a == "number" && (i.minLength = a), typeof o == "number" && (i.maxLength = o), s && (i.format = Qi[s] ?? s, i.format === "" && delete i.format, (s === "time" || u) && delete i.format), l && (i.contentEncoding = l), c && c.size > 0) {
		let e = [...c];
		e.length === 1 ? i.pattern = e[0].source : e.length > 1 && (i.allOf = [...e.map((e) => ({
			...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: e.source
		}))]);
	}
}, ea = (e, t, n, r) => {
	let i = n, { minimum: a, maximum: o, format: s, multipleOf: c, exclusiveMaximum: l, exclusiveMinimum: u } = e._zod.bag;
	i.type = typeof s == "string" && s.includes("int") ? "integer" : "number";
	let d = typeof u == "number" && u >= (a ?? -Infinity), f = typeof l == "number" && l <= (o ?? Infinity), p = t.target === "draft-04" || t.target === "openapi-3.0";
	d ? p ? (i.minimum = u, i.exclusiveMinimum = !0) : i.exclusiveMinimum = u : typeof a == "number" && (i.minimum = a), f ? p ? (i.maximum = l, i.exclusiveMaximum = !0) : i.exclusiveMaximum = l : typeof o == "number" && (i.maximum = o), typeof c == "number" && (Number.isFinite(c) && c !== 0 ? i.multipleOf = Math.abs(c) : W(e, t, i, r, `A multipleOf divisor of ${c} cannot be represented in JSON Schema`));
}, ta = (e, t, n, r) => {
	n.type = "boolean";
}, na = (e, t, n, r) => {
	n.not = {};
}, ra = (e, t, n, r) => {
	let i = e._zod.def, a = o(i.entries);
	if (a.length === 0) {
		n.not = {};
		return;
	}
	a.every((e) => typeof e == "number") && (n.type = "number"), a.every((e) => typeof e == "string") && (n.type = "string"), n.enum = a;
}, ia = (e, t, n, r) => {
	W(e, t, n, r, "Custom types cannot be represented in JSON Schema");
}, aa = (e, t, n, r) => {
	W(e, t, n, r, "Transforms cannot be represented in JSON Schema");
}, oa = (e, t, n, r) => {
	let i = n, a = e._zod.def, { minimum: o, maximum: s } = e._zod.bag;
	typeof o == "number" && (i.minItems = o), typeof s == "number" && (i.maxItems = s), i.type = "array", i.items = G(a.element, t, {
		...r,
		path: [...r.path, "items"]
	});
};
function sa(e) {
	let t = e._zod.def;
	return t.type === "pipe" && t.in._zod.traits.has("$ZodTransform") ? sa(t.out) : t.type === "catch" ? sa(t.innerType) : e._zod.optin;
}
var ca = (e, t, n, r) => {
	let i = n, a = e._zod.def, o = a.shape;
	if (Object.getOwnPropertySymbols(o).length && W(e, t, i, r, "Symbol keys cannot be represented in JSON Schema")) return;
	i.type = "object", i.properties = {};
	for (let e in o) p(i.properties, e, G(o[e], t, {
		...r,
		path: [
			...r.path,
			"properties",
			e
		]
	}));
	let s = new Set(Object.keys(o)), c = new Set([...s].filter((e) => {
		let n = a.shape[e];
		return t.io === "input" ? sa(n) === void 0 : n._zod.optout === void 0;
	}));
	c.size > 0 && (i.required = Array.from(c)), a.catchall?._zod.def.type === "never" ? i.additionalProperties = !1 : a.catchall ? a.catchall && (i.additionalProperties = G(a.catchall, t, {
		...r,
		path: [...r.path, "additionalProperties"]
	})) : t.io === "output" && (i.additionalProperties = !1);
}, la = (e, t, n, r) => {
	let i = e._zod.def, a = i.inclusive === !1, o = i.options.map((e, n) => G(e, t, {
		...r,
		path: [
			...r.path,
			a ? "oneOf" : "anyOf",
			n
		]
	}));
	a ? n.oneOf = o : n.anyOf = o;
}, ua = (e, t, n, r) => {
	let i = e._zod.def, a = G(i.left, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			0
		]
	}), o = G(i.right, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			1
		]
	}), s = (e) => "allOf" in e && Object.keys(e).length === 1, c = [...s(a) ? a.allOf : [a], ...s(o) ? o.allOf : [o]];
	n.allOf = c, t.intersections.push(c);
}, da = (e, t, n, r) => {
	let i = e._zod.def, a = G(i.innerType, t, r), o = t.seen.get(e);
	t.target === "openapi-3.0" ? (o.ref = i.innerType, n.nullable = !0) : n.anyOf = [a, { type: "null" }];
}, fa = (e, t, n, r) => {
	let i = e._zod.def;
	G(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, pa = Symbol();
function ma(e, t, n, r, i) {
	let a = !1, o = JSON.stringify(e, (e, t) => typeof t == "bigint" ? (a = !0, null) : t);
	return a ? (W(t, n, r, i, "BigInt defaults cannot be represented in JSON Schema"), pa) : JSON.parse(o);
}
var ha = (e, t, n, r) => {
	let i = e._zod.def;
	G(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o = ma(i.defaultValue, e, t, n, r);
	o !== pa && (n.default = o);
}, ga = (e, t, n, r) => {
	let i = e._zod.def;
	G(i.innerType, t, r);
	let a = t.seen.get(e);
	if (a.ref = i.innerType, t.io !== "input") return;
	let o = ma(i.defaultValue, e, t, n, r);
	o !== pa && (n._prefault = o);
}, _a = (e, t, n, r) => {
	let i = e._zod.def;
	G(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o;
	try {
		o = i.catchValue(void 0);
	} catch {
		W(e, t, n, r, "Dynamic catch values are not supported in JSON Schema");
		return;
	}
	n.default = o;
}, va = (e, t, n, r) => {
	let i = e._zod.def, a = i.in._zod.traits.has("$ZodTransform"), o = t.io === "input" ? a ? i.out : i.in : i.out;
	G(o, t, r);
	let s = t.seen.get(e);
	s.ref = o;
}, ya = (e, t, n, r) => {
	let i = e._zod.def;
	G(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.readOnly = !0;
}, ba = (e, t, n, r) => {
	let i = e._zod.def;
	G(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, xa = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
function J(e, t, n) {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		get() {
			let e = n(this);
			return Object.defineProperty(this, t, {
				value: e,
				configurable: !0,
				writable: !0
			}), e;
		},
		set(e) {
			Object.defineProperty(this, t, {
				value: e,
				configurable: !0,
				writable: !0
			});
		}
	});
}
var Y = /*@__PURE__*/ D("ZodError", (e, t) => {
	We.init(e, t), e.name = "ZodError";
	let n = Object.getPrototypeOf(e);
	xa.has(n) || (xa.add(n), J(n, "format", (e) => (t) => Je(e, t)), J(n, "flatten", (e) => (t) => qe(e, t)), J(n, "addIssue", (e) => (t) => {
		e.issues.push(t), e.message = JSON.stringify(e.issues, c, 2);
	}), J(n, "addIssues", (e) => (t) => {
		e.issues.push(...t), e.message = JSON.stringify(e.issues, c, 2);
	}), Object.defineProperty(n, "isEmpty", {
		configurable: !0,
		enumerable: !1,
		get() {
			return this.issues.length === 0;
		}
	}));
}, void 0, { Parent: Error }), Sa = /* @__PURE__ */ Ye(Y), Ca = /* @__PURE__ */ Xe(Y), wa = /* @__PURE__ */ Ze(Y), Ta = /* @__PURE__ */ $e(Y), Ea = /* @__PURE__ */ tt(Y), Da = /* @__PURE__ */ nt(Y), Oa = /* @__PURE__ */ rt(Y), ka = /* @__PURE__ */ it(Y), Aa = /* @__PURE__ */ at(Y), ja = /* @__PURE__ */ ot(Y), Ma = /* @__PURE__ */ st(Y), Na = /* @__PURE__ */ ct(Y);
//#endregion
//#region node_modules/zod/v4/classic/schemas.js
function Pa() {
	k.localeError || A(Lr());
}
function Fa() {
	k.memoizer || A({ memoizer: Pr() });
}
var X = /*@__PURE__*/ D("ZodType", (e, t) => (Pa(), P.init(e, t), e.def = t, e.type = t.type, e), {
	check(...e) {
		let t = this.def;
		return this.clone(m(t, { checks: [...t.checks ?? [], ...e.map((e) => typeof e == "function" ? { _zod: {
			check: e,
			def: { check: "custom" },
			onattach: []
		} } : e)] }), { parent: !0 });
	},
	with(...e) {
		return this.check(...e);
	},
	clone(e, t) {
		return v(this, e, t);
	},
	brand() {
		return this;
	},
	register(e, t) {
		return e.add(this, t), this;
	},
	refine(e, t) {
		return this.check(Yo(e, t));
	},
	superRefine(e, t) {
		return this.check(Xo(e, t));
	},
	overwrite(e) {
		return this.check(/* @__PURE__ */ H(e));
	},
	optional() {
		return jo(this);
	},
	exactOptional() {
		return No(this);
	},
	nullable() {
		return Fo(this);
	},
	nullish() {
		return jo(Fo(this));
	},
	nonoptional(e) {
		return Vo(this, e);
	},
	array() {
		return yo(this);
	},
	or(e) {
		return Co([this, e]);
	},
	and(e) {
		return To(this, e);
	},
	transform(e) {
		return Go(this, ko(e));
	},
	default(e) {
		return Lo(this, e);
	},
	prefault(e) {
		return zo(this, e);
	},
	catch(e) {
		return Uo(this, e);
	},
	pipe(e) {
		return Go(this, e);
	},
	readonly() {
		return qo(this);
	},
	describe(e) {
		let t = this.clone();
		return B.add(t, { description: e }), t;
	},
	meta(...e) {
		if (e.length === 0) return B.get(this);
		let t = this.clone();
		return B.add(t, e[0]), t;
	},
	isOptional() {
		return this.safeParse(void 0).success;
	},
	isNullable() {
		return this.safeParse(null).success;
	},
	apply(e, ...t) {
		return t.length === 0 ? e(this) : e(this, ...t);
	},
	get "~standard"() {
		return we(this, "~standard", {
			...cn(this),
			jsonSchema: {
				input: q(this, "input"),
				output: q(this, "output")
			}
		});
	},
	set "~standard"(e) {
		w(this, "~standard", e);
	},
	parse: function e(t, n) {
		return Sa(this, t, n, { callee: e });
	},
	parseAsync: async function e(t, n) {
		return await Ca(this, t, n, { callee: e });
	},
	safeParse(e, t) {
		return wa(this, e, t);
	},
	async safeParseAsync(e, t) {
		return Ta(this, e, t);
	},
	get spa() {
		return this?.safeParseAsync;
	},
	set spa(e) {
		w(this, "spa", e);
	},
	encode: function e(t, n) {
		return Ea(this, t, n, { callee: e });
	},
	decode: function e(t, n) {
		return Da(this, t, n, { callee: e });
	},
	encodeAsync: async function e(t, n) {
		return await Oa(this, t, n, { callee: e });
	},
	decodeAsync: async function e(t, n) {
		return await ka(this, t, n, { callee: e });
	},
	safeEncode(e, t) {
		return Aa(this, e, t);
	},
	safeDecode(e, t) {
		return ja(this, e, t);
	},
	async safeEncodeAsync(e, t) {
		return Ma(this, e, t);
	},
	async safeDecodeAsync(e, t) {
		return Na(this, e, t);
	},
	toJSONSchema(e) {
		return Zi(this, {})(e);
	},
	get description() {
		return B.get(this)?.description;
	},
	get _def() {
		return this._zod.def;
	}
}), Ia = /*@__PURE__*/ D("_ZodString", (e, t) => {
	ln.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => $i(e, t, n, r);
	let n = e._zod.bag;
	e.format = n.format ?? null, e.minLength = n.minimum ?? null, e.maxLength = n.maximum ?? null;
}, {
	regex(...e) {
		return this.check(/* @__PURE__ */ Ei(...e));
	},
	includes(...e) {
		return this.check(/* @__PURE__ */ ki(...e));
	},
	startsWith(...e) {
		return this.check(/* @__PURE__ */ Ai(...e));
	},
	endsWith(...e) {
		return this.check(/* @__PURE__ */ ji(...e));
	},
	min(...e) {
		return this.check(/* @__PURE__ */ V(...e));
	},
	max(...e) {
		return this.check(/* @__PURE__ */ wi(...e));
	},
	length(...e) {
		return this.check(/* @__PURE__ */ Ti(...e));
	},
	nonempty(...e) {
		return this.check(/* @__PURE__ */ V(1, ...e));
	},
	lowercase(e) {
		return this.check(/* @__PURE__ */ Di(e));
	},
	uppercase(e) {
		return this.check(/* @__PURE__ */ Oi(e));
	},
	trim() {
		return this.check(/* @__PURE__ */ Ni());
	},
	normalize(...e) {
		return this.check(/* @__PURE__ */ Mi(...e));
	},
	toLowerCase() {
		return this.check(/* @__PURE__ */ Pi());
	},
	toUpperCase() {
		return this.check(/* @__PURE__ */ Fi());
	},
	slugify() {
		return this.check(/* @__PURE__ */ Ii());
	}
}), La = /*@__PURE__*/ D("ZodString", (e, t) => {
	ln.init(e, t), Ia.init(e, t);
}, {
	email(e) {
		return this.check(/* @__PURE__ */ Hr(Ha, e));
	},
	url(e) {
		return this.check(/* @__PURE__ */ Jr(Ga, e));
	},
	jwt(e) {
		return this.check(/* @__PURE__ */ li(oo, e));
	},
	emoji(e) {
		return this.check(/* @__PURE__ */ Yr(Ka, e));
	},
	guid(e) {
		return this.check(/* @__PURE__ */ Ur(Ua, e));
	},
	uuid(e) {
		return this.check(/* @__PURE__ */ Wr(Wa, e));
	},
	uuidv4(e) {
		return this.check(/* @__PURE__ */ Gr(Wa, e));
	},
	uuidv6(e) {
		return this.check(/* @__PURE__ */ Kr(Wa, e));
	},
	uuidv7(e) {
		return this.check(/* @__PURE__ */ qr(Wa, e));
	},
	nanoid(e) {
		return this.check(/* @__PURE__ */ Xr(qa, e));
	},
	cuid(e) {
		return this.check(/* @__PURE__ */ Zr(Ja, e));
	},
	cuid2(e) {
		return this.check(/* @__PURE__ */ Qr(Ya, e));
	},
	ulid(e) {
		return this.check(/* @__PURE__ */ $r(Xa, e));
	},
	base64(e) {
		return this.check(/* @__PURE__ */ oi(ro, e));
	},
	base64url(e) {
		return this.check(/* @__PURE__ */ si(io, e));
	},
	xid(e) {
		return this.check(/* @__PURE__ */ ei(Za, e));
	},
	ksuid(e) {
		return this.check(/* @__PURE__ */ ti(Qa, e));
	},
	ipv4(e) {
		return this.check(/* @__PURE__ */ ni($a, e));
	},
	ipv6(e) {
		return this.check(/* @__PURE__ */ ri(eo, e));
	},
	cidrv4(e) {
		return this.check(/* @__PURE__ */ ii(to, e));
	},
	cidrv6(e) {
		return this.check(/* @__PURE__ */ ai(no, e));
	},
	e164(e) {
		return this.check(/* @__PURE__ */ ci(ao, e));
	},
	datetime(e) {
		return this.check(/* @__PURE__ */ ui(Ra, e));
	},
	date(e) {
		return this.check(/* @__PURE__ */ di(za, e));
	},
	time(e) {
		return this.check(/* @__PURE__ */ fi(Ba, e));
	},
	duration(e) {
		return this.check(/* @__PURE__ */ pi(Va, e));
	}
});
function Z(e) {
	return /* @__PURE__ */ Vr(La, e);
}
var Q = /*@__PURE__*/ D("ZodStringFormat", (e, t) => {
	F.init(e, t), Ia.init(e, t);
}), Ra = /*@__PURE__*/ D("ZodISODateTime", (e, t) => {
	En.init(e, t), Q.init(e, t);
}), za = /*@__PURE__*/ D("ZodISODate", (e, t) => {
	Dn.init(e, t), Q.init(e, t);
}), Ba = /*@__PURE__*/ D("ZodISOTime", (e, t) => {
	On.init(e, t), Q.init(e, t);
}), Va = /*@__PURE__*/ D("ZodISODuration", (e, t) => {
	kn.init(e, t), Q.init(e, t);
}), Ha = /*@__PURE__*/ D("ZodEmail", (e, t) => {
	fn.init(e, t), Q.init(e, t);
}), Ua = /*@__PURE__*/ D("ZodGUID", (e, t) => {
	un.init(e, t), Q.init(e, t);
}), Wa = /*@__PURE__*/ D("ZodUUID", (e, t) => {
	dn.init(e, t), Q.init(e, t);
}), Ga = /*@__PURE__*/ D("ZodURL", (e, t) => {
	vn.init(e, t), Q.init(e, t);
}), Ka = /*@__PURE__*/ D("ZodEmoji", (e, t) => {
	yn.init(e, t), Q.init(e, t);
}), qa = /*@__PURE__*/ D("ZodNanoID", (e, t) => {
	bn.init(e, t), Q.init(e, t);
}), Ja = /*@__PURE__*/ D("ZodCUID", (e, t) => {
	xn.init(e, t), Q.init(e, t);
}), Ya = /*@__PURE__*/ D("ZodCUID2", (e, t) => {
	Sn.init(e, t), Q.init(e, t);
}), Xa = /*@__PURE__*/ D("ZodULID", (e, t) => {
	Cn.init(e, t), Q.init(e, t);
}), Za = /*@__PURE__*/ D("ZodXID", (e, t) => {
	wn.init(e, t), Q.init(e, t);
}), Qa = /*@__PURE__*/ D("ZodKSUID", (e, t) => {
	Tn.init(e, t), Q.init(e, t);
}), $a = /*@__PURE__*/ D("ZodIPv4", (e, t) => {
	An.init(e, t), Q.init(e, t);
}), eo = /*@__PURE__*/ D("ZodIPv6", (e, t) => {
	Nn.init(e, t), Q.init(e, t);
}), to = /*@__PURE__*/ D("ZodCIDRv4", (e, t) => {
	Pn.init(e, t), Q.init(e, t);
}), no = /*@__PURE__*/ D("ZodCIDRv6", (e, t) => {
	In.init(e, t), Q.init(e, t);
}), ro = /*@__PURE__*/ D("ZodBase64", (e, t) => {
	Rn.init(e, t), Q.init(e, t);
}), io = /*@__PURE__*/ D("ZodBase64URL", (e, t) => {
	Bn.init(e, t), Q.init(e, t);
}), ao = /*@__PURE__*/ D("ZodE164", (e, t) => {
	Vn.init(e, t), Q.init(e, t);
}), oo = /*@__PURE__*/ D("ZodJWT", (e, t) => {
	Un.init(e, t), Q.init(e, t);
}), so = /*@__PURE__*/ D("ZodNumber", (e, t) => {
	Wn.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => ea(e, t, n, r);
	let n = e._zod.bag;
	e.minValue = Math.max(n.minimum ?? -Infinity, n.exclusiveMinimum ?? -Infinity) ?? null, e.maxValue = Math.min(n.maximum ?? Infinity, n.exclusiveMaximum ?? Infinity) ?? null, e.isInt = (n.format ?? "").includes("int") || Number.isSafeInteger(n.multipleOf ?? .5), e.isFinite = !0, e.format = n.format ?? null;
}, {
	gt(e, t) {
		return this.check(/* @__PURE__ */ xi(e, t));
	},
	gte(e, t) {
		return this.check(/* @__PURE__ */ Si(e, t));
	},
	min(e, t) {
		return this.check(/* @__PURE__ */ Si(e, t));
	},
	lt(e, t) {
		return this.check(/* @__PURE__ */ yi(e, t));
	},
	lte(e, t) {
		return this.check(/* @__PURE__ */ bi(e, t));
	},
	max(e, t) {
		return this.check(/* @__PURE__ */ bi(e, t));
	},
	int(e) {
		return this.check(uo(e));
	},
	safe(e) {
		return this.check(uo(e));
	},
	positive(e) {
		return this.check(/* @__PURE__ */ xi(0, e));
	},
	nonnegative(e) {
		return this.check(/* @__PURE__ */ Si(0, e));
	},
	negative(e) {
		return this.check(/* @__PURE__ */ yi(0, e));
	},
	nonpositive(e) {
		return this.check(/* @__PURE__ */ bi(0, e));
	},
	multipleOf(e, t) {
		return this.check(/* @__PURE__ */ Ci(e, t));
	},
	step(e, t) {
		return this.check(/* @__PURE__ */ Ci(e, t));
	},
	finite() {
		return this;
	}
});
function co(e) {
	return /* @__PURE__ */ mi(so, e);
}
var lo = /*@__PURE__*/ D("ZodNumberFormat", (e, t) => {
	Gn.init(e, t), so.init(e, t);
});
function uo(e) {
	return /* @__PURE__ */ hi(lo, e);
}
var fo = /*@__PURE__*/ D("ZodBoolean", (e, t) => {
	Kn.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => ta(e, t, n, r);
});
function po(e) {
	return /* @__PURE__ */ gi(fo, e);
}
var mo = /*@__PURE__*/ D("ZodUnknown", (e, t) => {
	qn.init(e, t), X.init(e, t), e._zod.processJSONSchema = (e, t, n) => void 0;
});
function ho() {
	return /* @__PURE__ */ _i(mo);
}
var go = /*@__PURE__*/ D("ZodNever", (e, t) => {
	Jn.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => na(e, t, n, r);
});
function _o(e) {
	return /* @__PURE__ */ vi(go, e);
}
var vo = /*@__PURE__*/ D("ZodArray", (e, t) => {
	Fa(), Xn.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => oa(e, t, n, r), e.element = t.element;
}, {
	min(e, t) {
		return this.check(/* @__PURE__ */ V(e, t));
	},
	nonempty(e) {
		return this.check(/* @__PURE__ */ V(1, e));
	},
	max(e, t) {
		return this.check(/* @__PURE__ */ wi(e, t));
	},
	length(e, t) {
		return this.check(/* @__PURE__ */ Ti(e, t));
	},
	unwrap() {
		return this.element;
	}
});
function yo(e, t) {
	return /* @__PURE__ */ Li(vo, e, t);
}
var bo = /*@__PURE__*/ D("ZodObject", (e, t) => {
	Fa(), nr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => ca(e, t, n, r), ke(e, "shape", (e) => e._zod.def.shape, !1);
}, {
	keyof() {
		return Do(Object.keys(this._zod.def.shape));
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
			catchall: ho()
		});
	},
	loose() {
		return this.clone({
			...this._zod.def,
			catchall: ho()
		});
	},
	strict() {
		return this.clone({
			...this._zod.def,
			catchall: _o()
		});
	},
	strip() {
		return this.clone({
			...this._zod.def,
			catchall: void 0
		});
	},
	extend(e) {
		return de(this, e);
	},
	safeExtend(e) {
		return fe(this, e);
	},
	merge(e) {
		return pe(this, e);
	},
	pick(e) {
		return le(this, e);
	},
	omit(e) {
		return ue(this, e);
	},
	partial(...e) {
		return me(Ao, this, e[0]);
	},
	exactPartial(...e) {
		return me(Mo, this, e[0], "exactPartial");
	},
	required(...e) {
		return he(Bo, this, e[0]);
	}
});
function xo(e, t) {
	return new bo({
		type: "object",
		shape: e ?? {},
		...y(t)
	});
}
var So = /*@__PURE__*/ D("ZodUnion", (e, t) => {
	ir.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => la(e, t, n, r), e.options = t.options;
});
function Co(e, t) {
	return new So({
		type: "union",
		options: e,
		...y(t)
	});
}
var wo = /*@__PURE__*/ D("ZodIntersection", (e, t) => {
	ar.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => ua(e, t, n, r);
});
function To(e, t) {
	return new wo({
		type: "intersection",
		left: e,
		right: t
	});
}
var Eo = /*@__PURE__*/ D("ZodEnum", (e, t) => {
	cr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => ra(e, t, n, r), e.enum = t.entries, e.options = Object.values(t.entries);
	let n = new Set(Object.keys(t.entries));
	e.extract = (e, r) => {
		let i = {};
		for (let r of e) if (n.has(r)) i[r] = t.entries[r];
		else throw Error(`Key ${r} not found in enum`);
		return new Eo({
			...t,
			checks: [],
			...y(r),
			entries: i
		});
	}, e.exclude = (e, r) => {
		let i = { ...t.entries };
		for (let t of e) if (n.has(t)) delete i[t];
		else throw Error(`Key ${t} not found in enum`);
		return new Eo({
			...t,
			checks: [],
			...y(r),
			entries: i
		});
	};
});
function Do(e, t) {
	return new Eo({
		type: "enum",
		entries: Array.isArray(e) ? Object.fromEntries(e.map((e) => [e, e])) : e,
		...y(t)
	});
}
var Oo = /*@__PURE__*/ D("ZodTransform", (e, t) => {
	Fa(), lr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => aa(e, t, n, r), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new Ie(e.constructor.name);
		n.addIssue = (r) => {
			if (typeof r == "string") n.issues.push(C(r, n.value, t));
			else {
				let t = r;
				t.fatal && (t.continue = !1), t.code ??= "custom", "input" in t || (t.input = n.value), t.inst ??= e, n.issues.push(C(t));
			}
		};
		let i = t.transform(n.value, n);
		return i instanceof Promise ? i.then((e) => (n.value = e, n)) : (n.value = i, n);
	};
});
function ko(e) {
	return new Oo({
		type: "transform",
		transform: e
	});
}
var Ao = /*@__PURE__*/ D("ZodOptional", (e, t) => {
	dr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => ba(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function jo(e) {
	return new Ao({
		type: "optional",
		innerType: e
	});
}
var Mo = /*@__PURE__*/ D("ZodExactOptional", (e, t) => {
	fr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => ba(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function No(e) {
	return new Mo({
		type: "optional",
		innerType: e
	});
}
var Po = /*@__PURE__*/ D("ZodNullable", (e, t) => {
	pr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => da(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Fo(e) {
	return new Po({
		type: "nullable",
		innerType: e
	});
}
var Io = /*@__PURE__*/ D("ZodDefault", (e, t) => {
	mr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => ha(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function Lo(e, t) {
	return new Io({
		type: "default",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : ie(t);
		}
	});
}
var Ro = /*@__PURE__*/ D("ZodPrefault", (e, t) => {
	gr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => ga(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function zo(e, t) {
	return new Ro({
		type: "prefault",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : ie(t);
		}
	});
}
var Bo = /*@__PURE__*/ D("ZodNonOptional", (e, t) => {
	_r.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => fa(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Vo(e, t) {
	return new Bo({
		type: "nonoptional",
		innerType: e,
		...y(t)
	});
}
var Ho = /*@__PURE__*/ D("ZodCatch", (e, t) => {
	br.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => _a(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function Uo(e, t) {
	return new Ho({
		type: "catch",
		innerType: e,
		catchValue: typeof t == "function" ? t : je(t)
	});
}
var Wo = /*@__PURE__*/ D("ZodPipe", (e, t) => {
	xr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => va(e, t, n, r), e.in = t.in, e.out = t.out;
});
function Go(e, t) {
	return new Wo({
		type: "pipe",
		in: e,
		out: t
	});
}
var Ko = /*@__PURE__*/ D("ZodReadonly", (e, t) => {
	Sr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => ya(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function qo(e) {
	return new Ko({
		type: "readonly",
		innerType: e
	});
}
var Jo = /*@__PURE__*/ D("ZodCustom", (e, t) => {
	wr.init(e, t), X.init(e, t), e._zod.processJSONSchema = (t, n, r) => ia(e, t, n, r);
});
function Yo(e, t = {}) {
	return /* @__PURE__ */ Ri(Jo, e, t);
}
function Xo(e, t) {
	return /* @__PURE__ */ zi(e, t);
}
//#endregion
//#region src/lib/types.ts
var Zo = xo({
	name: Z().min(1),
	hint: Z().min(1),
	score: co()
}).strict(), Qo = xo({
	$schema: Z().optional(),
	name: Z().optional(),
	description: Z().min(1),
	emoji: Z().optional(),
	slangIntensity: co().min(0).max(1).optional(),
	moods: yo(Zo).optional(),
	mood: xo({
		enabled: po(),
		default: Z().min(1),
		override: Z().nullable().optional(),
		drift: co().min(0).max(1).optional()
	}).strict().optional()
}).strict(), $o = xo({ current: Z() }), es = process.env.HOME ?? process.env.USERPROFILE ?? "~", ts = process.env.CLAUDE_PLUGIN_DATA_DIR ?? a(es, ".config/claude/personalities/data"), ns = a(es, ".config/claude/personality-state.json");
async function rs(t) {
	return e(t).then(() => !0).catch(() => !1);
}
async function is() {
	return await rs(ts) ? (await r(ts)).filter((e) => e.endsWith(".json")).map((e) => e.slice(0, -5)).sort() : (await t(ts, { recursive: !0 }), []);
}
async function as() {
	return await rs(ns) ? $o.parse(JSON.parse(await n(ns, "utf8"))) : null;
}
async function os(e) {
	await i(ns, JSON.stringify({ current: e }));
}
async function ss(e) {
	let t = await n(a(ts, `${e}.json`), "utf8");
	return Qo.parse(JSON.parse(t));
}
function cs(e) {
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
var ls = await is();
ls.length === 0 && process.exit(0);
var $ = await as();
if (!$ || !ls.includes($.current)) {
	let e = ls[Math.floor(Math.random() * ls.length)];
	await os(e), $ = { current: e };
}
var us = await ss($.current);
console.log(JSON.stringify({ hookSpecificOutput: {
	hookEventName: "SessionStart",
	additionalContext: cs(us)
} }));
//#endregion
