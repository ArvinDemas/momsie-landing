import { Home, Users, HeartHandshake, CircleDollarSign, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const navItems = [
  { title: "Beranda", icon: Home, href: "/", active: true },
  { title: "Data Pengguna", icon: Users, href: "#" },
  { title: "Mitra Doula", icon: HeartHandshake, href: "#" },
  { title: "Keuangan/Monetisasi", icon: CircleDollarSign, href: "#" },
  { title: "Pengaturan", icon: Settings, href: "#" },
]

export default function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={cn("flex flex-col border-r bg-card px-4 py-6", className)}>
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">M</div>
        <span className="text-2xl font-bold tracking-tight text-primary">Momsie</span>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item, index) => {
          const Icon = item.icon
          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                item.active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="size-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
