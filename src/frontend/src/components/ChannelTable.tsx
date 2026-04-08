import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { ChannelWithStatus } from "@/types/channel";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface ChannelTableProps {
  channels: ChannelWithStatus[];
  selectedIds: Set<number>;
  onSelectToggle: (id: number) => void;
  onSelectAll: (checked: boolean) => void;
  onEdit: (channel: ChannelWithStatus) => void;
  onDelete: (id: number) => void;
  onMoveUp: (id: number) => void;
  onMoveDown: (id: number) => void;
}

const STATUS_STYLES: Record<string, string> = {
  valid: "status-valid border-transparent",
  slow: "status-pending border-transparent",
  offline: "status-invalid border-transparent",
  unknown: "bg-muted text-muted-foreground border-border",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide border ${STATUS_STYLES[status] ?? STATUS_STYLES.unknown}`}
    >
      {status}
    </span>
  );
}

function truncateUrl(url: string, max = 42) {
  if (url.length <= max) return url;
  return `${url.slice(0, max - 1)}…`;
}

export function ChannelTable({
  channels,
  selectedIds,
  onSelectToggle,
  onSelectAll,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: ChannelTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const allSelected =
    channels.length > 0 && selectedIds.size === channels.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  return (
    <>
      <div className="overflow-auto" data-ocid="channel-table-container">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-card sticky top-0 z-10">
              <th className="w-10 px-3 py-2.5 text-left">
                <Checkbox
                  checked={allSelected}
                  data-state={someSelected ? "indeterminate" : undefined}
                  onCheckedChange={(v) => onSelectAll(!!v)}
                  data-ocid="select-all-checkbox"
                  aria-label="Select all"
                />
              </th>
              <th className="w-8 px-2 py-2.5" />
              <th className="w-24 px-3 py-2.5 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Status
              </th>
              <th className="px-3 py-2.5 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide min-w-[160px]">
                Channel Name
              </th>
              <th className="px-3 py-2.5 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide min-w-[100px]">
                Group
              </th>
              <th className="px-3 py-2.5 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide min-w-[220px]">
                URL
              </th>
              <th className="px-3 py-2.5 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide min-w-[160px]">
                Logo URL
              </th>
              <th className="px-3 py-2.5 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide min-w-[140px]">
                User-Agent
              </th>
              <th className="w-28 px-3 py-2.5 text-right font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {channels.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="py-16 text-center text-muted-foreground"
                  data-ocid="channel-table-empty"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl opacity-20">📡</span>
                    <p className="text-sm">No channels yet.</p>
                    <p className="text-xs">
                      Import an M3U file or add a channel manually.
                    </p>
                  </div>
                </td>
              </tr>
            )}
            {channels.map((ch, idx) => {
              const isSelected = selectedIds.has(ch.id);
              return (
                <tr
                  key={ch.id}
                  className={`group transition-colors duration-100 ${
                    isSelected ? "bg-primary/5" : "hover:bg-muted/40"
                  }`}
                  data-ocid={`channel-row-${ch.id}`}
                >
                  <td className="px-3 py-2.5">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectToggle(ch.id)}
                      data-ocid={`row-checkbox-${ch.id}`}
                      aria-label={`Select ${ch.name}`}
                    />
                  </td>
                  <td className="px-2 py-2.5">
                    <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab" />
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={ch.status} />
                  </td>
                  <td className="px-3 py-2.5 font-medium text-foreground truncate max-w-[180px]">
                    {ch.name}
                  </td>
                  <td className="px-3 py-2.5">
                    {ch.group ? (
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {ch.group}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                    <span title={ch.url}>{truncateUrl(ch.url)}</span>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                    {ch.logo ? (
                      <span title={ch.logo}>{truncateUrl(ch.logo)}</span>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                    {ch.userAgent ? (
                      <span title={ch.userAgent}>
                        {truncateUrl(ch.userAgent, 22)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-0.5 opacity-60 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => onMoveUp(ch.id)}
                        disabled={idx === 0}
                        aria-label="Move up"
                        data-ocid={`move-up-${ch.id}`}
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => onMoveDown(ch.id)}
                        disabled={idx === channels.length - 1}
                        aria-label="Move down"
                        data-ocid={`move-down-${ch.id}`}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => onEdit(ch)}
                        aria-label="Edit channel"
                        data-ocid={`edit-channel-${ch.id}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteTarget(ch.id)}
                        aria-label="Delete channel"
                        data-ocid={`delete-channel-${ch.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Channel
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. The channel will be permanently
              removed from your playlist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="delete-cancel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="delete-confirm"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget !== null) {
                  onDelete(deleteTarget);
                  setDeleteTarget(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
