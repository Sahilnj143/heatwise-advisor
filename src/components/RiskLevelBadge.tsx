import { motion } from "framer-motion";
import { RiskLevel, getRiskLevelColor, getRiskLevelDescription } from "@/lib/heatAdvisory";
import { AlertTriangle, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface RiskLevelBadgeProps {
  level: RiskLevel;
}

const icons = {
  LOW: CheckCircle,
  MODERATE: AlertCircle,
  HIGH: AlertTriangle,
  EXTREME: XCircle,
};

export function RiskLevelBadge({ level }: RiskLevelBadgeProps) {
  const colors = getRiskLevelColor(level);
  const description = getRiskLevelDescription(level);
  const Icon = icons[level];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-2xl ${colors.bg} ${colors.border} border p-6`}
    >
      {/* Animated background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-10 animate-pulse-glow`}
      />
      
      <div className="relative flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Heat Risk Level
            </span>
          </div>
          <h2 className={`text-3xl font-bold ${colors.text}`}>
            {level}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
