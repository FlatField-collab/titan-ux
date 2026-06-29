import { useGuardedNavigate } from "@/lib/routes";
import { ChevronRight } from "lucide-react";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { BackButton } from "@/components/dashboard/BackButton";
import { NEWS_ARTICLES } from "@/data/newsArticles";
import { cn } from "@/lib/utils";

const toneClass = (tone: "green" | "blue" | "orange") =>
  tone === "green"
    ? "text-[#5BA532]"
    : tone === "blue"
    ? "text-[#1A8FE3]"
    : "text-warning";

const News = () => {
  const navigate = useGuardedNavigate();

  return (
    <div data-view-name="News" className="min-h-screen w-full flex justify-center bg-[#0a0a0c] py-6">
      <div
        className="relative w-[393px] max-w-full bg-[#F2F2F6] rounded-[44px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-white/5"
        style={{ minHeight: 844 }}
      >
        <main className="relative h-[852px] overflow-y-auto no-scrollbar pb-28 bg-[#F2F2F6]">
          <StatusBar />

          <div className="px-4 pt-2"><BackButton /></div>

          <header className="flex items-center justify-between px-4 pt-2 pb-3">
            <h1 className="text-[34px] font-bold tracking-tight">News</h1>
          </header>

          <section className="px-4">
            <div className="rounded-[20px] bg-card shadow-sm divide-y divide-separator overflow-hidden">
              {NEWS_ARTICLES.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => navigate(`/news/${a.id}`)}
                  className="w-full text-left p-4 active:opacity-70 flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-[12px] font-semibold uppercase tracking-wide", toneClass(a.categoryTone))}>
                        {a.category}
                      </span>
                      <span className="text-[12px] text-muted-foreground">·</span>
                      <span className="text-[12px] text-muted-foreground">{a.publishedOn}</span>
                    </div>
                    <div className="text-[16px] font-bold text-foreground leading-tight">
                      {a.title}
                    </div>
                    <p className="text-[13px] text-muted-foreground mt-1 line-clamp-2">
                      {a.snippet}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                </button>
              ))}
            </div>
          </section>
        </main>
        <div className="absolute inset-x-0 bottom-[6px] z-40 flex justify-center px-8 [&>nav]:!static [&>nav]:!translate-x-0 [&>nav]:!w-full">
        </div>
      </div>
    </div>
  );
};

export default News;
