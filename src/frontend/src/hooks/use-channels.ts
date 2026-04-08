import { createActor } from "@/backend";
import type {
  Channel,
  ChannelInput,
  ChannelUpdate,
  ReorderEntry,
} from "@/types/channel";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toChannel(raw: any): Channel {
  return {
    id: Number(raw.id),
    name: String(raw.name),
    group: String(raw.group),
    url: String(raw.url),
    logo: String(raw.logo),
    userAgent: String(raw.userAgent),
    order: Number(raw.order),
  };
}

export function useChannels() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Channel[]>({
    queryKey: ["channels"],
    queryFn: async () => {
      if (!actor) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as any).listChannels();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (result as any[]).map(toChannel);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddChannel() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ChannelInput) => {
      if (!actor) throw new Error("Actor not ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as any).addChannel(input);
      return toChannel(result);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["channels"] }),
  });
}

export function useUpdateChannel() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (update: ChannelUpdate) => {
      if (!actor) throw new Error("Actor not ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).updateChannel(update);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["channels"] }),
  });
}

export function useDeleteChannel() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error("Actor not ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).deleteChannel(BigInt(id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["channels"] }),
  });
}

export function useReorderChannels() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entries: ReorderEntry[]) => {
      if (!actor) throw new Error("Actor not ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).reorderChannels(entries);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["channels"] }),
  });
}

export function useSaveChannels() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (inputs: ChannelInput[]) => {
      if (!actor) throw new Error("Actor not ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).importChannels(inputs);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["channels"] }),
  });
}

export function useClearChannels() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).clearChannels();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["channels"] }),
  });
}
