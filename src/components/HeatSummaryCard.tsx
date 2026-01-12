import { motion } from "framer-motion";
import { Thermometer, Droplets, Wind } from "lucide-react";

interface HeatSummaryCardProps {
  summary: string;
}

export function HeatSummaryCard({ summary }: HeatSummaryCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Thermometer className="w-6 h-6 text-primary" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Predicted Heat Summary
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {summary}
          </p>
          
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Droplets className="w-4 h-4" />
              <span>High Humidity</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wind className="w-4 h-4" />
              <span>Low Wind</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
