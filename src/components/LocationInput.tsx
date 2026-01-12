import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Building2, Home, GraduationCap, TreePine, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LocationInputProps {
  onSubmit: (name: string, locationType: string) => void;
  isLoading: boolean;
}

const locationTypes = [
  { id: "urban", label: "Urban", icon: Building2 },
  { id: "residential", label: "Residential", icon: Home },
  { id: "campus", label: "Campus", icon: GraduationCap },
  { id: "rural", label: "Rural", icon: TreePine },
  { id: "coastal", label: "Coastal", icon: Waves },
];

export function LocationInput({ onSubmit, isLoading }: LocationInputProps) {
  const [name, setName] = useState("");
  const [locationType, setLocationType] = useState("urban");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), locationType);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-6"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Location Name
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter city, neighborhood, or address..."
              className="pl-10 h-12 text-base bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Location Type
          </label>
          <div className="grid grid-cols-5 gap-2">
            {locationTypes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setLocationType(id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                  locationType === id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={!name.trim() || isLoading}
          className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
            />
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Get Heat Advisory
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
