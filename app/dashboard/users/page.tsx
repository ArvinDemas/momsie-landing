"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Activity, ChevronDown, Filter, Info, ArrowUpRight, HelpCircle } from "lucide-react"
import { fetchRegisteredUsers, type RegisteredUser, maskEmail, maskPhone, formatUserDisplayName } from "@/lib/dashboard-service"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Daily time series data for Google Play Console curves (31 Jul - 27 Aug 2026)
const chartDataJangkauan = [
  { date: "31 Jul", penjelajahan: 12, berbayar: 45, tidakDiatribusikan: 8 },
  { date: "3 Aug", penjelajahan: 18, berbayar: 62, tidakDiatribusikan: 12 },
  { date: "6 Aug", penjelajahan: 24, berbayar: 85, tidakDiatribusikan: 15 },
  { date: "9 Aug", penjelajahan: 15, berbayar: 40, tidakDiatribusikan: 9 },
  { date: "12 Aug", penjelajahan: 32, berbayar: 110, tidakDiatribusikan: 18 },
  { date: "15 Aug", penjelajahan: 28, berbayar: 95, tidakDiatribusikan: 14 },
  { date: "18 Aug", penjelajahan: 35, berbayar: 125, tidakDiatribusikan: 20 },
  { date: "21 Aug", penjelajahan: 42, berbayar: 150, tidakDiatribusikan: 22 },
  { date: "24 Aug", penjelajahan: 65, berbayar: 210, tidakDiatribusikan: 28 },
  { date: "27 Aug", penjelajahan: 85, berbayar: 280, tidakDiatribusikan: 35 },
]

const chartDataAkuisisi = [
  { date: "31 Jul", penjelajahan: 2, berbayar: 10, tidakDiatribusikan: 1 },
  { date: "3 Aug", penjelajahan: 3, berbayar: 14, tidakDiatribusikan: 2 },
  { date: "6 Aug", penjelajahan: 4, berbayar: 18, tidakDiatribusikan: 3 },
  { date: "9 Aug", penjelajahan: 2, berbayar: 8, tidakDiatribusikan: 1 },
  { date: "12 Aug", penjelajahan: 5, berbayar: 22, tidakDiatribusikan: 4 },
  { date: "15 Aug", penjelajahan: 4, berbayar: 20, tidakDiatribusikan: 3 },
  { date: "18 Aug", penjelajahan: 5, berbayar: 25, tidakDiatribusikan: 4 },
  { date: "21 Aug", penjelajahan: 6, berbayar: 28, tidakDiatribusikan: 5 },
  { date: "24 Aug", penjelajahan: 8, berbayar: 35, tidakDiatribusikan: 6 },
  { date: "27 Aug", penjelajahan: 10, berbayar: 42, tidakDiatribusikan: 7 },
]

const chartDataAktifkan = [
  { date: "31 Jul", penjelajahan: 2, berbayar: 9, tidakDiatribusikan: 1 },
  { date: "3 Aug", penjelajahan: 3, berbayar: 13, tidakDiatribusikan: 2 },
  { date: "6 Aug", penjelajahan: 4, berbayar: 17, tidakDiatribusikan: 2 },
  { date: "9 Aug", penjelajahan: 1, berbayar: 7, tidakDiatribusikan: 1 },
  { date: "12 Aug", penjelajahan: 5, berbayar: 20, tidakDiatribusikan: 3 },
  { date: "15 Aug", penjelajahan: 4, berbayar: 19, tidakDiatribusikan: 3 },
  { date: "18 Aug", penjelajahan: 5, berbayar: 23, tidakDiatribusikan: 4 },
  { date: "21 Aug", penjelajahan: 6, berbayar: 26, tidakDiatribusikan: 4 },
  { date: "24 Aug", penjelajahan: 7, berbayar: 33, tidakDiatribusikan: 5 },
  { date: "27 Aug", penjelajahan: 9, berbayar: 40, tidakDiatribusikan: 6 },
]

const chartDataInteraksi = [
  { date: "31 Jul", penjelajahan: 1, berbayar: 8, tidakDiatribusikan: 1 },
  { date: "3 Aug", penjelajahan: 2, berbayar: 11, tidakDiatribusikan: 2 },
  { date: "6 Aug", penjelajahan: 3, berbayar: 14, tidakDiatribusikan: 2 },
  { date: "9 Aug", penjelajahan: 1, berbayar: 5, tidakDiatribusikan: 1 },
  { date: "12 Aug", penjelajahan: 4, berbayar: 16, tidakDiatribusikan: 2 },
  { date: "15 Aug", penjelajahan: 3, berbayar: 15, tidakDiatribusikan: 2 },
  { date: "18 Aug", penjelajahan: 4, berbayar: 19, tidakDiatribusikan: 3 },
  { date: "21 Aug", penjelajahan: 5, berbayar: 21, tidakDiatribusikan: 3 },
  { date: "24 Aug", penjelajahan: 6, berbayar: 26, tidakDiatribusikan: 4 },
  { date: "27 Aug", penjelajahan: 7, berbayar: 32, tidakDiatribusikan: 5 },
]

