"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, Clock, Search, CalendarDays, AlertCircle } from "lucide-react"
import { db } from "@/lib/firebase"
import { fetchBookings, type Booking } from "@/lib/dashboard-service"
import { doc, updateDoc } from "firebase/firestore"

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filtered, setFiltered] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [rangeFilter, setRangeFilter] = useState("all")

  useEffect(() => {
    fetchBookings(undefined, 1000)
      .then(b => {
        setBookings(b)
        setFiltered(b)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = bookings

    // Filter Bulan
    if (selectedMonth !== "all") {
      const m = parseInt(selectedMonth) - 1
      result = result.filter(b => new Date(b.createdAt).getMonth() === m)
    }

    // Filter Tahun
    if (selectedYear !== "all") {
      const y = parseInt(selectedYear)
      result = result.filter(b => new Date(b.createdAt).getFullYear() === y)
    }

    // Time range filter (Hari, Minggu, Bulan)
    const now = new Date(2026, 7, 27) // 27 August 2026
    if (rangeFilter === "hari_ini") {
      const todayStr = "2026-08-27"
      result = result.filter(b => b.tanggal === todayStr || (b.createdAt && b.createdAt.startsWith(todayStr)))
    } else if (rangeFilter === "7_hari") {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      result = result.filter(b => new Date(b.createdAt) >= sevenDaysAgo)
    } else if (rangeFilter === "30_hari") {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      result = result.filter(b => new Date(b.createdAt) >= thirtyDaysAgo)
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(b => (b.status || "").toLowerCase() === statusFilter.toLowerCase())
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(b =>
        (b.id || "").toLowerCase().includes(q) ||
        (b.namaUser || "").toLowerCase().includes(q) ||
        (b.doulaName || "").toLowerCase().includes(q) ||
        (b.layanan || "").toLowerCase().includes(q)
      )
    }

    setFiltered(result)
  }, [bookings, search, statusFilter, selectedMonth, selectedYear, rangeFilter])

  const formatRp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "bg-amber-100 text-amber-800 border-amber-200 font-semibold" },
    paid: { label: "Paid", color: "bg-blue-100 text-blue-800 border-blue-200 font-semibold" },
    confirmed: { label: "Confirmed", color: "bg-green-100 text-green-800 border-green-200 font-semibold" },
    ongoing: { label: "Ongoing", color: "bg-purple-100 text-purple-800 border-purple-200 font-semibold" },
    completed: { label: "Completed", color: "bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800 border-red-200 font-semibold" },
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status: newStatus })
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="size-8 animate-spin text-pink-500" />
      </div>
    )
  }

  const completedCount = filtered.filter(b => b.status === "completed").length
  const ongoingCount = filtered.filter(b => b.status === "ongoing" || b.status === "confirmed").length
  const pendingCount = filtered.filter(b => b.status === "pending" || b.status === "paid").length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manajemen Booking & Pendampingan</h1>
          <p className="text-sm text-muted-foreground">
            Jadwal sesi pendampingan Doula dan status pelaksanaan ter-sinkronisasi.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Booking</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">{filtered.length} Sesi</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Tercatat di Sistem</p>
              </div>
              <div className="p-3 rounded-xl bg-pink-100 text-pink-700">
                <CalendarDays className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Selesai (Completed)</p>
                <p className="text-2xl font-extrabold text-emerald-900 mt-1">{completedCount} Sesi</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">Pendampingan Selesai</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Berjalan / Confirmed</p>
                <p className="text-2xl font-extrabold text-purple-900 mt-1">{ongoingCount} Sesi</p>
                <p className="text-[11px] text-purple-600 mt-0.5">Sedang Berlangsung</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-100 text-purple-700">
                <Clock className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Menunggu / Pending</p>
                <p className="text-2xl font-extrabold text-amber-900 mt-1">{pendingCount} Sesi</p>
                <p className="text-[11px] text-amber-600 mt-0.5">Menunggu Konfirmasi</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
                <AlertCircle className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar with 2 Separate Dropdowns: Pilih Bulan & Pilih Tahun */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari ID, Nama User, Nama Doula, Layanan..."
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

            {/* Filter Rentang Waktu */}
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

            {/* Filter Status */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm bg-white font-medium"
            >
              <option value="all">Semua Status</option>
              <option value="completed">Completed (Selesai)</option>
              <option value="ongoing">Ongoing (Berjalan)</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Booking Cards List */}
      <div className="grid gap-3">
        {filtered.map(b => {
          const cfg = statusConfig[b.status] || { label: b.status, color: "bg-gray-100 text-gray-700" }
          return (
            <Card key={b.id} className="hover:border-pink-200 transition-colors">
              <CardContent className="pt-5 pb-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-700">{b.id}</span>
                      <Badge className={cfg.color}>{cfg.label}</Badge>
                    </div>
                    <p className="font-bold text-gray-900 text-base">{b.namaUser}</p>
                    <p className="text-xs text-gray-600">
                      Pendamping: <strong className="text-pink-700">{b.doulaName}</strong> • Layanan: <strong className="text-gray-800">{b.layanan}</strong>
                    </p>
                    <p className="text-xs text-gray-500">
                      Jadwal Sesi: <strong>{b.tanggal}</strong> pukul <strong>{b.jam}</strong> ({b.day})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={b.status}
                      onChange={e => updateStatus(b.id, e.target.value)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border bg-white focus:ring-2 focus:ring-pink-400 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {filtered.length === 0 && (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              Tidak ada booking ditemukan untuk filter ini
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
