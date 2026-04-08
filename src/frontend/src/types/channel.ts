export interface Channel {
  id: number;
  name: string;
  group: string;
  url: string;
  logo: string;
  userAgent: string;
  order: number;
}

export interface ChannelInput {
  name: string;
  group: string;
  url: string;
  logo: string;
  userAgent: string;
  order: number;
}

export interface ChannelUpdate {
  id: number;
  name: string;
  group: string;
  url: string;
  logo: string;
  userAgent: string;
  order: number;
}

export interface ReorderEntry {
  id: number;
  order: number;
}

export type ChannelStatus = "valid" | "slow" | "offline" | "unknown";

export interface ChannelWithStatus extends Channel {
  status: ChannelStatus;
}
