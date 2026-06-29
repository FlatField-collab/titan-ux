import { Heart } from "lucide-react";
import { Avatar, SectionHeader } from "./primitives";
import { recognition } from "./mockData";

export const Recognition = () => (
  <section className="px-4 mt-5">
    <SectionHeader title="Recognition" action="See all" />
    <div className="-mx-4 px-4 overflow-x-auto no-scrollbar">
      <div className="flex gap-3 pr-8">
        {recognition.map((r) => (
          <div
            key={r.id}
            className="relative min-w-[110px] bg-card rounded-card p-3 flex flex-col items-center shadow-sm"
          >
            <div className="relative">
              <Avatar src={r.avatar} size={56} />
              <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center">
                <Heart className="w-3 h-3 fill-current" />
              </div>
            </div>
            <div className="text-[12px] font-semibold mt-2">{r.name}</div>
            <div className="text-[10px] text-muted-foreground">+{r.reactions}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
