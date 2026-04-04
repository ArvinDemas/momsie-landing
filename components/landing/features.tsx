"use client"

import { motion } from "framer-motion"
import { HeartHandshake, MapPin, ActivitySquare, ShoppingBag, Baby } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const features = [
  {
    title: "Top Doula Features",
    description: "Booking Doula profesional bersertifikat dengan fleksibilitas jadwal, melayani door-to-door maupun pendampingan di rumah sakit.",
    icon: HeartHandshake,
    image: "/img1.png",
    imageAlt: "Tampilan layar booking Doula di aplikasi Momsie — pilih tanggal, jam, dan jenis layanan pendampingan",
    wide: true,
  },
  {
    title: "Top Recommendations",
    description: "Rekomendasi instan dan pencarian rute ke Rumah Sakit, Klinik, dan fasilitas kesehatan terdekat.",
    icon: MapPin,
  },
  {
    title: "Structured Pregnancy Program",
    description: "Pantau perkembangan janin setiap minggu. Nikmati Advance Theme ukuran janin dan dapatkan reward voucher belanja dari streak Prenatal Yoga harian Bunda!",
    icon: ActivitySquare,
    image: "/Salinan dari Salinan dari Momsie On ProggresPickdeck Momsie (10) 8.png",
    imageAlt: "Program Yoga Prenatal terstruktur di aplikasi Momsie — kurikulum latihan per bulan kehamilan Bunda",
  },
  {
    title: "Online Ordering",
    description: "Beli obat, suplemen, dan tebus resep secara instan dari apotek terdekat yang diantar langsung ke rumah.",
    icon: ShoppingBag,
  },
  {
    title: "Marketplace Maternal",
    description: "Temukan perlengkapan ibu dan bayi dengan harga terjangkau, mulai dari baju hamil hingga alat menyusui.",
    icon: Baby,
  },
]

export default function Features() {

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100 } }
  }

  return (
    <section id="features" className="py-32 md:py-40 bg-white/40">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-block rounded-full bg-pink-100/80 px-4 py-1.5 text-sm font-bold text-pink-600 mb-6 border border-pink-200">
            Pusat Keajaiban Bunda
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 text-balance">
            Semua Kebutuhan Kehamilan Bunda, <br className="hidden md:block"/>
            <span className="text-pink-500 relative inline-block">
              Terpusat di Sini.
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full" />
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600">
            Satu genggaman untuk perjalanan yang tenang &amp; membahagiakan.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon
            const isWide = i === 0
            const hasImage = !!feature.image

            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className={isWide ? "lg:col-span-2" : ""}
              >
                <Card className="h-full border-pink-100 shadow-md hover:shadow-xl hover:shadow-pink-200/50 transition-all bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden group">
                  
                  {/* Wide card with image: side-by-side layout */}
                  {isWide && hasImage ? (
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="flex-1 flex flex-col">
                        <CardHeader className="pb-4 px-8 pt-8">
                          <div className="size-16 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center text-pink-600 mb-6 group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-rose-400 group-hover:text-white group-hover:scale-110 transition-all shadow-sm">
                            <Icon className="size-8" />
                          </div>
                          <CardTitle className="text-2xl md:text-3xl font-extrabold text-slate-900 group-hover:text-pink-600 transition-colors">
                            {feature.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 flex-1">
                          <p className="text-slate-600 text-lg md:text-xl leading-relaxed text-pretty">
                            {feature.description}
                          </p>
                        </CardContent>
                      </div>
                      {/* Phone image panel */}
                      <div className="relative md:w-52 lg:w-60 xl:w-64 flex-shrink-0 flex items-end justify-center bg-gradient-to-br from-pink-50 to-rose-50 pt-6 overflow-hidden">
                        <img
                          src={feature.image}
                          alt={feature.imageAlt}
                          loading="lazy"
                          className="h-64 md:h-72 lg:h-80 w-auto object-contain object-bottom drop-shadow-lg transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2"
                        />
                      </div>
                    </div>

                  ) : hasImage ? (
                    /* Regular card with image at bottom */
                    <div className="flex flex-col h-full">
                      <CardHeader className="pb-4 px-8 pt-8">
                        <div className="size-16 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center text-pink-600 mb-6 group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-rose-400 group-hover:text-white group-hover:scale-110 transition-all shadow-sm">
                          <Icon className="size-8" />
                        </div>
                        <CardTitle className="text-2xl md:text-3xl font-extrabold text-slate-900 group-hover:text-pink-600 transition-colors">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-8 pb-4 flex-1">
                        <p className="text-slate-600 text-lg md:text-xl leading-relaxed text-pretty">
                          {feature.description}
                        </p>
                      </CardContent>
                      <div className="flex items-end justify-center bg-gradient-to-b from-transparent to-pink-50/60 overflow-hidden h-52 px-6">
                        <img
                          src={feature.image}
                          alt={feature.imageAlt}
                          loading="lazy"
                          className="h-52 w-auto object-contain object-bottom drop-shadow-lg transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2"
                        />
                      </div>
                    </div>

                  ) : (
                    /* Standard card, no image */
                    <>
                      <CardHeader className="pb-4 px-8 pt-8">
                        <div className="size-16 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center text-pink-600 mb-6 group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-rose-400 group-hover:text-white group-hover:scale-110 transition-all shadow-sm">
                          <Icon className="size-8" />
                        </div>
                        <CardTitle className="text-2xl md:text-3xl font-extrabold text-slate-900 group-hover:text-pink-600 transition-colors">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-8 pb-8">
                        <p className="text-slate-600 text-lg md:text-xl leading-relaxed text-pretty">
                          {feature.description}
                        </p>
                      </CardContent>
                    </>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
