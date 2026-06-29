
import { useGuardedNavigate } from "@/lib/routes";
import { Card, HalfGauge, SectionHeader } from "./primitives";
import { fieldVisits } from "./mockData";

export const FieldVisits = () => {
  const navigate = useGuardedNavigate();
  const goToIncomplete = () => navigate("/docs?filter=incomplete");
  return (
    <section className="px-4 mt-5">
      <SectionHeader title="Field Visits" action="See all" />
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={goToIncomplete} className="text-left">
          <Card className="flex flex-col items-center">
            <div className="text-[12px] text-muted-foreground self-start">In Progress</div>
            <HalfGauge value={fieldVisits.inProgress} max={fieldVisits.target} label="Active" />
          </Card>
        </button>
        <button type="button" onClick={goToIncomplete} className="text-left">
          <Card className="flex flex-col items-center">
            <div className="text-[12px] text-muted-foreground self-start">Past</div>
            <HalfGauge value={fieldVisits.past} max={fieldVisits.target} label="Done" />
          </Card>
        </button>
      </div>
    </section>
  );
};
