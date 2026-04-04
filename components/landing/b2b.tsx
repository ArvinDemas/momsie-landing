"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function B2BPartnership() {
  return (
    <section id="partnership" className="py-32 md:py-48 bg-white/30 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="bg-white rounded-[4rem] overflow-hidden border border-pink-200 shadow-2xl shadow-pink-100/50 relative max-w-6xl mx-auto"
        >
          {/* Decorative gradients inside banner */}
          <motion.div 
            animate={{ x: [0, 50, 0], y: [0, 30, 0], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-0 right-0 p-40 bg-pink-100 rounded-full blur-[100px] pointer-events-none" 
          />
          <motion.div 
            animate={{ x: [0, -50, 0], y: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute bottom-0 left-0 p-40 bg-rose-100 rounded-full blur-[100px] pointer-events-none" 
          />

          <div className="px-6 py-16 md:py-24 md:px-16 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              
              {/* Left: Text + CTA */}
              <div className="flex-1 text-center lg:text-left">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-8 text-balance leading-tight"
                >
                  Bergabunglah Menjadi <br/>
                  <span className="text-pink-500 mt-2 block">Pahlawan Ibu Hamil!</span>
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed text-pretty"
                >
                  Apakah Anda seorang ibu yang pernah bersalin atau lulusan kesehatan/keperawatan? Mari bergabung menjadi <strong className="text-slate-900">Mitra Doula Momsie</strong>. Kami menyediakan program pelatihan dan sertifikasi resmi. Bersama-sama, kita turunkan angka pengangguran perempuan dan bantu para calon ibu di seluruh penjuru negeri ini.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, type: "spring", bounce: 0.6 }}
                >
                  <Link 
                    href="#daftar"
                    className="inline-flex items-center justify-center gap-3 rounded-2xl bg-pink-500 px-10 py-5 text-xl font-bold text-white shadow-2xl shadow-pink-500/40 hover:bg-pink-600 hover:-translate-y-2 transition-all active:scale-95 group"
                  >
                    Daftar Menjadi Mitra Doula
                    <ArrowRight className="size-6 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>
              </div>

              {/* Right: Doula dashboard phone mockup */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8, type: "spring", bounce: 0.3 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="flex-shrink-0 lg:w-72 xl:w-80 relative"
              >
                <div className="absolute inset-0 bg-pink-200/30 rounded-3xl blur-2xl" />
                <img
                  src="/Group 60.png"
                  alt="Dashboard aplikasi Mitra Doula Momsie — tampilan jadwal, pekerjaan, dan layanan video call yang tersedia bagi mitra doula profesional"
                  loading="lazy"
                  className="relative z-10 w-full h-auto object-contain drop-shadow-2xl"
                />
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
