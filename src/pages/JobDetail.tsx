import { useParams } from "react-router-dom";
import { useGuardedNavigate } from "@/lib/routes";
import { ChevronLeft } from "lucide-react";
import { StatusBar } from "@/components/dashboard/StatusBar";

const JobDetail = () => {
  const navigate = useGuardedNavigate();
  const { id } = useParams();

  return (
    <div data-view-name="Job Detail" className="min-h-screen w-full flex justify-center bg-[#0a0a0c] py-6">
      <div
        className="relative w-[393px] max-w-full bg-background rounded-[44px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-white/5"
        style={{ minHeight: 844 }}
      >
        <main className="relative h-[852px] overflow-y-auto no-scrollbar pb-24 bg-background">
          <StatusBar />
          <header className="flex items-center justify-between px-4 pt-2 pb-3">
            <button
              onClick={() => navigate("/team")}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition"
              aria-label="Back to jobs"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-[20px] font-bold tracking-tight">Job Detail</h1>
            <div className="w-9" />
          </header>
          <div className="px-4">
            <div className="rounded-card bg-card p-5 shadow-sm">
              <div className="text-[11px] font-medium text-muted-foreground">
                Job ID
              </div>
              <div className="text-[18px] font-semibold mt-1">{id}</div>
              <p className="text-[13px] text-muted-foreground mt-3">
                Detail view placeholder.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobDetail;
