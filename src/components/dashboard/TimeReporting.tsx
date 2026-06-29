import { AlertTriangle, Clock } from "lucide-react";
import { Card, Pill, SectionHeader } from "./primitives";
import { timeReporting } from "./mockData";

export const TimeReporting = () => (
  <section className="px-4 mt-5">
    <SectionHeader title="Time Reporting" action="Open" />
    <Card>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center text-primary">
          <Clock className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-semibold">{timeReporting.hoursLeft} hrs left to do</div>
          <div className="text-[11px] text-muted-foreground">Approve timesheets by 5pm</div>
        </div>
        <Pill tone="danger">
          <AlertTriangle className="w-3 h-3" /> {timeReporting.alerts}
        </Pill>
      </div>
    </Card>
  </section>
);
