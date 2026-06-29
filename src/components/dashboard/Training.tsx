import { Card, ProgressBar, SectionHeader, SegmentedControl } from "./primitives";
import { training } from "./mockData";

export const Training = () => (
  <section className="px-4 mt-5">
    <SectionHeader title="Training" />
    <Card>
      <div className="flex justify-end mb-3">
        <SegmentedControl options={["This Month", "All Training"]} active="This Month" />
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-[12px] mb-1">
            <span className="font-medium">Team</span>
            <span className="text-muted-foreground">{training.team}%</span>
          </div>
          <ProgressBar value={training.team / 100} tone="blue" />
        </div>
        <div>
          <div className="flex items-center justify-between text-[12px] mb-1">
            <span className="font-medium">My Training</span>
            <span className="text-muted-foreground">{training.mine}%</span>
          </div>
          <ProgressBar value={training.mine / 100} tone="blue" />
        </div>
      </div>
    </Card>
  </section>
);
