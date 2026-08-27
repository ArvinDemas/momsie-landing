"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, TrendingUp, Wallet, PiggyBank, CreditCard, PlusCircle, Receipt } from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts"
import {
  fetchTransactions,
  fetchBookings,
  fetchDoulas,
  fetchWithdrawals,
  computeAnalytics,
} from "@/lib/dashboard-service"
import type { AnalyticsData } from "@/lib/dashboard-service"

export default function KeuanganPage() {
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchTransactions(500),
      fetchBookings(undefined, 500),
      fetchDoulas(),
      fetchWithdrawals(),
    ])
      .then(([txs, bookings, doulas, withdrawals]) => {
        console.log("[Keuangan] txs:", txs.length, "bookings:", bookings.length, "doulas:", doulas.length, "withdrawals:", withdrawals.length)
        setData(computeAnalytics(txs, bookings, doulas, withdrawals))
        setLoading(false)
      })
      .catch(err => {
        console.error("[Keuangan] fetch error:", err)
        setLoading(false)
      })
  }, [])

  const formatRp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="size-8 animate-spin text-pink-500" />
    </div>
  )
  if (!data) return null

  const k = data.kpis

  const barData = Object.entries(data.revenueByCategory).map(([cat, rev]) => ({
    name: cat,
    revenue: rev,
  }))

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Ringkasan Laporan Keuangan</h2>
          <p className="text-xs text-muted-foreground">Komisi Platform 20% + Biaya Admin Rp 2.500 per transaksi</p>
        </div>
        <button
          onClick={() => router.push("/checkout")}
          className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <PlusCircle className="size-4" />
          Buat Transaksi
        </button>
      </div>

      {/* KPI Grid 5 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPICard title="Total Pendapatan" value={formatRp(k.totalRevenue)} icon={TrendingUp} color="text-pink-500" />
        <KPICard title="Pendapatan Bulan Ini" value={formatRp(k.monthlyRevenue)} icon={Wallet} color="text-blue-500" />
        <KPICard title="Platform Fee (20%)" value={formatRp(k.totalPlatformFee)} icon={PiggyBank} color="text-purple-500" />
        <KPICard title="Biaya Admin (Rp 2.500)" value={formatRp(k.totalAdminFee)} icon={Receipt} color="text-amber-500" />
        <KPICard title="Hak Pendapatan Doula (80%)" value={formatRp(k.totalDoulaEarnings)} icon={CreditCard} color="text-emerald-500" />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Pendapatan Harian (7 Hari Terakhir)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}rb`} />
                <Tooltip formatter={(v: number) => formatRp(v)} />
                <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Pendapatan per Kategori Layanan</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}rb`} />
                <Tooltip formatter={(v: number) => formatRp(v)} />
                <Bar dataKey="revenue" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Transaksi Success" value={k.paidCount.toString()} sub="106 Transaksi" />
        <StatCard label="Total Biaya Admin E-Money" value={formatRp(k.totalAdminFee)} sub="106 x Rp 2.500" color="amber" />
        <StatCard label="Total Mitra Doula" value={k.totalDoulas.toString()} sub="Aktif" color="blue" />
        <StatCard label="Pending Withdraw" value={k.pendingWithdrawals.toString()} sub="Request" color="purple" />
      </div>
    </div>
  )
}

function KPICard({ title, value, icon: Icon, color }: { title: string; value: string; icon: any; color: string }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground mb-1 leading-tight">{title}</p>
            <p className="text-lg font-bold leading-tight">{value}</p>
          </div>
          <div className={`p-2.5 rounded-xl bg-pink-50 ${color}`}>
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCard({ label, value, sub, color = "pink" }: { label: string; value: string; sub: string; color?: string }) {
  const bgMap: Record<string, string> = {
    amber: "bg-amber-50",
    blue: "bg-blue-50",
    purple: "bg-purple-50",
    pink: "bg-pink-50",
  }
  return (
    <Card className={bgMap[color] || "bg-pink-50"}>
      <CardContent className="pt-4 pb-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
      </CardContent>
    </Card>
  )
}
