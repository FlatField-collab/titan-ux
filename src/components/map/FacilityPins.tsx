import {
  ArrowUpRight,
  Box,
  Building2,
  Cable,
  CircleDot,
  GitFork,
  Package,
  RadioTower,
  Server,
  Spline,
  Square,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Pos = { top: string; left: string };

const PowerlinePole = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path
      d="M12 3v18M5 7h14M7 11h10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M9 7v2M15 7v2M8 11v1.5M16 11v1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

type Glyph = (props: { className?: string }) => JSX.Element;

const ICONS: Record<string, Glyph> = {
  "Work Center": ({ className }) => <Building2 className={className} />,
  "Central Office": ({ className }) => (
    <span className={cn("font-bold tracking-tight", className)} style={{ fontSize: "0.7em" }}>
      CO
    </span>
  ),
  Garage: ({ className }) => <Warehouse className={className} />,
  "Remote Terminal": ({ className }) => <Server className={className} />,
  "Outside Plant": ({ className }) => <Cable className={className} />,
  "Cell Site": ({ className }) => <RadioTower className={className} />,
  "Cable Splice /Tether": ({ className }) => <Spline className={className} />,
  Handhole: ({ className }) => <Square className={className} />,
  Manhole: ({ className }) => <CircleDot className={className} />,
  Pedestal: ({ className }) => <Box className={className} />,
  Pole: ({ className }) => <PowerlinePole className={className} />,
  "PFP / Crossbox": ({ className }) => <Package className={className} />,
  "F1 / F2 Facilities": ({ className }) => <GitFork className={className} />,
};

// Positions aligned to numbered markers visible along the roads in map-bg.jpg.
const POSITIONS: Record<string, Pos[]> = {
  "Work Center": [{ top: "47%", left: "30%" }],
  "Central Office": [{ top: "30%", left: "31%" }],
  Garage: [{ top: "39%", left: "82%" }],
  "Remote Terminal": [{ top: "11%", left: "53%" }],
  "Outside Plant": [{ top: "64%", left: "59%" }],
  "Cell Site": [{ top: "15%", left: "75%" }],
  "Cable Splice /Tether": [{ top: "42%", left: "61%" }],
  Handhole: [{ top: "70%", left: "30%" }],
  Manhole: [{ top: "55%", left: "50%" }],
  Pedestal: [{ top: "20%", left: "40%" }],
  Pole: [{ top: "70%", left: "68%" }],
  "PFP / Crossbox": [{ top: "28%", left: "70%" }],
  "F1 / F2 Facilities": [{ top: "62%", left: "18%" }],
};

function dist(a: Pos, b: Pos) {
  const dx = parseFloat(a.left) - parseFloat(b.left);
  const dy = parseFloat(a.top) - parseFloat(b.top);
  return Math.sqrt(dx * dx + dy * dy);
}

function Pin({
  type,
  size,
  label,
}: {
  type: string;
  size: "lg" | "sm";
  label?: string;
}) {
  const Glyph = ICONS[type];
  if (!Glyph) return null;
  const isLg = size === "lg";
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div
          className={cn(
            "rounded-full bg-[#111827] flex items-center justify-center ring-white shadow-[0_4px_12px_rgba(0,0,0,0.25)]",
            isLg ? "w-11 h-11 ring-4" : "w-7 h-7 ring-2",
          )}
        >
          <Glyph className={cn("text-white", isLg ? "w-5 h-5" : "w-3.5 h-3.5")} />
        </div>
        {isLg && (
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-3 h-3 bg-[#111827] rotate-45"
            aria-hidden
          />
        )}
      </div>
      {isLg && label && (
        <span className="mt-2 inline-flex items-center gap-0.5 text-[11px] font-semibold text-foreground bg-white/90 px-2 py-0.5 rounded-md shadow-sm">
          {label}
          <ArrowUpRight className="w-3 h-3" />
        </span>
      )}
    </div>
  );
}

export function FacilityPins({
  types,
  anchor,
}: {
  types: string[];
  anchor: Pos | null;
}) {
  const referencePos = anchor ?? { top: "44%", left: "44%" };

  return (
    <>
      {types.map((type) => {
        const positions = POSITIONS[type];
        if (!positions || positions.length === 0) return null;

        let closestIdx = 0;
        let closestD = Infinity;
        positions.forEach((p, i) => {
          const d = dist(p, referencePos);
          if (d < closestD) {
            closestD = d;
            closestIdx = i;
          }
        });

        return positions.map((pos, i) => {
          const isClosest = i === closestIdx;
          return (
            <div
              key={`${type}-${i}`}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2",
                isClosest ? "z-[15]" : "z-[12]",
              )}
              style={{ top: pos.top, left: pos.left }}
            >
              <Pin type={type} size={isClosest ? "lg" : "sm"} label={isClosest ? type : undefined} />
            </div>
          );
        });
      })}
    </>
  );
}
