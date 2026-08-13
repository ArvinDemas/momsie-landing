"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut, User, ChevronDown, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { isAdmin } from "@/lib/admin-config"

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  if (!user) return null

  const userIsAdmin = isAdmin(user.email)

  const initials = (user.displayName ?? user.email ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleSignOut = async () => {
    await signOut()
    setOpen(false)
    router.push("/")
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-pink-50 transition-colors"
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.displayName ?? "User"} className="size-8 rounded-full object-cover border-2 border-pink-200" />
        ) : (
          <div className="size-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
        )}
        <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
          {user.displayName ?? user.email}
        </span>
        <ChevronDown className={`size-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800 truncate">{user.displayName ?? "Pengguna"}</p>
              {userIsAdmin && (
                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full shrink-0 ml-1">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
          <div className="p-2 space-y-0.5">
            {userIsAdmin && (
              <button
                onClick={() => { setOpen(false); router.push("/dashboard/berita") }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              >
                <LayoutDashboard className="size-4 text-blue-600" />
                Dashboard Admin
              </button>
            )}
            <button
              onClick={() => { setOpen(false); router.push("/profil") }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl transition-colors"
            >
              <User className="size-4" />
              Profil Saya
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="size-4" />
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
