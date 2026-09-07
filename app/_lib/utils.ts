export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatImageUrl(url: string): string {
  if (!url) return "";
  const trimmedUrl = url.trim();

  try {
    const parsedUrl = new URL(trimmedUrl);

    // Support Google Drive links (drive.google.com and docs.google.com)
    if (
      parsedUrl.hostname === "drive.google.com" ||
      parsedUrl.hostname === "docs.google.com" ||
      parsedUrl.hostname.endsWith(".googleusercontent.com")
    ) {
      const fileId =
        parsedUrl.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ??
        parsedUrl.pathname.match(/\/d\/([^/]+)/)?.[1] ??
        parsedUrl.searchParams.get("id");

      if (fileId) {
        return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w1600`;
      }
    }
  } catch {
    return trimmedUrl;
  }

  return trimmedUrl;
}

/**
 * Encodes/masks an ID or UUID into a clean URL-safe token.
 * ponytails: deterministic XOR-obfuscation with Hex encoding.
 */
export function maskId(rawId: string): string {
  if (!rawId) return "";
  try {
    const utf8Bytes = new TextEncoder().encode(rawId);
    const key = [0x54, 0x52, 0x41, 0x56, 0x45, 0x4c]; // 'TRAVEL'
    const masked = new Uint8Array(utf8Bytes.length);
    for (let i = 0; i < utf8Bytes.length; i++) {
      masked[i] = utf8Bytes[i] ^ key[i % key.length];
    }
    return Array.from(masked)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return rawId;
  }
}

/**
 * Decodes/unmasks an ID or UUID from a URL token.
 * Returns the original ID, or the input token if not masked.
 */
export function unmaskId(token: string): string {
  if (!token) return "";
  try {
    if (token.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(token)) {
      return token;
    }
    const bytes = new Uint8Array(token.length / 2);
    for (let i = 0; i < token.length; i += 2) {
      bytes[i / 2] = parseInt(token.substring(i, i + 2), 16);
    }
    const key = [0x54, 0x52, 0x41, 0x56, 0x45, 0x4c]; // 'TRAVEL'
    const unmasked = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      unmasked[i] = bytes[i] ^ key[i % key.length];
    }
    const decoded = new TextDecoder().decode(unmasked);
    return decoded || token;
  } catch {
    return token;
  }
}

