import type {
  Channel,
  ChannelStatus,
  ChannelWithStatus,
} from "@/types/channel";
import { useCallback, useEffect, useRef, useState } from "react";

const VALIDATION_TIMEOUT_MS = 8000;
const SLOW_THRESHOLD_MS = 3000;
const CONCURRENCY = 5;

async function probeUrl(
  url: string,
): Promise<{ status: ChannelStatus; ms: number }> {
  const start = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), VALIDATION_TIMEOUT_MS);
  try {
    // Try HEAD first; fall back to GET for servers that reject HEAD
    let res: Response | null = null;
    try {
      res = await fetch(url, {
        method: "HEAD",
        signal: controller.signal,
        cache: "no-store",
        mode: "no-cors", // avoid CORS block; opaque response still tells us the server replied
      });
    } catch {
      // HEAD failed, try GET with range
      res = await fetch(url, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
        signal: controller.signal,
        cache: "no-store",
        mode: "no-cors",
      });
    }
    const ms = performance.now() - start;
    // In no-cors mode a successful fetch returns an opaque response (type==="opaque")
    // which means the server responded; treat that as "reachable"
    if (res.type === "opaque" || res.ok || res.status === 206) {
      return { status: ms > SLOW_THRESHOLD_MS ? "slow" : "valid", ms };
    }
    return { status: "offline", ms };
  } catch {
    return { status: "offline", ms: performance.now() - start };
  } finally {
    clearTimeout(timer);
  }
}

export interface ValidationState {
  channels: ChannelWithStatus[];
  isRunning: boolean;
  progress: number; // 0–100
  tested: number;
  total: number;
  flagged: number;
  startValidation: () => void;
  stopValidation: () => void;
  testSingle: (id: number) => void;
  resetStatuses: () => void;
}

export function useValidation(source: Channel[]): ValidationState {
  const [channels, setChannels] = useState<ChannelWithStatus[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [tested, setTested] = useState(0);
  const stopRef = useRef(false);

  // Sync source into state (preserve existing statuses)
  useEffect(() => {
    setChannels((prev) => {
      const prevMap = new Map(prev.map((c) => [c.id, c.status]));
      return source.map((ch) => ({
        ...ch,
        status: prevMap.get(ch.id) ?? "unknown",
      }));
    });
    setTested((prev) => prev); // no reset on re-sync
  }, [source]);

  const updateStatus = useCallback((id: number, status: ChannelStatus) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
  }, []);

  const testSingle = useCallback(
    async (id: number) => {
      const ch = channels.find((c) => c.id === id);
      if (!ch) return;
      updateStatus(id, "unknown"); // reset to "testing" visual
      const { status } = await probeUrl(ch.url);
      updateStatus(id, status);
    },
    [channels, updateStatus],
  );

  const startValidation = useCallback(async () => {
    if (isRunning) return;
    stopRef.current = false;
    setIsRunning(true);
    setTested(0);

    // Reset all statuses
    setChannels((prev) =>
      prev.map((c) => ({ ...c, status: "unknown" as ChannelStatus })),
    );

    const queue = [...channels];
    let done = 0;

    async function worker() {
      while (queue.length > 0 && !stopRef.current) {
        const ch = queue.shift();
        if (!ch) break;
        updateStatus(ch.id, "unknown");
        const { status } = await probeUrl(ch.url);
        if (!stopRef.current) {
          updateStatus(ch.id, status);
          done++;
          setTested(done);
        }
      }
    }

    const workers = Array.from(
      { length: Math.min(CONCURRENCY, queue.length) },
      worker,
    );
    await Promise.all(workers);

    setIsRunning(false);
  }, [channels, isRunning, updateStatus]);

  const stopValidation = useCallback(() => {
    stopRef.current = true;
    setIsRunning(false);
  }, []);

  const resetStatuses = useCallback(() => {
    setChannels((prev) =>
      prev.map((c) => ({ ...c, status: "unknown" as ChannelStatus })),
    );
    setTested(0);
  }, []);

  const total = channels.length;
  const progress = total === 0 ? 0 : Math.round((tested / total) * 100);
  const flagged = channels.filter((c) => c.status === "offline").length;

  return {
    channels,
    isRunning,
    progress,
    tested,
    total,
    flagged,
    startValidation,
    stopValidation,
    testSingle,
    resetStatuses,
  };
}
