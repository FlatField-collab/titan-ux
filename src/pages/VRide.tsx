import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  X,
  Check,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar as CalendarIcon,
  Clock,
  Utensils,
  UserPlus,
  Sparkles,
  ShieldAlert,
  Navigation,
  ClipboardList,
  ShieldCheck,
  Plus,
  Mic,
  Keyboard,
  Image as ImageIcon,
  Camera,
  FileText,
  Map as MapIcon,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Zap,
  Gauge,
  Car,
  Loader2,
  Pencil,
} from "lucide-react";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import lucasBrooksAvatar from "@/assets/lucas-brooks-avatar.png";
import mapBg from "@/assets/map-bg.jpg";
import { avatar } from "@/assets/avatars";

// ---------- tech roster ----------
type SafetyIncident = { time: string; location: string };
type SafetyEntry = {
  id: string;
  label: string;
  icon: typeof Zap;
  count: number;
  incidents: SafetyIncident[];
};
type SummaryEntry = { title: string; body: string; suggestion: string };
type RouteStop = { n: number; top: string; left: string };
type MetricEntry = { l: string; v: string; d: string; up: boolean };

type VTech = {
  id: string;
  name: string;
  first: string;
  avatar: string;
  schedule: { shift: string; lunch: string; oto: string; atnd: string };
  dateLabel: string;
  weekRange: string;
  weekDays: { d: string; n: number; selected?: boolean; alerts?: number; dot?: boolean }[];
  suggestedDays: string[];
  events: { safety: number; gps: number; trueScoping: number; expertFails: number };
  flaggedJob: { type: string; status: string; date: string; address: string };
  routeStops: RouteStop[];
  routePath: string;
  jobsStats: { worked: number; helper: number; returns: number };
  metricsDate: string;
  metrics: MetricEntry[];
  smartSummary: SummaryEntry[];
  gpsInsights: SummaryEntry[];
  safety: SafetyEntry[];
  reviewDate: string; // shown in DateRow pill
};

function tpl(s: string, t: { name: string; first: string }) {
  return s
    .replace(/\[Tech Name\]/g, t.name)
    .replace(/\[First Name\]/g, t.first)
    .replace(/\{name\}/g, t.name)
    .replace(/\{first\}/g, t.first);
}

// ---------- Observations store ----------
type ObservationSource = "voice" | "manual" | "action";
const OBSERVATION_CATEGORIES = [
  "Harsh Braking",
  "Rapid Acceleration",
  "Backing",
  "Speeding",
  "Idle Time",
  "Off-Route Travel",
  "Other",
] as const;
type ObservationCategory = (typeof OBSERVATION_CATEGORIES)[number];

type Observation = {
  id: string;
  techId: string;
  createdAt: number;
  source: ObservationSource;
  category: ObservationCategory;
  text: string;
  isTemplate?: boolean;
};

type ObservationsCtx = {
  observations: Observation[];
  addObservation: (o: Omit<Observation, "id" | "createdAt" | "techId">) => void;
  updateObservation: (id: string, patch: Partial<Pick<Observation, "text" | "category">>) => void;
};

const ObservationsContext = createContext<ObservationsCtx | null>(null);

function useObservations() {
  const ctx = useContext(ObservationsContext);
  if (!ctx) throw new Error("ObservationsContext missing");
  return ctx;
}

function categorizeVoice(text: string): ObservationCategory {
  const t = text.toLowerCase();
  if (/(harsh|brak)/.test(t)) return "Harsh Braking";
  if (/(rapid|accelerat)/.test(t)) return "Rapid Acceleration";
  if (/(back(ing)?|reverse)/.test(t)) return "Backing";
  if (/(speed|over the limit)/.test(t)) return "Speeding";
  if (/(idle|idling)/.test(t)) return "Idle Time";
  if (/(off.?route|deviat|routing)/.test(t)) return "Off-Route Travel";
  return "Other";
}



const SAFETY_LABEL = {
  harsh: "Harsh Breaking",
  rapid: "Rapid Acceleration",
  back: "Backing",
  speed: "Speeding",
} as const;

