import { avatar } from "@/assets/avatars";
export const hero = {
  greeting: "Good Morning,",
  name: "Alexander",
  tempF: 80,
  bg: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80",
};

export const recommendedVisits = [
  {
    id: 1,
    customer: "Jordan M.",
    address: "1241 Peachtree St NE",
    etaMin: 9,
    avatar: avatar(12),
    chips: ["Visit Due", "Quality", "Harsh Braking"],
  },
  {
    id: 2,
    customer: "Priya S.",
    address: "88 Edgewood Ave",
    etaMin: 14,
    avatar: avatar(32),
    chips: ["Install", "VIP"],
  },
];

export const whatsNew = [
  {
    id: 1,
    date: "Apr 14, 2026",
    title: "New routing engine rolls out to all AFO regions",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    date: "Apr 10, 2026",
    title: "Coaching templates updated for Q2",
    image:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=900&q=80",
  },
];

export const jobs = {
  total: 14,
  dispatched: 12,
  atnd: 2,
  stats: [
    { label: "Per Tech", value: "3.2" },
    { label: "Assigned", value: "11" },
    { label: "Pending", value: "3" },
    { label: "Completed", value: "27" },
    { label: "Cancelled", value: "2" },
    { label: "Returned", value: "1" },
  ],
};

export const celebrations = [
  { id: 1, name: "Marcus Lee", date: "Birthday · Apr 18", avatar: avatar(58), kind: "birthday" as const },
  { id: 2, name: "Dana Ortiz", date: "5 yr Anniversary · Apr 20", avatar: avatar(60), kind: "anniversary" as const },
];

export const recognition = [
  { id: 1, name: "Priya S.", avatar: avatar(32), reactions: 5 },
  { id: 2, name: "Jamal K.", avatar: avatar(8), reactions: 3 },
  { id: 3, name: "Lin W.", avatar: avatar(9), reactions: 7 },
  { id: 4, name: "Rae P.", avatar: avatar(10), reactions: 2 },
];

export const dispatched = [
  {
    id: 1,
    name: "Carlos Rivera",
    avatar: avatar(7),
    pills: ["Repair", "RG"],
    distance: "2.4 mi",
    time: "Dispatched 8:42 AM",
    progress: 0.62,
    over: false,
  },
  {
    id: 2,
    name: "Alyssa Brooks",
    avatar: avatar(5),
    pills: ["Install", "RG"],
    distance: "5.1 mi",
    time: "Dispatched 8:10 AM",
    progress: 0.45,
    over: false,
  },
  {
    id: 3,
    name: "Devon Hayes",
    avatar: avatar(3),
    pills: ["Repair", "RG"],
    distance: "1.2 mi",
    time: "Dispatched 7:30 AM (24 min over)",
    progress: 1,
    over: true,
  },
];

export const performance = [
  { id: 1, label: "AIQ", value: 82, delta: +10, trend: "up" as const, points: [40, 45, 50, 48, 60, 65, 72, 80, 78, 82] },
  { id: 2, label: "Efficiency", value: 84, delta: -3.6, trend: "down" as const, points: [92, 90, 88, 89, 87, 86, 85, 86, 85, 84] },
  { id: 3, label: "DCR Attainment", value: 95, delta: +4, trend: "up" as const, points: [80, 82, 84, 86, 88, 89, 91, 92, 93, 95] },
];

export const fieldVisits = { inProgress: 6, past: 21, target: 30 };

export const timeReporting = { hoursLeft: 3.5, alerts: 2 };

export const teamSchedule = {
  am: { count: 8, label: "AM Shift" },
  pm: { count: 6, label: "PM Shift" },
  slots: [
    { name: "C. Rivera", time: "7–3" },
    { name: "A. Brooks", time: "7–3" },
    { name: "D. Hayes", time: "7–3" },
    { name: "L. Wong", time: "11–7" },
    { name: "R. Park", time: "11–7" },
    { name: "M. Lee", time: "11–7" },
  ],
};

export const growthPlans = [
  { label: "Action", count: 4 },
  { label: "Improve", count: 2 },
  { label: "Corrective", count: 1 },
];

export const coaching = [
  { label: "Performance", count: 3 },
  { label: "Attendance", count: 1 },
  { label: "Quality", count: 2 },
  { label: "Safety", count: 0 },
  { label: "Conduct", count: 1 },
  { label: "Other", count: 0 },
];

export const training = { team: 65, mine: 25 };

export const gpsAlerts = { issues: 2, speeding: 1, idling: 4 };

export const voc = { positive: 42, neutral: 8, negative: 3 };
