"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { fetchWithdrawals, type Withdrawal } from "@/lib/dashboard-service"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function WithdrawalPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchWithdrawals()
      .then(w => {
        console.log("[Withdrawal] fetched:", w.length, "items")
        setWithdrawals(w)
        setLoading(false)
      })
      .catch(err => {
        console.error("[Withdrawal] fetch error:", err)
        setLoading(false)
      })
  }, [])

  const formatRp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

  const formatDate = (val: any): string => {
    if (!val) return "-"
    if (typeof val === "object" && "toDate" in val && typeof val.toDate === "function") {
      return val.toDate().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
    }
    if (typeof val === "string") {
      const d = new Date(val)
      return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
    }
    return "-"
  }

  const statusColor = (s: string) => {
    if (s === "done") return "bg-green-100 text-green-700"
    if (s === "pending") return "bg-amber-100 text-amber-700"
    return "bg-gray-100 text-gray-700"
  }

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "withdrawals", id), { status: "done" })
      setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: "done" } : w))
    } catch (e) {
      console.error("Failed to approve withdrawal:", e)
    }
  }

  const filtered = filter === "all" ? withdrawals : withdrawals.filter(w => w.status === filter)

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="size-8 animate-spin text-pink-500" />
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[["all", "Semua"], ["pending", "Pending"], ["done", "Selesai"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === val ? "bg-pink-500 text-white" : "bg-card border text-muted-foreground hover:bg-muted"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map(w => (
          <Card key={w.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={statusColor(w.status)}>{w.status.toUpperCase()}</Badge>
                    <span className="font-mono text-xs text-muted-foreground">{w.id}</span>
                  </div>
                  <p className="font-semibold">{w.doulaName}</p>
                  <p className="text-sm text-muted-foreground">{w.bank} • {w.atasNama}</p>
                  <p className="text-sm text-muted-foreground">{w.noRekening}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{formatRp(w.nominal)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(w.createdAt)}
                  </p>
                </div>
                {w.status === "pending" && (
                  <button onClick={() => handleApprove(w.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600">
                    <CheckCircle className="size-3" /> Approve
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Tidak ada data penarikan</div>
        )}
      </div>
    </div>
  )
}
