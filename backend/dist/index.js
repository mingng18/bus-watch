var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
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

// node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/util/aspromise.js
var require_aspromise = __commonJS({
  "node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/util/aspromise.js"(exports2, module) {
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

// node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/util/base64.js
var require_base64 = __commonJS({
  "node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/util/base64.js"(exports2) {
    "use strict";
    var base64 = exports2;
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
    for (i2 = 0; i2 < 64; )
      s64[b64[i2] = i2 < 26 ? i2 + 65 : i2 < 52 ? i2 + 71 : i2 < 62 ? i2 - 4 : i2 - 59 | 43] = i2++;
    var i2;
    s64[45] = 62;
    s64[95] = 63;
    base64.encode = /* @__PURE__ */ __name(function encode(buffer, start, end) {
      var parts = null, chunk = [];
      var i3 = 0, j = 0, t;
      while (start < end) {
        var b = buffer[start++];
        switch (j) {
          case 0:
            chunk[i3++] = b64[b >> 2];
            t = (b & 3) << 4;
            j = 1;
            break;
          case 1:
            chunk[i3++] = b64[t | b >> 4];
            t = (b & 15) << 2;
            j = 2;
            break;
          case 2:
            chunk[i3++] = b64[t | b >> 6];
            chunk[i3++] = b64[b & 63];
            j = 0;
            break;
        }
        if (i3 > 8191) {
          (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
          i3 = 0;
        }
      }
      if (j) {
        chunk[i3++] = b64[t];
        chunk[i3++] = 61;
        if (j === 1)
          chunk[i3++] = 61;
      }
      if (parts) {
        if (i3)
          parts.push(String.fromCharCode.apply(String, chunk.slice(0, i3)));
        return parts.join("");
      }
      return String.fromCharCode.apply(String, chunk.slice(0, i3));
    }, "encode");
    var invalidEncoding = "invalid encoding";
    base64.decode = /* @__PURE__ */ __name(function decode(string, buffer, offset) {
      var start = offset;
      var j = 0, t;
      for (var i3 = 0; i3 < string.length; ) {
        var c = string.charCodeAt(i3++);
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

// node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/util/eventemitter.js
var require_eventemitter = __commonJS({
  "node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/util/eventemitter.js"(exports2, module) {
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
          for (var i2 = 0; i2 < listeners.length; )
            if (listeners[i2].fn === fn)
              listeners.splice(i2, 1);
            else
              ++i2;
        }
      }
      return this;
    }, "off");
    EventEmitter.prototype.emit = /* @__PURE__ */ __name(function emit(evt) {
      var listeners = this._listeners[evt];
      if (listeners) {
        var args = [], i2 = 1;
        for (; i2 < arguments.length; )
          args.push(arguments[i2++]);
        for (i2 = 0; i2 < listeners.length; )
          listeners[i2].fn.apply(listeners[i2++].ctx, args);
      }
      return this;
    }, "emit");
  }
});

// node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/util/float.js
var require_float = __commonJS({
  "node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/util/float.js"(exports2, module) {
    "use strict";
    module.exports = factory(factory);
    function factory(exports3) {
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
        exports3.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        exports3.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
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
        exports3.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        exports3.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
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
        exports3.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports3.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
        function readFloat_ieee754(readUint, buf, pos) {
          var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
          return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 1401298464324817e-60 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }
        __name(readFloat_ieee754, "readFloat_ieee754");
        exports3.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports3.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
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
        exports3.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        exports3.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
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
        exports3.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        exports3.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
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
        exports3.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports3.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
          var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
          var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
          return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }
        __name(readDouble_ieee754, "readDouble_ieee754");
        exports3.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports3.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
      })();
      return exports3;
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

// node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/util/utf8.js
var require_utf8 = __commonJS({
  "node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/util/utf8.js"(exports2) {
    "use strict";
    var utf8 = exports2;
    var replacementChar = "\uFFFD";
    var strictDecoder;
    try {
      strictDecoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
    } catch (err2) {
      strictDecoder = new TextDecoder("utf-8", { ignoreBOM: true });
    }
    utf8.length = /* @__PURE__ */ __name(function utf8_length(string) {
      var len = 0, c = 0;
      for (var i2 = 0; i2 < string.length; ++i2) {
        c = string.charCodeAt(i2);
        if (c < 128)
          len += 1;
        else if (c < 2048)
          len += 2;
        else if ((c & 64512) === 55296 && (string.charCodeAt(i2 + 1) & 64512) === 56320) {
          ++i2;
          len += 4;
        } else
          len += 3;
      }
      return len;
    }, "utf8_length");
    function utf8_read_js(buffer, start, end, str) {
      for (var i2 = start; i2 < end; ) {
        var t = buffer[i2++];
        if (t <= 127) {
          str += String.fromCharCode(t);
        } else if (t >= 192 && t < 224) {
          var c2 = (t & 31) << 6 | buffer[i2++] & 63;
          str += c2 >= 128 ? String.fromCharCode(c2) : replacementChar;
        } else if (t >= 224 && t < 240) {
          var c3 = (t & 15) << 12 | (buffer[i2++] & 63) << 6 | buffer[i2++] & 63;
          str += c3 >= 2048 ? String.fromCharCode(c3) : replacementChar;
        } else if (t >= 240) {
          var t2 = (t & 7) << 18 | (buffer[i2++] & 63) << 12 | (buffer[i2++] & 63) << 6 | buffer[i2++] & 63;
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
      var str = "", i2 = start, c1, c2, c3, c4, c5, c6, c7, c8;
      for (; i2 + 7 < end; i2 += 8) {
        c1 = buffer[i2];
        c2 = buffer[i2 + 1];
        c3 = buffer[i2 + 2];
        c4 = buffer[i2 + 3];
        c5 = buffer[i2 + 4];
        c6 = buffer[i2 + 5];
        c7 = buffer[i2 + 6];
        c8 = buffer[i2 + 7];
        if ((c1 | c2 | c3 | c4 | c5 | c6 | c7 | c8) & 128)
          return utf8_read_js(buffer, i2, end, str);
        str += String.fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8);
      }
      for (; i2 < end; ++i2) {
        c1 = buffer[i2];
        if (c1 & 128)
          return utf8_read_js(buffer, i2, end, str);
        str += String.fromCharCode(c1);
      }
      return str;
    }, "utf8_read_ascii");
    function utf8_read_strict(buffer, start, end) {
      var source = start === 0 && end === buffer.length ? buffer : buffer.subarray ? buffer.subarray(start, end) : buffer.slice(start, end);
      if (Array.isArray(source))
        source = Uint8Array.from(source);
      return strictDecoder.decode(source);
    }
    __name(utf8_read_strict, "utf8_read_strict");
    utf8.readStrict = /* @__PURE__ */ __name(function utf8_read_strict_ascii(buffer, start, end) {
      if (end - start < 1)
        return "";
      var str = "", i2 = start, c1, c2, c3, c4, c5, c6, c7, c8;
      for (; i2 + 7 < end; i2 += 8) {
        c1 = buffer[i2];
        c2 = buffer[i2 + 1];
        c3 = buffer[i2 + 2];
        c4 = buffer[i2 + 3];
        c5 = buffer[i2 + 4];
        c6 = buffer[i2 + 5];
        c7 = buffer[i2 + 6];
        c8 = buffer[i2 + 7];
        if ((c1 | c2 | c3 | c4 | c5 | c6 | c7 | c8) & 128)
          return str + utf8_read_strict(buffer, i2, end);
        str += String.fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8);
      }
      for (; i2 < end; ++i2) {
        c1 = buffer[i2];
        if (c1 & 128)
          return str + utf8_read_strict(buffer, i2, end);
        str += String.fromCharCode(c1);
      }
      return str;
    }, "utf8_read_strict_ascii");
    utf8.write = /* @__PURE__ */ __name(function utf8_write(string, buffer, offset) {
      var start = offset, c1, c2;
      for (var i2 = 0; i2 < string.length; ++i2) {
        c1 = string.charCodeAt(i2);
        if (c1 < 128) {
          buffer[offset++] = c1;
        } else if (c1 < 2048) {
          buffer[offset++] = c1 >> 6 | 192;
          buffer[offset++] = c1 & 63 | 128;
        } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i2 + 1)) & 64512) === 56320) {
          c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
          ++i2;
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

// node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/util/pool.js
var require_pool = __commonJS({
  "node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/util/pool.js"(exports2, module) {
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

// node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/util/longbits.js
var require_longbits = __commonJS({
  "node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/util/longbits.js"(exports2, module) {
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
    LongBits.prototype.toNumber = /* @__PURE__ */ __name(function toNumber2(unsigned) {
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
  "node_modules/.pnpm/long@5.3.2/node_modules/long/umd/index.js"(exports2, module) {
    (function(global2, factory) {
      function preferDefault(exports3) {
        return exports3.default || exports3;
      }
      __name(preferDefault, "preferDefault");
      if (typeof define === "function" && define.amd) {
        define([], function() {
          var exports3 = {};
          factory(exports3);
          return preferDefault(exports3);
        });
      } else if (typeof exports2 === "object") {
        factory(exports2);
        if (typeof module === "object") module.exports = preferDefault(exports2);
      } else {
        (function() {
          var exports3 = {};
          factory(exports3);
          global2.Long = preferDefault(exports3);
        })();
      }
    })(
      typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports2,
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
          for (var i2 = 0; i2 < str.length; i2 += 8) {
            var size = Math.min(8, str.length - i2), value = parseInt(str.substring(i2, i2 + size), radix);
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
        LongPrototype.toNumber = /* @__PURE__ */ __name(function toNumber2() {
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

// node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/util/minimal.js
var require_minimal = __commonJS({
  "node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/util/minimal.js"(exports2) {
    "use strict";
    var util = exports2;
    util.asPromise = require_aspromise();
    util.base64 = require_base64();
    util.EventEmitter = require_eventemitter();
    util.float = require_float();
    util.utf8 = require_utf8();
    util.pool = require_pool();
    util.LongBits = require_longbits();
    function isUnsafeProperty(key) {
      return key === "__proto__" || key === "prototype" || key === "constructor";
    }
    __name(isUnsafeProperty, "isUnsafeProperty");
    util.isUnsafeProperty = isUnsafeProperty;
    util.isNode = Boolean(typeof global !== "undefined" && global && global.process && global.process.versions && global.process.versions.node);
    util.global = util.isNode && global || typeof window !== "undefined" && window || typeof self !== "undefined" && self || exports2;
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
      if (value != null && Object.hasOwnProperty.call(obj, prop))
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
        for (var keys = Object.keys(src), i2 = 0; i2 < keys.length; ++i2)
          if (!isUnsafeProperty(keys[i2]) && (dst[keys[i2]] === void 0 || !ifNotSet))
            dst[keys[i2]] = src[keys[i2]];
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
      for (var i2 = 0; i2 < fieldNames.length; ++i2)
        fieldMap[fieldNames[i2]] = 1;
      return function() {
        for (var keys = Object.keys(this), i3 = keys.length - 1; i3 > -1; --i3)
          if (fieldMap[keys[i3]] === 1 && this[keys[i3]] !== void 0 && this[keys[i3]] !== null)
            return keys[i3];
      };
    }, "getOneOf");
    util.oneOfSetter = /* @__PURE__ */ __name(function setOneOf(fieldNames) {
      return function(name) {
        for (var i2 = 0; i2 < fieldNames.length; ++i2)
          if (fieldNames[i2] !== name)
            delete this[fieldNames[i2]];
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

// node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/writer.js
var require_writer = __commonJS({
  "node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/writer.js"(exports2, module) {
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
      for (var i2 = 0; i2 < val.length; )
        buf[pos++] = val.charCodeAt(i2++);
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
      for (var i2 = 0; i2 < val.length; ++i2)
        buf[pos + i2] = val[i2];
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

// node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/writer_buffer.js
var require_writer_buffer = __commonJS({
  "node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/writer_buffer.js"(exports2, module) {
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
        else for (var i2 = 0; i2 < val.length; )
          buf[pos++] = val[i2++];
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
      for (var i2 = 0; i2 < val.length; )
        buf[pos++] = val.charCodeAt(i2++);
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

// node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/reader.js
var require_reader = __commonJS({
  "node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/reader.js"(exports2, module) {
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
      for (var i2 = 0; i2 < 5; ++i2) {
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
      var i2 = 0;
      if (this.len - this.pos > 4) {
        for (; i2 < 4; ++i2) {
          bits2.lo = (bits2.lo | (this.buf[this.pos] & 127) << i2 * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits2;
        }
        bits2.lo = (bits2.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits2.hi = (bits2.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
        if (this.buf[this.pos++] < 128)
          return bits2;
        i2 = 0;
      } else {
        for (; i2 < 4; ++i2) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits2.lo = (bits2.lo | (this.buf[this.pos] & 127) << i2 * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits2;
        }
        throw indexOutOfRange(this);
      }
      if (this.len - this.pos > 4) {
        for (; i2 < 5; ++i2) {
          bits2.hi = (bits2.hi | (this.buf[this.pos] & 127) << i2 * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits2;
        }
      } else {
        for (; i2 < 5; ++i2) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits2.hi = (bits2.hi | (this.buf[this.pos] & 127) << i2 * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits2;
        }
      }
      throw Error("invalid varint encoding");
    }
    __name(readLongVarint, "readLongVarint");
    Reader.prototype.bool = /* @__PURE__ */ __name(function read_bool() {
      var value = false, b;
      for (var i2 = 0; i2 < 10; ++i2) {
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
    Reader.prototype.stringVerify = /* @__PURE__ */ __name(function read_string_verify() {
      var length = this.uint32(), start = this.pos, end = this.pos + length;
      if (end > this.len)
        throw indexOutOfRange(this, length);
      this.pos = end;
      return utf8.readStrict(this.buf, start, end);
    }, "read_string_verify");
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
    Reader.discardUnknown = true;
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

// node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/reader_buffer.js
var require_reader_buffer = __commonJS({
  "node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/reader_buffer.js"(exports2, module) {
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

// node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/rpc/service.js
var require_service = __commonJS({
  "node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/rpc/service.js"(exports2, module) {
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

// node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/rpc.js
var require_rpc = __commonJS({
  "node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/rpc.js"(exports2) {
    "use strict";
    var rpc = exports2;
    rpc.Service = require_service();
  }
});

// node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/roots.js
var require_roots = __commonJS({
  "node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/roots.js"(exports2, module) {
    "use strict";
    module.exports = /* @__PURE__ */ Object.create(null);
  }
});

// node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/index-minimal.js
var require_index_minimal = __commonJS({
  "node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/src/index-minimal.js"(exports2) {
    "use strict";
    exports2.build = "minimal";
    exports2.Writer = require_writer();
    exports2.BufferWriter = require_writer_buffer();
    exports2.Reader = require_reader();
    exports2.BufferReader = require_reader_buffer();
    exports2.util = require_minimal();
    exports2.rpc = require_rpc();
    exports2.roots = require_roots();
    exports2.configure = configure;
    function configure() {
      exports2.util._configure();
      exports2.Writer._configure(exports2.BufferWriter);
      exports2.Reader._configure(exports2.BufferReader);
    }
    __name(configure, "configure");
    configure();
  }
});

// node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/minimal.js
var require_minimal2 = __commonJS({
  "node_modules/.pnpm/protobufjs@8.6.4/node_modules/protobufjs/minimal.js"(exports2, module) {
    "use strict";
    module.exports = require_index_minimal();
  }
});

// node_modules/.pnpm/gtfs-realtime-bindings@2.0.0/node_modules/gtfs-realtime-bindings/gtfs-realtime.js
var require_gtfs_realtime = __commonJS({
  "node_modules/.pnpm/gtfs-realtime-bindings@2.0.0/node_modules/gtfs-realtime-bindings/gtfs-realtime.js"(exports2, module) {
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.entity.length; ++i2)
              $root.transit_realtime.FeedEntity.encode(message.entity[i2], writer.uint32(
                /* id 2, wireType 2 =*/
                18
              ).fork()).ldelim();
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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
            for (var i2 = 0; i2 < message.entity.length; ++i2) {
              var error = $root.transit_realtime.FeedEntity.verify(message.entity[i2], _depth + 1);
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
            for (var i2 = 0; i2 < object.entity.length; ++i2) {
              if (typeof object.entity[i2] !== "object")
                throw TypeError(".transit_realtime.FeedMessage.entity: object expected");
              message.entity[i2] = $root.transit_realtime.FeedEntity.fromObject(object.entity[i2], _depth + 1);
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.stopTimeUpdate.length; ++i2)
              $root.transit_realtime.TripUpdate.StopTimeUpdate.encode(message.stopTimeUpdate[i2], writer.uint32(
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
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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
            for (var i2 = 0; i2 < message.stopTimeUpdate.length; ++i2) {
              var error = $root.transit_realtime.TripUpdate.StopTimeUpdate.verify(message.stopTimeUpdate[i2], _depth + 1);
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
            for (var i2 = 0; i2 < object.stopTimeUpdate.length; ++i2) {
              if (typeof object.stopTimeUpdate[i2] !== "object")
                throw TypeError(".transit_realtime.TripUpdate.stopTimeUpdate: object expected");
              message.stopTimeUpdate[i2] = $root.transit_realtime.TripUpdate.StopTimeUpdate.fromObject(object.stopTimeUpdate[i2], _depth + 1);
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
              for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
                if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                  this[keys[i2]] = properties[keys[i2]];
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
              for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
                writer.raw(message.$unknowns[i2]);
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
              for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
                if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                  this[keys[i2]] = properties[keys[i2]];
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
              for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
                writer.raw(message.$unknowns[i2]);
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
                for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
                  if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                    this[keys[i2]] = properties[keys[i2]];
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
                for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
                  writer.raw(message.$unknowns[i2]);
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
              for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
                if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                  this[keys[i2]] = properties[keys[i2]];
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
              for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
                writer.raw(message.$unknowns[i2]);
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.multiCarriageDetails.length; ++i2)
              $root.transit_realtime.VehiclePosition.CarriageDetails.encode(message.multiCarriageDetails[i2], writer.uint32(
                /* id 11, wireType 2 =*/
                90
              ).fork()).ldelim();
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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
            for (var i2 = 0; i2 < message.multiCarriageDetails.length; ++i2) {
              var error = $root.transit_realtime.VehiclePosition.CarriageDetails.verify(message.multiCarriageDetails[i2], _depth + 1);
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
            for (var i2 = 0; i2 < object.multiCarriageDetails.length; ++i2) {
              if (typeof object.multiCarriageDetails[i2] !== "object")
                throw TypeError(".transit_realtime.VehiclePosition.multiCarriageDetails: object expected");
              message.multiCarriageDetails[i2] = $root.transit_realtime.VehiclePosition.CarriageDetails.fromObject(object.multiCarriageDetails[i2], _depth + 1);
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
              for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
                if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                  this[keys[i2]] = properties[keys[i2]];
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
              for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
                writer.raw(message.$unknowns[i2]);
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.activePeriod.length; ++i2)
              $root.transit_realtime.TimeRange.encode(message.activePeriod[i2], writer.uint32(
                /* id 1, wireType 2 =*/
                10
              ).fork()).ldelim();
          if (message.informedEntity != null && message.informedEntity.length)
            for (var i2 = 0; i2 < message.informedEntity.length; ++i2)
              $root.transit_realtime.EntitySelector.encode(message.informedEntity[i2], writer.uint32(
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
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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
            for (var i2 = 0; i2 < message.activePeriod.length; ++i2) {
              var error = $root.transit_realtime.TimeRange.verify(message.activePeriod[i2], _depth + 1);
              if (error)
                return "activePeriod." + error;
            }
          }
          if (message.informedEntity != null && message.hasOwnProperty("informedEntity")) {
            if (!Array.isArray(message.informedEntity))
              return "informedEntity: array expected";
            for (var i2 = 0; i2 < message.informedEntity.length; ++i2) {
              var error = $root.transit_realtime.EntitySelector.verify(message.informedEntity[i2], _depth + 1);
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
            for (var i2 = 0; i2 < object.activePeriod.length; ++i2) {
              if (typeof object.activePeriod[i2] !== "object")
                throw TypeError(".transit_realtime.Alert.activePeriod: object expected");
              message.activePeriod[i2] = $root.transit_realtime.TimeRange.fromObject(object.activePeriod[i2], _depth + 1);
            }
          }
          if (object.informedEntity) {
            if (!Array.isArray(object.informedEntity))
              throw TypeError(".transit_realtime.Alert.informedEntity: array expected");
            message.informedEntity = Array(object.informedEntity.length);
            for (var i2 = 0; i2 < object.informedEntity.length; ++i2) {
              if (typeof object.informedEntity[i2] !== "object")
                throw TypeError(".transit_realtime.Alert.informedEntity: object expected");
              message.informedEntity[i2] = $root.transit_realtime.EntitySelector.fromObject(object.informedEntity[i2], _depth + 1);
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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
              for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
                if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                  this[keys[i2]] = properties[keys[i2]];
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
              for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
                writer.raw(message.$unknowns[i2]);
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.translation.length; ++i2)
              $root.transit_realtime.TranslatedString.Translation.encode(message.translation[i2], writer.uint32(
                /* id 1, wireType 2 =*/
                10
              ).fork()).ldelim();
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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
            for (var i2 = 0; i2 < message.translation.length; ++i2) {
              var error = $root.transit_realtime.TranslatedString.Translation.verify(message.translation[i2], _depth + 1);
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
            for (var i2 = 0; i2 < object.translation.length; ++i2) {
              if (typeof object.translation[i2] !== "object")
                throw TypeError(".transit_realtime.TranslatedString.translation: object expected");
              message.translation[i2] = $root.transit_realtime.TranslatedString.Translation.fromObject(object.translation[i2], _depth + 1);
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
              for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
                if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                  this[keys[i2]] = properties[keys[i2]];
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
              for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
                writer.raw(message.$unknowns[i2]);
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.localizedImage.length; ++i2)
              $root.transit_realtime.TranslatedImage.LocalizedImage.encode(message.localizedImage[i2], writer.uint32(
                /* id 1, wireType 2 =*/
                10
              ).fork()).ldelim();
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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
            for (var i2 = 0; i2 < message.localizedImage.length; ++i2) {
              var error = $root.transit_realtime.TranslatedImage.LocalizedImage.verify(message.localizedImage[i2], _depth + 1);
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
            for (var i2 = 0; i2 < object.localizedImage.length; ++i2) {
              if (typeof object.localizedImage[i2] !== "object")
                throw TypeError(".transit_realtime.TranslatedImage.localizedImage: object expected");
              message.localizedImage[i2] = $root.transit_realtime.TranslatedImage.LocalizedImage.fromObject(object.localizedImage[i2], _depth + 1);
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
              for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
                if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                  this[keys[i2]] = properties[keys[i2]];
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
              for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
                writer.raw(message.$unknowns[i2]);
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.selectedTrips.length; ++i2)
              $root.transit_realtime.TripModifications.SelectedTrips.encode(message.selectedTrips[i2], writer.uint32(
                /* id 1, wireType 2 =*/
                10
              ).fork()).ldelim();
          if (message.startTimes != null && message.startTimes.length)
            for (var i2 = 0; i2 < message.startTimes.length; ++i2)
              writer.uint32(
                /* id 2, wireType 2 =*/
                18
              ).string(message.startTimes[i2]);
          if (message.serviceDates != null && message.serviceDates.length)
            for (var i2 = 0; i2 < message.serviceDates.length; ++i2)
              writer.uint32(
                /* id 3, wireType 2 =*/
                26
              ).string(message.serviceDates[i2]);
          if (message.modifications != null && message.modifications.length)
            for (var i2 = 0; i2 < message.modifications.length; ++i2)
              $root.transit_realtime.TripModifications.Modification.encode(message.modifications[i2], writer.uint32(
                /* id 4, wireType 2 =*/
                34
              ).fork()).ldelim();
          if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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
            for (var i2 = 0; i2 < message.selectedTrips.length; ++i2) {
              var error = $root.transit_realtime.TripModifications.SelectedTrips.verify(message.selectedTrips[i2], _depth + 1);
              if (error)
                return "selectedTrips." + error;
            }
          }
          if (message.startTimes != null && message.hasOwnProperty("startTimes")) {
            if (!Array.isArray(message.startTimes))
              return "startTimes: array expected";
            for (var i2 = 0; i2 < message.startTimes.length; ++i2)
              if (!$util.isString(message.startTimes[i2]))
                return "startTimes: string[] expected";
          }
          if (message.serviceDates != null && message.hasOwnProperty("serviceDates")) {
            if (!Array.isArray(message.serviceDates))
              return "serviceDates: array expected";
            for (var i2 = 0; i2 < message.serviceDates.length; ++i2)
              if (!$util.isString(message.serviceDates[i2]))
                return "serviceDates: string[] expected";
          }
          if (message.modifications != null && message.hasOwnProperty("modifications")) {
            if (!Array.isArray(message.modifications))
              return "modifications: array expected";
            for (var i2 = 0; i2 < message.modifications.length; ++i2) {
              var error = $root.transit_realtime.TripModifications.Modification.verify(message.modifications[i2], _depth + 1);
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
            for (var i2 = 0; i2 < object.selectedTrips.length; ++i2) {
              if (typeof object.selectedTrips[i2] !== "object")
                throw TypeError(".transit_realtime.TripModifications.selectedTrips: object expected");
              message.selectedTrips[i2] = $root.transit_realtime.TripModifications.SelectedTrips.fromObject(object.selectedTrips[i2], _depth + 1);
            }
          }
          if (object.startTimes) {
            if (!Array.isArray(object.startTimes))
              throw TypeError(".transit_realtime.TripModifications.startTimes: array expected");
            message.startTimes = Array(object.startTimes.length);
            for (var i2 = 0; i2 < object.startTimes.length; ++i2)
              message.startTimes[i2] = String(object.startTimes[i2]);
          }
          if (object.serviceDates) {
            if (!Array.isArray(object.serviceDates))
              throw TypeError(".transit_realtime.TripModifications.serviceDates: array expected");
            message.serviceDates = Array(object.serviceDates.length);
            for (var i2 = 0; i2 < object.serviceDates.length; ++i2)
              message.serviceDates[i2] = String(object.serviceDates[i2]);
          }
          if (object.modifications) {
            if (!Array.isArray(object.modifications))
              throw TypeError(".transit_realtime.TripModifications.modifications: array expected");
            message.modifications = Array(object.modifications.length);
            for (var i2 = 0; i2 < object.modifications.length; ++i2) {
              if (typeof object.modifications[i2] !== "object")
                throw TypeError(".transit_realtime.TripModifications.modifications: object expected");
              message.modifications[i2] = $root.transit_realtime.TripModifications.Modification.fromObject(object.modifications[i2], _depth + 1);
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
              for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
                if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                  this[keys[i2]] = properties[keys[i2]];
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
              for (var i2 = 0; i2 < message.replacementStops.length; ++i2)
                $root.transit_realtime.ReplacementStop.encode(message.replacementStops[i2], writer.uint32(
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
              for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
                writer.raw(message.$unknowns[i2]);
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
              for (var i2 = 0; i2 < message.replacementStops.length; ++i2) {
                var error = $root.transit_realtime.ReplacementStop.verify(message.replacementStops[i2], _depth + 1);
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
              for (var i2 = 0; i2 < object.replacementStops.length; ++i2) {
                if (typeof object.replacementStops[i2] !== "object")
                  throw TypeError(".transit_realtime.TripModifications.Modification.replacementStops: object expected");
                message.replacementStops[i2] = $root.transit_realtime.ReplacementStop.fromObject(object.replacementStops[i2], _depth + 1);
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
              for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
                if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                  this[keys[i2]] = properties[keys[i2]];
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
              for (var i2 = 0; i2 < message.tripIds.length; ++i2)
                writer.uint32(
                  /* id 1, wireType 2 =*/
                  10
                ).string(message.tripIds[i2]);
            if (message.shapeId != null && Object.hasOwnProperty.call(message, "shapeId"))
              writer.uint32(
                /* id 2, wireType 2 =*/
                18
              ).string(message.shapeId);
            if (message.$unknowns != null && Object.hasOwnProperty.call(message, "$unknowns"))
              for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
                writer.raw(message.$unknowns[i2]);
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
              for (var i2 = 0; i2 < message.tripIds.length; ++i2)
                if (!$util.isString(message.tripIds[i2]))
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
              for (var i2 = 0; i2 < object.tripIds.length; ++i2)
                message.tripIds[i2] = String(object.tripIds[i2]);
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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
            for (var keys = Object.keys(properties), i2 = 0; i2 < keys.length; ++i2)
              if (properties[keys[i2]] != null && keys[i2] !== "__proto__")
                this[keys[i2]] = properties[keys[i2]];
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
            for (var i2 = 0; i2 < message.$unknowns.length; ++i2)
              writer.raw(message.$unknowns[i2]);
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

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/compose.js
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i2) {
      if (i2 <= index) {
        throw new Error("next() called multiple times");
      }
      index = i2;
      let res;
      let isError = false;
      let handler;
      if (middleware[i2]) {
        handler = middleware[i2][0][0];
        context.req.routeIndex = i2;
      } else {
        handler = i2 === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i2 + 1));
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

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/utils/body.js
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

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/utils/url.js
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
  for (let i2 = groups.length - 1; i2 >= 0; i2--) {
    const [mark] = groups[i2];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i2][1]);
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
  let i2 = start;
  for (; i2 < url.length; i2++) {
    const charCode = url.charCodeAt(i2);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i2);
      const hashIndex = url.indexOf("#", i2);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i2);
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
  return results.filter((v, i2, a) => a.indexOf(v) === i2);
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

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/request.js
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

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/utils/html.js
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

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/context.js
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

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
  static {
    __name(this, "UnsupportedPathError");
  }
};

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/hono-base.js
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

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/router/reg-exp-router/matcher.js
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

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/router/reg-exp-router/node.js
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

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  static {
    __name(this, "Trie");
  }
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i2 = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i2}`;
        groups[i2] = [mark, m];
        i2++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i2 = groups.length - 1; i2 >= 0; i2--) {
      const [mark] = groups[i2];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i2][1]);
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

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/router/reg-exp-router/router.js
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
  for (let i2 = 0, j = -1, len = routesWithStaticPathFlag.length; i2 < len; i2++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i2];
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
  for (let i2 = 0, len = handlerData.length; i2 < len; i2++) {
    for (let j = 0, len2 = handlerData[i2].length; j < len2; j++) {
      const map = handlerData[i2][j]?.[1];
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
  for (const i2 in indexReplacementMap) {
    handlerMap[i2] = handlerData[indexReplacementMap[i2]];
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
    for (let i2 = 0, len = paths.length; i2 < len; i2++) {
      const path2 = paths[i2];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i2 + 1]);
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

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/router/smart-router/router.js
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
    let i2 = 0;
    let res;
    for (; i2 < len; i2++) {
      const router = routers[i2];
      try {
        for (let i22 = 0, len2 = routes.length; i22 < len2; i22++) {
          router.add(...routes[i22]);
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
    if (i2 === len) {
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

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/router/trie-router/node.js
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
    for (let i2 = 0, len = parts.length; i2 < len; i2++) {
      const p = parts[i2];
      const nextP = parts[i2 + 1];
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
        possibleKeys: possibleKeys.filter((v, i2, a) => a.indexOf(v) === i2),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i2 = 0, len = node.#methods.length; i2 < len; i2++) {
      const m = node.#methods[i2];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i22 = 0, len2 = handlerSet.possibleKeys.length; i22 < len2; i22++) {
            const key = handlerSet.possibleKeys[i22];
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
    for (let i2 = 0; i2 < len; i2++) {
      const part = parts[i2];
      const isLast = i2 === len - 1;
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
            const restPathString = path.substring(partOffsets[i2]);
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

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/router/trie-router/router.js
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
      for (let i2 = 0, len = results.length; i2 < len; i2++) {
        this.#node.insert(method, results[i2], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/hono.js
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

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/middleware/cors/index.js
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
      if (opts.origin !== "*") {
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
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  }, "cors2");
}, "cors");

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/middleware/secure-headers/secure-headers.js
var HEADERS_MAP = {
  crossOriginEmbedderPolicy: ["Cross-Origin-Embedder-Policy", "require-corp"],
  crossOriginResourcePolicy: ["Cross-Origin-Resource-Policy", "same-origin"],
  crossOriginOpenerPolicy: ["Cross-Origin-Opener-Policy", "same-origin"],
  originAgentCluster: ["Origin-Agent-Cluster", "?1"],
  referrerPolicy: ["Referrer-Policy", "no-referrer"],
  strictTransportSecurity: ["Strict-Transport-Security", "max-age=15552000; includeSubDomains"],
  xContentTypeOptions: ["X-Content-Type-Options", "nosniff"],
  xDnsPrefetchControl: ["X-DNS-Prefetch-Control", "off"],
  xDownloadOptions: ["X-Download-Options", "noopen"],
  xFrameOptions: ["X-Frame-Options", "SAMEORIGIN"],
  xPermittedCrossDomainPolicies: ["X-Permitted-Cross-Domain-Policies", "none"],
  xXssProtection: ["X-XSS-Protection", "0"]
};
var DEFAULT_OPTIONS = {
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: true,
  crossOriginOpenerPolicy: true,
  originAgentCluster: true,
  referrerPolicy: true,
  strictTransportSecurity: true,
  xContentTypeOptions: true,
  xDnsPrefetchControl: true,
  xDownloadOptions: true,
  xFrameOptions: true,
  xPermittedCrossDomainPolicies: true,
  xXssProtection: true,
  removePoweredBy: true,
  permissionsPolicy: {}
};
var secureHeaders = /* @__PURE__ */ __name((customOptions) => {
  const options = { ...DEFAULT_OPTIONS, ...customOptions };
  const headersToSet = getFilteredHeaders(options);
  const callbacks = [];
  if (options.contentSecurityPolicy) {
    const [callback, value] = getCSPDirectives(options.contentSecurityPolicy);
    if (callback) {
      callbacks.push(callback);
    }
    headersToSet.push(["Content-Security-Policy", value]);
  }
  if (options.contentSecurityPolicyReportOnly) {
    const [callback, value] = getCSPDirectives(options.contentSecurityPolicyReportOnly);
    if (callback) {
      callbacks.push(callback);
    }
    headersToSet.push(["Content-Security-Policy-Report-Only", value]);
  }
  if (options.permissionsPolicy && Object.keys(options.permissionsPolicy).length > 0) {
    headersToSet.push([
      "Permissions-Policy",
      getPermissionsPolicyDirectives(options.permissionsPolicy)
    ]);
  }
  if (options.reportingEndpoints) {
    headersToSet.push(["Reporting-Endpoints", getReportingEndpoints(options.reportingEndpoints)]);
  }
  if (options.reportTo) {
    headersToSet.push(["Report-To", getReportToOptions(options.reportTo)]);
  }
  return /* @__PURE__ */ __name(async function secureHeaders2(ctx, next) {
    const headersToSetForReq = callbacks.length === 0 ? headersToSet : callbacks.reduce((acc, cb) => cb(ctx, acc), headersToSet);
    await next();
    setHeaders(ctx, headersToSetForReq);
    if (options?.removePoweredBy) {
      ctx.res.headers.delete("X-Powered-By");
    }
  }, "secureHeaders2");
}, "secureHeaders");
function getFilteredHeaders(options) {
  return Object.entries(HEADERS_MAP).filter(([key]) => options[key]).map(([key, defaultValue]) => {
    const overrideValue = options[key];
    return typeof overrideValue === "string" ? [defaultValue[0], overrideValue] : defaultValue;
  });
}
__name(getFilteredHeaders, "getFilteredHeaders");
function getCSPDirectives(contentSecurityPolicy) {
  const callbacks = [];
  const resultValues = [];
  for (const [directive, value] of Object.entries(contentSecurityPolicy)) {
    const valueArray = Array.isArray(value) ? value : [value];
    valueArray.forEach((value2, i2) => {
      if (typeof value2 === "function") {
        const index = i2 * 2 + 2 + resultValues.length;
        callbacks.push((ctx, values) => {
          values[index] = value2(ctx, directive);
        });
      }
    });
    resultValues.push(
      directive.replace(
        /[A-Z]+(?![a-z])|[A-Z]/g,
        (match2, offset) => offset ? "-" + match2.toLowerCase() : match2.toLowerCase()
      ),
      ...valueArray.flatMap((value2) => [" ", value2]),
      "; "
    );
  }
  resultValues.pop();
  return callbacks.length === 0 ? [void 0, resultValues.join("")] : [
    (ctx, headersToSet) => headersToSet.map((values) => {
      if (values[0] === "Content-Security-Policy" || values[0] === "Content-Security-Policy-Report-Only") {
        const clone = values[1].slice();
        callbacks.forEach((cb) => {
          cb(ctx, clone);
        });
        return [values[0], clone.join("")];
      } else {
        return values;
      }
    }),
    resultValues
  ];
}
__name(getCSPDirectives, "getCSPDirectives");
function getPermissionsPolicyDirectives(policy) {
  return Object.entries(policy).map(([directive, value]) => {
    const kebabDirective = camelToKebab(directive);
    if (typeof value === "boolean") {
      return `${kebabDirective}=${value ? "*" : "none"}`;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return `${kebabDirective}=()`;
      }
      if (value.length === 1 && (value[0] === "*" || value[0] === "none")) {
        return `${kebabDirective}=${value[0]}`;
      }
      const allowlist = value.map((item) => ["self", "src"].includes(item) ? item : `"${item}"`);
      return `${kebabDirective}=(${allowlist.join(" ")})`;
    }
    return "";
  }).filter(Boolean).join(", ");
}
__name(getPermissionsPolicyDirectives, "getPermissionsPolicyDirectives");
function camelToKebab(str) {
  return str.replace(/([a-z\d])([A-Z])/g, "$1-$2").toLowerCase();
}
__name(camelToKebab, "camelToKebab");
function getReportingEndpoints(reportingEndpoints = []) {
  return reportingEndpoints.map((endpoint) => `${endpoint.name}="${endpoint.url}"`).join(", ");
}
__name(getReportingEndpoints, "getReportingEndpoints");
function getReportToOptions(reportTo = []) {
  return reportTo.map((option) => JSON.stringify(option)).join(", ");
}
__name(getReportToOptions, "getReportToOptions");
function setHeaders(ctx, headersToSet) {
  headersToSet.forEach(([header, value]) => {
    ctx.res.headers.set(header, value);
  });
}
__name(setHeaders, "setHeaders");

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/utils/crypto.js
var sha256 = /* @__PURE__ */ __name(async (data) => {
  const algorithm = { name: "SHA-256", alias: "sha256" };
  const hash = await createHash(data, algorithm);
  return hash;
}, "sha256");
var createHash = /* @__PURE__ */ __name(async (data, algorithm) => {
  let sourceBuffer;
  if (ArrayBuffer.isView(data) || data instanceof ArrayBuffer) {
    sourceBuffer = data;
  } else {
    if (typeof data === "object") {
      data = JSON.stringify(data);
    }
    sourceBuffer = new TextEncoder().encode(String(data));
  }
  if (crypto && crypto.subtle) {
    const buffer = await crypto.subtle.digest(
      {
        name: algorithm.name
      },
      sourceBuffer
    );
    const hash = Array.prototype.map.call(new Uint8Array(buffer), (x2) => ("00" + x2.toString(16)).slice(-2)).join("");
    return hash;
  }
  return null;
}, "createHash");

// node_modules/.pnpm/hono@4.12.26/node_modules/hono/dist/utils/buffer.js
var constantTimeEqualString = /* @__PURE__ */ __name((a, b) => {
  const aLen = a.length;
  const bLen = b.length;
  const maxLen = Math.max(aLen, bLen);
  let out = aLen ^ bLen;
  for (let i2 = 0; i2 < maxLen; i2++) {
    const aChar = i2 < aLen ? a.charCodeAt(i2) : 0;
    const bChar = i2 < bLen ? b.charCodeAt(i2) : 0;
    out |= aChar ^ bChar;
  }
  return out === 0;
}, "constantTimeEqualString");
var timingSafeEqualString = /* @__PURE__ */ __name(async (a, b, hashFunction) => {
  if (!hashFunction) {
    hashFunction = sha256;
  }
  const [sa, sb] = await Promise.all([hashFunction(a), hashFunction(b)]);
  if (sa == null || sb == null || typeof sa !== "string" || typeof sb !== "string") {
    return false;
  }
  const hashEqual = constantTimeEqualString(sa, sb);
  const originalEqual = constantTimeEqualString(a, b);
  return hashEqual && originalEqual;
}, "timingSafeEqualString");
var timingSafeEqual = /* @__PURE__ */ __name(async (a, b, hashFunction) => {
  if (typeof a === "string" && typeof b === "string") {
    return timingSafeEqualString(a, b, hashFunction);
  }
  if (!hashFunction) {
    hashFunction = sha256;
  }
  const [sa, sb] = await Promise.all([hashFunction(a), hashFunction(b)]);
  if (!sa || !sb || typeof sa !== "string" || typeof sb !== "string") {
    return false;
  }
  return timingSafeEqualString(sa, sb);
}, "timingSafeEqual");

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
  for (var i2 = 0; i2 < 31; ++i2) {
    b[i2] = start += 1 << eb[i2 - 1];
  }
  var r = new i32(b[30]);
  for (var i2 = 1; i2 < 30; ++i2) {
    for (var j = b[i2]; j < b[i2 + 1]; ++j) {
      r[j] = j - b[i2] << 5 | i2;
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
  var i2 = 0;
  var l = new u16(mb);
  for (; i2 < s; ++i2) {
    if (cd[i2])
      ++l[cd[i2] - 1];
  }
  var le = new u16(mb);
  for (i2 = 1; i2 < mb; ++i2) {
    le[i2] = le[i2 - 1] + l[i2 - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        var sv = i2 << 4 | cd[i2];
        var r_1 = mb - cd[i2];
        var v = le[cd[i2] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        co[i2] = rev[le[cd[i2] - 1]++] >> 15 - cd[i2];
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
  for (var i2 = 1; i2 < a.length; ++i2) {
    if (a[i2] > m)
      m = a[i2];
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
        for (var i2 = 0; i2 < hcLen; ++i2) {
          clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i2 = 0; i2 < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i2++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i2 - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i2++] = c;
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
          var i2 = sym - 257, b = fleb[i2];
          add = bits(dat, pos, (1 << b) - 1) + fl[i2];
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
  for (var r = "", i2 = 0; ; ) {
    var c = d[i2++];
    var eb = (c > 127) + (c > 223) + (c > 239);
    if (i2 + eb > d.length)
      return { s: r, r: slc(d, i2 - 1) };
    if (!eb)
      r += String.fromCharCode(c);
    else if (eb == 3) {
      c = ((c & 15) << 18 | (d[i2++] & 63) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
    } else if (eb & 1)
      r += String.fromCharCode((c & 31) << 6 | d[i2++] & 63);
    else
      r += String.fromCharCode((c & 15) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63);
  }
}, "dutf8");
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = "";
    for (var i2 = 0; i2 < dat.length; i2 += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i2, i2 + 16384));
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
  for (var i2 = 0; i2 < c; ++i2) {
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
  const normalized = text.replace(/\r\n?/g, "\n");
  const trimmed = normalized.trim();
  if (!trimmed) return [];
  const lines = trimmed.split("\n");
  const headers = parseLine(lines[0]).map((h) => h.trim());
  const rows = [];
  const headerLen = headers.length;
  for (let i2 = 1; i2 < lines.length; i2++) {
    const line = lines[i2].trim();
    if (!line) continue;
    if (line.indexOf('"') === -1) {
      const row2 = {};
      let start = 0;
      let colIdx = 0;
      while (colIdx < headerLen) {
        const commaIdx = line.indexOf(",", start);
        if (commaIdx === -1) {
          row2[headers[colIdx]] = line.substring(start).trim();
          colIdx++;
          break;
        } else {
          row2[headers[colIdx]] = line.substring(start, commaIdx).trim();
          start = commaIdx + 1;
        }
        colIdx++;
      }
      while (colIdx < headerLen) {
        row2[headers[colIdx]] = "";
        colIdx++;
      }
      rows.push(row2);
      continue;
    }
    const values = parseLine(line);
    const row = {};
    for (let j = 0; j < headerLen; j++) {
      row[headers[j]] = (values[j] || "").trim();
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
  let start = 0;
  for (let i2 = 0; i2 < line.length; i2++) {
    const ch = line[i2];
    if (ch === '"') {
      if (inQuotes && i2 + 1 < line.length && line[i2 + 1] === '"') {
        current += line.substring(start, i2) + '"';
        i2++;
        start = i2 + 1;
      } else {
        current += line.substring(start, i2);
        inQuotes = !inQuotes;
        start = i2 + 1;
      }
    } else if (ch === "," && !inQuotes) {
      current += line.substring(start, i2);
      fields.push(current);
      current = "";
      start = i2 + 1;
    }
  }
  current += line.substring(start);
  fields.push(current);
  return fields;
}
__name(parseLine, "parseLine");

// src/time-kl.ts
var KL_OFFSET_MS = 8 * 60 * 60 * 1e3;
function toKlLocal(date) {
  return new Date(date.getTime() + KL_OFFSET_MS);
}
__name(toKlLocal, "toKlLocal");
function klSecondsSinceMidnight(date) {
  const kl = toKlLocal(date);
  return kl.getUTCHours() * 3600 + kl.getUTCMinutes() * 60 + kl.getUTCSeconds();
}
__name(klSecondsSinceMidnight, "klSecondsSinceMidnight");
function klDayOfWeek(date) {
  return toKlLocal(date).getUTCDay();
}
__name(klDayOfWeek, "klDayOfWeek");
function klDateYyyyMmDd(date) {
  const kl = toKlLocal(date);
  const y = kl.getUTCFullYear();
  const m = String(kl.getUTCMonth() + 1).padStart(2, "0");
  const d = String(kl.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}
__name(klDateYyyyMmDd, "klDateYyyyMmDd");
function parseGtfsTimeParts(t) {
  let h = 0, m = 0, s = 0;
  let i2 = 0;
  const len = t.length;
  while (i2 < len && t.charCodeAt(i2) !== 58) {
    const code = t.charCodeAt(i2);
    if (code >= 48 && code <= 57) {
      h = h * 10 + (code - 48);
    }
    i2++;
  }
  i2++;
  while (i2 < len && t.charCodeAt(i2) !== 58) {
    const code = t.charCodeAt(i2);
    if (code >= 48 && code <= 57) {
      m = m * 10 + (code - 48);
    }
    i2++;
  }
  i2++;
  while (i2 < len) {
    const code = t.charCodeAt(i2);
    if (code >= 48 && code <= 57) {
      s = s * 10 + (code - 48);
    }
    i2++;
  }
  return [h, m, s];
}
__name(parseGtfsTimeParts, "parseGtfsTimeParts");
function parseGtfsTimeSeconds(time) {
  const [h, m, s] = parseGtfsTimeParts(time);
  return h * 3600 + m * 60 + s;
}
__name(parseGtfsTimeSeconds, "parseGtfsTimeSeconds");

// src/gtfs-static.ts
var STATIC_URLS = {
  "rapid-bus-kl": "https://api.data.gov.my/gtfs-static/prasarana?category=rapid-bus-kl",
  "rapid-bus-mrtfeeder": "https://api.data.gov.my/gtfs-static/prasarana?category=rapid-bus-mrtfeeder",
  "rapid-rail-kl": "https://api.data.gov.my/gtfs-static/prasarana?category=rapid-rail-kl"
};
function parseStops(rawStops, rawRoutes, rawTrips, rawStopTimes) {
  const stopMap = /* @__PURE__ */ new Map();
  const routeIdToType = /* @__PURE__ */ new Map();
  for (let i2 = 0; i2 < rawRoutes.length; i2++) {
    routeIdToType.set(rawRoutes[i2].route_id, rawRoutes[i2].route_type);
  }
  const tripToRouteType = /* @__PURE__ */ new Map();
  for (let i2 = 0; i2 < rawTrips.length; i2++) {
    tripToRouteType.set(rawTrips[i2].trip_id, routeIdToType.get(rawTrips[i2].route_id) || "3");
  }
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
  return { stops, stopMap };
}
__name(parseStops, "parseStops");
function parseRoutes(rawRoutes) {
  return rawRoutes.map((r) => ({
    id: r.route_id,
    shortName: r.route_short_name,
    longName: r.route_long_name,
    type: parseInt(r.route_type)
  }));
}
__name(parseRoutes, "parseRoutes");
function parseTrips(rawTrips) {
  return rawTrips.map((t) => ({
    id: t.trip_id,
    routeId: t.route_id,
    serviceId: t.service_id,
    headsign: t.trip_headsign,
    directionId: parseInt(t.direction_id) || 0,
    shapeId: ""
  }));
}
__name(parseTrips, "parseTrips");
function parseTripStops(rawStopTimes, stopMap) {
  const tripStops = {};
  const unsortedTrips = /* @__PURE__ */ new Set();
  for (const st of rawStopTimes) {
    const tid = st.trip_id;
    let stops = tripStops[tid];
    const seq = parseInt(st.stop_sequence);
    if (!stops) {
      stops = [];
      tripStops[tid] = stops;
    } else if (seq < stops[stops.length - 1].sequence) {
      unsortedTrips.add(tid);
    }
    const stop = stopMap.get(st.stop_id);
    stops.push({
      stopId: st.stop_id,
      stopName: stop?.name || st.stop_id,
      lat: stop?.lat || 0,
      lon: stop?.lon || 0,
      arrivalTime: st.arrival_time,
      departureTime: st.departure_time,
      sequence: seq
    });
  }
  for (const tid of unsortedTrips) {
    tripStops[tid].sort((a, b) => a.sequence - b.sequence);
  }
  return tripStops;
}
__name(parseTripStops, "parseTripStops");
async function fetchAndParseAgency(agency) {
  const url = STATIC_URLS[agency];
  if (!url) throw new Error(`Unknown agency: ${agency}`);
  let files;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15e3) });
    if (!response.ok) throw new Error(`Failed to fetch ${agency}: ${response.status}`);
    const zipBuffer = await response.arrayBuffer();
    files = unzipSync(new Uint8Array(zipBuffer));
  } catch (err2) {
    throw new Error(`Failed to fetch ${agency}: ${err2.message || err2}`);
  }
  const getFile = /* @__PURE__ */ __name((name) => {
    const key = Object.keys(files).find((k) => k.endsWith(name));
    return key ? new TextDecoder().decode(files[key]) : "";
  }, "getFile");
  const rawStops = parseCsv(getFile("stops.txt"));
  const rawRoutes = parseCsv(getFile("routes.txt"));
  const rawTrips = parseCsv(getFile("trips.txt"));
  const rawStopTimes = parseCsv(getFile("stop_times.txt"));
  const rawCalendar = parseCsv(getFile("calendar.txt"));
  const { stops, stopMap } = parseStops(rawStops, rawRoutes, rawTrips, rawStopTimes);
  const routes = parseRoutes(rawRoutes);
  const trips = parseTrips(rawTrips);
  const tripStops = parseTripStops(rawStopTimes, stopMap);
  const calendar = rawCalendar.map((c) => ({
    serviceId: c.service_id,
    days: [c.sunday, c.monday, c.tuesday, c.wednesday, c.thursday, c.friday, c.saturday].map((d) => d === "1"),
    startDate: c.start_date,
    endDate: c.end_date
  }));
  return { stops, routes, trips, tripStops, calendar, frequencies: [], shapes: {} };
}
__name(fetchAndParseAgency, "fetchAndParseAgency");
function getActiveServiceIds(calendar, date) {
  const dayIndex = klDayOfWeek(date);
  const dateStr = klDateYyyyMmDd(date);
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
  let feed;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5e3) });
    if (!response.ok) return [];
    const buffer = await response.arrayBuffer();
    feed = import_gtfs_realtime_bindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
  } catch (err2) {
    console.error(`fetchVehiclePositions failed for ${agency}:`, err2);
    return [];
  }
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
async function fetchPrasaranaBuses(provider) {
  return [];
}
__name(fetchPrasaranaBuses, "fetchPrasaranaBuses");

// src/haversine.ts
var R = 6371e3;
var TO_RAD = Math.PI / 180;
function haversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = (lat2 - lat1) * TO_RAD;
  const dLon = (lon2 - lon1) * TO_RAD;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * TO_RAD) * Math.cos(lat2 * TO_RAD) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
__name(haversineDistance, "haversineDistance");

// src/frequency.ts
function expandTripsForStop(stopId, trips, tripStops, routes, calendar, frequencies, now, timeWindow) {
  return [];
}
__name(expandTripsForStop, "expandTripsForStop");

// src/nearby.ts
function findNearbyStops(ctx) {
  const {
    stops,
    routes,
    trips,
    tripStops,
    calendar,
    frequencies,
    vehicles,
    lat,
    lon,
    radiusM
  } = ctx;
  const now = /* @__PURE__ */ new Date();
  const nearby = [];
  for (let i2 = 0; i2 < stops.length; i2++) {
    const stop = stops[i2];
    const distance = haversineDistance(lat, lon, stop.lat, stop.lon);
    if (distance <= radiusM) {
      nearby.push({ stop, distance });
    }
  }
  nearby.sort((a, b) => a.distance - b.distance);
  const tripMap = ctx.tripMap || /* @__PURE__ */ new Map();
  if (!ctx.tripMap) {
    for (let i2 = 0; i2 < trips.length; i2++) {
      tripMap.set(trips[i2].id, trips[i2]);
    }
  }
  const routeMap = ctx.routeMap || /* @__PURE__ */ new Map();
  if (!ctx.routeMap) {
    for (let i2 = 0; i2 < routes.length; i2++) {
      routeMap.set(routes[i2].id, routes[i2]);
    }
  }
  return nearby.map(({ stop, distance }) => {
    const arrivals = [];
    if (stop.type === "bus") {
      const seen = /* @__PURE__ */ new Set();
      for (const v of vehicles) {
        const d = haversineDistance(stop.lat, stop.lon, v.lat, v.lon);
        if (d > 500) continue;
        const trip = tripMap.get(v.tripId);
        const route = trip ? routeMap.get(trip.routeId) : null;
        const key = route?.id || v.tripId;
        if (seen.has(key)) continue;
        seen.add(key);
        arrivals.push({
          route: route?.shortName || "",
          destination: trip?.headsign || "",
          minutes: Math.max(1, Math.round(d / 300)),
          isRealtime: true,
          tripId: v.tripId,
          // Mark as a live GTFS-realtime position so the client can show the
          // scheduled-vs-live qualifier (issue #133).
          eta_source: "live"
        });
      }
    } else {
      const expanded = expandTripsForStop(
        stop.id,
        trips,
        tripStops,
        routes,
        calendar,
        frequencies,
        now,
        120
      );
      for (const dep of expanded.slice(0, 3)) {
        arrivals.push({
          line: dep.line,
          destination: dep.destination,
          minutes: dep.minutesUntil,
          isRealtime: false
        });
      }
    }
    return {
      id: stop.id,
      name: stop.name,
      type: stop.type,
      lat: stop.lat,
      lon: stop.lon,
      distance_m: Math.round(distance),
      arrivals: arrivals.slice(0, 3)
    };
  });
}
__name(findNearbyStops, "findNearbyStops");
function findNearbyBusRoutes(routes, trips, vehicles, lat, lon, radiusM = 1e3, pRouteMap, pTripMap) {
  const routeMap = pRouteMap || /* @__PURE__ */ new Map();
  if (!pRouteMap) {
    for (let i2 = 0; i2 < routes.length; i2++) {
      routeMap.set(routes[i2].id, routes[i2]);
    }
  }
  const tripMap = pTripMap || /* @__PURE__ */ new Map();
  if (!pTripMap) {
    for (let i2 = 0; i2 < trips.length; i2++) {
      tripMap.set(trips[i2].id, trips[i2]);
    }
  }
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  for (const v of vehicles) {
    const d = haversineDistance(lat, lon, v.lat, v.lon);
    if (d > radiusM) continue;
    const trip = tripMap.get(v.tripId);
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
function findNearbyPrasaranaBuses(buses, routes, trips, lat, lon, radiusM = 1e3, pRouteTripMap) {
  const routeTripMap = pRouteTripMap || /* @__PURE__ */ new Map();
  if (!pRouteTripMap) {
    for (const t of trips) {
      if (!routeTripMap.has(t.routeId)) {
        routeTripMap.set(t.routeId, t);
      }
    }
  }
  const routeNameMap = /* @__PURE__ */ new Map();
  for (const r of routes) {
    if (!routeNameMap.has(r.shortName)) {
      const trip = routeTripMap.get(r.id);
      routeNameMap.set(r.shortName, { route: r, trip });
    }
  }
  const results = [];
  for (const b of buses) {
    if (b.trip_rev_kind === "01" || b.trip_rev_kind === "03" || b.trip_rev_kind === "05")
      continue;
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
function confidenceFromSamples(sampleCount, spreadSeconds, avgSeconds) {
  if (sampleCount >= 8 && (avgSeconds === 0 || spreadSeconds / avgSeconds <= 0.25)) return "high";
  if (sampleCount >= 3) return "medium";
  return "low";
}
__name(confidenceFromSamples, "confidenceFromSamples");
function resultFromRow(row) {
  const minutes = row.avg_seconds / 60;
  const uncertaintyMinutes = row.spread_seconds / 60;
  return {
    minutes,
    uncertaintyMinutes,
    confidence: confidenceFromSamples(row.sample_count, row.spread_seconds, row.avg_seconds),
    isLive: false,
    sampleCount: row.sample_count
  };
}
__name(resultFromRow, "resultFromRow");
async function getHistoricalETA(db, route, fromStopId, toStopId, now = /* @__PURE__ */ new Date()) {
  const klNow = toKlLocal(now);
  const dow = klNow.getUTCDay();
  const hour = klNow.getUTCHours();
  const { results } = await db.prepare(
    `SELECT avg_seconds, sample_count, spread_seconds FROM travel_times
       WHERE route = ? AND from_stop_id = ? AND to_stop_id = ?
       ORDER BY
         CASE WHEN day_of_week = ? AND time_bucket = ? THEN 0
              WHEN day_of_week = ? THEN 1
              ELSE 2 END,
         sample_count DESC
       LIMIT 1`
  ).bind(route, fromStopId, toStopId, dow, hour, dow).all();
  if (!results || results.length === 0) return null;
  return resultFromRow(results[0]);
}
__name(getHistoricalETA, "getHistoricalETA");
async function getBatchedHistoricalETAs(db, queries, now = /* @__PURE__ */ new Date()) {
  const map = /* @__PURE__ */ new Map();
  if (queries.length === 0) return map;
  const klNow = toKlLocal(now);
  const dow = klNow.getUTCDay();
  const hour = klNow.getUTCHours();
  const stmt = db.prepare(
    `SELECT avg_seconds, sample_count, spread_seconds FROM travel_times
     WHERE route = ? AND to_stop_id = ?
     ORDER BY
       CASE WHEN day_of_week = ? AND time_bucket = ? THEN 0
            WHEN day_of_week = ? THEN 1
            ELSE 2 END,
       sample_count DESC
     LIMIT 1`
  );
  const dbQueries = queries.map((q) => stmt.bind(q.route, q.stopId, dow, hour, dow));
  const results = await db.batch(dbQueries);
  for (let i2 = 0; i2 < results.length; i2++) {
    const res = results[i2].results;
    if (res && res.length > 0) {
      const q = queries[i2];
      map.set(`${q.route}-${q.stopId}`, resultFromRow(res[0]));
    }
  }
  return map;
}
__name(getBatchedHistoricalETAs, "getBatchedHistoricalETAs");
function nearestFromStopOnRoute(busLat, busLon, stops) {
  if (stops.length === 0) return null;
  let best = stops[0];
  let bestD = haversineDistance(busLat, busLon, best.lat, best.lon);
  for (let i2 = 1; i2 < stops.length; i2++) {
    const d = haversineDistance(busLat, busLon, stops[i2].lat, stops[i2].lon);
    if (d < bestD) {
      bestD = d;
      best = stops[i2];
    }
  }
  return best;
}
__name(nearestFromStopOnRoute, "nearestFromStopOnRoute");

// src/bus-tracker.ts
function getBusTripProgress(tripId, routeMap, tripStops, vehicle) {
  const stops = tripStops[tripId];
  if (!stops) throw new Error(`Trip not found: ${tripId}`);
  const route = vehicle?.routeId ? routeMap.get(vehicle.routeId) : void 0;
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
  const routeMap = /* @__PURE__ */ new Map();
  for (let i2 = 0; i2 < routes.length; i2++) {
    routeMap.set(routes[i2].id, routes[i2]);
  }
  const activeServiceIds = getActiveServiceIds(calendar, /* @__PURE__ */ new Date());
  const departures = [];
  const nowSeconds = klSecondsSinceMidnight(/* @__PURE__ */ new Date());
  for (const trip of trips) {
    if (!activeServiceIds.has(trip.serviceId)) continue;
    const stopsForTrip = tripStops[trip.id];
    if (!stopsForTrip) continue;
    let stopEntry;
    for (let i2 = 0; i2 < stopsForTrip.length; i2++) {
      if (stopsForTrip[i2].stopId === stopId) {
        stopEntry = stopsForTrip[i2];
        break;
      }
    }
    if (!stopEntry) continue;
    const route = routeMap.get(trip.routeId);
    const depSeconds = parseGtfsTimeSeconds(stopEntry.departureTime);
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
  const stopIds = /* @__PURE__ */ new Set();
  for (let i2 = 0; i2 < stops.length; i2++) {
    const s = stops[i2];
    if (haversineDistance(lat, lon, s.lat, s.lon) <= radiusM) {
      stopIds.add(s.id);
    }
  }
  const routeIds = /* @__PURE__ */ new Set();
  for (const trip of trips) {
    const stopsForTrip = tripStops[trip.id];
    if (!stopsForTrip) continue;
    let hasMatch = false;
    for (let i2 = 0; i2 < stopsForTrip.length; i2++) {
      if (stopIds.has(stopsForTrip[i2].stopId)) {
        hasMatch = true;
        break;
      }
    }
    if (hasMatch) {
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
    `SELECT bus_no, lat, lon, ts FROM (
       SELECT bus_no, lat, lon, timestamp as ts, rowid,
         ROW_NUMBER() OVER (PARTITION BY bus_no ORDER BY timestamp DESC, rowid DESC) AS rn
       FROM bus_positions
       WHERE timestamp > (unixepoch() - 600)
     ) WHERE rn = 1`
  ).all();
  const lastPositions = /* @__PURE__ */ new Map();
  if (results) {
    for (const r of results) {
      lastPositions.set(r.bus_no, r);
    }
  }
  const gtfsInsertStmt = env.DB.prepare(
    `INSERT INTO bus_positions (bus_no, route, source, lat, lon, speed, timestamp)
     VALUES (?, ?, ?, ?, ?, NULL, ?)`
  );
  for (const v of vehicles) {
    if (!v.tripId || !v.routeId) continue;
    const last = lastPositions.get(v.tripId);
    const moved = last ? haversineDistance(last.lat, last.lon, v.lat, v.lon) > 100 : true;
    const timedOut = last ? now - last.ts >= 300 : true;
    if (moved || timedOut) {
      stmts.push(gtfsInsertStmt.bind(v.tripId, v.routeId, "gtfs", v.lat, v.lon, v.timestamp));
    }
  }
  const prasaInsertStmt = env.DB.prepare(
    `INSERT INTO bus_positions (bus_no, route, source, lat, lon, speed, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
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
      stmts.push(prasaInsertStmt.bind(b.bus_no, b.route, "prasarana", b.latitude, b.longitude, b.speed, ts));
    }
  }
  for (let i2 = 0; i2 < stmts.length; i2 += 100) {
    await env.DB.batch(stmts.slice(i2, i2 + 100));
  }
}
__name(sampleBusPositions, "sampleBusPositions");
var STOP_PASSAGE_RADIUS_M = 80;
var MAX_INTER_STOP_SECONDS = 30 * 60;
function detectStopPassages(samples, stops, route) {
  const results = [];
  if (samples.length === 0 || stops.length < 2) return results;
  const ordered = [...samples].sort((a, b) => a.timestamp - b.timestamp);
  let stopIdx = 0;
  let lastPassageTs = null;
  let lastPassageStop = null;
  for (const s of ordered) {
    const target = stops[stopIdx];
    const d = haversineDistance(s.lat, s.lon, target.lat, target.lon);
    if (d > STOP_PASSAGE_RADIUS_M) continue;
    if (lastPassageTs !== null && lastPassageStop !== null) {
      const seconds = s.timestamp - lastPassageTs;
      if (seconds > 0 && seconds <= MAX_INTER_STOP_SECONDS) {
        results.push({
          route,
          from_stop_id: lastPassageStop.stopId,
          to_stop_id: target.stopId,
          from_lat: lastPassageStop.lat,
          from_lon: lastPassageStop.lon,
          to_lat: target.lat,
          to_lon: target.lon,
          seconds,
          day_of_week: klDayOfWeek(new Date(lastPassageTs * 1e3)),
          time_bucket: klHourOfDay(new Date(lastPassageTs * 1e3))
        });
      }
    }
    lastPassageTs = s.timestamp;
    lastPassageStop = target;
    stopIdx++;
    if (stopIdx >= stops.length) break;
  }
  return results;
}
__name(detectStopPassages, "detectStopPassages");
function klHourOfDay(date) {
  const klOffsetMs = 8 * 60 * 60 * 1e3;
  return new Date(date.getTime() + klOffsetMs).getUTCHours();
}
__name(klHourOfDay, "klHourOfDay");
function aggregateSamples(samples) {
  const groups = /* @__PURE__ */ new Map();
  for (const s of samples) {
    const key = `${s.route}|${s.from_stop_id}|${s.to_stop_id}|${s.day_of_week}|${s.time_bucket}`;
    let arr = groups.get(key);
    if (!arr) groups.set(key, arr = []);
    arr.push(s);
  }
  const out = [];
  for (const arr of groups.values()) {
    const cleaned = rejectOutliers(arr.map((s) => s.seconds));
    if (cleaned.length === 0) continue;
    const avg = cleaned.reduce((a, b) => a + b, 0) / cleaned.length;
    const mad = cleaned.reduce((a, b) => a + Math.abs(b - avg), 0) / cleaned.length;
    const first = arr[0];
    out.push({
      route: first.route,
      from_stop_id: first.from_stop_id,
      to_stop_id: first.to_stop_id,
      from_lat: first.from_lat,
      from_lon: first.from_lon,
      to_lat: first.to_lat,
      to_lon: first.to_lon,
      avg_seconds: Math.round(avg),
      sample_count: cleaned.length,
      day_of_week: first.day_of_week,
      time_bucket: first.time_bucket,
      spread_seconds: Math.round(mad)
    });
  }
  return out;
}
__name(aggregateSamples, "aggregateSamples");
function rejectOutliers(values, threshold = 3) {
  if (values.length <= 3) return values;
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const devs = values.map((v) => Math.abs(v - median));
  const mad = devs.reduce((a, b) => a + b, 0) / devs.length;
  if (mad === 0) return values;
  return values.filter((_, i2) => devs[i2] <= threshold * mad);
}
__name(rejectOutliers, "rejectOutliers");
function canonicalStopSequencesByRoute(trips, tripStops) {
  const bestByRoute = /* @__PURE__ */ new Map();
  for (const t of trips) {
    const stops = tripStops[t.id];
    if (!stops || stops.length === 0) continue;
    const cur = bestByRoute.get(t.routeId);
    if (!cur || stops.length > cur.len) {
      bestByRoute.set(t.routeId, { stops, len: stops.length });
    }
  }
  const out = /* @__PURE__ */ new Map();
  for (const [routeId, { stops }] of bestByRoute) out.set(routeId, stops);
  return out;
}
__name(canonicalStopSequencesByRoute, "canonicalStopSequencesByRoute");
async function aggregateTravelTimes(env, stopSequencesByRoute) {
  const since = Math.floor(Date.now() / 1e3) - 6 * 60 * 60;
  let rows = [];
  try {
    const { results } = await env.DB.prepare(
      `SELECT bus_no, route, lat, lon, timestamp
       FROM bus_positions
       WHERE timestamp > ?
       ORDER BY route, bus_no, timestamp`
    ).bind(since).all();
    rows = (results || []).filter(
      (r) => Number.isFinite(r.lat) && Number.isFinite(r.lon) && Number.isFinite(r.timestamp)
    );
  } catch (err2) {
    console.error("aggregateTravelTimes: failed to read bus_positions:", err2);
    return;
  }
  if (rows.length === 0) return;
  const traces = /* @__PURE__ */ new Map();
  let lastKey = "";
  let lastArr = null;
  for (const r of rows) {
    const key = `${r.route}|${r.bus_no}`;
    if (key === lastKey) {
      lastArr.push(r);
    } else {
      let arr = traces.get(key);
      if (!arr) {
        arr = [];
        traces.set(key, arr);
      }
      arr.push(r);
      lastKey = key;
      lastArr = arr;
    }
  }
  const allSamples = [];
  for (const [traceKey, samples] of traces) {
    const route = traceKey.split("|")[0];
    const stops = stopSequencesByRoute.get(route);
    if (!stops) continue;
    try {
      const legs = detectStopPassages(samples, stops, route);
      allSamples.push(...legs);
    } catch (err2) {
      console.error(`aggregateTravelTimes: detectStopPassages failed for route ${route}:`, err2);
    }
  }
  if (allSamples.length === 0) return;
  const aggregated = aggregateSamples(allSamples);
  if (aggregated.length === 0) return;
  const now = Math.floor(Date.now() / 1e3);
  const travelTimesPrepStmt = env.DB.prepare(
    `INSERT INTO travel_times
         (route, from_stop_id, to_stop_id, from_lat, from_lon, to_lat, to_lon,
          avg_seconds, sample_count, updated_at, day_of_week, time_bucket, spread_seconds)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(route, from_stop_id, to_stop_id, day_of_week, time_bucket) DO UPDATE SET
         avg_seconds = ROUND((excluded.avg_seconds * excluded.sample_count
                              + travel_times.avg_seconds * travel_times.sample_count)
                             / (excluded.sample_count + travel_times.sample_count)),
         spread_seconds = ROUND((excluded.spread_seconds * excluded.sample_count
                                 + travel_times.spread_seconds * travel_times.sample_count)
                                / (excluded.sample_count + travel_times.sample_count)),
         sample_count = travel_times.sample_count + excluded.sample_count,
         updated_at = excluded.updated_at`
  );
  const upsertStmts = aggregated.map(
    (a) => travelTimesPrepStmt.bind(
      a.route,
      a.from_stop_id,
      a.to_stop_id,
      a.from_lat,
      a.from_lon,
      a.to_lat,
      a.to_lon,
      a.avg_seconds,
      a.sample_count,
      now,
      a.day_of_week,
      a.time_bucket,
      a.spread_seconds
    )
  );
  const BATCH_SIZE2 = 100;
  const CONCURRENCY = 5;
  for (let i2 = 0; i2 < upsertStmts.length; i2 += BATCH_SIZE2 * CONCURRENCY) {
    const batchPromises = [];
    for (let j = 0; j < CONCURRENCY && i2 + j * BATCH_SIZE2 < upsertStmts.length; j++) {
      const start = i2 + j * BATCH_SIZE2;
      batchPromises.push(
        env.DB.batch(upsertStmts.slice(start, start + BATCH_SIZE2)).catch((err2) => {
          console.error("aggregateTravelTimes: upsert batch failed:", err2);
        })
      );
    }
    await Promise.all(batchPromises);
  }
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
  const CONCURRENCY_LIMIT = 5;
  const chunks = [];
  for (let i2 = 0; i2 < stmts.length; i2 += BATCH_SIZE) {
    chunks.push(stmts.slice(i2, i2 + BATCH_SIZE));
  }
  for (let i2 = 0; i2 < chunks.length; i2 += CONCURRENCY_LIMIT) {
    const concurrentBatches = chunks.slice(i2, i2 + CONCURRENCY_LIMIT);
    await Promise.all(concurrentBatches.map((chunk) => db.batch(chunk)));
  }
}
__name(batch, "batch");
async function ingestRailTimetables(env) {
  let inserted = 0;
  let files;
  try {
    const resp = await fetch(RAIL_GTFS_URL, { signal: AbortSignal.timeout(15e3) });
    if (!resp.ok) throw new Error(`GTFS fetch failed: ${resp.status}`);
    const zipBuffer = await resp.arrayBuffer();
    files = unzipSync(new Uint8Array(zipBuffer));
  } catch (err2) {
    throw new Error(`GTFS fetch failed: ${err2.message || err2}`);
  }
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
  const stopPrepStmt = env.DB.prepare(
    `INSERT INTO rail_stops (stop_id, stop_name, lat, lon)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(stop_id) DO UPDATE SET stop_name=excluded.stop_name, lat=excluded.lat, lon=excluded.lon`
  );
  const stopStmts = rawStops.filter((s) => railStopIds.has(s.stop_id)).map((s) => stopPrepStmt.bind(s.stop_id, s.stop_name, parseFloat(s.stop_lat), parseFloat(s.stop_lon)));
  await batch(env.DB, stopStmts);
  inserted += stopStmts.length;
  const routePrepStmt = env.DB.prepare(
    `INSERT INTO rail_routes (route_id, route_short_name, route_long_name)
     VALUES (?, ?, ?)
     ON CONFLICT(route_id) DO UPDATE SET route_short_name=excluded.route_short_name, route_long_name=excluded.route_long_name`
  );
  const routeStmts = rawRoutes.filter((r) => railRouteIds.has(r.route_id)).map((r) => routePrepStmt.bind(r.route_id, r.route_short_name || "", r.route_long_name || ""));
  await batch(env.DB, routeStmts);
  inserted += routeStmts.length;
  const tripPrepStmt = env.DB.prepare(
    `INSERT INTO rail_trips (trip_id, route_id, service_id, headsign, direction)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(trip_id) DO UPDATE SET route_id=excluded.route_id, service_id=excluded.service_id, headsign=excluded.headsign, direction=excluded.direction`
  );
  const tripStmts = rawTrips.filter((t) => railTripIds.has(t.trip_id)).map((t) => tripPrepStmt.bind(t.trip_id, t.route_id, t.service_id, t.trip_headsign || "", parseInt(t.direction_id || "0") || 0));
  await batch(env.DB, tripStmts);
  inserted += tripStmts.length;
  const stPrepStmt = env.DB.prepare(
    `INSERT INTO rail_stop_times (trip_id, stop_id, stop_seq, arrival_time, departure_time)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(trip_id, stop_seq) DO UPDATE SET stop_id=excluded.stop_id, arrival_time=excluded.arrival_time, departure_time=excluded.departure_time`
  );
  const stStmts = rawStopTimes.filter((st) => railTripIds.has(st.trip_id)).map((st) => stPrepStmt.bind(st.trip_id, st.stop_id, parseInt(st.stop_sequence), st.arrival_time, st.departure_time || st.arrival_time));
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
  const [h, m] = parseGtfsTimeParts(t);
  const hWrapped = h % 24;
  return `${hWrapped.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
__name(formatGtfsTime, "formatGtfsTime");
async function getRailSchedule(env, stopId, windowMinutes = 120) {
  const stopRow = await env.DB.prepare(
    `SELECT stop_id, stop_name FROM rail_stops WHERE stop_id = ?`
  ).bind(stopId).first();
  if (!stopRow) return null;
  const now = /* @__PURE__ */ new Date();
  const klNow = toKlLocal(now);
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

// src/departures-toward.ts
function getDeparturesTowardDestination(stopId, destinationStopId, stops, routes, trips, tripStops, calendar, limit = 5) {
  const stop = stops.find((s) => s.id === stopId);
  if (!stop) throw new Error(`Stop not found: ${stopId}`);
  const routeMap = /* @__PURE__ */ new Map();
  for (let i2 = 0; i2 < routes.length; i2++) {
    routeMap.set(routes[i2].id, routes[i2]);
  }
  const activeServiceIds = getActiveServiceIds(calendar, /* @__PURE__ */ new Date());
  const departures = [];
  const nowSeconds = klSecondsSinceMidnight(/* @__PURE__ */ new Date());
  for (const trip of trips) {
    if (!activeServiceIds.has(trip.serviceId)) continue;
    const stopsForTrip = tripStops[trip.id];
    if (!stopsForTrip) continue;
    let currentIdx = -1;
    for (let i2 = 0; i2 < stopsForTrip.length; i2++) {
      if (stopsForTrip[i2].stopId === stopId) {
        currentIdx = i2;
        break;
      }
    }
    if (currentIdx === -1) continue;
    let hasDestination = false;
    for (let i2 = currentIdx + 1; i2 < stopsForTrip.length; i2++) {
      if (stopsForTrip[i2].stopId === destinationStopId) {
        hasDestination = true;
        break;
      }
    }
    if (!hasDestination) continue;
    const stopEntry = stopsForTrip[currentIdx];
    const route = routeMap.get(trip.routeId);
    const depSeconds = parseGtfsTimeSeconds(stopEntry.departureTime);
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
    departures: departures.slice(0, limit)
  };
}
__name(getDeparturesTowardDestination, "getDeparturesTowardDestination");

// node_modules/.pnpm/fast-xml-parser@5.10.0/node_modules/fast-xml-parser/src/util.js
var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
var regexName = new RegExp("^" + nameRegexp + "$");
function getAllMatches(string, regex) {
  const matches = [];
  let match2 = regex.exec(string);
  while (match2) {
    const allmatches = [];
    allmatches.startIndex = regex.lastIndex - match2[0].length;
    const len = match2.length;
    for (let index = 0; index < len; index++) {
      allmatches.push(match2[index]);
    }
    matches.push(allmatches);
    match2 = regex.exec(string);
  }
  return matches;
}
__name(getAllMatches, "getAllMatches");
var isName = /* @__PURE__ */ __name(function(string) {
  const match2 = regexName.exec(string);
  return !(match2 === null || typeof match2 === "undefined");
}, "isName");
function isExist(v) {
  return typeof v !== "undefined";
}
__name(isExist, "isExist");
var DANGEROUS_PROPERTY_NAMES = [
  // '__proto__',
  // 'constructor',
  // 'prototype',
  "hasOwnProperty",
  "toString",
  "valueOf",
  "__defineGetter__",
  "__defineSetter__",
  "__lookupGetter__",
  "__lookupSetter__"
];
var criticalProperties = ["__proto__", "constructor", "prototype"];

// node_modules/.pnpm/fast-xml-parser@5.10.0/node_modules/fast-xml-parser/src/validator.js
var defaultOptions = {
  allowBooleanAttributes: false,
  //A tag can have attributes without any value
  unpairedTags: []
};
function validate(xmlData, options) {
  options = Object.assign({}, defaultOptions, options);
  const tags = [];
  let tagFound = false;
  let reachedRoot = false;
  if (xmlData[0] === "\uFEFF") {
    xmlData = xmlData.substr(1);
  }
  for (let i2 = 0; i2 < xmlData.length; i2++) {
    if (xmlData[i2] === "<" && xmlData[i2 + 1] === "?") {
      i2 += 2;
      i2 = readPI(xmlData, i2);
      if (i2.err) return i2;
    } else if (xmlData[i2] === "<") {
      let tagStartPos = i2;
      i2++;
      if (xmlData[i2] === "!") {
        i2 = readCommentAndCDATA(xmlData, i2);
        continue;
      } else {
        let closingTag = false;
        if (xmlData[i2] === "/") {
          closingTag = true;
          i2++;
        }
        let tagName = "";
        for (; i2 < xmlData.length && xmlData[i2] !== ">" && xmlData[i2] !== " " && xmlData[i2] !== "	" && xmlData[i2] !== "\n" && xmlData[i2] !== "\r"; i2++) {
          tagName += xmlData[i2];
        }
        tagName = tagName.trim();
        if (tagName[tagName.length - 1] === "/") {
          tagName = tagName.substring(0, tagName.length - 1);
          i2--;
        }
        if (!validateTagName(tagName)) {
          let msg;
          if (tagName.trim().length === 0) {
            msg = "Invalid space after '<'.";
          } else {
            msg = "Tag '" + tagName + "' is an invalid name.";
          }
          return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i2));
        }
        const result = readAttributeStr(xmlData, i2);
        if (result === false) {
          return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i2));
        }
        let attrStr = result.value;
        i2 = result.index;
        if (attrStr[attrStr.length - 1] === "/") {
          const attrStrStart = i2 - attrStr.length;
          attrStr = attrStr.substring(0, attrStr.length - 1);
          const isValid = validateAttributeString(attrStr, options);
          if (isValid === true) {
            tagFound = true;
          } else {
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
          }
        } else if (closingTag) {
          if (!result.tagClosed) {
            return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i2));
          } else if (attrStr.trim().length > 0) {
            return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
          } else if (tags.length === 0) {
            return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
          } else {
            const otg = tags.pop();
            if (tagName !== otg.tagName) {
              let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
              return getErrorObject(
                "InvalidTag",
                "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                getLineNumberForPosition(xmlData, tagStartPos)
              );
            }
            if (tags.length == 0) {
              reachedRoot = true;
            }
          }
        } else {
          const isValid = validateAttributeString(attrStr, options);
          if (isValid !== true) {
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i2 - attrStr.length + isValid.err.line));
          }
          if (reachedRoot === true) {
            return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i2));
          } else if (options.unpairedTags.indexOf(tagName) !== -1) {
          } else {
            tags.push({ tagName, tagStartPos });
          }
          tagFound = true;
        }
        for (i2++; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "<") {
            if (xmlData[i2 + 1] === "!") {
              i2++;
              i2 = readCommentAndCDATA(xmlData, i2);
              continue;
            } else if (xmlData[i2 + 1] === "?") {
              i2 = readPI(xmlData, ++i2);
              if (i2.err) return i2;
            } else {
              break;
            }
          } else if (xmlData[i2] === "&") {
            const afterAmp = validateAmpersand(xmlData, i2);
            if (afterAmp == -1)
              return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i2));
            i2 = afterAmp;
          } else {
            if (reachedRoot === true && !isWhiteSpace(xmlData[i2])) {
              return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i2));
            }
          }
        }
        if (xmlData[i2] === "<") {
          i2--;
        }
      }
    } else {
      if (isWhiteSpace(xmlData[i2])) {
        continue;
      }
      return getErrorObject("InvalidChar", "char '" + xmlData[i2] + "' is not expected.", getLineNumberForPosition(xmlData, i2));
    }
  }
  if (!tagFound) {
    return getErrorObject("InvalidXml", "Start tag expected.", 1);
  } else if (tags.length == 1) {
    return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
  } else if (tags.length > 0) {
    return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t) => t.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
  }
  return true;
}
__name(validate, "validate");
function isWhiteSpace(char) {
  return char === " " || char === "	" || char === "\n" || char === "\r";
}
__name(isWhiteSpace, "isWhiteSpace");
function readPI(xmlData, i2) {
  const start = i2;
  for (; i2 < xmlData.length; i2++) {
    if (xmlData[i2] == "?" || xmlData[i2] == " ") {
      const tagname = xmlData.substr(start, i2 - start);
      if (i2 > 5 && tagname === "xml") {
        return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i2));
      } else if (xmlData[i2] == "?" && xmlData[i2 + 1] == ">") {
        i2++;
        break;
      } else {
        continue;
      }
    }
  }
  return i2;
}
__name(readPI, "readPI");
function readCommentAndCDATA(xmlData, i2) {
  if (xmlData.length > i2 + 5 && xmlData[i2 + 1] === "-" && xmlData[i2 + 2] === "-") {
    for (i2 += 3; i2 < xmlData.length; i2++) {
      if (xmlData[i2] === "-" && xmlData[i2 + 1] === "-" && xmlData[i2 + 2] === ">") {
        i2 += 2;
        break;
      }
    }
  } else if (xmlData.length > i2 + 8 && xmlData[i2 + 1] === "D" && xmlData[i2 + 2] === "O" && xmlData[i2 + 3] === "C" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "Y" && xmlData[i2 + 6] === "P" && xmlData[i2 + 7] === "E") {
    let angleBracketsCount = 1;
    for (i2 += 8; i2 < xmlData.length; i2++) {
      if (xmlData[i2] === "<") {
        angleBracketsCount++;
      } else if (xmlData[i2] === ">") {
        angleBracketsCount--;
        if (angleBracketsCount === 0) {
          break;
        }
      }
    }
  } else if (xmlData.length > i2 + 9 && xmlData[i2 + 1] === "[" && xmlData[i2 + 2] === "C" && xmlData[i2 + 3] === "D" && xmlData[i2 + 4] === "A" && xmlData[i2 + 5] === "T" && xmlData[i2 + 6] === "A" && xmlData[i2 + 7] === "[") {
    for (i2 += 8; i2 < xmlData.length; i2++) {
      if (xmlData[i2] === "]" && xmlData[i2 + 1] === "]" && xmlData[i2 + 2] === ">") {
        i2 += 2;
        break;
      }
    }
  }
  return i2;
}
__name(readCommentAndCDATA, "readCommentAndCDATA");
var doubleQuote = '"';
var singleQuote = "'";
function readAttributeStr(xmlData, i2) {
  let attrStr = "";
  let startChar = "";
  let tagClosed = false;
  for (; i2 < xmlData.length; i2++) {
    if (xmlData[i2] === doubleQuote || xmlData[i2] === singleQuote) {
      if (startChar === "") {
        startChar = xmlData[i2];
      } else if (startChar !== xmlData[i2]) {
      } else {
        startChar = "";
      }
    } else if (xmlData[i2] === ">") {
      if (startChar === "") {
        tagClosed = true;
        break;
      }
    }
    attrStr += xmlData[i2];
  }
  if (startChar !== "") {
    return false;
  }
  return {
    value: attrStr,
    index: i2,
    tagClosed
  };
}
__name(readAttributeStr, "readAttributeStr");
var validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
function validateAttributeString(attrStr, options) {
  const matches = getAllMatches(attrStr, validAttrStrRegxp);
  const attrNames = {};
  for (let i2 = 0; i2 < matches.length; i2++) {
    if (matches[i2][1].length === 0) {
      return getErrorObject("InvalidAttr", "Attribute '" + matches[i2][2] + "' has no space in starting.", getPositionFromMatch(matches[i2]));
    } else if (matches[i2][3] !== void 0 && matches[i2][4] === void 0) {
      return getErrorObject("InvalidAttr", "Attribute '" + matches[i2][2] + "' is without value.", getPositionFromMatch(matches[i2]));
    } else if (matches[i2][3] === void 0 && !options.allowBooleanAttributes) {
      return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i2][2] + "' is not allowed.", getPositionFromMatch(matches[i2]));
    }
    const attrName = matches[i2][2];
    if (!validateAttrName(attrName)) {
      return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i2]));
    }
    if (!Object.prototype.hasOwnProperty.call(attrNames, attrName)) {
      attrNames[attrName] = 1;
    } else {
      return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i2]));
    }
  }
  return true;
}
__name(validateAttributeString, "validateAttributeString");
function validateNumberAmpersand(xmlData, i2) {
  let re = /\d/;
  if (xmlData[i2] === "x") {
    i2++;
    re = /[\da-fA-F]/;
  }
  for (; i2 < xmlData.length; i2++) {
    if (xmlData[i2] === ";")
      return i2;
    if (!xmlData[i2].match(re))
      break;
  }
  return -1;
}
__name(validateNumberAmpersand, "validateNumberAmpersand");
function validateAmpersand(xmlData, i2) {
  i2++;
  if (xmlData[i2] === ";")
    return -1;
  if (xmlData[i2] === "#") {
    i2++;
    return validateNumberAmpersand(xmlData, i2);
  }
  let count = 0;
  for (; i2 < xmlData.length; i2++, count++) {
    if (xmlData[i2].match(/\w/) && count < 20)
      continue;
    if (xmlData[i2] === ";")
      break;
    return -1;
  }
  return i2;
}
__name(validateAmpersand, "validateAmpersand");
function getErrorObject(code, message, lineNumber) {
  return {
    err: {
      code,
      msg: message,
      line: lineNumber.line || lineNumber,
      col: lineNumber.col
    }
  };
}
__name(getErrorObject, "getErrorObject");
function validateAttrName(attrName) {
  return isName(attrName);
}
__name(validateAttrName, "validateAttrName");
function validateTagName(tagname) {
  return isName(tagname);
}
__name(validateTagName, "validateTagName");
function getLineNumberForPosition(xmlData, index) {
  const lines = xmlData.substring(0, index).split(/\r?\n/);
  return {
    line: lines.length,
    // column number is last line's length + 1, because column numbering starts at 1:
    col: lines[lines.length - 1].length + 1
  };
}
__name(getLineNumberForPosition, "getLineNumberForPosition");
function getPositionFromMatch(match2) {
  return match2.startIndex + match2[1].length;
}
__name(getPositionFromMatch, "getPositionFromMatch");

// node_modules/.pnpm/@nodable+entities@2.2.0/node_modules/@nodable/entities/src/entities.js
var BASIC_LATIN = {
  amp: "&",
  AMP: "&",
  lt: "<",
  LT: "<",
  gt: ">",
  GT: ">",
  quot: '"',
  QUOT: '"',
  apos: "'",
  lsquo: "\u2018",
  rsquo: "\u2019",
  ldquo: "\u201C",
  rdquo: "\u201D",
  lsquor: "\u201A",
  rsquor: "\u2019",
  ldquor: "\u201E",
  bdquo: "\u201E",
  comma: ",",
  period: ".",
  colon: ":",
  semi: ";",
  excl: "!",
  quest: "?",
  num: "#",
  dollar: "$",
  percent: "%",
  ast: "*",
  commat: "@",
  lowbar: "_",
  verbar: "|",
  vert: "|",
  sol: "/",
  bsol: "\\",
  lbrace: "{",
  rbrace: "}",
  lbrack: "[",
  rbrack: "]",
  lpar: "(",
  rpar: ")",
  nbsp: "\xA0",
  iexcl: "\xA1",
  cent: "\xA2",
  pound: "\xA3",
  curren: "\xA4",
  yen: "\xA5",
  brvbar: "\xA6",
  sect: "\xA7",
  uml: "\xA8",
  copy: "\xA9",
  COPY: "\xA9",
  ordf: "\xAA",
  laquo: "\xAB",
  not: "\xAC",
  shy: "\xAD",
  reg: "\xAE",
  REG: "\xAE",
  macr: "\xAF",
  deg: "\xB0",
  plusmn: "\xB1",
  sup2: "\xB2",
  sup3: "\xB3",
  acute: "\xB4",
  micro: "\xB5",
  para: "\xB6",
  middot: "\xB7",
  cedil: "\xB8",
  sup1: "\xB9",
  ordm: "\xBA",
  raquo: "\xBB",
  frac14: "\xBC",
  frac12: "\xBD",
  half: "\xBD",
  frac34: "\xBE",
  iquest: "\xBF",
  times: "\xD7",
  div: "\xF7",
  divide: "\xF7"
};
var LATIN_ACCENTS = {
  Agrave: "\xC0",
  agrave: "\xE0",
  Aacute: "\xC1",
  aacute: "\xE1",
  Acirc: "\xC2",
  acirc: "\xE2",
  Atilde: "\xC3",
  atilde: "\xE3",
  Auml: "\xC4",
  auml: "\xE4",
  Aring: "\xC5",
  aring: "\xE5",
  AElig: "\xC6",
  aelig: "\xE6",
  Ccedil: "\xC7",
  ccedil: "\xE7",
  Egrave: "\xC8",
  egrave: "\xE8",
  Eacute: "\xC9",
  eacute: "\xE9",
  Ecirc: "\xCA",
  ecirc: "\xEA",
  Euml: "\xCB",
  euml: "\xEB",
  Igrave: "\xCC",
  igrave: "\xEC",
  Iacute: "\xCD",
  iacute: "\xED",
  Icirc: "\xCE",
  icirc: "\xEE",
  Iuml: "\xCF",
  iuml: "\xEF",
  ETH: "\xD0",
  eth: "\xF0",
  Ntilde: "\xD1",
  ntilde: "\xF1",
  Ograve: "\xD2",
  ograve: "\xF2",
  Oacute: "\xD3",
  oacute: "\xF3",
  Ocirc: "\xD4",
  ocirc: "\xF4",
  Otilde: "\xD5",
  otilde: "\xF5",
  Ouml: "\xD6",
  ouml: "\xF6",
  Oslash: "\xD8",
  oslash: "\xF8",
  Ugrave: "\xD9",
  ugrave: "\xF9",
  Uacute: "\xDA",
  uacute: "\xFA",
  Ucirc: "\xDB",
  ucirc: "\xFB",
  Uuml: "\xDC",
  uuml: "\xFC",
  Yacute: "\xDD",
  yacute: "\xFD",
  THORN: "\xDE",
  thorn: "\xFE",
  szlig: "\xDF",
  yuml: "\xFF",
  Yuml: "\u0178"
};
var LATIN_EXTENDED = {
  Amacr: "\u0100",
  amacr: "\u0101",
  Abreve: "\u0102",
  abreve: "\u0103",
  Aogon: "\u0104",
  aogon: "\u0105",
  Cacute: "\u0106",
  cacute: "\u0107",
  Ccirc: "\u0108",
  ccirc: "\u0109",
  Cdot: "\u010A",
  cdot: "\u010B",
  Ccaron: "\u010C",
  ccaron: "\u010D",
  Dcaron: "\u010E",
  dcaron: "\u010F",
  Dstrok: "\u0110",
  dstrok: "\u0111",
  Emacr: "\u0112",
  emacr: "\u0113",
  Ecaron: "\u011A",
  ecaron: "\u011B",
  Edot: "\u0116",
  edot: "\u0117",
  Eogon: "\u0118",
  eogon: "\u0119",
  Gcirc: "\u011C",
  gcirc: "\u011D",
  Gbreve: "\u011E",
  gbreve: "\u011F",
  Gdot: "\u0120",
  gdot: "\u0121",
  Gcedil: "\u0122",
  Hcirc: "\u0124",
  hcirc: "\u0125",
  Hstrok: "\u0126",
  hstrok: "\u0127",
  Itilde: "\u0128",
  itilde: "\u0129",
  Imacr: "\u012A",
  imacr: "\u012B",
  Iogon: "\u012E",
  iogon: "\u012F",
  Idot: "\u0130",
  IJlig: "\u0132",
  ijlig: "\u0133",
  Jcirc: "\u0134",
  jcirc: "\u0135",
  Kcedil: "\u0136",
  kcedil: "\u0137",
  kgreen: "\u0138",
  Lacute: "\u0139",
  lacute: "\u013A",
  Lcedil: "\u013B",
  lcedil: "\u013C",
  Lcaron: "\u013D",
  lcaron: "\u013E",
  Lmidot: "\u013F",
  lmidot: "\u0140",
  Lstrok: "\u0141",
  lstrok: "\u0142",
  Nacute: "\u0143",
  nacute: "\u0144",
  Ncaron: "\u0147",
  ncaron: "\u0148",
  Ncedil: "\u0145",
  ncedil: "\u0146",
  ENG: "\u014A",
  eng: "\u014B",
  Omacr: "\u014C",
  omacr: "\u014D",
  Odblac: "\u0150",
  odblac: "\u0151",
  OElig: "\u0152",
  oelig: "\u0153",
  Racute: "\u0154",
  racute: "\u0155",
  Rcaron: "\u0158",
  rcaron: "\u0159",
  Rcedil: "\u0156",
  rcedil: "\u0157",
  Sacute: "\u015A",
  sacute: "\u015B",
  Scirc: "\u015C",
  scirc: "\u015D",
  Scedil: "\u015E",
  scedil: "\u015F",
  Scaron: "\u0160",
  scaron: "\u0161",
  Tcedil: "\u0162",
  tcedil: "\u0163",
  Tcaron: "\u0164",
  tcaron: "\u0165",
  Tstrok: "\u0166",
  tstrok: "\u0167",
  Utilde: "\u0168",
  utilde: "\u0169",
  Umacr: "\u016A",
  umacr: "\u016B",
  Ubreve: "\u016C",
  ubreve: "\u016D",
  Uring: "\u016E",
  uring: "\u016F",
  Udblac: "\u0170",
  udblac: "\u0171",
  Uogon: "\u0172",
  uogon: "\u0173",
  Wcirc: "\u0174",
  wcirc: "\u0175",
  Ycirc: "\u0176",
  ycirc: "\u0177",
  Zacute: "\u0179",
  zacute: "\u017A",
  Zdot: "\u017B",
  zdot: "\u017C",
  Zcaron: "\u017D",
  zcaron: "\u017E"
};
var GREEK = {
  Alpha: "\u0391",
  alpha: "\u03B1",
  Beta: "\u0392",
  beta: "\u03B2",
  Gamma: "\u0393",
  gamma: "\u03B3",
  Delta: "\u0394",
  delta: "\u03B4",
  Epsilon: "\u0395",
  epsilon: "\u03B5",
  epsiv: "\u03F5",
  varepsilon: "\u03F5",
  Zeta: "\u0396",
  zeta: "\u03B6",
  Eta: "\u0397",
  eta: "\u03B7",
  Theta: "\u0398",
  theta: "\u03B8",
  thetasym: "\u03D1",
  vartheta: "\u03D1",
  Iota: "\u0399",
  iota: "\u03B9",
  Kappa: "\u039A",
  kappa: "\u03BA",
  kappav: "\u03F0",
  varkappa: "\u03F0",
  Lambda: "\u039B",
  lambda: "\u03BB",
  Mu: "\u039C",
  mu: "\u03BC",
  Nu: "\u039D",
  nu: "\u03BD",
  Xi: "\u039E",
  xi: "\u03BE",
  Omicron: "\u039F",
  omicron: "\u03BF",
  Pi: "\u03A0",
  pi: "\u03C0",
  piv: "\u03D6",
  varpi: "\u03D6",
  Rho: "\u03A1",
  rho: "\u03C1",
  rhov: "\u03F1",
  varrho: "\u03F1",
  Sigma: "\u03A3",
  sigma: "\u03C3",
  sigmaf: "\u03C2",
  sigmav: "\u03C2",
  varsigma: "\u03C2",
  Tau: "\u03A4",
  tau: "\u03C4",
  Upsilon: "\u03A5",
  upsilon: "\u03C5",
  upsi: "\u03C5",
  Upsi: "\u03D2",
  upsih: "\u03D2",
  Phi: "\u03A6",
  phi: "\u03C6",
  phiv: "\u03D5",
  varphi: "\u03D5",
  Chi: "\u03A7",
  chi: "\u03C7",
  Psi: "\u03A8",
  psi: "\u03C8",
  Omega: "\u03A9",
  omega: "\u03C9",
  ohm: "\u03A9",
  Gammad: "\u03DC",
  gammad: "\u03DD",
  digamma: "\u03DD"
};
var CYRILLIC = {
  Afr: "\u{1D504}",
  afr: "\u{1D51E}",
  Acy: "\u0410",
  acy: "\u0430",
  Bcy: "\u0411",
  bcy: "\u0431",
  Vcy: "\u0412",
  vcy: "\u0432",
  Gcy: "\u0413",
  gcy: "\u0433",
  Dcy: "\u0414",
  dcy: "\u0434",
  IEcy: "\u0415",
  iecy: "\u0435",
  IOcy: "\u0401",
  iocy: "\u0451",
  ZHcy: "\u0416",
  zhcy: "\u0436",
  Zcy: "\u0417",
  zcy: "\u0437",
  Icy: "\u0418",
  icy: "\u0438",
  Jcy: "\u0419",
  jcy: "\u0439",
  Kcy: "\u041A",
  kcy: "\u043A",
  Lcy: "\u041B",
  lcy: "\u043B",
  Mcy: "\u041C",
  mcy: "\u043C",
  Ncy: "\u041D",
  ncy: "\u043D",
  Ocy: "\u041E",
  ocy: "\u043E",
  Pcy: "\u041F",
  pcy: "\u043F",
  Rcy: "\u0420",
  rcy: "\u0440",
  Scy: "\u0421",
  scy: "\u0441",
  Tcy: "\u0422",
  tcy: "\u0442",
  Ucy: "\u0423",
  ucy: "\u0443",
  Fcy: "\u0424",
  fcy: "\u0444",
  KHcy: "\u0425",
  khcy: "\u0445",
  TScy: "\u0426",
  tscy: "\u0446",
  CHcy: "\u0427",
  chcy: "\u0447",
  SHcy: "\u0428",
  shcy: "\u0448",
  SHCHcy: "\u0429",
  shchcy: "\u0449",
  HARDcy: "\u042A",
  hardcy: "\u044A",
  Ycy: "\u042B",
  ycy: "\u044B",
  SOFTcy: "\u042C",
  softcy: "\u044C",
  Ecy: "\u042D",
  ecy: "\u044D",
  YUcy: "\u042E",
  yucy: "\u044E",
  YAcy: "\u042F",
  yacy: "\u044F",
  DJcy: "\u0402",
  djcy: "\u0452",
  GJcy: "\u0403",
  gjcy: "\u0453",
  Jukcy: "\u0404",
  jukcy: "\u0454",
  DScy: "\u0405",
  dscy: "\u0455",
  Iukcy: "\u0406",
  iukcy: "\u0456",
  YIcy: "\u0407",
  yicy: "\u0457",
  Jsercy: "\u0408",
  jsercy: "\u0458",
  LJcy: "\u0409",
  ljcy: "\u0459",
  NJcy: "\u040A",
  njcy: "\u045A",
  TSHcy: "\u040B",
  tshcy: "\u045B",
  KJcy: "\u040C",
  kjcy: "\u045C",
  Ubrcy: "\u040E",
  ubrcy: "\u045E",
  DZcy: "\u040F",
  dzcy: "\u045F"
};
var MATH = {
  plus: "+",
  pm: "\xB1",
  times: "\xD7",
  div: "\xF7",
  divide: "\xF7",
  sdot: "\u22C5",
  star: "\u2606",
  starf: "\u2605",
  bigstar: "\u2605",
  lowast: "\u2217",
  ast: "*",
  midast: "*",
  compfn: "\u2218",
  smallcircle: "\u2218",
  bullet: "\u2022",
  bull: "\u2022",
  nbsp: "\xA0",
  hellip: "\u2026",
  mldr: "\u2026",
  prime: "\u2032",
  Prime: "\u2033",
  tprime: "\u2034",
  bprime: "\u2035",
  backprime: "\u2035",
  minus: "\u2212",
  minusd: "\u2238",
  dotminus: "\u2238",
  plusdo: "\u2214",
  dotplus: "\u2214",
  plusmn: "\xB1",
  minusplus: "\u2213",
  mnplus: "\u2213",
  mp: "\u2213",
  setminus: "\u2216",
  smallsetminus: "\u2216",
  Backslash: "\u2216",
  setmn: "\u2216",
  ssetmn: "\u2216",
  lowbar: "_",
  verbar: "|",
  vert: "|",
  VerticalLine: "|",
  colon: ":",
  Colon: "\u2237",
  Proportion: "\u2237",
  ratio: "\u2236",
  equals: "=",
  ne: "\u2260",
  nequiv: "\u2262",
  equiv: "\u2261",
  Congruent: "\u2261",
  sim: "\u223C",
  thicksim: "\u223C",
  thksim: "\u223C",
  sime: "\u2243",
  simeq: "\u2243",
  TildeEqual: "\u2243",
  asymp: "\u2248",
  approx: "\u2248",
  thickapprox: "\u2248",
  thkap: "\u2248",
  TildeTilde: "\u2248",
  ncong: "\u2247",
  cong: "\u2245",
  TildeFullEqual: "\u2245",
  asympeq: "\u224D",
  CupCap: "\u224D",
  bump: "\u224E",
  Bumpeq: "\u224E",
  HumpDownHump: "\u224E",
  bumpe: "\u224F",
  bumpeq: "\u224F",
  HumpEqual: "\u224F",
  le: "\u2264",
  LessEqual: "\u2264",
  ge: "\u2265",
  GreaterEqual: "\u2265",
  lesseqgtr: "\u22DA",
  lesseqqgtr: "\u2A8B",
  greater: ">",
  less: "<"
};
var MATH_ADVANCED = {
  alefsym: "\u2135",
  aleph: "\u2135",
  beth: "\u2136",
  gimel: "\u2137",
  daleth: "\u2138",
  forall: "\u2200",
  ForAll: "\u2200",
  part: "\u2202",
  PartialD: "\u2202",
  exist: "\u2203",
  Exists: "\u2203",
  nexist: "\u2204",
  nexists: "\u2204",
  empty: "\u2205",
  emptyset: "\u2205",
  emptyv: "\u2205",
  varnothing: "\u2205",
  nabla: "\u2207",
  Del: "\u2207",
  isin: "\u2208",
  isinv: "\u2208",
  in: "\u2208",
  Element: "\u2208",
  notin: "\u2209",
  notinva: "\u2209",
  ni: "\u220B",
  niv: "\u220B",
  SuchThat: "\u220B",
  ReverseElement: "\u220B",
  notni: "\u220C",
  notniva: "\u220C",
  prod: "\u220F",
  Product: "\u220F",
  coprod: "\u2210",
  Coproduct: "\u2210",
  sum: "\u2211",
  Sum: "\u2211",
  minus: "\u2212",
  mp: "\u2213",
  plusdo: "\u2214",
  dotplus: "\u2214",
  setminus: "\u2216",
  lowast: "\u2217",
  radic: "\u221A",
  Sqrt: "\u221A",
  prop: "\u221D",
  propto: "\u221D",
  Proportional: "\u221D",
  varpropto: "\u221D",
  infin: "\u221E",
  infintie: "\u29DD",
  ang: "\u2220",
  angle: "\u2220",
  angmsd: "\u2221",
  measuredangle: "\u2221",
  angsph: "\u2222",
  mid: "\u2223",
  VerticalBar: "\u2223",
  nmid: "\u2224",
  nsmid: "\u2224",
  npar: "\u2226",
  parallel: "\u2225",
  spar: "\u2225",
  nparallel: "\u2226",
  nspar: "\u2226",
  and: "\u2227",
  wedge: "\u2227",
  or: "\u2228",
  vee: "\u2228",
  cap: "\u2229",
  cup: "\u222A",
  int: "\u222B",
  Integral: "\u222B",
  conint: "\u222E",
  ContourIntegral: "\u222E",
  Conint: "\u222F",
  DoubleContourIntegral: "\u222F",
  Cconint: "\u2230",
  there4: "\u2234",
  therefore: "\u2234",
  Therefore: "\u2234",
  becaus: "\u2235",
  because: "\u2235",
  Because: "\u2235",
  ratio: "\u2236",
  Proportion: "\u2237",
  minusd: "\u2238",
  dotminus: "\u2238",
  mDDot: "\u223A",
  homtht: "\u223B",
  sim: "\u223C",
  bsimg: "\u223D",
  backsim: "\u223D",
  ac: "\u223E",
  mstpos: "\u223E",
  acd: "\u223F",
  VerticalTilde: "\u2240",
  wr: "\u2240",
  wreath: "\u2240",
  nsime: "\u2244",
  nsimeq: "\u2244",
  ncong: "\u2247",
  simne: "\u2246",
  ncongdot: "\u2A6D\u0338",
  ngsim: "\u2275",
  nsim: "\u2241",
  napprox: "\u2249",
  nap: "\u2249",
  ngeq: "\u2271",
  nge: "\u2271",
  nleq: "\u2270",
  nle: "\u2270",
  ngtr: "\u226F",
  ngt: "\u226F",
  nless: "\u226E",
  nlt: "\u226E",
  nprec: "\u2280",
  npr: "\u2280",
  nsucc: "\u2281",
  nsc: "\u2281"
};
var ARROWS = {
  larr: "\u2190",
  leftarrow: "\u2190",
  LeftArrow: "\u2190",
  uarr: "\u2191",
  uparrow: "\u2191",
  UpArrow: "\u2191",
  rarr: "\u2192",
  rightarrow: "\u2192",
  RightArrow: "\u2192",
  darr: "\u2193",
  downarrow: "\u2193",
  DownArrow: "\u2193",
  harr: "\u2194",
  leftrightarrow: "\u2194",
  LeftRightArrow: "\u2194",
  varr: "\u2195",
  updownarrow: "\u2195",
  UpDownArrow: "\u2195",
  nwarr: "\u2196",
  nwarrow: "\u2196",
  UpperLeftArrow: "\u2196",
  nearr: "\u2197",
  nearrow: "\u2197",
  UpperRightArrow: "\u2197",
  searr: "\u2198",
  searrow: "\u2198",
  LowerRightArrow: "\u2198",
  swarr: "\u2199",
  swarrow: "\u2199",
  LowerLeftArrow: "\u2199",
  lArr: "\u21D0",
  Leftarrow: "\u21D0",
  uArr: "\u21D1",
  Uparrow: "\u21D1",
  rArr: "\u21D2",
  Rightarrow: "\u21D2",
  dArr: "\u21D3",
  Downarrow: "\u21D3",
  hArr: "\u21D4",
  Leftrightarrow: "\u21D4",
  iff: "\u21D4",
  vArr: "\u21D5",
  Updownarrow: "\u21D5",
  lAarr: "\u21DA",
  Lleftarrow: "\u21DA",
  rAarr: "\u21DB",
  Rrightarrow: "\u21DB",
  lrarr: "\u21C6",
  leftrightarrows: "\u21C6",
  rlarr: "\u21C4",
  rightleftarrows: "\u21C4",
  lrhar: "\u21CB",
  leftrightharpoons: "\u21CB",
  ReverseEquilibrium: "\u21CB",
  rlhar: "\u21CC",
  rightleftharpoons: "\u21CC",
  Equilibrium: "\u21CC",
  udarr: "\u21C5",
  UpArrowDownArrow: "\u21C5",
  duarr: "\u21F5",
  DownArrowUpArrow: "\u21F5",
  llarr: "\u21C7",
  leftleftarrows: "\u21C7",
  rrarr: "\u21C9",
  rightrightarrows: "\u21C9",
  ddarr: "\u21CA",
  downdownarrows: "\u21CA",
  har: "\u21BD",
  lhard: "\u21BD",
  leftharpoondown: "\u21BD",
  lharu: "\u21BC",
  leftharpoonup: "\u21BC",
  rhard: "\u21C1",
  rightharpoondown: "\u21C1",
  rharu: "\u21C0",
  rightharpoonup: "\u21C0",
  lsh: "\u21B0",
  Lsh: "\u21B0",
  rsh: "\u21B1",
  Rsh: "\u21B1",
  ldsh: "\u21B2",
  rdsh: "\u21B3",
  hookleftarrow: "\u21A9",
  hookrightarrow: "\u21AA",
  mapstoleft: "\u21A4",
  mapstoup: "\u21A5",
  map: "\u21A6",
  mapsto: "\u21A6",
  mapstodown: "\u21A7",
  crarr: "\u21B5",
  nleftarrow: "\u219A",
  nleftrightarrow: "\u21AE",
  nrightarrow: "\u219B",
  nrarr: "\u219B",
  larrtl: "\u21A2",
  rarrtl: "\u21A3",
  leftarrowtail: "\u21A2",
  rightarrowtail: "\u21A3",
  twoheadleftarrow: "\u219E",
  twoheadrightarrow: "\u21A0",
  Larr: "\u219E",
  Rarr: "\u21A0",
  larrhk: "\u21A9",
  rarrhk: "\u21AA",
  larrlp: "\u21AB",
  looparrowleft: "\u21AB",
  rarrlp: "\u21AC",
  looparrowright: "\u21AC",
  harrw: "\u21AD",
  leftrightsquigarrow: "\u21AD",
  nrarrw: "\u219D\u0338",
  rarrw: "\u219D",
  rightsquigarrow: "\u219D",
  larrbfs: "\u291F",
  rarrbfs: "\u2920",
  nvHarr: "\u2904",
  nvlArr: "\u2902",
  nvrArr: "\u2903",
  larrfs: "\u291D",
  rarrfs: "\u291E",
  Map: "\u2905",
  larrsim: "\u2973",
  rarrsim: "\u2974",
  harrcir: "\u2948",
  Uarrocir: "\u2949",
  lurdshar: "\u294A",
  ldrdhar: "\u2967",
  ldrushar: "\u294B",
  rdldhar: "\u2969",
  lrhard: "\u296D",
  uharr: "\u21BE",
  uharl: "\u21BF",
  dharr: "\u21C2",
  dharl: "\u21C3",
  Uarr: "\u219F",
  Darr: "\u21A1",
  zigrarr: "\u21DD",
  nwArr: "\u21D6",
  neArr: "\u21D7",
  seArr: "\u21D8",
  swArr: "\u21D9",
  nharr: "\u21AE",
  nhArr: "\u21CE",
  nlarr: "\u219A",
  nlArr: "\u21CD",
  nrArr: "\u21CF",
  larrb: "\u21E4",
  LeftArrowBar: "\u21E4",
  rarrb: "\u21E5",
  RightArrowBar: "\u21E5"
};
var SHAPES = {
  square: "\u25A1",
  Square: "\u25A1",
  squ: "\u25A1",
  squf: "\u25AA",
  squarf: "\u25AA",
  blacksquar: "\u25AA",
  blacksquare: "\u25AA",
  FilledVerySmallSquare: "\u25AA",
  blk34: "\u2593",
  blk12: "\u2592",
  blk14: "\u2591",
  block: "\u2588",
  srect: "\u25AD",
  rect: "\u25AD",
  sdot: "\u22C5",
  sdotb: "\u22A1",
  dotsquare: "\u22A1",
  triangle: "\u25B5",
  tri: "\u25B5",
  trine: "\u25B5",
  utri: "\u25B5",
  triangledown: "\u25BF",
  dtri: "\u25BF",
  tridown: "\u25BF",
  triangleleft: "\u25C3",
  ltri: "\u25C3",
  triangleright: "\u25B9",
  rtri: "\u25B9",
  blacktriangle: "\u25B4",
  utrif: "\u25B4",
  blacktriangledown: "\u25BE",
  dtrif: "\u25BE",
  blacktriangleleft: "\u25C2",
  ltrif: "\u25C2",
  blacktriangleright: "\u25B8",
  rtrif: "\u25B8",
  loz: "\u25CA",
  lozenge: "\u25CA",
  blacklozenge: "\u29EB",
  lozf: "\u29EB",
  bigcirc: "\u25EF",
  xcirc: "\u25EF",
  circ: "\u02C6",
  Circle: "\u25CB",
  cir: "\u25CB",
  o: "\u25CB",
  bullet: "\u2022",
  bull: "\u2022",
  hellip: "\u2026",
  mldr: "\u2026",
  nldr: "\u2025",
  boxh: "\u2500",
  HorizontalLine: "\u2500",
  boxv: "\u2502",
  boxdr: "\u250C",
  boxdl: "\u2510",
  boxur: "\u2514",
  boxul: "\u2518",
  boxvr: "\u251C",
  boxvl: "\u2524",
  boxhd: "\u252C",
  boxhu: "\u2534",
  boxvh: "\u253C",
  boxH: "\u2550",
  boxV: "\u2551",
  boxdR: "\u2552",
  boxDr: "\u2553",
  boxDR: "\u2554",
  boxDl: "\u2555",
  boxdL: "\u2556",
  boxDL: "\u2557",
  boxuR: "\u2558",
  boxUr: "\u2559",
  boxUR: "\u255A",
  boxUl: "\u255C",
  boxuL: "\u255B",
  boxUL: "\u255D",
  boxvR: "\u255E",
  boxVr: "\u255F",
  boxVR: "\u2560",
  boxVl: "\u2562",
  boxvL: "\u2561",
  boxVL: "\u2563",
  boxHd: "\u2564",
  boxhD: "\u2565",
  boxHD: "\u2566",
  boxHu: "\u2567",
  boxhU: "\u2568",
  boxHU: "\u2569",
  boxvH: "\u256A",
  boxVh: "\u256B",
  boxVH: "\u256C"
};
var PUNCTUATION = {
  excl: "!",
  iexcl: "\xA1",
  brvbar: "\xA6",
  sect: "\xA7",
  uml: "\xA8",
  copy: "\xA9",
  ordf: "\xAA",
  laquo: "\xAB",
  not: "\xAC",
  shy: "\xAD",
  reg: "\xAE",
  macr: "\xAF",
  deg: "\xB0",
  plusmn: "\xB1",
  sup2: "\xB2",
  sup3: "\xB3",
  acute: "\xB4",
  micro: "\xB5",
  para: "\xB6",
  middot: "\xB7",
  cedil: "\xB8",
  sup1: "\xB9",
  ordm: "\xBA",
  raquo: "\xBB",
  frac14: "\xBC",
  frac12: "\xBD",
  frac34: "\xBE",
  iquest: "\xBF",
  nbsp: "\xA0",
  comma: ",",
  period: ".",
  colon: ":",
  semi: ";",
  vert: "|",
  Verbar: "\u2016",
  verbar: "|",
  dblac: "\u02DD",
  circ: "\u02C6",
  caron: "\u02C7",
  breve: "\u02D8",
  dot: "\u02D9",
  ring: "\u02DA",
  ogon: "\u02DB",
  tilde: "\u02DC",
  DiacriticalGrave: "`",
  DiacriticalAcute: "\xB4",
  DiacriticalTilde: "\u02DC",
  DiacriticalDot: "\u02D9",
  DiacriticalDoubleAcute: "\u02DD",
  grave: "`"
};
var CURRENCY = {
  cent: "\xA2",
  pound: "\xA3",
  curren: "\xA4",
  yen: "\xA5",
  euro: "\u20AC",
  dollar: "$",
  fnof: "\u0192",
  inr: "\u20B9",
  af: "\u060B",
  birr: "\u1265\u122D",
  peso: "\u20B1",
  rub: "\u20BD",
  won: "\u20A9",
  yuan: "\xA5",
  cedil: "\xB8"
};
var FRACTIONS = {
  frac12: "\xBD",
  half: "\xBD",
  frac13: "\u2153",
  frac14: "\xBC",
  frac15: "\u2155",
  frac16: "\u2159",
  frac18: "\u215B",
  frac23: "\u2154",
  frac25: "\u2156",
  frac34: "\xBE",
  frac35: "\u2157",
  frac38: "\u215C",
  frac45: "\u2158",
  frac56: "\u215A",
  frac58: "\u215D",
  frac78: "\u215E",
  frasl: "\u2044"
};
var MISC_SYMBOLS = {
  trade: "\u2122",
  TRADE: "\u2122",
  telrec: "\u2315",
  target: "\u2316",
  ulcorn: "\u231C",
  ulcorner: "\u231C",
  urcorn: "\u231D",
  urcorner: "\u231D",
  dlcorn: "\u231E",
  llcorner: "\u231E",
  drcorn: "\u231F",
  lrcorner: "\u231F",
  intercal: "\u22BA",
  intcal: "\u22BA",
  oplus: "\u2295",
  CirclePlus: "\u2295",
  ominus: "\u2296",
  CircleMinus: "\u2296",
  otimes: "\u2297",
  CircleTimes: "\u2297",
  osol: "\u2298",
  odot: "\u2299",
  CircleDot: "\u2299",
  oast: "\u229B",
  circledast: "\u229B",
  odash: "\u229D",
  circleddash: "\u229D",
  ocirc: "\u229A",
  circledcirc: "\u229A",
  boxplus: "\u229E",
  plusb: "\u229E",
  boxminus: "\u229F",
  minusb: "\u229F",
  boxtimes: "\u22A0",
  timesb: "\u22A0",
  boxdot: "\u22A1",
  sdotb: "\u22A1",
  veebar: "\u22BB",
  vee: "\u2228",
  barvee: "\u22BD",
  and: "\u2227",
  wedge: "\u2227",
  Cap: "\u22D2",
  Cup: "\u22D3",
  Fork: "\u22D4",
  pitchfork: "\u22D4",
  epar: "\u22D5",
  ltlarr: "\u2976",
  nvap: "\u224D\u20D2",
  nvsim: "\u223C\u20D2",
  nvge: "\u2265\u20D2",
  nvle: "\u2264\u20D2",
  nvlt: "<\u20D2",
  nvgt: ">\u20D2",
  nvltrie: "\u22B4\u20D2",
  nvrtrie: "\u22B5\u20D2",
  Vdash: "\u22A9",
  dashv: "\u22A3",
  vDash: "\u22A8",
  Vvdash: "\u22AA",
  nvdash: "\u22AC",
  nvDash: "\u22AD",
  nVdash: "\u22AE",
  nVDash: "\u22AF"
};
var ALL_ENTITIES = {
  ...BASIC_LATIN,
  ...LATIN_ACCENTS,
  ...LATIN_EXTENDED,
  ...GREEK,
  ...CYRILLIC,
  ...MATH,
  ...MATH_ADVANCED,
  ...ARROWS,
  ...SHAPES,
  ...PUNCTUATION,
  ...CURRENCY,
  ...FRACTIONS,
  ...MISC_SYMBOLS
};
var XML = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  quot: '"'
};
var COMMON_HTML = {
  nbsp: "\xA0",
  copy: "\xA9",
  reg: "\xAE",
  trade: "\u2122",
  mdash: "\u2014",
  ndash: "\u2013",
  hellip: "\u2026",
  laquo: "\xAB",
  raquo: "\xBB",
  lsquo: "\u2018",
  rsquo: "\u2019",
  ldquo: "\u201C",
  rdquo: "\u201D",
  bull: "\u2022",
  para: "\xB6",
  sect: "\xA7",
  deg: "\xB0",
  frac12: "\xBD",
  frac14: "\xBC",
  frac34: "\xBE"
};

// node_modules/.pnpm/@nodable+entities@2.2.0/node_modules/@nodable/entities/src/EntityDecoder.js
var ENTITY_ACTION = Object.freeze({
  /** Resolve and expand the entity normally. */
  ALLOW: "allow",
  /** Silently skip this entity — it will not be registered. */
  BLOCK: "block",
  /** Throw an error, aborting entity registration entirely. */
  THROW: "throw"
});
var SPECIAL_CHARS = new Set("!?\\\\/[]$%{}^&*()<>|+");
function validateEntityName(name) {
  if (name[0] === "#") {
    throw new Error(`[EntityReplacer] Invalid character '#' in entity name: "${name}"`);
  }
  for (const ch of name) {
    if (SPECIAL_CHARS.has(ch)) {
      throw new Error(`[EntityReplacer] Invalid character '${ch}' in entity name: "${name}"`);
    }
  }
  return name;
}
__name(validateEntityName, "validateEntityName");
function mergeEntityMaps(...maps) {
  const out = /* @__PURE__ */ Object.create(null);
  for (const map of maps) {
    if (!map) continue;
    for (const key of Object.keys(map)) {
      const raw2 = map[key];
      if (typeof raw2 === "string") {
        out[key] = raw2;
      } else if (raw2 && typeof raw2 === "object" && raw2.val !== void 0) {
        const val = raw2.val;
        if (typeof val === "string") {
          out[key] = val;
        }
      }
    }
  }
  return out;
}
__name(mergeEntityMaps, "mergeEntityMaps");
var LIMIT_TIER_EXTERNAL = "external";
var LIMIT_TIER_BASE = "base";
var LIMIT_TIER_ALL = "all";
function parseLimitTiers(raw2) {
  if (!raw2 || raw2 === LIMIT_TIER_EXTERNAL) return /* @__PURE__ */ new Set([LIMIT_TIER_EXTERNAL]);
  if (raw2 === LIMIT_TIER_ALL) return /* @__PURE__ */ new Set([LIMIT_TIER_ALL]);
  if (raw2 === LIMIT_TIER_BASE) return /* @__PURE__ */ new Set([LIMIT_TIER_BASE]);
  if (Array.isArray(raw2)) return new Set(raw2);
  return /* @__PURE__ */ new Set([LIMIT_TIER_EXTERNAL]);
}
__name(parseLimitTiers, "parseLimitTiers");
var NCR_LEVEL = Object.freeze({ allow: 0, leave: 1, remove: 2, throw: 3 });
var XML10_ALLOWED_C0 = /* @__PURE__ */ new Set([9, 10, 13]);
function parseNCRConfig(ncr) {
  if (!ncr) {
    return { xmlVersion: 1, onLevel: NCR_LEVEL.allow, nullLevel: NCR_LEVEL.remove };
  }
  const xmlVersion = ncr.xmlVersion === 1.1 ? 1.1 : 1;
  const onLevel = NCR_LEVEL[ncr.onNCR] ?? NCR_LEVEL.allow;
  const nullLevel = NCR_LEVEL[ncr.nullNCR] ?? NCR_LEVEL.remove;
  const clampedNull = Math.max(nullLevel, NCR_LEVEL.remove);
  return { xmlVersion, onLevel, nullLevel: clampedNull };
}
__name(parseNCRConfig, "parseNCRConfig");
var EntityDecoder = class {
  static {
    __name(this, "EntityDecoder");
  }
  /**
   * @param {object} [options]
   * @param {object|null}  [options.namedEntities]        — extra named entities merged into base map
   * @param {object}  [options.limit]                 — security limits
   * @param {number}       [options.limit.maxTotalExpansions=0]  — 0 = unlimited
   * @param {number}       [options.limit.maxExpandedLength=0]   — 0 = unlimited
   * @param {'external'|'base'|'all'|string[]} [options.limit.applyLimitsTo='external']
   *   Which entity tiers count against the security limits:
   *   - 'external' (default) — only input/runtime + persistent external entities
   *   - 'base'               — only DEFAULT_XML_ENTITIES + namedEntities
   *   - 'all'                — every entity regardless of tier
   *   - string[]             — explicit combination, e.g. ['external', 'base']
   * @param {((resolved: string, original: string) => string)|null} [options.postCheck=null]
   * @param {string[]} [options.remove=[]] — entity names (e.g. ['nbsp', '#13']) to delete (replace with empty string)
   * @param {string[]} [options.leave=[]]  — entity names to keep as literal (unchanged in output)
   * @param {object}   [options.ncr]       — Numeric Character Reference controls
   * @param {1.0|1.1}  [options.ncr.xmlVersion=1.0]
   *   XML version governing which codepoint ranges are restricted:
   *   - 1.0 — C0 controls U+0001–U+001F (except U+0009/000A/000D) are prohibited
   *   - 1.1 — C0 controls are allowed when written as NCRs; C1 (U+007F–U+009F) decoded as-is
   * @param {'allow'|'leave'|'remove'|'throw'} [options.ncr.onNCR='allow']
   *   Base action for numeric references. Severity order: allow < leave < remove < throw.
   *   For codepoint ranges that carry a minimum level (surrogates → remove, XML 1.0 C0 → remove),
   *   the effective action is max(onNCR, rangeMinimum).
   * @param {'remove'|'throw'} [options.ncr.nullNCR='remove']
   *   Action for U+0000 (null). 'allow' and 'leave' are clamped to 'remove' since null is never safe.
   * @param {((name: string, value: string) => 'allow'|'block'|'throw')|null} [options.onExternalEntity=null]
   *   Hook called when an external entity is registered via `setExternalEntities()` or
   *   `addExternalEntity()`. Return `ENTITY_ACTION.ALLOW` to accept the entity,
   *   `ENTITY_ACTION.BLOCK` to silently skip it, or `ENTITY_ACTION.THROW` to abort with an error.
   * @param {((name: string, value: string) => 'allow'|'block'|'throw')|null} [options.onInputEntity=null]
   *   Hook called when an input entity is registered via `addInputEntities()`. Return
   *   `ENTITY_ACTION.ALLOW` to accept, `ENTITY_ACTION.BLOCK` to silently skip, or
   *   `ENTITY_ACTION.THROW` to abort with an error.
   */
  constructor(options = {}) {
    this._limit = options.limit || {};
    this._maxTotalExpansions = this._limit.maxTotalExpansions || 0;
    this._maxExpandedLength = this._limit.maxExpandedLength || 0;
    this._postCheck = typeof options.postCheck === "function" ? options.postCheck : (r) => r;
    this._limitTiers = parseLimitTiers(this._limit.applyLimitsTo ?? LIMIT_TIER_EXTERNAL);
    this._numericAllowed = options.numericAllowed ?? true;
    this._baseMap = mergeEntityMaps(XML, options.namedEntities || null);
    this._externalMap = /* @__PURE__ */ Object.create(null);
    this._inputMap = /* @__PURE__ */ Object.create(null);
    this._totalExpansions = 0;
    this._expandedLength = 0;
    this._removeSet = new Set(options.remove && Array.isArray(options.remove) ? options.remove : []);
    this._leaveSet = new Set(options.leave && Array.isArray(options.leave) ? options.leave : []);
    const ncrCfg = parseNCRConfig(options.ncr);
    this._ncrXmlVersion = ncrCfg.xmlVersion;
    this._ncrOnLevel = ncrCfg.onLevel;
    this._ncrNullLevel = ncrCfg.nullLevel;
    this._onExternalEntity = typeof options.onExternalEntity === "function" ? options.onExternalEntity : null;
    this._onInputEntity = typeof options.onInputEntity === "function" ? options.onInputEntity : null;
  }
  // -------------------------------------------------------------------------
  // Private: registration hook dispatch
  // -------------------------------------------------------------------------
  /**
   * Invoke a registration hook for a single entity name/value pair.
   * Returns true when the entity should be accepted, false when it should be
   * silently skipped (BLOCK), and throws when the hook returns THROW.
   *
   * @param {((name: string, value: string) => 'allow'|'block'|'throw')|null} hook
   * @param {string} name
   * @param {string} value
   * @param {string} context  — used in error messages ('external' | 'input')
   * @returns {boolean}  true = accept, false = skip
   */
  _applyRegistrationHook(hook, name, value, context) {
    if (!hook) return true;
    const action = hook(name, value);
    if (action === ENTITY_ACTION.BLOCK) return false;
    if (action === ENTITY_ACTION.THROW) {
      throw new Error(
        `[EntityDecoder] Registration of ${context} entity "&${name};" was rejected by hook`
      );
    }
    return true;
  }
  // -------------------------------------------------------------------------
  // Persistent external entity registration
  // -------------------------------------------------------------------------
  /**
   * Replace the full set of persistent external entities.
   * All keys are validated — throws on invalid characters.
   * If `onExternalEntity` is set, it is called once per entry; entries that
   * return `ENTITY_ACTION.BLOCK` are silently omitted, `ENTITY_ACTION.THROW`
   * aborts the whole call.
   * @param {Record<string, string | { regex?: RegExp, val: string }>} map
   */
  setExternalEntities(map) {
    if (map) {
      for (const key of Object.keys(map)) {
        validateEntityName(key);
      }
    }
    if (!this._onExternalEntity) {
      this._externalMap = mergeEntityMaps(map);
      return;
    }
    const flat = mergeEntityMaps(map);
    const filtered = /* @__PURE__ */ Object.create(null);
    for (const [name, value] of Object.entries(flat)) {
      if (this._applyRegistrationHook(this._onExternalEntity, name, value, "external")) {
        filtered[name] = value;
      }
    }
    this._externalMap = filtered;
  }
  /**
   * Add a single persistent external entity.
   * If `onExternalEntity` is set it is called before the entity is stored;
   * `ENTITY_ACTION.BLOCK` silently skips storage, `ENTITY_ACTION.THROW` raises.
   * @param {string} key
   * @param {string} value
   */
  addExternalEntity(key, value) {
    validateEntityName(key);
    if (typeof value === "string" && value.indexOf("&") === -1) {
      if (this._applyRegistrationHook(this._onExternalEntity, key, value, "external")) {
        this._externalMap[key] = value;
      }
    }
  }
  // -------------------------------------------------------------------------
  // Input / runtime entity registration (per document)
  // -------------------------------------------------------------------------
  /**
   * Inject DOCTYPE entities for the current document.
   * Also resets per-document expansion counters.
   * If `onInputEntity` is set it is called once per entry; entries returning
   * `ENTITY_ACTION.BLOCK` are silently omitted, `ENTITY_ACTION.THROW` aborts.
   * @param {Record<string, string | { regx?: RegExp, regex?: RegExp, val: string }>} map
   */
  addInputEntities(map) {
    this._totalExpansions = 0;
    this._expandedLength = 0;
    if (!this._onInputEntity) {
      this._inputMap = mergeEntityMaps(map);
      return;
    }
    const flat = mergeEntityMaps(map);
    const filtered = /* @__PURE__ */ Object.create(null);
    for (const [name, value] of Object.entries(flat)) {
      if (this._applyRegistrationHook(this._onInputEntity, name, value, "input")) {
        filtered[name] = value;
      }
    }
    this._inputMap = filtered;
  }
  // -------------------------------------------------------------------------
  // Per-document reset
  // -------------------------------------------------------------------------
  /**
   * Wipe input/runtime entities and reset counters.
   * Call this before processing each new document.
   * @returns {this}
   */
  reset() {
    this._inputMap = /* @__PURE__ */ Object.create(null);
    this._totalExpansions = 0;
    this._expandedLength = 0;
    return this;
  }
  // -------------------------------------------------------------------------
  // XML version (can be set after construction, e.g. once parser reads <?xml?>)
  // -------------------------------------------------------------------------
  /**
   * Update the XML version used for NCR classification.
   * Call this as soon as the document's `<?xml version="...">` declaration is parsed.
   * @param {1.0|1.1|number} version
   */
  setXmlVersion(version) {
    this._ncrXmlVersion = version === 1.1 ? 1.1 : 1;
  }
  // -------------------------------------------------------------------------
  // Primary API
  // -------------------------------------------------------------------------
  /**
   * Replace all entity references in `str` in a single pass.
   *
   * @param {string} str
   * @returns {string}
   */
  decode(str) {
    if (typeof str !== "string" || str.length === 0) return str;
    if (str.indexOf("&") === -1) return str;
    const original = str;
    const chunks = [];
    const len = str.length;
    let last = 0;
    let i2 = 0;
    const limitExpansions = this._maxTotalExpansions > 0;
    const limitLength = this._maxExpandedLength > 0;
    const checkLimits = limitExpansions || limitLength;
    while (i2 < len) {
      if (str.charCodeAt(i2) !== 38) {
        i2++;
        continue;
      }
      let j = i2 + 1;
      while (j < len && str.charCodeAt(j) !== 59 && j - i2 <= 32) j++;
      if (j >= len || str.charCodeAt(j) !== 59) {
        i2++;
        continue;
      }
      const token = str.slice(i2 + 1, j);
      if (token.length === 0) {
        i2++;
        continue;
      }
      let replacement;
      let tier;
      if (this._removeSet.has(token)) {
        replacement = "";
        if (tier === void 0) {
          tier = LIMIT_TIER_EXTERNAL;
        }
      } else if (this._leaveSet.has(token)) {
        i2++;
        continue;
      } else if (token.charCodeAt(0) === 35) {
        const ncrResult = this._resolveNCR(token);
        if (ncrResult === void 0) {
          i2++;
          continue;
        }
        replacement = ncrResult;
        tier = LIMIT_TIER_BASE;
      } else {
        const resolved = this._resolveName(token);
        replacement = resolved?.value;
        tier = resolved?.tier;
      }
      if (replacement === void 0) {
        i2++;
        continue;
      }
      if (i2 > last) chunks.push(str.slice(last, i2));
      chunks.push(replacement);
      last = j + 1;
      i2 = last;
      if (checkLimits && this._tierCounts(tier)) {
        if (limitExpansions) {
          this._totalExpansions++;
          if (this._totalExpansions > this._maxTotalExpansions) {
            throw new Error(
              `[EntityReplacer] Entity expansion count limit exceeded: ${this._totalExpansions} > ${this._maxTotalExpansions}`
            );
          }
        }
        if (limitLength) {
          const delta = replacement.length - (token.length + 2);
          if (delta > 0) {
            this._expandedLength += delta;
            if (this._expandedLength > this._maxExpandedLength) {
              throw new Error(
                `[EntityReplacer] Expanded content length limit exceeded: ${this._expandedLength} > ${this._maxExpandedLength}`
              );
            }
          }
        }
      }
    }
    if (last < len) chunks.push(str.slice(last));
    const result = chunks.length === 0 ? str : chunks.join("");
    return this._postCheck(result, original);
  }
  // -------------------------------------------------------------------------
  // Private: limit tier check
  // -------------------------------------------------------------------------
  /**
   * Returns true if a resolved entity of the given tier should count
   * against the expansion/length limits.
   * @param {string} tier  — LIMIT_TIER_EXTERNAL | LIMIT_TIER_BASE
   * @returns {boolean}
   */
  _tierCounts(tier) {
    if (this._limitTiers.has(LIMIT_TIER_ALL)) return true;
    return this._limitTiers.has(tier);
  }
  // -------------------------------------------------------------------------
  // Private: entity resolution
  // -------------------------------------------------------------------------
  /**
   * Resolve a named entity token (without & and ;).
   * Priority: inputMap > externalMap > baseMap
   * Returns the resolved value tagged with its limit tier.
   *
   * @param {string} name
   * @returns {{ value: string, tier: string }|undefined}
   */
  _resolveName(name) {
    if (name in this._inputMap) return { value: this._inputMap[name], tier: LIMIT_TIER_EXTERNAL };
    if (name in this._externalMap) return { value: this._externalMap[name], tier: LIMIT_TIER_EXTERNAL };
    if (name in this._baseMap) return { value: this._baseMap[name], tier: LIMIT_TIER_BASE };
    return void 0;
  }
  /**
   * Classify a codepoint and return the minimum action level that must be applied.
   * Returns -1 when no minimum is imposed (normal allow path).
   *
   * Ranges checked (in priority order):
   *   1. U+0000            — null, governed by nullNCR (always ≥ remove)
   *   2. U+D800–U+DFFF     — surrogates, always prohibited (min: remove)
   *   3. U+0001–U+001F \ {0x09,0x0A,0x0D}  — XML 1.0 restricted C0 (min: remove)
   *      (skipped in XML 1.1 — C0 controls are allowed when written as NCRs)
   *
   * @param {number} cp  — codepoint
   * @returns {number}   — minimum NCR_LEVEL value, or -1 for no restriction
   */
  _classifyNCR(cp) {
    if (cp === 0) return this._ncrNullLevel;
    if (cp >= 55296 && cp <= 57343) return NCR_LEVEL.remove;
    if (this._ncrXmlVersion === 1) {
      if (cp >= 1 && cp <= 31 && !XML10_ALLOWED_C0.has(cp)) return NCR_LEVEL.remove;
    }
    return -1;
  }
  /**
   * Execute a resolved NCR action.
   *
   * @param {number} action   — NCR_LEVEL value
   * @param {string} token    — raw token (e.g. '#38') for error messages
   * @param {number} cp       — codepoint, used only for error messages
   * @returns {string|undefined}
   *   - decoded character string  → 'allow'
   *   - ''                        → 'remove'
   *   - undefined                 → 'leave' (caller must skip past '&' only)
   *   - throws Error              → 'throw'
   */
  _applyNCRAction(action, token, cp) {
    switch (action) {
      case NCR_LEVEL.allow:
        return String.fromCodePoint(cp);
      case NCR_LEVEL.remove:
        return "";
      case NCR_LEVEL.leave:
        return void 0;
      // signal: keep literal
      case NCR_LEVEL.throw:
        throw new Error(
          `[EntityDecoder] Prohibited numeric character reference &${token}; (U+${cp.toString(16).toUpperCase().padStart(4, "0")})`
        );
      default:
        return String.fromCodePoint(cp);
    }
  }
  /**
   * Full NCR resolution pipeline for a numeric token.
   *
   * Steps:
   *   1. Parse the codepoint (decimal or hex).
   *   2. Validate the raw codepoint range (NaN, <0, >0x10FFFF).
   *   3. If numericAllowed is false and no minimum restriction applies → leave as-is.
   *   4. Classify the codepoint to find the minimum required action level.
   *   5. Resolve effective action = max(onNCR, minimum).
   *   6. Apply and return.
   *
   * @param {string} token  — e.g. '#38', '#x26', '#X26'
   * @returns {string|undefined}
   *   - string (incl. '')  — replacement ('' = remove)
   *   - undefined          — leave original &token; as-is
   */
  _resolveNCR(token) {
    const second = token.charCodeAt(1);
    let cp;
    if (second === 120 || second === 88) {
      cp = parseInt(token.slice(2), 16);
    } else {
      cp = parseInt(token.slice(1), 10);
    }
    if (Number.isNaN(cp) || cp < 0 || cp > 1114111) return void 0;
    const minimum = this._classifyNCR(cp);
    if (!this._numericAllowed && minimum < NCR_LEVEL.remove) return void 0;
    const effective = minimum === -1 ? this._ncrOnLevel : Math.max(this._ncrOnLevel, minimum);
    return this._applyNCRAction(effective, token, cp);
  }
};

// node_modules/.pnpm/fast-xml-parser@5.10.0/node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js
var defaultOnDangerousProperty = /* @__PURE__ */ __name((name) => {
  if (DANGEROUS_PROPERTY_NAMES.includes(name)) {
    return "__" + name;
  }
  return name;
}, "defaultOnDangerousProperty");
var defaultOptions2 = {
  preserveOrder: false,
  attributeNamePrefix: "@_",
  attributesGroupName: false,
  textNodeName: "#text",
  ignoreAttributes: true,
  removeNSPrefix: false,
  // remove NS from tag name or attribute name if true
  allowBooleanAttributes: false,
  //a tag can have attributes without any value
  //ignoreRootElement : false,
  parseTagValue: true,
  parseAttributeValue: false,
  trimValues: true,
  //Trim string values of tag and attributes
  cdataPropName: false,
  numberParseOptions: {
    hex: true,
    leadingZeros: true,
    eNotation: true,
    unicode: false
  },
  tagValueProcessor: /* @__PURE__ */ __name(function(tagName, val) {
    return val;
  }, "tagValueProcessor"),
  attributeValueProcessor: /* @__PURE__ */ __name(function(attrName, val) {
    return val;
  }, "attributeValueProcessor"),
  stopNodes: [],
  //nested tags will not be parsed even for errors
  alwaysCreateTextNode: false,
  isArray: /* @__PURE__ */ __name(() => false, "isArray"),
  commentPropName: false,
  unpairedTags: [],
  processEntities: true,
  htmlEntities: false,
  entityDecoder: null,
  ignoreDeclaration: false,
  ignorePiTags: false,
  transformTagName: false,
  transformAttributeName: false,
  updateTag: /* @__PURE__ */ __name(function(tagName, jPath, attrs) {
    return tagName;
  }, "updateTag"),
  // skipEmptyListItem: false
  captureMetaData: false,
  maxNestedTags: 100,
  strictReservedNames: true,
  jPath: true,
  // if true, pass jPath string to callbacks; if false, pass matcher instance
  onDangerousProperty: defaultOnDangerousProperty
};
function validatePropertyName(propertyName, optionName) {
  if (typeof propertyName !== "string") {
    return;
  }
  const normalized = propertyName.toLowerCase();
  if (DANGEROUS_PROPERTY_NAMES.some((dangerous) => normalized === dangerous.toLowerCase())) {
    throw new Error(
      `[SECURITY] Invalid ${optionName}: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`
    );
  }
  if (criticalProperties.some((dangerous) => normalized === dangerous.toLowerCase())) {
    throw new Error(
      `[SECURITY] Invalid ${optionName}: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`
    );
  }
}
__name(validatePropertyName, "validatePropertyName");
function normalizeProcessEntities(value, htmlEntities) {
  if (typeof value === "boolean") {
    return {
      enabled: value,
      // true or false
      maxEntitySize: 1e4,
      maxExpansionDepth: 1e4,
      maxTotalExpansions: Infinity,
      maxExpandedLength: 1e5,
      maxEntityCount: 1e3,
      allowedTags: null,
      tagFilter: null,
      appliesTo: "all"
    };
  }
  if (typeof value === "object" && value !== null) {
    return {
      enabled: value.enabled !== false,
      maxEntitySize: Math.max(1, value.maxEntitySize ?? 1e4),
      maxExpansionDepth: Math.max(1, value.maxExpansionDepth ?? 1e4),
      maxTotalExpansions: Math.max(1, value.maxTotalExpansions ?? Infinity),
      maxExpandedLength: Math.max(1, value.maxExpandedLength ?? 1e5),
      maxEntityCount: Math.max(1, value.maxEntityCount ?? 1e3),
      allowedTags: value.allowedTags ?? null,
      tagFilter: value.tagFilter ?? null,
      appliesTo: value.appliesTo ?? "all"
    };
  }
  return normalizeProcessEntities(true);
}
__name(normalizeProcessEntities, "normalizeProcessEntities");
var buildOptions = /* @__PURE__ */ __name(function(options) {
  const built = Object.assign({}, defaultOptions2, options);
  const propertyNameOptions = [
    { value: built.attributeNamePrefix, name: "attributeNamePrefix" },
    { value: built.attributesGroupName, name: "attributesGroupName" },
    { value: built.textNodeName, name: "textNodeName" },
    { value: built.cdataPropName, name: "cdataPropName" },
    { value: built.commentPropName, name: "commentPropName" }
  ];
  for (const { value, name } of propertyNameOptions) {
    if (value) {
      validatePropertyName(value, name);
    }
  }
  if (built.onDangerousProperty === null) {
    built.onDangerousProperty = defaultOnDangerousProperty;
  }
  built.processEntities = normalizeProcessEntities(built.processEntities, built.htmlEntities);
  built.unpairedTagsSet = new Set(built.unpairedTags);
  if (built.stopNodes && Array.isArray(built.stopNodes)) {
    built.stopNodes = built.stopNodes.map((node) => {
      if (typeof node === "string" && node.startsWith("*.")) {
        return ".." + node.substring(2);
      }
      return node;
    });
  }
  return built;
}, "buildOptions");

// node_modules/.pnpm/fast-xml-parser@5.10.0/node_modules/fast-xml-parser/src/xmlparser/xmlNode.js
var METADATA_SYMBOL;
if (typeof Symbol !== "function") {
  METADATA_SYMBOL = "@@xmlMetadata";
} else {
  METADATA_SYMBOL = /* @__PURE__ */ Symbol("XML Node Metadata");
}
var XmlNode = class {
  static {
    __name(this, "XmlNode");
  }
  constructor(tagname) {
    this.tagname = tagname;
    this.child = [];
    this[":@"] = /* @__PURE__ */ Object.create(null);
  }
  add(key, val) {
    if (key === "__proto__") key = "#__proto__";
    this.child.push({ [key]: val });
  }
  addChild(node, startIndex) {
    if (node.tagname === "__proto__") node.tagname = "#__proto__";
    if (node[":@"] && Object.keys(node[":@"]).length > 0) {
      this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
    } else {
      this.child.push({ [node.tagname]: node.child });
    }
    if (startIndex !== void 0) {
      this.child[this.child.length - 1][METADATA_SYMBOL] = { startIndex };
    }
  }
  /** symbol used for metadata */
  static getMetaDataSymbol() {
    return METADATA_SYMBOL;
  }
};

// node_modules/.pnpm/xml-naming@0.3.0/node_modules/xml-naming/src/index.js
var nameStartChar10 = ":A-Za-z_\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u0486\u0488-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD";
var nameChar10 = nameStartChar10 + "\\-\\.\\d\xB7\u0300-\u036F\u203F-\u2040";
var nameStartChar11 = ":A-Za-z_\xC0-\u02FF\u0370-\u037D\u037F-\u0486\u0488-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}";
var nameChar11 = nameStartChar11 + "\\-\\.\\d\xB7\u0300-\u036F\u0487\u203F-\u2040";
var buildRegexes = /* @__PURE__ */ __name((startChar, char, flags = "") => {
  const ncStart = startChar.replace(":", "");
  const ncChar = char.replace(":", "");
  const ncNamePat = `[${ncStart}][${ncChar}]*`;
  return {
    name: new RegExp(`^[${startChar}][${char}]*$`, flags),
    ncName: new RegExp(`^${ncNamePat}$`, flags),
    qName: new RegExp(`^${ncNamePat}(?::${ncNamePat})?$`, flags),
    nmToken: new RegExp(`^[${char}]+$`, flags),
    nmTokens: new RegExp(`^[${char}]+(?:\\s+[${char}]+)*$`, flags)
  };
}, "buildRegexes");
var regexes10 = buildRegexes(nameStartChar10, nameChar10);
var regexes11 = buildRegexes(nameStartChar11, nameChar11, "u");
var nameStartCharAscii = ":A-Za-z_";
var nameCharAscii = nameStartCharAscii + "\\-\\.\\d";
var regexesAscii = buildRegexes(nameStartCharAscii, nameCharAscii);
var getRegexes = /* @__PURE__ */ __name((xmlVersion = "1.0", asciiOnly = false) => {
  if (asciiOnly) return regexesAscii;
  return xmlVersion === "1.1" ? regexes11 : regexes10;
}, "getRegexes");
var qName = /* @__PURE__ */ __name((str, { xmlVersion = "1.0", asciiOnly = false } = {}) => getRegexes(xmlVersion, asciiOnly).qName.test(str), "qName");

// node_modules/.pnpm/fast-xml-parser@5.10.0/node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js
var DocTypeReader = class {
  static {
    __name(this, "DocTypeReader");
  }
  constructor(options, xmlVersion) {
    this.suppressValidationErr = !options;
    this.options = options;
    this.xmlVersion = xmlVersion || 1;
  }
  setXmlVersion(xmlVersion = 1) {
    this.xmlVersion = xmlVersion;
  }
  readDocType(xmlData, i2) {
    const entities = /* @__PURE__ */ Object.create(null);
    let entityCount = 0;
    if (xmlData[i2 + 3] === "O" && xmlData[i2 + 4] === "C" && xmlData[i2 + 5] === "T" && xmlData[i2 + 6] === "Y" && xmlData[i2 + 7] === "P" && xmlData[i2 + 8] === "E") {
      i2 = i2 + 9;
      let angleBracketsCount = 1;
      let hasBody = false, comment = false;
      let exp = "";
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === "<" && !comment) {
          if (hasBody && hasSeq(xmlData, "!ENTITY", i2)) {
            i2 += 7;
            let entityName, val;
            [entityName, val, i2] = this.readEntityExp(xmlData, i2 + 1, this.suppressValidationErr);
            if (val.indexOf("&") === -1) {
              if (this.options.enabled !== false && this.options.maxEntityCount != null && entityCount >= this.options.maxEntityCount) {
                throw new Error(
                  `Entity count (${entityCount + 1}) exceeds maximum allowed (${this.options.maxEntityCount})`
                );
              }
              entities[entityName] = val;
              entityCount++;
            }
          } else if (hasBody && hasSeq(xmlData, "!ELEMENT", i2)) {
            i2 += 8;
            const { index } = this.readElementExp(xmlData, i2 + 1);
            i2 = index;
          } else if (hasBody && hasSeq(xmlData, "!ATTLIST", i2)) {
            i2 += 8;
          } else if (hasBody && hasSeq(xmlData, "!NOTATION", i2)) {
            i2 += 9;
            const { index } = this.readNotationExp(xmlData, i2 + 1, this.suppressValidationErr);
            i2 = index;
          } else if (hasSeq(xmlData, "!--", i2)) comment = true;
          else throw new Error(`Invalid DOCTYPE`);
          angleBracketsCount++;
          exp = "";
        } else if (xmlData[i2] === ">") {
          if (comment) {
            if (xmlData[i2 - 1] === "-" && xmlData[i2 - 2] === "-") {
              comment = false;
              angleBracketsCount--;
            }
          } else {
            angleBracketsCount--;
          }
          if (angleBracketsCount === 0) {
            break;
          }
        } else if (xmlData[i2] === "[") {
          hasBody = true;
        } else {
          exp += xmlData[i2];
        }
      }
      if (angleBracketsCount !== 0) {
        throw new Error(`Unclosed DOCTYPE`);
      }
    } else {
      throw new Error(`Invalid Tag instead of DOCTYPE`);
    }
    return { entities, i: i2 };
  }
  readEntityExp(xmlData, i2) {
    i2 = skipWhitespace(xmlData, i2);
    const startIndex = i2;
    while (i2 < xmlData.length && !/\s/.test(xmlData[i2]) && xmlData[i2] !== '"' && xmlData[i2] !== "'") {
      i2++;
    }
    let entityName = xmlData.substring(startIndex, i2);
    validateEntityName2(entityName, { xmlVersion: this.xmlVersion });
    i2 = skipWhitespace(xmlData, i2);
    if (!this.suppressValidationErr) {
      if (xmlData.substring(i2, i2 + 6).toUpperCase() === "SYSTEM") {
        throw new Error("External entities are not supported");
      } else if (xmlData[i2] === "%") {
        throw new Error("Parameter entities are not supported");
      }
    }
    let entityValue = "";
    [i2, entityValue] = this.readIdentifierVal(xmlData, i2, "entity");
    if (this.options.enabled !== false && this.options.maxEntitySize != null && entityValue.length > this.options.maxEntitySize) {
      throw new Error(
        `Entity "${entityName}" size (${entityValue.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`
      );
    }
    i2--;
    return [entityName, entityValue, i2];
  }
  readNotationExp(xmlData, i2) {
    i2 = skipWhitespace(xmlData, i2);
    const startIndex = i2;
    while (i2 < xmlData.length && !/\s/.test(xmlData[i2])) {
      i2++;
    }
    let notationName = xmlData.substring(startIndex, i2);
    !this.suppressValidationErr && validateEntityName2(notationName, { xmlVersion: this.xmlVersion });
    i2 = skipWhitespace(xmlData, i2);
    const identifierType = xmlData.substring(i2, i2 + 6).toUpperCase();
    if (!this.suppressValidationErr && identifierType !== "SYSTEM" && identifierType !== "PUBLIC") {
      throw new Error(`Expected SYSTEM or PUBLIC, found "${identifierType}"`);
    }
    i2 += identifierType.length;
    i2 = skipWhitespace(xmlData, i2);
    let publicIdentifier = null;
    let systemIdentifier = null;
    if (identifierType === "PUBLIC") {
      [i2, publicIdentifier] = this.readIdentifierVal(xmlData, i2, "publicIdentifier");
      i2 = skipWhitespace(xmlData, i2);
      if (xmlData[i2] === '"' || xmlData[i2] === "'") {
        [i2, systemIdentifier] = this.readIdentifierVal(xmlData, i2, "systemIdentifier");
      }
    } else if (identifierType === "SYSTEM") {
      [i2, systemIdentifier] = this.readIdentifierVal(xmlData, i2, "systemIdentifier");
      if (!this.suppressValidationErr && !systemIdentifier) {
        throw new Error("Missing mandatory system identifier for SYSTEM notation");
      }
    }
    return { notationName, publicIdentifier, systemIdentifier, index: --i2 };
  }
  readIdentifierVal(xmlData, i2, type) {
    let identifierVal = "";
    const startChar = xmlData[i2];
    if (startChar !== '"' && startChar !== "'") {
      throw new Error(`Expected quoted string, found "${startChar}"`);
    }
    i2++;
    const startIndex = i2;
    while (i2 < xmlData.length && xmlData[i2] !== startChar) {
      i2++;
    }
    identifierVal = xmlData.substring(startIndex, i2);
    if (xmlData[i2] !== startChar) {
      throw new Error(`Unterminated ${type} value`);
    }
    i2++;
    return [i2, identifierVal];
  }
  readElementExp(xmlData, i2) {
    i2 = skipWhitespace(xmlData, i2);
    const startIndex = i2;
    while (i2 < xmlData.length && !/\s/.test(xmlData[i2])) {
      i2++;
    }
    let elementName = xmlData.substring(startIndex, i2);
    if (!this.suppressValidationErr && !qName(elementName, { xmlVersion: this.xmlVersion })) {
      throw new Error(`Invalid element name: "${elementName}"`);
    }
    i2 = skipWhitespace(xmlData, i2);
    let contentModel = "";
    if (xmlData[i2] === "E" && hasSeq(xmlData, "MPTY", i2)) i2 += 4;
    else if (xmlData[i2] === "A" && hasSeq(xmlData, "NY", i2)) i2 += 2;
    else if (xmlData[i2] === "(") {
      i2++;
      const startIndex2 = i2;
      while (i2 < xmlData.length && xmlData[i2] !== ")") {
        i2++;
      }
      contentModel = xmlData.substring(startIndex2, i2);
      if (xmlData[i2] !== ")") {
        throw new Error("Unterminated content model");
      }
    } else if (!this.suppressValidationErr) {
      throw new Error(`Invalid Element Expression, found "${xmlData[i2]}"`);
    }
    return {
      elementName,
      contentModel: contentModel.trim(),
      index: i2
    };
  }
  readAttlistExp(xmlData, i2) {
    i2 = skipWhitespace(xmlData, i2);
    let startIndex = i2;
    while (i2 < xmlData.length && !/\s/.test(xmlData[i2])) {
      i2++;
    }
    let elementName = xmlData.substring(startIndex, i2);
    validateEntityName2(elementName, { xmlVersion: this.xmlVersion });
    i2 = skipWhitespace(xmlData, i2);
    startIndex = i2;
    while (i2 < xmlData.length && !/\s/.test(xmlData[i2])) {
      i2++;
    }
    let attributeName = xmlData.substring(startIndex, i2);
    if (!validateEntityName2(attributeName, { xmlVersion: this.xmlVersion })) {
      throw new Error(`Invalid attribute name: "${attributeName}"`);
    }
    i2 = skipWhitespace(xmlData, i2);
    let attributeType = "";
    if (xmlData.substring(i2, i2 + 8).toUpperCase() === "NOTATION") {
      attributeType = "NOTATION";
      i2 += 8;
      i2 = skipWhitespace(xmlData, i2);
      if (xmlData[i2] !== "(") {
        throw new Error(`Expected '(', found "${xmlData[i2]}"`);
      }
      i2++;
      let allowedNotations = [];
      while (i2 < xmlData.length && xmlData[i2] !== ")") {
        const startIndex2 = i2;
        while (i2 < xmlData.length && xmlData[i2] !== "|" && xmlData[i2] !== ")") {
          i2++;
        }
        let notation = xmlData.substring(startIndex2, i2);
        notation = notation.trim();
        if (!validateEntityName2(notation, { xmlVersion: this.xmlVersion })) {
          throw new Error(`Invalid notation name: "${notation}"`);
        }
        allowedNotations.push(notation);
        if (xmlData[i2] === "|") {
          i2++;
          i2 = skipWhitespace(xmlData, i2);
        }
      }
      if (xmlData[i2] !== ")") {
        throw new Error("Unterminated list of notations");
      }
      i2++;
      attributeType += " (" + allowedNotations.join("|") + ")";
    } else {
      const startIndex2 = i2;
      while (i2 < xmlData.length && !/\s/.test(xmlData[i2])) {
        i2++;
      }
      attributeType += xmlData.substring(startIndex2, i2);
      const validTypes = ["CDATA", "ID", "IDREF", "IDREFS", "ENTITY", "ENTITIES", "NMTOKEN", "NMTOKENS"];
      if (!this.suppressValidationErr && !validTypes.includes(attributeType.toUpperCase())) {
        throw new Error(`Invalid attribute type: "${attributeType}"`);
      }
    }
    i2 = skipWhitespace(xmlData, i2);
    let defaultValue = "";
    if (xmlData.substring(i2, i2 + 8).toUpperCase() === "#REQUIRED") {
      defaultValue = "#REQUIRED";
      i2 += 8;
    } else if (xmlData.substring(i2, i2 + 7).toUpperCase() === "#IMPLIED") {
      defaultValue = "#IMPLIED";
      i2 += 7;
    } else {
      [i2, defaultValue] = this.readIdentifierVal(xmlData, i2, "ATTLIST");
    }
    return {
      elementName,
      attributeName,
      attributeType,
      defaultValue,
      index: i2
    };
  }
};
var skipWhitespace = /* @__PURE__ */ __name((data, index) => {
  while (index < data.length && /\s/.test(data[index])) {
    index++;
  }
  return index;
}, "skipWhitespace");
function hasSeq(data, seq, i2) {
  for (let j = 0; j < seq.length; j++) {
    if (seq[j] !== data[i2 + j + 1]) return false;
  }
  return true;
}
__name(hasSeq, "hasSeq");
function validateEntityName2(name, xmlVersion) {
  if (qName(name, { xmlVersion }))
    return name;
  else
    throw new Error(`Invalid entity name ${name}`);
}
__name(validateEntityName2, "validateEntityName");

// node_modules/.pnpm/anynum@1.0.1/node_modules/anynum/digitTable.js
var SCRIPT_ZEROS = [
  // Basic Latin (ASCII) — included for completeness / pass-through
  48,
  // 0-9
  // Arabic scripts
  1632,
  // Arabic-Indic ٠١٢٣٤٥٦٧٨٩
  1776,
  // Extended Arabic-Indic (Urdu/Persian/Sindhi) ۰۱۲۳
  // Indic scripts
  2406,
  // Devanagari ०१२३४५६७८९
  2534,
  // Bengali ০১২৩৪৫৬৭৮৯
  2662,
  // Gurmukhi ੦੧੨੩੪੫੬੭੮੯
  2790,
  // Gujarati ૦૧૨૩૪૫૬૭૮૯
  2918,
  // Odia ୦୧୨୩୪୫୬୭୮୯
  3046,
  // Tamil ௦௧௨௩௪௫௬௭௮௯
  3174,
  // Telugu ౦౧౨౩౪౫౬౭౮౯
  3302,
  // Kannada ೦೧೨೩೪೫೬೭೮೯
  3430,
  // Malayalam ൦൧൨൩൪൫൬൭൮൯
  3558,
  // Sinhala Archaic ෦෧෨෩෪෫෬෭෮෯
  // Southeast Asian scripts
  3664,
  // Thai ๐๑๒๓๔๕๖๗๘๙
  3792,
  // Lao ໐໑໒໓໔໕໖໗໘໙
  3872,
  // Tibetan ༠༡༢༣༤༥༦༧༨༩
  4160,
  // Myanmar ၀၁၂၃၄၅၆၇၈၉
  4240,
  // Myanmar Shan ႐႑႒႓႔႕႖႗႘႙
  6112,
  // Khmer ០១២៣៤៥៦៧៨៩
  6160,
  // Mongolian ᠐᠑᠒᠓᠔᠕᠖᠗᠘᠙
  6470,
  // Limbu ᥆᥇᥈᥉᥊᥋᥌᥍᥎᥏
  6608,
  // New Tai Lue ᧐᧑᧒᧓᧔᧕᧖᧗᧘᧙
  6784,
  // Tai Tham Hora ᪀᪁᪂᪃᪄᪅᪆᪇᪈᪉
  6800,
  // Tai Tham Tham ᪐᪑᪒᪓᪔᪕᪖᪗᪘᪙
  6992,
  // Balinese ᭐᭑᭒᭓᭔᭕᭖᭗᭘᭙
  7088,
  // Sundanese ᮰᮱᮲᮳᮴᮵᮶᮷᮸᮹
  7232,
  // Lepcha ᱀᱁᱂᱃᱄᱅᱆᱇᱈᱉
  7248,
  // Ol Chiki ᱐᱑᱒᱓᱔᱕᱖᱗᱘᱙
  // Fullwidth (CJK context)
  65296,
  // Fullwidth ０１２３４５６７８９
  // Mathematical digit variants (Unicode math block)
  120782,
  // Mathematical Bold
  120792,
  // Mathematical Double-Struck
  120802,
  // Mathematical Sans-Serif
  120812,
  // Mathematical Sans-Serif Bold
  120822,
  // Mathematical Monospace
  // Other scripts
  66720,
  // Osmanya 𐒠𐒡𐒢𐒣𐒤𐒥𐒦𐒧𐒨𐒩
  68912,
  // Hanifi Rohingya 𐴰𐴱𐴲𐴳𐴴𐴵𐴶𐴷𐴸𐴹
  69734,
  // Brahmi 𑁦𑁧𑁨𑁩𑁪𑁫𑁬𑁭𑁮𑁯
  69872,
  // Sora Sompeng 𑃰𑃱𑃲𑃳𑃴𑃵𑃶𑃷𑃸𑃹
  69942,
  // Chakma 𑄶𑄷𑄸𑄹𑄺𑄻𑄼𑄽𑄾𑄿
  70096,
  // Sharada 𑇐𑇑𑇒𑇓𑇔𑇕𑇖𑇗𑇘𑇙
  70384,
  // Khudawadi 𑋰𑋱𑋲𑋳𑋴𑋵𑋶𑋷𑋸𑋹
  70736,
  // Newa 𑑐𑑑𑑒𑑓𑑔𑑕𑑖𑑗𑑘𑑙
  70864,
  // Tirhuta 𑓐𑓑𑓒𑓓𑓔𑓕𑓖𑓗𑓘𑓙
  71248,
  // Modi 𑙐𑙑𑙒𑙓𑙔𑙕𑙖𑙗𑙘𑙙
  71360,
  // Takri 𑛀𑛁𑛂𑛃𑛄𑛅𑛆𑛇𑛈𑛉
  71472,
  // Ahom 𑜰𑜱𑜲𑜳𑜴𑜵𑜶𑜷𑜸𑜹
  71904,
  // Warang Citi 𑣠𑣡𑣢𑣣𑣤𑣥𑣦𑣧𑣨𑣩
  72016,
  // Dives Akuru 𑥐𑥑𑥒𑥓𑥔𑥕𑥖𑥗𑥘𑥙
  72688,
  // Khitan Small Script 𑯰𑯱𑯲𑯳𑯴𑯵𑯶𑯷𑯸𑯹
  72784,
  // Bhaiksuki 𑱐𑱑𑱒𑱓𑱔𑱕𑱖𑱗𑱘𑱙
  73040,
  // Masaram Gondi 𑵐𑵑𑵒𑵓𑵔𑵕𑵖𑵗𑵘𑵙
  73120,
  // Gunjala Gondi 𑶠𑶡𑶢𑶣𑶤𑶥𑶦𑶧𑶨𑶩
  73552,
  // Kawi 𑽐𑽑𑽒𑽓𑽔𑽕𑽖𑽗𑽘𑽙
  92768,
  // Mro 𖩠𖩡𖩢𖩣𖩤𖩥𖩦𖩧𖩨𖩩
  92864,
  // Tangsa 𖫀𖫁𖫂𖫃𖫄𖫅𖫆𖫇𖫈𖫉
  93008,
  // Pahawh Hmong 𖭐𖭑𖭒𖭓𖭔𖭕𖭖𖭗𖭘𖭙
  123200,
  // Nyiakeng Puachue Hmong 𞅀𞅁𞅂𞅃𞅄𞅅𞅆𞅇𞅈𞅉
  123632,
  // Wancho 𞋰𞋱𞋲𞋳𞋴𞋵𞋶𞋷𞋸𞋹
  124144,
  // Nag Mundari 𞓰𞓱𞓲𞓳𞓴𞓵𞓶𞓷𞓸𞓹
  125264,
  // Adlam 𞥐𞥑𞥒𞥓𞥔𞥕𞥖𞥗𞥘𞥙
  130032
  // Segmented digit symbols 🯰🯱🯲🯳🯴🯵🯶🯷🯸🯹
];
var NOT_DIGIT = 255;
var HIGH_MAP = /* @__PURE__ */ new Map();
var LOW_MAX = 65535;
var LOW_MIN = 1632;
var TABLE_OFFSET = LOW_MIN;
var TABLE_SIZE = LOW_MAX - LOW_MIN + 1;
var TABLE = new Uint8Array(TABLE_SIZE).fill(NOT_DIGIT);
for (const zero of SCRIPT_ZEROS) {
  for (let d = 0; d < 10; d++) {
    const cp = zero + d;
    if (cp <= LOW_MAX) {
      TABLE[cp - TABLE_OFFSET] = d;
    } else {
      HIGH_MAP.set(cp, d);
    }
  }
}

// node_modules/.pnpm/anynum@1.0.1/node_modules/anynum/anynum.js
var CHAR_0 = 48;
var CHAR_9 = 57;
var CHAR_MINUS = 45;
var MINUS_SET = /* @__PURE__ */ new Set([8722, 65293, 65123]);
function anynum(str) {
  if (typeof str !== "string") return str;
  const len = str.length;
  if (len === 0) return str;
  let firstHit = -1;
  for (let i2 = 0; i2 < len; i2++) {
    const cc = str.charCodeAt(i2);
    if (cc >= CHAR_0 && cc <= CHAR_9 || cc === CHAR_MINUS) continue;
    if (cc < TABLE_OFFSET) {
      if (MINUS_SET.has(cc)) {
        firstHit = i2;
        break;
      }
      continue;
    }
    if (cc >= 55296 && cc <= 56319) {
      if (i2 + 1 < len) {
        const low = str.charCodeAt(i2 + 1);
        if (low >= 56320 && low <= 57343) {
          const cp = 65536 + (cc - 55296 << 10) + (low - 56320);
          if (HIGH_MAP.has(cp)) {
            firstHit = i2;
            break;
          }
        }
      }
      continue;
    }
    if (TABLE[cc - TABLE_OFFSET] !== NOT_DIGIT || MINUS_SET.has(cc)) {
      firstHit = i2;
      break;
    }
  }
  if (firstHit === -1) return str;
  const chars = [];
  if (firstHit > 0) chars.push(str.slice(0, firstHit));
  for (let i2 = firstHit; i2 < len; i2++) {
    const cc = str.charCodeAt(i2);
    if (cc >= CHAR_0 && cc <= CHAR_9 || cc === CHAR_MINUS) {
      chars.push(str[i2]);
      continue;
    }
    if (cc < TABLE_OFFSET) {
      chars.push(MINUS_SET.has(cc) ? "-" : str[i2]);
      continue;
    }
    if (cc >= 55296 && cc <= 56319) {
      if (i2 + 1 < len) {
        const low = str.charCodeAt(i2 + 1);
        if (low >= 56320 && low <= 57343) {
          const cp = 65536 + (cc - 55296 << 10) + (low - 56320);
          const d2 = HIGH_MAP.get(cp);
          if (d2 !== void 0) {
            chars.push(String.fromCharCode(d2 + 48));
            i2++;
            continue;
          }
        }
      }
      chars.push(str[i2]);
      continue;
    }
    if (MINUS_SET.has(cc)) {
      chars.push("-");
      continue;
    }
    const d = TABLE[cc - TABLE_OFFSET];
    chars.push(d !== NOT_DIGIT ? String.fromCharCode(d + 48) : str[i2]);
  }
  return chars.join("");
}
__name(anynum, "anynum");
var anynum_default = anynum;

// node_modules/.pnpm/strnum@2.4.1/node_modules/strnum/strnum.js
var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
var binRegex = /^0b[01]+$/;
var octRegex = /^0o[0-7]+$/;
var numRegex = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/;
var consider = {
  hex: true,
  binary: false,
  octal: false,
  leadingZeros: true,
  decimalPoint: ".",
  eNotation: true,
  //skipLike: /regex/,
  infinity: "original",
  // "null", "infinity" (Infinity type), "string" ("Infinity" (the string literal))
  unicode: false
};
function toNumber(str, options = {}) {
  options = Object.assign({}, consider, options);
  if (!str || typeof str !== "string") return str;
  let trimmedStr = str.trim();
  if (trimmedStr.length === 0) return str;
  else if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str;
  else if (trimmedStr === "0") return 0;
  if (options.unicode) {
    trimmedStr = anynum_default(trimmedStr);
    if (trimmedStr === "0") return 0;
  }
  if (options.hex && hexRegex.test(trimmedStr)) {
    return parse_int(trimmedStr, 16);
  } else if (options.binary && binRegex.test(trimmedStr)) {
    return parse_int(trimmedStr, 2);
  } else if (options.octal && octRegex.test(trimmedStr)) {
    return parse_int(trimmedStr, 8);
  } else if (!isFinite(trimmedStr)) {
    return handleInfinity(str, Number(trimmedStr), options);
  } else if (trimmedStr.includes("e") || trimmedStr.includes("E")) {
    return resolveEnotation(str, trimmedStr, options);
  } else {
    const match2 = numRegex.exec(trimmedStr);
    if (match2) {
      const sign = match2[1] || "";
      const leadingZeros = match2[2];
      let numTrimmedByZeros = trimZeros(match2[3]);
      const decimalAdjacentToLeadingZeros = sign ? (
        // 0., -00., 000.
        str[leadingZeros.length + 1] === "."
      ) : str[leadingZeros.length] === ".";
      if (!options.leadingZeros && (leadingZeros.length > 1 || leadingZeros.length === 1 && !decimalAdjacentToLeadingZeros)) {
        return str;
      } else {
        const num = Number(trimmedStr);
        const parsedStr = String(num);
        if (num === 0) return num;
        if (parsedStr.search(/[eE]/) !== -1) {
          if (options.eNotation) return num;
          else return str;
        } else if (trimmedStr.indexOf(".") !== -1) {
          if (parsedStr === "0") return num;
          else if (parsedStr === numTrimmedByZeros) return num;
          else if (parsedStr === `${sign}${numTrimmedByZeros}`) return num;
          else return str;
        }
        let n = leadingZeros ? numTrimmedByZeros : trimmedStr;
        if (leadingZeros) {
          return n === parsedStr || sign + n === parsedStr ? num : str;
        } else {
          return n === parsedStr || n === sign + parsedStr ? num : str;
        }
      }
    } else {
      return str;
    }
  }
}
__name(toNumber, "toNumber");
var eNotationRegx = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;
function resolveEnotation(str, trimmedStr, options) {
  if (!options.eNotation) return str;
  const notation = trimmedStr.match(eNotationRegx);
  if (notation) {
    let sign = notation[1] || "";
    const eChar = notation[3].indexOf("e") === -1 ? "E" : "e";
    const leadingZeros = notation[2];
    const eAdjacentToLeadingZeros = sign ? (
      // 0E.
      str[leadingZeros.length + 1] === eChar
    ) : str[leadingZeros.length] === eChar;
    if (leadingZeros.length > 1 && eAdjacentToLeadingZeros) return str;
    else if (leadingZeros.length === 1 && (notation[3].startsWith(`.${eChar}`) || notation[3][0] === eChar)) {
      return Number(trimmedStr);
    } else if (leadingZeros.length > 0) {
      if (options.leadingZeros && !eAdjacentToLeadingZeros) {
        trimmedStr = (notation[1] || "") + notation[3];
        return Number(trimmedStr);
      } else return str;
    } else {
      return Number(trimmedStr);
    }
  } else {
    return str;
  }
}
__name(resolveEnotation, "resolveEnotation");
function trimZeros(numStr) {
  if (numStr && numStr.indexOf(".") !== -1) {
    numStr = numStr.replace(/0+$/, "");
    if (numStr === ".") numStr = "0";
    else if (numStr[0] === ".") numStr = "0" + numStr;
    else if (numStr[numStr.length - 1] === ".") numStr = numStr.substring(0, numStr.length - 1);
    return numStr;
  }
  return numStr;
}
__name(trimZeros, "trimZeros");
function parse_int(numStr, base) {
  const str = numStr.trim();
  if (base === 2 || base === 8) numStr = str.substring(2);
  if (parseInt) return parseInt(numStr, base);
  else if (Number.parseInt) return Number.parseInt(numStr, base);
  else if (window && window.parseInt) return window.parseInt(numStr, base);
  else throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
}
__name(parse_int, "parse_int");
function handleInfinity(str, num, options) {
  const isPositive = num === Infinity;
  switch (options.infinity.toLowerCase()) {
    case "null":
      return null;
    case "infinity":
      return num;
    // Return Infinity or -Infinity
    case "string":
      return isPositive ? "Infinity" : "-Infinity";
    case "original":
    default:
      return str;
  }
}
__name(handleInfinity, "handleInfinity");

// node_modules/.pnpm/fast-xml-parser@5.10.0/node_modules/fast-xml-parser/src/ignoreAttributes.js
function getIgnoreAttributesFn(ignoreAttributes) {
  if (typeof ignoreAttributes === "function") {
    return ignoreAttributes;
  }
  if (Array.isArray(ignoreAttributes)) {
    return (attrName) => {
      for (const pattern of ignoreAttributes) {
        if (typeof pattern === "string" && attrName === pattern) {
          return true;
        }
        if (pattern instanceof RegExp && pattern.test(attrName)) {
          return true;
        }
      }
    };
  }
  return () => false;
}
__name(getIgnoreAttributesFn, "getIgnoreAttributesFn");

// node_modules/.pnpm/path-expression-matcher@1.6.2/node_modules/path-expression-matcher/src/Expression.js
var Expression = class {
  static {
    __name(this, "Expression");
  }
  /**
   * Create a new Expression
   * @param {string} pattern - Pattern string (e.g., "root.users.user", "..user[id]")
   * @param {Object} options - Configuration options
   * @param {string} options.separator - Path separator (default: '.')
   */
  constructor(pattern, options = {}, data) {
    this.pattern = pattern;
    this.separator = options.separator || ".";
    this.segments = this._parse(pattern);
    this.data = data;
    this._hasDeepWildcard = this.segments.some((seg) => seg.type === "deep-wildcard");
    this._hasAttributeCondition = this.segments.some((seg) => seg.attrName !== void 0);
    this._hasPositionSelector = this.segments.some((seg) => seg.position !== void 0);
  }
  /**
   * Parse pattern string into segments
   * @private
   * @param {string} pattern - Pattern to parse
   * @returns {Array} Array of segment objects
   */
  _parse(pattern) {
    const segments = [];
    let i2 = 0;
    let currentPart = "";
    while (i2 < pattern.length) {
      if (pattern[i2] === this.separator) {
        if (i2 + 1 < pattern.length && pattern[i2 + 1] === this.separator) {
          if (currentPart.trim()) {
            segments.push(this._parseSegment(currentPart.trim()));
            currentPart = "";
          }
          segments.push({ type: "deep-wildcard" });
          i2 += 2;
        } else {
          if (currentPart.trim()) {
            segments.push(this._parseSegment(currentPart.trim()));
          }
          currentPart = "";
          i2++;
        }
      } else {
        currentPart += pattern[i2];
        i2++;
      }
    }
    if (currentPart.trim()) {
      segments.push(this._parseSegment(currentPart.trim()));
    }
    return segments;
  }
  /**
   * Parse a single segment
   * @private
   * @param {string} part - Segment string (e.g., "user", "ns::user", "user[id]", "ns::user:first")
   * @returns {Object} Segment object
   */
  _parseSegment(part) {
    const segment = { type: "tag" };
    let bracketContent = null;
    let withoutBrackets = part;
    const bracketMatch = part.match(/^([^\[]+)(\[[^\]]*\])(.*)$/);
    if (bracketMatch) {
      withoutBrackets = bracketMatch[1] + bracketMatch[3];
      if (bracketMatch[2]) {
        const content = bracketMatch[2].slice(1, -1);
        if (content) {
          bracketContent = content;
        }
      }
    }
    let namespace = void 0;
    let tagAndPosition = withoutBrackets;
    if (withoutBrackets.includes("::")) {
      const nsIndex = withoutBrackets.indexOf("::");
      namespace = withoutBrackets.substring(0, nsIndex).trim();
      tagAndPosition = withoutBrackets.substring(nsIndex + 2).trim();
      if (!namespace) {
        throw new Error(`Invalid namespace in pattern: ${part}`);
      }
    }
    let tag = void 0;
    let positionMatch = null;
    if (tagAndPosition.includes(":")) {
      const colonIndex = tagAndPosition.lastIndexOf(":");
      const tagPart = tagAndPosition.substring(0, colonIndex).trim();
      const posPart = tagAndPosition.substring(colonIndex + 1).trim();
      const isPositionKeyword = ["first", "last", "odd", "even"].includes(posPart) || /^nth\(\d+\)$/.test(posPart);
      if (isPositionKeyword) {
        tag = tagPart;
        positionMatch = posPart;
      } else {
        tag = tagAndPosition;
      }
    } else {
      tag = tagAndPosition;
    }
    if (!tag) {
      throw new Error(`Invalid segment pattern: ${part}`);
    }
    segment.tag = tag;
    if (namespace) {
      segment.namespace = namespace;
    }
    if (bracketContent) {
      if (bracketContent.includes("=")) {
        const eqIndex = bracketContent.indexOf("=");
        segment.attrName = bracketContent.substring(0, eqIndex).trim();
        segment.attrValue = bracketContent.substring(eqIndex + 1).trim();
      } else {
        segment.attrName = bracketContent.trim();
      }
    }
    if (positionMatch) {
      const nthMatch = positionMatch.match(/^nth\((\d+)\)$/);
      if (nthMatch) {
        segment.position = "nth";
        segment.positionValue = parseInt(nthMatch[1], 10);
      } else {
        segment.position = positionMatch;
      }
    }
    return segment;
  }
  /**
   * Get the number of segments
   * @returns {number}
   */
  get length() {
    return this.segments.length;
  }
  /**
   * Check if expression contains deep wildcard
   * @returns {boolean}
   */
  hasDeepWildcard() {
    return this._hasDeepWildcard;
  }
  /**
   * Check if expression has attribute conditions
   * @returns {boolean}
   */
  hasAttributeCondition() {
    return this._hasAttributeCondition;
  }
  /**
   * Check if expression has position selectors
   * @returns {boolean}
   */
  hasPositionSelector() {
    return this._hasPositionSelector;
  }
  /**
   * Get string representation
   * @returns {string}
   */
  toString() {
    return this.pattern;
  }
};

// node_modules/.pnpm/path-expression-matcher@1.6.2/node_modules/path-expression-matcher/src/ExpressionSet.js
var ExpressionSet = class {
  static {
    __name(this, "ExpressionSet");
  }
  constructor() {
    this._byDepthAndTag = /* @__PURE__ */ new Map();
    this._wildcardByDepth = /* @__PURE__ */ new Map();
    this._deepWildcards = [];
    this._deepByTerminalTag = /* @__PURE__ */ new Map();
    this._patterns = /* @__PURE__ */ new Set();
    this._sealed = false;
  }
  /**
   * Add an Expression to the set.
   * Duplicate patterns (same pattern string) are silently ignored.
   *
   * @param {import('./Expression.js').default} expression - A pre-constructed Expression instance
   * @returns {this} for chaining
   * @throws {TypeError} if called after seal()
   *
   * @example
   * set.add(new Expression('root.users.user'));
   * set.add(new Expression('..script'));
   */
  add(expression) {
    if (this._sealed) {
      throw new TypeError(
        "ExpressionSet is sealed. Create a new ExpressionSet to add more expressions."
      );
    }
    if (this._patterns.has(expression.pattern)) return this;
    this._patterns.add(expression.pattern);
    if (expression.hasDeepWildcard()) {
      const lastSeg2 = expression.segments[expression.segments.length - 1];
      if (lastSeg2 && lastSeg2.type !== "deep-wildcard" && lastSeg2.tag !== "*") {
        const tag2 = lastSeg2.tag;
        if (!this._deepByTerminalTag.has(tag2)) this._deepByTerminalTag.set(tag2, []);
        this._deepByTerminalTag.get(tag2).push(expression);
      } else {
        this._deepWildcards.push(expression);
      }
      return this;
    }
    const depth = expression.length;
    const lastSeg = expression.segments[expression.segments.length - 1];
    const tag = lastSeg?.tag;
    if (!tag || tag === "*") {
      if (!this._wildcardByDepth.has(depth)) this._wildcardByDepth.set(depth, []);
      this._wildcardByDepth.get(depth).push(expression);
    } else {
      const key = `${depth}:${tag}`;
      if (!this._byDepthAndTag.has(key)) this._byDepthAndTag.set(key, []);
      this._byDepthAndTag.get(key).push(expression);
    }
    return this;
  }
  /**
   * Add multiple expressions at once.
   *
   * @param {import('./Expression.js').default[]} expressions - Array of Expression instances
   * @returns {this} for chaining
   *
   * @example
   * set.addAll([
   *   new Expression('root.users.user'),
   *   new Expression('root.config.setting'),
   * ]);
   */
  addAll(expressions) {
    for (const expr of expressions) this.add(expr);
    return this;
  }
  /**
   * Check whether a pattern string is already present in the set.
   *
   * @param {import('./Expression.js').default} expression
   * @returns {boolean}
   */
  has(expression) {
    return this._patterns.has(expression.pattern);
  }
  /**
   * Number of expressions in the set.
   * @type {number}
   */
  get size() {
    return this._patterns.size;
  }
  /**
   * Seal the set against further modifications.
   * Useful to prevent accidental mutations after config is built.
   * Calling add() or addAll() on a sealed set throws a TypeError.
   *
   * @returns {this}
   */
  seal() {
    this._sealed = true;
    return this;
  }
  /**
   * Whether the set has been sealed.
   * @type {boolean}
   */
  get isSealed() {
    return this._sealed;
  }
  /**
   * Test whether the matcher's current path matches any expression in the set.
   *
   * Evaluation order (cheapest → most expensive):
   *  1. Exact depth + tag bucket  — O(1) lookup, typically 0–2 expressions
   *  2. Depth-only wildcard bucket — O(1) lookup, rare
   *  3. Deep-wildcard list         — always checked, but usually small
   *
   * @param {import('./Matcher.js').default} matcher - Matcher instance (or readOnly view)
   * @returns {boolean} true if any expression matches the current path
   *
   * @example
   * if (stopNodes.matchesAny(matcher)) {
   *   // handle stop node
   * }
   */
  matchesAny(matcher) {
    return this.findMatch(matcher) !== null;
  }
  /**
  * Find and return the first Expression that matches the matcher's current path.
  *
  * Uses the same evaluation order as matchesAny (cheapest → most expensive):
  *  1. Exact depth + tag bucket
  *  2. Depth-only wildcard bucket
  *  3. Deep-wildcard list
  *
  * @param {import('./Matcher.js').default} matcher - Matcher instance (or readOnly view)
  * @returns {import('./Expression.js').default | null} the first matching Expression, or null
  *
  * @example
  * const expr = stopNodes.findMatch(matcher);
  * if (expr) {
  *   // access expr.config, expr.pattern, etc.
  * }
  */
  findMatch(matcher) {
    const depth = matcher.getDepth();
    const tag = matcher.getCurrentTag();
    const exactKey = `${depth}:${tag}`;
    const exactBucket = this._byDepthAndTag.get(exactKey);
    if (exactBucket) {
      for (let i2 = 0; i2 < exactBucket.length; i2++) {
        if (matcher.matches(exactBucket[i2])) return exactBucket[i2];
      }
    }
    const wildcardBucket = this._wildcardByDepth.get(depth);
    if (wildcardBucket) {
      for (let i2 = 0; i2 < wildcardBucket.length; i2++) {
        if (matcher.matches(wildcardBucket[i2])) return wildcardBucket[i2];
      }
    }
    const deepBucket = this._deepByTerminalTag.get(tag);
    if (deepBucket) {
      for (let i2 = 0; i2 < deepBucket.length; i2++) {
        if (matcher.matches(deepBucket[i2])) return deepBucket[i2];
      }
    }
    for (let i2 = 0; i2 < this._deepWildcards.length; i2++) {
      if (matcher.matches(this._deepWildcards[i2])) return this._deepWildcards[i2];
    }
    return null;
  }
};

// node_modules/.pnpm/path-expression-matcher@1.6.2/node_modules/path-expression-matcher/src/Matcher.js
var MatcherView = class {
  static {
    __name(this, "MatcherView");
  }
  /**
   * @param {Matcher} matcher - The parent Matcher instance to read from.
   */
  constructor(matcher) {
    this._matcher = matcher;
  }
  /**
   * Get the path separator used by the parent matcher.
   * @returns {string}
   */
  get separator() {
    return this._matcher.separator;
  }
  /**
   * Get current tag name.
   * @returns {string|undefined}
   */
  getCurrentTag() {
    const path = this._matcher.path;
    return path.length > 0 ? path[path.length - 1].tag : void 0;
  }
  /**
   * Get current namespace.
   * @returns {string|undefined}
   */
  getCurrentNamespace() {
    const path = this._matcher.path;
    return path.length > 0 ? path[path.length - 1].namespace : void 0;
  }
  /**
   * Get current node's attribute value.
   * @param {string} attrName
   * @returns {*}
   */
  getAttrValue(attrName) {
    const path = this._matcher.path;
    if (path.length === 0) return void 0;
    return path[path.length - 1].values?.[attrName];
  }
  /**
   * Check if current node has an attribute.
   * @param {string} attrName
   * @returns {boolean}
   */
  hasAttr(attrName) {
    const path = this._matcher.path;
    if (path.length === 0) return false;
    const current = path[path.length - 1];
    return current.values !== void 0 && attrName in current.values;
  }
  /**
   * Get the value of a "kept" attribute from the nearest ancestor (or
   * current node) that declared it via `push(tag, attrs, ns, { keep: [...] })`.
   * @param {string} attrName
   * @returns {*}
   */
  getAnyParentAttr(attrName) {
    return this._matcher.getAnyParentAttr(attrName);
  }
  /**
   * Check whether any ancestor (or the current node) kept the given
   * attribute via `push(tag, attrs, ns, { keep: [...] })`.
   * @param {string} attrName
   * @returns {boolean}
   */
  hasAnyParentAttr(attrName) {
    return this._matcher.hasAnyParentAttr(attrName);
  }
  /**
   * Get current node's sibling position (child index in parent).
   * @returns {number}
   */
  getPosition() {
    const path = this._matcher.path;
    if (path.length === 0) return -1;
    return path[path.length - 1].position ?? 0;
  }
  /**
   * Get current node's repeat counter (occurrence count of this tag name).
   * @returns {number}
   */
  getCounter() {
    const path = this._matcher.path;
    if (path.length === 0) return -1;
    return path[path.length - 1].counter ?? 0;
  }
  /**
   * Get current node's sibling index (alias for getPosition).
   * @returns {number}
   * @deprecated Use getPosition() or getCounter() instead
   */
  getIndex() {
    return this.getPosition();
  }
  /**
   * Get current path depth.
   * @returns {number}
   */
  getDepth() {
    return this._matcher.path.length;
  }
  /**
   * Get path as string.
   * @param {string} [separator] - Optional separator (uses default if not provided)
   * @param {boolean} [includeNamespace=true]
   * @returns {string}
   */
  toString(separator, includeNamespace = true) {
    return this._matcher.toString(separator, includeNamespace);
  }
  /**
   * Get path as array of tag names.
   * @returns {string[]}
   */
  toArray() {
    return this._matcher.path.map((n) => n.tag);
  }
  /**
   * Match current path against an Expression.
   * @param {Expression} expression
   * @returns {boolean}
   */
  matches(expression) {
    return this._matcher.matches(expression);
  }
  /**
   * Match any expression in the given set against the current path.
   * @param {ExpressionSet} exprSet
   * @returns {boolean}
   */
  matchesAny(exprSet) {
    return exprSet.matchesAny(this._matcher);
  }
};
var Matcher = class {
  static {
    __name(this, "Matcher");
  }
  /**
   * Create a new Matcher.
   * @param {Object} [options={}]
   * @param {string} [options.separator='.'] - Default path separator
   */
  constructor(options = {}) {
    this.separator = options.separator || ".";
    this.path = [];
    this.siblingStacks = [];
    this._pathStringCache = null;
    this._view = new MatcherView(this);
    this._keptAttrs = [];
  }
  /**
   * Push a new tag onto the path.
   * @param {string} tagName
   * @param {Object|null} [attrValues=null]
   * @param {string|null} [namespace=null]
   * @param {Object|null} [options=null]
   * @param {string[]} [options.keep] - Names of attributes (from attrValues)
   */
  push(tagName, attrValues = null, namespace = null, options = null) {
    this._pathStringCache = null;
    if (this.path.length > 0) {
      this.path[this.path.length - 1].values = void 0;
    }
    const currentLevel = this.path.length;
    let level = this.siblingStacks[currentLevel];
    if (!level) {
      level = { counts: /* @__PURE__ */ new Map(), total: 0 };
      this.siblingStacks[currentLevel] = level;
    }
    const siblingKey = namespace ? `${namespace}:${tagName}` : tagName;
    const counter = level.counts.get(siblingKey) || 0;
    const position = level.total;
    level.counts.set(siblingKey, counter + 1);
    level.total++;
    const node = {
      tag: tagName,
      position,
      counter
    };
    if (namespace !== null && namespace !== void 0) {
      node.namespace = namespace;
    }
    if (attrValues !== null && attrValues !== void 0) {
      node.values = attrValues;
    }
    this.path.push(node);
    const depth = this.path.length;
    const keep = options !== null ? options.keep : null;
    if (keep !== null && keep !== void 0 && keep.length > 0 && attrValues) {
      for (let i2 = 0; i2 < keep.length; i2++) {
        const name = keep[i2];
        if (attrValues[name] !== void 0) {
          this._keptAttrs.push({ depth, name, value: attrValues[name] });
        }
      }
    }
  }
  /**
   * Pop the last tag from the path.
   * @returns {Object|undefined} The popped node
   */
  pop() {
    if (this.path.length === 0) return void 0;
    this._pathStringCache = null;
    const node = this.path.pop();
    if (this.siblingStacks.length > this.path.length + 1) {
      this.siblingStacks.length = this.path.length + 1;
    }
    const poppedDepth = this.path.length + 1;
    while (this._keptAttrs.length > 0 && this._keptAttrs[this._keptAttrs.length - 1].depth >= poppedDepth) {
      this._keptAttrs.pop();
    }
    return node;
  }
  /**
   * Update current node's attribute values.
   * Useful when attributes are parsed after push.
   * @param {Object} attrValues
   */
  updateCurrent(attrValues) {
    if (this.path.length > 0) {
      const current = this.path[this.path.length - 1];
      if (attrValues !== null && attrValues !== void 0) {
        current.values = attrValues;
      }
    }
  }
  /**
   * Get current tag name.
   * @returns {string|undefined}
   */
  getCurrentTag() {
    return this.path.length > 0 ? this.path[this.path.length - 1].tag : void 0;
  }
  /**
   * Get current namespace.
   * @returns {string|undefined}
   */
  getCurrentNamespace() {
    return this.path.length > 0 ? this.path[this.path.length - 1].namespace : void 0;
  }
  /**
   * Get current node's attribute value.
   * @param {string} attrName
   * @returns {*}
   */
  getAttrValue(attrName) {
    if (this.path.length === 0) return void 0;
    return this.path[this.path.length - 1].values?.[attrName];
  }
  /**
   * Check if current node has an attribute.
   * @param {string} attrName
   * @returns {boolean}
   */
  hasAttr(attrName) {
    if (this.path.length === 0) return false;
    const current = this.path[this.path.length - 1];
    return current.values !== void 0 && attrName in current.values;
  }
  /**
   * Get the value of a "kept" attribute from the nearest ancestor (or
   * current node) that declared it via `push(tag, attrs, ns, { keep: [...] })`.
   * Unlike getAttrValue(), this works regardless of how deep the path has
   * gone since the attribute was pushed — but only for attribute names that
   * were explicitly marked with `keep` at push time. Cost is proportional to
   * the number of currently-kept attributes (typically 0-3), not path depth.
   * @param {string} attrName
   * @returns {*} the value, or undefined if no ancestor kept this attribute
   */
  getAnyParentAttr(attrName) {
    const kept = this._keptAttrs;
    for (let i2 = kept.length - 1; i2 >= 0; i2--) {
      if (kept[i2].name === attrName) return kept[i2].value;
    }
    return void 0;
  }
  /**
   * Check whether any ancestor (or the current node) kept the given
   * attribute via `push(tag, attrs, ns, { keep: [...] })`.
   * @param {string} attrName
   * @returns {boolean}
   */
  hasAnyParentAttr(attrName) {
    const kept = this._keptAttrs;
    for (let i2 = kept.length - 1; i2 >= 0; i2--) {
      if (kept[i2].name === attrName) return true;
    }
    return false;
  }
  /**
   * Get current node's sibling position (child index in parent).
   * @returns {number}
   */
  getPosition() {
    if (this.path.length === 0) return -1;
    return this.path[this.path.length - 1].position ?? 0;
  }
  /**
   * Get current node's repeat counter (occurrence count of this tag name).
   * @returns {number}
   */
  getCounter() {
    if (this.path.length === 0) return -1;
    return this.path[this.path.length - 1].counter ?? 0;
  }
  /**
   * Get current node's sibling index (alias for getPosition).
   * @returns {number}
   * @deprecated Use getPosition() or getCounter() instead
   */
  getIndex() {
    return this.getPosition();
  }
  /**
   * Get current path depth.
   * @returns {number}
   */
  getDepth() {
    return this.path.length;
  }
  /**
   * Get path as string.
   * @param {string} [separator] - Optional separator (uses default if not provided)
   * @param {boolean} [includeNamespace=true]
   * @returns {string}
   */
  toString(separator, includeNamespace = true) {
    const sep2 = separator || this.separator;
    const isDefault = sep2 === this.separator && includeNamespace === true;
    if (isDefault) {
      if (this._pathStringCache !== null) {
        return this._pathStringCache;
      }
      const result = this.path.map(
        (n) => n.namespace ? `${n.namespace}:${n.tag}` : n.tag
      ).join(sep2);
      this._pathStringCache = result;
      return result;
    }
    return this.path.map(
      (n) => includeNamespace && n.namespace ? `${n.namespace}:${n.tag}` : n.tag
    ).join(sep2);
  }
  /**
   * Get path as array of tag names.
   * @returns {string[]}
   */
  toArray() {
    return this.path.map((n) => n.tag);
  }
  /**
   * Reset the path to empty.
   */
  reset() {
    this._pathStringCache = null;
    this.path = [];
    this.siblingStacks = [];
    this._keptAttrs = [];
  }
  /**
   * Match current path against an Expression.
   * @param {Expression} expression
   * @returns {boolean}
   */
  matches(expression) {
    const segments = expression.segments;
    if (segments.length === 0) {
      return false;
    }
    if (expression.hasDeepWildcard()) {
      return this._matchWithDeepWildcard(segments);
    }
    return this._matchSimple(segments);
  }
  /**
   * @private
   */
  _matchSimple(segments) {
    if (this.path.length !== segments.length) {
      return false;
    }
    for (let i2 = 0; i2 < segments.length; i2++) {
      if (!this._matchSegment(segments[i2], this.path[i2], i2 === this.path.length - 1)) {
        return false;
      }
    }
    return true;
  }
  /**
   * @private
   */
  _matchWithDeepWildcard(segments) {
    let pathIdx = this.path.length - 1;
    let segIdx = segments.length - 1;
    while (segIdx >= 0 && pathIdx >= 0) {
      const segment = segments[segIdx];
      if (segment.type === "deep-wildcard") {
        segIdx--;
        if (segIdx < 0) {
          return true;
        }
        const nextSeg = segments[segIdx];
        let found = false;
        for (let i2 = pathIdx; i2 >= 0; i2--) {
          if (this._matchSegment(nextSeg, this.path[i2], i2 === this.path.length - 1)) {
            pathIdx = i2 - 1;
            segIdx--;
            found = true;
            break;
          }
        }
        if (!found) {
          return false;
        }
      } else {
        if (!this._matchSegment(segment, this.path[pathIdx], pathIdx === this.path.length - 1)) {
          return false;
        }
        pathIdx--;
        segIdx--;
      }
    }
    return segIdx < 0;
  }
  /**
   * @private
   */
  _matchSegment(segment, node, isCurrentNode) {
    if (segment.tag !== "*" && segment.tag !== node.tag) {
      return false;
    }
    if (segment.namespace !== void 0) {
      if (segment.namespace !== "*" && segment.namespace !== node.namespace) {
        return false;
      }
    }
    if (segment.attrName !== void 0) {
      if (!isCurrentNode) {
        return false;
      }
      if (!node.values || !(segment.attrName in node.values)) {
        return false;
      }
      if (segment.attrValue !== void 0) {
        if (String(node.values[segment.attrName]) !== String(segment.attrValue)) {
          return false;
        }
      }
    }
    if (segment.position !== void 0) {
      if (!isCurrentNode) {
        return false;
      }
      const counter = node.counter ?? 0;
      if (segment.position === "first" && counter !== 0) {
        return false;
      } else if (segment.position === "odd" && counter % 2 !== 1) {
        return false;
      } else if (segment.position === "even" && counter % 2 !== 0) {
        return false;
      } else if (segment.position === "nth" && counter !== segment.positionValue) {
        return false;
      }
    }
    return true;
  }
  /**
   * Match any expression in the given set against the current path.
   * @param {ExpressionSet} exprSet
   * @returns {boolean}
   */
  matchesAny(exprSet) {
    return exprSet.matchesAny(this);
  }
  /**
   * Create a snapshot of current state.
   * @returns {Object}
   */
  snapshot() {
    return {
      path: this.path.map((node) => ({ ...node })),
      siblingStacks: this.siblingStacks.map((level) => level ? { counts: new Map(level.counts), total: level.total } : level),
      keptAttrs: this._keptAttrs.map((entry) => ({ ...entry }))
    };
  }
  /**
   * Restore state from snapshot.
   * @param {Object} snapshot
   */
  restore(snapshot) {
    this._pathStringCache = null;
    this.path = snapshot.path.map((node) => ({ ...node }));
    this.siblingStacks = snapshot.siblingStacks.map((level) => level ? { counts: new Map(level.counts), total: level.total } : level);
    this._keptAttrs = (snapshot.keptAttrs || []).map((entry) => ({ ...entry }));
  }
  /**
   * Return the read-only {@link MatcherView} for this matcher.
   *
   * The same instance is returned on every call — no allocation occurs.
   * It always reflects the current parser state and is safe to pass to
   * user callbacks without risk of accidental mutation.
   *
   * @returns {MatcherView}
   *
   * @example
   * const view = matcher.readOnly();
   * // pass view to callbacks — it stays in sync automatically
   * view.matches(expr);       // ✓
   * view.getCurrentTag();     // ✓
   * // view.push(...)         // ✗ method does not exist — caught by TypeScript
   */
  readOnly() {
    return this._view;
  }
};

// node_modules/.pnpm/is-unsafe@2.0.0/node_modules/is-unsafe/src/contexts/html.js
var HTML_PATTERNS = [
  {
    id: "html-script-open",
    description: "<script opening tag",
    pattern: /<script[\s>/]/i
  },
  {
    id: "html-script-close",
    description: "<\/script closing tag",
    pattern: /<\/script[\s>]/i
  },
  {
    id: "html-javascript-protocol",
    description: "javascript: URI scheme (with optional whitespace/encoding)",
    // Handles j&#x61;vascript:, j\u0061vascript:, and whitespace variants
    pattern: /j[\t\n\r ]*a[\t\n\r ]*v[\t\n\r ]*a[\t\n\r ]*s[\t\n\r ]*c[\t\n\r ]*r[\t\n\r ]*i[\t\n\r ]*p[\t\n\r ]*t[\t\n\r ]*:/i
  },
  {
    id: "html-vbscript-protocol",
    description: "vbscript: URI scheme",
    pattern: /vbscript[\t\n\r ]*:/i
  },
  {
    id: "html-data-html",
    description: "data:text/html URI \u2014 can execute scripts in browsers",
    pattern: /data[\t\n\r ]*:[\t\n\r ]*text\/html/i
  },
  {
    id: "html-data-xhtml",
    description: "data:application/xhtml+xml URI",
    pattern: /data[\t\n\r ]*:[\t\n\r ]*application\/xhtml/i
  },
  {
    id: "html-data-svg",
    description: "data:image/svg+xml URI \u2014 can execute scripts",
    pattern: /data[\t\n\r ]*:[\t\n\r ]*image\/svg\+xml/i
  },
  {
    id: "html-inline-event-handler",
    description: "Inline event handler attributes: onclick=, onerror=, onload=, etc.",
    // \bon ensures we match a word boundary so "phonetic=" is not caught
    pattern: /\bon\w{1,30}\s*=/i
  },
  {
    id: "html-entity-obfuscated-script",
    description: "HTML-entity-encoded <script (e.g. &#x3C;script or &lt;script)",
    // Entities include optional trailing semicolon: &#x3C; or &#x3C (both valid in HTML5)
    pattern: /(?:&#x0*3[Cc];?|&#0*60;?|&lt;)\s*script/i
  },
  {
    id: "html-entity-obfuscated-javascript",
    description: 'HTML-entity-encoded javascript: (partial \u2014 catches common &#106; or &#x6a; for "j")',
    pattern: /(?:&#x0*6[Aa];?|&#0*106;?)\s*(?:&#x0*61;?|a)[\s\S]{0,80}script\s*:/i
  },
  {
    id: "html-style-expression",
    description: "CSS expression() \u2014 IE-era code execution in style attributes",
    pattern: /style[\s\S]{0,20}expression\s*\(/i
  },
  {
    id: "html-object-embed",
    description: "<object or <embed tags that can load active content",
    pattern: /<(?:object|embed)[\s>/]/i
  },
  {
    id: "html-base-tag",
    description: "<base href= \u2014 can hijack all relative URLs on a page",
    pattern: /<base[\s>]/i
  },
  {
    id: "html-meta-refresh",
    description: '<meta http-equiv="refresh" \u2014 can redirect users',
    pattern: /<meta[\s\S]{0,40}http-equiv[\s\S]{0,20}refresh/i
  },
  {
    id: "html-srcdoc",
    description: "srcdoc= attribute on iframes \u2014 embeds HTML that can run scripts",
    pattern: /srcdoc\s*=/i
  },
  {
    id: "html-iframe",
    description: "<iframe tag",
    pattern: /<iframe[\s>/]/i
  },
  {
    id: "html-form",
    description: "<form tag \u2014 can be used for phishing / credential harvesting injection",
    pattern: /<form[\s>/]/i
  }
];
var html_default = HTML_PATTERNS;

// node_modules/.pnpm/is-unsafe@2.0.0/node_modules/is-unsafe/src/contexts/xml.js
var XML_PATTERNS = [
  {
    id: "xml-cdata-injection",
    description: "CDATA section injection: <![CDATA[ breaks out of text node context",
    pattern: /<!\[CDATA\[/i
  },
  {
    id: "xml-cdata-close",
    description: "CDATA close sequence: ]]> can terminate an enclosing CDATA section",
    pattern: /\]\]>/
  },
  {
    id: "xml-processing-instruction",
    description: "XML processing instruction: <?xml-stylesheet or <?php etc.",
    pattern: /<\?(?:xml[\- ]|php|asp)/i
  },
  {
    id: "xml-doctype-injection",
    description: "DOCTYPE declaration embedded in content \u2014 can define entities",
    // Match <!DOCTYPE followed by end-of-string, whitespace, or [ (internal subset)
    pattern: /<!DOCTYPE(?:[\s[]|$)/i
  },
  {
    id: "xml-entity-system",
    description: "SYSTEM keyword \u2014 used in external entity declarations (XXE)",
    pattern: /\bSYSTEM\s+["']/i
  },
  {
    id: "xml-entity-public",
    description: "PUBLIC keyword \u2014 used in external entity declarations (XXE)",
    pattern: /\bPUBLIC\s+["']/i
  },
  {
    id: "xml-entity-declaration",
    description: "<!ENTITY declaration \u2014 defines entities, potential XXE or entity expansion",
    pattern: /<!ENTITY[\s%]/i
  },
  {
    id: "xml-billion-laughs",
    description: "Entity reference chaining / billion laughs: repeated &eX; style references",
    // Heuristic: 3+ consecutive entity refs suggests expansion attack
    pattern: /(?:&\w{1,20};){3,}/
  },
  {
    id: "xml-namespace-confusion",
    description: "xmlns: attribute injection \u2014 can redefine namespaces to confuse parsers",
    pattern: /\bxmlns\s*(?::\w{1,40})?\s*=/i
  },
  {
    id: "xml-comment-injection",
    description: "<!-- comment injection \u2014 can hide content from some parsers",
    pattern: /<!--/
  },
  {
    id: "xml-comment-close",
    description: "--> closes an enclosing XML comment",
    pattern: /-->/
  },
  {
    id: "xml-pi-close",
    description: "?> closes an enclosing processing instruction",
    pattern: /\?>/
  }
];
var xml_default = XML_PATTERNS;

// node_modules/.pnpm/is-unsafe@2.0.0/node_modules/is-unsafe/src/contexts/svg.js
var SVG_PATTERNS = [
  {
    id: "svg-script-element",
    description: "<script element inside SVG executes JavaScript",
    pattern: /<script[\s>/]/i
  },
  {
    id: "svg-xlink-href-javascript",
    description: "xlink:href with javascript: \u2014 classic SVG XSS via <a> or <use>",
    pattern: /xlink\s*:\s*href\s*=\s*["']?\s*javascript\s*:/i
  },
  {
    id: "svg-href-javascript",
    description: "href= with javascript: in SVG context (<a>, <animate>, etc.)",
    pattern: /href\s*=\s*["']?\s*javascript\s*:/i
  },
  {
    id: "svg-foreignobject",
    description: "<foreignObject embeds HTML inside SVG \u2014 can execute scripts",
    pattern: /<foreignObject[\s>/]/i
  },
  {
    id: "svg-use-external",
    description: "<use xlink:href or href pointing to external resource (non-fragment URL)",
    // Match <use with href= where the value starts with a non-# character (external URL)
    // [\"'][^#] catches quoted values not starting with #; [^\"'#\s>] catches unquoted
    pattern: /<use[\s\S]{0,60}(?:xlink\s*:\s*)?href\s*=\s*(?:["'][^#]|[^"'#\s>])/i
  },
  {
    id: "svg-animate-href",
    description: '<animate attributeName="href" \u2014 can dynamically change href to javascript:',
    pattern: /<animate[\s\S]{0,80}attributeName\s*=\s*["'][\s]*href["']/i
  },
  {
    id: "svg-animate-xlinkhref",
    description: '<animate attributeName="xlink:href"',
    pattern: /<animate[\s\S]{0,80}attributeName\s*=\s*["'][\s]*xlink\s*:\s*href["']/i
  },
  {
    id: "svg-set-javascript",
    description: '<set to="javascript:..." \u2014 sets an attribute to a javascript: URI',
    pattern: /<set[\s\S]{0,80}to\s*=\s*["']?\s*javascript\s*:/i
  },
  {
    id: "svg-event-handler",
    description: "SVG-specific event handler attributes: onload=, onerror=, onactivate=, etc.",
    pattern: /\bon(?:load|error|activate|begin|end|repeat|focus|blur|click|mouse\w{1,20}|key\w{1,20})\s*=/i
  },
  {
    id: "svg-handler-generic",
    description: "Generic on* handler catch-all for SVG attributes",
    pattern: /\bon\w{1,30}\s*=/i
  },
  {
    id: "svg-filter-feimage",
    description: "<feImage href= \u2014 filter primitive that can load external resources",
    pattern: /<feImage[\s\S]{0,80}(?:xlink\s*:\s*)?href\s*=/i
  },
  {
    id: "svg-image-external",
    description: "<image xlink:href with http/https or javascript protocol",
    pattern: /<image[\s\S]{0,80}(?:xlink\s*:\s*)?href\s*=\s*["']?\s*(?:https?|javascript)\s*:/i
  },
  {
    id: "svg-style-javascript",
    description: "style= attribute containing javascript: (e.g. background:url(javascript:...))",
    pattern: /style\s*=[\s\S]{0,60}javascript\s*:/i
  }
];
var svg_default = SVG_PATTERNS;

// node_modules/.pnpm/is-unsafe@2.0.0/node_modules/is-unsafe/src/contexts/sql.js
var SQL_PATTERNS = [
  {
    id: "sql-block-comment-open",
    description: "SQL block comment open: /* ... */ \u2014 unusual in legitimate user text",
    pattern: /\/\*/
  },
  {
    id: "sql-union-select",
    description: "UNION SELECT \u2014 most common SQL injection aggregation attack",
    pattern: /\bUNION\s{1,20}(?:ALL\s{1,20})?SELECT\b/i
  },
  {
    id: "sql-drop-table",
    description: "DROP TABLE \u2014 destructive DDL injection",
    pattern: /\bDROP\s{1,20}TABLE\b/i
  },
  {
    id: "sql-drop-database",
    description: "DROP DATABASE \u2014 destructive DDL injection",
    pattern: /\bDROP\s{1,20}DATABASE\b/i
  },
  {
    id: "sql-insert-into",
    description: "INSERT INTO \u2014 data injection",
    pattern: /\bINSERT\s{1,20}INTO\b/i
  },
  {
    id: "sql-delete-from",
    description: "DELETE FROM \u2014 data deletion injection",
    pattern: /\bDELETE\s{1,20}FROM\b/i
  },
  {
    id: "sql-update-set",
    description: "UPDATE ... SET \u2014 data modification injection",
    // Allows arbitrary content between UPDATE and SET (table name, alias, etc.)
    pattern: /\bUPDATE\b[\s\S]{1,60}\bSET\b/i
  },
  {
    id: "sql-exec-xp",
    description: "EXEC xp_ \u2014 MSSQL extended stored procedure execution",
    pattern: /\bEXEC(?:UTE)?\s{1,20}xp_/i
  },
  {
    id: "sql-tautology-string",
    description: `Classic string tautology: ' OR '1'='1 or " OR "1"="1"`,
    // Last quote is optional — injection may truncate it: ' OR '1'='1--
    pattern: /'\s{0,10}OR\s{0,10}'[^']{0,20}'\s*=\s*'[^']{0,20}/i
  },
  {
    id: "sql-tautology-numeric",
    description: "Numeric tautology: OR 1=1",
    pattern: /\bOR\s{1,10}1\s*=\s*1\b/i
  },
  {
    id: "sql-always-true-zero",
    description: "Numeric tautology: OR 0=0",
    pattern: /\bOR\s{1,10}0\s*=\s*0\b/i
  },
  {
    id: "sql-sleep-benchmark",
    description: "Time-based blind injection: SLEEP() or BENCHMARK()",
    pattern: /\b(?:SLEEP|BENCHMARK)\s*\(/i
  },
  {
    id: "sql-waitfor-delay",
    description: "MSSQL time-based blind injection: WAITFOR DELAY",
    pattern: /\bWAITFOR\s{1,20}DELAY\b/i
  },
  {
    id: "sql-char-function",
    description: "CHAR() function \u2014 used to obfuscate injected strings",
    pattern: /\bCHAR\s*\(\s*\d{1,3}/i
  },
  {
    id: "sql-information-schema",
    description: "INFORMATION_SCHEMA \u2014 reconnaissance query for table/column enumeration",
    pattern: /\bINFORMATION_SCHEMA\b/i
  }
];
var sql_default = SQL_PATTERNS;

// node_modules/.pnpm/is-unsafe@2.0.0/node_modules/is-unsafe/src/contexts/shell.js
var SHELL_PATTERNS = [
  {
    id: "shell-path-traversal-unix",
    description: "Unix path traversal: ../  \u2014 climbing the directory tree",
    pattern: /\.\.\//
  },
  {
    id: "shell-path-traversal-windows",
    description: "Windows path traversal: ..\\ \u2014 climbing the directory tree",
    pattern: /\.\.\\/
  },
  {
    id: "shell-path-traversal-encoded",
    description: "URL-encoded path traversal: %2e%2e or %2f variants",
    pattern: /%2e%2e|%2f\.\.|\.\.%2f/i
  },
  {
    id: "shell-null-byte",
    description: "Null byte injection: \\x00 or %00 \u2014 truncates strings in C-backed functions",
    pattern: /\x00|%00/
  },
  {
    id: "shell-semicolon",
    description: "Semicolon command separator: cmd1; cmd2",
    pattern: /;/
  },
  {
    id: "shell-pipe",
    description: "Pipe operator: cmd1 | cmd2",
    pattern: /\|/
  },
  {
    id: "shell-and-operator",
    description: "AND operator: cmd1 && cmd2",
    pattern: /&&/
  },
  {
    id: "shell-or-operator",
    description: "OR operator: cmd1 || cmd2",
    pattern: /\|\|/
  },
  {
    id: "shell-backtick",
    description: "Backtick command substitution: `cmd`",
    pattern: /`/
  },
  {
    id: "shell-dollar-paren",
    description: "Dollar-paren command substitution: $(cmd)",
    pattern: /\$\(/
  },
  {
    id: "shell-dollar-brace",
    description: "Dollar-brace variable expansion: ${var} \u2014 can be abused for injection",
    pattern: /\$\{/
  },
  {
    id: "shell-redirect-out",
    description: "Output redirection: cmd > file or cmd >> file",
    pattern: />{1,2}/
  },
  {
    id: "shell-redirect-in",
    description: "Input redirection: cmd < file",
    pattern: /</
  },
  {
    id: "shell-newline-injection",
    description: "Newline injection: \\n or \\r \u2014 can inject new shell commands",
    pattern: /[\n\r]/
  },
  {
    id: "shell-glob-star",
    description: "Glob expansion: * or ? \u2014 can expand to unintended files",
    // Only flag when combined with path separators to reduce false positives
    pattern: /[/\\][*?]/
  },
  {
    id: "shell-absolute-root",
    description: "Absolute root path injection: string starting with / or \\ (Windows UNC)",
    pattern: /^(?:\/|\\\\)/
  },
  {
    id: "shell-windows-drive",
    description: "Windows drive letter path injection: C:\\ or D:/",
    pattern: /^[a-zA-Z]:[/\\]/
  },
  {
    id: "shell-curl-wget",
    description: "curl/wget with URL or flags \u2014 can exfiltrate data or download payloads",
    // Require a URL scheme (http/https/ftp) or a flag (-) to reduce false positives
    // "curl is a tool" won't match; "curl http://..." or "curl -s ..." will
    pattern: /\b(?:curl|wget)\s+(?:https?:\/\/|ftp:\/\/|-)/i
  }
];
var shell_default = SHELL_PATTERNS;

// node_modules/.pnpm/is-unsafe@2.0.0/node_modules/is-unsafe/src/contexts/redos.js
var REDOS_PATTERNS = [
  {
    id: "redos-nested-quantifier-plus",
    description: "Nested + quantifier inside a group with outer quantifier: (a+)+, (.+b)*, etc.",
    // Matches any group containing a + quantifier, with an outer * or + — catches (a+)+, (.+b)*, etc.
    pattern: /\([^)]*\+[^)]*\)[+*]/
  },
  {
    id: "redos-nested-quantifier-star",
    description: "Nested * quantifier: (a*)* or (a*)+ \u2014 catastrophic backtracking",
    pattern: /\([^)]*\*[^)]*\)[*+]/
  },
  {
    id: "redos-nested-groups",
    description: "Doubly nested quantified groups: ((a+)+) \u2014 guaranteed catastrophic",
    pattern: /\(\([^)]{0,40}\)[+*]\)[+*]/
  },
  {
    id: "redos-alternation-overlap",
    description: "Overlapping alternation under quantifier: (a|a)+ \u2014 ambiguous NFA paths",
    // Detect repeated identical alternatives under a quantifier
    pattern: /\(([^|()]{1,20})\|(?:\1)(?:\|[^|()]{1,20}){0,5}\)[+*?]{1,2}/
  },
  {
    id: "redos-star-plus-concat",
    description: "(x*x)+ pattern \u2014 triggers super-linear backtracking",
    pattern: /\([^)]{0,10}\*[^)]{0,10}\)[+*]/
  },
  {
    id: "redos-dot-star-greedy",
    description: "(.*){n,} or (.+){n,} \u2014 repeated greedy dot quantifiers",
    pattern: /\(\.[*+]\)\{?\d/
  },
  {
    id: "redos-large-repetition",
    description: "Very large fixed or range repetition count {1000,} or {1000,n} \u2014 denial of service via backtracking",
    // Matches { followed by 4+ digits (≥1000), then optional ,digits }
    pattern: /\{\d{4,}(?:,\d*)?\}/
  },
  {
    id: "redos-catastrophic-alternation",
    description: "Long alternation with many similar branches \u2014 polynomial backtracking risk",
    // Heuristic: 10+ pipe-separated alternatives in a single group
    pattern: /\([^)]{0,200}(?:\|[^|)]{0,50}){9,}\)/
  }
];
var redos_default = REDOS_PATTERNS;

// node_modules/.pnpm/is-unsafe@2.0.0/node_modules/is-unsafe/src/contexts/nosql.js
var sep = `["'\\s]*:`;
var NOSQL_PATTERNS = [
  // ─── MongoDB $ operator injection ────────────────────────────────────────
  {
    id: "nosql-where-operator",
    description: "$where \u2014 executes arbitrary JavaScript server-side in MongoDB",
    pattern: new RegExp(`\\$where${sep}`, "i")
  },
  {
    id: "nosql-ne-operator",
    description: '$ne \u2014 "not equal" operator used to bypass equality checks',
    pattern: new RegExp(`\\$ne${sep}`, "i")
  },
  {
    id: "nosql-gt-operator",
    description: '$gt \u2014 "greater than" used to bypass password/value checks',
    pattern: new RegExp(`\\$gte?${sep}`, "i")
  },
  {
    id: "nosql-lt-operator",
    description: '$lt / $lte \u2014 "less than" bypass variants',
    pattern: new RegExp(`\\$lte?${sep}`, "i")
  },
  {
    id: "nosql-regex-operator",
    description: "$regex \u2014 can be used to extract data character by character (blind injection)",
    pattern: new RegExp(`\\$regex${sep}`, "i")
  },
  {
    id: "nosql-or-operator",
    description: "$or \u2014 logical OR; used to create always-true conditions",
    pattern: new RegExp(`\\$or${sep}\\s*\\[`, "i")
  },
  {
    id: "nosql-and-operator",
    description: "$and \u2014 logical AND operator injection",
    pattern: new RegExp(`\\$and${sep}\\s*\\[`, "i")
  },
  {
    id: "nosql-nor-operator",
    description: "$nor \u2014 logical NOR operator injection",
    pattern: new RegExp(`\\$nor${sep}\\s*\\[`, "i")
  },
  {
    id: "nosql-exists-operator",
    description: "$exists \u2014 can enumerate fields to determine schema",
    pattern: new RegExp(`\\$exists${sep}`, "i")
  },
  {
    id: "nosql-in-operator",
    description: "$in \u2014 matches any value in a list; can enumerate values",
    pattern: new RegExp(`\\$in${sep}\\s*\\[`, "i")
  },
  {
    id: "nosql-expr-operator",
    description: "$expr \u2014 allows aggregation expressions in queries (MongoDB 3.6+)",
    pattern: new RegExp(`\\$expr${sep}`, "i")
  },
  {
    id: "nosql-function-operator",
    description: "$function \u2014 executes arbitrary JavaScript in MongoDB 4.4+",
    pattern: new RegExp(`\\$function${sep}`, "i")
  },
  {
    id: "nosql-accumulator-operator",
    description: "$accumulator \u2014 custom aggregation with arbitrary JS execution",
    pattern: new RegExp(`\\$accumulator${sep}`, "i")
  },
  // ─── Prototype pollution ─────────────────────────────────────────────────
  {
    id: "nosql-proto-pollution",
    description: "__proto__ \u2014 prototype pollution via object key injection",
    pattern: /__proto__/
  },
  {
    id: "nosql-constructor-prototype",
    description: "constructor.prototype \u2014 alternative prototype pollution vector (dot notation or JSON key)",
    // Matches dot-notation (obj.constructor.prototype) and JSON key adjacency
    // ("constructor": {"prototype": ...})
    pattern: /constructor[\s"':.,{\[]*prototype/i
  },
  {
    id: "nosql-proto-bracket",
    description: '["__proto__"] \u2014 bracket-notation prototype pollution',
    pattern: /\[["']__proto__["']\]/
  }
];
var nosql_default = NOSQL_PATTERNS;

// node_modules/.pnpm/is-unsafe@2.0.0/node_modules/is-unsafe/src/contexts/log.js
var LOG_PATTERNS = [
  // ─── CRLF / newline injection ─────────────────────────────────────────────
  {
    id: "log-crlf-injection",
    description: "CRLF injection: literal \\r or \\n embeds fake log lines",
    pattern: /[\r\n]/
  },
  {
    id: "log-url-encoded-crlf",
    description: "URL-encoded CRLF: %0d, %0a, %0D, %0A \u2014 decoded by some log parsers",
    pattern: /%0[dDaA]/
  },
  {
    id: "log-unicode-newline",
    description: "Unicode newline variants: U+2028 (line separator), U+2029 (paragraph separator)",
    pattern: /[\u2028\u2029]/
  },
  // ─── Log4Shell / JNDI injection (CVE-2021-44228) ─────────────────────────
  {
    id: "log-log4shell-jndi",
    description: "Log4Shell: ${jndi:...} triggers remote code execution in Apache Log4j",
    pattern: /\$\{jndi\s*:/i
  },
  {
    id: "log-log4shell-obfuscated",
    description: "Obfuscated Log4Shell: ${::-j}... lookup-bypass prefix used to evade WAF detection",
    // ${::- is the Log4j lookup-bypass escape sequence; presence alone is suspicious
    pattern: /\$\{::-/
  },
  {
    id: "log-log4j-lookup",
    description: "Log4j lookup syntax: ${env:...}, ${sys:...}, ${ctx:...} \u2014 data exfiltration",
    pattern: /\$\{(?:env|sys|ctx|main|map|sd|web|docker|k8s|spring)\s*:/i
  },
  // ─── Server-Side Template Injection (SSTI) in log messages ───────────────
  {
    id: "log-ssti-double-brace",
    description: "SSTI double-brace: {{expression}} \u2014 Jinja2, Twig, Handlebars, etc.",
    pattern: /\{\{[\s\S]{0,80}\}\}/
  },
  {
    id: "log-ssti-hash-brace",
    description: "SSTI hash-brace: #{expression} \u2014 Thymeleaf, Velocity, Ruby ERB",
    pattern: /#\{[\s\S]{0,80}\}/
  },
  {
    id: "log-ssti-dollar-brace",
    description: "SSTI/EL injection: ${expression with operators or method calls} \u2014 JSP EL, Freemarker, SpEL",
    // Require that the ${...} content looks like an expression, not a plain variable name.
    // Flags if the content contains: . ( * + operators, or known SSTI keywords.
    // This avoids flagging ${PATH}, ${HOME} etc. (plain shell variables).
    pattern: /\$\{[^}]*(?:\.|\(|\*|\+|\bclass\b|\bruntime\b|\bprocess\b|\bexec\b)[^}]{0,80}\}/i
  },
  {
    id: "log-ssti-percent-tag",
    description: "SSTI ERB/ASP tag: <%= expression %> \u2014 Ruby ERB, ASP",
    pattern: /<%=[\s\S]{0,80}%>/
  },
  // ─── Null byte ────────────────────────────────────────────────────────────
  {
    id: "log-null-byte",
    description: "Null byte: \\x00 or %00 \u2014 can truncate log entries in C-backed loggers",
    pattern: /\x00|%00/
  },
  // ─── ANSI escape injection ────────────────────────────────────────────────
  {
    id: "log-ansi-escape",
    description: "ANSI escape sequence: ESC[ \u2014 can manipulate terminal output when logs are tailed",
    pattern: /\x1b\[/
  }
];
var log_default = LOG_PATTERNS;

// node_modules/.pnpm/is-unsafe@2.0.0/node_modules/is-unsafe/src/contexts/sql-strict.js
var SQL_STRICT_EXTRA = [
  {
    id: "sql-line-comment",
    description: "SQL line comment: -- followed by whitespace or end of string",
    pattern: /--(?:\s|$)/
  },
  {
    id: "sql-stacked-query",
    description: "Stacked queries: semicolon immediately followed by a SQL keyword",
    pattern: /;\s{0,10}(?:SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC)\b/i
  },
  {
    id: "sql-hex-encoding",
    description: "Hex-encoded string injection: 0x41414141 style (MySQL)",
    pattern: /\b0x[0-9a-f]{4,}/i
  }
];
var SQL_STRICT_PATTERNS = [...sql_default, ...SQL_STRICT_EXTRA];
var sql_strict_default = SQL_STRICT_PATTERNS;

// node_modules/.pnpm/is-unsafe@2.0.0/node_modules/is-unsafe/src/index.js
html_default.label = "HTML";
xml_default.label = "XML";
svg_default.label = "SVG";
sql_default.label = "SQL";
sql_strict_default.label = "SQL-STRICT";
shell_default.label = "SHELL";
redos_default.label = "REDOS";
nosql_default.label = "NOSQL";
log_default.label = "LOG";
var VALID_CONTEXTS = Object.freeze({
  HTML: html_default,
  XML: xml_default,
  SVG: svg_default,
  SQL: sql_default,
  "SQL-STRICT": sql_strict_default,
  SHELL: shell_default,
  REDOS: redos_default,
  NOSQL: nosql_default,
  LOG: log_default
});
function assertString(value) {
  if (typeof value !== "string") {
    throw new TypeError(
      `is-unsafe: first argument must be a string, got ${typeof value}`
    );
  }
}
__name(assertString, "assertString");
function assertContext(context) {
  if (context instanceof RegExp) return;
  if (Array.isArray(context)) {
    if (context.length === 0) {
      throw new TypeError("is-unsafe: context must not be an empty array");
    }
    if (Array.isArray(context[0])) {
      for (const list of context) {
        if (!Array.isArray(list) || list.length === 0) {
          throw new TypeError(
            "is-unsafe: each context in the array must be a non-empty pattern array (PatternList)"
          );
        }
      }
    }
    return;
  }
  throw new TypeError(
    `is-unsafe: second argument must be a PatternList (e.g. HTML), an array of PatternLists (e.g. [HTML, XML]), or a RegExp. Got: ${typeof context}`
  );
}
__name(assertContext, "assertContext");
function normalise(context) {
  if (context instanceof RegExp) return { lists: null, regex: context };
  if (Array.isArray(context[0])) return { lists: context, regex: null };
  return { lists: [context], regex: null };
}
__name(normalise, "normalise");
function matchList(value, list) {
  const label = list.label ?? "CUSTOM";
  for (const rule of list) {
    if (rule.pattern.test(value)) {
      return { context: label, id: rule.id, description: rule.description, pattern: rule.pattern };
    }
  }
  return null;
}
__name(matchList, "matchList");
function isUnsafe(value, context) {
  assertString(value);
  assertContext(context);
  const { lists, regex } = normalise(context);
  if (regex) return regex.test(value);
  for (const list of lists) {
    if (matchList(value, list) !== null) return true;
  }
  return false;
}
__name(isUnsafe, "isUnsafe");

// node_modules/.pnpm/fast-xml-parser@5.10.0/node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
function extractRawAttributes(prefixedAttrs, options) {
  if (!prefixedAttrs) return {};
  const attrs = options.attributesGroupName ? prefixedAttrs[options.attributesGroupName] : prefixedAttrs;
  if (!attrs) return {};
  const rawAttrs = {};
  for (const key in attrs) {
    if (key.startsWith(options.attributeNamePrefix)) {
      const rawName = key.substring(options.attributeNamePrefix.length);
      rawAttrs[rawName] = attrs[key];
    } else {
      rawAttrs[key] = attrs[key];
    }
  }
  return rawAttrs;
}
__name(extractRawAttributes, "extractRawAttributes");
function extractNamespace(rawTagName) {
  if (!rawTagName || typeof rawTagName !== "string") return void 0;
  const colonIndex = rawTagName.indexOf(":");
  if (colonIndex !== -1 && colonIndex > 0) {
    const ns = rawTagName.substring(0, colonIndex);
    if (ns !== "xmlns") {
      return ns;
    }
  }
  return void 0;
}
__name(extractNamespace, "extractNamespace");
var OrderedObjParser = class {
  static {
    __name(this, "OrderedObjParser");
  }
  constructor(options, externalEntities) {
    this.options = options;
    this.currentNode = null;
    this.tagsNodeStack = [];
    this.parseXml = parseXml;
    this.parseTextData = parseTextData;
    this.resolveNameSpace = resolveNameSpace;
    this.buildAttributesMap = buildAttributesMap;
    this.isItStopNode = isItStopNode;
    this.replaceEntitiesValue = replaceEntitiesValue;
    this.readStopNodeData = readStopNodeData;
    this.saveTextToParentTag = saveTextToParentTag;
    this.addChild = addChild;
    this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
    this.entityExpansionCount = 0;
    this.currentExpandedLength = 0;
    let namedEntities = { ...XML };
    if (this.options.entityDecoder) {
      this.entityDecoder = this.options.entityDecoder;
    } else {
      if (typeof this.options.htmlEntities === "object") namedEntities = this.options.htmlEntities;
      else if (this.options.htmlEntities === true) namedEntities = { ...COMMON_HTML, ...CURRENCY };
      this.entityDecoder = new EntityDecoder({
        namedEntities: { ...namedEntities, ...externalEntities },
        numericAllowed: this.options.htmlEntities,
        limit: {
          maxTotalExpansions: this.options.processEntities.maxTotalExpansions,
          maxExpandedLength: this.options.processEntities.maxExpandedLength,
          applyLimitsTo: this.options.processEntities.appliesTo
        },
        // onExternalEntity: (name, value) => isUnsafe(value) ? 'block' : 'allow',
        onInputEntity: /* @__PURE__ */ __name((name, value) => (
          //TODO: VALID_CONTEXTS.HTML should be set only if this.options.htmlEntities
          isUnsafe(value, [html_default, xml_default]) ? ENTITY_ACTION.BLOCK : ENTITY_ACTION.ALLOW
        ), "onInputEntity")
        //postCheck: resolved => resolved
      });
    }
    this.matcher = new Matcher();
    this.readonlyMatcher = this.matcher.readOnly();
    this.isCurrentNodeStopNode = false;
    this.stopNodeExpressionsSet = new ExpressionSet();
    const stopNodesOpts = this.options.stopNodes;
    if (stopNodesOpts && stopNodesOpts.length > 0) {
      for (let i2 = 0; i2 < stopNodesOpts.length; i2++) {
        const stopNodeExp = stopNodesOpts[i2];
        if (typeof stopNodeExp === "string") {
          this.stopNodeExpressionsSet.add(new Expression(stopNodeExp));
        } else if (stopNodeExp instanceof Expression) {
          this.stopNodeExpressionsSet.add(stopNodeExp);
        }
      }
      this.stopNodeExpressionsSet.seal();
    }
  }
};
function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
  const options = this.options;
  if (val !== void 0) {
    if (options.trimValues && !dontTrim) {
      val = val.trim();
    }
    if (val.length > 0) {
      if (!escapeEntities) val = this.replaceEntitiesValue(val, tagName, jPath);
      const jPathOrMatcher = options.jPath ? jPath.toString() : jPath;
      const newval = options.tagValueProcessor(tagName, val, jPathOrMatcher, hasAttributes, isLeafNode);
      if (newval === null || newval === void 0) {
        return val;
      } else if (typeof newval !== typeof val || newval !== val) {
        return newval;
      } else if (options.trimValues) {
        return parseValue(val, options.parseTagValue, options.numberParseOptions);
      } else {
        const trimmedVal = val.trim();
        if (trimmedVal === val) {
          return parseValue(val, options.parseTagValue, options.numberParseOptions);
        } else {
          return val;
        }
      }
    }
  }
}
__name(parseTextData, "parseTextData");
function resolveNameSpace(tagname) {
  if (this.options.removeNSPrefix) {
    const tags = tagname.split(":");
    const prefix = tagname.charAt(0) === "/" ? "/" : "";
    if (tags[0] === "xmlns") {
      return "";
    }
    if (tags.length === 2) {
      tagname = prefix + tags[1];
    }
  }
  return tagname;
}
__name(resolveNameSpace, "resolveNameSpace");
var attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
function buildAttributesMap(attrStr, jPath, tagName, force = false) {
  const options = this.options;
  if (force === true || options.ignoreAttributes !== true && typeof attrStr === "string") {
    const matches = getAllMatches(attrStr, attrsRegx);
    const len = matches.length;
    const attrs = {};
    const processedVals = new Array(len);
    let hasRawAttrs = false;
    const rawAttrsForMatcher = {};
    for (let i2 = 0; i2 < len; i2++) {
      const attrName = this.resolveNameSpace(matches[i2][1]);
      const oldVal = matches[i2][4];
      if (attrName.length && oldVal !== void 0) {
        let val = oldVal;
        if (options.trimValues) val = val.trim();
        val = this.replaceEntitiesValue(val, tagName, this.readonlyMatcher);
        processedVals[i2] = val;
        rawAttrsForMatcher[attrName] = val;
        hasRawAttrs = true;
      }
    }
    if (hasRawAttrs && typeof jPath === "object" && jPath.updateCurrent) {
      jPath.updateCurrent(rawAttrsForMatcher);
    }
    const jPathStr = options.jPath ? jPath.toString() : this.readonlyMatcher;
    let hasAttrs = false;
    for (let i2 = 0; i2 < len; i2++) {
      const attrName = this.resolveNameSpace(matches[i2][1]);
      if (this.ignoreAttributesFn(attrName, jPathStr)) continue;
      let aName = options.attributeNamePrefix + attrName;
      if (attrName.length) {
        if (options.transformAttributeName) {
          aName = options.transformAttributeName(aName);
        }
        aName = sanitizeName(aName, options);
        if (matches[i2][4] !== void 0) {
          const oldVal = processedVals[i2];
          const newVal = options.attributeValueProcessor(attrName, oldVal, jPathStr);
          if (newVal === null || newVal === void 0) {
            attrs[aName] = oldVal;
          } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
            attrs[aName] = newVal;
          } else {
            attrs[aName] = parseValue(oldVal, options.parseAttributeValue, options.numberParseOptions);
          }
          hasAttrs = true;
        } else if (options.allowBooleanAttributes) {
          attrs[aName] = true;
          hasAttrs = true;
        }
      }
    }
    if (!hasAttrs) return;
    if (options.attributesGroupName && !options.preserveOrder) {
      const attrCollection = {};
      attrCollection[options.attributesGroupName] = attrs;
      return attrCollection;
    }
    return attrs;
  }
}
__name(buildAttributesMap, "buildAttributesMap");
var parseXml = /* @__PURE__ */ __name(function(xmlData) {
  xmlData = xmlData.replace(/\r\n?/g, "\n");
  const xmlObj = new XmlNode("!xml");
  let currentNode = xmlObj;
  let textData = "";
  this.matcher.reset();
  this.entityDecoder.reset();
  this.entityExpansionCount = 0;
  this.currentExpandedLength = 0;
  const options = this.options;
  const docTypeReader = new DocTypeReader(options.processEntities);
  const xmlLen = xmlData.length;
  for (let i2 = 0; i2 < xmlLen; i2++) {
    const ch = xmlData[i2];
    if (ch === "<") {
      const c1 = xmlData.charCodeAt(i2 + 1);
      if (c1 === 47) {
        const closeIndex = findClosingIndex(xmlData, ">", i2, "Closing Tag is not closed.");
        let tagName = xmlData.substring(i2 + 2, closeIndex).trim();
        if (options.removeNSPrefix) {
          const colonIndex = tagName.indexOf(":");
          if (colonIndex !== -1) {
            tagName = tagName.substr(colonIndex + 1);
          }
        }
        tagName = transformTagName(options.transformTagName, tagName, "", options).tagName;
        if (currentNode) {
          textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
        }
        const lastTagName = this.matcher.getCurrentTag();
        if (tagName && options.unpairedTagsSet.has(tagName)) {
          throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
        }
        if (lastTagName && options.unpairedTagsSet.has(lastTagName)) {
          this.matcher.pop();
          this.tagsNodeStack.pop();
        }
        this.matcher.pop();
        this.isCurrentNodeStopNode = false;
        currentNode = this.tagsNodeStack.pop();
        textData = "";
        i2 = closeIndex;
      } else if (c1 === 63) {
        let tagData = readTagExp(xmlData, i2, false, "?>");
        if (!tagData) throw new Error("Pi Tag is not closed.");
        textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
        const attsMap = this.buildAttributesMap(tagData.tagExp, this.matcher, tagData.tagName, true);
        if (attsMap) {
          const ver = attsMap[this.options.attributeNamePrefix + "version"];
          this.entityDecoder.setXmlVersion(Number(ver) || 1);
          docTypeReader.setXmlVersion(Number(ver) || 1);
        }
        if (options.ignoreDeclaration && tagData.tagName === "?xml" || options.ignorePiTags) {
        } else {
          const childNode = new XmlNode(tagData.tagName);
          childNode.add(options.textNodeName, "");
          if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent && options.ignoreAttributes !== true) {
            childNode[":@"] = attsMap;
          }
          this.addChild(currentNode, childNode, this.readonlyMatcher, i2);
        }
        i2 = tagData.closeIndex + 1;
      } else if (c1 === 33 && xmlData.charCodeAt(i2 + 2) === 45 && xmlData.charCodeAt(i2 + 3) === 45) {
        const endIndex = findClosingIndex(xmlData, "-->", i2 + 4, "Comment is not closed.");
        if (options.commentPropName) {
          const comment = xmlData.substring(i2 + 4, endIndex - 2);
          textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
          currentNode.add(options.commentPropName, [{ [options.textNodeName]: comment }]);
        }
        i2 = endIndex;
      } else if (c1 === 33 && xmlData.charCodeAt(i2 + 2) === 68) {
        const result = docTypeReader.readDocType(xmlData, i2);
        this.entityDecoder.addInputEntities(result.entities);
        i2 = result.i;
      } else if (c1 === 33 && xmlData.charCodeAt(i2 + 2) === 91) {
        const closeIndex = findClosingIndex(xmlData, "]]>", i2, "CDATA is not closed.") - 2;
        const tagExp = xmlData.substring(i2 + 9, closeIndex);
        textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher);
        let val = this.parseTextData(tagExp, currentNode.tagname, this.readonlyMatcher, true, false, true, true);
        if (val == void 0) val = "";
        if (options.cdataPropName) {
          currentNode.add(options.cdataPropName, [{ [options.textNodeName]: tagExp }]);
        } else {
          currentNode.add(options.textNodeName, val);
        }
        i2 = closeIndex + 2;
      } else {
        let result = readTagExp(xmlData, i2, options.removeNSPrefix);
        if (!result) {
          const context = xmlData.substring(Math.max(0, i2 - 50), Math.min(xmlLen, i2 + 50));
          throw new Error(`readTagExp returned undefined at position ${i2}. Context: "${context}"`);
        }
        let tagName = result.tagName;
        const rawTagName = result.rawTagName;
        let tagExp = result.tagExp;
        let attrExpPresent = result.attrExpPresent;
        let closeIndex = result.closeIndex;
        ({ tagName, tagExp } = transformTagName(options.transformTagName, tagName, tagExp, options));
        if (options.strictReservedNames && (tagName === options.commentPropName || tagName === options.cdataPropName || tagName === options.textNodeName || tagName === options.attributesGroupName)) {
          throw new Error(`Invalid tag name: ${tagName}`);
        }
        if (currentNode && textData) {
          if (currentNode.tagname !== "!xml") {
            textData = this.saveTextToParentTag(textData, currentNode, this.readonlyMatcher, false);
          }
        }
        const lastTag = currentNode;
        if (lastTag && options.unpairedTagsSet.has(lastTag.tagname)) {
          currentNode = this.tagsNodeStack.pop();
          this.matcher.pop();
        }
        let isSelfClosing = false;
        if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
          isSelfClosing = true;
          if (tagName[tagName.length - 1] === "/") {
            tagName = tagName.substr(0, tagName.length - 1);
            tagExp = tagName;
          } else {
            tagExp = tagExp.substr(0, tagExp.length - 1);
          }
          attrExpPresent = tagName !== tagExp;
        }
        let prefixedAttrs = null;
        let rawAttrs = {};
        let namespace = void 0;
        namespace = extractNamespace(rawTagName);
        if (tagName !== xmlObj.tagname) {
          this.matcher.push(tagName, {}, namespace);
        }
        if (tagName !== tagExp && attrExpPresent) {
          prefixedAttrs = this.buildAttributesMap(tagExp, this.matcher, tagName);
          if (prefixedAttrs) {
            rawAttrs = extractRawAttributes(prefixedAttrs, options);
          }
        }
        if (tagName !== xmlObj.tagname) {
          this.isCurrentNodeStopNode = this.isItStopNode();
        }
        const startIndex = i2;
        if (this.isCurrentNodeStopNode) {
          let tagContent = "";
          if (isSelfClosing) {
            i2 = result.closeIndex;
          } else if (options.unpairedTagsSet.has(tagName)) {
            i2 = result.closeIndex;
          } else {
            const result2 = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
            if (!result2) throw new Error(`Unexpected end of ${rawTagName}`);
            i2 = result2.i;
            tagContent = result2.tagContent;
          }
          const childNode = new XmlNode(tagName);
          if (prefixedAttrs) {
            childNode[":@"] = prefixedAttrs;
          }
          childNode.add(options.textNodeName, tagContent);
          this.matcher.pop();
          this.isCurrentNodeStopNode = false;
          this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
        } else {
          if (isSelfClosing) {
            ({ tagName, tagExp } = transformTagName(options.transformTagName, tagName, tagExp, options));
            const childNode = new XmlNode(tagName);
            if (prefixedAttrs) {
              childNode[":@"] = prefixedAttrs;
            }
            this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
            this.matcher.pop();
            this.isCurrentNodeStopNode = false;
          } else if (options.unpairedTagsSet.has(tagName)) {
            const childNode = new XmlNode(tagName);
            if (prefixedAttrs) {
              childNode[":@"] = prefixedAttrs;
            }
            this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
            this.matcher.pop();
            this.isCurrentNodeStopNode = false;
            i2 = result.closeIndex;
            continue;
          } else {
            const childNode = new XmlNode(tagName);
            if (this.tagsNodeStack.length > options.maxNestedTags) {
              throw new Error("Maximum nested tags exceeded");
            }
            this.tagsNodeStack.push(currentNode);
            if (prefixedAttrs) {
              childNode[":@"] = prefixedAttrs;
            }
            this.addChild(currentNode, childNode, this.readonlyMatcher, startIndex);
            currentNode = childNode;
          }
          textData = "";
          i2 = closeIndex;
        }
      }
    } else {
      textData += xmlData[i2];
    }
  }
  return xmlObj.child;
}, "parseXml");
function addChild(currentNode, childNode, matcher, startIndex) {
  if (!this.options.captureMetaData) startIndex = void 0;
  const jPathOrMatcher = this.options.jPath ? matcher.toString() : matcher;
  const result = this.options.updateTag(childNode.tagname, jPathOrMatcher, childNode[":@"]);
  if (result === false) {
  } else if (typeof result === "string") {
    childNode.tagname = result;
    currentNode.addChild(childNode, startIndex);
  } else {
    currentNode.addChild(childNode, startIndex);
  }
}
__name(addChild, "addChild");
function replaceEntitiesValue(val, tagName, jPath) {
  const entityConfig = this.options.processEntities;
  if (!entityConfig || !entityConfig.enabled) {
    return val;
  }
  if (entityConfig.allowedTags) {
    const jPathOrMatcher = this.options.jPath ? jPath.toString() : jPath;
    const allowed = Array.isArray(entityConfig.allowedTags) ? entityConfig.allowedTags.includes(tagName) : entityConfig.allowedTags(tagName, jPathOrMatcher);
    if (!allowed) {
      return val;
    }
  }
  if (entityConfig.tagFilter) {
    const jPathOrMatcher = this.options.jPath ? jPath.toString() : jPath;
    if (!entityConfig.tagFilter(tagName, jPathOrMatcher)) {
      return val;
    }
  }
  return this.entityDecoder.decode(val);
}
__name(replaceEntitiesValue, "replaceEntitiesValue");
function saveTextToParentTag(textData, parentNode, matcher, isLeafNode) {
  if (textData) {
    if (isLeafNode === void 0) isLeafNode = parentNode.child.length === 0;
    textData = this.parseTextData(
      textData,
      parentNode.tagname,
      matcher,
      false,
      parentNode[":@"] ? Object.keys(parentNode[":@"]).length !== 0 : false,
      isLeafNode
    );
    if (textData !== void 0 && textData !== "")
      parentNode.add(this.options.textNodeName, textData);
    textData = "";
  }
  return textData;
}
__name(saveTextToParentTag, "saveTextToParentTag");
function isItStopNode() {
  if (this.stopNodeExpressionsSet.size === 0) return false;
  return this.matcher.matchesAny(this.stopNodeExpressionsSet);
}
__name(isItStopNode, "isItStopNode");
function tagExpWithClosingIndex(xmlData, i2, closingChar = ">") {
  let attrBoundary = 0;
  const len = xmlData.length;
  const closeCode0 = closingChar.charCodeAt(0);
  const closeCode1 = closingChar.length > 1 ? closingChar.charCodeAt(1) : -1;
  let result = "";
  let segmentStart = i2;
  for (let index = i2; index < len; index++) {
    const code = xmlData.charCodeAt(index);
    if (attrBoundary) {
      if (code === attrBoundary) attrBoundary = 0;
    } else if (code === 34 || code === 39) {
      attrBoundary = code;
    } else if (code === closeCode0) {
      if (closeCode1 !== -1) {
        if (xmlData.charCodeAt(index + 1) === closeCode1) {
          result += xmlData.substring(segmentStart, index);
          return { data: result, index };
        }
      } else {
        result += xmlData.substring(segmentStart, index);
        return { data: result, index };
      }
    } else if (code === 9 && !attrBoundary) {
      result += xmlData.substring(segmentStart, index) + " ";
      segmentStart = index + 1;
    }
  }
}
__name(tagExpWithClosingIndex, "tagExpWithClosingIndex");
function findClosingIndex(xmlData, str, i2, errMsg) {
  const closingIndex = xmlData.indexOf(str, i2);
  if (closingIndex === -1) {
    throw new Error(errMsg);
  } else {
    return closingIndex + str.length - 1;
  }
}
__name(findClosingIndex, "findClosingIndex");
function findClosingChar(xmlData, char, i2, errMsg) {
  const closingIndex = xmlData.indexOf(char, i2);
  if (closingIndex === -1) throw new Error(errMsg);
  return closingIndex;
}
__name(findClosingChar, "findClosingChar");
function readTagExp(xmlData, i2, removeNSPrefix, closingChar = ">") {
  const result = tagExpWithClosingIndex(xmlData, i2 + 1, closingChar);
  if (!result) return;
  let tagExp = result.data;
  const closeIndex = result.index;
  const separatorIndex = tagExp.search(/\s/);
  let tagName = tagExp;
  let attrExpPresent = true;
  if (separatorIndex !== -1) {
    tagName = tagExp.substring(0, separatorIndex);
    tagExp = tagExp.substring(separatorIndex + 1).trimStart();
  }
  const rawTagName = tagName;
  if (removeNSPrefix) {
    const colonIndex = tagName.indexOf(":");
    if (colonIndex !== -1) {
      tagName = tagName.substr(colonIndex + 1);
      attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
    }
  }
  return {
    tagName,
    tagExp,
    closeIndex,
    attrExpPresent,
    rawTagName
  };
}
__name(readTagExp, "readTagExp");
function readStopNodeData(xmlData, tagName, i2) {
  const startIndex = i2;
  let openTagCount = 1;
  const xmllen = xmlData.length;
  for (; i2 < xmllen; i2++) {
    if (xmlData[i2] === "<") {
      const c1 = xmlData.charCodeAt(i2 + 1);
      if (c1 === 47) {
        const closeIndex = findClosingChar(xmlData, ">", i2, `${tagName} is not closed`);
        let closeTagName = xmlData.substring(i2 + 2, closeIndex).trim();
        if (closeTagName === tagName) {
          openTagCount--;
          if (openTagCount === 0) {
            return {
              tagContent: xmlData.substring(startIndex, i2),
              i: closeIndex
            };
          }
        }
        i2 = closeIndex;
      } else if (c1 === 63) {
        const closeIndex = findClosingIndex(xmlData, "?>", i2 + 1, "StopNode is not closed.");
        i2 = closeIndex;
      } else if (c1 === 33 && xmlData.charCodeAt(i2 + 2) === 45 && xmlData.charCodeAt(i2 + 3) === 45) {
        const closeIndex = findClosingIndex(xmlData, "-->", i2 + 3, "StopNode is not closed.");
        i2 = closeIndex;
      } else if (c1 === 33 && xmlData.charCodeAt(i2 + 2) === 91) {
        const closeIndex = findClosingIndex(xmlData, "]]>", i2, "StopNode is not closed.") - 2;
        i2 = closeIndex;
      } else {
        const tagData = readTagExp(xmlData, i2, false);
        if (tagData) {
          const openTagName = tagData && tagData.tagName;
          if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
            openTagCount++;
          }
          i2 = tagData.closeIndex;
        }
      }
    }
  }
}
__name(readStopNodeData, "readStopNodeData");
function parseValue(val, shouldParse, options) {
  if (shouldParse && typeof val === "string") {
    const newval = val.trim();
    if (newval === "true") return true;
    else if (newval === "false") return false;
    else return toNumber(val, options);
  } else {
    if (isExist(val)) {
      return val;
    } else {
      return "";
    }
  }
}
__name(parseValue, "parseValue");
function transformTagName(fn, tagName, tagExp, options) {
  if (fn) {
    const newTagName = fn(tagName);
    if (tagExp === tagName) {
      tagExp = newTagName;
    }
    tagName = newTagName;
  }
  tagName = sanitizeName(tagName, options);
  return { tagName, tagExp };
}
__name(transformTagName, "transformTagName");
function sanitizeName(name, options) {
  if (criticalProperties.includes(name)) {
    throw new Error(`[SECURITY] Invalid name: "${name}" is a reserved JavaScript keyword that could cause prototype pollution`);
  } else if (DANGEROUS_PROPERTY_NAMES.includes(name)) {
    return options.onDangerousProperty(name);
  }
  return name;
}
__name(sanitizeName, "sanitizeName");

// node_modules/.pnpm/fast-xml-parser@5.10.0/node_modules/fast-xml-parser/src/xmlparser/node2json.js
var METADATA_SYMBOL2 = XmlNode.getMetaDataSymbol();
function stripAttributePrefix(attrs, prefix) {
  if (!attrs || typeof attrs !== "object") return {};
  if (!prefix) return attrs;
  const rawAttrs = {};
  for (const key in attrs) {
    if (key.startsWith(prefix)) {
      const rawName = key.substring(prefix.length);
      rawAttrs[rawName] = attrs[key];
    } else {
      rawAttrs[key] = attrs[key];
    }
  }
  return rawAttrs;
}
__name(stripAttributePrefix, "stripAttributePrefix");
function prettify(node, options, matcher, readonlyMatcher) {
  return compress(node, options, matcher, readonlyMatcher);
}
__name(prettify, "prettify");
function compress(arr, options, matcher, readonlyMatcher) {
  let text;
  const compressedObj = {};
  for (let i2 = 0; i2 < arr.length; i2++) {
    const tagObj = arr[i2];
    const property = propName(tagObj);
    if (property !== void 0 && property !== options.textNodeName) {
      const rawAttrs = stripAttributePrefix(
        tagObj[":@"] || {},
        options.attributeNamePrefix
      );
      matcher.push(property, rawAttrs);
    }
    if (property === options.textNodeName) {
      if (text === void 0) text = tagObj[property];
      else text += "" + tagObj[property];
    } else if (property === void 0) {
      continue;
    } else if (tagObj[property]) {
      let val = compress(tagObj[property], options, matcher, readonlyMatcher);
      const isLeaf = isLeafTag(val, options);
      if (Object.keys(val).length === 0 && options.alwaysCreateTextNode) {
        val[options.textNodeName] = "";
      }
      if (tagObj[":@"]) {
        assignAttributes(val, tagObj[":@"], readonlyMatcher, options);
      } else if (Object.keys(val).length === 1 && val[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
        val = val[options.textNodeName];
      } else if (Object.keys(val).length === 0) {
        if (options.alwaysCreateTextNode) val[options.textNodeName] = "";
        else val = "";
      }
      if (tagObj[METADATA_SYMBOL2] !== void 0 && typeof val === "object" && val !== null) {
        val[METADATA_SYMBOL2] = tagObj[METADATA_SYMBOL2];
      }
      if (compressedObj[property] !== void 0 && Object.prototype.hasOwnProperty.call(compressedObj, property)) {
        if (!Array.isArray(compressedObj[property])) {
          compressedObj[property] = [compressedObj[property]];
        }
        compressedObj[property].push(val);
      } else {
        const jPathOrMatcher = options.jPath ? readonlyMatcher.toString() : readonlyMatcher;
        if (options.isArray(property, jPathOrMatcher, isLeaf)) {
          compressedObj[property] = [val];
        } else {
          compressedObj[property] = val;
        }
      }
      if (property !== void 0 && property !== options.textNodeName) {
        matcher.pop();
      }
    }
  }
  if (typeof text === "string") {
    if (text.length > 0) compressedObj[options.textNodeName] = text;
  } else if (text !== void 0) compressedObj[options.textNodeName] = text;
  return compressedObj;
}
__name(compress, "compress");
function propName(obj) {
  const keys = Object.keys(obj);
  for (let i2 = 0; i2 < keys.length; i2++) {
    const key = keys[i2];
    if (key !== ":@") return key;
  }
}
__name(propName, "propName");
function assignAttributes(obj, attrMap, readonlyMatcher, options) {
  if (attrMap) {
    const keys = Object.keys(attrMap);
    const len = keys.length;
    for (let i2 = 0; i2 < len; i2++) {
      const atrrName = keys[i2];
      const rawAttrName = atrrName.startsWith(options.attributeNamePrefix) ? atrrName.substring(options.attributeNamePrefix.length) : atrrName;
      const jPathOrMatcher = options.jPath ? readonlyMatcher.toString() + "." + rawAttrName : readonlyMatcher;
      if (options.isArray(atrrName, jPathOrMatcher, true, true)) {
        obj[atrrName] = [attrMap[atrrName]];
      } else {
        obj[atrrName] = attrMap[atrrName];
      }
    }
  }
}
__name(assignAttributes, "assignAttributes");
function isLeafTag(obj, options) {
  const { textNodeName } = options;
  const propCount = Object.keys(obj).length;
  if (propCount === 0) {
    return true;
  }
  if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
    return true;
  }
  return false;
}
__name(isLeafTag, "isLeafTag");

// node_modules/.pnpm/fast-xml-parser@5.10.0/node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
var XMLParser = class {
  static {
    __name(this, "XMLParser");
  }
  constructor(options) {
    this.externalEntities = {};
    this.options = buildOptions(options);
  }
  /**
   * Parse XML dats to JS object
   * @param {string|Uint8Array} xmlData
   * @param {boolean|Object} validationOption
   */
  parse(xmlData, validationOption) {
    if (typeof xmlData !== "string" && xmlData.toString) {
      xmlData = xmlData.toString();
    } else if (typeof xmlData !== "string") {
      throw new Error("XML data is accepted in String or Bytes[] form.");
    }
    if (validationOption) {
      if (validationOption === true) validationOption = {};
      const result = validate(xmlData, validationOption);
      if (result !== true) {
        throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
      }
    }
    const orderedObjParser = new OrderedObjParser(this.options, this.externalEntities);
    const orderedResult = orderedObjParser.parseXml(xmlData);
    if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
    else return prettify(orderedResult, this.options, orderedObjParser.matcher, orderedObjParser.readonlyMatcher);
  }
  /**
   * Add Entity which is not by default supported by this library
   * @param {string} key
   * @param {string} value
   */
  addEntity(key, value) {
    if (value.indexOf("&") !== -1) {
      throw new Error("Entity value can't have '&'");
    } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
      throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
    } else if (value === "&") {
      throw new Error("An entity with value '&' is not permitted");
    } else {
      this.externalEntities[key] = value;
    }
  }
  /**
   * Returns a Symbol that can be used to access the metadata
   * property on a node.
   *
   * If Symbol is not available in the environment, an ordinary property is used
   * and the name of the property is here returned.
   *
   * The XMLMetaData property is only present when `captureMetaData`
   * is true in the options.
   */
  static getMetaDataSymbol() {
    return XmlNode.getMetaDataSymbol();
  }
};

// src/alerts.ts
var ALERTS_SITEMAP_URL = "https://myrapid.com.my/post-sitemap1.xml";
var ALERTS_KV_KEY = "alerts:recent";
var ALERTS_CACHE_TTL_MS = 5 * 60 * 1e3;
var DEFAULT_ALERT_LIMIT = 20;
async function fetchAlerts() {
  let xml = "";
  try {
    const res = await fetch(ALERTS_SITEMAP_URL, {
      headers: {
        "User-Agent": "bus-watch/1.0 (+https://github.com/mingng18/bus-watch)"
      },
      cf: { cacheTtl: 60 },
      signal: AbortSignal.timeout(5e3)
    });
    if (!res.ok) {
      console.error(`alerts: sitemap fetch failed (HTTP ${res.status})`);
      return [];
    }
    xml = await res.text();
  } catch (err2) {
    console.error("alerts: sitemap fetch threw:", err2?.message || err2);
    return [];
  }
  return parseAlerts(xml);
}
__name(fetchAlerts, "fetchAlerts");
async function getCachedAlerts(env) {
  const cached = await env.KV.get(ALERTS_KV_KEY, "json");
  if (cached && Date.now() - cached.ts < ALERTS_CACHE_TTL_MS) {
    return cached.alerts;
  }
  const alerts = await fetchAlerts();
  if (alerts.length > 0) {
    try {
      await env.KV.put(
        ALERTS_KV_KEY,
        JSON.stringify({ ts: Date.now(), alerts })
      );
    } catch (err2) {
      console.error("alerts: KV put failed:", err2?.message || err2);
    }
    return alerts;
  }
  return cached?.alerts ?? [];
}
__name(getCachedAlerts, "getCachedAlerts");
function parseAlerts(xml) {
  const entries = extractUrlEntries(xml);
  const alerts = [];
  for (const entry of entries) {
    const alert = classifyEntry(entry);
    if (alert) alerts.push(alert);
  }
  alerts.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.id < b.id ? -1 : 1;
  });
  return alerts;
}
__name(parseAlerts, "parseAlerts");
function extractUrlEntries(xml) {
  const entries = [];
  const parser = new XMLParser({
    ignoreAttributes: true,
    isArray: /* @__PURE__ */ __name((name) => name === "url", "isArray")
  });
  let parsedData;
  try {
    parsedData = parser.parse(xml);
  } catch (err2) {
    return entries;
  }
  const urls = parsedData?.urlset?.url;
  if (!Array.isArray(urls)) return entries;
  for (const u of urls) {
    if (!u || typeof u.loc !== "string") continue;
    const loc = u.loc.trim();
    if (!loc) continue;
    const lastmod = typeof u.lastmod === "string" ? u.lastmod.trim() : null;
    entries.push({ loc, lastmod });
  }
  return entries;
}
__name(extractUrlEntries, "extractUrlEntries");
var NON_DISRUPTION_SLUGS = [
  "malaysian-philharmonic",
  "mrt-"
  // promotional MRT texts, not disruption notices
];
function classifyEntry(entry) {
  const loc = entry.loc;
  const slug = loc.replace(/\/+$/, "").split("/").pop() ?? "";
  if (!slug) return null;
  if (loc === "https://myrapid.com.my/" || loc === "https://myrapid.com.my")
    return null;
  for (const skip of NON_DISRUPTION_SLUGS) {
    if (slug.startsWith(skip)) return null;
  }
  const parsed = parseSlug(slug);
  if (!parsed) return null;
  const lastmod = entry.lastmod ? normalizeDate(entry.lastmod) : null;
  return {
    id: slug,
    title: parsed.title,
    summary: parsed.summary,
    date: lastmod ?? (/* @__PURE__ */ new Date(0)).toISOString(),
    affectedLines: parsed.affectedLines,
    severity: parsed.severity,
    url: loc
  };
}
__name(classifyEntry, "classifyEntry");
function parseSlug(slug) {
  const base = slug.replace(/-\d+$/, "");
  const tokens = base.split("-");
  if (base.startsWith("info-penutupan-jalan-laluan-")) {
    const routes = extractRoutes(tokens);
    const title = routes.length ? `Road closure \u2014 routes ${routes.join(", ")}` : "Road closure";
    return { title, summary: title, affectedLines: routes, severity: "severe" };
  }
  if (base.startsWith("info-gangguan-trafik-laluan-")) {
    const routes = extractRoutes(tokens);
    const title = routes.length ? `Traffic disruption \u2014 routes ${routes.join(", ")}` : "Traffic disruption";
    return {
      title,
      summary: title,
      affectedLines: routes,
      severity: "warning"
    };
  }
  if (/^kelewatan-bas-\d+-laluan-terjejas$/.test(base)) {
    const n = tokens[tokens.indexOf("bas") + 1];
    const title = `Bus delay \u2014 ${n} route(s) affected`;
    return { title, summary: title, affectedLines: [], severity: "warning" };
  }
  if (base.startsWith("kelewatan-tren-laluan-")) {
    const line = lineName(tokens.slice(tokens.indexOf("laluan") + 1).join(" "));
    const title = line ? `Train delay \u2014 ${line} line` : "Train delay";
    return {
      title,
      summary: title,
      affectedLines: line ? [line] : [],
      severity: "warning"
    };
  }
  if (base.startsWith("perkhidmatan-pulih-laluan-")) {
    const line = lineName(tokens.slice(tokens.indexOf("laluan") + 1).join(" "));
    const title = line ? `Service restored \u2014 ${line} line` : "Service restored";
    return {
      title,
      summary: title,
      affectedLines: line ? [line] : [],
      severity: "info"
    };
  }
  if (base.startsWith("kemas-kini-kekerapan-laluan-")) {
    const line = lineName(tokens.slice(tokens.indexOf("laluan") + 1).join(" "));
    const title = line ? `Frequency update \u2014 ${line} line` : "Frequency update";
    return {
      title,
      summary: title,
      affectedLines: line ? [line] : [],
      severity: "info"
    };
  }
  if (base.startsWith("kemas-kini-laluan-")) {
    const line = lineName(tokens.slice(tokens.indexOf("laluan") + 1).join(" "));
    const title = line ? `Line update \u2014 ${line} line` : "Line update";
    return {
      title,
      summary: title,
      affectedLines: line ? [line] : [],
      severity: "info"
    };
  }
  return null;
}
__name(parseSlug, "parseSlug");
function extractRoutes(tokens) {
  const idx = tokens.indexOf("laluan");
  if (idx === -1) return [];
  return tokens.slice(idx + 1).filter(Boolean);
}
__name(extractRoutes, "extractRoutes");
function lineName(raw2) {
  if (!raw2) return null;
  return raw2.split(/\s+/).filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
__name(lineName, "lineName");
function normalizeDate(lastmod) {
  const d = new Date(lastmod);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}
__name(normalizeDate, "normalizeDate");

// src/index.ts
var SELANGOR_AGENCIES = ["selangor-mobility"];
var REALTIME_AGENCIES = ["rapid-bus-kl", "rapid-bus-mrtfeeder"];
var AGENCIES = [...REALTIME_AGENCIES, ...SELANGOR_AGENCIES];
var app = new Hono2();
app.use("*", secureHeaders());
app.use("*", cors({ origin: /* @__PURE__ */ __name((origin, c) => c.env.FRONTEND_URL ?? null, "origin") }));
app.use("*", async (c, next) => {
  if (c.req.path.length > 256) {
    return c.json({ error: "URI path too long" }, 414);
  }
  const queries = c.req.query();
  for (const key in queries) {
    if (queries[key] && queries[key].length > 100) {
      return c.json({ error: `Parameter ${key} is too long` }, 400);
    }
  }
  await next();
});
app.onError((err2, c) => {
  console.error("Unhandled application error:", err2);
  return c.json({ error: "Internal Server Error" }, 500);
});
app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});
app.get("/", (c) => c.json({ status: "ok", service: "bus-watch" }));
function validateLatLon(lat, lon) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return "lat and lon must be finite numbers";
  }
  if (lat < -90 || lat > 90) return "lat must be in [-90, 90]";
  if (lon < -180 || lon > 180) return "lon must be in [-180, 180]";
  return null;
}
__name(validateLatLon, "validateLatLon");
app.post("/refresh", async (c) => {
  const authHeader = c.req.header("Authorization");
  const expectedToken = `Bearer ${c.env.ADMIN_TOKEN}`;
  if (!c.env.ADMIN_TOKEN || !authHeader) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const compareStr = authHeader.length === expectedToken.length ? authHeader : expectedToken;
  const isMatch = await timingSafeEqual(compareStr, expectedToken) && authHeader.length === expectedToken.length;
  if (!isMatch) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await refreshStaticData(c.env.KV);
  return c.json({ status: "refreshed" });
});
app.get("/nearby", async (c) => {
  const lat = parseFloat(c.req.query("lat") || "");
  const lon = parseFloat(c.req.query("lon") || "");
  let radius = parseInt(c.req.query("radius") || "500", 10);
  if (!Number.isFinite(radius) || radius < 0) radius = 500;
  if (radius > 1e4) radius = 1e4;
  const coordErr = validateLatLon(lat, lon);
  if (coordErr) return c.json({ error: coordErr }, 400);
  const allStops = await getAllStops(c.env.KV);
  const allRoutes = await getAllRoutes(c.env.KV);
  const allTrips = await getAllTrips(c.env.KV);
  const { map: routeMap } = await getRoutesMaps(c.env.KV);
  const { tripMap, routeTripMap } = await getTripsMaps(c.env.KV);
  const allTripStops = await getAllTripStops(c.env.KV);
  const allCalendar = await getAllCalendar(c.env.KV);
  const allFrequencies = await getAllFrequencies(c.env.KV);
  const vehicles = await getRealtimeVehicles(c.env.KV);
  const result = findNearbyStops({
    stops: allStops,
    routes: allRoutes,
    trips: allTrips,
    tripStops: allTripStops,
    calendar: allCalendar,
    frequencies: allFrequencies,
    vehicles,
    lat,
    lon,
    radiusM: radius,
    routeMap,
    tripMap
  });
  const busRoutes = findNearbyBusRoutes(allRoutes, allTrips, vehicles, lat, lon, 1e3, routeMap, tripMap);
  const { buses: prasaranaBuses } = await getPrasaranaBuses(c.env.KV);
  const prasaranaNearby = findNearbyPrasaranaBuses(prasaranaBuses, allRoutes, allTrips, lat, lon, Math.max(radius, 1e3), routeTripMap);
  const mergedBusRoutes = mergeBusRoutes(busRoutes, prasaranaNearby);
  const queries = [];
  const seenQueries = /* @__PURE__ */ new Set();
  for (const stop of result) {
    if (stop.type === "bus") {
      for (const arrival of stop.arrivals) {
        if (arrival.route) {
          const key = `${arrival.route}-${stop.id}`;
          if (!seenQueries.has(key)) {
            seenQueries.add(key);
            queries.push({ route: arrival.route, stopId: stop.id });
          }
        }
      }
    }
  }
  if (queries.length > 0) {
    const etas = await getBatchedHistoricalETAs(c.env.DB, queries);
    for (const stop of result) {
      if (stop.type === "bus") {
        for (const arrival of stop.arrivals) {
          if (arrival.route) {
            const key = `${arrival.route}-${stop.id}`;
            const eta = etas.get(key);
            if (eta) {
              if (eta.confidence !== "low") {
                arrival.minutes = Math.round(eta.minutes);
              }
              arrival.confidence = eta.confidence;
              arrival.uncertainty_minutes = Math.round(eta.uncertaintyMinutes);
              arrival.eta_source = "scheduled";
            }
          }
        }
      }
    }
  }
  return c.json({ stops: result, busRoutes: mergedBusRoutes });
});
app.get("/bus/trip/:tripId/progress", async (c) => {
  const tripId = c.req.param("tripId");
  try {
    const allRoutes = await getAllRoutes(c.env.KV);
    const vehicles = await getRealtimeVehicles(c.env.KV);
    let vehicle = null;
    for (let i2 = 0, len = vehicles.length; i2 < len; i2++) {
      if (vehicles[i2].tripId === tripId) {
        vehicle = vehicles[i2];
        break;
      }
    }
    const allTripStops = await getAllTripStops(c.env.KV);
    const routeMap = /* @__PURE__ */ new Map();
    for (const r of allRoutes) routeMap.set(r.id, r);
    const result = getBusTripProgress(tripId, routeMap, allTripStops, vehicle);
    return c.json(result);
  } catch (err2) {
    return c.json({ error: "Trip not found" }, 404);
  }
});
app.get("/bus/eta", async (c) => {
  const tripId = c.req.query("tripId");
  const busNo = c.req.query("bus_no");
  const stopId = c.req.query("stopId");
  if (!stopId || !tripId && !busNo) return c.json({ error: "Missing params" }, 400);
  try {
    let route = null;
    let busLat = null;
    let busLon = null;
    let routeIdForSeq = null;
    if (busNo) {
      const { buses } = await getPrasaranaBuses(c.env.KV);
      let bus;
      for (let i2 = 0, len = buses.length; i2 < len; i2++) {
        if (buses[i2].bus_no === busNo) {
          bus = buses[i2];
          break;
        }
      }
      if (bus) {
        route = bus.route;
        busLat = bus.latitude;
        busLon = bus.longitude;
      }
    } else if (tripId) {
      const vehicles = await getRealtimeVehicles(c.env.KV);
      let vehicle;
      for (let i2 = 0, len = vehicles.length; i2 < len; i2++) {
        if (vehicles[i2].tripId === tripId) {
          vehicle = vehicles[i2];
          break;
        }
      }
      if (vehicle) {
        route = vehicle.routeId;
        routeIdForSeq = vehicle.routeId;
        busLat = vehicle.lat;
        busLon = vehicle.lon;
      }
    }
    if (!route) {
      return c.json({ eta_minutes: 5, source: "heuristic", is_live: false });
    }
    let fromStopId = null;
    if (busLat !== null && busLon !== null) {
      const [allTrips, allTripStops, allRoutes] = await Promise.all([
        getAllTrips(c.env.KV),
        getAllTripStops(c.env.KV),
        getAllRoutes(c.env.KV)
      ]);
      const seqs = canonicalStopSequencesByRoute(allTrips, allTripStops);
      let stops = routeIdForSeq ? seqs.get(routeIdForSeq) : void 0;
      if (!stops) {
        const { shortNameMap } = await getRoutesMaps(c.env.KV);
        const r = shortNameMap.get(route);
        if (r) stops = seqs.get(r.id);
      }
      if (stops) {
        const fromStop = nearestFromStopOnRoute(busLat, busLon, stops);
        if (fromStop) fromStopId = fromStop.stopId;
      }
    }
    if (fromStopId) {
      const eta = await getHistoricalETA(c.env.DB, route, fromStopId, stopId);
      if (eta) {
        return c.json({
          eta_minutes: Math.round(eta.minutes),
          // Uncertainty window + confidence so the client can render an honest
          // "≈5 min" qualifier (issue #133).
          uncertainty_minutes: Math.round(eta.uncertaintyMinutes),
          confidence: eta.confidence,
          is_live: eta.isLive,
          sample_count: eta.sampleCount,
          source: "historical"
        });
      }
    }
    return c.json({ eta_minutes: 5, source: "heuristic", is_live: false });
  } catch (err2) {
    console.error("Error fetching ETA:", err2);
    return c.json({ error: "Internal server error" }, 500);
  }
});
app.get("/bus/position/:busId", async (c) => {
  const busId = c.req.param("busId");
  const { buses } = await getPrasaranaBuses(c.env.KV);
  let bus;
  for (let i2 = 0, len = buses.length; i2 < len; i2++) {
    if (buses[i2].bus_no === busId) {
      bus = buses[i2];
      break;
    }
  }
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
  try {
    const allStops = await getAllStops(c.env.KV);
    const allRoutes = await getAllRoutes(c.env.KV);
    const allTrips = await getAllTrips(c.env.KV);
    const allTripStops = await getAllTripStops(c.env.KV);
    const allCalendar = await getAllCalendar(c.env.KV);
    const allFrequencies = await getAllFrequencies(c.env.KV);
    const result = getStationSchedule(stopId, allStops, allRoutes, allTrips, allTripStops, allCalendar);
    return c.json(result);
  } catch (err2) {
    return c.json({ error: "Station not found" }, 404);
  }
});
app.get("/station/:stopId/schedule/toward", async (c) => {
  const stopId = c.req.param("stopId");
  const destinationStopId = c.req.query("destinationStopId");
  if (!destinationStopId) return c.json({ error: "destinationStopId is required" }, 400);
  const parsed = parseInt(c.req.query("limit") || "5", 10);
  const limit = Math.min(Math.max(Number.isFinite(parsed) ? parsed : 5, 1), 50);
  try {
    const allStops = await getAllStops(c.env.KV);
    const allRoutes = await getAllRoutes(c.env.KV);
    const allTrips = await getAllTrips(c.env.KV);
    const allTripStops = await getAllTripStops(c.env.KV);
    const allCalendar = await getAllCalendar(c.env.KV);
    const result = getDeparturesTowardDestination(
      stopId,
      destinationStopId,
      allStops,
      allRoutes,
      allTrips,
      allTripStops,
      allCalendar,
      limit
    );
    return c.json(result);
  } catch (err2) {
    return c.json({ error: "Station not found" }, 404);
  }
});
app.get("/rail/stops", async (c) => {
  const q = c.req.query("q");
  if (!q || q.trim().length < 2 || q.trim().length > 50) {
    return c.json({ error: "q must be between 2 and 50 characters" }, 400);
  }
  const stops = await searchRailStops(c.env, q.trim());
  return c.json({ stops });
});
app.get("/rail/schedule", async (c) => {
  const stationId = c.req.query("station_id");
  if (!stationId) return c.json({ error: "station_id is required" }, 400);
  const parsed = parseInt(c.req.query("window") || "120", 10);
  const window2 = Math.min(Math.max(Number.isFinite(parsed) ? parsed : 120, 1), 1440);
  const result = await getRailSchedule(c.env, stationId, window2);
  if (!result) return c.json({ error: "Station not found" }, 404);
  return c.json(result);
});
app.post("/rail/ingest", async (c) => {
  const authHeader = c.req.header("Authorization");
  const expectedToken = `Bearer ${c.env.ADMIN_TOKEN}`;
  if (!c.env.ADMIN_TOKEN || !authHeader) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const compareStr = authHeader.length === expectedToken.length ? authHeader : expectedToken;
  const isMatch = await timingSafeEqual(compareStr, expectedToken) && authHeader.length === expectedToken.length;
  if (!isMatch) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  try {
    const result = await ingestRailTimetables(c.env);
    return c.json({ status: "ok", inserted: result.inserted });
  } catch (err2) {
    return c.json({ status: "error", message: "Internal Server Error" }, 500);
  }
});
app.get("/routes", async (c) => {
  const lat = parseFloat(c.req.query("lat") || "");
  const lon = parseFloat(c.req.query("lon") || "");
  let radius = parseInt(c.req.query("radius") || "500", 10);
  if (!Number.isFinite(radius) || radius < 0) radius = 500;
  if (radius > 1e4) radius = 1e4;
  const coordErr = validateLatLon(lat, lon);
  if (coordErr) return c.json({ error: coordErr }, 400);
  const allStops = await getAllStops(c.env.KV);
  const allRoutes = await getAllRoutes(c.env.KV);
  const allTrips = await getAllTrips(c.env.KV);
  const allTripStops = await getAllTripStops(c.env.KV);
  const result = findNearbyRoutes(allStops, allRoutes, allTrips, allTripStops, lat, lon, radius);
  return c.json({ routes: result });
});
app.get("/alerts", async (c) => {
  const parsed = parseInt(c.req.query("limit") || "", 10);
  const limit = Math.min(Math.max(Number.isFinite(parsed) ? parsed : DEFAULT_ALERT_LIMIT, 1), 100);
  try {
    const all = await getCachedAlerts(c.env);
    const alerts = all.slice(0, limit);
    return c.json({ alerts });
  } catch (err2) {
    console.error("Error fetching alerts:", err2?.message || err2);
    return c.json({ alerts: [] });
  }
});
app.get("/route/:routeId", async (c) => {
  const routeId = c.req.param("routeId");
  const allRoutes = await getAllRoutes(c.env.KV);
  const { map, shortNameMap } = await getRoutesMaps(c.env.KV);
  let route = map.get(routeId) || shortNameMap.get(routeId);
  const { buses: prasaranaBuses } = await getPrasaranaBuses(c.env.KV);
  if (!route) {
    const hasPrasarana = prasaranaBuses.some((b) => b.route === routeId || b.route === routeId + "0");
    if (!hasPrasarana) return c.json({ error: "Route not found" }, 404);
    route = { id: routeId, shortName: routeId, longName: "", type: 3 };
  }
  const vehicles = await getRealtimeVehicles(c.env.KV);
  const gtfsBuses = [];
  const routeShortName = route.shortName || route.longName || "";
  const tgtRouteId = route.id;
  for (let i2 = 0, len = vehicles.length; i2 < len; i2++) {
    const v = vehicles[i2];
    if (v.routeId === tgtRouteId) {
      gtfsBuses.push({
        routeId: tgtRouteId,
        routeShortName,
        destination: "",
        minutes: 0,
        tripId: v.tripId,
        lat: v.lat,
        lon: v.lon
      });
    }
  }
  const pBuses = [];
  const pTargetRoute1 = route.shortName;
  const pTargetRoute2 = route.shortName + "0";
  for (let i2 = 0, len = prasaranaBuses.length; i2 < len; i2++) {
    const b = prasaranaBuses[i2];
    if (b.route === pTargetRoute1 || b.route === pTargetRoute2) {
      pBuses.push({
        routeId: tgtRouteId,
        routeShortName,
        destination: "",
        minutes: 0,
        tripId: b.bus_no,
        lat: b.latitude,
        lon: b.longitude,
        busNo: b.bus_no
      });
    }
  }
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
        let lastKey = null;
        let lastArr = [];
        for (const row of posRows) {
          let pts;
          if (row.bus_no === lastKey) {
            pts = lastArr;
          } else {
            pts = groups.get(row.bus_no) || [];
            if (pts.length === 0) {
              groups.set(row.bus_no, pts);
            }
            lastKey = row.bus_no;
            lastArr = pts;
          }
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
var CACHE_TTL_MS = 6e4;
var cachedStopsPromise = null;
async function getAllStops(kv) {
  const now = Date.now();
  if (cachedStopsPromise && cachedStopsPromise.expires > now) return cachedStopsPromise.promise;
  const promise = Promise.all(AGENCIES.map((a) => getKvJson(kv, `stops:${a}`).catch(() => []))).then((results) => results.flatMap((r) => r || []));
  cachedStopsPromise = { promise, expires: now + CACHE_TTL_MS };
  return promise;
}
__name(getAllStops, "getAllStops");
var cachedRoutesMap = null;
var cachedRoutes = null;
async function getAllRoutes(kv) {
  const now = Date.now();
  if (cachedRoutes && cachedRoutes.expires > now) return cachedRoutes.routes;
  const allRoutes = await Promise.all([...AGENCIES, ...SELANGOR_AGENCIES].map((a) => getKvJson(kv, `routes:${a}`).catch(() => []))).then((res) => res.flatMap((r) => r || []));
  cachedRoutes = { routes: allRoutes, expires: now + CACHE_TTL_MS };
  return allRoutes;
}
__name(getAllRoutes, "getAllRoutes");
async function getRoutesMaps(kv) {
  const now = Date.now();
  if (cachedRoutesMap && cachedRoutesMap.expires > now) return cachedRoutesMap;
  const allRoutes = await getAllRoutes(kv);
  const map = /* @__PURE__ */ new Map();
  const shortNameMap = /* @__PURE__ */ new Map();
  for (let i2 = 0; i2 < allRoutes.length; i2++) {
    const r = allRoutes[i2];
    if (r.id && !map.has(r.id)) map.set(r.id, r);
    if (r.shortName && !shortNameMap.has(r.shortName)) shortNameMap.set(r.shortName, r);
  }
  cachedRoutesMap = { map, shortNameMap, expires: now + CACHE_TTL_MS };
  return cachedRoutesMap;
}
__name(getRoutesMaps, "getRoutesMaps");
var cachedTripsMap = null;
async function getTripsMaps(kv) {
  const now = Date.now();
  if (cachedTripsMap && cachedTripsMap.expires > now) return cachedTripsMap;
  const allTrips = await getAllTrips(kv);
  const tripMap = /* @__PURE__ */ new Map();
  const routeTripMap = /* @__PURE__ */ new Map();
  for (let i2 = 0; i2 < allTrips.length; i2++) {
    const t = allTrips[i2];
    tripMap.set(t.id, t);
    if (!routeTripMap.has(t.routeId)) {
      routeTripMap.set(t.routeId, t);
    }
  }
  cachedTripsMap = { tripMap, routeTripMap, expires: now + CACHE_TTL_MS };
  return cachedTripsMap;
}
__name(getTripsMaps, "getTripsMaps");
var cachedTripsPromise = null;
async function getAllTrips(kv) {
  const now = Date.now();
  if (cachedTripsPromise && cachedTripsPromise.expires > now) return cachedTripsPromise.promise;
  const promise = Promise.all(AGENCIES.map((a) => getKvJson(kv, `trips:${a}`).catch(() => []))).then((results) => results.flatMap((r) => r || []));
  cachedTripsPromise = { promise, expires: now + CACHE_TTL_MS };
  return promise;
}
__name(getAllTrips, "getAllTrips");
var cachedTripStopsPromise = null;
async function getAllTripStops(kv) {
  const now = Date.now();
  if (cachedTripStopsPromise && cachedTripStopsPromise.expires > now) return cachedTripStopsPromise.promise;
  const promise = Promise.all(AGENCIES.map((a) => getKvJson(kv, `tripStops:${a}`).catch(() => ({})))).then((results) => Object.assign({}, ...results));
  cachedTripStopsPromise = { promise, expires: now + CACHE_TTL_MS };
  return promise;
}
__name(getAllTripStops, "getAllTripStops");
var cachedCalendarPromise = null;
async function getAllCalendar(kv) {
  const now = Date.now();
  if (cachedCalendarPromise && cachedCalendarPromise.expires > now) return cachedCalendarPromise.promise;
  const promise = Promise.all(AGENCIES.map((a) => getKvJson(kv, `calendar:${a}`).catch(() => []))).then((results) => results.flatMap((r) => r || []));
  cachedCalendarPromise = { promise, expires: now + CACHE_TTL_MS };
  return promise;
}
__name(getAllCalendar, "getAllCalendar");
var cachedFrequenciesPromise = null;
async function getAllFrequencies(kv) {
  const now = Date.now();
  if (cachedFrequenciesPromise && cachedFrequenciesPromise.expires > now) return cachedFrequenciesPromise.promise;
  const promise = Promise.all(AGENCIES.map((a) => getKvJson(kv, `frequencies:${a}`).catch(() => []))).then((results) => results.flatMap((r) => r || []));
  cachedFrequenciesPromise = { promise, expires: now + CACHE_TTL_MS };
  return promise;
}
__name(getAllFrequencies, "getAllFrequencies");
var cachedShapesPromise = null;
async function getAllShapes(kv) {
  const now = Date.now();
  if (cachedShapesPromise && cachedShapesPromise.expires > now) return cachedShapesPromise.promise;
  const promise = Promise.all(AGENCIES.map((a) => getKvJson(kv, `shapes:${a}`).catch(() => ({})))).then((results) => Object.assign({}, ...results));
  cachedShapesPromise = { promise, expires: now + CACHE_TTL_MS };
  return promise;
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
  await Promise.allSettled(
    AGENCIES.map(async (agency) => {
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
    })
  );
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
        let stopSeqs = /* @__PURE__ */ new Map();
        try {
          const [allTrips, allTripStops] = await Promise.all([
            getAllTrips(env.KV),
            getAllTripStops(env.KV)
          ]);
          stopSeqs = canonicalStopSequencesByRoute(allTrips, allTripStops);
        } catch (err2) {
          console.error("Failed to load stop sequences for aggregation:", err2);
        }
        await aggregateTravelTimes(env, stopSeqs);
        await cleanupOldPositions(env);
      } catch (err2) {
        console.error("Failed to run sampling and aggregation tasks:", err2);
      }
    } else if (event.cron === "0 2 * * 1") {
      try {
        await ingestRailTimetables(env);
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
