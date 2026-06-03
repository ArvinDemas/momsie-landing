"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import UserMenu from "@/components/auth/user-menu"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, loading } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-300",
      (scrolled || mobileMenuOpen) ? "bg-white/80 backdrop-blur-md shadow-sm border-b py-3" : "bg-transparent py-5"
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

        {/* Desktop Navigation */}
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
              "transition-colors hover:text-pink-500",
              pathname.startsWith("/game") ? "text-pink-600 font-semibold" : "text-slate-600"
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
                  className="hidden md:inline-flex items-center justify-center rounded-xl border border-pink-300 px-4 py-2.5 text-sm font-semibold text-pink-600 hover:bg-pink-50 transition-all"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth"
                  className="hidden md:inline-flex items-center justify-center rounded-xl bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 hover:shadow-md transition-all active:scale-95"
                >
                  Daftar
                </Link>
              </>
            )
          )}

          {/* Hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-colors active:scale-95"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden border-b border-slate-100 bg-white/95 backdrop-blur-md overflow-hidden shadow-lg absolute top-full left-0 right-0"
          >
            <div className="px-6 py-5 flex flex-col gap-5">
              <nav className="flex flex-col gap-4 text-base font-medium text-slate-600">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className={cn(
                    "transition-colors hover:text-pink-500 py-1",
                    pathname === "/" ? "text-pink-600 font-semibold" : "text-slate-600"
                  )}
                >
                  Beranda
                </Link>
                <Link
                  href="/#about"
                  onClick={closeMenu}
                  className="hover:text-pink-500 transition-colors py-1 text-slate-600"
                >
                  Tentang Kami
                </Link>
                <Link
                  href="/#features"
                  onClick={closeMenu}
                  className="hover:text-pink-500 transition-colors py-1 text-slate-600"
                >
                  Layanan
                </Link>
                <Link
                  href="/artikel"
                  onClick={closeMenu}
                  className={cn(
                    "transition-colors hover:text-pink-500 py-1",
                    pathname.startsWith("/artikel") ? "text-pink-600 font-semibold" : "text-slate-600"
                  )}
                >
                  Artikel
                </Link>
                <Link
                  href="/kalkulator"
                  onClick={closeMenu}
                  className={cn(
                    "transition-colors hover:text-pink-500 py-1",
                    pathname.startsWith("/kalkulator") ? "text-pink-600 font-semibold" : "text-slate-600"
                  )}
                >
                  Kalkulator
                </Link>
                <Link
                  href="/game"
                  onClick={closeMenu}
                  className={cn(
                    "transition-colors hover:text-pink-500 py-1",
                    pathname.startsWith("/game") ? "text-pink-600 font-semibold" : "text-slate-600"
                  )}
                >
                  Mini Game
                </Link>
                <Link
                  href="/#contact"
                  onClick={closeMenu}
                  className="hover:text-pink-500 transition-colors py-1 text-slate-600"
                >
                  Kontak
                </Link>
              </nav>

              {!loading && !user && (
                <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-100">
                  <Link
                    href="/auth"
                    onClick={closeMenu}
                    className="flex items-center justify-center rounded-xl border border-pink-300 py-2.5 text-sm font-semibold text-pink-600 hover:bg-pink-50 transition-all"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/auth"
                    onClick={closeMenu}
                    className="flex items-center justify-center rounded-xl bg-pink-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 hover:shadow-md transition-all active:scale-95"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

