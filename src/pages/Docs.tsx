
import { useGuardedNavigate } from "@/lib/routes";
import { ChevronRight, CheckCircle2, AlertCircle, Wifi, Calendar, Flag, CloudSun, Navigation, AlertTriangle } from "lucide-react";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { TeamHeader } from "@/components/layout/TeamHeader";

import { cn } from "@/lib/utils";
import lucasBrooksAvatar from "@/assets/lucas-brooks-avatar.png";
import { VRIDE_QUEUE } from "@/data/vrideQueue";
import { avatar } from "@/assets/avatars";



const visits = [
  {
    id: "ignacio",
    name: "Ignacio Ibarra",
    ban: "482910",
    date: "Feb 2, 2026",
    dateTone: "success" as const,
    pill: "Live Visit",
    pillFilled: true,
    avatar: avatar(12),
  },
  {
    id: "juan",
    name: "Juan Benni",
    ban: "14423456789",
    date: "Apr 4, 2026",
    dateTone: "warning" as const,
    pill: "Post Visit",
    pillFilled: false,
    avatar: avatar(14),
  },
];

const coaching = [
  { id: 1, name: "Ethan Hawkthorn", date: "Apr 7, 2026", status: "complete" as const, avatar: avatar(22) },
  { id: 2, name: "Lucas Brooks", date: "Apr 6, 2026", status: "incomplete" as const, avatar: lucasBrooksAvatar },
  { id: 3, name: "Dwayne Dwyer", date: "Apr 4, 2026", status: "complete" as const, avatar: avatar(53) },
];

const growth = [
  { id: 1, name: "Stephan Osco", date: "Apr 6, 2026", badge: "Improve", tone: "warning" as const, count: 2, avatar: avatar(15) },
  { id: 2, name: "Peter Angelakos", date: "Apr 4, 2026", badge: "Action", tone: "success" as const, count: 1, avatar: avatar(23) },
  { id: 3, name: "Dwayne Dwyer", date: "Apr 4, 2026", badge: "Corrective", tone: "danger" as const, count: 3, avatar: avatar(53) },
];

const competencies = [
  {
    id: "defensive",
    name: "Defensive Driving",
    icon: Wifi,
    badge: "2 Past Due",
    badgeTone: "danger" as const,
    progress: 0.55,
    barColor: "bg-destructive",
    todos: 2,
    techs: "11 of 13",
  },
  {
    id: "trailer",
    name: "Trailer Towing",
    icon: Calendar,
    badge: "Due April",
    badgeTone: "muted" as const,
    progress: 0.7,
    barColor: "bg-primary",
    todos: 2,
    techs: "9 of 11",
  },
  {
    id: "cushion",
    name: "Space Cushion",
    icon: Flag,
    badge: "Due June",
    badgeTone: "muted" as const,
    progress: 1,
    barColor: "bg-success",
    todos: 0,
    techs: "12 of 12",
  },
  {
    id: "predrive",
    name: "Pre-Drive Checks",
    icon: CloudSun,
    badge: "Due July",
    badgeTone: "muted" as const,
    progress: 0.08,
    barColor: "bg-warning",
    todos: 11,
    techs: "1 of 12",
  },
];

const SectionHeading = ({ title }: { title: string }) => (
  <button className="flex items-center gap-1 mb-3 px-1">
    <h2 className="text-[22px] font-bold tracking-tight text-foreground">{title}</h2>
    <ChevronRight className="w-5 h-5 text-foreground" strokeWidth={2.5} />
  </button>
);

