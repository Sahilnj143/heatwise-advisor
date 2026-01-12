import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Settings, Map, MessageSquare, BarChart3, Key } from "lucide-react";
import { HeatMap } from "@/components/HeatMap";
import { ZoneGrid } from "@/components/ZoneGrid";
import { ZoneDetailsPanel } from "@/components/ZoneDetailsPanel";
import { AdvisoryChat } from "@/components/AdvisoryChat";
import { DashboardStats } from "@/components/DashboardStats";
import { mockHeatZones, HeatZone } from "@/lib/heatZones";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [mapboxToken, setMapboxToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [selectedZone, setSelectedZone] = useState<HeatZone | null>(null);
  const [activePanel, setActivePanel] = useState<"zones" | "chat">("zones");

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      setMapboxToken(tokenInput.trim());
    }
  };

  if (!mapboxToken) {
    return (
      <div className="min-h-screen gradient-sky flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card rounded-2xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-primary/10">
              <Key className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Mapbox API Token Required
            </h1>
            <p className="text-muted-foreground text-sm">
              To display the interactive heat map, please enter your Mapbox public token.
            </p>
          </div>

          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <Input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="pk.eyJ1Ijoi..."
              className="h-12 bg-secondary/50"
            />
            <Button type="submit" className="w-full h-12" disabled={!tokenInput.trim()}>
              Connect Map
            </Button>
          </form>

          <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>How to get a token:</strong>
              <br />
              1. Go to{" "}
              <a
                href="https://mapbox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
              <br />
              2. Create a free account
              <br />
              3. Find your public token in the Tokens section
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Sun className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">SUHI-MAS</h1>
                <p className="text-xs text-muted-foreground">
                  Smart Urban Heat Island Monitor
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:block">
                Last updated: Just now
              </span>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 space-y-4">
        {/* Stats */}
        <DashboardStats />

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ height: "calc(100vh - 220px)" }}>
          {/* Map */}
          <div className="lg:col-span-8 glass-card rounded-xl overflow-hidden min-h-[400px]">
            <HeatMap
              zones={mockHeatZones}
              mapboxToken={mapboxToken}
              onZoneSelect={setSelectedZone}
              selectedZone={selectedZone}
            />
          </div>

          {/* Side panel */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Panel tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActivePanel("zones")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activePanel === "zones"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Zones</span>
              </button>
              <button
                onClick={() => setActivePanel("chat")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activePanel === "chat"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>AI Advisor</span>
              </button>
            </div>

            {/* Panel content */}
            <div className="flex-1 glass-card rounded-xl overflow-hidden">
              <AnimatePresence mode="wait">
                {activePanel === "zones" ? (
                  <motion.div
                    key="zones"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col p-4"
                  >
                    {selectedZone ? (
                      <ZoneDetailsPanel
                        zone={selectedZone}
                        onClose={() => setSelectedZone(null)}
                      />
                    ) : (
                      <ZoneGrid
                        zones={mockHeatZones}
                        selectedZone={selectedZone}
                        onZoneSelect={setSelectedZone}
                      />
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <AdvisoryChat selectedZone={selectedZone} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
