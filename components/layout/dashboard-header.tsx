"use client"

import { Bell, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function DashboardHeader({ className }: { className?: string }) {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const name = user?.displayName || user?.email?.split("@")[0] || "Admin"
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleSignOut = async () => {
    await signOut()
    router.replace("/auth")
  }

  return (
    <header className={cn("flex items-center justify-between border-b bg-card px-6", className)}>
      <div className="flex items-center text-muted-foreground">
        <span className="text-sm font-medium">Panel Admin Momsie</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="size-5" />
          <span className="absolute -top-1 -right-1 size-2 rounded-full bg-primary" />
        </button>
        <div className="flex items-center gap-3 border-l pl-4">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={name}
              className="size-9 rounded-full object-cover border-2 border-primary/20"
            />
          ) : (
            <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border-2 border-primary/20">
              {initials}
            </div>
          )}
          <div className="flex flex-col text-sm leading-none">
            <span className="font-semibold">{name}</span>
            <span className="text-[11px] text-muted-foreground mt-0.5">{user?.email}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="ml-2 p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Keluar"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
