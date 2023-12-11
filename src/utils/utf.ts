/**
 * Returns the number of UTF-8 bytes required to represent the given Unicode code point.
 *
 * @param {number} codePointValue - The Unicode code point value.
 * @return {number} The number of UTF-8 bytes needed to represent the code point.
 */
function numUtf8BytesForCodePoint(codePointValue: number): number {
  if (codePointValue < 0x80) {
    return 1;
  }
  if (codePointValue < 0x800) {
    return 2;
  }
  if (codePointValue < 0x10000) {
    return 3;
  }
  return 4;
}

/**
 * Calculates for some prefix of the given text, how many bytes the UTF-8
 * representation would be. Undefined behavior if the number of code units
 * doesn't correspond to a valid UTF-8 sequence.
 * @param text - Text to examine.
 * @param numCodeUnits The number of code units to look at.
 * @returns The number of bytes.
 */
export function numCodeUnitsToNumUtf8Bytes(
  text: string,
  numCodeUnits?: number
): number {
  if (numCodeUnits === 0) {
    return 0;
  }
  let curNumUtf8Bytes = 0;
  let curNumCodeUnits = 0;
  for (const codePoint of text) {
    curNumCodeUnits += codePoint.length;
    curNumUtf8Bytes += numUtf8BytesForCodePoint(codePoint.codePointAt(0)!);
    if (numCodeUnits !== undefined && curNumCodeUnits >= numCodeUnits) {
      break;
    }
  }
  return curNumUtf8Bytes;
}

export function numUtf8BytesToNumCodeUnits(
  text: string,
  numUtf8Bytes?: number
): number {
  if (numUtf8Bytes === 0) {
    return 0;
  }
  let curNumCodeUnits = 0;
  let curNumUtf8Bytes = 0;
  for (const codePoint of text) {
    curNumUtf8Bytes += numUtf8BytesForCodePoint(codePoint.codePointAt(0)!);
    curNumCodeUnits += codePoint.length;
    if (numUtf8Bytes !== undefined && curNumUtf8Bytes >= numUtf8Bytes) {
      break;
    }
  }
  return curNumCodeUnits;
}
