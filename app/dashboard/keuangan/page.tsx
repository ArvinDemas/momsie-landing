"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, TrendingUp, Wallet, PiggyBank, CreditCard, Receipt } from "lucide-react"
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
  type Transaction,
} from "@/lib/dashboard-service"
import type { AnalyticsData } from "@/lib/dashboard-service"

export default function KeuanganPage() {
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [rawTxs, setRawTxs] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // 2 Separate Dropdowns: Month & Year
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")

  useEffect(() => {
    Promise.all([
      fetchTransactions(1000),
      fetchBookings(undefined, 1000),
      fetchDoulas(),
      fetchWithdrawals(),
    ])
      .then(([txs, bookings, doulas, withdrawals]) => {
        setRawTxs(txs)
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

  // Filter raw transactions dynamically based on selectedMonth & selectedYear
  let filteredTxs = rawTxs
  if (selectedMonth !== "all") {
    const m = parseInt(selectedMonth) - 1
    filteredTxs = filteredTxs.filter(t => new Date(t.createdAt).getMonth() === m)
  }
  if (selectedYear !== "all") {
    const y = parseInt(selectedYear)
    filteredTxs = filteredTxs.filter(t => new Date(t.createdAt).getFullYear() === y)
  }

  // Compute daily revenue curve for selected timeframe
  const dailyRevMap: Record<string, number> = {}
  for (const t of filteredTxs) {
    const d = new Date(t.createdAt).toISOString().split("T")[0]
    dailyRevMap[d] = (dailyRevMap[d] || 0) + (t.nominal || 0)
  }
  const filteredDailyRevenue = Object.keys(dailyRevMap).sort().map(date => ({
    date,
    revenue: dailyRevMap[date],
  }))

  // Calculate filtered financial KPIs
  const currentTotalRevenue = filteredTxs.reduce((acc, t) => acc + (t.nominal || 0), 0)
  const currentPlatformFee = filteredTxs.reduce((acc, t) => acc + (t.platformFee || 0), 0)
  const currentDoulaEarnings = filteredTxs.reduce((acc, t) => acc + (t.doulaEarnings || 0), 0)
  const currentAdminFee = filteredTxs.length * 2500

  const k = data.kpis

  const barData = [
    { name: "Doula Chat", revenue: filteredTxs.filter(t => t.jenisLayanan === "doula_chat").reduce((a, b) => a + (b.nominal || 0), 0) },
    { name: "Prenatal Yoga", revenue: filteredTxs.filter(t => t.jenisLayanan === "prenatal_yoga").reduce((a, b) => a + (b.nominal || 0), 0) },
    { name: "Materi Prenatal", revenue: filteredTxs.filter(t => t.jenisLayanan === "materi_online").reduce((a, b) => a + (b.nominal || 0), 0) },
    { name: "Full Journey", revenue: filteredTxs.filter(t => t.jenisLayanan === "doula_offline").reduce((a, b) => a + (b.nominal || 0), 0) },
    { name: "Bundling", revenue: filteredTxs.filter(t => t.jenisLayanan === "paket_bundling").reduce((a, b) => a + (b.nominal || 0), 0) },
    { name: "Subscription", revenue: filteredTxs.filter(t => t.jenisLayanan === "subscription").reduce((a, b) => a + (b.nominal || 0), 0) },
  ]

  return (
    <div className="space-y-4">
      {/* Action Bar & 2 Separate Filter Dropdowns */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Ringkasan Laporan Keuangan</h2>
          <p className="text-xs text-muted-foreground">Komisi Platform 20% + Biaya Admin Rp 2.500 per transaksi</p>
        </div>

        {/* 2 Separate Dropdowns: Month & Year */}
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="px-3.5 py-2 rounded-lg border text-sm bg-pink-50 text-pink-900 font-semibold border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none"
          >
            <option value="all">Semua Bulan</option>
            <option value="1">Januari</option>
            <option value="2">Februari</option>
            <option value="3">Maret</option>
            <option value="4">April</option>
            <option value="5">Mei</option>
            <option value="6">Juni</option>
            <option value="7">Juli</option>
            <option value="8">Agustus</option>
            <option value="9">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>

          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="px-3.5 py-2 rounded-lg border text-sm bg-pink-50 text-pink-900 font-semibold border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none"
          >
            <option value="all">Semua Tahun</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2027">2027</option>
          </select>
        </div>
      </div>

      {/* KPI Grid 5 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KPICard title="Total Pendapatan" value={formatRp(currentTotalRevenue)} icon={TrendingUp} color="text-pink-500" />
        <KPICard title="Pendapatan Bulan Ini" value={formatRp(k.monthlyRevenue)} icon={Wallet} color="text-blue-500" />
        <KPICard title="Platform Fee (20%)" value={formatRp(currentPlatformFee)} icon={PiggyBank} color="text-purple-500" />
        <KPICard title="Biaya Admin (Rp 2.500)" value={formatRp(currentAdminFee)} icon={Receipt} color="text-amber-500" />
        <KPICard title="Hak Pendapatan Doula (80%)" value={formatRp(currentDoulaEarnings)} icon={CreditCard} color="text-emerald-500" />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-white border-gray-200">
          <CardHeader><CardTitle className="text-sm font-bold">Grafik Pendapatan Harian</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={filteredDailyRevenue.length > 0 ? filteredDailyRevenue : data.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}rb`} />
                <Tooltip formatter={(v: number) => formatRp(v)} />
                <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader><CardTitle className="text-sm font-bold">Pendapatan per Kategori Layanan</CardTitle></CardHeader>
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
        <StatCard label="Total Transaksi Success" value={`${filteredTxs.length}`} sub={`${filteredTxs.length} Transaksi Verified`} />
        <StatCard label="Total Biaya Admin E-Money" value={formatRp(currentAdminFee)} sub={`${filteredTxs.length} x Rp 2.500`} color="amber" />
        <StatCard label="Total Mitra Doula" value="54" sub="Aktif & On-going" color="blue" />
        <StatCard label="Pending Withdraw" value={`${k.pendingWithdrawals}`} sub="Request Withdraw" color="purple" />
      </div>
    </div>
  )
}

function KPICard({ title, value, icon: Icon, color }: { title: string; value: string; icon: any; color: string }) {
  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground mb-1 leading-tight">{title}</p>
            <p className="text-lg font-bold leading-tight text-gray-900">{value}</p>
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
    amber: "bg-amber-50 border-amber-200",
    blue: "bg-blue-50 border-blue-200",
    purple: "bg-purple-50 border-purple-200",
    pink: "bg-pink-50 border-pink-200",
  }
  return (
    <Card className={`${bgMap[color] || "bg-pink-50 border-pink-200"} border shadow-sm`}>
      <CardContent className="pt-4 pb-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
      </CardContent>
    </Card>
  )
}
