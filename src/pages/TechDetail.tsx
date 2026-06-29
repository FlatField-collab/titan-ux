import { useParams } from "react-router-dom";
import { useGuardedNavigate } from "@/lib/routes";
import {
  ChevronRight,
  Navigation,
  MessageSquare,
  Megaphone,
  Clock,
  Trophy,
  MoreHorizontal,
  Wifi,
  CheckCircle2,
  Sparkles,
  History,
  Smile,
  Meh,
  Frown,
} from "lucide-react";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { BackButton } from "@/components/dashboard/BackButton";
import { cn } from "@/lib/utils";
import { getTech, STATUS_BORDER, STATUS_DOT } from "@/lib/techData";

const TABS = ["Overview", "Performance", "Visits", "Vehicle"] as const;


const Donut = ({
  value,
  color,
  complete,
}: {
  value: number;
  color: string;
  complete?: boolean;
}) => {
  const r = 38;
  const c = 2 * Math.PI * r;
  const filled = complete ? c : (Math.max(0, Math.min(value, 5)) / 5) * c;
  return (
    <div className="relative w-[92px] h-[92px]">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[26px] font-bold leading-none">{value}</div>
        <div className="text-[9px] text-white/60 mt-0.5">Left to-do</div>
      </div>
      {complete ? (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-success flex items-center justify-center border-2 border-[hsl(var(--card-dark))]">
          <CheckCircle2 className="w-3 h-3 text-white" />
        </div>
      ) : null}
    </div>
  );
};

const TaskRow = ({
  label,
  due,
  count,
  pct,
  tone,
}: {
  label: string;
  due: string;
  count: number;
  pct: number;
  tone: string;
}) => (
  <div>
    <div className="flex items-center gap-2">
      <div className="flex-1 text-[14px] font-medium">{label}</div>
      <span className="rounded-pill bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70">
        {due}
      </span>
      <div className="w-12 text-right">
        <span className="text-[16px] font-bold">{count}</span>
        <span className="text-[10px] text-white/60 ml-1">Left</span>
      </div>
    </div>
    <div className="mt-1.5 h-1 rounded-pill bg-white/10 overflow-hidden">
      <div className="h-full rounded-pill" style={{ width: `${pct}%`, backgroundColor: tone }} />
    </div>
  </div>
);

const WEEK = [
  { d: "S", n: 30, muted: true },
  { d: "M", n: 31, muted: true },
  { d: "T", n: 1 },
  { d: "W", n: 2, marked: true },
  { d: "TH", n: 3, marked: true },
  { d: "F", n: 4 },
  { d: "S", n: 5 },
];

