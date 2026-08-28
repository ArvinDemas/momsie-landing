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
  const [monthFilter, setMonthFilter] = useState("all")
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

    // Month filter
    if (monthFilter === "juni") {
      result = result.filter(b => {
        const d = new Date(b.createdAt)
        return d.getMonth() === 5 && d.getFullYear() === 2026
      })
    } else if (monthFilter === "juli") {
      result = result.filter(b => {
        const d = new Date(b.createdAt)
        return d.getMonth() === 6 && d.getFullYear() === 2026
      })
    } else if (monthFilter === "agustus") {
      result = result.filter(b => {
        const d = new Date(b.createdAt)
        return d.getMonth() === 7 && d.getFullYear() === 2026
      })
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
  }, [bookings, search, statusFilter, monthFilter, rangeFilter])

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
    } catch (e) { console.error(e) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="size-8 animate-spin text-pink-500" />
    </div>
  )

  const juniCount = bookings.filter(b => { const d = new Date(b.createdAt); return d.getMonth() === 5 && d.getFullYear() === 2026 }).length
  const juliCount = bookings.filter(b => { const d = new Date(b.createdAt); return d.getMonth() === 6 && d.getFullYear() === 2026 }).length
  const agustusCount = bookings.filter(b => { const d = new Date(b.createdAt); return d.getMonth() === 7 && d.getFullYear() === 2026 }).length

  const completedCount = filtered.filter(b => b.status === "completed").length
  const ongoingCount = filtered.filter(b => b.status === "ongoing" || b.status === "confirmed").length
  const pendingCount = filtered.filter(b => b.status === "pending" || b.status === "paid").length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Booking & Pendampingan</h1>
          <p className="text-sm text-muted-foreground">
            Jadwal sesi pendampingan Doula dan status pelaksanaan ter-sinkronisasi.
          </p>
        </div>
      </div>

      {/* KPI Cards (No Platform Fee / Doula Earn per request) */}
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

      {/* Filter Bar: Bulan, Minggu, Hari */}
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

            {/* Filter Bulan */}
            <select
              value={monthFilter}
              onChange={e => setMonthFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm bg-pink-50 text-pink-900 font-semibold border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none"
            >
              <option value="all">Semua Bulan ({bookings.length} Booking)</option>
              <option value="juni">Juni 2026 ({juniCount} Booking)</option>
              <option value="juli">Juli 2026 ({juliCount} Booking)</option>
              <option value="agustus">Agustus 2026 ({agustusCount} Booking)</option>
            </select>

            {/* Filter Rentang Waktu (Hari, Minggu, Bulan) */}
            <select
              value={rangeFilter}
              onChange={e => setRangeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm bg-white font-medium"
            >
              <option value="all">Semua Rentang Waktu</option>
              <option value="hari_ini">Hari Ini (Per Hari)</option>
              <option value="7_hari">7 Hari Terakhir (Per Minggu)</option>
              <option value="30_hari">30 Hari Terakhir (Per Bulan)</option>
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

      {/* Booking Cards List (Platform fee & Hak Doula hidden per request) */}
      <div className="grid gap-3">
        {filtered.map(b => {
          const cfg = statusConfig[b.status] || { label: b.status, color: "bg-gray-100 text-gray-700" }
          return (
            <Card key={b.id} className="hover:border-pink-200 transition-colors">
              <CardContent className="pt-5 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex-1 min-w-[220px]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge className={cfg.color}>{cfg.label}</Badge>
                      <span className="font-mono text-xs text-gray-500 font-semibold">{b.id}</span>
                    </div>
                    <p className="font-bold text-base text-gray-900">{b.namaUser}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Mitra Doula: <span className="font-semibold text-gray-800">{b.doulaName}</span> • <span className="text-pink-600 font-medium">{b.layanan}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      📅 {b.tanggal} ({b.day}) • ⏰ Pukul {b.jam} WIB
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-extrabold text-gray-900">{formatRp(b.totalBayar || b.hargaLayanan)}</p>
                    <span className="text-[11px] text-gray-400 font-medium">Layanan + Admin</span>
                  </div>

                  <div className="flex gap-2">
                    {b.status === "paid" && (
                      <button onClick={() => updateStatus(b.id, "confirmed")}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">
                        <CheckCircle className="size-3.5" /> Konfirmasi
                      </button>
                    )}
                    {(b.status === "paid" || b.status === "confirmed") && (
                      <button onClick={() => updateStatus(b.id, "ongoing")}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors">
                        <Clock className="size-3.5" /> Mulai Sesi
                      </button>
                    )}
                    {b.status === "ongoing" && (
                      <button onClick={() => updateStatus(b.id, "completed")}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors">
                        <CheckCircle className="size-3.5" /> Selesaikan
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-white rounded-xl border">
            Tidak ada booking ditemukan untuk filter ini
          </div>
        )}
      </div>
    </div>
  )
}
