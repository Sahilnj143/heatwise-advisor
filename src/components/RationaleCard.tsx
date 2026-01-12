import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface RationaleCardProps {
  rationale: string;
}

export function RationaleCard({ rationale }: RationaleCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-accent/10">
          <Lightbulb className="w-6 h-6 text-accent" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Rationale
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {rationale}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
