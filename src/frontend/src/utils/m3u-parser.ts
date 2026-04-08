import type { Channel } from "@/types/channel";

const EXTINF_RE = /^#EXTINF:-?\d+(?:\s+([^,]*))?,(.*)/;
const TVG_ID_RE = /tvg-id="([^"]*)"/;
const TVG_NAME_RE = /tvg-name="([^"]*)"/;
const TVG_LOGO_RE = /tvg-logo="([^"]*)"/;
const GROUP_RE = /group-title="([^"]*)"/;
const UA_RE = /user-agent="([^"]*)"/;

export function parseM3U(text: string): Omit<Channel, "id">[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const channels: Omit<Channel, "id">[] = [];
  let order = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith("#EXTINF")) continue;

    const match = EXTINF_RE.exec(line);
    if (!match) continue;

    const attrs = match[1] || "";
    const displayName = match[2]?.trim() || "";

    const name = TVG_NAME_RE.exec(attrs)?.[1] || displayName || "Unknown";
    const logo = TVG_LOGO_RE.exec(attrs)?.[1] || "";
    const group = GROUP_RE.exec(attrs)?.[1] || "Ungrouped";
    const userAgent = UA_RE.exec(attrs)?.[1] || "";
    void TVG_ID_RE.exec(attrs);

    // Next non-comment line is the URL
    let url = "";
    for (let j = i + 1; j < lines.length; j++) {
      if (!lines[j].startsWith("#")) {
        url = lines[j];
        i = j;
        break;
      }
    }

    if (!url) continue;

    channels.push({ name, group, url, logo, userAgent, order: order++ });
  }

  return channels;
}
