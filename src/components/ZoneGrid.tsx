import { motion } from "framer-motion";
import { HeatZone } from "@/lib/heatZones";
import { getRiskLevelColor } from "@/lib/heatAdvisory";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ZoneGridProps {
  zones: HeatZone[];
  selectedZone: HeatZone | null;
  onZoneSelect: (zone: HeatZone) => void;
}

export function ZoneGrid({ zones, selectedZone, onZoneSelect }: ZoneGridProps) {
  const sortedZones = [...zones].sort((a, b) => b.heatIndex - a.heatIndex);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground px-1">
        All Zones ({zones.length})
      </h3>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {sortedZones.map((zone, index) => {
          const colors = getRiskLevelColor(zone.riskLevel);
          const isSelected = selectedZone?.id === zone.id;
          const trend = zone.predictedPeak - zone.heatIndex;

          return (
            <motion.button
              key={zone.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onZoneSelect(zone)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                isSelected
                  ? `${colors.bg} ${colors.border} border-2 shadow-md`
                  : "bg-secondary/50 hover:bg-secondary border border-transparent"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-foreground text-sm truncate pr-2">
                  {zone.name}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                  {zone.riskLevel}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Heat Index: {zone.heatIndex}°C</span>
                <div className="flex items-center gap-1">
                  {trend > 2 ? (
                    <TrendingUp className="w-3 h-3 text-destructive" />
                  ) : trend < -2 ? (
                    <TrendingDown className="w-3 h-3 text-risk-low" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                  <span className={trend > 2 ? "text-destructive" : trend < -2 ? "text-risk-low" : ""}>
                    {trend > 0 ? "+" : ""}{trend}°
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
