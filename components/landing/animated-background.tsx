"use client"

import { motion } from "framer-motion"

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-pink-50/50 pointer-events-none">
      {/* Orb 1: Top Left */}
      <motion.div
        animate={{
          x: [0, 150, -100, 0],
          y: [0, 100, -150, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-pink-300/40 mix-blend-multiply blur-[120px]"
      />
      {/* Orb 2: Bottom Right */}
      <motion.div
        animate={{
          x: [0, -150, 80, 0],
          y: [0, -100, 120, 0],
          scale: [1, 1.4, 0.9, 1],
        }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full bg-rose-300/30 mix-blend-multiply blur-[120px]"
      />
      {/* Orb 3: Center-Left */}
      <motion.div
        animate={{
          x: [0, 120, -120, 0],
          y: [0, -120, 80, 0],
          scale: [1, 0.8, 1.3, 1],
        }}
        transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
        className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-fuchsia-200/40 mix-blend-multiply blur-[100px]"
      />
      {/* Orb 4: Center-Right */}
      <motion.div
        animate={{
          x: [0, -100, 100, 0],
          y: [0, 150, -100, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
        className="absolute top-[40%] right-[20%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-pink-400/20 mix-blend-multiply blur-[100px]"
      />
    </div>
  )
}
