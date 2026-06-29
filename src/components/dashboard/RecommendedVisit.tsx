import { ArrowUpRight } from "lucide-react";
import { Avatar, Card, Pill, SectionHeader } from "./primitives";
import { recommendedVisits } from "./mockData";

export const RecommendedVisit = () => (
  <section className="px-4 mt-4">
    <SectionHeader title="Recommended Visit" action="See all" />
    <div className="-mx-4 px-4 overflow-x-auto no-scrollbar">
      <div className="flex gap-3 pr-8">
        {recommendedVisits.map((v) => (
          <Card key={v.id} className="min-w-[300px] max-w-[300px]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={v.avatar} size={44} />
                <div>
                  <div className="font-semibold text-[15px]">{v.customer}</div>
                  <div className="text-[12px] text-muted-foreground">{v.address}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-pill bg-primary text-primary-foreground px-2.5 py-1 text-[12px] font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                {v.etaMin} min
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {v.chips.map((c) => (
                <Pill key={c} tone="blue">
                  {c}
                </Pill>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);
