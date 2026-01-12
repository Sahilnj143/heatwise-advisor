import { motion } from "framer-motion";
import { Gauge, AlertCircle } from "lucide-react";

interface ConfidenceIndicatorProps {
  score: number;
  usedFallback: boolean;
}

export function ConfidenceIndicator({ score, usedFallback }: ConfidenceIndicatorProps) {
  const percentage = Math.round(score * 100);
  
  const getConfidenceColor = () => {
    if (score >= 0.8) return "bg-risk-low";
    if (score >= 0.6) return "bg-risk-moderate";
    if (score >= 0.4) return "bg-risk-high";
    return "bg-risk-extreme";
  };

  const getConfidenceLabel = () => {
    if (score >= 0.8) return "High Confidence";
    if (score >= 0.6) return "Moderate Confidence";
    if (score >= 0.4) return "Low Confidence";
    return "Very Low Confidence";
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <Gauge className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">
              {getConfidenceLabel()}
            </h3>
            <p className="text-xs text-muted-foreground">
              Based on available data
            </p>
          </div>
        </div>
        <span className="text-2xl font-bold text-foreground">
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${getConfidenceColor()}`}
        />
      </div>

      {usedFallback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-risk-moderate-bg"
        >
          <AlertCircle className="w-4 h-4 text-risk-moderate flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Some data was unavailable. Fallback safety recommendations applied.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
