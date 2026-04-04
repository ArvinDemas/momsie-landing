"use client"

import { motion } from "framer-motion"

export default function AboutUs() {
  return (
    <section id="about" className="py-32 md:py-40 bg-white/50 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">

        {/* Heading block */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 40 },
            show: { opacity: 1, y: 0, transition: { staggerChildren: 0.2, duration: 0.8 } }
          }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <motion.div 
            variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
            className="inline-block rounded-full bg-pink-100 px-4 py-1.5 text-sm font-bold text-pink-600 mb-8 border border-pink-200 shadow-sm"
          >
            Tentang Kami &amp; Tujuan Mulia
          </motion.div>
          
          <motion.h2 
             variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
             className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-10 text-balance leading-tight"
          >
            Mengapa{" "}
            <span className="text-pink-500 relative inline-block">
              Momsie
              <span className="absolute -bottom-2 left-0 w-full h-2 bg-pink-200/50 rounded-full" />
            </span>{" "}
            Hadir untuk Bunda?
          </motion.h2>
          
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className="text-xl md:text-2xl text-slate-600 leading-relaxed text-pretty text-center"
          >
            Di Indonesia, Angka Kematian Ibu (AKI) masih sangat tinggi akibat komplikasi dan stres.
            Momsie lahir bukan sekadar sebagai aplikasi, melainkan sebagai ekosistem pendukung kuat
            untuk mengawal <strong className="text-slate-900">1000 Hari Pertama Kehidupan (HPK)</strong> anak Indonesia.{" "}
            <br /><br />
            Kami mengintegrasikan tenaga doula pendamping bersertifikat dengan teknologi medis pintar
            demi menurunkan angka kematian ibu dan bayi.
          </motion.p>
        </motion.div>

        {/* App screens showcase */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, type: "spring", bounce: 0.25 }}
          className="relative flex justify-center"
        >
          {/* Ambient glow */}
          <div className="absolute inset-8 bg-gradient-to-b from-pink-200/30 via-rose-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          <img
            src="/Group 116.png"
            alt="Rangkaian tampilan lengkap aplikasi Momsie — dashboard pengguna, program yoga prenatal, konsultasi video dengan dokter, pemesanan obat, dan monitoring kehamilan"
            loading="lazy"
            className="relative z-10 w-full max-w-4xl h-auto object-contain"
          />
        </motion.div>

      </div>
    </section>
  )
}
