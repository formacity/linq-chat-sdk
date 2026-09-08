/** Provider ranges are half-open UTF-16 code-unit offsets into the untrimmed text. */
export function validMentionRange(range: unknown, text: unknown): range is [number, number] {
  return (
    typeof text === "string" &&
    Array.isArray(range) &&
    range.length === 2 &&
    Number.isInteger(range[0]) &&
    Number.isInteger(range[1]) &&
    range[0] >= 0 &&
    range[0] < range[1] &&
    range[1] <= text.length &&
    isBoundary(text, range[0]) &&
    isBoundary(text, range[1])
  );
}

function isBoundary(text: string, offset: number): boolean {
  const before = text.charCodeAt(offset - 1);
  const after = text.charCodeAt(offset);
  return !(before >= 0xd800 && before <= 0xdbff && after >= 0xdc00 && after <= 0xdfff);
}
