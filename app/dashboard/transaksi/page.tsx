"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Receipt, Wallet, TrendingUp, PiggyBank } from "lucide-react"
import { fetchTransactions, type Transaction } from "@/lib/dashboard-service"

export default function TransaksiPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filtered, setFiltered] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [catFilter, setCatFilter] = useState("all")

  useEffect(() => {
    fetchTransactions(119)
      .then(txs => {
        console.log("[Transaksi] fetched:", txs.length, "items")
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
    if (statusFilter !== "all") {
      const qStatus = statusFilter.toLowerCase()
      result = result.filter(t => (t.status || "").toLowerCase() === qStatus)
    }
    if (catFilter !== "all") {
      result = result.filter(t => (t.jenisLayanan || "").toLowerCase().includes(catFilter.toLowerCase()))
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
  }, [transactions, search, statusFilter, catFilter])

  const formatRp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

  const formatDate = (val: any): string => {
    if (!val) return "-"
    if (typeof val === "object" && "toDate" in val && typeof val.toDate === "function") {
      return val.toDate().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    }
    if (typeof val === "string") {
      const d = new Date(val)
      return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    }
    if (typeof val === "number") {
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

  // Calculate summary counts
  const totalNominal = filtered.reduce((acc, t) => acc + (t.nominal || 0), 0)
  const totalPlatformFee = filtered.reduce((acc, t) => acc + (t.platformFee || 0), 0)
  const totalAdminFee = filtered.reduce((acc, t) => acc + (t.adminFee || 2500), 0)

  return (
    <div className="space-y-4">
      {/* Summary Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-pink-50/50 border-pink-100">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Transaksi</p>
                <p className="text-2xl font-bold text-pink-600">{filtered.length} Transaksi</p>
              </div>
              <Receipt className="size-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Omset Gross</p>
                <p className="text-xl font-bold text-blue-600">{formatRp(totalNominal)}</p>
              </div>
              <TrendingUp className="size-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50/50 border-purple-100">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Komisi Platform</p>
                <p className="text-xl font-bold text-purple-600">{formatRp(totalPlatformFee)}</p>
              </div>
              <PiggyBank className="size-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Biaya Admin (Rp 2.500)</p>
                <p className="text-xl font-bold text-amber-600">{formatRp(totalAdminFee)}</p>
              </div>
              <Wallet className="size-8 text-amber-400" />
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
                placeholder="Cari ID, Nama Pengguna, Layanan..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm bg-white">
              <option value="all">Semua Status</option>
              <option value="completed">Completed (Selesai)</option>
              <option value="ongoing">Ongoing (Berjalan)</option>
              <option value="pending">Pending</option>
            </select>
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm bg-white font-medium">
              <option value="all">Semua Kategori ({transactions.length})</option>
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
          <CardTitle className="text-sm font-medium">Daftar Transaksi ({filtered.length})</CardTitle>
          <Badge variant="outline" className="text-xs bg-pink-50 text-pink-600 border-pink-200">Biaya Admin Rp 2.500 / Transaksi</Badge>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground bg-muted/30">
                  <th className="text-left py-3 px-2 font-medium">ID Transaksi</th>
                  <th className="text-left py-3 px-2 font-medium">Tanggal</th>
                  <th className="text-left py-3 px-2 font-medium">Pengguna</th>
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

                  return (
                    <tr key={tx.id} className="border-b last:border-0 hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-2 font-mono text-xs font-semibold text-gray-700">{tx.id}</td>
                      <td className="py-3 px-2 text-xs">{formatDate(tx.createdAt)}</td>
                      <td className="py-3 px-2 font-medium text-gray-900">{tx.namaUser}</td>
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
                  <tr><td colSpan={9} className="text-center py-12 text-muted-foreground">Tidak ada transaksi ditemukan</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
