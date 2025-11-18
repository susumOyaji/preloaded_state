var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// build/index.js
import { WorkerEntrypoint as re } from "cloudflare:workers";
import D from "./e4fcde606f41ea0c0a2915cdbb903905c100af1b-index_bg.wasm";
var r;
var w = 0;
var S = null;
function k() {
  return (S === null || S.byteLength === 0) && (S = new Uint8Array(r.memory.buffer)), S;
}
__name(k, "k");
var j = new TextEncoder();
"encodeInto" in j || (j.encodeInto = function(e, t) {
  let n = j.encode(e);
  return t.set(n), { read: e.length, written: n.length };
});
function h(e, t, n) {
  if (n === void 0) {
    let c = j.encode(e), l = t(c.length, 1) >>> 0;
    return k().subarray(l, l + c.length).set(c), w = c.length, l;
  }
  let i = e.length, _ = t(i, 1) >>> 0, u = k(), s = 0;
  for (; s < i; s++) {
    let c = e.charCodeAt(s);
    if (c > 127) break;
    u[_ + s] = c;
  }
  if (s !== i) {
    s !== 0 && (e = e.slice(s)), _ = n(_, i, i = s + e.length * 3, 1) >>> 0;
    let c = k().subarray(_ + s, _ + i), l = j.encodeInto(e, c);
    s += l.written, _ = n(_, i, s, 1) >>> 0;
  }
  return w = s, _;
}
__name(h, "h");
var p = null;
function b() {
  return (p === null || p.buffer.detached === true || p.buffer.detached === void 0 && p.buffer !== r.memory.buffer) && (p = new DataView(r.memory.buffer)), p;
}
__name(b, "b");
function L(e) {
  let t = typeof e;
  if (t == "number" || t == "boolean" || e == null) return `${e}`;
  if (t == "string") return `"${e}"`;
  if (t == "symbol") {
    let _ = e.description;
    return _ == null ? "Symbol" : `Symbol(${_})`;
  }
  if (t == "function") {
    let _ = e.name;
    return typeof _ == "string" && _.length > 0 ? `Function(${_})` : "Function";
  }
  if (Array.isArray(e)) {
    let _ = e.length, u = "[";
    _ > 0 && (u += L(e[0]));
    for (let s = 1; s < _; s++) u += ", " + L(e[s]);
    return u += "]", u;
  }
  let n = /\[object ([^\]]+)\]/.exec(toString.call(e)), i;
  if (n && n.length > 1) i = n[1];
  else return toString.call(e);
  if (i == "Object") try {
    return "Object(" + JSON.stringify(e) + ")";
  } catch {
    return "Object";
  }
  return e instanceof Error ? `${e.name}: ${e.message}
${e.stack}` : i;
}
__name(L, "L");
function f(e) {
  return e == null;
}
__name(f, "f");
var q = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
q.decode();
function V(e, t) {
  return q.decode(k().subarray(e, e + t));
}
__name(V, "V");
function d(e, t) {
  return e = e >>> 0, V(e, t);
}
__name(d, "d");
function g(e) {
  let t = r.__externref_table_alloc();
  return r.__wbindgen_externrefs.set(t, e), t;
}
__name(g, "g");
function a(e, t) {
  try {
    return e.apply(this, t);
  } catch (n) {
    let i = g(n);
    r.__wbindgen_exn_store(i);
  }
}
__name(a, "a");
function U(e, t) {
  return e = e >>> 0, k().subarray(e / 1, e / 1 + t);
}
__name(U, "U");
var C = typeof FinalizationRegistry > "u" ? { register: /* @__PURE__ */ __name(() => {
}, "register"), unregister: /* @__PURE__ */ __name(() => {
}, "unregister") } : new FinalizationRegistry((e) => {
  e.instance === o && e.dtor(e.a, e.b);
});
function G(e, t, n, i) {
  let _ = { a: e, b: t, cnt: 1, dtor: n, instance: o }, u = /* @__PURE__ */ __name((...s) => {
    if (_.instance !== o) throw new Error("Cannot invoke closure from previous WASM instance");
    _.cnt++;
    let c = _.a;
    _.a = 0;
    try {
      return i(c, _.b, ...s);
    } finally {
      _.a = c, u._wbg_cb_unref();
    }
  }, "u");
  return u._wbg_cb_unref = () => {
    --_.cnt === 0 && (_.dtor(_.a, _.b), _.a = 0, C.unregister(_));
  }, C.register(u, _, _), u;
}
__name(G, "G");
function B(e, t, n) {
  return r.fetch(e, t, n);
}
__name(B, "B");
function K(e, t, n) {
  r.wasm_bindgen__convert__closures_____invoke__hbb9f332899240386(e, t, n);
}
__name(K, "K");
function J(e, t, n, i) {
  r.wasm_bindgen__convert__closures_____invoke__hcf242f351f9f1a31(e, t, n, i);
}
__name(J, "J");
var oe = Object.freeze({ Off: 0, 0: "Off", Lossy: 1, 1: "Lossy", Lossless: 2, 2: "Lossless" });
var se = Object.freeze({ Error: 0, 0: "Error", Follow: 1, 1: "Follow", Manual: 2, 2: "Manual" });
var Q = ["bytes"];
var o = 0;
function H() {
  o++, p = null, S = null, typeof numBytesDecoded < "u" && (numBytesDecoded = 0), typeof w < "u" && (w = 0), r = new WebAssembly.Instance(D, $).exports, r.__wbindgen_start();
}
__name(H, "H");
var X = typeof FinalizationRegistry > "u" ? { register: /* @__PURE__ */ __name(() => {
}, "register"), unregister: /* @__PURE__ */ __name(() => {
}, "unregister") } : new FinalizationRegistry(({ ptr: e, instance: t }) => {
  t === o && r.__wbg_intounderlyingbytesource_free(e >>> 0, 1);
});
var y = class {
  static {
    __name(this, "y");
  }
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, X.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_intounderlyingbytesource_free(t, 0);
  }
  get autoAllocateChunkSize() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    return r.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr) >>> 0;
  }
  pull(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    return r.intounderlyingbytesource_pull(this.__wbg_ptr, t);
  }
  start(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    r.intounderlyingbytesource_start(this.__wbg_ptr, t);
  }
  get type() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    let t = r.intounderlyingbytesource_type(this.__wbg_ptr);
    return Q[t];
  }
  cancel() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    let t = this.__destroy_into_raw();
    r.intounderlyingbytesource_cancel(t);
  }
};
Symbol.dispose && (y.prototype[Symbol.dispose] = y.prototype.free);
var Y = typeof FinalizationRegistry > "u" ? { register: /* @__PURE__ */ __name(() => {
}, "register"), unregister: /* @__PURE__ */ __name(() => {
}, "unregister") } : new FinalizationRegistry(({ ptr: e, instance: t }) => {
  t === o && r.__wbg_intounderlyingsink_free(e >>> 0, 1);
});
var m = class {
  static {
    __name(this, "m");
  }
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Y.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_intounderlyingsink_free(t, 0);
  }
  abort(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    let n = this.__destroy_into_raw();
    return r.intounderlyingsink_abort(n, t);
  }
  close() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    let t = this.__destroy_into_raw();
    return r.intounderlyingsink_close(t);
  }
  write(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    return r.intounderlyingsink_write(this.__wbg_ptr, t);
  }
};
Symbol.dispose && (m.prototype[Symbol.dispose] = m.prototype.free);
var Z = typeof FinalizationRegistry > "u" ? { register: /* @__PURE__ */ __name(() => {
}, "register"), unregister: /* @__PURE__ */ __name(() => {
}, "unregister") } : new FinalizationRegistry(({ ptr: e, instance: t }) => {
  t === o && r.__wbg_intounderlyingsource_free(e >>> 0, 1);
});
var x = class {
  static {
    __name(this, "x");
  }
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Z.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_intounderlyingsource_free(t, 0);
  }
  pull(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    return r.intounderlyingsource_pull(this.__wbg_ptr, t);
  }
  cancel() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    let t = this.__destroy_into_raw();
    r.intounderlyingsource_cancel(t);
  }
};
Symbol.dispose && (x.prototype[Symbol.dispose] = x.prototype.free);
var ee = typeof FinalizationRegistry > "u" ? { register: /* @__PURE__ */ __name(() => {
}, "register"), unregister: /* @__PURE__ */ __name(() => {
}, "unregister") } : new FinalizationRegistry(({ ptr: e, instance: t }) => {
  t === o && r.__wbg_minifyconfig_free(e >>> 0, 1);
});
var I = class {
  static {
    __name(this, "I");
  }
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, ee.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_minifyconfig_free(t, 0);
  }
  get js() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    return r.__wbg_get_minifyconfig_js(this.__wbg_ptr) !== 0;
  }
  set js(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_minifyconfig_js(this.__wbg_ptr, t);
  }
  get html() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    return r.__wbg_get_minifyconfig_html(this.__wbg_ptr) !== 0;
  }
  set html(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_minifyconfig_html(this.__wbg_ptr, t);
  }
  get css() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    return r.__wbg_get_minifyconfig_css(this.__wbg_ptr) !== 0;
  }
  set css(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_minifyconfig_css(this.__wbg_ptr, t);
  }
};
Symbol.dispose && (I.prototype[Symbol.dispose] = I.prototype.free);
var te = typeof FinalizationRegistry > "u" ? { register: /* @__PURE__ */ __name(() => {
}, "register"), unregister: /* @__PURE__ */ __name(() => {
}, "unregister") } : new FinalizationRegistry(({ ptr: e, instance: t }) => {
  t === o && r.__wbg_r2range_free(e >>> 0, 1);
});
var v = class {
  static {
    __name(this, "v");
  }
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, te.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    r.__wbg_r2range_free(t, 0);
  }
  get offset() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    let t = r.__wbg_get_r2range_offset(this.__wbg_ptr);
    return t[0] === 0 ? void 0 : t[1];
  }
  set offset(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_r2range_offset(this.__wbg_ptr, !f(t), f(t) ? 0 : t);
  }
  get length() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    let t = r.__wbg_get_r2range_length(this.__wbg_ptr);
    return t[0] === 0 ? void 0 : t[1];
  }
  set length(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_r2range_length(this.__wbg_ptr, !f(t), f(t) ? 0 : t);
  }
  get suffix() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    let t = r.__wbg_get_r2range_suffix(this.__wbg_ptr);
    return t[0] === 0 ? void 0 : t[1];
  }
  set suffix(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== o) throw new Error("Invalid stale object from previous Wasm instance");
    r.__wbg_set_r2range_suffix(this.__wbg_ptr, !f(t), f(t) ? 0 : t);
  }
};
Symbol.dispose && (v.prototype[Symbol.dispose] = v.prototype.free);
var $ = { __wbindgen_placeholder__: { __wbg_String_8f0eb39a4a4c2f66: /* @__PURE__ */ __name(function(e, t) {
  let n = String(t), i = h(n, r.__wbindgen_malloc, r.__wbindgen_realloc), _ = w;
  b().setInt32(e + 4, _, true), b().setInt32(e + 0, i, true);
}, "__wbg_String_8f0eb39a4a4c2f66"), __wbg___wbindgen_debug_string_df47ffb5e35e6763: /* @__PURE__ */ __name(function(e, t) {
  let n = L(t), i = h(n, r.__wbindgen_malloc, r.__wbindgen_realloc), _ = w;
  b().setInt32(e + 4, _, true), b().setInt32(e + 0, i, true);
}, "__wbg___wbindgen_debug_string_df47ffb5e35e6763"), __wbg___wbindgen_is_function_ee8a6c5833c90377: /* @__PURE__ */ __name(function(e) {
  return typeof e == "function";
}, "__wbg___wbindgen_is_function_ee8a6c5833c90377"), __wbg___wbindgen_is_undefined_2d472862bd29a478: /* @__PURE__ */ __name(function(e) {
  return e === void 0;
}, "__wbg___wbindgen_is_undefined_2d472862bd29a478"), __wbg___wbindgen_string_get_e4f06c90489ad01b: /* @__PURE__ */ __name(function(e, t) {
  let n = t, i = typeof n == "string" ? n : void 0;
  var _ = f(i) ? 0 : h(i, r.__wbindgen_malloc, r.__wbindgen_realloc), u = w;
  b().setInt32(e + 4, u, true), b().setInt32(e + 0, _, true);
}, "__wbg___wbindgen_string_get_e4f06c90489ad01b"), __wbg___wbindgen_throw_b855445ff6a94295: /* @__PURE__ */ __name(function(e, t) {
  throw new Error(d(e, t));
}, "__wbg___wbindgen_throw_b855445ff6a94295"), __wbg__wbg_cb_unref_2454a539ea5790d9: /* @__PURE__ */ __name(function(e) {
  e._wbg_cb_unref();
}, "__wbg__wbg_cb_unref_2454a539ea5790d9"), __wbg_body_587542b2fd8e06c0: /* @__PURE__ */ __name(function(e) {
  let t = e.body;
  return f(t) ? 0 : g(t);
}, "__wbg_body_587542b2fd8e06c0"), __wbg_buffer_ccc4520b36d3ccf4: /* @__PURE__ */ __name(function(e) {
  return e.buffer;
}, "__wbg_buffer_ccc4520b36d3ccf4"), __wbg_byobRequest_2344e6975f27456e: /* @__PURE__ */ __name(function(e) {
  let t = e.byobRequest;
  return f(t) ? 0 : g(t);
}, "__wbg_byobRequest_2344e6975f27456e"), __wbg_byteLength_bcd42e4025299788: /* @__PURE__ */ __name(function(e) {
  return e.byteLength;
}, "__wbg_byteLength_bcd42e4025299788"), __wbg_byteOffset_ca3a6cf7944b364b: /* @__PURE__ */ __name(function(e) {
  return e.byteOffset;
}, "__wbg_byteOffset_ca3a6cf7944b364b"), __wbg_call_525440f72fbfc0ea: /* @__PURE__ */ __name(function() {
  return a(function(e, t, n) {
    return e.call(t, n);
  }, arguments);
}, "__wbg_call_525440f72fbfc0ea"), __wbg_call_e762c39fa8ea36bf: /* @__PURE__ */ __name(function() {
  return a(function(e, t) {
    return e.call(t);
  }, arguments);
}, "__wbg_call_e762c39fa8ea36bf"), __wbg_cancel_48ab6f9dc366e369: /* @__PURE__ */ __name(function(e) {
  return e.cancel();
}, "__wbg_cancel_48ab6f9dc366e369"), __wbg_catch_943836faa5d29bfb: /* @__PURE__ */ __name(function(e, t) {
  return e.catch(t);
}, "__wbg_catch_943836faa5d29bfb"), __wbg_cause_2551549fc39b3b73: /* @__PURE__ */ __name(function(e) {
  return e.cause;
}, "__wbg_cause_2551549fc39b3b73"), __wbg_cf_14f2f56599b2a66f: /* @__PURE__ */ __name(function() {
  return a(function(e) {
    let t = e.cf;
    return f(t) ? 0 : g(t);
  }, arguments);
}, "__wbg_cf_14f2f56599b2a66f"), __wbg_cf_dc4bf2e09a6a0fc0: /* @__PURE__ */ __name(function() {
  return a(function(e) {
    let t = e.cf;
    return f(t) ? 0 : g(t);
  }, arguments);
}, "__wbg_cf_dc4bf2e09a6a0fc0"), __wbg_close_5a6caed3231b68cd: /* @__PURE__ */ __name(function() {
  return a(function(e) {
    e.close();
  }, arguments);
}, "__wbg_close_5a6caed3231b68cd"), __wbg_close_6956df845478561a: /* @__PURE__ */ __name(function() {
  return a(function(e) {
    e.close();
  }, arguments);
}, "__wbg_close_6956df845478561a"), __wbg_enqueue_7b18a650aec77898: /* @__PURE__ */ __name(function() {
  return a(function(e, t) {
    e.enqueue(t);
  }, arguments);
}, "__wbg_enqueue_7b18a650aec77898"), __wbg_error_7534b8e9a36f1ab4: /* @__PURE__ */ __name(function(e, t) {
  let n, i;
  try {
    n = e, i = t, console.error(d(e, t));
  } finally {
    r.__wbindgen_free(n, i, 1);
  }
}, "__wbg_error_7534b8e9a36f1ab4"), __wbg_error_a7f8fbb0523dae15: /* @__PURE__ */ __name(function(e) {
  console.error(e);
}, "__wbg_error_a7f8fbb0523dae15"), __wbg_fetch_8725865ff47e7fcc: /* @__PURE__ */ __name(function(e, t, n) {
  return e.fetch(t, n);
}, "__wbg_fetch_8725865ff47e7fcc"), __wbg_fetch_a33defa4cad834df: /* @__PURE__ */ __name(function(e, t, n, i) {
  return e.fetch(d(t, n), i);
}, "__wbg_fetch_a33defa4cad834df"), __wbg_getReader_48e00749fe3f6089: /* @__PURE__ */ __name(function() {
  return a(function(e) {
    return e.getReader();
  }, arguments);
}, "__wbg_getReader_48e00749fe3f6089"), __wbg_get_done_a0463af43a1fc764: /* @__PURE__ */ __name(function(e) {
  let t = e.done;
  return f(t) ? 16777215 : t ? 1 : 0;
}, "__wbg_get_done_a0463af43a1fc764"), __wbg_get_value_5ce96c9f81ce7398: /* @__PURE__ */ __name(function(e) {
  return e.value;
}, "__wbg_get_value_5ce96c9f81ce7398"), __wbg_headers_7ae6dbb1272f8fc6: /* @__PURE__ */ __name(function(e) {
  return e.headers;
}, "__wbg_headers_7ae6dbb1272f8fc6"), __wbg_headers_b87d7eaba61c3278: /* @__PURE__ */ __name(function(e) {
  return e.headers;
}, "__wbg_headers_b87d7eaba61c3278"), __wbg_instanceof_Error_a944ec10920129e2: /* @__PURE__ */ __name(function(e) {
  let t;
  try {
    t = e instanceof Error;
  } catch {
    t = false;
  }
  return t;
}, "__wbg_instanceof_Error_a944ec10920129e2"), __wbg_instanceof_ReadableStream_c34776a5fb889c65: /* @__PURE__ */ __name(function(e) {
  let t;
  try {
    t = e instanceof ReadableStream;
  } catch {
    t = false;
  }
  return t;
}, "__wbg_instanceof_ReadableStream_c34776a5fb889c65"), __wbg_instanceof_Response_f4f3e87e07f3135c: /* @__PURE__ */ __name(function(e) {
  let t;
  try {
    t = e instanceof Response;
  } catch {
    t = false;
  }
  return t;
}, "__wbg_instanceof_Response_f4f3e87e07f3135c"), __wbg_length_69bca3cb64fc8748: /* @__PURE__ */ __name(function(e) {
  return e.length;
}, "__wbg_length_69bca3cb64fc8748"), __wbg_method_07a9b3454994db22: /* @__PURE__ */ __name(function(e, t) {
  let n = t.method, i = h(n, r.__wbindgen_malloc, r.__wbindgen_realloc), _ = w;
  b().setInt32(e + 4, _, true), b().setInt32(e + 0, i, true);
}, "__wbg_method_07a9b3454994db22"), __wbg_new_1acc0b6eea89d040: /* @__PURE__ */ __name(function() {
  return new Object();
}, "__wbg_new_1acc0b6eea89d040"), __wbg_new_3c3d849046688a66: /* @__PURE__ */ __name(function(e, t) {
  try {
    var n = { a: e, b: t }, i = /* @__PURE__ */ __name((u, s) => {
      let c = n.a;
      n.a = 0;
      try {
        return J(c, n.b, u, s);
      } finally {
        n.a = c;
      }
    }, "i");
    return new Promise(i);
  } finally {
    n.a = n.b = 0;
  }
}, "__wbg_new_3c3d849046688a66"), __wbg_new_8a6f238a6ece86ea: /* @__PURE__ */ __name(function() {
  return new Error();
}, "__wbg_new_8a6f238a6ece86ea"), __wbg_new_9edf9838a2def39c: /* @__PURE__ */ __name(function() {
  return a(function() {
    return new Headers();
  }, arguments);
}, "__wbg_new_9edf9838a2def39c"), __wbg_new_a7442b4b19c1a356: /* @__PURE__ */ __name(function(e, t) {
  return new Error(d(e, t));
}, "__wbg_new_a7442b4b19c1a356"), __wbg_new_no_args_ee98eee5275000a4: /* @__PURE__ */ __name(function(e, t) {
  return new Function(d(e, t));
}, "__wbg_new_no_args_ee98eee5275000a4"), __wbg_new_with_byte_offset_and_length_46e3e6a5e9f9e89b: /* @__PURE__ */ __name(function(e, t, n) {
  return new Uint8Array(e, t >>> 0, n >>> 0);
}, "__wbg_new_with_byte_offset_and_length_46e3e6a5e9f9e89b"), __wbg_new_with_length_01aa0dc35aa13543: /* @__PURE__ */ __name(function(e) {
  return new Uint8Array(e >>> 0);
}, "__wbg_new_with_length_01aa0dc35aa13543"), __wbg_new_with_opt_buffer_source_and_init_d7e792cdf59c8ea6: /* @__PURE__ */ __name(function() {
  return a(function(e, t) {
    return new Response(e, t);
  }, arguments);
}, "__wbg_new_with_opt_buffer_source_and_init_d7e792cdf59c8ea6"), __wbg_new_with_opt_readable_stream_and_init_b3dac7204db32cac: /* @__PURE__ */ __name(function() {
  return a(function(e, t) {
    return new Response(e, t);
  }, arguments);
}, "__wbg_new_with_opt_readable_stream_and_init_b3dac7204db32cac"), __wbg_new_with_opt_str_and_init_271896583401be6f: /* @__PURE__ */ __name(function() {
  return a(function(e, t, n) {
    return new Response(e === 0 ? void 0 : d(e, t), n);
  }, arguments);
}, "__wbg_new_with_opt_str_and_init_271896583401be6f"), __wbg_prototypesetcall_2a6620b6922694b2: /* @__PURE__ */ __name(function(e, t, n) {
  Uint8Array.prototype.set.call(U(e, t), n);
}, "__wbg_prototypesetcall_2a6620b6922694b2"), __wbg_queueMicrotask_34d692c25c47d05b: /* @__PURE__ */ __name(function(e) {
  return e.queueMicrotask;
}, "__wbg_queueMicrotask_34d692c25c47d05b"), __wbg_queueMicrotask_9d76cacb20c84d58: /* @__PURE__ */ __name(function(e) {
  queueMicrotask(e);
}, "__wbg_queueMicrotask_9d76cacb20c84d58"), __wbg_read_48f1593df542f968: /* @__PURE__ */ __name(function(e) {
  return e.read();
}, "__wbg_read_48f1593df542f968"), __wbg_releaseLock_5d0b5a68887b891d: /* @__PURE__ */ __name(function(e) {
  e.releaseLock();
}, "__wbg_releaseLock_5d0b5a68887b891d"), __wbg_resolve_caf97c30b83f7053: /* @__PURE__ */ __name(function(e) {
  return Promise.resolve(e);
}, "__wbg_resolve_caf97c30b83f7053"), __wbg_respond_0f4dbf5386f5c73e: /* @__PURE__ */ __name(function() {
  return a(function(e, t) {
    e.respond(t >>> 0);
  }, arguments);
}, "__wbg_respond_0f4dbf5386f5c73e"), __wbg_set_8b342d8cd9d2a02c: /* @__PURE__ */ __name(function() {
  return a(function(e, t, n, i, _) {
    e.set(d(t, n), d(i, _));
  }, arguments);
}, "__wbg_set_8b342d8cd9d2a02c"), __wbg_set_9e6516df7b7d0f19: /* @__PURE__ */ __name(function(e, t, n) {
  e.set(U(t, n));
}, "__wbg_set_9e6516df7b7d0f19"), __wbg_set_c2abbebe8b9ebee1: /* @__PURE__ */ __name(function() {
  return a(function(e, t, n) {
    return Reflect.set(e, t, n);
  }, arguments);
}, "__wbg_set_c2abbebe8b9ebee1"), __wbg_set_headers_107379072e02fee5: /* @__PURE__ */ __name(function(e, t) {
  e.headers = t;
}, "__wbg_set_headers_107379072e02fee5"), __wbg_set_signal_dda2cf7ccb6bee0f: /* @__PURE__ */ __name(function(e, t) {
  e.signal = t;
}, "__wbg_set_signal_dda2cf7ccb6bee0f"), __wbg_set_status_886bf143c25d0706: /* @__PURE__ */ __name(function(e, t) {
  e.status = t;
}, "__wbg_set_status_886bf143c25d0706"), __wbg_stack_0ed75d68575b0f3c: /* @__PURE__ */ __name(function(e, t) {
  let n = t.stack, i = h(n, r.__wbindgen_malloc, r.__wbindgen_realloc), _ = w;
  b().setInt32(e + 4, _, true), b().setInt32(e + 0, i, true);
}, "__wbg_stack_0ed75d68575b0f3c"), __wbg_static_accessor_GLOBAL_89e1d9ac6a1b250e: /* @__PURE__ */ __name(function() {
  let e = typeof global > "u" ? null : global;
  return f(e) ? 0 : g(e);
}, "__wbg_static_accessor_GLOBAL_89e1d9ac6a1b250e"), __wbg_static_accessor_GLOBAL_THIS_8b530f326a9e48ac: /* @__PURE__ */ __name(function() {
  let e = typeof globalThis > "u" ? null : globalThis;
  return f(e) ? 0 : g(e);
}, "__wbg_static_accessor_GLOBAL_THIS_8b530f326a9e48ac"), __wbg_static_accessor_SELF_6fdf4b64710cc91b: /* @__PURE__ */ __name(function() {
  let e = typeof self > "u" ? null : self;
  return f(e) ? 0 : g(e);
}, "__wbg_static_accessor_SELF_6fdf4b64710cc91b"), __wbg_static_accessor_WINDOW_b45bfc5a37f6cfa2: /* @__PURE__ */ __name(function() {
  let e = typeof window > "u" ? null : window;
  return f(e) ? 0 : g(e);
}, "__wbg_static_accessor_WINDOW_b45bfc5a37f6cfa2"), __wbg_status_de7eed5a7a5bfd5d: /* @__PURE__ */ __name(function(e) {
  return e.status;
}, "__wbg_status_de7eed5a7a5bfd5d"), __wbg_then_4f46f6544e6b4a28: /* @__PURE__ */ __name(function(e, t) {
  return e.then(t);
}, "__wbg_then_4f46f6544e6b4a28"), __wbg_then_70d05cf780a18d77: /* @__PURE__ */ __name(function(e, t, n) {
  return e.then(t, n);
}, "__wbg_then_70d05cf780a18d77"), __wbg_toString_8eec07f6f4c057e4: /* @__PURE__ */ __name(function(e) {
  return e.toString();
}, "__wbg_toString_8eec07f6f4c057e4"), __wbg_url_3e15bfb59fa6b660: /* @__PURE__ */ __name(function(e, t) {
  let n = t.url, i = h(n, r.__wbindgen_malloc, r.__wbindgen_realloc), _ = w;
  b().setInt32(e + 4, _, true), b().setInt32(e + 0, i, true);
}, "__wbg_url_3e15bfb59fa6b660"), __wbg_view_f6c15ac9fed63bbd: /* @__PURE__ */ __name(function(e) {
  let t = e.view;
  return f(t) ? 0 : g(t);
}, "__wbg_view_f6c15ac9fed63bbd"), __wbg_webSocket_e055969c627461a5: /* @__PURE__ */ __name(function() {
  return a(function(e) {
    let t = e.webSocket;
    return f(t) ? 0 : g(t);
  }, arguments);
}, "__wbg_webSocket_e055969c627461a5"), __wbindgen_cast_0663cdfcad33dbe7: /* @__PURE__ */ __name(function(e, t) {
  return G(e, t, r.wasm_bindgen__closure__destroy__h16e977aea5b78f55, K);
}, "__wbindgen_cast_0663cdfcad33dbe7"), __wbindgen_cast_2241b6af4c4b2941: /* @__PURE__ */ __name(function(e, t) {
  return d(e, t);
}, "__wbindgen_cast_2241b6af4c4b2941"), __wbindgen_init_externref_table: /* @__PURE__ */ __name(function() {
  let e = r.__wbindgen_externrefs, t = e.grow(4);
  e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, true), e.set(t + 3, false);
}, "__wbindgen_init_externref_table") } };
var ne = new WebAssembly.Instance(D, $);
r = ne.exports;
r.__wbindgen_start();
Error.stackTraceLimit = 100;
var W = false;
function N() {
}
__name(N, "N");
N();
var P = 0;
function M() {
  W && (console.log("Reinitializing Wasm application"), H(), W = false, N(), P++);
}
__name(M, "M");
addEventListener("error", (e) => {
  T(e.error);
});
function T(e) {
  e instanceof WebAssembly.RuntimeError && (console.error("Critical", e), W = true);
}
__name(T, "T");
var O = class extends re {
  static {
    __name(this, "O");
  }
};
O.prototype.fetch = function(t) {
  return B.call(this, t, this.env, this.ctx);
};
var _e = { set: /* @__PURE__ */ __name((e, t, n, i) => Reflect.set(e.instance, t, n, i), "set"), has: /* @__PURE__ */ __name((e, t) => Reflect.has(e.instance, t), "has"), deleteProperty: /* @__PURE__ */ __name((e, t) => Reflect.deleteProperty(e.instance, t), "deleteProperty"), apply: /* @__PURE__ */ __name((e, t, n) => Reflect.apply(e.instance, t, n), "apply"), construct: /* @__PURE__ */ __name((e, t, n) => Reflect.construct(e.instance, t, n), "construct"), getPrototypeOf: /* @__PURE__ */ __name((e) => Reflect.getPrototypeOf(e.instance), "getPrototypeOf"), setPrototypeOf: /* @__PURE__ */ __name((e, t) => Reflect.setPrototypeOf(e.instance, t), "setPrototypeOf"), isExtensible: /* @__PURE__ */ __name((e) => Reflect.isExtensible(e.instance), "isExtensible"), preventExtensions: /* @__PURE__ */ __name((e) => Reflect.preventExtensions(e.instance), "preventExtensions"), getOwnPropertyDescriptor: /* @__PURE__ */ __name((e, t) => Reflect.getOwnPropertyDescriptor(e.instance, t), "getOwnPropertyDescriptor"), defineProperty: /* @__PURE__ */ __name((e, t, n) => Reflect.defineProperty(e.instance, t, n), "defineProperty"), ownKeys: /* @__PURE__ */ __name((e) => Reflect.ownKeys(e.instance), "ownKeys") };
var R = { construct(e, t, n) {
  try {
    M();
    let i = { instance: Reflect.construct(e, t, n), instanceId: P, ctor: e, args: t, newTarget: n };
    return new Proxy(i, { ..._e, get(_, u, s) {
      _.instanceId !== P && (_.instance = Reflect.construct(_.ctor, _.args, _.newTarget), _.instanceId = P);
      let c = Reflect.get(_.instance, u, s);
      return typeof c != "function" ? c : c.constructor === Function ? new Proxy(c, { apply(l, z, A) {
        M();
        try {
          return l.apply(z, A);
        } catch (E) {
          throw T(E), E;
        }
      } }) : new Proxy(c, { async apply(l, z, A) {
        M();
        try {
          return await l.apply(z, A);
        } catch (E) {
          throw T(E), E;
        }
      } });
    } });
  } catch (i) {
    throw W = true, i;
  }
} };
var fe = new Proxy(O, R);
var ue = new Proxy(y, R);
var ae = new Proxy(m, R);
var be = new Proxy(x, R);
var ge = new Proxy(I, R);
var we = new Proxy(v, R);
export {
  ue as IntoUnderlyingByteSource,
  ae as IntoUnderlyingSink,
  be as IntoUnderlyingSource,
  ge as MinifyConfig,
  we as R2Range,
  fe as default
};
//# sourceMappingURL=index.js.map
