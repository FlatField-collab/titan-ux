import { Card, SectionHeader } from "./primitives";
import { coaching } from "./mockData";

export const Coaching = () => (
  <section className="px-4 mt-5">
    <SectionHeader title="Coaching" action="See all" />
    <Card>
      <div className="grid grid-cols-3 gap-2">
        {coaching.map((c) => (
          <div key={c.label} className="rounded-tile bg-muted/60 p-3 text-center">
            <div className="text-[20px] font-bold">{c.count}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>
    </Card>
  </section>
);
