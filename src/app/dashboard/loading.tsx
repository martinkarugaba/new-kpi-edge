"use client";

import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="bg-background/50 flex h-screen w-full flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-card flex flex-col items-center gap-4 rounded-lg p-8 shadow-lg"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-primary"
          >
            <Loader2 className="h-12 w-12" />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex flex-col items-center gap-1"
        >
          <h3 className="text-primary text-xl font-semibold">Loading</h3>
          <p className="text-muted-foreground text-sm">
            Preparing your dashboard data...
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
