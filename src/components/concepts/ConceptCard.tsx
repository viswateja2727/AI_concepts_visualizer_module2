import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ConceptCardProps {
  title: string;
  shortDescription: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  buttonText: string;
  onSeeClick: () => void;
}

const ConceptCard = ({
  title,
  shortDescription,
  icon: Icon,
  iconColor,
  iconBgColor,
  buttonText,
  onSeeClick,
}: ConceptCardProps) => {
  return (
    <motion.div
      className="bg-card rounded-2xl p-5 border border-border relative overflow-hidden"
      style={{ boxShadow: "var(--shadow-card)" }}
      whileHover={{ y: -4, boxShadow: "var(--shadow-glow)" }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative plus signs */}
      <span className="absolute top-3 right-3 text-primary/30 text-lg">+</span>
      <span className="absolute bottom-3 right-3 text-primary/20 text-sm">+</span>

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-2xl ${iconBgColor} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {shortDescription}
          </p>
        </div>
      </div>

      {/* See Button */}
      <motion.button
        onClick={onSeeClick}
        className="mt-4 btn-start flex items-center gap-2 text-sm px-5 py-2.5 ml-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <Play className="w-4 h-4" />
        {buttonText}
      </motion.button>
    </motion.div>
  );
};

export default ConceptCard;
