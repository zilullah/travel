export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatImageUrl(url: string): string {
  const trimmedUrl = url.trim();

  try {
    const parsedUrl = new URL(trimmedUrl);
    const fileId =
      parsedUrl.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ??
      parsedUrl.searchParams.get("id");

    if (parsedUrl.hostname === "drive.google.com" && fileId) {
      return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w1600`;
    }
  } catch {
    return trimmedUrl;
  }

  return trimmedUrl;
}
