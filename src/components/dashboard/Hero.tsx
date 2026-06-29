import { Bell, Cloud } from "lucide-react";
import { hero } from "./mockData";
import { StatusBar } from "./StatusBar";

export const Hero = () => (
  <div className="relative h-[260px] w-full overflow-hidden">
    <img src={hero.bg} alt="" className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/70" />
    <div className="relative z-10">
      <StatusBar onDark />
      <div className="flex items-center justify-between px-4 pt-2">
        <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white text-[11px] font-black tracking-widest border border-white/20">
          AT&T
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-pill bg-white/20 backdrop-blur px-2.5 py-1 text-white text-[12px] font-semibold">
            <Cloud className="w-3.5 h-3.5" />
            {hero.tempF}°
          </div>
          <button className="w-9 h-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white border border-white/20">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
      <div className="text-[15px] opacity-90">{hero.greeting}</div>
      <div className="text-[28px] font-bold leading-tight">{hero.name}</div>
    </div>
  </div>
);
