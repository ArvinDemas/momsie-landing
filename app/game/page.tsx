"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import {
  Baby,
  Heart,
  Star,
  Moon,
  Sun,
  Music,
  Gift,
  Leaf,
  Trophy,
  Timer,
  RotateCcw,
  Crown,
  Medal,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import AnimatedBackground from "@/components/landing/animated-background"
import Header from "@/components/landing/header"
import ProtectedRoute from "@/components/auth/protected-route"
import { useAuth } from "@/lib/auth-context"
import { saveScore, getTopScores, type GameScore } from "@/lib/game-service"

// ── Card definitions ──────────────────────────────────────────────────────────
const CARD_TYPES = [
  { id: "baby",  icon: Baby,   label: "Bayi",    color: "text-pink-500",   bg: "bg-pink-100"   },
  { id: "heart", icon: Heart,  label: "Cinta",   color: "text-rose-500",   bg: "bg-rose-100"   },
  { id: "star",  icon: Star,   label: "Bintang", color: "text-yellow-500", bg: "bg-yellow-100" },
  { id: "moon",  icon: Moon,   label: "Bulan",   color: "text-purple-500", bg: "bg-purple-100" },
  { id: "sun",   icon: Sun,    label: "Matahari",color: "text-orange-500", bg: "bg-orange-100" },
  { id: "music", icon: Music,  label: "Musik",   color: "text-blue-500",   bg: "bg-blue-100"   },
  { id: "gift",  icon: Gift,   label: "Hadiah",  color: "text-emerald-500",bg: "bg-emerald-100"},
  { id: "leaf",  icon: Leaf,   label: "Alam",    color: "text-green-500",  bg: "bg-green-100"  },
]

interface Card {
  uid: string   // unique per card instance
  typeId: string
  isFlipped: boolean
  isMatched: boolean
}

const GAME_DURATION = 60 // seconds

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function buildDeck(): Card[] {
  const pairs = [...CARD_TYPES, ...CARD_TYPES].map((t, i) => ({
    uid: `${t.id}-${i}`,
    typeId: t.id,
    isFlipped: false,
    isMatched: false,
  }))
  return shuffle(pairs)
}

function calcScore(matches: number, misses: number, timeLeft: number) {
  return Math.max(0, matches * 100 - misses * 10 + timeLeft * 10)
}

type GamePhase = "idle" | "playing" | "finished"

