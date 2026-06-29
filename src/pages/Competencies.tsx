import { useState, useEffect } from "react";
import { useGuardedNavigate } from "@/lib/routes";
import { useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, MoreHorizontal, Calendar, Info, MessageCircle, CheckCircle2, X, Loader2 } from "lucide-react";
import { StatusBar } from "@/components/dashboard/StatusBar";
import lucasBrooksAvatar from "@/assets/lucas-brooks-avatar.png";
import { avatar } from "@/assets/avatars";

type Tech = {
  id: string;
  name: string;
  attuid: string;
  status: string;
  avatar: string;
};

const techs: Tech[] = [
  { id: "gabriel", name: "Gabriel Sinclair", attuid: "gr458s", status: "Not Started", avatar: avatar(12) },
  { id: "lucas", name: "Lucas Brooks", attuid: "lu405b", status: "In Progress", avatar: lucasBrooksAvatar },
  { id: "stephan", name: "Stephan Osco", attuid: "so221k", status: "Not Started", avatar: avatar(15) },
  { id: "peter", name: "Peter Angelakos", attuid: "pa309m", status: "In Progress", avatar: avatar(23) },
];

const reminderContacts = [
  { name: "Gabriel Sinclair", avatar: avatar(12) },
  { name: "Kevin Leong", avatar: avatar(26) },
  { name: "Sandy and Kevin", avatar: avatar(16) },
  { name: "Juliana Mejia", avatar: avatar(30) },
  { name: "Greg Apo", avatar: avatar(57) },
];

const reminderApps = [
  { name: "Messages", bg: "bg-[#34c759]", glyph: "💬" },
  { name: "Outlook", bg: "bg-white", glyph: "📧" },
  { name: "Teams", bg: "bg-white", glyph: "👥" },
  { name: "Viva Engage", bg: "bg-white", glyph: "💠" },
];

