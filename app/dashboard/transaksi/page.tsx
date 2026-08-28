"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Receipt, Wallet, TrendingUp, PiggyBank, Calendar } from "lucide-react"
import { fetchTransactions, type Transaction } from "@/lib/dashboard-service"

export default function TransaksiPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filtered, setFiltered] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [catFilter, setCatFilter] = useState("all")
  const [monthFilter, setMonthFilter] = useState("all")

  useEffect(() => {
    fetchTransactions(1000)
      .then(txs => {
        setTransactions(txs)
        setFiltered(txs)
        setLoading(false)
      })
      .catch(err => {
        console.error("[Transaksi] fetch error:", err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let result = transactions

    // Filter Month
    if (monthFilter === "juni") {
      result = result.filter(t => {
        const d = new Date(t.createdAt)
        return d.getMonth() === 5 && d.getFullYear() === 2026
      })
    } else if (monthFilter === "juli") {
      result = result.filter(t => {
        const d = new Date(t.createdAt)
        return d.getMonth() === 6 && d.getFullYear() === 2026
      })
    } else if (monthFilter === "agustus") {
      result = result.filter(t => {
        const d = new Date(t.createdAt)
        return d.getMonth() === 7 && d.getFullYear() === 2026
      })
    }

    // Filter Status
    if (statusFilter !== "all") {
      const qStatus = statusFilter.toLowerCase()
      result = result.filter(t => (t.status || "").toLowerCase() === qStatus)
    }

    // Filter Category
    if (catFilter !== "all") {
      result = result.filter(t => (t.jenisLayanan || "").toLowerCase().includes(catFilter.toLowerCase()))
    }

    // Filter Search
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(t =>
        (t.id || "").toLowerCase().includes(q) ||
        (t.namaUser || "").toLowerCase().includes(q) ||
        (t.deskripsi || "").toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [transactions, search, statusFilter, catFilter, monthFilter])

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
    if (lower === "paid" || lower === "settlement" || lower === "completed") return "bg-emerald-100 text-emerald-800 font-semibold border-emerald-200"
    if (lower === "confirmed") return "bg-green-100 text-green-800 font-semibold border-green-200"
    if (lower === "ongoing") return "bg-purple-100 text-purple-800 font-semibold border-purple-200"
    if (lower === "pending" || lower === "menunggu_pembayaran") return "bg-amber-100 text-amber-800 font-semibold border-amber-200"
    if (lower === "cancelled") return "bg-red-100 text-red-800 font-semibold border-red-200"
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

  // Monthly counts for tab selector labels
  const juniCount = transactions.filter(t => { const d = new Date(t.createdAt); return d.getMonth() === 5 && d.getFullYear() === 2026 }).length
  const juliCount = transactions.filter(t => { const d = new Date(t.createdAt); return d.getMonth() === 6 && d.getFullYear() === 2026 }).length
  const agustusCount = transactions.filter(t => { const d = new Date(t.createdAt); return d.getMonth() === 7 && d.getFullYear() === 2026 }).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan Transaksi</h1>
          <p className="text-sm text-muted-foreground">
            Riwayat transaksi pembayaran masuk, rincian biaya admin, komisi platform, dan hak pendapatan doula.
          </p>
        </div>
      </div>

      {/* Financial KPI Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Transaksi</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">{filtered.length} Order</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Pesanan Berhasil</p>
              </div>
              <div className="p-3 rounded-xl bg-pink-100 text-pink-700">
                <Receipt className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Omset Gross</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">{formatRp(totalNominal)}</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">Penjualan Kotor</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
                <TrendingUp className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Komisi Platform</p>
                <p className="text-2xl font-extrabold text-purple-900 mt-1">{formatRp(totalPlatformFee)}</p>
                <p className="text-[11px] text-purple-600 mt-0.5">Nett Margin Momsie</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-100 text-purple-700">
                <PiggyBank className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Biaya Admin App</p>
                <p className="text-2xl font-extrabold text-amber-900 mt-1">{formatRp(totalAdminFee)}</p>
                <p className="text-[11px] text-amber-600 mt-0.5">@ Rp 2.500 / Transaksi</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
                <Wallet className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari ID Transaksi, Nama Pelanggan, Layanan..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>

            {/* Filter Period / Month */}
            <select
              value={monthFilter}
              onChange={e => setMonthFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm bg-pink-50 text-pink-900 font-semibold border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none"
            >
              <option value="all">Semua Periode ({transactions.length} Transaksi)</option>
              <option value="juni">Juni 2026 ({juniCount} Transaksi)</option>
              <option value="juli">Juli 2026 ({juliCount} Transaksi)</option>
              <option value="agustus">Agustus 2026 ({agustusCount} Transaksi)</option>
            </select>

            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm bg-white font-medium">
              <option value="all">Semua Status</option>
              <option value="completed">Completed (Selesai)</option>
              <option value="ongoing">Ongoing (Berjalan)</option>
              <option value="pending">Pending</option>
            </select>

            <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm bg-white font-medium">
              <option value="all">Semua Kategori</option>
              <option value="doula_chat">Doula Chat (30k)</option>
              <option value="materi_online">Online Materi Prenatal (99k)</option>
              <option value="doula_offline">Layanan Offline (3M)</option>
              <option value="paket_bundling">Paket Bundling (135k)</option>
              <option value="prenatal_yoga">Layanan Yoga (75k)</option>
              <option value="subscription">Subscription Aplikasi (119k)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Clean Financial Data Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Daftar Transaksi Pembayaran ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground bg-muted/30">
                  <th className="text-left py-3 px-2 font-medium">ID Transaksi</th>
                  <th className="text-left py-3 px-2 font-medium">Waktu Transaksi</th>
                  <th className="text-left py-3 px-2 font-medium">Pelanggan</th>
                  <th className="text-left py-3 px-2 font-medium">Deskripsi Layanan</th>
                  <th className="text-left py-3 px-2 font-medium">Nominal Gross</th>
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

                  return (
                    <tr key={tx.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 font-mono text-xs font-semibold text-gray-700">{tx.id}</td>
                      <td className="py-3 px-2 text-xs text-gray-600">{formatDate(tx.createdAt)}</td>
                      <td className="py-3 px-2 font-semibold text-gray-900">{tx.namaUser}</td>
                      <td className="py-3 px-2 text-xs text-gray-800">{tx.deskripsi || tx.jenisLayanan}</td>
                      <td className="py-3 px-2 font-bold text-gray-900">{formatRp(nominal)}</td>
                      <td className="py-3 px-2 text-xs text-amber-700 font-medium">{formatRp(adminFee)}</td>
                      <td className="py-3 px-2 text-xs text-purple-700 font-semibold">{formatRp(platformFee)}</td>
                      <td className="py-3 px-2 text-xs text-emerald-700 font-bold">{isSub ? "-" : formatRp(doulaEarnings)}</td>
                      <td className="py-3 px-2">
                        <Badge className={statusColor(tx.status)}>{(tx.status || "COMPLETED").toUpperCase()}</Badge>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-muted-foreground">
                      Tidak ada transaksi ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
