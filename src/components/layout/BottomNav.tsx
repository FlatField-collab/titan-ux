import { Home, Users, MessageCircle, MoreHorizontal } from "lucide-react";
import { useGuardedNavigate } from "@/lib/routes";

import { cn } from "@/lib/utils";

type Item = {
  icon: typeof Home;
  label: "Home" | "Team" | "Chat" | "More";
  to?: string;
};

const items: Item[] = [
  { icon: Home, label: "Home", to: "/dashboard" },
  { icon: Users, label: "Team", to: "/team" },
  { icon: MessageCircle, label: "Chat", to: "/chat/team" },
  { icon: MoreHorizontal, label: "More", to: "/performance" },
];

export const BottomNav = ({ active = "Home" }: { active?: Item["label"] }) => {
  const navigate = useGuardedNavigate();
  return (
    <nav data-track-region="sidebar" aria-label="Primary" style={{ left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "393px" }} className="fixed bottom-[6px] z-40 flex justify-center items-start px-8">
      <div className="flex w-full items-center justify-between gap-2 rounded-pill bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.18)] border border-white/60 px-4 py-2">
        {items.map(({ icon: Icon, label, to }) => {
          const isActive = label === active;
          return (
            <button
              key={label}
              onClick={() => to && navigate(to)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 2} />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
