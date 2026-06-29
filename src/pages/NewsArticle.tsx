import { useParams } from "react-router-dom";
import { useGuardedNavigate } from "@/lib/routes";
import { Link2 } from "lucide-react";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { BackButton } from "@/components/dashboard/BackButton";
import { getArticle, type BulletNode, type NewsArticle } from "@/data/newsArticles";
import { cn } from "@/lib/utils";

const toneClass = (tone: "green" | "blue" | "orange") =>
  tone === "green"
    ? "text-[#5BA532]"
    : tone === "blue"
    ? "text-[#1A8FE3]"
    : "text-warning";

/** Render inline markdown-ish: **bold**, *italic*. */
const renderInline = (text: string) => {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={key++} className="font-bold text-foreground">{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<em key={key++} className="italic underline decoration-foreground/40">{token.slice(1, -1)}</em>);
    }
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
};

const Bullets = ({ items, nested = false }: { items: BulletNode[]; nested?: boolean }) => (
  <ul className={cn("space-y-1.5", nested ? "mt-1.5 ml-5" : "mt-2 ml-4")}>
    {items.map((b, i) => (
      <li key={i} className="text-[14px] text-foreground/85 leading-relaxed list-disc pl-1 marker:text-foreground/60">
        <span>{renderInline(b.text)}</span>
        {b.children && b.children.length > 0 && (
          <ul className="mt-1 ml-4 space-y-1">
            {b.children.map((c, j) => (
              <li
                key={j}
                className="text-[14px] text-foreground/85 leading-relaxed list-[circle] pl-1 marker:text-foreground/50"
              >
                {renderInline(c.text)}
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
  </ul>
);

const SafetyBulletin = ({ a }: { a: NewsArticle }) => (
  <article className="px-5 pt-2 pb-6">
    <div className="text-center mb-5">
      <div className="text-[11px] font-semibold text-[#1A8FE3] tracking-wide">AT&amp;T</div>
      <div className="text-[20px] font-bold text-foreground leading-tight">{a.orgLockup}</div>
    </div>

    {a.intro && (
      <p className="text-[14px] text-foreground/85 leading-relaxed mb-5">
        {renderInline(a.intro)}
      </p>
    )}

    {a.sections?.map((s, i) => (
      <section key={i} className="mb-5">
        {s.heading && (
          <h2 className="text-[20px] font-semibold text-[#1A8FE3] mb-2">{s.heading}</h2>
        )}
        {s.paragraph && (
          <p className="text-[14px] text-foreground/85 leading-relaxed">
            {renderInline(s.paragraph)}
          </p>
        )}
        {s.bullets && s.bullets.length > 0 && <Bullets items={s.bullets} />}
        {s.trailing && (
          <p className="text-[14px] text-foreground/85 leading-relaxed mt-3">
            {renderInline(s.trailing)}
          </p>
        )}
      </section>
    ))}

    {a.resources && (
      <div className="pt-3 text-[14px]">
        <span className="font-bold text-foreground">Resources: </span>
        <span className="text-[#1A8FE3] underline">{a.resources.label}</span>
      </div>
    )}
  </article>
);

const CommsPost = ({ a }: { a: NewsArticle }) => (
  <article className="px-5 pt-2 pb-6">
    <div className="flex items-center gap-2 text-[12px] mb-1">
      <span className={cn("font-semibold", toneClass(a.categoryTone))}>
        {a.categoryFull ?? a.category}
      </span>
      <span className="text-muted-foreground">Published on: {a.publishedOn}</span>
    </div>
    <div className="flex items-start justify-between gap-2 border-b border-dashed border-border pb-3 mb-4">
      <h1 className="text-[22px] font-bold text-foreground leading-tight">{a.title}</h1>
      <button
        type="button"
        className="w-8 h-8 rounded-md border border-border bg-card flex items-center justify-center shrink-0"
        aria-label="Copy link"
      >
        <Link2 className="w-4 h-4 text-foreground/70" />
      </button>
    </div>

    <dl className="space-y-2 mb-5">
      {[
        ["WHO", a.who],
        ["WHEN", a.when],
        ["WHERE", a.where],
        ["WHY THIS MATTERS", a.why],
      ].map(([k, v]) =>
        v ? (
          <div key={k as string} className="grid grid-cols-[110px_1fr] rounded-md overflow-hidden border border-border">
            <dt className="bg-[#EAF0F6] text-[#1A8FE3] font-bold text-[12px] px-3 py-3 leading-tight">
              {k}
            </dt>
            <dd className="bg-card text-[13px] text-foreground px-3 py-3 leading-snug">{v}</dd>
          </div>
        ) : null,
      )}
    </dl>

    {a.heroImage && (
      <img
        src={a.heroImage}
        alt=""
        className="w-full rounded-md mb-4 object-cover"
        loading="lazy"
      />
    )}

    {a.body?.map((p, i) => (
      <p key={i} className="text-[14px] text-foreground/85 leading-relaxed mb-3">
        {renderInline(p)}
      </p>
    ))}
  </article>
);

const NewsArticlePage = () => {
  const { id = "" } = useParams();
  useGuardedNavigate();
  const article = getArticle(id);

  return (
    <div data-view-name="NewsArticle" className="min-h-screen w-full flex justify-center bg-[#0a0a0c] py-6">
      <div
        className="relative w-[393px] max-w-full bg-[#F2F2F6] rounded-[44px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-white/5"
        style={{ minHeight: 844 }}
      >
        <main className="relative h-[852px] overflow-y-auto no-scrollbar pb-28 bg-[#F2F2F6]">
          <StatusBar />
          <div className="px-4 pt-2"><BackButton /></div>

          {!article ? (
            <div className="p-6 text-center text-muted-foreground">Article not found.</div>
          ) : article.format === "safety-bulletin" ? (
            <SafetyBulletin a={article} />
          ) : (
            <CommsPost a={article} />
          )}
        </main>
        <div className="absolute inset-x-0 bottom-[6px] z-40 flex justify-center px-8 [&>nav]:!static [&>nav]:!translate-x-0 [&>nav]:!w-full">
        </div>
      </div>
    </div>
  );
};

export default NewsArticlePage;
