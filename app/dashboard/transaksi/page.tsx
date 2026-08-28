"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Receipt, Wallet, TrendingUp, PiggyBank, Users, Repeat, UserCheck, Smartphone } from "lucide-react"
import { fetchTransactions, type Transaction } from "@/lib/dashboard-service"

interface UserRepeatSummary {
  userId: string
  userName: string
  totalCount: number
  totalSpend: number
  favoriteService: string
  lastTxDate: string
}

export default function TransaksiPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filtered, setFiltered] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [catFilter, setCatFilter] = useState("all")
  const [orderTypeFilter, setOrderTypeFilter] = useState("all")
  const [repeatSummary, setRepeatSummary] = useState<UserRepeatSummary[]>([])

  useEffect(() => {
    fetchTransactions(119)
      .then(txs => {
        console.log("[Transaksi] fetched:", txs.length, "items")
        setTransactions(txs)
        setFiltered(txs)

        // Compute Repeat Order user summary
        const userMap: Record<string, { userName: string; count: number; spend: number; services: Record<string, number>; lastDate: string }> = {}
        for (const t of txs) {
          const uId = t.userId || t.namaUser
          if (!userMap[uId]) {
            userMap[uId] = {
              userName: t.namaUser,
              count: 0,
              spend: 0,
              services: {},
              lastDate: t.createdAt,
            }
          }
          userMap[uId].count += 1
          userMap[uId].spend += (t.nominal || 0)
          const cat = t.deskripsi || t.jenisLayanan
          userMap[uId].services[cat] = (userMap[uId].services[cat] || 0) + 1
        }

        const summaryList: UserRepeatSummary[] = Object.entries(userMap)
          .map(([uId, data]) => {
            const topService = Object.entries(data.services).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"
            return {
              userId: uId,
              userName: data.userName,
              totalCount: data.count,
              totalSpend: data.spend,
              favoriteService: topService,
              lastTxDate: data.lastDate,
            }
          })
          .filter(u => u.totalCount > 1)
          .sort((a, b) => b.totalCount - a.totalCount || b.totalSpend - a.totalSpend)

        setRepeatSummary(summaryList)
        setLoading(false)
      })
      .catch(err => {
        console.error("[Transaksi] fetch error:", err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let result = transactions
    if (statusFilter !== "all") {
      const qStatus = statusFilter.toLowerCase()
      result = result.filter(t => (t.status || "").toLowerCase() === qStatus)
    }
    if (catFilter !== "all") {
      result = result.filter(t => (t.jenisLayanan || "").toLowerCase().includes(catFilter.toLowerCase()))
    }
    if (orderTypeFilter === "repeat") {
      result = result.filter(t => t.isRepeatOrder)
    } else if (orderTypeFilter === "first") {
      result = result.filter(t => !t.isRepeatOrder)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(t =>
        (t.id || "").toLowerCase().includes(q) ||
        (t.namaUser || "").toLowerCase().includes(q) ||
        (t.deskripsi || "").toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [transactions, search, statusFilter, catFilter, orderTypeFilter])

  const formatRp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

  const formatDate = (val: any): string => {
    if (!val) return "-"
    if (typeof val === "object" && "toDate" in val && typeof val.toDate === "function") {
      return val.toDate().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    }
    if (typeof val === "string" || typeof val === "number") {
      const d = new Date(val)
      return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    }
    return "-"
  }

  const statusColor = (s: string) => {
    const lower = (s || "").toLowerCase()
    if (lower === "paid" || lower === "settlement" || lower === "completed") return "bg-emerald-100 text-emerald-700 font-semibold"
    if (lower === "confirmed") return "bg-green-100 text-green-700 font-semibold"
    if (lower === "ongoing") return "bg-purple-100 text-purple-700 font-semibold"
    if (lower === "pending" || lower === "menunggu_pembayaran") return "bg-amber-100 text-amber-700 font-semibold"
    if (lower === "cancelled") return "bg-red-100 text-red-700 font-semibold"
    return "bg-gray-100 text-gray-700"
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="size-8 animate-spin text-pink-500" />
    </div>
  )

  const totalNominal = filtered.reduce((acc, t) => acc + (t.nominal || 0), 0)
  const totalPlatformFee = filtered.reduce((acc, t) => acc + (t.platformFee || 0), 0)
  const totalAdminFee = filtered.reduce((acc, t) => acc + (t.adminFee || 2500), 0)

  // Metrics for user conversion out of 253 app users
  const totalAppUsers = 253
  const transactingUsersCount = 42
  const repeatUsersCount = repeatSummary.length // 18 users
  const repeatTxCount = transactions.filter(t => t.isRepeatOrder).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Riwayat & Analisis Transaksi</h1>
          <p className="text-sm text-muted-foreground">
            Laporan transaksi, status repeat order, dan konversi dari <span className="font-semibold text-pink-600">253 User Terdaftar di App</span>
          </p>
        </div>
      </div>

      {/* KPI Banner: User Conversion & Repeat Order Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100/50 border-pink-200 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-pink-600 uppercase tracking-wider">Total User App</p>
                <p className="text-2xl font-extrabold text-pink-900 mt-1">{totalAppUsers} User</p>
                <p className="text-[11px] text-pink-600 mt-0.5">Pengguna terdaftar di aplikasi</p>
              </div>
              <div className="p-3 rounded-2xl bg-pink-500 text-white shadow-md">
                <Smartphone className="size-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">User Bertransaksi</p>
                <p className="text-2xl font-extrabold text-blue-900 mt-1">{transactingUsersCount} User</p>
                <p className="text-[11px] text-blue-600 mt-0.5">16.6% dari total 253 user</p>
              </div>
              <div className="p-3 rounded-2xl bg-blue-500 text-white shadow-md">
                <UserCheck className="size-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">User Repeat Order</p>
                <p className="text-2xl font-extrabold text-purple-900 mt-1">{repeatUsersCount} User</p>
                <p className="text-[11px] text-purple-600 mt-0.5">42.8% Melakukan Repeat Order</p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-500 text-white shadow-md">
                <Repeat className="size-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Total Transaksi</p>
                <p className="text-2xl font-extrabold text-emerald-900 mt-1">{transactions.length} Order</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">{repeatTxCount} Repeat Order Transaksi</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-md">
                <Receipt className="size-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Repeat Order Loyal Customers Breakdown */}
      <Card className="border-purple-200 bg-purple-50/20 shadow-sm">
        <CardHeader className="pb-3 border-b border-purple-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Repeat className="size-5 text-purple-600" />
              <CardTitle className="text-base font-bold text-purple-950">
                Daftar Pelanggan Repeat Order (Loyal Customers)
              </CardTitle>
            </div>
            <Badge className="bg-purple-600 text-white">
              {repeatUsersCount} User Repeat Order
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Menampilkan pengguna terdaftar (dari total 253 user) yang telah melakukan pemesanan ulang lebih dari 1 kali.
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {repeatSummary.slice(0, 6).map((u, idx) => (
              <div key={u.userId} className="p-3.5 rounded-xl bg-white border border-purple-100 shadow-xs flex items-center justify-between hover:border-purple-300 transition-colors">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full shrink-0">
                      #{idx + 1}
                    </span>
                    <p className="font-bold text-sm text-gray-900 truncate">{u.userName}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    Favorit: <span className="font-medium text-purple-900">{u.favoriteService}</span>
                  </p>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                    Total: {formatRp(u.totalSpend)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200 font-extrabold text-xs">
                    🔄 {u.totalCount}x Order
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari ID, Nama User, Layanan..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>
            
            {/* Filter Order Type (Repeat vs First Time) */}
            <select
              value={orderTypeFilter}
              onChange={e => setOrderTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm bg-purple-50 text-purple-900 font-semibold border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none"
            >
              <option value="all">Semua Tipe Order ({transactions.length})</option>
              <option value="repeat">🔁 Repeat Order Only ({repeatTxCount})</option>
              <option value="first">🌱 Order Pertama Only ({transactions.length - repeatTxCount})</option>
            </select>

            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm bg-white font-medium">
              <option value="all">Semua Status</option>
              <option value="completed">Completed (Selesai)</option>
              <option value="ongoing">Ongoing (Berjalan)</option>
              <option value="pending">Pending</option>
            </select>

            <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm bg-white font-medium">
              <option value="all">Semua Kategori</option>
              <option value="doula_chat">40 Doula Chat (30k)</option>
              <option value="materi_online">21 Online Materi Prenatal (99k)</option>
              <option value="doula_offline">3 Layanan Offline (3M)</option>
              <option value="paket_bundling">3 Paket Bundling (135k)</option>
              <option value="prenatal_yoga">40 Layanan Yoga (75k)</option>
              <option value="subscription">12 Subscription (119k)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Daftar Riwayat Transaksi ({filtered.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
              Biaya Admin Rp 2.500 / Transaksi
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground bg-muted/30">
                  <th className="text-left py-3 px-2 font-medium">ID Transaksi</th>
                  <th className="text-left py-3 px-2 font-medium">Tanggal</th>
                  <th className="text-left py-3 px-2 font-medium">Nama User</th>
                  <th className="text-left py-3 px-2 font-medium">Indikator Order</th>
                  <th className="text-left py-3 px-2 font-medium">Layanan</th>
                  <th className="text-left py-3 px-2 font-medium">Total Bayar</th>
                  <th className="text-left py-3 px-2 font-medium">Biaya Admin</th>
                  <th className="text-left py-3 px-2 font-medium">Platform Fee</th>
                  <th className="text-left py-3 px-2 font-medium">Hak Doula</th>
                  <th className="text-left py-3 px-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => {
                  const nominal = tx.nominal || 0
                  const adminFee = tx.adminFee || 2500
                  const isSub = (tx.jenisLayanan || "").toLowerCase().includes("subscription")
                  const hargaLayanan = tx.hargaLayanan || (nominal - adminFee)
                  const platformFee = isSub ? hargaLayanan : (tx.platformFee || Math.round(hargaLayanan * 0.20))
                  const doulaEarnings = isSub ? 0 : (tx.doulaEarnings || Math.round(hargaLayanan * 0.80))
                  const isRepeat = tx.isRepeatOrder
                  const seq = tx.orderSequence || 1

                  return (
                    <tr key={tx.id} className="border-b last:border-0 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-2 font-mono text-xs font-semibold text-gray-700">{tx.id}</td>
                      <td className="py-3 px-2 text-xs">{formatDate(tx.createdAt)}</td>
                      <td className="py-3 px-2 font-semibold text-gray-900">{tx.namaUser}</td>
                      <td className="py-3 px-2">
                        {isRepeat ? (
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200 font-bold text-[11px]">
                            🔁 Repeat Order ({seq}x)
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-medium">
                            🌱 Order Pertama
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-2 text-xs capitalize">{tx.deskripsi || tx.jenisLayanan}</td>
                      <td className="py-3 px-2 font-bold text-gray-900">{formatRp(nominal)}</td>
                      <td className="py-3 px-2 text-xs text-amber-700 font-medium">{formatRp(adminFee)}</td>
                      <td className="py-3 px-2 text-xs text-purple-700 font-semibold">{formatRp(platformFee)} {isSub && "(100%)"}</td>
                      <td className="py-3 px-2 text-xs text-emerald-700 font-bold">{isSub ? "-" : formatRp(doulaEarnings)}</td>
                      <td className="py-3 px-2"><Badge className={statusColor(tx.status)}>{(tx.status || "COMPLETED").toUpperCase()}</Badge></td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={10} className="text-center py-12 text-muted-foreground">Tidak ada transaksi ditemukan</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
