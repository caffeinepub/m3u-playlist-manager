import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ChannelInput } from "@/types/channel";
import { parseM3U } from "@/utils/m3u-parser";
import { Link2, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

interface ImportPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (channels: ChannelInput[]) => void;
  isPending?: boolean;
}

export function ImportPanel({
  open,
  onOpenChange,
  onImport,
  isPending,
}: ImportPanelProps) {
  const [urlValue, setUrlValue] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fileError, setFileError] = useState("");
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [pendingChannels, setPendingChannels] = useState<ChannelInput[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setUrlValue("");
    setUrlError("");
    setFileError("");
    setPreviewCount(null);
    setPendingChannels([]);
    onOpenChange(false);
  };

  const processText = (text: string) => {
    const parsed = parseM3U(text);
    const inputs: ChannelInput[] = parsed.map((ch, i) => ({ ...ch, order: i }));
    setPendingChannels(inputs);
    setPreviewCount(inputs.length);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    setPreviewCount(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      try {
        processText(text);
      } catch {
        setFileError("Failed to parse M3U file.");
      }
    };
    reader.readAsText(file);
  };

  const handleFetchUrl = async () => {
    if (!urlValue.trim()) {
      setUrlError("Please enter a URL.");
      return;
    }
    setUrlError("");
    setIsFetching(true);
    try {
      const res = await fetch(urlValue.trim());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      processText(text);
    } catch (err) {
      setUrlError(err instanceof Error ? err.message : "Failed to fetch URL.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleConfirmImport = () => {
    onImport(pendingChannels);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="import-panel-modal"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            Import M3U Playlist
          </DialogTitle>
        </DialogHeader>

        {previewCount !== null ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-background px-4 py-4 text-center">
              <p className="text-3xl font-bold font-display text-primary tabular-nums">
                {previewCount.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                channels parsed
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => {
                  setPreviewCount(null);
                  setPendingChannels([]);
                }}
              >
                <X className="w-4 h-4 mr-1.5" />
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleConfirmImport}
                disabled={isPending}
                data-ocid="import-confirm-btn"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-1.5" />
                )}
                {isPending ? "Importing…" : "Import All"}
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="file">
            <TabsList className="w-full bg-background border border-border">
              <TabsTrigger
                value="file"
                className="flex-1"
                data-ocid="import-tab-file"
              >
                File Upload
              </TabsTrigger>
              <TabsTrigger
                value="url"
                className="flex-1"
                data-ocid="import-tab-url"
              >
                From URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="mt-4">
              <label
                htmlFor="m3u-file-input"
                className="flex flex-col items-center gap-3 border-2 border-dashed border-border rounded-lg py-8 px-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors duration-200"
                data-ocid="import-file-drop"
              >
                <Upload className="w-8 h-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    Click to select .m3u or .m3u8 file
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    or drag and drop here
                  </p>
                </div>
                <input
                  ref={fileRef}
                  id="m3u-file-input"
                  type="file"
                  accept=".m3u,.m3u8,.txt"
                  className="sr-only"
                  onChange={handleFile}
                  data-ocid="import-file-input"
                />
              </label>
              {fileError && (
                <p className="text-xs text-destructive mt-2">{fileError}</p>
              )}
            </TabsContent>

            <TabsContent value="url" className="mt-4 space-y-3">
              <div className="flex gap-2">
                <Input
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                  placeholder="https://example.com/playlist.m3u"
                  className="bg-background border-input text-foreground font-mono text-sm"
                  data-ocid="import-url-input"
                  onKeyDown={(e) => e.key === "Enter" && handleFetchUrl()}
                />
                <Button
                  onClick={handleFetchUrl}
                  disabled={isFetching}
                  data-ocid="import-url-fetch"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                >
                  {isFetching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Link2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {urlError && (
                <p className="text-xs text-destructive">{urlError}</p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
