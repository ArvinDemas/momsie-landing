"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { fetchDoulas, type Mitra } from "@/lib/dashboard-service"

export default function DoulaPage() {
  const [doulas, setDoulas] = useState<Mitra[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDoulas()
      .then(d => {
        console.log("[Doula] fetched:", d.length, "items")
        setDoulas(d)
        setLoading(false)
      })
      .catch(err => {
        console.error("[Doula] fetch error:", err)
        setLoading(false)
      })
  }, [])

  const formatRp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="size-8 animate-spin text-pink-500" />
    </div>
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Daftar Mitra Doula ({doulas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {doulas.map(m => (
              <div key={m.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card">
                <div className="size-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-lg">
                  {m.name?.[0]?.toUpperCase() || "D"}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-muted-foreground">{m.pekerjaan}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Aktif
                  </span>
                </div>
              </div>
            ))}
            {doulas.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">Belum ada mitra terdaftar</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
