import { Cake, PartyPopper } from "lucide-react";
import { Avatar, Card, SectionHeader } from "./primitives";
import { celebrations } from "./mockData";

export const Celebrations = () => (
  <section className="px-4 mt-5">
    <SectionHeader title="Celebrations" action="See all" />
    <Card variant="indigo" className="p-4 space-y-3">
      {celebrations.map((c) => {
        const Icon = c.kind === "birthday" ? Cake : PartyPopper;
        return (
          <div key={c.id} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
            <Avatar src={c.avatar} size={36} />
            <div className="flex-1">
              <div className="text-[14px] font-semibold">{c.name}</div>
              <div className="text-[11px] opacity-80">{c.date}</div>
            </div>
          </div>
        );
      })}
    </Card>
  </section>
);
