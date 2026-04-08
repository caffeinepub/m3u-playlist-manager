import type { Channel } from "@/types/channel";

export function exportM3U(channels: Channel[]): string {
  const sorted = [...channels].sort((a, b) => a.order - b.order);

  const lines: string[] = ["#EXTM3U"];

  for (const ch of sorted) {
    const attrs: string[] = [];

    if (ch.logo) attrs.push(`tvg-logo="${ch.logo}"`);
    if (ch.group) attrs.push(`group-title="${ch.group}"`);
    if (ch.userAgent) attrs.push(`user-agent="${ch.userAgent}"`);

    lines.push(`#EXTINF:-1 ${attrs.join(" ")},${ch.name}`);
    lines.push(ch.url);
  }

  return lines.join("\n");
}

export function downloadM3U(
  channels: Channel[],
  filename = "playlist.m3u",
): void {
  const content = exportM3U(channels);
  const blob = new Blob([content], { type: "application/x-mpegurl" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
