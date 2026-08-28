"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, TrendingUp, Wallet, PiggyBank, CreditCard, ChevronDown } from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
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

export default function DashboardPage() {
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
        console.error("[Dashboard] fetch error:", err)
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

  const k = data.kpis

  // Calculate filtered totals
  const currentTotalRevenue = filteredTxs.reduce((acc, t) => acc + (t.nominal || 0), 0)
  const currentPlatformFee = filteredTxs.reduce((acc, t) => acc + (t.platformFee || 0), 0)
  const currentDoulaEarnings = filteredTxs.reduce((acc, t) => acc + (t.doulaEarnings || 0), 0)

  const pieData = [
    { name: "Platform Fee", value: currentPlatformFee, color: "#ec4899" },
    { name: "Doula Earnings", value: currentDoulaEarnings, color: "#10b981" },
    { name: "Admin Fees", value: filteredTxs.length * 2500, color: "#6366f1" },
  ]

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
      {/* Header & Filter Controls (2 Separate Dropdowns: Month & Year) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Panel Admin Momsie</h1>
          <p className="text-sm text-muted-foreground">Ringkasan performa finansial, pengguna, dan transaksi aplikasi.</p>
        </div>

        {/* 2 Separate Dropdowns for Month and Year */}
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 rounded-lg border text-xs bg-pink-50 text-pink-900 font-semibold border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none"
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
            className="px-3 py-1.5 rounded-lg border text-xs bg-pink-50 text-pink-900 font-semibold border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none"
          >
            <option value="all">Semua Tahun</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2027">2027</option>
          </select>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Total Pendapatan" value={formatRp(currentTotalRevenue)} icon={TrendingUp} iconColor="text-pink-500" />
        <KpiCard title="Bulan Ini" value={formatRp(k.monthlyRevenue)} icon={Wallet} iconColor="text-blue-500" />
        <KpiCard title="Platform Fee" value={formatRp(currentPlatformFee)} icon={PiggyBank} iconColor="text-purple-500" />
        <KpiCard title="Dibayarkan ke Doula" value={formatRp(currentDoulaEarnings)} icon={CreditCard} iconColor="text-emerald-500" />
      </div>

      {/* Secondary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SecondaryCard label="User App" value="253" sub="Terdaftar di App" color="text-pink-600 font-extrabold" />
        <SecondaryCard label="Mitra Doula" value="54" sub="Aktif & On-going" color="text-blue-500 font-bold" />
        <SecondaryCard label="Transaksi Selesai" value={`${filteredTxs.length}`} sub="Verified Paid" color="text-emerald-600 font-bold" />
        <SecondaryCard label="Pending Transaksi" value="0" sub="Menunggu" color="text-amber-500 font-bold" />
      </div>

      {/* Synchronized Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Grafik Pendapatan Harian</CardTitle>
          </CardHeader>
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

        <Card>
          <CardHeader><CardTitle className="text-sm font-bold">Split Pendapatan</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatRp(v)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Category */}
      <Card>
        <CardHeader><CardTitle className="text-sm font-bold">Pendapatan per Kategori</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}rb`} />
              <Tooltip formatter={(v: number) => formatRp(v)} />
              <Bar dataKey="revenue" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

function KpiCard({ title, value, icon: Icon, iconColor }: { title: string; value: string; icon: any; iconColor: string }) {
  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{title}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-xl bg-pink-50 ${iconColor}`}>
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SecondaryCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardContent className="pt-5 pb-5">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </CardContent>
    </Card>
  )
}
