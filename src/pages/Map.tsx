import { Link, useNavigate } from "react-router-dom";
import lucasBrooksAvatar from "@/assets/lucas-brooks-avatar.png";
import elliottCovingtonAvatar from "@/assets/elliott-covington-avatar.png";
import { useGuardedNavigate } from "@/lib/routes";
import {
  LayoutList,
  Layers,
  Navigation,
  Search,
  SlidersHorizontal,
  X,
  Maximize2,
  Car,
  MapPin,
  MessageSquare,
  Megaphone,
  Sparkles,
  Compass,
  Shield,
  Train,
  ChevronDown,
  ChevronRight,
  Wifi,
  AlertTriangle,
} from "lucide-react";
import { StatusBar } from "@/components/dashboard/StatusBar";
import mapBg from "@/assets/map-bg.jpg";
import { useEffect, useMemo, useState } from "react";
import { FacilityPins } from "@/components/map/FacilityPins";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { avatar } from "@/assets/avatars";

type Tech = {
  id: string;
  name: string;
  photo: string;
  top: string;
  left: string;
  status: "dispatched" | "assigned";
  presence: "Driving" | "Onsite";
  distance?: string;
  outOfRoute?: boolean;
};

// Mirrors active (Dispatched/Assigned) techs from ACTIVE_TEAM on /team.
// Positions are tuned to sit over the numeric map labels baked into map-bg.jpg
// so those numbers aren't visible to the user.
const ALL_TECHS: Tech[] = [
  {
    id: "tech-1",
    name: "Gabriel Sinclair",
    photo: avatar(12),
    top: "30%",
    left: "31%",
    status: "dispatched",
    presence: "Driving",
    distance: "3.5 mi from job",
  },
  {
    id: "tech-2",
    name: "Lucas Brooks",
    photo: lucasBrooksAvatar,
    top: "40%",
    left: "78%",
    status: "dispatched",
    presence: "Onsite",
  },
  {
    id: "tech-3",
    name: "Juan Benni",
    photo: avatar(14),
    top: "50%",
    left: "12%",
    status: "dispatched",
    presence: "Driving",
    distance: "On route",
  },
  {
    id: "tech-4",
    name: "Ava Whitaker",
    photo: avatar(47),
    top: "48%",
    left: "33%",
    status: "assigned",
    presence: "Driving",
  },
  // Techs staged at the Central Office (positioned near CO pin at 30%/31%).
  {
    id: "tech-5",
    name: "Stephan Osco",
    photo: avatar(15),
    top: "24%",
    left: "24%",
    status: "assigned",
    presence: "Onsite",
    outOfRoute: true,
  },
  {
    id: "tech-6",
    name: "Elliott Covington",
    photo: elliottCovingtonAvatar,
    top: "64%",
    left: "70%",
    status: "assigned",
    presence: "Onsite",
  },
  // Techs staged at the Garage (positioned near Garage pin at 39%/82%).
  {
    id: "av-1",
    name: "Ignacio Ibarra",
    photo: avatar(33),
    top: "33%",
    left: "74%",
    status: "assigned",
    presence: "Onsite",
  },
  {
    id: "av-2",
    name: "Tim Johnson",
    photo: avatar(52),
    top: "50%",
    left: "89%",
    status: "assigned",
    presence: "Onsite",
  },
];



type JobStatus = "Dispatched" | "Assigned" | "Cancelled" | "Returned";
type ActiveJob = {
  id: string;
  name: string;
  photo: string;
  status: JobStatus;
  started: string;
  elapsedMin: number;
  estMin: number;
  jobType: "Install" | "Repair" | "Decom";
  rgActive: boolean;
  service?: string;
};

