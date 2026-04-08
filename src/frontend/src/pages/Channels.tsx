import { ChannelForm } from "@/components/ChannelForm";
import { ChannelTable } from "@/components/ChannelTable";
import { GroupStats } from "@/components/GroupStats";
import { ImportPanel } from "@/components/ImportPanel";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddChannel,
  useChannels,
  useClearChannels,
  useDeleteChannel,
  useReorderChannels,
  useSaveChannels,
  useUpdateChannel,
} from "@/hooks/use-channels";
import { usePlaylist } from "@/hooks/use-playlist";
import type { Channel, ChannelInput, ChannelWithStatus } from "@/types/channel";
import { downloadM3U } from "@/utils/m3u-exporter";
import {
  ChevronDown,
  Download,
  Plus,
  Search,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function Channels() {
  const { data: channels = [], isLoading } = useChannels();
  const addChannel = useAddChannel();
  const updateChannel = useUpdateChannel();
  const deleteChannel = useDeleteChannel();
  const reorderChannels = useReorderChannels();
  const saveChannels = useSaveChannels();
  const clearChannels = useClearChannels();

  const { filters, setSearch, setGroup, filteredChannels, groups, stats } =
    usePlaylist(channels);

  // UI state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [editChannel, setEditChannel] = useState<Channel | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [bulkGroup, setBulkGroup] = useState("");

  // Selection handlers
  const handleSelectToggle = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedIds(
        checked ? new Set(filteredChannels.map((c) => c.id)) : new Set(),
      );
    },
    [filteredChannels],
  );

  // Add/Edit
  const handleOpenAdd = () => {
    setEditChannel(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (ch: ChannelWithStatus) => {
    setEditChannel(ch);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: ChannelInput) => {
    if (editChannel) {
      await updateChannel.mutateAsync({ ...data, id: editChannel.id });
      toast.success("Channel updated");
    } else {
      await addChannel.mutateAsync({ ...data, order: channels.length });
      toast.success("Channel added");
    }
    setFormOpen(false);
  };

  // Delete
  const handleDelete = async (id: number) => {
    await deleteChannel.mutateAsync(id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    toast.success("Channel deleted");
  };

  // Reorder
  const handleMoveUp = useCallback(
    async (id: number) => {
      const idx = filteredChannels.findIndex((c) => c.id === id);
      if (idx <= 0) return;
      const reordered = [...filteredChannels];
      [reordered[idx - 1], reordered[idx]] = [
        reordered[idx],
        reordered[idx - 1],
      ];
      await reorderChannels.mutateAsync(
        reordered.map((c, i) => ({ id: c.id, order: i })),
      );
    },
    [filteredChannels, reorderChannels],
  );

  const handleMoveDown = useCallback(
    async (id: number) => {
      const idx = filteredChannels.findIndex((c) => c.id === id);
      if (idx < 0 || idx >= filteredChannels.length - 1) return;
      const reordered = [...filteredChannels];
      [reordered[idx], reordered[idx + 1]] = [
        reordered[idx + 1],
        reordered[idx],
      ];
      await reorderChannels.mutateAsync(
        reordered.map((c, i) => ({ id: c.id, order: i })),
      );
    },
    [filteredChannels, reorderChannels],
  );

  // Import
  const handleImport = async (imported: ChannelInput[]) => {
    await saveChannels.mutateAsync(imported);
    toast.success(`Imported ${imported.length} channels`);
    setImportOpen(false);
  };

  // Export
  const handleExport = () => {
    const toExport =
      selectedIds.size > 0
        ? channels.filter((c) => selectedIds.has(c.id))
        : channels;
    downloadM3U(toExport);
    toast.success(
      `Exported ${toExport.length} channel${toExport.length !== 1 ? "s" : ""}`,
    );
  };

  // Bulk assign group
  const handleBulkAssignGroup = async () => {
    if (!bulkGroup || selectedIds.size === 0) return;
    const updates = channels
      .filter((c) => selectedIds.has(c.id))
      .map((c) => updateChannel.mutateAsync({ ...c, group: bulkGroup }));
    await Promise.all(updates);
    toast.success(
      `Assigned group "${bulkGroup}" to ${selectedIds.size} channels`,
    );
    setSelectedIds(new Set());
    setBulkGroup("");
  };

  // Clear all
  const handleClearAll = async () => {
    await clearChannels.mutateAsync();
    setSelectedIds(new Set());
    setClearOpen(false);
    toast.success("All channels cleared");
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Stats Bar */}
      <GroupStats
        total={stats.total}
        groups={stats.groups}
        validated={stats.validated}
        flags={stats.flags}
      />

      {/* Toolbar */}
      <div className="border-b border-border bg-background px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name or URL…"
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background border-input text-foreground"
              data-ocid="search-input"
            />
          </div>

          {/* Group filter */}
          <Select
            value={filters.group || "__all__"}
            onValueChange={(v) => setGroup(v === "__all__" ? "" : v)}
            data-ocid="group-filter"
          >
            <SelectTrigger
              className="w-44 bg-background border-input"
              data-ocid="group-filter-trigger"
            >
              <SelectValue placeholder="All Groups" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="__all__">All Groups</SelectItem>
              {groups.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1" />

          {/* Bulk actions (visible only when items selected) */}
          {selectedIds.size > 0 && (
            <div
              className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-md px-3 py-1.5"
              data-ocid="bulk-actions-bar"
            >
              <span className="text-xs text-primary font-medium">
                {selectedIds.size} selected
              </span>
              <Select
                value={bulkGroup}
                onValueChange={setBulkGroup}
                data-ocid="bulk-group-select"
              >
                <SelectTrigger className="h-7 w-36 text-xs bg-background border-input">
                  <SelectValue placeholder="Assign group…" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {groups.map((g) => (
                    <SelectItem key={g} value={g} className="text-xs">
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-primary hover:text-primary"
                onClick={handleBulkAssignGroup}
                disabled={!bulkGroup}
                data-ocid="bulk-assign-btn"
              >
                <Users className="w-3.5 h-3.5 mr-1" />
                Apply
              </Button>
            </div>
          )}

          {/* Action buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setImportOpen(true)}
            data-ocid="import-btn"
            className="border-border hover:border-primary/40 hover:text-primary"
          >
            <Upload className="w-4 h-4 mr-1.5" />
            Import M3U
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            data-ocid="export-btn"
            className="border-border hover:border-primary/40 hover:text-primary"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
          </Button>

          <Button
            size="sm"
            onClick={handleOpenAdd}
            data-ocid="add-channel-btn"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Channel
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                data-ocid="more-actions-trigger"
                aria-label="More actions"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                onClick={() => setClearOpen(true)}
                data-ocid="clear-all-trigger"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Channels
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-screen-xl mx-auto">
          {isLoading ? (
            <div className="p-6 space-y-3" data-ocid="channels-loading">
              {(["a", "b", "c", "d", "e", "f", "g", "h"] as const).map((k) => (
                <Skeleton key={k} className="h-10 w-full rounded" />
              ))}
            </div>
          ) : (
            <ChannelTable
              channels={filteredChannels}
              selectedIds={selectedIds}
              onSelectToggle={handleSelectToggle}
              onSelectAll={handleSelectAll}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <ChannelForm
        open={formOpen}
        onOpenChange={setFormOpen}
        channel={editChannel}
        groups={groups}
        onSubmit={handleFormSubmit}
        isPending={addChannel.isPending || updateChannel.isPending}
      />

      <ImportPanel
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={handleImport}
        isPending={saveChannels.isPending}
      />

      {/* Clear all confirmation */}
      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Clear All Channels
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete all {channels.length} channels from
              your playlist. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="clear-all-cancel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="clear-all-confirm"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleClearAll}
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
