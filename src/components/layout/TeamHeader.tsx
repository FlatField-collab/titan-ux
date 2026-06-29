import { Map, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGuardedNavigate } from "@/lib/routes";

export type TeamHeaderTab = "Team" | "Docs" | "Performance" | "Schedule" | "Tests";

const TABS: TeamHeaderTab[] = ["Team", "Docs", "Performance", "Schedule", "Tests"];

const TAB_ROUTES: Partial<Record<TeamHeaderTab, string>> = {
  Team: "/team",
  Docs: "/docs",
  Performance: "/performance",
};

const Pill = ({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "shrink-0 inline-flex items-center gap-1 px-4 py-1.5 rounded-pill text-[14px] font-medium transition",
      active
        ? "bg-[#0b0b0c] text-white"
        : "bg-card text-foreground border border-border",
    )}
  >
    {children}
  </button>
);

/**
 * Shared top-of-page header region used by Team, Docs, and Performance.
 * Renders: page title (h1) + map button → search/filter icon row + pill tabs.
 * StatusBar and page body are owned by the individual pages.
 */
export const TeamHeader = ({
  title = "Team",
  active,
  onMap,
  onSearch,
  onFilter,
}: {
  title?: string;
  active: TeamHeaderTab;
  onMap?: () => void;
  onSearch?: () => void;
  onFilter?: () => void;
}) => {
  const navigate = useGuardedNavigate();
  const handleMap = onMap ?? (() => navigate("/map"));

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-2 pb-2">
        <h1 className="text-[34px] font-bold tracking-tight">{title}</h1>
        <button
          type="button"
          onClick={handleMap}
          className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center"
          aria-label="Map"
        >
          <Map className="w-4 h-4 text-foreground" />
        </button>
      </header>

      {/* Search + filter + pill tabs */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar items-center">
          <button
            type="button"
            onClick={onSearch}
            className="shrink-0 w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-foreground" />
          </button>
          <button
            type="button"
            onClick={onFilter}
            className="shrink-0 w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center"
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-4 h-4 text-foreground" />
          </button>
          {TABS.map((t) => (
            <Pill
              key={t}
              active={t === active}
              onClick={() => {
                if (t === active) return;
                const route = TAB_ROUTES[t];
                if (route) navigate(route);
              }}
            >
              {t}
            </Pill>
          ))}
        </div>
      </div>
    </>
  );
};

export default TeamHeader;