// ── Leaderboard sub-component ─────────────────────────────────────────────────
function Leaderboard({ scores, highlightUid }: { scores: GameScore[]; highlightUid?: string }) {
  const medals = [Crown, Trophy, Medal]
  const medalColors = ["text-yellow-500", "text-slate-400", "text-amber-600"]

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-pink-100 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Trophy className="size-5 text-pink-500" />
        <h2 className="text-lg font-bold text-slate-900">Papan Peringkat</h2>
        <span className="ml-auto text-xs text-slate-400">Top 10</span>
      </div>

      {scores.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-8">Belum ada skor. Jadilah yang pertama!</p>
      ) : (
        <ol className="space-y-2">
          {scores.map((s, i) => {
            const MedalIcon = i < 3 ? medals[i] : null
            const isHighlighted = s.uid === highlightUid
            return (
              <li
                key={s.id}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                  isHighlighted
                    ? "bg-pink-100 border border-pink-300 shadow-sm"
                    : "bg-slate-50 border border-transparent"
                }`}
              >
                <span className="w-6 text-center">
                  {MedalIcon ? (
                    <MedalIcon className={`size-5 ${medalColors[i]}`} />
                  ) : (
                    <span className="text-xs font-bold text-slate-400">{i + 1}</span>
                  )}
                </span>
                <span className="flex-1 text-sm font-semibold text-slate-800 truncate">{s.name}</span>
                <span className="text-sm font-bold text-pink-600">{s.score.toLocaleString()}</span>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

// ── Main Game Component ───────────────────────────────────────────────────────
function MemoryGame() {
  const { user } = useAuth()
  const [phase, setPhase] = useState<GamePhase>("idle")
  const [deck, setDeck] = useState<Card[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [matches, setMatches] = useState(0)
  const [misses, setMisses] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [scores, setScores] = useState<GameScore[]>([])
  const [saving, setSaving] = useState(false)
  const [lastScore, setLastScore] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lockRef = useRef(false)

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Pemain"

  // Load leaderboard
  const loadScores = useCallback(async () => {
    const top = await getTopScores(10)
    setScores(top)
  }, [])

  useEffect(() => { loadScores() }, [loadScores])

  // Timer
  useEffect(() => {
    if (phase !== "playing") return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          setPhase("finished")
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [phase])

  // Check win condition
  useEffect(() => {
    if (phase === "playing" && matches === CARD_TYPES.length) {
      clearInterval(timerRef.current!)
      setPhase("finished")
    }
  }, [matches, phase])

  // Save score when finished
  useEffect(() => {
    if (phase !== "finished" || saving) return
    const score = calcScore(matches, misses, timeLeft)
    setLastScore(score)
    if (!user) return
    setSaving(true)
    saveScore({
      uid: user.uid,
      name: displayName,
      score,
      matches,
      misses,
      timeLeft,
    }).then(() => {
      setSaving(false)
      loadScores()
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  function startGame() {
    setDeck(buildDeck())
    setSelected([])
    setMatches(0)
    setMisses(0)
    setTimeLeft(GAME_DURATION)
    setLastScore(null)
    setPhase("playing")
    lockRef.current = false
  }

  function handleCardClick(uid: string) {
    if (lockRef.current || phase !== "playing") return
    const card = deck.find((c) => c.uid === uid)
    if (!card || card.isFlipped || card.isMatched) return
    if (selected.includes(uid)) return

    // Flip card
    setDeck((prev) => prev.map((c) => c.uid === uid ? { ...c, isFlipped: true } : c))
    const newSelected = [...selected, uid]

    if (newSelected.length < 2) {
      setSelected(newSelected)
      return
    }

    // Two cards flipped — check match
    setSelected([])
    lockRef.current = true

    const [aUid, bUid] = newSelected
    const a = deck.find((c) => c.uid === aUid)!
    const b = deck.find((c) => c.uid === bUid)!
    const flippedB = { ...b, isFlipped: true }

    if (a.typeId === b.typeId) {
      // Match!
      setMatches((m) => m + 1)
      setDeck((prev) =>
        prev.map((c) =>
          c.uid === aUid || c.uid === bUid ? { ...c, isFlipped: true, isMatched: true } : c
        )
      )
      lockRef.current = false
    } else {
      // Mismatch — flip back after delay
      setMisses((m) => m + 1)
      setDeck((prev) =>
        prev.map((c) =>
          c.uid === bUid ? flippedB : c
        )
      )
      setTimeout(() => {
        setDeck((prev) =>
          prev.map((c) =>
            c.uid === aUid || c.uid === bUid ? { ...c, isFlipped: false } : c
          )
        )
        lockRef.current = false
      }, 900)
    }
  }

  const currentScore = calcScore(matches, misses, timeLeft)
  const timerPercent = (timeLeft / GAME_DURATION) * 100
  const timerColor =
    timeLeft > 20 ? "bg-pink-500" : timeLeft > 10 ? "bg-orange-400" : "bg-red-500"

  return (
    <div className="min-h-screen bg-pink-50/30">
      <AnimatedBackground />
      <Header />

      <div className="relative z-10 container mx-auto px-4 md:px-6 max-w-5xl pt-24 pb-16">

        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-600 mb-4">
            <Sparkles className="size-4" />
            Momsie Mini Game
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Memory Match
          </h1>
          <p className="text-slate-500 max-w-md mx-auto text-sm">
            Temukan semua pasangan kartu sebelum waktu habis. Kumpulkan poin sebanyaknya dan masuk papan peringkat!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Game Area ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* HUD */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-sm px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-500">Skor</p>
                    <p className="text-2xl font-bold text-pink-600">{currentScore.toLocaleString()}</p>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-500">Pasangan</p>
                    <p className="text-2xl font-bold text-emerald-600">{matches}/{CARD_TYPES.length}</p>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div className="text-center">
                    <p className="text-xs font-medium text-slate-500">Salah</p>
                    <p className="text-2xl font-bold text-rose-400">{misses}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className={`size-5 ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-slate-400"}`} />
                  <span className={`text-2xl font-bold tabular-nums ${timeLeft <= 10 ? "text-red-500" : "text-slate-800"}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>
              {/* Timer bar */}
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
                  style={{ width: `${timerPercent}%` }}
                />
              </div>
            </div>

            {/* Card Grid */}
            {phase === "idle" ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-pink-100 shadow-lg flex flex-col items-center justify-center py-20 px-6 text-center gap-5">
                <div className="flex gap-3 text-pink-400">
                  {[Baby, Heart, Star, Gift].map((Icon, i) => (
                    <div key={i} className="size-12 bg-pink-100 rounded-2xl flex items-center justify-center">
                      <Icon className="size-6" />
                    </div>
                  ))}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">Siap Bermain?</h2>
                  <p className="text-sm text-slate-500">Cocokkan 8 pasang kartu dalam {GAME_DURATION} detik!</p>
                </div>
                <div className="flex gap-6 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-500" /> Cocok: +100 poin</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-rose-400" /> Salah: -10 poin</span>
                  <span className="flex items-center gap-1.5"><Timer className="size-4 text-pink-500" /> Sisa waktu: +10/detik</span>
                </div>
                <button
                  onClick={startGame}
                  className="px-8 py-3.5 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-base shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  Mulai Game!
                </button>
              </div>
            ) : phase === "finished" ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-pink-100 shadow-lg flex flex-col items-center justify-center py-16 px-6 text-center gap-5">
                <div className="size-20 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
                  <Trophy className="size-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">
                    {matches === CARD_TYPES.length ? "Sempurna! 🎉" : "Waktu Habis!"}
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Kamu menemukan {matches} dari {CARD_TYPES.length} pasang kartu
                  </p>
                </div>

                {/* Score breakdown */}
                <div className="w-full max-w-xs bg-pink-50 rounded-2xl p-5 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Pasangan ({matches}x)</span>
                    <span className="font-semibold text-emerald-600">+{matches * 100}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Salah ({misses}x)</span>
                    <span className="font-semibold text-rose-500">-{misses * 10}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Bonus waktu ({timeLeft}s)</span>
                    <span className="font-semibold text-blue-500">+{timeLeft * 10}</span>
                  </div>
                  <div className="border-t border-pink-200 pt-2 flex justify-between">
                    <span className="font-bold text-slate-900">Total Skor</span>
                    <span className="font-bold text-2xl text-pink-600">{lastScore?.toLocaleString() ?? "..."}</span>
                  </div>
                </div>

                {saving && <p className="text-xs text-slate-400 animate-pulse">Menyimpan skor...</p>}

                <div className="flex gap-3">
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-semibold transition-all active:scale-95 shadow-sm"
                  >
                    <RotateCcw className="size-4" />
                    Main Lagi
                  </button>
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-pink-200 text-pink-600 font-semibold hover:bg-pink-50 transition-all"
                  >
                    <ArrowLeft className="size-4" />
                    Beranda
                  </Link>
                </div>
              </div>
            ) : (
              /* Playing state — card grid */
              <div className="grid grid-cols-4 gap-3">
                {deck.map((card) => {
                  const type = CARD_TYPES.find((t) => t.id === card.typeId)!
                  const Icon = type.icon
                  return (
                    <button
                      key={card.uid}
                      onClick={() => handleCardClick(card.uid)}
                      disabled={card.isFlipped || card.isMatched}
                      className="aspect-square"
                      style={{ perspective: "600px" }}
                    >
                      <div
                        className="relative w-full h-full transition-transform duration-500"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: card.isFlipped || card.isMatched ? "rotateY(180deg)" : "rotateY(0deg)",
                        }}
                      >
                        {/* Back face */}
                        <div
                          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-md flex items-center justify-center"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <Baby className="size-6 text-white/60" />
                        </div>
                        {/* Front face */}
                        <div
                          className={`absolute inset-0 rounded-2xl shadow-md flex flex-col items-center justify-center gap-1 border-2 ${
                            card.isMatched
                              ? "bg-emerald-50 border-emerald-300"
                              : `${type.bg} border-transparent`
                          }`}
                          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                        >
                          <Icon className={`size-8 md:size-10 ${card.isMatched ? "text-emerald-500" : type.color}`} />
                          {card.isMatched && (
                            <CheckCircle2 className="size-4 text-emerald-500 absolute top-1.5 right-1.5" />
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Right: Leaderboard ── */}
          <div className="space-y-4">
            <Leaderboard scores={scores} highlightUid={user?.uid} />

            {/* Scoring Guide */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-pink-100 p-4 text-sm space-y-2">
              <p className="font-semibold text-slate-700 mb-2">Cara Menghitung Skor</p>
              <div className="flex justify-between text-slate-600">
                <span>Pasangan cocok</span>
                <span className="font-semibold text-emerald-600">+100 poin</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tebakan salah</span>
                <span className="font-semibold text-rose-500">-10 poin</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Bonus sisa waktu</span>
                <span className="font-semibold text-blue-500">×10 / detik</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between text-slate-700">
                <span>Skor maksimal</span>
                <span className="font-bold text-pink-600">1.400 poin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GamePage() {
  return (
    <ProtectedRoute>
      <MemoryGame />
    </ProtectedRoute>
  )
}
