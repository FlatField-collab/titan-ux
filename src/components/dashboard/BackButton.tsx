import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Standard top-left "Back" control. Always goes to the previous entry in the
 * history stack so the destination matches however the user arrived.
 */
export const BackButton = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      aria-label="Back"
      className={cn(
        "inline-flex items-center gap-0.5 -ml-1 text-[15px] font-medium text-foreground",
        className,
      )}
    >
      <ChevronLeft className="w-5 h-5" />
      Back
    </button>
  );
};
