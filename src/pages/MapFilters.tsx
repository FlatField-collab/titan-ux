import { useEffect, useState } from "react";
import { useGuardedNavigate } from "@/lib/routes";

import {
  X,
  Search,
  Mic,
  LayoutList,
  ChevronDown,
  ChevronsUpDown,
  PersonStanding,
  Tag,
  MapPin,
  Car,
  ParkingCircle,
  Calendar,
  Users,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { cn } from "@/lib/utils";
import { ProximityFromSheet, type FromValue } from "./ProximityFromSheet";

const LOCATIONS = ["Work Center", "Central Office", "Garage", "Remote Terminal", "Outside Plant"];
const FACILITIES = [
  "Cell Site",
  "Cable Splice /Tether",
  "Handhole",
  "Manhole",
  "Pedestal",
  "Pole",
  "PFP / Crossbox",
  "F1 / F2 Facilities",
];
const JOB_TYPE = ["Install", "Repair", "Routine"];
const JOB_STATUS = ["Dispatched", "Assigned", "Pending", "Returned", "Completed", "Cancelled"];
const TRANSPORT = ["Fiber", "Copper"];
const DEMAND = ["Demand", "Non-Demand"];
const OPEN_TICKETS = ["BSW / Dig"];
const CX = ["Chronic", "Repeats"];
const ALERTS = ["GPS Unplugged", "Harsh Braking", "Excessive Idle", "Speeding", "Excessive Acceleration"];

function PillGroup({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: Set<string>;
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = selected.has(o);
        return (
          <button
            key={o}
            onClick={() => onToggle(o)}
            className={cn(
              "px-3 py-1.5 rounded-full text-[13px] font-medium border transition-colors",
              active
                ? "bg-foreground text-background border-foreground"
                : "bg-white text-foreground border-border",
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 pt-5 pb-2 text-[13px] text-muted-foreground">{children}</div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mx-4 bg-white rounded-2xl border border-border", className)}>
      {children}
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  subtitle,
  value,
  onChange,
}: {
  icon: typeof PersonStanding;
  label: string;
  subtitle?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3 p-4">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-foreground">{label}</div>
        {subtitle && (
          <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>
        )}
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

export default function MapFilters() {
  const navigate = useGuardedNavigate();
  const [radius, setRadius] = useState(10);
  const [locations, setLocations] = useState<Set<string>>(new Set());
  const [facilities, setFacilities] = useState<Set<string>>(new Set());
  const [jobType, setJobType] = useState<Set<string>>(new Set());
  const [jobStatus, setJobStatus] = useState<Set<string>>(new Set());
  const [transport, setTransport] = useState<Set<string>>(new Set());
  const [demand, setDemand] = useState<Set<string>>(new Set());
  const [openTickets, setOpenTickets] = useState<Set<string>>(new Set());
  const [cx, setCx] = useState<Set<string>>(new Set());
  const [alerts, setAlerts] = useState<Set<string>>(new Set());
  const [vehicle, setVehicle] = useState<Set<string>>(new Set());
  const [outOfRoute, setOutOfRoute] = useState(false);
  const [doorTag, setDoorTag] = useState(false);
  const [notClosed, setNotClosed] = useState(false);
  const [fromValue, setFromValueState] = useState<FromValue>({ kind: "current" });
  const [proxOpen, setProxOpen] = useState(false);
  const [proxDirty, setProxDirty] = useState(false);
  const [radiusDirty, setRadiusDirty] = useState(false);
  const setFromValue = (v: FromValue) => {
    setFromValueState(v);
    setProxDirty(true);
  };

  // Hydrate from sessionStorage so the UI matches what's actually persisted.
  // Without this, stale filters can remain "applied" on /map while every pill
  // here appears deselected.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("mapPinFilters");
      if (raw) {
        const parsed = JSON.parse(raw) as {
          locations?: string[];
          facilities?: string[];
          jobStatus?: string[];
        };
        if (parsed.locations?.length) setLocations(new Set(parsed.locations));
        if (parsed.facilities?.length) setFacilities(new Set(parsed.facilities));
        if (parsed.jobStatus?.length) setJobStatus(new Set(parsed.jobStatus));
      }
      const oor = sessionStorage.getItem("mapOutOfRoute");
      if (oor === "1") setOutOfRoute(true);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void) => (v: string) => {
    const next = new Set(set);
    next.has(v) ? next.delete(v) : next.add(v);
    setter(next);
  };

  const clearAll = () => {
    setRadius(10);
    setLocations(new Set());
    setFacilities(new Set());
    setJobType(new Set());
    setJobStatus(new Set());
    setTransport(new Set());
    setDemand(new Set());
    setOpenTickets(new Set());
    setCx(new Set());
    setAlerts(new Set());
    setVehicle(new Set());
    setOutOfRoute(false);
    setDoorTag(false);
    setNotClosed(false);
  };

  return (
    <div data-view-name="Map Filters" className="min-h-screen w-full flex justify-center bg-[#0a0a0c] py-6">
      <div className="relative w-[393px] max-w-full bg-white rounded-[44px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-white/5" style={{ minHeight: 844 }}>
        <div className="relative h-[852px] overflow-hidden">
          <div className="relative w-full max-w-[393px] mx-auto bg-[#F2F2F6] min-h-screen">
            <div className="relative h-[852px] overflow-y-auto no-scrollbar pb-28">
              <StatusBar />

        {/* Header: close + search + mic */}
        <header className="flex items-center gap-2 px-4 pt-2 pb-3 bg-[#F2F2F6] sticky top-0 z-20">
          <button
            onClick={() => navigate("/map")}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-white rounded-full border border-border px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              autoFocus
              placeholder="Search"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            <Mic className="w-4 h-4 text-muted-foreground" />
          </div>
        </header>

        {/* Filter pills row */}
        <div className="flex items-center gap-2 px-4 pb-3">
          <button
            className="w-10 h-9 rounded-lg bg-white border border-border flex items-center justify-center"
            aria-label="List"
          >
            <LayoutList className="w-4 h-4 text-foreground" />
          </button>
          <button className="flex items-center gap-1 px-3 h-9 rounded-lg bg-white border border-border text-sm font-medium">
            <Calendar className="w-4 h-4" />
            Today
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => setProxOpen(true)}
            className="flex items-center gap-1 px-3 h-9 rounded-lg bg-white border border-border text-sm font-medium max-w-[180px]"
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {fromValue.kind === "tech" ? fromValue.name : "Employees"}
            </span>
            <ChevronDown className="w-4 h-4 shrink-0" />
          </button>
        </div>

        <h1 className="px-4 text-[28px] font-bold tracking-tight">Map Filters</h1>

        {/* Proximity */}
        <SectionLabel>Proximity</SectionLabel>
        <Card>
          <button
            onClick={() => setProxOpen(true)}
            className="w-full flex items-start justify-between p-4 gap-3"
          >
            <span className="text-sm font-semibold pt-0.5">From</span>
            <span className="flex items-start gap-1 text-sm text-right">
              {fromValue.kind === "current" && <span>My Current Location</span>}
              {fromValue.kind === "tech" && <span>{fromValue.name}</span>}
              {fromValue.kind === "premise" && (
                <span className="leading-tight">
                  {fromValue.line1}
                  <br />
                  {fromValue.line2}
                </span>
              )}
              <ChevronsUpDown className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            </span>
          </button>
          <div className="h-px bg-border mx-4" />
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold">Radius</div>
                <div className="text-xs text-muted-foreground">
                  Show results within this distance
                </div>
              </div>
              <div className="text-sm font-semibold">{radius} mi</div>
            </div>
            <Slider
              value={[radius]}
              min={1}
              max={50}
              step={1}
              onValueChange={(v) => {
                setRadius(v[0]);
                setRadiusDirty(true);
              }}
              className="mt-4"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground mt-2">
              <span>1 mi</span>
              <span>50 mi</span>
            </div>
          </div>
        </Card>

        {/* Locations */}
        <SectionLabel>Locations</SectionLabel>
        <Card className="p-3">
          <PillGroup
            options={LOCATIONS}
            selected={locations}
            onToggle={toggle(locations, setLocations)}
          />
        </Card>

        {/* Facilities */}
        <SectionLabel>Facilities</SectionLabel>
        <Card className="p-3">
          <PillGroup
            options={FACILITIES}
            selected={facilities}
            onToggle={toggle(facilities, setFacilities)}
          />
        </Card>

        {/* Map Layers */}
        <SectionLabel>Map Layers</SectionLabel>
        <div className="mx-4 space-y-2">
          <div className="bg-white rounded-2xl border border-border">
            <ToggleRow
              icon={PersonStanding}
              label="Out-of-Route"
              subtitle="Show vehicles operating outside expected zones"
              value={outOfRoute}
              onChange={setOutOfRoute}
            />
          </div>
          <div className="bg-white rounded-2xl border border-border">
            <ToggleRow
              icon={Tag}
              label="Door Tag Opportunities"
              value={doorTag}
              onChange={setDoorTag}
            />
          </div>
          <div className="bg-white rounded-2xl border border-border">
            <ToggleRow
              icon={MapPin}
              label="Not Closed at Prem"
              subtitle="Show when close location differs from dispatch"
              value={notClosed}
              onChange={setNotClosed}
            />
          </div>
        </div>

        {/* Job Filters */}
        <SectionLabel>Job Filters</SectionLabel>
        <Card className="divide-y divide-border">
          {[
            { title: "Job Type", opts: JOB_TYPE, set: jobType, setter: setJobType },
            { title: "Job Status", opts: JOB_STATUS, set: jobStatus, setter: setJobStatus },
            { title: "Transport Type", opts: TRANSPORT, set: transport, setter: setTransport },
            { title: "Demand", opts: DEMAND, set: demand, setter: setDemand },
            { title: "Open Tickets", opts: OPEN_TICKETS, set: openTickets, setter: setOpenTickets },
            { title: "Customer Experience", opts: CX, set: cx, setter: setCx },
          ].map((g) => (
            <div key={g.title} className="p-4">
              <div className="text-sm font-semibold mb-2">{g.title}</div>
              <PillGroup
                options={g.opts}
                selected={g.set}
                onToggle={toggle(g.set, g.setter)}
              />
            </div>
          ))}
        </Card>

        {/* Vehicle */}
        <SectionLabel>Vehicle</SectionLabel>
        <div className="mx-4 grid grid-cols-2 gap-2">
          {[
            { label: "Driving", icon: Car },
            { label: "Parked", icon: ParkingCircle },
          ].map(({ label, icon: Icon }) => {
            const active = vehicle.has(label);
            return (
              <button
                key={label}
                onClick={() => toggle(vehicle, setVehicle)(label)}
                className={cn(
                  "bg-white rounded-2xl border p-3 flex flex-col items-start gap-2",
                  active ? "border-foreground" : "border-border",
                )}
              >
                <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-sm font-semibold">{label}</div>
              </button>
            );
          })}
        </div>

        {/* Vehicle Alerts */}
        <SectionLabel>Vehicle Alerts</SectionLabel>
        <Card className="p-3">
          <PillGroup
            options={ALERTS}
            selected={alerts}
            onToggle={toggle(alerts, setAlerts)}
          />
        </Card>

        {/* Footer tray (flows below Vehicle Alerts) */}
        <div className="mt-5 bg-white/95 backdrop-blur border-t border-border px-4 py-3 flex gap-2">
          <button
            onClick={clearAll}
            className="flex-1 h-12 rounded-full border border-border bg-white text-sm font-semibold"
          >
            Clear
          </button>
          <button
            onClick={() => {
              if (radiusDirty || proxDirty) {
                try {
                  sessionStorage.setItem(
                    "mapProximityFilter",
                    JSON.stringify({ radius, from: fromValue }),
                  );
                } catch {
                  /* ignore */
                }
              }
              try {
                sessionStorage.setItem("mapOutOfRoute", outOfRoute ? "1" : "0");
                sessionStorage.setItem(
                  "mapPinFilters",
                  JSON.stringify({
                    locations: Array.from(locations),
                    facilities: Array.from(facilities),
                    jobStatus: Array.from(jobStatus),
                  }),
                );
              } catch {
                /* ignore */
              }
              navigate(outOfRoute ? "/map/trail" : "/map");
            }}
            className="flex-[2] h-12 rounded-full bg-[#1E3A8A] text-white text-sm font-semibold"
          >
            Show on Map
          </button>
        </div>
      </div>




      <ProximityFromSheet
        open={proxOpen}
        onOpenChange={setProxOpen}
        value={fromValue}
        onSelect={setFromValue}
      />
            </div>
          </div>
        </div>
      </div>
  );
}
