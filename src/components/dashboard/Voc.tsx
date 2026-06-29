import { Card, SectionHeader } from "./primitives";
import { voc } from "./mockData";

const items = [
  { emoji: "😀", label: "Positive", key: "positive" as const },
  { emoji: "😐", label: "Neutral", key: "neutral" as const },
  { emoji: "🙁", label: "Negative", key: "negative" as const },
];

export const Voc = () => (
  <section className="px-4 mt-5">
    <SectionHeader title="Voice of the Customer" action="See all" />
    <Card>
      <div className="grid grid-cols-3 gap-2">
        {items.map((i) => (
          <div key={i.label} className="rounded-tile bg-muted/60 p-3 text-center">
            <div className="text-[24px] leading-none">{i.emoji}</div>
            <div className="text-[18px] font-bold mt-1">{voc[i.key]}</div>
            <div className="text-[10px] text-muted-foreground">{i.label}</div>
          </div>
        ))}
      </div>
    </Card>
  </section>
);
