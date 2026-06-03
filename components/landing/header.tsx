"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import UserMenu from "@/components/auth/user-menu"

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const { user, loading } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/80 backdrop-blur-md shadow-sm border-b py-3" : "bg-transparent py-5"
    )}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/Logo Momsie.png"
            alt="Momsie — Platform Doula Digital Indonesia"
            className="h-9 w-9 object-contain"
          />
          <span className="text-2xl font-bold tracking-tight text-pink-600">Momsie</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link
            href="/"
            className={cn(
              "transition-colors hover:text-pink-500",
              pathname === "/" ? "text-pink-600 font-semibold" : "text-slate-600"
            )}
          >
            Beranda
          </Link>
          <Link
            href="/#about"
            className="hover:text-pink-500 transition-colors text-slate-600"
          >
            Tentang Kami
          </Link>
          <Link
            href="/#features"
            className="hover:text-pink-500 transition-colors text-slate-600"
          >
            Layanan
          </Link>
          <Link
            href="/artikel"
            className={cn(
              "transition-colors hover:text-pink-500",
              pathname.startsWith("/artikel") ? "text-pink-600 font-semibold" : "text-slate-600"
            )}
          >
            Artikel
          </Link>
          <Link
            href="/kalkulator"
            className={cn(
              "transition-colors hover:text-pink-500",
              pathname.startsWith("/kalkulator") ? "text-pink-600 font-semibold" : "text-slate-600"
            )}
          >
            Kalkulator
          </Link>
          <Link
            href="/game"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all",
              pathname.startsWith("/game")
                ? "bg-pink-500 text-white shadow-sm"
                : "bg-pink-100 text-pink-600 hover:bg-pink-200"
            )}
          >
            Mini Game
          </Link>
          <Link
            href="/#contact"
            className="hover:text-pink-500 transition-colors text-slate-600"
          >
            Kontak
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {!loading && (
            user ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  href="/auth"
                  className="hidden sm:inline-flex items-center justify-center rounded-xl border border-pink-300 px-4 py-2.5 text-sm font-semibold text-pink-600 hover:bg-pink-50 transition-all"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth"
                  className="hidden sm:inline-flex items-center justify-center rounded-xl bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 hover:shadow-md transition-all active:scale-95"
                >
                  Daftar
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  )
}

