import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Eye,
  ShieldCheck,
  Activity,
  ChevronRight,
  Cake,
  Award,
  Trophy,
  Plus,
  MapPin,
  AlertTriangle,
  Sun,
  Moon,
  Cloud,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Settings2,
  Check,
  Navigation,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { technicians, getTechnician } from "@/data/mockData";
import { VRIDE_QUEUE } from "@/data/vrideQueue";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import heroImg from "@/assets/home-hero.jpg";
import whatsNew1 from "@/assets/whatsnew-1.jpg";
import whatsNewBanner from "@/assets/whats-new-banner.png";
import mapBg from "@/assets/map-bg.jpg";
import { avatar } from "@/assets/avatars";

// Techs flagged as having a recommended visit (driven by harsh braking, quality issues, visit due, etc.)
const RECOMMENDED_TECH_IDS = new Set(["t1", "t3", "t4"]);

type SheetTech = ReturnType<typeof getTechnician>;

function TechListSheet({
  open,
  onOpenChange,
  title,
  subtitle,
  techs,
  badgeLabel,
  badgeTone = "blue",
  showRecommended = true,
  viewAllHref = "/team",
  viewAllDocType,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  subtitle: string;
  techs: SheetTech[];
  badgeLabel: string;
  badgeTone?: "blue" | "orange" | "red" | "green" | "neutral";
  showRecommended?: boolean;
  viewAllHref?: string;
  /** When set, View All routes to Team → Docs filtered to this doc type. */
  viewAllDocType?: "Visit" | "Coaching" | "Growth Plan" | "Recognition";
}) {
  const navigate = useNavigate();
  const toneClass =
    badgeTone === "orange"
      ? "bg-[hsl(25_95%_53%)]/10 text-[hsl(25_95%_45%)]"
      : badgeTone === "red"
      ? "bg-destructive/10 text-destructive"
      : badgeTone === "green"
      ? "bg-success/10 text-success"
      : badgeTone === "neutral"
      ? "bg-secondary text-foreground"
      : "bg-[hsl(205_85%_55%)]/10 text-[hsl(205_85%_45%)]";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl border-t-0 px-0 pb-0 max-h-[80vh] flex flex-col">
        <div className="mx-auto w-9 h-1 rounded-full bg-muted mt-1 mb-3 shrink-0" />
        <SheetHeader className="px-5 text-left shrink-0">
          <SheetTitle className="text-xl font-bold">{title}</SheetTitle>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </SheetHeader>
        <div className="mt-3 flex-1 overflow-y-auto divide-y divide-[hsl(var(--ios-separator))]">
          {techs.filter(Boolean).map((tech) => {
            const t = tech!;
            const isRecommended = showRecommended && RECOMMENDED_TECH_IDS.has(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  navigate(`/tech/${t.id}`, { state: { from: "home" } });
                }}
                className="w-full px-5 py-3 flex items-center gap-3 text-left active:bg-secondary/50 transition-colors min-h-[56px]"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={t.avatarUrl} alt={t.name} className="object-cover" />
                  <AvatarFallback>{t.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{t.role}</p>
                  {isRecommended && (
                    <span className="inline-flex items-center gap-0.5 mt-1 px-1.5 py-0.5 rounded-full bg-[hsl(205_85%_55%)]/10 text-[hsl(205_85%_45%)] text-[9px] font-bold uppercase tracking-wide">
                      <Sparkles className="w-2.5 h-2.5" />
                      Recommended Visit
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${toneClass}`}>{badgeLabel}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>
        <div className="shrink-0 border-t border-[hsl(var(--ios-separator))] px-5 py-3 pb-6 bg-background">
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              if (viewAllDocType) {
                navigate("/team", {
                  state: { tab: "Docs", docTypes: [viewAllDocType] },
                });
              } else {
                navigate(viewAllHref);
              }
            }}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold active:opacity-60 transition-opacity"
          >
            View All
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-xl font-bold text-foreground tracking-tight">{title}</h2>
      {action && (
        <button onClick={onAction} className="flex items-center gap-0.5 text-sm font-semibold text-muted-foreground">
          {action}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function HeroHeader() {
  return (
    <div className="relative h-[260px] overflow-hidden">
      <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-background" />
      <div className="relative z-10 px-5 pt-20">
        <p className="text-white/90 text-sm font-medium drop-shadow">Good Morning,</p>
        <h1 className="text-white text-4xl font-bold tracking-tight drop-shadow">Alexander</h1>
      </div>
    </div>
  );
}

function ReasonChip({ icon, label }: { icon: "visit" | "quality" | "braking"; label: string }) {
  const Icon = icon === "visit" ? Eye : icon === "quality" ? ShieldCheck : Activity;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-medium backdrop-blur-sm">
      <Icon className="w-2.5 h-2.5" />
      {label}
    </span>
  );
}

function RecommendedVisitCard({ techId = "t1", eta = "9 min", status = "Onsite · 5 min ago" }: { techId?: string; eta?: string; status?: string } = {}) {
  const tech = getTechnician(techId)!;
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/tech/${tech.id}`, { state: { from: "home" } })}
      className="ios-card overflow-hidden min-w-[300px] snap-start text-left active:opacity-80 transition-opacity"
    >
      <div className="bg-[hsl(205_85%_55%)] px-3 pt-2 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-white text-xs font-semibold">
            <Sparkles className="w-3 h-3" />
            RECOMMENDED VISIT
          </div>
          <span className="px-2 py-0.5 rounded-full bg-white text-[hsl(205_85%_45%)] text-[11px] font-bold">{eta}</span>
        </div>
      </div>
      <div className="px-3 py-2.5 flex items-center gap-2.5 bg-[hsl(var(--ios-group-bg))]">
        <Avatar className="w-9 h-9">
          <AvatarImage src={tech.avatarUrl} alt={tech.name} className="object-cover" />
          <AvatarFallback>{tech.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{tech.name}</p>
          <p className="text-[11px] text-muted-foreground">{status}</p>
        </div>
      </div>
      <div className="px-3 pb-2.5 flex items-center gap-1 flex-wrap bg-[hsl(var(--ios-group-bg))]">
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-foreground">
          <Eye className="w-2.5 h-2.5" /> Visit Due
        </span>
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-foreground">
          <ShieldCheck className="w-2.5 h-2.5" /> Quality
        </span>
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-foreground">
          <Activity className="w-2.5 h-2.5" /> Harsh Braking
        </span>
      </div>
    </button>
  );
}

function WhatsNewCard({ image, tag, title, onClick }: { image: string; tag: string; title: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative min-w-[260px] h-[140px] rounded-3xl overflow-hidden snap-start shadow-md text-left active:opacity-80 transition-opacity"
    >
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
        <p className="text-[10px] font-bold uppercase tracking-wider opacity-90">{tag}</p>
        <p className="text-sm font-semibold leading-tight mt-0.5">{title}</p>
      </div>
    </button>
  );
}

function SummaryCard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"Team" | "Turf">("Team");
  const [sheet, setSheet] = useState<null | "dispatched" | "atnd" | "assigned" | "pending" | "completed">(null);
  // Mirror /team roster so taps deep-link to real tech detail pages
  const teamSheetTech = (id: string, name: string, avatarUrl: string, role: string): SheetTech => ({
    id, name, role, avatarUrl,
  });
  const teamDispatched: SheetTech[] = [
    teamSheetTech("tech-1", "Gabriel Sinclair", avatar(12), "Premise Tech II"),
    teamSheetTech("tech-2", "Lucas Brooks", avatar(13), "Premise Tech III"),
    teamSheetTech("tech-3", "Juan Benni", avatar(14), "Senior Tech"),
  ];
  const teamAtnd: SheetTech[] = [
    teamSheetTech("tech-4", "Ava Whitaker", avatar(47), "Premise Tech II"),
    teamSheetTech("tech-5", "Stephan Osco", avatar(15), "Premise Tech I"),
    teamSheetTech("tech-6", "Elliot Covington", avatar(22), "Premise Tech II"),
  ];
  const sheetMap: Record<string, { title: string; subtitle: string; techs: SheetTech[]; badge: string; tone: "blue" | "orange" | "green" | "neutral" }> = {
    dispatched: { title: "Dispatched", subtitle: "Techs currently dispatched", techs: teamDispatched, badge: "Dispatched", tone: "blue" },
    atnd: { title: "ATND", subtitle: "Techs attending", techs: teamAtnd, badge: "ATND", tone: "neutral" },
    assigned: { title: "Assigned", subtitle: "Jobs assigned", techs: [teamSheetTech("tech-4", "Ava Whitaker", avatar(47), "Premise Tech II")], badge: "Assigned", tone: "blue" },
    pending: { title: "Pending", subtitle: "Pending jobs", techs: teamDispatched, badge: "Pending", tone: "orange" },
    completed: { title: "Completed", subtitle: "Jobs completed today", techs: [], badge: "Completed", tone: "green" },
  };
  const active = sheet ? sheetMap[sheet] : null;
  // Totals mirror /team (ACTIVE_TEAM in src/pages/Jobs.tsx)
  const total = 6;
  const dispatched = 3;
  const atnd = 3;
  // Semicircle: 180deg arc; circumference = π * r
  const r = 42;
  const circ = Math.PI * r; // half circle
  const dispatchedLen = (dispatched / total) * circ;
  const atndLen = (atnd / total) * circ;
  return (
    <div className="overflow-hidden rounded-3xl shadow-md bg-[hsl(220_20%_16%)] text-white">
      <button type="button" onClick={() => navigate("/team")} className="px-4 pt-4 pb-3 flex items-center justify-between w-full active:opacity-60 transition-opacity">
        <h3 className="text-[17px] font-bold text-white">Jobs</h3>
        <ChevronRight className="w-4 h-4 text-white/60" strokeWidth={2.5} />
      </button>

      {/* Segmented control */}
      <div className="px-4 pb-4">
        <div className="flex bg-white/10 rounded-full p-1">
          {(["Team", "Turf"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${
                tab === t ? "bg-[#636366] text-white shadow-sm" : "text-white/60"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Gauge + legend */}
      <div className="px-4 pb-4 flex items-center gap-4">
        <div className="relative w-32 h-20 shrink-0">
          <svg viewBox="0 0 100 56" className="w-full h-full overflow-visible">
            {/* Track */}
            <path
              d={`M 4 50 A ${r} ${r} 0 0 1 96 50`}
              fill="none"
              stroke="hsl(220 15% 26%)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* ATND segment (drawn first so dispatched overlaps on top from the left) */}
            <path
              d={`M 4 50 A ${r} ${r} 0 0 1 96 50`}
              fill="none"
              stroke="hsl(220 15% 60%)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${circ} ${circ}`}
              strokeDashoffset="0"
            />
            {/* Dispatched segment */}
            <path
              d={`M 4 50 A ${r} ${r} 0 0 1 96 50`}
              fill="none"
              stroke="hsl(205 90% 60%)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${dispatchedLen} ${circ}`}
            />
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
            <span className="text-[28px] font-bold text-white leading-none">{total}</span>
            <span className="text-[11px] font-semibold text-white/60 mt-0.5">Total Techs</span>
          </div>
        </div>
        <div className="flex-1 space-y-2 text-[13px]">
          <button onClick={() => setSheet("dispatched")} className="flex items-center gap-2 active:opacity-60 transition-opacity">
            <span className="w-2.5 h-2.5 rounded-full bg-[hsl(205_90%_60%)]" />
            <span className="font-bold text-white">{dispatched}</span>
            <span className="text-white/60">Dispatched</span>
          </button>
          <button onClick={() => setSheet("atnd")} className="flex items-center gap-2 active:opacity-60 transition-opacity">
            <span className="w-2.5 h-2.5 rounded-full bg-[hsl(220_15%_60%)]" />
            <span className="font-bold text-white">{atnd}</span>
            <span className="text-white/60">ATND</span>
          </button>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="px-4 pb-4 grid grid-cols-3 gap-2">
        {[
          { v: "3.5", l: "Per Tech", key: null },
          { v: "1", l: "Assigned", key: "assigned" as const },
          { v: "3", l: "Pending", key: "pending" as const },
          { v: "0", l: "Completed", key: "completed" as const },
          { v: "1", l: "Cancelled", key: null },
          { v: "1", l: "Returned", key: null },
        ].map((s) => (
          <button
            key={s.l}
            type="button"
            onClick={() => s.key && setSheet(s.key)}
            disabled={!s.key}
            className="bg-white/[0.07] rounded-2xl px-3 py-3 text-left active:opacity-60 transition-opacity disabled:active:opacity-100"
          >
            <div className="text-[22px] font-bold text-white leading-none">{s.v}</div>
            <div className="text-[11px] text-white/60 mt-1.5">{s.l}</div>
          </button>
        ))}
      </div>
      {active && (
        <TechListSheet
          open={sheet !== null}
          onOpenChange={(o) => !o && setSheet(null)}
          title={active.title}
          subtitle={active.subtitle}
          techs={active.techs}
          badgeLabel={active.badge}
          badgeTone={active.tone}
        />
      )}
    </div>
  );
}

function CelebrationsCard() {
  const navigate = useNavigate();
  const items = [
    { tech: technicians[4], label: "Dwayne's Birthday", icon: Cake },
    { tech: technicians[2], label: "Elliot's 25th Anniversary", icon: Trophy },
  ];
  return (
    <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[hsl(205_75%_55%)] to-[hsl(220_70%_45%)] text-white shadow-md">
      <div className="px-4 pt-3 pb-2 flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="w-4 h-4" /> Celebrations
      </div>
      <div className="divide-y divide-white/15">
        {items.map((it, i) => (
          <button
            key={i}
            type="button"
            onClick={() => navigate(`/tech/${it.tech.id}`, { state: { from: "home" } })}
            aria-label={`Open ${it.tech.name}'s profile`}
            className="px-4 py-2.5 flex items-center gap-3 w-full text-left active:opacity-60 transition-opacity"
          >
            <Avatar className="w-9 h-9 ring-2 ring-white/30">
              <AvatarImage src={it.tech.avatarUrl} alt={it.tech.name} className="object-cover" />
              <AvatarFallback>{it.tech.name[0]}</AvatarFallback>
            </Avatar>
            <p className="flex-1 text-sm font-medium">{it.label}</p>
            <it.icon className="w-4 h-4 opacity-80" />
          </button>
        ))}
      </div>
    </div>
  );
}

function RecognitionCard({ id, name, avatar }: { id?: string; name: string; avatar: string }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => id && navigate(`/tech/${id}`, { state: { from: "home" } })}
      className="ios-card min-w-[150px] snap-start p-3 flex flex-col items-center text-center active:opacity-60 transition-opacity"
    >
      <Avatar className="w-12 h-12 mb-2">
        <AvatarImage src={avatar} alt={name} className="object-cover" />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <p className="text-sm font-semibold text-foreground truncate w-full">{name}</p>
      <div className="flex gap-1 mt-2">
        {[ShieldCheck, Award, Activity, Eye].map((Icon, i) => (
          <span key={i} className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
            <Icon className="w-3 h-3 text-foreground" />
          </span>
        ))}
      </div>
    </button>
  );
}

function DispatchedRow({
  tech,
  jobType = "Install",
  time,
  startedAt,
  elapsed,
  est,
  over,
}: {
  tech: ReturnType<typeof getTechnician>;
  jobType?: "Install" | "Repair" | "Decom";
  time: string;
  startedAt: string;
  elapsed: number;
  est: number;
  over?: boolean;
}) {
  if (!tech) return null;
  const navigate = useNavigate();
  const pct = Math.min(100, (elapsed / est) * 100);
  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(`/tech/${tech.id}`, { state: { from: "home" } })}
          aria-label={`Open ${tech.name}'s profile`}
          className="shrink-0 min-w-[44px] min-h-[44px] -m-1 flex items-center justify-center rounded-full active:opacity-60 transition-opacity"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={tech.avatarUrl} alt={tech.name} className="object-cover" />
            <AvatarFallback>{tech.name[0]}</AvatarFallback>
          </Avatar>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{tech.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="px-1.5 py-0.5 rounded-md bg-[hsl(210_80%_92%)] text-[hsl(210_80%_40%)] text-[10px] font-bold">
              {jobType}
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-success/10 text-success text-[10px] font-bold">RG</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-foreground">{time}</p>
        </div>
      </div>
      <div className="mt-2">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
          <span>{over ? "Over Estimate" : "Dispatched Time"}</span>
          <span>Started {startedAt}</span>
        </div>
        <div className="h-1 rounded-full bg-secondary overflow-hidden">
          <div className={`h-full rounded-full ${over ? "bg-destructive" : "bg-success"}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center justify-between text-[10px] mt-1">
          <span className={over ? "text-destructive font-semibold" : "text-muted-foreground"}>{elapsed} min</span>
          <span className="text-muted-foreground">{est} min (est.)</span>
        </div>
      </div>
    </div>
  );
}

function PerformanceCard() {
  const rows = [
    { key: "ad", label: "A/D Attainment", value: "82%", trend: "+3%", up: true },
    { key: "eff", label: "Efficiency", value: "84%", trend: "-1%", up: false },
    { key: "rca", label: "RCA Attainment", value: "95%", trend: "+1%", up: true },
  ];
  const [sheet, setSheet] = useState<string | null>(null);
  const active = rows.find((r) => r.key === sheet);
  return (
    <div className="ios-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-foreground">Performance</h3>
        <span className="text-[10px] text-muted-foreground">Last 30 days</span>
      </div>
      <div className="space-y-3">
        {rows.map((r) => (
          <button
            key={r.label}
            type="button"
            onClick={() => setSheet(r.key)}
            className="w-full flex items-center gap-3 active:opacity-60 transition-opacity"
          >
            <span className="text-xs text-muted-foreground w-28 shrink-0">{r.label}</span>
            <span className="text-base font-bold text-foreground w-12">{r.value}</span>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                r.up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              }`}
            >
              {r.trend}
            </span>
            {/* sparkline */}
            <svg viewBox="0 0 60 20" className="flex-1 h-5">
              <polyline
                fill="none"
                stroke={r.up ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                strokeWidth="1.5"
                points={r.up ? "0,15 10,12 20,14 30,8 40,10 50,5 60,3" : "0,8 10,10 20,7 30,12 40,9 50,14 60,11"}
              />
            </svg>
          </button>
        ))}
      </div>
      {active && (
        <TechListSheet
          open={sheet !== null}
          onOpenChange={(o) => !o && setSheet(null)}
          title={`${active.label} · ${active.value}`}
          subtitle={active.up ? "Top contributors this period" : "Techs needing attention"}
          techs={technicians.slice(0, 5)}
          badgeLabel={active.trend}
          badgeTone={active.up ? "green" : "red"}
        />
      )}
    </div>
  );
}

function VRideQueueSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const navigate = useNavigate();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl border-t-0 px-0 pb-0 max-h-[80vh] flex flex-col">
        <div className="mx-auto w-9 h-1 rounded-full bg-muted mt-1 mb-3 shrink-0" />
        <SheetHeader className="px-5 text-left shrink-0">
          <SheetTitle className="text-xl font-bold">vRide · Left to-do</SheetTitle>
          <p className="text-sm text-muted-foreground">Virtual ride-alongs still to-do</p>
        </SheetHeader>
        <div className="mt-3 flex-1 overflow-y-auto divide-y divide-[hsl(var(--ios-separator))]">
          {VRIDE_QUEUE.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                onOpenChange(false);
                navigate(`/vride?techId=${t.id}`, { state: { from: "/dashboard" } });
              }}
              className="w-full px-5 py-3 flex items-center gap-3 text-left active:bg-secondary/50 transition-colors min-h-[56px]"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={t.avatar} alt={t.name} className="object-cover" />
                <AvatarFallback>{t.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                <p className="text-xs text-muted-foreground truncate">ID: {t.id}</p>
              </div>
              <span
                className={
                  "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full " +
                  (t.tone === "danger"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-secondary text-foreground")
                }
              >
                {t.tone === "danger" ? (
                  <AlertTriangle className="w-3 h-3" />
                ) : (
                  <Navigation className="w-3 h-3" />
                )}
                {t.chip}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
        <div className="shrink-0 border-t border-[hsl(var(--ios-separator))] px-5 py-3 pb-6 bg-background">
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              navigate("/team", { state: { tab: "Docs", docTypes: ["Visit"] } });
            }}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold active:opacity-60 transition-opacity"
          >
            View All
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function FieldVisitsCard() {
  const navigate = useNavigate();
  const [openSheet, setOpenSheet] = useState<null | "live" | "post" | "vride" | "ride">(null);

  const liveTechs = technicians.slice(0, 5);
  const postTechs = technicians.slice(0, 4);
  const rideTechs = technicians.slice(0, 3);

  const cards = [
    {
      key: "live" as const,
      label: "Live",
      date: "Oct 31",
      pct: 72,
      complete: false,
      count: 5,
    },
    {
      key: "post" as const,
      label: "Post",
      date: "Oct 31",
      pct: 100,
      complete: true,
      count: 0,
    },
    {
      key: "vride" as const,
      label: "vRide",
      date: "Oct 31",
      pct: 60,
      complete: false,
      count: 1,
    },
    {
      key: "ride" as const,
      label: "Ride",
      date: "Oct 31",
      pct: 100,
      complete: true,
      count: 0,
    },
  ];

  return (
    <div className="ios-card overflow-hidden">
      <button
        type="button"
        onClick={() => navigate("/team", { state: { tab: "Docs", docTypes: ["Visit"] } })}
        className="w-full px-4 py-3 flex items-center justify-between active:opacity-60 transition-opacity"
        aria-label="Open Field Visits"
      >
        <h3 className="text-lg font-bold text-foreground">Field Visits</h3>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </button>
      <div className="border-t border-[hsl(var(--ios-separator))] grid grid-cols-2 gap-y-2 px-2 pt-3 pb-4">
        {cards.map((c, idx) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setOpenSheet(c.key)}
            aria-label={`View ${c.label} technicians`}
            className={`flex flex-col items-center px-2 rounded-2xl active:opacity-60 transition-opacity ${
              idx >= 2 ? "pt-3 border-t border-[hsl(var(--ios-separator))]" : ""
            }`}
          >
            <p className="text-sm font-semibold text-foreground mb-2">{c.label}</p>
            <div className="relative w-[140px] h-[115px]">
              <svg viewBox="-2 -2 40 32" className="w-full h-full overflow-visible">
                <path
                  d="M 7.757 25.243 A 14.5 14.5 0 1 1 28.243 25.243"
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 7.757 25.243 A 14.5 14.5 0 1 1 28.243 25.243"
                  fill="none"
                  stroke="hsl(205 85% 55%)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${(c.pct / 100) * 68.33} 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pb-2 pt-[4px]">
                {c.complete ? (
                  <div className="flex flex-col items-center">
                    <span className="w-9 h-9 rounded-full bg-success flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-1">Complete</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-[40px] font-bold text-foreground leading-none">{c.count}</span>
                    <span className="text-[11px] text-muted-foreground mt-1">Left to-do</span>
                  </div>
                )}
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
                <span className="px-2.5 py-1 rounded-md bg-secondary text-[11px] font-medium text-muted-foreground">
                  {c.date}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <TechListSheet
        open={openSheet === "live"}
        onOpenChange={(o) => !o && setOpenSheet(null)}
        title="Live · Left to-do"
        subtitle="Live visits still to-do"
        techs={liveTechs}
        badgeLabel="Visit pending"
        viewAllDocType="Visit"
      />
      <TechListSheet
        open={openSheet === "post"}
        onOpenChange={(o) => !o && setOpenSheet(null)}
        title="Post · Complete"
        subtitle="Post visits completed"
        techs={postTechs}
        badgeLabel="Complete"
        badgeTone="green"
        viewAllDocType="Visit"
      />
      <VRideQueueSheet
        open={openSheet === "vride"}
        onOpenChange={(o) => !o && setOpenSheet(null)}
      />
      <TechListSheet
        open={openSheet === "ride"}
        onOpenChange={(o) => !o && setOpenSheet(null)}
        title="Ride · Complete"
        subtitle="Ride-alongs completed"
        techs={rideTechs}
        badgeLabel="Complete"
        badgeTone="green"
        viewAllDocType="Visit"
      />
    </div>
  );
}

function TimeReportingCard() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ios-card p-4 flex items-center gap-3 w-full text-left active:opacity-60 transition-opacity"
      >
        <h3 className="text-base font-bold text-foreground flex-1">Time Reporting</h3>
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-[hsl(205_85%_55%)] text-white text-xs font-bold flex items-center justify-center">
            7
          </span>
          <span className="text-xs text-muted-foreground">Left to do</span>
        </div>
        <span className="px-2 py-1 rounded-full bg-destructive/10 text-destructive text-[10px] font-bold">2 Errors</span>
      </button>
      <TechListSheet
        open={open}
        onOpenChange={setOpen}
        title="Time Reporting · Left to-do"
        subtitle="Techs with timecards still to review"
        techs={technicians.slice(0, 7)}
        badgeLabel="Pending"
        badgeTone="orange"
      />
    </>
  );
}

