"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

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
          <Link href="#" className="text-pink-600 font-semibold">Beranda</Link>
          <Link href="#about" className="hover:text-pink-500 transition-colors">Tentang Kami</Link>
          <Link href="#features" className="hover:text-pink-500 transition-colors">Layanan</Link>
          <Link href="#partnership" className="hover:text-pink-500 transition-colors">Kemitraan</Link>
          <Link href="#contact" className="hover:text-pink-500 transition-colors">Kontak</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            href="#download" 
            className="hidden sm:inline-flex items-center justify-center rounded-xl bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 hover:shadow-md transition-all active:scale-95"
          >
            Unduh Aplikasi
          </Link>
        </div>
      </div>
    </header>
  )
}
