import { useParams } from "react-router-dom";
import { useGuardedNavigate } from "@/lib/routes";
import {
  ChevronRight,
  Navigation,
  MessageSquare,
  Megaphone,
  Clock,
  Wrench,
  Truck,
  Car,
  FileText,
  AlertCircle,
  Triangle,
  Circle,
  Droplet,
} from "lucide-react";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { BackButton } from "@/components/dashboard/BackButton";
import { cn } from "@/lib/utils";

const TABS = ["Overview", "Performance", "Visits", "Vehicle"] as const;

const REGULATORY = [
  { label: "Insurance", date: "Dec 1", overdue: false },
  { label: "Registration", date: "Dec 1", overdue: false },
  { label: "Inspection", date: "Aug 31", overdue: true },
  { label: "Emissions", date: "Nov 15", overdue: false },
];

const HEALTH = [
  { label: "Fuel Level", value: "GOOD", Icon: Triangle },
  { label: "Tire Air Pressure", value: "GOOD", Icon: Circle },
  { label: "Oil Level", value: "GOOD", Icon: Droplet },
];

const TechVehicle = () => {
  const navigate = useGuardedNavigate();
  const { id } = useParams<{ id: string }>();
  const techId = id ?? "II";
  const initials = "II";
  const name = "Ignacio Ibarra";

  return (
    <div data-view-name="Tech Vehicle" className="min-h-screen w-full flex justify-center bg-[#0a0a0c] py-6">
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
              onClick={() => navigate(`/tech/${techId}`)}
              className="flex items-center gap-3 w-full text-left"
            >
              <div className="w-10 h-10 rounded-full bg-[hsl(28,70%,55%)] flex items-center justify-center text-white text-[13px] font-semibold">
                {initials}
              </div>
              <div className="flex-1 flex items-center gap-1">
                <span className="text-[17px] font-semibold">{name}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>

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
          <section className="px-4 mt-3">
            <div className="rounded-tile bg-card shadow-sm flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-destructive/15 flex items-center justify-center">
                <Clock className="w-4 h-4 text-destructive" />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold">ATND</div>
                <div className="text-[12px] text-muted-foreground">5.5 hours on 07/07/25</div>
              </div>
              <button type="button" className="text-primary text-[14px] font-semibold">
                Resolve
              </button>
            </div>
          </section>

          {/* Tabs */}
          <section className="px-4 mt-4">
            <div className="flex items-center gap-5 border-b border-border">
              {TABS.map((t) => {
                const active = t === "Vehicle";
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      if (t === "Overview") navigate(`/tech/${techId}`);
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

          {/* Sub-tabs */}
          <section className="px-4 mt-4">
            <div className="grid grid-cols-2 p-0.5 rounded-pill bg-muted text-[13px] font-medium">
              <button className="py-1.5 rounded-pill text-muted-foreground">
                Path Tracking
              </button>
              <button className="py-1.5 rounded-pill bg-card text-foreground shadow-sm">
                Status
              </button>
            </div>
          </section>

          {/* Vehicle ID card */}
          <section className="px-4 mt-3">
            <button
              type="button"
              className="w-full text-left rounded-tile bg-card shadow-sm p-4 flex items-center gap-3"
            >
              <div className="flex-1">
                <div className="text-[24px] font-bold leading-tight">1011242-124</div>
                <div className="text-[14px] text-muted-foreground mt-0.5">Chevy - Van</div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </section>

          {/* Open Tickets */}
          <section className="px-4 mt-2">
            <button
              type="button"
              className="w-full text-left rounded-tile bg-card shadow-sm p-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-tile bg-primary/10 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold">0 Open Tickets</div>
                <div className="text-[12px] text-muted-foreground">7 Previous in History</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </section>

          {/* Status */}
          <section className="px-4 mt-5">
            <h2 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-1 mb-2">
              Status
            </h2>
            <div className="rounded-tile bg-card shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-tile bg-success/15 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-success" />
                </div>
                <div className="flex-1">
                  <div className="text-[12px] text-muted-foreground">Driving</div>
                  <div className="text-[15px] font-semibold">130 Main St.</div>
                </div>
                <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-primary-foreground" />
                </button>
              </div>
              <div className="border-t border-border flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-tile bg-primary/10 flex items-center justify-center">
                  <Car className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-[12px] text-muted-foreground">Last GPS Issue</div>
                  <div className="text-[15px] font-semibold">Apr 23 · 8:14 AM</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </section>

          {/* Regulatory */}
          <section className="mt-5">
            <h2 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase px-5 mb-2">
              Regulatory
            </h2>
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
              {REGULATORY.map((r, i) => (
                <div
                  key={i}
                  className="shrink-0 w-[110px] rounded-tile bg-card p-3 shadow-sm flex flex-col items-center"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-[13px] font-bold mt-2">{r.label}</div>
                  <div
                    className={cn(
                      "mt-2 inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[11px] font-semibold",
                      r.overdue
                        ? "bg-destructive/15 text-destructive"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {r.overdue ? <AlertCircle className="w-3 h-3" /> : null}
                    {r.date}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section Header / Vehicle Health */}
          <section className="px-4 mt-5">
            <h2 className="text-[15px] font-semibold text-muted-foreground px-1 mb-2">
              Section Header
            </h2>
            <div className="rounded-tile bg-card shadow-sm overflow-hidden">
              {HEALTH.map((h, i) => (
                <div
                  key={h.label}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3",
                    i !== 0 && "border-t border-border",
                  )}
                >
                  <div className="w-9 h-9 rounded-tile bg-primary/10 flex items-center justify-center">
                    <h.Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] text-muted-foreground">{h.label}</div>
                    <div className="text-[15px] font-semibold">{h.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default TechVehicle;
