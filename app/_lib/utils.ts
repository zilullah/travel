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
