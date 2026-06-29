
import { useGuardedNavigate } from "@/lib/routes";
import { ChevronRight, Sparkles, AlertCircle } from "lucide-react";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { TeamHeader } from "@/components/layout/TeamHeader";

import { cn } from "@/lib/utils";
import { avatar } from "@/assets/avatars";

type Insight = {
  id: string;
  name: string;
  initials: string;
  avatarTone: string;
  avatar?: string;
  tags: { label: string; icon?: string }[];
  count: number;
};

const insights: Insight[] = [
  {
    id: "tech-1",
    name: "Gabriel Sinclair",
    initials: "GS",
    avatarTone: "bg-[hsl(150,25%,40%)]",
    avatar: avatar(12),
    tags: [{ label: "ATND" }, { label: "Unplugged" }],
    count: 2,
  },
  {
    id: "tech-3",
    name: "Juan Benni",
    initials: "JB",
    avatarTone: "bg-[hsl(28,70%,55%)]",
    avatar: avatar(14),
    tags: [{ label: "Harsh Braking" }, { label: "Speeding" }],
    count: 2,
  },
  {
    id: "tech-4",
    name: "Ava Whitaker",
    initials: "AW",
    avatarTone: "bg-[hsl(210,15%,30%)]",
    avatar: avatar(47),
    tags: [{ label: "Claim" }],
    count: 1,
  },
];



const SectionHeader = ({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: React.ReactNode;
  onAction?: () => void;
}) => (
  <div className="flex items-end justify-between px-1 mb-2">
    <h2 className="text-[22px] font-bold tracking-tight text-foreground">{title}</h2>
    {action ? (
      <button
        type="button"
        onClick={onAction}
        className="flex items-center gap-0.5 text-[13px] text-muted-foreground font-medium"
      >
        {action}
        <ChevronRight className="w-4 h-4" />
      </button>
    ) : null}
  </div>
);

const DarkCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-card p-4 text-white",
      "bg-[hsl(var(--card-dark))]",
      className,
    )}
  >
    {children}
  </div>
);

const CardHeaderRow = ({
  title,
  rightLabel,
}: {
  title: string;
  rightLabel?: string;
}) => (
  <div className="flex items-center justify-between mb-2">
    <div className="text-[17px] font-semibold">{title}</div>
    <div className="flex items-center gap-1 text-white/60">
      {rightLabel ? <span className="text-[12px] font-medium">{rightLabel}</span> : null}
      <ChevronRight className="w-4 h-4" />
    </div>
  </div>
);

const TagChip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-pill bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground/80 border border-border">
    {children}
  </span>
);

const AiLink = ({
  children,
  blue,
  to,
}: {
  children: React.ReactNode;
  blue?: boolean;
  to?: string;
}) => {
  const navigate = useGuardedNavigate();
  return (
    <button
      type="button"
      onClick={() => to && navigate(to)}
      className={cn(
        "inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-[12px] font-medium",
        blue ? "bg-primary/15 text-primary" : "bg-primary/10 text-primary",
      )}
    >
      <Sparkles className="w-3 h-3" />
      {children}
    </button>
  );
};

const HBar = ({
  value,
  total,
  tone,
}: {
  value: number;
  total: number;
  tone: "teal" | "gray";
}) => (
  <div className="h-2 rounded-pill bg-white/10 w-full overflow-hidden">
    <div
      className={cn(
        "h-full rounded-pill",
        tone === "teal" ? "bg-[hsl(170,80%,55%)]" : "bg-white/30",
      )}
      style={{ width: `${Math.min(100, (value / total) * 100)}%` }}
    />
  </div>
);

