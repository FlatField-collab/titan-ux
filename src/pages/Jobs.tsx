import { useMemo, useState } from "react";
import { useGuardedNavigate } from "@/lib/routes";
import { useSearchParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { TeamHeader } from "@/components/layout/TeamHeader";
import { cn } from "@/lib/utils";

import elliottCovingtonAvatar from "@/assets/elliott-covington-avatar.png";
import lucasBrooksAvatar from "@/assets/lucas-brooks-avatar.png";
import { avatar } from "@/assets/avatars";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

type JobType = "Install" | "Repair" | "Decom";
type TechStatus =
  | "Dispatched"
  | "Assigned"
  | "Cancelled"
  | "Returned";

type ActiveTech = {
  id: string;
  name: string;
  avatar: string;
  status: TechStatus;
  jobType: JobType;
  tags: string[]; // e.g. ["G+ RG", "FTTP-GPON"]
  open?: boolean; // shows red "Open" pill
  dispatchedTime?: string;
  startedTime?: string;
  onPremTime?: string;
  durationLabel?: string; // "11 min" or "Dispatched Time"
  estLabel?: string; // "150 min /est."
  progress: number; // 0..1
  ban: string;
  jobId?: string;
  ckt?: string;
  address: string;
  recommended?: boolean;
  recommendedChips?: string[];
};

type AvailableTech = {
  id: string;
  name: string;
  avatar: string;
  reason: "No Assigned Jobs";
};

type OffScheduleTech = {
  id: string;
  name: string;
  avatar: string;
  reason: string;
  detail?: string;
};

type PendingJob = {
  id: string;
  type: JobType;
  service: string;
  window: string;
  ban: string;
};

const ACTIVE_TEAM: ActiveTech[] = [
  {
    id: "tech-1",
    name: "Gabriel Sinclair",
    avatar: avatar(12),
    status: "Dispatched",
    jobType: "Install",
    tags: ["G+ RG", "FTTP-GPON"],
    open: true,
    dispatchedTime: "9:06 AM",
    onPremTime: "9:24 AM",
    durationLabel: "11 min",
    estLabel: "150 min /est.",
    progress: 0.18,
    ban: "14423456789",
    jobId: "14423456789",
    address: "1248 Sawgrass Corporate Pkwy\nSunrise, FL 33323-2841",
    recommended: true,
    recommendedChips: ["Visit Due", "Quality", "Harsh Braking", "+2"],
  },
  {
    id: "tech-2",
    name: "Lucas Brooks",
    avatar: lucasBrooksAvatar,
    status: "Dispatched",
    jobType: "Install",
    tags: ["G+ RG", "FTTP-GPON"],
    dispatchedTime: "9:20 AM",
    onPremTime: "9:49 AM",
    durationLabel: "45 min",
    estLabel: "150 min /est.",
    progress: 0.45,
    ban: "14423456789",
    jobId: "14423456789",
    address: "4571 NW 103rd Ave\nSunrise, FL 33351-6118",
  },
  {
    id: "tech-3",
    name: "Juan Benni",
    avatar: avatar(14),
    status: "Dispatched",
    jobType: "Repair",
    tags: ["G+ RG", "FTTP-GPON"],
    durationLabel: "Dispatched Time",
    startedTime: "Started 8:34 AM",
    estLabel: "150 min /est.",
    progress: 0.6,
    ban: "14423456789",
    ckt: "12345678123456789",
    address: "2710 Sunset Strip\nSunrise, FL 33313-1624",
  },
  {
    id: "tech-4",
    name: "Ava Whitaker",
    avatar: avatar(47),
    status: "Assigned",
    jobType: "Install",
    tags: ["FTTP-GPON"],
    progress: 0,
    ban: "14423456789",
    jobId: "14423456789",
    address: "6904 Springtree Lakes Dr\nSunrise, FL 33351-7426",
  },
  {
    id: "tech-5",
    name: "Stephan Osco",
    avatar: avatar(15),
    status: "Cancelled",
    jobType: "Repair",
    tags: ["FTTP-GPON"],
    progress: 0,
    ban: "14423456789",
    jobId: "14423456789",
    address: "3395 NW 94th Way\nSunrise, FL 33351-2907",
  },
  {
    id: "tech-6",
    name: "Elliot Covington",
    avatar: elliottCovingtonAvatar,
    status: "Returned",
    jobType: "Install",
    tags: ["FTTP-GPON"],
    progress: 0,
    ban: "14423456789",
    jobId: "14423456789",
    address: "10021 W Oakland Park Blvd\nSunrise, FL 33351-6912",
  },
];

const AVAILABLE: AvailableTech[] = [
  { id: "av-1", name: "Ignacio Ibarra", avatar: avatar(11), reason: "No Assigned Jobs" },
  { id: "av-2", name: "Tim Johnson", avatar: avatar(68), reason: "No Assigned Jobs" },
];

const OFF_SCHEDULE: OffScheduleTech[] = [
  { id: "off-1", name: "Marcus Reed", avatar: avatar(52), reason: "Vacation", detail: "Returns Feb 6" },
  { id: "off-2", name: "Ethan Hawkthorn", avatar: avatar(22), reason: "Disability" },
];

const PENDING: PendingJob[] = [
  { id: "pj-1", type: "Install", service: "FTTP-GPON", window: "12:00 PM - 2:00 PM", ban: "123456789" },
  { id: "pj-2", type: "Install", service: "FTTP-GPON", window: "1:30 PM - 3:30 PM", ban: "987654321" },
  { id: "pj-3", type: "Repair", service: "FTTP-GPON", window: "3:00 PM - 5:00 PM", ban: "456123789" },
];

// ---------- helpers ----------




const StatusDot = ({ status }: { status: TechStatus }) => {
  const map: Record<TechStatus, string> = {
    Dispatched: "bg-success",
    Assigned: "bg-primary",
    Cancelled: "bg-warning",
    Returned: "bg-destructive",
  };
  return <span className={cn("inline-block w-2 h-2 rounded-full", map[status])} />;
};

const JobTypePill = ({ type }: { type: JobType }) => {
  const tone: Record<JobType, string> = {
    Install: "bg-accent text-accent-foreground",
    Repair: "bg-[#EFE3FF] text-[#6E3BD9]",
    Decom: "bg-muted text-foreground",
  };
  return (
    <span className={cn("inline-flex items-center rounded-pill px-2.5 py-0.5 text-[11px] font-semibold", tone[type])}>
      {type}
    </span>
  );
};

const TagPill = ({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "green" }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-pill px-2 py-0.5 text-[11px] font-medium",
      tone === "neutral" && "bg-muted text-foreground",
      tone === "green" && "bg-success/15 text-success",
    )}
  >
    {children}
  </span>
);

