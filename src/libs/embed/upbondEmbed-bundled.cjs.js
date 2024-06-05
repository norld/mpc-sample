/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 742:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ 764:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



const base64 = __webpack_require__(742)
const ieee754 = __webpack_require__(645)
const customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.lW = Buffer
__webpack_unused_export__ = SlowBuffer
exports.h2 = 50

const K_MAX_LENGTH = 0x7fffffff
__webpack_unused_export__ = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    const arr = new Uint8Array(1)
    const proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  const buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  const valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  const b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  const length = byteLength(string, encoding) | 0
  let buf = createBuffer(length)

  const actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  const length = array.length < 0 ? 0 : checked(array.length) | 0
  const buf = createBuffer(length)
  for (let i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    const copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  let buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    const len = checked(obj.length) | 0
    const buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  let x = a.length
  let y = b.length

  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  let i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  const buffer = Buffer.allocUnsafe(length)
  let pos = 0
  for (i = 0; i < list.length; ++i) {
    let buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)
        buf.copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  const len = string.length
  const mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  let loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  const i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  const len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (let i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  const len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (let i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  const len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (let i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  const length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  let str = ''
  const max = exports.h2
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  let x = thisEnd - thisStart
  let y = end - start
  const len = Math.min(x, y)

  const thisCopy = this.slice(thisStart, thisEnd)
  const targetCopy = target.slice(start, end)

  for (let i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  let indexSize = 1
  let arrLength = arr.length
  let valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  let i
  if (dir) {
    let foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      let found = true
      for (let j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  const remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  const strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  let i
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  const remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  const res = []

  let i = start
  while (i < end) {
    const firstByte = buf[i]
    let codePoint = null
    let bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  const len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  let res = ''
  let i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  const len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  let out = ''
  for (let i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  const bytes = buf.slice(start, end)
  let res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (let i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  const len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  const newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  let val = this[offset + --byteLength]
  let mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const lo = first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24

  const hi = this[++offset] +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    last * 2 ** 24

  return BigInt(lo) + (BigInt(hi) << BigInt(32))
})

Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const hi = first * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  const lo = this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last

  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
})

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let i = byteLength
  let mul = 1
  let val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = this[offset + 4] +
    this[offset + 5] * 2 ** 8 +
    this[offset + 6] * 2 ** 16 +
    (last << 24) // Overflow

  return (BigInt(val) << BigInt(32)) +
    BigInt(first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24)
})

Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  return (BigInt(val) << BigInt(32)) +
    BigInt(this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last)
})

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let mul = 1
  let i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let i = byteLength - 1
  let mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function wrtBigUInt64LE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  return offset
}

function wrtBigUInt64BE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset + 7] = lo
  lo = lo >> 8
  buf[offset + 6] = lo
  lo = lo >> 8
  buf[offset + 5] = lo
  lo = lo >> 8
  buf[offset + 4] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset + 3] = hi
  hi = hi >> 8
  buf[offset + 2] = hi
  hi = hi >> 8
  buf[offset + 1] = hi
  hi = hi >> 8
  buf[offset] = hi
  return offset + 8
}

Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = 0
  let mul = 1
  let sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = byteLength - 1
  let mul = 1
  let sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  const len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      const code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  let i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    const bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    const len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
const errors = {}
function E (sym, getMessage, Base) {
  errors[sym] = class NodeError extends Base {
    constructor () {
      super()

      Object.defineProperty(this, 'message', {
        value: getMessage.apply(this, arguments),
        writable: true,
        configurable: true
      })

      // Add the error code to the name to include it in the stack trace.
      this.name = `${this.name} [${sym}]`
      // Access the stack to generate the error message including the error code
      // from the name.
      this.stack // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete this.name
    }

    get code () {
      return sym
    }

    set code (value) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      })
    }

    toString () {
      return `${this.name} [${sym}]: ${this.message}`
    }
  }
}

E('ERR_BUFFER_OUT_OF_BOUNDS',
  function (name) {
    if (name) {
      return `${name} is outside of buffer bounds`
    }

    return 'Attempt to access memory outside buffer bounds'
  }, RangeError)
E('ERR_INVALID_ARG_TYPE',
  function (name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
  }, TypeError)
E('ERR_OUT_OF_RANGE',
  function (str, range, input) {
    let msg = `The value of "${str}" is out of range.`
    let received = input
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input))
    } else if (typeof input === 'bigint') {
      received = String(input)
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received)
      }
      received += 'n'
    }
    msg += ` It must be ${range}. Received ${received}`
    return msg
  }, RangeError)

function addNumericalSeparator (val) {
  let res = ''
  let i = val.length
  const start = val[0] === '-' ? 1 : 0
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`
  }
  return `${val.slice(0, i)}${res}`
}

// CHECK FUNCTIONS
// ===============

function checkBounds (buf, offset, byteLength) {
  validateNumber(offset, 'offset')
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1))
  }
}

function checkIntBI (value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    const n = typeof min === 'bigint' ? 'n' : ''
    let range
    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
                `${(byteLength + 1) * 8 - 1}${n}`
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`
    }
    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
  }
  checkBounds(buf, offset, byteLength)
}

function validateNumber (value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
}

function boundsError (value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type)
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
  }

  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
  }

  throw new errors.ERR_OUT_OF_RANGE(type || 'offset',
                                    `>= ${type ? 1 : 0} and <= ${length}`,
                                    value)
}

// HELPER FUNCTIONS
// ================

const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  let codePoint
  const length = string.length
  let leadSurrogate = null
  const bytes = []

  for (let i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  let c, hi, lo
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  let i
  for (i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = (function () {
  const alphabet = '0123456789abcdef'
  const table = new Array(256)
  for (let i = 0; i < 16; ++i) {
    const i16 = i * 16
    for (let j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

// Return not function with Error if BigInt not supported
function defineBigIntMethod (fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
}

function BufferBigIntNotDefined () {
  throw new Error('BigInt not supported')
}


/***/ }),

/***/ 840:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(155);
var once = __webpack_require__(320);

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		process.nextTick(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;


/***/ }),

/***/ 645:
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ 155:
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ 286:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(155);
var once = __webpack_require__(320)
var eos = __webpack_require__(840)
var fs = __webpack_require__(156) // we only need fs to get the ReadStream and WriteStream prototypes

var noop = function () {}
var ancient = /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  var streams = Array.prototype.slice.call(arguments)
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    var writing = i > 0
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      if (err) destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

module.exports = pump


/***/ }),

/***/ 320:
/***/ ((module) => {

"use strict";
module.exports = require("once");

/***/ }),

/***/ 156:
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* reexport */ src_embed)
});

// UNUSED EXPORTS: BUTTON_POSITION, LOGIN_PROVIDER, PAYMENT_PROVIDER, SUPPORTED_PAYMENT_NETWORK, UPBOND_BUILD_ENV, UpbondInpageProvider, WALLET_OPENLOGIN_VERIFIER_MAP, WALLET_VERIFIERS

;// CONCATENATED MODULE: external "@babel/runtime/helpers/objectWithoutProperties"
const objectWithoutProperties_namespaceObject = require("@babel/runtime/helpers/objectWithoutProperties");
var objectWithoutProperties_default = /*#__PURE__*/__webpack_require__.n(objectWithoutProperties_namespaceObject);
;// CONCATENATED MODULE: external "@babel/runtime/helpers/defineProperty"
const defineProperty_namespaceObject = require("@babel/runtime/helpers/defineProperty");
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty_namespaceObject);
;// CONCATENATED MODULE: external "@toruslabs/http-helpers"
const http_helpers_namespaceObject = require("@toruslabs/http-helpers");
;// CONCATENATED MODULE: external "@toruslabs/openlogin-jrpc"
const openlogin_jrpc_namespaceObject = require("@toruslabs/openlogin-jrpc");
;// CONCATENATED MODULE: external "lodash.merge"
const external_lodash_merge_namespaceObject = require("lodash.merge");
var external_lodash_merge_default = /*#__PURE__*/__webpack_require__.n(external_lodash_merge_namespaceObject);
;// CONCATENATED MODULE: ./src/interfaces.ts
const LOGIN_PROVIDER = {
  GOOGLE: "google",
  FACEBOOK: "facebook",
  TWITCH: "twitch",
  REDDIT: "reddit",
  DISCORD: "discord"
};
const WALLET_VERIFIERS = {
  GOOGLE: "google",
  FACEBOOK: "facebook",
  TWITCH: "twitch",
  REDDIT: "reddit",
  DISCORD: "discord",
  EMAIL_PASSWORDLESS: "torus-auth0-email-passwordless"
};
const WALLET_OPENLOGIN_VERIFIER_MAP = {
  [WALLET_VERIFIERS.GOOGLE]: "tkey-google",
  [WALLET_VERIFIERS.FACEBOOK]: "tkey-facebook",
  [WALLET_VERIFIERS.TWITCH]: "tkey-twitch",
  [WALLET_VERIFIERS.REDDIT]: "tkey-reddit",
  [WALLET_VERIFIERS.DISCORD]: "tkey-discord",
  [WALLET_VERIFIERS.EMAIL_PASSWORDLESS]: "tkey-auth0-email-passwordless"
};
const PAYMENT_PROVIDER = {
  MOONPAY: "moonpay",
  WYRE: "wyre",
  RAMPNETWORK: "rampnetwork",
  XANPOOL: "xanpool",
  MERCURYO: "mercuryo",
  TRANSAK: "transak"
};
const SUPPORTED_PAYMENT_NETWORK = {
  MAINNET: "mainnet",
  MATIC: "matic",
  BSC_MAINNET: "bsc_mainnet",
  AVALANCHE_MAINNET: "avalanche_mainnet",
  XDAI: "xdai"
};
const UPBOND_BUILD_ENV = {
  PRODUCTION: "production",
  STAGING: "staging",
  DEVELOPMENT: "development",
  TESTING: "testing",
  LOCAL: "local",
  V1_DEBUG: "v1_debug",
  V1_LOCAL: "v1_local",
  V1_DEVELOPMENT: "v1_development",
  V1_STAGING: "v1_staging",
  V1_PRODUCTION: "v1_production",
  V2_DEBUG: "v2_debug",
  V2_LOCAL: "v2_local",
  V2_DEVELOPMENT: "v2_development",
  V2_STAGING: "v2_staging",
  V2_PRODUCTION: "v2_production",
  DEBUG: "debug",
  WALLET_DID: "wallet-did",
  MPC_DEV: "mpc-dev"
};
const BUTTON_POSITION = {
  BOTTOM_LEFT: "bottom-left",
  TOP_LEFT: "top-left",
  BOTTOM_RIGHT: "bottom-right",
  TOP_RIGHT: "top-right"
};
;// CONCATENATED MODULE: ./src/supportedCurrencies.ts

/**
 * From https://min-api.cryptocompare.com/data/v2/pair/mapping/fsym?fsym=BTC&extraParams=YourSite
 * GET https://min-api.cryptocompare.com/data/v2/pair/mapping/fsym?fsym=BTC
 * Then map over returned entries, picking tsym
 *
 * Last updated: Date of commit
 */
const CRYPTO_COMPARE_CURRENCIES = ["ETH", "USDT", "USDC", "TUSD", "EOSDT", "USD", "DAI", "GUSD", "DKKT", "PAX", "ILS", "RUB", "BYN", "EUR", "GBP", "JPY", "KRW", "PLN", "MXN", "AUD", "BRL", "CAD", "CHF", "KPW", "LAK", "LBP", "LKR", "XOF", "CNHT", "DOGE", "UAH", "TRY", "HKD", "XJP", "SGD", "USC", "NZD", "NGN", "RUR", "COP", "GHS", "EGP", "IDR", "BHD", "CRC", "PEN", "AED", "DOP", "PKR", "HUF", "VND", "XAR", "LTC", "RON", "OMR", "MYR", "DKK", "UGX", "ZMW", "SAR", "SEK", "GEL", "RWF", "IRR", "TZS", "CNY", "VEF", "BDT", "HRK", "CLP", "THB", "XAF", "ARS", "UYU", "SZL", "KZT", "NOK", "KES", "PAB", "INR", "CZK", "MAD", "TWD", "PHP", "ZAR", "BOB", "CDF", "DASH", "VES", "ISK", "MWK", "BAM", "TTD", "XRP", "JOD", "RSD", "HNL", "BGN", "GTQ", "BWP", "XMR", "MMK", "QAR", "AOA", "KWD", "MUR", "WUSD", "WEUR", "WAVES", "WTRY", "LRD", "LSL", "LYD", "AWG", "MDL", "BTO", "EURS", "CHFT", "MKD", "MNT", "MOP", "MRO", "MVR", "VOLLAR", "CKUSD", "KHR", "VUV", "BITCNY", "QC", "BBD", "NAD", "NPR", "PGK", "PYG", "BIF", "BMD", "BND", "XLM", "BNB", "SCR", "BAT", "CRO", "HT", "KCS", "LEO", "LINK", "MKR", "NPXS", "OMG", "REP", "ZB", "ZIL", "ZRX", "BCH", "BZD", "CUP", "CVE", "DJF", "DZD", "ERN", "ETB", "FJD", "FKP", "BUSD", "ANCT", "ALL", "AMD", "ANG", "CNYX", "IQD", "UZS", "TND", "GGP", "XAU", "KGS", "GIP", "JMD", "ZEC", "USDP", "BSV", "EMC2", "SNT", "GTO", "POWR", "EUSD", "EURT", "BCY", "BTS", "ATM", "BLOCKPAY", "ARDR", "AMP", "B2X", "BITGOLD", "BITEUR", "ATB", "BITUSD", "AGRS", "DFXT", "HIKEN", "BIX", "KNC", "EOS", "COB", "COSS", "BMH", "NANO", "BDG", "BNT", "XVG", "LKK1Y", "LKK", "USDK", "EURN", "NZDT", "JSE", "GMD", "GNF", "GYD", "YER", "XPF", "HTG", "SLL", "SOS", "WST", "SVC", "SYP", "NEO", "KMF", "JUMP", "AYA", "BLAST", "WGR", "BCN", "BTG", "URALS", "INN", "USDQ", "CNH", "HUSD", "BKRW", "NZDX", "EURX", "CADX", "USDEX", "JPYX", "AUDX", "VNDC", "EON", "GBPX", "CHFX", "USDJ", "IDRT", "USDS", "USDN", "BIDR", "IDK", "BSD", "BTN", "KYD", "NIO", "SBD", "SDG", "SHP", "TOP", "XCD", "XCHF", "CNYT", "GYEN", "ZUSD", "GOLD", "TRX", "TRYB", "PLATC", "STRAX", "UST", "GLM", "VAI", "BRZ", "DDRST", "XAUT", "MIM"];

/**
 * currencies supported by the payment provider
 * Last updated: Date of commit
 */
