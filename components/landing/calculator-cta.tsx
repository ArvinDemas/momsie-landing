"use client"

import Link from "next/link"
import { Baby, ArrowRight, Calendar } from "lucide-react"

export default function CalculatorCTA() {
  return (
    <section className="py-12 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 to-rose-500 p-8 md:p-10">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 size-52 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-white/10" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white mb-4">
                <Baby className="size-3.5" />
                Kalkulator Gratis
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Berapa Usia Kehamilanmu Sekarang?
              </h2>
              <p className="text-pink-100 text-sm md:text-base leading-relaxed">
                Masukkan HPHT dan dapatkan informasi lengkap: usia kehamilan, perkiraan persalinan, info trimester, dan milestone perkembangan bayi.
              </p>
            </div>

            <div className="flex flex-col gap-3 shrink-0">
              <Link
                href="/kalkulator"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-pink-600 font-bold text-sm hover:bg-pink-50 transition-all active:scale-95 shadow-sm"
              >
                <Calendar className="size-4" />
                Hitung Sekarang
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/artikel"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/20 text-white font-semibold text-sm hover:bg-white/30 transition-all"
              >
                <Baby className="size-4" />
                Baca Artikel Kehamilan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
