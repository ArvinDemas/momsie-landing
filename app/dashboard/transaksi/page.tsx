"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Receipt, Wallet, TrendingUp, PiggyBank, RefreshCw, Eye, EyeOff } from "lucide-react"
import { fetchTransactions, type Transaction, maskInitialsName } from "@/lib/dashboard-service"

export default function TransaksiPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filtered, setFiltered] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [catFilter, setCatFilter] = useState("all")
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [rangeFilter, setRangeFilter] = useState("all")

  // Independent Unsensor Map for Customer Names (Keyed by tx.id)
  const [unmaskedMap, setUnmaskedMap] = useState<Record<string, boolean>>({})

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

    // Filter Bulan
    if (selectedMonth !== "all") {
      const m = parseInt(selectedMonth) - 1
      result = result.filter(t => new Date(t.createdAt).getMonth() === m)
    }

    // Filter Tahun
    if (selectedYear !== "all") {
      const y = parseInt(selectedYear)
      result = result.filter(t => new Date(t.createdAt).getFullYear() === y)
    }

    // Filter Time Range (Hari Ini, 7 Hari Terakhir, 30 Hari Terakhir)
    const now = new Date(2026, 7, 27) // 27 August 2026
    if (rangeFilter === "hari_ini") {
      const todayStr = "2026-08-27"
      result = result.filter(t => (t.createdAt && t.createdAt.startsWith(todayStr)))
    } else if (rangeFilter === "7_hari") {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      result = result.filter(t => new Date(t.createdAt) >= sevenDaysAgo)
    } else if (rangeFilter === "30_hari") {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      result = result.filter(t => new Date(t.createdAt) >= thirtyDaysAgo)
    }

    // Filter Status
    if (statusFilter !== "all") {
      const qStatus = statusFilter.toLowerCase()
      result = result.filter(t => (t.status || "").toLowerCase() === qStatus)
    }

    // Filter Category
    if (catFilter !== "all") {
      result = result.filter(t => (t.kategoriLayanan || t.jenisLayanan || "").toLowerCase().includes(catFilter.toLowerCase()))
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
  }, [transactions, search, statusFilter, catFilter, selectedMonth, selectedYear, rangeFilter])

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

  const renderStatusBadge = (status: string) => {
    const lower = (status || "").toLowerCase()
    if (lower === "ongoing" || lower === "berjalan") {
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200 font-bold text-xs">BERJALAN</Badge>
    }
    if (lower === "completed" || lower === "paid" || lower === "settlement") {
      return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-bold text-xs">SELESAI</Badge>
    }
    return <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-bold text-xs">PENDING</Badge>
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="size-8 animate-spin text-pink-500" />
    </div>
  )

  const totalNominal = filtered.reduce((acc, t) => acc + (t.nominal || 0), 0)
  const totalPlatformFee = filtered.reduce((acc, t) => acc + (t.platformFee || 0), 0)

  // Calculate Repeat Order Ratio percentage for Summary Banner
  const repeatOrdersCount = filtered.filter(t => t.isRepeatOrder).length
  const repeatOrderRatio = filtered.length > 0 ? ((repeatOrdersCount / filtered.length) * 100).toFixed(1) : "0.0"

  // Category quick filter options
  const categoryQuickFilters = [
    { key: "all", label: "Semua Pesanan" },
    { key: "doula_chat", label: "Doula Chat" },
    { key: "prenatal_yoga", label: "Prenatal Yoga" },
    { key: "materi_online", label: "Materi Prenatal" },
    { key: "doula_offline", label: "Full Journey Doula" },
    { key: "paket_bundling", label: "Paket Bundling" },
    { key: "subscription", label: "Subscription" },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Laporan Transaksi</h1>
          <p className="text-sm text-muted-foreground">
            Riwayat transaksi pembayaran masuk, omset gross, rasio repeat order, komisi platform, dan hak pendapatan mitra.
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
                <p className="text-[11px] text-gray-500 mt-0.5">Tercatat di Sistem</p>
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

        {/* REPEAT ORDER RATIO SUMMARY CARD */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rasio Repeat Order</p>
                <p className="text-2xl font-extrabold text-blue-900 mt-1">{repeatOrderRatio}%</p>
                <p className="text-[11px] text-blue-600 mt-0.5">{repeatOrdersCount} Order Pengulangan</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
                <RefreshCw className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categoryQuickFilters.map(tab => (
          <button
            key={tab.key}
            onClick={() => setCatFilter(tab.key)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              catFilter === tab.key
                ? "bg-pink-600 text-white shadow-xs"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
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

            {/* Separate Dropdown 1: Pilih Bulan */}
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

            {/* Separate Dropdown 2: Pilih Tahun */}
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

            {/* Filter Timeframe Range */}
            <select
              value={rangeFilter}
              onChange={e => setRangeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm bg-white font-medium"
            >
              <option value="all">Semua Rentang Waktu</option>
              <option value="hari_ini">Hari Ini</option>
              <option value="7_hari">7 Hari Terakhir</option>
              <option value="30_hari">30 Hari Terakhir</option>
            </select>

            {/* Filter Category */}
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm bg-white font-medium">
              <option value="all">Semua Kategori</option>
              <option value="doula_chat">Doula Chat</option>
              <option value="materi_online">Online Materi Prenatal</option>
              <option value="doula_offline">Layanan Offline</option>
              <option value="paket_bundling">Paket Bundling</option>
              <option value="prenatal_yoga">Layanan Yoga</option>
              <option value="subscription">Subscription Aplikasi</option>
            </select>

            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm bg-white font-medium">
              <option value="all">Semua Status</option>
              <option value="completed">Selesai (Completed)</option>
              <option value="ongoing">Berjalan (Ongoing)</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Clean Financial Data Table with Masked Customer Names & Eye Toggle */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Daftar Transaksi Pembayaran ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground bg-muted/30">
                  <th className="text-left py-3 px-3 font-medium">ID Transaksi</th>
                  <th className="text-left py-3 px-3 font-medium">Waktu Transaksi</th>
                  <th className="text-left py-3 px-3 font-medium">Pelanggan</th>
                  <th className="text-left py-3 px-3 font-medium">Deskripsi Layanan</th>
                  <th className="text-left py-3 px-3 font-medium">Nominal Gross</th>
                  <th className="text-left py-3 px-3 font-medium">Platform Fee</th>
                  <th className="text-left py-3 px-3 font-medium">Hak Doula</th>
                  <th className="text-left py-3 px-3 font-medium">Status</th>
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
                      <td className="py-3 px-3 font-mono text-xs font-semibold text-gray-700">{tx.id}</td>
                      <td className="py-3 px-3 text-xs text-gray-600">{formatDate(tx.createdAt)}</td>

                      {/* Customer Name with Masking and Eye Toggle */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-900">
                            {unmaskedMap[tx.id] ? tx.namaUser : maskInitialsName(tx.namaUser)}
                          </span>
                          <button
                            onClick={() => setUnmaskedMap(prev => ({ ...prev, [tx.id]: !prev[tx.id] }))}
                            className="p-0.5 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded transition-colors"
                            title={unmaskedMap[tx.id] ? "Sembunyikan Nama" : "Tampilkan Nama Lengkap"}
                          >
                            {unmaskedMap[tx.id] ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-xs text-gray-800">{tx.deskripsi || tx.jenisLayanan}</td>
                      <td className="py-3 px-3 font-bold text-gray-900">{formatRp(nominal)}</td>
                      <td className="py-3 px-3 text-xs text-purple-700 font-semibold">{formatRp(platformFee)}</td>
                      <td className="py-3 px-3 text-xs text-emerald-700 font-bold">{isSub ? "-" : formatRp(doulaEarnings)}</td>

                      {/* Status Column */}
                      <td className="py-3 px-3">
                        {renderStatusBadge(tx.status)}
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-muted-foreground">
                      Tidak ada transaksi ditemukan untuk filter ini
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
