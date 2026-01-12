import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Shield, Thermometer, LayoutDashboard, ArrowRight } from "lucide-react";
import { LocationInput } from "@/components/LocationInput";
import { RiskLevelBadge } from "@/components/RiskLevelBadge";
import { HeatSummaryCard } from "@/components/HeatSummaryCard";
import { Button } from "@/components/ui/button";
import { RecommendationsList } from "@/components/RecommendationsList";
import { RationaleCard } from "@/components/RationaleCard";
import { ConfidenceIndicator } from "@/components/ConfidenceIndicator";
import { HeatAdvisory } from "@/lib/heatAdvisory";
import { fetchHeatAdvisory } from "@/lib/api";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [advisory, setAdvisory] = useState<HeatAdvisory | null>(null);
  const [locationName, setLocationName] = useState("");

  const handleSubmit = async (name: string, locationType: string) => {
    setIsLoading(true);
    setLocationName(name);

    try {
      const result = await fetchHeatAdvisory(name, locationType);
      setAdvisory(result);
    } catch (error) {
      console.error("Failed to fetch advisory:", error);
      toast.error("Failed to generate advisory. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAdvisory(null);
    setLocationName("");
  };

  return (
    <div className="min-h-screen gradient-sky">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-primary/10">
            <Sun className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Heat Risk Advisory
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            AI-powered heat safety recommendations based on your location and official guidelines.
          </p>
        </motion.header>

        <AnimatePresence mode="wait">
          {!advisory ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LocationInput onSubmit={handleSubmit} isLoading={isLoading} />

              {/* Features */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4 mt-6"
              >
                <div className="glass-card rounded-xl p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-foreground text-sm">Official Guidelines</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on WHO & CDC protocols
                    </p>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-4 flex items-start gap-3">
                  <Thermometer className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-foreground text-sm">AI-Powered</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Personalized recommendations
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Dashboard link */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                  className="w-full h-12 gap-2"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Open City Dashboard
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Location header */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">Advisory for</span>
                  <span className="font-semibold text-foreground">{locationName}</span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-sm text-primary hover:underline"
                >
                  New search
                </button>
              </motion.div>

              <RiskLevelBadge level={advisory.riskLevel} />
              <HeatSummaryCard summary={advisory.predictedHeatSummary} />
              <RecommendationsList recommendations={advisory.recommendations} />
              <RationaleCard rationale={advisory.rationale} />
              <ConfidenceIndicator
                score={advisory.confidenceScore}
                usedFallback={advisory.usedFallback}
              />

              {/* Disclaimer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs text-center text-muted-foreground mt-6 px-4"
              >
                This advisory is AI-generated using official heat safety guidelines.
                Always consult local authorities for emergency situations.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
