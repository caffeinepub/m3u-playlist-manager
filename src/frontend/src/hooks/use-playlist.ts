import type { Channel, ChannelWithStatus } from "@/types/channel";
import { useMemo, useState } from "react";

export interface PlaylistFilters {
  search: string;
  group: string;
}

export interface UsePlaylistReturn {
  filters: PlaylistFilters;
  setSearch: (search: string) => void;
  setGroup: (group: string) => void;
  filteredChannels: ChannelWithStatus[];
  groups: string[];
  stats: {
    total: number;
    groups: number;
    validated: number;
    flags: number;
  };
}

export function usePlaylist(channels: Channel[]): UsePlaylistReturn {
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("");

  const channelsWithStatus = useMemo<ChannelWithStatus[]>(
    () =>
      channels.map((ch) => ({
        ...ch,
        // Status is cosmetic for now — real validation happens async in pages
        status: "unknown" as const,
      })),
    [channels],
  );

  const groups = useMemo(() => {
    const set = new Set(channels.map((ch) => ch.group).filter(Boolean));
    return Array.from(set).sort();
  }, [channels]);

  const filteredChannels = useMemo(() => {
    let result = channelsWithStatus;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (ch) =>
          ch.name.toLowerCase().includes(q) ||
          ch.url.toLowerCase().includes(q) ||
          ch.group.toLowerCase().includes(q),
      );
    }

    if (group) {
      result = result.filter((ch) => ch.group === group);
    }

    return result.sort((a, b) => a.order - b.order);
  }, [channelsWithStatus, search, group]);

  const stats = useMemo(
    () => ({
      total: channels.length,
      groups: groups.length,
      validated: channelsWithStatus.filter((ch) => ch.status === "valid")
        .length,
      flags: channelsWithStatus.filter((ch) => ch.status === "offline").length,
    }),
    [channels, groups, channelsWithStatus],
  );

  return {
    filters: { search, group },
    setSearch,
    setGroup,
    filteredChannels,
    groups,
    stats,
  };
}
