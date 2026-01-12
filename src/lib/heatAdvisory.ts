export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "EXTREME";

export interface HeatAdvisory {
  riskLevel: RiskLevel;
  predictedHeatSummary: string;
  recommendations: Recommendation[];
  rationale: string;
  confidenceScore: number;
  usedFallback: boolean;
}

export interface Recommendation {
  id: number;
  text: string;
  icon: string;
}

export interface LocationQuery {
  name: string;
  locationType: "urban" | "residential" | "campus" | "rural" | "coastal";
}

export const mockAdvisory: HeatAdvisory = {
  riskLevel: "HIGH",
  predictedHeatSummary: "Heat index expected to reach 105°F (40.5°C) with 65% humidity between 1-5 PM.",
  recommendations: [
    {
      id: 1,
      text: "Stay hydrated: Drink at least 8-12 oz of water every 20 minutes during outdoor activity.",
      icon: "💧",
    },
    {
      id: 2,
      text: "Limit outdoor activities to before 10 AM or after 6 PM when temperatures are cooler.",
      icon: "🕐",
    },
    {
      id: 3,
      text: "Seek shade or air-conditioned spaces during peak heat hours (1 PM - 5 PM).",
      icon: "🏠",
    },
    {
      id: 4,
      text: "Wear loose, light-colored, breathable clothing and apply SPF 30+ sunscreen.",
      icon: "👕",
    },
    {
      id: 5,
      text: "Monitor for heat exhaustion signs: dizziness, nausea, rapid heartbeat. Seek medical help if symptoms persist.",
      icon: "🚨",
    },
  ],
  rationale: "High temperatures combined with elevated humidity significantly increase heat-related illness risk. The body's ability to cool through sweat is impaired when humidity exceeds 60%, making rest periods and hydration critical for maintaining core body temperature.",
  confidenceScore: 0.87,
  usedFallback: false,
};

export const getRiskLevelColor = (level: RiskLevel) => {
  switch (level) {
    case "LOW":
      return {
        bg: "bg-risk-low-bg",
        text: "text-risk-low",
        border: "border-risk-low/30",
        gradient: "from-emerald-400 to-emerald-600",
      };
    case "MODERATE":
      return {
        bg: "bg-risk-moderate-bg",
        text: "text-risk-moderate",
        border: "border-risk-moderate/30",
        gradient: "from-amber-400 to-amber-600",
      };
    case "HIGH":
      return {
        bg: "bg-risk-high-bg",
        text: "text-risk-high",
        border: "border-risk-high/30",
        gradient: "from-orange-400 to-orange-600",
      };
    case "EXTREME":
      return {
        bg: "bg-risk-extreme-bg",
        text: "text-risk-extreme",
        border: "border-risk-extreme/30",
        gradient: "from-red-500 to-red-700",
      };
  }
};

export const getRiskLevelDescription = (level: RiskLevel) => {
  switch (level) {
    case "LOW":
      return "Conditions are safe for most outdoor activities.";
    case "MODERATE":
      return "Take precautions, especially if sensitive to heat.";
    case "HIGH":
      return "Significant risk of heat-related illness. Limit exposure.";
    case "EXTREME":
      return "Dangerous heat conditions. Avoid outdoor activities.";
  }
};
