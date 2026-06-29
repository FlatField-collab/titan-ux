import { Signal, Wifi, BatteryFull } from "lucide-react";

export const StatusBar = ({ onDark = false }: { onDark?: boolean }) => (
  <div
    className={`relative w-full flex items-center justify-between px-6 pt-2 pb-1 text-[14px] font-semibold ${
      onDark ? "text-white" : "text-foreground"
    }`}
  >
    <span>9:41</span>
    {/* iOS Dynamic Island */}
    <div
      aria-hidden="true"
      className="absolute left-1/2 -translate-x-1/2 top-1.5 h-[34px] w-[120px] rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
    />
    <div className="flex items-center gap-1">
      <Signal className="w-4 h-4" />
      <Wifi className="w-4 h-4" />
      <BatteryFull className="w-5 h-5" />
    </div>
  </div>
);
