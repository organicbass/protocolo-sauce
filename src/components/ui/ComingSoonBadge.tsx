"use client";

import { motion } from 'framer-motion';

export const ComingSoonBadge = ({ isButton = false }: { isButton?: boolean }) => (
  <motion.span
    initial={{ opacity: 0, y: 10, scale: 0.8 }}
    animate={{ 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }}
    className={`absolute ${isButton ? '-top-3 -right-2' : '-top-4 -right-4'} pointer-events-none`}
  >
    <motion.div
      animate={{ 
        y: [0, -4, 0],
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="bg-purple-600/80 backdrop-blur-md text-white text-[7px] font-black px-2 py-0.5 rounded-full border border-white/20 shadow-[0_0_10px_rgba(147,51,234,0.5)] whitespace-nowrap uppercase tracking-widest"
    >
      Em Breve
    </motion.div>
  </motion.span>
);
