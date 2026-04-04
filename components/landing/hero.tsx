"use client"

import { motion } from "framer-motion"
import { Play } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative min-h-dvh pt-40 pb-32 flex items-center overflow-hidden">
      {/* Animated Flowing Shapes */}
      <motion.div 
        animate={{ y: [0, -30, 0], scale: [1, 1.05, 1] }} 
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute top-0 right-0 -mr-40 -mt-40 size-[30rem] rounded-full bg-pink-200/50 blur-[100px] pointer-events-none" 
      />
      <motion.div 
        animate={{ y: [0, 40, 0], scale: [1, 1.1, 1] }} 
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-10 size-[24rem] rounded-full bg-pink-300/30 blur-[100px] pointer-events-none" 
      />

      <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-16 lg:gap-12 items-center relative z-10">
        
        {/* Left: Content */}
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          className="max-w-2xl"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 text-sm font-semibold mb-8 shadow-sm">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2 bg-pink-500"></span>
            </span>
            Platform Doula #1 di Indonesia
          </motion.div>
          
          <motion.h1 
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-8 text-balance"
          >
            Save Mom, <br className="hidden md:block" /> Save the Kid! <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-600 block mt-2">
              Langkah Menuju Keajaiban.
            </span>
          </motion.h1>
          
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl text-pretty"
          >
            Platform digital pertama di Indonesia yang menyediakan layanan Doula profesional, telemedis, dan edukasi kehamilan secara komprehensif dalam satu genggaman. Kami hadir memastikan perjalanan kehamilan Bunda aman dan bebas stres.
          </motion.p>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <Link 
              href="#trial"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-pink-500 rounded-2xl shadow-xl shadow-pink-500/30 hover:bg-pink-600 hover:shadow-pink-500/50 hover:-translate-y-1 transition-all active:scale-95"
            >
              Dapatkan Free-Trial 1 Bulan
            </Link>
            <Link 
              href="#download"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-slate-700 bg-white/80 backdrop-blur-sm border-2 border-pink-100 rounded-2xl hover:bg-white hover:border-pink-300 hover:-translate-y-1 transition-all active:scale-95 shadow-sm hover:shadow-md"
            >
              <Play className="size-5 text-pink-500 fill-pink-500" />
              Unduh di Google Play
            </Link>
          </motion.div>
        </motion.div>

        {/* Right: Real App Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 80 }}
          className="relative lg:ml-auto w-full max-w-xl"
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 bg-pink-300/20 rounded-3xl blur-3xl pointer-events-none" />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          >
            <img
              src="/img landing page.png"
              alt="Tampilan aplikasi Momsie — Platform Doula digital #1 di Indonesia, menampilkan dashboard utama, layanan booking doula, dan fitur kesehatan ibu hamil"
              className="relative z-10 w-full h-auto object-contain drop-shadow-2xl"
              loading="eager"
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
