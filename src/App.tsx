import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Jobs from "./pages/Jobs.tsx";
import Docs from "./pages/Docs.tsx";
import Competencies from "./pages/Competencies.tsx";
import DocsDetail from "./pages/DocsDetail.tsx";
import JobDetail from "./pages/JobDetail.tsx";
import Performance from "./pages/Performance.tsx";
import Chat from "./pages/Chat.tsx";
import TechDetail from "./pages/TechDetail.tsx";
import TechVehicle from "./pages/TechVehicle.tsx";
import MapPage from "./pages/Map.tsx";
import MapFilters from "./pages/MapFilters.tsx";
import TechLocation from "./pages/TechLocation.tsx";
import RouteTrail from "./pages/RouteTrail.tsx";
import VRide from "./pages/VRide.tsx";
import News from "./pages/News.tsx";
import NewsArticle from "./pages/NewsArticle.tsx";
import ExportScreens from "./pages/ExportScreens.tsx";
import { AppLayout } from "./components/layout/AppLayout";

import { useWheelHorizontalScroll } from "./hooks/useWheelHorizontalScroll";
import { TrackerProvider, TrackerUi } from "./tracker/Tracker";
import ResearchOverlay from "./research/ResearchOverlay";

const queryClient = new QueryClient();

const FLATTEN_CSS = `
  main { height: auto !important; max-height: none !important; overflow: visible !important; }
  [class*="h-[852px]"] { height: auto !important; max-height: none !important; overflow: visible !important; }
`;

const App = () => {
  useWheelHorizontalScroll();
  const flatten =
    typeof window !== "undefined" &&
    window.location.search.includes("flatten=1");
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {flatten && <style>{FLATTEN_CSS}</style>}
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.PROD ? "/titan-ux" : "/"}>
        <TrackerProvider>
          <div className="flex flex-col" style={{ minHeight: "100vh", width: "100%" }}>
            <div data-ux-ignore className="sticky top-0 z-50 w-full">
              <TrackerUi />
            </div>
            <div
              className="mx-auto w-full"
              style={{
                maxWidth: "393px",
                flex: "1 1 auto",
                overflowX: "hidden",
                position: "relative",
              }}
            >
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Index />} />
                  <Route path="/team" element={<Jobs />} />
                  <Route path="/Docs" element={<Docs />} />
                  <Route path="/docs" element={<Docs />} />
                  <Route path="/docs/:id" element={<DocsDetail />} />
                  <Route path="/visits/:id" element={<DocsDetail />} />
                  <Route path="/team/:id" element={<JobDetail />} />
                  <Route path="/performance" element={<Performance />} />
                  <Route path="/competencies" element={<Competencies />} />
                  <Route path="/competency" element={<Competencies />} />
                  <Route path="/competency/:id" element={<Competencies />} />
                  <Route path="/competency/send" element={<Competencies />} />
                  <Route path="/chat/:topic" element={<Chat />} />
                  <Route path="/tech/:id" element={<TechDetail />} />
                  <Route path="/tech/:id/vehicle" element={<TechVehicle />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/map/filters" element={<MapFilters />} />
                  <Route path="/techlocation" element={<TechLocation />} />
                  <Route path="/map/trail" element={<RouteTrail />} />
                  <Route path="/vride" element={<VRide />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/news/:id" element={<NewsArticle />} />
                  <Route path="/research" element={<Index />} />
                </Route>
                <Route path="/research/export-screens" element={<ExportScreens />} />
              </Routes>
              <ResearchOverlay />
            </div>
          </div>
        </TrackerProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
