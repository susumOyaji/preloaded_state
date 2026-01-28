var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// build/index.js
import { WorkerEntrypoint as ft } from "cloudflare:workers";
import V from "./3bed254d3a85d181afeb63a44c075df709d0ff0d-index_bg.wasm";
var v = class {
  static {
    __name(this, "v");
  }
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Z.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    o.__wbg_containerstartupoptions_free(t, 0);
  }
  get enableInternet() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    let t = o.__wbg_get_containerstartupoptions_enableInternet(this.__wbg_ptr);
    return t === 16777215 ? void 0 : t !== 0;
  }
  get entrypoint() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    let t = o.__wbg_get_containerstartupoptions_entrypoint(this.__wbg_ptr);
    var e = _t(t[0], t[1]).slice();
    return o.__wbindgen_free(t[0], t[1] * 4, 4), e;
  }
  get env() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    return o.__wbg_get_containerstartupoptions_env(this.__wbg_ptr);
  }
  set enableInternet(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    o.__wbg_set_containerstartupoptions_enableInternet(this.__wbg_ptr, f(t) ? 16777215 : t ? 1 : 0);
  }
  set entrypoint(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    let e = it(t, o.__wbindgen_malloc), r = l;
    o.__wbg_set_containerstartupoptions_entrypoint(this.__wbg_ptr, e, r);
  }
  set env(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    o.__wbg_set_containerstartupoptions_env(this.__wbg_ptr, t);
  }
};
Symbol.dispose && (v.prototype[Symbol.dispose] = v.prototype.free);
var x = class {
  static {
    __name(this, "x");
  }
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, tt.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    o.__wbg_intounderlyingbytesource_free(t, 0);
  }
  get autoAllocateChunkSize() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    return o.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr) >>> 0;
  }
  cancel() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    let t = this.__destroy_into_raw();
    o.intounderlyingbytesource_cancel(t);
  }
  pull(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    return o.intounderlyingbytesource_pull(this.__wbg_ptr, t);
  }
  start(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    o.intounderlyingbytesource_start(this.__wbg_ptr, t);
  }
  get type() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    let t = o.intounderlyingbytesource_type(this.__wbg_ptr);
    return Q[t];
  }
};
Symbol.dispose && (x.prototype[Symbol.dispose] = x.prototype.free);
var I = class {
  static {
    __name(this, "I");
  }
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, et.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    o.__wbg_intounderlyingsink_free(t, 0);
  }
  abort(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    let e = this.__destroy_into_raw();
    return o.intounderlyingsink_abort(e, t);
  }
  close() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    let t = this.__destroy_into_raw();
    return o.intounderlyingsink_close(t);
  }
  write(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    return o.intounderlyingsink_write(this.__wbg_ptr, t);
  }
};
Symbol.dispose && (I.prototype[Symbol.dispose] = I.prototype.free);
var R = class {
  static {
    __name(this, "R");
  }
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, nt.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    o.__wbg_intounderlyingsource_free(t, 0);
  }
  cancel() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    let t = this.__destroy_into_raw();
    o.intounderlyingsource_cancel(t);
  }
  pull(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    return o.intounderlyingsource_pull(this.__wbg_ptr, t);
  }
};
Symbol.dispose && (R.prototype[Symbol.dispose] = R.prototype.free);
var h = class n {
  static {
    __name(this, "n");
  }
  static __wrap(t) {
    t = t >>> 0;
    let e = Object.create(n.prototype);
    return e.__wbg_ptr = t, e.__wbg_inst = i, L.register(e, { ptr: t, instance: i }, e), e;
  }
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, L.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    o.__wbg_minifyconfig_free(t, 0);
  }
  get css() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    return o.__wbg_get_minifyconfig_css(this.__wbg_ptr) !== 0;
  }
  get html() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    return o.__wbg_get_minifyconfig_html(this.__wbg_ptr) !== 0;
  }
  get js() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    return o.__wbg_get_minifyconfig_js(this.__wbg_ptr) !== 0;
  }
  set css(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    o.__wbg_set_minifyconfig_css(this.__wbg_ptr, t);
  }
  set html(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    o.__wbg_set_minifyconfig_html(this.__wbg_ptr, t);
  }
  set js(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    o.__wbg_set_minifyconfig_js(this.__wbg_ptr, t);
  }
};
Symbol.dispose && (h.prototype[Symbol.dispose] = h.prototype.free);
var E = class {
  static {
    __name(this, "E");
  }
  __destroy_into_raw() {
    let t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, rt.unregister(this), t;
  }
  free() {
    let t = this.__destroy_into_raw();
    o.__wbg_r2range_free(t, 0);
  }
  get length() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    let t = o.__wbg_get_r2range_length(this.__wbg_ptr);
    return t[0] === 0 ? void 0 : t[1];
  }
  get offset() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    let t = o.__wbg_get_r2range_offset(this.__wbg_ptr);
    return t[0] === 0 ? void 0 : t[1];
  }
  get suffix() {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    let t = o.__wbg_get_r2range_suffix(this.__wbg_ptr);
    return t[0] === 0 ? void 0 : t[1];
  }
  set length(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    o.__wbg_set_r2range_length(this.__wbg_ptr, !f(t), f(t) ? 0 : t);
  }
  set offset(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    o.__wbg_set_r2range_offset(this.__wbg_ptr, !f(t), f(t) ? 0 : t);
  }
  set suffix(t) {
    if (this.__wbg_inst !== void 0 && this.__wbg_inst !== i) throw new Error("Invalid stale object from previous Wasm instance");
    o.__wbg_set_r2range_suffix(this.__wbg_ptr, !f(t), f(t) ? 0 : t);
  }
};
Symbol.dispose && (E.prototype[Symbol.dispose] = E.prototype.free);
function B() {
  i++, p = null, S = null, typeof numBytesDecoded < "u" && (numBytesDecoded = 0), typeof l < "u" && (l = 0), o = new WebAssembly.Instance(V, N()).exports, o.__wbindgen_start();
}
__name(B, "B");
function H(n2, t, e) {
  return o.fetch(n2, t, e);
}
__name(H, "H");
function M(n2) {
  o.setPanicHook(n2);
}
__name(M, "M");
function N() {
  return { __proto__: null, "./index_bg.js": { __proto__: null, __wbg_Error_8c4e43fe74559d73: /* @__PURE__ */ __name(function(t, e) {
    return Error(g(t, e));
  }, "__wbg_Error_8c4e43fe74559d73"), __wbg_Number_04624de7d0e8332d: /* @__PURE__ */ __name(function(t) {
    return Number(t);
  }, "__wbg_Number_04624de7d0e8332d"), __wbg_String_8f0eb39a4a4c2f66: /* @__PURE__ */ __name(function(t, e) {
    let r = String(e), _ = m(r, o.__wbindgen_malloc, o.__wbindgen_realloc), s = l;
    b().setInt32(t + 4, s, true), b().setInt32(t + 0, _, true);
  }, "__wbg_String_8f0eb39a4a4c2f66"), __wbg___wbindgen_boolean_get_bbbb1c18aa2f5e25: /* @__PURE__ */ __name(function(t) {
    let e = t, r = typeof e == "boolean" ? e : void 0;
    return f(r) ? 16777215 : r ? 1 : 0;
  }, "__wbg___wbindgen_boolean_get_bbbb1c18aa2f5e25"), __wbg___wbindgen_debug_string_0bc8482c6e3508ae: /* @__PURE__ */ __name(function(t, e) {
    let r = U(e), _ = m(r, o.__wbindgen_malloc, o.__wbindgen_realloc), s = l;
    b().setInt32(t + 4, s, true), b().setInt32(t + 0, _, true);
  }, "__wbg___wbindgen_debug_string_0bc8482c6e3508ae"), __wbg___wbindgen_in_47fa6863be6f2f25: /* @__PURE__ */ __name(function(t, e) {
    return t in e;
  }, "__wbg___wbindgen_in_47fa6863be6f2f25"), __wbg___wbindgen_is_function_0095a73b8b156f76: /* @__PURE__ */ __name(function(t) {
    return typeof t == "function";
  }, "__wbg___wbindgen_is_function_0095a73b8b156f76"), __wbg___wbindgen_is_object_5ae8e5880f2c1fbd: /* @__PURE__ */ __name(function(t) {
    let e = t;
    return typeof e == "object" && e !== null;
  }, "__wbg___wbindgen_is_object_5ae8e5880f2c1fbd"), __wbg___wbindgen_is_string_cd444516edc5b180: /* @__PURE__ */ __name(function(t) {
    return typeof t == "string";
  }, "__wbg___wbindgen_is_string_cd444516edc5b180"), __wbg___wbindgen_is_undefined_9e4d92534c42d778: /* @__PURE__ */ __name(function(t) {
    return t === void 0;
  }, "__wbg___wbindgen_is_undefined_9e4d92534c42d778"), __wbg___wbindgen_jsval_loose_eq_9dd77d8cd6671811: /* @__PURE__ */ __name(function(t, e) {
    return t == e;
  }, "__wbg___wbindgen_jsval_loose_eq_9dd77d8cd6671811"), __wbg___wbindgen_number_get_8ff4255516ccad3e: /* @__PURE__ */ __name(function(t, e) {
    let r = e, _ = typeof r == "number" ? r : void 0;
    b().setFloat64(t + 8, f(_) ? 0 : _, true), b().setInt32(t + 0, !f(_), true);
  }, "__wbg___wbindgen_number_get_8ff4255516ccad3e"), __wbg___wbindgen_string_get_72fb696202c56729: /* @__PURE__ */ __name(function(t, e) {
    let r = e, _ = typeof r == "string" ? r : void 0;
    var s = f(_) ? 0 : m(_, o.__wbindgen_malloc, o.__wbindgen_realloc), u = l;
    b().setInt32(t + 4, u, true), b().setInt32(t + 0, s, true);
  }, "__wbg___wbindgen_string_get_72fb696202c56729"), __wbg___wbindgen_throw_be289d5034ed271b: /* @__PURE__ */ __name(function(t, e) {
    throw new Error(g(t, e));
  }, "__wbg___wbindgen_throw_be289d5034ed271b"), __wbg__wbg_cb_unref_d9b87ff7982e3b21: /* @__PURE__ */ __name(function(t) {
    t._wbg_cb_unref();
  }, "__wbg__wbg_cb_unref_d9b87ff7982e3b21"), __wbg_all_5bbc472de3cd8e1b: /* @__PURE__ */ __name(function() {
    return c(function(t) {
      return t.all();
    }, arguments);
  }, "__wbg_all_5bbc472de3cd8e1b"), __wbg_bind_e86007a67c80362e: /* @__PURE__ */ __name(function() {
    return c(function(t, e) {
      return t.bind(...e);
    }, arguments);
  }, "__wbg_bind_e86007a67c80362e"), __wbg_body_3a0b4437dadea6bf: /* @__PURE__ */ __name(function(t) {
    let e = t.body;
    return f(e) ? 0 : w(e);
  }, "__wbg_body_3a0b4437dadea6bf"), __wbg_buffer_26d0910f3a5bc899: /* @__PURE__ */ __name(function(t) {
    return t.buffer;
  }, "__wbg_buffer_26d0910f3a5bc899"), __wbg_byobRequest_80e594e6da4e1af7: /* @__PURE__ */ __name(function(t) {
    let e = t.byobRequest;
    return f(e) ? 0 : w(e);
  }, "__wbg_byobRequest_80e594e6da4e1af7"), __wbg_byteLength_3417f266f4bf562a: /* @__PURE__ */ __name(function(t) {
    return t.byteLength;
  }, "__wbg_byteLength_3417f266f4bf562a"), __wbg_byteOffset_f88547ca47c86358: /* @__PURE__ */ __name(function(t) {
    return t.byteOffset;
  }, "__wbg_byteOffset_f88547ca47c86358"), __wbg_call_389efe28435a9388: /* @__PURE__ */ __name(function() {
    return c(function(t, e) {
      return t.call(e);
    }, arguments);
  }, "__wbg_call_389efe28435a9388"), __wbg_call_4708e0c13bdc8e95: /* @__PURE__ */ __name(function() {
    return c(function(t, e, r) {
      return t.call(e, r);
    }, arguments);
  }, "__wbg_call_4708e0c13bdc8e95"), __wbg_cancel_2c0a0a251ff6b2b7: /* @__PURE__ */ __name(function(t) {
    return t.cancel();
  }, "__wbg_cancel_2c0a0a251ff6b2b7"), __wbg_catch_c1f8c7623b458214: /* @__PURE__ */ __name(function(t, e) {
    return t.catch(e);
  }, "__wbg_catch_c1f8c7623b458214"), __wbg_cause_0fc168d4eaec87cc: /* @__PURE__ */ __name(function(t) {
    return t.cause;
  }, "__wbg_cause_0fc168d4eaec87cc"), __wbg_cf_826be5049e21969d: /* @__PURE__ */ __name(function() {
    return c(function(t) {
      let e = t.cf;
      return f(e) ? 0 : w(e);
    }, arguments);
  }, "__wbg_cf_826be5049e21969d"), __wbg_cf_b8165e79377eeebd: /* @__PURE__ */ __name(function() {
    return c(function(t) {
      let e = t.cf;
      return f(e) ? 0 : w(e);
    }, arguments);
  }, "__wbg_cf_b8165e79377eeebd"), __wbg_close_06dfa0a815b9d71f: /* @__PURE__ */ __name(function() {
    return c(function(t) {
      t.close();
    }, arguments);
  }, "__wbg_close_06dfa0a815b9d71f"), __wbg_close_a79afee31de55b36: /* @__PURE__ */ __name(function() {
    return c(function(t) {
      t.close();
    }, arguments);
  }, "__wbg_close_a79afee31de55b36"), __wbg_constructor_ad6c0ed428f55d34: /* @__PURE__ */ __name(function(t) {
    return t.constructor;
  }, "__wbg_constructor_ad6c0ed428f55d34"), __wbg_done_57b39ecd9addfe81: /* @__PURE__ */ __name(function(t) {
    return t.done;
  }, "__wbg_done_57b39ecd9addfe81"), __wbg_enqueue_2c63f2044f257c3e: /* @__PURE__ */ __name(function() {
    return c(function(t, e) {
      t.enqueue(e);
    }, arguments);
  }, "__wbg_enqueue_2c63f2044f257c3e"), __wbg_error_7534b8e9a36f1ab4: /* @__PURE__ */ __name(function(t, e) {
    let r, _;
    try {
      r = t, _ = e, console.error(g(t, e));
    } finally {
      o.__wbindgen_free(r, _, 1);
    }
  }, "__wbg_error_7534b8e9a36f1ab4"), __wbg_error_9a7fe3f932034cde: /* @__PURE__ */ __name(function(t) {
    console.error(t);
  }, "__wbg_error_9a7fe3f932034cde"), __wbg_error_f852e41c69b0bd84: /* @__PURE__ */ __name(function(t, e) {
    console.error(t, e);
  }, "__wbg_error_f852e41c69b0bd84"), __wbg_fetch_2c1e75cf1cd9a524: /* @__PURE__ */ __name(function(t, e, r, _) {
    return t.fetch(g(e, r), _);
  }, "__wbg_fetch_2c1e75cf1cd9a524"), __wbg_fetch_c97461e1e8f610cd: /* @__PURE__ */ __name(function(t, e, r) {
    return t.fetch(e, r);
  }, "__wbg_fetch_c97461e1e8f610cd"), __wbg_getReader_48e00749fe3f6089: /* @__PURE__ */ __name(function() {
    return c(function(t) {
      return t.getReader();
    }, arguments);
  }, "__wbg_getReader_48e00749fe3f6089"), __wbg_getTime_1e3cd1391c5c3995: /* @__PURE__ */ __name(function(t) {
    return t.getTime();
  }, "__wbg_getTime_1e3cd1391c5c3995"), __wbg_get_9b94d73e6221f75c: /* @__PURE__ */ __name(function(t, e) {
    return t[e >>> 0];
  }, "__wbg_get_9b94d73e6221f75c"), __wbg_get_b3ed3ad4be2bc8ac: /* @__PURE__ */ __name(function() {
    return c(function(t, e) {
      return Reflect.get(t, e);
    }, arguments);
  }, "__wbg_get_b3ed3ad4be2bc8ac"), __wbg_get_done_1ad1c16537f444c6: /* @__PURE__ */ __name(function(t) {
    let e = t.done;
    return f(e) ? 16777215 : e ? 1 : 0;
  }, "__wbg_get_done_1ad1c16537f444c6"), __wbg_get_value_6b77a1b7b90c9200: /* @__PURE__ */ __name(function(t) {
    return t.value;
  }, "__wbg_get_value_6b77a1b7b90c9200"), __wbg_get_with_ref_key_1dc361bd10053bfe: /* @__PURE__ */ __name(function(t, e) {
    return t[e];
  }, "__wbg_get_with_ref_key_1dc361bd10053bfe"), __wbg_headers_59a2938db9f80985: /* @__PURE__ */ __name(function(t) {
    return t.headers;
  }, "__wbg_headers_59a2938db9f80985"), __wbg_headers_5a897f7fee9a0571: /* @__PURE__ */ __name(function(t) {
    return t.headers;
  }, "__wbg_headers_5a897f7fee9a0571"), __wbg_instanceof_ArrayBuffer_c367199e2fa2aa04: /* @__PURE__ */ __name(function(t) {
    let e;
    try {
      e = t instanceof ArrayBuffer;
    } catch {
      e = false;
    }
    return e;
  }, "__wbg_instanceof_ArrayBuffer_c367199e2fa2aa04"), __wbg_instanceof_Error_8573fe0b0b480f46: /* @__PURE__ */ __name(function(t) {
    let e;
    try {
      e = t instanceof Error;
    } catch {
      e = false;
    }
    return e;
  }, "__wbg_instanceof_Error_8573fe0b0b480f46"), __wbg_instanceof_ReadableStream_8ab3825017e203e9: /* @__PURE__ */ __name(function(t) {
    let e;
    try {
      e = t instanceof ReadableStream;
    } catch {
      e = false;
    }
    return e;
  }, "__wbg_instanceof_ReadableStream_8ab3825017e203e9"), __wbg_instanceof_Response_ee1d54d79ae41977: /* @__PURE__ */ __name(function(t) {
    let e;
    try {
      e = t instanceof Response;
    } catch {
      e = false;
    }
    return e;
  }, "__wbg_instanceof_Response_ee1d54d79ae41977"), __wbg_instanceof_Uint8Array_9b9075935c74707c: /* @__PURE__ */ __name(function(t) {
    let e;
    try {
      e = t instanceof Uint8Array;
    } catch {
      e = false;
    }
    return e;
  }, "__wbg_instanceof_Uint8Array_9b9075935c74707c"), __wbg_isArray_d314bb98fcf08331: /* @__PURE__ */ __name(function(t) {
    return Array.isArray(t);
  }, "__wbg_isArray_d314bb98fcf08331"), __wbg_isSafeInteger_bfbc7332a9768d2a: /* @__PURE__ */ __name(function(t) {
    return Number.isSafeInteger(t);
  }, "__wbg_isSafeInteger_bfbc7332a9768d2a"), __wbg_iterator_6ff6560ca1568e55: /* @__PURE__ */ __name(function() {
    return Symbol.iterator;
  }, "__wbg_iterator_6ff6560ca1568e55"), __wbg_json_086b635bd30e59b5: /* @__PURE__ */ __name(function() {
    return c(function(t) {
      return t.json();
    }, arguments);
  }, "__wbg_json_086b635bd30e59b5"), __wbg_length_32ed9a279acd054c: /* @__PURE__ */ __name(function(t) {
    return t.length;
  }, "__wbg_length_32ed9a279acd054c"), __wbg_length_35a7bace40f36eac: /* @__PURE__ */ __name(function(t) {
    return t.length;
  }, "__wbg_length_35a7bace40f36eac"), __wbg_log_6b5ca2e6124b2808: /* @__PURE__ */ __name(function(t) {
    console.log(t);
  }, "__wbg_log_6b5ca2e6124b2808"), __wbg_message_9ddc4b9a62a7c379: /* @__PURE__ */ __name(function(t) {
    return t.message;
  }, "__wbg_message_9ddc4b9a62a7c379"), __wbg_method_a9e9b2fcba5440fb: /* @__PURE__ */ __name(function(t, e) {
    let r = e.method, _ = m(r, o.__wbindgen_malloc, o.__wbindgen_realloc), s = l;
    b().setInt32(t + 4, s, true), b().setInt32(t + 0, _, true);
  }, "__wbg_method_a9e9b2fcba5440fb"), __wbg_minifyconfig_new: /* @__PURE__ */ __name(function(t) {
    return h.__wrap(t);
  }, "__wbg_minifyconfig_new"), __wbg_name_07a54d72942d5492: /* @__PURE__ */ __name(function(t) {
    return t.name;
  }, "__wbg_name_07a54d72942d5492"), __wbg_new_0_73afc35eb544e539: /* @__PURE__ */ __name(function() {
    return /* @__PURE__ */ new Date();
  }, "__wbg_new_0_73afc35eb544e539"), __wbg_new_361308b2356cecd0: /* @__PURE__ */ __name(function() {
    return new Object();
  }, "__wbg_new_361308b2356cecd0"), __wbg_new_3eb36ae241fe6f44: /* @__PURE__ */ __name(function() {
    return new Array();
  }, "__wbg_new_3eb36ae241fe6f44"), __wbg_new_64284bd487f9d239: /* @__PURE__ */ __name(function() {
    return c(function() {
      return new Headers();
    }, arguments);
  }, "__wbg_new_64284bd487f9d239"), __wbg_new_72b49615380db768: /* @__PURE__ */ __name(function(t, e) {
    return new Error(g(t, e));
  }, "__wbg_new_72b49615380db768"), __wbg_new_8a6f238a6ece86ea: /* @__PURE__ */ __name(function() {
    return new Error();
  }, "__wbg_new_8a6f238a6ece86ea"), __wbg_new_b5d9e2fb389fef91: /* @__PURE__ */ __name(function(t, e) {
    try {
      var r = { a: t, b: e }, _ = /* @__PURE__ */ __name((u, a) => {
        let d = r.a;
        r.a = 0;
        try {
          return K(d, r.b, u, a);
        } finally {
          r.a = d;
        }
      }, "_");
      return new Promise(_);
    } finally {
      r.a = r.b = 0;
    }
  }, "__wbg_new_b5d9e2fb389fef91"), __wbg_new_dca287b076112a51: /* @__PURE__ */ __name(function() {
    return /* @__PURE__ */ new Map();
  }, "__wbg_new_dca287b076112a51"), __wbg_new_dd2b680c8bf6ae29: /* @__PURE__ */ __name(function(t) {
    return new Uint8Array(t);
  }, "__wbg_new_dd2b680c8bf6ae29"), __wbg_new_no_args_1c7c842f08d00ebb: /* @__PURE__ */ __name(function(t, e) {
    return new Function(g(t, e));
  }, "__wbg_new_no_args_1c7c842f08d00ebb"), __wbg_new_with_byte_offset_and_length_aa261d9c9da49eb1: /* @__PURE__ */ __name(function(t, e, r) {
    return new Uint8Array(t, e >>> 0, r >>> 0);
  }, "__wbg_new_with_byte_offset_and_length_aa261d9c9da49eb1"), __wbg_new_with_length_a2c39cbe88fd8ff1: /* @__PURE__ */ __name(function(t) {
    return new Uint8Array(t >>> 0);
  }, "__wbg_new_with_length_a2c39cbe88fd8ff1"), __wbg_new_with_opt_buffer_source_and_init_8c10f2615c78809b: /* @__PURE__ */ __name(function() {
    return c(function(t, e) {
      return new Response(t, e);
    }, arguments);
  }, "__wbg_new_with_opt_buffer_source_and_init_8c10f2615c78809b"), __wbg_new_with_opt_readable_stream_and_init_8a044befefe6d8bb: /* @__PURE__ */ __name(function() {
    return c(function(t, e) {
      return new Response(t, e);
    }, arguments);
  }, "__wbg_new_with_opt_readable_stream_and_init_8a044befefe6d8bb"), __wbg_new_with_opt_str_and_init_4fbb71523b271b6e: /* @__PURE__ */ __name(function() {
    return c(function(t, e, r) {
      return new Response(t === 0 ? void 0 : g(t, e), r);
    }, arguments);
  }, "__wbg_new_with_opt_str_and_init_4fbb71523b271b6e"), __wbg_new_with_str_and_init_a61cbc6bdef21614: /* @__PURE__ */ __name(function() {
    return c(function(t, e, r) {
      return new Request(g(t, e), r);
    }, arguments);
  }, "__wbg_new_with_str_and_init_a61cbc6bdef21614"), __wbg_next_3482f54c49e8af19: /* @__PURE__ */ __name(function() {
    return c(function(t) {
      return t.next();
    }, arguments);
  }, "__wbg_next_3482f54c49e8af19"), __wbg_next_418f80d8f5303233: /* @__PURE__ */ __name(function(t) {
    return t.next;
  }, "__wbg_next_418f80d8f5303233"), __wbg_prepare_3a5f1d3b8fd787f5: /* @__PURE__ */ __name(function() {
    return c(function(t, e, r) {
      return t.prepare(g(e, r));
    }, arguments);
  }, "__wbg_prepare_3a5f1d3b8fd787f5"), __wbg_prototypesetcall_bdcdcc5842e4d77d: /* @__PURE__ */ __name(function(t, e, r) {
    Uint8Array.prototype.set.call(D(t, e), r);
  }, "__wbg_prototypesetcall_bdcdcc5842e4d77d"), __wbg_push_8ffdcb2063340ba5: /* @__PURE__ */ __name(function(t, e) {
    return t.push(e);
  }, "__wbg_push_8ffdcb2063340ba5"), __wbg_queueMicrotask_0aa0a927f78f5d98: /* @__PURE__ */ __name(function(t) {
    return t.queueMicrotask;
  }, "__wbg_queueMicrotask_0aa0a927f78f5d98"), __wbg_queueMicrotask_5bb536982f78a56f: /* @__PURE__ */ __name(function(t) {
    queueMicrotask(t);
  }, "__wbg_queueMicrotask_5bb536982f78a56f"), __wbg_read_68fd377df67e19b0: /* @__PURE__ */ __name(function(t) {
    return t.read();
  }, "__wbg_read_68fd377df67e19b0"), __wbg_releaseLock_aa5846c2494b3032: /* @__PURE__ */ __name(function(t) {
    t.releaseLock();
  }, "__wbg_releaseLock_aa5846c2494b3032"), __wbg_resolve_002c4b7d9d8f6b64: /* @__PURE__ */ __name(function(t) {
    return Promise.resolve(t);
  }, "__wbg_resolve_002c4b7d9d8f6b64"), __wbg_respond_bf6ab10399ca8722: /* @__PURE__ */ __name(function() {
    return c(function(t, e) {
      t.respond(e >>> 0);
    }, arguments);
  }, "__wbg_respond_bf6ab10399ca8722"), __wbg_results_3823a510411c68d1: /* @__PURE__ */ __name(function() {
    return c(function(t) {
      let e = t.results;
      return f(e) ? 0 : w(e);
    }, arguments);
  }, "__wbg_results_3823a510411c68d1"), __wbg_run_55d9fa3979c28234: /* @__PURE__ */ __name(function() {
    return c(function(t) {
      return t.run();
    }, arguments);
  }, "__wbg_run_55d9fa3979c28234"), __wbg_set_1eb0999cf5d27fc8: /* @__PURE__ */ __name(function(t, e, r) {
    return t.set(e, r);
  }, "__wbg_set_1eb0999cf5d27fc8"), __wbg_set_3f1d0b984ed272ed: /* @__PURE__ */ __name(function(t, e, r) {
    t[e] = r;
  }, "__wbg_set_3f1d0b984ed272ed"), __wbg_set_6cb8631f80447a67: /* @__PURE__ */ __name(function() {
    return c(function(t, e, r) {
      return Reflect.set(t, e, r);
    }, arguments);
  }, "__wbg_set_6cb8631f80447a67"), __wbg_set_body_9a7e00afe3cfe244: /* @__PURE__ */ __name(function(t, e) {
    t.body = e;
  }, "__wbg_set_body_9a7e00afe3cfe244"), __wbg_set_cache_315a3ed773a41543: /* @__PURE__ */ __name(function(t, e) {
    t.cache = X[e];
  }, "__wbg_set_cache_315a3ed773a41543"), __wbg_set_cc56eefd2dd91957: /* @__PURE__ */ __name(function(t, e, r) {
    t.set(D(e, r));
  }, "__wbg_set_cc56eefd2dd91957"), __wbg_set_db769d02949a271d: /* @__PURE__ */ __name(function() {
    return c(function(t, e, r, _, s) {
      t.set(g(e, r), g(_, s));
    }, arguments);
  }, "__wbg_set_db769d02949a271d"), __wbg_set_headers_bbdfebba19309590: /* @__PURE__ */ __name(function(t, e) {
    t.headers = e;
  }, "__wbg_set_headers_bbdfebba19309590"), __wbg_set_headers_cfc5f4b2c1f20549: /* @__PURE__ */ __name(function(t, e) {
    t.headers = e;
  }, "__wbg_set_headers_cfc5f4b2c1f20549"), __wbg_set_method_c3e20375f5ae7fac: /* @__PURE__ */ __name(function(t, e, r) {
    t.method = g(e, r);
  }, "__wbg_set_method_c3e20375f5ae7fac"), __wbg_set_redirect_a7956fa3f817cbbc: /* @__PURE__ */ __name(function(t, e) {
    t.redirect = Y[e];
  }, "__wbg_set_redirect_a7956fa3f817cbbc"), __wbg_set_signal_f2d3f8599248896d: /* @__PURE__ */ __name(function(t, e) {
    t.signal = e;
  }, "__wbg_set_signal_f2d3f8599248896d"), __wbg_set_status_fa41f71c4575bca5: /* @__PURE__ */ __name(function(t, e) {
    t.status = e;
  }, "__wbg_set_status_fa41f71c4575bca5"), __wbg_stack_0ed75d68575b0f3c: /* @__PURE__ */ __name(function(t, e) {
    let r = e.stack, _ = m(r, o.__wbindgen_malloc, o.__wbindgen_realloc), s = l;
    b().setInt32(t + 4, s, true), b().setInt32(t + 0, _, true);
  }, "__wbg_stack_0ed75d68575b0f3c"), __wbg_static_accessor_GLOBAL_12837167ad935116: /* @__PURE__ */ __name(function() {
    let t = typeof global > "u" ? null : global;
    return f(t) ? 0 : w(t);
  }, "__wbg_static_accessor_GLOBAL_12837167ad935116"), __wbg_static_accessor_GLOBAL_THIS_e628e89ab3b1c95f: /* @__PURE__ */ __name(function() {
    let t = typeof globalThis > "u" ? null : globalThis;
    return f(t) ? 0 : w(t);
  }, "__wbg_static_accessor_GLOBAL_THIS_e628e89ab3b1c95f"), __wbg_static_accessor_SELF_a621d3dfbb60d0ce: /* @__PURE__ */ __name(function() {
    let t = typeof self > "u" ? null : self;
    return f(t) ? 0 : w(t);
  }, "__wbg_static_accessor_SELF_a621d3dfbb60d0ce"), __wbg_static_accessor_WINDOW_f8727f0cf888e0bd: /* @__PURE__ */ __name(function() {
    let t = typeof window > "u" ? null : window;
    return f(t) ? 0 : w(t);
  }, "__wbg_static_accessor_WINDOW_f8727f0cf888e0bd"), __wbg_status_89d7e803db911ee7: /* @__PURE__ */ __name(function(t) {
    return t.status;
  }, "__wbg_status_89d7e803db911ee7"), __wbg_then_0d9fe2c7b1857d32: /* @__PURE__ */ __name(function(t, e, r) {
    return t.then(e, r);
  }, "__wbg_then_0d9fe2c7b1857d32"), __wbg_then_b9e7b3b5f1a9e1b5: /* @__PURE__ */ __name(function(t, e) {
    return t.then(e);
  }, "__wbg_then_b9e7b3b5f1a9e1b5"), __wbg_toString_029ac24421fd7a24: /* @__PURE__ */ __name(function(t) {
    return t.toString();
  }, "__wbg_toString_029ac24421fd7a24"), __wbg_url_36c39f6580d05409: /* @__PURE__ */ __name(function(t, e) {
    let r = e.url, _ = m(r, o.__wbindgen_malloc, o.__wbindgen_realloc), s = l;
    b().setInt32(t + 4, s, true), b().setInt32(t + 0, _, true);
  }, "__wbg_url_36c39f6580d05409"), __wbg_value_0546255b415e96c1: /* @__PURE__ */ __name(function(t) {
    return t.value;
  }, "__wbg_value_0546255b415e96c1"), __wbg_view_6c32e7184b8606ad: /* @__PURE__ */ __name(function(t) {
    let e = t.view;
    return f(e) ? 0 : w(e);
  }, "__wbg_view_6c32e7184b8606ad"), __wbg_webSocket_5d50b1a6fab8a49d: /* @__PURE__ */ __name(function() {
    return c(function(t) {
      let e = t.webSocket;
      return f(e) ? 0 : w(e);
    }, arguments);
  }, "__wbg_webSocket_5d50b1a6fab8a49d"), __wbindgen_cast_0000000000000001: /* @__PURE__ */ __name(function(t, e) {
    return ot(t, e, o.wasm_bindgen__closure__destroy__h913833e370ec94c3, G);
  }, "__wbindgen_cast_0000000000000001"), __wbindgen_cast_0000000000000002: /* @__PURE__ */ __name(function(t) {
    return t;
  }, "__wbindgen_cast_0000000000000002"), __wbindgen_cast_0000000000000003: /* @__PURE__ */ __name(function(t, e) {
    return g(t, e);
  }, "__wbindgen_cast_0000000000000003"), __wbindgen_cast_0000000000000004: /* @__PURE__ */ __name(function(t) {
    return BigInt.asUintN(64, t);
  }, "__wbindgen_cast_0000000000000004"), __wbindgen_init_externref_table: /* @__PURE__ */ __name(function() {
    let t = o.__wbindgen_externrefs, e = t.grow(4);
    t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, true), t.set(e + 3, false);
  }, "__wbindgen_init_externref_table") } };
}
__name(N, "N");
function G(n2, t, e) {
  o.wasm_bindgen__convert__closures_____invoke__hf8915efce41746e2(n2, t, e);
}
__name(G, "G");
function K(n2, t, e, r) {
  o.wasm_bindgen__convert__closures_____invoke__h1cd117f52498a939(n2, t, e, r);
}
__name(K, "K");
var Q = ["bytes"];
var X = ["default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached"];
var Y = ["follow", "error", "manual"];
var i = 0;
var Z = typeof FinalizationRegistry > "u" ? { register: /* @__PURE__ */ __name(() => {
}, "register"), unregister: /* @__PURE__ */ __name(() => {
}, "unregister") } : new FinalizationRegistry(({ ptr: n2, instance: t }) => {
  t === i && o.__wbg_containerstartupoptions_free(n2 >>> 0, 1);
});
var tt = typeof FinalizationRegistry > "u" ? { register: /* @__PURE__ */ __name(() => {
}, "register"), unregister: /* @__PURE__ */ __name(() => {
}, "unregister") } : new FinalizationRegistry(({ ptr: n2, instance: t }) => {
  t === i && o.__wbg_intounderlyingbytesource_free(n2 >>> 0, 1);
});
var et = typeof FinalizationRegistry > "u" ? { register: /* @__PURE__ */ __name(() => {
}, "register"), unregister: /* @__PURE__ */ __name(() => {
}, "unregister") } : new FinalizationRegistry(({ ptr: n2, instance: t }) => {
  t === i && o.__wbg_intounderlyingsink_free(n2 >>> 0, 1);
});
var nt = typeof FinalizationRegistry > "u" ? { register: /* @__PURE__ */ __name(() => {
}, "register"), unregister: /* @__PURE__ */ __name(() => {
}, "unregister") } : new FinalizationRegistry(({ ptr: n2, instance: t }) => {
  t === i && o.__wbg_intounderlyingsource_free(n2 >>> 0, 1);
});
var L = typeof FinalizationRegistry > "u" ? { register: /* @__PURE__ */ __name(() => {
}, "register"), unregister: /* @__PURE__ */ __name(() => {
}, "unregister") } : new FinalizationRegistry(({ ptr: n2, instance: t }) => {
  t === i && o.__wbg_minifyconfig_free(n2 >>> 0, 1);
});
var rt = typeof FinalizationRegistry > "u" ? { register: /* @__PURE__ */ __name(() => {
}, "register"), unregister: /* @__PURE__ */ __name(() => {
}, "unregister") } : new FinalizationRegistry(({ ptr: n2, instance: t }) => {
  t === i && o.__wbg_r2range_free(n2 >>> 0, 1);
});
function w(n2) {
  let t = o.__externref_table_alloc();
  return o.__wbindgen_externrefs.set(t, n2), t;
}
__name(w, "w");
var q = typeof FinalizationRegistry > "u" ? { register: /* @__PURE__ */ __name(() => {
}, "register"), unregister: /* @__PURE__ */ __name(() => {
}, "unregister") } : new FinalizationRegistry((n2) => {
  n2.instance === i && n2.dtor(n2.a, n2.b);
});
function U(n2) {
  let t = typeof n2;
  if (t == "number" || t == "boolean" || n2 == null) return `${n2}`;
  if (t == "string") return `"${n2}"`;
  if (t == "symbol") {
    let _ = n2.description;
    return _ == null ? "Symbol" : `Symbol(${_})`;
  }
  if (t == "function") {
    let _ = n2.name;
    return typeof _ == "string" && _.length > 0 ? `Function(${_})` : "Function";
  }
  if (Array.isArray(n2)) {
    let _ = n2.length, s = "[";
    _ > 0 && (s += U(n2[0]));
    for (let u = 1; u < _; u++) s += ", " + U(n2[u]);
    return s += "]", s;
  }
  let e = /\[object ([^\]]+)\]/.exec(toString.call(n2)), r;
  if (e && e.length > 1) r = e[1];
  else return toString.call(n2);
  if (r == "Object") try {
    return "Object(" + JSON.stringify(n2) + ")";
  } catch {
    return "Object";
  }
  return n2 instanceof Error ? `${n2.name}: ${n2.message}
${n2.stack}` : r;
}
__name(U, "U");
function _t(n2, t) {
  n2 = n2 >>> 0;
  let e = b(), r = [];
  for (let _ = n2; _ < n2 + 4 * t; _ += 4) r.push(o.__wbindgen_externrefs.get(e.getUint32(_, true)));
  return o.__externref_drop_slice(n2, t), r;
}
__name(_t, "_t");
function D(n2, t) {
  return n2 = n2 >>> 0, j().subarray(n2 / 1, n2 / 1 + t);
}
__name(D, "D");
var p = null;
function b() {
  return (p === null || p.buffer.detached === true || p.buffer.detached === void 0 && p.buffer !== o.memory.buffer) && (p = new DataView(o.memory.buffer)), p;
}
__name(b, "b");
function g(n2, t) {
  return n2 = n2 >>> 0, st(n2, t);
}
__name(g, "g");
var S = null;
function j() {
  return (S === null || S.byteLength === 0) && (S = new Uint8Array(o.memory.buffer)), S;
}
__name(j, "j");
function c(n2, t) {
  try {
    return n2.apply(this, t);
  } catch (e) {
    let r = w(e);
    o.__wbindgen_exn_store(r);
  }
}
__name(c, "c");
function f(n2) {
  return n2 == null;
}
__name(f, "f");
function ot(n2, t, e, r) {
  let _ = { a: n2, b: t, cnt: 1, dtor: e, instance: i }, s = /* @__PURE__ */ __name((...u) => {
    if (_.instance !== i) throw new Error("Cannot invoke closure from previous WASM instance");
    _.cnt++;
    let a = _.a;
    _.a = 0;
    try {
      return r(a, _.b, ...u);
    } finally {
      _.a = a, s._wbg_cb_unref();
    }
  }, "s");
  return s._wbg_cb_unref = () => {
    --_.cnt === 0 && (_.dtor(_.a, _.b), _.a = 0, q.unregister(_));
  }, q.register(s, _, _), s;
}
__name(ot, "ot");
function it(n2, t) {
  let e = t(n2.length * 4, 4) >>> 0;
  for (let r = 0; r < n2.length; r++) {
    let _ = w(n2[r]);
    b().setUint32(e + 4 * r, _, true);
  }
  return l = n2.length, e;
}
__name(it, "it");
function m(n2, t, e) {
  if (e === void 0) {
    let a = W.encode(n2), d = t(a.length, 1) >>> 0;
    return j().subarray(d, d + a.length).set(a), l = a.length, d;
  }
  let r = n2.length, _ = t(r, 1) >>> 0, s = j(), u = 0;
  for (; u < r; u++) {
    let a = n2.charCodeAt(u);
    if (a > 127) break;
    s[_ + u] = a;
  }
  if (u !== r) {
    u !== 0 && (n2 = n2.slice(u)), _ = e(_, r, r = u + n2.length * 3, 1) >>> 0;
    let a = j().subarray(_ + u, _ + r), d = W.encodeInto(n2, a);
    u += d.written, _ = e(_, r, u, 1) >>> 0;
  }
  return l = u, _;
}
__name(m, "m");
var $ = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
$.decode();
function st(n2, t) {
  return $.decode(j().subarray(n2, n2 + t));
}
__name(st, "st");
var W = new TextEncoder();
"encodeInto" in W || (W.encodeInto = function(n2, t) {
  let e = W.encode(n2);
  return t.set(e), { read: n2.length, written: e.length };
});
var l = 0;
var ct = new WebAssembly.Instance(V, N());
var o = ct.exports;
o.__wbindgen_start();
Error.stackTraceLimit = 100;
var k = false;
function J() {
  M && M(function(n2) {
    let t = new Error("Rust panic: " + n2);
    console.error("Critical", t), k = true;
  });
}
__name(J, "J");
J();
var A = 0;
function T() {
  k && (console.log("Reinitializing Wasm application"), B(), k = false, J(), A++);
}
__name(T, "T");
addEventListener("error", (n2) => {
  C(n2.error);
});
function C(n2) {
  n2 instanceof WebAssembly.RuntimeError && (console.error("Critical", n2), k = true);
}
__name(C, "C");
var P = class extends ft {
  static {
    __name(this, "P");
  }
};
P.prototype.fetch = function(t) {
  return H.call(this, t, this.env, this.ctx);
};
var at = { set: /* @__PURE__ */ __name((n2, t, e, r) => Reflect.set(n2.instance, t, e, r), "set"), has: /* @__PURE__ */ __name((n2, t) => Reflect.has(n2.instance, t), "has"), deleteProperty: /* @__PURE__ */ __name((n2, t) => Reflect.deleteProperty(n2.instance, t), "deleteProperty"), apply: /* @__PURE__ */ __name((n2, t, e) => Reflect.apply(n2.instance, t, e), "apply"), construct: /* @__PURE__ */ __name((n2, t, e) => Reflect.construct(n2.instance, t, e), "construct"), getPrototypeOf: /* @__PURE__ */ __name((n2) => Reflect.getPrototypeOf(n2.instance), "getPrototypeOf"), setPrototypeOf: /* @__PURE__ */ __name((n2, t) => Reflect.setPrototypeOf(n2.instance, t), "setPrototypeOf"), isExtensible: /* @__PURE__ */ __name((n2) => Reflect.isExtensible(n2.instance), "isExtensible"), preventExtensions: /* @__PURE__ */ __name((n2) => Reflect.preventExtensions(n2.instance), "preventExtensions"), getOwnPropertyDescriptor: /* @__PURE__ */ __name((n2, t) => Reflect.getOwnPropertyDescriptor(n2.instance, t), "getOwnPropertyDescriptor"), defineProperty: /* @__PURE__ */ __name((n2, t, e) => Reflect.defineProperty(n2.instance, t, e), "defineProperty"), ownKeys: /* @__PURE__ */ __name((n2) => Reflect.ownKeys(n2.instance), "ownKeys") };
var y = { construct(n2, t, e) {
  try {
    T();
    let r = { instance: Reflect.construct(n2, t, e), instanceId: A, ctor: n2, args: t, newTarget: e };
    return new Proxy(r, { ...at, get(_, s, u) {
      _.instanceId !== A && (_.instance = Reflect.construct(_.ctor, _.args, _.newTarget), _.instanceId = A);
      let a = Reflect.get(_.instance, s, u);
      return typeof a != "function" ? a : a.constructor === Function ? new Proxy(a, { apply(d, z, O) {
        T();
        try {
          return d.apply(z, O);
        } catch (F) {
          throw C(F), F;
        }
      } }) : new Proxy(a, { async apply(d, z, O) {
        T();
        try {
          return await d.apply(z, O);
        } catch (F) {
          throw C(F), F;
        }
      } });
    } });
  } catch (r) {
    throw k = true, r;
  }
} };
var wt = new Proxy(P, y);
var dt = new Proxy(v, y);
var lt = new Proxy(x, y);
var pt = new Proxy(I, y);
var ht = new Proxy(R, y);
var yt = new Proxy(h, y);
var mt = new Proxy(E, y);
export {
  dt as ContainerStartupOptions,
  lt as IntoUnderlyingByteSource,
  pt as IntoUnderlyingSink,
  ht as IntoUnderlyingSource,
  yt as MinifyConfig,
  mt as R2Range,
  wt as default
};
//# sourceMappingURL=index.js.map
