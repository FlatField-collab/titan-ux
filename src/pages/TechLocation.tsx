import { useRef, useState } from "react";
import {
  Anchor,
  Building2,
  Car,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  Layers,
  MapPin,
  Maximize2,
  Megaphone,
  MessageSquare,
  Navigation,
  Shield,
  Sparkles,
  Train,
  Wifi,
  Wrench,
  X,
} from "lucide-react";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { useGuardedNavigate } from "@/lib/routes";
import { useNavigate } from "react-router-dom";
import mapBg from "@/assets/map-bg.jpg";
import { getTech } from "@/lib/techData";
import { cn } from "@/lib/utils";

const CHIP_ICONS: Record<string, typeof Compass> = {
  "Visit Due": Compass,
  Quality: Shield,
  "Harsh Braking": Train,
};

function ActionRow({ etaMin }: { etaMin: number }) {
  return (
    <div className="px-4 grid grid-cols-3 gap-2">
      <button className="h-16 rounded-2xl bg-[#1E3A8A] text-white flex flex-col items-center justify-center gap-1">
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
          <Navigation className="w-3.5 h-3.5 text-[#1E3A8A]" />
        </div>
        <span className="text-sm font-semibold">{etaMin} min</span>
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
  );
}

function ScheduledJobCard({
  job,
}: {
  job: {
    jobType: string;
    service: string;
    status: string;
    ban: string;
    jobId: string;
    window: string;
    address: string;
  };
}) {
  const closed = job.status === "Closed";
  return (
    <div className="bg-white rounded-2xl border border-border p-3 space-y-3">
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
          {job.jobType}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-slate-50 text-foreground text-xs font-semibold border border-border">
          {job.service}
        </span>
        <span
          className={cn(
            "ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold",
            closed
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-border bg-white",
          )}
        >
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              closed ? "bg-emerald-500" : "bg-slate-400",
            )}
          />
          {job.status}
        </span>
      </div>
      <div className="border-t border-border pt-2 flex justify-between text-xs">
        <span><span className="text-muted-foreground">BAN:</span> {job.ban}</span>
        <span><span className="text-muted-foreground">JOB ID:</span> {job.jobId}</span>
      </div>
      <div className="border-t border-border pt-2 text-xs">
        <div className="text-muted-foreground">Scheduled Appointment</div>
        <div className="font-semibold">{job.window}</div>
      </div>
      <div className="border-t border-border pt-2 flex items-start justify-between gap-3">
        <div className="text-xs">
          <div className="text-muted-foreground">Address</div>
          <div className="whitespace-pre-line">{job.address}</div>
        </div>
        <button
          aria-label="Directions"
          className="w-9 h-9 rounded-full bg-[#1E40AF] text-white flex items-center justify-center shrink-0"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function CollapsedBody({
  tech,
  onClose,
  onExpand,
}: {
  tech: ReturnType<typeof getTech>;
  onClose: () => void;
  onExpand: () => void;
}) {
  const job = tech.currentJob!;
  return (
    <div className="flex flex-col h-full">
      <div className="pt-2 flex justify-center cursor-pointer" onClick={onExpand}>
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
          onClick={onExpand}
          aria-label="Expand"
          className="absolute right-4 top-2 w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <div className="text-center">
          <div className="text-lg font-bold">{tech.name}</div>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <Car className="w-4 h-4" />
            <span>
              {job.presence}
              {job.distanceFromJob ? ` · ${job.distanceFromJob}` : ""}
            </span>
          </div>
        </div>
      </div>

      <ActionRow etaMin={job.etaMin ?? 9} />

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-3">
        <div className="bg-slate-100 rounded-2xl p-3">
          <div className="flex items-center gap-2 text-sm font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            Recommended Visit
          </div>
          <div className="flex flex-wrap gap-2">
            {(job.recommendedChips ?? []).map((label) => {
              const Icon = CHIP_ICONS[label] ?? Compass;
              return (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-blue-700 text-xs font-medium border border-blue-100"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-3 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
            {job.jobType}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {job.status}
          </span>
        </div>
      </div>
    </div>
  );
}

function ExpandedBody({
  tech,
  onCollapse,
}: {
  tech: ReturnType<typeof getTech>;
  onCollapse: () => void;
}) {
  const navigate = useGuardedNavigate();
  const job = tech.currentJob!;
  const [activityOpen, setActivityOpen] = useState(true);
  const pct = job.estMin ? Math.min(100, ((job.durationMin ?? 0) / job.estMin) * 100) : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="pt-2 flex justify-center cursor-pointer" onClick={onCollapse}>
        <div className="w-9 h-1 rounded-full bg-muted-foreground/40" />
      </div>

      <div className="relative px-4 pt-2 pb-3 flex items-start justify-between">
        <div>
          <div className="text-2xl font-bold leading-tight">{job.jobType}</div>
          <div className="text-xs text-muted-foreground">{job.service}</div>
        </div>
        <button
          onClick={onCollapse}
          aria-label="Collapse"
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
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {job.status}
              </span>
            </div>
            <button
              onClick={() => navigate(`/tech/${tech.id}`)}
              className="text-sm font-semibold text-blue-700 inline-flex items-center gap-0.5"
            >
              Details
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <ActionRow etaMin={job.etaMin ?? 9} />
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-2xl border border-border p-3 space-y-2">
          <div className="text-sm font-bold pb-1">Job Details</div>
          <DetailRow icon={Anchor} label="Address" value={job.address} multiline />
          <DetailRow icon={Clock} label="Appt." value={job.appointmentWindow ?? ""} suffix />
          <DetailRow icon={Wrench} label="BAN" value={job.ban} suffix />
          <DetailRow icon={Wrench} label="JOB ID" value={job.jobId ?? ""} suffix />
        </div>

        {/* Job Activity */}
        <div className="bg-white rounded-2xl border border-border p-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold">Job Activity</div>
            {job.rgActive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-semibold">
                <Wifi className="w-3 h-3" />
                RG
              </span>
            )}
          </div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-foreground text-xs font-semibold">
            {job.jobType} In Progress
          </span>
          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full bg-emerald-400" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between text-xs">
            <span>Dispatched {job.durationMin} min</span>
            <span className="text-muted-foreground">{job.estMin} min (est.)</span>
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
              {(job.activity ?? []).map((step) => (
                <li key={step.label} className="flex items-center gap-3 text-sm">
                  {step.state === "done" ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                  ) : step.state === "active" ? (
                    <span className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white shrink-0" />
                  ) : (
                    <span className="w-5 h-5 shrink-0" />
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

        {/* Upcoming Jobs */}
        {job.upcomingJobs && job.upcomingJobs.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-bold px-1">Upcoming Jobs</div>
            {job.upcomingJobs.map((j) => (
              <ScheduledJobCard key={j.id} job={j} />
            ))}
          </div>
        )}

        {/* Past Jobs */}
        {job.pastJobs && job.pastJobs.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-bold px-1">Past Jobs</div>
            {job.pastJobs.map((j) => (
              <ScheduledJobCard key={j.id} job={j} />
            ))}
          </div>
        )}
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
      {suffix && (
        <div className="text-xs text-muted-foreground self-center">{label}</div>
      )}
    </div>
  );
}

export default function TechLocation() {
  const navigate = useNavigate();
  const tech = getTech("tech-1");
  const [state, setState] = useState<"collapsed" | "expanded">("collapsed");
  const touchStartY = useRef<number | null>(null);

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
    <div data-view-name="Tech Location" className="w-full max-w-[393px] mx-auto bg-white">
      <div className="relative h-[852px] overflow-hidden">
        <img
          src={mapBg}
          alt="Map centered on Gabriel Sinclair's location"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />

        <div className="relative z-10">
          <StatusBar />
        </div>

        {/* Floating right-side controls */}
        <div className="absolute top-24 right-3 z-20 flex flex-col gap-3">
          <button
            className="w-10 h-10 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] flex items-center justify-center border border-black/5"
            aria-label="Layers"
          >
            <Layers className="w-[18px] h-[18px] text-foreground" />
          </button>
          <button
            className="w-10 h-10 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] flex items-center justify-center border border-black/5"
            aria-label="Locate"
          >
            <Navigation className="w-[18px] h-[18px] text-foreground" />
          </button>
        </div>

        {/* Work center pin */}
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ top: "18%", left: "72%" }}
        >
          <div className="w-7 h-7 rounded-full bg-[#1F2937] shadow-md flex items-center justify-center ring-2 ring-white/80">
            <Building2 className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Gabriel avatar pin (centered) */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ top: "38%", left: "50%" }}
        >
          <div className="relative">
            {tech.avatarUrl ? (
              <img
                src={tech.avatarUrl}
                alt={tech.name}
                className="w-12 h-12 rounded-full object-cover ring-[3px] ring-white shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-200 ring-[3px] ring-white flex items-center justify-center font-semibold">
                {tech.initials}
              </div>
            )}
            <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-3 h-3 bg-white rotate-45" aria-hidden />
          </div>
        </div>

        {/* Dim overlay when expanded */}
        {expanded && (
          <div className="absolute inset-0 z-30 bg-black/40" aria-hidden />
        )}

        {/* Bottom sheet */}
        <div
          className={cn(
            "absolute left-0 right-0 bottom-0 z-40 bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] transition-[height] duration-300 ease-out overflow-hidden",
            expanded ? "h-[92%]" : "h-[60%]",
          )}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {expanded ? (
            <ExpandedBody tech={tech} onCollapse={() => setState("collapsed")} />
          ) : (
            <CollapsedBody
              tech={tech}
              onClose={() => navigate("/map")}
              onExpand={() => setState("expanded")}
            />
          )}
        </div>

        {!expanded && (
          <div className="absolute inset-x-0 bottom-0 z-50">
          </div>
        )}
      </div>
    </div>
  );
}