const PROVIDER_SUPPORTED_FIAT_CURRENCIES = {
  // https://integrations.simplex.com/supported_currencies
  // https://support.moonpay.com/hc/en-gb/articles/360011931457-Which-fiat-currencies-are-supported-
  [PAYMENT_PROVIDER.MOONPAY]: ["AUD", "BGN", "BRL", "CAD", "CHF", "CNY", "COP", "CZK", "DKK", "DOP", "EGP", "EUR", "GBP", "HKD", "HRK", "IDR", "ILS", "JPY", "JOD", "KES", "KRW", "KWD", "LKR", "MAD", "MXN", "MYR", "NGN", "NOK", "NZD", "OMR", "PEN", "PKR", "PLN", "RON", "RUB", "SEK", "SGD", "THB", "TRY", "TWD", "USD", "VND", "ZAR"],
  /**
   * https://docs.sendwyre.com/docs/supported-currencies#fiat
   * The ones where credit card is supported
   */
  [PAYMENT_PROVIDER.WYRE]: ["USD", "EUR", "GBP", "AUD", "CAD", "NZD", "ARS", "BRL", "CHF", "CLP", "COP", "CZK", "DKK", "HKD", "ILS", "INR", "ISK", "JPY", "KRW", "MXN", "MYR", "NOK", "PHP", "PLN", "SEK", "THB", "VND", "ZAR"],
  // https://support.ramp.network/en/articles/471-why-am-i-paying-in-usd-eur-gbp
  [PAYMENT_PROVIDER.RAMPNETWORK]: ["USD", "EUR", "GBP"],
  // From https://xanpool.com/ fiat select dropdown
  [PAYMENT_PROVIDER.XANPOOL]: ["SGD", "HKD", "THB", "PHP", "INR", "IDR", "MYR", "AUD", "NZD", "KRW"],
  // https://support.aax.com/en/articles/5295762-mercuryo
  // RUB / UAH currently not supported
  [PAYMENT_PROVIDER.MERCURYO]: ["EUR", "USD", "GBP", "TRY", "JPY", "BRL", "NGN", "VND", "MXN", "KRW"],
  /**
   * https://support.transak.com/hc/en-us/articles/360020615578-Credit-and-Debit-Card-Payments-through-Transak
   * or
   * https://transak.stoplight.io/docs/transak-docs/b3A6OTk1ODQ0-2-get-fiat-currencies
   */
  [PAYMENT_PROVIDER.TRANSAK]: ["ARS", "AUD", "BBD", "BGN", "BMD", "BRL", "CAD", "CHF", "CLP", "CRC", "CZK", "DKK", "DOP", "EUR", "FJD", "FKP", "GBP", "GIP", "HRK", "HUF", "IDR", "ILS", "ISK", "JMD", "JPY", "KES", "KRW", "MDL", "MXN", "MYR", "NOK", "NZD", "PEN", "PHP", "PLN", "PYG", "RON", "SEK", "SGD", "THB", "TRY", "TZS", "USD", "ZAR"]
};
const cryptoCompareCurrenciesSet = new Set(CRYPTO_COMPARE_CURRENCIES);
/**
 * Fiat currencies that we support
 */
function supportedFiatCurrencies(provider) {
  const providerSupportedFiatCurrencies = PROVIDER_SUPPORTED_FIAT_CURRENCIES[provider];
  return providerSupportedFiatCurrencies.filter(currency => cryptoCompareCurrenciesSet.has(currency));
}
;// CONCATENATED MODULE: ./src/config.ts


const paymentProviders = {
  [PAYMENT_PROVIDER.MOONPAY]: {
    line1: "Credit/ Debit Card/ Apple Pay",
    line2: "4.5% or 5 USD",
    line3: "2,000€/day, 10,000€/mo",
    supportPage: "https://help.moonpay.io/en/",
    minOrderValue: 24.99,
    maxOrderValue: 50000,
    validCurrencies: supportedFiatCurrencies(PAYMENT_PROVIDER.MOONPAY),
    validCryptoCurrenciesByChain: {
      [SUPPORTED_PAYMENT_NETWORK.MAINNET]: [{
        value: "aave",
        display: "AAVE"
      }, {
        value: "bat",
        display: "BAT"
      }, {
        value: "dai",
        display: "DAI"
      }, {
        value: "eth",
        display: "ETH"
      }, {
        value: "mkr",
        display: "MKR"
      }, {
        value: "matic",
        display: "MATIC"
      }, {
        value: "usdt",
        display: "USDT"
      }, {
        value: "usdc",
        display: "USDC"
      }],
      [SUPPORTED_PAYMENT_NETWORK.MATIC]: [{
        value: "eth_polygon",
        display: "ETH"
      }, {
        value: "matic_polygon",
        display: "MATIC"
      }, {
        value: "usdc_polygon",
        display: "USDC"
      }],
      [SUPPORTED_PAYMENT_NETWORK.BSC_MAINNET]: [{
        value: "bnb_bsc",
        display: "BNB"
      }, {
        value: "busd_bsc",
        display: "BUSD"
      }],
      [SUPPORTED_PAYMENT_NETWORK.AVALANCHE_MAINNET]: [{
        value: "avax_cchain",
        display: "AVAX"
      }]
    },
    includeFees: true,
    api: true,
    enforceMax: false
  },
  [PAYMENT_PROVIDER.WYRE]: {
    line1: "Apple Pay/ Debit/ Credit Card",
    line2: "4.9% + 30¢ or 5 USD",
    line3: "$250/day",
    supportPage: "https://support.sendwyre.com/en/",
    minOrderValue: 5,
    maxOrderValue: 500,
    validCurrencies: supportedFiatCurrencies(PAYMENT_PROVIDER.WYRE),
    validCryptoCurrenciesByChain: {
      [SUPPORTED_PAYMENT_NETWORK.MAINNET]: [{
        value: "AAVE",
        display: "AAVE"
      }, {
        value: "BAT",
        display: "BAT"
      }, {
        value: "BUSD",
        display: "BUSD"
      }, {
        value: "DAI",
        display: "DAI"
      }, {
        value: "ETH",
        display: "ETH"
      }, {
        value: "MKR",
        display: "MKR"
      }, {
        value: "UNI",
        display: "UNI"
      }, {
        value: "USDC",
        display: "USDC"
      }, {
        value: "USDT",
        display: "USDT"
      }],
      [SUPPORTED_PAYMENT_NETWORK.MATIC]: [{
        value: "MUSDC",
        display: "USDC"
      }],
      // AVAXC? or AVAX?
      [SUPPORTED_PAYMENT_NETWORK.AVALANCHE_MAINNET]: [{
        value: "AVAXC",
        display: "AVAXC"
      }]
    },
    includeFees: false,
    api: true,
    enforceMax: false
  },
  [PAYMENT_PROVIDER.RAMPNETWORK]: {
    line1: "Debit Card/ <br>Apple Pay/ Bank transfer",
    line2: "0.49% - 2.9%",
    line3: "5,000€/purchase, 20,000€/mo",
    supportPage: "https://instant.ramp.network/",
    minOrderValue: 50,
    maxOrderValue: 20000,
    validCurrencies: supportedFiatCurrencies(PAYMENT_PROVIDER.RAMPNETWORK),
    validCryptoCurrenciesByChain: {
      [SUPPORTED_PAYMENT_NETWORK.MAINNET]: [{
        value: "ETH",
        display: "ETH"
      }, {
        value: "DAI",
        display: "DAI"
      }, {
        value: "USDC",
        display: "USDC"
      }, {
        value: "USDT",
        display: "USDT"
      }],
      [SUPPORTED_PAYMENT_NETWORK.MATIC]: [{
        value: "MATIC_DAI",
        display: "DAI"
      }, {
        value: "MATIC_MATIC",
        display: "MATIC"
      }, {
        value: "MATIC_USDC",
        display: "USDC"
      }],
      // what about AVAXC?
      [SUPPORTED_PAYMENT_NETWORK.AVALANCHE_MAINNET]: [{
        value: "AVAX",
        display: "AVAX"
      }]
      // Temporary unavailable
      // [SUPPORTED_PAYMENT_NETWORK.XDAI]: [{ value: 'XDAI_XDAI', display: 'XDAI' }],
    },

    includeFees: true,
    api: true,
    receiveHint: "walletTopUp.receiveHintRamp",
    enforceMax: false
  },
  [PAYMENT_PROVIDER.XANPOOL]: {
    line1: "PayNow/ InstaPay/ FPS/ GoJekPay/ UPI/ PromptPay/ <br>ViettelPay/ DuitNow",
    line2: "2.5% buying, 3% selling",
    line3: "$2,500 / day",
    supportPage: "mailto:support@xanpool.com",
    minOrderValue: 100,
    maxOrderValue: 2500,
    validCurrencies: supportedFiatCurrencies(PAYMENT_PROVIDER.XANPOOL),
    validCryptoCurrenciesByChain: {
      [SUPPORTED_PAYMENT_NETWORK.MAINNET]: [{
        value: "ETH",
        display: "ETH"
      }, {
        value: "USDT",
        display: "USDT"
      }]
    },
    includeFees: true,
    api: true,
    sell: true,
    enforceMax: false
  },
  [PAYMENT_PROVIDER.MERCURYO]: {
    line1: "Credit/ Debit Card/ Apple Pay",
    line2: "3.95% or 4 USD",
    line3: "10,000€/day, 25,000€/mo",
    supportPage: "mailto:support@mercuryo.io",
    minOrderValue: 30,
    maxOrderValue: 5000,
    validCurrencies: supportedFiatCurrencies(PAYMENT_PROVIDER.MERCURYO),
    validCryptoCurrenciesByChain: {
      [SUPPORTED_PAYMENT_NETWORK.MAINNET]: [{
        value: "ETH",
        display: "ETH"
      }, {
        value: "BAT",
        display: "BAT"
      }, {
        value: "USDT",
        display: "USDT"
      }, {
        value: "DAI",
        display: "DAI"
      }],
      [SUPPORTED_PAYMENT_NETWORK.BSC_MAINNET]: [{
        value: "BNB",
        display: "BNB"
      }, {
        value: "BUSD",
        display: "BUSD"
      }, {
        value: "1INCH",
        display: "1INCH"
      }]
    },
    includeFees: true,
    api: true,
    enforceMax: false
  },
  [PAYMENT_PROVIDER.TRANSAK]: {
    line1: "Apple & Google Pay / Credit/Debit Card<br/>Bangkok Bank Mobile & iPay<br/>Bank Transfer (sepa/gbp) / SCB Mobile & Easy",
    line2: "0.99% - 5.5% or 5 USD",
    line3: "$5,000/day, $28,000/mo",
    supportPage: "https://support.transak.com/hc/en-US",
    minOrderValue: 30,
    maxOrderValue: 500,
    validCurrencies: supportedFiatCurrencies(PAYMENT_PROVIDER.TRANSAK),
    validCryptoCurrenciesByChain: {
      [SUPPORTED_PAYMENT_NETWORK.MAINNET]: [{
        value: "AAVE",
        display: "AAVE"
      }, {
        value: "DAI",
        display: "DAI"
      }, {
        value: "ETH",
        display: "ETH"
      }, {
        value: "USDC",
        display: "USDC"
      }, {
        value: "USDT",
        display: "USDT"
      }],
      [SUPPORTED_PAYMENT_NETWORK.MATIC]: [{
        value: "AAVE",
        display: "AAVE"
      }, {
        value: "DAI",
        display: "DAI"
      }, {
        value: "MATIC",
        display: "MATIC"
      }, {
        value: "USDC",
        display: "USDC"
      }, {
        value: "USDT",
        display: "USDT"
      }, {
        value: "WETH",
        display: "WETH"
      }],
      [SUPPORTED_PAYMENT_NETWORK.BSC_MAINNET]: [{
        value: "BNB",
        display: "BNB"
      }, {
        value: "BUSD",
        display: "BUSD"
      }],
      [SUPPORTED_PAYMENT_NETWORK.AVALANCHE_MAINNET]: [{
        value: "AVAX",
        display: "AVAX"
      }]
    },
    includeFees: true,
    enforceMax: true
  }
};
const translations = {
  en: {
    embed: {
      continue: "Continue",
      actionRequired: "Authorization required",
      pendingAction: "Click continue to proceed with your request in a popup",
      cookiesRequired: "Cookies Required",
      enableCookies: "Please enable cookies in your browser preferences to access Upbond",
      clickHere: "More Info"
    }
  },
  de: {
    embed: {
      continue: "Fortsetzen",
      actionRequired: "Autorisierung erforderlich",
      pendingAction: "Klicken Sie in einem Popup auf Weiter, um mit Ihrer Anfrage fortzufahren",
      cookiesRequired: "Cookies benötigt",
      enableCookies: "Bitte aktivieren Sie Cookies in Ihren Browsereinstellungen, um auf Upbond zuzugreifen",
      clickHere: "Mehr Info"
    }
  },
  ja: {
    embed: {
      continue: "継続する",
      actionRequired: "認証が必要です",
      pendingAction: "続行をクリックして、ポップアップでリクエストを続行します",
      cookiesRequired: "必要なクッキー",
      enableCookies: "Upbondにアクセスするには、ブラウザの設定でCookieを有効にしてください。",
      clickHere: "詳しくは"
    }
  },
  ko: {
    embed: {
      continue: "계속하다",
      actionRequired: "승인 필요",
      pendingAction: "팝업에서 요청을 진행하려면 계속을 클릭하십시오.",
      cookiesRequired: "쿠키 필요",
      enableCookies: "브라우저 환경 설정에서 쿠키를 활성화하여 Upbond에 액세스하십시오.",
      clickHere: "더 많은 정보"
    }
  },
  zh: {
    embed: {
      continue: "继续",
      actionRequired: "需要授权",
      pendingAction: "单击继续以在弹出窗口中继续您的请求",
      cookiesRequired: "必填Cookie",
      enableCookies: "请在您的浏览器首选项中启用cookie以访问Torus。",
      clickHere: "更多信息"
    }
  }
};
const DID_STREAM_NAME = {
  RESULT: "did_listen_result",
  REQUEST: "did_listen_request"
};
/* harmony default export */ const config = ({
  supportedVerifierList: Object.values(WALLET_VERIFIERS),
  paymentProviders,
  api: "https://api.tor.us",
  translations,
  prodTorusUrl: "",
  localStorageKeyPrefix: `torus-`,
  DID_STREAM_NAME
});
;// CONCATENATED MODULE: external "@ansugroup/timing-safe-equal"
const timing_safe_equal_namespaceObject = require("@ansugroup/timing-safe-equal");
var timing_safe_equal_default = /*#__PURE__*/__webpack_require__.n(timing_safe_equal_namespaceObject);
;// CONCATENATED MODULE: external "crypto-browserify"
const external_crypto_browserify_namespaceObject = require("crypto-browserify");
;// CONCATENATED MODULE: ./src/consent.ts
/* provided dependency */ var Buffer = __webpack_require__(764)["lW"];

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable prefer-const */




// import * as ethers from "ethers";
// import Web3Token from "web3-token";

// import { ConsentDidResponse } from "./interfaces";

