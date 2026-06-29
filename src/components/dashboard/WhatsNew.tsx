import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "./primitives";
import { whatsNew } from "./mockData";

export const WhatsNew = () => (
  <section className="px-4 mt-5">
    <SectionHeader title="What's New" action="See all" />
    <div className="-mx-4 px-4 overflow-x-auto no-scrollbar">
      <div className="flex gap-3 pr-8">
        {whatsNew.map((w) => (
          <div key={w.id} className="relative min-w-[320px] max-w-[320px] h-[170px] rounded-card overflow-hidden">
            <img src={w.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
              <div className="text-[11px] opacity-80">{w.date}</div>
              <div className="flex items-end justify-between gap-2">
                <div className="text-[15px] font-semibold leading-snug">{w.title}</div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
