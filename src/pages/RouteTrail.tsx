import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  Home,
  Power,
  Car,
  Phone,
  ParkingCircle,
  Wrench,
  Anchor,
  Clock,
  Megaphone,
  MessageSquare,
  Navigation,
  Asterisk,
  X,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StatusBar } from "@/components/dashboard/StatusBar";
import mapBg from "@/assets/map-bg-trail.jpg";
import mapBgPlain from "@/assets/map-bg.jpg";
import { getTech } from "@/lib/techData";
import { cn } from "@/lib/utils";
import { avatar } from "@/assets/avatars";

type EventTone = "blue" | "red";
interface TrailEvent {
  icon: typeof Power;
  label: string;
  duration?: string;
  address?: string;
  phone?: string;
  timeStart: string;
  timeEnd?: string;
  tone: EventTone;
}

const STEPHAN_ADDR = "3395 NW 94th Way\nSunrise, FL 33351-2907";
const START_ADDR = "8754 Derrington Road\nSunrise, FL 33351-7426";

const DISPATCH_1: TrailEvent[] = [
  { icon: Power, label: "Ignition On", address: START_ADDR, timeStart: "7:45 AM", tone: "blue" },
  { icon: Car, label: "Driving", duration: "15 min", address: START_ADDR, timeStart: "7:45 AM", timeEnd: "8:00 AM", tone: "blue" },
  { icon: Phone, label: "Call", duration: "5 min", phone: "(404) 444-4444", timeStart: "7:50 AM", tone: "red" },
  { icon: Car, label: "Harsh Braking", address: START_ADDR, timeStart: "7:55 AM", tone: "red" },
  { icon: ParkingCircle, label: "Parked", duration: "5 min", address: STEPHAN_ADDR, timeStart: "8:00 AM", timeEnd: "8:05 AM", tone: "blue" },
  { icon: Clock, label: "Idling", duration: "2 min", address: STEPHAN_ADDR, timeStart: "8:02 AM", timeEnd: "8:04 AM", tone: "red" },
  { icon: Home, label: "On-Site", address: STEPHAN_ADDR, timeStart: "8:05 AM", tone: "blue" },
  { icon: Power, label: "Ignition Off", address: STEPHAN_ADDR, timeStart: "8:05 AM", tone: "blue" },
  { icon: Wrench, label: "Begin Repair", address: STEPHAN_ADDR, timeStart: "8:10 AM", tone: "blue" },
];