// Mirrors ACTIVE_TEAM on /team so the slide-up jobs list stays in sync.
const ACTIVE_JOBS: ActiveJob[] = [
  { id: "tech-1", name: "Gabriel Sinclair", photo: avatar(12), status: "Dispatched", started: "9:06 AM", elapsedMin: 11, estMin: 150, jobType: "Install", rgActive: true, service: "FTTP-GPON" },
  { id: "tech-2", name: "Lucas Brooks", photo: lucasBrooksAvatar, status: "Dispatched", started: "9:20 AM", elapsedMin: 45, estMin: 150, jobType: "Install", rgActive: true, service: "FTTP-GPON" },
  { id: "tech-3", name: "Juan Benni", photo: avatar(14), status: "Dispatched", started: "8:34 AM", elapsedMin: 90, estMin: 150, jobType: "Repair", rgActive: true, service: "FTTP-GPON" },
  { id: "tech-4", name: "Ava Whitaker", photo: avatar(47), status: "Assigned", started: "—", elapsedMin: 0, estMin: 150, jobType: "Install", rgActive: false, service: "FTTP-GPON" },
  { id: "tech-5", name: "Stephan Osco", photo: avatar(15), status: "Cancelled", started: "—", elapsedMin: 0, estMin: 0, jobType: "Repair", rgActive: false, service: "FTTP-GPON" },
  { id: "tech-6", name: "Elliot Covington", photo: elliottCovingtonAvatar, status: "Returned", started: "—", elapsedMin: 0, estMin: 0, jobType: "Install", rgActive: false, service: "FTTP-GPON" },
];


