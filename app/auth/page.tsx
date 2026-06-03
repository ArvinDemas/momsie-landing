"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

type Tab = "login" | "register"

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()

  const clearForm = () => {
    setName(""); setEmail(""); setPassword(""); setConfirm(""); setError("")
  }

  const handleTab = (t: Tab) => { setTab(t); clearForm() }

  const friendlyError = (code: string) => {
    const map: Record<string, string> = {
      "auth/user-not-found": "Email tidak terdaftar.",
      "auth/wrong-password": "Password salah.",
      "auth/email-already-in-use": "Email sudah terdaftar.",
      "auth/weak-password": "Password minimal 6 karakter.",
      "auth/invalid-email": "Format email tidak valid.",
      "auth/too-many-requests": "Terlalu banyak percobaan. Coba lagi nanti.",
      "auth/popup-closed-by-user": "Login Google dibatalkan.",
    }
    return map[code] ?? "Terjadi kesalahan. Silakan coba lagi."
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (tab === "register") {
      if (!name.trim()) return setError("Nama tidak boleh kosong.")
      if (password !== confirm) return setError("Konfirmasi password tidak cocok.")
      if (password.length < 6) return setError("Password minimal 6 karakter.")
    }
    setLoading(true)
    try {
      if (tab === "login") {
        await signInWithEmail(email, password)
      } else {
        await signUpWithEmail(email, password, name.trim())
      }
      router.push("/")
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ""
      setError(friendlyError(code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError("")
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      router.push("/")
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ""
      setError(friendlyError(code))
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50/50 flex flex-col">
      {/* Animated bg orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-pink-300/40 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-rose-300/30 blur-[120px]" />
      </div>

      {/* Back button */}
      <div className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-pink-600 transition-colors">
          <ArrowLeft className="size-4" />
          Kembali ke Beranda
        </Link>
      </div>

      {/* Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-8">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 justify-center">
            <img src="/Logo Momsie.png" alt="Momsie" className="h-9 w-9 object-contain" />
            <span className="text-2xl font-bold text-pink-600">Momsie</span>
          </div>

          {/* Tab Toggle */}
          <div className="flex rounded-xl bg-pink-50 p-1 mb-8">
            <button
              onClick={() => handleTab("login")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === "login" ? "bg-white text-pink-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Masuk
            </button>
            <button
              onClick={() => handleTab("register")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === "register" ? "bg-white text-pink-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Daftar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (register only) */}
            {tab === "register" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="Masukkan nama lengkap"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="email@contoh.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (register only) */}
            {tab === "register" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Konfirmasi Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    placeholder="Ulangi password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm transition-all"
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm transition-all active:scale-95 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {tab === "login" ? "Masuk" : "Buat Akun"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">atau</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <svg className="size-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Lanjutkan dengan Google
          </button>

          <p className="text-center text-xs text-slate-400 mt-6">
            Dengan mendaftar, kamu menyetujui{" "}
            <Link href="#" className="text-pink-500 hover:underline">Syarat & Ketentuan</Link>{" "}
            Momsie.
          </p>
        </div>
      </div>
    </div>
  )
}