const TechDetail = () => {
  const navigate = useGuardedNavigate();
  const { id } = useParams<{ id: string }>();
  const tech = getTech(id);
  const techId = id ?? tech.id;
  const { name, initials, avatarUrl, currentJob } = tech;


  return (
    <div data-view-name="Tech Detail" className="min-h-screen w-full flex justify-center bg-[#0a0a0c] py-6">
      <div
        className="relative w-[393px] max-w-full bg-background rounded-[44px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-white/5"
        style={{ minHeight: 844 }}
      >
        <main className="relative h-[852px] overflow-y-auto no-scrollbar pb-28 bg-background">
          <StatusBar />

          <div className="px-4 pt-2"><BackButton /></div>

          {/* Profile header */}
          <section className="px-4 pt-3">
            <button
              type="button"
              className="flex items-center gap-3 w-full text-left"
              onClick={() => {}}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-10 h-10 rounded-full object-cover bg-muted"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[hsl(28,70%,55%)] flex items-center justify-center text-white text-[13px] font-semibold">
                  {initials}
                </div>
              )}
              <div className="flex-1 flex items-center gap-1">
                <span className="text-[17px] font-semibold">{name}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <button
                type="button"
                onClick={() => navigate(`/tech/${techId}/visit`)}
                className="flex flex-col items-center justify-center gap-1 h-16 rounded-tile bg-[#0b1f3a] text-white"
              >
                <Navigation className="w-5 h-5" />
                <span className="text-[12px] font-semibold">Visit</span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-1 h-16 rounded-tile bg-card border border-border text-foreground"
              >
                <MessageSquare className="w-5 h-5 text-primary" />
                <span className="text-[12px] font-semibold">Contact</span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-1 h-16 rounded-tile bg-card border border-border text-foreground"
              >
                <Megaphone className="w-5 h-5 text-primary" />
                <span className="text-[12px] font-semibold">Coaching</span>
              </button>
            </div>
          </section>

          {/* Alert banner */}
          {tech.alert && (
            <section className="px-4 mt-3">
              <div className="rounded-tile bg-card shadow-sm flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-destructive/15 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-destructive" />
                </div>
                <div className="flex-1">
                  <div className="text-[15px] font-bold">{tech.alert.code}</div>
                  <div className="text-[12px] text-muted-foreground">{tech.alert.hours} on {tech.alert.date}</div>
                </div>
                <button type="button" className="text-primary text-[14px] font-semibold">
                  Resolve
                </button>
              </div>
            </section>
          )}


          {/* Tabs */}
          <section className="px-4 mt-4">
            <div className="flex items-center gap-5 border-b border-border">
              {TABS.map((t) => {
                const active = t === "Overview";
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      if (t === "Vehicle") navigate(`/tech/${techId}/vehicle`);
                      else if (t === "Visits") navigate(`/visits?tech=${techId}`);
                    }}
                    className={cn(
                      "relative pb-2 text-[14px] font-medium transition",
                      active ? "text-foreground font-semibold" : "text-muted-foreground",
                    )}
                  >
                    {t}
                    {active ? (
                      <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-foreground rounded-full" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Recognition */}
          <section className="px-4 mt-4">
            <div className="flex items-center justify-between px-1 mb-2">
              <h2 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Recognition
              </h2>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
              {tech.recognition.map((r, i) => (
                <div
                  key={i}
                  className="shrink-0 w-[140px] rounded-tile bg-card p-3 shadow-sm"
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold",
                      r.tone,
                    )}
                  >
                    {r.code}
                  </div>
                  <div className="text-[14px] font-semibold mt-2 leading-tight">{r.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-2 font-medium tracking-wide">
                    {r.date}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Anniversary banner */}
          {tech.anniversary && (
            <section className="px-4 mt-4">
              <div className="rounded-tile bg-gradient-to-r from-[#1f3b8a] to-[#2a4ca8] p-3 flex items-center gap-3 text-white">
                <div className="flex flex-col items-center gap-0.5 px-2">
                  <Trophy className="w-4 h-4" />
                  <span className="text-[11px] font-semibold">{tech.anniversary.date}</span>
                </div>
                <div className="flex-1 text-[15px] font-semibold">{tech.anniversary.label}</div>
                <MoreHorizontal className="w-4 h-4 opacity-70" />
              </div>
            </section>
          )}


          {/* Current Job */}
          {currentJob ? (
            <section className="px-4 mt-5">
              <div className="flex items-center justify-between px-1 mb-2">
                <h2 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Current Job
                </h2>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className={cn("rounded-tile bg-card shadow-sm overflow-hidden border-l-4", STATUS_BORDER[currentJob.status])}>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[18px] font-bold">{currentJob.jobType}</span>
                        <Wifi className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <div className="text-[12px] text-muted-foreground mt-0.5">{currentJob.service}</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] font-medium">
                      <span className={cn("w-2 h-2 rounded-full", STATUS_DOT[currentJob.status])} />
                      {currentJob.statusLabel ?? currentJob.status}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[12px] text-muted-foreground">BAN</span>
                    <span className="text-[13px] font-semibold">{currentJob.ban}</span>
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[11px] text-muted-foreground font-medium">Address</div>
                      <div className="text-[13px] mt-0.5 leading-snug whitespace-pre-line">
                        {currentJob.address}
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Navigation className="w-4 h-4 text-primary-foreground" />
                    </button>
                  </div>

                  {(currentJob.dispatchedTime || currentJob.startedTime) && currentJob.estMin ? (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>
                          {currentJob.dispatchedTime
                            ? `Dispatched Time ${currentJob.dispatchedTime}`
                            : currentJob.startedTime}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-pill bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-pill bg-[hsl(170,80%,45%)]"
                          style={{ width: `${Math.min(100, ((currentJob.durationMin ?? 0) / currentJob.estMin) * 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] mt-1">
                        <span className="font-semibold">{currentJob.durationMin ?? 0} min</span>
                        <span className="text-muted-foreground">{currentJob.estMin} min (est.)</span>
                      </div>
                    </div>
                  ) : null}

                  {currentJob.lastUpdate && (
                    <div className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {currentJob.lastUpdate}
                    </div>
                  )}
                </div>
              </div>
            </section>
          ) : tech.emptyJobMessage ? (
            <section className="px-4 mt-5">
              <div className="flex items-center justify-between px-1 mb-2">
                <h2 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Current Job
                </h2>
              </div>
              <div className="rounded-tile bg-card shadow-sm p-4 text-[13px] text-muted-foreground">
                {tech.emptyJobMessage}
              </div>
            </section>
          ) : null}


          {/* Completion Rate */}
          <section className="px-4 mt-3">
            <div className="rounded-tile bg-card shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold">Completion Rate</div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="text-[11px]">View</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-[30px] font-bold mt-1">{tech.completionRate}%</div>
            </div>
          </section>

          {/* Time */}
          <section className="px-4 mt-5">
            <div className="flex items-center justify-between px-1 mb-2">
              <h2 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                Time
              </h2>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="rounded-tile bg-card shadow-sm overflow-hidden">
              <div className="grid grid-cols-3 px-4 py-2 text-[11px] font-medium text-muted-foreground border-b border-border">
                <span />
                <span className="text-center">Out of Gate</span>
                <span className="text-right">ATND</span>
              </div>
              <div className="grid grid-cols-3 px-4 py-3 items-center border-b border-border">
                <span className="text-[12px] text-muted-foreground">Yesterday</span>
                <span className="text-center text-[15px] font-bold text-destructive">{tech.time.yesterdayOutOfGate}</span>
                <span className="text-right text-[15px] font-bold">{tech.time.yesterdayAtnd}</span>
              </div>
              <div className="grid grid-cols-3 px-4 py-3 items-center">
                <span className="text-[12px] text-muted-foreground">This Week</span>
                <span className="text-center text-[15px] font-bold">{tech.time.weekOutOfGatePct}</span>
                <span className="text-right text-[15px] font-bold text-destructive">{tech.time.weekAtnd}</span>
              </div>
            </div>
          </section>

          {/* Docs */}
          <section className="px-4 mt-5">
            <div className="rounded-tile bg-[hsl(var(--card-dark))] text-white p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[17px] font-semibold">Docs</div>
                <ChevronRight className="w-4 h-4 text-white/60" />
              </div>
              <div className="grid grid-cols-2 gap-y-5">
                {tech.docs.map((d, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="text-[12px] mb-2">
                      <span className="font-semibold">{d.label}</span>
                      {d.sub ? <span className="text-white/60 ml-1">{d.sub}</span> : null}
                    </div>
                    <Donut value={d.count} color={d.color} complete={d.complete} />
                    <div className="text-[10px] text-white/50 mt-2 tracking-wide">JUL 31</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tasks */}
          <section className="px-4 mt-3">
            <div className="rounded-tile bg-[hsl(var(--card-dark))] text-white p-4">
              <div className="text-[17px] font-semibold mb-3">Tasks</div>
              <div className="space-y-3">
                {tech.tasks.map((t) => (
                  <TaskRow key={t.label} label={t.label} due={t.due} count={t.count} pct={t.pct} tone={t.tone} />
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center">
                <span className="text-[13px] font-medium flex-1">VOC</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Smile className="w-4 h-4 text-success" />
                    <span className="text-[13px] font-semibold">{tech.voc.happy}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Meh className="w-4 h-4 text-warning" />
                    <span className="text-[13px] font-semibold">{tech.voc.neutral}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Frown className="w-4 h-4 text-destructive" />
                    <span className="text-[13px] font-semibold">{tech.voc.sad}</span>
                  </span>
                </div>
              </div>


              <div className="mt-3 pt-3 border-t border-white/10 flex items-center">
                <span className="text-[13px] font-medium flex-1">Corrective</span>
                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <div className="text-[14px] font-bold leading-none">1</div>
                    <div className="text-[10px] text-white/60 mt-0.5">Reminders</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[14px] font-bold leading-none">1</div>
                    <div className="text-[10px] text-white/60 mt-0.5">Active Plans</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Schedule */}
          <section className="px-4 mt-5">
            <div className="flex items-center justify-between px-1 mb-2">
              <h2 className="text-[17px] font-bold">Schedule</h2>
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="rounded-tile bg-card shadow-sm p-3">
              <div className="inline-flex p-0.5 rounded-pill bg-muted text-[12px] font-medium">
                <span className="px-3 py-1 rounded-pill bg-card shadow-sm text-foreground">
                  This Week
                </span>
                <span className="px-3 py-1 rounded-pill text-muted-foreground">This Month</span>
              </div>

              <div className="grid grid-cols-7 gap-1 mt-3 text-center">
                {WEEK.map((w, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-muted-foreground font-medium">{w.d}</span>
                    <span
                      className={cn(
                        "w-7 h-7 rounded-md flex items-center justify-center text-[13px] font-semibold",
                        w.muted && "text-muted-foreground/50",
                        w.marked && "border border-warning text-warning",
                      )}
                    >
                      {w.n}
                    </span>
                    {!w.muted ? <span className="w-1 h-1 rounded-full bg-primary" /> : <span className="w-1 h-1" />}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="rounded-tile bg-[hsl(35,90%,95%)] p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[18px] font-bold text-[hsl(28,80%,40%)]">2</span>
                    <span className="text-[9px] font-semibold rounded-pill bg-warning/20 text-warning px-1.5 py-0.5">
                      Pending
                    </span>
                  </div>
                  <div className="text-[12px] font-semibold text-[hsl(28,80%,40%)] mt-1">
                    Vacation
                  </div>
                </div>
                <div className="rounded-tile bg-[hsl(196,100%,95%)] p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[18px] font-bold text-primary">1</span>
                    <span className="text-[9px] font-semibold text-primary">Friday</span>
                  </div>
                  <div className="text-[12px] font-semibold text-primary mt-1">Benefits</div>
                </div>
              </div>

              <div className="mt-3 rounded-tile bg-gradient-to-r from-primary to-[hsl(196,100%,55%)] text-primary-foreground p-3 flex items-center">
                <div className="flex-1">
                  <div className="text-[20px] font-bold leading-none">3 days</div>
                  <div className="text-[11px] opacity-90 mt-0.5">AM Shift</div>
                </div>
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          </section>

          {/* Bottom links */}
          <section className="px-4 mt-3 space-y-2">
            <button className="w-full rounded-tile bg-card shadow-sm p-3 flex items-center gap-3">
              <History className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 text-left text-[14px] font-medium">
                Manager Overrides History
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="w-full rounded-tile bg-card shadow-sm p-3 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="flex-1 text-left text-[14px] font-medium">Insights History</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </section>

        </main>
      </div>
    </div>
  );
};

export default TechDetail;