const Donut = ({
  value,
  label,
  active,
}: {
  value: number;
  label: string;
  active?: boolean;
}) => {
  const r = 38;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[96px] h-[96px]">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={active ? "hsl(170,80%,55%)" : "rgba(255,255,255,0.45)"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-1">
            {active ? <AlertCircle className="w-3 h-3 text-destructive" /> : null}
            <span className="text-[20px] font-bold">{value}%</span>
          </div>
        </div>
      </div>
      <div className="text-[12px] text-white/70 mt-1">{label}</div>
    </div>
  );
};

const LightCard = ({
  title,
  rightLabel,
  children,
}: {
  title: string;
  rightLabel?: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-card bg-card p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="text-[17px] font-semibold text-foreground">{title}</div>
      <div className="flex items-center gap-1 text-muted-foreground">
        {rightLabel ? <span className="text-[12px] font-medium">{rightLabel}</span> : null}
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
    {children}
  </div>
);

const Performance = () => {
  const navigate = useGuardedNavigate();

  return (
    <div data-view-name="Performance" className="min-h-screen w-full flex justify-center bg-[#0a0a0c] py-6">
      <div
        className="relative w-[393px] max-w-full bg-background rounded-[44px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-white/5"
        style={{ minHeight: 844 }}
      >
        <main className="relative h-[852px] overflow-y-auto no-scrollbar pb-28 bg-background">
          <StatusBar />

          <TeamHeader title="Team" active="Performance" />


          {/* Insights */}
          <section className="px-4">
            <div className="rounded-card bg-card shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[17px] font-semibold">Insights</div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="divide-y divide-border">
                {insights.map((i) => (
                  <button
                    key={i.name}
                    type="button"
                    onClick={() => navigate(`/tech/${i.id}`)}
                    className="w-full text-left flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    {i.avatar ? (
                      <img
                        src={i.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover bg-muted"
                      />
                    ) : (
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-semibold",
                          i.avatarTone,
                        )}
                      >
                        {i.initials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold truncate">{i.name}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {i.tags.map((t) => (
                          <TagChip key={t.label}>{t.label}</TagChip>
                        ))}
                      </div>
                    </div>
                    <span className="inline-flex items-center justify-center min-w-[28px] h-6 rounded-pill bg-destructive/15 text-destructive text-[12px] font-bold px-2">
                      {i.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Team Trends */}
          <section className="px-4 mt-6">
            <SectionHeader title="Team Trends" action="Show All" />

            <div className="space-y-3">
              {/* Total Jobs */}
              <DarkCard>
                <CardHeaderRow title="Total Jobs" />
                <p className="text-[13px] text-white/65 leading-snug">
                  This month's job completion rate is trending higher than last.
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="text-[28px] font-bold leading-none">153</div>
                    <div className="text-[12px] text-white/70">Jobs</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <HBar value={153} total={180} tone="teal" />
                    <span className="text-[12px] text-white/70 shrink-0">June</span>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="text-[28px] font-bold leading-none">120</div>
                    <div className="text-[12px] text-white/70">Jobs</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <HBar value={120} total={180} tone="gray" />
                    <span className="text-[12px] text-white/70 shrink-0">May</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10">
                  <div className="text-[12px] text-white/60 font-medium mb-2">Job Status</div>
                  <div className="flex items-end gap-6">
                    <div>
                      <div className="text-[22px] font-bold leading-none">140</div>
                      <div className="text-[11px] text-white/60 mt-1">Complete</div>
                    </div>
                    <div>
                      <div className="text-[22px] font-bold leading-none">10</div>
                      <div className="text-[11px] text-white/60 mt-1">Incomplete</div>
                    </div>
                    <div>
                      <div className="text-[22px] font-bold leading-none">3</div>
                      <div className="text-[11px] text-white/60 mt-1">Cancelled</div>
                    </div>
                  </div>
                </div>
              </DarkCard>

              {/* AIQ */}
              <DarkCard>
                <CardHeaderRow title="All In Quality Attainment" />
                <p className="text-[13px] text-white/65 leading-snug">
                  All In Quality is showing a positive trend—already higher than last month.
                </p>
                <div className="mt-5">
                  <svg viewBox="0 0 280 70" className="w-full h-[70px]">
                    <line x1="40" y1="40" x2="220" y2="20" stroke="hsl(95,70%,55%)" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="40" cy="40" r="5" fill="hsl(95,70%,55%)" />
                    <circle cx="220" cy="20" r="5" fill="hsl(95,70%,55%)" />
                  </svg>
                  <div className="flex justify-between px-2 -mt-1">
                    <div>
                      <div className="text-[22px] font-bold leading-none">91%</div>
                      <div className="text-[11px] text-white/60 mt-1">May</div>
                    </div>
                    <div className="pr-12">
                      <div className="text-[22px] font-bold leading-none">95%</div>
                      <div className="text-[11px] text-white/60 mt-1">Jun</div>
                    </div>
                  </div>
                </div>
              </DarkCard>

              {/* Efficiency */}
              <DarkCard>
                <CardHeaderRow title="Efficiency" />
                <p className="text-[13px] text-white/65 leading-snug">
                  This month's pace is behind last month, but there's still time to recover.
                </p>
                <div className="mt-4 flex items-center justify-around">
                  <Donut value={97} label="May" />
                  <Donut value={74} label="Jun" active />
                </div>
              </DarkCard>
              <div className="flex flex-wrap gap-2">
                <AiLink to="/chat/efficiency">What's impacting Efficiency?</AiLink>
                <AiLink>Next steps</AiLink>
                <AiLink blue>Trend over 3 months</AiLink>
              </div>

              {/* ATND */}
              <DarkCard>
                <CardHeaderRow title="ATND" />
                <p className="text-[13px] text-white/65 leading-snug">
                  This month's Available Time Not Dispatched hours are trending higher than last.
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <div className="text-[26px] font-bold leading-none">34</div>
                    <div className="text-[12px] text-white/70">hrs</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <HBar value={34} total={50} tone="teal" />
                    <span className="text-[12px] text-white/70 shrink-0">June</span>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="text-[26px] font-bold leading-none ml-6">23</div>
                    <div className="text-[12px] text-white/70">hrs</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <HBar value={23} total={50} tone="gray" />
                    <span className="text-[12px] text-white/70 shrink-0">May</span>
                  </div>
                </div>
              </DarkCard>
              <div className="flex flex-wrap gap-2">
                <AiLink to="/chat/atnd">Why has ATND increased?</AiLink>
                <AiLink>Next steps</AiLink>
                <AiLink>Trend over 3 months</AiLink>
              </div>

              {/* FJOTA */}
              <LightCard title="FJOTA" rightLabel="MTD">
                <div className="text-[34px] font-bold mt-1">95%</div>
              </LightCard>

              {/* HPC Completion */}
              <LightCard title="HPC Completion" rightLabel="MTD">
                <div className="flex items-baseline gap-2 mt-1">
                  <div className="text-[34px] font-bold">2.3</div>
                  <div className="text-[13px] text-muted-foreground">Average Hours</div>
                </div>
              </LightCard>
            </div>
          </section>

          {/* Tools */}
          <section className="px-4 mt-6">
            <h2 className="text-[22px] font-bold tracking-tight mb-2 px-1">Tools</h2>
            <div className="space-y-2">
              <div className="rounded-card bg-card p-4 shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[14px] font-bold">
                  ESM
                </div>
                <div className="flex-1">
                  <div className="text-[15px] font-semibold">ESM</div>
                  <div className="text-[12px] text-muted-foreground">Engineer Service Measurement</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="rounded-card bg-card p-4 shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[14px] font-bold">
                  MOP
                </div>
                <div className="flex-1">
                  <div className="text-[15px] font-semibold">MOP</div>
                  <div className="text-[12px] text-muted-foreground">Subtitle Here</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </section>

          <div className="h-6" />
        </main>
      </div>
    </div>
  );
};

export default Performance;
