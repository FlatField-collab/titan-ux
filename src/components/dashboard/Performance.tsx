import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useGuardedNavigate } from "@/lib/routes";

import { Card, SectionHeader, Sparkline } from "./primitives";
import { performance } from "./mockData";

export const Performance = () => {
  const navigate = useGuardedNavigate();
  return (
    <section className="px-4 mt-5">
      <SectionHeader title="Performance" action="Last 30 Days" />
      <button
        type="button"
        onClick={() => navigate("/performance")}
        className="w-full text-left"
      >
        <Card>
          <div className="divide-y divide-separator">
            {performance.map((p) => {
              const up = p.trend === "up";
              return (
                <div key={p.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <div className="text-[13px] font-semibold">{p.label}</div>
                    <div className="text-[22px] font-bold leading-tight">{p.value}%</div>
                    <div
                      className={`flex items-center gap-1 text-[11px] font-semibold ${
                        up ? "text-success" : "text-destructive"
                      }`}
                    >
                      {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(p.delta)}%
                    </div>
                  </div>
                  <Sparkline points={p.points} tone={up ? "success" : "danger"} />
                </div>
              );
            })}
          </div>
        </Card>
      </button>
    </section>
  );
};