class Consent {
  constructor(_ref) {
    let {
      publicKey,
      scope,
      consentStream,
      provider,
      isLoggedIn = false,
      didIntervalRequest = 5000
    } = _ref;
    defineProperty_default()(this, "communicationMux", void 0);
    defineProperty_default()(this, "provider", void 0);
    defineProperty_default()(this, "consentConfigurations", void 0);
    defineProperty_default()(this, "flowConfig", void 0);
    defineProperty_default()(this, "publicKey", void 0);
    defineProperty_default()(this, "isLoggedIn", void 0);
    defineProperty_default()(this, "didIntervalRequest", void 0);
    defineProperty_default()(this, "isDidDeployed", void 0);
    defineProperty_default()(this, "consentStreamName", void 0);
    defineProperty_default()(this, "didCreationCb", void 0);
    if (publicKey) {
      this.didIntervalRequest = didIntervalRequest;
      this.isLoggedIn = isLoggedIn;
      this.consentConfigurations = {
        enabled: false,
        scopes: scope
      };
      this.flowConfig = "normal";
      this.publicKey = publicKey;
      this.communicationMux = consentStream;
      this.provider = provider;
      this.isDidDeployed = false;
      this.consentStreamName = {
        consent: "consent",
        listenerStream: "did_listener_stream",
        getConsentData: "did_get_consent_data"
      };
      this.didCreationCb = {};
      this.listenDidCreation();
    }
  }
  init() {
    if (!this.publicKey) {
      throw new Error(`Missing secret public key`);
    }
    if (!this.consentConfigurations.scopes || this.consentConfigurations.scopes.length === 0) {
      throw new Error(`Missing scope`);
    }
    console.log(`Consent management ready to go`);
    this.consentConfigurations.enabled = true;
    const stream = this.communicationMux.getStream(this.consentStreamName.consent);
    stream.write({
      name: "init",
      data: {
        scope: this.consentConfigurations.scopes,
        publicKey: this.publicKey,
        host: window.location.host
      }
    });
  }
  getDid() {
    return new Promise((resolve, reject) => {
      const stream = this.communicationMux.getStream(this.consentStreamName.consent);
      stream.write({
        name: "request",
        data: {
          scope: this.consentConfigurations.scopes,
          publicKey: this.publicKey,
          host: window.location.host
        }
      });
      stream.on("data", data => {
        if (data.name === "error") {
          if (data.data.code && data.data.code === 401) {
            this.isDidDeployed = false;
            this.didCreationCb = data.data.params;
            resolve({
              jwt: "",
              jwtPresentation: ""
            });
          }
          reject(new Error(data.data.msg));
        } else {
          this.isDidDeployed = true;
          resolve(data.data);
        }
      });
    });
  }

  // requestDIDCreationOrFilledForm(clientId: string, params: { [x: string]: any }, secKey: string): Promise<ConsentDidResponse> {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       const ethProvider = new ethers.providers.Web3Provider(this.provider);
  //       const signer = ethProvider.getSigner();
  //       Web3Token.sign(
  //         async (msg: string) => {
  //           const data = {
  //             domain: "example.com",
  //             scope: this.consentConfigurations.scopes,
  //             type: "did_creation_request",
  //             data: {
  //               clientId,
  //               clientSecret: secKey,
  //               params,
  //             },
  //             expires_in: "3 days",
  //             msg,
  //           };
  //           const tx = await signer.signMessage(JSON.stringify(data));
  //           return tx;
  //         },
  //         {
  //           domain: "example.com",
  //           expires_in: "3 days",
  //         }
  //       );
  //       const stream = this.communicationMux.getStream("consent") as Substream;
  //       stream.on("data", (data) => {
  //         if (data.name === "consent_response") {
  //           resolve(data.data);
  //         } else if (data.name === "consent_error") {
  //           reject(data.data.msg);
  //         }
  //       });
  //       stream.on("error", (err) => {
  //         reject(err);
  //       });
  //     } catch (error) {
  //       if (error.message && error.message.includes("user rejected signing")) {
  //         reject(new Error("User rejected your request"));
  //       }
  //       reject(error);
  //     }
  //   });
  // }

  // requestUserData(did: { jwt: string; jwtPresentation: string }, cb?: (stream: Substream) => void): Promise<ConsentDidResponse> {
  //   return new Promise((resolve, reject) => {
  //     if (!this.isDidDeployed || (did.jwt === "" && did.jwtPresentation === "")) {
  //       const data = this.requestDIDCreationOrFilledForm(
  //         this.consentApiKey,
  //         Object.keys(this.didCreationCb).length > 0 ? this.didCreationCb : {},
  //         this.key
  //       );
  //       resolve(data);
  //       return;
  //     }
  //     if (cb && typeof cb !== "function") {
  //       reject(new Error(`Callback must be a function`));
  //     }
  //     if (!did || !did.jwt || !did.jwtPresentation) {
  //       reject(new Error(`Missing did object`));
  //     }
  //     const { jwt, jwtPresentation } = did;
  //     const stream = this.communicationMux.getStream("consent") as Substream;
  //     try {
  //       const ethProvider = new ethers.providers.Web3Provider(this.provider);
  //       const signer = ethProvider.getSigner();
  //       Web3Token.sign(
  //         async (msg: string) => {
  //           const data = {
  //             domain: this.isLocalhost() ? "example.com" : new URL(window.location.origin).hostname,
  //             scope: this.consentConfigurations.scopes,
  //             type: "consent_request",
  //             data: {
  //               vc: jwt,
  //               vp: jwtPresentation,
  //             },
  //             expires_in: "3 days",
  //             msg,
  //           };
  //           const tx = await signer.signMessage(JSON.stringify(data));
  //           return tx;
  //         },
  //         {
  //           domain: this.isLocalhost() ? "example.com" : new URL(window.location.origin).hostname,
  //           expires_in: "3 days",
  //         }
  //       );
  //       if (cb) {
  //         const consentStream = this.communicationMux.getStream("consent_stream") as Substream;
  //         cb(consentStream);
  //       }
  //       stream.on("data", (data) => {
  //         if (data.name === "consent_response") {
  //           resolve(data.data);
  //           stream.destroy();
  //         } else if (data.name === "consent_error") {
  //           reject(data.data.msg);
  //           stream.destroy();
  //         }
  //       });
  //       stream.on("error", (err) => {
  //         reject(err);
  //         stream.destroy();
  //       });
  //     } catch (error) {
  //       if (error.message && error.message.includes("user rejected signing")) {
  //         reject(new Error("User rejected your request"));
  //         stream.destroy();
  //       }
  //       reject(error);
  //       stream.destroy();
  //     }
  //   });
  // }

  // getUserData(): Promise<ConsentDidResponse> {
  //   return new Promise((resolve, reject) => {
  //     const stream = this.communicationMux.getStream(this.consentStreamName.getConsentData) as Substream;
  //     stream.write({
  //       name: this.consentStreamName.getConsentData,
  //       data: {
  //         clientId: this.consentApiKey,
  //         secretKey: this.key,
  //         origin: window.location.origin,
  //       },
  //     });
  //     stream.on("data", (ev) => {
  //       if (ev.name === "result") {
  //         resolve(ev.data);
  //       }
  //       reject(new Error("Consent does not exist"));
  //     });
  //   });
  // }

  listenDidCreation() {
    const stream = this.communicationMux.getStream(this.consentStreamName.listenerStream);
    stream.write({
      name: config.DID_STREAM_NAME.REQUEST,
      data: {
        interval: this.didIntervalRequest
      }
    });
    stream.on("data", ev => {
      if (ev.name && ev.name === config.DID_STREAM_NAME.RESULT) {
        if (ev.data) {
          this.isDidDeployed = true;
        } else {
          this.isDidDeployed = false;
        }
      }
    });
  }
  isLocalhost() {
    return new URL(window.location.origin).hostname === "localhost";
  }
  _createDigest(encodedData, format) {
    return external_crypto_browserify_namespaceObject.createHmac("sha256", this.publicKey).update(encodedData).digest(format);
  }
  _decode(value) {
    let [encodedData, sourceDigest] = value.split("!");
    if (!encodedData || !sourceDigest) throw new Error("invalid value(s)");
    const json = Buffer.from(encodedData, "base64").toString("utf8");
    const decodedData = JSON.parse(json);
    const checkDigest = this._createDigest(encodedData, "base64");
    const digestsEqual = timing_safe_equal_default()(sourceDigest, checkDigest);
    if (!digestsEqual) throw new Error("invalid value(s)");
    return decodedData;
  }
}
;// CONCATENATED MODULE: ./src/embedUtils.ts
const runOnLoad = fn => new Promise((resolve, reject) => {
  if (window.document.body != null) {
    Promise.resolve(fn()).then(resolve).catch(reject);
  } else {
    window.document.addEventListener("DOMContentLoaded", () => {
      Promise.resolve(fn()).then(resolve).catch(reject);
    });
  }
});
const runOnComplete = fn => {
  const retry = window.setInterval(() => {
    if (window.document.readyState === "complete") {
      window.clearInterval(retry);
      fn();
    }
  }, 300);
};
const htmlToElement = html => {
  const template = window.document.createElement("template");
  const trimmedHtml = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = trimmedHtml;
  return template.content.firstChild;
};
const handleEvent = function (handle, eventName, handler) {
  for (var _len = arguments.length, handlerArgs = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    handlerArgs[_key - 3] = arguments[_key];
  }
  const handlerWrapper = () => {
    handler(...handlerArgs);
    handle.removeEventListener(eventName, handlerWrapper);
  };
  handle.addEventListener(eventName, handlerWrapper);
};
const handleStream = (handle, eventName, handler) => {
  const handlerWrapper = chunk => {
    handler(chunk);
    handle.removeListener(eventName, handlerWrapper);
  };
  handle.on(eventName, handlerWrapper);
};
async function documentReady() {
  return new Promise(resolve => {
    if (document.readyState !== "loading") {
      resolve();
    } else {
      handleEvent(document, "DOMContentLoaded", resolve);
    }
  });
}
;// CONCATENATED MODULE: external "@metamask/obs-store"
const obs_store_namespaceObject = require("@metamask/obs-store");
;// CONCATENATED MODULE: external "eth-rpc-errors"
const external_eth_rpc_errors_namespaceObject = require("eth-rpc-errors");
;// CONCATENATED MODULE: external "fast-deep-equal"
const external_fast_deep_equal_namespaceObject = require("fast-deep-equal");
var external_fast_deep_equal_default = /*#__PURE__*/__webpack_require__.n(external_fast_deep_equal_namespaceObject);
;// CONCATENATED MODULE: external "is-stream"
const external_is_stream_namespaceObject = require("is-stream");
// EXTERNAL MODULE: ./node_modules/pump/index.js
var pump = __webpack_require__(286);
var pump_default = /*#__PURE__*/__webpack_require__.n(pump);
;// CONCATENATED MODULE: external "loglevel"
const external_loglevel_namespaceObject = require("loglevel");
var external_loglevel_default = /*#__PURE__*/__webpack_require__.n(external_loglevel_namespaceObject);
;// CONCATENATED MODULE: ./src/loglevel.ts

/* harmony default export */ const loglevel = (external_loglevel_default().getLogger("torus-embed"));
;// CONCATENATED MODULE: ./src/messages.ts
/* harmony default export */ const messages = ({
  errors: {
    disconnected: () => "Upbond: Lost connection to Upbond.",
    permanentlyDisconnected: () => "Upbond: Disconnected from iframe. Page reload required.",
    sendSiteMetadata: () => "Upbond: Failed to send site metadata. This is an internal error, please report this bug.",
    unsupportedSync: method => `Upbond: The Upbond Ethereum provider does not support synchronous methods like ${method} without a callback parameter.`,
    invalidDuplexStream: () => "Must provide a Node.js-style duplex stream.",
    invalidOptions: (maxEventListeners, shouldSendMetadata) => `Invalid options. Received: { maxEventListeners: ${maxEventListeners}, shouldSendMetadata: ${shouldSendMetadata} }`,
    invalidRequestArgs: () => `Expected a single, non-array, object argument.`,
    invalidRequestMethod: () => `'args.method' must be a non-empty string.`,
    invalidRequestParams: () => `'args.params' must be an object or array if provided.`,
    invalidLoggerObject: () => `'args.logger' must be an object if provided.`,
    invalidLoggerMethod: method => `'args.logger' must include required method '${method}'.`
  },
  info: {
    connected: chainId => `Upbond: Connected to chain with ID "${chainId}".`
  },
  warnings: {
    // deprecated methods
    enableDeprecation: 'Upbond: ""ethereum.enable()" is deprecated and may be removed in the future. ' + 'Please use "ethereum.send("eth_requestAccounts")" instead. For more information, see: https://eips.ethereum.org/EIPS/eip-1102',
    sendDeprecation: 'Upbond: "ethereum.send(...)" is deprecated and may be removed in the future.' + ' Please use "ethereum.sendAsync(...)" or "ethereum.request(...)" instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193',
    events: {
      close: 'Upbond: The event "close" is deprecated and may be removed in the future. Please use "disconnect" instead.' + "\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193",
      data: 'Upbond: The event "data" is deprecated and will be removed in the future.' + 'Use "message" instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193#message',
      networkChanged: 'Upbond: The event "networkChanged" is deprecated and may be removed in the future.' + ' Please use "chainChanged" instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193',
      notification: 'Upbond: The event "notification" is deprecated and may be removed in the future. ' + 'Please use "message" instead.\nFor more information, see: https://eips.ethereum.org/EIPS/eip-1193'
    },
    publicConfigStore: 'Upbond: The property "publicConfigStore" is deprecated and WILL be removed in the future.'
  }
});
;// CONCATENATED MODULE: ./src/utils.ts
// import { get } from "@toruslabs/http-helpers";





