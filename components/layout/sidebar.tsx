"use client"

import { usePathname } from "next/navigation"
import { Home, Users, HeartHandshake, CircleDollarSign, Settings, Newspaper, Globe, ArrowUpRight, Wallet, ReceiptText, CalendarDays, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const navItems = [
  { title: "Beranda", icon: Home, href: "/dashboard" },
  { title: "Transaksi", icon: ReceiptText, href: "/dashboard/transaksi" },
  { title: "Booking", icon: CalendarDays, href: "/dashboard/booking" },
  { title: "Mitra", icon: Users, href: "/dashboard/mitra" },
  { title: "Mitra Doula", icon: HeartHandshake, href: "/dashboard/doula" },
  { title: "Keuangan", icon: TrendingUp, href: "/dashboard/keuangan" },
  { title: "Manajemen Berita", icon: Newspaper, href: "/dashboard/berita" },
]

// Menu yang belum ada halaman nyata
const COMING_SOON = ["/dashboard/pengaturan"]

export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <aside className={cn("flex flex-col border-r bg-card px-4 py-6", className)}>
      <Link href="/" className="mb-6 flex items-center gap-2 px-2 group cursor-pointer" title="Kembali ke Website Utama">
        <img
          src="/Logo Momsie.png"
          alt="Momsie Logo"
          className="h-9 w-9 object-contain group-hover:scale-105 transition-transform"
        />
        <span className="text-2xl font-bold tracking-tight text-primary">Momsie</span>
      </Link>

      {/* Button Kembali ke Website Utama */}
      <Link
        href="/"
        className="mb-6 flex items-center justify-between rounded-xl bg-pink-50 border border-pink-200 px-3 py-2.5 text-xs font-bold text-pink-600 hover:bg-pink-100 transition-colors shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Globe className="size-4 text-pink-600" />
          <span>Kembali ke Website</span>
        </div>
        <ArrowUpRight className="size-4" />
      </Link>

      <nav className="flex flex-col gap-1">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          const isComingSoon = COMING_SOON.includes(item.href)

          return (
            <div key={index} className="relative group">
              <Link
                href={isComingSoon ? "#" : item.href}
                onClick={isComingSoon ? (e) => e.preventDefault() : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isComingSoon
                    ? "text-muted-foreground/50 cursor-not-allowed"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="size-5 shrink-0" />
                <span className="flex-1">{item.title}</span>
                {isComingSoon && (
                  <span className="text-[9px] font-semibold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full shrink-0">
                    Soon
                  </span>
                )}
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Footer sidebar */}
      <div className="mt-auto pt-4 border-t border-border">
        <p className="text-[10px] text-muted-foreground/50 px-2">
          Momsie Admin v1.0
        </p>
      </div>
    </aside>
  )
}
