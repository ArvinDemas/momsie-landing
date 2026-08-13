"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { isAdmin } from "@/lib/admin-config"
import Sidebar from "@/components/layout/sidebar"
import DashboardHeader from "@/components/layout/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/auth")
      } else if (!isAdmin(user.email)) {
        router.replace("/")
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex w-full h-dvh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Memeriksa akses admin...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin(user.email)) {
    return null
  }

  return (
    <div className="flex w-full h-dvh overflow-hidden bg-background">
      <Sidebar className="w-64 flex-shrink-0" />
      <div className="flex flex-col flex-1 h-dvh overflow-hidden">
        <DashboardHeader className="h-16 flex-shrink-0" />
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-0">
          {children}
        </main>
      </div>
    </div>
  )
}