const {
  paymentProviders: utils_paymentProviders
} = config;
const defaultLoginParam = {
  "upbond-line": {
    name: "LINE",
    description: "LINE",
    typeOfLogin: "line",
    loginProvider: "upbond-line",
    jwtParameters: {
      domain: "https://lzg2dndj.auth.dev.upbond.io",
      connection: "line",
      clientId: "FoQ_Ri8rKSXkHf82GRzZK",
      scope: "openid email profile offline_access"
    },
    clientId: "BGbtA2oA0SYvm1fipIPaSgSTPfGJG8Q6Ep_XHuZY9qQVW5jUXTMd0l8xVtXPx91aCmFfuVqTZt9CK79BgHTNanU",
    showOnModal: true,
    showOnDesktop: true,
    showOnMobile: true,
    mainOption: true,
    priority: 1,
    customLogo: "line",
    logo: "https://elvira.co.th/wp-content/uploads/2016/02/line-icon.png",
    buttonBgColor: "#289B2A",
    buttonTextColor: "#f3f3f3"
  },
  "upbond-google": {
    name: "Google",
    description: "Google",
    typeOfLogin: "jwt",
    loginProvider: "upbond-google",
    jwtParameters: {
      domain: "https://lzg2dndj.auth.dev.upbond.io",
      connection: "line",
      clientId: "hxFv4SaQVXv3tE_rhe5u9",
      scope: "openid email profile offline_access"
    },
    clientId: "BGbtA2oA0SYvm1fipIPaSgSTPfGJG8Q6Ep_XHuZY9qQVW5jUXTMd0l8xVtXPx91aCmFfuVqTZt9CK79BgHTNanU",
    showOnModal: true,
    showOnDesktop: true,
    showOnMobile: true,
    mainOption: true,
    priority: 2,
    customLogo: "google",
    logo: "https://www.seekpng.com/png/full/788-7887426_google-g-png-google-logo-white-png.png",
    buttonBgColor: "#4B68AE",
    buttonTextColor: "#FFF"
  }
};
const defaultLoginParamStg = {
  "upbond-line": {
    name: "LINE",
    description: "LINE",
    typeOfLogin: "line",
    loginProvider: "upbond-line",
    jwtParameters: {
      domain: "https://6a8e4595.auth.stg.upbond.io",
      connection: "line",
      clientId: "YQvxSsSNOIFgoEwZoiPdm",
      scope: "openid email profile offline_access"
    },
    clientId: "BGbtA2oA0SYvm1fipIPaSgSTPfGJG8Q6Ep_XHuZY9qQVW5jUXTMd0l8xVtXPx91aCmFfuVqTZt9CK79BgHTNanU",
    showOnModal: true,
    showOnDesktop: true,
    showOnMobile: true,
    mainOption: true,
    priority: 1,
    customLogo: "line",
    logo: "https://elvira.co.th/wp-content/uploads/2016/02/line-icon.png",
    buttonBgColor: "#289B2A",
    buttonTextColor: "#f3f3f3"
  },
  "upbond-google": {
    name: "Google",
    description: "Google",
    typeOfLogin: "jwt",
    loginProvider: "upbond-google",
    jwtParameters: {
      domain: "https://6a8e4595.auth.stg.upbond.io",
      connection: "line",
      clientId: "zYvDxb22eVYLqDMAp_ql9",
      scope: "openid email profile offline_access"
    },
    clientId: "BGbtA2oA0SYvm1fipIPaSgSTPfGJG8Q6Ep_XHuZY9qQVW5jUXTMd0l8xVtXPx91aCmFfuVqTZt9CK79BgHTNanU",
    showOnModal: true,
    showOnDesktop: true,
    showOnMobile: true,
    mainOption: true,
    priority: 2,
    customLogo: "google",
    logo: "https://www.seekpng.com/png/full/788-7887426_google-g-png-google-logo-white-png.png",
    buttonBgColor: "#4B68AE",
    buttonTextColor: "#FFF"
  }
};
const defaultLoginParamProd = {
  "upbond-line": {
    name: "LINE",
    description: "LINE",
    typeOfLogin: "line",
    loginProvider: "upbond-line",
    jwtParameters: {
      domain: "https://auth.upbond.io",
      connection: "line",
      clientId: "wa3wjaB0dx0RO9AgzngM-",
      scope: "openid email profile offline_access"
    },
    clientId: "BKmNTSQ7y8yWyhNT_W5BobaAu7Re-zLW6fzK0bzdvjP9a-G4OP8ajriQJHFOH3ypvRIJeEp_O40aag-7iNTyp-s",
    showOnModal: true,
    showOnDesktop: true,
    showOnMobile: true,
    mainOption: true,
    priority: 1,
    customLogo: "line",
    logo: "https://elvira.co.th/wp-content/uploads/2016/02/line-icon.png",
    buttonBgColor: "#289B2A",
    buttonTextColor: "#f3f3f3"
  },
  "upbond-google": {
    name: "Google",
    description: "Google",
    typeOfLogin: "jwt",
    loginProvider: "upbond-google",
    jwtParameters: {
      domain: "https://auth.upbond.io",
      connection: "line",
      clientId: "hxFv4SaQVXv3tE_rhe5u9",
      scope: "openid email profile offline_access"
    },
    clientId: "BKmNTSQ7y8yWyhNT_W5BobaAu7Re-zLW6fzK0bzdvjP9a-G4OP8ajriQJHFOH3ypvRIJeEp_O40aag-7iNTyp-s",
    showOnModal: true,
    showOnDesktop: true,
    showOnMobile: true,
    mainOption: true,
    priority: 2,
    customLogo: "google",
    logo: "https://www.seekpng.com/png/full/788-7887426_google-g-png-google-logo-white-png.png",
    buttonBgColor: "#4B68AE",
    buttonTextColor: "#FFF"
  }
};
const validatePaymentProvider = (provider, params) => {
  const errors = {};
  if (!provider) {
    return {
      errors,
      isValid: true
    };
  }
  if (provider && !utils_paymentProviders[provider]) {
    errors.provider = "Invalid Provider";
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  }
  const selectedProvider = utils_paymentProviders[provider];
  const selectedParams = params || {};

  // set default values
  // if (!selectedParams.selectedCurrency) [selectedParams.selectedCurrency] = selectedProvider.validCurrencies
  // if (!selectedParams.fiatValue) selectedParams.fiatValue = selectedProvider.minOrderValue
  // if (!selectedParams.selectedCryptoCurrency) [selectedParams.selectedCryptoCurrency] = selectedProvider.validCryptoCurrencies

  // validations
  if (selectedParams.fiatValue) {
    const requestedOrderAmount = +parseFloat(selectedParams.fiatValue.toString()) || 0;
    if (requestedOrderAmount < selectedProvider.minOrderValue) errors.fiatValue = "Requested amount is lower than supported";
    if (requestedOrderAmount > selectedProvider.maxOrderValue && selectedProvider.enforceMax) errors.fiatValue = "Requested amount is higher than supported";
  }
  if (selectedParams.selectedCurrency && !selectedProvider.validCurrencies.includes(selectedParams.selectedCurrency)) {
    errors.selectedCurrency = "Unsupported currency";
  }
  if (selectedParams.selectedCryptoCurrency) {
    const validCryptoCurrenciesByChain = Object.values(selectedProvider.validCryptoCurrenciesByChain).flat().map(currency => currency.value);
    const finalCryptoCurrency = provider === PAYMENT_PROVIDER.MOONPAY ? selectedParams.selectedCryptoCurrency.toLowerCase() : selectedParams.selectedCryptoCurrency;
    if (validCryptoCurrenciesByChain && !validCryptoCurrenciesByChain.includes(finalCryptoCurrency)) errors.selectedCryptoCurrency = "Unsupported cryptoCurrency";
  }
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

// utility functions

/**
 * json-rpc-engine middleware that logs RPC errors and and validates req.method.
 *
 * @param log - The logging API to use.
 * @returns  json-rpc-engine middleware function
 */
function createErrorMiddleware() {
  return (req, res, next) => {
    // json-rpc-engine will terminate the request when it notices this error
    if (typeof req.method !== "string" || !req.method) {
      res.error = external_eth_rpc_errors_namespaceObject.ethErrors.rpc.invalidRequest({
        message: `The request 'method' must be a non-empty string.`,
        data: req
      });
    }
    next(done => {
      const {
        error
      } = res;
      if (!error) {
        return done();
      }
      loglevel.error(`MetaMask - RPC Error: ${error.message}`, error);
      return done();
    });
  };
}

// resolve response.result or response, reject errors
const getRpcPromiseCallback = function (resolve, reject) {
  let unwrapResult = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return (error, response) => {
    if (error || response.error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      reject(error || response.error);
    } else {
      resolve(!unwrapResult || Array.isArray(response) ? response : response.result);
    }
  };
};

/**
 * Logs a stream disconnection error. Emits an 'error' if given an
 * EventEmitter that has listeners for the 'error' event.
 *
 * @param log - The logging API to use.
 * @param remoteLabel - The label of the disconnected stream.
 * @param error - The associated error to log.
 * @param emitter - The logging API to use.
 */
function logStreamDisconnectWarning(remoteLabel, error, emitter) {
  let warningMsg = `MetaMask: Lost connection to "${remoteLabel}".`;
  if (error?.stack) {
    warningMsg += `\n${error.stack}`;
  }
  loglevel.warn(warningMsg);
  if (emitter && emitter.listenerCount("error") > 0) {
    emitter.emit("error", warningMsg);
  }
}
const getPreopenInstanceId = () => Math.random().toString(36).slice(2);
const getUpbondWalletUrl = async (buildEnv, integrity) => {
  loglevel.info("Opening torus URL!");
  let torusUrl;
  let logLevel;
  // log.info("version used: ", versionUsed);
  switch (buildEnv) {
    /*
    Default the default to v2
    */
    case "production":
    case "v1_production":
    case "v2_production":
      torusUrl = `https://login.upbond.io`;
      logLevel = "info";
      break;
    case "staging":
    case "v1_staging":
    case "v2_staging":
      torusUrl = "https://login.stg.upbond.io";
      logLevel = "info";
      break;
    case "development":
    case "v1_development":
    case "v2_development":
    case "testing":
      torusUrl = "https:/login.dev.upbond.io";
      logLevel = "debug";
      break;
    case "local":
    case "v2_local":
      torusUrl = "https://login3-made.dev.upbond.io";
      logLevel = "debug";
      break;
    case "wallet-did":
      torusUrl = "https://wallet-did.dev.upbond.io";
      logLevel = "debug";
      break;
    case "mpc-dev":
      torusUrl = "https://login-mpc.dev.upbond.io";
      logLevel = "debug";
      break;
    default:
      torusUrl = `https://login.upbond.io`;
      logLevel = "info";
      break;
  }
  return {
    torusUrl,
    logLevel
  };
};
const getUserLanguage = () => {
  let userLanguage = window.navigator.language || "en-US";
  const userLanguages = userLanguage.split("-");
  userLanguage = Object.prototype.hasOwnProperty.call(config.translations, userLanguages[0]) ? userLanguages[0] : "en";
  return userLanguage;
};
const EMITTED_NOTIFICATIONS = ["eth_subscription" // per eth-json-rpc-filters/subscriptionManager
];

const NOOP = () => {
  // empty function
};
const FEATURES_PROVIDER_CHANGE_WINDOW = "directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=660,width=375";
const FEATURES_DEFAULT_WALLET_WINDOW = "directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=740,width=1315";
const FEATURES_DEFAULT_POPUP_WINDOW = "directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=700,width=1200";
const FEATURES_CONFIRM_WINDOW = "directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=700,width=450";
function getPopupFeatures() {
  // Fixes dual-screen position                             Most browsers      Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
  const w = 1200;
  const h = 700;
  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width;
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height;
  const systemZoom = 1; // No reliable estimate

  const left = Math.abs((width - w) / 2 / systemZoom + dualScreenLeft);
  const top = Math.abs((height - h) / 2 / systemZoom + dualScreenTop);
  const features = `titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=${h / systemZoom},width=${w / systemZoom},top=${top},left=${left}`;
  return features;
}
const searchToObject = search => {
  return search.substring(1).split("&").reduce(function (result, value) {
    const parts = value.split("=");
    if (parts[0]) result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
    return result;
  }, {});
};
const parseIdToken = function (token) {
  let pureJwt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (pureJwt) {
    const json = decodeURIComponent(window.atob(token).split("").map(c => {
      return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
    }).join(""));
    return JSON.parse(json);
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(window.atob(base64).split("").map(c => {
    return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
  }).join(""));
  return JSON.parse(jsonPayload);
};
;// CONCATENATED MODULE: ./src/inpage-provider.ts

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { defineProperty_default()(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }









openlogin_jrpc_namespaceObject.SafeEventEmitter.defaultMaxListeners = 100;

// resolve response.result, reject errors
const inpage_provider_getRpcPromiseCallback = function (resolve, reject) {
  let unwrapResult = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return (error, response) => {
    if (error || response.error) {
      return reject(error || response.error);
    }
    return !unwrapResult || Array.isArray(response) ? resolve(response) : resolve(response.result);
  };
};
class UpbondInpageProvider extends openlogin_jrpc_namespaceObject.SafeEventEmitter {
  /**
   * The chain ID of the currently connected Ethereum chain.
   * See [chainId.network]{@link https://chainid.network} for more information.
   */

  /**
   * The user's currently selected Ethereum address.
   * If null, MetaMask is either locked or the user has not permitted any
   * addresses to be viewed.
   */

  /**
   * Indicating that this provider is a MetaMask provider.
   */

  constructor(connectionStream) {
    let {
      maxEventListeners = 100,
      shouldSendMetadata = true,
      jsonRpcStreamName = "provider"
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super();
    defineProperty_default()(this, "chainId", void 0);
    defineProperty_default()(this, "selectedAddress", void 0);
    defineProperty_default()(this, "_rpcEngine", void 0);
    defineProperty_default()(this, "networkVersion", void 0);
    defineProperty_default()(this, "shouldSendMetadata", void 0);
    defineProperty_default()(this, "isUpbond", void 0);
    defineProperty_default()(this, "_publicConfigStore", void 0);
    defineProperty_default()(this, "tryPreopenHandle", void 0);
    defineProperty_default()(this, "enable", void 0);
    defineProperty_default()(this, "_state", void 0);
    defineProperty_default()(this, "_jsonRpcConnection", void 0);
    defineProperty_default()(this, "_sentWarnings", {
      // methods
      enable: false,
      experimentalMethods: false,
      send: false,
      publicConfigStore: false,
      // events
      events: {
        close: false,
        data: false,
        networkChanged: false,
        notification: false
      }
    });
    if (!(0,external_is_stream_namespaceObject.duplex)(connectionStream)) {
      throw new Error(messages.errors.invalidDuplexStream());
    }
    this.isUpbond = true;
    this.setMaxListeners(maxEventListeners);

    // private state
    this._state = _objectSpread({}, UpbondInpageProvider._defaultState);

    // public state
    this.selectedAddress = null;
    this.networkVersion = null;
    this.chainId = null;
    this.shouldSendMetadata = shouldSendMetadata;

    // bind functions (to prevent e.g. web3@1.x from making unbound calls)
    this._handleAccountsChanged = this._handleAccountsChanged.bind(this);
    this._handleChainChanged = this._handleChainChanged.bind(this);
    this._handleUnlockStateChanged = this._handleUnlockStateChanged.bind(this);
    this._handleConnect = this._handleConnect.bind(this);
    this._handleDisconnect = this._handleDisconnect.bind(this);
    this._handleStreamDisconnect = this._handleStreamDisconnect.bind(this);
    this._sendSync = this._sendSync.bind(this);
    this._rpcRequest = this._rpcRequest.bind(this);
    this._warnOfDeprecation = this._warnOfDeprecation.bind(this);
    this._initializeState = this._initializeState.bind(this);
    this.request = this.request.bind(this);
    this.send = this.send.bind(this);
    this.sendAsync = this.sendAsync.bind(this);
    // this.enable = this.enable.bind(this);

    // setup connectionStream multiplexing
    const mux = new openlogin_jrpc_namespaceObject.ObjectMultiplex();
    pump_default()(connectionStream, mux, connectionStream, this._handleStreamDisconnect.bind(this, "MetaMask"));

    // subscribe to metamask public config (one-way)
    this._publicConfigStore = new obs_store_namespaceObject.ObservableStore({
      storageKey: "Metamask-Config"
    });

    // handle isUnlocked changes, and chainChanged and networkChanged events
    // this._publicConfigStore.subscribe((stringifiedState) => {
    //   // This is because we are using store as string
    //   const state = JSON.parse(stringifiedState as unknown as string);
    //   if ("isUnlocked" in state && state.isUnlocked !== this._state.isUnlocked) {
    //     this._state.isUnlocked = state.isUnlocked;
    //     if (!this._state.isUnlocked) {
    //       // accounts are never exposed when the extension is locked
    //       this._handleAccountsChanged([]);
    //     } else {
    //       // this will get the exposed accounts, if any
    //       try {
    //         this._rpcRequest(
    //           { method: "eth_accounts", params: [] },
    //           NOOP,
    //           true // indicating that eth_accounts _should_ update accounts
    //         );
    //       } catch (_) {
    //         // Swallow error
    //       }
    //     }
    //   }

    //   if ("selectedAddress" in state && this.selectedAddress !== state.selectedAddress) {
    //     try {
    //       this._rpcRequest(
    //         { method: "eth_accounts", params: [] },
    //         NOOP,
    //         true // indicating that eth_accounts _should_ update accounts
    //       );
    //     } catch (_) {
    //       // Swallow error
    //     }
    //   }

    //   // Emit chainChanged event on chain change
    //   if ("chainId" in state && state.chainId !== this.chainId) {
    //     this.chainId = state.chainId || null;
    //     this.emit("chainChanged", this.chainId);

    //     // indicate that we've connected, for EIP-1193 compliance
    //     // we do this here so that iframe can initialize
    //     if (!this._state.hasEmittedConnection) {
    //       this._handleConnect(this.chainId);
    //       this._state.hasEmittedConnection = true;
    //     }
    //   }
    pump_default()(mux.createStream("publicConfig"), (0,obs_store_namespaceObject.storeAsStream)(this._publicConfigStore),
    // RPC requests should still work if only this stream fails
    logStreamDisconnectWarning.bind(this, "MetaMask PublicConfigStore"));
    // ignore phishing warning message (handled elsewhere)
    mux.ignoreStream("phishing");

    // setup own event listeners

    // EIP-1193 connect
    this.on("connect", () => {
      this._state.isConnected = true;
    });

    // connect to async provider
    const jsonRpcConnection = (0,openlogin_jrpc_namespaceObject.createStreamMiddleware)();
    pump_default()(jsonRpcConnection.stream, mux.createStream(jsonRpcStreamName), jsonRpcConnection.stream, this._handleStreamDisconnect.bind(this, "MetaMask RpcProvider"));

    // handle RPC requests via dapp-side rpc engine
    const rpcEngine = new openlogin_jrpc_namespaceObject.JRPCEngine();
    rpcEngine.push((0,openlogin_jrpc_namespaceObject.createIdRemapMiddleware)());
    rpcEngine.push(createErrorMiddleware());
    rpcEngine.push(jsonRpcConnection.middleware);
    this._rpcEngine = rpcEngine;

    // json rpc notification listener
    jsonRpcConnection.events.on("notification", payload => {
      const {
        method,
        params
      } = payload;
      if (method === "wallet_accountsChanged") {
        this._handleAccountsChanged(params);
      } else if (method === "wallet_unlockStateChanged") {
        this._handleUnlockStateChanged(params);
      } else if (method === "wallet_chainChanged") {
        this._handleChainChanged(params);
      } else if (EMITTED_NOTIFICATIONS.includes(payload.method)) {
        // EIP 1193 subscriptions, per eth-json-rpc-filters/subscriptionManager
        this.emit("data", payload); // deprecated
        this.emit("notification", params.result);
        this.emit("message", {
          type: method,
          data: params
        });
      }

      // Backward compatibility for older non EIP 1193 subscriptions
      // this.emit('data', null, payload)
    });
  }

  get publicConfigStore() {
    if (!this._sentWarnings.publicConfigStore) {
      loglevel.warn(messages.warnings.publicConfigStore);
      this._sentWarnings.publicConfigStore = true;
    }
    return this._publicConfigStore;
  }

  /**
   * Returns whether the inpage provider is connected to Torus.
   */
  isConnected() {
    return this._state.isConnected;
  }

  /**
   * Submits an RPC request for the given method, with the given params.
   * Resolves with the result of the method call, or rejects on error.
   *
   * @param args - The RPC request arguments.
   * @returns A Promise that resolves with the result of the RPC method,
   * or rejects if an error is encountered.
   */
  async request(args) {
    if (!args || typeof args !== "object" || Array.isArray(args)) {
      throw external_eth_rpc_errors_namespaceObject.ethErrors.rpc.invalidRequest({
        message: messages.errors.invalidRequestArgs(),
        data: args
      });
    }
    const {
      method,
      params
    } = args;
    if (typeof method !== "string" || method.length === 0) {
      throw external_eth_rpc_errors_namespaceObject.ethErrors.rpc.invalidRequest({
        message: messages.errors.invalidRequestMethod(),
        data: args
      });
    }
    if (params !== undefined && !Array.isArray(params) && (typeof params !== "object" || params === null)) {
      throw external_eth_rpc_errors_namespaceObject.ethErrors.rpc.invalidRequest({
        message: messages.errors.invalidRequestParams(),
        data: args
      });
    }
    return new Promise((resolve, reject) => {
      this._rpcRequest({
        method,
        params
      }, inpage_provider_getRpcPromiseCallback(resolve, reject));
    });
  }

  /**
   * Submits an RPC request per the given JSON-RPC request object.
   *
   * @param payload - The RPC request object.
   * @param cb - The callback function.
   */
  sendAsync(payload, callback) {
    this._rpcRequest(payload, callback);
  }

  /**
   * We override the following event methods so that we can warn consumers
   * about deprecated events:
   *   addListener, on, once, prependListener, prependOnceListener
   */

  addListener(eventName, listener) {
    this._warnOfDeprecation(eventName);
    return super.addListener(eventName, listener);
  }
  on(eventName, listener) {
    this._warnOfDeprecation(eventName);
    return super.on(eventName, listener);
  }
  once(eventName, listener) {
    this._warnOfDeprecation(eventName);
    return super.once(eventName, listener);
  }
  prependListener(eventName, listener) {
    this._warnOfDeprecation(eventName);
    return super.prependListener(eventName, listener);
  }
  prependOnceListener(eventName, listener) {
    this._warnOfDeprecation(eventName);
    return super.prependOnceListener(eventName, listener);
  }

  // Private Methods
  //= ===================
  /**
   * Constructor helper.
   * Populates initial state by calling 'wallet_getProviderState' and emits
   * necessary events.
   */
  async _initializeState() {
    try {
      const {
        accounts,
        chainId,
        isUnlocked,
        networkVersion
      } = await this.request({
        method: "wallet_getProviderState"
      });

      // indicate that we've connected, for EIP-1193 compliance
      this.emit("connect", {
        chainId
      });
      this._handleChainChanged({
        chainId,
        networkVersion
      });
      this._handleUnlockStateChanged({
        accounts,
        isUnlocked
      });
      this._handleAccountsChanged(accounts);
    } catch (error) {
      loglevel.error("MetaMask: Failed to get initial state. Please report this bug.", error);
      throw new Error(error);
    } finally {
      this._state.initialized = true;
      this.emit("_initialized");
    }
  }

  /**
   * Internal RPC method. Forwards requests to background via the RPC engine.
   * Also remap ids inbound and outbound.
   * ::dwiyan::
   * @param payload - The RPC request object.
   * @param callback - The consumer's callback.
   * @param isInternal - false - Whether the request is internal.
   */
  _rpcRequest(payload, callback) {
    let isInternal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let cb = callback;
    const _payload = payload;
    if (!Array.isArray(_payload)) {
      if (!_payload.jsonrpc) {
        _payload.jsonrpc = "2.0";
      }
      if (_payload.method === "eth_accounts" || _payload.method === "eth_requestAccounts") {
        // handle accounts changing
        cb = (err, res) => {
          this._handleAccountsChanged(res.result || [], _payload.method === "eth_accounts", isInternal);
          callback(err, res);
        };
      } else if (_payload.method === "wallet_getProviderState") {
        this._rpcEngine.handle(payload, cb);
        return;
      }
    }
    this.tryPreopenHandle(_payload, cb);
  }

  /**
   * Submits an RPC request for the given method, with the given params.
   *
   * @deprecated Use "request" instead.
   * @param method - The method to request.
   * @param params - Any params for the method.
   * @returns A Promise that resolves with the JSON-RPC response object for the
   * request.
   */

  send(methodOrPayload, callbackOrArgs) {
    if (!this._sentWarnings.send) {
      loglevel.warn(messages.warnings.sendDeprecation);
      this._sentWarnings.send = true;
    }
    if (typeof methodOrPayload === "string" && (!callbackOrArgs || Array.isArray(callbackOrArgs))) {
      return new Promise((resolve, reject) => {
        try {
          this._rpcRequest({
            method: methodOrPayload,
            params: callbackOrArgs
          }, inpage_provider_getRpcPromiseCallback(resolve, reject, false));
        } catch (error) {
          reject(error);
        }
      });
    }
    if (methodOrPayload && typeof methodOrPayload === "object" && typeof callbackOrArgs === "function") {
      return this._rpcRequest(methodOrPayload, callbackOrArgs);
    }
    return this._sendSync(methodOrPayload);
  }

  /**
   * DEPRECATED.
   * Internal backwards compatibility method, used in send.
   */
  _sendSync(payload) {
    let result;
    switch (payload.method) {
      case "eth_accounts":
        result = this.selectedAddress ? [this.selectedAddress] : [];
        break;
      case "eth_coinbase":
        result = this.selectedAddress || null;
        break;
      case "eth_uninstallFilter":
        this._rpcRequest(payload, NOOP);
        result = true;
        break;
      case "net_version":
        result = this.networkVersion || null;
        break;
      default:
        throw new Error(messages.errors.unsupportedSync(payload.method));
    }
    return {
      id: payload.id,
      jsonrpc: payload.jsonrpc,
      result
    };
  }

  /**
   * When the provider becomes connected, updates internal state and emits
   * required events. Idempotent.
   *
   * @param chainId - The ID of the newly connected chain.
   * emits MetaMaskInpageProvider#connect
   */
  _handleConnect(chainId) {
    if (!this._state.isConnected) {
      this._state.isConnected = true;
      this.emit("connect", {
        chainId
      });
    }
  }

  /**
   * When the provider becomes disconnected, updates internal state and emits
   * required events. Idempotent with respect to the isRecoverable parameter.
   *
   * Error codes per the CloseEvent status codes as required by EIP-1193:
   * https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes
   *
   * @param isRecoverable - Whether the disconnection is recoverable.
   * @param errorMessage - A custom error message.
   * emits MetaMaskInpageProvider#disconnect
   */
  _handleDisconnect(isRecoverable, errorMessage) {
    if (this._state.isConnected || !this._state.isPermanentlyDisconnected && !isRecoverable) {
      this._state.isConnected = false;
      let error;
      if (isRecoverable) {
        error = new external_eth_rpc_errors_namespaceObject.EthereumRpcError(1013,
        // Try again later
        errorMessage || messages.errors.disconnected());
        loglevel.debug(error);
      } else {
        error = new external_eth_rpc_errors_namespaceObject.EthereumRpcError(1011,
        // Internal error
        errorMessage || messages.errors.permanentlyDisconnected());
        loglevel.error(error);
        this.chainId = null;
        this._state.accounts = null;
        this.selectedAddress = null;
        this._state.isUnlocked = false;
        this._state.isPermanentlyDisconnected = true;
      }
      this.emit("disconnect", error);
    }
  }

  /**
   * Called when connection is lost to critical streams.
   *
   * emits MetamaskInpageProvider#disconnect
   */
  _handleStreamDisconnect(streamName, error) {
    logStreamDisconnectWarning(streamName, error, this);
    this._handleDisconnect(false, error ? error.message : undefined);
  }

  /**
   * Called when accounts may have changed.
   */
  _handleAccountsChanged(accounts) {
    let isEthAccounts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let isInternal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    // defensive programming
    let finalAccounts = accounts;
    if (!Array.isArray(finalAccounts)) {
      loglevel.error("MetaMask: Received non-array accounts parameter. Please report this bug.", finalAccounts);
      finalAccounts = [];
    }
    for (const account of accounts) {
      if (typeof account !== "string") {
        loglevel.error("MetaMask: Received non-string account. Please report this bug.", accounts);
        finalAccounts = [];
        break;
      }
    }

    // emit accountsChanged if anything about the accounts array has changed
    if (!external_fast_deep_equal_default()(this._state.accounts, finalAccounts)) {
      // we should always have the correct accounts even before eth_accounts
      // returns, except in cases where isInternal is true
      if (isEthAccounts && Array.isArray(this._state.accounts) && this._state.accounts.length > 0 && !isInternal) {
        loglevel.error('MetaMask: "eth_accounts" unexpectedly updated accounts. Please report this bug.', finalAccounts);
      }
      this._state.accounts = finalAccounts;
      this.emit("accountsChanged", finalAccounts);
    }

    // handle selectedAddress
    if (this.selectedAddress !== finalAccounts[0]) {
      this.selectedAddress = finalAccounts[0] || null;
    }
  }

  /**
   * Upon receipt of a new chainId and networkVersion, emits corresponding
   * events and sets relevant public state.
   * Does nothing if neither the chainId nor the networkVersion are different
   * from existing values.
   *
   * emits MetamaskInpageProvider#chainChanged
   * @param networkInfo - An object with network info.
   */
  _handleChainChanged() {
    let {
      chainId,
      networkVersion
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (!chainId || !networkVersion) {
      loglevel.error("MetaMask: Received invalid network parameters. Please report this bug.", {
        chainId,
        networkVersion
      });
      return;
    }
    if (networkVersion === "loading") {
      this._handleDisconnect(true);
    } else {
      this._handleConnect(chainId);
      if (chainId !== this.chainId) {
        this.chainId = chainId;
        if (this._state.initialized) {
          this.emit("chainChanged", this.chainId);
        }
      }
    }
  }

  /**
   * Upon receipt of a new isUnlocked state, sets relevant public state.
   * Calls the accounts changed handler with the received accounts, or an empty
   * array.
   *
   * Does nothing if the received value is equal to the existing value.
   * There are no lock/unlock events.
   *
   * @param opts - Options bag.
   */
  _handleUnlockStateChanged() {
    let {
      accounts,
      isUnlocked
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (typeof isUnlocked !== "boolean") {
      loglevel.error("MetaMask: Received invalid isUnlocked parameter. Please report this bug.", {
        isUnlocked
      });
      return;
    }
    if (isUnlocked !== this._state.isUnlocked) {
      this._state.isUnlocked = isUnlocked;
      this._handleAccountsChanged(accounts || []);
    }
  }

  /**
   * Warns of deprecation for the given event, if applicable.
   */
  _warnOfDeprecation(eventName) {
    if (this._sentWarnings.events[eventName] === false) {
      loglevel.warn(messages.warnings.events[eventName]);
      this._sentWarnings.events[eventName] = true;
    }
  }
}
defineProperty_default()(UpbondInpageProvider, "_defaultState", {
  accounts: null,
  isConnected: false,
  isUnlocked: false,
  initialized: false,
  isPermanentlyDisconnected: false,
  hasEmittedConnection: false
});
/* harmony default export */ const inpage_provider = (UpbondInpageProvider);
;// CONCATENATED MODULE: external "create-hash"
const external_create_hash_namespaceObject = require("create-hash");
var external_create_hash_default = /*#__PURE__*/__webpack_require__.n(external_create_hash_namespaceObject);
;// CONCATENATED MODULE: ./src/integrity.ts

const defaults = options => ({
  algorithms: options.algorithms || ["sha256"],
  delimiter: options.delimiter || " ",
  full: options.full || false
});

// Generate list of hashes
const hashes = (options, data) => {
  const internalHashes = {};
  options.algorithms.forEach(algorithm => {
    internalHashes[algorithm] = external_create_hash_default()(algorithm).update(data, "utf8").digest("base64");
  });
  return internalHashes;
};
// Build an integrity string
const integrity = (options, sri) => {
  let output = "";

  // Hash list
  output += Object.keys(sri.hashes).map(algorithm => `${algorithm}-${sri.hashes[algorithm]}`).join(options.delimiter);
  return output;
};
const main = (options, data) => {
  // Defaults
  const finalOptions = defaults(options);
  const sri = {
    hashes: hashes(finalOptions, data),
    integrity: undefined
  };
  sri.integrity = integrity(finalOptions, sri);
  return finalOptions.full ? sri : sri.integrity;
};
/* harmony default export */ const src_integrity = (main);
;// CONCATENATED MODULE: external "events"
const external_events_namespaceObject = require("events");
;// CONCATENATED MODULE: ./src/PopupHandler.ts



class PopupHandler extends external_events_namespaceObject.EventEmitter {
  constructor(_ref) {
    let {
      url,
      features
    } = _ref;
    super();
    defineProperty_default()(this, "url", void 0);
    defineProperty_default()(this, "target", void 0);
    defineProperty_default()(this, "features", void 0);
    defineProperty_default()(this, "window", void 0);
    defineProperty_default()(this, "windowTimer", void 0);
    defineProperty_default()(this, "iClosedWindow", void 0);
    this.url = url;
    this.target = "_blank";
    this.features = features || getPopupFeatures();
    this.window = undefined;
    this.windowTimer = undefined;
    this.iClosedWindow = false;
    this._setupTimer();
  }
  _setupTimer() {
    this.windowTimer = Number(setInterval(() => {
      if (this.window && this.window.closed) {
        clearInterval(this.windowTimer);
        if (!this.iClosedWindow) {
          this.emit("close");
        }
        this.iClosedWindow = false;
        this.window = undefined;
      }
      if (this.window === undefined) clearInterval(this.windowTimer);
    }, 500));
  }
  open() {
    this.window = window.open(this.url.href, "_blank");
    if (this.window?.focus) this.window.focus();
    return Promise.resolve();
  }
  close() {
    this.iClosedWindow = true;
    if (this.window) this.window.close();
  }
  redirect(locationReplaceOnRedirect) {
    if (locationReplaceOnRedirect) {
      window.location.replace(this.url.href);
    } else {
      window.location.href = this.url.href;
    }
  }
}
/* harmony default export */ const src_PopupHandler = (PopupHandler);
;// CONCATENATED MODULE: ./src/siteMetadata.ts




/**
 * Returns whether the given image URL exists
 * @param url - the url of the image
 * @returns - whether the image exists
 */
function imgExists(url) {
  return new Promise((resolve, reject) => {
    try {
      const img = document.createElement("img");
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Extracts a name for the site from the DOM
 */
const getSiteName = window => {
  const {
    document
  } = window;
  const siteName = document.querySelector('head > meta[property="og:site_name"]');
  if (siteName) {
    return siteName.content;
  }
  const metaTitle = document.querySelector('head > meta[name="title"]');
  if (metaTitle) {
    return metaTitle.content;
  }
  if (document.title && document.title.length > 0) {
    return document.title;
  }
  return window.location.hostname;
};

/**
 * Extracts an icon for the site from the DOM
 */
async function getSiteIcon(window) {
  const {
    document
  } = window;

  // Use the site's favicon if it exists
  let icon = document.querySelector('head > link[rel="shortcut icon"]');
  if (icon && (await imgExists(icon.href))) {
    return icon.href;
  }

  // Search through available icons in no particular order
  icon = Array.from(document.querySelectorAll('head > link[rel="icon"]')).find(_icon => Boolean(_icon.href));
  if (icon && (await imgExists(icon.href))) {
    return icon.href;
  }
  return null;
}

/**
 * Gets site metadata and returns it
 *
 */
const getSiteMetadata = async () => ({
  name: getSiteName(window),
  icon: await getSiteIcon(window)
});

/**
 * Sends site metadata over an RPC request.
 */
async function sendSiteMetadata(engine) {
  try {
    const domainMetadata = await getSiteMetadata();
    // call engine.handle directly to avoid normal RPC request handling
    engine.handle({
      jsonrpc: "2.0",
      id: getPreopenInstanceId(),
      method: "wallet_sendDomainMetadata",
      params: domainMetadata
    }, NOOP);
  } catch (error) {
    loglevel.error({
      message: messages.errors.sendSiteMetadata(),
      originalError: error
    });
  }
}
;// CONCATENATED MODULE: ./src/embed.ts
/* provided dependency */ var embed_Buffer = __webpack_require__(764)["lW"];


const _excluded = ["host", "chainId", "networkName"];
function embed_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function embed_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? embed_ownKeys(Object(source), !0).forEach(function (key) { defineProperty_default()(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : embed_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
/* eslint-disable no-console */













const defaultVerifiers = {
  [LOGIN_PROVIDER.GOOGLE]: true,
  [LOGIN_PROVIDER.FACEBOOK]: true,
  [LOGIN_PROVIDER.REDDIT]: true,
  [LOGIN_PROVIDER.TWITCH]: true,
  [LOGIN_PROVIDER.DISCORD]: true
};
const iframeIntegrity = "sha384-RhqFseQpufEgNnJYPxNXx+EmyE55iWEWJwkgS7QX/pit6STKFZRf9K9kwmfpDIPw";
const expectedCacheControlHeader = "max-age=3600";
const UNSAFE_METHODS = ["eth_sendTransaction", "eth_signTypedData", "eth_signTypedData_v3", "eth_signTypedData_v4", "personal_sign", "eth_getEncryptionPublicKey", "eth_decrypt"];

// preload for iframe doesn't work https://bugs.chromium.org/p/chromium/issues/detail?id=593267
(async function preLoadIframe() {
  try {
    if (typeof document === "undefined") return;
    const upbondIframeHtml = document.createElement("link");
    const {
      torusUrl
    } = await getUpbondWalletUrl("production", {
      check: false,
      hash: iframeIntegrity,
      version: ""
    });
    upbondIframeHtml.href = `${torusUrl}/popup`;
    upbondIframeHtml.crossOrigin = "anonymous";
    upbondIframeHtml.type = "text/html";
    upbondIframeHtml.rel = "prefetch";
    // if (upbondIframeHtml.relList && upbondIframeHtml.relList.supports) {
    //   if (upbondIframeHtml.relList.supports("prefetch")) {
    //     log.info("IFrame loaded");
    //     document.head.appendChild(upbondIframeHtml);
    //   }
    // }
  } catch (error) {
    loglevel.warn(error);
  }
})();
const ACCOUNT_TYPE = {
  NORMAL: "normal",
  THRESHOLD: "threshold",
  IMPORTED: "imported"
};
class Upbond {
  constructor() {
    let opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    defineProperty_default()(this, "buttonPosition", BUTTON_POSITION.BOTTOM_LEFT);
    defineProperty_default()(this, "buttonSize", void 0);
    defineProperty_default()(this, "torusUrl", void 0);
    defineProperty_default()(this, "upbondIframe", void 0);
    defineProperty_default()(this, "skipDialog", void 0);
    defineProperty_default()(this, "styleLink", void 0);
    defineProperty_default()(this, "isLoggedIn", void 0);
    defineProperty_default()(this, "isInitialized", void 0);
    defineProperty_default()(this, "torusAlert", void 0);
    defineProperty_default()(this, "apiKey", void 0);
    defineProperty_default()(this, "modalZIndex", void 0);
    defineProperty_default()(this, "alertZIndex", void 0);
    defineProperty_default()(this, "torusAlertContainer", void 0);
    defineProperty_default()(this, "isIframeFullScreen", void 0);
    defineProperty_default()(this, "whiteLabel", void 0);
    defineProperty_default()(this, "requestedVerifier", void 0);
    defineProperty_default()(this, "currentVerifier", void 0);
    defineProperty_default()(this, "embedTranslations", void 0);
    defineProperty_default()(this, "ethereum", void 0);
    defineProperty_default()(this, "provider", void 0);
    defineProperty_default()(this, "communicationMux", void 0);
    defineProperty_default()(this, "isUsingDirect", void 0);
    defineProperty_default()(this, "isLoginCallback", void 0);
    defineProperty_default()(this, "dappRedirectUrl", void 0);
    defineProperty_default()(this, "paymentProviders", config.paymentProviders);
    defineProperty_default()(this, "selectedVerifier", void 0);
    defineProperty_default()(this, "buildEnv", void 0);
    defineProperty_default()(this, "widgetConfig", void 0);
    defineProperty_default()(this, "consent", void 0);
    defineProperty_default()(this, "consentConfiguration", void 0);
    defineProperty_default()(this, "flowConfig", void 0);
    defineProperty_default()(this, "idToken", void 0);
    defineProperty_default()(this, "loginHint", "");
    defineProperty_default()(this, "useWalletConnect", void 0);
    defineProperty_default()(this, "isCustomLogin", false);
    this.buttonPosition = opts.buttonPosition || "bottom-left";
    this.buttonSize = opts.buttonSize || 56;
    this.torusUrl = "";
    this.isLoggedIn = false; // ethereum.enable working
    this.isInitialized = false; // init done
    this.requestedVerifier = "";
    this.currentVerifier = "";
    this.apiKey = opts.apiKey || "torus-default";
    (0,http_helpers_namespaceObject.setAPIKey)(this.apiKey);
    this.modalZIndex = opts.modalZIndex || 999999;
    this.alertZIndex = this.modalZIndex + 1000;
    this.isIframeFullScreen = false;
    this.isUsingDirect = false;
    this.buildEnv = "production";
    this.widgetConfig = {
      showAfterLoggedIn: true,
      showBeforeLoggedIn: false
    };
    this.idToken = "";
  }
  async init() {
    let {
      buildEnv = UPBOND_BUILD_ENV.PRODUCTION,
      enableLogging = false,
      // deprecated: use loginConfig instead
      enabledVerifiers = defaultVerifiers,
      network = {
        host: "matic",
        chainId: 137,
        networkName: "Polygon",
        blockExplorer: "https://polygonscan.com/",
        ticker: "MATIC",
        tickerName: "MATIC",
        rpcUrl: "https://polygon-rpc.com"
      },
      loginConfig = defaultLoginParam,
      widgetConfig = this.widgetConfig,
      // default widget config
      integrity = {
        check: false,
        hash: iframeIntegrity,
        version: ""
      },
      whiteLabel,
      skipTKey = false,
      useWalletConnect = false,
      isUsingDirect = true,
      mfaLevel = "default",
      selectedVerifier,
      skipDialog = false,
      dappRedirectUri = window.location.origin,
      consentConfiguration = {
        enable: false,
        config: {
          publicKey: "",
          scope: [],
          origin: ""
        }
      },
      flowConfig = "normal",
      state = ""
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // Send WARNING for deprecated buildEnvs
    // Give message to use others instead
    let buildTempEnv = buildEnv;
    if (buildEnv === "v2_development") {
      console.log(`%c [UPBOND-EMBED] WARNING! This buildEnv is deprecating soon. Please use 'UPBOND_BUILD_ENV.DEVELOPMENT' instead to point wallet on DEVELOPMENT environment.`, "color: #FF0000");
      console.log(`More information, please visit https://github.com/upbond/embed`);
      buildTempEnv = "development";
    }
    if (buildEnv === "v2_production") {
      console.log(`%c [UPBOND-EMBED] WARNING! This buildEnv is deprecating soon. Please use 'UPBOND_BUILD_ENV.PRODUCTION' instead to point wallet on PRODUCTION environment.`, "color: #FF0000");
      console.log(`More information, please visit https://github.com/upbond/embed`);
      buildTempEnv = "production";
    }
    if (buildEnv.includes("v1")) {
      console.log(`%c [UPBOND-EMBED] WARNING! This buildEnv is deprecating soon. Please use 'UPBOND_BUILD_ENV.LOCAL|DEVELOPMENT|STAGING|PRODUCTION' instead to point wallet on each environment`, "color: #FF0000");
      console.log(`More information, please visit https://github.com/upbond/embed`);
    }
    if (state) this.idToken = state;
    buildEnv = buildTempEnv;
    loglevel.info(`Using buildEnv: `, buildEnv);

    // Enable/Disable logging
    if (enableLogging) loglevel.enableAll();else loglevel.disableAll();

    // Check env staging / production, set LoginConfig
    let loginConfigTemp = loginConfig;
    if (JSON.stringify(loginConfig) === JSON.stringify(defaultLoginParam)) {
      // For development, using the defaultloginparam
      // For staging, using defaultLoginParamStg
      if (buildEnv.includes("staging")) loginConfigTemp = defaultLoginParamStg;
      // For production, using defaultLoginParamProd
      if (buildEnv.includes("production")) loginConfigTemp = defaultLoginParamProd;
      loginConfig = loginConfigTemp;
    }
    loglevel.info(`Using login config: `, loginConfig);
    loglevel.info(`Using network config: `, network);
    if (this.isInitialized) throw new Error("Already initialized");
    const {
      torusUrl,
      logLevel
    } = await getUpbondWalletUrl(buildEnv, integrity);
    loglevel.info(`Url Loaded: ${torusUrl} with log: ${logLevel}`);
    if (selectedVerifier) {
      try {
        const isAvailableOnLoginConfig = loginConfig[selectedVerifier];
        if (isAvailableOnLoginConfig) {
          this.selectedVerifier = selectedVerifier;
        } else {
          throw new Error("Selected verifier is not exist on your loginConfig");
        }
      } catch (error) {
        throw new Error("Selected verifier is not exist on your loginConfig");
      }
    }
    this.buildEnv = buildEnv;
    this.skipDialog = skipDialog;
    this.dappRedirectUrl = dappRedirectUri;
    this.isUsingDirect = isUsingDirect;
    this.torusUrl = torusUrl;
    this.whiteLabel = whiteLabel;
    this.useWalletConnect = useWalletConnect;
    this.isCustomLogin = !!(loginConfig && Object.keys(loginConfig).length > 0) || !!(whiteLabel && Object.keys(whiteLabel).length > 0);
    loglevel.setDefaultLevel(logLevel);
    this.consentConfiguration = consentConfiguration;
    this.flowConfig = flowConfig;
    const upbondIframeUrl = new URL(torusUrl);
    if (upbondIframeUrl.pathname.endsWith("/")) upbondIframeUrl.pathname += "popup";else upbondIframeUrl.pathname += "/popup";
    upbondIframeUrl.hash = `#isCustomLogin=${this.isCustomLogin}&isRedirect=${isUsingDirect}&dappRedirectUri=${encodeURIComponent(`${dappRedirectUri}`)}`;

    // Iframe code
    this.upbondIframe = htmlToElement(`<iframe
        id="upbondIframe"
        allow=${useWalletConnect ? "camera" : ""}
        class="upbondIframe"
        src="${upbondIframeUrl.href}"
        style="display: none; position: fixed; top: 0; right: 0; width: 100%;
        height: 100%; border: none; border-radius: 0; z-index: ${this.modalZIndex}"
      ></iframe>`);
    this.torusAlertContainer = htmlToElement('<div id="torusAlertContainer"></div>');
    this.torusAlertContainer.style.display = "none";
    this.torusAlertContainer.style.setProperty("z-index", this.alertZIndex.toString());
    const {
      defaultLanguage = getUserLanguage(),
      customTranslations = {}
    } = this.whiteLabel || {};
    const mergedTranslations = external_lodash_merge_default()(config.translations, customTranslations);
    const languageTranslations = mergedTranslations[defaultLanguage] || config.translations[getUserLanguage()];
    this.embedTranslations = languageTranslations.embed;
    const handleSetup = async () => {
      await documentReady();
      return new Promise((resolve, reject) => {
        this.upbondIframe.onload = async () => {
          // only do this if iframe is not full screen
          await this._setupWeb3();
          const initStream = this.communicationMux.getStream("init_stream");
          initStream.on("data", chunk => {
            const {
              name,
              data,
              error
            } = chunk;
            if (name === "init_complete" && data.success) {
              // resolve promise
              this.isInitialized = true;
              this._displayIframe();
              resolve(undefined);
            } else if (error) {
              reject(new Error(error));
            }
          });
          initStream.write({
            name: "init_stream",
            data: {
              enabledVerifiers,
              loginConfig,
              whiteLabel: this.whiteLabel,
              buttonPosition: this.buttonPosition,
              buttonSize: this.buttonSize,
              apiKey: this.apiKey,
              skipTKey,
              network,
              widgetConfig: this.widgetConfig,
              mfaLevel,
              skipDialog,
              selectedVerifier,
              directConfig: {
                enabled: isUsingDirect,
                redirectUrl: dappRedirectUri
              },
              consentConfiguration: this.consentConfiguration,
              flowConfig,
              state
            }
          });
        };
        window.document.body.appendChild(this.upbondIframe);
        window.document.body.appendChild(this.torusAlertContainer);
      });
    };
    if (!widgetConfig) {
      loglevel.info(`widgetConfig is not configured. Now using default widget configuration`);
    } else {
      this.widgetConfig = widgetConfig;
    }
    if (buildEnv === "production" && integrity.check) {
      // hacky solution to check for iframe integrity
      const fetchUrl = `${torusUrl}/popup`;
      const resp = await fetch(fetchUrl, {
        cache: "reload"
      });
      if (resp.headers.get("Cache-Control") !== expectedCacheControlHeader) {
        throw new Error(`Unexpected Cache-Control headers, got ${resp.headers.get("Cache-Control")}`);
      }
      const response = await resp.text();
      const calculatedIntegrity = src_integrity({
        algorithms: ["sha384"]
      }, response);
      if (calculatedIntegrity === integrity.hash) {
        await handleSetup();
      } else {
        this.clearInit();
        throw new Error("Integrity check failed");
      }
    } else {
      try {
        await handleSetup();
        if (this.consentConfiguration.enable && this.consentConfiguration.config.publicKey) {
          this.consent = new Consent({
            publicKey: this.consentConfiguration.config.publicKey,
            scope: this.consentConfiguration.config.scope,
            consentStream: this.communicationMux,
            provider: this.provider,
            isLoggedIn: this.isLoggedIn
          });
          this.consent.init();
        } else {
          this.consent = null;
        }
      } catch (error) {
        console.error(error, "@errorOnInit");
      }
    }
    return undefined;
  }
  login() {
    let {
      verifier = "",
      login_hint: loginHint = ""
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (!this.isInitialized) throw new Error("Call init() first");
    this.requestedVerifier = verifier;
    this.loginHint = loginHint;
    return this.ethereum.enable();
  }
  requestAuthServiceAccessToken() {
    return new Promise((resolve, reject) => {
      const stream = this.communicationMux.getStream("auth_service");
      stream.write({
        name: "access_token_request"
      });
      stream.on("data", ev => {
        if (ev.name !== "error") {
          resolve(ev.data.authServiceAccessToken);
        } else {
          reject(ev.data.msg);
        }
      });
    });
  }
  logout() {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        reject(new Error("Please initialize first"));
        return;
      }
      const logOutStream = this.communicationMux.getStream("logout");
      logOutStream.write({
        name: "logOut"
      });
      const statusStream = this.communicationMux.getStream("status");
      const statusStreamHandler = status => {
        if (!status.loggedIn) {
          this.isLoggedIn = false;
          this.currentVerifier = "";
          this.requestedVerifier = "";
          resolve();
        } else reject(new Error("Some Error Occured"));
      };
      handleStream(statusStream, "data", statusStreamHandler);

      // Remove localstorage upbond_login used for caching
      localStorage.removeItem("upbond_login");
    });
  }
  async cleanUp() {
    if (this.isLoggedIn) {
      await this.logout();
    }
    this.clearInit();
  }
  clearInit() {
    function isElement(element) {
      return element instanceof Element || element instanceof HTMLDocument;
    }
    if (isElement(this.styleLink) && window.document.body.contains(this.styleLink)) {
      this.styleLink.remove();
      this.styleLink = undefined;
    }
    if (isElement(this.upbondIframe) && window.document.body.contains(this.upbondIframe)) {
      this.upbondIframe.remove();
      this.upbondIframe = undefined;
    }
    if (isElement(this.torusAlertContainer) && window.document.body.contains(this.torusAlertContainer)) {
      this.torusAlert = undefined;
      this.torusAlertContainer.remove();
      this.torusAlertContainer = undefined;
    }
    this.isInitialized = false;
  }
  hideWidget() {
    this._sendWidgetVisibilityStatus(false);
    this._displayIframe();
  }
  showWidget() {
    this._sendWidgetVisibilityStatus(true);
    this._displayIframe();
  }
  showMenu() {
    this._sendWidgetMenuVisibilityStatus(true);
    this._displayIframe(true);
  }
  hideMenu() {
    this._sendWidgetMenuVisibilityStatus(false);
    this._displayIframe(false);
  }
  setProvider(_ref) {
    let {
        host = "mainnet",
        chainId = null,
        networkName = ""
      } = _ref,
      rest = objectWithoutProperties_default()(_ref, _excluded);
    return new Promise((resolve, reject) => {
      const providerChangeStream = this.communicationMux.getStream("provider_change");
      const handler = chunk => {
        const {
          err,
          success
        } = chunk.data;
        if (err) {
          reject(err);
        } else if (success) {
          resolve();
        } else reject(new Error("some error occured"));
      };
      handleStream(providerChangeStream, "data", handler);
      const preopenInstanceId = getPreopenInstanceId();
      providerChangeStream.write({
        name: "show_provider_change",
        data: {
          network: embed_objectSpread({
            host,
            chainId,
            networkName
          }, rest),
          preopenInstanceId,
          override: false
        }
      });
    });
  }
  showWallet(path) {
    let params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const showWalletStream = this.communicationMux.getStream("show_wallet");
    const finalPath = path ? `/${path}` : "";
    showWalletStream.write({
      name: "show_wallet",
      data: {
        path: finalPath
      }
    });
    const showWalletHandler = chunk => {
      if (chunk.name === "show_wallet_instance") {
        // Let the error propogate up (hence, no try catch)
        const {
          instanceId
        } = chunk.data;
        const finalUrl = new URL(`${this.torusUrl}/wallet${finalPath}`);
        // Using URL constructor to prevent js injection and allow parameter validation.!
        finalUrl.searchParams.append("integrity", "true");
        finalUrl.searchParams.append("instanceId", instanceId);
        Object.keys(params).forEach(x => {
          finalUrl.searchParams.append(x, params[x]);
        });
        finalUrl.hash = `#isCustomLogin=${this.isCustomLogin}`;
        loglevel.info(`loaded: ${finalUrl}`);
        const walletWindow = new src_PopupHandler({
          url: finalUrl,
          features: FEATURES_DEFAULT_WALLET_WINDOW
        });
        walletWindow.open();
      }
    };
    handleStream(showWalletStream, "data", showWalletHandler);
  }
  showSignTransaction(path) {
    let params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const showWalletStream = this.communicationMux.getStream("show_wallet");
    const finalPath = path ? `/${path}` : "";
    showWalletStream.write({
      name: "show_wallet",
      data: {
        path: finalPath
      }
    });
    const showWalletHandler = chunk => {
      if (chunk.name === "show_wallet_instance") {
        // Let the error propogate up (hence, no try catch)
        const {
          instanceId
        } = chunk.data;
        const finalUrl = new URL(`${this.torusUrl}/confirm${finalPath}`);
        // Using URL constructor to prevent js injection and allow parameter validation.!
        finalUrl.searchParams.append("integrity", "true");
        finalUrl.searchParams.append("instanceId", instanceId);
        Object.keys(params).forEach(x => {
          finalUrl.searchParams.append(x, params[x]);
        });
        finalUrl.hash = `#isCustomLogin=${this.isCustomLogin}`;
        loglevel.info(`loaded: ${finalUrl}`);
        const walletWindow = new src_PopupHandler({
          url: finalUrl,
          features: FEATURES_DEFAULT_WALLET_WINDOW
        });
        walletWindow.open();
      }
    };
    handleStream(showWalletStream, "data", showWalletHandler);
  }
  async getPublicAddress(_ref2) {
    let {
      verifier,
      verifierId,
      isExtended = false
    } = _ref2;
    if (!config.supportedVerifierList.includes(verifier) || !WALLET_OPENLOGIN_VERIFIER_MAP[verifier]) throw new Error("Unsupported verifier");
    const walletVerifier = verifier;
    const openloginVerifier = WALLET_OPENLOGIN_VERIFIER_MAP[verifier];
    const url = new URL(`https://api.tor.us/lookup/torus`);
    url.searchParams.append("verifier", openloginVerifier);
    url.searchParams.append("verifierId", verifierId);
    url.searchParams.append("walletVerifier", walletVerifier);
    url.searchParams.append("network", "mainnet");
    url.searchParams.append("isExtended", isExtended.toString());
    return (0,http_helpers_namespaceObject.get)(url.href, {
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }, {
      useAPIKey: true
    });
  }
  getUserInfo(message) {
    return new Promise((resolve, reject) => {
      if (this.isLoggedIn) {
        const userInfoAccessStream = this.communicationMux.getStream("user_info_access");
        userInfoAccessStream.write({
          name: "user_info_access_request"
        });
        const userInfoAccessHandler = chunk => {
          const {
            name,
            data: {
              approved,
              payload,
              rejected,
              newRequest
            }
          } = chunk;
          if (name === "user_info_access_response") {
            if (approved) {
              resolve(payload);
            } else if (rejected) {
              reject(new Error("User rejected the request"));
            } else if (newRequest) {
              const userInfoStream = this.communicationMux.getStream("user_info");
              const userInfoHandler = handlerChunk => {
                if (handlerChunk.name === "user_info_response") {
                  if (handlerChunk.data.approved) {
                    resolve(handlerChunk.data.payload);
                  } else {
                    reject(new Error("User rejected the request"));
                  }
                }
              };
              handleStream(userInfoStream, "data", userInfoHandler);
              const preopenInstanceId = getPreopenInstanceId();
              this._handleWindow(preopenInstanceId, {
                target: "_blank",
                features: FEATURES_PROVIDER_CHANGE_WINDOW
              });
              userInfoStream.write({
                name: "user_info_request",
                data: {
                  message,
                  preopenInstanceId
                }
              });
            }
          }
        };
        handleStream(userInfoAccessStream, "data", userInfoAccessHandler);
      } else reject(new Error("User has not logged in yet"));
    });
  }
  getTkey(message) {
    return new Promise((resolve, reject) => {
      if (this.isLoggedIn) {
        const tkeyAccessStream = this.communicationMux.getStream("tkey_access");
        tkeyAccessStream.write({
          name: "tkey_access_request"
        });
        const tkeyAccessHandler = chunk => {
          const {
            name,
            data: {
              approved,
              payload,
              rejected,
              newRequest
            }
          } = chunk;
          if (name === "tkey_access_response") {
            if (approved) {
              resolve(payload);
            } else if (rejected) {
              reject(new Error("User rejected the request"));
            } else if (newRequest) {
              const tkeyInfoStream = this.communicationMux.getStream("tkey");
              const tkeyInfoHandler = handlerChunk => {
                if (handlerChunk.name === "tkey_response") {
                  if (handlerChunk.data.approved) {
                    resolve(handlerChunk.data.payload);
                  } else {
                    reject(new Error("User rejected the request"));
                  }
                }
              };
              handleStream(tkeyInfoStream, "data", tkeyInfoHandler);
              const preopenInstanceId = getPreopenInstanceId();
              this._handleWindow(preopenInstanceId, {
                target: "_blank",
                features: FEATURES_PROVIDER_CHANGE_WINDOW
              });
              tkeyInfoStream.write({
                name: "tkey_request",
                data: {
                  message,
                  preopenInstanceId
                }
              });
            }
          }
        };
        handleStream(tkeyAccessStream, "data", tkeyAccessHandler);
      } else reject(new Error("User has not logged in yet"));
    });
  }
  getMpcProvider() {
    return new Promise((resolve, reject) => {
      const mpcProviderStream = this.communicationMux.getStream("mpc_provider_access");
      mpcProviderStream.write({
        name: "mpc_provider_request"
      });
      const tkeyAccessHandler = chunk => {
        const {
          name,
          data: {
            approved,
            payload
          }
        } = chunk;
        this._displayIframe(true);
        if (name === "mpc_provider_response") {
          if (approved) {
            resolve(payload);
          } else {
            reject(new Error("User rejected the request"));
          }
        }
      };
      handleStream(mpcProviderStream, "data", tkeyAccessHandler);
    });
  }
  sendTransaction(data) {
    return new Promise((resolve, reject) => {
      this._displayIframe(true);
      const stream = this.communicationMux.getStream("send_transaction_access");
      stream.write({
        name: "send_transaction_request",
        data
      });
      const tkeyAccessHandler = chunk => {
        const {
          name,
          data: {
            approved,
            payload
          }
        } = chunk;
        if (name === "send_transaction_response") {
          if (approved) {
            resolve(payload);
          } else {
            reject(new Error("User rejected the request"));
          }
        }
      };
      handleStream(stream, "data", tkeyAccessHandler);
    });
  }
  initiateTopup(provider, params) {
    return new Promise((resolve, reject) => {
      if (this.isInitialized) {
        const {
          errors,
          isValid
        } = validatePaymentProvider(provider, params);
        if (!isValid) {
          reject(new Error(JSON.stringify(errors)));
          return;
        }
        const topupStream = this.communicationMux.getStream("topup");
        const topupHandler = chunk => {
          if (chunk.name === "topup_response") {
            if (chunk.data.success) {
              resolve(chunk.data.success);
            } else {
              reject(new Error(chunk.data.error));
            }
          }
        };
        handleStream(topupStream, "data", topupHandler);
        const preopenInstanceId = getPreopenInstanceId();
        this._handleWindow(preopenInstanceId);
        topupStream.write({
          name: "topup_request",
          data: {
            provider,
            params,
            preopenInstanceId
          }
        });
      } else reject(new Error("Upbond is not initialized yet"));
    });
  }
  async loginWithPrivateKey(loginParams) {
    const {
      privateKey,
      userInfo
    } = loginParams;
    return new Promise((resolve, reject) => {
      if (this.isInitialized) {
        if (embed_Buffer.from(privateKey, "hex").length !== 32) {
          reject(new Error("Invalid private key, Please provide a 32 byte valid secp25k1 private key"));
          return;
        }
        const loginPrivKeyStream = this.communicationMux.getStream("login_with_private_key");
        const loginHandler = chunk => {
          if (chunk.name === "login_with_private_key_response") {
            if (chunk.data.success) {
              resolve(chunk.data.success);
            } else {
              reject(new Error(chunk.data.error));
            }
          }
        };
        handleStream(loginPrivKeyStream, "data", loginHandler);
        loginPrivKeyStream.write({
          name: "login_with_private_key_request",
          data: {
            privateKey,
            userInfo
          }
        });
      } else reject(new Error("Upbond is not initialized yet"));
    });
  }
  async showWalletConnectScanner() {
    if (!this.useWalletConnect) throw new Error("Set `useWalletConnect` as true in init function options to use wallet connect scanner");
    return new Promise((resolve, reject) => {
      if (this.isLoggedIn) {
        const walletConnectStream = this.communicationMux.getStream("wallet_connect_stream");
        const walletConnectHandler = chunk => {
          if (chunk.name === "wallet_connect_stream_res") {
            if (chunk.data.success) {
              resolve(chunk.data.success);
            } else {
              reject(new Error(chunk.data.error));
            }
            this._displayIframe();
          }
        };
        handleStream(walletConnectStream, "data", walletConnectHandler);
        walletConnectStream.write({
          name: "wallet_connect_stream_req"
        });
        this._displayIframe(true);
      } else reject(new Error("User has not logged in yet"));
    });
  }
  _handleWindow(preopenInstanceId) {
    let {
      url,
      target,
      features
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (preopenInstanceId) {
      const windowStream = this.communicationMux.getStream("window");
      const finalUrl = new URL(url || `${this.torusUrl}/redirect?preopenInstanceId=${preopenInstanceId}`);
      if (finalUrl.hash) finalUrl.hash += `&isCustomLogin=${this.isCustomLogin}`;else finalUrl.hash = `#isCustomLogin=${this.isCustomLogin}`;
      const handledWindow = new src_PopupHandler({
        url: finalUrl,
        target,
        features
      });
      handledWindow.open();
      if (!handledWindow.window) {
        this._createPopupBlockAlert(preopenInstanceId, finalUrl.href);
        return;
      }
      windowStream.write({
        name: "opened_window",
        data: {
          preopenInstanceId
        }
      });
      const closeHandler = _ref3 => {
        let {
          preopenInstanceId: receivedId,
          close
        } = _ref3;
        if (receivedId === preopenInstanceId && close) {
          handledWindow.close();
          windowStream.removeListener("data", closeHandler);
        }
      };
      windowStream.on("data", closeHandler);
      handledWindow.once("close", () => {
        windowStream.write({
          data: {
            preopenInstanceId,
            closed: true
          }
        });
        windowStream.removeListener("data", closeHandler);
      });
    }
  }
  _setEmbedWhiteLabel(element) {
    // Set whitelabel
    const {
      theme
    } = this.whiteLabel || {};
    if (theme) {
      const {
        isDark = false,
        colors = {}
      } = theme;
      if (isDark) element.classList.add("torus-dark");
      if (colors.torusBrand1) element.style.setProperty("--torus-brand-1", colors.torusBrand1);
      if (colors.torusGray2) element.style.setProperty("--torus-gray-2", colors.torusGray2);
    }
  }
  _getLogoUrl() {
    let logoUrl = `${this.torusUrl}/images/torus_icon-blue.svg`;
    if (this.whiteLabel?.theme?.isDark) {
      logoUrl = this.whiteLabel?.logoLight || logoUrl;
    } else {
      logoUrl = this.whiteLabel?.logoDark || logoUrl;
    }
    return logoUrl;
  }
  _sendWidgetVisibilityStatus(status) {
    const upbondButtonVisibilityStream = this.communicationMux.getStream("widget-visibility");
    upbondButtonVisibilityStream.write({
      data: status
    });
  }
  _sendWidgetMenuVisibilityStatus(status) {
    const upbondButtonVisibilityStream = this.communicationMux.getStream("menu-visibility");
    upbondButtonVisibilityStream.write({
      data: status
    });
  }
  _displayIframe() {
    let isFull = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    const style = {};
    const size = this.buttonSize + 14; // 15px padding
    // set phase
    if (!isFull) {
      style.display = this.isLoggedIn ? "block" : !this.isLoggedIn ? "block" : "none";
      style.height = `${size}px`;
      style.width = `${size}px`;
      switch (this.buttonPosition) {
        case BUTTON_POSITION.TOP_LEFT:
          style.top = "0px";
          style.left = "0px";
          style.right = "auto";
          style.bottom = "auto";
          break;
        case BUTTON_POSITION.TOP_RIGHT:
          style.top = "0px";
          style.right = "0px";
          style.left = "auto";
          style.bottom = "auto";
          break;
        case BUTTON_POSITION.BOTTOM_RIGHT:
          style.bottom = "0px";
          style.right = "0px";
          style.top = "auto";
          style.left = "auto";
          break;
        case BUTTON_POSITION.BOTTOM_LEFT:
        default:
          style.bottom = "0px";
          style.left = "0px";
          style.top = "auto";
          style.right = "auto";
          break;
      }
    } else {
      style.display = "block";
      style.width = "100%";
      style.height = "100%";
      style.top = "0px";
      style.right = "0px";
      style.left = "0px";
      style.bottom = "0px";
    }
    Object.assign(this.upbondIframe.style, style);
    this.isIframeFullScreen = isFull;
  }
  async _setupWeb3() {
    // setup background connection
    const metamaskStream = new openlogin_jrpc_namespaceObject.BasePostMessageStream({
      name: "embed_metamask",
      target: "iframe_metamask",
      targetWindow: this.upbondIframe.contentWindow,
      targetOrigin: new URL(this.torusUrl).origin
    });

    // Due to compatibility reasons, we should not set up multiplexing on window.metamaskstream
    // because the MetamaskInpageProvider also attempts to do so.
    // We create another LocalMessageDuplexStream for communication between dapp <> iframe
    const communicationStream = new openlogin_jrpc_namespaceObject.BasePostMessageStream({
      name: "embed_comm",
      target: "iframe_comm",
      targetWindow: this.upbondIframe.contentWindow,
      targetOrigin: new URL(this.torusUrl).origin
    });

    // Backward compatibility with Gotchi :)
    // window.metamaskStream = this.communicationStream

    // compose the inpage provider
    const inpageProvider = new inpage_provider(metamaskStream);

    // detect eth_requestAccounts and pipe to enable for now
    const detectAccountRequestPrototypeModifier = m => {
      const originalMethod = inpageProvider[m];
      inpageProvider[m] = function providerFunc(method) {
        if (method && method === "eth_requestAccounts") {
          return inpageProvider.enable();
        }
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        return originalMethod.apply(this, [method, ...args]);
      };
    };
    detectAccountRequestPrototypeModifier("send");
    detectAccountRequestPrototypeModifier("sendAsync");
    inpageProvider.enable = () => {
      return new Promise((resolve, reject) => {
        // If user is already logged in, we assume they have given access to the website
        inpageProvider.sendAsync({
          jsonrpc: "2.0",
          id: getPreopenInstanceId(),
          method: "eth_requestAccounts",
          params: []
        }, (err, response) => {
          const {
            result: res
          } = response || {};
          if (err) {
            setTimeout(() => {
              reject(err);
            }, 50);
          } else if (Array.isArray(res) && res.length > 0) {
            // If user is already rehydrated, resolve this
            // else wait for something to be written to status stream
            const handleLoginCb = () => {
              if (this.requestedVerifier !== "" && this.currentVerifier !== this.requestedVerifier) {
                const {
                  requestedVerifier
                } = this;
                // eslint-disable-next-line promise/no-promise-in-callback
                this.logout()
                // eslint-disable-next-line promise/always-return
                .then(_ => {
                  this.requestedVerifier = requestedVerifier;
                  this._showLoginPopup(true, resolve, reject);
                }).catch(error => reject(error));
              } else {
                resolve(res);
              }
            };
            if (this.isLoggedIn) {
              handleLoginCb();
            } else {
              this.isLoginCallback = handleLoginCb;
            }
          } else {
            // set up listener for login
            this._showLoginPopup(true, resolve, reject, this.skipDialog);
          }
        });
      });
    };
    inpageProvider.tryPreopenHandle = (payload, cb) => {
      const _payload = payload;
      if (this.buildEnv.includes("v1")) {
        if (!Array.isArray(_payload) && UNSAFE_METHODS.includes(_payload.method)) {
          const preopenInstanceId = getPreopenInstanceId();
          this._handleWindow(preopenInstanceId, {
            target: "_blank",
            features: FEATURES_CONFIRM_WINDOW
          });
          _payload.preopenInstanceId = preopenInstanceId;
        }
      }
      inpageProvider._rpcEngine.handle(_payload, cb);
    };

    // Work around for web3@1.0 deleting the bound `sendAsync` but not the unbound
    // `sendAsync` method on the prototype, causing `this` reference issues with drizzle
    const proxiedInpageProvider = new Proxy(inpageProvider, {
      // straight up lie that we deleted the property so that it doesnt
      // throw an error in strict mode
      deleteProperty: () => true
    });
    this.ethereum = proxiedInpageProvider;
    const communicationMux = (0,openlogin_jrpc_namespaceObject.setupMultiplex)(communicationStream);
    this.communicationMux = communicationMux;
    const windowStream = communicationMux.getStream("window");
    windowStream.on("data", chunk => {
      if (chunk.name === "create_window") {
        // url is the url we need to open
        // we can pass the final url upfront so that it removes the step of redirecting to /redirect and waiting for finalUrl
        this._createPopupBlockAlert(chunk.data.preopenInstanceId, chunk.data.url);
      }
    });

    // show torus widget if button clicked
    const widgetStream = communicationMux.getStream("widget");
    widgetStream.on("data", async chunk => {
      const {
        data
      } = chunk;
      this._displayIframe(data);
    });

    // Show torus button if wallet has been hydrated/detected
    const statusStream = communicationMux.getStream("status");
    statusStream.on("data", status => {
      // login
      if (status.loggedIn && localStorage.getItem("upbond_login")) {
        this.isLoggedIn = status.loggedIn;
        this.currentVerifier = status.verifier;
      } // logout
      else this._displayIframe();
      if (this.isLoginCallback) {
        this.isLoginCallback();
        delete this.isLoginCallback;
      }
    });
    this.provider = proxiedInpageProvider;
    if (this.provider.shouldSendMetadata) sendSiteMetadata(this.provider._rpcEngine);
    inpageProvider._initializeState();
    const getCachedData = localStorage.getItem("upbond_login");
    if (window.location.search || getCachedData || this.idToken) {
      let data;
      if (getCachedData) {
        data = JSON.parse(getCachedData) ? JSON.parse(getCachedData) : null;
      }
      if (this.idToken) {
        console.log("@masuk sini?");
        const idTokenParsed = parseIdToken(this.idToken);
        console.log("@idTokenParsed", idTokenParsed);
        if (idTokenParsed?.wallet_address) {
          data = {
            loggedIn: true,
            rehydrate: true,
            selectedAddress: idTokenParsed?.wallet_address,
            verifier: null
          };
          localStorage.setItem("upbond_login", JSON.stringify(data));
        }
      }
      if (window.location.search) {
        const {
          loggedIn,
          rehydrate,
          selectedAddress,
          verifier,
          state
        } = searchToObject(window.location.search);
        if (loggedIn !== undefined && rehydrate !== undefined && selectedAddress !== undefined && verifier !== undefined && state !== undefined) {
          data = {
            loggedIn,
            rehydrate,
            selectedAddress,
            verifier,
            state
          };
          localStorage.setItem("upbond_login", JSON.stringify(data));
        }
      }
      if (data) {
        const oauthStream = this.communicationMux.getStream("oauth");
        const isLoggedIn = data.loggedIn === "true";
        const isRehydrate = data.rehydrate === "true";
        let state = "";
        if (data.state) {
          state = data.state;
        }
        const {
          selectedAddress,
          verifier
        } = data;
        if (isLoggedIn) {
          this.isLoggedIn = true;
          this.currentVerifier = verifier;
        } else this._displayIframe(true);
        this._displayIframe(true);
        oauthStream.write({
          selectedAddress
        });
        statusStream.write({
          loggedIn: isLoggedIn,
          rehydrate: isRehydrate,
          verifier,
          state
        });
        await inpageProvider._initializeState();
        if (data.selectedAddress && data.loggedIn && data.state) {
          const urlParams = new URLSearchParams(window.location.search);
          urlParams.delete("selectedAddress");
          urlParams.delete("rehydrate");
          urlParams.delete("loggedIn");
          urlParams.delete("verifier");
          urlParams.delete("state");
          const newQueryParams = urlParams.toString();
          const baseUrl = window.location.href.split("?")[0];
          const newUrl = `${baseUrl}?${newQueryParams}`;
          window.history.replaceState(null, null, newUrl);
        }
      } else {
        const logOutStream = this.communicationMux.getStream("logout");
        logOutStream.write({
          name: "logOut"
        });
        const statusStreamHandler = () => {
          this.isLoggedIn = false;
          this.currentVerifier = "";
          this.requestedVerifier = "";
        };
        handleStream(statusStream, "data", statusStreamHandler);
      }
    } else {
      const logOutStream = this.communicationMux.getStream("logout");
      logOutStream.write({
        name: "logOut"
      });
      const statusStreamHandler = () => {
        this.isLoggedIn = false;
        this.currentVerifier = "";
        this.requestedVerifier = "";
      };
      handleStream(statusStream, "data", statusStreamHandler);
    }
  }
  _showLoginPopup(calledFromEmbed, resolve, reject) {
    let skipDialog = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    const loginHandler = async data => {
      const {
        err,
        selectedAddress
      } = data;
      if (err) {
        loglevel.error(err);
        if (reject) reject(err);
      }
      // returns an array (cause accounts expects it)
      else if (resolve) resolve([selectedAddress]);
      if (this.isIframeFullScreen) this._displayIframe(false);
    };
    const oauthStream = this.communicationMux.getStream("oauth");
    if (!this.requestedVerifier) {
      this._displayIframe(true);
      handleStream(oauthStream, "data", loginHandler);
      oauthStream.write({
        name: "oauth_modal",
        data: {
          calledFromEmbed,
          skipDialog,
          isUsingDirect: this.isUsingDirect,
          verifier: this.currentVerifier,
          dappRedirectUrl: this.dappRedirectUrl,
          selectedVerifier: this.selectedVerifier
        }
      });
    } else {
      handleStream(oauthStream, "data", loginHandler);
      const preopenInstanceId = getPreopenInstanceId();
      this._handleWindow(preopenInstanceId);
      oauthStream.write({
        name: "oauth",
        data: {
          calledFromEmbed,
          verifier: this.requestedVerifier,
          preopenInstanceId,
          login_hint: this.loginHint,
          skipDialog,
          selectedVerifier: this.selectedVerifier
        }
      });
    }
  }
  _createPopupBlockAlert(preopenInstanceId, url) {
    const logoUrl = this._getLogoUrl();
    const torusAlert = htmlToElement('<div id="torusAlert" class="torus-alert--v2">' + `<div id="torusAlert__logo"><img src="${logoUrl}" /></div>` + "<div>" + `<h1 id="torusAlert__title">${this.embedTranslations.actionRequired}</h1>` + `<p id="torusAlert__desc">${this.embedTranslations.pendingAction}</p>` + "</div>" + "</div>");
    const successAlert = htmlToElement(`<div><a id="torusAlert__btn">${this.embedTranslations.continue}</a></div>`);
    const btnContainer = htmlToElement('<div id="torusAlert__btn-container"></div>');
    btnContainer.appendChild(successAlert);
    torusAlert.appendChild(btnContainer);
    const bindOnLoad = () => {
      successAlert.addEventListener("click", () => {
        this._handleWindow(preopenInstanceId, {
          url,
          target: "_blank",
          features: FEATURES_CONFIRM_WINDOW
        });
        torusAlert.remove();
        if (this.torusAlertContainer.children.length === 0) this.torusAlertContainer.style.display = "none";
      });
    };
    this._setEmbedWhiteLabel(torusAlert);
    const attachOnLoad = () => {
      this.torusAlertContainer.style.display = "block";
      this.torusAlertContainer.appendChild(torusAlert);
    };
    runOnLoad(attachOnLoad);
    runOnLoad(bindOnLoad);
  }
}
/* harmony default export */ const src_embed = (Upbond);
;// CONCATENATED MODULE: ./src/index.ts



})();

module.exports = __webpack_exports__["default"];
/******/ })()
;
//# sourceMappingURL=upbondEmbed-bundled.cjs.js.map