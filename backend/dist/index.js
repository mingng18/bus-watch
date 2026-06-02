var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/aspromise.js
var require_aspromise = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/aspromise.js"(exports, module) {
    "use strict";
    module.exports = asPromise;
    function asPromise(fn, ctx) {
      var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
      while (index < arguments.length)
        params[offset++] = arguments[index++];
      return new Promise(/* @__PURE__ */ __name(function executor(resolve, reject) {
        params[offset] = /* @__PURE__ */ __name(function callback(err2) {
          if (pending) {
            pending = false;
            if (err2)
              reject(err2);
            else {
              var params2 = new Array(arguments.length - 1), offset2 = 0;
              while (offset2 < params2.length)
                params2[offset2++] = arguments[offset2];
              resolve.apply(null, params2);
            }
          }
        }, "callback");
        try {
          fn.apply(ctx || null, params);
        } catch (err2) {
          if (pending) {
            pending = false;
            reject(err2);
          }
        }
      }, "executor"));
    }
    __name(asPromise, "asPromise");
  }
});

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/base64.js
var require_base64 = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/base64.js"(exports) {
    "use strict";
    var base64 = exports;
    base64.length = /* @__PURE__ */ __name(function length(string) {
      var p = string.length;
      if (!p)
        return 0;
      while (p > 0 && string.charAt(p - 1) === "=")
        --p;
      return Math.floor(p * 3 / 4);
    }, "length");
    var b64 = new Array(64);
    var s64 = new Array(123);
    for (i = 0; i < 64; )
      s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
    var i;
    s64[45] = 62;
    s64[95] = 63;
    base64.encode = /* @__PURE__ */ __name(function encode(buffer, start, end) {
      var parts = null, chunk = [];
      var i2 = 0, j = 0, t;
      while (start < end) {
        var b = buffer[start++];
        switch (j) {
          case 0:
            chunk[i2++] = b64[b >> 2];
            t = (b & 3) << 4;
            j = 1;
            break;
          case 1:
            chunk[i2++] = b64[t | b >> 4];
            t = (b & 15) << 2;
            j = 2;
            break;
          case 2:
            chunk[i2++] = b64[t | b >> 6];
            chunk[i2++] = b64[b & 63];
            j = 0;
            break;
        }
        if (i2 > 8191) {
          (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
          i2 = 0;
        }
      }
      if (j) {
        chunk[i2++] = b64[t];
        chunk[i2++] = 61;
        if (j === 1)
          chunk[i2++] = 61;
      }
      if (parts) {
        if (i2)
          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i2)));
        return parts.join("");
      }
      return String.fromCharCode.apply(String, chunk.slice(0, i2));
    }, "encode");
    var invalidEncoding = "invalid encoding";
    base64.decode = /* @__PURE__ */ __name(function decode(string, buffer, offset) {
      var start = offset;
      var j = 0, t;
      for (var i2 = 0; i2 < string.length; ) {
        var c = string.charCodeAt(i2++);
        if (c === 61 && j > 1)
          break;
        if ((c = s64[c]) === void 0)
          throw Error(invalidEncoding);
        switch (j) {
          case 0:
            t = c;
            j = 1;
            break;
          case 1:
            buffer[offset++] = t << 2 | (c & 48) >> 4;
            t = c;
            j = 2;
            break;
          case 2:
            buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
            t = c;
            j = 3;
            break;
          case 3:
            buffer[offset++] = (t & 3) << 6 | c;
            j = 0;
            break;
        }
      }
      if (j === 1)
        throw Error(invalidEncoding);
      return offset - start;
    }, "decode");
    var base64Re = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    var base64UrlRe = /[-_]/;
    var base64UrlNoPaddingRe = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2}(?:==)?|[A-Za-z0-9_-]{3}=?)?$/;
    base64.test = /* @__PURE__ */ __name(function test(string) {
      return base64Re.test(string) || base64UrlRe.test(string) && base64UrlNoPaddingRe.test(string);
    }, "test");
  }
});

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/eventemitter.js
var require_eventemitter = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/eventemitter.js"(exports, module) {
    "use strict";
    module.exports = EventEmitter;
    function EventEmitter() {
      this._listeners = /* @__PURE__ */ Object.create(null);
    }
    __name(EventEmitter, "EventEmitter");
    EventEmitter.prototype.on = /* @__PURE__ */ __name(function on(evt, fn, ctx) {
      (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn,
        ctx: ctx || this
      });
      return this;
    }, "on");
    EventEmitter.prototype.off = /* @__PURE__ */ __name(function off(evt, fn) {
      if (evt === void 0)
        this._listeners = /* @__PURE__ */ Object.create(null);
      else {
        if (fn === void 0)
          this._listeners[evt] = [];
        else {
          var listeners = this._listeners[evt];
          if (!listeners)
            return this;
          for (var i = 0; i < listeners.length; )
            if (listeners[i].fn === fn)
              listeners.splice(i, 1);
            else
              ++i;
        }
      }
      return this;
    }, "off");
    EventEmitter.prototype.emit = /* @__PURE__ */ __name(function emit(evt) {
      var listeners = this._listeners[evt];
      if (listeners) {
        var args = [], i = 1;
        for (; i < arguments.length; )
          args.push(arguments[i++]);
        for (i = 0; i < listeners.length; )
          listeners[i].fn.apply(listeners[i++].ctx, args);
      }
      return this;
    }, "emit");
  }
});

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/float.js
var require_float = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/float.js"(exports, module) {
    "use strict";
    module.exports = factory(factory);
    function factory(exports2) {
      if (typeof Float32Array !== "undefined") (function() {
        var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
        function writeFloat_f32_cpy(val, buf, pos) {
          f32[0] = val;
          buf[pos] = f8b[0];
          buf[pos + 1] = f8b[1];
          buf[pos + 2] = f8b[2];
          buf[pos + 3] = f8b[3];
        }
        __name(writeFloat_f32_cpy, "writeFloat_f32_cpy");
        function writeFloat_f32_rev(val, buf, pos) {
          f32[0] = val;
          buf[pos] = f8b[3];
          buf[pos + 1] = f8b[2];
          buf[pos + 2] = f8b[1];
          buf[pos + 3] = f8b[0];
        }
        __name(writeFloat_f32_rev, "writeFloat_f32_rev");
        exports2.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        exports2.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
        function readFloat_f32_cpy(buf, pos) {
          f8b[0] = buf[pos];
          f8b[1] = buf[pos + 1];
          f8b[2] = buf[pos + 2];
          f8b[3] = buf[pos + 3];
          return f32[0];
        }
        __name(readFloat_f32_cpy, "readFloat_f32_cpy");
        function readFloat_f32_rev(buf, pos) {
          f8b[3] = buf[pos];
          f8b[2] = buf[pos + 1];
          f8b[1] = buf[pos + 2];
          f8b[0] = buf[pos + 3];
          return f32[0];
        }
        __name(readFloat_f32_rev, "readFloat_f32_rev");
        exports2.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        exports2.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
      })();
      else (function() {
        function writeFloat_ieee754(writeUint, val, buf, pos) {
          var sign = val < 0 ? 1 : 0;
          if (sign)
            val = -val;
          if (val === 0)
            writeUint(1 / val > 0 ? (
              /* positive */
              0
            ) : (
              /* negative 0 */
              2147483648
            ), buf, pos);
          else if (isNaN(val))
            writeUint(2143289344, buf, pos);
          else if (val > 34028234663852886e22)
            writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
          else if (val < 11754943508222875e-54)
            writeUint((sign << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf, pos);
          else {
            var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
            writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
          }
        }
        __name(writeFloat_ieee754, "writeFloat_ieee754");
        exports2.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports2.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
        function readFloat_ieee754(readUint, buf, pos) {
          var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
          return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 1401298464324817e-60 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }
        __name(readFloat_ieee754, "readFloat_ieee754");
        exports2.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports2.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
      })();
      if (typeof Float64Array !== "undefined") (function() {
        var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
        function writeDouble_f64_cpy(val, buf, pos) {
          f64[0] = val;
          buf[pos] = f8b[0];
          buf[pos + 1] = f8b[1];
          buf[pos + 2] = f8b[2];
          buf[pos + 3] = f8b[3];
          buf[pos + 4] = f8b[4];
          buf[pos + 5] = f8b[5];
          buf[pos + 6] = f8b[6];
          buf[pos + 7] = f8b[7];
        }
        __name(writeDouble_f64_cpy, "writeDouble_f64_cpy");
        function writeDouble_f64_rev(val, buf, pos) {
          f64[0] = val;
          buf[pos] = f8b[7];
          buf[pos + 1] = f8b[6];
          buf[pos + 2] = f8b[5];
          buf[pos + 3] = f8b[4];
          buf[pos + 4] = f8b[3];
          buf[pos + 5] = f8b[2];
          buf[pos + 6] = f8b[1];
          buf[pos + 7] = f8b[0];
        }
        __name(writeDouble_f64_rev, "writeDouble_f64_rev");
        exports2.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        exports2.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
        function readDouble_f64_cpy(buf, pos) {
          f8b[0] = buf[pos];
          f8b[1] = buf[pos + 1];
          f8b[2] = buf[pos + 2];
          f8b[3] = buf[pos + 3];
          f8b[4] = buf[pos + 4];
          f8b[5] = buf[pos + 5];
          f8b[6] = buf[pos + 6];
          f8b[7] = buf[pos + 7];
          return f64[0];
        }
        __name(readDouble_f64_cpy, "readDouble_f64_cpy");
        function readDouble_f64_rev(buf, pos) {
          f8b[7] = buf[pos];
          f8b[6] = buf[pos + 1];
          f8b[5] = buf[pos + 2];
          f8b[4] = buf[pos + 3];
          f8b[3] = buf[pos + 4];
          f8b[2] = buf[pos + 5];
          f8b[1] = buf[pos + 6];
          f8b[0] = buf[pos + 7];
          return f64[0];
        }
        __name(readDouble_f64_rev, "readDouble_f64_rev");
        exports2.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        exports2.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
      })();
      else (function() {
        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
          var sign = val < 0 ? 1 : 0;
          if (sign)
            val = -val;
          if (val === 0) {
            writeUint(0, buf, pos + off0);
            writeUint(1 / val > 0 ? (
              /* positive */
              0
            ) : (
              /* negative 0 */
              2147483648
            ), buf, pos + off1);
          } else if (isNaN(val)) {
            writeUint(0, buf, pos + off0);
            writeUint(2146959360, buf, pos + off1);
          } else if (val > 17976931348623157e292) {
            writeUint(0, buf, pos + off0);
            writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
          } else {
            var mantissa;
            if (val < 22250738585072014e-324) {
              mantissa = val / 5e-324;
              writeUint(mantissa >>> 0, buf, pos + off0);
              writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
            } else {
              var exponent = Math.floor(Math.log(val) / Math.LN2);
              if (exponent === 1024)
                exponent = 1023;
              mantissa = val * Math.pow(2, -exponent);
              writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
              writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
            }
          }
        }
        __name(writeDouble_ieee754, "writeDouble_ieee754");
        exports2.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports2.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
          var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
          var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
          return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }
        __name(readDouble_ieee754, "readDouble_ieee754");
        exports2.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports2.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
      })();
      return exports2;
    }
    __name(factory, "factory");
    function writeUintLE(val, buf, pos) {
      buf[pos] = val & 255;
      buf[pos + 1] = val >>> 8 & 255;
      buf[pos + 2] = val >>> 16 & 255;
      buf[pos + 3] = val >>> 24;
    }
    __name(writeUintLE, "writeUintLE");
    function writeUintBE(val, buf, pos) {
      buf[pos] = val >>> 24;
      buf[pos + 1] = val >>> 16 & 255;
      buf[pos + 2] = val >>> 8 & 255;
      buf[pos + 3] = val & 255;
    }
    __name(writeUintBE, "writeUintBE");
    function readUintLE(buf, pos) {
      return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
    }
    __name(readUintLE, "readUintLE");
    function readUintBE(buf, pos) {
      return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
    }
    __name(readUintBE, "readUintBE");
  }
});

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/inquire.js
var require_inquire = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/inquire.js"(exports, module) {
    "use strict";
    module.exports = inquire;
    function inquire(moduleName) {
      try {
        if (typeof __require !== "function") {
          return null;
        }
        var mod = __require(moduleName);
        if (mod && (mod.length || Object.keys(mod).length)) return mod;
        return null;
      } catch (err2) {
        return null;
      }
    }
    __name(inquire, "inquire");
  }
});

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/utf8.js
var require_utf8 = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/utf8.js"(exports) {
    "use strict";
    var utf8 = exports;
    var replacementChar = "\uFFFD";
    utf8.length = /* @__PURE__ */ __name(function utf8_length(string) {
      var len = 0, c = 0;
      for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
          len += 1;
        else if (c < 2048)
          len += 2;
        else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
          ++i;
          len += 4;
        } else
          len += 3;
      }
      return len;
    }, "utf8_length");
    function utf8_read_js(buffer, start, end, str) {
      for (var i = start; i < end; ) {
        var t = buffer[i++];
        if (t <= 127) {
          str += String.fromCharCode(t);
        } else if (t >= 192 && t < 224) {
          var c2 = (t & 31) << 6 | buffer[i++] & 63;
          str += c2 >= 128 ? String.fromCharCode(c2) : replacementChar;
        } else if (t >= 224 && t < 240) {
          var c3 = (t & 15) << 12 | (buffer[i++] & 63) << 6 | buffer[i++] & 63;
          str += c3 >= 2048 ? String.fromCharCode(c3) : replacementChar;
        } else if (t >= 240) {
          var t2 = (t & 7) << 18 | (buffer[i++] & 63) << 12 | (buffer[i++] & 63) << 6 | buffer[i++] & 63;
          if (t2 < 65536 || t2 > 1114111)
            str += replacementChar;
          else {
            t2 -= 65536;
            str += String.fromCharCode(55296 + (t2 >> 10));
            str += String.fromCharCode(56320 + (t2 & 1023));
          }
        }
      }
      return str;
    }
    __name(utf8_read_js, "utf8_read_js");
    utf8.read = /* @__PURE__ */ __name(function utf8_read_ascii(buffer, start, end) {
      if (end - start < 1)
        return "";
      var str = "", i = start, c1, c2, c3, c4, c5, c6, c7, c8;
      for (; i + 7 < end; i += 8) {
        c1 = buffer[i];
        c2 = buffer[i + 1];
        c3 = buffer[i + 2];
        c4 = buffer[i + 3];
        c5 = buffer[i + 4];
        c6 = buffer[i + 5];
        c7 = buffer[i + 6];
        c8 = buffer[i + 7];
        if ((c1 | c2 | c3 | c4 | c5 | c6 | c7 | c8) & 128)
          return utf8_read_js(buffer, i, end, str);
        str += String.fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8);
      }
      for (; i < end; ++i) {
        c1 = buffer[i];
        if (c1 & 128)
          return utf8_read_js(buffer, i, end, str);
        str += String.fromCharCode(c1);
      }
      return str;
    }, "utf8_read_ascii");
    utf8.write = /* @__PURE__ */ __name(function utf8_write(string, buffer, offset) {
      var start = offset, c1, c2;
      for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
          buffer[offset++] = c1;
        } else if (c1 < 2048) {
          buffer[offset++] = c1 >> 6 | 192;
          buffer[offset++] = c1 & 63 | 128;
        } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
          c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
          ++i;
          buffer[offset++] = c1 >> 18 | 240;
          buffer[offset++] = c1 >> 12 & 63 | 128;
          buffer[offset++] = c1 >> 6 & 63 | 128;
          buffer[offset++] = c1 & 63 | 128;
        } else {
          buffer[offset++] = c1 >> 12 | 224;
          buffer[offset++] = c1 >> 6 & 63 | 128;
          buffer[offset++] = c1 & 63 | 128;
        }
      }
      return offset - start;
    }, "utf8_write");
  }
});

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/pool.js
var require_pool = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/pool.js"(exports, module) {
    "use strict";
    module.exports = pool;
    function pool(alloc, slice, size) {
      var SIZE = size || 8192;
      var MAX = SIZE >>> 1;
      var slab = null;
      var offset = SIZE;
      return /* @__PURE__ */ __name(function pool_alloc(size2) {
        if (size2 < 1 || size2 > MAX)
          return alloc(size2);
        if (offset + size2 > SIZE) {
          slab = alloc(SIZE);
          offset = 0;
        }
        var buf = slice.call(slab, offset, offset += size2);
        if (offset & 7)
          offset = (offset | 7) + 1;
        return buf;
      }, "pool_alloc");
    }
    __name(pool, "pool");
  }
});

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/longbits.js
var require_longbits = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/longbits.js"(exports, module) {
    "use strict";
    module.exports = LongBits;
    var util = require_minimal();
    function LongBits(lo, hi) {
      this.lo = lo >>> 0;
      this.hi = hi >>> 0;
    }
    __name(LongBits, "LongBits");
    var zero = LongBits.zero = new LongBits(0, 0);
    zero.toNumber = function() {
      return 0;
    };
    zero.zzEncode = zero.zzDecode = function() {
      return this;
    };
    zero.length = function() {
      return 1;
    };
    var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
    LongBits.fromNumber = /* @__PURE__ */ __name(function fromNumber(value) {
      if (value === 0)
        return zero;
      var sign = value < 0;
      if (sign)
        value = -value;
      var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
      if (sign) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
          lo = 0;
          if (++hi > 4294967295)
            hi = 0;
        }
      }
      return new LongBits(lo, hi);
    }, "fromNumber");
    LongBits.from = /* @__PURE__ */ __name(function from(value) {
      if (typeof value === "number")
        return LongBits.fromNumber(value);
      if (util.isString(value)) {
        if (util.Long)
          value = util.Long.fromString(value);
        else
          return LongBits.fromNumber(parseInt(value, 10));
      }
      return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
    }, "from");
    LongBits.prototype.toNumber = /* @__PURE__ */ __name(function toNumber(unsigned) {
      if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
        if (!lo)
          hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
      }
      return this.lo + this.hi * 4294967296;
    }, "toNumber");
    LongBits.prototype.toLong = /* @__PURE__ */ __name(function toLong(unsigned) {
      return util.Long ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
    }, "toLong");
    var charCodeAt = String.prototype.charCodeAt;
    LongBits.fromHash = /* @__PURE__ */ __name(function fromHash(hash) {
      if (hash === zeroHash)
        return zero;
      return new LongBits(
        (charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0,
        (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0
      );
    }, "fromHash");
    LongBits.prototype.toHash = /* @__PURE__ */ __name(function toHash() {
      return String.fromCharCode(
        this.lo & 255,
        this.lo >>> 8 & 255,
        this.lo >>> 16 & 255,
        this.lo >>> 24,
        this.hi & 255,
        this.hi >>> 8 & 255,
        this.hi >>> 16 & 255,
        this.hi >>> 24
      );
    }, "toHash");
    LongBits.prototype.zzEncode = /* @__PURE__ */ __name(function zzEncode() {
      var mask = this.hi >> 31;
      this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
      this.lo = (this.lo << 1 ^ mask) >>> 0;
      return this;
    }, "zzEncode");
    LongBits.prototype.zzDecode = /* @__PURE__ */ __name(function zzDecode() {
      var mask = -(this.lo & 1);
      this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
      this.hi = (this.hi >>> 1 ^ mask) >>> 0;
      return this;
    }, "zzDecode");
    LongBits.prototype.length = /* @__PURE__ */ __name(function length() {
      var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
      return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
    }, "length");
  }
});

// node_modules/.pnpm/long@5.3.2/node_modules/long/umd/index.js
var require_umd = __commonJS({
  "node_modules/.pnpm/long@5.3.2/node_modules/long/umd/index.js"(exports, module) {
    (function(global2, factory) {
      function preferDefault(exports2) {
        return exports2.default || exports2;
      }
      __name(preferDefault, "preferDefault");
      if (typeof define === "function" && define.amd) {
        define([], function() {
          var exports2 = {};
          factory(exports2);
          return preferDefault(exports2);
        });
      } else if (typeof exports === "object") {
        factory(exports);
        if (typeof module === "object") module.exports = preferDefault(exports);
      } else {
        (function() {
          var exports2 = {};
          factory(exports2);
          global2.Long = preferDefault(exports2);
        })();
      }
    })(
      typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports,
      function(_exports) {
        "use strict";
        Object.defineProperty(_exports, "__esModule", {
          value: true
        });
        _exports.default = void 0;
        var wasm = null;
        try {
          wasm = new WebAssembly.Instance(
            new WebAssembly.Module(
              new Uint8Array([
                // \0asm
                0,
                97,
                115,
                109,
                // version 1
                1,
                0,
                0,
                0,
                // section "type"
                1,
                13,
                2,
                // 0, () => i32
                96,
                0,
                1,
                127,
                // 1, (i32, i32, i32, i32) => i32
                96,
                4,
                127,
                127,
                127,
                127,
                1,
                127,
                // section "function"
                3,
                7,
                6,
                // 0, type 0
                0,
                // 1, type 1
                1,
                // 2, type 1
                1,
                // 3, type 1
                1,
                // 4, type 1
                1,
                // 5, type 1
                1,
                // section "global"
                6,
                6,
                1,
                // 0, "high", mutable i32
                127,
                1,
                65,
                0,
                11,
                // section "export"
                7,
                50,
                6,
                // 0, "mul"
                3,
                109,
                117,
                108,
                0,
                1,
                // 1, "div_s"
                5,
                100,
                105,
                118,
                95,
                115,
                0,
                2,
                // 2, "div_u"
                5,
                100,
                105,
                118,
                95,
                117,
                0,
                3,
                // 3, "rem_s"
                5,
                114,
                101,
                109,
                95,
                115,
                0,
                4,
                // 4, "rem_u"
                5,
                114,
                101,
                109,
                95,
                117,
                0,
                5,
                // 5, "get_high"
                8,
                103,
                101,
                116,
                95,
                104,
                105,
                103,
                104,
                0,
                0,
                // section "code"
                10,
                191,
                1,
                6,
                // 0, "get_high"
                4,
                0,
                35,
                0,
                11,
                // 1, "mul"
                36,
                1,
                1,
                126,
                32,
                0,
                173,
                32,
                1,
                173,
                66,
                32,
                134,
                132,
                32,
                2,
                173,
                32,
                3,
                173,
                66,
                32,
                134,
                132,
                126,
                34,
                4,
                66,
                32,
                135,
                167,
                36,
                0,
                32,
                4,
                167,
                11,
                // 2, "div_s"
                36,
                1,
                1,
                126,
                32,
                0,
                173,
                32,
                1,
                173,
                66,
                32,
                134,
                132,
                32,
                2,
                173,
                32,
                3,
                173,
                66,
                32,
                134,
                132,
                127,
                34,
                4,
                66,
                32,
                135,
                167,
                36,
                0,
                32,
                4,
                167,
                11,
                // 3, "div_u"
                36,
                1,
                1,
                126,
                32,
                0,
                173,
                32,
                1,
                173,
                66,
                32,
                134,
                132,
                32,
                2,
                173,
                32,
                3,
                173,
                66,
                32,
                134,
                132,
                128,
                34,
                4,
                66,
                32,
                135,
                167,
                36,
                0,
                32,
                4,
                167,
                11,
                // 4, "rem_s"
                36,
                1,
                1,
                126,
                32,
                0,
                173,
                32,
                1,
                173,
                66,
                32,
                134,
                132,
                32,
                2,
                173,
                32,
                3,
                173,
                66,
                32,
                134,
                132,
                129,
                34,
                4,
                66,
                32,
                135,
                167,
                36,
                0,
                32,
                4,
                167,
                11,
                // 5, "rem_u"
                36,
                1,
                1,
                126,
                32,
                0,
                173,
                32,
                1,
                173,
                66,
                32,
                134,
                132,
                32,
                2,
                173,
                32,
                3,
                173,
                66,
                32,
                134,
                132,
                130,
                34,
                4,
                66,
                32,
                135,
                167,
                36,
                0,
                32,
                4,
                167,
                11
              ])
            ),
            {}
          ).exports;
        } catch {
        }
        function Long(low, high, unsigned) {
          this.low = low | 0;
          this.high = high | 0;
          this.unsigned = !!unsigned;
        }
        __name(Long, "Long");
        Long.prototype.__isLong__;
        Object.defineProperty(Long.prototype, "__isLong__", {
          value: true
        });
        function isLong(obj) {
          return (obj && obj["__isLong__"]) === true;
        }
        __name(isLong, "isLong");
        function ctz32(value) {
          var c = Math.clz32(value & -value);
          return value ? 31 - c : c;
        }
        __name(ctz32, "ctz32");
        Long.isLong = isLong;
        var INT_CACHE = {};
        var UINT_CACHE = {};
        function fromInt(value, unsigned) {
          var obj, cachedObj, cache;
          if (unsigned) {
            value >>>= 0;
            if (cache = 0 <= value && value < 256) {
              cachedObj = UINT_CACHE[value];
              if (cachedObj) return cachedObj;
            }
            obj = fromBits(value, 0, true);
            if (cache) UINT_CACHE[value] = obj;
            return obj;
          } else {
            value |= 0;
            if (cache = -128 <= value && value < 128) {
              cachedObj = INT_CACHE[value];
              if (cachedObj) return cachedObj;
            }
            obj = fromBits(value, value < 0 ? -1 : 0, false);
            if (cache) INT_CACHE[value] = obj;
            return obj;
          }
        }
        __name(fromInt, "fromInt");
        Long.fromInt = fromInt;
        function fromNumber(value, unsigned) {
          if (isNaN(value)) return unsigned ? UZERO : ZERO;
          if (unsigned) {
            if (value < 0) return UZERO;
            if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
          } else {
            if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
            if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
          }
          if (value < 0) return fromNumber(-value, unsigned).neg();
          return fromBits(
            value % TWO_PWR_32_DBL | 0,
            value / TWO_PWR_32_DBL | 0,
            unsigned
          );
        }
        __name(fromNumber, "fromNumber");
        Long.fromNumber = fromNumber;
        function fromBits(lowBits, highBits, unsigned) {
          return new Long(lowBits, highBits, unsigned);
        }
        __name(fromBits, "fromBits");
        Long.fromBits = fromBits;
        var pow_dbl = Math.pow;
        function fromString(str, unsigned, radix) {
          if (str.length === 0) throw Error("empty string");
          if (typeof unsigned === "number") {
            radix = unsigned;
            unsigned = false;
          } else {
            unsigned = !!unsigned;
          }
          if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
            return unsigned ? UZERO : ZERO;
          radix = radix || 10;
          if (radix < 2 || 36 < radix) throw RangeError("radix");
          var p;
          if ((p = str.indexOf("-")) > 0) throw Error("interior hyphen");
          else if (p === 0) {
            return fromString(str.substring(1), unsigned, radix).neg();
          }
          var radixToPower = fromNumber(pow_dbl(radix, 8));
          var result = ZERO;
          for (var i = 0; i < str.length; i += 8) {
            var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
            if (size < 8) {
              var power = fromNumber(pow_dbl(radix, size));
              result = result.mul(power).add(fromNumber(value));
            } else {
              result = result.mul(radixToPower);
              result = result.add(fromNumber(value));
            }
          }
          result.unsigned = unsigned;
          return result;
        }
        __name(fromString, "fromString");
        Long.fromString = fromString;
        function fromValue(val, unsigned) {
          if (typeof val === "number") return fromNumber(val, unsigned);
          if (typeof val === "string") return fromString(val, unsigned);
          return fromBits(
            val.low,
            val.high,
            typeof unsigned === "boolean" ? unsigned : val.unsigned
          );
        }
        __name(fromValue, "fromValue");
        Long.fromValue = fromValue;
        var TWO_PWR_16_DBL = 1 << 16;
        var TWO_PWR_24_DBL = 1 << 24;
        var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
        var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
        var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
        var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
        var ZERO = fromInt(0);
        Long.ZERO = ZERO;
        var UZERO = fromInt(0, true);
        Long.UZERO = UZERO;
        var ONE = fromInt(1);
        Long.ONE = ONE;
        var UONE = fromInt(1, true);
        Long.UONE = UONE;
        var NEG_ONE = fromInt(-1);
        Long.NEG_ONE = NEG_ONE;
        var MAX_VALUE = fromBits(4294967295 | 0, 2147483647 | 0, false);
        Long.MAX_VALUE = MAX_VALUE;
        var MAX_UNSIGNED_VALUE = fromBits(4294967295 | 0, 4294967295 | 0, true);
        Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
        var MIN_VALUE = fromBits(0, 2147483648 | 0, false);
        Long.MIN_VALUE = MIN_VALUE;
        var LongPrototype = Long.prototype;
        LongPrototype.toInt = /* @__PURE__ */ __name(function toInt() {
          return this.unsigned ? this.low >>> 0 : this.low;
        }, "toInt");
        LongPrototype.toNumber = /* @__PURE__ */ __name(function toNumber() {
          if (this.unsigned)
            return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
          return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
        }, "toNumber");
        LongPrototype.toString = /* @__PURE__ */ __name(function toString(radix) {
          radix = radix || 10;
          if (radix < 2 || 36 < radix) throw RangeError("radix");
          if (this.isZero()) return "0";
          if (this.isNegative()) {
            if (this.eq(MIN_VALUE)) {
              var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
              return div.toString(radix) + rem1.toInt().toString(radix);
            } else return "-" + this.neg().toString(radix);
          }
          var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
          var result = "";
          while (true) {
            var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
            rem = remDiv;
            if (rem.isZero()) return digits + result;
            else {
              while (digits.length < 6) digits = "0" + digits;
              result = "" + digits + result;
            }
          }
        }, "toString");
        LongPrototype.getHighBits = /* @__PURE__ */ __name(function getHighBits() {
          return this.high;
        }, "getHighBits");
        LongPrototype.getHighBitsUnsigned = /* @__PURE__ */ __name(function getHighBitsUnsigned() {
          return this.high >>> 0;
        }, "getHighBitsUnsigned");
        LongPrototype.getLowBits = /* @__PURE__ */ __name(function getLowBits() {
          return this.low;
        }, "getLowBits");
        LongPrototype.getLowBitsUnsigned = /* @__PURE__ */ __name(function getLowBitsUnsigned() {
          return this.low >>> 0;
        }, "getLowBitsUnsigned");
        LongPrototype.getNumBitsAbs = /* @__PURE__ */ __name(function getNumBitsAbs() {
          if (this.isNegative())
            return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
          var val = this.high != 0 ? this.high : this.low;
          for (var bit = 31; bit > 0; bit--) if ((val & 1 << bit) != 0) break;
          return this.high != 0 ? bit + 33 : bit + 1;
        }, "getNumBitsAbs");
        LongPrototype.isSafeInteger = /* @__PURE__ */ __name(function isSafeInteger() {
          var top11Bits = this.high >> 21;
          if (!top11Bits) return true;
          if (this.unsigned) return false;
          return top11Bits === -1 && !(this.low === 0 && this.high === -2097152);
        }, "isSafeInteger");
        LongPrototype.isZero = /* @__PURE__ */ __name(function isZero() {
          return this.high === 0 && this.low === 0;
        }, "isZero");
        LongPrototype.eqz = LongPrototype.isZero;
        LongPrototype.isNegative = /* @__PURE__ */ __name(function isNegative() {
          return !this.unsigned && this.high < 0;
        }, "isNegative");
        LongPrototype.isPositive = /* @__PURE__ */ __name(function isPositive() {
          return this.unsigned || this.high >= 0;
        }, "isPositive");
        LongPrototype.isOdd = /* @__PURE__ */ __name(function isOdd() {
          return (this.low & 1) === 1;
        }, "isOdd");
        LongPrototype.isEven = /* @__PURE__ */ __name(function isEven() {
          return (this.low & 1) === 0;
        }, "isEven");
        LongPrototype.equals = /* @__PURE__ */ __name(function equals(other) {
          if (!isLong(other)) other = fromValue(other);
          if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
            return false;
          return this.high === other.high && this.low === other.low;
        }, "equals");
        LongPrototype.eq = LongPrototype.equals;
        LongPrototype.notEquals = /* @__PURE__ */ __name(function notEquals(other) {
          return !this.eq(
            /* validates */
            other
          );
        }, "notEquals");
        LongPrototype.neq = LongPrototype.notEquals;
        LongPrototype.ne = LongPrototype.notEquals;
        LongPrototype.lessThan = /* @__PURE__ */ __name(function lessThan(other) {
          return this.comp(
            /* validates */
            other
          ) < 0;
        }, "lessThan");
        LongPrototype.lt = LongPrototype.lessThan;
        LongPrototype.lessThanOrEqual = /* @__PURE__ */ __name(function lessThanOrEqual(other) {
          return this.comp(
            /* validates */
            other
          ) <= 0;
        }, "lessThanOrEqual");
        LongPrototype.lte = LongPrototype.lessThanOrEqual;
        LongPrototype.le = LongPrototype.lessThanOrEqual;
        LongPrototype.greaterThan = /* @__PURE__ */ __name(function greaterThan(other) {
          return this.comp(
            /* validates */
            other
          ) > 0;
        }, "greaterThan");
        LongPrototype.gt = LongPrototype.greaterThan;
        LongPrototype.greaterThanOrEqual = /* @__PURE__ */ __name(function greaterThanOrEqual(other) {
          return this.comp(
            /* validates */
            other
          ) >= 0;
        }, "greaterThanOrEqual");
        LongPrototype.gte = LongPrototype.greaterThanOrEqual;
        LongPrototype.ge = LongPrototype.greaterThanOrEqual;
        LongPrototype.compare = /* @__PURE__ */ __name(function compare(other) {
          if (!isLong(other)) other = fromValue(other);
          if (this.eq(other)) return 0;
          var thisNeg = this.isNegative(), otherNeg = other.isNegative();
          if (thisNeg && !otherNeg) return -1;
          if (!thisNeg && otherNeg) return 1;
          if (!this.unsigned) return this.sub(other).isNegative() ? -1 : 1;
          return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
        }, "compare");
        LongPrototype.comp = LongPrototype.compare;
        LongPrototype.negate = /* @__PURE__ */ __name(function negate() {
          if (!this.unsigned && this.eq(MIN_VALUE)) return MIN_VALUE;
          return this.not().add(ONE);
        }, "negate");
        LongPrototype.neg = LongPrototype.negate;
        LongPrototype.add = /* @__PURE__ */ __name(function add(addend) {
          if (!isLong(addend)) addend = fromValue(addend);
          var a48 = this.high >>> 16;
          var a32 = this.high & 65535;
          var a16 = this.low >>> 16;
          var a00 = this.low & 65535;
          var b48 = addend.high >>> 16;
          var b32 = addend.high & 65535;
          var b16 = addend.low >>> 16;
          var b00 = addend.low & 65535;
          var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
          c00 += a00 + b00;
          c16 += c00 >>> 16;
          c00 &= 65535;
          c16 += a16 + b16;
          c32 += c16 >>> 16;
          c16 &= 65535;
          c32 += a32 + b32;
          c48 += c32 >>> 16;
          c32 &= 65535;
          c48 += a48 + b48;
          c48 &= 65535;
          return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
        }, "add");
        LongPrototype.subtract = /* @__PURE__ */ __name(function subtract(subtrahend) {
          if (!isLong(subtrahend)) subtrahend = fromValue(subtrahend);
          return this.add(subtrahend.neg());
        }, "subtract");
        LongPrototype.sub = LongPrototype.subtract;
        LongPrototype.multiply = /* @__PURE__ */ __name(function multiply(multiplier) {
          if (this.isZero()) return this;
          if (!isLong(multiplier)) multiplier = fromValue(multiplier);
          if (wasm) {
            var low = wasm["mul"](
              this.low,
              this.high,
              multiplier.low,
              multiplier.high
            );
            return fromBits(low, wasm["get_high"](), this.unsigned);
          }
          if (multiplier.isZero()) return this.unsigned ? UZERO : ZERO;
          if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
          if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;
          if (this.isNegative()) {
            if (multiplier.isNegative()) return this.neg().mul(multiplier.neg());
            else return this.neg().mul(multiplier).neg();
          } else if (multiplier.isNegative())
            return this.mul(multiplier.neg()).neg();
          if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
            return fromNumber(
              this.toNumber() * multiplier.toNumber(),
              this.unsigned
            );
          var a48 = this.high >>> 16;
          var a32 = this.high & 65535;
          var a16 = this.low >>> 16;
          var a00 = this.low & 65535;
          var b48 = multiplier.high >>> 16;
          var b32 = multiplier.high & 65535;
          var b16 = multiplier.low >>> 16;
          var b00 = multiplier.low & 65535;
          var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
          c00 += a00 * b00;
          c16 += c00 >>> 16;
          c00 &= 65535;
          c16 += a16 * b00;
          c32 += c16 >>> 16;
          c16 &= 65535;
          c16 += a00 * b16;
          c32 += c16 >>> 16;
          c16 &= 65535;
          c32 += a32 * b00;
          c48 += c32 >>> 16;
          c32 &= 65535;
          c32 += a16 * b16;
          c48 += c32 >>> 16;
          c32 &= 65535;
          c32 += a00 * b32;
          c48 += c32 >>> 16;
          c32 &= 65535;
          c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
          c48 &= 65535;
          return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
        }, "multiply");
        LongPrototype.mul = LongPrototype.multiply;
        LongPrototype.divide = /* @__PURE__ */ __name(function divide(divisor) {
          if (!isLong(divisor)) divisor = fromValue(divisor);
          if (divisor.isZero()) throw Error("division by zero");
          if (wasm) {
            if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) {
              return this;
            }
            var low = (this.unsigned ? wasm["div_u"] : wasm["div_s"])(
              this.low,
              this.high,
              divisor.low,
              divisor.high
            );
            return fromBits(low, wasm["get_high"](), this.unsigned);
          }
          if (this.isZero()) return this.unsigned ? UZERO : ZERO;
          var approx, rem, res;
          if (!this.unsigned) {
            if (this.eq(MIN_VALUE)) {
              if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                return MIN_VALUE;
              else if (divisor.eq(MIN_VALUE)) return ONE;
              else {
                var halfThis = this.shr(1);
                approx = halfThis.div(divisor).shl(1);
                if (approx.eq(ZERO)) {
                  return divisor.isNegative() ? ONE : NEG_ONE;
                } else {
                  rem = this.sub(divisor.mul(approx));
                  res = approx.add(rem.div(divisor));
                  return res;
                }
              }
            } else if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
            if (this.isNegative()) {
              if (divisor.isNegative()) return this.neg().div(divisor.neg());
              return this.neg().div(divisor).neg();
            } else if (divisor.isNegative()) return this.div(divisor.neg()).neg();
            res = ZERO;
          } else {
            if (!divisor.unsigned) divisor = divisor.toUnsigned();
            if (divisor.gt(this)) return UZERO;
            if (divisor.gt(this.shru(1)))
              return UONE;
            res = UZERO;
          }
          rem = this;
          while (rem.gte(divisor)) {
            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
            var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
            while (approxRem.isNegative() || approxRem.gt(rem)) {
              approx -= delta;
              approxRes = fromNumber(approx, this.unsigned);
              approxRem = approxRes.mul(divisor);
            }
            if (approxRes.isZero()) approxRes = ONE;
            res = res.add(approxRes);
            rem = rem.sub(approxRem);
          }
          return res;
        }, "divide");
        LongPrototype.div = LongPrototype.divide;
        LongPrototype.modulo = /* @__PURE__ */ __name(function modulo(divisor) {
          if (!isLong(divisor)) divisor = fromValue(divisor);
          if (wasm) {
            var low = (this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(
              this.low,
              this.high,
              divisor.low,
              divisor.high
            );
            return fromBits(low, wasm["get_high"](), this.unsigned);
          }
          return this.sub(this.div(divisor).mul(divisor));
        }, "modulo");
        LongPrototype.mod = LongPrototype.modulo;
        LongPrototype.rem = LongPrototype.modulo;
        LongPrototype.not = /* @__PURE__ */ __name(function not() {
          return fromBits(~this.low, ~this.high, this.unsigned);
        }, "not");
        LongPrototype.countLeadingZeros = /* @__PURE__ */ __name(function countLeadingZeros() {
          return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
        }, "countLeadingZeros");
        LongPrototype.clz = LongPrototype.countLeadingZeros;
        LongPrototype.countTrailingZeros = /* @__PURE__ */ __name(function countTrailingZeros() {
          return this.low ? ctz32(this.low) : ctz32(this.high) + 32;
        }, "countTrailingZeros");
        LongPrototype.ctz = LongPrototype.countTrailingZeros;
        LongPrototype.and = /* @__PURE__ */ __name(function and(other) {
          if (!isLong(other)) other = fromValue(other);
          return fromBits(
            this.low & other.low,
            this.high & other.high,
            this.unsigned
          );
        }, "and");
        LongPrototype.or = /* @__PURE__ */ __name(function or(other) {
          if (!isLong(other)) other = fromValue(other);
          return fromBits(
            this.low | other.low,
            this.high | other.high,
            this.unsigned
          );
        }, "or");
        LongPrototype.xor = /* @__PURE__ */ __name(function xor(other) {
          if (!isLong(other)) other = fromValue(other);
          return fromBits(
            this.low ^ other.low,
            this.high ^ other.high,
            this.unsigned
          );
        }, "xor");
        LongPrototype.shiftLeft = /* @__PURE__ */ __name(function shiftLeft(numBits) {
          if (isLong(numBits)) numBits = numBits.toInt();
          if ((numBits &= 63) === 0) return this;
          else if (numBits < 32)
            return fromBits(
              this.low << numBits,
              this.high << numBits | this.low >>> 32 - numBits,
              this.unsigned
            );
          else return fromBits(0, this.low << numBits - 32, this.unsigned);
        }, "shiftLeft");
        LongPrototype.shl = LongPrototype.shiftLeft;
        LongPrototype.shiftRight = /* @__PURE__ */ __name(function shiftRight(numBits) {
          if (isLong(numBits)) numBits = numBits.toInt();
          if ((numBits &= 63) === 0) return this;
          else if (numBits < 32)
            return fromBits(
              this.low >>> numBits | this.high << 32 - numBits,
              this.high >> numBits,
              this.unsigned
            );
          else
            return fromBits(
              this.high >> numBits - 32,
              this.high >= 0 ? 0 : -1,
              this.unsigned
            );
        }, "shiftRight");
        LongPrototype.shr = LongPrototype.shiftRight;
        LongPrototype.shiftRightUnsigned = /* @__PURE__ */ __name(function shiftRightUnsigned(numBits) {
          if (isLong(numBits)) numBits = numBits.toInt();
          if ((numBits &= 63) === 0) return this;
          if (numBits < 32)
            return fromBits(
              this.low >>> numBits | this.high << 32 - numBits,
              this.high >>> numBits,
              this.unsigned
            );
          if (numBits === 32) return fromBits(this.high, 0, this.unsigned);
          return fromBits(this.high >>> numBits - 32, 0, this.unsigned);
        }, "shiftRightUnsigned");
        LongPrototype.shru = LongPrototype.shiftRightUnsigned;
        LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
        LongPrototype.rotateLeft = /* @__PURE__ */ __name(function rotateLeft(numBits) {
          var b;
          if (isLong(numBits)) numBits = numBits.toInt();
          if ((numBits &= 63) === 0) return this;
          if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
          if (numBits < 32) {
            b = 32 - numBits;
            return fromBits(
              this.low << numBits | this.high >>> b,
              this.high << numBits | this.low >>> b,
              this.unsigned
            );
          }
          numBits -= 32;
          b = 32 - numBits;
          return fromBits(
            this.high << numBits | this.low >>> b,
            this.low << numBits | this.high >>> b,
            this.unsigned
          );
        }, "rotateLeft");
        LongPrototype.rotl = LongPrototype.rotateLeft;
        LongPrototype.rotateRight = /* @__PURE__ */ __name(function rotateRight(numBits) {
          var b;
          if (isLong(numBits)) numBits = numBits.toInt();
          if ((numBits &= 63) === 0) return this;
          if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
          if (numBits < 32) {
            b = 32 - numBits;
            return fromBits(
              this.high << b | this.low >>> numBits,
              this.low << b | this.high >>> numBits,
              this.unsigned
            );
          }
          numBits -= 32;
          b = 32 - numBits;
          return fromBits(
            this.low << b | this.high >>> numBits,
            this.high << b | this.low >>> numBits,
            this.unsigned
          );
        }, "rotateRight");
        LongPrototype.rotr = LongPrototype.rotateRight;
        LongPrototype.toSigned = /* @__PURE__ */ __name(function toSigned() {
          if (!this.unsigned) return this;
          return fromBits(this.low, this.high, false);
        }, "toSigned");
        LongPrototype.toUnsigned = /* @__PURE__ */ __name(function toUnsigned() {
          if (this.unsigned) return this;
          return fromBits(this.low, this.high, true);
        }, "toUnsigned");
        LongPrototype.toBytes = /* @__PURE__ */ __name(function toBytes(le) {
          return le ? this.toBytesLE() : this.toBytesBE();
        }, "toBytes");
        LongPrototype.toBytesLE = /* @__PURE__ */ __name(function toBytesLE() {
          var hi = this.high, lo = this.low;
          return [
            lo & 255,
            lo >>> 8 & 255,
            lo >>> 16 & 255,
            lo >>> 24,
            hi & 255,
            hi >>> 8 & 255,
            hi >>> 16 & 255,
            hi >>> 24
          ];
        }, "toBytesLE");
        LongPrototype.toBytesBE = /* @__PURE__ */ __name(function toBytesBE() {
          var hi = this.high, lo = this.low;
          return [
            hi >>> 24,
            hi >>> 16 & 255,
            hi >>> 8 & 255,
            hi & 255,
            lo >>> 24,
            lo >>> 16 & 255,
            lo >>> 8 & 255,
            lo & 255
          ];
        }, "toBytesBE");
        Long.fromBytes = /* @__PURE__ */ __name(function fromBytes(bytes, unsigned, le) {
          return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
        }, "fromBytes");
        Long.fromBytesLE = /* @__PURE__ */ __name(function fromBytesLE(bytes, unsigned) {
          return new Long(
            bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24,
            bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24,
            unsigned
          );
        }, "fromBytesLE");
        Long.fromBytesBE = /* @__PURE__ */ __name(function fromBytesBE(bytes, unsigned) {
          return new Long(
            bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7],
            bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3],
            unsigned
          );
        }, "fromBytesBE");
        if (typeof BigInt === "function") {
          Long.fromBigInt = /* @__PURE__ */ __name(function fromBigInt(value, unsigned) {
            var lowBits = Number(BigInt.asIntN(32, value));
            var highBits = Number(BigInt.asIntN(32, value >> BigInt(32)));
            return fromBits(lowBits, highBits, unsigned);
          }, "fromBigInt");
          Long.fromValue = /* @__PURE__ */ __name(function fromValueWithBigInt(value, unsigned) {
            if (typeof value === "bigint") return Long.fromBigInt(value, unsigned);
            return fromValue(value, unsigned);
          }, "fromValueWithBigInt");
          LongPrototype.toBigInt = /* @__PURE__ */ __name(function toBigInt() {
            var lowBigInt = BigInt(this.low >>> 0);
            var highBigInt = BigInt(this.unsigned ? this.high >>> 0 : this.high);
            return highBigInt << BigInt(32) | lowBigInt;
          }, "toBigInt");
        }
        var _default = _exports.default = Long;
      }
    );
  }
});

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/minimal.js
var require_minimal = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/util/minimal.js"(exports) {
    "use strict";
    var util = exports;
    util.asPromise = require_aspromise();
    util.base64 = require_base64();
    util.EventEmitter = require_eventemitter();
    util.float = require_float();
    util.inquire = require_inquire();
    util.utf8 = require_utf8();
    util.pool = require_pool();
    util.LongBits = require_longbits();
    function isUnsafeProperty(key) {
      return key === "__proto__" || key === "prototype" || key === "constructor";
    }
    __name(isUnsafeProperty, "isUnsafeProperty");
    util.isUnsafeProperty = isUnsafeProperty;
    util.isNode = Boolean(typeof global !== "undefined" && global && global.process && global.process.versions && global.process.versions.node);
    util.global = util.isNode && global || typeof window !== "undefined" && window || typeof self !== "undefined" && self || exports;
    util.emptyArray = Object.freeze ? Object.freeze([]) : (
      /* istanbul ignore next */
      []
    );
    util.emptyObject = Object.freeze ? Object.freeze({}) : (
      /* istanbul ignore next */
      {}
    );
    util.isInteger = Number.isInteger || /* istanbul ignore next */
    /* @__PURE__ */ __name(function isInteger(value) {
      return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    }, "isInteger");
    util.isString = /* @__PURE__ */ __name(function isString(value) {
      return typeof value === "string" || value instanceof String;
    }, "isString");
    util.isObject = /* @__PURE__ */ __name(function isObject(value) {
      return value && typeof value === "object";
    }, "isObject");
    util.isset = /**
     * Checks if a property on a message is considered to be present.
     * @param {Object} obj Plain object or message instance
     * @param {string} prop Property name
     * @returns {boolean} `true` if considered to be present, otherwise `false`
     */
    util.isSet = /* @__PURE__ */ __name(function isSet(obj, prop) {
      var value = obj[prop];
      if (value != null && obj.hasOwnProperty(prop))
        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
      return false;
    }, "isSet");
    util.Buffer = (function() {
      try {
        var Buffer2 = util.global.Buffer;
        return Buffer2.prototype.utf8Write ? Buffer2 : (
          /* istanbul ignore next */
          null
        );
      } catch (e) {
        return null;
      }
    })();
    util._Buffer_from = null;
    util._Buffer_allocUnsafe = null;
    util.newBuffer = /* @__PURE__ */ __name(function newBuffer(sizeOrArray) {
      return typeof sizeOrArray === "number" ? util.Buffer ? util._Buffer_allocUnsafe(sizeOrArray) : new util.Array(sizeOrArray) : util.Buffer ? util._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
    }, "newBuffer");
    util.Array = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    util.Long = /* istanbul ignore next */
    util.global.dcodeIO && /* istanbul ignore next */
    util.global.dcodeIO.Long || /* istanbul ignore next */
    util.global.Long || (function() {
      try {
        var Long = require_umd();
        return Long && Long.isLong ? Long : null;
      } catch (e) {
        return null;
      }
    })();
    util.key2Re = /^(?:true|false|0|1)$/;
    util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
    util.key64Re = /^(?:[\x00-\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
    util.longToHash = /* @__PURE__ */ __name(function longToHash(value) {
      return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
    }, "longToHash");
    util.longFromHash = /* @__PURE__ */ __name(function longFromHash(hash, unsigned) {
      var bits2 = util.LongBits.fromHash(hash);
      if (util.Long)
        return util.Long.fromBits(bits2.lo, bits2.hi, unsigned);
      return bits2.toNumber(Boolean(unsigned));
    }, "longFromHash");
    util.longFromKey = /* @__PURE__ */ __name(function longFromKey(key, unsigned) {
      return util.key64Re.test(key) && !util.key32Re.test(key) ? util.longFromHash(key, unsigned) : key;
    }, "longFromKey");
    util.boolFromKey = /* @__PURE__ */ __name(function boolFromKey(key) {
      return key === "true" || key === "1";
    }, "boolFromKey");
    function merge(dst) {
      var ifNotSet = typeof arguments[arguments.length - 1] === "boolean", limit = ifNotSet ? arguments.length - 1 : arguments.length;
      ifNotSet = ifNotSet && arguments[arguments.length - 1];
      for (var a = 1; a < limit; ++a) {
        var src = arguments[a];
        if (!src)
          continue;
        for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
          if (!isUnsafeProperty(keys[i]) && (dst[keys[i]] === void 0 || !ifNotSet))
            dst[keys[i]] = src[keys[i]];
      }
      return dst;
    }
    __name(merge, "merge");
    util.merge = merge;
    util.nestingLimit = 32;
    util.recursionLimit = 100;
    util.makeProp = /* @__PURE__ */ __name(function makeProp(obj, key, enumerable) {
      if (Object.prototype.hasOwnProperty.call(obj, key))
        return;
      Object.defineProperty(obj, key, {
        enumerable: enumerable === void 0 ? true : enumerable,
        configurable: true,
        writable: true
      });
    }, "makeProp");
    util.lcFirst = /* @__PURE__ */ __name(function lcFirst(str) {
      return str.charAt(0).toLowerCase() + str.substring(1);
    }, "lcFirst");
    function newError(name) {
      function CustomError(message, properties) {
        if (!(this instanceof CustomError))
          return new CustomError(message, properties);
        Object.defineProperty(this, "message", { get: /* @__PURE__ */ __name(function() {
          return message;
        }, "get") });
        if (Error.captureStackTrace)
          Error.captureStackTrace(this, CustomError);
        else
          Object.defineProperty(this, "stack", { value: new Error().stack || "" });
        if (properties)
          merge(this, properties);
      }
      __name(CustomError, "CustomError");
      CustomError.prototype = Object.create(Error.prototype, {
        constructor: {
          value: CustomError,
          writable: true,
          enumerable: false,
          configurable: true
        },
        name: {
          get: /* @__PURE__ */ __name(function get() {
            return name;
          }, "get"),
          set: void 0,
          enumerable: false,
          // configurable: false would accurately preserve the behavior of
          // the original, but I'm guessing that was not intentional.
          // For an actual error subclass, this property would
          // be configurable.
          configurable: true
        },
        toString: {
          value: /* @__PURE__ */ __name(function value() {
            return this.name + ": " + this.message;
          }, "value"),
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      return CustomError;
    }
    __name(newError, "newError");
    util.newError = newError;
    util.ProtocolError = newError("ProtocolError");
    util.oneOfGetter = /* @__PURE__ */ __name(function getOneOf(fieldNames) {
      var fieldMap = {};
      for (var i = 0; i < fieldNames.length; ++i)
        fieldMap[fieldNames[i]] = 1;
      return function() {
        for (var keys = Object.keys(this), i2 = keys.length - 1; i2 > -1; --i2)
          if (fieldMap[keys[i2]] === 1 && this[keys[i2]] !== void 0 && this[keys[i2]] !== null)
            return keys[i2];
      };
    }, "getOneOf");
    util.oneOfSetter = /* @__PURE__ */ __name(function setOneOf(fieldNames) {
      return function(name) {
        for (var i = 0; i < fieldNames.length; ++i)
          if (fieldNames[i] !== name)
            delete this[fieldNames[i]];
      };
    }, "setOneOf");
    util.toJSONOptions = {
      longs: String,
      enums: String,
      bytes: String,
      json: true
    };
    util._configure = function() {
      var Buffer2 = util.Buffer;
      if (!Buffer2) {
        util._Buffer_from = util._Buffer_allocUnsafe = null;
        return;
      }
      util._Buffer_from = Buffer2.from !== Uint8Array.from && Buffer2.from || /* istanbul ignore next */
      /* @__PURE__ */ __name(function Buffer_from(value, encoding) {
        return new Buffer2(value, encoding);
      }, "Buffer_from");
      util._Buffer_allocUnsafe = Buffer2.allocUnsafe || /* istanbul ignore next */
      /* @__PURE__ */ __name(function Buffer_allocUnsafe(size) {
        return new Buffer2(size);
      }, "Buffer_allocUnsafe");
    };
  }
});

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/writer.js
var require_writer = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/writer.js"(exports, module) {
    "use strict";
    module.exports = Writer;
    var util = require_minimal();
    var BufferWriter;
    var LongBits = util.LongBits;
    var base64 = util.base64;
    var utf8 = util.utf8;
    function Op(fn, len, val) {
      this.fn = fn;
      this.len = len;
      this.next = void 0;
      this.val = val;
    }
    __name(Op, "Op");
    function noop() {
    }
    __name(noop, "noop");
    function State(writer) {
      this.head = writer.head;
      this.tail = writer.tail;
      this.len = writer.len;
      this.next = writer.states;
    }
    __name(State, "State");
    function Writer() {
      this.len = 0;
      this.head = new Op(noop, 0, 0);
      this.tail = this.head;
      this.states = null;
    }
    __name(Writer, "Writer");
    var create = /* @__PURE__ */ __name(function create2() {
      return util.Buffer ? /* @__PURE__ */ __name(function create_buffer_setup() {
        return (Writer.create = /* @__PURE__ */ __name(function create_buffer() {
          return new BufferWriter();
        }, "create_buffer"))();
      }, "create_buffer_setup") : /* @__PURE__ */ __name(function create_array() {
        return new Writer();
      }, "create_array");
    }, "create");
    Writer.create = create();
    Writer.alloc = /* @__PURE__ */ __name(function alloc(size) {
      return new util.Array(size);
    }, "alloc");
    if (util.Array !== Array)
      Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);
    Writer.prototype._push = /* @__PURE__ */ __name(function push(fn, len, val) {
      this.tail = this.tail.next = new Op(fn, len, val);
      this.len += len;
      return this;
    }, "push");
    function writeByte(val, buf, pos) {
      buf[pos] = val & 255;
    }
    __name(writeByte, "writeByte");
    function writeStringAscii(val, buf, pos) {
      for (var i = 0; i < val.length; )
        buf[pos++] = val.charCodeAt(i++);
    }
    __name(writeStringAscii, "writeStringAscii");
    function writeVarint32(val, buf, pos) {
      while (val > 127) {
        buf[pos++] = val & 127 | 128;
        val >>>= 7;
      }
      buf[pos] = val;
    }
    __name(writeVarint32, "writeVarint32");
    function VarintOp(len, val) {
      this.len = len;
      this.next = void 0;
      this.val = val;
    }
    __name(VarintOp, "VarintOp");
    VarintOp.prototype = Object.create(Op.prototype);
    VarintOp.prototype.fn = writeVarint32;
    Writer.prototype.uint32 = /* @__PURE__ */ __name(function write_uint32(value) {
      this.len += (this.tail = this.tail.next = new VarintOp(
        (value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5,
        value
      )).len;
      return this;
    }, "write_uint32");
    Writer.prototype.int32 = /* @__PURE__ */ __name(function write_int32(value) {
      return (value |= 0) < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
    }, "write_int32");
    Writer.prototype.sint32 = /* @__PURE__ */ __name(function write_sint32(value) {
      return this.uint32((value << 1 ^ value >> 31) >>> 0);
    }, "write_sint32");
    function writeVarint64(val, buf, pos) {
      var lo = val.lo, hi = val.hi;
      while (hi) {
        buf[pos++] = lo & 127 | 128;
        lo = (lo >>> 7 | hi << 25) >>> 0;
        hi >>>= 7;
      }
      while (lo > 127) {
        buf[pos++] = lo & 127 | 128;
        lo = lo >>> 7;
      }
      buf[pos++] = lo;
    }
    __name(writeVarint64, "writeVarint64");
    Writer.prototype.uint64 = /* @__PURE__ */ __name(function write_uint64(value) {
      var bits2 = LongBits.from(value);
      return this._push(writeVarint64, bits2.length(), bits2);
    }, "write_uint64");
    Writer.prototype.int64 = Writer.prototype.uint64;
    Writer.prototype.sint64 = /* @__PURE__ */ __name(function write_sint64(value) {
      var bits2 = LongBits.from(value).zzEncode();
      return this._push(writeVarint64, bits2.length(), bits2);
    }, "write_sint64");
    Writer.prototype.bool = /* @__PURE__ */ __name(function write_bool(value) {
      return this._push(writeByte, 1, value ? 1 : 0);
    }, "write_bool");
    function writeFixed32(val, buf, pos) {
      buf[pos] = val & 255;
      buf[pos + 1] = val >>> 8 & 255;
      buf[pos + 2] = val >>> 16 & 255;
      buf[pos + 3] = val >>> 24;
    }
    __name(writeFixed32, "writeFixed32");
    Writer.prototype.fixed32 = /* @__PURE__ */ __name(function write_fixed32(value) {
      return this._push(writeFixed32, 4, value >>> 0);
    }, "write_fixed32");
    Writer.prototype.sfixed32 = Writer.prototype.fixed32;
    Writer.prototype.fixed64 = /* @__PURE__ */ __name(function write_fixed64(value) {
      var bits2 = LongBits.from(value);
      return this._push(writeFixed32, 4, bits2.lo)._push(writeFixed32, 4, bits2.hi);
    }, "write_fixed64");
    Writer.prototype.sfixed64 = Writer.prototype.fixed64;
    Writer.prototype.float = /* @__PURE__ */ __name(function write_float(value) {
      return this._push(util.float.writeFloatLE, 4, value);
    }, "write_float");
    Writer.prototype.double = /* @__PURE__ */ __name(function write_double(value) {
      return this._push(util.float.writeDoubleLE, 8, value);
    }, "write_double");
    var writeBytes = util.Array.prototype.set ? /* @__PURE__ */ __name(function writeBytes_set(val, buf, pos) {
      buf.set(val, pos);
    }, "writeBytes_set") : /* @__PURE__ */ __name(function writeBytes_for(val, buf, pos) {
      for (var i = 0; i < val.length; ++i)
        buf[pos + i] = val[i];
    }, "writeBytes_for");
    Writer.prototype.bytes = /* @__PURE__ */ __name(function write_bytes(value) {
      var len = value.length >>> 0;
      if (!len)
        return this._push(writeByte, 1, 0);
      if (util.isString(value)) {
        var buf = Writer.alloc(len = base64.length(value));
        base64.decode(value, buf, 0);
        value = buf;
      }
      return this.uint32(len)._push(writeBytes, len, value);
    }, "write_bytes");
    Writer.prototype.raw = /* @__PURE__ */ __name(function write_raw(value) {
      var len = value.length >>> 0;
      return len ? this._push(writeBytes, len, value) : this;
    }, "write_raw");
    Writer.prototype.string = /* @__PURE__ */ __name(function write_string(value) {
      var len = utf8.length(value);
      return len ? this.uint32(len)._push(len === value.length ? writeStringAscii : utf8.write, len, value) : this._push(writeByte, 1, 0);
    }, "write_string");
    Writer.prototype.fork = /* @__PURE__ */ __name(function fork() {
      this.states = new State(this);
      this.head = this.tail = new Op(noop, 0, 0);
      this.len = 0;
      return this;
    }, "fork");
    Writer.prototype.reset = /* @__PURE__ */ __name(function reset() {
      if (this.states) {
        this.head = this.states.head;
        this.tail = this.states.tail;
        this.len = this.states.len;
        this.states = this.states.next;
      } else {
        this.head = this.tail = new Op(noop, 0, 0);
        this.len = 0;
      }
      return this;
    }, "reset");
    Writer.prototype.ldelim = /* @__PURE__ */ __name(function ldelim() {
      var head = this.head, tail = this.tail, len = this.len;
      this.reset().uint32(len);
      if (len) {
        this.tail.next = head.next;
        this.tail = tail;
        this.len += len;
      }
      return this;
    }, "ldelim");
    Writer.prototype.finish = /* @__PURE__ */ __name(function finish() {
      return this.finishInto(this.constructor.alloc(this.len), 0);
    }, "finish");
    Writer.prototype.finishInto = /* @__PURE__ */ __name(function finishInto(buf, offset) {
      if (offset === void 0)
        offset = 0;
      var head = this.head.next, pos = offset;
      while (head) {
        head.fn(head.val, buf, pos);
        pos += head.len;
        head = head.next;
      }
      return buf;
    }, "finishInto");
    Writer._configure = function(BufferWriter_) {
      BufferWriter = BufferWriter_;
      Writer.create = create();
      BufferWriter._configure();
    };
  }
});

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/writer_buffer.js
var require_writer_buffer = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/writer_buffer.js"(exports, module) {
    "use strict";
    module.exports = BufferWriter;
    var Writer = require_writer();
    (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
    var util = require_minimal();
    function BufferWriter() {
      Writer.call(this);
    }
    __name(BufferWriter, "BufferWriter");
    BufferWriter._configure = function() {
      BufferWriter.alloc = util._Buffer_allocUnsafe;
      BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set" ? /* @__PURE__ */ __name(function writeBytesBuffer_set(val, buf, pos) {
        buf.set(val, pos);
      }, "writeBytesBuffer_set") : /* @__PURE__ */ __name(function writeBytesBuffer_copy(val, buf, pos) {
        if (val.copy)
          val.copy(buf, pos, 0, val.length);
        else for (var i = 0; i < val.length; )
          buf[pos++] = val[i++];
      }, "writeBytesBuffer_copy");
    };
    BufferWriter.prototype.bytes = /* @__PURE__ */ __name(function write_bytes_buffer(value) {
      if (util.isString(value))
        value = util._Buffer_from(value, "base64");
      var len = value.length >>> 0;
      this.uint32(len);
      if (len)
        this._push(BufferWriter.writeBytesBuffer, len, value);
      return this;
    }, "write_bytes_buffer");
    BufferWriter.prototype.raw = /* @__PURE__ */ __name(function write_raw_buffer(value) {
      var len = value.length >>> 0;
      return len ? this._push(BufferWriter.writeBytesBuffer, len, value) : this;
    }, "write_raw_buffer");
    function writeStringBufferAscii(val, buf, pos) {
      for (var i = 0; i < val.length; )
        buf[pos++] = val.charCodeAt(i++);
    }
    __name(writeStringBufferAscii, "writeStringBufferAscii");
    function writeStringBuffer(val, buf, pos) {
      if (val.length < 40)
        util.utf8.write(val, buf, pos);
      else if (buf.utf8Write)
        buf.utf8Write(val, pos);
      else
        buf.write(val, pos);
    }
    __name(writeStringBuffer, "writeStringBuffer");
    BufferWriter.prototype.string = /* @__PURE__ */ __name(function write_string_buffer(value) {
      var len = util.Buffer.byteLength(value);
      this.uint32(len);
      if (len)
        this._push(len === value.length && len < 40 ? writeStringBufferAscii : writeStringBuffer, len, value);
      return this;
    }, "write_string_buffer");
    BufferWriter._configure();
  }
});

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/reader.js
var require_reader = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/reader.js"(exports, module) {
    "use strict";
    module.exports = Reader;
    var util = require_minimal();
    var BufferReader;
    var LongBits = util.LongBits;
    var utf8 = util.utf8;
    function indexOutOfRange(reader, writeLength) {
      return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
    }
    __name(indexOutOfRange, "indexOutOfRange");
    function Reader(buffer) {
      this.buf = buffer;
      this.pos = 0;
      this.len = buffer.length;
      this.discardUnknown = Reader.discardUnknown;
    }
    __name(Reader, "Reader");
    var create_array = typeof Uint8Array !== "undefined" ? /* @__PURE__ */ __name(function create_typed_array(buffer) {
      if (buffer instanceof Uint8Array || Array.isArray(buffer))
        return new Reader(buffer);
      throw Error("illegal buffer");
    }, "create_typed_array") : /* @__PURE__ */ __name(function create_array2(buffer) {
      if (Array.isArray(buffer))
        return new Reader(buffer);
      throw Error("illegal buffer");
    }, "create_array");
    var create = /* @__PURE__ */ __name(function create2() {
      return util.Buffer ? /* @__PURE__ */ __name(function create_buffer_setup(buffer) {
        return (Reader.create = /* @__PURE__ */ __name(function create_buffer(buffer2) {
          return util.Buffer.isBuffer(buffer2) ? new BufferReader(buffer2) : create_array(buffer2);
        }, "create_buffer"))(buffer);
      }, "create_buffer_setup") : create_array;
    }, "create");
    Reader.create = create();
    Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */
    util.Array.prototype.slice;
    Reader.prototype.raw = /* @__PURE__ */ __name(function read_raw(start, end) {
      if (Array.isArray(this.buf))
        return this.buf.slice(start, end);
      if (start === end)
        return new this.buf.constructor(0);
      return this._slice.call(this.buf, start, end);
    }, "read_raw");
    Reader.prototype.uint32 = /* @__PURE__ */ __name(function read_uint32() {
      var buf = this.buf, pos = this.pos, value = (buf[pos] & 127) >>> 0;
      if (buf[pos++] < 128) {
        this.pos = pos;
        return value;
      }
      value = (value | (buf[pos] & 127) << 7) >>> 0;
      if (buf[pos++] < 128) {
        this.pos = pos;
        return value;
      }
      value = (value | (buf[pos] & 127) << 14) >>> 0;
      if (buf[pos++] < 128) {
        this.pos = pos;
        return value;
      }
      value = (value | (buf[pos] & 127) << 21) >>> 0;
      if (buf[pos++] < 128) {
        this.pos = pos;
        return value;
      }
      value = (value | (buf[pos] & 15) << 28) >>> 0;
      if (buf[pos++] < 128) {
        this.pos = pos;
        return value;
      }
      for (var i = 0; i < 5; ++i) {
        if (pos >= this.len) {
          this.pos = pos;
          throw indexOutOfRange(this);
        }
        if (buf[pos++] < 128) {
          this.pos = pos;
          return value;
        }
      }
      this.pos = pos;
      throw Error("invalid varint encoding");
    }, "read_uint32");
    Reader.prototype.tag = /* @__PURE__ */ __name(function read_tag() {
      var buf = this.buf, pos = this.pos, value = (buf[pos] & 127) >>> 0;
      if (buf[pos++] < 128) {
        this.pos = pos;
        return value;
      }
      value = (value | (buf[pos] & 127) << 7) >>> 0;
      if (buf[pos++] < 128) {
        this.pos = pos;
        return value;
      }
      value = (value | (buf[pos] & 127) << 14) >>> 0;
      if (buf[pos++] < 128) {
        this.pos = pos;
        return value;
      }
      value = (value | (buf[pos] & 127) << 21) >>> 0;
      if (buf[pos++] < 128) {
        this.pos = pos;
        return value;
      }
      value = (value | (buf[pos] & 15) << 28) >>> 0;
      if (buf[pos] < 128 && (buf[pos] & 112) === 0) {
        this.pos = pos + 1;
        return value;
      }
      this.pos = pos + 1;
      throw Error("invalid tag encoding");
    }, "read_tag");
    Reader.prototype.int32 = /* @__PURE__ */ __name(function read_int32() {
      return this.uint32() | 0;
    }, "read_int32");
    Reader.prototype.sint32 = /* @__PURE__ */ __name(function read_sint32() {
      var value = this.uint32();
      return value >>> 1 ^ -(value & 1) | 0;
    }, "read_sint32");
    function readLongVarint() {
      var bits2 = new LongBits(0, 0);
      var i = 0;
      if (this.len - this.pos > 4) {
        for (; i < 4; ++i) {
          bits2.lo = (bits2.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits2;
        }
        bits2.lo = (bits2.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits2.hi = (bits2.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
        if (this.buf[this.pos++] < 128)
          return bits2;
        i = 0;
      } else {
        for (; i < 3; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits2.lo = (bits2.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits2;
        }
        bits2.lo = (bits2.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
        return bits2;
      }
      if (this.len - this.pos > 4) {
        for (; i < 5; ++i) {
          bits2.hi = (bits2.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits2;
        }
      } else {
        for (; i < 5; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits2.hi = (bits2.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits2;
        }
      }
      throw Error("invalid varint encoding");
    }
    __name(readLongVarint, "readLongVarint");
    Reader.prototype.bool = /* @__PURE__ */ __name(function read_bool() {
      var value = false, b;
      for (var i = 0; i < 10; ++i) {
        if (this.pos >= this.len)
          throw indexOutOfRange(this);
        b = this.buf[this.pos++];
        if (b & 127)
          value = true;
        if (b < 128)
          return value;
      }
      throw Error("invalid varint encoding");
    }, "read_bool");
    function readFixed32_end(buf, end) {
      return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
    }
    __name(readFixed32_end, "readFixed32_end");
    Reader.prototype.fixed32 = /* @__PURE__ */ __name(function read_fixed32() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      return readFixed32_end(this.buf, this.pos += 4);
    }, "read_fixed32");
    Reader.prototype.sfixed32 = /* @__PURE__ */ __name(function read_sfixed32() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      return readFixed32_end(this.buf, this.pos += 4) | 0;
    }, "read_sfixed32");
    function readFixed64() {
      if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 8);
      return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
    }
    __name(readFixed64, "readFixed64");
    Reader.prototype.float = /* @__PURE__ */ __name(function read_float() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      var value = util.float.readFloatLE(this.buf, this.pos);
      this.pos += 4;
      return value;
    }, "read_float");
    Reader.prototype.double = /* @__PURE__ */ __name(function read_double() {
      if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 4);
      var value = util.float.readDoubleLE(this.buf, this.pos);
      this.pos += 8;
      return value;
    }, "read_double");
    Reader.prototype.bytes = /* @__PURE__ */ __name(function read_bytes() {
      var length = this.uint32(), start = this.pos, end = this.pos + length;
      if (end > this.len)
        throw indexOutOfRange(this, length);
      this.pos = end;
      return this.raw(start, end);
    }, "read_bytes");
    Reader.prototype.string = /* @__PURE__ */ __name(function read_string() {
      var length = this.uint32(), start = this.pos, end = this.pos + length;
      if (end > this.len)
        throw indexOutOfRange(this, length);
      this.pos = end;
      return utf8.read(this.buf, start, end);
    }, "read_string");
    Reader.prototype.skip = /* @__PURE__ */ __name(function skip(length) {
      if (typeof length === "number") {
        if (this.pos + length > this.len)
          throw indexOutOfRange(this, length);
        this.pos += length;
      } else {
        do {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
        } while (this.buf[this.pos++] & 128);
      }
      return this;
    }, "skip");
    Reader.recursionLimit = util.recursionLimit;
    Reader.discardUnknown = false;
    Reader.prototype.skipType = function(wireType, depth, fieldNumber) {
      if (depth === void 0) depth = 0;
      if (depth > Reader.recursionLimit)
        throw Error("max depth exceeded");
      if (fieldNumber === 0)
        throw Error("illegal tag: field number 0");
      switch (wireType) {
        case 0:
          this.skip();
          break;
        case 1:
          this.skip(8);
          break;
        case 2:
          this.skip(this.uint32());
          break;
        case 3:
          while (true) {
            var tag = this.tag();
            var nestedField = tag >>> 3;
            wireType = tag & 7;
            if (!nestedField)
              throw Error("illegal tag: field number 0");
            if (wireType === 4) {
              if (fieldNumber !== void 0 && nestedField !== fieldNumber)
                throw Error("invalid end group tag");
              break;
            }
            this.skipType(wireType, depth + 1, nestedField);
          }
          break;
        case 5:
          this.skip(4);
          break;
        /* istanbul ignore next */
        default:
          throw Error("invalid wire type " + wireType + " at offset " + this.pos);
      }
      return this;
    };
    Reader._configure = function(BufferReader_) {
      BufferReader = BufferReader_;
      Reader.create = create();
      BufferReader._configure();
      var fn = util.Long ? "toLong" : (
        /* istanbul ignore next */
        "toNumber"
      );
      util.merge(Reader.prototype, {
        int64: /* @__PURE__ */ __name(function read_int64() {
          return readLongVarint.call(this)[fn](false);
        }, "read_int64"),
        uint64: /* @__PURE__ */ __name(function read_uint64() {
          return readLongVarint.call(this)[fn](true);
        }, "read_uint64"),
        sint64: /* @__PURE__ */ __name(function read_sint64() {
          return readLongVarint.call(this).zzDecode()[fn](false);
        }, "read_sint64"),
        fixed64: /* @__PURE__ */ __name(function read_fixed64() {
          return readFixed64.call(this)[fn](true);
        }, "read_fixed64"),
        sfixed64: /* @__PURE__ */ __name(function read_sfixed64() {
          return readFixed64.call(this)[fn](false);
        }, "read_sfixed64")
      });
    };
  }
});

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/reader_buffer.js
var require_reader_buffer = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/reader_buffer.js"(exports, module) {
    "use strict";
    module.exports = BufferReader;
    var Reader = require_reader();
    (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
    var util = require_minimal();
    function BufferReader(buffer) {
      Reader.call(this, buffer);
    }
    __name(BufferReader, "BufferReader");
    BufferReader._configure = function() {
      if (util.Buffer)
        BufferReader.prototype._slice = util.Buffer.prototype.slice;
    };
    BufferReader.prototype.raw = /* @__PURE__ */ __name(function read_raw_buffer(start, end) {
      if (start === end)
        return util.Buffer.alloc(0);
      return this._slice.call(this.buf, start, end);
    }, "read_raw_buffer");
    BufferReader.prototype.string = /* @__PURE__ */ __name(function read_string_buffer() {
      var len = this.uint32(), start = this.pos, end = this.pos + len;
      if (end > this.len)
        throw RangeError("index out of range: " + this.pos + " + " + len + " > " + this.len);
      this.pos = end;
      return this.buf.utf8Slice ? this.buf.utf8Slice(start, end) : this.buf.toString("utf-8", start, end);
    }, "read_string_buffer");
    BufferReader._configure();
  }
});

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/rpc/service.js
var require_service = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/rpc/service.js"(exports, module) {
    "use strict";
    module.exports = Service;
    var util = require_minimal();
    (Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;
    function Service(rpcImpl, requestDelimited, responseDelimited) {
      if (typeof rpcImpl !== "function")
        throw TypeError("rpcImpl must be a function");
      util.EventEmitter.call(this);
      this.rpcImpl = rpcImpl;
      this.requestDelimited = Boolean(requestDelimited);
      this.responseDelimited = Boolean(responseDelimited);
    }
    __name(Service, "Service");
    Service.prototype.rpcCall = /* @__PURE__ */ __name(function rpcCall(method, requestCtor, responseCtor, request, callback) {
      if (!request)
        throw TypeError("request must be specified");
      var self2 = this;
      if (!callback)
        return util.asPromise(rpcCall, self2, method, requestCtor, responseCtor, request);
      if (!self2.rpcImpl) {
        setTimeout(function() {
          callback(Error("already ended"));
        }, 0);
        return void 0;
      }
      try {
        return self2.rpcImpl(
          method,
          requestCtor[self2.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
          /* @__PURE__ */ __name(function rpcCallback(err2, response) {
            if (err2) {
              self2.emit("error", err2, method);
              return callback(err2);
            }
            if (response === null) {
              self2.end(
                /* endedByRPC */
                true
              );
              return void 0;
            }
            if (!(response instanceof responseCtor)) {
              try {
                response = responseCtor[self2.responseDelimited ? "decodeDelimited" : "decode"](response);
              } catch (err3) {
                self2.emit("error", err3, method);
                return callback(err3);
              }
            }
            self2.emit("data", response, method);
            return callback(null, response);
          }, "rpcCallback")
        );
      } catch (err2) {
        self2.emit("error", err2, method);
        setTimeout(function() {
          callback(err2);
        }, 0);
        return void 0;
      }
    }, "rpcCall");
    Service.prototype.end = /* @__PURE__ */ __name(function end(endedByRPC) {
      if (this.rpcImpl) {
        if (!endedByRPC)
          this.rpcImpl(null, null, null);
        this.rpcImpl = null;
        this.emit("end").off();
      }
      return this;
    }, "end");
  }
});

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/rpc.js
var require_rpc = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/rpc.js"(exports) {
    "use strict";
    var rpc = exports;
    rpc.Service = require_service();
  }
});

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/roots.js
var require_roots = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/roots.js"(exports, module) {
    "use strict";
    module.exports = /* @__PURE__ */ Object.create(null);
  }
});

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/index-minimal.js
var require_index_minimal = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/src/index-minimal.js"(exports) {
    "use strict";
    var protobuf = exports;
    protobuf.build = "minimal";
    protobuf.Writer = require_writer();
    protobuf.BufferWriter = require_writer_buffer();
    protobuf.Reader = require_reader();
    protobuf.BufferReader = require_reader_buffer();
    protobuf.util = require_minimal();
    protobuf.rpc = require_rpc();
    protobuf.roots = require_roots();
    protobuf.configure = configure;
    function configure() {
      protobuf.util._configure();
      protobuf.Writer._configure(protobuf.BufferWriter);
      protobuf.Reader._configure(protobuf.BufferReader);
    }
    __name(configure, "configure");
    configure();
  }
});

// node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/minimal.js
var require_minimal2 = __commonJS({
  "node_modules/.pnpm/protobufjs@8.5.0/node_modules/protobufjs/minimal.js"(exports, module) {
    "use strict";
    module.exports = require_index_minimal();
  }
});

// node_modules/.pnpm/gtfs-realtime-bindings@2.0.0/node_modules/gtfs-realtime-bindings/gtfs-realtime.js
var require_gtfs_realtime = __commonJS({
  "node_modules/.pnpm/gtfs-realtime-bindings@2.0.0/node_modules/gtfs-realtime-bindings/gtfs-realtime.js"(exports, module) {
    "use strict";
    var $protobuf = require_minimal2();
    var $Reader = $protobuf.Reader;
    var $Writer = $protobuf.Writer;
    var $util = $protobuf.util;
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    $root.transit_realtime = (function() {
      var transit_realtime2 = {};
      transit_realtime2.FeedMessage = (function() {
        function FeedMessage(properties) {
          this.entity = [];
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(FeedMessage, "FeedMessage");
        FeedMessage.prototype.header = null;
        FeedMessage.prototype.entity = $util.emptyArray;
        FeedMessage.create = /* @__PURE__ */ __name(function create(properties) {
          return new FeedMessage(properties);
        }, "create");
        FeedMessage.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          $root.transit_realtime.FeedHeader.encode(message.header, writer.uint32(
            /* id 1, wireType 2 =*/
            10
          ).fork()).ldelim();
          if (message.entity != null && message.entity.length)
            for (var i = 0; i < message.entity.length; ++i)
              $root.transit_realtime.FeedEntity.encode(message.entity[i], writer.uint32(
                /* id 2, wireType 2 =*/
                18
              ).fork()).ldelim();
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        FeedMessage.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        FeedMessage.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.FeedMessage();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 2)
                  break;
                message.header = $root.transit_realtime.FeedHeader.decode(reader, reader.uint32(), void 0, _depth + 1, message.header);
                continue;
              }
              case 2: {
                if (wireType !== 2)
                  break;
                if (!(message.entity && message.entity.length))
                  message.entity = [];
                message.entity.push($root.transit_realtime.FeedEntity.decode(reader, reader.uint32(), void 0, _depth + 1));
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          if (!message.hasOwnProperty("header"))
            throw $util.ProtocolError("missing required 'header'", { instance: message });
          return message;
        }, "decode");
        FeedMessage.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        FeedMessage.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          {
            var error = $root.transit_realtime.FeedHeader.verify(message.header, _depth + 1);
            if (error)
              return "header." + error;
          }
          if (message.entity != null && message.hasOwnProperty("entity")) {
            if (!Array.isArray(message.entity))
              return "entity: array expected";
            for (var i = 0; i < message.entity.length; ++i) {
              var error = $root.transit_realtime.FeedEntity.verify(message.entity[i], _depth + 1);
              if (error)
                return "entity." + error;
            }
          }
          return null;
        }, "verify");
        FeedMessage.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.FeedMessage)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.FeedMessage();
          if (object.header != null) {
            if (typeof object.header !== "object")
              throw TypeError(".transit_realtime.FeedMessage.header: object expected");
            message.header = $root.transit_realtime.FeedHeader.fromObject(object.header, _depth + 1);
          }
          if (object.entity) {
            if (!Array.isArray(object.entity))
              throw TypeError(".transit_realtime.FeedMessage.entity: array expected");
            message.entity = Array(object.entity.length);
            for (var i = 0; i < object.entity.length; ++i) {
              if (typeof object.entity[i] !== "object")
                throw TypeError(".transit_realtime.FeedMessage.entity: object expected");
              message.entity[i] = $root.transit_realtime.FeedEntity.fromObject(object.entity[i], _depth + 1);
            }
          }
          return message;
        }, "fromObject");
        FeedMessage.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.arrays || options.defaults)
            object.entity = [];
          if (options.defaults)
            object.header = null;
          if (message.header != null && message.hasOwnProperty("header"))
            object.header = $root.transit_realtime.FeedHeader.toObject(message.header, options);
          if (message.entity && message.entity.length) {
            object.entity = Array(message.entity.length);
            for (var j = 0; j < message.entity.length; ++j)
              object.entity[j] = $root.transit_realtime.FeedEntity.toObject(message.entity[j], options);
          }
          return object;
        }, "toObject");
        FeedMessage.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        FeedMessage.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.FeedMessage";
        }, "getTypeUrl");
        return FeedMessage;
      })();
      transit_realtime2.FeedHeader = (function() {
        function FeedHeader(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(FeedHeader, "FeedHeader");
        FeedHeader.prototype.gtfsRealtimeVersion = "";
        FeedHeader.prototype.incrementality = 0;
        FeedHeader.prototype.timestamp = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;
        FeedHeader.prototype.feedVersion = "";
        FeedHeader.create = /* @__PURE__ */ __name(function create(properties) {
          return new FeedHeader(properties);
        }, "create");
        FeedHeader.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          writer.uint32(
            /* id 1, wireType 2 =*/
            10
          ).string(message.gtfsRealtimeVersion);
          if (message.incrementality != null && Object.hasOwnProperty.call(message, "incrementality"))
            writer.uint32(
              /* id 2, wireType 0 =*/
              16
            ).int32(message.incrementality);
          if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
            writer.uint32(
              /* id 3, wireType 0 =*/
              24
            ).uint64(message.timestamp);
          if (message.feedVersion != null && Object.hasOwnProperty.call(message, "feedVersion"))
            writer.uint32(
              /* id 4, wireType 2 =*/
              34
            ).string(message.feedVersion);
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        FeedHeader.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        FeedHeader.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.FeedHeader();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 2)
                  break;
                message.gtfsRealtimeVersion = reader.string();
                continue;
              }
              case 2: {
                if (wireType !== 0)
                  break;
                message.incrementality = reader.int32();
                continue;
              }
              case 3: {
                if (wireType !== 0)
                  break;
                message.timestamp = reader.uint64();
                continue;
              }
              case 4: {
                if (wireType !== 2)
                  break;
                message.feedVersion = reader.string();
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          if (!message.hasOwnProperty("gtfsRealtimeVersion"))
            throw $util.ProtocolError("missing required 'gtfsRealtimeVersion'", { instance: message });
          return message;
        }, "decode");
        FeedHeader.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        FeedHeader.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          if (!$util.isString(message.gtfsRealtimeVersion))
            return "gtfsRealtimeVersion: string expected";
          if (message.incrementality != null && message.hasOwnProperty("incrementality"))
            switch (message.incrementality) {
              default:
                return "incrementality: enum value expected";
              case 0:
              case 1:
                break;
            }
          if (message.timestamp != null && message.hasOwnProperty("timestamp")) {
            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
              return "timestamp: integer|Long expected";
          }
          if (message.feedVersion != null && message.hasOwnProperty("feedVersion")) {
            if (!$util.isString(message.feedVersion))
              return "feedVersion: string expected";
          }
          return null;
        }, "verify");
        FeedHeader.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.FeedHeader)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.FeedHeader();
          if (object.gtfsRealtimeVersion != null)
            message.gtfsRealtimeVersion = String(object.gtfsRealtimeVersion);
          switch (object.incrementality) {
            default:
              if (typeof object.incrementality === "number") {
                message.incrementality = object.incrementality;
                break;
              }
              break;
            case "FULL_DATASET":
            case 0:
              message.incrementality = 0;
              break;
            case "DIFFERENTIAL":
            case 1:
              message.incrementality = 1;
              break;
          }
          if (object.timestamp != null) {
            if ($util.Long)
              (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
            else if (typeof object.timestamp === "string")
              message.timestamp = parseInt(object.timestamp, 10);
            else if (typeof object.timestamp === "number")
              message.timestamp = object.timestamp;
            else if (typeof object.timestamp === "object")
              message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
          }
          if (object.feedVersion != null)
            message.feedVersion = String(object.feedVersion);
          return message;
        }, "fromObject");
        FeedHeader.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.defaults) {
            object.gtfsRealtimeVersion = "";
            object.incrementality = options.enums === String ? "FULL_DATASET" : 0;
            if ($util.Long) {
              var long = new $util.Long(0, 0, true);
              object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
              object.timestamp = options.longs === String ? "0" : 0;
            object.feedVersion = "";
          }
          if (message.gtfsRealtimeVersion != null && message.hasOwnProperty("gtfsRealtimeVersion"))
            object.gtfsRealtimeVersion = message.gtfsRealtimeVersion;
          if (message.incrementality != null && message.hasOwnProperty("incrementality"))
            object.incrementality = options.enums === String ? $root.transit_realtime.FeedHeader.Incrementality[message.incrementality] === void 0 ? message.incrementality : $root.transit_realtime.FeedHeader.Incrementality[message.incrementality] : message.incrementality;
          if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (typeof message.timestamp === "number")
              object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
            else
              object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
          if (message.feedVersion != null && message.hasOwnProperty("feedVersion"))
            object.feedVersion = message.feedVersion;
          return object;
        }, "toObject");
        FeedHeader.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        FeedHeader.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.FeedHeader";
        }, "getTypeUrl");
        FeedHeader.Incrementality = (function() {
          var valuesById = {}, values = Object.create(valuesById);
          values[valuesById[0] = "FULL_DATASET"] = 0;
          values[valuesById[1] = "DIFFERENTIAL"] = 1;
          return values;
        })();
        return FeedHeader;
      })();
      transit_realtime2.FeedEntity = (function() {
        function FeedEntity(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(FeedEntity, "FeedEntity");
        FeedEntity.prototype.id = "";
        FeedEntity.prototype.isDeleted = false;
        FeedEntity.prototype.tripUpdate = null;
        FeedEntity.prototype.vehicle = null;
        FeedEntity.prototype.alert = null;
        FeedEntity.prototype.shape = null;
        FeedEntity.prototype.stop = null;
        FeedEntity.prototype.tripModifications = null;
        FeedEntity.create = /* @__PURE__ */ __name(function create(properties) {
          return new FeedEntity(properties);
        }, "create");
        FeedEntity.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          writer.uint32(
            /* id 1, wireType 2 =*/
            10
          ).string(message.id);
          if (message.isDeleted != null && Object.hasOwnProperty.call(message, "isDeleted"))
            writer.uint32(
              /* id 2, wireType 0 =*/
              16
            ).bool(message.isDeleted);
          if (message.tripUpdate != null && Object.hasOwnProperty.call(message, "tripUpdate"))
            $root.transit_realtime.TripUpdate.encode(message.tripUpdate, writer.uint32(
              /* id 3, wireType 2 =*/
              26
            ).fork()).ldelim();
          if (message.vehicle != null && Object.hasOwnProperty.call(message, "vehicle"))
            $root.transit_realtime.VehiclePosition.encode(message.vehicle, writer.uint32(
              /* id 4, wireType 2 =*/
              34
            ).fork()).ldelim();
          if (message.alert != null && Object.hasOwnProperty.call(message, "alert"))
            $root.transit_realtime.Alert.encode(message.alert, writer.uint32(
              /* id 5, wireType 2 =*/
              42
            ).fork()).ldelim();
          if (message.shape != null && Object.hasOwnProperty.call(message, "shape"))
            $root.transit_realtime.Shape.encode(message.shape, writer.uint32(
              /* id 6, wireType 2 =*/
              50
            ).fork()).ldelim();
          if (message.stop != null && Object.hasOwnProperty.call(message, "stop"))
            $root.transit_realtime.Stop.encode(message.stop, writer.uint32(
              /* id 7, wireType 2 =*/
              58
            ).fork()).ldelim();
          if (message.tripModifications != null && Object.hasOwnProperty.call(message, "tripModifications"))
            $root.transit_realtime.TripModifications.encode(message.tripModifications, writer.uint32(
              /* id 8, wireType 2 =*/
              66
            ).fork()).ldelim();
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        FeedEntity.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        FeedEntity.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.FeedEntity();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 2)
                  break;
                message.id = reader.string();
                continue;
              }
              case 2: {
                if (wireType !== 0)
                  break;
                message.isDeleted = reader.bool();
                continue;
              }
              case 3: {
                if (wireType !== 2)
                  break;
                message.tripUpdate = $root.transit_realtime.TripUpdate.decode(reader, reader.uint32(), void 0, _depth + 1, message.tripUpdate);
                continue;
              }
              case 4: {
                if (wireType !== 2)
                  break;
                message.vehicle = $root.transit_realtime.VehiclePosition.decode(reader, reader.uint32(), void 0, _depth + 1, message.vehicle);
                continue;
              }
              case 5: {
                if (wireType !== 2)
                  break;
                message.alert = $root.transit_realtime.Alert.decode(reader, reader.uint32(), void 0, _depth + 1, message.alert);
                continue;
              }
              case 6: {
                if (wireType !== 2)
                  break;
                message.shape = $root.transit_realtime.Shape.decode(reader, reader.uint32(), void 0, _depth + 1, message.shape);
                continue;
              }
              case 7: {
                if (wireType !== 2)
                  break;
                message.stop = $root.transit_realtime.Stop.decode(reader, reader.uint32(), void 0, _depth + 1, message.stop);
                continue;
              }
              case 8: {
                if (wireType !== 2)
                  break;
                message.tripModifications = $root.transit_realtime.TripModifications.decode(reader, reader.uint32(), void 0, _depth + 1, message.tripModifications);
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          if (!message.hasOwnProperty("id"))
            throw $util.ProtocolError("missing required 'id'", { instance: message });
          return message;
        }, "decode");
        FeedEntity.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        FeedEntity.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          if (!$util.isString(message.id))
            return "id: string expected";
          if (message.isDeleted != null && message.hasOwnProperty("isDeleted")) {
            if (typeof message.isDeleted !== "boolean")
              return "isDeleted: boolean expected";
          }
          if (message.tripUpdate != null && message.hasOwnProperty("tripUpdate")) {
            var error = $root.transit_realtime.TripUpdate.verify(message.tripUpdate, _depth + 1);
            if (error)
              return "tripUpdate." + error;
          }
          if (message.vehicle != null && message.hasOwnProperty("vehicle")) {
            var error = $root.transit_realtime.VehiclePosition.verify(message.vehicle, _depth + 1);
            if (error)
              return "vehicle." + error;
          }
          if (message.alert != null && message.hasOwnProperty("alert")) {
            var error = $root.transit_realtime.Alert.verify(message.alert, _depth + 1);
            if (error)
              return "alert." + error;
          }
          if (message.shape != null && message.hasOwnProperty("shape")) {
            var error = $root.transit_realtime.Shape.verify(message.shape, _depth + 1);
            if (error)
              return "shape." + error;
          }
          if (message.stop != null && message.hasOwnProperty("stop")) {
            var error = $root.transit_realtime.Stop.verify(message.stop, _depth + 1);
            if (error)
              return "stop." + error;
          }
          if (message.tripModifications != null && message.hasOwnProperty("tripModifications")) {
            var error = $root.transit_realtime.TripModifications.verify(message.tripModifications, _depth + 1);
            if (error)
              return "tripModifications." + error;
          }
          return null;
        }, "verify");
        FeedEntity.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.FeedEntity)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.FeedEntity();
          if (object.id != null)
            message.id = String(object.id);
          if (object.isDeleted != null)
            message.isDeleted = Boolean(object.isDeleted);
          if (object.tripUpdate != null) {
            if (typeof object.tripUpdate !== "object")
              throw TypeError(".transit_realtime.FeedEntity.tripUpdate: object expected");
            message.tripUpdate = $root.transit_realtime.TripUpdate.fromObject(object.tripUpdate, _depth + 1);
          }
          if (object.vehicle != null) {
            if (typeof object.vehicle !== "object")
              throw TypeError(".transit_realtime.FeedEntity.vehicle: object expected");
            message.vehicle = $root.transit_realtime.VehiclePosition.fromObject(object.vehicle, _depth + 1);
          }
          if (object.alert != null) {
            if (typeof object.alert !== "object")
              throw TypeError(".transit_realtime.FeedEntity.alert: object expected");
            message.alert = $root.transit_realtime.Alert.fromObject(object.alert, _depth + 1);
          }
          if (object.shape != null) {
            if (typeof object.shape !== "object")
              throw TypeError(".transit_realtime.FeedEntity.shape: object expected");
            message.shape = $root.transit_realtime.Shape.fromObject(object.shape, _depth + 1);
          }
          if (object.stop != null) {
            if (typeof object.stop !== "object")
              throw TypeError(".transit_realtime.FeedEntity.stop: object expected");
            message.stop = $root.transit_realtime.Stop.fromObject(object.stop, _depth + 1);
          }
          if (object.tripModifications != null) {
            if (typeof object.tripModifications !== "object")
              throw TypeError(".transit_realtime.FeedEntity.tripModifications: object expected");
            message.tripModifications = $root.transit_realtime.TripModifications.fromObject(object.tripModifications, _depth + 1);
          }
          return message;
        }, "fromObject");
        FeedEntity.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.defaults) {
            object.id = "";
            object.isDeleted = false;
            object.tripUpdate = null;
            object.vehicle = null;
            object.alert = null;
            object.shape = null;
            object.stop = null;
            object.tripModifications = null;
          }
          if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
          if (message.isDeleted != null && message.hasOwnProperty("isDeleted"))
            object.isDeleted = message.isDeleted;
          if (message.tripUpdate != null && message.hasOwnProperty("tripUpdate"))
            object.tripUpdate = $root.transit_realtime.TripUpdate.toObject(message.tripUpdate, options);
          if (message.vehicle != null && message.hasOwnProperty("vehicle"))
            object.vehicle = $root.transit_realtime.VehiclePosition.toObject(message.vehicle, options);
          if (message.alert != null && message.hasOwnProperty("alert"))
            object.alert = $root.transit_realtime.Alert.toObject(message.alert, options);
          if (message.shape != null && message.hasOwnProperty("shape"))
            object.shape = $root.transit_realtime.Shape.toObject(message.shape, options);
          if (message.stop != null && message.hasOwnProperty("stop"))
            object.stop = $root.transit_realtime.Stop.toObject(message.stop, options);
          if (message.tripModifications != null && message.hasOwnProperty("tripModifications"))
            object.tripModifications = $root.transit_realtime.TripModifications.toObject(message.tripModifications, options);
          return object;
        }, "toObject");
        FeedEntity.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        FeedEntity.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.FeedEntity";
        }, "getTypeUrl");
        return FeedEntity;
      })();
      transit_realtime2.TripUpdate = (function() {
        function TripUpdate(properties) {
          this.stopTimeUpdate = [];
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(TripUpdate, "TripUpdate");
        TripUpdate.prototype.trip = null;
        TripUpdate.prototype.vehicle = null;
        TripUpdate.prototype.stopTimeUpdate = $util.emptyArray;
        TripUpdate.prototype.timestamp = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;
        TripUpdate.prototype.delay = 0;
        TripUpdate.prototype.tripProperties = null;
        TripUpdate.create = /* @__PURE__ */ __name(function create(properties) {
          return new TripUpdate(properties);
        }, "create");
        TripUpdate.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          $root.transit_realtime.TripDescriptor.encode(message.trip, writer.uint32(
            /* id 1, wireType 2 =*/
            10
          ).fork()).ldelim();
          if (message.stopTimeUpdate != null && message.stopTimeUpdate.length)
            for (var i = 0; i < message.stopTimeUpdate.length; ++i)
              $root.transit_realtime.TripUpdate.StopTimeUpdate.encode(message.stopTimeUpdate[i], writer.uint32(
                /* id 2, wireType 2 =*/
                18
              ).fork()).ldelim();
          if (message.vehicle != null && Object.hasOwnProperty.call(message, "vehicle"))
            $root.transit_realtime.VehicleDescriptor.encode(message.vehicle, writer.uint32(
              /* id 3, wireType 2 =*/
              26
            ).fork()).ldelim();
          if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
            writer.uint32(
              /* id 4, wireType 0 =*/
              32
            ).uint64(message.timestamp);
          if (message.delay != null && Object.hasOwnProperty.call(message, "delay"))
            writer.uint32(
              /* id 5, wireType 0 =*/
              40
            ).int32(message.delay);
          if (message.tripProperties != null && Object.hasOwnProperty.call(message, "tripProperties"))
            $root.transit_realtime.TripUpdate.TripProperties.encode(message.tripProperties, writer.uint32(
              /* id 6, wireType 2 =*/
              50
            ).fork()).ldelim();
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        TripUpdate.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        TripUpdate.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.TripUpdate();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 2)
                  break;
                message.trip = $root.transit_realtime.TripDescriptor.decode(reader, reader.uint32(), void 0, _depth + 1, message.trip);
                continue;
              }
              case 3: {
                if (wireType !== 2)
                  break;
                message.vehicle = $root.transit_realtime.VehicleDescriptor.decode(reader, reader.uint32(), void 0, _depth + 1, message.vehicle);
                continue;
              }
              case 2: {
                if (wireType !== 2)
                  break;
                if (!(message.stopTimeUpdate && message.stopTimeUpdate.length))
                  message.stopTimeUpdate = [];
                message.stopTimeUpdate.push($root.transit_realtime.TripUpdate.StopTimeUpdate.decode(reader, reader.uint32(), void 0, _depth + 1));
                continue;
              }
              case 4: {
                if (wireType !== 0)
                  break;
                message.timestamp = reader.uint64();
                continue;
              }
              case 5: {
                if (wireType !== 0)
                  break;
                message.delay = reader.int32();
                continue;
              }
              case 6: {
                if (wireType !== 2)
                  break;
                message.tripProperties = $root.transit_realtime.TripUpdate.TripProperties.decode(reader, reader.uint32(), void 0, _depth + 1, message.tripProperties);
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          if (!message.hasOwnProperty("trip"))
            throw $util.ProtocolError("missing required 'trip'", { instance: message });
          return message;
        }, "decode");
        TripUpdate.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        TripUpdate.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          {
            var error = $root.transit_realtime.TripDescriptor.verify(message.trip, _depth + 1);
            if (error)
              return "trip." + error;
          }
          if (message.vehicle != null && message.hasOwnProperty("vehicle")) {
            var error = $root.transit_realtime.VehicleDescriptor.verify(message.vehicle, _depth + 1);
            if (error)
              return "vehicle." + error;
          }
          if (message.stopTimeUpdate != null && message.hasOwnProperty("stopTimeUpdate")) {
            if (!Array.isArray(message.stopTimeUpdate))
              return "stopTimeUpdate: array expected";
            for (var i = 0; i < message.stopTimeUpdate.length; ++i) {
              var error = $root.transit_realtime.TripUpdate.StopTimeUpdate.verify(message.stopTimeUpdate[i], _depth + 1);
              if (error)
                return "stopTimeUpdate." + error;
            }
          }
          if (message.timestamp != null && message.hasOwnProperty("timestamp")) {
            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
              return "timestamp: integer|Long expected";
          }
          if (message.delay != null && message.hasOwnProperty("delay")) {
            if (!$util.isInteger(message.delay))
              return "delay: integer expected";
          }
          if (message.tripProperties != null && message.hasOwnProperty("tripProperties")) {
            var error = $root.transit_realtime.TripUpdate.TripProperties.verify(message.tripProperties, _depth + 1);
            if (error)
              return "tripProperties." + error;
          }
          return null;
        }, "verify");
        TripUpdate.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.TripUpdate)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.TripUpdate();
          if (object.trip != null) {
            if (typeof object.trip !== "object")
              throw TypeError(".transit_realtime.TripUpdate.trip: object expected");
            message.trip = $root.transit_realtime.TripDescriptor.fromObject(object.trip, _depth + 1);
          }
          if (object.vehicle != null) {
            if (typeof object.vehicle !== "object")
              throw TypeError(".transit_realtime.TripUpdate.vehicle: object expected");
            message.vehicle = $root.transit_realtime.VehicleDescriptor.fromObject(object.vehicle, _depth + 1);
          }
          if (object.stopTimeUpdate) {
            if (!Array.isArray(object.stopTimeUpdate))
              throw TypeError(".transit_realtime.TripUpdate.stopTimeUpdate: array expected");
            message.stopTimeUpdate = Array(object.stopTimeUpdate.length);
            for (var i = 0; i < object.stopTimeUpdate.length; ++i) {
              if (typeof object.stopTimeUpdate[i] !== "object")
                throw TypeError(".transit_realtime.TripUpdate.stopTimeUpdate: object expected");
              message.stopTimeUpdate[i] = $root.transit_realtime.TripUpdate.StopTimeUpdate.fromObject(object.stopTimeUpdate[i], _depth + 1);
            }
          }
          if (object.timestamp != null) {
            if ($util.Long)
              (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
            else if (typeof object.timestamp === "string")
              message.timestamp = parseInt(object.timestamp, 10);
            else if (typeof object.timestamp === "number")
              message.timestamp = object.timestamp;
            else if (typeof object.timestamp === "object")
              message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
          }
          if (object.delay != null)
            message.delay = object.delay | 0;
          if (object.tripProperties != null) {
            if (typeof object.tripProperties !== "object")
              throw TypeError(".transit_realtime.TripUpdate.tripProperties: object expected");
            message.tripProperties = $root.transit_realtime.TripUpdate.TripProperties.fromObject(object.tripProperties, _depth + 1);
          }
          return message;
        }, "fromObject");
        TripUpdate.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.arrays || options.defaults)
            object.stopTimeUpdate = [];
          if (options.defaults) {
            object.trip = null;
            object.vehicle = null;
            if ($util.Long) {
              var long = new $util.Long(0, 0, true);
              object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
              object.timestamp = options.longs === String ? "0" : 0;
            object.delay = 0;
            object.tripProperties = null;
          }
          if (message.trip != null && message.hasOwnProperty("trip"))
            object.trip = $root.transit_realtime.TripDescriptor.toObject(message.trip, options);
          if (message.stopTimeUpdate && message.stopTimeUpdate.length) {
            object.stopTimeUpdate = Array(message.stopTimeUpdate.length);
            for (var j = 0; j < message.stopTimeUpdate.length; ++j)
              object.stopTimeUpdate[j] = $root.transit_realtime.TripUpdate.StopTimeUpdate.toObject(message.stopTimeUpdate[j], options);
          }
          if (message.vehicle != null && message.hasOwnProperty("vehicle"))
            object.vehicle = $root.transit_realtime.VehicleDescriptor.toObject(message.vehicle, options);
          if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (typeof message.timestamp === "number")
              object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
            else
              object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
          if (message.delay != null && message.hasOwnProperty("delay"))
            object.delay = message.delay;
          if (message.tripProperties != null && message.hasOwnProperty("tripProperties"))
            object.tripProperties = $root.transit_realtime.TripUpdate.TripProperties.toObject(message.tripProperties, options);
          return object;
        }, "toObject");
        TripUpdate.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        TripUpdate.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.TripUpdate";
        }, "getTypeUrl");
        TripUpdate.StopTimeEvent = (function() {
          function StopTimeEvent(properties) {
            if (properties) {
              for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                  this[keys[i]] = properties[keys[i]];
            }
          }
          __name(StopTimeEvent, "StopTimeEvent");
          StopTimeEvent.prototype.delay = 0;
          StopTimeEvent.prototype.time = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
          StopTimeEvent.prototype.uncertainty = 0;
          StopTimeEvent.prototype.scheduledTime = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
          StopTimeEvent.create = /* @__PURE__ */ __name(function create(properties) {
            return new StopTimeEvent(properties);
          }, "create");
          StopTimeEvent.encode = /* @__PURE__ */ __name(function encode(message, writer) {
            if (!writer)
              writer = $Writer.create();
            if (message.delay != null && Object.hasOwnProperty.call(message, "delay"))
              writer.uint32(
                /* id 1, wireType 0 =*/
                8
              ).int32(message.delay);
            if (message.time != null && Object.hasOwnProperty.call(message, "time"))
              writer.uint32(
                /* id 2, wireType 0 =*/
                16
              ).int64(message.time);
            if (message.uncertainty != null && Object.hasOwnProperty.call(message, "uncertainty"))
              writer.uint32(
                /* id 3, wireType 0 =*/
                24
              ).int32(message.uncertainty);
            if (message.scheduledTime != null && Object.hasOwnProperty.call(message, "scheduledTime"))
              writer.uint32(
                /* id 4, wireType 0 =*/
                32
              ).int64(message.scheduledTime);
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
              for (var i = 0; i < message.$unknowns.length; ++i)
                writer.raw(message.$unknowns[i]);
            return writer;
          }, "encode");
          StopTimeEvent.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
          }, "encodeDelimited");
          StopTimeEvent.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
              reader = $Reader.create(reader);
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $Reader.recursionLimit)
              throw Error("max depth exceeded");
            var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.TripUpdate.StopTimeEvent();
            while (reader.pos < end) {
              var start = reader.pos;
              var tag = reader.tag();
              if (tag === _end) {
                _end = void 0;
                break;
              }
              var wireType = tag & 7;
              switch (tag >>>= 3) {
                case 1: {
                  if (wireType !== 0)
                    break;
                  message.delay = reader.int32();
                  continue;
                }
                case 2: {
                  if (wireType !== 0)
                    break;
                  message.time = reader.int64();
                  continue;
                }
                case 3: {
                  if (wireType !== 0)
                    break;
                  message.uncertainty = reader.int32();
                  continue;
                }
                case 4: {
                  if (wireType !== 0)
                    break;
                  message.scheduledTime = reader.int64();
                  continue;
                }
              }
              reader.skipType(wireType, _depth, tag);
              $util.makeProp(message, "$unknowns", false);
              (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
            }
            if (_end !== void 0)
              throw Error("missing end group");
            return message;
          }, "decode");
          StopTimeEvent.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
              reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
          }, "decodeDelimited");
          StopTimeEvent.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
            if (typeof message !== "object" || message === null)
              return "object expected";
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              return "max depth exceeded";
            if (message.delay != null && message.hasOwnProperty("delay")) {
              if (!$util.isInteger(message.delay))
                return "delay: integer expected";
            }
            if (message.time != null && message.hasOwnProperty("time")) {
              if (!$util.isInteger(message.time) && !(message.time && $util.isInteger(message.time.low) && $util.isInteger(message.time.high)))
                return "time: integer|Long expected";
            }
            if (message.uncertainty != null && message.hasOwnProperty("uncertainty")) {
              if (!$util.isInteger(message.uncertainty))
                return "uncertainty: integer expected";
            }
            if (message.scheduledTime != null && message.hasOwnProperty("scheduledTime")) {
              if (!$util.isInteger(message.scheduledTime) && !(message.scheduledTime && $util.isInteger(message.scheduledTime.low) && $util.isInteger(message.scheduledTime.high)))
                return "scheduledTime: integer|Long expected";
            }
            return null;
          }, "verify");
          StopTimeEvent.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
            if (object instanceof $root.transit_realtime.TripUpdate.StopTimeEvent)
              return object;
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              throw Error("max depth exceeded");
            var message = new $root.transit_realtime.TripUpdate.StopTimeEvent();
            if (object.delay != null)
              message.delay = object.delay | 0;
            if (object.time != null) {
              if ($util.Long)
                (message.time = $util.Long.fromValue(object.time)).unsigned = false;
              else if (typeof object.time === "string")
                message.time = parseInt(object.time, 10);
              else if (typeof object.time === "number")
                message.time = object.time;
              else if (typeof object.time === "object")
                message.time = new $util.LongBits(object.time.low >>> 0, object.time.high >>> 0).toNumber();
            }
            if (object.uncertainty != null)
              message.uncertainty = object.uncertainty | 0;
            if (object.scheduledTime != null) {
              if ($util.Long)
                (message.scheduledTime = $util.Long.fromValue(object.scheduledTime)).unsigned = false;
              else if (typeof object.scheduledTime === "string")
                message.scheduledTime = parseInt(object.scheduledTime, 10);
              else if (typeof object.scheduledTime === "number")
                message.scheduledTime = object.scheduledTime;
              else if (typeof object.scheduledTime === "object")
                message.scheduledTime = new $util.LongBits(object.scheduledTime.low >>> 0, object.scheduledTime.high >>> 0).toNumber();
            }
            return message;
          }, "fromObject");
          StopTimeEvent.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
            if (!options)
              options = {};
            var object = {};
            if (options.defaults) {
              object.delay = 0;
              if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.time = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
              } else
                object.time = options.longs === String ? "0" : 0;
              object.uncertainty = 0;
              if ($util.Long) {
                var long = new $util.Long(0, 0, false);
                object.scheduledTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
              } else
                object.scheduledTime = options.longs === String ? "0" : 0;
            }
            if (message.delay != null && message.hasOwnProperty("delay"))
              object.delay = message.delay;
            if (message.time != null && message.hasOwnProperty("time"))
              if (typeof message.time === "number")
                object.time = options.longs === String ? String(message.time) : message.time;
              else
                object.time = options.longs === String ? $util.Long.prototype.toString.call(message.time) : options.longs === Number ? new $util.LongBits(message.time.low >>> 0, message.time.high >>> 0).toNumber() : message.time;
            if (message.uncertainty != null && message.hasOwnProperty("uncertainty"))
              object.uncertainty = message.uncertainty;
            if (message.scheduledTime != null && message.hasOwnProperty("scheduledTime"))
              if (typeof message.scheduledTime === "number")
                object.scheduledTime = options.longs === String ? String(message.scheduledTime) : message.scheduledTime;
              else
                object.scheduledTime = options.longs === String ? $util.Long.prototype.toString.call(message.scheduledTime) : options.longs === Number ? new $util.LongBits(message.scheduledTime.low >>> 0, message.scheduledTime.high >>> 0).toNumber() : message.scheduledTime;
            return object;
          }, "toObject");
          StopTimeEvent.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
          }, "toJSON");
          StopTimeEvent.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
            if (prefix === void 0)
              prefix = "type.googleapis.com";
            return prefix + "/transit_realtime.TripUpdate.StopTimeEvent";
          }, "getTypeUrl");
          return StopTimeEvent;
        })();
        TripUpdate.StopTimeUpdate = (function() {
          function StopTimeUpdate(properties) {
            if (properties) {
              for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                  this[keys[i]] = properties[keys[i]];
            }
          }
          __name(StopTimeUpdate, "StopTimeUpdate");
          StopTimeUpdate.prototype.stopSequence = 0;
          StopTimeUpdate.prototype.stopId = "";
          StopTimeUpdate.prototype.arrival = null;
          StopTimeUpdate.prototype.departure = null;
          StopTimeUpdate.prototype.departureOccupancyStatus = 0;
          StopTimeUpdate.prototype.scheduleRelationship = 0;
          StopTimeUpdate.prototype.stopTimeProperties = null;
          StopTimeUpdate.create = /* @__PURE__ */ __name(function create(properties) {
            return new StopTimeUpdate(properties);
          }, "create");
          StopTimeUpdate.encode = /* @__PURE__ */ __name(function encode(message, writer) {
            if (!writer)
              writer = $Writer.create();
            if (message.stopSequence != null && Object.hasOwnProperty.call(message, "stopSequence"))
              writer.uint32(
                /* id 1, wireType 0 =*/
                8
              ).uint32(message.stopSequence);
            if (message.arrival != null && Object.hasOwnProperty.call(message, "arrival"))
              $root.transit_realtime.TripUpdate.StopTimeEvent.encode(message.arrival, writer.uint32(
                /* id 2, wireType 2 =*/
                18
              ).fork()).ldelim();
            if (message.departure != null && Object.hasOwnProperty.call(message, "departure"))
              $root.transit_realtime.TripUpdate.StopTimeEvent.encode(message.departure, writer.uint32(
                /* id 3, wireType 2 =*/
                26
              ).fork()).ldelim();
            if (message.stopId != null && Object.hasOwnProperty.call(message, "stopId"))
              writer.uint32(
                /* id 4, wireType 2 =*/
                34
              ).string(message.stopId);
            if (message.scheduleRelationship != null && Object.hasOwnProperty.call(message, "scheduleRelationship"))
              writer.uint32(
                /* id 5, wireType 0 =*/
                40
              ).int32(message.scheduleRelationship);
            if (message.stopTimeProperties != null && Object.hasOwnProperty.call(message, "stopTimeProperties"))
              $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.encode(message.stopTimeProperties, writer.uint32(
                /* id 6, wireType 2 =*/
                50
              ).fork()).ldelim();
            if (message.departureOccupancyStatus != null && Object.hasOwnProperty.call(message, "departureOccupancyStatus"))
              writer.uint32(
                /* id 7, wireType 0 =*/
                56
              ).int32(message.departureOccupancyStatus);
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
              for (var i = 0; i < message.$unknowns.length; ++i)
                writer.raw(message.$unknowns[i]);
            return writer;
          }, "encode");
          StopTimeUpdate.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
          }, "encodeDelimited");
          StopTimeUpdate.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
              reader = $Reader.create(reader);
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $Reader.recursionLimit)
              throw Error("max depth exceeded");
            var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.TripUpdate.StopTimeUpdate();
            while (reader.pos < end) {
              var start = reader.pos;
              var tag = reader.tag();
              if (tag === _end) {
                _end = void 0;
                break;
              }
              var wireType = tag & 7;
              switch (tag >>>= 3) {
                case 1: {
                  if (wireType !== 0)
                    break;
                  message.stopSequence = reader.uint32();
                  continue;
                }
                case 4: {
                  if (wireType !== 2)
                    break;
                  message.stopId = reader.string();
                  continue;
                }
                case 2: {
                  if (wireType !== 2)
                    break;
                  message.arrival = $root.transit_realtime.TripUpdate.StopTimeEvent.decode(reader, reader.uint32(), void 0, _depth + 1, message.arrival);
                  continue;
                }
                case 3: {
                  if (wireType !== 2)
                    break;
                  message.departure = $root.transit_realtime.TripUpdate.StopTimeEvent.decode(reader, reader.uint32(), void 0, _depth + 1, message.departure);
                  continue;
                }
                case 7: {
                  if (wireType !== 0)
                    break;
                  message.departureOccupancyStatus = reader.int32();
                  continue;
                }
                case 5: {
                  if (wireType !== 0)
                    break;
                  message.scheduleRelationship = reader.int32();
                  continue;
                }
                case 6: {
                  if (wireType !== 2)
                    break;
                  message.stopTimeProperties = $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.decode(reader, reader.uint32(), void 0, _depth + 1, message.stopTimeProperties);
                  continue;
                }
              }
              reader.skipType(wireType, _depth, tag);
              $util.makeProp(message, "$unknowns", false);
              (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
            }
            if (_end !== void 0)
              throw Error("missing end group");
            return message;
          }, "decode");
          StopTimeUpdate.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
              reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
          }, "decodeDelimited");
          StopTimeUpdate.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
            if (typeof message !== "object" || message === null)
              return "object expected";
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              return "max depth exceeded";
            if (message.stopSequence != null && message.hasOwnProperty("stopSequence")) {
              if (!$util.isInteger(message.stopSequence))
                return "stopSequence: integer expected";
            }
            if (message.stopId != null && message.hasOwnProperty("stopId")) {
              if (!$util.isString(message.stopId))
                return "stopId: string expected";
            }
            if (message.arrival != null && message.hasOwnProperty("arrival")) {
              var error = $root.transit_realtime.TripUpdate.StopTimeEvent.verify(message.arrival, _depth + 1);
              if (error)
                return "arrival." + error;
            }
            if (message.departure != null && message.hasOwnProperty("departure")) {
              var error = $root.transit_realtime.TripUpdate.StopTimeEvent.verify(message.departure, _depth + 1);
              if (error)
                return "departure." + error;
            }
            if (message.departureOccupancyStatus != null && message.hasOwnProperty("departureOccupancyStatus"))
              switch (message.departureOccupancyStatus) {
                default:
                  return "departureOccupancyStatus: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                  break;
              }
            if (message.scheduleRelationship != null && message.hasOwnProperty("scheduleRelationship"))
              switch (message.scheduleRelationship) {
                default:
                  return "scheduleRelationship: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                  break;
              }
            if (message.stopTimeProperties != null && message.hasOwnProperty("stopTimeProperties")) {
              var error = $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.verify(message.stopTimeProperties, _depth + 1);
              if (error)
                return "stopTimeProperties." + error;
            }
            return null;
          }, "verify");
          StopTimeUpdate.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
            if (object instanceof $root.transit_realtime.TripUpdate.StopTimeUpdate)
              return object;
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              throw Error("max depth exceeded");
            var message = new $root.transit_realtime.TripUpdate.StopTimeUpdate();
            if (object.stopSequence != null)
              message.stopSequence = object.stopSequence >>> 0;
            if (object.stopId != null)
              message.stopId = String(object.stopId);
            if (object.arrival != null) {
              if (typeof object.arrival !== "object")
                throw TypeError(".transit_realtime.TripUpdate.StopTimeUpdate.arrival: object expected");
              message.arrival = $root.transit_realtime.TripUpdate.StopTimeEvent.fromObject(object.arrival, _depth + 1);
            }
            if (object.departure != null) {
              if (typeof object.departure !== "object")
                throw TypeError(".transit_realtime.TripUpdate.StopTimeUpdate.departure: object expected");
              message.departure = $root.transit_realtime.TripUpdate.StopTimeEvent.fromObject(object.departure, _depth + 1);
            }
            switch (object.departureOccupancyStatus) {
              default:
                if (typeof object.departureOccupancyStatus === "number") {
                  message.departureOccupancyStatus = object.departureOccupancyStatus;
                  break;
                }
                break;
              case "EMPTY":
              case 0:
                message.departureOccupancyStatus = 0;
                break;
              case "MANY_SEATS_AVAILABLE":
              case 1:
                message.departureOccupancyStatus = 1;
                break;
              case "FEW_SEATS_AVAILABLE":
              case 2:
                message.departureOccupancyStatus = 2;
                break;
              case "STANDING_ROOM_ONLY":
              case 3:
                message.departureOccupancyStatus = 3;
                break;
              case "CRUSHED_STANDING_ROOM_ONLY":
              case 4:
                message.departureOccupancyStatus = 4;
                break;
              case "FULL":
              case 5:
                message.departureOccupancyStatus = 5;
                break;
              case "NOT_ACCEPTING_PASSENGERS":
              case 6:
                message.departureOccupancyStatus = 6;
                break;
              case "NO_DATA_AVAILABLE":
              case 7:
                message.departureOccupancyStatus = 7;
                break;
              case "NOT_BOARDABLE":
              case 8:
                message.departureOccupancyStatus = 8;
                break;
            }
            switch (object.scheduleRelationship) {
              default:
                if (typeof object.scheduleRelationship === "number") {
                  message.scheduleRelationship = object.scheduleRelationship;
                  break;
                }
                break;
              case "SCHEDULED":
              case 0:
                message.scheduleRelationship = 0;
                break;
              case "SKIPPED":
              case 1:
                message.scheduleRelationship = 1;
                break;
              case "NO_DATA":
              case 2:
                message.scheduleRelationship = 2;
                break;
              case "UNSCHEDULED":
              case 3:
                message.scheduleRelationship = 3;
                break;
            }
            if (object.stopTimeProperties != null) {
              if (typeof object.stopTimeProperties !== "object")
                throw TypeError(".transit_realtime.TripUpdate.StopTimeUpdate.stopTimeProperties: object expected");
              message.stopTimeProperties = $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.fromObject(object.stopTimeProperties, _depth + 1);
            }
            return message;
          }, "fromObject");
          StopTimeUpdate.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
            if (!options)
              options = {};
            var object = {};
            if (options.defaults) {
              object.stopSequence = 0;
              object.arrival = null;
              object.departure = null;
              object.stopId = "";
              object.scheduleRelationship = options.enums === String ? "SCHEDULED" : 0;
              object.stopTimeProperties = null;
              object.departureOccupancyStatus = options.enums === String ? "EMPTY" : 0;
            }
            if (message.stopSequence != null && message.hasOwnProperty("stopSequence"))
              object.stopSequence = message.stopSequence;
            if (message.arrival != null && message.hasOwnProperty("arrival"))
              object.arrival = $root.transit_realtime.TripUpdate.StopTimeEvent.toObject(message.arrival, options);
            if (message.departure != null && message.hasOwnProperty("departure"))
              object.departure = $root.transit_realtime.TripUpdate.StopTimeEvent.toObject(message.departure, options);
            if (message.stopId != null && message.hasOwnProperty("stopId"))
              object.stopId = message.stopId;
            if (message.scheduleRelationship != null && message.hasOwnProperty("scheduleRelationship"))
              object.scheduleRelationship = options.enums === String ? $root.transit_realtime.TripUpdate.StopTimeUpdate.ScheduleRelationship[message.scheduleRelationship] === void 0 ? message.scheduleRelationship : $root.transit_realtime.TripUpdate.StopTimeUpdate.ScheduleRelationship[message.scheduleRelationship] : message.scheduleRelationship;
            if (message.stopTimeProperties != null && message.hasOwnProperty("stopTimeProperties"))
              object.stopTimeProperties = $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.toObject(message.stopTimeProperties, options);
            if (message.departureOccupancyStatus != null && message.hasOwnProperty("departureOccupancyStatus"))
              object.departureOccupancyStatus = options.enums === String ? $root.transit_realtime.VehiclePosition.OccupancyStatus[message.departureOccupancyStatus] === void 0 ? message.departureOccupancyStatus : $root.transit_realtime.VehiclePosition.OccupancyStatus[message.departureOccupancyStatus] : message.departureOccupancyStatus;
            return object;
          }, "toObject");
          StopTimeUpdate.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
          }, "toJSON");
          StopTimeUpdate.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
            if (prefix === void 0)
              prefix = "type.googleapis.com";
            return prefix + "/transit_realtime.TripUpdate.StopTimeUpdate";
          }, "getTypeUrl");
          StopTimeUpdate.ScheduleRelationship = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SCHEDULED"] = 0;
            values[valuesById[1] = "SKIPPED"] = 1;
            values[valuesById[2] = "NO_DATA"] = 2;
            values[valuesById[3] = "UNSCHEDULED"] = 3;
            return values;
          })();
          StopTimeUpdate.StopTimeProperties = (function() {
            function StopTimeProperties(properties) {
              if (properties) {
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                  if (properties[keys[i]] != null && keys[i] !== "__proto__")
                    this[keys[i]] = properties[keys[i]];
              }
            }
            __name(StopTimeProperties, "StopTimeProperties");
            StopTimeProperties.prototype.assignedStopId = "";
            StopTimeProperties.prototype.stopHeadsign = "";
            StopTimeProperties.prototype.pickupType = 0;
            StopTimeProperties.prototype.dropOffType = 0;
            StopTimeProperties.create = /* @__PURE__ */ __name(function create(properties) {
              return new StopTimeProperties(properties);
            }, "create");
            StopTimeProperties.encode = /* @__PURE__ */ __name(function encode(message, writer) {
              if (!writer)
                writer = $Writer.create();
              if (message.assignedStopId != null && Object.hasOwnProperty.call(message, "assignedStopId"))
                writer.uint32(
                  /* id 1, wireType 2 =*/
                  10
                ).string(message.assignedStopId);
              if (message.stopHeadsign != null && Object.hasOwnProperty.call(message, "stopHeadsign"))
                writer.uint32(
                  /* id 2, wireType 2 =*/
                  18
                ).string(message.stopHeadsign);
              if (message.pickupType != null && Object.hasOwnProperty.call(message, "pickupType"))
                writer.uint32(
                  /* id 3, wireType 0 =*/
                  24
                ).int32(message.pickupType);
              if (message.dropOffType != null && Object.hasOwnProperty.call(message, "dropOffType"))
                writer.uint32(
                  /* id 4, wireType 0 =*/
                  32
                ).int32(message.dropOffType);
              if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
                for (var i = 0; i < message.$unknowns.length; ++i)
                  writer.raw(message.$unknowns[i]);
              return writer;
            }, "encode");
            StopTimeProperties.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
              return this.encode(message, writer).ldelim();
            }, "encodeDelimited");
            StopTimeProperties.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
              if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
              if (_depth === void 0)
                _depth = 0;
              if (_depth > $Reader.recursionLimit)
                throw Error("max depth exceeded");
              var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties();
              while (reader.pos < end) {
                var start = reader.pos;
                var tag = reader.tag();
                if (tag === _end) {
                  _end = void 0;
                  break;
                }
                var wireType = tag & 7;
                switch (tag >>>= 3) {
                  case 1: {
                    if (wireType !== 2)
                      break;
                    message.assignedStopId = reader.string();
                    continue;
                  }
                  case 2: {
                    if (wireType !== 2)
                      break;
                    message.stopHeadsign = reader.string();
                    continue;
                  }
                  case 3: {
                    if (wireType !== 0)
                      break;
                    message.pickupType = reader.int32();
                    continue;
                  }
                  case 4: {
                    if (wireType !== 0)
                      break;
                    message.dropOffType = reader.int32();
                    continue;
                  }
                }
                reader.skipType(wireType, _depth, tag);
                $util.makeProp(message, "$unknowns", false);
                (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
              }
              if (_end !== void 0)
                throw Error("missing end group");
              return message;
            }, "decode");
            StopTimeProperties.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
              if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
              return this.decode(reader, reader.uint32());
            }, "decodeDelimited");
            StopTimeProperties.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
              if (typeof message !== "object" || message === null)
                return "object expected";
              if (_depth === void 0)
                _depth = 0;
              if (_depth > $util.recursionLimit)
                return "max depth exceeded";
              if (message.assignedStopId != null && message.hasOwnProperty("assignedStopId")) {
                if (!$util.isString(message.assignedStopId))
                  return "assignedStopId: string expected";
              }
              if (message.stopHeadsign != null && message.hasOwnProperty("stopHeadsign")) {
                if (!$util.isString(message.stopHeadsign))
                  return "stopHeadsign: string expected";
              }
              if (message.pickupType != null && message.hasOwnProperty("pickupType"))
                switch (message.pickupType) {
                  default:
                    return "pickupType: enum value expected";
                  case 0:
                  case 1:
                  case 2:
                  case 3:
                    break;
                }
              if (message.dropOffType != null && message.hasOwnProperty("dropOffType"))
                switch (message.dropOffType) {
                  default:
                    return "dropOffType: enum value expected";
                  case 0:
                  case 1:
                  case 2:
                  case 3:
                    break;
                }
              return null;
            }, "verify");
            StopTimeProperties.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
              if (object instanceof $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties)
                return object;
              if (_depth === void 0)
                _depth = 0;
              if (_depth > $util.recursionLimit)
                throw Error("max depth exceeded");
              var message = new $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties();
              if (object.assignedStopId != null)
                message.assignedStopId = String(object.assignedStopId);
              if (object.stopHeadsign != null)
                message.stopHeadsign = String(object.stopHeadsign);
              switch (object.pickupType) {
                default:
                  if (typeof object.pickupType === "number") {
                    message.pickupType = object.pickupType;
                    break;
                  }
                  break;
                case "REGULAR":
                case 0:
                  message.pickupType = 0;
                  break;
                case "NONE":
                case 1:
                  message.pickupType = 1;
                  break;
                case "PHONE_AGENCY":
                case 2:
                  message.pickupType = 2;
                  break;
                case "COORDINATE_WITH_DRIVER":
                case 3:
                  message.pickupType = 3;
                  break;
              }
              switch (object.dropOffType) {
                default:
                  if (typeof object.dropOffType === "number") {
                    message.dropOffType = object.dropOffType;
                    break;
                  }
                  break;
                case "REGULAR":
                case 0:
                  message.dropOffType = 0;
                  break;
                case "NONE":
                case 1:
                  message.dropOffType = 1;
                  break;
                case "PHONE_AGENCY":
                case 2:
                  message.dropOffType = 2;
                  break;
                case "COORDINATE_WITH_DRIVER":
                case 3:
                  message.dropOffType = 3;
                  break;
              }
              return message;
            }, "fromObject");
            StopTimeProperties.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
              if (!options)
                options = {};
              var object = {};
              if (options.defaults) {
                object.assignedStopId = "";
                object.stopHeadsign = "";
                object.pickupType = options.enums === String ? "REGULAR" : 0;
                object.dropOffType = options.enums === String ? "REGULAR" : 0;
              }
              if (message.assignedStopId != null && message.hasOwnProperty("assignedStopId"))
                object.assignedStopId = message.assignedStopId;
              if (message.stopHeadsign != null && message.hasOwnProperty("stopHeadsign"))
                object.stopHeadsign = message.stopHeadsign;
              if (message.pickupType != null && message.hasOwnProperty("pickupType"))
                object.pickupType = options.enums === String ? $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.DropOffPickupType[message.pickupType] === void 0 ? message.pickupType : $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.DropOffPickupType[message.pickupType] : message.pickupType;
              if (message.dropOffType != null && message.hasOwnProperty("dropOffType"))
                object.dropOffType = options.enums === String ? $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.DropOffPickupType[message.dropOffType] === void 0 ? message.dropOffType : $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.DropOffPickupType[message.dropOffType] : message.dropOffType;
              return object;
            }, "toObject");
            StopTimeProperties.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
              return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            }, "toJSON");
            StopTimeProperties.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
              if (prefix === void 0)
                prefix = "type.googleapis.com";
              return prefix + "/transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties";
            }, "getTypeUrl");
            StopTimeProperties.DropOffPickupType = (function() {
              var valuesById = {}, values = Object.create(valuesById);
              values[valuesById[0] = "REGULAR"] = 0;
              values[valuesById[1] = "NONE"] = 1;
              values[valuesById[2] = "PHONE_AGENCY"] = 2;
              values[valuesById[3] = "COORDINATE_WITH_DRIVER"] = 3;
              return values;
            })();
            return StopTimeProperties;
          })();
          return StopTimeUpdate;
        })();
        TripUpdate.TripProperties = (function() {
          function TripProperties(properties) {
            if (properties) {
              for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                  this[keys[i]] = properties[keys[i]];
            }
          }
          __name(TripProperties, "TripProperties");
          TripProperties.prototype.tripId = "";
          TripProperties.prototype.startDate = "";
          TripProperties.prototype.startTime = "";
          TripProperties.prototype.shapeId = "";
          TripProperties.prototype.tripHeadsign = "";
          TripProperties.prototype.tripShortName = "";
          TripProperties.create = /* @__PURE__ */ __name(function create(properties) {
            return new TripProperties(properties);
          }, "create");
          TripProperties.encode = /* @__PURE__ */ __name(function encode(message, writer) {
            if (!writer)
              writer = $Writer.create();
            if (message.tripId != null && Object.hasOwnProperty.call(message, "tripId"))
              writer.uint32(
                /* id 1, wireType 2 =*/
                10
              ).string(message.tripId);
            if (message.startDate != null && Object.hasOwnProperty.call(message, "startDate"))
              writer.uint32(
                /* id 2, wireType 2 =*/
                18
              ).string(message.startDate);
            if (message.startTime != null && Object.hasOwnProperty.call(message, "startTime"))
              writer.uint32(
                /* id 3, wireType 2 =*/
                26
              ).string(message.startTime);
            if (message.shapeId != null && Object.hasOwnProperty.call(message, "shapeId"))
              writer.uint32(
                /* id 4, wireType 2 =*/
                34
              ).string(message.shapeId);
            if (message.tripHeadsign != null && Object.hasOwnProperty.call(message, "tripHeadsign"))
              writer.uint32(
                /* id 5, wireType 2 =*/
                42
              ).string(message.tripHeadsign);
            if (message.tripShortName != null && Object.hasOwnProperty.call(message, "tripShortName"))
              writer.uint32(
                /* id 6, wireType 2 =*/
                50
              ).string(message.tripShortName);
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
              for (var i = 0; i < message.$unknowns.length; ++i)
                writer.raw(message.$unknowns[i]);
            return writer;
          }, "encode");
          TripProperties.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
          }, "encodeDelimited");
          TripProperties.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
              reader = $Reader.create(reader);
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $Reader.recursionLimit)
              throw Error("max depth exceeded");
            var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.TripUpdate.TripProperties();
            while (reader.pos < end) {
              var start = reader.pos;
              var tag = reader.tag();
              if (tag === _end) {
                _end = void 0;
                break;
              }
              var wireType = tag & 7;
              switch (tag >>>= 3) {
                case 1: {
                  if (wireType !== 2)
                    break;
                  message.tripId = reader.string();
                  continue;
                }
                case 2: {
                  if (wireType !== 2)
                    break;
                  message.startDate = reader.string();
                  continue;
                }
                case 3: {
                  if (wireType !== 2)
                    break;
                  message.startTime = reader.string();
                  continue;
                }
                case 4: {
                  if (wireType !== 2)
                    break;
                  message.shapeId = reader.string();
                  continue;
                }
                case 5: {
                  if (wireType !== 2)
                    break;
                  message.tripHeadsign = reader.string();
                  continue;
                }
                case 6: {
                  if (wireType !== 2)
                    break;
                  message.tripShortName = reader.string();
                  continue;
                }
              }
              reader.skipType(wireType, _depth, tag);
              $util.makeProp(message, "$unknowns", false);
              (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
            }
            if (_end !== void 0)
              throw Error("missing end group");
            return message;
          }, "decode");
          TripProperties.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
              reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
          }, "decodeDelimited");
          TripProperties.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
            if (typeof message !== "object" || message === null)
              return "object expected";
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              return "max depth exceeded";
            if (message.tripId != null && message.hasOwnProperty("tripId")) {
              if (!$util.isString(message.tripId))
                return "tripId: string expected";
            }
            if (message.startDate != null && message.hasOwnProperty("startDate")) {
              if (!$util.isString(message.startDate))
                return "startDate: string expected";
            }
            if (message.startTime != null && message.hasOwnProperty("startTime")) {
              if (!$util.isString(message.startTime))
                return "startTime: string expected";
            }
            if (message.shapeId != null && message.hasOwnProperty("shapeId")) {
              if (!$util.isString(message.shapeId))
                return "shapeId: string expected";
            }
            if (message.tripHeadsign != null && message.hasOwnProperty("tripHeadsign")) {
              if (!$util.isString(message.tripHeadsign))
                return "tripHeadsign: string expected";
            }
            if (message.tripShortName != null && message.hasOwnProperty("tripShortName")) {
              if (!$util.isString(message.tripShortName))
                return "tripShortName: string expected";
            }
            return null;
          }, "verify");
          TripProperties.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
            if (object instanceof $root.transit_realtime.TripUpdate.TripProperties)
              return object;
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              throw Error("max depth exceeded");
            var message = new $root.transit_realtime.TripUpdate.TripProperties();
            if (object.tripId != null)
              message.tripId = String(object.tripId);
            if (object.startDate != null)
              message.startDate = String(object.startDate);
            if (object.startTime != null)
              message.startTime = String(object.startTime);
            if (object.shapeId != null)
              message.shapeId = String(object.shapeId);
            if (object.tripHeadsign != null)
              message.tripHeadsign = String(object.tripHeadsign);
            if (object.tripShortName != null)
              message.tripShortName = String(object.tripShortName);
            return message;
          }, "fromObject");
          TripProperties.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
            if (!options)
              options = {};
            var object = {};
            if (options.defaults) {
              object.tripId = "";
              object.startDate = "";
              object.startTime = "";
              object.shapeId = "";
              object.tripHeadsign = "";
              object.tripShortName = "";
            }
            if (message.tripId != null && message.hasOwnProperty("tripId"))
              object.tripId = message.tripId;
            if (message.startDate != null && message.hasOwnProperty("startDate"))
              object.startDate = message.startDate;
            if (message.startTime != null && message.hasOwnProperty("startTime"))
              object.startTime = message.startTime;
            if (message.shapeId != null && message.hasOwnProperty("shapeId"))
              object.shapeId = message.shapeId;
            if (message.tripHeadsign != null && message.hasOwnProperty("tripHeadsign"))
              object.tripHeadsign = message.tripHeadsign;
            if (message.tripShortName != null && message.hasOwnProperty("tripShortName"))
              object.tripShortName = message.tripShortName;
            return object;
          }, "toObject");
          TripProperties.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
          }, "toJSON");
          TripProperties.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
            if (prefix === void 0)
              prefix = "type.googleapis.com";
            return prefix + "/transit_realtime.TripUpdate.TripProperties";
          }, "getTypeUrl");
          return TripProperties;
        })();
        return TripUpdate;
      })();
      transit_realtime2.VehiclePosition = (function() {
        function VehiclePosition(properties) {
          this.multiCarriageDetails = [];
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(VehiclePosition, "VehiclePosition");
        VehiclePosition.prototype.trip = null;
        VehiclePosition.prototype.vehicle = null;
        VehiclePosition.prototype.position = null;
        VehiclePosition.prototype.currentStopSequence = 0;
        VehiclePosition.prototype.stopId = "";
        VehiclePosition.prototype.currentStatus = 2;
        VehiclePosition.prototype.timestamp = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;
        VehiclePosition.prototype.congestionLevel = 0;
        VehiclePosition.prototype.occupancyStatus = 0;
        VehiclePosition.prototype.occupancyPercentage = 0;
        VehiclePosition.prototype.multiCarriageDetails = $util.emptyArray;
        VehiclePosition.create = /* @__PURE__ */ __name(function create(properties) {
          return new VehiclePosition(properties);
        }, "create");
        VehiclePosition.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.trip != null && Object.hasOwnProperty.call(message, "trip"))
            $root.transit_realtime.TripDescriptor.encode(message.trip, writer.uint32(
              /* id 1, wireType 2 =*/
              10
            ).fork()).ldelim();
          if (message.position != null && Object.hasOwnProperty.call(message, "position"))
            $root.transit_realtime.Position.encode(message.position, writer.uint32(
              /* id 2, wireType 2 =*/
              18
            ).fork()).ldelim();
          if (message.currentStopSequence != null && Object.hasOwnProperty.call(message, "currentStopSequence"))
            writer.uint32(
              /* id 3, wireType 0 =*/
              24
            ).uint32(message.currentStopSequence);
          if (message.currentStatus != null && Object.hasOwnProperty.call(message, "currentStatus"))
            writer.uint32(
              /* id 4, wireType 0 =*/
              32
            ).int32(message.currentStatus);
          if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
            writer.uint32(
              /* id 5, wireType 0 =*/
              40
            ).uint64(message.timestamp);
          if (message.congestionLevel != null && Object.hasOwnProperty.call(message, "congestionLevel"))
            writer.uint32(
              /* id 6, wireType 0 =*/
              48
            ).int32(message.congestionLevel);
          if (message.stopId != null && Object.hasOwnProperty.call(message, "stopId"))
            writer.uint32(
              /* id 7, wireType 2 =*/
              58
            ).string(message.stopId);
          if (message.vehicle != null && Object.hasOwnProperty.call(message, "vehicle"))
            $root.transit_realtime.VehicleDescriptor.encode(message.vehicle, writer.uint32(
              /* id 8, wireType 2 =*/
              66
            ).fork()).ldelim();
          if (message.occupancyStatus != null && Object.hasOwnProperty.call(message, "occupancyStatus"))
            writer.uint32(
              /* id 9, wireType 0 =*/
              72
            ).int32(message.occupancyStatus);
          if (message.occupancyPercentage != null && Object.hasOwnProperty.call(message, "occupancyPercentage"))
            writer.uint32(
              /* id 10, wireType 0 =*/
              80
            ).uint32(message.occupancyPercentage);
          if (message.multiCarriageDetails != null && message.multiCarriageDetails.length)
            for (var i = 0; i < message.multiCarriageDetails.length; ++i)
              $root.transit_realtime.VehiclePosition.CarriageDetails.encode(message.multiCarriageDetails[i], writer.uint32(
                /* id 11, wireType 2 =*/
                90
              ).fork()).ldelim();
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        VehiclePosition.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        VehiclePosition.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.VehiclePosition();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 2)
                  break;
                message.trip = $root.transit_realtime.TripDescriptor.decode(reader, reader.uint32(), void 0, _depth + 1, message.trip);
                continue;
              }
              case 8: {
                if (wireType !== 2)
                  break;
                message.vehicle = $root.transit_realtime.VehicleDescriptor.decode(reader, reader.uint32(), void 0, _depth + 1, message.vehicle);
                continue;
              }
              case 2: {
                if (wireType !== 2)
                  break;
                message.position = $root.transit_realtime.Position.decode(reader, reader.uint32(), void 0, _depth + 1, message.position);
                continue;
              }
              case 3: {
                if (wireType !== 0)
                  break;
                message.currentStopSequence = reader.uint32();
                continue;
              }
              case 7: {
                if (wireType !== 2)
                  break;
                message.stopId = reader.string();
                continue;
              }
              case 4: {
                if (wireType !== 0)
                  break;
                message.currentStatus = reader.int32();
                continue;
              }
              case 5: {
                if (wireType !== 0)
                  break;
                message.timestamp = reader.uint64();
                continue;
              }
              case 6: {
                if (wireType !== 0)
                  break;
                message.congestionLevel = reader.int32();
                continue;
              }
              case 9: {
                if (wireType !== 0)
                  break;
                message.occupancyStatus = reader.int32();
                continue;
              }
              case 10: {
                if (wireType !== 0)
                  break;
                message.occupancyPercentage = reader.uint32();
                continue;
              }
              case 11: {
                if (wireType !== 2)
                  break;
                if (!(message.multiCarriageDetails && message.multiCarriageDetails.length))
                  message.multiCarriageDetails = [];
                message.multiCarriageDetails.push($root.transit_realtime.VehiclePosition.CarriageDetails.decode(reader, reader.uint32(), void 0, _depth + 1));
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          return message;
        }, "decode");
        VehiclePosition.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        VehiclePosition.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          if (message.trip != null && message.hasOwnProperty("trip")) {
            var error = $root.transit_realtime.TripDescriptor.verify(message.trip, _depth + 1);
            if (error)
              return "trip." + error;
          }
          if (message.vehicle != null && message.hasOwnProperty("vehicle")) {
            var error = $root.transit_realtime.VehicleDescriptor.verify(message.vehicle, _depth + 1);
            if (error)
              return "vehicle." + error;
          }
          if (message.position != null && message.hasOwnProperty("position")) {
            var error = $root.transit_realtime.Position.verify(message.position, _depth + 1);
            if (error)
              return "position." + error;
          }
          if (message.currentStopSequence != null && message.hasOwnProperty("currentStopSequence")) {
            if (!$util.isInteger(message.currentStopSequence))
              return "currentStopSequence: integer expected";
          }
          if (message.stopId != null && message.hasOwnProperty("stopId")) {
            if (!$util.isString(message.stopId))
              return "stopId: string expected";
          }
          if (message.currentStatus != null && message.hasOwnProperty("currentStatus"))
            switch (message.currentStatus) {
              default:
                return "currentStatus: enum value expected";
              case 0:
              case 1:
              case 2:
                break;
            }
          if (message.timestamp != null && message.hasOwnProperty("timestamp")) {
            if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
              return "timestamp: integer|Long expected";
          }
          if (message.congestionLevel != null && message.hasOwnProperty("congestionLevel"))
            switch (message.congestionLevel) {
              default:
                return "congestionLevel: enum value expected";
              case 0:
              case 1:
              case 2:
              case 3:
              case 4:
                break;
            }
          if (message.occupancyStatus != null && message.hasOwnProperty("occupancyStatus"))
            switch (message.occupancyStatus) {
              default:
                return "occupancyStatus: enum value expected";
              case 0:
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
              case 6:
              case 7:
              case 8:
                break;
            }
          if (message.occupancyPercentage != null && message.hasOwnProperty("occupancyPercentage")) {
            if (!$util.isInteger(message.occupancyPercentage))
              return "occupancyPercentage: integer expected";
          }
          if (message.multiCarriageDetails != null && message.hasOwnProperty("multiCarriageDetails")) {
            if (!Array.isArray(message.multiCarriageDetails))
              return "multiCarriageDetails: array expected";
            for (var i = 0; i < message.multiCarriageDetails.length; ++i) {
              var error = $root.transit_realtime.VehiclePosition.CarriageDetails.verify(message.multiCarriageDetails[i], _depth + 1);
              if (error)
                return "multiCarriageDetails." + error;
            }
          }
          return null;
        }, "verify");
        VehiclePosition.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.VehiclePosition)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.VehiclePosition();
          if (object.trip != null) {
            if (typeof object.trip !== "object")
              throw TypeError(".transit_realtime.VehiclePosition.trip: object expected");
            message.trip = $root.transit_realtime.TripDescriptor.fromObject(object.trip, _depth + 1);
          }
          if (object.vehicle != null) {
            if (typeof object.vehicle !== "object")
              throw TypeError(".transit_realtime.VehiclePosition.vehicle: object expected");
            message.vehicle = $root.transit_realtime.VehicleDescriptor.fromObject(object.vehicle, _depth + 1);
          }
          if (object.position != null) {
            if (typeof object.position !== "object")
              throw TypeError(".transit_realtime.VehiclePosition.position: object expected");
            message.position = $root.transit_realtime.Position.fromObject(object.position, _depth + 1);
          }
          if (object.currentStopSequence != null)
            message.currentStopSequence = object.currentStopSequence >>> 0;
          if (object.stopId != null)
            message.stopId = String(object.stopId);
          switch (object.currentStatus) {
            case "INCOMING_AT":
            case 0:
              message.currentStatus = 0;
              break;
            case "STOPPED_AT":
            case 1:
              message.currentStatus = 1;
              break;
            default:
              if (typeof object.currentStatus === "number") {
                message.currentStatus = object.currentStatus;
                break;
              }
              break;
            case "IN_TRANSIT_TO":
            case 2:
              message.currentStatus = 2;
              break;
          }
          if (object.timestamp != null) {
            if ($util.Long)
              (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
            else if (typeof object.timestamp === "string")
              message.timestamp = parseInt(object.timestamp, 10);
            else if (typeof object.timestamp === "number")
              message.timestamp = object.timestamp;
            else if (typeof object.timestamp === "object")
              message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
          }
          switch (object.congestionLevel) {
            default:
              if (typeof object.congestionLevel === "number") {
                message.congestionLevel = object.congestionLevel;
                break;
              }
              break;
            case "UNKNOWN_CONGESTION_LEVEL":
            case 0:
              message.congestionLevel = 0;
              break;
            case "RUNNING_SMOOTHLY":
            case 1:
              message.congestionLevel = 1;
              break;
            case "STOP_AND_GO":
            case 2:
              message.congestionLevel = 2;
              break;
            case "CONGESTION":
            case 3:
              message.congestionLevel = 3;
              break;
            case "SEVERE_CONGESTION":
            case 4:
              message.congestionLevel = 4;
              break;
          }
          switch (object.occupancyStatus) {
            default:
              if (typeof object.occupancyStatus === "number") {
                message.occupancyStatus = object.occupancyStatus;
                break;
              }
              break;
            case "EMPTY":
            case 0:
              message.occupancyStatus = 0;
              break;
            case "MANY_SEATS_AVAILABLE":
            case 1:
              message.occupancyStatus = 1;
              break;
            case "FEW_SEATS_AVAILABLE":
            case 2:
              message.occupancyStatus = 2;
              break;
            case "STANDING_ROOM_ONLY":
            case 3:
              message.occupancyStatus = 3;
              break;
            case "CRUSHED_STANDING_ROOM_ONLY":
            case 4:
              message.occupancyStatus = 4;
              break;
            case "FULL":
            case 5:
              message.occupancyStatus = 5;
              break;
            case "NOT_ACCEPTING_PASSENGERS":
            case 6:
              message.occupancyStatus = 6;
              break;
            case "NO_DATA_AVAILABLE":
            case 7:
              message.occupancyStatus = 7;
              break;
            case "NOT_BOARDABLE":
            case 8:
              message.occupancyStatus = 8;
              break;
          }
          if (object.occupancyPercentage != null)
            message.occupancyPercentage = object.occupancyPercentage >>> 0;
          if (object.multiCarriageDetails) {
            if (!Array.isArray(object.multiCarriageDetails))
              throw TypeError(".transit_realtime.VehiclePosition.multiCarriageDetails: array expected");
            message.multiCarriageDetails = Array(object.multiCarriageDetails.length);
            for (var i = 0; i < object.multiCarriageDetails.length; ++i) {
              if (typeof object.multiCarriageDetails[i] !== "object")
                throw TypeError(".transit_realtime.VehiclePosition.multiCarriageDetails: object expected");
              message.multiCarriageDetails[i] = $root.transit_realtime.VehiclePosition.CarriageDetails.fromObject(object.multiCarriageDetails[i], _depth + 1);
            }
          }
          return message;
        }, "fromObject");
        VehiclePosition.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.arrays || options.defaults)
            object.multiCarriageDetails = [];
          if (options.defaults) {
            object.trip = null;
            object.position = null;
            object.currentStopSequence = 0;
            object.currentStatus = options.enums === String ? "IN_TRANSIT_TO" : 2;
            if ($util.Long) {
              var long = new $util.Long(0, 0, true);
              object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
              object.timestamp = options.longs === String ? "0" : 0;
            object.congestionLevel = options.enums === String ? "UNKNOWN_CONGESTION_LEVEL" : 0;
            object.stopId = "";
            object.vehicle = null;
            object.occupancyStatus = options.enums === String ? "EMPTY" : 0;
            object.occupancyPercentage = 0;
          }
          if (message.trip != null && message.hasOwnProperty("trip"))
            object.trip = $root.transit_realtime.TripDescriptor.toObject(message.trip, options);
          if (message.position != null && message.hasOwnProperty("position"))
            object.position = $root.transit_realtime.Position.toObject(message.position, options);
          if (message.currentStopSequence != null && message.hasOwnProperty("currentStopSequence"))
            object.currentStopSequence = message.currentStopSequence;
          if (message.currentStatus != null && message.hasOwnProperty("currentStatus"))
            object.currentStatus = options.enums === String ? $root.transit_realtime.VehiclePosition.VehicleStopStatus[message.currentStatus] === void 0 ? message.currentStatus : $root.transit_realtime.VehiclePosition.VehicleStopStatus[message.currentStatus] : message.currentStatus;
          if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (typeof message.timestamp === "number")
              object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
            else
              object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
          if (message.congestionLevel != null && message.hasOwnProperty("congestionLevel"))
            object.congestionLevel = options.enums === String ? $root.transit_realtime.VehiclePosition.CongestionLevel[message.congestionLevel] === void 0 ? message.congestionLevel : $root.transit_realtime.VehiclePosition.CongestionLevel[message.congestionLevel] : message.congestionLevel;
          if (message.stopId != null && message.hasOwnProperty("stopId"))
            object.stopId = message.stopId;
          if (message.vehicle != null && message.hasOwnProperty("vehicle"))
            object.vehicle = $root.transit_realtime.VehicleDescriptor.toObject(message.vehicle, options);
          if (message.occupancyStatus != null && message.hasOwnProperty("occupancyStatus"))
            object.occupancyStatus = options.enums === String ? $root.transit_realtime.VehiclePosition.OccupancyStatus[message.occupancyStatus] === void 0 ? message.occupancyStatus : $root.transit_realtime.VehiclePosition.OccupancyStatus[message.occupancyStatus] : message.occupancyStatus;
          if (message.occupancyPercentage != null && message.hasOwnProperty("occupancyPercentage"))
            object.occupancyPercentage = message.occupancyPercentage;
          if (message.multiCarriageDetails && message.multiCarriageDetails.length) {
            object.multiCarriageDetails = Array(message.multiCarriageDetails.length);
            for (var j = 0; j < message.multiCarriageDetails.length; ++j)
              object.multiCarriageDetails[j] = $root.transit_realtime.VehiclePosition.CarriageDetails.toObject(message.multiCarriageDetails[j], options);
          }
          return object;
        }, "toObject");
        VehiclePosition.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        VehiclePosition.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.VehiclePosition";
        }, "getTypeUrl");
        VehiclePosition.VehicleStopStatus = (function() {
          var valuesById = {}, values = Object.create(valuesById);
          values[valuesById[0] = "INCOMING_AT"] = 0;
          values[valuesById[1] = "STOPPED_AT"] = 1;
          values[valuesById[2] = "IN_TRANSIT_TO"] = 2;
          return values;
        })();
        VehiclePosition.CongestionLevel = (function() {
          var valuesById = {}, values = Object.create(valuesById);
          values[valuesById[0] = "UNKNOWN_CONGESTION_LEVEL"] = 0;
          values[valuesById[1] = "RUNNING_SMOOTHLY"] = 1;
          values[valuesById[2] = "STOP_AND_GO"] = 2;
          values[valuesById[3] = "CONGESTION"] = 3;
          values[valuesById[4] = "SEVERE_CONGESTION"] = 4;
          return values;
        })();
        VehiclePosition.OccupancyStatus = (function() {
          var valuesById = {}, values = Object.create(valuesById);
          values[valuesById[0] = "EMPTY"] = 0;
          values[valuesById[1] = "MANY_SEATS_AVAILABLE"] = 1;
          values[valuesById[2] = "FEW_SEATS_AVAILABLE"] = 2;
          values[valuesById[3] = "STANDING_ROOM_ONLY"] = 3;
          values[valuesById[4] = "CRUSHED_STANDING_ROOM_ONLY"] = 4;
          values[valuesById[5] = "FULL"] = 5;
          values[valuesById[6] = "NOT_ACCEPTING_PASSENGERS"] = 6;
          values[valuesById[7] = "NO_DATA_AVAILABLE"] = 7;
          values[valuesById[8] = "NOT_BOARDABLE"] = 8;
          return values;
        })();
        VehiclePosition.CarriageDetails = (function() {
          function CarriageDetails(properties) {
            if (properties) {
              for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                  this[keys[i]] = properties[keys[i]];
            }
          }
          __name(CarriageDetails, "CarriageDetails");
          CarriageDetails.prototype.id = "";
          CarriageDetails.prototype.label = "";
          CarriageDetails.prototype.occupancyStatus = 7;
          CarriageDetails.prototype.occupancyPercentage = -1;
          CarriageDetails.prototype.carriageSequence = 0;
          CarriageDetails.create = /* @__PURE__ */ __name(function create(properties) {
            return new CarriageDetails(properties);
          }, "create");
          CarriageDetails.encode = /* @__PURE__ */ __name(function encode(message, writer) {
            if (!writer)
              writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
              writer.uint32(
                /* id 1, wireType 2 =*/
                10
              ).string(message.id);
            if (message.label != null && Object.hasOwnProperty.call(message, "label"))
              writer.uint32(
                /* id 2, wireType 2 =*/
                18
              ).string(message.label);
            if (message.occupancyStatus != null && Object.hasOwnProperty.call(message, "occupancyStatus"))
              writer.uint32(
                /* id 3, wireType 0 =*/
                24
              ).int32(message.occupancyStatus);
            if (message.occupancyPercentage != null && Object.hasOwnProperty.call(message, "occupancyPercentage"))
              writer.uint32(
                /* id 4, wireType 0 =*/
                32
              ).int32(message.occupancyPercentage);
            if (message.carriageSequence != null && Object.hasOwnProperty.call(message, "carriageSequence"))
              writer.uint32(
                /* id 5, wireType 0 =*/
                40
              ).uint32(message.carriageSequence);
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
              for (var i = 0; i < message.$unknowns.length; ++i)
                writer.raw(message.$unknowns[i]);
            return writer;
          }, "encode");
          CarriageDetails.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
          }, "encodeDelimited");
          CarriageDetails.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
              reader = $Reader.create(reader);
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $Reader.recursionLimit)
              throw Error("max depth exceeded");
            var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.VehiclePosition.CarriageDetails();
            while (reader.pos < end) {
              var start = reader.pos;
              var tag = reader.tag();
              if (tag === _end) {
                _end = void 0;
                break;
              }
              var wireType = tag & 7;
              switch (tag >>>= 3) {
                case 1: {
                  if (wireType !== 2)
                    break;
                  message.id = reader.string();
                  continue;
                }
                case 2: {
                  if (wireType !== 2)
                    break;
                  message.label = reader.string();
                  continue;
                }
                case 3: {
                  if (wireType !== 0)
                    break;
                  message.occupancyStatus = reader.int32();
                  continue;
                }
                case 4: {
                  if (wireType !== 0)
                    break;
                  message.occupancyPercentage = reader.int32();
                  continue;
                }
                case 5: {
                  if (wireType !== 0)
                    break;
                  message.carriageSequence = reader.uint32();
                  continue;
                }
              }
              reader.skipType(wireType, _depth, tag);
              $util.makeProp(message, "$unknowns", false);
              (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
            }
            if (_end !== void 0)
              throw Error("missing end group");
            return message;
          }, "decode");
          CarriageDetails.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
              reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
          }, "decodeDelimited");
          CarriageDetails.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
            if (typeof message !== "object" || message === null)
              return "object expected";
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              return "max depth exceeded";
            if (message.id != null && message.hasOwnProperty("id")) {
              if (!$util.isString(message.id))
                return "id: string expected";
            }
            if (message.label != null && message.hasOwnProperty("label")) {
              if (!$util.isString(message.label))
                return "label: string expected";
            }
            if (message.occupancyStatus != null && message.hasOwnProperty("occupancyStatus"))
              switch (message.occupancyStatus) {
                default:
                  return "occupancyStatus: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                  break;
              }
            if (message.occupancyPercentage != null && message.hasOwnProperty("occupancyPercentage")) {
              if (!$util.isInteger(message.occupancyPercentage))
                return "occupancyPercentage: integer expected";
            }
            if (message.carriageSequence != null && message.hasOwnProperty("carriageSequence")) {
              if (!$util.isInteger(message.carriageSequence))
                return "carriageSequence: integer expected";
            }
            return null;
          }, "verify");
          CarriageDetails.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
            if (object instanceof $root.transit_realtime.VehiclePosition.CarriageDetails)
              return object;
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              throw Error("max depth exceeded");
            var message = new $root.transit_realtime.VehiclePosition.CarriageDetails();
            if (object.id != null)
              message.id = String(object.id);
            if (object.label != null)
              message.label = String(object.label);
            switch (object.occupancyStatus) {
              case "EMPTY":
              case 0:
                message.occupancyStatus = 0;
                break;
              case "MANY_SEATS_AVAILABLE":
              case 1:
                message.occupancyStatus = 1;
                break;
              case "FEW_SEATS_AVAILABLE":
              case 2:
                message.occupancyStatus = 2;
                break;
              case "STANDING_ROOM_ONLY":
              case 3:
                message.occupancyStatus = 3;
                break;
              case "CRUSHED_STANDING_ROOM_ONLY":
              case 4:
                message.occupancyStatus = 4;
                break;
              case "FULL":
              case 5:
                message.occupancyStatus = 5;
                break;
              case "NOT_ACCEPTING_PASSENGERS":
              case 6:
                message.occupancyStatus = 6;
                break;
              default:
                if (typeof object.occupancyStatus === "number") {
                  message.occupancyStatus = object.occupancyStatus;
                  break;
                }
                break;
              case "NO_DATA_AVAILABLE":
              case 7:
                message.occupancyStatus = 7;
                break;
              case "NOT_BOARDABLE":
              case 8:
                message.occupancyStatus = 8;
                break;
            }
            if (object.occupancyPercentage != null)
              message.occupancyPercentage = object.occupancyPercentage | 0;
            if (object.carriageSequence != null)
              message.carriageSequence = object.carriageSequence >>> 0;
            return message;
          }, "fromObject");
          CarriageDetails.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
            if (!options)
              options = {};
            var object = {};
            if (options.defaults) {
              object.id = "";
              object.label = "";
              object.occupancyStatus = options.enums === String ? "NO_DATA_AVAILABLE" : 7;
              object.occupancyPercentage = -1;
              object.carriageSequence = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
              object.id = message.id;
            if (message.label != null && message.hasOwnProperty("label"))
              object.label = message.label;
            if (message.occupancyStatus != null && message.hasOwnProperty("occupancyStatus"))
              object.occupancyStatus = options.enums === String ? $root.transit_realtime.VehiclePosition.OccupancyStatus[message.occupancyStatus] === void 0 ? message.occupancyStatus : $root.transit_realtime.VehiclePosition.OccupancyStatus[message.occupancyStatus] : message.occupancyStatus;
            if (message.occupancyPercentage != null && message.hasOwnProperty("occupancyPercentage"))
              object.occupancyPercentage = message.occupancyPercentage;
            if (message.carriageSequence != null && message.hasOwnProperty("carriageSequence"))
              object.carriageSequence = message.carriageSequence;
            return object;
          }, "toObject");
          CarriageDetails.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
          }, "toJSON");
          CarriageDetails.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
            if (prefix === void 0)
              prefix = "type.googleapis.com";
            return prefix + "/transit_realtime.VehiclePosition.CarriageDetails";
          }, "getTypeUrl");
          return CarriageDetails;
        })();
        return VehiclePosition;
      })();
      transit_realtime2.Alert = (function() {
        function Alert(properties) {
          this.activePeriod = [];
          this.informedEntity = [];
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(Alert, "Alert");
        Alert.prototype.activePeriod = $util.emptyArray;
        Alert.prototype.informedEntity = $util.emptyArray;
        Alert.prototype.cause = 1;
        Alert.prototype.effect = 8;
        Alert.prototype.url = null;
        Alert.prototype.headerText = null;
        Alert.prototype.descriptionText = null;
        Alert.prototype.ttsHeaderText = null;
        Alert.prototype.ttsDescriptionText = null;
        Alert.prototype.severityLevel = 1;
        Alert.prototype.image = null;
        Alert.prototype.imageAlternativeText = null;
        Alert.prototype.causeDetail = null;
        Alert.prototype.effectDetail = null;
        Alert.create = /* @__PURE__ */ __name(function create(properties) {
          return new Alert(properties);
        }, "create");
        Alert.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.activePeriod != null && message.activePeriod.length)
            for (var i = 0; i < message.activePeriod.length; ++i)
              $root.transit_realtime.TimeRange.encode(message.activePeriod[i], writer.uint32(
                /* id 1, wireType 2 =*/
                10
              ).fork()).ldelim();
          if (message.informedEntity != null && message.informedEntity.length)
            for (var i = 0; i < message.informedEntity.length; ++i)
              $root.transit_realtime.EntitySelector.encode(message.informedEntity[i], writer.uint32(
                /* id 5, wireType 2 =*/
                42
              ).fork()).ldelim();
          if (message.cause != null && Object.hasOwnProperty.call(message, "cause"))
            writer.uint32(
              /* id 6, wireType 0 =*/
              48
            ).int32(message.cause);
          if (message.effect != null && Object.hasOwnProperty.call(message, "effect"))
            writer.uint32(
              /* id 7, wireType 0 =*/
              56
            ).int32(message.effect);
          if (message.url != null && Object.hasOwnProperty.call(message, "url"))
            $root.transit_realtime.TranslatedString.encode(message.url, writer.uint32(
              /* id 8, wireType 2 =*/
              66
            ).fork()).ldelim();
          if (message.headerText != null && Object.hasOwnProperty.call(message, "headerText"))
            $root.transit_realtime.TranslatedString.encode(message.headerText, writer.uint32(
              /* id 10, wireType 2 =*/
              82
            ).fork()).ldelim();
          if (message.descriptionText != null && Object.hasOwnProperty.call(message, "descriptionText"))
            $root.transit_realtime.TranslatedString.encode(message.descriptionText, writer.uint32(
              /* id 11, wireType 2 =*/
              90
            ).fork()).ldelim();
          if (message.ttsHeaderText != null && Object.hasOwnProperty.call(message, "ttsHeaderText"))
            $root.transit_realtime.TranslatedString.encode(message.ttsHeaderText, writer.uint32(
              /* id 12, wireType 2 =*/
              98
            ).fork()).ldelim();
          if (message.ttsDescriptionText != null && Object.hasOwnProperty.call(message, "ttsDescriptionText"))
            $root.transit_realtime.TranslatedString.encode(message.ttsDescriptionText, writer.uint32(
              /* id 13, wireType 2 =*/
              106
            ).fork()).ldelim();
          if (message.severityLevel != null && Object.hasOwnProperty.call(message, "severityLevel"))
            writer.uint32(
              /* id 14, wireType 0 =*/
              112
            ).int32(message.severityLevel);
          if (message.image != null && Object.hasOwnProperty.call(message, "image"))
            $root.transit_realtime.TranslatedImage.encode(message.image, writer.uint32(
              /* id 15, wireType 2 =*/
              122
            ).fork()).ldelim();
          if (message.imageAlternativeText != null && Object.hasOwnProperty.call(message, "imageAlternativeText"))
            $root.transit_realtime.TranslatedString.encode(message.imageAlternativeText, writer.uint32(
              /* id 16, wireType 2 =*/
              130
            ).fork()).ldelim();
          if (message.causeDetail != null && Object.hasOwnProperty.call(message, "causeDetail"))
            $root.transit_realtime.TranslatedString.encode(message.causeDetail, writer.uint32(
              /* id 17, wireType 2 =*/
              138
            ).fork()).ldelim();
          if (message.effectDetail != null && Object.hasOwnProperty.call(message, "effectDetail"))
            $root.transit_realtime.TranslatedString.encode(message.effectDetail, writer.uint32(
              /* id 18, wireType 2 =*/
              146
            ).fork()).ldelim();
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        Alert.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        Alert.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.Alert();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 2)
                  break;
                if (!(message.activePeriod && message.activePeriod.length))
                  message.activePeriod = [];
                message.activePeriod.push($root.transit_realtime.TimeRange.decode(reader, reader.uint32(), void 0, _depth + 1));
                continue;
              }
              case 5: {
                if (wireType !== 2)
                  break;
                if (!(message.informedEntity && message.informedEntity.length))
                  message.informedEntity = [];
                message.informedEntity.push($root.transit_realtime.EntitySelector.decode(reader, reader.uint32(), void 0, _depth + 1));
                continue;
              }
              case 6: {
                if (wireType !== 0)
                  break;
                message.cause = reader.int32();
                continue;
              }
              case 7: {
                if (wireType !== 0)
                  break;
                message.effect = reader.int32();
                continue;
              }
              case 8: {
                if (wireType !== 2)
                  break;
                message.url = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32(), void 0, _depth + 1, message.url);
                continue;
              }
              case 10: {
                if (wireType !== 2)
                  break;
                message.headerText = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32(), void 0, _depth + 1, message.headerText);
                continue;
              }
              case 11: {
                if (wireType !== 2)
                  break;
                message.descriptionText = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32(), void 0, _depth + 1, message.descriptionText);
                continue;
              }
              case 12: {
                if (wireType !== 2)
                  break;
                message.ttsHeaderText = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32(), void 0, _depth + 1, message.ttsHeaderText);
                continue;
              }
              case 13: {
                if (wireType !== 2)
                  break;
                message.ttsDescriptionText = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32(), void 0, _depth + 1, message.ttsDescriptionText);
                continue;
              }
              case 14: {
                if (wireType !== 0)
                  break;
                message.severityLevel = reader.int32();
                continue;
              }
              case 15: {
                if (wireType !== 2)
                  break;
                message.image = $root.transit_realtime.TranslatedImage.decode(reader, reader.uint32(), void 0, _depth + 1, message.image);
                continue;
              }
              case 16: {
                if (wireType !== 2)
                  break;
                message.imageAlternativeText = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32(), void 0, _depth + 1, message.imageAlternativeText);
                continue;
              }
              case 17: {
                if (wireType !== 2)
                  break;
                message.causeDetail = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32(), void 0, _depth + 1, message.causeDetail);
                continue;
              }
              case 18: {
                if (wireType !== 2)
                  break;
                message.effectDetail = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32(), void 0, _depth + 1, message.effectDetail);
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          return message;
        }, "decode");
        Alert.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        Alert.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          if (message.activePeriod != null && message.hasOwnProperty("activePeriod")) {
            if (!Array.isArray(message.activePeriod))
              return "activePeriod: array expected";
            for (var i = 0; i < message.activePeriod.length; ++i) {
              var error = $root.transit_realtime.TimeRange.verify(message.activePeriod[i], _depth + 1);
              if (error)
                return "activePeriod." + error;
            }
          }
          if (message.informedEntity != null && message.hasOwnProperty("informedEntity")) {
            if (!Array.isArray(message.informedEntity))
              return "informedEntity: array expected";
            for (var i = 0; i < message.informedEntity.length; ++i) {
              var error = $root.transit_realtime.EntitySelector.verify(message.informedEntity[i], _depth + 1);
              if (error)
                return "informedEntity." + error;
            }
          }
          if (message.cause != null && message.hasOwnProperty("cause"))
            switch (message.cause) {
              default:
                return "cause: enum value expected";
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
              case 6:
              case 7:
              case 8:
              case 9:
              case 10:
              case 11:
              case 12:
                break;
            }
          if (message.effect != null && message.hasOwnProperty("effect"))
            switch (message.effect) {
              default:
                return "effect: enum value expected";
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
              case 6:
              case 7:
              case 8:
              case 9:
              case 10:
              case 11:
                break;
            }
          if (message.url != null && message.hasOwnProperty("url")) {
            var error = $root.transit_realtime.TranslatedString.verify(message.url, _depth + 1);
            if (error)
              return "url." + error;
          }
          if (message.headerText != null && message.hasOwnProperty("headerText")) {
            var error = $root.transit_realtime.TranslatedString.verify(message.headerText, _depth + 1);
            if (error)
              return "headerText." + error;
          }
          if (message.descriptionText != null && message.hasOwnProperty("descriptionText")) {
            var error = $root.transit_realtime.TranslatedString.verify(message.descriptionText, _depth + 1);
            if (error)
              return "descriptionText." + error;
          }
          if (message.ttsHeaderText != null && message.hasOwnProperty("ttsHeaderText")) {
            var error = $root.transit_realtime.TranslatedString.verify(message.ttsHeaderText, _depth + 1);
            if (error)
              return "ttsHeaderText." + error;
          }
          if (message.ttsDescriptionText != null && message.hasOwnProperty("ttsDescriptionText")) {
            var error = $root.transit_realtime.TranslatedString.verify(message.ttsDescriptionText, _depth + 1);
            if (error)
              return "ttsDescriptionText." + error;
          }
          if (message.severityLevel != null && message.hasOwnProperty("severityLevel"))
            switch (message.severityLevel) {
              default:
                return "severityLevel: enum value expected";
              case 1:
              case 2:
              case 3:
              case 4:
                break;
            }
          if (message.image != null && message.hasOwnProperty("image")) {
            var error = $root.transit_realtime.TranslatedImage.verify(message.image, _depth + 1);
            if (error)
              return "image." + error;
          }
          if (message.imageAlternativeText != null && message.hasOwnProperty("imageAlternativeText")) {
            var error = $root.transit_realtime.TranslatedString.verify(message.imageAlternativeText, _depth + 1);
            if (error)
              return "imageAlternativeText." + error;
          }
          if (message.causeDetail != null && message.hasOwnProperty("causeDetail")) {
            var error = $root.transit_realtime.TranslatedString.verify(message.causeDetail, _depth + 1);
            if (error)
              return "causeDetail." + error;
          }
          if (message.effectDetail != null && message.hasOwnProperty("effectDetail")) {
            var error = $root.transit_realtime.TranslatedString.verify(message.effectDetail, _depth + 1);
            if (error)
              return "effectDetail." + error;
          }
          return null;
        }, "verify");
        Alert.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.Alert)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.Alert();
          if (object.activePeriod) {
            if (!Array.isArray(object.activePeriod))
              throw TypeError(".transit_realtime.Alert.activePeriod: array expected");
            message.activePeriod = Array(object.activePeriod.length);
            for (var i = 0; i < object.activePeriod.length; ++i) {
              if (typeof object.activePeriod[i] !== "object")
                throw TypeError(".transit_realtime.Alert.activePeriod: object expected");
              message.activePeriod[i] = $root.transit_realtime.TimeRange.fromObject(object.activePeriod[i], _depth + 1);
            }
          }
          if (object.informedEntity) {
            if (!Array.isArray(object.informedEntity))
              throw TypeError(".transit_realtime.Alert.informedEntity: array expected");
            message.informedEntity = Array(object.informedEntity.length);
            for (var i = 0; i < object.informedEntity.length; ++i) {
              if (typeof object.informedEntity[i] !== "object")
                throw TypeError(".transit_realtime.Alert.informedEntity: object expected");
              message.informedEntity[i] = $root.transit_realtime.EntitySelector.fromObject(object.informedEntity[i], _depth + 1);
            }
          }
          switch (object.cause) {
            default:
              if (typeof object.cause === "number") {
                message.cause = object.cause;
                break;
              }
              break;
            case "UNKNOWN_CAUSE":
            case 1:
              message.cause = 1;
              break;
            case "OTHER_CAUSE":
            case 2:
              message.cause = 2;
              break;
            case "TECHNICAL_PROBLEM":
            case 3:
              message.cause = 3;
              break;
            case "STRIKE":
            case 4:
              message.cause = 4;
              break;
            case "DEMONSTRATION":
            case 5:
              message.cause = 5;
              break;
            case "ACCIDENT":
            case 6:
              message.cause = 6;
              break;
            case "HOLIDAY":
            case 7:
              message.cause = 7;
              break;
            case "WEATHER":
            case 8:
              message.cause = 8;
              break;
            case "MAINTENANCE":
            case 9:
              message.cause = 9;
              break;
            case "CONSTRUCTION":
            case 10:
              message.cause = 10;
              break;
            case "POLICE_ACTIVITY":
            case 11:
              message.cause = 11;
              break;
            case "MEDICAL_EMERGENCY":
            case 12:
              message.cause = 12;
              break;
          }
          switch (object.effect) {
            case "NO_SERVICE":
            case 1:
              message.effect = 1;
              break;
            case "REDUCED_SERVICE":
            case 2:
              message.effect = 2;
              break;
            case "SIGNIFICANT_DELAYS":
            case 3:
              message.effect = 3;
              break;
            case "DETOUR":
            case 4:
              message.effect = 4;
              break;
            case "ADDITIONAL_SERVICE":
            case 5:
              message.effect = 5;
              break;
            case "MODIFIED_SERVICE":
            case 6:
              message.effect = 6;
              break;
            case "OTHER_EFFECT":
            case 7:
              message.effect = 7;
              break;
            default:
              if (typeof object.effect === "number") {
                message.effect = object.effect;
                break;
              }
              break;
            case "UNKNOWN_EFFECT":
            case 8:
              message.effect = 8;
              break;
            case "STOP_MOVED":
            case 9:
              message.effect = 9;
              break;
            case "NO_EFFECT":
            case 10:
              message.effect = 10;
              break;
            case "ACCESSIBILITY_ISSUE":
            case 11:
              message.effect = 11;
              break;
          }
          if (object.url != null) {
            if (typeof object.url !== "object")
              throw TypeError(".transit_realtime.Alert.url: object expected");
            message.url = $root.transit_realtime.TranslatedString.fromObject(object.url, _depth + 1);
          }
          if (object.headerText != null) {
            if (typeof object.headerText !== "object")
              throw TypeError(".transit_realtime.Alert.headerText: object expected");
            message.headerText = $root.transit_realtime.TranslatedString.fromObject(object.headerText, _depth + 1);
          }
          if (object.descriptionText != null) {
            if (typeof object.descriptionText !== "object")
              throw TypeError(".transit_realtime.Alert.descriptionText: object expected");
            message.descriptionText = $root.transit_realtime.TranslatedString.fromObject(object.descriptionText, _depth + 1);
          }
          if (object.ttsHeaderText != null) {
            if (typeof object.ttsHeaderText !== "object")
              throw TypeError(".transit_realtime.Alert.ttsHeaderText: object expected");
            message.ttsHeaderText = $root.transit_realtime.TranslatedString.fromObject(object.ttsHeaderText, _depth + 1);
          }
          if (object.ttsDescriptionText != null) {
            if (typeof object.ttsDescriptionText !== "object")
              throw TypeError(".transit_realtime.Alert.ttsDescriptionText: object expected");
            message.ttsDescriptionText = $root.transit_realtime.TranslatedString.fromObject(object.ttsDescriptionText, _depth + 1);
          }
          switch (object.severityLevel) {
            default:
              if (typeof object.severityLevel === "number") {
                message.severityLevel = object.severityLevel;
                break;
              }
              break;
            case "UNKNOWN_SEVERITY":
            case 1:
              message.severityLevel = 1;
              break;
            case "INFO":
            case 2:
              message.severityLevel = 2;
              break;
            case "WARNING":
            case 3:
              message.severityLevel = 3;
              break;
            case "SEVERE":
            case 4:
              message.severityLevel = 4;
              break;
          }
          if (object.image != null) {
            if (typeof object.image !== "object")
              throw TypeError(".transit_realtime.Alert.image: object expected");
            message.image = $root.transit_realtime.TranslatedImage.fromObject(object.image, _depth + 1);
          }
          if (object.imageAlternativeText != null) {
            if (typeof object.imageAlternativeText !== "object")
              throw TypeError(".transit_realtime.Alert.imageAlternativeText: object expected");
            message.imageAlternativeText = $root.transit_realtime.TranslatedString.fromObject(object.imageAlternativeText, _depth + 1);
          }
          if (object.causeDetail != null) {
            if (typeof object.causeDetail !== "object")
              throw TypeError(".transit_realtime.Alert.causeDetail: object expected");
            message.causeDetail = $root.transit_realtime.TranslatedString.fromObject(object.causeDetail, _depth + 1);
          }
          if (object.effectDetail != null) {
            if (typeof object.effectDetail !== "object")
              throw TypeError(".transit_realtime.Alert.effectDetail: object expected");
            message.effectDetail = $root.transit_realtime.TranslatedString.fromObject(object.effectDetail, _depth + 1);
          }
          return message;
        }, "fromObject");
        Alert.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.arrays || options.defaults) {
            object.activePeriod = [];
            object.informedEntity = [];
          }
          if (options.defaults) {
            object.cause = options.enums === String ? "UNKNOWN_CAUSE" : 1;
            object.effect = options.enums === String ? "UNKNOWN_EFFECT" : 8;
            object.url = null;
            object.headerText = null;
            object.descriptionText = null;
            object.ttsHeaderText = null;
            object.ttsDescriptionText = null;
            object.severityLevel = options.enums === String ? "UNKNOWN_SEVERITY" : 1;
            object.image = null;
            object.imageAlternativeText = null;
            object.causeDetail = null;
            object.effectDetail = null;
          }
          if (message.activePeriod && message.activePeriod.length) {
            object.activePeriod = Array(message.activePeriod.length);
            for (var j = 0; j < message.activePeriod.length; ++j)
              object.activePeriod[j] = $root.transit_realtime.TimeRange.toObject(message.activePeriod[j], options);
          }
          if (message.informedEntity && message.informedEntity.length) {
            object.informedEntity = Array(message.informedEntity.length);
            for (var j = 0; j < message.informedEntity.length; ++j)
              object.informedEntity[j] = $root.transit_realtime.EntitySelector.toObject(message.informedEntity[j], options);
          }
          if (message.cause != null && message.hasOwnProperty("cause"))
            object.cause = options.enums === String ? $root.transit_realtime.Alert.Cause[message.cause] === void 0 ? message.cause : $root.transit_realtime.Alert.Cause[message.cause] : message.cause;
          if (message.effect != null && message.hasOwnProperty("effect"))
            object.effect = options.enums === String ? $root.transit_realtime.Alert.Effect[message.effect] === void 0 ? message.effect : $root.transit_realtime.Alert.Effect[message.effect] : message.effect;
          if (message.url != null && message.hasOwnProperty("url"))
            object.url = $root.transit_realtime.TranslatedString.toObject(message.url, options);
          if (message.headerText != null && message.hasOwnProperty("headerText"))
            object.headerText = $root.transit_realtime.TranslatedString.toObject(message.headerText, options);
          if (message.descriptionText != null && message.hasOwnProperty("descriptionText"))
            object.descriptionText = $root.transit_realtime.TranslatedString.toObject(message.descriptionText, options);
          if (message.ttsHeaderText != null && message.hasOwnProperty("ttsHeaderText"))
            object.ttsHeaderText = $root.transit_realtime.TranslatedString.toObject(message.ttsHeaderText, options);
          if (message.ttsDescriptionText != null && message.hasOwnProperty("ttsDescriptionText"))
            object.ttsDescriptionText = $root.transit_realtime.TranslatedString.toObject(message.ttsDescriptionText, options);
          if (message.severityLevel != null && message.hasOwnProperty("severityLevel"))
            object.severityLevel = options.enums === String ? $root.transit_realtime.Alert.SeverityLevel[message.severityLevel] === void 0 ? message.severityLevel : $root.transit_realtime.Alert.SeverityLevel[message.severityLevel] : message.severityLevel;
          if (message.image != null && message.hasOwnProperty("image"))
            object.image = $root.transit_realtime.TranslatedImage.toObject(message.image, options);
          if (message.imageAlternativeText != null && message.hasOwnProperty("imageAlternativeText"))
            object.imageAlternativeText = $root.transit_realtime.TranslatedString.toObject(message.imageAlternativeText, options);
          if (message.causeDetail != null && message.hasOwnProperty("causeDetail"))
            object.causeDetail = $root.transit_realtime.TranslatedString.toObject(message.causeDetail, options);
          if (message.effectDetail != null && message.hasOwnProperty("effectDetail"))
            object.effectDetail = $root.transit_realtime.TranslatedString.toObject(message.effectDetail, options);
          return object;
        }, "toObject");
        Alert.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        Alert.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.Alert";
        }, "getTypeUrl");
        Alert.Cause = (function() {
          var valuesById = {}, values = Object.create(valuesById);
          values[valuesById[1] = "UNKNOWN_CAUSE"] = 1;
          values[valuesById[2] = "OTHER_CAUSE"] = 2;
          values[valuesById[3] = "TECHNICAL_PROBLEM"] = 3;
          values[valuesById[4] = "STRIKE"] = 4;
          values[valuesById[5] = "DEMONSTRATION"] = 5;
          values[valuesById[6] = "ACCIDENT"] = 6;
          values[valuesById[7] = "HOLIDAY"] = 7;
          values[valuesById[8] = "WEATHER"] = 8;
          values[valuesById[9] = "MAINTENANCE"] = 9;
          values[valuesById[10] = "CONSTRUCTION"] = 10;
          values[valuesById[11] = "POLICE_ACTIVITY"] = 11;
          values[valuesById[12] = "MEDICAL_EMERGENCY"] = 12;
          return values;
        })();
        Alert.Effect = (function() {
          var valuesById = {}, values = Object.create(valuesById);
          values[valuesById[1] = "NO_SERVICE"] = 1;
          values[valuesById[2] = "REDUCED_SERVICE"] = 2;
          values[valuesById[3] = "SIGNIFICANT_DELAYS"] = 3;
          values[valuesById[4] = "DETOUR"] = 4;
          values[valuesById[5] = "ADDITIONAL_SERVICE"] = 5;
          values[valuesById[6] = "MODIFIED_SERVICE"] = 6;
          values[valuesById[7] = "OTHER_EFFECT"] = 7;
          values[valuesById[8] = "UNKNOWN_EFFECT"] = 8;
          values[valuesById[9] = "STOP_MOVED"] = 9;
          values[valuesById[10] = "NO_EFFECT"] = 10;
          values[valuesById[11] = "ACCESSIBILITY_ISSUE"] = 11;
          return values;
        })();
        Alert.SeverityLevel = (function() {
          var valuesById = {}, values = Object.create(valuesById);
          values[valuesById[1] = "UNKNOWN_SEVERITY"] = 1;
          values[valuesById[2] = "INFO"] = 2;
          values[valuesById[3] = "WARNING"] = 3;
          values[valuesById[4] = "SEVERE"] = 4;
          return values;
        })();
        return Alert;
      })();
      transit_realtime2.TimeRange = (function() {
        function TimeRange(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(TimeRange, "TimeRange");
        TimeRange.prototype.start = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;
        TimeRange.prototype.end = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;
        TimeRange.create = /* @__PURE__ */ __name(function create(properties) {
          return new TimeRange(properties);
        }, "create");
        TimeRange.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.start != null && Object.hasOwnProperty.call(message, "start"))
            writer.uint32(
              /* id 1, wireType 0 =*/
              8
            ).uint64(message.start);
          if (message.end != null && Object.hasOwnProperty.call(message, "end"))
            writer.uint32(
              /* id 2, wireType 0 =*/
              16
            ).uint64(message.end);
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        TimeRange.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        TimeRange.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.TimeRange();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 0)
                  break;
                message.start = reader.uint64();
                continue;
              }
              case 2: {
                if (wireType !== 0)
                  break;
                message.end = reader.uint64();
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          return message;
        }, "decode");
        TimeRange.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        TimeRange.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          if (message.start != null && message.hasOwnProperty("start")) {
            if (!$util.isInteger(message.start) && !(message.start && $util.isInteger(message.start.low) && $util.isInteger(message.start.high)))
              return "start: integer|Long expected";
          }
          if (message.end != null && message.hasOwnProperty("end")) {
            if (!$util.isInteger(message.end) && !(message.end && $util.isInteger(message.end.low) && $util.isInteger(message.end.high)))
              return "end: integer|Long expected";
          }
          return null;
        }, "verify");
        TimeRange.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.TimeRange)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.TimeRange();
          if (object.start != null) {
            if ($util.Long)
              (message.start = $util.Long.fromValue(object.start)).unsigned = true;
            else if (typeof object.start === "string")
              message.start = parseInt(object.start, 10);
            else if (typeof object.start === "number")
              message.start = object.start;
            else if (typeof object.start === "object")
              message.start = new $util.LongBits(object.start.low >>> 0, object.start.high >>> 0).toNumber(true);
          }
          if (object.end != null) {
            if ($util.Long)
              (message.end = $util.Long.fromValue(object.end)).unsigned = true;
            else if (typeof object.end === "string")
              message.end = parseInt(object.end, 10);
            else if (typeof object.end === "number")
              message.end = object.end;
            else if (typeof object.end === "object")
              message.end = new $util.LongBits(object.end.low >>> 0, object.end.high >>> 0).toNumber(true);
          }
          return message;
        }, "fromObject");
        TimeRange.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.defaults) {
            if ($util.Long) {
              var long = new $util.Long(0, 0, true);
              object.start = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
              object.start = options.longs === String ? "0" : 0;
            if ($util.Long) {
              var long = new $util.Long(0, 0, true);
              object.end = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
              object.end = options.longs === String ? "0" : 0;
          }
          if (message.start != null && message.hasOwnProperty("start"))
            if (typeof message.start === "number")
              object.start = options.longs === String ? String(message.start) : message.start;
            else
              object.start = options.longs === String ? $util.Long.prototype.toString.call(message.start) : options.longs === Number ? new $util.LongBits(message.start.low >>> 0, message.start.high >>> 0).toNumber(true) : message.start;
          if (message.end != null && message.hasOwnProperty("end"))
            if (typeof message.end === "number")
              object.end = options.longs === String ? String(message.end) : message.end;
            else
              object.end = options.longs === String ? $util.Long.prototype.toString.call(message.end) : options.longs === Number ? new $util.LongBits(message.end.low >>> 0, message.end.high >>> 0).toNumber(true) : message.end;
          return object;
        }, "toObject");
        TimeRange.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        TimeRange.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.TimeRange";
        }, "getTypeUrl");
        return TimeRange;
      })();
      transit_realtime2.Position = (function() {
        function Position(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(Position, "Position");
        Position.prototype.latitude = 0;
        Position.prototype.longitude = 0;
        Position.prototype.bearing = 0;
        Position.prototype.odometer = 0;
        Position.prototype.speed = 0;
        Position.create = /* @__PURE__ */ __name(function create(properties) {
          return new Position(properties);
        }, "create");
        Position.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          writer.uint32(
            /* id 1, wireType 5 =*/
            13
          ).float(message.latitude);
          writer.uint32(
            /* id 2, wireType 5 =*/
            21
          ).float(message.longitude);
          if (message.bearing != null && Object.hasOwnProperty.call(message, "bearing"))
            writer.uint32(
              /* id 3, wireType 5 =*/
              29
            ).float(message.bearing);
          if (message.odometer != null && Object.hasOwnProperty.call(message, "odometer"))
            writer.uint32(
              /* id 4, wireType 1 =*/
              33
            ).double(message.odometer);
          if (message.speed != null && Object.hasOwnProperty.call(message, "speed"))
            writer.uint32(
              /* id 5, wireType 5 =*/
              45
            ).float(message.speed);
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        Position.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        Position.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.Position();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 5)
                  break;
                message.latitude = reader.float();
                continue;
              }
              case 2: {
                if (wireType !== 5)
                  break;
                message.longitude = reader.float();
                continue;
              }
              case 3: {
                if (wireType !== 5)
                  break;
                message.bearing = reader.float();
                continue;
              }
              case 4: {
                if (wireType !== 1)
                  break;
                message.odometer = reader.double();
                continue;
              }
              case 5: {
                if (wireType !== 5)
                  break;
                message.speed = reader.float();
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          if (!message.hasOwnProperty("latitude"))
            throw $util.ProtocolError("missing required 'latitude'", { instance: message });
          if (!message.hasOwnProperty("longitude"))
            throw $util.ProtocolError("missing required 'longitude'", { instance: message });
          return message;
        }, "decode");
        Position.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        Position.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          if (typeof message.latitude !== "number")
            return "latitude: number expected";
          if (typeof message.longitude !== "number")
            return "longitude: number expected";
          if (message.bearing != null && message.hasOwnProperty("bearing")) {
            if (typeof message.bearing !== "number")
              return "bearing: number expected";
          }
          if (message.odometer != null && message.hasOwnProperty("odometer")) {
            if (typeof message.odometer !== "number")
              return "odometer: number expected";
          }
          if (message.speed != null && message.hasOwnProperty("speed")) {
            if (typeof message.speed !== "number")
              return "speed: number expected";
          }
          return null;
        }, "verify");
        Position.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.Position)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.Position();
          if (object.latitude != null)
            message.latitude = Number(object.latitude);
          if (object.longitude != null)
            message.longitude = Number(object.longitude);
          if (object.bearing != null)
            message.bearing = Number(object.bearing);
          if (object.odometer != null)
            message.odometer = Number(object.odometer);
          if (object.speed != null)
            message.speed = Number(object.speed);
          return message;
        }, "fromObject");
        Position.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.defaults) {
            object.latitude = 0;
            object.longitude = 0;
            object.bearing = 0;
            object.odometer = 0;
            object.speed = 0;
          }
          if (message.latitude != null && message.hasOwnProperty("latitude"))
            object.latitude = options.json && !isFinite(message.latitude) ? String(message.latitude) : message.latitude;
          if (message.longitude != null && message.hasOwnProperty("longitude"))
            object.longitude = options.json && !isFinite(message.longitude) ? String(message.longitude) : message.longitude;
          if (message.bearing != null && message.hasOwnProperty("bearing"))
            object.bearing = options.json && !isFinite(message.bearing) ? String(message.bearing) : message.bearing;
          if (message.odometer != null && message.hasOwnProperty("odometer"))
            object.odometer = options.json && !isFinite(message.odometer) ? String(message.odometer) : message.odometer;
          if (message.speed != null && message.hasOwnProperty("speed"))
            object.speed = options.json && !isFinite(message.speed) ? String(message.speed) : message.speed;
          return object;
        }, "toObject");
        Position.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        Position.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.Position";
        }, "getTypeUrl");
        return Position;
      })();
      transit_realtime2.TripDescriptor = (function() {
        function TripDescriptor(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(TripDescriptor, "TripDescriptor");
        TripDescriptor.prototype.tripId = "";
        TripDescriptor.prototype.routeId = "";
        TripDescriptor.prototype.directionId = 0;
        TripDescriptor.prototype.startTime = "";
        TripDescriptor.prototype.startDate = "";
        TripDescriptor.prototype.scheduleRelationship = 0;
        TripDescriptor.prototype.modifiedTrip = null;
        TripDescriptor.create = /* @__PURE__ */ __name(function create(properties) {
          return new TripDescriptor(properties);
        }, "create");
        TripDescriptor.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.tripId != null && Object.hasOwnProperty.call(message, "tripId"))
            writer.uint32(
              /* id 1, wireType 2 =*/
              10
            ).string(message.tripId);
          if (message.startTime != null && Object.hasOwnProperty.call(message, "startTime"))
            writer.uint32(
              /* id 2, wireType 2 =*/
              18
            ).string(message.startTime);
          if (message.startDate != null && Object.hasOwnProperty.call(message, "startDate"))
            writer.uint32(
              /* id 3, wireType 2 =*/
              26
            ).string(message.startDate);
          if (message.scheduleRelationship != null && Object.hasOwnProperty.call(message, "scheduleRelationship"))
            writer.uint32(
              /* id 4, wireType 0 =*/
              32
            ).int32(message.scheduleRelationship);
          if (message.routeId != null && Object.hasOwnProperty.call(message, "routeId"))
            writer.uint32(
              /* id 5, wireType 2 =*/
              42
            ).string(message.routeId);
          if (message.directionId != null && Object.hasOwnProperty.call(message, "directionId"))
            writer.uint32(
              /* id 6, wireType 0 =*/
              48
            ).uint32(message.directionId);
          if (message.modifiedTrip != null && Object.hasOwnProperty.call(message, "modifiedTrip"))
            $root.transit_realtime.TripDescriptor.ModifiedTripSelector.encode(message.modifiedTrip, writer.uint32(
              /* id 7, wireType 2 =*/
              58
            ).fork()).ldelim();
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        TripDescriptor.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        TripDescriptor.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.TripDescriptor();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 2)
                  break;
                message.tripId = reader.string();
                continue;
              }
              case 5: {
                if (wireType !== 2)
                  break;
                message.routeId = reader.string();
                continue;
              }
              case 6: {
                if (wireType !== 0)
                  break;
                message.directionId = reader.uint32();
                continue;
              }
              case 2: {
                if (wireType !== 2)
                  break;
                message.startTime = reader.string();
                continue;
              }
              case 3: {
                if (wireType !== 2)
                  break;
                message.startDate = reader.string();
                continue;
              }
              case 4: {
                if (wireType !== 0)
                  break;
                message.scheduleRelationship = reader.int32();
                continue;
              }
              case 7: {
                if (wireType !== 2)
                  break;
                message.modifiedTrip = $root.transit_realtime.TripDescriptor.ModifiedTripSelector.decode(reader, reader.uint32(), void 0, _depth + 1, message.modifiedTrip);
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          return message;
        }, "decode");
        TripDescriptor.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        TripDescriptor.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          if (message.tripId != null && message.hasOwnProperty("tripId")) {
            if (!$util.isString(message.tripId))
              return "tripId: string expected";
          }
          if (message.routeId != null && message.hasOwnProperty("routeId")) {
            if (!$util.isString(message.routeId))
              return "routeId: string expected";
          }
          if (message.directionId != null && message.hasOwnProperty("directionId")) {
            if (!$util.isInteger(message.directionId))
              return "directionId: integer expected";
          }
          if (message.startTime != null && message.hasOwnProperty("startTime")) {
            if (!$util.isString(message.startTime))
              return "startTime: string expected";
          }
          if (message.startDate != null && message.hasOwnProperty("startDate")) {
            if (!$util.isString(message.startDate))
              return "startDate: string expected";
          }
          if (message.scheduleRelationship != null && message.hasOwnProperty("scheduleRelationship"))
            switch (message.scheduleRelationship) {
              default:
                return "scheduleRelationship: enum value expected";
              case 0:
              case 1:
              case 2:
              case 3:
              case 5:
              case 6:
              case 7:
              case 8:
                break;
            }
          if (message.modifiedTrip != null && message.hasOwnProperty("modifiedTrip")) {
            var error = $root.transit_realtime.TripDescriptor.ModifiedTripSelector.verify(message.modifiedTrip, _depth + 1);
            if (error)
              return "modifiedTrip." + error;
          }
          return null;
        }, "verify");
        TripDescriptor.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.TripDescriptor)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.TripDescriptor();
          if (object.tripId != null)
            message.tripId = String(object.tripId);
          if (object.routeId != null)
            message.routeId = String(object.routeId);
          if (object.directionId != null)
            message.directionId = object.directionId >>> 0;
          if (object.startTime != null)
            message.startTime = String(object.startTime);
          if (object.startDate != null)
            message.startDate = String(object.startDate);
          switch (object.scheduleRelationship) {
            default:
              if (typeof object.scheduleRelationship === "number") {
                message.scheduleRelationship = object.scheduleRelationship;
                break;
              }
              break;
            case "SCHEDULED":
            case 0:
              message.scheduleRelationship = 0;
              break;
            case "ADDED":
            case 1:
              message.scheduleRelationship = 1;
              break;
            case "UNSCHEDULED":
            case 2:
              message.scheduleRelationship = 2;
              break;
            case "CANCELED":
            case 3:
              message.scheduleRelationship = 3;
              break;
            case "REPLACEMENT":
            case 5:
              message.scheduleRelationship = 5;
              break;
            case "DUPLICATED":
            case 6:
              message.scheduleRelationship = 6;
              break;
            case "DELETED":
            case 7:
              message.scheduleRelationship = 7;
              break;
            case "NEW":
            case 8:
              message.scheduleRelationship = 8;
              break;
          }
          if (object.modifiedTrip != null) {
            if (typeof object.modifiedTrip !== "object")
              throw TypeError(".transit_realtime.TripDescriptor.modifiedTrip: object expected");
            message.modifiedTrip = $root.transit_realtime.TripDescriptor.ModifiedTripSelector.fromObject(object.modifiedTrip, _depth + 1);
          }
          return message;
        }, "fromObject");
        TripDescriptor.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.defaults) {
            object.tripId = "";
            object.startTime = "";
            object.startDate = "";
            object.scheduleRelationship = options.enums === String ? "SCHEDULED" : 0;
            object.routeId = "";
            object.directionId = 0;
            object.modifiedTrip = null;
          }
          if (message.tripId != null && message.hasOwnProperty("tripId"))
            object.tripId = message.tripId;
          if (message.startTime != null && message.hasOwnProperty("startTime"))
            object.startTime = message.startTime;
          if (message.startDate != null && message.hasOwnProperty("startDate"))
            object.startDate = message.startDate;
          if (message.scheduleRelationship != null && message.hasOwnProperty("scheduleRelationship"))
            object.scheduleRelationship = options.enums === String ? $root.transit_realtime.TripDescriptor.ScheduleRelationship[message.scheduleRelationship] === void 0 ? message.scheduleRelationship : $root.transit_realtime.TripDescriptor.ScheduleRelationship[message.scheduleRelationship] : message.scheduleRelationship;
          if (message.routeId != null && message.hasOwnProperty("routeId"))
            object.routeId = message.routeId;
          if (message.directionId != null && message.hasOwnProperty("directionId"))
            object.directionId = message.directionId;
          if (message.modifiedTrip != null && message.hasOwnProperty("modifiedTrip"))
            object.modifiedTrip = $root.transit_realtime.TripDescriptor.ModifiedTripSelector.toObject(message.modifiedTrip, options);
          return object;
        }, "toObject");
        TripDescriptor.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        TripDescriptor.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.TripDescriptor";
        }, "getTypeUrl");
        TripDescriptor.ScheduleRelationship = (function() {
          var valuesById = {}, values = Object.create(valuesById);
          values[valuesById[0] = "SCHEDULED"] = 0;
          values[valuesById[1] = "ADDED"] = 1;
          values[valuesById[2] = "UNSCHEDULED"] = 2;
          values[valuesById[3] = "CANCELED"] = 3;
          values[valuesById[5] = "REPLACEMENT"] = 5;
          values[valuesById[6] = "DUPLICATED"] = 6;
          values[valuesById[7] = "DELETED"] = 7;
          values[valuesById[8] = "NEW"] = 8;
          return values;
        })();
        TripDescriptor.ModifiedTripSelector = (function() {
          function ModifiedTripSelector(properties) {
            if (properties) {
              for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                  this[keys[i]] = properties[keys[i]];
            }
          }
          __name(ModifiedTripSelector, "ModifiedTripSelector");
          ModifiedTripSelector.prototype.modificationsId = "";
          ModifiedTripSelector.prototype.affectedTripId = "";
          ModifiedTripSelector.prototype.startTime = "";
          ModifiedTripSelector.prototype.startDate = "";
          ModifiedTripSelector.create = /* @__PURE__ */ __name(function create(properties) {
            return new ModifiedTripSelector(properties);
          }, "create");
          ModifiedTripSelector.encode = /* @__PURE__ */ __name(function encode(message, writer) {
            if (!writer)
              writer = $Writer.create();
            if (message.modificationsId != null && Object.hasOwnProperty.call(message, "modificationsId"))
              writer.uint32(
                /* id 1, wireType 2 =*/
                10
              ).string(message.modificationsId);
            if (message.affectedTripId != null && Object.hasOwnProperty.call(message, "affectedTripId"))
              writer.uint32(
                /* id 2, wireType 2 =*/
                18
              ).string(message.affectedTripId);
            if (message.startTime != null && Object.hasOwnProperty.call(message, "startTime"))
              writer.uint32(
                /* id 3, wireType 2 =*/
                26
              ).string(message.startTime);
            if (message.startDate != null && Object.hasOwnProperty.call(message, "startDate"))
              writer.uint32(
                /* id 4, wireType 2 =*/
                34
              ).string(message.startDate);
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
              for (var i = 0; i < message.$unknowns.length; ++i)
                writer.raw(message.$unknowns[i]);
            return writer;
          }, "encode");
          ModifiedTripSelector.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
          }, "encodeDelimited");
          ModifiedTripSelector.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
              reader = $Reader.create(reader);
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $Reader.recursionLimit)
              throw Error("max depth exceeded");
            var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.TripDescriptor.ModifiedTripSelector();
            while (reader.pos < end) {
              var start = reader.pos;
              var tag = reader.tag();
              if (tag === _end) {
                _end = void 0;
                break;
              }
              var wireType = tag & 7;
              switch (tag >>>= 3) {
                case 1: {
                  if (wireType !== 2)
                    break;
                  message.modificationsId = reader.string();
                  continue;
                }
                case 2: {
                  if (wireType !== 2)
                    break;
                  message.affectedTripId = reader.string();
                  continue;
                }
                case 3: {
                  if (wireType !== 2)
                    break;
                  message.startTime = reader.string();
                  continue;
                }
                case 4: {
                  if (wireType !== 2)
                    break;
                  message.startDate = reader.string();
                  continue;
                }
              }
              reader.skipType(wireType, _depth, tag);
              $util.makeProp(message, "$unknowns", false);
              (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
            }
            if (_end !== void 0)
              throw Error("missing end group");
            return message;
          }, "decode");
          ModifiedTripSelector.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
              reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
          }, "decodeDelimited");
          ModifiedTripSelector.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
            if (typeof message !== "object" || message === null)
              return "object expected";
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              return "max depth exceeded";
            if (message.modificationsId != null && message.hasOwnProperty("modificationsId")) {
              if (!$util.isString(message.modificationsId))
                return "modificationsId: string expected";
            }
            if (message.affectedTripId != null && message.hasOwnProperty("affectedTripId")) {
              if (!$util.isString(message.affectedTripId))
                return "affectedTripId: string expected";
            }
            if (message.startTime != null && message.hasOwnProperty("startTime")) {
              if (!$util.isString(message.startTime))
                return "startTime: string expected";
            }
            if (message.startDate != null && message.hasOwnProperty("startDate")) {
              if (!$util.isString(message.startDate))
                return "startDate: string expected";
            }
            return null;
          }, "verify");
          ModifiedTripSelector.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
            if (object instanceof $root.transit_realtime.TripDescriptor.ModifiedTripSelector)
              return object;
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              throw Error("max depth exceeded");
            var message = new $root.transit_realtime.TripDescriptor.ModifiedTripSelector();
            if (object.modificationsId != null)
              message.modificationsId = String(object.modificationsId);
            if (object.affectedTripId != null)
              message.affectedTripId = String(object.affectedTripId);
            if (object.startTime != null)
              message.startTime = String(object.startTime);
            if (object.startDate != null)
              message.startDate = String(object.startDate);
            return message;
          }, "fromObject");
          ModifiedTripSelector.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
            if (!options)
              options = {};
            var object = {};
            if (options.defaults) {
              object.modificationsId = "";
              object.affectedTripId = "";
              object.startTime = "";
              object.startDate = "";
            }
            if (message.modificationsId != null && message.hasOwnProperty("modificationsId"))
              object.modificationsId = message.modificationsId;
            if (message.affectedTripId != null && message.hasOwnProperty("affectedTripId"))
              object.affectedTripId = message.affectedTripId;
            if (message.startTime != null && message.hasOwnProperty("startTime"))
              object.startTime = message.startTime;
            if (message.startDate != null && message.hasOwnProperty("startDate"))
              object.startDate = message.startDate;
            return object;
          }, "toObject");
          ModifiedTripSelector.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
          }, "toJSON");
          ModifiedTripSelector.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
            if (prefix === void 0)
              prefix = "type.googleapis.com";
            return prefix + "/transit_realtime.TripDescriptor.ModifiedTripSelector";
          }, "getTypeUrl");
          return ModifiedTripSelector;
        })();
        return TripDescriptor;
      })();
      transit_realtime2.VehicleDescriptor = (function() {
        function VehicleDescriptor(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(VehicleDescriptor, "VehicleDescriptor");
        VehicleDescriptor.prototype.id = "";
        VehicleDescriptor.prototype.label = "";
        VehicleDescriptor.prototype.licensePlate = "";
        VehicleDescriptor.prototype.wheelchairAccessible = 0;
        VehicleDescriptor.create = /* @__PURE__ */ __name(function create(properties) {
          return new VehicleDescriptor(properties);
        }, "create");
        VehicleDescriptor.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(
              /* id 1, wireType 2 =*/
              10
            ).string(message.id);
          if (message.label != null && Object.hasOwnProperty.call(message, "label"))
            writer.uint32(
              /* id 2, wireType 2 =*/
              18
            ).string(message.label);
          if (message.licensePlate != null && Object.hasOwnProperty.call(message, "licensePlate"))
            writer.uint32(
              /* id 3, wireType 2 =*/
              26
            ).string(message.licensePlate);
          if (message.wheelchairAccessible != null && Object.hasOwnProperty.call(message, "wheelchairAccessible"))
            writer.uint32(
              /* id 4, wireType 0 =*/
              32
            ).int32(message.wheelchairAccessible);
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        VehicleDescriptor.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        VehicleDescriptor.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.VehicleDescriptor();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 2)
                  break;
                message.id = reader.string();
                continue;
              }
              case 2: {
                if (wireType !== 2)
                  break;
                message.label = reader.string();
                continue;
              }
              case 3: {
                if (wireType !== 2)
                  break;
                message.licensePlate = reader.string();
                continue;
              }
              case 4: {
                if (wireType !== 0)
                  break;
                message.wheelchairAccessible = reader.int32();
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          return message;
        }, "decode");
        VehicleDescriptor.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        VehicleDescriptor.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          if (message.id != null && message.hasOwnProperty("id")) {
            if (!$util.isString(message.id))
              return "id: string expected";
          }
          if (message.label != null && message.hasOwnProperty("label")) {
            if (!$util.isString(message.label))
              return "label: string expected";
          }
          if (message.licensePlate != null && message.hasOwnProperty("licensePlate")) {
            if (!$util.isString(message.licensePlate))
              return "licensePlate: string expected";
          }
          if (message.wheelchairAccessible != null && message.hasOwnProperty("wheelchairAccessible"))
            switch (message.wheelchairAccessible) {
              default:
                return "wheelchairAccessible: enum value expected";
              case 0:
              case 1:
              case 2:
              case 3:
                break;
            }
          return null;
        }, "verify");
        VehicleDescriptor.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.VehicleDescriptor)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.VehicleDescriptor();
          if (object.id != null)
            message.id = String(object.id);
          if (object.label != null)
            message.label = String(object.label);
          if (object.licensePlate != null)
            message.licensePlate = String(object.licensePlate);
          switch (object.wheelchairAccessible) {
            default:
              if (typeof object.wheelchairAccessible === "number") {
                message.wheelchairAccessible = object.wheelchairAccessible;
                break;
              }
              break;
            case "NO_VALUE":
            case 0:
              message.wheelchairAccessible = 0;
              break;
            case "UNKNOWN":
            case 1:
              message.wheelchairAccessible = 1;
              break;
            case "WHEELCHAIR_ACCESSIBLE":
            case 2:
              message.wheelchairAccessible = 2;
              break;
            case "WHEELCHAIR_INACCESSIBLE":
            case 3:
              message.wheelchairAccessible = 3;
              break;
          }
          return message;
        }, "fromObject");
        VehicleDescriptor.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.defaults) {
            object.id = "";
            object.label = "";
            object.licensePlate = "";
            object.wheelchairAccessible = options.enums === String ? "NO_VALUE" : 0;
          }
          if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
          if (message.label != null && message.hasOwnProperty("label"))
            object.label = message.label;
          if (message.licensePlate != null && message.hasOwnProperty("licensePlate"))
            object.licensePlate = message.licensePlate;
          if (message.wheelchairAccessible != null && message.hasOwnProperty("wheelchairAccessible"))
            object.wheelchairAccessible = options.enums === String ? $root.transit_realtime.VehicleDescriptor.WheelchairAccessible[message.wheelchairAccessible] === void 0 ? message.wheelchairAccessible : $root.transit_realtime.VehicleDescriptor.WheelchairAccessible[message.wheelchairAccessible] : message.wheelchairAccessible;
          return object;
        }, "toObject");
        VehicleDescriptor.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        VehicleDescriptor.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.VehicleDescriptor";
        }, "getTypeUrl");
        VehicleDescriptor.WheelchairAccessible = (function() {
          var valuesById = {}, values = Object.create(valuesById);
          values[valuesById[0] = "NO_VALUE"] = 0;
          values[valuesById[1] = "UNKNOWN"] = 1;
          values[valuesById[2] = "WHEELCHAIR_ACCESSIBLE"] = 2;
          values[valuesById[3] = "WHEELCHAIR_INACCESSIBLE"] = 3;
          return values;
        })();
        return VehicleDescriptor;
      })();
      transit_realtime2.EntitySelector = (function() {
        function EntitySelector(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(EntitySelector, "EntitySelector");
        EntitySelector.prototype.agencyId = "";
        EntitySelector.prototype.routeId = "";
        EntitySelector.prototype.routeType = 0;
        EntitySelector.prototype.trip = null;
        EntitySelector.prototype.stopId = "";
        EntitySelector.prototype.directionId = 0;
        EntitySelector.create = /* @__PURE__ */ __name(function create(properties) {
          return new EntitySelector(properties);
        }, "create");
        EntitySelector.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.agencyId != null && Object.hasOwnProperty.call(message, "agencyId"))
            writer.uint32(
              /* id 1, wireType 2 =*/
              10
            ).string(message.agencyId);
          if (message.routeId != null && Object.hasOwnProperty.call(message, "routeId"))
            writer.uint32(
              /* id 2, wireType 2 =*/
              18
            ).string(message.routeId);
          if (message.routeType != null && Object.hasOwnProperty.call(message, "routeType"))
            writer.uint32(
              /* id 3, wireType 0 =*/
              24
            ).int32(message.routeType);
          if (message.trip != null && Object.hasOwnProperty.call(message, "trip"))
            $root.transit_realtime.TripDescriptor.encode(message.trip, writer.uint32(
              /* id 4, wireType 2 =*/
              34
            ).fork()).ldelim();
          if (message.stopId != null && Object.hasOwnProperty.call(message, "stopId"))
            writer.uint32(
              /* id 5, wireType 2 =*/
              42
            ).string(message.stopId);
          if (message.directionId != null && Object.hasOwnProperty.call(message, "directionId"))
            writer.uint32(
              /* id 6, wireType 0 =*/
              48
            ).uint32(message.directionId);
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        EntitySelector.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        EntitySelector.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.EntitySelector();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 2)
                  break;
                message.agencyId = reader.string();
                continue;
              }
              case 2: {
                if (wireType !== 2)
                  break;
                message.routeId = reader.string();
                continue;
              }
              case 3: {
                if (wireType !== 0)
                  break;
                message.routeType = reader.int32();
                continue;
              }
              case 4: {
                if (wireType !== 2)
                  break;
                message.trip = $root.transit_realtime.TripDescriptor.decode(reader, reader.uint32(), void 0, _depth + 1, message.trip);
                continue;
              }
              case 5: {
                if (wireType !== 2)
                  break;
                message.stopId = reader.string();
                continue;
              }
              case 6: {
                if (wireType !== 0)
                  break;
                message.directionId = reader.uint32();
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          return message;
        }, "decode");
        EntitySelector.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        EntitySelector.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          if (message.agencyId != null && message.hasOwnProperty("agencyId")) {
            if (!$util.isString(message.agencyId))
              return "agencyId: string expected";
          }
          if (message.routeId != null && message.hasOwnProperty("routeId")) {
            if (!$util.isString(message.routeId))
              return "routeId: string expected";
          }
          if (message.routeType != null && message.hasOwnProperty("routeType")) {
            if (!$util.isInteger(message.routeType))
              return "routeType: integer expected";
          }
          if (message.trip != null && message.hasOwnProperty("trip")) {
            var error = $root.transit_realtime.TripDescriptor.verify(message.trip, _depth + 1);
            if (error)
              return "trip." + error;
          }
          if (message.stopId != null && message.hasOwnProperty("stopId")) {
            if (!$util.isString(message.stopId))
              return "stopId: string expected";
          }
          if (message.directionId != null && message.hasOwnProperty("directionId")) {
            if (!$util.isInteger(message.directionId))
              return "directionId: integer expected";
          }
          return null;
        }, "verify");
        EntitySelector.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.EntitySelector)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.EntitySelector();
          if (object.agencyId != null)
            message.agencyId = String(object.agencyId);
          if (object.routeId != null)
            message.routeId = String(object.routeId);
          if (object.routeType != null)
            message.routeType = object.routeType | 0;
          if (object.trip != null) {
            if (typeof object.trip !== "object")
              throw TypeError(".transit_realtime.EntitySelector.trip: object expected");
            message.trip = $root.transit_realtime.TripDescriptor.fromObject(object.trip, _depth + 1);
          }
          if (object.stopId != null)
            message.stopId = String(object.stopId);
          if (object.directionId != null)
            message.directionId = object.directionId >>> 0;
          return message;
        }, "fromObject");
        EntitySelector.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.defaults) {
            object.agencyId = "";
            object.routeId = "";
            object.routeType = 0;
            object.trip = null;
            object.stopId = "";
            object.directionId = 0;
          }
          if (message.agencyId != null && message.hasOwnProperty("agencyId"))
            object.agencyId = message.agencyId;
          if (message.routeId != null && message.hasOwnProperty("routeId"))
            object.routeId = message.routeId;
          if (message.routeType != null && message.hasOwnProperty("routeType"))
            object.routeType = message.routeType;
          if (message.trip != null && message.hasOwnProperty("trip"))
            object.trip = $root.transit_realtime.TripDescriptor.toObject(message.trip, options);
          if (message.stopId != null && message.hasOwnProperty("stopId"))
            object.stopId = message.stopId;
          if (message.directionId != null && message.hasOwnProperty("directionId"))
            object.directionId = message.directionId;
          return object;
        }, "toObject");
        EntitySelector.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        EntitySelector.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.EntitySelector";
        }, "getTypeUrl");
        return EntitySelector;
      })();
      transit_realtime2.TranslatedString = (function() {
        function TranslatedString(properties) {
          this.translation = [];
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(TranslatedString, "TranslatedString");
        TranslatedString.prototype.translation = $util.emptyArray;
        TranslatedString.create = /* @__PURE__ */ __name(function create(properties) {
          return new TranslatedString(properties);
        }, "create");
        TranslatedString.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.translation != null && message.translation.length)
            for (var i = 0; i < message.translation.length; ++i)
              $root.transit_realtime.TranslatedString.Translation.encode(message.translation[i], writer.uint32(
                /* id 1, wireType 2 =*/
                10
              ).fork()).ldelim();
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        TranslatedString.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        TranslatedString.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.TranslatedString();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 2)
                  break;
                if (!(message.translation && message.translation.length))
                  message.translation = [];
                message.translation.push($root.transit_realtime.TranslatedString.Translation.decode(reader, reader.uint32(), void 0, _depth + 1));
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          return message;
        }, "decode");
        TranslatedString.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        TranslatedString.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          if (message.translation != null && message.hasOwnProperty("translation")) {
            if (!Array.isArray(message.translation))
              return "translation: array expected";
            for (var i = 0; i < message.translation.length; ++i) {
              var error = $root.transit_realtime.TranslatedString.Translation.verify(message.translation[i], _depth + 1);
              if (error)
                return "translation." + error;
            }
          }
          return null;
        }, "verify");
        TranslatedString.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.TranslatedString)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.TranslatedString();
          if (object.translation) {
            if (!Array.isArray(object.translation))
              throw TypeError(".transit_realtime.TranslatedString.translation: array expected");
            message.translation = Array(object.translation.length);
            for (var i = 0; i < object.translation.length; ++i) {
              if (typeof object.translation[i] !== "object")
                throw TypeError(".transit_realtime.TranslatedString.translation: object expected");
              message.translation[i] = $root.transit_realtime.TranslatedString.Translation.fromObject(object.translation[i], _depth + 1);
            }
          }
          return message;
        }, "fromObject");
        TranslatedString.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.arrays || options.defaults)
            object.translation = [];
          if (message.translation && message.translation.length) {
            object.translation = Array(message.translation.length);
            for (var j = 0; j < message.translation.length; ++j)
              object.translation[j] = $root.transit_realtime.TranslatedString.Translation.toObject(message.translation[j], options);
          }
          return object;
        }, "toObject");
        TranslatedString.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        TranslatedString.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.TranslatedString";
        }, "getTypeUrl");
        TranslatedString.Translation = (function() {
          function Translation(properties) {
            if (properties) {
              for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                  this[keys[i]] = properties[keys[i]];
            }
          }
          __name(Translation, "Translation");
          Translation.prototype.text = "";
          Translation.prototype.language = "";
          Translation.create = /* @__PURE__ */ __name(function create(properties) {
            return new Translation(properties);
          }, "create");
          Translation.encode = /* @__PURE__ */ __name(function encode(message, writer) {
            if (!writer)
              writer = $Writer.create();
            writer.uint32(
              /* id 1, wireType 2 =*/
              10
            ).string(message.text);
            if (message.language != null && Object.hasOwnProperty.call(message, "language"))
              writer.uint32(
                /* id 2, wireType 2 =*/
                18
              ).string(message.language);
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
              for (var i = 0; i < message.$unknowns.length; ++i)
                writer.raw(message.$unknowns[i]);
            return writer;
          }, "encode");
          Translation.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
          }, "encodeDelimited");
          Translation.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
              reader = $Reader.create(reader);
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $Reader.recursionLimit)
              throw Error("max depth exceeded");
            var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.TranslatedString.Translation();
            while (reader.pos < end) {
              var start = reader.pos;
              var tag = reader.tag();
              if (tag === _end) {
                _end = void 0;
                break;
              }
              var wireType = tag & 7;
              switch (tag >>>= 3) {
                case 1: {
                  if (wireType !== 2)
                    break;
                  message.text = reader.string();
                  continue;
                }
                case 2: {
                  if (wireType !== 2)
                    break;
                  message.language = reader.string();
                  continue;
                }
              }
              reader.skipType(wireType, _depth, tag);
              $util.makeProp(message, "$unknowns", false);
              (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
            }
            if (_end !== void 0)
              throw Error("missing end group");
            if (!message.hasOwnProperty("text"))
              throw $util.ProtocolError("missing required 'text'", { instance: message });
            return message;
          }, "decode");
          Translation.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
              reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
          }, "decodeDelimited");
          Translation.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
            if (typeof message !== "object" || message === null)
              return "object expected";
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              return "max depth exceeded";
            if (!$util.isString(message.text))
              return "text: string expected";
            if (message.language != null && message.hasOwnProperty("language")) {
              if (!$util.isString(message.language))
                return "language: string expected";
            }
            return null;
          }, "verify");
          Translation.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
            if (object instanceof $root.transit_realtime.TranslatedString.Translation)
              return object;
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              throw Error("max depth exceeded");
            var message = new $root.transit_realtime.TranslatedString.Translation();
            if (object.text != null)
              message.text = String(object.text);
            if (object.language != null)
              message.language = String(object.language);
            return message;
          }, "fromObject");
          Translation.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
            if (!options)
              options = {};
            var object = {};
            if (options.defaults) {
              object.text = "";
              object.language = "";
            }
            if (message.text != null && message.hasOwnProperty("text"))
              object.text = message.text;
            if (message.language != null && message.hasOwnProperty("language"))
              object.language = message.language;
            return object;
          }, "toObject");
          Translation.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
          }, "toJSON");
          Translation.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
            if (prefix === void 0)
              prefix = "type.googleapis.com";
            return prefix + "/transit_realtime.TranslatedString.Translation";
          }, "getTypeUrl");
          return Translation;
        })();
        return TranslatedString;
      })();
      transit_realtime2.TranslatedImage = (function() {
        function TranslatedImage(properties) {
          this.localizedImage = [];
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(TranslatedImage, "TranslatedImage");
        TranslatedImage.prototype.localizedImage = $util.emptyArray;
        TranslatedImage.create = /* @__PURE__ */ __name(function create(properties) {
          return new TranslatedImage(properties);
        }, "create");
        TranslatedImage.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.localizedImage != null && message.localizedImage.length)
            for (var i = 0; i < message.localizedImage.length; ++i)
              $root.transit_realtime.TranslatedImage.LocalizedImage.encode(message.localizedImage[i], writer.uint32(
                /* id 1, wireType 2 =*/
                10
              ).fork()).ldelim();
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        TranslatedImage.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        TranslatedImage.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.TranslatedImage();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 2)
                  break;
                if (!(message.localizedImage && message.localizedImage.length))
                  message.localizedImage = [];
                message.localizedImage.push($root.transit_realtime.TranslatedImage.LocalizedImage.decode(reader, reader.uint32(), void 0, _depth + 1));
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          return message;
        }, "decode");
        TranslatedImage.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        TranslatedImage.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          if (message.localizedImage != null && message.hasOwnProperty("localizedImage")) {
            if (!Array.isArray(message.localizedImage))
              return "localizedImage: array expected";
            for (var i = 0; i < message.localizedImage.length; ++i) {
              var error = $root.transit_realtime.TranslatedImage.LocalizedImage.verify(message.localizedImage[i], _depth + 1);
              if (error)
                return "localizedImage." + error;
            }
          }
          return null;
        }, "verify");
        TranslatedImage.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.TranslatedImage)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.TranslatedImage();
          if (object.localizedImage) {
            if (!Array.isArray(object.localizedImage))
              throw TypeError(".transit_realtime.TranslatedImage.localizedImage: array expected");
            message.localizedImage = Array(object.localizedImage.length);
            for (var i = 0; i < object.localizedImage.length; ++i) {
              if (typeof object.localizedImage[i] !== "object")
                throw TypeError(".transit_realtime.TranslatedImage.localizedImage: object expected");
              message.localizedImage[i] = $root.transit_realtime.TranslatedImage.LocalizedImage.fromObject(object.localizedImage[i], _depth + 1);
            }
          }
          return message;
        }, "fromObject");
        TranslatedImage.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.arrays || options.defaults)
            object.localizedImage = [];
          if (message.localizedImage && message.localizedImage.length) {
            object.localizedImage = Array(message.localizedImage.length);
            for (var j = 0; j < message.localizedImage.length; ++j)
              object.localizedImage[j] = $root.transit_realtime.TranslatedImage.LocalizedImage.toObject(message.localizedImage[j], options);
          }
          return object;
        }, "toObject");
        TranslatedImage.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        TranslatedImage.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.TranslatedImage";
        }, "getTypeUrl");
        TranslatedImage.LocalizedImage = (function() {
          function LocalizedImage(properties) {
            if (properties) {
              for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                  this[keys[i]] = properties[keys[i]];
            }
          }
          __name(LocalizedImage, "LocalizedImage");
          LocalizedImage.prototype.url = "";
          LocalizedImage.prototype.mediaType = "";
          LocalizedImage.prototype.language = "";
          LocalizedImage.create = /* @__PURE__ */ __name(function create(properties) {
            return new LocalizedImage(properties);
          }, "create");
          LocalizedImage.encode = /* @__PURE__ */ __name(function encode(message, writer) {
            if (!writer)
              writer = $Writer.create();
            writer.uint32(
              /* id 1, wireType 2 =*/
              10
            ).string(message.url);
            writer.uint32(
              /* id 2, wireType 2 =*/
              18
            ).string(message.mediaType);
            if (message.language != null && Object.hasOwnProperty.call(message, "language"))
              writer.uint32(
                /* id 3, wireType 2 =*/
                26
              ).string(message.language);
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
              for (var i = 0; i < message.$unknowns.length; ++i)
                writer.raw(message.$unknowns[i]);
            return writer;
          }, "encode");
          LocalizedImage.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
          }, "encodeDelimited");
          LocalizedImage.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
              reader = $Reader.create(reader);
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $Reader.recursionLimit)
              throw Error("max depth exceeded");
            var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.TranslatedImage.LocalizedImage();
            while (reader.pos < end) {
              var start = reader.pos;
              var tag = reader.tag();
              if (tag === _end) {
                _end = void 0;
                break;
              }
              var wireType = tag & 7;
              switch (tag >>>= 3) {
                case 1: {
                  if (wireType !== 2)
                    break;
                  message.url = reader.string();
                  continue;
                }
                case 2: {
                  if (wireType !== 2)
                    break;
                  message.mediaType = reader.string();
                  continue;
                }
                case 3: {
                  if (wireType !== 2)
                    break;
                  message.language = reader.string();
                  continue;
                }
              }
              reader.skipType(wireType, _depth, tag);
              $util.makeProp(message, "$unknowns", false);
              (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
            }
            if (_end !== void 0)
              throw Error("missing end group");
            if (!message.hasOwnProperty("url"))
              throw $util.ProtocolError("missing required 'url'", { instance: message });
            if (!message.hasOwnProperty("mediaType"))
              throw $util.ProtocolError("missing required 'mediaType'", { instance: message });
            return message;
          }, "decode");
          LocalizedImage.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
              reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
          }, "decodeDelimited");
          LocalizedImage.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
            if (typeof message !== "object" || message === null)
              return "object expected";
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              return "max depth exceeded";
            if (!$util.isString(message.url))
              return "url: string expected";
            if (!$util.isString(message.mediaType))
              return "mediaType: string expected";
            if (message.language != null && message.hasOwnProperty("language")) {
              if (!$util.isString(message.language))
                return "language: string expected";
            }
            return null;
          }, "verify");
          LocalizedImage.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
            if (object instanceof $root.transit_realtime.TranslatedImage.LocalizedImage)
              return object;
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              throw Error("max depth exceeded");
            var message = new $root.transit_realtime.TranslatedImage.LocalizedImage();
            if (object.url != null)
              message.url = String(object.url);
            if (object.mediaType != null)
              message.mediaType = String(object.mediaType);
            if (object.language != null)
              message.language = String(object.language);
            return message;
          }, "fromObject");
          LocalizedImage.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
            if (!options)
              options = {};
            var object = {};
            if (options.defaults) {
              object.url = "";
              object.mediaType = "";
              object.language = "";
            }
            if (message.url != null && message.hasOwnProperty("url"))
              object.url = message.url;
            if (message.mediaType != null && message.hasOwnProperty("mediaType"))
              object.mediaType = message.mediaType;
            if (message.language != null && message.hasOwnProperty("language"))
              object.language = message.language;
            return object;
          }, "toObject");
          LocalizedImage.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
          }, "toJSON");
          LocalizedImage.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
            if (prefix === void 0)
              prefix = "type.googleapis.com";
            return prefix + "/transit_realtime.TranslatedImage.LocalizedImage";
          }, "getTypeUrl");
          return LocalizedImage;
        })();
        return TranslatedImage;
      })();
      transit_realtime2.Shape = (function() {
        function Shape(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(Shape, "Shape");
        Shape.prototype.shapeId = "";
        Shape.prototype.encodedPolyline = "";
        Shape.create = /* @__PURE__ */ __name(function create(properties) {
          return new Shape(properties);
        }, "create");
        Shape.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.shapeId != null && Object.hasOwnProperty.call(message, "shapeId"))
            writer.uint32(
              /* id 1, wireType 2 =*/
              10
            ).string(message.shapeId);
          if (message.encodedPolyline != null && Object.hasOwnProperty.call(message, "encodedPolyline"))
            writer.uint32(
              /* id 2, wireType 2 =*/
              18
            ).string(message.encodedPolyline);
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        Shape.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        Shape.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.Shape();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 2)
                  break;
                message.shapeId = reader.string();
                continue;
              }
              case 2: {
                if (wireType !== 2)
                  break;
                message.encodedPolyline = reader.string();
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          return message;
        }, "decode");
        Shape.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        Shape.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          if (message.shapeId != null && message.hasOwnProperty("shapeId")) {
            if (!$util.isString(message.shapeId))
              return "shapeId: string expected";
          }
          if (message.encodedPolyline != null && message.hasOwnProperty("encodedPolyline")) {
            if (!$util.isString(message.encodedPolyline))
              return "encodedPolyline: string expected";
          }
          return null;
        }, "verify");
        Shape.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.Shape)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.Shape();
          if (object.shapeId != null)
            message.shapeId = String(object.shapeId);
          if (object.encodedPolyline != null)
            message.encodedPolyline = String(object.encodedPolyline);
          return message;
        }, "fromObject");
        Shape.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.defaults) {
            object.shapeId = "";
            object.encodedPolyline = "";
          }
          if (message.shapeId != null && message.hasOwnProperty("shapeId"))
            object.shapeId = message.shapeId;
          if (message.encodedPolyline != null && message.hasOwnProperty("encodedPolyline"))
            object.encodedPolyline = message.encodedPolyline;
          return object;
        }, "toObject");
        Shape.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        Shape.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.Shape";
        }, "getTypeUrl");
        return Shape;
      })();
      transit_realtime2.Stop = (function() {
        function Stop(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(Stop, "Stop");
        Stop.prototype.stopId = "";
        Stop.prototype.stopCode = null;
        Stop.prototype.stopName = null;
        Stop.prototype.ttsStopName = null;
        Stop.prototype.stopDesc = null;
        Stop.prototype.stopLat = 0;
        Stop.prototype.stopLon = 0;
        Stop.prototype.zoneId = "";
        Stop.prototype.stopUrl = null;
        Stop.prototype.parentStation = "";
        Stop.prototype.stopTimezone = "";
        Stop.prototype.wheelchairBoarding = 0;
        Stop.prototype.levelId = "";
        Stop.prototype.platformCode = null;
        Stop.create = /* @__PURE__ */ __name(function create(properties) {
          return new Stop(properties);
        }, "create");
        Stop.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.stopId != null && Object.hasOwnProperty.call(message, "stopId"))
            writer.uint32(
              /* id 1, wireType 2 =*/
              10
            ).string(message.stopId);
          if (message.stopCode != null && Object.hasOwnProperty.call(message, "stopCode"))
            $root.transit_realtime.TranslatedString.encode(message.stopCode, writer.uint32(
              /* id 2, wireType 2 =*/
              18
            ).fork()).ldelim();
          if (message.stopName != null && Object.hasOwnProperty.call(message, "stopName"))
            $root.transit_realtime.TranslatedString.encode(message.stopName, writer.uint32(
              /* id 3, wireType 2 =*/
              26
            ).fork()).ldelim();
          if (message.ttsStopName != null && Object.hasOwnProperty.call(message, "ttsStopName"))
            $root.transit_realtime.TranslatedString.encode(message.ttsStopName, writer.uint32(
              /* id 4, wireType 2 =*/
              34
            ).fork()).ldelim();
          if (message.stopDesc != null && Object.hasOwnProperty.call(message, "stopDesc"))
            $root.transit_realtime.TranslatedString.encode(message.stopDesc, writer.uint32(
              /* id 5, wireType 2 =*/
              42
            ).fork()).ldelim();
          if (message.stopLat != null && Object.hasOwnProperty.call(message, "stopLat"))
            writer.uint32(
              /* id 6, wireType 5 =*/
              53
            ).float(message.stopLat);
          if (message.stopLon != null && Object.hasOwnProperty.call(message, "stopLon"))
            writer.uint32(
              /* id 7, wireType 5 =*/
              61
            ).float(message.stopLon);
          if (message.zoneId != null && Object.hasOwnProperty.call(message, "zoneId"))
            writer.uint32(
              /* id 8, wireType 2 =*/
              66
            ).string(message.zoneId);
          if (message.stopUrl != null && Object.hasOwnProperty.call(message, "stopUrl"))
            $root.transit_realtime.TranslatedString.encode(message.stopUrl, writer.uint32(
              /* id 9, wireType 2 =*/
              74
            ).fork()).ldelim();
          if (message.parentStation != null && Object.hasOwnProperty.call(message, "parentStation"))
            writer.uint32(
              /* id 11, wireType 2 =*/
              90
            ).string(message.parentStation);
          if (message.stopTimezone != null && Object.hasOwnProperty.call(message, "stopTimezone"))
            writer.uint32(
              /* id 12, wireType 2 =*/
              98
            ).string(message.stopTimezone);
          if (message.wheelchairBoarding != null && Object.hasOwnProperty.call(message, "wheelchairBoarding"))
            writer.uint32(
              /* id 13, wireType 0 =*/
              104
            ).int32(message.wheelchairBoarding);
          if (message.levelId != null && Object.hasOwnProperty.call(message, "levelId"))
            writer.uint32(
              /* id 14, wireType 2 =*/
              114
            ).string(message.levelId);
          if (message.platformCode != null && Object.hasOwnProperty.call(message, "platformCode"))
            $root.transit_realtime.TranslatedString.encode(message.platformCode, writer.uint32(
              /* id 15, wireType 2 =*/
              122
            ).fork()).ldelim();
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        Stop.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        Stop.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.Stop();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 2)
                  break;
                message.stopId = reader.string();
                continue;
              }
              case 2: {
                if (wireType !== 2)
                  break;
                message.stopCode = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32(), void 0, _depth + 1, message.stopCode);
                continue;
              }
              case 3: {
                if (wireType !== 2)
                  break;
                message.stopName = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32(), void 0, _depth + 1, message.stopName);
                continue;
              }
              case 4: {
                if (wireType !== 2)
                  break;
                message.ttsStopName = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32(), void 0, _depth + 1, message.ttsStopName);
                continue;
              }
              case 5: {
                if (wireType !== 2)
                  break;
                message.stopDesc = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32(), void 0, _depth + 1, message.stopDesc);
                continue;
              }
              case 6: {
                if (wireType !== 5)
                  break;
                message.stopLat = reader.float();
                continue;
              }
              case 7: {
                if (wireType !== 5)
                  break;
                message.stopLon = reader.float();
                continue;
              }
              case 8: {
                if (wireType !== 2)
                  break;
                message.zoneId = reader.string();
                continue;
              }
              case 9: {
                if (wireType !== 2)
                  break;
                message.stopUrl = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32(), void 0, _depth + 1, message.stopUrl);
                continue;
              }
              case 11: {
                if (wireType !== 2)
                  break;
                message.parentStation = reader.string();
                continue;
              }
              case 12: {
                if (wireType !== 2)
                  break;
                message.stopTimezone = reader.string();
                continue;
              }
              case 13: {
                if (wireType !== 0)
                  break;
                message.wheelchairBoarding = reader.int32();
                continue;
              }
              case 14: {
                if (wireType !== 2)
                  break;
                message.levelId = reader.string();
                continue;
              }
              case 15: {
                if (wireType !== 2)
                  break;
                message.platformCode = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32(), void 0, _depth + 1, message.platformCode);
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          return message;
        }, "decode");
        Stop.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        Stop.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          if (message.stopId != null && message.hasOwnProperty("stopId")) {
            if (!$util.isString(message.stopId))
              return "stopId: string expected";
          }
          if (message.stopCode != null && message.hasOwnProperty("stopCode")) {
            var error = $root.transit_realtime.TranslatedString.verify(message.stopCode, _depth + 1);
            if (error)
              return "stopCode." + error;
          }
          if (message.stopName != null && message.hasOwnProperty("stopName")) {
            var error = $root.transit_realtime.TranslatedString.verify(message.stopName, _depth + 1);
            if (error)
              return "stopName." + error;
          }
          if (message.ttsStopName != null && message.hasOwnProperty("ttsStopName")) {
            var error = $root.transit_realtime.TranslatedString.verify(message.ttsStopName, _depth + 1);
            if (error)
              return "ttsStopName." + error;
          }
          if (message.stopDesc != null && message.hasOwnProperty("stopDesc")) {
            var error = $root.transit_realtime.TranslatedString.verify(message.stopDesc, _depth + 1);
            if (error)
              return "stopDesc." + error;
          }
          if (message.stopLat != null && message.hasOwnProperty("stopLat")) {
            if (typeof message.stopLat !== "number")
              return "stopLat: number expected";
          }
          if (message.stopLon != null && message.hasOwnProperty("stopLon")) {
            if (typeof message.stopLon !== "number")
              return "stopLon: number expected";
          }
          if (message.zoneId != null && message.hasOwnProperty("zoneId")) {
            if (!$util.isString(message.zoneId))
              return "zoneId: string expected";
          }
          if (message.stopUrl != null && message.hasOwnProperty("stopUrl")) {
            var error = $root.transit_realtime.TranslatedString.verify(message.stopUrl, _depth + 1);
            if (error)
              return "stopUrl." + error;
          }
          if (message.parentStation != null && message.hasOwnProperty("parentStation")) {
            if (!$util.isString(message.parentStation))
              return "parentStation: string expected";
          }
          if (message.stopTimezone != null && message.hasOwnProperty("stopTimezone")) {
            if (!$util.isString(message.stopTimezone))
              return "stopTimezone: string expected";
          }
          if (message.wheelchairBoarding != null && message.hasOwnProperty("wheelchairBoarding"))
            switch (message.wheelchairBoarding) {
              default:
                return "wheelchairBoarding: enum value expected";
              case 0:
              case 1:
              case 2:
                break;
            }
          if (message.levelId != null && message.hasOwnProperty("levelId")) {
            if (!$util.isString(message.levelId))
              return "levelId: string expected";
          }
          if (message.platformCode != null && message.hasOwnProperty("platformCode")) {
            var error = $root.transit_realtime.TranslatedString.verify(message.platformCode, _depth + 1);
            if (error)
              return "platformCode." + error;
          }
          return null;
        }, "verify");
        Stop.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.Stop)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.Stop();
          if (object.stopId != null)
            message.stopId = String(object.stopId);
          if (object.stopCode != null) {
            if (typeof object.stopCode !== "object")
              throw TypeError(".transit_realtime.Stop.stopCode: object expected");
            message.stopCode = $root.transit_realtime.TranslatedString.fromObject(object.stopCode, _depth + 1);
          }
          if (object.stopName != null) {
            if (typeof object.stopName !== "object")
              throw TypeError(".transit_realtime.Stop.stopName: object expected");
            message.stopName = $root.transit_realtime.TranslatedString.fromObject(object.stopName, _depth + 1);
          }
          if (object.ttsStopName != null) {
            if (typeof object.ttsStopName !== "object")
              throw TypeError(".transit_realtime.Stop.ttsStopName: object expected");
            message.ttsStopName = $root.transit_realtime.TranslatedString.fromObject(object.ttsStopName, _depth + 1);
          }
          if (object.stopDesc != null) {
            if (typeof object.stopDesc !== "object")
              throw TypeError(".transit_realtime.Stop.stopDesc: object expected");
            message.stopDesc = $root.transit_realtime.TranslatedString.fromObject(object.stopDesc, _depth + 1);
          }
          if (object.stopLat != null)
            message.stopLat = Number(object.stopLat);
          if (object.stopLon != null)
            message.stopLon = Number(object.stopLon);
          if (object.zoneId != null)
            message.zoneId = String(object.zoneId);
          if (object.stopUrl != null) {
            if (typeof object.stopUrl !== "object")
              throw TypeError(".transit_realtime.Stop.stopUrl: object expected");
            message.stopUrl = $root.transit_realtime.TranslatedString.fromObject(object.stopUrl, _depth + 1);
          }
          if (object.parentStation != null)
            message.parentStation = String(object.parentStation);
          if (object.stopTimezone != null)
            message.stopTimezone = String(object.stopTimezone);
          switch (object.wheelchairBoarding) {
            default:
              if (typeof object.wheelchairBoarding === "number") {
                message.wheelchairBoarding = object.wheelchairBoarding;
                break;
              }
              break;
            case "UNKNOWN":
            case 0:
              message.wheelchairBoarding = 0;
              break;
            case "AVAILABLE":
            case 1:
              message.wheelchairBoarding = 1;
              break;
            case "NOT_AVAILABLE":
            case 2:
              message.wheelchairBoarding = 2;
              break;
          }
          if (object.levelId != null)
            message.levelId = String(object.levelId);
          if (object.platformCode != null) {
            if (typeof object.platformCode !== "object")
              throw TypeError(".transit_realtime.Stop.platformCode: object expected");
            message.platformCode = $root.transit_realtime.TranslatedString.fromObject(object.platformCode, _depth + 1);
          }
          return message;
        }, "fromObject");
        Stop.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.defaults) {
            object.stopId = "";
            object.stopCode = null;
            object.stopName = null;
            object.ttsStopName = null;
            object.stopDesc = null;
            object.stopLat = 0;
            object.stopLon = 0;
            object.zoneId = "";
            object.stopUrl = null;
            object.parentStation = "";
            object.stopTimezone = "";
            object.wheelchairBoarding = options.enums === String ? "UNKNOWN" : 0;
            object.levelId = "";
            object.platformCode = null;
          }
          if (message.stopId != null && message.hasOwnProperty("stopId"))
            object.stopId = message.stopId;
          if (message.stopCode != null && message.hasOwnProperty("stopCode"))
            object.stopCode = $root.transit_realtime.TranslatedString.toObject(message.stopCode, options);
          if (message.stopName != null && message.hasOwnProperty("stopName"))
            object.stopName = $root.transit_realtime.TranslatedString.toObject(message.stopName, options);
          if (message.ttsStopName != null && message.hasOwnProperty("ttsStopName"))
            object.ttsStopName = $root.transit_realtime.TranslatedString.toObject(message.ttsStopName, options);
          if (message.stopDesc != null && message.hasOwnProperty("stopDesc"))
            object.stopDesc = $root.transit_realtime.TranslatedString.toObject(message.stopDesc, options);
          if (message.stopLat != null && message.hasOwnProperty("stopLat"))
            object.stopLat = options.json && !isFinite(message.stopLat) ? String(message.stopLat) : message.stopLat;
          if (message.stopLon != null && message.hasOwnProperty("stopLon"))
            object.stopLon = options.json && !isFinite(message.stopLon) ? String(message.stopLon) : message.stopLon;
          if (message.zoneId != null && message.hasOwnProperty("zoneId"))
            object.zoneId = message.zoneId;
          if (message.stopUrl != null && message.hasOwnProperty("stopUrl"))
            object.stopUrl = $root.transit_realtime.TranslatedString.toObject(message.stopUrl, options);
          if (message.parentStation != null && message.hasOwnProperty("parentStation"))
            object.parentStation = message.parentStation;
          if (message.stopTimezone != null && message.hasOwnProperty("stopTimezone"))
            object.stopTimezone = message.stopTimezone;
          if (message.wheelchairBoarding != null && message.hasOwnProperty("wheelchairBoarding"))
            object.wheelchairBoarding = options.enums === String ? $root.transit_realtime.Stop.WheelchairBoarding[message.wheelchairBoarding] === void 0 ? message.wheelchairBoarding : $root.transit_realtime.Stop.WheelchairBoarding[message.wheelchairBoarding] : message.wheelchairBoarding;
          if (message.levelId != null && message.hasOwnProperty("levelId"))
            object.levelId = message.levelId;
          if (message.platformCode != null && message.hasOwnProperty("platformCode"))
            object.platformCode = $root.transit_realtime.TranslatedString.toObject(message.platformCode, options);
          return object;
        }, "toObject");
        Stop.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        Stop.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.Stop";
        }, "getTypeUrl");
        Stop.WheelchairBoarding = (function() {
          var valuesById = {}, values = Object.create(valuesById);
          values[valuesById[0] = "UNKNOWN"] = 0;
          values[valuesById[1] = "AVAILABLE"] = 1;
          values[valuesById[2] = "NOT_AVAILABLE"] = 2;
          return values;
        })();
        return Stop;
      })();
      transit_realtime2.TripModifications = (function() {
        function TripModifications(properties) {
          this.selectedTrips = [];
          this.startTimes = [];
          this.serviceDates = [];
          this.modifications = [];
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(TripModifications, "TripModifications");
        TripModifications.prototype.selectedTrips = $util.emptyArray;
        TripModifications.prototype.startTimes = $util.emptyArray;
        TripModifications.prototype.serviceDates = $util.emptyArray;
        TripModifications.prototype.modifications = $util.emptyArray;
        TripModifications.create = /* @__PURE__ */ __name(function create(properties) {
          return new TripModifications(properties);
        }, "create");
        TripModifications.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.selectedTrips != null && message.selectedTrips.length)
            for (var i = 0; i < message.selectedTrips.length; ++i)
              $root.transit_realtime.TripModifications.SelectedTrips.encode(message.selectedTrips[i], writer.uint32(
                /* id 1, wireType 2 =*/
                10
              ).fork()).ldelim();
          if (message.startTimes != null && message.startTimes.length)
            for (var i = 0; i < message.startTimes.length; ++i)
              writer.uint32(
                /* id 2, wireType 2 =*/
                18
              ).string(message.startTimes[i]);
          if (message.serviceDates != null && message.serviceDates.length)
            for (var i = 0; i < message.serviceDates.length; ++i)
              writer.uint32(
                /* id 3, wireType 2 =*/
                26
              ).string(message.serviceDates[i]);
          if (message.modifications != null && message.modifications.length)
            for (var i = 0; i < message.modifications.length; ++i)
              $root.transit_realtime.TripModifications.Modification.encode(message.modifications[i], writer.uint32(
                /* id 4, wireType 2 =*/
                34
              ).fork()).ldelim();
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        TripModifications.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        TripModifications.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.TripModifications();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 2)
                  break;
                if (!(message.selectedTrips && message.selectedTrips.length))
                  message.selectedTrips = [];
                message.selectedTrips.push($root.transit_realtime.TripModifications.SelectedTrips.decode(reader, reader.uint32(), void 0, _depth + 1));
                continue;
              }
              case 2: {
                if (wireType !== 2)
                  break;
                if (!(message.startTimes && message.startTimes.length))
                  message.startTimes = [];
                message.startTimes.push(reader.string());
                continue;
              }
              case 3: {
                if (wireType !== 2)
                  break;
                if (!(message.serviceDates && message.serviceDates.length))
                  message.serviceDates = [];
                message.serviceDates.push(reader.string());
                continue;
              }
              case 4: {
                if (wireType !== 2)
                  break;
                if (!(message.modifications && message.modifications.length))
                  message.modifications = [];
                message.modifications.push($root.transit_realtime.TripModifications.Modification.decode(reader, reader.uint32(), void 0, _depth + 1));
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          return message;
        }, "decode");
        TripModifications.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        TripModifications.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          if (message.selectedTrips != null && message.hasOwnProperty("selectedTrips")) {
            if (!Array.isArray(message.selectedTrips))
              return "selectedTrips: array expected";
            for (var i = 0; i < message.selectedTrips.length; ++i) {
              var error = $root.transit_realtime.TripModifications.SelectedTrips.verify(message.selectedTrips[i], _depth + 1);
              if (error)
                return "selectedTrips." + error;
            }
          }
          if (message.startTimes != null && message.hasOwnProperty("startTimes")) {
            if (!Array.isArray(message.startTimes))
              return "startTimes: array expected";
            for (var i = 0; i < message.startTimes.length; ++i)
              if (!$util.isString(message.startTimes[i]))
                return "startTimes: string[] expected";
          }
          if (message.serviceDates != null && message.hasOwnProperty("serviceDates")) {
            if (!Array.isArray(message.serviceDates))
              return "serviceDates: array expected";
            for (var i = 0; i < message.serviceDates.length; ++i)
              if (!$util.isString(message.serviceDates[i]))
                return "serviceDates: string[] expected";
          }
          if (message.modifications != null && message.hasOwnProperty("modifications")) {
            if (!Array.isArray(message.modifications))
              return "modifications: array expected";
            for (var i = 0; i < message.modifications.length; ++i) {
              var error = $root.transit_realtime.TripModifications.Modification.verify(message.modifications[i], _depth + 1);
              if (error)
                return "modifications." + error;
            }
          }
          return null;
        }, "verify");
        TripModifications.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.TripModifications)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.TripModifications();
          if (object.selectedTrips) {
            if (!Array.isArray(object.selectedTrips))
              throw TypeError(".transit_realtime.TripModifications.selectedTrips: array expected");
            message.selectedTrips = Array(object.selectedTrips.length);
            for (var i = 0; i < object.selectedTrips.length; ++i) {
              if (typeof object.selectedTrips[i] !== "object")
                throw TypeError(".transit_realtime.TripModifications.selectedTrips: object expected");
              message.selectedTrips[i] = $root.transit_realtime.TripModifications.SelectedTrips.fromObject(object.selectedTrips[i], _depth + 1);
            }
          }
          if (object.startTimes) {
            if (!Array.isArray(object.startTimes))
              throw TypeError(".transit_realtime.TripModifications.startTimes: array expected");
            message.startTimes = Array(object.startTimes.length);
            for (var i = 0; i < object.startTimes.length; ++i)
              message.startTimes[i] = String(object.startTimes[i]);
          }
          if (object.serviceDates) {
            if (!Array.isArray(object.serviceDates))
              throw TypeError(".transit_realtime.TripModifications.serviceDates: array expected");
            message.serviceDates = Array(object.serviceDates.length);
            for (var i = 0; i < object.serviceDates.length; ++i)
              message.serviceDates[i] = String(object.serviceDates[i]);
          }
          if (object.modifications) {
            if (!Array.isArray(object.modifications))
              throw TypeError(".transit_realtime.TripModifications.modifications: array expected");
            message.modifications = Array(object.modifications.length);
            for (var i = 0; i < object.modifications.length; ++i) {
              if (typeof object.modifications[i] !== "object")
                throw TypeError(".transit_realtime.TripModifications.modifications: object expected");
              message.modifications[i] = $root.transit_realtime.TripModifications.Modification.fromObject(object.modifications[i], _depth + 1);
            }
          }
          return message;
        }, "fromObject");
        TripModifications.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.arrays || options.defaults) {
            object.selectedTrips = [];
            object.startTimes = [];
            object.serviceDates = [];
            object.modifications = [];
          }
          if (message.selectedTrips && message.selectedTrips.length) {
            object.selectedTrips = Array(message.selectedTrips.length);
            for (var j = 0; j < message.selectedTrips.length; ++j)
              object.selectedTrips[j] = $root.transit_realtime.TripModifications.SelectedTrips.toObject(message.selectedTrips[j], options);
          }
          if (message.startTimes && message.startTimes.length) {
            object.startTimes = Array(message.startTimes.length);
            for (var j = 0; j < message.startTimes.length; ++j)
              object.startTimes[j] = message.startTimes[j];
          }
          if (message.serviceDates && message.serviceDates.length) {
            object.serviceDates = Array(message.serviceDates.length);
            for (var j = 0; j < message.serviceDates.length; ++j)
              object.serviceDates[j] = message.serviceDates[j];
          }
          if (message.modifications && message.modifications.length) {
            object.modifications = Array(message.modifications.length);
            for (var j = 0; j < message.modifications.length; ++j)
              object.modifications[j] = $root.transit_realtime.TripModifications.Modification.toObject(message.modifications[j], options);
          }
          return object;
        }, "toObject");
        TripModifications.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        TripModifications.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.TripModifications";
        }, "getTypeUrl");
        TripModifications.Modification = (function() {
          function Modification(properties) {
            this.replacementStops = [];
            if (properties) {
              for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                  this[keys[i]] = properties[keys[i]];
            }
          }
          __name(Modification, "Modification");
          Modification.prototype.startStopSelector = null;
          Modification.prototype.endStopSelector = null;
          Modification.prototype.propagatedModificationDelay = 0;
          Modification.prototype.replacementStops = $util.emptyArray;
          Modification.prototype.serviceAlertId = "";
          Modification.prototype.lastModifiedTime = $util.Long ? $util.Long.fromBits(0, 0, true) : 0;
          Modification.create = /* @__PURE__ */ __name(function create(properties) {
            return new Modification(properties);
          }, "create");
          Modification.encode = /* @__PURE__ */ __name(function encode(message, writer) {
            if (!writer)
              writer = $Writer.create();
            if (message.startStopSelector != null && Object.hasOwnProperty.call(message, "startStopSelector"))
              $root.transit_realtime.StopSelector.encode(message.startStopSelector, writer.uint32(
                /* id 1, wireType 2 =*/
                10
              ).fork()).ldelim();
            if (message.endStopSelector != null && Object.hasOwnProperty.call(message, "endStopSelector"))
              $root.transit_realtime.StopSelector.encode(message.endStopSelector, writer.uint32(
                /* id 2, wireType 2 =*/
                18
              ).fork()).ldelim();
            if (message.propagatedModificationDelay != null && Object.hasOwnProperty.call(message, "propagatedModificationDelay"))
              writer.uint32(
                /* id 3, wireType 0 =*/
                24
              ).int32(message.propagatedModificationDelay);
            if (message.replacementStops != null && message.replacementStops.length)
              for (var i = 0; i < message.replacementStops.length; ++i)
                $root.transit_realtime.ReplacementStop.encode(message.replacementStops[i], writer.uint32(
                  /* id 4, wireType 2 =*/
                  34
                ).fork()).ldelim();
            if (message.serviceAlertId != null && Object.hasOwnProperty.call(message, "serviceAlertId"))
              writer.uint32(
                /* id 5, wireType 2 =*/
                42
              ).string(message.serviceAlertId);
            if (message.lastModifiedTime != null && Object.hasOwnProperty.call(message, "lastModifiedTime"))
              writer.uint32(
                /* id 6, wireType 0 =*/
                48
              ).uint64(message.lastModifiedTime);
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
              for (var i = 0; i < message.$unknowns.length; ++i)
                writer.raw(message.$unknowns[i]);
            return writer;
          }, "encode");
          Modification.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
          }, "encodeDelimited");
          Modification.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
              reader = $Reader.create(reader);
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $Reader.recursionLimit)
              throw Error("max depth exceeded");
            var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.TripModifications.Modification();
            while (reader.pos < end) {
              var start = reader.pos;
              var tag = reader.tag();
              if (tag === _end) {
                _end = void 0;
                break;
              }
              var wireType = tag & 7;
              switch (tag >>>= 3) {
                case 1: {
                  if (wireType !== 2)
                    break;
                  message.startStopSelector = $root.transit_realtime.StopSelector.decode(reader, reader.uint32(), void 0, _depth + 1, message.startStopSelector);
                  continue;
                }
                case 2: {
                  if (wireType !== 2)
                    break;
                  message.endStopSelector = $root.transit_realtime.StopSelector.decode(reader, reader.uint32(), void 0, _depth + 1, message.endStopSelector);
                  continue;
                }
                case 3: {
                  if (wireType !== 0)
                    break;
                  message.propagatedModificationDelay = reader.int32();
                  continue;
                }
                case 4: {
                  if (wireType !== 2)
                    break;
                  if (!(message.replacementStops && message.replacementStops.length))
                    message.replacementStops = [];
                  message.replacementStops.push($root.transit_realtime.ReplacementStop.decode(reader, reader.uint32(), void 0, _depth + 1));
                  continue;
                }
                case 5: {
                  if (wireType !== 2)
                    break;
                  message.serviceAlertId = reader.string();
                  continue;
                }
                case 6: {
                  if (wireType !== 0)
                    break;
                  message.lastModifiedTime = reader.uint64();
                  continue;
                }
              }
              reader.skipType(wireType, _depth, tag);
              $util.makeProp(message, "$unknowns", false);
              (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
            }
            if (_end !== void 0)
              throw Error("missing end group");
            return message;
          }, "decode");
          Modification.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
              reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
          }, "decodeDelimited");
          Modification.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
            if (typeof message !== "object" || message === null)
              return "object expected";
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              return "max depth exceeded";
            if (message.startStopSelector != null && message.hasOwnProperty("startStopSelector")) {
              var error = $root.transit_realtime.StopSelector.verify(message.startStopSelector, _depth + 1);
              if (error)
                return "startStopSelector." + error;
            }
            if (message.endStopSelector != null && message.hasOwnProperty("endStopSelector")) {
              var error = $root.transit_realtime.StopSelector.verify(message.endStopSelector, _depth + 1);
              if (error)
                return "endStopSelector." + error;
            }
            if (message.propagatedModificationDelay != null && message.hasOwnProperty("propagatedModificationDelay")) {
              if (!$util.isInteger(message.propagatedModificationDelay))
                return "propagatedModificationDelay: integer expected";
            }
            if (message.replacementStops != null && message.hasOwnProperty("replacementStops")) {
              if (!Array.isArray(message.replacementStops))
                return "replacementStops: array expected";
              for (var i = 0; i < message.replacementStops.length; ++i) {
                var error = $root.transit_realtime.ReplacementStop.verify(message.replacementStops[i], _depth + 1);
                if (error)
                  return "replacementStops." + error;
              }
            }
            if (message.serviceAlertId != null && message.hasOwnProperty("serviceAlertId")) {
              if (!$util.isString(message.serviceAlertId))
                return "serviceAlertId: string expected";
            }
            if (message.lastModifiedTime != null && message.hasOwnProperty("lastModifiedTime")) {
              if (!$util.isInteger(message.lastModifiedTime) && !(message.lastModifiedTime && $util.isInteger(message.lastModifiedTime.low) && $util.isInteger(message.lastModifiedTime.high)))
                return "lastModifiedTime: integer|Long expected";
            }
            return null;
          }, "verify");
          Modification.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
            if (object instanceof $root.transit_realtime.TripModifications.Modification)
              return object;
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              throw Error("max depth exceeded");
            var message = new $root.transit_realtime.TripModifications.Modification();
            if (object.startStopSelector != null) {
              if (typeof object.startStopSelector !== "object")
                throw TypeError(".transit_realtime.TripModifications.Modification.startStopSelector: object expected");
              message.startStopSelector = $root.transit_realtime.StopSelector.fromObject(object.startStopSelector, _depth + 1);
            }
            if (object.endStopSelector != null) {
              if (typeof object.endStopSelector !== "object")
                throw TypeError(".transit_realtime.TripModifications.Modification.endStopSelector: object expected");
              message.endStopSelector = $root.transit_realtime.StopSelector.fromObject(object.endStopSelector, _depth + 1);
            }
            if (object.propagatedModificationDelay != null)
              message.propagatedModificationDelay = object.propagatedModificationDelay | 0;
            if (object.replacementStops) {
              if (!Array.isArray(object.replacementStops))
                throw TypeError(".transit_realtime.TripModifications.Modification.replacementStops: array expected");
              message.replacementStops = Array(object.replacementStops.length);
              for (var i = 0; i < object.replacementStops.length; ++i) {
                if (typeof object.replacementStops[i] !== "object")
                  throw TypeError(".transit_realtime.TripModifications.Modification.replacementStops: object expected");
                message.replacementStops[i] = $root.transit_realtime.ReplacementStop.fromObject(object.replacementStops[i], _depth + 1);
              }
            }
            if (object.serviceAlertId != null)
              message.serviceAlertId = String(object.serviceAlertId);
            if (object.lastModifiedTime != null) {
              if ($util.Long)
                (message.lastModifiedTime = $util.Long.fromValue(object.lastModifiedTime)).unsigned = true;
              else if (typeof object.lastModifiedTime === "string")
                message.lastModifiedTime = parseInt(object.lastModifiedTime, 10);
              else if (typeof object.lastModifiedTime === "number")
                message.lastModifiedTime = object.lastModifiedTime;
              else if (typeof object.lastModifiedTime === "object")
                message.lastModifiedTime = new $util.LongBits(object.lastModifiedTime.low >>> 0, object.lastModifiedTime.high >>> 0).toNumber(true);
            }
            return message;
          }, "fromObject");
          Modification.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
            if (!options)
              options = {};
            var object = {};
            if (options.arrays || options.defaults)
              object.replacementStops = [];
            if (options.defaults) {
              object.startStopSelector = null;
              object.endStopSelector = null;
              object.propagatedModificationDelay = 0;
              object.serviceAlertId = "";
              if ($util.Long) {
                var long = new $util.Long(0, 0, true);
                object.lastModifiedTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
              } else
                object.lastModifiedTime = options.longs === String ? "0" : 0;
            }
            if (message.startStopSelector != null && message.hasOwnProperty("startStopSelector"))
              object.startStopSelector = $root.transit_realtime.StopSelector.toObject(message.startStopSelector, options);
            if (message.endStopSelector != null && message.hasOwnProperty("endStopSelector"))
              object.endStopSelector = $root.transit_realtime.StopSelector.toObject(message.endStopSelector, options);
            if (message.propagatedModificationDelay != null && message.hasOwnProperty("propagatedModificationDelay"))
              object.propagatedModificationDelay = message.propagatedModificationDelay;
            if (message.replacementStops && message.replacementStops.length) {
              object.replacementStops = Array(message.replacementStops.length);
              for (var j = 0; j < message.replacementStops.length; ++j)
                object.replacementStops[j] = $root.transit_realtime.ReplacementStop.toObject(message.replacementStops[j], options);
            }
            if (message.serviceAlertId != null && message.hasOwnProperty("serviceAlertId"))
              object.serviceAlertId = message.serviceAlertId;
            if (message.lastModifiedTime != null && message.hasOwnProperty("lastModifiedTime"))
              if (typeof message.lastModifiedTime === "number")
                object.lastModifiedTime = options.longs === String ? String(message.lastModifiedTime) : message.lastModifiedTime;
              else
                object.lastModifiedTime = options.longs === String ? $util.Long.prototype.toString.call(message.lastModifiedTime) : options.longs === Number ? new $util.LongBits(message.lastModifiedTime.low >>> 0, message.lastModifiedTime.high >>> 0).toNumber(true) : message.lastModifiedTime;
            return object;
          }, "toObject");
          Modification.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
          }, "toJSON");
          Modification.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
            if (prefix === void 0)
              prefix = "type.googleapis.com";
            return prefix + "/transit_realtime.TripModifications.Modification";
          }, "getTypeUrl");
          return Modification;
        })();
        TripModifications.SelectedTrips = (function() {
          function SelectedTrips(properties) {
            this.tripIds = [];
            if (properties) {
              for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null && keys[i] !== "__proto__")
                  this[keys[i]] = properties[keys[i]];
            }
          }
          __name(SelectedTrips, "SelectedTrips");
          SelectedTrips.prototype.tripIds = $util.emptyArray;
          SelectedTrips.prototype.shapeId = "";
          SelectedTrips.create = /* @__PURE__ */ __name(function create(properties) {
            return new SelectedTrips(properties);
          }, "create");
          SelectedTrips.encode = /* @__PURE__ */ __name(function encode(message, writer) {
            if (!writer)
              writer = $Writer.create();
            if (message.tripIds != null && message.tripIds.length)
              for (var i = 0; i < message.tripIds.length; ++i)
                writer.uint32(
                  /* id 1, wireType 2 =*/
                  10
                ).string(message.tripIds[i]);
            if (message.shapeId != null && Object.hasOwnProperty.call(message, "shapeId"))
              writer.uint32(
                /* id 2, wireType 2 =*/
                18
              ).string(message.shapeId);
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
              for (var i = 0; i < message.$unknowns.length; ++i)
                writer.raw(message.$unknowns[i]);
            return writer;
          }, "encode");
          SelectedTrips.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
          }, "encodeDelimited");
          SelectedTrips.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
              reader = $Reader.create(reader);
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $Reader.recursionLimit)
              throw Error("max depth exceeded");
            var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.TripModifications.SelectedTrips();
            while (reader.pos < end) {
              var start = reader.pos;
              var tag = reader.tag();
              if (tag === _end) {
                _end = void 0;
                break;
              }
              var wireType = tag & 7;
              switch (tag >>>= 3) {
                case 1: {
                  if (wireType !== 2)
                    break;
                  if (!(message.tripIds && message.tripIds.length))
                    message.tripIds = [];
                  message.tripIds.push(reader.string());
                  continue;
                }
                case 2: {
                  if (wireType !== 2)
                    break;
                  message.shapeId = reader.string();
                  continue;
                }
              }
              reader.skipType(wireType, _depth, tag);
              $util.makeProp(message, "$unknowns", false);
              (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
            }
            if (_end !== void 0)
              throw Error("missing end group");
            return message;
          }, "decode");
          SelectedTrips.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
              reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
          }, "decodeDelimited");
          SelectedTrips.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
            if (typeof message !== "object" || message === null)
              return "object expected";
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              return "max depth exceeded";
            if (message.tripIds != null && message.hasOwnProperty("tripIds")) {
              if (!Array.isArray(message.tripIds))
                return "tripIds: array expected";
              for (var i = 0; i < message.tripIds.length; ++i)
                if (!$util.isString(message.tripIds[i]))
                  return "tripIds: string[] expected";
            }
            if (message.shapeId != null && message.hasOwnProperty("shapeId")) {
              if (!$util.isString(message.shapeId))
                return "shapeId: string expected";
            }
            return null;
          }, "verify");
          SelectedTrips.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
            if (object instanceof $root.transit_realtime.TripModifications.SelectedTrips)
              return object;
            if (_depth === void 0)
              _depth = 0;
            if (_depth > $util.recursionLimit)
              throw Error("max depth exceeded");
            var message = new $root.transit_realtime.TripModifications.SelectedTrips();
            if (object.tripIds) {
              if (!Array.isArray(object.tripIds))
                throw TypeError(".transit_realtime.TripModifications.SelectedTrips.tripIds: array expected");
              message.tripIds = Array(object.tripIds.length);
              for (var i = 0; i < object.tripIds.length; ++i)
                message.tripIds[i] = String(object.tripIds[i]);
            }
            if (object.shapeId != null)
              message.shapeId = String(object.shapeId);
            return message;
          }, "fromObject");
          SelectedTrips.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
            if (!options)
              options = {};
            var object = {};
            if (options.arrays || options.defaults)
              object.tripIds = [];
            if (options.defaults)
              object.shapeId = "";
            if (message.tripIds && message.tripIds.length) {
              object.tripIds = Array(message.tripIds.length);
              for (var j = 0; j < message.tripIds.length; ++j)
                object.tripIds[j] = message.tripIds[j];
            }
            if (message.shapeId != null && message.hasOwnProperty("shapeId"))
              object.shapeId = message.shapeId;
            return object;
          }, "toObject");
          SelectedTrips.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
          }, "toJSON");
          SelectedTrips.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
            if (prefix === void 0)
              prefix = "type.googleapis.com";
            return prefix + "/transit_realtime.TripModifications.SelectedTrips";
          }, "getTypeUrl");
          return SelectedTrips;
        })();
        return TripModifications;
      })();
      transit_realtime2.StopSelector = (function() {
        function StopSelector(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(StopSelector, "StopSelector");
        StopSelector.prototype.stopSequence = 0;
        StopSelector.prototype.stopId = "";
        StopSelector.create = /* @__PURE__ */ __name(function create(properties) {
          return new StopSelector(properties);
        }, "create");
        StopSelector.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.stopSequence != null && Object.hasOwnProperty.call(message, "stopSequence"))
            writer.uint32(
              /* id 1, wireType 0 =*/
              8
            ).uint32(message.stopSequence);
          if (message.stopId != null && Object.hasOwnProperty.call(message, "stopId"))
            writer.uint32(
              /* id 2, wireType 2 =*/
              18
            ).string(message.stopId);
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        StopSelector.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        StopSelector.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.StopSelector();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 0)
                  break;
                message.stopSequence = reader.uint32();
                continue;
              }
              case 2: {
                if (wireType !== 2)
                  break;
                message.stopId = reader.string();
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          return message;
        }, "decode");
        StopSelector.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        StopSelector.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          if (message.stopSequence != null && message.hasOwnProperty("stopSequence")) {
            if (!$util.isInteger(message.stopSequence))
              return "stopSequence: integer expected";
          }
          if (message.stopId != null && message.hasOwnProperty("stopId")) {
            if (!$util.isString(message.stopId))
              return "stopId: string expected";
          }
          return null;
        }, "verify");
        StopSelector.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.StopSelector)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.StopSelector();
          if (object.stopSequence != null)
            message.stopSequence = object.stopSequence >>> 0;
          if (object.stopId != null)
            message.stopId = String(object.stopId);
          return message;
        }, "fromObject");
        StopSelector.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.defaults) {
            object.stopSequence = 0;
            object.stopId = "";
          }
          if (message.stopSequence != null && message.hasOwnProperty("stopSequence"))
            object.stopSequence = message.stopSequence;
          if (message.stopId != null && message.hasOwnProperty("stopId"))
            object.stopId = message.stopId;
          return object;
        }, "toObject");
        StopSelector.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        StopSelector.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.StopSelector";
        }, "getTypeUrl");
        return StopSelector;
      })();
      transit_realtime2.ReplacementStop = (function() {
        function ReplacementStop(properties) {
          if (properties) {
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
              if (properties[keys[i]] != null && keys[i] !== "__proto__")
                this[keys[i]] = properties[keys[i]];
          }
        }
        __name(ReplacementStop, "ReplacementStop");
        ReplacementStop.prototype.travelTimeToStop = 0;
        ReplacementStop.prototype.stopId = "";
        ReplacementStop.create = /* @__PURE__ */ __name(function create(properties) {
          return new ReplacementStop(properties);
        }, "create");
        ReplacementStop.encode = /* @__PURE__ */ __name(function encode(message, writer) {
          if (!writer)
            writer = $Writer.create();
          if (message.travelTimeToStop != null && Object.hasOwnProperty.call(message, "travelTimeToStop"))
            writer.uint32(
              /* id 1, wireType 0 =*/
              8
            ).int32(message.travelTimeToStop);
          if (message.stopId != null && Object.hasOwnProperty.call(message, "stopId"))
            writer.uint32(
              /* id 2, wireType 2 =*/
              18
            ).string(message.stopId);
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i = 0; i < message.$unknowns.length; ++i)
              writer.raw(message.$unknowns[i]);
          return writer;
        }, "encode");
        ReplacementStop.encodeDelimited = /* @__PURE__ */ __name(function encodeDelimited(message, writer) {
          return this.encode(message, writer).ldelim();
        }, "encodeDelimited");
        ReplacementStop.decode = /* @__PURE__ */ __name(function decode(reader, length, _end, _depth, _target) {
          if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $Reader.recursionLimit)
            throw Error("max depth exceeded");
          var end = length === void 0 ? reader.len : reader.pos + length, message = _target || new $root.transit_realtime.ReplacementStop();
          while (reader.pos < end) {
            var start = reader.pos;
            var tag = reader.tag();
            if (tag === _end) {
              _end = void 0;
              break;
            }
            var wireType = tag & 7;
            switch (tag >>>= 3) {
              case 1: {
                if (wireType !== 0)
                  break;
                message.travelTimeToStop = reader.int32();
                continue;
              }
              case 2: {
                if (wireType !== 2)
                  break;
                message.stopId = reader.string();
                continue;
              }
            }
            reader.skipType(wireType, _depth, tag);
            $util.makeProp(message, "$unknowns", false);
            (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
          }
          if (_end !== void 0)
            throw Error("missing end group");
          return message;
        }, "decode");
        ReplacementStop.decodeDelimited = /* @__PURE__ */ __name(function decodeDelimited(reader) {
          if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
          return this.decode(reader, reader.uint32());
        }, "decodeDelimited");
        ReplacementStop.verify = /* @__PURE__ */ __name(function verify(message, _depth) {
          if (typeof message !== "object" || message === null)
            return "object expected";
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            return "max depth exceeded";
          if (message.travelTimeToStop != null && message.hasOwnProperty("travelTimeToStop")) {
            if (!$util.isInteger(message.travelTimeToStop))
              return "travelTimeToStop: integer expected";
          }
          if (message.stopId != null && message.hasOwnProperty("stopId")) {
            if (!$util.isString(message.stopId))
              return "stopId: string expected";
          }
          return null;
        }, "verify");
        ReplacementStop.fromObject = /* @__PURE__ */ __name(function fromObject(object, _depth) {
          if (object instanceof $root.transit_realtime.ReplacementStop)
            return object;
          if (_depth === void 0)
            _depth = 0;
          if (_depth > $util.recursionLimit)
            throw Error("max depth exceeded");
          var message = new $root.transit_realtime.ReplacementStop();
          if (object.travelTimeToStop != null)
            message.travelTimeToStop = object.travelTimeToStop | 0;
          if (object.stopId != null)
            message.stopId = String(object.stopId);
          return message;
        }, "fromObject");
        ReplacementStop.toObject = /* @__PURE__ */ __name(function toObject(message, options) {
          if (!options)
            options = {};
          var object = {};
          if (options.defaults) {
            object.travelTimeToStop = 0;
            object.stopId = "";
          }
          if (message.travelTimeToStop != null && message.hasOwnProperty("travelTimeToStop"))
            object.travelTimeToStop = message.travelTimeToStop;
          if (message.stopId != null && message.hasOwnProperty("stopId"))
            object.stopId = message.stopId;
          return object;
        }, "toObject");
        ReplacementStop.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
          return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        }, "toJSON");
        ReplacementStop.getTypeUrl = /* @__PURE__ */ __name(function getTypeUrl(prefix) {
          if (prefix === void 0)
            prefix = "type.googleapis.com";
          return prefix + "/transit_realtime.ReplacementStop";
        }, "getTypeUrl");
        return ReplacementStop;
      })();
      return transit_realtime2;
    })();
    module.exports = $root;
  }
});

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/compose.js
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err2) {
          if (err2 instanceof Error && onError) {
            context.error = err2;
            res = await onError(err2, context);
            isError = true;
          } else {
            throw err2;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/utils/body.js
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/utils/url.js
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/request.js
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = class {
  static {
    __name(this, "HonoRequest");
  }
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = /* @__PURE__ */ __name((key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  }, "#cachedBody");
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var createResponseInstance = /* @__PURE__ */ __name((body, init) => new Response(body, init), "createResponseInstance");
var Context = class {
  static {
    __name(this, "Context");
  }
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = /* @__PURE__ */ __name((...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  }, "render");
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = /* @__PURE__ */ __name((layout) => this.#layout = layout, "setLayout");
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = /* @__PURE__ */ __name(() => this.#layout, "getLayout");
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = /* @__PURE__ */ __name((renderer) => {
    this.#renderer = renderer;
  }, "setRenderer");
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = /* @__PURE__ */ __name((name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  }, "header");
  status = /* @__PURE__ */ __name((status) => {
    this.#status = status;
  }, "status");
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = /* @__PURE__ */ __name((key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  }, "set");
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = /* @__PURE__ */ __name((key) => {
    return this.#var ? this.#var.get(key) : void 0;
  }, "get");
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, { status, headers: responseHeaders });
  }
  newResponse = /* @__PURE__ */ __name((...args) => this.#newResponse(...args), "newResponse");
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = /* @__PURE__ */ __name((data, arg, headers) => this.#newResponse(data, arg, headers), "body");
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = /* @__PURE__ */ __name((text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  }, "text");
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = /* @__PURE__ */ __name((object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  }, "json");
  html = /* @__PURE__ */ __name((html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  }, "html");
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = /* @__PURE__ */ __name((location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  }, "redirect");
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name(() => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  }, "notFound");
};

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err2, c) => {
  if ("getResponse" in err2) {
    const res = err2.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err2);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = class _Hono {
  static {
    __name(this, "_Hono");
  }
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = /* @__PURE__ */ __name((handler) => {
    this.errorHandler = handler;
    return this;
  }, "onError");
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = /* @__PURE__ */ __name((handler) => {
    this.#notFoundHandler = handler;
    return this;
  }, "notFound");
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler, baseRoutePath) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err2, c) {
    if (err2 instanceof Error) {
      return this.errorHandler(err2, c);
    }
    throw err2;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err2) {
        return this.#handleError(err2, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err2) => this.#handleError(err2, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err2) {
        return this.#handleError(err2, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = /* @__PURE__ */ __name((request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  }, "fetch");
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = /* @__PURE__ */ __name((input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  }, "request");
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = /* @__PURE__ */ __name(() => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  }, "fire");
};

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name(((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  }), "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = class _Node {
  static {
    __name(this, "_Node");
  }
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = class {
  static {
    __name(this, "RegExpRouter");
  }
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  static {
    __name(this, "SmartRouter");
  }
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = /* @__PURE__ */ __name((children) => {
  for (const _ in children) {
    return true;
  }
  return false;
}, "hasChildren");
var Node2 = class _Node2 {
  static {
    __name(this, "_Node");
  }
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  static {
    __name(this, "TrieRouter");
  }
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  static {
    __name(this, "Hono");
  }
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/.pnpm/hono@4.12.23/node_modules/hono/dist/middleware/cors/index.js
var cors = /* @__PURE__ */ __name((options) => {
  const opts = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: [],
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        if (opts.credentials) {
          return (origin) => origin || null;
        }
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, "set");
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*" || opts.credentials) {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*" || opts.credentials) {
      c.header("Vary", "Origin", { append: true });
    }
  }, "cors2");
}, "cors");

// node_modules/.pnpm/fflate@0.8.3/node_modules/fflate/esm/browser.js
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = /* @__PURE__ */ __name(function(eb, start) {
  var b = new u16(31);
  for (var i = 0; i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1];
  }
  var r = new i32(b[30]);
  for (var i = 1; i < 30; ++i) {
    for (var j = b[i]; j < b[i + 1]; ++j) {
      r[j] = j - b[i] << 5 | i;
    }
  }
  return { b, r };
}, "freb");
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = /* @__PURE__ */ __name((function(cd, mb, r) {
  var s = cd.length;
  var i = 0;
  var l = new u16(mb);
  for (; i < s; ++i) {
    if (cd[i])
      ++l[cd[i] - 1];
  }
  var le = new u16(mb);
  for (i = 1; i < mb; ++i) {
    le[i] = le[i - 1] + l[i - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        var sv = i << 4 | cd[i];
        var r_1 = mb - cd[i];
        var v = le[cd[i] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
      }
    }
  }
  return co;
}), "hMap");
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = /* @__PURE__ */ __name(function(a) {
  var m = a[0];
  for (var i = 1; i < a.length; ++i) {
    if (a[i] > m)
      m = a[i];
  }
  return m;
}, "max");
var bits = /* @__PURE__ */ __name(function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
}, "bits");
var bits16 = /* @__PURE__ */ __name(function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
}, "bits16");
var shft = /* @__PURE__ */ __name(function(p) {
  return (p + 7) / 8 | 0;
}, "shft");
var slc = /* @__PURE__ */ __name(function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
}, "slc");
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = /* @__PURE__ */ __name(function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
}, "err");
var inflt = /* @__PURE__ */ __name(function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = /* @__PURE__ */ __name(function(l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  }, "cbuf");
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i = 0; i < hcLen; ++i) {
          clt[clim[i]] = bits(dat, pos + i * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i = 0; i < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i = sym - 257, b = fleb[i];
          add = bits(dat, pos, (1 << b) - 1) + fl[i];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
}, "inflt");
var et = /* @__PURE__ */ new u8(0);
var b2 = /* @__PURE__ */ __name(function(d, b) {
  return d[b] | d[b + 1] << 8;
}, "b2");
var b4 = /* @__PURE__ */ __name(function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
}, "b4");
var b8 = /* @__PURE__ */ __name(function(d, b) {
  return b4(d, b) + b4(d, b + 4) * 4294967296;
}, "b8");
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
__name(inflateSync, "inflateSync");
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}
var dutf8 = /* @__PURE__ */ __name(function(d) {
  for (var r = "", i = 0; ; ) {
    var c = d[i++];
    var eb = (c > 127) + (c > 223) + (c > 239);
    if (i + eb > d.length)
      return { s: r, r: slc(d, i - 1) };
    if (!eb)
      r += String.fromCharCode(c);
    else if (eb == 3) {
      c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | d[i++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
    } else if (eb & 1)
      r += String.fromCharCode((c & 31) << 6 | d[i++] & 63);
    else
      r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | d[i++] & 63);
  }
}, "dutf8");
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = "";
    for (var i = 0; i < dat.length; i += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
    return r;
  } else if (td) {
    return td.decode(dat);
  } else {
    var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
    if (r.length)
      err(8);
    return s;
  }
}
__name(strFromU8, "strFromU8");
var slzh = /* @__PURE__ */ __name(function(d, b) {
  return b + 30 + b2(d, b + 26) + b2(d, b + 28);
}, "slzh");
var zh = /* @__PURE__ */ __name(function(d, b, z) {
  var fnl = b2(d, b + 28), efl = b2(d, b + 30), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl;
  var _a2 = z64hs(d, es, efl, z, b4(d, b + 20), b4(d, b + 24), b4(d, b + 42)), sc = _a2[0], su = _a2[1], off = _a2[2];
  return [b2(d, b + 10), sc, su, fn, es + efl + b2(d, b + 32), off];
}, "zh");
var z64hs = /* @__PURE__ */ __name(function(d, b, l, z, sc, su, off) {
  var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e = b + l;
  var nf = nsc + nsu + noff;
  if (z && nf) {
    for (; b + 4 < e; b += 4 + b2(d, b + 2)) {
      if (b2(d, b) == 1) {
        return [
          nsc ? b8(d, b + 4 + 8 * nsu) : sc,
          nsu ? b8(d, b + 4) : su,
          noff ? b8(d, b + 4 + 8 * (nsu + nsc)) : off,
          1
        ];
      }
    }
    if (z < 2)
      err(13);
  }
  return [sc, su, off, 0];
}, "z64hs");
function unzipSync(data, opts) {
  var files = {};
  var e = data.length - 22;
  for (; b4(data, e) != 101010256; --e) {
    if (!e || data.length - e > 65558)
      err(13);
  }
  ;
  var c = b2(data, e + 8);
  if (!c)
    return {};
  var o = b4(data, e + 16);
  var z = b4(data, e - 20) == 117853008;
  if (z) {
    var ze = b4(data, e - 12);
    z = b4(data, ze) == 101075792;
    if (z) {
      c = b4(data, ze + 32);
      o = b4(data, ze + 48);
    }
  }
  var fltr = opts && opts.filter;
  for (var i = 0; i < c; ++i) {
    var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
    o = no;
    if (!fltr || fltr({
      name: fn,
      size: sc,
      originalSize: su,
      compression: c_2
    })) {
      if (!c_2)
        files[fn] = slc(data, b, b + sc);
      else if (c_2 == 8)
        files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
      else
        err(14, "unknown compression type " + c_2);
    }
  }
  return files;
}
__name(unzipSync, "unzipSync");

// src/csv-parser.ts
function parseCsv(text) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const lines = trimmed.split("\n");
  const headers = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseLine(line);
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j].trim()] = (values[j] || "").trim();
    }
    rows.push(row);
  }
  return rows;
}
__name(parseCsv, "parseCsv");
function parseLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}
__name(parseLine, "parseLine");

// src/gtfs-static.ts
var STATIC_URLS = {
  "rapid-bus-kl": "https://api.data.gov.my/gtfs-static/prasarana?category=rapid-bus-kl",
  "rapid-bus-mrtfeeder": "https://api.data.gov.my/gtfs-static/prasarana?category=rapid-bus-mrtfeeder",
  "rapid-rail-kl": "https://api.data.gov.my/gtfs-static/prasarana?category=rapid-rail-kl"
};
async function fetchAndParseAgency(agency) {
  const url = STATIC_URLS[agency];
  if (!url) throw new Error(`Unknown agency: ${agency}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${agency}: ${response.status}`);
  const zipBuffer = await response.arrayBuffer();
  const files = unzipSync(new Uint8Array(zipBuffer));
  const getFile = /* @__PURE__ */ __name((name) => {
    const key = Object.keys(files).find((k) => k.endsWith(name));
    return key ? new TextDecoder().decode(files[key]) : "";
  }, "getFile");
  const rawStops = parseCsv(getFile("stops.txt"));
  const rawRoutes = parseCsv(getFile("routes.txt"));
  const rawTrips = parseCsv(getFile("trips.txt"));
  const rawStopTimes = parseCsv(getFile("stop_times.txt"));
  const rawCalendar = parseCsv(getFile("calendar.txt"));
  const stopMap = /* @__PURE__ */ new Map();
  const routeIdToType = new Map(rawRoutes.map((r) => [r.route_id, r.route_type]));
  const tripToRouteType = new Map(rawTrips.map((t) => [t.trip_id, routeIdToType.get(t.route_id) || "3"]));
  const stops = rawStops.map((s) => {
    const stop = {
      id: s.stop_id,
      name: s.stop_name,
      lat: parseFloat(s.stop_lat),
      lon: parseFloat(s.stop_lon),
      type: "bus",
      parentStation: s.parent_station
    };
    stopMap.set(s.stop_id, stop);
    return stop;
  });
  for (const st of rawStopTimes) {
    const rt = tripToRouteType.get(st.trip_id);
    if (rt && ["0", "1", "2"].includes(rt)) {
      const stop = stopMap.get(st.stop_id);
      if (stop) stop.type = "rail";
    }
  }
  for (const stop of stops) {
    if (stop.parentStation) {
      const parent = stopMap.get(stop.parentStation);
      if (parent) stop.type = parent.type;
    }
  }
  const routes = rawRoutes.map((r) => ({
    id: r.route_id,
    shortName: r.route_short_name,
    longName: r.route_long_name,
    type: parseInt(r.route_type)
  }));
  const trips = rawTrips.map((t) => ({
    id: t.trip_id,
    routeId: t.route_id,
    serviceId: t.service_id,
    headsign: t.trip_headsign,
    directionId: parseInt(t.direction_id) || 0
  }));
  const tripStops = {};
  for (const st of rawStopTimes) {
    if (!tripStops[st.trip_id]) tripStops[st.trip_id] = [];
    const stop = stopMap.get(st.stop_id);
    tripStops[st.trip_id].push({
      stopId: st.stop_id,
      stopName: stop?.name || st.stop_id,
      lat: stop?.lat || 0,
      lon: stop?.lon || 0,
      arrivalTime: st.arrival_time,
      departureTime: st.departure_time,
      sequence: parseInt(st.stop_sequence)
    });
  }
  for (const tid of Object.keys(tripStops)) {
    tripStops[tid].sort((a, b) => a.sequence - b.sequence);
  }
  const calendar = rawCalendar.map((c) => ({
    serviceId: c.service_id,
    days: [c.sunday, c.monday, c.tuesday, c.wednesday, c.thursday, c.friday, c.saturday].map((d) => d === "1"),
    startDate: c.start_date,
    endDate: c.end_date
  }));
  return { stops, routes, trips, tripStops, calendar };
}
__name(fetchAndParseAgency, "fetchAndParseAgency");
function getActiveServiceIds(calendar, date) {
  const dayIndex = date.getDay();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const active = /* @__PURE__ */ new Set();
  for (const entry of calendar) {
    if (dateStr >= entry.startDate && dateStr <= entry.endDate && entry.days[dayIndex]) {
      active.add(entry.serviceId);
    }
  }
  return active;
}
__name(getActiveServiceIds, "getActiveServiceIds");

// src/gtfs-realtime.ts
var import_gtfs_realtime_bindings = __toESM(require_gtfs_realtime());
var REALTIME_URLS = {
  "rapid-bus-kl": "https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl",
  "rapid-bus-mrtfeeder": "https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-mrtfeeder"
};
async function fetchVehiclePositions(agency) {
  const url = REALTIME_URLS[agency];
  if (!url) return [];
  const response = await fetch(url);
  if (!response.ok) return [];
  const buffer = await response.arrayBuffer();
  const feed = import_gtfs_realtime_bindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
  const positions = [];
  for (const entity of feed.entity) {
    if (!entity.vehicle) continue;
    const v = entity.vehicle;
    const tripId = v.trip?.tripId || "";
    const routeId = v.trip?.routeId || "";
    const lat = v.position?.latitude || 0;
    const lon = v.position?.longitude || 0;
    const seq = v.currentStopSequence || 0;
    const ts = v.timestamp ? v.timestamp.toNumber?.() ?? v.timestamp : 0;
    const stopId = v.stopId || "";
    if (!tripId || lat === 0 && lon === 0) continue;
    positions.push({ tripId, routeId, lat, lon, currentStopSequence: seq, timestamp: ts, stopId });
  }
  return positions;
}
__name(fetchVehiclePositions, "fetchVehiclePositions");

// src/prasarana-socketio.ts
async function fetchPrasaranaBuses(...args) {
  return [];
}
__name(fetchPrasaranaBuses, "fetchPrasaranaBuses");

// src/haversine.ts
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = /* @__PURE__ */ __name((deg) => deg * Math.PI / 180, "toRad");
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
__name(haversineDistance, "haversineDistance");

// src/frequency.ts
function expandTripsForStop(...args) {
  return [];
}
__name(expandTripsForStop, "expandTripsForStop");

// src/nearby.ts
function findNearbyStops(stops, routes, trips, tripStops, calendar, frequencies, vehicles, lat, lon, radiusM) {
  const now = /* @__PURE__ */ new Date();
  const nearby = stops.map((stop) => ({ stop, distance: haversineDistance(lat, lon, stop.lat, stop.lon) })).filter(({ distance }) => distance <= radiusM).sort((a, b) => a.distance - b.distance);
  return nearby.map(({ stop, distance }) => {
    const arrivals = [];
    if (stop.type === "bus") {
      const nearbyVehicles = vehicles.filter((v) => haversineDistance(stop.lat, stop.lon, v.lat, v.lon) <= 500);
      const routeMap = new Map(routes.map((r) => [r.id, r]));
      const seen = /* @__PURE__ */ new Set();
      for (const v of nearbyVehicles) {
        const trip = trips.find((t) => t.id === v.tripId);
        const route = trip ? routeMap.get(trip.routeId) : null;
        const key = route?.id || v.tripId;
        if (seen.has(key)) continue;
        seen.add(key);
        const d = haversineDistance(stop.lat, stop.lon, v.lat, v.lon);
        arrivals.push({
          route: route?.shortName || "",
          destination: trip?.headsign || "",
          minutes: Math.max(1, Math.round(d / 300)),
          isRealtime: true,
          tripId: v.tripId
        });
      }
    } else {
      const expanded = expandTripsForStop(stop.id, trips, tripStops, routes, calendar, frequencies, now, 120);
      for (const dep of expanded.slice(0, 3)) {
        arrivals.push({ line: dep.line, destination: dep.destination, minutes: dep.minutesUntil, isRealtime: false });
      }
    }
    return { id: stop.id, name: stop.name, type: stop.type, lat: stop.lat, lon: stop.lon, distance_m: Math.round(distance), arrivals: arrivals.slice(0, 3) };
  });
}
__name(findNearbyStops, "findNearbyStops");
function findNearbyBusRoutes(routes, trips, vehicles, lat, lon, radiusM = 1e3) {
  const routeMap = new Map(routes.map((r) => [r.id, r]));
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  for (const v of vehicles) {
    const d = haversineDistance(lat, lon, v.lat, v.lon);
    if (d > radiusM) continue;
    const trip = trips.find((t) => t.id === v.tripId);
    const route = trip ? routeMap.get(trip.routeId) : null;
    const key = route?.id || v.tripId;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push({
      routeId: route?.id || v.routeId,
      routeShortName: route?.shortName || route?.longName || "",
      destination: trip?.headsign || "",
      minutes: Math.max(1, Math.round(d / 300)),
      tripId: v.tripId,
      lat: v.lat,
      lon: v.lon
    });
  }
  results.sort((a, b) => a.minutes - b.minutes);
  return results;
}
__name(findNearbyBusRoutes, "findNearbyBusRoutes");
function findNearbyPrasaranaBuses(buses, routes, trips, lat, lon, radiusM = 1e3) {
  const routeNameMap = /* @__PURE__ */ new Map();
  for (const r of routes) {
    if (!routeNameMap.has(r.shortName)) {
      const trip = trips.find((t) => t.routeId === r.id);
      routeNameMap.set(r.shortName, { route: r, trip });
    }
  }
  const results = [];
  for (const b of buses) {
    if (b.trip_rev_kind === "01" || b.trip_rev_kind === "03" || b.trip_rev_kind === "05") continue;
    const d = haversineDistance(lat, lon, b.latitude, b.longitude);
    if (d > radiusM) continue;
    const routeCode = normalizeRouteCode(b.route);
    const gtfsMatch = routeNameMap.get(routeCode);
    const destination = gtfsMatch?.trip?.headsign || "";
    const roadDist = d * 1.4;
    const minutes = b.speed > 0 ? Math.max(1, Math.round(roadDist / (b.speed * 16.67))) : Math.max(1, Math.round(roadDist / 250));
    results.push({
      routeId: gtfsMatch?.route.id || routeCode,
      routeShortName: routeCode,
      destination,
      minutes,
      tripId: b.bus_no,
      lat: b.latitude,
      lon: b.longitude,
      busNo: b.bus_no
    });
  }
  results.sort((a, b) => a.minutes - b.minutes);
  return results;
}
__name(findNearbyPrasaranaBuses, "findNearbyPrasaranaBuses");
function normalizeRouteCode(code) {
  if (code.endsWith("0")) return code.slice(0, -1);
  return code;
}
__name(normalizeRouteCode, "normalizeRouteCode");
async function getHistoricalETA(db, route, fromLat, fromLon, toStopId) {
  const { results } = await db.prepare(`SELECT * FROM travel_times WHERE route = ? AND to_stop_id = ? LIMIT 1`).bind(route, toStopId).all();
  if (!results || results.length === 0) return null;
  return results[0].avg_seconds / 60;
}
__name(getHistoricalETA, "getHistoricalETA");
async function getBulkHistoricalETAs(db, requests) {
  if (requests.length === 0) return /* @__PURE__ */ new Map();
  const uniqueKeys = /* @__PURE__ */ new Set();
  const uniqueRequests = [];
  for (const req of requests) {
    const key = `${req.route}|${req.toStopId}`;
    if (!uniqueKeys.has(key)) {
      uniqueKeys.add(key);
      uniqueRequests.push(req);
    }
  }
  const statements = uniqueRequests.map(
    (req) => db.prepare(`SELECT * FROM travel_times WHERE route = ? AND to_stop_id = ? LIMIT 1`).bind(req.route, req.toStopId)
  );
  const results = await db.batch(statements);
  const etaMap = /* @__PURE__ */ new Map();
  for (let i = 0; i < uniqueRequests.length; i++) {
    const req = uniqueRequests[i];
    const res = results[i];
    if (res && res.results && res.results.length > 0) {
      const row = res.results[0];
      etaMap.set(`${req.route}|${req.toStopId}`, row.avg_seconds / 60);
    }
  }
  return etaMap;
}
__name(getBulkHistoricalETAs, "getBulkHistoricalETAs");

// src/bus-tracker.ts
function getBusTripProgress(tripId, routes, tripStops, vehicle) {
  const stops = tripStops[tripId];
  if (!stops) throw new Error(`Trip not found: ${tripId}`);
  const route = routes.find((r) => r.id === vehicle?.routeId);
  const destination = stops[stops.length - 1]?.stopName || "";
  const currentSeq = vehicle?.currentStopSequence || 0;
  const stopStatuses = stops.map((s) => ({
    id: s.stopId,
    name: s.stopName,
    arrivalTime: s.arrivalTime,
    passed: s.sequence < currentSeq,
    isCurrent: s.sequence === currentSeq
  }));
  const progressPercent = stops.length > 1 ? Math.round((currentSeq - 1) / (stops.length - 1) * 100) : 0;
  return {
    tripId,
    routeShortName: route?.shortName || "",
    destination,
    busPosition: vehicle ? { lat: vehicle.lat, lon: vehicle.lon } : null,
    stops: stopStatuses,
    progressPercent: Math.max(0, Math.min(100, progressPercent))
  };
}
__name(getBusTripProgress, "getBusTripProgress");

// src/station.ts
function getStationSchedule(stopId, stops, routes, trips, tripStops, calendar) {
  const stop = stops.find((s) => s.id === stopId);
  if (!stop) throw new Error(`Stop not found: ${stopId}`);
  const routeMap = new Map(routes.map((r) => [r.id, r]));
  const activeServiceIds = getActiveServiceIds(calendar, /* @__PURE__ */ new Date());
  const departures = [];
  for (const trip of trips) {
    if (!activeServiceIds.has(trip.serviceId)) continue;
    const stopsForTrip = tripStops[trip.id];
    if (!stopsForTrip) continue;
    const stopEntry = stopsForTrip.find((s) => s.stopId === stopId);
    if (!stopEntry) continue;
    const route = routeMap.get(trip.routeId);
    const parts = stopEntry.departureTime.split(":").map(Number);
    const depSeconds = (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
    const now = /* @__PURE__ */ new Date();
    const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const minutesUntil = Math.round((depSeconds - nowSeconds) / 60);
    departures.push({
      line: route?.shortName || "",
      destination: trip.headsign,
      departureTime: stopEntry.departureTime,
      minutesUntil
    });
  }
  departures.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  return {
    stopId,
    stopName: stop.name,
    departures: departures.slice(0, 10)
  };
}
__name(getStationSchedule, "getStationSchedule");

// src/routes.ts
function findNearbyRoutes(stops, routes, trips, tripStops, lat, lon, radiusM) {
  const stopsWithinRadius = stops.filter(
    (s) => haversineDistance(lat, lon, s.lat, s.lon) <= radiusM
  );
  const stopIds = new Set(stopsWithinRadius.map((s) => s.id));
  const routeIds = /* @__PURE__ */ new Set();
  for (const trip of trips) {
    const stopsForTrip = tripStops[trip.id];
    if (!stopsForTrip) continue;
    if (stopsForTrip.some((s) => stopIds.has(s.stopId))) {
      routeIds.add(trip.routeId);
    }
  }
  const routeMap = /* @__PURE__ */ new Map();
  for (const route of routes) {
    if (routeIds.has(route.id) && !routeMap.has(route.id)) {
      routeMap.set(route.id, {
        id: route.id,
        shortName: route.shortName,
        longName: route.longName,
        type: [0, 1, 2].includes(route.type) ? "rail" : "bus"
      });
    }
  }
  return Array.from(routeMap.values());
}
__name(findNearbyRoutes, "findNearbyRoutes");

// src/sampling.ts
async function sampleBusPositions(env, vehicles, prasaranaBuses) {
  const stmts = [];
  const now = Math.floor(Date.now() / 1e3);
  const { results } = await env.DB.prepare(
    "SELECT bus_no, lat, lon, timestamp as ts FROM bus_positions WHERE timestamp > (unixepoch() - 600) GROUP BY bus_no HAVING timestamp = MAX(timestamp)"
  ).all();
  const lastPositions = /* @__PURE__ */ new Map();
  if (results) {
    for (const r of results) {
      lastPositions.set(r.bus_no, r);
    }
  }
  for (const v of vehicles) {
    if (!v.tripId || !v.routeId) continue;
    const last = lastPositions.get(v.tripId);
    const moved = last ? haversineDistance(last.lat, last.lon, v.lat, v.lon) > 100 : true;
    const timedOut = last ? now - last.ts >= 300 : true;
    if (moved || timedOut) {
      stmts.push(env.DB.prepare(
        `INSERT INTO bus_positions (bus_no, route, source, lat, lon, speed, timestamp)
         VALUES (?, ?, ?, ?, ?, NULL, ?)`
      ).bind(v.tripId, v.routeId, "gtfs", v.lat, v.lon, v.timestamp));
    }
  }
  for (const b of prasaranaBuses) {
    const last = lastPositions.get(b.bus_no);
    let ts = now;
    if (b.dt_gps) {
      const parsed = Math.floor(new Date(b.dt_gps).getTime() / 1e3);
      if (!isNaN(parsed)) ts = parsed;
    }
    const moved = last ? haversineDistance(last.lat, last.lon, b.latitude, b.longitude) > 100 : true;
    const timedOut = last ? ts - last.ts >= 300 : true;
    if (moved || timedOut) {
      stmts.push(env.DB.prepare(
        `INSERT INTO bus_positions (bus_no, route, source, lat, lon, speed, timestamp)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(b.bus_no, b.route, "prasarana", b.latitude, b.longitude, b.speed, ts));
    }
  }
  for (let i = 0; i < stmts.length; i += 100) {
    await env.DB.batch(stmts.slice(i, i + 100));
  }
}
__name(sampleBusPositions, "sampleBusPositions");
async function aggregateTravelTimes(env) {
}
__name(aggregateTravelTimes, "aggregateTravelTimes");
async function cleanupOldPositions(env) {
  await env.DB.prepare(`DELETE FROM bus_positions WHERE timestamp < (unixepoch() - 7 * 24 * 60 * 60)`).run();
}
__name(cleanupOldPositions, "cleanupOldPositions");

// src/rail-ingest.ts
var RAIL_GTFS_URL = "https://api.data.gov.my/gtfs-static/prasarana?category=rapid-rail-kl";
var BATCH_SIZE = 100;
async function batch(db, stmts) {
  for (let i = 0; i < stmts.length; i += BATCH_SIZE) {
    await db.batch(stmts.slice(i, i + BATCH_SIZE));
  }
}
__name(batch, "batch");
async function ingestRailTimetables(env) {
  let inserted = 0;
  const resp = await fetch(RAIL_GTFS_URL);
  if (!resp.ok) throw new Error(`GTFS fetch failed: ${resp.status}`);
  const zipBuffer = await resp.arrayBuffer();
  const files = unzipSync(new Uint8Array(zipBuffer));
  const getFile = /* @__PURE__ */ __name((name) => {
    const key = Object.keys(files).find((k) => k.endsWith(name));
    return key ? new TextDecoder().decode(files[key]) : "";
  }, "getFile");
  const rawStops = parseCsv(getFile("stops.txt"));
  const rawRoutes = parseCsv(getFile("routes.txt"));
  const rawTrips = parseCsv(getFile("trips.txt"));
  const rawStopTimes = parseCsv(getFile("stop_times.txt"));
  const railRouteIds = new Set(
    rawRoutes.filter((r) => ["0", "1", "2"].includes(r.route_type)).map((r) => r.route_id)
  );
  const railTripIds = new Set(
    rawTrips.filter((t) => railRouteIds.has(t.route_id)).map((t) => t.trip_id)
  );
  const railStopIds = new Set(
    rawStopTimes.filter((st) => railTripIds.has(st.trip_id)).map((st) => st.stop_id)
  );
  const stopStmts = rawStops.filter((s) => railStopIds.has(s.stop_id)).map(
    (s) => env.DB.prepare(
      `INSERT INTO rail_stops (stop_id, stop_name, lat, lon)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(stop_id) DO UPDATE SET stop_name=excluded.stop_name, lat=excluded.lat, lon=excluded.lon`
    ).bind(s.stop_id, s.stop_name, parseFloat(s.stop_lat), parseFloat(s.stop_lon))
  );
  await batch(env.DB, stopStmts);
  inserted += stopStmts.length;
  const routeStmts = rawRoutes.filter((r) => railRouteIds.has(r.route_id)).map(
    (r) => env.DB.prepare(
      `INSERT INTO rail_routes (route_id, route_short_name, route_long_name)
         VALUES (?, ?, ?)
         ON CONFLICT(route_id) DO UPDATE SET route_short_name=excluded.route_short_name, route_long_name=excluded.route_long_name`
    ).bind(r.route_id, r.route_short_name || "", r.route_long_name || "")
  );
  await batch(env.DB, routeStmts);
  inserted += routeStmts.length;
  const tripStmts = rawTrips.filter((t) => railTripIds.has(t.trip_id)).map(
    (t) => env.DB.prepare(
      `INSERT INTO rail_trips (trip_id, route_id, service_id, headsign, direction)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(trip_id) DO UPDATE SET route_id=excluded.route_id, service_id=excluded.service_id, headsign=excluded.headsign, direction=excluded.direction`
    ).bind(t.trip_id, t.route_id, t.service_id, t.trip_headsign || "", parseInt(t.direction_id || "0") || 0)
  );
  await batch(env.DB, tripStmts);
  inserted += tripStmts.length;
  const stStmts = rawStopTimes.filter((st) => railTripIds.has(st.trip_id)).map(
    (st) => env.DB.prepare(
      `INSERT INTO rail_stop_times (trip_id, stop_id, stop_seq, arrival_time, departure_time)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(trip_id, stop_seq) DO UPDATE SET stop_id=excluded.stop_id, arrival_time=excluded.arrival_time, departure_time=excluded.departure_time`
    ).bind(st.trip_id, st.stop_id, parseInt(st.stop_sequence), st.arrival_time, st.departure_time || st.arrival_time)
  );
  await batch(env.DB, stStmts);
  inserted += stStmts.length;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  await env.DB.prepare(
    `INSERT INTO rail_ingest_meta (key, value)
     VALUES ('last_ingested_at', ?)
     ON CONFLICT(key) DO UPDATE SET value=excluded.value`
  ).bind(now).run();
  return { inserted };
}
__name(ingestRailTimetables, "ingestRailTimetables");

// src/rail-schedule.ts
function formatGtfsTime(t) {
  const [h, m] = t.split(":").map(Number);
  const hWrapped = h % 24;
  return `${String(hWrapped).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
__name(formatGtfsTime, "formatGtfsTime");
async function getRailSchedule(env, stopId, windowMinutes = 120) {
  const stopRow = await env.DB.prepare(
    `SELECT stop_id, stop_name FROM rail_stops WHERE stop_id = ?`
  ).bind(stopId).first();
  if (!stopRow) return null;
  const now = /* @__PURE__ */ new Date();
  const klOffsetMs = 8 * 60 * 60 * 1e3;
  const klNow = new Date(now.getTime() + klOffsetMs);
  const currentMinutes = klNow.getUTCHours() * 60 + klNow.getUTCMinutes();
  const upperMinutes = currentMinutes + windowMinutes;
  const { results } = await env.DB.prepare(
    `SELECT
       rst.departure_time,
       rt.trip_id,
       rt.headsign,
       rr.route_short_name,
       rr.route_long_name,
       -- Compute departure_minutes in SQL: CAST(substr(departure_time,1,2) AS INTEGER)*60 + CAST(substr(departure_time,4,2) AS INTEGER)
       (CAST(substr(rst.departure_time, 1, 2) AS INTEGER) * 60 + CAST(substr(rst.departure_time, 4, 2) AS INTEGER)) AS departure_minutes
     FROM rail_stop_times rst
     JOIN rail_trips rt ON rt.trip_id = rst.trip_id
     JOIN rail_routes rr ON rr.route_id = rt.route_id
     WHERE rst.stop_id = ?
       AND (CAST(substr(rst.departure_time, 1, 2) AS INTEGER) * 60 + CAST(substr(rst.departure_time, 4, 2) AS INTEGER))
           BETWEEN ? AND ?
     ORDER BY departure_minutes ASC
     LIMIT 20`
  ).bind(stopId, currentMinutes, upperMinutes).all();
  const arrivals = results.map((row) => ({
    trip_id: row.trip_id,
    route_short_name: row.route_short_name,
    route_long_name: row.route_long_name,
    headsign: row.headsign,
    scheduled_time: formatGtfsTime(row.departure_time),
    minutes_until: row.departure_minutes - currentMinutes
  }));
  const metaRow = await env.DB.prepare(
    `SELECT value FROM rail_ingest_meta WHERE key = 'last_ingested_at'`
  ).first();
  let stale = false;
  if (metaRow) {
    const lastIngest = new Date(metaRow.value);
    const ageMs = Date.now() - lastIngest.getTime();
    stale = ageMs > 8 * 24 * 60 * 60 * 1e3;
  } else {
    stale = true;
  }
  return {
    stop_id: stopRow.stop_id,
    stop_name: stopRow.stop_name,
    arrivals,
    stale
  };
}
__name(getRailSchedule, "getRailSchedule");
async function searchRailStops(env, query) {
  const { results } = await env.DB.prepare(
    `SELECT stop_id, stop_name, lat, lon
     FROM rail_stops
     WHERE LOWER(stop_name) LIKE LOWER(?)
     ORDER BY stop_name ASC
     LIMIT 20`
  ).bind(`%${query}%`).all();
  return results;
}
__name(searchRailStops, "searchRailStops");

// src/index.ts
var SELANGOR_AGENCIES = ["selangor-mobility"];
var REALTIME_AGENCIES = ["rapid-bus-kl", "rapid-bus-mrtfeeder"];
var AGENCIES = [...REALTIME_AGENCIES, ...SELANGOR_AGENCIES];
var app = new Hono2();
app.use("*", cors());
app.get("/", (c) => c.json({ status: "ok", service: "bus-watch" }));
app.get("/refresh", async (c) => {
  await refreshStaticData(c.env.KV);
  return c.json({ status: "refreshed" });
});
app.get("/nearby", async (c) => {
  const lat = parseFloat(c.req.query("lat") || "0");
  const lon = parseFloat(c.req.query("lon") || "0");
  const radius = parseInt(c.req.query("radius") || "500");
  if (!lat || !lon) return c.json({ error: "lat and lon required" }, 400);
  const allStops = await getAllStops(c.env.KV);
  const allRoutes = await getAllRoutes(c.env.KV);
  const allTrips = await getAllTrips(c.env.KV);
  const allTripStops = await getAllTripStops(c.env.KV);
  const allCalendar = await getAllCalendar(c.env.KV);
  const allFrequencies = await getAllFrequencies(c.env.KV);
  const vehicles = await getRealtimeVehicles(c.env.KV);
  const result = findNearbyStops(allStops, allRoutes, allTrips, allTripStops, allCalendar, allFrequencies, vehicles, lat, lon, radius);
  const busRoutes = findNearbyBusRoutes(allRoutes, allTrips, vehicles, lat, lon, 1e3);
  const { buses: prasaranaBuses } = await getPrasaranaBuses(c.env.KV);
  const prasaranaNearby = findNearbyPrasaranaBuses(prasaranaBuses, allRoutes, allTrips, lat, lon, Math.max(radius, 1e3));
  const mergedBusRoutes = mergeBusRoutes(busRoutes, prasaranaNearby);
  const bulkRequests = [];
  for (const stop of result) {
    if (stop.type === "bus") {
      for (const arrival of stop.arrivals) {
        if (arrival.route) {
          bulkRequests.push({ route: arrival.route, toStopId: stop.id });
        }
      }
    }
  }
  const etaMap = await getBulkHistoricalETAs(c.env.DB, bulkRequests);
  for (const stop of result) {
    if (stop.type === "bus") {
      for (const arrival of stop.arrivals) {
        if (arrival.route) {
          const eta = etaMap.get(`${arrival.route}|${stop.id}`);
          if (eta !== void 0) {
            arrival.minutes = Math.round(eta);
          }
        }
      }
    }
  }
  return c.json({ stops: result, busRoutes: mergedBusRoutes });
});
app.get("/bus/trip/:tripId/progress", async (c) => {
  const tripId = c.req.param("tripId");
  const allRoutes = await getAllRoutes(c.env.KV);
  const vehicles = await getRealtimeVehicles(c.env.KV);
  const vehicle = vehicles.find((v) => v.tripId === tripId) || null;
  const allTripStops = await getAllTripStops(c.env.KV);
  const result = getBusTripProgress(tripId, allRoutes, allTripStops, vehicle);
  return c.json(result);
});
app.get("/bus/eta", async (c) => {
  const tripId = c.req.query("tripId");
  const busNo = c.req.query("bus_no");
  const stopId = c.req.query("stopId");
  if (!stopId || !tripId && !busNo) return c.json({ error: "Missing params" }, 400);
  try {
    let route = null;
    if (busNo) {
      const { buses } = await getPrasaranaBuses(c.env.KV);
      const bus = buses.find((b) => b.bus_no === busNo);
      if (bus) route = bus.route;
    } else if (tripId) {
      const vehicles = await getRealtimeVehicles(c.env.KV);
      const vehicle = vehicles.find((v) => v.tripId === tripId);
      if (vehicle) route = vehicle.routeId;
    }
    if (!route) {
      return c.json({ eta_minutes: 5, source: "heuristic" });
    }
    const eta = await getHistoricalETA(c.env.DB, route, 0, 0, stopId);
    if (eta !== null) {
      return c.json({ eta_minutes: Math.round(eta), source: "historical" });
    }
    return c.json({ eta_minutes: 5, source: "heuristic" });
  } catch (err2) {
    console.error("Error fetching ETA:", err2);
    return c.json({ error: "Internal server error" }, 500);
  }
});
app.get("/bus/position/:busId", async (c) => {
  const busId = c.req.param("busId");
  const { buses } = await getPrasaranaBuses(c.env.KV);
  const bus = buses.find((b) => b.bus_no === busId);
  if (!bus) return c.json({ error: "Bus not found" }, 404);
  return c.json({
    bus_no: bus.bus_no,
    route: bus.route.endsWith("0") ? bus.route.slice(0, -1) : bus.route,
    latitude: bus.latitude,
    longitude: bus.longitude,
    speed: bus.speed,
    dt_gps: bus.dt_gps
  });
});
app.get("/station/:stopId/schedule", async (c) => {
  const stopId = c.req.param("stopId");
  const allStops = await getAllStops(c.env.KV);
  const allRoutes = await getAllRoutes(c.env.KV);
  const allTrips = await getAllTrips(c.env.KV);
  const allTripStops = await getAllTripStops(c.env.KV);
  const allCalendar = await getAllCalendar(c.env.KV);
  const allFrequencies = await getAllFrequencies(c.env.KV);
  const result = getStationSchedule(stopId, allStops, allRoutes, allTrips, allTripStops, allCalendar, allFrequencies);
  return c.json(result);
});
app.get("/rail/stops", async (c) => {
  const q = c.req.query("q");
  if (!q || q.trim().length < 2) {
    return c.json({ error: "q must be at least 2 characters" }, 400);
  }
  const stops = await searchRailStops(c.env, q.trim());
  return c.json({ stops });
});
app.get("/rail/schedule", async (c) => {
  const stationId = c.req.query("station_id");
  if (!stationId) return c.json({ error: "station_id is required" }, 400);
  const window2 = parseInt(c.req.query("window") || "120");
  const result = await getRailSchedule(c.env, stationId, window2);
  if (!result) return c.json({ error: "Station not found" }, 404);
  return c.json(result);
});
app.post("/rail/ingest", async (c) => {
  try {
    const result = await ingestRailTimetables(c.env);
    return c.json({ status: "ok", inserted: result.inserted });
  } catch (err2) {
    return c.json({ status: "error", message: err2?.message || String(err2) }, 500);
  }
});
app.get("/routes", async (c) => {
  const lat = parseFloat(c.req.query("lat") || "0");
  const lon = parseFloat(c.req.query("lon") || "0");
  const radius = parseInt(c.req.query("radius") || "500");
  if (!lat || !lon) return c.json({ error: "lat and lon required" }, 400);
  const allStops = await getAllStops(c.env.KV);
  const allRoutes = await getAllRoutes(c.env.KV);
  const allTrips = await getAllTrips(c.env.KV);
  const allTripStops = await getAllTripStops(c.env.KV);
  const result = findNearbyRoutes(allStops, allRoutes, allTrips, allTripStops, lat, lon, radius);
  return c.json({ routes: result });
});
app.get("/route/:routeId", async (c) => {
  const routeId = c.req.param("routeId");
  const allRoutes = await getAllRoutes(c.env.KV);
  let route = allRoutes.find((r) => r.id === routeId || r.shortName === routeId);
  const { buses: prasaranaBuses } = await getPrasaranaBuses(c.env.KV);
  if (!route) {
    const hasPrasarana = prasaranaBuses.some((b) => b.route === routeId || b.route === routeId + "0");
    if (!hasPrasarana) return c.json({ error: "Route not found" }, 404);
    route = { id: routeId, shortName: routeId, longName: "", type: 3 };
  }
  const vehicles = await getRealtimeVehicles(c.env.KV);
  const gtfsBuses = vehicles.filter((v) => v.routeId === route.id).map((v) => ({
    routeId: v.routeId,
    routeShortName: route.shortName || route.longName || "",
    destination: "",
    minutes: 0,
    tripId: v.tripId,
    lat: v.lat,
    lon: v.lon
  }));
  const pBuses = prasaranaBuses.filter((b) => b.route === route.shortName || b.route === route.shortName + "0").map((b) => ({
    routeId: route.id,
    routeShortName: route.shortName || route.longName || "",
    destination: "",
    minutes: 0,
    tripId: b.bus_no,
    lat: b.latitude,
    lon: b.longitude,
    busNo: b.bus_no
  }));
  const mergedBuses = mergeBusRoutes(gtfsBuses, pBuses);
  const allTrips = await getAllTrips(c.env.KV);
  const routeTrips = allTrips.filter((t) => t.routeId === route.id && t.shapeId);
  const allShapes = await getAllShapes(c.env.KV);
  const shapeIds = Array.from(new Set(routeTrips.map((t) => t.shapeId)));
  let shapes = shapeIds.filter((id) => allShapes[id]).map((id) => ({
    id,
    points: allShapes[id]
  }));
  let isReconstructed = false;
  if (shapes.length === 0) {
    try {
      const routeNormal = route.shortName;
      const routeSuffixed = route.shortName + "0";
      const { results: posRows } = await c.env.DB.prepare(
        `SELECT bus_no, lat, lon, timestamp FROM bus_positions
         WHERE route = ? OR route = ?
         ORDER BY bus_no, timestamp`
      ).bind(routeNormal, routeSuffixed).all();
      if (posRows && posRows.length > 0) {
        const groups = /* @__PURE__ */ new Map();
        for (const row of posRows) {
          if (!groups.has(row.bus_no)) groups.set(row.bus_no, []);
          const pts = groups.get(row.bus_no);
          const last = pts[pts.length - 1];
          if (!last || haversineDistance(last[0], last[1], row.lat, row.lon) > 50) {
            pts.push([row.lat, row.lon]);
          }
        }
        shapes = Array.from(groups.entries()).filter(([, pts]) => pts.length >= 2).map(([busNo, pts]) => ({ id: `trail_${busNo}`, points: pts }));
        if (shapes.length > 0) isReconstructed = true;
      }
    } catch (err2) {
      console.error("Failed to reconstruct route shape from D1:", err2);
    }
  }
  return c.json({ routeId: route.id, buses: mergedBuses, shapes, isReconstructed });
});
async function getKvJson(kv, key) {
  const val = await kv.get(key, "json");
  return val;
}
__name(getKvJson, "getKvJson");
async function getAllStops(kv) {
  const results = await Promise.all(AGENCIES.map((a) => getKvJson(kv, `stops:${a}`).catch(() => [])));
  return results.flat().filter(Boolean);
}
__name(getAllStops, "getAllStops");
async function getAllRoutes(kv) {
  const allRoutes = await Promise.all([...AGENCIES, ...SELANGOR_AGENCIES].map((a) => getKvJson(kv, `routes:${a}`).catch(() => []))).then((res) => res.flat().filter(Boolean));
  return allRoutes;
}
__name(getAllRoutes, "getAllRoutes");
async function getAllTrips(kv) {
  const results = await Promise.all(AGENCIES.map((a) => getKvJson(kv, `trips:${a}`).catch(() => [])));
  return results.flat().filter(Boolean);
}
__name(getAllTrips, "getAllTrips");
async function getAllTripStops(kv) {
  const results = await Promise.all(AGENCIES.map((a) => getKvJson(kv, `tripStops:${a}`).catch(() => ({}))));
  return Object.assign({}, ...results);
}
__name(getAllTripStops, "getAllTripStops");
async function getAllCalendar(kv) {
  const results = await Promise.all(AGENCIES.map((a) => getKvJson(kv, `calendar:${a}`).catch(() => [])));
  return results.flat().filter(Boolean);
}
__name(getAllCalendar, "getAllCalendar");
async function getAllFrequencies(kv) {
  const results = await Promise.all(AGENCIES.map((a) => getKvJson(kv, `frequencies:${a}`).catch(() => [])));
  return results.flat().filter(Boolean);
}
__name(getAllFrequencies, "getAllFrequencies");
async function getAllShapes(kv) {
  const results = await Promise.all(AGENCIES.map((a) => getKvJson(kv, `shapes:${a}`).catch(() => ({}))));
  return Object.assign({}, ...results);
}
__name(getAllShapes, "getAllShapes");
async function getRealtimeVehicles(kv) {
  const cached = await getKvJson(kv, "realtime:vehicles");
  if (cached && Date.now() - cached.ts < 25e3) return cached.vehicles;
  const allVehicles = await Promise.all(REALTIME_AGENCIES.map((a) => fetchVehiclePositions(a)));
  const vehicles = allVehicles.flat();
  await kv.put("realtime:vehicles", JSON.stringify({ ts: Date.now(), vehicles }));
  return vehicles;
}
__name(getRealtimeVehicles, "getRealtimeVehicles");
async function getPrasaranaBuses(kv) {
  const cached = await getKvJson(kv, "prasarana:buses");
  if (cached && Date.now() - cached.ts < 6e4) return { buses: cached.buses };
  try {
    const buses = await fetchPrasaranaBuses("RKL");
    if (buses.length > 0) {
      await kv.put("prasarana:buses", JSON.stringify({ ts: Date.now(), buses }));
    }
    return { buses };
  } catch (err2) {
    console.error("Failed to fetch Prasarana buses:", err2?.message || err2);
    return { buses: cached?.buses || [], error: err2?.message };
  }
}
__name(getPrasaranaBuses, "getPrasaranaBuses");
function mergeBusRoutes(gtfsRoutes, prasaranaRoutes) {
  const seen = /* @__PURE__ */ new Set();
  const merged = [];
  for (const r of gtfsRoutes) {
    seen.add(r.routeShortName);
    merged.push(r);
  }
  for (const r of prasaranaRoutes) {
    if (!seen.has(r.routeShortName)) {
      merged.push(r);
    }
  }
  merged.sort((a, b) => a.minutes - b.minutes);
  return merged;
}
__name(mergeBusRoutes, "mergeBusRoutes");
async function refreshStaticData(kv) {
  for (const agency of AGENCIES) {
    try {
      const data = await fetchAndParseAgency(agency);
      await Promise.all([
        kv.put(`stops:${agency}`, JSON.stringify(data.stops)),
        kv.put(`routes:${agency}`, JSON.stringify(data.routes)),
        kv.put(`trips:${agency}`, JSON.stringify(data.trips)),
        kv.put(`tripStops:${agency}`, JSON.stringify(data.tripStops)),
        kv.put(`calendar:${agency}`, JSON.stringify(data.calendar)),
        kv.put(`frequencies:${agency}`, JSON.stringify(data.frequencies)),
        kv.put(`shapes:${agency}`, JSON.stringify(data.shapes))
      ]);
    } catch (err2) {
      console.error(`Failed to refresh ${agency}:`, err2);
    }
  }
}
__name(refreshStaticData, "refreshStaticData");
var index_default = {
  fetch: app.fetch,
  scheduled: /* @__PURE__ */ __name(async (event, env, ctx) => {
    if (event.cron === "*/5 * * * *") {
      let vehicles = [];
      let buses = [];
      try {
        const [vehiclesResult, prasaranaResult] = await Promise.allSettled([
          getRealtimeVehicles(env.KV),
          getPrasaranaBuses(env.KV)
        ]);
        if (vehiclesResult.status === "fulfilled") vehicles = vehiclesResult.value;
        if (prasaranaResult.status === "fulfilled") buses = prasaranaResult.value.buses;
      } catch (err2) {
        console.error("Failed to fetch realtime data for sampling:", err2);
      }
      try {
        await sampleBusPositions(env, vehicles, buses);
        await aggregateTravelTimes(env);
        await cleanupOldPositions(env);
      } catch (err2) {
        console.error("Failed to run sampling and aggregation tasks:", err2);
      }
    } else if (event.cron === "0 2 * * 1") {
      try {
        const result = await ingestRailTimetables(env);
        console.log(`Rail timetable ingest complete: ${result.inserted} rows`);
      } catch (err2) {
        console.error("Failed to ingest rail timetables:", err2);
      }
    } else {
      await refreshStaticData(env.KV);
      try {
        const buses = await fetchPrasaranaBuses("RKL");
        await env.KV.put("prasarana:buses", JSON.stringify({ ts: Date.now(), buses }));
      } catch (err2) {
        console.error("Failed to refresh Prasarana buses:", err2);
      }
    }
  }, "scheduled")
};
export {
  index_default as default
};
/*! Bundled license information:

long/umd/index.js:
  (**
   * @license
   * Copyright 2009 The Closure Library Authors
   * Copyright 2020 Daniel Wirtz / The long.js Authors.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
//# sourceMappingURL=index.js.map
