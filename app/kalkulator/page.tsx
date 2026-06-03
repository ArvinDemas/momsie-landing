"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Baby, Info, ChevronDown, ChevronUp } from "lucide-react"
import AnimatedBackground from "@/components/landing/animated-background"
import Header from "@/components/landing/header"
import ProtectedRoute from "@/components/auth/protected-route"

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatDate(date: Date) {
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
}

function getWeeksAndDays(hpht: Date) {
  const now = new Date()
  const diffMs = now.getTime() - hpht.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(diffDays / 7)
  const days = diffDays % 7
  return { weeks, days, totalDays: diffDays }
}

function getTrimester(weeks: number) {
  if (weeks <= 12) return 1
  if (weeks <= 27) return 2
  return 3
}

const trimesterInfo = [
  {
    number: 1,
    weeks: "Minggu 1–12",
    title: "Trimester Pertama",
    color: "from-pink-400 to-rose-400",
    babyInfo: "Ukuran bayi sekitar 6 cm (sebesar jeruk limau). Organ vital mulai terbentuk: jantung, otak, sumsum tulang belakang.",
    momInfo: "Ibu mungkin mengalami mual di pagi hari (morning sickness), payudara sensitif, dan kelelahan. Ini normal!",
  },
  {
    number: 2,
    weeks: "Minggu 13–27",
    title: "Trimester Kedua",
    color: "from-purple-400 to-pink-400",
    babyInfo: "Bayi bisa bergerak dan merasakan sentuhan. Jenis kelamin sudah dapat terlihat melalui USG. Berat sekitar 600–900 gram.",
    momInfo: "Mual biasanya berkurang. Perut mulai terlihat membesar. Waktunya mulai senam hamil dan konsultasi dengan doula!",
  },
  {
    number: 3,
    weeks: "Minggu 28–40",
    title: "Trimester Ketiga",
    color: "from-rose-400 to-orange-400",
    babyInfo: "Bayi tumbuh pesat dan mempersiapkan diri untuk lahir. Beratnya bisa mencapai 2,5–4 kg.",
    momInfo: "Punggung terasa berat, sesak napas. Saatnya menyiapkan perlengkapan bayi, birth plan, dan pendampingan doula.",
  },
]

const weekByWeekHighlights: Record<number, string> = {
  4: "Embrio sudah menempel di rahim. Jantung primitif mulai berdetak.",
  8: "Semua organ utama mulai terbentuk. Embrio resmi disebut janin.",
  12: "Kuku dan sidik jari mulai terbentuk. USG pertama direkomendasikan.",
  16: "Bayi bisa mendengar suaramu. Mulailah berbicara padanya!",
  20: "Milestone penting: USG anomali. Berat sekitar 300 gram.",
  24: "Paru-paru mulai berkembang. Bayi bisa tersenyum dan cegukan.",
  28: "Mata terbuka pertama kali. Bayi bisa merasakan cahaya.",
  32: "Posisi kepala bayi biasanya sudah di bawah.",
  36: "Bayi sudah siap lahir jika diperlukan (prematur akhir).",
  40: "Saatnya bertemu si kecil! Estimasi persalinan.",
}

