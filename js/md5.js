define([], function() {
  "use strict";

  /*
   * JavaScript MD5 implementation
   * Based on a simplified version of the algorithm
   */
  function md5(string) {
    // Convert string to UTF-8 array
    function stringToBytes(str) {
      var bytes = [];
      for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
        if (charCode < 128) {
          bytes.push(charCode);
        } else if (charCode < 2048) {
          bytes.push((charCode >> 6) | 192);
          bytes.push((charCode & 63) | 128);
        } else {
          bytes.push((charCode >> 12) | 224);
          bytes.push(((charCode >> 6) & 63) | 128);
          bytes.push((charCode & 63) | 128);
        }
      }
      return bytes;
    }

    // Left rotate a 32bit number
    function rotateLeft(n, s) {
      return (n << s) | (n >>> (32 - s));
    }

    // Convert 4 bytes to a 32bit integer
    function bytesToInt32(bytes, offset) {
      return ((bytes[offset]) |
              (bytes[offset + 1] << 8) |
              (bytes[offset + 2] << 16) |
              (bytes[offset + 3] << 24));
    }

    // Convert a 32bit int to 4 bytes
    function int32ToBytes(n, bytes, offset) {
      bytes[offset] = n & 0xFF;
      bytes[offset + 1] = (n >>> 8) & 0xFF;
      bytes[offset + 2] = (n >>> 16) & 0xFF;
      bytes[offset + 3] = (n >>> 24) & 0xFF;
    }

    // MD5 helper functions
    function F(x, y, z) { return (x & y) | (~x & z); }
    function G(x, y, z) { return (x & z) | (y & ~z); }
    function H(x, y, z) { return x ^ y ^ z; }
    function I(x, y, z) { return y ^ (x | ~z); }

    // Process a single 64-byte chunk
    function processChunk(state, chunk) {
      var a = state[0], b = state[1], c = state[2], d = state[3];
      var x = new Array(16);

      // Get 16 32-bit integers from the chunk
      for (var i = 0; i < 16; i++) {
        x[i] = bytesToInt32(chunk, i * 4);
      }

      // Round 1
      a = b + rotateLeft((a + F(b, c, d) + x[0] + 0xd76aa478), 7);
      d = a + rotateLeft((d + F(a, b, c) + x[1] + 0xe8c7b756), 12);
      c = d + rotateLeft((c + F(d, a, b) + x[2] + 0x242070db), 17);
      b = c + rotateLeft((b + F(c, d, a) + x[3] + 0xc1bdceee), 22);
      a = b + rotateLeft((a + F(b, c, d) + x[4] + 0xf57c0faf), 7);
      d = a + rotateLeft((d + F(a, b, c) + x[5] + 0x4787c62a), 12);
      c = d + rotateLeft((c + F(d, a, b) + x[6] + 0xa8304613), 17);
      b = c + rotateLeft((b + F(c, d, a) + x[7] + 0xfd469501), 22);
      a = b + rotateLeft((a + F(b, c, d) + x[8] + 0x698098d8), 7);
      d = a + rotateLeft((d + F(a, b, c) + x[9] + 0x8b44f7af), 12);
      c = d + rotateLeft((c + F(d, a, b) + x[10] + 0xffff5bb1), 17);
      b = c + rotateLeft((b + F(c, d, a) + x[11] + 0x895cd7be), 22);
      a = b + rotateLeft((a + F(b, c, d) + x[12] + 0x6b901122), 7);
      d = a + rotateLeft((d + F(a, b, c) + x[13] + 0xfd987193), 12);
      c = d + rotateLeft((c + F(d, a, b) + x[14] + 0xa679438e), 17);
      b = c + rotateLeft((b + F(c, d, a) + x[15] + 0x49b40821), 22);

      // Round 2
      a = b + rotateLeft((a + G(b, c, d) + x[1] + 0xf61e2562), 5);
      d = a + rotateLeft((d + G(a, b, c) + x[6] + 0xc040b340), 9);
      c = d + rotateLeft((c + G(d, a, b) + x[11] + 0x265e5a51), 14);
      b = c + rotateLeft((b + G(c, d, a) + x[0] + 0xe9b6c7aa), 20);
      a = b + rotateLeft((a + G(b, c, d) + x[5] + 0xd62f105d), 5);
      d = a + rotateLeft((d + G(a, b, c) + x[10] + 0x02441453), 9);
      c = d + rotateLeft((c + G(d, a, b) + x[15] + 0xd8a1e681), 14);
      b = c + rotateLeft((b + G(c, d, a) + x[4] + 0xe7d3fbc8), 20);
      a = b + rotateLeft((a + G(b, c, d) + x[9] + 0x21e1cde6), 5);
      d = a + rotateLeft((d + G(a, b, c) + x[14] + 0xc33707d6), 9);
      c = d + rotateLeft((c + G(d, a, b) + x[3] + 0xf4d50d87), 14);
      b = c + rotateLeft((b + G(c, d, a) + x[8] + 0x455a14ed), 20);
      a = b + rotateLeft((a + G(b, c, d) + x[13] + 0xa9e3e905), 5);
      d = a + rotateLeft((d + G(a, b, c) + x[2] + 0xfcefa3f8), 9);
      c = d + rotateLeft((c + G(d, a, b) + x[7] + 0x676f02d9), 14);
      b = c + rotateLeft((b + G(c, d, a) + x[12] + 0x8d2a4c8a), 20);

      // Round 3
      a = b + rotateLeft((a + H(b, c, d) + x[5] + 0xfffa3942), 4);
      d = a + rotateLeft((d + H(a, b, c) + x[8] + 0x8771f681), 11);
      c = d + rotateLeft((c + H(d, a, b) + x[11] + 0x6d9d6122), 16);
      b = c + rotateLeft((b + H(c, d, a) + x[14] + 0xfde5380c), 23);
      a = b + rotateLeft((a + H(b, c, d) + x[1] + 0xa4beea44), 4);
      d = a + rotateLeft((d + H(a, b, c) + x[4] + 0x4bdecfa9), 11);
      c = d + rotateLeft((c + H(d, a, b) + x[7] + 0xf6bb4b60), 16);
      b = c + rotateLeft((b + H(c, d, a) + x[10] + 0xbebfbc70), 23);
      a = b + rotateLeft((a + H(b, c, d) + x[13] + 0x289b7ec6), 4);
      d = a + rotateLeft((d + H(a, b, c) + x[0] + 0xeaa127fa), 11);
      c = d + rotateLeft((c + H(d, a, b) + x[3] + 0xd4ef3085), 16);
      b = c + rotateLeft((b + H(c, d, a) + x[6] + 0x04881d05), 23);
      a = b + rotateLeft((a + H(b, c, d) + x[9] + 0xd9d4d039), 4);
      d = a + rotateLeft((d + H(a, b, c) + x[12] + 0xe6db99e5), 11);
      c = d + rotateLeft((c + H(d, a, b) + x[15] + 0x1fa27cf8), 16);
      b = c + rotateLeft((b + H(c, d, a) + x[2] + 0xc4ac5665), 23);

      // Round 4
      a = b + rotateLeft((a + I(b, c, d) + x[0] + 0xf4292244), 6);
      d = a + rotateLeft((d + I(a, b, c) + x[7] + 0x432aff97), 10);
      c = d + rotateLeft((c + I(d, a, b) + x[14] + 0xab9423a7), 15);
      b = c + rotateLeft((b + I(c, d, a) + x[5] + 0xfc93a039), 21);
      a = b + rotateLeft((a + I(b, c, d) + x[12] + 0x655b59c3), 6);
      d = a + rotateLeft((d + I(a, b, c) + x[3] + 0x8f0ccc92), 10);
      c = d + rotateLeft((c + I(d, a, b) + x[10] + 0xffeff47d), 15);
      b = c + rotateLeft((b + I(c, d, a) + x[1] + 0x85845dd1), 21);
      a = b + rotateLeft((a + I(b, c, d) + x[8] + 0x6fa87e4f), 6);
      d = a + rotateLeft((d + I(a, b, c) + x[15] + 0xfe2ce6e0), 10);
      c = d + rotateLeft((c + I(d, a, b) + x[6] + 0xa3014314), 15);
      b = c + rotateLeft((b + I(c, d, a) + x[13] + 0x4e0811a1), 21);
      a = b + rotateLeft((a + I(b, c, d) + x[4] + 0xf7537e82), 6);
      d = a + rotateLeft((d + I(a, b, c) + x[11] + 0xbd3af235), 10);
      c = d + rotateLeft((c + I(d, a, b) + x[2] + 0x2ad7d2bb), 15);
      b = c + rotateLeft((b + I(c, d, a) + x[9] + 0xeb86d391), 21);

      state[0] += a;
      state[1] += b;
      state[2] += c;
      state[3] += d;
    }

    // Convert a 32-bit number to a hex string
    function toHex(n) {
      var hexChars = "0123456789abcdef";
      var result = "";
      for (var i = 0; i < 8; i++) {
        result += hexChars.charAt((n >>> (i * 4)) & 0xF);
      }
      return result;
    }

    // Main MD5 function
    var bytes = stringToBytes(string);
    var msgLength = bytes.length;
    
    // Padding
    var paddingBytes = [0x80];
    var padding = 64 - ((msgLength + 9) % 64);
    if (padding < 0) padding += 64;
    for (var i = 0; i < padding; i++) {
      paddingBytes.push(0);
    }
    
    // Append length (in bits)
    var lengthInBits = msgLength * 8;
    var lengthBytes = new Array(8);
    for (var i = 0; i < 8; i++) {
      lengthBytes[i] = (lengthInBits >>> (i * 8)) & 0xFF;
    }
    
    // Combine everything
    var message = bytes.concat(paddingBytes).concat(lengthBytes);
    
    // Initialize hash state
    var state = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476];
    
    // Process message in 64-byte chunks
    for (var i = 0; i < message.length; i += 64) {
      var chunk = message.slice(i, i + 64);
      processChunk(state, chunk);
    }
    
    // Produce the final hash value
    var result = "";
    for (var i = 0; i < 4; i++) {
      result += toHex(state[i]).split("").reverse().join("");
    }
    
    return result;
  }

  // Function to generate Git-like shortened hash
  function shortHash(hash) {
    return hash.substring(0, 7);
  }

  return {
    hash: md5,
    short: shortHash
  };
});
