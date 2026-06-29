import { Moon, Sun } from "lucide-react";
import { Card, SectionHeader, SegmentedControl } from "./primitives";
import { teamSchedule } from "./mockData";

export const TeamSchedule = () => (
  <section className="px-4 mt-5">
    <SectionHeader title="Team Schedule" action="View" />
    <Card>
      <div className="flex justify-end mb-3">
        <SegmentedControl options={["Today", "This Week"]} active="Today" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-tile bg-accent p-3">
          <Sun className="w-5 h-5 text-primary" />
          <div className="text-[22px] font-bold mt-1">{teamSchedule.am.count}</div>
          <div className="text-[11px] text-muted-foreground">{teamSchedule.am.label}</div>
        </div>
        <div className="rounded-tile bg-muted p-3">
          <Moon className="w-5 h-5 text-foreground" />
          <div className="text-[22px] font-bold mt-1">{teamSchedule.pm.count}</div>
          <div className="text-[11px] text-muted-foreground">{teamSchedule.pm.label}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3">
        {teamSchedule.slots.map((s) => (
          <div key={s.name} className="flex items-center justify-between rounded-tile bg-muted/60 px-3 py-2">
            <span className="text-[12px] font-medium">{s.name}</span>
            <span className="text-[11px] text-muted-foreground">{s.time}</span>
          </div>
        ))}
      </div>
    </Card>
  </section>
);
