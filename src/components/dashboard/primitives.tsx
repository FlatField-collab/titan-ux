import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const Card = ({
  className,
  children,
  variant = "white",
}: {
  className?: string;
  children: ReactNode;
  variant?: "white" | "dark" | "indigo";
}) => (
  <div
    className={cn(
      "rounded-card p-4",
      variant === "white" && "bg-card text-card-foreground shadow-sm",
      variant === "dark" && "bg-card-dark text-card-dark-foreground",
      variant === "indigo" && "bg-card-indigo text-white",
      className,
    )}
  >
    {children}
  </div>
);

export const SectionHeader = ({
  title,
  action,
  className,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) => (
  <div className={cn("flex items-end justify-between px-1 mb-2", className)}>
    <h2 className="text-[22px] font-bold tracking-tight text-foreground">{title}</h2>
    {action ? <div className="text-[13px] text-primary font-medium">{action}</div> : null}
  </div>
);

export const SegmentedControl = ({
  options,
  active,
  onDark = false,
}: {
  options: string[];
  active: string;
  onDark?: boolean;
}) => (
  <div
    className={cn(
      "inline-flex p-0.5 rounded-pill text-[13px] font-medium",
      onDark ? "bg-white/10" : "bg-muted",
    )}
  >
    {options.map((o) => {
      const isActive = o === active;
      return (
        <span
          key={o}
          className={cn(
            "px-3 py-1 rounded-pill transition",
            isActive
              ? onDark
                ? "bg-white/90 text-card-dark"
                : "bg-card text-foreground shadow-sm"
              : onDark
                ? "text-white/70"
                : "text-muted-foreground",
          )}
        >
          {o}
        </span>
      );
    })}
  </div>
);

export const Pill = ({
  children,
  tone = "blue",
  className,
}: {
  children: ReactNode;
  tone?: "blue" | "neutral" | "success" | "danger" | "ghost";
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-[11px] font-semibold",
      tone === "blue" && "bg-accent text-accent-foreground",
      tone === "neutral" && "bg-muted text-muted-foreground",
      tone === "success" && "bg-success/15 text-success",
      tone === "danger" && "bg-destructive/15 text-destructive",
      tone === "ghost" && "bg-white/10 text-white",
      className,
    )}
  >
    {children}
  </span>
);

export const Avatar = ({ src, size = 40, className }: { src: string; size?: number; className?: string }) => (
  <img
    src={src}
    alt=""
    width={size}
    height={size}
    className={cn("rounded-full object-cover bg-muted", className)}
    style={{ width: size, height: size }}
  />
);

export const ProgressBar = ({
  value,
  tone = "success",
  className,
}: {
  value: number; // 0..1
  tone?: "success" | "danger" | "blue";
  className?: string;
}) => (
  <div className={cn("h-1.5 w-full rounded-pill bg-muted overflow-hidden", className)}>
    <div
      className={cn(
        "h-full rounded-pill transition-all",
        tone === "success" && "bg-success",
        tone === "danger" && "bg-destructive",
        tone === "blue" && "bg-primary",
      )}
      style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
    />
  </div>
);

export const HalfGauge = ({
  value,
  max,
  label,
  sublabel,
}: {
  value: number;
  max: number;
  label: string;
  sublabel?: string;
}) => {
  const pct = Math.min(1, value / max);
  const r = 70;
  const c = Math.PI * r;
  const dash = c * pct;
  return (
    <div className="relative w-[180px] h-[110px]">
      <svg viewBox="0 0 180 110" className="w-full h-full">
        <path
          d={`M 20 100 A ${r} ${r} 0 0 1 160 100`}
          fill="none"
          stroke="hsl(var(--muted) / 0.25)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d={`M 20 100 A ${r} ${r} 0 0 1 160 100`}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
        <div className="text-[34px] leading-none font-bold">{value}</div>
        <div className="text-[11px] uppercase tracking-wide opacity-70">{label}</div>
        {sublabel ? <div className="text-[10px] opacity-60 mt-0.5">{sublabel}</div> : null}
      </div>
    </div>
  );
};

export const Sparkline = ({
  points,
  tone = "success",
  width = 90,
  height = 32,
}: {
  points: number[];
  tone?: "success" | "danger";
  width?: number;
  height?: number;
}) => {
  if (points.length === 0) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const d = points
    .map((p, i) => {
      const x = i * step;
      const y = height - ((p - min) / range) * (height - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const stroke = tone === "success" ? "hsl(var(--success))" : "hsl(var(--destructive))";
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <path d={d} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
