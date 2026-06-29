import elliottCovingtonAvatar from "@/assets/elliott-covington-avatar.png";
import lucasBrooksAvatar from "@/assets/lucas-brooks-avatar.png";
import { avatar } from "@/assets/avatars";

export type TechJobStatus = "Dispatched" | "Assigned" | "Cancelled" | "Returned";
export type TechJobType = "Install" | "Repair" | "Decom";

export type ActivityStep = {
  label: string;
  time?: string;
  state: "done" | "active" | "pending";
};

export type ScheduledJob = {
  id: string;
  jobType: TechJobType;
  service: string;
  status: TechJobStatus | "Closed";
  ban: string;
  jobId: string;
  window: string;
  address: string;
};

export type CurrentJob = {
  status: TechJobStatus;
  statusLabel?: string; // override default status pill text
  jobType: TechJobType;
  service: string; // e.g. "FTTP-GPON"
  ban: string;
  jobId?: string;
  address: string; // may include \n
  dispatchedTime?: string; // "9:06 AM"
  startedTime?: string; // "Started 8:34 AM"
  durationMin?: number;
  estMin?: number;
  lastUpdate?: string; // "Jun 02 · 6:45 PM"
  appointmentWindow?: string;
  rgActive?: boolean;
  presence?: string; // "En Route" | "Driving" | "Onsite"
  distanceFromJob?: string; // "3.5 mi from job"
  etaMin?: number;
  recommendedChips?: string[];
  activity?: ActivityStep[];
  upcomingJobs?: ScheduledJob[];
  pastJobs?: ScheduledJob[];
};

export type TechRecord = {
  id: string;
  name: string;
  initials: string;
  avatarUrl: string | null;
  avatarBg?: string; // tailwind/HSL fallback bg for initials
  alert?: { code: string; hours: string; date: string };
  recognition: { code: string; title: string; date: string; tone: string }[];
  anniversary?: { date: string; label: string };
  currentJob?: CurrentJob;
  emptyJobMessage?: string; // shown in place of Current Job when no job
  completionRate: number; // percent
  time: {
    yesterdayOutOfGate: string;
    yesterdayAtnd: string;
    weekOutOfGatePct: string;
    weekAtnd: string;
  };
  docs: { label: string; sub: string; count: number; color: string; complete?: boolean }[];
  tasks: { label: string; due: string; count: number; pct: number; tone: string }[];
  voc: { happy: number; neutral: number; sad: number };
};

const DEFAULT_RECOGNITION = [
  { code: "EQR", title: "20 TRUE Test Streak", date: "MAY 2", tone: "bg-[hsl(170,65%,92%)] text-[hsl(170,80%,30%)]" },
  { code: "EQ", title: "L3 Pro - Fiber", date: "MAY 2", tone: "bg-[hsl(35,90%,92%)] text-[hsl(28,80%,40%)]" },
  { code: "AC", title: "Lorem Dolor", date: "MAY 2", tone: "bg-[hsl(45,90%,92%)] text-[hsl(40,80%,40%)]" },
];

const DEFAULT_DOCS = [
  { label: "Safety", sub: "Unannounced", count: 1, color: "hsl(170,80%,55%)", complete: false },
  { label: "Safety", sub: "Competency", count: 0, color: "hsl(0,0%,55%)", complete: true },
  { label: "Quality", sub: "", count: 1, color: "hsl(260,70%,60%)", complete: false },
  { label: "MAC", sub: "", count: 1, color: "hsl(95,65%,55%)", complete: false },
];

const DEFAULT_TASKS = [
  { label: "Training", due: "JUN 1", count: 10, pct: 45, tone: "hsl(170,80%,55%)" },
  { label: "Action Items", due: "MAY 30", count: 2, pct: 70, tone: "hsl(170,80%,55%)" },
  { label: "Safety Checklist", due: "TODAY", count: 1, pct: 85, tone: "hsl(170,80%,55%)" },
];

const DEFAULT_TIME = {
  yesterdayOutOfGate: "8:45 AM",
  yesterdayAtnd: "1 hr",
  weekOutOfGatePct: "85%",
  weekAtnd: "5 hrs",
};

