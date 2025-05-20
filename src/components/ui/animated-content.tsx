
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedContentProps {
  children: ReactNode;
  delay?: number;
}

export const AnimatedContent = ({ children, delay = 0 }: AnimatedContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedListItem = ({ children, delay = 0 }: AnimatedContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay }}
    >
      {children}
    </motion.div>
  );
};

export const FadeIn = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