// ---------- Active Team Card ----------

const ActiveTechCard = ({
  tech,
  expanded,
  onToggle,
}: {
  tech: ActiveTech;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const navigate = useGuardedNavigate();

  // Banner colors per status
  const bannerByStatus: Record<TechStatus, string> = {
    Dispatched: "bg-[#19B8E6]",
    Assigned: "bg-primary",
    Cancelled: "bg-warning",
    Returned: "bg-destructive",
  };

  return (
    <div className="rounded-card bg-card overflow-hidden shadow-sm">
      {/* Optional recommended visit banner */}
      {tech.recommended && (
        <div className={cn("px-3 py-2", bannerByStatus[tech.status])}>
          <div className="text-white text-[12px] font-semibold mb-1">Recommended Visit</div>
          <div className="flex flex-wrap gap-1.5">
            {tech.recommendedChips?.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-pill bg-white/25 text-white text-[10px] font-medium px-2 py-0.5"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(`/tech/${tech.id}`)}
            className="flex items-center gap-3 min-w-0 text-left"
          >
            <img
              src={tech.avatar}
              alt=""
              className="w-9 h-9 rounded-full object-cover bg-muted"
            />
            <div className="min-w-0">
              <div className="text-[15px] font-semibold truncate">{tech.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <StatusDot status={tech.status} />
                <span className="text-[11px] font-medium text-muted-foreground">
                  {tech.status}
                </span>
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => navigate(tech.id === "tech-1" ? "/map" : `/team/${tech.id}`)}
            className="shrink-0 inline-flex items-center rounded-pill border border-border px-3 py-1.5 text-[12px] font-semibold"
          >
            Visit
          </button>
        </div>

        {/* Progress block (only when there's progress data) */}
        {(tech.dispatchedTime || tech.startedTime || tech.durationLabel) && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
              <span>
                {tech.dispatchedTime
                  ? `Dispatched Time: ${tech.dispatchedTime}`
                  : tech.durationLabel ?? ""}
              </span>
              <span>{tech.onPremTime ? `On-Prem ${tech.onPremTime}` : tech.startedTime ?? ""}</span>
            </div>
            <div className="h-1.5 w-full rounded-pill bg-muted overflow-hidden">
              <div
                className="h-full bg-success rounded-pill"
                style={{ width: `${Math.min(100, Math.max(0, tech.progress * 100))}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
              <span>{tech.dispatchedTime ? tech.durationLabel : ""}</span>
              <span>{tech.estLabel ?? ""}</span>
            </div>
          </div>
        )}

        {/* Tags row */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <JobTypePill type={tech.jobType} />
          {tech.tags.map((t, idx) => (
            <TagPill key={t} tone={idx === 0 && t.includes("RG") ? "green" : "neutral"}>
              {t}
            </TagPill>
          ))}
          {tech.open && (
            <span className="inline-flex items-center gap-1 rounded-pill bg-destructive/15 text-destructive text-[11px] font-semibold px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
              Open
            </span>
          )}
        </div>

        {/* BAN / JOB / CKT */}
        <div className="mt-4 flex items-center justify-between text-[11px]">
          <div>
            <span className="text-muted-foreground">BAN: </span>
            <span className="font-medium text-foreground">{tech.ban}</span>
          </div>
          {tech.ckt ? (
            <div>
              <span className="text-muted-foreground">CKT: </span>
              <span className="font-medium text-foreground">{tech.ckt}</span>
            </div>
          ) : tech.jobId ? (
            <div>
              <span className="text-muted-foreground">JOB ID: </span>
              <span className="font-medium text-foreground">{tech.jobId}</span>
            </div>
          ) : null}
        </div>

        {/* Address */}
        <div className="mt-3 pt-3 border-t border-separator flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] text-muted-foreground mb-0.5">Address</div>
            <div className="text-[12px] text-foreground whitespace-pre-line leading-snug">
              {tech.address}
            </div>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="shrink-0 inline-flex items-center gap-1 text-[12px] text-muted-foreground"
          >
            {expanded ? "Less" : "More"}
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 rounded-xl bg-muted/60 p-3 text-[12px] text-muted-foreground">
            Additional job notes, attachments and history will appear here.
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- Page ----------

const Jobs = () => {
  const navigate = useGuardedNavigate();
  const [searchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  

  // Applied filters
  const [types, setTypes] = useState<JobType[]>([]);
  const [statusFilter, setStatusFilter] = useState<"All" | TechStatus>("All");

  // Draft state inside drawer
  const [draftTypes, setDraftTypes] = useState<JobType[]>([]);
  const [draftStatus, setDraftStatus] = useState<"All" | TechStatus>("All");

  // Expanded state per card
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const openDrawer = () => {
    setDraftTypes(types);
    setDraftStatus(statusFilter);
    setDrawerOpen(true);
  };

  const toggleDraftType = (t: JobType) =>
    setDraftTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const clearAll = () => {
    setDraftTypes([]);
    setDraftStatus("All");
  };

  const apply = () => {
    setTypes(draftTypes);
    setStatusFilter(draftStatus);
    setDrawerOpen(false);
  };

  const filteredActive = useMemo(
    () =>
      ACTIVE_TEAM.filter((t) => {
        if (types.length && !types.includes(t.jobType)) return false;
        if (statusFilter !== "All" && t.status !== statusFilter) return false;
        return true;
      }),
    [types, statusFilter],
  );

  const counts = useMemo(() => {
    const dispatched = filteredActive.filter((t) => t.status === "Dispatched").length;
    const assigned = filteredActive.filter((t) => t.status === "Assigned").length;
    const active = filteredActive.length;
    return { dispatched, assigned, active };
  }, [filteredActive]);

  return (
    <div data-view-name="Team" className="min-h-screen w-full flex justify-center bg-[#0a0a0c] py-6">
      <div
        className="relative w-[393px] max-w-full bg-[#F2F2F6] rounded-[44px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-white/5"
        style={{ minHeight: 844 }}
      >
        <main className="relative h-[852px] overflow-y-auto no-scrollbar pb-28 bg-[#F2F2F6]">
          <StatusBar />

          <TeamHeader active="Team" onFilter={openDrawer} />


          {/* Status summary tiles */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Dispatched", value: counts.dispatched },
                { label: "Assigned", value: counts.assigned },
                { label: "Active", value: counts.active },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-card bg-card px-3 py-2.5 shadow-sm"
                >
                  <div className="text-[22px] font-bold leading-none">{s.value}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Team */}
          <section className="px-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[20px] font-bold">Active Team</h2>
              <button className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
                {filteredActive.length}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {filteredActive.map((tech) => (
                <ActiveTechCard
                  key={tech.id}
                  tech={tech}
                  expanded={!!expanded[tech.id]}
                  onToggle={() =>
                    setExpanded((prev) => ({ ...prev, [tech.id]: !prev[tech.id] }))
                  }
                />
              ))}
              {filteredActive.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No technicians match the selected filters.
                </div>
              )}
            </div>
          </section>

          {/* Available */}
          <section className="px-4 mt-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[20px] font-bold">Available</h2>
              <button className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
                {AVAILABLE.length}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              {AVAILABLE.map((a) => (
                <button
                  key={a.id}
                  onClick={() => navigate(`/tech/${a.id}`)}
                  className="w-full text-left flex items-center gap-3 rounded-card bg-card p-3 shadow-sm"
                >
                  <img src={a.avatar} alt="" className="w-9 h-9 rounded-full object-cover bg-muted" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold truncate">{a.name}</div>
                    <span className="inline-flex items-center rounded-pill bg-warning/15 text-warning text-[11px] font-semibold px-2 py-0.5 mt-1">
                      {a.reason}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </section>

          {/* Off Schedule */}
          <section className="px-4 mt-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[20px] font-bold">Off Schedule</h2>
              <button className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
                {OFF_SCHEDULE.length}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              {OFF_SCHEDULE.map((o) => (
                <button
                  key={o.id}
                  onClick={() => navigate(`/tech/${o.id}`)}
                  className="w-full text-left flex items-center gap-3 rounded-card bg-card p-3 shadow-sm"
                >
                  <img src={o.avatar} alt="" className="w-9 h-9 rounded-full object-cover bg-muted" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold truncate">{o.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-semibold text-foreground">{o.reason}</span>
                      {o.detail && (
                        <span className="text-[11px] text-muted-foreground">{o.detail}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </section>

          {/* Pending Jobs */}
          <section className="px-4 mt-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[20px] font-bold">Pending Jobs</h2>
              <button className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
                {PENDING.length}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              {PENDING.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/team/${p.id}`)}
                  className="w-full text-left rounded-card bg-card p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <JobTypePill type={p.type} />
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60" />
                      Pending
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[12px] text-muted-foreground">{p.service}</span>
                    <span className="text-[12px] text-foreground font-medium">{p.window}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">BAN</span>
                    <span className="text-[12px] text-foreground font-medium">{p.ban}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <div className="h-6" />
        </main>

        {/* Filter Drawer */}
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent className="mx-auto max-w-[393px] bg-card">
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-[18px]">Filters</DrawerTitle>
            </DrawerHeader>

            <div className="px-4 pb-2 space-y-5">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Job Type
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["Install", "Repair", "Decom"] as JobType[]).map((t) => {
                    const active = draftTypes.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleDraftType(t)}
                        className={cn(
                          "px-3.5 py-1.5 rounded-pill text-[13px] font-medium border transition",
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card text-foreground border-border",
                        )}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Status
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["All", "Dispatched", "Assigned", "Cancelled", "Returned"] as Array<"All" | TechStatus>).map(
                    (s) => {
                      const active = draftStatus === s;
                      return (
                        <button
                          key={s}
                          onClick={() => setDraftStatus(s)}
                          className={cn(
                            "px-3.5 py-1.5 rounded-pill text-[13px] font-medium border transition",
                            active
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-foreground border-border",
                          )}
                        >
                          {s}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            </div>

            <DrawerFooter className="flex-row gap-2">
              <button
                onClick={clearAll}
                className="flex-1 h-11 rounded-pill border border-border bg-card text-foreground text-[14px] font-semibold"
              >
                Clear all
              </button>
              <button
                onClick={apply}
                className="flex-1 h-11 rounded-pill bg-primary text-primary-foreground text-[14px] font-semibold"
              >
                Apply filters
              </button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default Jobs;
