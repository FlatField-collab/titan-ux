import { Settings2 } from "lucide-react";

export const Customize = () => (
  <section className="px-4 mt-5">
    <button className="w-full rounded-pill bg-card border border-separator py-3 text-[14px] font-semibold text-primary flex items-center justify-center gap-2 shadow-sm">
      <Settings2 className="w-4 h-4" />
      Customize
    </button>
  </section>
);
