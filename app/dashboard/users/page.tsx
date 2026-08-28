"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Activity, ChevronDown } from "lucide-react"
import { fetchRegisteredUsers, type RegisteredUser, maskEmail, maskPhone, formatUserDisplayName } from "@/lib/dashboard-service"
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar } from "recharts"

// Mini sparkline datasets mirroring Play Console curves
const sparkJangkauan = [
  { day: "31 Jul", val: 320 }, { day: "2 Aug", val: 450 }, { day: "5 Aug", val: 280 },
  { day: "8 Aug", val: 670 }, { day: "12 Aug", val: 540 }, { day: "16 Aug", val: 760 },
  { day: "20 Aug", val: 830 }, { day: "24 Aug", val: 1240 }, { day: "27 Aug", val: 1840 }
]

const sparkAkuisisi = [
  { day: "31 Jul", val: 15 }, { day: "2 Aug", val: 28 }, { day: "5 Aug", val: 42 },
  { day: "8 Aug", val: 65 }, { day: "12 Aug", val: 110 }, { day: "16 Aug", val: 145 },
  { day: "20 Aug", val: 180 }, { day: "24 Aug", val: 215 }, { day: "27 Aug", val: 253 }
]

const sparkAktifkan = [
  { day: "31 Jul", val: 12 }, { day: "5 Aug", val: 38 }, { day: "10 Aug", val: 85 },
  { day: "15 Aug", val: 130 }, { day: "20 Aug", val: 175 }, { day: "27 Aug", val: 241 }
]

const sparkInteraksi = [
  { day: "31 Jul", val: 18 }, { day: "5 Aug", val: 45 }, { day: "10 Aug", val: 92 },
  { day: "15 Aug", val: 124 }, { day: "20 Aug", val: 162 }, { day: "27 Aug", val: 198 }
]

