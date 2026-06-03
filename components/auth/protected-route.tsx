"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/auth?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [user, loading, router, pathname])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50/30">
        <div className="text-center animate-pulse">
          <Loader2 className="size-8 animate-spin text-pink-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Memuat halaman...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
