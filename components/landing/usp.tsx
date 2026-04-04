"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

const usps = [
  {
    title: "Layanan Konsultasi 24 Jam",
    description: "Akses chat darurat tanpa henti bersama pakar melalui satu ketukan."
  },
  {
    title: "Harga Terjangkau & Adaptif",
    description: "Pilihan paket Reguler, Silver, hingga Premium yang ramah di kantong dengan fasilitas memukau."
  },
  {
    title: "Sistem Ulasan Transparan",
    description: "Pilih pendamping doula terbaik murni berdasarkan rating nyata dan pengalaman Bunda lainnya."
  }
]

export default function USP() {
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.9 },
    show: { opacity: 1, x: 0, scale: 1, transition: { type: "spring" as const, bounce: 0.4 } }
  }

  return (
    <section className="py-32 md:py-40 bg-white/60 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-20 lg:items-center">
          
          {/* Left Text */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-8 text-balance">
                Mengapa Memilih <span className="text-pink-500">Momsie?</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-600 mb-12 text-pretty leading-relaxed max-w-xl">
                Komitmen kami adalah memberikan akses layanan kehamilan kelas dunia yang adaptif dengan kebutuhan setiap Bunda di penjuru Indonesia.
              </p>
            </motion.div>

            <motion.ul 
              variants={listVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              {usps.map((usp, i) => (
                <motion.li 
                  key={USP.name + i}
                  variants={itemVariants}
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="flex gap-6 items-start group bg-white p-6 rounded-3xl shadow-sm border border-pink-50 hover:shadow-xl hover:border-pink-200 transition-all cursor-default"
                >
                  <div className="mt-1 p-2 bg-pink-100 rounded-full group-hover:bg-pink-500 group-hover:text-white transition-colors">
                    <CheckCircle2 className="size-8 text-pink-500 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-pink-600 transition-colors">{usp.title}</h4>
                    <p className="text-lg text-slate-600 leading-relaxed text-pretty">
                      {usp.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Right Image/Visual: Real video consultation screenshot */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="flex-1 relative flex items-center justify-center"
          >
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-200/40 to-rose-100/30 rounded-[3rem] blur-3xl pointer-events-none" />
            <motion.div
              whileHover={{ scale: 1.03, y: -8 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative z-10"
            >
              <img
                src="/Salinan dari Salinan dari Momsie On ProggresPickdeck Momsie (20) 2.png"
                alt="Fitur konsultasi video 24 jam dengan Doula profesional bersertifikat di aplikasi Momsie"
                loading="lazy"
                className="w-full max-w-sm mx-auto h-auto object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
