import { RiskLevel } from "./heatAdvisory";

export interface HeatZone {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
  riskLevel: RiskLevel;
  temperature: number;
  humidity: number;
  heatIndex: number;
  predictedPeak: number;
  peakTime: string;
}

export interface CityGrid {
  id: string;
  bounds: [[number, number], [number, number]]; // SW, NE corners
  riskLevel: RiskLevel;
  avgTemperature: number;
}

// Mock data for Manila, Philippines (example urban area with heat island effect)
export const mockHeatZones: HeatZone[] = [
  {
    id: "zone-1",
    name: "Downtown Business District",
    coordinates: [120.9842, 14.5995],
    riskLevel: "EXTREME",
    temperature: 38,
    humidity: 72,
    heatIndex: 48,
    predictedPeak: 51,
    peakTime: "2:00 PM",
  },
  {
    id: "zone-2",
    name: "Industrial Park East",
    coordinates: [121.0244, 14.5547],
    riskLevel: "HIGH",
    temperature: 36,
    humidity: 68,
    heatIndex: 44,
    predictedPeak: 47,
    peakTime: "3:00 PM",
  },
  {
    id: "zone-3",
    name: "Residential North",
    coordinates: [120.9962, 14.6350],
    riskLevel: "MODERATE",
    temperature: 33,
    humidity: 65,
    heatIndex: 38,
    predictedPeak: 41,
    peakTime: "2:30 PM",
  },
  {
    id: "zone-4",
    name: "University Campus",
    coordinates: [121.0654, 14.6488],
    riskLevel: "MODERATE",
    temperature: 32,
    humidity: 60,
    heatIndex: 36,
    predictedPeak: 39,
    peakTime: "1:30 PM",
  },
  {
    id: "zone-5",
    name: "Waterfront District",
    coordinates: [120.9569, 14.5833],
    riskLevel: "LOW",
    temperature: 30,
    humidity: 70,
    heatIndex: 33,
    predictedPeak: 35,
    peakTime: "2:00 PM",
  },
  {
    id: "zone-6",
    name: "Green Park Area",
    coordinates: [121.0456, 14.6200],
    riskLevel: "LOW",
    temperature: 29,
    humidity: 55,
    heatIndex: 31,
    predictedPeak: 33,
    peakTime: "1:00 PM",
  },
  {
    id: "zone-7",
    name: "Old Town Market",
    coordinates: [120.9750, 14.5700],
    riskLevel: "HIGH",
    temperature: 35,
    humidity: 70,
    heatIndex: 43,
    predictedPeak: 46,
    peakTime: "2:30 PM",
  },
  {
    id: "zone-8",
    name: "Transit Hub Central",
    coordinates: [121.0100, 14.5850],
    riskLevel: "EXTREME",
    temperature: 37,
    humidity: 75,
    heatIndex: 47,
    predictedPeak: 50,
    peakTime: "3:30 PM",
  },
];

export const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case "LOW":
      return "#22c55e"; // green
    case "MODERATE":
      return "#eab308"; // yellow
    case "HIGH":
      return "#f97316"; // orange
    case "EXTREME":
      return "#ef4444"; // red
  }
};

export const getRiskOpacity = (level: RiskLevel): number => {
  switch (level) {
    case "LOW":
      return 0.4;
    case "MODERATE":
      return 0.5;
    case "HIGH":
      return 0.6;
    case "EXTREME":
      return 0.7;
  }
};
