
import { useGuardedNavigate } from "@/lib/routes";
import { useLocation } from "react-router-dom";
import { ChevronLeft, Share, MoreHorizontal, CheckCircle2, ChevronRight, Plus, ArrowUp, Image as ImageIcon } from "lucide-react";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { cn } from "@/lib/utils";
import { avatar } from "@/assets/avatars";

const coaching = [
  {
    title: "PPE",
    desc: "Reminded Gabriel to wear proper PPE, including a hardhat, while working aloft.",
  },
  {
    title: "Customer Communication",
    desc: "Encourage use of new exit dialogue to inform customers about the survey and check for immediate feedback.",
  },
];

const observations = [
  { label: "Qualify to Terminal", count: 3 },
  { label: "Survey Premises", count: 2 },
  { label: "Extend", count: 1 },
];

const mediaImages = [
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300&h=300&fit=crop",
];

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[22px] font-bold tracking-tight text-foreground px-1 mb-3">{children}</h2>
);

const AddLink = ({ children }: { children: React.ReactNode }) => (
  <button className="flex items-center gap-1.5 px-4 py-3.5 text-primary text-[15px] font-semibold w-full text-left">
    <Plus className="w-4 h-4" strokeWidth={2.5} />
    {children}
  </button>
);

const DocsDetail = () => {
  const navigate = useGuardedNavigate();
  const { pathname } = useLocation();
  const viewName = pathname.startsWith("/visits") ? "Visit Detail" : "Docs Detail";

  return (
    <div data-view-name={viewName} className="min-h-screen w-full flex justify-center bg-[#0a0a0c] py-6">
      <div
        className="relative w-[393px] max-w-full bg-[#F2F2F6] rounded-[44px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-white/5"
        style={{ minHeight: 844 }}
      >
        <main className="relative h-[852px] overflow-y-auto no-scrollbar pb-28 bg-[#F2F2F6]">
          <StatusBar />

          {/* Header */}
          <header className="grid grid-cols-[40px_1fr_40px] items-center px-4 pt-2 pb-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-card shadow-sm flex items-center justify-center"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-[17px] font-semibold text-center text-foreground">Visit Details</h1>
            <button
              className="w-10 h-10 rounded-full bg-card shadow-sm flex items-center justify-center"
              aria-label="Share"
            >
              <Share className="w-4.5 h-4.5 text-foreground" />
            </button>
          </header>

          {/* Summary card */}
          <section className="px-4 mb-5">
            <div className="rounded-[20px] bg-card shadow-sm p-4">
              <div className="flex items-start gap-3">
                <img
                  src={avatar(12)}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[17px] font-bold text-foreground">Ignacio Ibarra</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="inline-flex items-center rounded-pill bg-[#0b1f3a] text-white px-2.5 py-0.5 text-[11px] font-semibold">
                      Live Visit
                    </span>
                    <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      Feb 22, 2026
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-[14px] text-foreground">1247 Oak Valley Drive, Austin, TX</div>
              <div className="text-[12px] text-muted-foreground mt-0.5">BAN: 482910</div>
            </div>
          </section>

          {/* Recognition */}
          <section className="px-4 mb-6">
            <SectionTitle>Recognition</SectionTitle>
            <div className="rounded-[20px] bg-card shadow-sm">
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-foreground">Customer Interaction</div>
                    <p className="text-[13px] text-muted-foreground mt-1 leading-snug">
                      Recognized Gabriel for explaining the issue and next steps clearly and maintaining a professional presence in the customer's home.
                    </p>
                  </div>
                  <button className="p-1 text-muted-foreground" aria-label="More">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 rounded-pill bg-success/15 text-success px-2.5 py-1 text-[12px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Added
                </span>
              </div>
              <div className="border-t border-separator">
                <AddLink>Add New Recognition</AddLink>
              </div>
            </div>
          </section>

          {/* Coaching */}
          <section className="px-4 mb-6">
            <SectionTitle>Coaching</SectionTitle>
            <div className="rounded-[20px] bg-card shadow-sm divide-y divide-separator">
              {coaching.map((c) => (
                <div key={c.title} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-bold text-foreground">{c.title}</div>
                      <p className="text-[13px] text-muted-foreground mt-1 leading-snug">{c.desc}</p>
                    </div>
                    <button className="p-1 text-muted-foreground" aria-label="More">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  <button className="mt-3 inline-flex items-center rounded-pill bg-muted text-foreground px-3 py-1.5 text-[12px] font-semibold">
                    Mark as Complete
                  </button>
                </div>
              ))}
              <AddLink>Add New Coaching</AddLink>
            </div>
          </section>

          {/* Growth Plans */}
          <section className="px-4 mb-6">
            <SectionTitle>Growth Plans</SectionTitle>
            <div className="rounded-[20px] bg-card shadow-sm">
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center rounded-pill bg-warning/15 text-warning px-2.5 py-0.5 text-[11px] font-semibold">
                        Improve
                      </span>
                      <span className="inline-flex items-center gap-0.5 rounded-pill bg-muted text-muted-foreground px-2.5 py-0.5 text-[11px] font-semibold">
                        <ArrowUp className="w-3 h-3" />
                        Elevated from Action
                      </span>
                    </div>
                    <div className="text-[15px] font-bold text-foreground">Installation Concerns</div>
                    <p className="text-[13px] text-muted-foreground mt-1 leading-snug">
                      Elevating to an <span className="font-semibold text-foreground">Improve Growth Plan</span> to reinforce best practices around using suitable anchors and sealing holes during installations.
                    </p>
                  </div>
                  <button className="p-1 text-muted-foreground" aria-label="More">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="border-t border-separator">
                <AddLink>Add New Plan</AddLink>
              </div>
            </div>
          </section>

          {/* Additional Observations */}
          <section className="px-4 mb-6">
            <SectionTitle>Additional Observations</SectionTitle>
            <div className="rounded-[20px] bg-card shadow-sm divide-y divide-separator">
              {observations.map((o) => (
                <div key={o.label} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="flex-1 text-[15px] text-foreground">{o.label}</div>
                  <span className="inline-flex items-center justify-center min-w-[24px] h-6 rounded-full bg-muted text-muted-foreground px-2 text-[12px] font-semibold">
                    {o.count}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
              <AddLink>Add New Observation</AddLink>
            </div>
          </section>

          {/* Media */}
          <section className="pl-4 mb-6">
            <div className="rounded-[20px] bg-card shadow-sm p-4 mr-4">
              <h2 className="text-[17px] font-bold text-foreground mb-3">Media</h2>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                <div className="shrink-0 w-20 h-20 rounded-[12px] bg-muted flex items-center justify-center">
                  <ImageIcon className="w-7 h-7 text-muted-foreground" />
                </div>
                {mediaImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="shrink-0 w-20 h-20 rounded-[12px] object-cover bg-muted"
                  />
                ))}
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default DocsDetail;
