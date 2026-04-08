import { Flag, Layers, List, ShieldCheck } from "lucide-react";

interface StatsProps {
  total: number;
  groups: number;
  validated: number;
  flags: number;
}

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
}

function StatItem({ icon, value, label }: StatItemProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3" data-ocid="stat-item">
      <div className="text-primary/60">{icon}</div>
      <div>
        <p className="text-xl font-bold font-display text-foreground tabular-nums leading-none">
          {value.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export function GroupStats({ total, groups, validated, flags }: StatsProps) {
  return (
    <div
      className="flex items-center divide-x divide-border border-b border-border bg-card"
      data-ocid="group-stats"
    >
      <div className="flex items-center gap-3 px-5 py-3">
        <div className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center">
          <List className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-xl font-bold font-display text-foreground tabular-nums leading-none">
            {total.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Channels</p>
        </div>
      </div>
      <StatItem
        icon={<Layers className="w-4 h-4" />}
        value={groups}
        label="Groups"
      />
      <StatItem
        icon={<ShieldCheck className="w-4 h-4" />}
        value={validated}
        label="Validated"
      />
      <StatItem
        icon={<Flag className="w-4 h-4" />}
        value={flags}
        label="Flags"
      />
    </div>
  );
}
