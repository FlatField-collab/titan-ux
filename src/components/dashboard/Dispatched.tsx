
import { useGuardedNavigate } from "@/lib/routes";
import { Avatar, Card, Pill, ProgressBar, SectionHeader, SegmentedControl } from "./primitives";
import { dispatched } from "./mockData";

export const Dispatched = () => {
  const navigate = useGuardedNavigate();
  return (
    <section className="px-4 mt-5">
      <SectionHeader title="Dispatched" action="See all" />
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[13px] text-muted-foreground">{dispatched.length} techs</div>
          <SegmentedControl options={["Team", "Turf"]} active="Team" />
        </div>
        <div className="space-y-4">
          {dispatched.map((t) => (
            <button
              key={t.id}
              onClick={() => navigate(`/team/${t.id}`)}
              className="w-full text-left space-y-1.5"
            >
              <div className="flex items-center gap-3">
                <Avatar src={t.avatar} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-semibold truncate">{t.name}</span>
                    {t.pills.map((p) => (
                      <Pill key={p} tone="blue">
                        {p}
                      </Pill>
                    ))}
                  </div>
                  <div
                    className={`text-[11px] ${
                      t.over ? "text-destructive" : "text-muted-foreground"
                    }`}
                  >
                    {t.distance} · {t.time}
                  </div>
                </div>
              </div>
              <ProgressBar value={t.progress} tone={t.over ? "danger" : "success"} />
            </button>
          ))}
        </div>
      </Card>
    </section>
  );
};