function TeamScheduleCard() {
  const [tab, setTab] = useState<"Today" | "This Week">("Today");
  const [sheet, setSheet] = useState<null | { title: string; techs: SheetTech[]; badge: string; tone: "blue" | "orange" | "neutral" }>(null);
  return (
    <div className="ios-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-foreground">Team Schedule</h3>
      </div>
      <div className="flex bg-secondary rounded-full p-0.5 mb-3 w-fit">
        {(["Today", "This Week"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              tab === t ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <button
          type="button"
          onClick={() => setSheet({ title: "AM Shift", techs: technicians.slice(0, 5), badge: "AM", tone: "blue" })}
          className="rounded-2xl bg-gradient-to-br from-[hsl(205_85%_55%)] to-[hsl(220_70%_45%)] text-white p-3 text-left active:opacity-60 transition-opacity"
        >
          <Sun className="w-4 h-4 opacity-80" />
          <div className="text-3xl font-bold mt-1">13</div>
          <div className="text-[11px] opacity-90">AM Shift</div>
        </button>
        <button
          type="button"
          onClick={() => setSheet({ title: "PM Shift", techs: technicians.slice(2, 6), badge: "PM", tone: "neutral" })}
          className="rounded-2xl bg-gradient-to-br from-[hsl(220_30%_60%)] to-[hsl(230_30%_45%)] text-white p-3 text-left active:opacity-60 transition-opacity"
        >
          <Moon className="w-4 h-4 opacity-80" />
          <div className="text-3xl font-bold mt-1">6</div>
          <div className="text-[11px] opacity-90">PM Shift</div>
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { v: "3", l: "Vacations", tone: "blue" as const },
          { v: "3", l: "Call Outs", tone: "orange" as const },
          { v: "2", l: "No Shifts", tone: "neutral" as const },
          { v: "3", l: "Training", tone: "blue" as const },
          { v: "1", l: "Pending", tone: "orange" as const },
          { v: "4", l: "Leave", tone: "neutral" as const },
        ].map((s, i) => (
          <button
            key={s.l}
            type="button"
            onClick={() => setSheet({ title: s.l, techs: technicians.slice(i % 3, (i % 3) + Number(s.v)), badge: s.l, tone: s.tone })}
            className="rounded-xl bg-secondary p-2 text-center active:opacity-60 transition-opacity"
          >
            <div className="text-base font-bold text-foreground">{s.v}</div>
            <div className="text-[10px] text-muted-foreground">{s.l}</div>
          </button>
        ))}
      </div>
      {sheet && (
        <TechListSheet
          open={!!sheet}
          onOpenChange={(o) => !o && setSheet(null)}
          title={sheet.title}
          subtitle="Team members"
          techs={sheet.techs}
          badgeLabel={sheet.badge}
          badgeTone={sheet.tone}
        />
      )}
    </div>
  );
}

function GrowthPlansCard() {
  const navigate = useNavigate();
  const rows = [
    { num: 1, label: "Action", count: "3 Active Plans", color: "hsl(205 85% 55%)", techs: technicians.slice(0, 3), tone: "blue" as const },
    { num: 2, label: "Improve", count: "4 Active Plans", color: "hsl(25 95% 53%)", techs: technicians.slice(1, 5), tone: "orange" as const },
    { num: 3, label: "Corrective", count: "2 Active Plans", color: "hsl(0 84% 60%)", techs: technicians.slice(3, 5), tone: "red" as const },
  ];
  const [sheet, setSheet] = useState<number | null>(null);
  const active = rows.find((r) => r.num === sheet);
  return (
    <div className="ios-card p-4">
      <h3 className="text-base font-bold text-foreground mb-3">Growth Plans</h3>
      <div className="space-y-2">
        {rows.map((r) => (
          <button
            key={r.label}
            type="button"
            onClick={() => setSheet(r.num)}
            className="w-full flex items-center gap-3 py-1.5 text-left active:opacity-60 transition-opacity"
          >
            <span
              className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
              style={{ background: r.color }}
            >
              {r.num}
            </span>
            <span className="flex-1 text-sm font-medium text-foreground">{r.label}</span>
            <span className="text-xs font-semibold text-muted-foreground">{r.count}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => navigate("/team", { state: { tab: "Docs", docTypes: ["Growth Plan"] } })}
        className="mt-3 flex items-center gap-1 text-sm font-semibold text-[hsl(205_85%_55%)] active:opacity-60 transition-opacity"
      >
        <Plus className="w-4 h-4" /> Add New Plan
      </button>
      {active && (
        <TechListSheet
          open={sheet !== null}
          onOpenChange={(o) => !o && setSheet(null)}
          title={`${active.label} Plans`}
          subtitle={active.count}
          techs={active.techs}
          badgeLabel={active.label}
          badgeTone={active.tone}
          viewAllDocType="Growth Plan"
        />
      )}
    </div>
  );
}

function CoachingCard() {
  const items = [
    { label: "Performance", value: 4, tone: "blue" as const },
    { label: "Attendance", value: 5, tone: "orange" as const },
    { label: "Quality", value: 3, tone: "blue" as const },
    { label: "Safety", value: 4, tone: "red" as const },
    { label: "Conduct", value: 2, tone: "orange" as const },
    { label: "Other", value: 6, tone: "neutral" as const },
  ];
  const [sheet, setSheet] = useState<string | null>(null);
  const active = items.find((i) => i.label === sheet);
  return (
    <div className="ios-card p-4">
      <h3 className="text-base font-bold text-foreground mb-3">Coaching</h3>
      <div className="grid grid-cols-2 gap-2">
        {items.map((i) => (
          <button
            key={i.label}
            type="button"
            onClick={() => setSheet(i.label)}
            className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2.5 text-left active:opacity-60 transition-opacity"
          >
            <div>
              <p className="text-xs font-semibold text-foreground">{i.label}</p>
              <p className="text-[10px] text-muted-foreground">{i.value} Opportunities</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>
      {active && (
        <TechListSheet
          open={sheet !== null}
          onOpenChange={(o) => !o && setSheet(null)}
          title={`${active.label} Coaching`}
          subtitle={`${active.value} opportunities`}
          techs={technicians.slice(0, active.value)}
          badgeLabel="Opportunity"
          badgeTone={active.tone}
          viewAllDocType="Coaching"
        />
      )}
    </div>
  );
}

function TrainingCard() {
  const [tab, setTab] = useState<"This Month" | "All Training">("This Month");
  const [sheet, setSheet] = useState<null | "team" | "mine">(null);
  return (
    <div className="ios-card p-4">
      <h3 className="text-base font-bold text-foreground mb-3">Training</h3>
      <div className="flex bg-secondary rounded-full p-0.5 mb-3">
        {(["This Month", "All Training"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              tab === t ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        <button type="button" onClick={() => setSheet("team")} className="w-full text-left active:opacity-60 transition-opacity">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-foreground font-medium">Team</span>
            <span className="text-muted-foreground">2 Past Due · <span className="font-bold text-foreground">65%</span></span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-[hsl(205_85%_55%)] rounded-full" style={{ width: "65%" }} />
          </div>
        </button>
        <button type="button" onClick={() => setSheet("mine")} className="w-full text-left active:opacity-60 transition-opacity">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-foreground font-medium">My Training</span>
            <span className="text-muted-foreground">Due Soon · <span className="font-bold text-foreground">25%</span></span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-[hsl(25_95%_53%)] rounded-full" style={{ width: "25%" }} />
          </div>
        </button>
      </div>
      <TechListSheet
        open={sheet === "team"}
        onOpenChange={(o) => !o && setSheet(null)}
        title="Team Training"
        subtitle="2 past due · 65% complete"
        techs={technicians.slice(0, 5)}
        badgeLabel="Past Due"
        badgeTone="red"
      />
      <TechListSheet
        open={sheet === "mine"}
        onOpenChange={(o) => !o && setSheet(null)}
        title="My Training"
        subtitle="Due soon · 25% complete"
        techs={technicians.slice(0, 1)}
        badgeLabel="Due Soon"
        badgeTone="orange"
        showRecommended={false}
      />
    </div>
  );
}

function GpsAlertsCard() {
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<null | { title: string; techs: SheetTech[]; badge: string; tone: "red" | "orange" }>(null);
  return (
    <div className="ios-card overflow-hidden">
      <div className="px-4 pt-3 pb-2">
        <h3 className="text-base font-bold text-foreground">GPS Alerts</h3>
      </div>
      <button
        type="button"
        onClick={() => navigate("/map")}
        aria-label="Open map"
        className="relative h-32 w-full block overflow-hidden active:opacity-80 transition-opacity"
      >
        {/* Cropped map preview mirroring /map */}
        <img
          src={mapBg}
          alt="Map preview"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "50% 35%" }}
        />
        <div className="absolute top-3 left-4 bg-white/90 px-2 py-0.5 rounded text-[10px] font-semibold">Whittier</div>
        <MapPin className="absolute top-6 left-12 w-5 h-5 text-destructive fill-destructive/30" />
        <MapPin className="absolute bottom-6 right-16 w-5 h-5 text-warning fill-warning/30" />
      </button>
      <div className="grid grid-cols-3 divide-x divide-[hsl(var(--ios-separator))] border-t border-[hsl(var(--ios-separator))]">
        {[
          { v: "5", l: "GPS Issues", color: "destructive", tone: "red" as const },
          { v: "3", l: "Speeding", color: "warning", tone: "orange" as const },
          { v: "1", l: "Idling", color: "warning", tone: "orange" as const },
        ].map((s) => (
          <button
            key={s.l}
            type="button"
            onClick={() => setSheet({ title: s.l, techs: technicians.slice(0, Number(s.v)), badge: s.l, tone: s.tone })}
            className="px-3 py-2.5 flex items-center justify-center gap-2 active:opacity-60 transition-opacity"
          >
            <span
              className={`w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center ${
                s.color === "destructive" ? "bg-destructive" : "bg-warning"
              }`}
            >
              {s.v}
            </span>
            <span className="text-[10px] text-muted-foreground">{s.l}</span>
          </button>
        ))}
      </div>
      {sheet && (
        <TechListSheet
          open={!!sheet}
          onOpenChange={(o) => !o && setSheet(null)}
          title={sheet.title}
          subtitle="Affected technicians"
          techs={sheet.techs}
          badgeLabel={sheet.badge}
          badgeTone={sheet.tone}
        />
      )}
    </div>
  );
}

function VoiceOfCustomerCard() {
  const [sheet, setSheet] = useState<null | { title: string; techs: SheetTech[]; badge: string; tone: "green" | "orange" | "red" }>(null);
  const stats = [
    { Icon: ThumbsUp, v: 10, color: "text-success", label: "Positive", tone: "green" as const },
    { Icon: Meh, v: 3, color: "text-warning", label: "Neutral", tone: "orange" as const },
    { Icon: ThumbsDown, v: 1, color: "text-destructive", label: "Negative", tone: "red" as const },
  ];
  return (
    <div className="ios-card p-4">
      <h3 className="text-base font-bold text-foreground mb-3">Voice of the Customer</h3>
      <div className="flex items-center justify-around">
        {stats.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSheet({ title: `${s.label} Feedback`, techs: technicians.slice(0, Math.min(s.v, 5)), badge: s.label, tone: s.tone })}
            className="flex items-center gap-2 active:opacity-60 transition-opacity"
          >
            <s.Icon className={`w-5 h-5 ${s.color}`} />
            <span className="text-lg font-bold text-foreground">{s.v}</span>
          </button>
        ))}
      </div>
      {sheet && (
        <TechListSheet
          open={!!sheet}
          onOpenChange={(o) => !o && setSheet(null)}
          title={sheet.title}
          subtitle="Customer feedback received"
          techs={sheet.techs}
          badgeLabel={sheet.badge}
          badgeTone={sheet.tone}
        />
      )}
    </div>
  );
}

export function HomeView() {
  const navigate = useNavigate();
  const [dispatchedTab, setDispatchedTab] = useState<"Team" | "Turf">("Team");
  return (
    <div data-view-name="Dashboard" className="min-h-screen bg-background pb-32 overflow-y-auto no-scrollbar">
      <HeroHeader />

      {/* Recommended Visit horizontal scroll */}
      <div className="px-4 -mt-4 relative z-10">
        <div className="flex gap-3 overflow-x-auto overflow-y-visible no-scrollbar snap-x pb-3 -mb-3">
          <RecommendedVisitCard techId="t1" eta="9 min" status="Onsite · 5 min ago" />
          <RecommendedVisitCard techId="t4" eta="14 min" status="En route · 2 min ago" />
          <RecommendedVisitCard techId="t8" eta="22 min" status="Onsite · 12 min ago" />
        </div>
      </div>

      <div className="px-4 mt-6 space-y-5">
        {/* What's New */}
        <section>
          <SectionTitle title="What's New" />
          <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x -mr-4 pr-4">
            <WhatsNewCard image={whatsNewBanner} tag="TODAY, AUG 3" title="AT&T Field Operations: We…" onClick={() => navigate("/news/happy-250th-birthday")} />
            <WhatsNewCard image={whatsNew1} tag="AUG 5" title="New Safety Protocols Live" onClick={() => navigate("/news/ac-fvd-safety")} />
          </div>
        </section>

        {/* Summary */}
        <section>
          <SectionTitle title="Summary" />
          <SummaryCard />
        </section>

        {/* Celebrations */}
        <section>
          <CelebrationsCard />
        </section>

        {/* Recognition */}
        <section>
          <SectionTitle title="Recognition" action="See All" onAction={() => navigate("/team", { state: { tab: "Docs", docTypes: ["Recognition"] } })} />
          <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x -mx-4 px-4">
            {technicians.slice(0, 4).map((t) => (
              <RecognitionCard key={t.id} id={t.id} name={t.name.split(" ")[0]} avatar={t.avatarUrl} />
            ))}
          </div>
        </section>

        {/* Dispatched */}
        <section>
          <SectionTitle title="Dispatched" action="See All" onAction={() => navigate("/team")} />
          <div className="ios-card divide-y divide-[hsl(var(--ios-separator))] overflow-hidden">
            <div className="px-4 pt-3">
              <div className="flex bg-secondary rounded-full p-0.5 w-full">
                {(["Team", "Turf"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDispatchedTab(t)}
                    className={`flex-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      dispatchedTab === t ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <DispatchedRow
              tech={{ id: "tech-1", name: "Gabriel Sinclair", role: "Premise Tech II", avatarUrl: avatar(12) }}
              jobType="Install"
              time="3.5 mi"
              startedAt="9:06 AM"
              elapsed={11}
              est={150}
            />
            <DispatchedRow
              tech={{ id: "tech-2", name: "Lucas Brooks", role: "Premise Tech III", avatarUrl: avatar(13) }}
              jobType="Install"
              time="9.4 mi"
              startedAt="9:20 AM"
              elapsed={45}
              est={150}
            />
            <DispatchedRow
              tech={{ id: "tech-3", name: "Juan Benni", role: "Senior Tech", avatarUrl: avatar(14) }}
              jobType="Repair"
              time="14.4 mi"
              startedAt="8:34 AM"
              elapsed={90}
              est={150}
            />
          </div>
        </section>

        <PerformanceCard />
        <FieldVisitsCard />
        <TimeReportingCard />
        <TeamScheduleCard />
        <GrowthPlansCard />
        <CoachingCard />
        <TrainingCard />
        <GpsAlertsCard />
        <VoiceOfCustomerCard />

        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => toast({ title: "Customize dashboard", description: "Reordering and hiding cards is coming soon." })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[hsl(var(--ios-separator))] text-sm font-semibold text-foreground bg-[hsl(var(--ios-group-bg))] active:opacity-60 transition-opacity"
          >
            <Settings2 className="w-4 h-4" />
            Customize
          </button>
        </div>
      </div>
    </div>
  );
}
