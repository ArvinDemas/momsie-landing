"use client"

import Link from "next/link"
import { Trophy, Gamepad2, Sparkles } from "lucide-react"

export default function GameCTA() {
  return (
    <section className="py-12 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 p-8 md:p-10 text-white shadow-xl">
          {/* Background decoration */}
          <div className="absolute -top-8 -right-8 size-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 size-48 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Icon */}
            <div className="shrink-0 size-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <Gamepad2 className="size-10 text-white" />
            </div>

            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold mb-3">
                <Sparkles className="size-3" />
                Khusus Pengunjung Pameran
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Main Memory Match & Rebut Hadiah!
              </h2>
              <p className="text-white/80 text-sm leading-relaxed max-w-md">
                Temukan semua pasangan kartu sebelum waktu habis. Kumpulkan poin tertinggi dan namamu akan tercantum di papan peringkat Momsie!
              </p>
            </div>

            {/* CTA */}
            <div className="shrink-0 flex flex-col items-center gap-3">
              <Link
                href="/game"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-pink-600 font-bold text-sm hover:bg-pink-50 transition-all active:scale-95 shadow-md hover:shadow-lg"
              >
                <Trophy className="size-4" />
                Main Sekarang!
              </Link>
              <p className="text-white/60 text-xs">Daftar akun untuk bermain</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
