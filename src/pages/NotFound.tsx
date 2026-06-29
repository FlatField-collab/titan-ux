import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { BackButton } from "@/components/dashboard/BackButton";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div data-view-name="Not Found" className="min-h-screen w-full flex justify-center bg-[#0a0a0c] py-6">
      <div
        className="relative w-[393px] max-w-full bg-background rounded-[44px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-white/5"
        style={{ minHeight: 844 }}
      >
        <main className="relative h-[852px] overflow-y-auto no-scrollbar pb-28 bg-background">
          <StatusBar />
          <div className="px-4 pt-2"><BackButton /></div>
          <div className="flex flex-col items-center justify-center text-center px-6 pt-32">
            <h1 className="mb-4 text-4xl font-bold">404</h1>
            <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
            <a href="/" className="text-primary underline hover:text-primary/90">
              Return to Home
            </a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotFound;
