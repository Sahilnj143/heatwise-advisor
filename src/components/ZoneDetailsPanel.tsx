import { motion } from "framer-motion";
import { HeatZone } from "@/lib/heatZones";
import { getRiskLevelColor } from "@/lib/heatAdvisory";
import { Thermometer, Droplets, TrendingUp, Clock, MapPin } from "lucide-react";

interface ZoneDetailsPanelProps {
  zone: HeatZone;
  onClose: () => void;
}

export function ZoneDetailsPanel({ zone, onClose }: ZoneDetailsPanelProps) {
  const colors = getRiskLevelColor(zone.riskLevel);

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      className="glass-card rounded-xl p-4 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <MapPin className="w-4 h-4" />
            <span>Selected Zone</span>
          </div>
          <h3 className="font-semibold text-foreground">{zone.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ✕
        </button>
      </div>

      {/* Risk badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg} ${colors.text}`}>
        <span className="text-sm font-medium">{zone.riskLevel} Risk</span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Thermometer className="w-3 h-3" />
            <span>Current</span>
          </div>
          <p className="text-xl font-bold text-foreground">{zone.temperature}°C</p>
        </div>
        
        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Droplets className="w-3 h-3" />
            <span>Humidity</span>
          </div>
          <p className="text-xl font-bold text-foreground">{zone.humidity}%</p>
        </div>

        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <TrendingUp className="w-3 h-3" />
            <span>Heat Index</span>
          </div>
          <p className="text-xl font-bold text-primary">{zone.heatIndex}°C</p>
        </div>

        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Clock className="w-3 h-3" />
            <span>Peak at {zone.peakTime}</span>
          </div>
          <p className="text-xl font-bold text-destructive">{zone.predictedPeak}°C</p>
        </div>
      </div>

      {/* Quick advisory */}
      <div className="border-t border-border pt-3">
        <p className="text-xs text-muted-foreground">
          {zone.riskLevel === "EXTREME" || zone.riskLevel === "HIGH"
            ? "⚠️ Avoid outdoor activities during peak hours. Stay hydrated."
            : zone.riskLevel === "MODERATE"
            ? "Take precautions if outdoors for extended periods."
            : "Conditions are generally safe for outdoor activities."}
        </p>
      </div>
    </motion.div>
  );
}
