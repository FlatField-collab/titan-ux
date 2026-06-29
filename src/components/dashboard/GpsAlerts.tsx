import { Gauge, MapPin, Timer, Building2 } from "lucide-react";
import { Card, Pill, SectionHeader } from "./primitives";
import { gpsAlerts } from "./mockData";
import mapBg from "@/assets/map-bg.jpg";
import { avatar } from "@/assets/avatars";

export const GpsAlerts = () => (
  <section className="px-4 mt-5">
    <SectionHeader title="GPS Alerts" action="See all" />
    <Card className="p-0 overflow-hidden">
      <div className="relative h-[140px] bg-muted overflow-hidden">
        <img
          src={mapBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Work center pin */}
        <div className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ top: "38%", left: "28%" }}>
          <div className="w-6 h-6 rounded-full bg-[#1F2937] shadow-md flex items-center justify-center ring-2 ring-white/80">
            <Building2 className="w-3 h-3 text-white" />
          </div>
        </div>
        {/* Tech avatar pins */}
        <div className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ top: "55%", left: "58%" }}>
          <img
            src={avatar(12)}
            alt=""
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
        <div className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ top: "30%", left: "75%" }}>
          <img
            src={avatar(47)}
            alt=""
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
        </div>
      </div>
      <div className="p-3 flex flex-wrap gap-2">
        <Pill tone="danger">
          <MapPin className="w-3 h-3" /> {gpsAlerts.issues} GPS Issues
        </Pill>
        <Pill tone="blue">
          <Gauge className="w-3 h-3" /> {gpsAlerts.speeding} Speeding
        </Pill>
        <Pill tone="neutral">
          <Timer className="w-3 h-3" /> {gpsAlerts.idling} Idling
        </Pill>
      </div>
    </Card>
  </section>
);
