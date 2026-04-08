import type { AppTab } from "@/App";
import { Radio } from "lucide-react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  activeTab?: AppTab;
  onTabChange?: (tab: AppTab) => void;
}

const NAV_TABS: { id: AppTab; label: string }[] = [
  { id: "channels", label: "Channels" },
  { id: "validate", label: "Validate" },
];

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const footerUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header
        className="bg-card border-b border-border sticky top-0 z-50"
        data-ocid="main-header"
      >
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary/20 flex items-center justify-center">
              <Radio className="w-4 h-4 text-primary" strokeWidth={2} />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-foreground">
              Flow<span className="text-primary">Stream</span>
            </span>
          </div>

          {/* Tab navigation */}
          {onTabChange && (
            <nav className="flex items-center gap-1" data-ocid="main-nav">
              {NAV_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTabChange(t.id)}
                  data-ocid={`nav-${t.id}`}
                  className={[
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200",
                    activeTab === t.id
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                  ].join(" ")}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="max-w-screen-xl mx-auto px-6 h-10 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">
            © {year}.{" "}
            <a
              href={footerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-200"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
