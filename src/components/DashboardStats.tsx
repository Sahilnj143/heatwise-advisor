import { motion } from "framer-motion";
import { mockHeatZones } from "@/lib/heatZones";
import { AlertTriangle, ThermometerSun, Users, TrendingUp, Activity } from "lucide-react";

export function DashboardStats() {
  const extremeZones = mockHeatZones.filter((z) => z.riskLevel === "EXTREME").length;
  const highZones = mockHeatZones.filter((z) => z.riskLevel === "HIGH").length;
  const avgHeatIndex = Math.round(
    mockHeatZones.reduce((sum, z) => sum + z.heatIndex, 0) / mockHeatZones.length
  );
  const maxHeatIndex = Math.max(...mockHeatZones.map((z) => z.heatIndex));

  const stats = [
    {
      label: "Extreme Risk Zones",
      value: extremeZones,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "High Risk Zones",
      value: highZones,
      icon: TrendingUp,
      color: "text-risk-high",
      bgColor: "bg-risk-high-bg",
    },
    {
      label: "Avg Heat Index",
      value: `${avgHeatIndex}°C`,
      icon: ThermometerSun,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Peak Today",
      value: `${maxHeatIndex}°C`,
      icon: Activity,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
