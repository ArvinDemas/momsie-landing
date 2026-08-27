"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, Clock } from "lucide-react"
import { db } from "@/lib/firebase"
import { fetchBookings, type Booking } from "@/lib/dashboard-service"
import { doc, updateDoc } from "firebase/firestore"

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const statusParam = filter === "all" ? undefined : filter
    fetchBookings(statusParam, 500)
      .then(b => { setBookings(b); setLoading(false) })
      .catch(() => setLoading(false))
  }, [filter])

  const formatRp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "bg-amber-100 text-amber-700" },
    paid: { label: "Paid", color: "bg-blue-100 text-blue-700" },
    confirmed: { label: "Confirmed", color: "bg-green-100 text-green-700" },
    ongoing: { label: "Ongoing", color: "bg-purple-100 text-purple-700" },
    completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status: newStatus })
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
    } catch (e) { console.error(e) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="size-8 animate-spin text-pink-500" />
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[["all", "Semua"], ["pending", "Pending"], ["paid", "Paid"], ["confirmed", "Confirmed"], ["ongoing", "Ongoing"], ["completed", "Selesai"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === val ? "bg-pink-500 text-white" : "bg-card border text-muted-foreground hover:bg-muted"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Booking Cards */}
      <div className="grid gap-3">
        {bookings.map(b => {
          const cfg = statusConfig[b.status] || { label: b.status, color: "bg-gray-100 text-gray-700" }
          return (
            <Card key={b.id}>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={cfg.color}>{cfg.label}</Badge>
                      <span className="font-mono text-xs text-muted-foreground">{b.id}</span>
                    </div>
                    <p className="font-semibold">{b.namaUser}</p>
                    <p className="text-sm text-muted-foreground">{b.doulaName} • {b.layanan}</p>
                    <p className="text-sm text-muted-foreground">{b.tanggal} • {b.day} • {b.jam}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{formatRp(b.hargaLayanan)}</p>
                    <p className="text-xs text-muted-foreground">Platform Fee: {formatRp(b.platformFee || 0)}</p>
                    <p className="text-xs text-emerald-600">Doula Earn: {formatRp(b.doulaEarnings || 0)}</p>
                  </div>
                  <div className="flex gap-2">
                    {b.status === "paid" && (
                      <button onClick={() => updateStatus(b.id, "confirmed")}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600">
                        <CheckCircle className="size-3" /> Konfirmasi
                      </button>
                    )}
                    {(b.status === "paid" || b.status === "confirmed") && (
                      <button onClick={() => updateStatus(b.id, "ongoing")}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 text-white rounded-lg text-xs font-medium hover:bg-purple-600">
                        <Clock className="size-3" /> Mulai
                      </button>
                    )}
                    {b.status === "ongoing" && (
                      <button onClick={() => updateStatus(b.id, "completed")}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600">
                        <CheckCircle className="size-3" /> Selesai
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {bookings.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Tidak ada booking</div>
        )}
      </div>
    </div>
  )
}
