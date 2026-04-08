import { ValidationList } from "@/components/ValidationList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChannels } from "@/hooks/use-channels";
import { useValidation } from "@/hooks/use-validation";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  PlayCircle,
  RotateCcw,
  Search,
  Square,
  WifiOff,
} from "lucide-react";
import { useState } from "react";

export function Validate() {
  const { data: source = [], isLoading } = useChannels();
  const {
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
  } = useValidation(source);
  const [search, setSearch] = useState("");

  const valid = channels.filter((c) => c.status === "valid").length;
  const slow = channels.filter((c) => c.status === "slow").length;

  return (
    <div className="flex-1 flex flex-col max-w-screen-xl mx-auto w-full px-6 py-6 gap-5">
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-9 bg-card border-input placeholder:text-muted-foreground text-sm"
            placeholder="Filter by name, group or URL…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="validate-search"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={resetStatuses}
            disabled={isRunning || total === 0}
            className="gap-1.5 text-sm"
            data-ocid="validate-reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
          {isRunning ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={stopValidation}
              className="gap-1.5 text-sm"
              data-ocid="validate-stop"
            >
              <Square className="w-3.5 h-3.5" />
              Stop
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={startValidation}
              disabled={total === 0}
              className="gap-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="validate-start"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              Validate All
            </Button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Total"
          value={total}
          icon={<Search className="w-4 h-4 text-muted-foreground" />}
        />
        <StatCard
          label="Working"
          value={valid}
          icon={<CheckCircle2 className="w-4 h-4 status-valid" />}
          highlight={valid > 0 ? "valid" : undefined}
        />
        <StatCard
          label="Slow"
          value={slow}
          icon={<Loader2 className="w-4 h-4 status-pending" />}
          highlight={slow > 0 ? "slow" : undefined}
        />
        <StatCard
          label="Offline"
          value={flagged}
          icon={<WifiOff className="w-4 h-4 status-invalid" />}
          highlight={flagged > 0 ? "offline" : undefined}
        />
      </div>

      {/* Progress bar (visible while running or partially done) */}
      {(isRunning || (tested > 0 && tested < total)) && (
        <div
          className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-4"
          data-ocid="validation-progress"
        >
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                {isRunning && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                )}
                {isRunning
                  ? `Validating ${tested + 1} of ${total} streams…`
                  : `Validated ${tested} of ${total} streams`}
              </span>
              <span className="font-mono font-semibold text-foreground">
                {progress}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Flagged warning */}
      {!isRunning && flagged > 0 && tested === total && total > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive-foreground text-sm"
          data-ocid="validation-flagged-banner"
        >
          <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
          <span>
            <strong>{flagged}</strong> channel{flagged !== 1 ? "s" : ""} are
            offline and highlighted below. Consider removing or fixing their
            URLs.
          </span>
        </div>
      )}

      {/* Table card */}
      <div className="bg-card border border-border rounded-lg overflow-hidden flex-1">
        <ValidationList
          channels={channels}
          isLoading={isLoading}
          isRunning={isRunning}
          onTestSingle={testSingle}
          filter={search}
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  highlight?: "valid" | "slow" | "offline";
}

function StatCard({ label, value, icon, highlight }: StatCardProps) {
  const accent =
    highlight === "valid"
      ? "status-valid"
      : highlight === "slow"
        ? "status-pending"
        : highlight === "offline"
          ? "status-invalid"
          : "text-foreground";

  return (
    <div
      className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-3"
      data-ocid={`stat-${label.toLowerCase()}`}
    >
      {icon}
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={`text-xl font-bold font-mono leading-none mt-0.5 ${accent}`}
        >
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
