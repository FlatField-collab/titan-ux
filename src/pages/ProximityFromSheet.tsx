import { useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X, Navigation, User, MapPin, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { TECHS } from "@/lib/techData";

export type FromValue =
  | { kind: "current" }
  | { kind: "tech"; techId: string; name: string }
  | { kind: "premise"; line1: string; line2: string };

type View = "menu" | "tech" | "job";

const TECH_ORDER = [
  "tech-1",
  "tech-4",
  "tech-2",
  "tech-3",
  "tech-5",
  "tech-6",
  "av-1",
  "av-2",
  "off-1",
  "off-2",
];

function statusLine(id: string): string {
  const t = TECHS[id];
  if (!t) return "";
  const cj = t.currentJob;
  if (!cj) return t.emptyJobMessage ?? "Off";
  const presence = cj.presence ?? (cj.status === "Dispatched" ? "Driving" : undefined);
  return presence ? `${cj.status} · ${presence}` : cj.status;
}

export function ProximityFromSheet({
  open,
  onOpenChange,
  value,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  value: FromValue;
  onSelect: (v: FromValue) => void;
}) {
  const [view, setView] = useState<View>("menu");
  const [tab, setTab] = useState<"Team" | "Turf">("Team");

  const pick = (v: FromValue) => {
    onSelect(v);
    setView("menu");
    onOpenChange(false);
  };

  const handleOpen = (o: boolean) => {
    if (!o) setView("menu");
    onOpenChange(o);
  };

  // Build deduped active job address list from techs with a currentJob
  const jobRows = useMemo(() => {
    const seen = new Set<string>();
    const rows: {
      key: string;
      line1: string;
      line2: string;
      techName: string;
      jobType: string;
    }[] = [];
    for (const id of TECH_ORDER) {
      const t = TECHS[id];
      const cj = t?.currentJob;
      if (!cj?.address) continue;
      const [line1, line2 = ""] = cj.address.split("\n");
      const key = `${line1}|${line2}`.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({ key, line1, line2, techName: t.name, jobType: cj.jobType });
    }
    return rows;
  }, []);

  const selectedTechId = value.kind === "tech" ? value.techId : null;
  const selectedPremiseKey =
    value.kind === "premise"
      ? `${value.line1}|${value.line2}`.toLowerCase()
      : null;

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl p-0 bg-[#F2F2F6] h-[85vh] max-w-[393px] mx-auto"
      >
        <div className="flex flex-col h-full">
          <div className="pt-2 flex justify-center">
            <div className="w-9 h-1 rounded-full bg-muted-foreground/40" />
          </div>
          <SheetHeader className="relative px-4 pt-3 pb-4">
            <button
              onClick={() => (view === "menu" ? handleOpen(false) : setView("menu"))}
              className="absolute left-4 top-2 w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center"
              aria-label={view === "menu" ? "Close" : "Back"}
            >
              <X className="w-4 h-4" />
            </button>
            <SheetTitle className="text-center text-base font-semibold">
              {view === "menu"
                ? "Proximity From"
                : view === "tech"
                  ? "Select Technician"
                  : "Select Job Address"}
            </SheetTitle>
          </SheetHeader>

          {view === "menu" && (
            <div className="px-4 space-y-2">
              <MenuRow
                icon={<Navigation className="w-4 h-4 text-blue-600" />}
                label="My Location"
                sub="Use your current device location"
                selected={value.kind === "current"}
                onClick={() => pick({ kind: "current" })}
              />
              <MenuRow
                icon={<User className="w-4 h-4 text-blue-600" />}
                label="Specific Technician"
                sub="Anchor to a technician's live location"
                selected={value.kind === "tech"}
                onClick={() => setView("tech")}
              />
              <MenuRow
                icon={<MapPin className="w-4 h-4 text-blue-600" />}
                label="Job Address"
                sub="Anchor to an active job's address"
                selected={value.kind === "premise"}
                onClick={() => setView("job")}
              />
            </div>
          )}

          {view === "tech" && (
            <div className="flex-1 flex flex-col overflow-hidden px-4">
              <div className="bg-white rounded-2xl border border-border flex-1 flex flex-col overflow-hidden">
                <div className="p-2">
                  <div className="bg-[#F2F2F6] rounded-full p-1 grid grid-cols-2 text-sm font-medium">
                    {(["Team", "Turf"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={cn(
                          "py-1.5 rounded-full transition-colors",
                          tab === t ? "bg-white shadow-sm" : "text-muted-foreground",
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-border">
                  {TECH_ORDER.map((id) => {
                    const t = TECHS[id];
                    if (!t) return null;
                    const checked = selectedTechId === id;
                    return (
                      <button
                        key={id}
                        onClick={() => pick({ kind: "tech", techId: id, name: t.name })}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left"
                      >
                        {t.avatarUrl ? (
                          <img
                            src={t.avatarUrl}
                            alt={t.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                            {t.initials}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold truncate">{t.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {statusLine(id)}
                          </div>
                        </div>
                        <span
                          className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center shrink-0",
                            checked
                              ? "border-blue-600 bg-blue-600"
                              : "border-muted-foreground/40 bg-white",
                          )}
                        >
                          {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {view === "job" && (
            <div className="flex-1 flex flex-col overflow-hidden px-4">
              <div className="bg-white rounded-2xl border border-border flex-1 overflow-y-auto divide-y divide-border">
                {jobRows.map((r) => {
                  const checked = selectedPremiseKey === r.key;
                  return (
                    <button
                      key={r.key}
                      onClick={() =>
                        pick({ kind: "premise", line1: r.line1, line2: r.line2 })
                      }
                      className="w-full flex items-start gap-3 px-4 py-3 text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold leading-tight">
                          {r.line1}
                        </div>
                        <div className="text-xs text-muted-foreground leading-tight mt-0.5">
                          {r.line2}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {r.techName} · {r.jobType}
                        </div>
                      </div>
                      <span
                        className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1",
                          checked
                            ? "border-blue-600 bg-blue-600"
                            : "border-muted-foreground/40 bg-white",
                        )}
                      >
                        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
                {jobRows.length === 0 && (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No active jobs for the selected date.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MenuRow({
  icon,
  label,
  sub,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-4 bg-white rounded-2xl border text-left",
        selected ? "border-blue-600" : "border-border",
      )}
    >
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}