const Docs = () => {
  const navigate = useGuardedNavigate();

  return (
    <div data-view-name="Docs" className="min-h-screen w-full flex justify-center bg-[#0a0a0c] py-6">
      <div
        className="relative w-[393px] max-w-full bg-[#F2F2F6] rounded-[44px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-white/5"
        style={{ minHeight: 844 }}
      >
        <main className="relative h-[852px] overflow-y-auto no-scrollbar pb-28 bg-[#F2F2F6]">
          <StatusBar />

          <TeamHeader title="Team" active="Docs" />


          {/* Visits */}
          <section className="pl-4 mb-6">
            <SectionHeading title="Visits" />
            <div className="flex gap-3 overflow-x-auto no-scrollbar pr-4">
              {visits.map((v) => (
                <button
                  key={v.id}
                  onClick={() => navigate(`/visits/${v.id}`)}
                  className="shrink-0 w-[280px] text-left rounded-[20px] bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <img src={v.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-[12px] font-semibold",
                        v.dateTone === "success" ? "bg-success/15 text-success" : "bg-warning/15 text-warning",
                      )}
                    >
                      {v.dateTone === "success" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      {v.date}
                    </span>
                  </div>
                  <div className="mt-3 text-[17px] font-bold text-foreground">{v.name}</div>
                  <div className="text-[13px] text-muted-foreground mt-0.5">BAN: {v.ban}</div>
                  <div className="mt-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-pill px-3 py-1 text-[12px] font-semibold",
                        v.pillFilled
                          ? "bg-[#0b1f3a] text-white"
                          : "bg-card border border-border text-foreground",
                      )}
                    >
                      {v.pill}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Competencies */}
          <section className="px-4 mb-6">
            <div className="flex items-center justify-between mb-2 px-1">
              <h2 className="text-[17px] font-bold tracking-tight text-foreground">Competencies</h2>
              <button
                onClick={() => navigate("/competencies")}
                className="flex items-center gap-0.5 text-[13px] font-semibold text-primary"
              >
                See Details
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            </div>
            <div className="rounded-[16px] bg-card shadow-sm divide-y divide-separator">
              {competencies.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.id} className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="w-4 h-4 text-foreground shrink-0" strokeWidth={2.2} />
                        <span className="text-[13px] font-bold text-foreground truncate">{c.name}</span>
                      </div>
                      {c.badgeTone === "danger" ? (
                        <span className="shrink-0 inline-flex items-center rounded-pill px-2 py-0.5 text-[11px] font-semibold bg-[hsl(4_85%_88%)] text-[hsl(0_70%_35%)]">
                          {c.badge}
                        </span>
                      ) : (
                        <span className="shrink-0 text-[11px] text-muted-foreground font-medium">{c.badge}</span>
                      )}
                    </div>
                    <div className="mt-2 h-1 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", c.barColor)}
                        style={{ width: `${Math.round(c.progress * 100)}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{c.todos} TO-DOs</span>
                      <span>{c.techs} Techs</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Coaching */}
          <section className="px-4 mb-6">
            <SectionHeading title="Coaching" />
            <div className="rounded-[20px] bg-card shadow-sm divide-y divide-separator">
              {coaching.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-4">
                  <img src={c.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-foreground truncate">{c.name}</div>
                    {c.status === "complete" ? (
                      <div className="flex items-center gap-1 mt-0.5 text-[13px] text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                        {c.date}
                      </div>
                    ) : (
                      <>
                        <div className="text-[13px] text-muted-foreground mt-0.5">{c.date}</div>
                        <span className="mt-1.5 inline-flex items-center gap-1 rounded-pill bg-warning/15 text-warning px-2 py-0.5 text-[11px] font-semibold">
                          <AlertCircle className="w-3 h-3" />
                          Incomplete
                        </span>
                      </>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          </section>

          {/* Growth Plans */}
          <section className="px-4 mb-6">
            <SectionHeading title="Growth Plans" />
            <div className="rounded-[20px] bg-card shadow-sm divide-y divide-separator">
              {growth.map((g) => (
                <div key={g.id} className="flex items-center gap-3 p-4">
                  <img src={g.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-foreground truncate">{g.name}</div>
                    <div className="text-[13px] text-muted-foreground mt-0.5">{g.date}</div>
                    <span
                      className={cn(
                        "mt-1.5 inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[11px] font-semibold",
                        g.tone === "warning" && "bg-warning/15 text-warning",
                        g.tone === "success" && "bg-success/15 text-success",
                        g.tone === "danger" && "bg-destructive/15 text-destructive",
                      )}
                    >
                      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-current/20 text-[9px] font-bold">
                        {g.count}
                      </span>
                      {g.badge}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          </section>

          {/* vRide */}
          <section className="px-4 mb-6">
            <SectionHeading title="vRide" />
            <div className="rounded-[20px] bg-card shadow-sm divide-y divide-separator">
              {VRIDE_QUEUE.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => navigate(`/vride?techId=${t.id}`, { state: { from: "/team" } })}
                  className="w-full flex items-center gap-3 p-4 text-left active:opacity-70"
                >
                  <img src={t.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-foreground truncate">{t.name}</div>
                    <span
                      className={cn(
                        "mt-1.5 inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[11px] font-semibold",
                        t.tone === "neutral" && "bg-muted text-foreground/70",
                        t.tone === "danger" && "bg-destructive/15 text-destructive",
                      )}
                    >
                      {t.tone === "danger" ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : (
                        <Navigation className="w-3 h-3" />
                      )}
                      {t.chip}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default Docs;
