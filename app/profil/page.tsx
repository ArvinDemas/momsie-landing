"use client"

import Link from "next/link"
import { ArrowLeft, User, Mail, Calendar, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import AnimatedBackground from "@/components/landing/animated-background"

export default function ProfilPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50/30">
        <div className="size-8 rounded-full border-2 border-pink-400 border-t-transparent animate-spin" />
      </div>
    )
  }

  const joined = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "—"

  const initials = (user.displayName ?? user.email ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-pink-50/30">
      <AnimatedBackground />

      <div className="relative z-10 p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-pink-600 transition-colors">
          <ArrowLeft className="size-4" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="relative z-10 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          {/* Avatar Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-8 text-center mb-5">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName ?? ""} className="size-24 rounded-full object-cover mx-auto mb-4 border-4 border-pink-200 shadow" />
            ) : (
              <div className="size-24 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow">
                {initials}
              </div>
            )}
            <h1 className="text-xl font-bold text-slate-900">{user.displayName ?? "Pengguna Momsie"}</h1>
            <p className="text-sm text-slate-500 mt-1">{user.email}</p>

            <div className="flex justify-center mt-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-100 rounded-full px-3 py-1">
                <span className="size-1.5 rounded-full bg-green-500" />
                Akun Aktif
              </span>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow border border-pink-100 overflow-hidden mb-5">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">Informasi Akun</h2>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="flex items-center gap-4 px-6 py-4">
                <div className="size-9 rounded-xl bg-pink-50 flex items-center justify-center">
                  <User className="size-4 text-pink-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Nama</p>
                  <p className="text-sm font-medium text-slate-800">{user.displayName ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 px-6 py-4">
                <div className="size-9 rounded-xl bg-pink-50 flex items-center justify-center">
                  <Mail className="size-4 text-pink-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="text-sm font-medium text-slate-800">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 px-6 py-4">
                <div className="size-9 rounded-xl bg-pink-50 flex items-center justify-center">
                  <Calendar className="size-4 text-pink-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Bergabung sejak</p>
                  <p className="text-sm font-medium text-slate-800">{joined}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 font-semibold text-sm transition-all"
          >
            <LogOut className="size-4" />
            Keluar dari Akun
          </button>
        </div>
      </div>
    </div>
  )
}
