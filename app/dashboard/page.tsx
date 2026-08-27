"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, TrendingUp, Wallet, PiggyBank, CreditCard } from "lucide-react"
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
} from "@/lib/dashboard-service"
import type { AnalyticsData } from "@/lib/dashboard-service"

export default function DashboardPage() {
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
        console.log("[Dashboard] txs:", txs.length, "bookings:", bookings.length, "doulas:", doulas.length, "withdrawals:", withdrawals.length)
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

  const k = data.kpis
  const barData = Object.entries(data.revenueByCategory).map(([cat, rev]) => ({
    name: cat.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()),
    revenue: rev,
  }))

  const pieData = [
    { name: "Platform Fee", value: k.totalPlatformFee, color: "#ec4899" },
    { name: "Doula Earnings", value: k.totalDoulaEarnings, color: "#10b981" },
    { name: "Admin Fees", value: k.paidCount * 2000, color: "#6366f1" },
  ]

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Total Pendapatan" value={formatRp(k.totalRevenue)} icon={TrendingUp} iconColor="text-pink-500" />
        <KpiCard title="Bulan Ini" value={formatRp(k.monthlyRevenue)} icon={Wallet} iconColor="text-blue-500" />
        <KpiCard title="Platform Fee" value={formatRp(k.totalPlatformFee)} icon={PiggyBank} iconColor="text-purple-500" />
        <KpiCard title="Dibayarkan ke Doula" value={formatRp(k.totalPaidOutToDoulas)} icon={CreditCard} iconColor="text-emerald-500" />
      </div>

      {/* Secondary KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SecondaryCard label="Transaksi Paid" value={k.paidCount.toString()} sub="Selesai" color="text-emerald-500" />
        <SecondaryCard label="Pending Verifikasi" value={k.pendingCount.toString()} sub="Menunggu" color="text-amber-500" />
        <SecondaryCard label="Mitra Doula" value={k.totalDoulas.toString()} sub="Aktif" color="text-blue-500" />
        <SecondaryCard label="Pending Withdraw" value={k.pendingWithdrawals.toString()} sub="Request" color="text-purple-500" />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Pendapatan Harian (7 Hari)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
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
          <CardHeader><CardTitle className="text-sm">Split Pendapatan</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
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
        <CardHeader><CardTitle className="text-sm">Pendapatan per Kategori</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
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
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{title}</p>
            <p className="text-xl font-bold">{value}</p>
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
    <Card>
      <CardContent className="pt-6">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  )
}
