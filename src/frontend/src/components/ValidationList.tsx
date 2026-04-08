import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChannelStatus, ChannelWithStatus } from "@/types/channel";
import {
  CheckCircle2,
  Clock,
  Loader2,
  RotateCcw,
  WifiOff,
  XCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: ChannelStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "valid") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold status-valid">
        <CheckCircle2 className="w-3 h-3" />
        Valid
      </span>
    );
  }
  if (status === "slow") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold status-pending">
        <Clock className="w-3 h-3" />
        Slow
      </span>
    );
  }
  if (status === "offline") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold status-invalid">
        <WifiOff className="w-3 h-3" />
        Offline
      </span>
    );
  }
  // unknown — testing / idle
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
      <span className="w-3 h-3 rounded-full bg-muted-foreground/30" />—
    </span>
  );
}

interface RowSkeletonProps {
  count?: number;
}

function RowSkeleton({ count = 8 }: RowSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => `skel-${i}`).map((key) => (
        <tr key={key} className="border-b border-border/50">
          <td className="px-4 py-3">
            <Skeleton className="h-5 w-16 rounded" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-32 rounded" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-20 rounded" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-56 rounded" />
          </td>
          <td className="px-4 py-3 text-right">
            <Skeleton className="h-7 w-14 rounded ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}

interface ValidationListProps {
  channels: ChannelWithStatus[];
  isLoading: boolean;
  isRunning: boolean;
  onTestSingle: (id: number) => void;
  filter: string;
}

export function ValidationList({
  channels,
  isLoading,
  isRunning,
  onTestSingle,
  filter,
}: ValidationListProps) {
  const lower = filter.toLowerCase();
  const visible = lower
    ? channels.filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          c.url.toLowerCase().includes(lower) ||
          c.group.toLowerCase().includes(lower),
      )
    : channels;

  return (
    <div className="overflow-x-auto" data-ocid="validation-list">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border bg-card/60 text-muted-foreground text-xs uppercase tracking-wider sticky top-[56px] z-10">
            <th className="px-4 py-2.5 text-left w-[90px]">Status</th>
            <th className="px-4 py-2.5 text-left min-w-[160px]">
              Channel Name
            </th>
            <th className="px-4 py-2.5 text-left w-[120px]">Group</th>
            <th className="px-4 py-2.5 text-left">URL</th>
            <th className="px-4 py-2.5 text-right w-[80px]">Test</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <RowSkeleton count={10} />
          ) : visible.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-16 text-center text-muted-foreground text-sm"
                data-ocid="validation-empty"
              >
                {filter
                  ? "No channels match your search."
                  : "Import an M3U list to validate channels."}
              </td>
            </tr>
          ) : (
            visible.map((ch) => (
              <tr
                key={ch.id}
                data-ocid={`validation-row-${ch.id}`}
                className={[
                  "border-b border-border/40 transition-colors duration-150 hover:bg-muted/20",
                  ch.status === "offline"
                    ? "bg-destructive/5 hover:bg-destructive/10"
                    : "",
                ].join(" ")}
              >
                <td className="px-4 py-2.5">
                  <StatusBadge status={ch.status} />
                </td>
                <td className="px-4 py-2.5 font-medium text-foreground max-w-[200px]">
                  <span className="block truncate" title={ch.name}>
                    {ch.name}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  <Badge
                    variant="outline"
                    className="text-xs border-border text-muted-foreground"
                  >
                    {ch.group || "—"}
                  </Badge>
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground max-w-[340px]">
                  <span className="block truncate" title={ch.url}>
                    {ch.url}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs hover:text-primary hover:bg-primary/10"
                    disabled={isRunning}
                    onClick={() => onTestSingle(ch.id)}
                    aria-label={`Test ${ch.name}`}
                    data-ocid={`test-single-${ch.id}`}
                  >
                    {ch.status === "unknown" && isRunning ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : ch.status === "offline" ? (
                      <XCircle className="w-3 h-3 text-destructive" />
                    ) : (
                      <RotateCcw className="w-3 h-3" />
                    )}
                    <span className="ml-1">Test</span>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