export default function KalkulatorPage() {
  const [hphtInput, setHphtInput] = useState("")
  const [result, setResult] = useState<null | ReturnType<typeof calculateResult>>(null)
  const [showWeekInfo, setShowWeekInfo] = useState(false)

  function calculateResult(hphtStr: string) {
    const hpht = new Date(hphtStr)
    const hpl = addDays(hpht, 280)
    const { weeks, days, totalDays } = getWeeksAndDays(hpht)
    const trimester = getTrimester(weeks)
    const progressPercent = Math.min(Math.round((totalDays / 280) * 100), 100)
    const nearestMilestone = Object.keys(weekByWeekHighlights)
      .map(Number)
      .find((w) => w >= weeks) ?? 40
    return { hpht, hpl, weeks, days, totalDays, trimester, progressPercent, nearestMilestone }
  }

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hphtInput) return
    setResult(calculateResult(hphtInput))
    setShowWeekInfo(false)
  }

  const today = new Date().toISOString().split("T")[0]
  const minDate = new Date()
  minDate.setFullYear(minDate.getFullYear() - 1)
  const minDateStr = minDate.toISOString().split("T")[0]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-pink-50/30">
        <AnimatedBackground />
        <Header />

        <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-2xl pt-24 pb-12">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-600 mb-4">
            <Baby className="size-4" />
            Kalkulator Kehamilan
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Hitung Usia Kehamilanmu
          </h1>
          <p className="text-slate-500 text-base">
            Masukkan HPHT (Hari Pertama Haid Terakhir) untuk mengetahui usia kehamilan dan perkiraan persalinan.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-pink-100 p-8 mb-8">
          <form onSubmit={handleCalculate} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Hari Pertama Haid Terakhir (HPHT)
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-pink-400" />
                <input
                  type="date"
                  value={hphtInput}
                  onChange={(e) => setHphtInput(e.target.value)}
                  max={today}
                  min={minDateStr}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm transition-all"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                <Info className="size-3" />
                HPHT adalah hari pertama menstruasi terakhir kamu sebelum hamil.
              </p>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold transition-all active:scale-95 shadow-sm hover:shadow-md"
            >
              Hitung Sekarang
            </button>
          </form>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-pink-100 p-8">
              <div className="grid grid-cols-2 gap-5 mb-8">
                <div className="bg-pink-50 rounded-2xl p-5 text-center">
                  <p className="text-xs font-medium text-slate-500 mb-1">Usia Kehamilan</p>
                  <p className="text-3xl font-bold text-pink-600">{result.weeks}</p>
                  <p className="text-sm text-slate-500">minggu {result.days > 0 ? `${result.days} hari` : ""}</p>
                </div>
                <div className="bg-rose-50 rounded-2xl p-5 text-center">
                  <p className="text-xs font-medium text-slate-500 mb-1">Trimester</p>
                  <p className="text-3xl font-bold text-rose-500">{result.trimester}</p>
                  <p className="text-sm text-slate-500">{trimesterInfo[result.trimester - 1].weeks}</p>
                </div>
              </div>

              {/* HPL */}
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-5 text-white text-center mb-6">
                <p className="text-sm font-medium text-pink-100 mb-1">Perkiraan Hari Persalinan (HPL)</p>
                <p className="text-2xl font-bold">{formatDate(result.hpl)}</p>
                <p className="text-xs text-pink-200 mt-1">HPHT: {formatDate(result.hpht)}</p>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Minggu 1</span>
                  <span className="font-semibold text-pink-600">{result.progressPercent}% selesai</span>
                  <span>Minggu 40</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-1000"
                    style={{ width: `${result.progressPercent}%` }}
                  />
                </div>
                <p className="text-center text-xs text-slate-400 mt-2">
                  {result.weeks < 40
                    ? `Tersisa sekitar ${40 - result.weeks} minggu lagi`
                    : "Selamat, sudah melewati usia 40 minggu!"}
                </p>
              </div>
            </div>

            {/* Trimester Info */}
            <div className={`bg-gradient-to-r ${trimesterInfo[result.trimester - 1].color} rounded-3xl p-6 text-white`}>
              <h3 className="font-bold text-lg mb-4">{trimesterInfo[result.trimester - 1].title}</h3>
              <div className="space-y-3">
                <div className="bg-white/20 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-white/70 mb-1">Perkembangan Bayi</p>
                  <p className="text-sm leading-relaxed">{trimesterInfo[result.trimester - 1].babyInfo}</p>
                </div>
                <div className="bg-white/20 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-white/70 mb-1">Kondisi Ibu</p>
                  <p className="text-sm leading-relaxed">{trimesterInfo[result.trimester - 1].momInfo}</p>
                </div>
              </div>
            </div>

            {/* Week Highlight */}
            <div className="bg-white/80 rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
              <button
                onClick={() => setShowWeekInfo(!showWeekInfo)}
                className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold text-slate-800 hover:bg-pink-50/50 transition-colors"
              >
                <span>Milestone Berikutnya (Minggu {result.nearestMilestone})</span>
                {showWeekInfo ? <ChevronUp className="size-4 text-pink-500" /> : <ChevronDown className="size-4 text-pink-500" />}
              </button>
              {showWeekInfo && (
                <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {weekByWeekHighlights[result.nearestMilestone]}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-3xl p-6 text-center border border-pink-100">
              <p className="font-semibold text-slate-800 mb-2">Dapatkan Pendampingan dari Doula Terpercaya</p>
              <p className="text-sm text-slate-500 mb-4">Bergabung dengan Momsie dan temukan doula bersertifikat yang siap mendampingi perjalanan kehamilanmu.</p>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-500 text-white font-semibold text-sm hover:bg-pink-600 transition-all active:scale-95"
              >
                Daftar Gratis Sekarang
              </Link>
            </div>
          </div>
        )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
