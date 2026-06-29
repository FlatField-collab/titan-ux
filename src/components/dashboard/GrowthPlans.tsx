import { Plus } from "lucide-react";
import { Card, SectionHeader } from "./primitives";
import { growthPlans } from "./mockData";

export const GrowthPlans = () => (
  <section className="px-4 mt-5">
    <SectionHeader title="Growth Plans" />
    <Card>
      <div className="divide-y divide-separator">
        {growthPlans.map((g) => (
          <div key={g.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div className="text-[14px] font-medium">{g.label}</div>
            <div className="text-[13px] text-muted-foreground">{g.count} active</div>
          </div>
        ))}
      </div>
      <button className="mt-2 flex items-center gap-1 text-[13px] font-medium text-primary">
        <Plus className="w-4 h-4" /> Add New Plan
      </button>
    </Card>
  </section>
);