function TechPinCard({ tech, onClose }: { tech: Tech; onClose: () => void }) {
  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl p-0 bg-white max-w-[393px] mx-auto h-[60vh] overflow-hidden"
      >
        <div className="flex flex-col h-full">
          <div className="pt-2 flex justify-center">
            <div className="w-9 h-1 rounded-full bg-muted-foreground/40" />
          </div>
          <div className="relative px-4 pt-3 pb-3">
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute left-4 top-2 w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              aria-label="Expand"
              className="absolute right-4 top-2 w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <div className="text-center">
              <div className="text-lg font-bold">{tech.name}</div>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                {tech.presence === "Driving" ? (
                  <Car className="w-4 h-4" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                <span>
                  {tech.presence}
                  {tech.distance ? ` · ${tech.distance}` : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="px-4 grid grid-cols-3 gap-2">
            <button className="h-16 rounded-2xl bg-[#1E3A8A] text-white flex flex-col items-center justify-center gap-1">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                <Navigation className="w-3.5 h-3.5 text-[#1E3A8A]" />
              </div>
              <span className="text-sm font-semibold">9 min</span>
            </button>
            <button className="h-16 rounded-2xl bg-slate-100 flex flex-col items-center justify-center gap-1 text-blue-700">
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm font-semibold">Contact</span>
            </button>
            <button className="h-16 rounded-2xl bg-slate-100 flex flex-col items-center justify-center gap-1 text-blue-700">
              <Megaphone className="w-5 h-5" />
              <span className="text-sm font-semibold">Coaching</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-3">
            <div className="bg-slate-100 rounded-2xl p-3">
              <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Sparkles className="w-4 h-4" />
                Recommended Visit
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Visit Due", icon: Compass },
                  { label: "Quality", icon: Shield },
                  { label: "Harsh Braking", icon: Train },
                ].map(({ label, icon: Icon }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-blue-700 text-xs font-medium border border-blue-100"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-3 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                Install
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Dispatched
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-border p-3 text-xs text-muted-foreground">
              FTTP-GPON · 1234 Elm Street · 150 min est.
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function TeamSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl p-0 bg-[#F2F2F6] max-w-[393px] mx-auto h-[65vh] overflow-hidden"
      >
        <div className="flex flex-col h-full">
          <div className="pt-2 flex justify-center">
            <div className="w-9 h-1 rounded-full bg-muted-foreground/40" />
          </div>

          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center gap-2 bg-white rounded-full border border-border px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 text-sm text-muted-foreground">
                Search Team, Jobs, Status
              </span>
              <SlidersHorizontal className="w-4 h-4 text-foreground" />
            </div>
          </div>

          <div className="px-4 pb-2 grid grid-cols-3 gap-2">
            {[
              { n: 3, l: "Dispatched" },
              { n: 5, l: "Assigned" },
              { n: 3, l: "Pending" },
            ].map((s) => (
              <div key={s.l} className="bg-white rounded-2xl border border-border p-3">
                <div className="text-2xl font-bold">{s.n}</div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="px-4 py-2 flex items-center justify-between">
            <h3 className="text-base font-bold">Active Team</h3>
            <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-border text-xs font-semibold">
              {ACTIVE_JOBS.length}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
            <div className="bg-[#2A8AE3] text-white rounded-2xl p-3">
              <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Sparkles className="w-4 h-4" />
                Recommended Visit
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Visit Due", icon: Compass },
                  { label: "Quality", icon: Shield },
                  { label: "Harsh Braking", icon: Train },
                ].map(({ label, icon: Icon }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-white text-xs font-medium"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </span>
                ))}
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/15 text-white text-xs font-medium">
                  +2
                </span>
              </div>
            </div>

            {ACTIVE_JOBS.map((j) => {
              const pct = j.estMin > 0 ? Math.min(100, (j.elapsedMin / j.estMin) * 100) : 0;
              const dotColor =
                j.status === "Dispatched"
                  ? "bg-emerald-500"
                  : j.status === "Assigned"
                  ? "bg-blue-500"
                  : j.status === "Cancelled"
                  ? "bg-amber-500"
                  : "bg-rose-500";
              return (
                <div key={j.id} className="bg-white rounded-2xl border border-border p-3 space-y-2">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/tech/${j.id}`}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <img src={j.photo} alt={j.name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{j.name}</div>
                        <span className="inline-flex items-center gap-1.5 text-xs">
                          <span className={cn("w-2 h-2 rounded-full", dotColor)} />
                          {j.status}
                        </span>
                      </div>
                    </Link>
                    <Link
                      to={`/visits/${j.id}`}
                      className="px-3 py-1.5 rounded-full border border-foreground text-xs font-semibold inline-flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3" />
                      Visit
                    </Link>
                  </div>

                  {j.status === "Dispatched" && (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Dispatched Time</span>
                        <span className="text-muted-foreground">Started {j.started}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>{j.elapsedMin} min</span>
                        <span className="text-muted-foreground">{j.estMin} min (est.)</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
                      {j.jobType}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border",
                        j.rgActive
                          ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                          : "border-border text-muted-foreground bg-slate-50",
                      )}
                    >
                      <Wifi className="w-3 h-3" />
                      RG
                    </span>
                    <span className="text-muted-foreground">{j.service ?? "FTTP-GPON"}</span>
                    <button className="ml-auto inline-flex items-center text-foreground font-medium">
                      More
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            {[
              { l: "Available", n: 2 },
              { l: "Off Schedule", n: 2 },
            ].map((s) => (
              <button
                key={s.l}
                className="w-full bg-white rounded-2xl border border-border p-4 flex items-center justify-between"
              >
                <span className="text-sm font-bold">{s.l}</span>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  {s.n}
                  <ChevronRight className="w-4 h-4" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Map % coords loosely to miles: ~0.15 mi per 1% (≈15 mi across the visible area)
const PCT_TO_MI = 0.15;
const MY_LOCATION_POS = { top: "44%", left: "44%" };

function pctDistanceMi(a: { top: string; left: string }, b: { top: string; left: string }) {
  const dx = parseFloat(a.left) - parseFloat(b.left);
  const dy = parseFloat(a.top) - parseFloat(b.top);
  return Math.sqrt(dx * dx + dy * dy) * PCT_TO_MI;
}

type FromValue =
  | { kind: "current" }
  | { kind: "tech"; techId: string; name: string }
  | { kind: "premise"; line1: string; line2: string };

type ProximityFilter = { radius: number; from: FromValue };

export default function MapPage() {
  const guardedNavigate = useGuardedNavigate();
  const [activeTech, setActiveTech] = useState<Tech | null>(null);
  const [teamOpen, setTeamOpen] = useState(false);
  // Proximity banner: only shown after user changes radius/anchor on /map/filters
  const [proximity, setProximity] = useState<ProximityFilter | null>(null);
  const [outOfRouteOn, setOutOfRouteOn] = useState(false);
  const [pinTypes, setPinTypes] = useState<string[]>([]);
  const [jobStatusFilter, setJobStatusFilter] = useState<string[]>([]);
  const [techsVisible, setTechsVisible] = useState(true);

  useEffect(() => {
    try {
      sessionStorage.removeItem("mapProximityRadius");
      const raw = sessionStorage.getItem("mapProximityFilter");
      if (raw) {
        const parsed = JSON.parse(raw) as ProximityFilter;
        if (parsed && typeof parsed.radius === "number" && parsed.from) {
          setProximity(parsed);
        }
        sessionStorage.removeItem("mapProximityFilter");
      }
      const oor = sessionStorage.getItem("mapOutOfRoute");
      if (oor === "1") setOutOfRouteOn(true);
      const pinRaw = sessionStorage.getItem("mapPinFilters");
      if (pinRaw) {
        const parsed = JSON.parse(pinRaw) as { locations?: string[]; facilities?: string[]; jobStatus?: string[] };
        setPinTypes([...(parsed.locations ?? []), ...(parsed.facilities ?? [])]);
        setJobStatusFilter((parsed.jobStatus ?? []).map((s) => s.toLowerCase()));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const anchorPos = useMemo(() => {
    if (!proximity) return null;
    const { from } = proximity;
    if (from.kind === "tech") {
      const t = ALL_TECHS.find((x) => x.id === from.techId);
      if (t) return { top: t.top, left: t.left };
    }
    return MY_LOCATION_POS;
  }, [proximity]);

  const proximityCount = useMemo(() => {
    if (!proximity || !anchorPos) return 0;
    const excludeId = proximity.from.kind === "tech" ? proximity.from.techId : null;
    return ALL_TECHS.filter(
      (t) => t.id !== excludeId && pctDistanceMi(t, anchorPos) <= proximity.radius,
    ).length;
  }, [proximity, anchorPos]);

  const anchorLabel = useMemo(() => {
    if (!proximity) return "";
    const { from } = proximity;
    if (from.kind === "tech") return from.name;
    if (from.kind === "premise") return from.line1;
    return "your location";
  }, [proximity]);

  const visibleTechs = useMemo(() => {
    let result = ALL_TECHS;
    if (jobStatusFilter.length > 0) {
      result = result.filter((t) => jobStatusFilter.includes(t.status));
    }
    if (outOfRouteOn) {
      result = result.filter((t) => t.outOfRoute);
    }
    if (proximity && anchorPos) {
      const excludeId = proximity.from.kind === "tech" ? proximity.from.techId : null;
      result = result.filter(
        (t) => t.id !== excludeId && pctDistanceMi(t, anchorPos) <= proximity.radius,
      );
    }
    return result;
  }, [jobStatusFilter, outOfRouteOn, proximity, anchorPos]);

  return (
    <div data-view-name="Map" className="min-h-screen w-full flex justify-center bg-[#0a0a0c] py-6">
      <div className="relative w-[393px] max-w-full bg-white rounded-[44px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-white/5" style={{ minHeight: 844 }}>
        <div className="relative h-[852px] overflow-hidden">
          <img src={mapBg} alt="Map view" className="w-full h-full object-cover" />

        <div className="relative z-10">
          <StatusBar />
        </div>

        {/* Floating right-side controls */}
        <div className="absolute top-24 right-3 z-20 flex flex-col gap-3">
          <button
            onClick={() => setTeamOpen(true)}
            className="w-10 h-10 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] flex items-center justify-center border border-black/5"
            aria-label="Team list"
          >
            <LayoutList className="w-[18px] h-[18px] text-foreground" />
          </button>
          <button
            onClick={() => setTechsVisible((v) => !v)}
            aria-pressed={techsVisible}
            className={cn(
              "w-10 h-10 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.18)] flex items-center justify-center border",
              techsVisible
                ? "bg-[#1E3A8A] border-[#1E3A8A] text-white"
                : "bg-white border-black/5 text-foreground",
            )}
            aria-label={techsVisible ? "Hide technicians" : "Show technicians"}
            title={techsVisible ? "Hide technicians" : "Show technicians"}
          >
            <Layers className="w-[18px] h-[18px]" />
          </button>
          <button
            className="w-10 h-10 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] flex items-center justify-center border border-black/5"
            aria-label="Locate"
          >
            <Navigation className="w-[18px] h-[18px] text-foreground" />
          </button>
        </div>

        <FacilityPins types={pinTypes} anchor={anchorPos} />

        {techsVisible && visibleTechs.map((t) => {
          const showBadge = outOfRouteOn && !!t.outOfRoute;
          return (
            <button
              key={t.id}
              onClick={() => {
                if (showBadge) return guardedNavigate("/map/trail");
                if (t.id === "tech-1") return guardedNavigate("/techlocation");
                guardedNavigate(`/tech/${t.id}`);
              }}

              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ top: t.top, left: t.left }}
              aria-label={t.name}
            >
              <div className="relative">
                <img
                  src={t.photo}
                  alt={t.name}
                  className={cn(
                    "w-11 h-11 rounded-full object-cover ring-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.25)]",
                    showBadge
                      ? "ring-destructive"
                      : t.status === "dispatched"
                        ? "ring-emerald-500"
                        : "ring-white",
                  )}
                />
                {!showBadge && (
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white",
                      t.status === "dispatched" ? "bg-emerald-500" : "bg-slate-400",
                    )}
                  />
                )}
                {showBadge && (
                  <span
                    aria-label="Out of route"
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white ring-2 ring-white shadow flex items-center justify-center"
                  >
                    <span className="w-full h-full rounded-full bg-rose-500 flex items-center justify-center">
                      <AlertTriangle className="w-3 h-3 text-white" strokeWidth={2.5} />
                    </span>
                  </span>
                )}
              </div>
            </button>
          );
        })}

        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ top: "44%", left: "44%" }}
        >
          <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-500/25 shadow" />
        </div>

        {/* Proximity result banner */}
        {proximity != null && (
          <div
            className="absolute left-4 right-4 z-20"
            style={{ bottom: 152 }}
          >
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.18)] border border-white/60 px-3 py-2.5">
              <div className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0 text-sm leading-tight">
                <div className="text-muted-foreground">
                  {proximityCount} {proximityCount === 1 ? "Tech" : "Techs"} within {proximity.radius} mi of
                </div>
                <div className="font-bold">{anchorLabel}</div>
              </div>
              <button
                onClick={() => setProximity(null)}
                aria-label="Dismiss"
                className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <Link
          to="/map/filters"
          className="absolute left-4 right-4 z-20"
          style={{ bottom: 92 }}
        >
          <div className="flex items-center gap-2 bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.18)] border border-black/5 px-4 py-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1 text-sm text-muted-foreground">
              Search Team, Jobs, Status
            </span>
            <SlidersHorizontal className="w-4 h-4 text-foreground" />
          </div>
        </Link>

      </div>

          {activeTech && (
            <TechPinCard tech={activeTech} onClose={() => setActiveTech(null)} />
          )}

          <TeamSheet open={teamOpen} onClose={() => setTeamOpen(false)} />
        </div>
      </div>
  );
}
