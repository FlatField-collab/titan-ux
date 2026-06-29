
import { useGuardedNavigate } from "@/lib/routes";
import { Card, HalfGauge, SectionHeader, SegmentedControl } from "./primitives";
import { jobs } from "./mockData";

const FILTER_LABELS = new Set(["Assigned", "Unassigned", "Cancelled", "Returned"]);

export const Summary = () => {
  const navigate = useGuardedNavigate();
  return (
    <section className="px-4 mt-5">
      <SectionHeader
        title="Summary"
        action={
          <button onClick={() => navigate("/team")} className="text-primary font-medium">
            Jobs ›
          </button>
        }
      />
      <Card variant="dark" className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-[15px] font-semibold">Jobs</div>
          <SegmentedControl options={["Team", "Turf"]} active="Team" onDark />
        </div>
        <div className="flex flex-col items-center mt-2">
          <HalfGauge value={jobs.total} max={20} label="Total Techs" />
          <div className="flex items-center gap-4 mt-3 text-[12px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {jobs.dispatched} Dispatched
            </span>
            <span className="flex items-center gap-1.5 opacity-70">
              <span className="w-2 h-2 rounded-full bg-white/50" />
              {jobs.atnd} ATND
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {jobs.stats.map((s) => {
            const isFilter = FILTER_LABELS.has(s.label);
            return (
              <button
                key={s.label}
                onClick={() =>
                  isFilter
                    ? navigate(`/team?status=${encodeURIComponent(s.label)}`)
                    : navigate("/team")
                }
                className="rounded-tile bg-white/5 p-3 text-center hover:bg-white/10 transition"
              >
                <div className="text-[20px] font-bold">{s.value}</div>
                <div className="text-[10px] uppercase tracking-wide opacity-70 mt-0.5">{s.label}</div>
              </button>
            );
          })}
        </div>
      </Card>
    </section>
  );
};