const EventRow = ({ ev, highlighted, refCb }: { ev: TrailEvent; highlighted?: boolean; refCb?: (el: HTMLDivElement | null) => void }) => {
  const Icon = ev.icon;
  const isRed = ev.tone === "red";
  return (
    <div
      ref={refCb}
      className={cn(
        "bg-white rounded-2xl border overflow-hidden flex transition-shadow",
        highlighted ? "border-amber-400 ring-2 ring-amber-300 shadow-md" : "border-border",
      )}
    >
      <div className={cn("w-1.5 shrink-0", isRed ? "bg-rose-500" : "bg-[#1E3A8A]")} />
      <div className="flex-1 flex items-start gap-3 p-3">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            isRed ? "bg-rose-50" : "bg-blue-50",
          )}
        >
          <Icon className={cn("w-5 h-5", isRed ? "text-rose-500" : "text-blue-700")} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm">
            <span className="font-semibold">{ev.label}</span>
            {ev.duration && <span className="font-semibold"> ({ev.duration})</span>}
          </div>
          {ev.address && (
            <div className="text-xs text-muted-foreground whitespace-pre-line mt-0.5">
              {ev.address}
            </div>
          )}
          {ev.phone && (
            <div className="text-xs text-muted-foreground mt-0.5">{ev.phone}</div>
          )}
        </div>
        <div className="text-xs text-muted-foreground text-right shrink-0 leading-tight">
          <div>{ev.timeStart}</div>
          {ev.timeEnd && <div>{ev.timeEnd}</div>}
        </div>
      </div>
    </div>
  );
};

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 bg-white/80 backdrop-blur rounded-2xl p-3 border border-white">
      <div className="text-xl font-bold leading-tight">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function StephanJobDrawer({ onClose }: { onClose: () => void }) {
  const tech = getTech("tech-5");
  const job = tech.currentJob!;
  const [activityOpen, setActivityOpen] = useState(true);

  const activity = [
    { label: "Job Dispatched", time: "8:00 AM", state: "done" as const },
    { label: "En Route", time: "8:05 AM", state: "done" as const },
    { label: "Arrived On-Site", time: "—", state: "pending" as const },
    { label: "Job Cancelled", time: "9:12 AM", state: "done" as const },
    { label: "Begin Repair", time: "—", state: "pending" as const },
    { label: "Job Complete", time: "—", state: "pending" as const },
  ];

  return (
    <div className="absolute inset-0 z-50 bg-black/40" onClick={onClose}>
      <div
        className="absolute left-0 right-0 bottom-[64px] bg-white rounded-t-3xl h-[88%] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pt-2 flex justify-center">
          <div className="w-9 h-1 rounded-full bg-muted-foreground/40" />
        </div>
        <div className="relative px-4 pt-2 pb-3 flex items-start justify-between">
          <div>
            <div className="text-2xl font-bold leading-tight">{job.jobType}</div>
            <div className="text-xs text-muted-foreground">{job.service}</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
          {/* Mini tech card */}
          <div className="bg-white rounded-2xl border border-border p-3 space-y-3">
            <div className="flex items-center gap-3">
              {tech.avatarUrl ? (
                <img src={tech.avatarUrl} alt={tech.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold">
                  {tech.initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{tech.name}</div>
                <span className="inline-flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Cancelled
                </span>
              </div>
              <button className="text-sm font-semibold text-blue-700 inline-flex items-center gap-0.5">
                Details
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button className="h-16 rounded-2xl bg-[#1E3A8A] text-white flex flex-col items-center justify-center gap-1">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <Navigation className="w-3.5 h-3.5 text-[#1E3A8A]" />
                </div>
                <span className="text-sm font-semibold">Route</span>
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
          </div>

          {/* Job Details */}
          <div className="bg-white rounded-2xl border border-border p-3 space-y-2">
            <div className="text-sm font-bold pb-1">Job Details</div>
            <DetailRow icon={Anchor} label="Address" value={job.address} multiline />
            <DetailRow icon={Clock} label="Last Update" value={job.lastUpdate ?? ""} suffix />
            <DetailRow icon={Wrench} label="BAN" value={job.ban} suffix />
          </div>

          {/* Job Activity */}
          <div className="bg-white rounded-2xl border border-border p-3 space-y-3">
            <div className="text-sm font-bold">Job Activity</div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
              Repair Cancelled
            </span>
            <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-rose-400" style={{ width: "35%" }} />
            </div>
            <div className="flex justify-between text-xs">
              <span>Stopped at 9:12 AM</span>
              <span className="text-muted-foreground">Cancelled before completion</span>
            </div>
            <button
              onClick={() => setActivityOpen((o) => !o)}
              className="w-full border-t border-border pt-2 flex items-center justify-between text-sm"
            >
              <span>All Job Activity</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", activityOpen && "rotate-180")} />
            </button>
            {activityOpen && (
              <ul className="space-y-2.5 pt-1">
                {activity.map((step) => (
                  <li key={step.label} className="flex items-center gap-3 text-sm">
                    {step.state === "done" ? (
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white shrink-0" />
                    )}
                    <span
                      className={cn(
                        "flex-1",
                        step.state === "pending" && "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </span>
                    {step.time && (
                      <span className="text-xs text-muted-foreground">{step.time}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  multiline,
  suffix,
}: {
  icon: typeof Anchor;
  label: string;
  value: string;
  multiline?: boolean;
  suffix?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 border-t border-border first:border-t-0 pt-2 first:pt-0">
      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-foreground" />
      </div>
      <div className="flex-1 min-w-0 text-sm">
        {!suffix && <div className="text-xs text-muted-foreground">{label}</div>}
        <div className={cn(multiline && "whitespace-pre-line")}>{value}</div>
      </div>
      {suffix && <div className="text-xs text-muted-foreground self-center">{label}</div>}
    </div>
  );
}

export default function RouteTrail() {
  const navigate = useNavigate();
  const [state, setState] = useState<"collapsed" | "expanded">("collapsed");
  const [stephanOpen, setStephanOpen] = useState(false);
  const [dispatchOpen, setDispatchOpen] = useState(true);
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const eventRefs = useRef<Array<HTMLDivElement | null>>([]);
  const highlightTimer = useRef<number | null>(null);
  // When entering via the "Out-of-Route" filter, defer showing the trail overlay
  // until the user taps Stephan's avatar.
  const outOfRouteMode =
    typeof window !== "undefined" &&
    sessionStorage.getItem("mapOutOfRoute") === "1";
  const [overlayShown, setOverlayShown] = useState(!outOfRouteMode);

  const focusEvent = (idx: number) => {
    setDispatchOpen(true);
    setState("expanded");
    setHighlightIdx(idx);
    if (highlightTimer.current) window.clearTimeout(highlightTimer.current);
    highlightTimer.current = window.setTimeout(() => setHighlightIdx(null), 2200);
    requestAnimationFrame(() => {
      eventRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  useEffect(() => () => { if (highlightTimer.current) window.clearTimeout(highlightTimer.current); }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current == null) return;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (dy < -30) setState("expanded");
    else if (dy > 30) setState("collapsed");
    touchStartY.current = null;
  };

  const expanded = state === "expanded";

  return (
    <div data-view-name="Route Trail" className="w-full max-w-[393px] mx-auto bg-white">
      <div className="relative h-[852px] overflow-hidden">
        {/* Map background */}
        <img
          src={overlayShown ? mapBg : mapBgPlain}
          alt="Route trail map"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />

        <div className="relative z-10">
          <StatusBar />
        </div>

        {/* Header */}
        <div className="absolute top-12 left-0 right-0 z-20 flex items-center justify-between px-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="h-10 pl-2 pr-3 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] flex items-center gap-0.5 text-[15px] font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <button className="h-10 px-4 rounded-full bg-black text-white flex items-center gap-1.5 text-sm font-semibold shadow-[0_4px_14px_rgba(0,0,0,0.25)]">
            Today
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            aria-label="Layers"
            className="w-10 h-10 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] flex items-center justify-center"
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>

        {/* Map-coords container: scopes 0–100% to the visible map area only,
            i.e. below the header/status bar and above the bottom sheet.
            Frame is 852px; sheet sits at bottom-[64px] with collapsed h-[38%] (~324px),
            so the sheet top is ~388px from the bottom. Header ends ~96px from top. */}
        <div className="absolute left-0 right-0 z-10 pointer-events-none" style={{ top: "96px", bottom: "388px" }}>
          <div className="relative w-full h-full">
            {/* Route polyline is baked into the map image; only icon markers overlay it. */}

            {overlayShown && (
              <>
                {/* Gray house marker — center gray circle (Stephan stop) */}
                <button
                  onClick={() => { setStephanOpen(true); focusEvent(6); }}
                  aria-label="Open cancelled job"
                  className="absolute z-30 pointer-events-auto"
                  style={{ top: "51.4%", left: "68.4%", transform: "translate(-50%,-50%)" }}
                >
                  <div className="w-9 h-9 rounded-full bg-[#6B7280] ring-2 ring-white flex items-center justify-center shadow-md">
                    <Home className="w-4 h-4 text-white" />
                  </div>
                </button>

                {/* Phone marker — top-right red circle (Call entry) */}
                <button
                  onClick={() => focusEvent(2)}
                  aria-label="Show Call event"
                  className="absolute z-30 pointer-events-auto"
                  style={{ top: "44.6%", left: "76.2%", transform: "translate(-50%,-50%)" }}
                >
                  <div className="w-9 h-9 rounded-full bg-rose-500 ring-2 ring-white flex items-center justify-center shadow-md">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                </button>

                {/* Car marker — bottom-right red circle (harsh braking) */}
                <button
                  onClick={() => focusEvent(3)}
                  aria-label="Show harsh braking event"
                  className="absolute z-30 pointer-events-auto"
                  style={{ top: "76.9%", left: "80.8%", transform: "translate(-50%,-50%)" }}
                >
                  <div className="relative w-9 h-9 rounded-full bg-rose-500 ring-2 ring-white flex items-center justify-center shadow-md">
                    <Car className="w-4 h-4 text-white" />
                    <Asterisk className="w-3 h-3 text-amber-300 absolute -top-0.5 -right-0.5" strokeWidth={3} />
                  </div>
                </button>

                {/* Clock marker — bottom-left red circle (Parked/idle) */}
                <button
                  onClick={() => focusEvent(5)}
                  aria-label="Show parked event"
                  className="absolute z-30 pointer-events-auto"
                  style={{ top: "80.2%", left: "46.5%", transform: "translate(-50%,-50%)" }}
                >
                  <div className="w-9 h-9 rounded-full bg-rose-500 ring-2 ring-white flex items-center justify-center shadow-md">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                </button>
              </>
            )}

            {/* Stephan avatar — red-ringed out-of-route tech.
                Before overlay: tap reveals the trail overlay.
                After overlay: tap opens the tech detail. */}
            <button
              onClick={() => {
                if (!overlayShown) setOverlayShown(true);
                else navigate("/tech/tech-5");
              }}
              aria-label={overlayShown ? "Open Stephan Osco details" : "Show route trail"}
              className="absolute z-30 pointer-events-auto"
              style={{ top: "51.4%", left: "55%", transform: "translate(-50%,-50%)" }}
            >
              <img
                src={avatar(15)}
                alt="Stephan Osco"
                className="w-11 h-11 rounded-full object-cover ring-[3px] ring-destructive shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
              />
            </button>
          </div>
        </div>




        {/* Floating right controls */}
        <div className="absolute right-3 z-20 flex flex-col gap-3" style={{ top: "560px" }}>
          <button
            className="w-10 h-10 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] flex items-center justify-center"
            aria-label="More"
          >
            <span className="text-lg leading-none">···</span>
          </button>
          <button
            className="w-10 h-10 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] flex items-center justify-center"
            aria-label="Locate"
          >
            <Navigation className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Bottom sheet — only visible once the trail overlay has been revealed */}
        {overlayShown && (
          <div
            className={cn(
              "absolute left-0 right-0 bottom-0 z-40 bg-[#F2F2F6] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] transition-[height] duration-300 ease-out overflow-hidden flex flex-col",
              expanded ? "h-[calc(74%+64px)]" : "h-[calc(38%+64px)]",
            )}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="pt-2 flex justify-center cursor-pointer"
              onClick={() => setState(expanded ? "collapsed" : "expanded")}
            >
              <div className="w-10 h-1 rounded-full bg-muted-foreground/40" />
            </div>

            {/* Stats row */}
            <div className="px-4 pt-3 flex gap-2">
              <StatCard value="2" label="Dispatch" />
              <StatCard value="4" label="Alerts" />
              <StatCard value="22" label="Miles" />
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-[88px] space-y-2">
              <button
                onClick={() => setDispatchOpen((o) => !o)}
                className="w-full flex items-start justify-between pb-1"
              >
                <div className="text-left">
                  <div className="text-sm font-bold">Dispatch 1 (4 hr 10 min)</div>
                  <div className="text-xs text-muted-foreground">7:45 AM – 11:55 AM</div>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 mt-1 text-muted-foreground transition-transform",
                    !dispatchOpen && "-rotate-90",
                  )}
                />
              </button>
              {dispatchOpen &&
                DISPATCH_1.map((ev, i) => (
                  <EventRow
                    key={i}
                    ev={ev}
                    highlighted={highlightIdx === i}
                    refCb={(el) => { eventRefs.current[i] = el; }}
                  />
                ))}
            </div>
          </div>
        )}

        {stephanOpen && <StephanJobDrawer onClose={() => setStephanOpen(false)} />}

        <div className="absolute inset-x-0 bottom-0 z-[60]">
        </div>
      </div>
    </div>
  );
}