const TECHS: VTech[] = [
  {
    id: "juan-benni",
    name: "Juan Benni",
    first: "Juan",
    avatar: avatar(14),
    schedule: {
      shift: "7:30 AM - 4:00 PM",
      lunch: "12:00 PM - 12:30 PM",
      oto: "OTO (1), AMM (.5), HUD (1)",
      atnd: "2.5 Hours (ATND)",
    },
    dateLabel: "Jun 09, 2026",
    reviewDate: "Jun 09, 2026",
    weekRange: "June 8 – 12, 2026",
    weekDays: [
      { d: "Mon", n: 8 },
      { d: "Tue", n: 9, selected: true, dot: true },
      { d: "Wed", n: 10, alerts: 1 },
      { d: "Thu", n: 11 },
      { d: "Fri", n: 12 },
    ],
    suggestedDays: ["June 7, 2026", "June 9, 2026", "June 11, 2026"],
    events: { safety: 4, gps: 4, trueScoping: 2, expertFails: 3 },
    flaggedJob: {
      type: "Repair",
      status: "Closed",
      date: "June 8, 2026",
      address: "2710 Sunset Strip",
    },
    routeStops: [
      { n: 1, top: "26%", left: "28%" },
      { n: 2, top: "65%", left: "75%" },
    ],
    routePath: "M40 60 L90 50 L120 95 L180 70 L230 110",
    jobsStats: { worked: 4, helper: 2, returns: 2 },
    metricsDate: "June 9, 2026",
    metrics: [
      { l: "AIQ Attainment", v: "82%", d: "10%", up: true },
      { l: "DCR", v: "84%", d: "3.6%", up: false },
      { l: "Efficiency", v: "95%", d: "4%", up: true },
      { l: "HPC", v: "95%", d: "4%", up: true },
    ],
    smartSummary: [
      {
        title: "Harsh Braking",
        body: "[First Name] had 5 harsh breaking alerts in the past 24 hours.",
        suggestion: "Remind [First Name] to maintain at least 12 feet between vehicles.",
      },
      {
        title: "Rapid Acceleration",
        body: "[First Name] was previously coached on rapid acceleration on Jan 25, 2026.",
        suggestion:
          "[First Name] is currently on a Growth Plan for this topic. Based on his progress, you may choose to escalate it to an Improve Growth Plan to reinforce best practices around safe driving.",
      },
      {
        title: "Speeding",
        body: "[First Name] went over the speed limit 4 times in the past 24 hours.",
        suggestion: "Remind [First Name] to obey the speed limit.",
      },
    ],
    gpsInsights: [
      {
        title: "Idle Time",
        body: "Vehicle was idle for 38 minutes across 3 stops today.",
        suggestion: "Coach [First Name] on reducing idle time between job sites to improve route efficiency.",
      },
      {
        title: "Off-Route Travel",
        body: "[First Name] deviated from the planned route twice this shift.",
        suggestion: "Review optimal routing with [First Name] and confirm the dispatch app is updated.",
      },
    ],
    safety: [
      { id: "harsh", label: SAFETY_LABEL.harsh, icon: Zap, count: 1, incidents: [{ time: "10:46 am", location: "Houston, Texas 77064" }] },
      { id: "rapid", label: SAFETY_LABEL.rapid, icon: Gauge, count: 2, incidents: [
        { time: "10:02 am", location: "Houston, Texas 77062" },
        { time: "8:22 am", location: "Houston, Texas 77062" },
      ]},
      { id: "back", label: SAFETY_LABEL.back, icon: Car, count: 1, incidents: [{ time: "8:22 am", location: "Houston, Texas 77062" }] },
      { id: "speed", label: SAFETY_LABEL.speed, icon: Gauge, count: 1, incidents: [{ time: "8:22 am", location: "Houston, Texas 77062" }] },
    ],
  },
  {
    id: "gabriel-sinclair",
    name: "Gabriel Sinclair",
    first: "Gabriel",
    avatar: avatar(12),
    schedule: {
      shift: "7:00 AM - 3:30 PM",
      lunch: "11:30 AM - 12:00 PM",
      oto: "OTO (2), AMM (1), HUD (0)",
      atnd: "1.5 Hours (ATND)",
    },
    dateLabel: "Jun 09, 2026",
    reviewDate: "Jun 09, 2026",
    weekRange: "April 6 – 10, 2026",
    weekDays: [
      { d: "Mon", n: 6 },
      { d: "Tue", n: 7 },
      { d: "Wed", n: 8, alerts: 1 },
      { d: "Thu", n: 9, selected: true, dot: true },
      { d: "Fri", n: 10 },
    ],
    suggestedDays: ["June 7, 2026", "June 9, 2026", "June 11, 2026"],
    events: { safety: 5, gps: 3, trueScoping: 2, expertFails: 3 },
    flaggedJob: {
      type: "Install",
      status: "Closed",
      date: "April 7, 2026",
      address: "1245 W Oakwood Park Drive",
    },
    routeStops: [
      { n: 1, top: "26%", left: "28%" },
      { n: 2, top: "65%", left: "75%" },
    ],
    routePath: "M40 60 L90 50 L120 95 L180 70 L230 110",
    jobsStats: { worked: 4, helper: 2, returns: 2 },
    metricsDate: "June 9, 2026",
    metrics: [
      { l: "AIQ Attainment", v: "82%", d: "10%", up: true },
      { l: "DCR", v: "84%", d: "3.6%", up: false },
      { l: "Efficiency", v: "95%", d: "4%", up: true },
      { l: "HPC", v: "95%", d: "4%", up: true },
    ],
    smartSummary: [
      {
        title: "Harsh Braking",
        body: "[First Name] had 5 harsh breaking alerts in the past 24 hours.",
        suggestion: "Remind [First Name] to maintain at least 12 feet between vehicles.",
      },
      {
        title: "Rapid Acceleration",
        body: "[First Name] was previously coached on rapid acceleration on Jan 25, 2026.",
        suggestion:
          "[First Name] is currently on a Growth Plan for this topic. Based on his progress, you may choose to escalate it to an Improve Growth Plan to reinforce best practices around using suitable anchors and sealing holes during installations.",
      },
      {
        title: "Speeding",
        body: "[First Name] went over the speed limit 4 times in the past 24 hours.",
        suggestion: "Remind [First Name] to obey the speed limit.",
      },
    ],
    gpsInsights: [
      {
        title: "Idle Time",
        body: "Vehicle was idle for 38 minutes across 3 stops today.",
        suggestion: "Coach [First Name] on reducing idle time between job sites to improve route efficiency.",
      },
      {
        title: "Off-Route Travel",
        body: "[First Name] deviated from the planned route twice this shift.",
        suggestion: "Review optimal routing with [First Name] and confirm the dispatch app is updated.",
      },
    ],
    safety: [
      { id: "harsh", label: SAFETY_LABEL.harsh, icon: Zap, count: 2, incidents: [
        { time: "11:14 am", location: "Sunrise, FL 33351" },
        { time: "9:02 am", location: "Sunrise, FL 33351" },
      ]},
      { id: "rapid", label: SAFETY_LABEL.rapid, icon: Gauge, count: 1, incidents: [{ time: "8:48 am", location: "Sunrise, FL 33351" }] },
      { id: "back", label: SAFETY_LABEL.back, icon: Car, count: 1, incidents: [{ time: "7:55 am", location: "Sunrise, FL 33351" }] },
      { id: "speed", label: SAFETY_LABEL.speed, icon: Gauge, count: 1, incidents: [{ time: "8:22 am", location: "Sunrise, FL 33351" }] },
    ],
  },
  {
    id: "lucas-brooks",
    name: "Lucas Brooke",
    first: "Lucas",
    avatar: lucasBrooksAvatar,
    schedule: {
      shift: "8:00 AM - 4:30 PM",
      lunch: "12:30 PM - 1:00 PM",
      oto: "OTO (3), AMM (1.5), HUD (2)",
      atnd: "3 Hours (ATND)",
    },
    dateLabel: "Jun 09, 2026",
    reviewDate: "Jun 09, 2026",
    weekRange: "June 8 – 12, 2026",
    weekDays: [
      { d: "Mon", n: 8, alerts: 2 },
      { d: "Tue", n: 9, selected: true, dot: true },
      { d: "Wed", n: 10, alerts: 3 },
      { d: "Thu", n: 11, alerts: 1 },
      { d: "Fri", n: 12 },
    ],
    suggestedDays: ["June 8, 2026", "June 9, 2026", "June 10, 2026"],
    events: { safety: 8, gps: 6, trueScoping: 3, expertFails: 4 },
    flaggedJob: {
      type: "Install",
      status: "Open",
      date: "June 9, 2026",
      address: "4571 NW 103rd Ave",
    },
    routeStops: [
      { n: 1, top: "30%", left: "20%" },
      { n: 2, top: "55%", left: "55%" },
      { n: 3, top: "70%", left: "82%" },
    ],
    routePath: "M30 70 L80 40 L140 95 L210 75 L260 115",
    jobsStats: { worked: 5, helper: 1, returns: 3 },
    metricsDate: "June 9, 2026",
    metrics: [
      { l: "AIQ Attainment", v: "74%", d: "6%", up: false },
      { l: "DCR", v: "79%", d: "5.2%", up: false },
      { l: "Efficiency", v: "88%", d: "2%", up: true },
      { l: "HPC", v: "91%", d: "1%", up: false },
    ],
    smartSummary: [
      {
        title: "Harsh Braking",
        body: "[First Name] had 8 harsh breaking alerts in the past 24 hours.",
        suggestion: "Remind [First Name] to maintain at least 12 feet between vehicles.",
      },
      {
        title: "Rapid Acceleration",
        body: "[First Name] triggered 3 rapid acceleration events this shift.",
        suggestion: "Coach [First Name] on smoother throttle control between job sites.",
      },
      {
        title: "Speeding",
        body: "[First Name] went over the speed limit 6 times in the past 24 hours.",
        suggestion: "Remind [First Name] to obey the speed limit.",
      },
    ],
    gpsInsights: [
      {
        title: "Idle Time",
        body: "Vehicle was idle for 52 minutes across 4 stops today.",
        suggestion: "Coach [First Name] on reducing idle time between job sites to improve route efficiency.",
      },
      {
        title: "Off-Route Travel",
        body: "[First Name] deviated from the planned route three times this shift.",
        suggestion: "Review optimal routing with [First Name] and confirm the dispatch app is updated.",
      },
    ],
    safety: [
      { id: "harsh", label: SAFETY_LABEL.harsh, icon: Zap, count: 3, incidents: [
        { time: "11:46 am", location: "Houston, Texas 77064" },
        { time: "10:12 am", location: "Houston, Texas 77064" },
        { time: "9:01 am", location: "Houston, Texas 77064" },
      ]},
      { id: "rapid", label: SAFETY_LABEL.rapid, icon: Gauge, count: 3, incidents: [
        { time: "11:02 am", location: "Houston, Texas 77062" },
        { time: "9:22 am", location: "Houston, Texas 77062" },
        { time: "8:10 am", location: "Houston, Texas 77062" },
      ]},
      { id: "back", label: SAFETY_LABEL.back, icon: Car, count: 1, incidents: [{ time: "8:22 am", location: "Houston, Texas 77062" }] },
      { id: "speed", label: SAFETY_LABEL.speed, icon: Gauge, count: 1, incidents: [{ time: "8:22 am", location: "Houston, Texas 77062" }] },
    ],
  },
];

