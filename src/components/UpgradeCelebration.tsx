import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeCelebrationProps {
  show: boolean;
  onDismiss: () => void;
}

const UpgradeCelebration = ({ show, onDismiss }: UpgradeCelebrationProps) => {
  useEffect(() => {
    if (!show) return;

    // Fire confetti bursts
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#2dd4bf", "#1e3a5f", "#f59e0b", "#8b5cf6"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#2dd4bf", "#1e3a5f", "#f59e0b", "#8b5cf6"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Big burst in the center
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { x: 0.5, y: 0.4 },
        colors: ["#2dd4bf", "#1e3a5f", "#f59e0b", "#8b5cf6", "#ec4899"],
      });
    }, 300);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="mx-4 max-w-md w-full rounded-2xl border border-accent/30 bg-card p-8 text-center shadow-2xl"
          >
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10"
            >
              <PartyPopper className="h-8 w-8 text-accent" />
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-foreground"
            >
              Welcome to Premium! 🎉
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-3 text-muted-foreground"
            >
              Your payment was successful. You now have full access to all
              courses, projects, mentorship, and resources.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 flex items-center justify-center gap-2 text-sm text-accent font-medium"
            >
              <Crown className="h-4 w-4" />
              Premium Member
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button onClick={onDismiss} className="mt-6 w-full gap-2">
                Start Learning
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpgradeCelebration;
