"use client";

import { motion } from "motion/react";
import { Loader2, MapPin } from "lucide-react";

export default function LocationsLoading() {
  return (
    <div className="flex h-[calc(100vh-8rem)] w-full flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-card flex flex-col items-center gap-4 rounded-lg p-8 shadow-lg"
      >
        <div className="relative">
          <MapPin className="text-muted-foreground absolute h-10 w-10 opacity-10" />
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
          <h3 className="text-primary text-xl font-semibold">
            Loading Location Data
          </h3>
          <p className="text-muted-foreground text-sm">
            Fetching geographic information...
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
