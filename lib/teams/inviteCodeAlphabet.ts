/** Small nanoid-style alphabet generator (no extra dependency). */
export function customAlphabet(alphabet: string, size: number) {
  return function generate() {
    let id = "";
    const bytes = new Uint8Array(size);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < size; i++) {
      id += alphabet[bytes[i]! % alphabet.length];
    }
    return id;
  };
}