const chartDataPertahankan = [
  { date: "31 Jul", penjelajahan: 70, berbayar: 78, tidakDiatribusikan: 62 },
  { date: "3 Aug", penjelajahan: 72, berbayar: 80, tidakDiatribusikan: 64 },
  { date: "6 Aug", penjelajahan: 75, berbayar: 82, tidakDiatribusikan: 65 },
  { date: "9 Aug", penjelajahan: 71, berbayar: 77, tidakDiatribusikan: 60 },
  { date: "12 Aug", penjelajahan: 74, berbayar: 81, tidakDiatribusikan: 66 },
  { date: "15 Aug", penjelajahan: 76, berbayar: 83, tidakDiatribusikan: 67 },
  { date: "18 Aug", penjelajahan: 78, berbayar: 84, tidakDiatribusikan: 68 },
  { date: "21 Aug", penjelajahan: 77, berbayar: 83, tidakDiatribusikan: 67 },
  { date: "24 Aug", penjelajahan: 79, berbayar: 85, tidakDiatribusikan: 69 },
  { date: "27 Aug", penjelajahan: 80, berbayar: 86, tidakDiatribusikan: 70 },
]

export default function UsersPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([])
  const [filtered, setFiltered] = useState<RegisteredUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [orderFilter, setOrderFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("all")

  // Active Play Console Tab state
  const [activeTab, setActiveTab] = useState<"jangkauan" | "akuisisi" | "aktifkan" | "interaksi" | "pertahankan">("jangkauan")

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

  // Tab configurations matching Google Play Console exact layout
  const tabConfigs = {
    jangkauan: {
      title: "Jangkauan",
      subtitle: "Tayangan perangkat",
      value: "1.840",
      change: "0%",
      chartTitle: "Tayangan perangkat",
      breakdown: [
        { label: "Penjelajahan Google Play", val: "420", change: "0%" },
        { label: "Berbayar dan langsung", val: "1.240", change: "+29%" },
        { label: "Tidak diatribusikan", val: "180", change: "-40%" },
      ],
      chartData: chartDataJangkauan,
    },
    akuisisi: {
      title: "Akuisisi",
      subtitle: "Akuisisi perangkat",
      value: "253",
      change: "0%",
      chartTitle: "Akuisisi perangkat",
      breakdown: [
        { label: "Penjelajahan Google Play", val: "38", change: "0%" },
        { label: "Berbayar dan langsung", val: "185", change: "+29%" },
        { label: "Tidak diatribusikan", val: "30", change: "-40%" },
      ],
      chartData: chartDataAkuisisi,
    },
    aktifkan: {
      title: "Aktifkan",
      subtitle: "Perangkat tempat pertama dibuka",
      value: "241",
      change: "0%",
      chartTitle: "Perangkat tempat pertama dibuka",
      breakdown: [
        { label: "Penjelajahan Google Play", val: "35", change: "0%" },
        { label: "Berbayar dan langsung", val: "178", change: "+29%" },
        { label: "Tidak diatribusikan", val: "28", change: "-40%" },
      ],
      chartData: chartDataAktifkan,
    },
    interaksi: {
      title: "Interaksi",
      subtitle: "Perangkat aktif bulanan",
      value: "198",
      change: "0%",
      chartTitle: "Perangkat aktif harian",
      breakdown: [
        { label: "Penjelajahan Google Play", val: "28", change: "0%" },
        { label: "Berbayar dan langsung", val: "148", change: "+29%" },
        { label: "Tidak diatribusikan", val: "22", change: "-40%" },
      ],
      chartData: chartDataInteraksi,
    },
    pertahankan: {
      title: "Pertahankan",
      subtitle: "Retensi perangkat 7 hari",
      value: "78.2%",
      change: "Tinggi",
      chartTitle: "Retensi perangkat 7 hari",
      breakdown: [
        { label: "Penjelajahan Google Play", val: "76.5%", change: "0%" },
        { label: "Berbayar dan langsung", val: "81.4%", change: "+29%" },
        { label: "Tidak diatribusikan", val: "68.2%", change: "-40%" },
      ],
      chartData: chartDataPertahankan,
    },
  }

  const currentTab = tabConfigs[activeTab]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Kembangkan basis pengguna</h1>
          <p className="text-sm text-muted-foreground">
            Performa Anda di Google Play Store & Manajemen Basis Pengguna Terdaftar Aplikasi Momsie.
          </p>
        </div>
      </div>

      {/* Google Play Console Section Container */}
      <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-100 bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-gray-900">Performa Anda di Google Play</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-600 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-100 font-medium">
                Metrik menurut: <strong>Perangkat</strong> ▾
              </span>
              <span className="text-xs text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1 shadow-2xs">
                28 hari terakhir ▾
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Top 5 Tab Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 border-b divide-x divide-gray-100 bg-gray-50/30">
            {(Object.keys(tabConfigs) as Array<keyof typeof tabConfigs>).map(key => {
              const tab = tabConfigs[key]
              const isActive = activeTab === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`p-4 text-left transition-all relative ${
                    isActive
                      ? "bg-white shadow-xs border-b-2 border-blue-600 z-10"
                      : "hover:bg-gray-100/60 text-gray-600"
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{tab.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">{tab.subtitle}</p>
                  <div className="flex items-baseline justify-between mt-2">
                    <p className="text-xl font-black text-gray-900">{tab.value}</p>
                    <span className={`text-xs font-bold ${tab.change.startsWith("+") ? "text-emerald-600" : tab.change.startsWith("-") ? "text-red-500" : "text-gray-500"}`}>
                      {tab.change}
                    </span>
                  </div>
                  <p className="text-[10px] text-blue-600 font-semibold mt-1 flex items-center gap-0.5">
                    {isActive ? "Sembunyikan detail ▲" : "Tampilkan detail ▼"}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Expanded Tab Content & Traffic Source Breakdown Cards */}
          <div className="p-6 space-y-6 bg-white">
            {/* Traffic Sources Breakdown 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentTab.breakdown.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                  <p className="text-xs font-semibold text-gray-600">{item.label}</p>
                  <div className="flex items-baseline justify-between mt-1">
                    <p className="text-2xl font-black text-gray-900">{item.val}</p>
                    <span className={`text-xs font-bold ${item.change.startsWith("+") ? "text-emerald-600 font-bold" : item.change.startsWith("-") ? "text-red-500" : "text-gray-500"}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter Toolbar above Recharts Chart */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <span>{currentTab.chartTitle}</span>
                <span className="text-xs text-gray-500 font-normal">menurut</span>
                <span className="px-3 py-1 bg-sky-100 text-sky-900 font-semibold rounded-lg text-xs border border-sky-200">
                  Sumber traffic ▾
                </span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-medium rounded-lg text-xs border border-emerald-200">
                  ✓ 3 sumber traffic
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 border px-3 py-1.5 rounded-lg hover:bg-gray-100">
                  <Filter className="size-3.5" /> Tambahkan filter
                </button>
                <a href="#details" className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-0.5">
                  Pelajari lebih dalam <ArrowUpRight className="size-3" />
                </a>
              </div>
            </div>

            {/* Recharts Area Chart Matching Google Play Console Exact Graph */}
            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentTab.chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="berbayar" name="Berbayar dan langsung" stroke="#0284c7" fill="#e0f2fe" fillOpacity={0.7} strokeWidth={2} />
                  <Area type="monotone" dataKey="penjelajahan" name="Penjelajahan Google Play" stroke="#2563eb" fill="transparent" strokeWidth={2} />
                  <Area type="monotone" dataKey="tidakDiatribusikan" name="Tidak diatribusikan" stroke="#0d9488" fill="transparent" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google Play Store Listing & Experiment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-sm text-gray-900">Listingan Play Store</p>
                <p className="text-xs text-gray-500 mt-1">Listingan default aktif</p>
                <p className="text-xs font-semibold text-emerald-700 mt-2 bg-emerald-50 px-2.5 py-1 rounded-md inline-block border border-emerald-200">
                  Rasio konversi Anda adalah <strong>88.46%</strong>
                </p>
              </div>
              <a href="#listing" className="size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100">
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-sm text-gray-900">Eksperimen listingan Play Store</p>
                <p className="text-xs text-gray-500 mt-1">0 eksperimen sedang berjalan • 0 dihentikan</p>
                <p className="text-xs text-gray-400 mt-2">0 diterapkan</p>
              </div>
              <a href="#experiment" className="size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100">
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-sm text-gray-900">Pra-pendaftaran</p>
                <p className="text-xs text-gray-500 mt-1">Izinkan pengguna melakukan pradaftar untuk aplikasi Anda guna membangun awareness.</p>
              </div>
              <button className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-lg border border-blue-200 transition-colors">
                Mulai ➔
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar for User Table */}
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