function getTech(id?: string | null): VTech {
  return TECHS.find((t) => t.id === id) ?? TECHS[0];
}

// ---------- Expert Path data ----------
type SubItem = { label: string; pass: boolean };
type Step = { num: number; title: string; items: SubItem[] };

const EXPERT_STEPS: Step[] = [
  {
    num: 1,
    title: "Greet and Verify",
    items: [
      { label: "Pre-Call", pass: false },
      { label: "Drive to Prem", pass: false },
    ],
  },
  {
    num: 2,
    title: "Qualify to Terminal",
    items: [
      { label: "Scope at PFP", pass: true },
      { label: "True Test Splitter at ONT", pass: true },
      { label: "No Fiber Pulled Jumper", pass: true },
    ],
  },
  {
    num: 3,
    title: "Survey Customer and Premises",
    items: [
      { label: "Pre-Activation Wi-Fi Assessment", pass: true },
      { label: "Wi-Fi Assessment Upload", pass: false },
      { label: "Wi-Fi Assessment Quality", pass: true },
      { label: "ETC", pass: true },
    ],
  },
  {
    num: 4,
    title: "Extend to Home",
    items: [{ label: "True Test at Prem", pass: true }],
  },
  {
    num: 5,
    title: "Connect to Gateway",
    items: [
      { label: "Fiber Jack AI", pass: true },
      { label: "Scope at Prem", pass: true },
    ],
  },
  {
    num: 6,
    title: "Finalize Experience",
    items: [
      { label: "SHM Login", pass: true },
      { label: "SHM SSID Assist", pass: true },
      { label: "SHM RGST & Device ST", pass: true },
      { label: "SHM Virtual Assistant", pass: false },
      { label: "SHM Active Armor", pass: true },
      { label: "SHM Enable Push Notifications", pass: true },
      { label: "Customize Wi-Fi Name & Password", pass: true },
    ],
  },
  {
    num: 7,
    title: "Verify, Thank, and Close",
    items: [
      { label: "Quality Check Pass", pass: true },
      { label: "Close from Prem", pass: true },
    ],
  },
];

const stepFailCount = (s: Step) => s.items.filter((i) => !i.pass).length;