const Competencies = () => {
  const navigate = useGuardedNavigate();
  const location = useLocation();
  const [toastVisible, setToastVisible] = useState(false);
  const [insightsTech, setInsightsTech] = useState<Tech | null>(null);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);
  const [pendingResolveId, setPendingResolveId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const sendOpen = location.pathname === "/competency/send";

  // Close insights when send sheet opens
  useEffect(() => {
    if (sendOpen) setInsightsTech(null);
  }, [sendOpen]);

  const [toastFading, setToastFading] = useState(false);

  const handleManualResolve = () => {
    if (insightsTech) setPendingResolveId(insightsTech.id);
    setInsightsTech(null);
    setToastFading(false);
    setToastVisible(true);
  };

  useEffect(() => {
    if (!toastVisible) return;
    const fadeTimer = setTimeout(() => setToastFading(true), 1700);
    const removeTimer = setTimeout(() => {
      setToastVisible(false);
      setToastFading(false);
      if (pendingResolveId) {
        setRefreshing(true);
        setTimeout(() => {
          setResolvedIds((prev) => [...prev, pendingResolveId]);
          setPendingResolveId(null);
          setRefreshing(false);
        }, 900);
      }
    }, 2000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [toastVisible, pendingResolveId]);

  const handleSendReminderFromInsights = () => {
    setInsightsTech(null);
    navigate("/competency/send");
  };

  const closeSend = () => navigate("/competencies");

  const viewName =
    location.pathname === "/competency/send"
      ? "Competency Send"
      : location.pathname.startsWith("/competency/")
      ? "Competency Detail"
      : "Competencies";

  return (
    <div data-view-name={viewName} className="min-h-screen w-full flex justify-center bg-[#0a0a0c] py-6">
      <div
        className="relative w-[393px] max-w-full bg-[#F2F2F6] rounded-[44px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-white/5"
        style={{ minHeight: 874 }}
      >
        <main className="relative h-[874px] overflow-y-auto no-scrollbar pb-28 bg-[#F2F2F6]">
          <StatusBar />

          {/* Header */}
          <header className="grid grid-cols-[40px_1fr_40px] items-center px-4 pt-2 pb-4">
            <button
              onClick={() => navigate("/docs")}
              className="w-10 h-10 rounded-full bg-card shadow-sm flex items-center justify-center"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-[17px] font-semibold text-center text-foreground">Competency</h1>
            <button
              className="w-10 h-10 rounded-full bg-card shadow-sm flex items-center justify-center"
              aria-label="More"
            >
              <MoreHorizontal className="w-5 h-5 text-foreground" />
            </button>
          </header>

          {/* Summary row */}
          <section className="px-4 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Calendar className="w-4 h-4 text-foreground shrink-0" />
                <span className="text-[15px] font-bold text-foreground truncate">Defensive Driving Qual</span>
              </div>
              <span className="text-[13px] text-muted-foreground shrink-0">Due April</span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: "55%" }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-[13px] text-muted-foreground">
              <span>2 TO-DOs</span>
              <span>9 of 11 Techs</span>
            </div>
          </section>

          <div className="mx-4 h-px bg-separator" />

          {/* Overdue alert banner */}
          <section className="px-4 mt-4">
            <div className="rounded-[20px] bg-[#2c2c2e] text-white p-4">
              <div className="text-[15px] font-bold leading-snug">Defensive Driving Competency is Overdue</div>
              <div className="text-[15px] font-bold leading-snug">Notify technicians to complete</div>
              <div className="my-3 h-px bg-white/15" />
              <button
                onClick={() => navigate("/competency/send")}
                className="text-[15px] font-semibold text-[#5ac8fa]"
              >
                Send Reminder to Techs Remaining
              </button>
            </div>
          </section>

          {/* Competency Due cards */}
          <section className="px-4 mt-4 space-y-3">
            {techs.filter((t) => !resolvedIds.includes(t.id)).map((t) => (
              <div key={t.id} className="rounded-[20px] bg-card shadow-sm p-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center">
                      <Info className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </span>
                    <span className="text-[15px] font-bold text-foreground">Competency Due</span>
                  </div>
                  <button
                    aria-label="Insights"
                    className="text-primary"
                    onClick={() => setInsightsTech(t)}
                  >
                    <MessageCircle className="w-5 h-5" strokeWidth={2.2} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div className="min-w-0">
                    <div className="text-[15px] font-bold text-foreground truncate">{t.name}</div>
                    <div className="text-[13px] text-muted-foreground">ATTUID: {t.attuid}</div>
                    <div className="text-[13px] text-muted-foreground">{t.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Refresh overlay */}
          {refreshing && (
            <div className="fixed inset-x-0 z-40 flex justify-center pointer-events-none" style={{ bottom: "120px" }}>
              <div className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-4 py-2 shadow-md">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-[13px] font-medium text-foreground">Refreshing…</span>
              </div>
            </div>
          )}

          {/* Toast */}
          {toastVisible && (
            <div
              className="fixed left-0 right-0 z-40 flex justify-center px-4 transition-opacity duration-300 ease-out pointer-events-none"
              style={{ bottom: "88px", opacity: toastFading ? 0 : 1 }}
            >
              <div className="flex items-center gap-2 rounded-[16px] bg-[#2c2c2e] text-white px-4 py-3 shadow-lg w-[370px] max-w-full pointer-events-auto">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                <div className="flex-1 text-[13px] font-medium">
                  Defensive Driving Qual Competency marked Complete for Gabriel
                </div>
                <button onClick={() => setToastVisible(false)} aria-label="Dismiss">
                  <X className="w-4 h-4 text-white/80" />
                </button>
              </div>
            </div>
          )}



          {/* Insights bottom sheet */}
          {insightsTech && (
            <>
              <div
                className="absolute inset-0 z-50 bg-black/40"
                onClick={() => setInsightsTech(null)}
                aria-label="Close insights"
              />
              <div className="absolute left-0 right-0 bottom-0 z-50 bg-[#F2F2F6] rounded-t-[24px] p-4 pb-6 animate-in slide-in-from-bottom duration-300">
                <div className="mx-auto h-1.5 w-10 rounded-full bg-black/20 mb-3" />
                <div className="grid grid-cols-[40px_1fr_40px] items-center mb-4">
                  <div />
                  <h2 className="text-[17px] font-semibold text-center text-foreground">Insights</h2>
                  <button
                    onClick={() => setInsightsTech(null)}
                    className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center justify-self-end"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-foreground" />
                  </button>
                </div>

                {/* Tech row */}
                <button
                  onClick={() => navigate(`/tech/${insightsTech.id}`)}
                  className="w-full flex items-center gap-3 px-1 py-2 text-left"
                >
                  <img src={insightsTech.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[15px] font-bold text-foreground truncate">{insightsTech.name}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-[13px] text-muted-foreground">ATTUID: {insightsTech.attuid}</div>
                  </div>
                </button>

                <div className="text-[12px] font-semibold text-muted-foreground tracking-wide mt-3 mb-2 px-1">TODAY</div>

                <div className="rounded-[20px] bg-card shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-destructive shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[15px] font-bold text-foreground">Competency Overdue</div>
                      <div className="text-[13px] text-muted-foreground mt-1">
                        {insightsTech.name.split(" ")[0]} has not completed the Defensive Driving Qual competency training due in March.
                      </div>
                    </div>
                  </div>
                  <div className="my-3 h-px bg-separator" />
                  <button
                    onClick={handleManualResolve}
                    className="w-full text-left text-[15px] font-semibold text-primary py-1"
                  >
                    Manually Resolve
                  </button>
                  <div className="my-2 h-px bg-separator" />
                  <button
                    onClick={handleSendReminderFromInsights}
                    className="w-full text-left text-[15px] font-semibold text-primary py-1"
                  >
                    Send Reminder
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Send Reminder sheet */}
          {sendOpen && (
            <>
              <div
                className="absolute inset-0 z-50 bg-black/40"
                onClick={closeSend}
                aria-label="Close send reminder"
              />
              <div className="absolute left-0 right-0 bottom-0 z-50 bg-[#F2F2F6] rounded-t-[24px] pb-6 animate-in slide-in-from-bottom duration-300">
                <div className="mx-auto h-1.5 w-10 rounded-full bg-black/20 mt-2 mb-3" />
                <div className="px-5 pb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[20px] font-bold text-foreground leading-tight">Send Reminder</div>
                    <div className="text-[15px] text-muted-foreground">Gabriel Sinclair</div>
                  </div>
                  <button
                    onClick={closeSend}
                    className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center shrink-0"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-foreground" />
                  </button>
                </div>

                <div className="h-px bg-separator" />

                {/* Contacts row */}
                <div className="overflow-x-auto no-scrollbar py-4">
                  <div className="flex items-start gap-4 px-5 min-w-max">
                    {reminderContacts.map((c) => (
                      <div key={c.name} className="w-[64px] flex flex-col items-center text-center">
                        <div className="relative">
                          <img src={c.avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
                          <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-md bg-[#34c759] flex items-center justify-center text-white text-[10px]">
                            💬
                          </span>
                        </div>
                        <div className="mt-2 text-[12px] text-foreground leading-tight">{c.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-separator" />

                {/* Apps row */}
                <div className="px-5 py-4 flex items-start gap-4">
                  {reminderApps.map((a) => (
                    <div key={a.name} className="flex flex-col items-center w-[64px]">
                      <div className={`w-14 h-14 rounded-[14px] ${a.bg} shadow-sm flex items-center justify-center text-2xl`}>
                        <span>{a.glyph}</span>
                      </div>
                      <div className="mt-2 text-[12px] text-foreground text-center leading-tight">{a.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>

      </div>
    </div>
  );
};

export default Competencies;