export default function UsersPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([])
  const [filtered, setFiltered] = useState<RegisteredUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [orderFilter, setOrderFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("all")

  useEffect(() => {
    fetchRegisteredUsers()
      .then(res => {
        setUsers(res)
        setFiltered(res)
        setLoading(false)
      })
      .catch(err => {
        console.error("fetchRegisteredUsers error:", err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let result = users

    // Period filter
    if (periodFilter === "28_hari") {
      const limitDate = new Date(2026, 7, 27 - 28)
      result = result.filter(u => new Date(u.registeredAt) >= limitDate)
    } else if (periodFilter === "90_hari") {
      const limitDate = new Date(2026, 7, 27 - 90)
      result = result.filter(u => new Date(u.registeredAt) >= limitDate)
    } else if (periodFilter === "juni") {
      result = result.filter(u => {
        const d = new Date(u.registeredAt)
        return d.getMonth() === 5 && d.getFullYear() === 2026
      })
    } else if (periodFilter === "juli") {
      result = result.filter(u => {
        const d = new Date(u.registeredAt)
        return d.getMonth() === 6 && d.getFullYear() === 2026
      })
    } else if (periodFilter === "agustus") {
      result = result.filter(u => {
        const d = new Date(u.registeredAt)
        return d.getMonth() === 7 && d.getFullYear() === 2026
      })
    }

    // Order status filter
    if (orderFilter === "transacting") {
      result = result.filter(u => u.totalOrders > 0)
    } else if (orderFilter === "non_transacting") {
      result = result.filter(u => u.totalOrders === 0)
    }

    // Search query
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(u =>
        u.id.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.domisili.toLowerCase().includes(q)
      )
    }

    setFiltered(result)
  }, [users, search, orderFilter, periodFilter])

  const formatRp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

  const formatDate = (val: string) => {
    if (!val) return "-"
    const d = new Date(val)
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="size-8 animate-spin text-pink-500" />
    </div>
  )

  const transactingCount = users.filter(u => u.totalOrders > 0).length
  const nonTransactingCount = users.length - transactingCount

  return (
    <div className="space-y-4">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Kembangkan basis pengguna</h1>
          <p className="text-sm text-muted-foreground">
            Performa Perangkat, Akuisisi Pengguna Aktif, dan Manajemen Akun Aplikasi Momsie.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-pink-100 text-pink-800 border-pink-200 font-semibold px-3 py-1 text-xs">
            253 Total Pengguna Terdaftar
          </Badge>
        </div>
      </div>

      {/* Play Console Styled Metric Cards Banner */}
      <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Activity className="size-5 text-pink-600" /> Performa Aplikasi Momsie
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Metrik menurut: <strong className="text-gray-800">Perangkat</strong></span>
              <span className="px-2.5 py-1 bg-white border rounded-md text-xs font-semibold text-gray-700 flex items-center gap-1 shadow-xs">
                28 hari terakhir <ChevronDown className="size-3 text-gray-400" />
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {/* Metric 1: Jangkauan / Tayangan Perangkat */}
            <div className="p-3.5 rounded-xl bg-white border border-gray-200 flex flex-col justify-between h-[155px]">
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Jangkauan</p>
                <p className="text-xs text-gray-600 font-medium mt-0.5">Tayangan perangkat</p>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-2xl font-black text-gray-900">1.840</p>
                  <p className="text-[11px] font-bold text-emerald-600">+14%</p>
                </div>
              </div>
              <div className="h-[45px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkJangkauan}>
                    <Area type="monotone" dataKey="val" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metric 2: Akuisisi / Akuisisi Perangkat (253 User) */}
            <div className="p-3.5 rounded-xl bg-white border border-gray-200 flex flex-col justify-between h-[155px]">
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Akuisisi</p>
                <p className="text-xs text-gray-600 font-medium mt-0.5">Akuisisi perangkat</p>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-2xl font-black text-gray-900">{users.length}</p>
                  <p className="text-[11px] font-bold text-emerald-600">+22%</p>
                </div>
              </div>
              <div className="h-[45px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sparkAkuisisi}>
                    <Bar dataKey="val" fill="#0284c7" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metric 3: Aktifkan / Perangkat Pertama Dibuka (241 Perangkat) */}
            <div className="p-3.5 rounded-xl bg-white border border-gray-200 flex flex-col justify-between h-[155px]">
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Aktifkan</p>
                <p className="text-xs text-gray-600 font-medium mt-0.5">Pertama dibuka</p>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-2xl font-black text-gray-900">241</p>
                  <p className="text-[11px] font-bold text-emerald-600">95.2%</p>
                </div>
              </div>
              <div className="h-[45px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkAktifkan}>
                    <Area type="monotone" dataKey="val" stroke="#059669" fill="#d1fae5" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metric 4: Interaksi / Aktif Bulanan (198 MAU) */}
            <div className="p-3.5 rounded-xl bg-white border border-gray-200 flex flex-col justify-between h-[155px]">
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Interaksi</p>
                <p className="text-xs text-gray-600 font-medium mt-0.5">Aktif bulanan (MAU)</p>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-2xl font-black text-gray-900">198</p>
                  <p className="text-[11px] font-bold text-purple-600">78.2%</p>
                </div>
              </div>
              <div className="h-[45px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkInteraksi}>
                    <Area type="monotone" dataKey="val" stroke="#7c3aed" fill="#ede9fe" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metric 5: Pertahankan / Retensi 7 Hari */}
            <div className="p-3.5 rounded-xl bg-white border border-gray-200 flex flex-col justify-between h-[155px]">
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Pertahankan</p>
                <p className="text-xs text-gray-600 font-medium mt-0.5">Retensi 7 hari</p>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-2xl font-black text-gray-900">78.2%</p>
                  <p className="text-[11px] font-bold text-emerald-600">Tinggi</p>
                </div>
              </div>
              <div className="flex items-center justify-center h-[45px] bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold">
                Retensi Sangat Baik
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Bar: Periode, Tipe User, Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari ID User, Nama, Email, Domisili..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>

            {/* Filter Periode */}
            <select
              value={periodFilter}
              onChange={e => setPeriodFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm bg-pink-50 text-pink-900 font-semibold border-pink-200 focus:ring-2 focus:ring-pink-400 outline-none"
            >
              <option value="all">Semua Periode ({users.length} User)</option>
              <option value="28_hari">28 Hari Terakhir</option>
              <option value="90_hari">90 Hari Terakhir</option>
              <option value="juni">Juni 2026</option>
              <option value="juli">Juli 2026</option>
              <option value="agustus">Agustus 2026</option>
            </select>

            {/* Filter Tipe User */}
            <select
              value={orderFilter}
              onChange={e => setOrderFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm bg-white font-medium"
            >
              <option value="all">Semua Pengguna ({users.length})</option>
              <option value="transacting">User Bertransaksi ({transactingCount})</option>
              <option value="non_transacting">User Belum Transaksi ({nonTransactingCount})</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Registered Users Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Daftar Pengguna Aplikasi Terdaftar ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground bg-muted/30">
                  <th className="text-left py-3 px-2 font-medium">ID User</th>
                  <th className="text-left py-3 px-2 font-medium">Nama Pengguna</th>
                  <th className="text-left py-3 px-2 font-medium">Email (Sensored)</th>
                  <th className="text-left py-3 px-2 font-medium">No. Telepon (Sensored)</th>
                  <th className="text-left py-3 px-2 font-medium">Domisili</th>
                  <th className="text-left py-3 px-2 font-medium">Tgl Registrasi</th>
                  <th className="text-left py-3 px-2 font-medium">Status Transaksi</th>
                  <th className="text-left py-3 px-2 font-medium">Total Spend</th>
                  <th className="text-left py-3 px-2 font-medium">Status Akun</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const handle = `@${u.name.toLowerCase().replace(/[^a-z]/g, "")}`
                  return (
                    <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 font-mono text-xs font-semibold text-gray-700">{u.id}</td>
                      <td className="py-3 px-2">
                        <p className="font-semibold text-gray-900">{formatUserDisplayName(u.name)}</p>
                        <p className="text-[11px] text-gray-400 font-mono">{handle}</p>
                      </td>
                      <td className="py-3 px-2 font-mono text-xs text-gray-600">{maskEmail(u.email)}</td>
                      <td className="py-3 px-2 font-mono text-xs text-gray-600">{maskPhone(u.phone)}</td>
                      <td className="py-3 px-2 text-xs text-gray-700">{u.domisili}</td>
                      <td className="py-3 px-2 text-xs text-gray-600">{formatDate(u.registeredAt)}</td>
                      <td className="py-3 px-2">
                        {u.totalOrders > 0 ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold text-xs">
                            {u.totalOrders} Order Selesai
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">0 Order (Download Only)</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-xs font-semibold text-gray-900">
                        {u.totalSpend > 0 ? formatRp(u.totalSpend) : "-"}
                      </td>
                      <td className="py-3 px-2">
                        <Badge className="bg-emerald-100 text-emerald-800 font-semibold text-xs border-emerald-200">
                          AKTIF
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-muted-foreground">
                      Tidak ada pengguna ditemukan untuk filter ini
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