// ---------- Events tile ----------
function EventTile({
  label,
  count,
  unit,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  count: number;
  unit: string;
  icon: any;
  tone?: "blue";
}) {
  return (
    <div className="flex-1 bg-[#F2F3F7] rounded-2xl px-4 py-3">
      <div className="flex items-start justify-between">
        <span className="text-[15px] font-semibold text-foreground">{label}</span>
        <span className="w-7 h-7 rounded-lg bg-[#E2E8F4] flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#1E3A8A]" />
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-[28px] font-bold leading-none">{count}</span>
        <span className="text-[13px] text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

function EventsGrid({ tech }: { tech: VTech }) {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm">
      <div className="px-1 py-1 text-[15px] font-bold">Events</div>
      <div className="mt-1 grid grid-cols-2 gap-2">
        <EventTile label="Safety" count={tech.events.safety} unit="Alerts" icon={ShieldAlert} />
        <EventTile label="GPS" count={tech.events.gps} unit="Alerts" icon={MoreHorizontal} />
        <EventTile label="True & Scoping" count={tech.events.trueScoping} unit="Fails" icon={ClipboardList} />
        <EventTile label="Expert Path" count={tech.events.expertFails} unit="Fails" icon={ShieldCheck} />
      </div>
    </div>
  );
}

// ---------- Sparkline ----------
function Sparkline({ up = true }: { up?: boolean }) {
  const color = up ? "#16a34a" : "#dc2626";
  const path = up
    ? "M0 22 Q 10 8, 20 14 T 40 6 T 60 12 T 80 4"
    : "M0 10 Q 10 16, 20 12 T 40 18 T 60 14 T 80 22";
  return (
    <svg viewBox="0 0 84 28" className="w-[90px] h-8">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <polygon
        points={up ? "80,4 76,6 80,8 84,6" : "80,22 76,20 80,18 84,20"}
        fill={color}
      />
    </svg>
  );
}

// ---------- Action menu ----------
function ActionMenu({
  open,
  onClose,
  hasDraft,
  onDeleteDraft,
  onTypeObservation,
}: {
  open: boolean;
  onClose: () => void;
  hasDraft: boolean;
  onDeleteDraft: () => void;
  onTypeObservation: () => void;
}) {
  if (!open) return null;
  const handle = (label: string, action?: () => void) => {
    if (action) action();
    else toast({ title: label, description: "Coming soon" });
    onClose();
  };
  if (hasDraft) {
    return (
      <>
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/5 backdrop-blur-[2px]"
          onClick={onClose}
        />
        <div className="absolute top-[58px] left-3 z-40 w-[230px] rounded-3xl bg-white/95 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.18)] border border-black/5 p-2 space-y-1.5">
          <button
            onClick={() => {
              onDeleteDraft();
              onClose();
            }}
            className="w-full h-12 rounded-full bg-[#F2F3F7] text-[#E5484D] text-[17px] font-semibold active:opacity-70"
          >
            Delete Draft
          </button>
          <button
            onClick={() => handle("Save Draft")}
            className="w-full h-12 rounded-full bg-[#F2F3F7] text-foreground text-[17px] font-medium active:opacity-70"
          >
            Save Draft
          </button>
        </div>
      </>
    );
  }
  const items: { label: string; icon: any; action?: () => void }[] = [
    { label: "Type Observation", icon: Keyboard, action: onTypeObservation },
    { label: "Photos", icon: ImageIcon },
    { label: "Camera", icon: Camera },
    { label: "Files", icon: FileText },
    { label: "Map", icon: MapIcon },
  ];
  return (
    <>
      <button
        aria-label="Close menu"
        className="fixed inset-0 z-30 bg-black/5 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="absolute top-[58px] right-[60px] z-40 w-[245px] rounded-3xl bg-white/95 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.18)] border border-black/5 py-1">
        {items.map((it) => (
          <button
            key={it.label}
            onClick={() => handle(it.label, it.action)}
            className="w-full flex items-center gap-3 px-4 py-3 text-[16px] text-foreground active:bg-black/5"
          >
            <it.icon className="w-5 h-5 text-foreground/80" />
            <span>{it.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}

// ---------- Exit dialog ----------
function ExitDialog({
  open,
  onCancel,
  onDelete,
}: {
  open: boolean;
  onCancel: () => void;
  onDelete: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30">
      <div className="w-full max-w-[340px] rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl p-5">
        <h3 className="text-[19px] font-bold text-foreground leading-snug">
          Are you sure you want to discard this field review?
        </h3>
        <p className="mt-2 text-[15px] text-muted-foreground">
          This action can not be undone.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={onCancel}
            className="h-12 rounded-full bg-[#F2F3F7] text-foreground text-[16px] font-semibold active:opacity-70"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="h-12 rounded-full bg-[#F2F3F7] text-[#E5484D] text-[16px] font-semibold active:opacity-70"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Header card ----------
function TechHeaderCard({ tech }: { tech: VTech }) {
  return (
    <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-4 flex items-start gap-3">
      <img src={tech.avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
      <div className="flex-1 min-w-0">
        <div className="text-[18px] font-bold leading-tight">{tech.name}</div>
        <div className="mt-1.5 space-y-1 text-[13.5px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1E3A8A]" />
            <span>{tech.schedule.shift}</span>
          </div>
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#1E3A8A]" />
            <span>{tech.schedule.lunch}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#1E3A8A]" />
            <span>{tech.schedule.oto}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1E3A8A]" />
            <span>{tech.schedule.atnd}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DateRow({ tech }: { tech: VTech }) {
  return (
    <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm py-3.5 px-4 flex items-center">
      <div className="w-9 h-9 rounded-lg bg-[#E2E8F4] flex items-center justify-center mr-3">
        <CalendarIcon className="w-5 h-5 text-[#1E3A8A]" />
      </div>
      <span className="text-[16px] font-medium flex-1">Date</span>
      <span className="px-3 py-1.5 rounded-full bg-[#F2F3F7] text-[15px] font-medium">
        {tech.reviewDate}
      </span>
    </div>
  );
}

// ---------- Smart Summary card ----------
function SummaryCard({
  title,
  body,
  suggestion,
  onAddAction,
}: {
  title: string;
  body: string;
  suggestion: string;
  onAddAction: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="text-[16px] font-bold text-foreground">{title}</div>
      <p className="mt-1 text-[13.5px] text-muted-foreground leading-snug">{body}</p>
      <div className="mt-3 bg-[#F2F3F7] rounded-2xl p-3">
        <p className="text-[13.5px] text-muted-foreground leading-snug">{suggestion}</p>
        <button
          onClick={onAddAction}
          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black text-white text-[13px] font-semibold active:opacity-70"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={3} />
          Add Action
        </button>
      </div>
    </div>
  );
}

// ---------- Expert Path tab ----------
function ExpertPath() {
  const [openJob, setOpenJob] = useState<number | null>(1);
  const [openStep, setOpenStep] = useState<string | null>("1-1");

  return (
    <div className="px-4 pb-32">
      {[1, 2, 3].map((jobNum) => {
        const isOpen = openJob === jobNum;
        return (
          <div key={jobNum} className="mt-3">
            <button
              onClick={() => setOpenJob(isOpen ? null : jobNum)}
              className="w-full flex items-center justify-between px-2 py-3 text-[16px] text-muted-foreground"
            >
              <span>Dispatched - Job {jobNum}</span>
              {isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {isOpen && (
              <div className="bg-white rounded-2xl shadow-sm divide-y divide-[#EFEFF4] overflow-hidden">
                {EXPERT_STEPS.map((step) => {
                  const stepKey = `${jobNum}-${step.num}`;
                  const expanded = openStep === stepKey;
                  const fails = stepFailCount(step);
                  return (
                    <div key={stepKey}>
                      <button
                        onClick={() => setOpenStep(expanded ? null : stepKey)}
                        className="w-full flex items-center gap-3 px-3 py-3.5 text-left"
                      >
                        <span className="relative w-8 h-8 flex items-center justify-center shrink-0">
                          <svg viewBox="0 0 32 32" className="absolute inset-0 w-full h-full">
                            <path
                              d="M16 3 L29 26 L3 26 Z"
                              fill="#19B8E6"
                              stroke="#1ea8d0"
                              strokeWidth="1"
                            />
                          </svg>
                          <span className="relative text-white text-[12px] font-bold pt-1">
                            {step.num}
                          </span>
                        </span>
                        <span className="flex-1 text-[15.5px] font-medium text-foreground">
                          {step.title}
                        </span>
                        {fails > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-[#FDE2E4] text-[#E5484D] text-[12px] font-bold">
                            {fails}
                          </span>
                        )}
                        {expanded ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      {expanded && (
                        <div className="px-3 pb-3 -mt-1">
                          <div className="ml-11 divide-y divide-[#EFEFF4]">
                            {step.items.map((it) => (
                              <div
                                key={it.label}
                                className="flex items-center justify-between py-3"
                              >
                                <span className="text-[14.5px] text-foreground">
                                  {it.label}
                                </span>
                                {it.pass ? (
                                  <span className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                  </span>
                                ) : (
                                  <span className="w-5 h-5 rounded-full bg-[#E5484D] flex items-center justify-center">
                                    <X className="w-3 h-3 text-white" strokeWidth={3} />
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------- Overview tab ----------
function OverviewTab({ tech }: { tech: VTech }) {
  const { addObservation } = useObservations();
  return (
    <div className="px-4 pb-32 space-y-4">
      <EventsGrid tech={tech} />

      <div>
        <div className="flex items-center gap-2 px-1 mb-2">
          <Sparkles className="w-4 h-4 text-foreground" fill="currentColor" />
          <h3 className="text-[17px] font-bold">Smart Summary</h3>
        </div>
        <div className="space-y-3">
          {tech.smartSummary.map((s) => (
            <SummaryCard
              key={s.title}
              title={s.title}
              body={tpl(s.body, tech)}
              suggestion={tpl(s.suggestion, tech)}
              onAddAction={() =>
                addObservation({
                  source: "action",
                  category: (OBSERVATION_CATEGORIES as readonly string[]).includes(s.title)
                    ? (s.title as ObservationCategory)
                    : "Other",
                  text: s.suggestion,
                  isTemplate: true,
                })
              }
            />
          ))}
        </div>
      </div>


      <div>
        <div className="flex items-center justify-between px-1 mb-2">
          <h3 className="text-[17px] font-bold">Route</h3>
          <button className="flex items-center gap-1 text-[14px] text-muted-foreground">
            See Details
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="relative h-44 rounded-2xl overflow-hidden shadow-sm">
          <img src={mapBg} alt="Route" className="absolute inset-0 w-full h-full object-cover" />
          <svg viewBox="0 0 300 160" className="absolute inset-0 w-full h-full">
            <path
              d={tech.routePath}
              fill="none"
              stroke="#1E66F5"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {tech.routeStops.map((p) => (
            <div
              key={p.n}
              className="absolute w-6 h-6 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center shadow"
              style={{ top: p.top, left: p.left, transform: "translate(-50%, -50%)" }}
            >
              {p.n}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="px-1 mb-2 text-[17px] font-bold">Jobs</h3>
        <div className="bg-white rounded-2xl shadow-sm p-3 grid grid-cols-3 gap-2">
          {[
            { n: tech.jobsStats.worked, l: "Jobs Worked" },
            { n: tech.jobsStats.helper, l: "Helper Tickets" },
            { n: tech.jobsStats.returns, l: "Returns" },
          ].map((j) => (
            <div key={j.l} className="bg-[#F2F3F7] rounded-xl py-3 px-3">
              <div className="text-[24px] font-bold leading-none">{j.n}</div>
              <div className="mt-1 text-[12px] text-muted-foreground">{j.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-[17px] font-bold">Metrics</h3>
          <span className="px-2 py-0.5 rounded-md bg-[#F2F3F7] text-[11px] font-medium text-muted-foreground">
            {tech.metricsDate}
          </span>
        </div>
        {tech.metrics.map((m, i) => (
          <div
            key={m.l}
            className={cn(
              "flex items-center justify-between py-2.5",
              i > 0 && "border-t border-[#EFEFF4]",
            )}
          >
            <div>
              <div className="text-[14px] font-semibold">{m.l}</div>
              <div className="mt-0.5 flex items-baseline gap-2">
                <span className="text-[20px] font-bold">{m.v}</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-semibold",
                    m.up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700",
                  )}
                >
                  {m.up ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {m.d}
                </span>
              </div>
            </div>
            <Sparkline up={m.up} />
          </div>
        ))}
      </div>

      <div>
        <h3 className="px-1 mb-2 text-[17px] font-bold text-muted-foreground">Links</h3>
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-[#EFEFF4]">
          {["ESM 2.0", "FJ - OTA", "INFOR", "Time Validation Tool", "UQT"].map((l) => (
            <button
              key={l}
              onClick={() => toast({ title: l, description: "Opening link" })}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left"
            >
              <span className="text-[15.5px] font-medium">{l}</span>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Safety tab ----------
function SafetyTab({ tech }: { tech: VTech }) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  return (
    <div className="px-4 pb-32">
      <div className="bg-white rounded-2xl shadow-sm divide-y divide-[#EFEFF4] overflow-hidden">
        {tech.safety.map((item) => {
          const open = openIds.has(item.id);
          const Icon = item.icon;
          return (
            <div key={item.id}>
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-center gap-3 px-3 py-3.5 text-left"
              >
                <span className="w-9 h-9 rounded-lg bg-[#E2E8F4] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#1E3A8A]" />
                </span>
                <span className="flex-1 text-[16px] font-semibold">{item.label}</span>
                <span className="px-2 py-0.5 rounded-md bg-[#FFE4E6] text-[#E5484D] text-[12px] font-bold">
                  {item.count}
                </span>
                {open ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {open && (
                <div className="bg-white">
                  {item.incidents.map((inc, i) => (
                    <div
                      key={i}
                      className={cn(
                        "px-4 py-3",
                        i > 0 && "border-t border-[#EFEFF4]",
                      )}
                    >
                      <div className="text-[15px] font-medium text-foreground">
                        {inc.time}
                      </div>
                      <div className="text-[13.5px] text-muted-foreground">
                        {inc.location}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- GPS tab ----------
function GpsTab({ tech }: { tech: VTech }) {
  const { addObservation } = useObservations();
  return (
    <div className="px-4 pb-32 space-y-4">
      <div>
        <div className="flex items-center gap-2 px-1 mb-2">
          <Sparkles className="w-4 h-4 text-foreground" fill="currentColor" />
          <h3 className="text-[17px] font-bold">GPS Insights</h3>
        </div>
        <div className="space-y-3">
          {tech.gpsInsights.map((g) => (
            <SummaryCard
              key={g.title}
              title={g.title}
              body={tpl(g.body, tech)}
              suggestion={tpl(g.suggestion, tech)}
              onAddAction={() =>
                addObservation({
                  source: "action",
                  category: (OBSERVATION_CATEGORIES as readonly string[]).includes(g.title)
                    ? (g.title as ObservationCategory)
                    : "Other",
                  text: g.suggestion,
                  isTemplate: true,
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}


// ---------- Dates phase ----------
function DatesPhase({
  tech,
  onStart,
  onBack,
}: {
  tech: VTech;
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <div className="relative h-full overflow-y-auto">

      <StatusBar />
      <div className="relative px-4 pt-2 pb-4">
        <button
          onClick={onBack}
          aria-label="Back"
          className="absolute left-4 top-2 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="h-10 flex items-center justify-center text-[17px] font-semibold">
          Dates
        </div>
      </div>

      <div className="px-4 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
          <img src={tech.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <div className="text-[17px] font-bold">{tech.name}</div>
            <div className="text-[13px] text-muted-foreground mt-0.5">
              Selected Date: {tech.dateLabel}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <button aria-label="Previous week">
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-foreground" />
              <span className="text-[16px] font-semibold">{tech.weekRange}</span>
            </div>
            <button aria-label="Next week">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {tech.weekDays.map((day) => (
              <div key={day.d} className="flex flex-col items-center gap-1.5">
                <span className="text-[13px] text-muted-foreground">{day.d}</span>
                <div
                  className={cn(
                    "w-12 h-14 rounded-2xl flex items-center justify-center text-[22px] font-bold",
                    day.selected ? "bg-black text-white" : "text-foreground",
                  )}
                >
                  {day.n}
                </div>
                {day.alerts ? (
                  <span className="w-5 h-5 rounded-full bg-[#E5484D] text-white text-[11px] font-bold flex items-center justify-center">
                    {day.alerts}
                  </span>
                ) : day.dot ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5484D]" />
                ) : (
                  <span className="w-1.5 h-1.5" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 px-1 mb-2">
            <Sparkles className="w-4 h-4 text-foreground" fill="currentColor" />
            <h3 className="text-[17px] font-bold">Suggested Days</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {tech.suggestedDays.map((d) => (
              <button
                key={d}
                className="px-4 py-2 rounded-full bg-[#E8EEF7] text-[#1E3A8A] text-[14px] font-medium whitespace-nowrap"
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <EventsGrid tech={tech} />

        <div>
          <h3 className="px-1 mb-2 text-[17px] font-bold">Flagged Jobs (3)</h3>
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-[#E8EEF7] text-[#1E3A8A] text-[12px] font-semibold">
                {tech.flaggedJob.type}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[12px] font-semibold">
                <span className="w-2 h-2 rounded-full border-2 border-emerald-600" /> {tech.flaggedJob.status}
              </span>
            </div>
            <div className="mt-2 text-[13px] text-muted-foreground">{tech.flaggedJob.date}</div>
            <div className="mt-1 text-[14px] font-semibold text-foreground/80">
              {tech.flaggedJob.address}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 mt-4 p-4 bg-gradient-to-t from-white via-white to-transparent">
        <button
          onClick={onStart}
          className="w-full h-14 rounded-full bg-[#1E3A8A] text-white text-[17px] font-semibold shadow-lg active:opacity-90"
        >
          Start Review
        </button>
      </div>
    </div>
  );
}

// ---------- Review phase ----------
type Tab = "overview" | "safety" | "gps" | "expert";

function ReviewPhase({
  tech,
  activeTab,
  setActiveTab,
  onExit,
  onComplete,
  menuOpen,
  setMenuOpen,
  hasDraft,
  onDeleteDraft,
}: {
  tech: VTech;
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  onExit: () => void;
  onComplete: () => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  hasDraft: boolean;
  onDeleteDraft: () => void;
}) {
  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "safety", label: "Safety" },
    { id: "gps", label: "GPS" },
    { id: "expert", label: "Expert Path" },
  ];
  const [typeSheet, setTypeSheet] = useState<
    null | { mode: "new" } | { mode: "edit"; id: string; text: string; category: ObservationCategory }
  >(null);
  const [reviewSheet, setReviewSheet] = useState(false);
  return (
    <div className="relative h-full overflow-y-auto">
      <StatusBar />
      <div className="relative px-4 pt-2 pb-3 flex items-center justify-between">
        <button
          onClick={onExit}
          aria-label="Close"
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-[17px] font-semibold">vRide</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="More"
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          <button
            onClick={onComplete}
            aria-label="Complete"
            className="w-10 h-10 rounded-full bg-[#1E3A8A] flex items-center justify-center"
          >
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </button>
        </div>
      </div>

      <TechHeaderCard tech={tech} />
      <DateRow tech={tech} />

      <div className="mt-3 px-4 border-b border-[#EFEFF4]">
        <div className="flex items-center gap-6 overflow-x-auto">
          {tabs.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "py-3 text-[15px] whitespace-nowrap relative",
                  active ? "text-foreground font-bold" : "text-muted-foreground font-medium",
                )}
              >
                {t.label}
                {active && (
                  <span className="absolute left-0 right-0 -bottom-px h-[3px] bg-black rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "overview" && <OverviewTab tech={tech} />}
        {activeTab === "safety" && <SafetyTab tech={tech} />}
        {activeTab === "gps" && <GpsTab tech={tech} />}
        {activeTab === "expert" && <ExpertPath />}
      </div>

      <VoiceObservationBar tech={tech} onOpenObservations={() => setReviewSheet(true)} />

      <ActionMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        hasDraft={hasDraft}
        onDeleteDraft={onDeleteDraft}
        onTypeObservation={() => setTypeSheet({ mode: "new" })}
      />

      <TypeObservationSheet
        state={typeSheet}
        tech={tech}
        onClose={() => setTypeSheet(null)}
      />

      <MyObservationsSheet
        open={reviewSheet}
        onClose={() => setReviewSheet(false)}
        tech={tech}
        onEdit={(o) => {
          setReviewSheet(false);
          setTypeSheet({ mode: "edit", id: o.id, text: o.text, category: o.category });
        }}
      />
    </div>
  );
}

// ---------- Voice observation bar ----------
type VoiceState = "idle" | "listening" | "saving";

function VoiceObservationBar({
  tech,
  onOpenObservations,
}: {
  tech: VTech;
  onOpenObservations: () => void;
}) {
  const { observations, addObservation } = useObservations();
  const count = useMemo(
    () => observations.filter((o) => o.techId === tech.id).length,
    [observations, tech.id],
  );
  const [state, setState] = useState<VoiceState>("idle");
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");
  const silenceTimerRef = useRef<number | null>(null);

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current !== null) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const finishSaving = () => {
    setState("saving");
    window.setTimeout(() => {
      const text = transcriptRef.current.trim() || "Voice note recorded";
      transcriptRef.current = "";
      addObservation({
        source: "voice",
        category: categorizeVoice(text),
        text,
      });
      setState("idle");
    }, 900);
  };

  const stopRecognition = () => {
    clearSilenceTimer();
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.onresult = null;
        rec.onend = null;
        rec.onerror = null;
        rec.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
  };

  const handleDone = () => {
    stopRecognition();
    finishSaving();
  };

  const startListening = () => {
    transcriptRef.current = "";
    const SpeechRecognition: any =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";
      rec.onresult = (e: any) => {
        let finalText = "";
        for (let i = 0; i < e.results.length; i++) {
          finalText += e.results[i][0].transcript;
        }
        transcriptRef.current = finalText;
        clearSilenceTimer();
        silenceTimerRef.current = window.setTimeout(() => {
          stopRecognition();
          finishSaving();
        }, 3000);
      };
      rec.onerror = () => {
        // ignore; user can still tap Done
      };
      rec.onend = () => {
        recognitionRef.current = null;
      };
      try {
        rec.start();
        recognitionRef.current = rec;
      } catch {
        // already started or unsupported
      }
    }
    setState("listening");
    // Safety auto-stop after 60s if no silence trigger fires.
    silenceTimerRef.current = window.setTimeout(() => {
      stopRecognition();
      finishSaving();
    }, 60000);
  };

  const handleMicTap = async () => {
    if (state !== "idle") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
    } catch {
      return; // permission denied -> do nothing
    }
    startListening();
  };

  useEffect(() => () => stopRecognition(), []);

  return (
    <>
      {/* Listening / Saving overlay */}
      {state !== "idle" && (
        <div className="absolute inset-0 bottom-0 z-30 pointer-events-none">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-5 pointer-events-auto">
            {state === "listening" ? (
              <button
                onClick={handleDone}
                className="h-12 min-w-[120px] px-8 rounded-full bg-white shadow-[0_10px_30px_rgba(30,102,245,0.35)] ring-2 ring-[#1E66F5]/30 text-[16px] font-semibold text-foreground active:opacity-80"
              >
                Done
              </button>
            ) : (
              <div className="h-12 min-w-[120px] px-8 rounded-full bg-white shadow-[0_10px_30px_rgba(30,102,245,0.35)] ring-2 ring-[#1E66F5]/30 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-[#1E66F5] animate-spin" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom observation bar */}
      <div className="sticky bottom-3 left-0 right-0 mt-4 px-4 flex items-center gap-2 z-20">
        <button
          onClick={onOpenObservations}
          className="flex-1 h-12 rounded-full bg-white shadow-md px-4 flex items-center justify-between active:opacity-70"
        >
          <span className="text-[15px] font-medium">My Observations</span>
          <span className="flex items-center gap-2">
            {count > 0 && (
              <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#E5E7EB] text-foreground text-[12px] font-semibold flex items-center justify-center">
                {count}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </span>
        </button>
        <button
          onClick={handleMicTap}
          aria-label="Voice observation"
          className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center active:opacity-70"
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}

// ---------- Type Observation sheet ----------
type TypeSheetState =
  | null
  | { mode: "new" }
  | { mode: "edit"; id: string; text: string; category: ObservationCategory };

function TypeObservationSheet({
  state,
  tech,
  onClose,
}: {
  state: TypeSheetState;
  tech: VTech;
  onClose: () => void;
}) {
  const { addObservation, updateObservation } = useObservations();
  const [text, setText] = useState("");
  const [category, setCategory] = useState<ObservationCategory>("Other");

  useEffect(() => {
    if (state?.mode === "edit") {
      setText(state.text);
      setCategory(state.category);
    } else if (state?.mode === "new") {
      setText("");
      setCategory("Other");
    }
  }, [state]);

  if (!state) return null;
  const placeholder = tpl("Add an observation about [Tech Name]…", tech);
  const isEdit = state.mode === "edit";

  const save = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (isEdit) {
      updateObservation(state.id, { text: trimmed, category });
    } else {
      addObservation({ source: "manual", category, text: trimmed });
    }
    onClose();
  };

  return (
    <>
      <button
        aria-label="Close"
        className="absolute inset-0 z-40 bg-black/40"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white p-5 pb-7 shadow-2xl">
        <div className="mx-auto w-9 h-1 rounded-full bg-muted mb-3" />
        <h3 className="text-[18px] font-bold">
          {isEdit ? "Edit Observation" : "Type Observation"}
        </h3>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Adding for {tech.name}
        </p>

        <label className="mt-3 block text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ObservationCategory)}
          className="mt-1 w-full h-11 rounded-xl bg-[#F2F3F7] px-3 text-[15px] font-medium"
        >
          {OBSERVATION_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label className="mt-3 block text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
          Observation
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          rows={5}
          autoFocus
          className="mt-1 w-full rounded-xl bg-[#F2F3F7] p-3 text-[15px] leading-snug resize-none focus:outline-none"
        />

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="h-12 rounded-full bg-[#F2F3F7] text-foreground text-[16px] font-semibold active:opacity-70"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={!text.trim()}
            className="h-12 rounded-full bg-[#1E3A8A] text-white text-[16px] font-semibold active:opacity-90 disabled:opacity-40"
          >
            {isEdit ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </>
  );
}

// ---------- My Observations sheet ----------
function MyObservationsSheet({
  open,
  onClose,
  tech,
  onEdit,
}: {
  open: boolean;
  onClose: () => void;
  tech: VTech;
  onEdit: (o: Observation) => void;
}) {
  const { observations } = useObservations();
  const list = useMemo(
    () => observations.filter((o) => o.techId === tech.id),
    [observations, tech.id],
  );
  if (!open) return null;

  const fmtTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <>
      <button
        aria-label="Close"
        className="absolute inset-0 z-40 bg-black/40"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 top-12 z-50 rounded-t-3xl bg-[#F2F3F7] flex flex-col shadow-2xl">
        <div className="mx-auto w-9 h-1 rounded-full bg-muted mt-2" />
        <div className="px-5 pt-3 pb-2 flex items-center justify-between">
          <div>
            <h3 className="text-[20px] font-bold">My Observations</h3>
            <p className="text-[13px] text-muted-foreground">
              {tech.name} · {list.length} {list.length === 1 ? "entry" : "entries"}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
          {list.length === 0 ? (
            <div className="mt-12 text-center text-[14px] text-muted-foreground px-6">
              No observations yet. Tap the mic or use Type Observation to add one.
            </div>
          ) : (
            list.map((o) => {
              const SourceIcon =
                o.source === "voice" ? Mic : o.source === "manual" ? Keyboard : Sparkles;
              const body = o.isTemplate ? tpl(o.text, tech) : o.text;
              return (
                <div key={o.id} className="bg-white rounded-2xl shadow-sm p-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#E2E8F4] flex items-center justify-center shrink-0">
                      <SourceIcon className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F2F3F7] text-[11px] font-semibold text-foreground">
                      {o.category}
                    </span>
                    <span className="ml-auto text-[11px] text-muted-foreground">
                      {fmtTime(o.createdAt)}
                    </span>
                    <button
                      onClick={() => onEdit(o)}
                      aria-label="Edit observation"
                      className="w-7 h-7 rounded-full bg-[#F2F3F7] flex items-center justify-center active:opacity-70"
                    >
                      <Pencil className="w-3.5 h-3.5 text-foreground" />
                    </button>
                  </div>
                  <p className="mt-2 text-[14px] leading-snug text-foreground whitespace-pre-wrap">
                    {body}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}


// ---------- Top-level ----------
function ObservationsProvider({ children }: { children: React.ReactNode }) {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [toastOpen, setToastOpen] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  const fireToast = () => {
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    setToastOpen(true);
    toastTimerRef.current = window.setTimeout(() => setToastOpen(false), 2500);
  };

  const addObservation: ObservationsCtx["addObservation"] = (o) => {
    const [params] = [new URLSearchParams(window.location.search)];
    const techId = params.get("techId") ?? "unknown";
    const entry: Observation = {
      id: `obs-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
      techId,
      ...o,
    };
    setObservations((prev) => [...prev, entry]);
    fireToast();
  };

  const updateObservation: ObservationsCtx["updateObservation"] = (id, patch) => {
    setObservations((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...patch, isTemplate: false } : o)),
    );
    fireToast();
  };

  useEffect(
    () => () => {
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    },
    [],
  );

  return (
    <ObservationsContext.Provider value={{ observations, addObservation, updateObservation }}>
      {children}
      {toastOpen && (
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-24 z-[60] w-[88%] animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1F2937] text-white shadow-xl">
            <span className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </span>
            <div className="min-w-0">
              <div className="text-[15px] font-bold leading-tight">Observation Added</div>
              <div className="text-[13px] text-white/85 leading-tight mt-0.5">
                Saved to review
              </div>
            </div>
          </div>
        </div>
      )}
    </ObservationsContext.Provider>
  );
}

// ---------- Top-level ----------
export default function VRide() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const techId = params.get("techId");
  const tech = useMemo(() => getTech(techId), [techId]);

  const [phase, setPhase] = useState<"dates" | "review">("dates");
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasDraft, setHasDraft] = useState(true);
  const [exitOpen, setExitOpen] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/team";

  // Browser back interception
  const installedRef = useRef(false);
  useEffect(() => {
    if (installedRef.current) return;
    installedRef.current = true;
    window.history.pushState({ vride: true }, "");
    const onPop = () => {
      // re-push so we stay on /vride until user confirms
      window.history.pushState({ vride: true }, "");
      setExitOpen(true);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const handleExit = () => setExitOpen(true);
  const handleConfirmExit = () => {
    setExitOpen(false);
    navigate(from);
  };

  return (
    <div
      data-view-name="VRide"
      className="min-h-screen w-full flex justify-center bg-[#0a0a0c] py-6"
    >
      <div
        className="relative w-[393px] max-w-full bg-[#F2F3F7] rounded-[44px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-white/5"
        style={{ minHeight: 844 }}
      >
        <div className="relative h-[852px] overflow-hidden">
          <ObservationsProvider>
            {phase === "dates" ? (
              <DatesPhase
                tech={tech}
                onStart={() => setPhase("review")}
                onBack={handleExit}
              />
            ) : (
              <ReviewPhase
                tech={tech}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onExit={handleExit}
                onComplete={() => {
                  toast({ title: "Review submitted", description: `${tech.name} vRide saved` });
                  navigate(from);
                }}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                hasDraft={hasDraft}
                onDeleteDraft={() => {
                  setHasDraft(false);
                  toast({ title: "Draft deleted" });
                }}
              />
            )}

            <ExitDialog
              open={exitOpen}
              onCancel={() => setExitOpen(false)}
              onDelete={handleConfirmExit}
            />
          </ObservationsProvider>
        </div>
      </div>
    </div>
  );
}