export const TECHS: Record<string, TechRecord> = {
  "tech-1": {
    id: "tech-1",
    name: "Gabriel Sinclair",
    initials: "GS",
    avatarUrl: avatar(12),
    alert: { code: "ATND", hours: "5.5 hours", date: "07/07/25" },
    recognition: DEFAULT_RECOGNITION,
    anniversary: { date: "Oct 5", label: "25th Anniversary" },
    currentJob: {
      status: "Dispatched",
      jobType: "Install",
      service: "FTTP-GPON",
      ban: "14423456789",
      jobId: "98765432109",
      address: "8600 W Oakland Park Blvd\nSunrise, FL 33567-7341",
      dispatchedTime: "9:06 AM",
      durationMin: 45,
      estMin: 150,
      lastUpdate: "Jun 02 · 6:45 PM",
      appointmentWindow: "8:00 AM - 10:30 AM",
      rgActive: true,
      presence: "En Route",
      distanceFromJob: "3.5 mi from job",
      etaMin: 9,
      recommendedChips: ["Visit Due", "Quality", "Harsh Braking"],
      activity: [
        { label: "Dispatched", time: "8:05 AM", state: "done" },
        { label: "En Route", time: "8:05 AM", state: "done" },
        { label: "Arrived On-Site", time: "8:20 AM", state: "done" },
        { label: "Pre-Job Walkthrough", time: "8:25 AM", state: "done" },
        { label: "Install", time: "In progress", state: "active" },
        { label: "Speed & Signal Test", state: "pending" },
        { label: "Customer Sign-Off", state: "pending" },
        { label: "Job Closed", state: "pending" },
      ],
      upcomingJobs: [
        {
          id: "u1",
          jobType: "Install",
          service: "FTTP-GPON",
          status: "Assigned",
          ban: "14423456789",
          jobId: "14423456789",
          window: "2:00 PM - 4:30 PM",
          address: "8600 W Oakland Park Blvd\nSunrise, FL 33567-7341",
        },
      ],
      pastJobs: [
        {
          id: "p1",
          jobType: "Install",
          service: "FTTP-GPON",
          status: "Closed",
          ban: "14423456789",
          jobId: "14423456789",
          window: "2:00 PM - 4:30 PM",
          address: "8600 W Oakland Park Blvd\nSunrise, FL 33567-7341",
        },
      ],
    },
    completionRate: 87.7,
    time: DEFAULT_TIME,
    docs: DEFAULT_DOCS,
    tasks: DEFAULT_TASKS,
    voc: { happy: 10, neutral: 3, sad: 1 },
  },
  "tech-2": {
    id: "tech-2",
    name: "Lucas Brooks",
    initials: "LB",
    avatarUrl: lucasBrooksAvatar,
    recognition: DEFAULT_RECOGNITION,
    anniversary: { date: "Mar 14", label: "8th Anniversary" },
    currentJob: {
      status: "Dispatched",
      jobType: "Install",
      service: "FTTP-GPON",
      ban: "14423456789",
      address: "4571 NW 103rd Ave\nSunrise, FL 33351-6118",
      dispatchedTime: "9:20 AM",
      durationMin: 45,
      estMin: 150,
      lastUpdate: "Today · 9:49 AM",
    },
    completionRate: 92.1,
    time: { yesterdayOutOfGate: "8:02 AM", yesterdayAtnd: "0 hr", weekOutOfGatePct: "96%", weekAtnd: "1 hr" },
    docs: DEFAULT_DOCS,
    tasks: DEFAULT_TASKS,
    voc: { happy: 14, neutral: 1, sad: 0 },
  },
  "tech-3": {
    id: "tech-3",
    name: "Juan Benni",
    initials: "JB",
    avatarUrl: avatar(14),
    recognition: DEFAULT_RECOGNITION,
    currentJob: {
      status: "Dispatched",
      jobType: "Repair",
      service: "FTTP-GPON",
      ban: "14423456789",
      address: "2710 Sunset Strip\nSunrise, FL 33313-1624",
      startedTime: "Started 8:34 AM",
      durationMin: 90,
      estMin: 150,
      lastUpdate: "Today · 10:04 AM",
    },
    completionRate: 81.4,
    time: { yesterdayOutOfGate: "8:30 AM", yesterdayAtnd: "0.5 hr", weekOutOfGatePct: "88%", weekAtnd: "2 hrs" },
    docs: DEFAULT_DOCS,
    tasks: DEFAULT_TASKS,
    voc: { happy: 8, neutral: 4, sad: 2 },
  },
  "tech-4": {
    id: "tech-4",
    name: "Ava Whitaker",
    initials: "AW",
    avatarUrl: avatar(47),
    recognition: DEFAULT_RECOGNITION,
    anniversary: { date: "Jul 22", label: "3rd Anniversary" },
    currentJob: {
      status: "Assigned",
      jobType: "Install",
      service: "FTTP-GPON",
      ban: "14423456789",
      address: "6904 Springtree Lakes Dr\nSunrise, FL 33351-7426",
      lastUpdate: "Assigned · 8:55 AM",
    },
    completionRate: 89.0,
    time: { yesterdayOutOfGate: "8:10 AM", yesterdayAtnd: "0 hr", weekOutOfGatePct: "94%", weekAtnd: "0 hrs" },
    docs: DEFAULT_DOCS,
    tasks: DEFAULT_TASKS,
    voc: { happy: 11, neutral: 2, sad: 0 },
  },
  "tech-5": {
    id: "tech-5",
    name: "Stephan Osco",
    initials: "SO",
    avatarUrl: avatar(15),
    alert: { code: "ATND", hours: "2 hours", date: "07/06/25" },
    recognition: DEFAULT_RECOGNITION,
    currentJob: {
      status: "Cancelled",
      jobType: "Repair",
      service: "FTTP-GPON",
      ban: "14423456789",
      address: "3395 NW 94th Way\nSunrise, FL 33351-2907",
      lastUpdate: "Cancelled · 9:12 AM",
    },
    completionRate: 76.5,
    time: { yesterdayOutOfGate: "9:05 AM", yesterdayAtnd: "2 hrs", weekOutOfGatePct: "72%", weekAtnd: "7 hrs" },
    docs: DEFAULT_DOCS,
    tasks: DEFAULT_TASKS,
    voc: { happy: 6, neutral: 3, sad: 3 },
  },
  "tech-6": {
    id: "tech-6",
    name: "Elliot Covington",
    initials: "EC",
    avatarUrl: elliottCovingtonAvatar,
    recognition: DEFAULT_RECOGNITION,
    currentJob: {
      status: "Returned",
      statusLabel: "Returned a job today",
      jobType: "Install",
      service: "FTTP-GPON",
      ban: "14423456789",
      address: "10021 W Oakland Park Blvd\nSunrise, FL 33351-6912",
      lastUpdate: "Returned · 10:42 AM",
    },
    completionRate: 79.3,
    time: { yesterdayOutOfGate: "8:20 AM", yesterdayAtnd: "0.5 hr", weekOutOfGatePct: "90%", weekAtnd: "3 hrs" },
    docs: DEFAULT_DOCS,
    tasks: DEFAULT_TASKS,
    voc: { happy: 9, neutral: 4, sad: 2 },
  },
  "av-1": {
    id: "av-1",
    name: "Ignacio Ibarra",
    initials: "II",
    avatarUrl: avatar(11),
    recognition: DEFAULT_RECOGNITION,
    emptyJobMessage: "No Assigned Jobs",
    completionRate: 84.2,
    time: DEFAULT_TIME,
    docs: DEFAULT_DOCS,
    tasks: DEFAULT_TASKS,
    voc: { happy: 7, neutral: 2, sad: 1 },
  },
  "av-2": {
    id: "av-2",
    name: "Tim Johnson",
    initials: "TJ",
    avatarUrl: avatar(68),
    recognition: DEFAULT_RECOGNITION,
    emptyJobMessage: "No Assigned Jobs",
    completionRate: 88.6,
    time: DEFAULT_TIME,
    docs: DEFAULT_DOCS,
    tasks: DEFAULT_TASKS,
    voc: { happy: 12, neutral: 1, sad: 0 },
  },
  "off-1": {
    id: "off-1",
    name: "Marcus Reed",
    initials: "MR",
    avatarUrl: avatar(52),
    recognition: DEFAULT_RECOGNITION,
    emptyJobMessage: "Vacation · Returns Feb 6",
    completionRate: 90.4,
    time: DEFAULT_TIME,
    docs: DEFAULT_DOCS,
    tasks: DEFAULT_TASKS,
    voc: { happy: 9, neutral: 2, sad: 1 },
  },
  "off-2": {
    id: "off-2",
    name: "Ethan Hawkthorn",
    initials: "EH",
    avatarUrl: avatar(22),
    recognition: DEFAULT_RECOGNITION,
    emptyJobMessage: "Disability",
    completionRate: 85.0,
    time: DEFAULT_TIME,
    docs: DEFAULT_DOCS,
    tasks: DEFAULT_TASKS,
    voc: { happy: 8, neutral: 2, sad: 1 },
  },
};

const FALLBACK: TechRecord = {
  id: "unknown",
  name: "Technician",
  initials: "T",
  avatarUrl: null,
  recognition: DEFAULT_RECOGNITION,
  completionRate: 0,
  time: DEFAULT_TIME,
  docs: DEFAULT_DOCS,
  tasks: DEFAULT_TASKS,
  voc: { happy: 0, neutral: 0, sad: 0 },
};

export function getTech(id: string | undefined): TechRecord {
  if (!id) return FALLBACK;
  return TECHS[id] ?? { ...FALLBACK, id, name: id };
}

export const STATUS_BORDER: Record<TechJobStatus, string> = {
  Dispatched: "border-success",
  Assigned: "border-primary",
  Cancelled: "border-warning",
  Returned: "border-destructive",
};

export const STATUS_DOT: Record<TechJobStatus, string> = {
  Dispatched: "bg-success",
  Assigned: "bg-primary",
  Cancelled: "bg-warning",
  Returned: "bg-destructive",
};
