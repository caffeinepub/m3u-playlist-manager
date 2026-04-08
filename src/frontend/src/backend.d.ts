import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ReorderEntry {
    id: ChannelId;
    order: bigint;
}
export interface ChannelInput {
    url: string;
    order: bigint;
    logo: string;
    name: string;
    group: string;
    userAgent: string;
}
export type ChannelId = bigint;
export interface Channel {
    id: ChannelId;
    url: string;
    order: bigint;
    logo: string;
    name: string;
    group: string;
    userAgent: string;
}
export interface ChannelUpdate {
    id: ChannelId;
    url: string;
    order: bigint;
    logo: string;
    name: string;
    group: string;
    userAgent: string;
}
export interface backendInterface {
    addChannel(input: ChannelInput): Promise<ChannelId>;
    clearChannels(): Promise<void>;
    deleteChannel(id: ChannelId): Promise<boolean>;
    getChannel(id: ChannelId): Promise<Channel | null>;
    importChannels(inputs: Array<ChannelInput>): Promise<bigint>;
    listChannels(): Promise<Array<Channel>>;
    reorderChannels(entries: Array<ReorderEntry>): Promise<void>;
    updateChannel(update: ChannelUpdate): Promise<boolean>;
}
