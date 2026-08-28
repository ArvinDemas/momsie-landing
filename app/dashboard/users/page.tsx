"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Activity, ChevronDown, Filter, ArrowUpRight, Eye, EyeOff, HeartPulse, MapPin, X, Phone, Mail, Calendar, UserCheck } from "lucide-react"
import { fetchRegisteredUsers, type RegisteredUser, maskEmail, maskPhone, maskInitialsName } from "@/lib/dashboard-service"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// ============================================================
// 1. 28 HARI TERAKHIR DATASETS (31 Jul - 29 Aug, incomplete Aug 29 dips down naturally)
// ============================================================
const chartDataJangkauan_28d = [
  { date: "31 Jul", penjelajahan: 12, berbayar: 45, tidakDiatribusikan: 8 },
  { date: "3 Aug", penjelajahan: 18, berbayar: 62, tidakDiatribusikan: 12 },
  { date: "6 Aug", penjelajahan: 24, berbayar: 78, tidakDiatribusikan: 15 },
  { date: "9 Aug", penjelajahan: 20, berbayar: 55, tidakDiatribusikan: 10 },
  { date: "12 Aug", penjelajahan: 32, berbayar: 95, tidakDiatribusikan: 18 },
  { date: "15 Aug", penjelajahan: 28, berbayar: 88, tidakDiatribusikan: 14 },
  { date: "18 Aug", penjelajahan: 35, berbayar: 110, tidakDiatribusikan: 20 },
  { date: "21 Aug", penjelajahan: 40, berbayar: 125, tidakDiatribusikan: 22 },
  { date: "24 Aug", penjelajahan: 45, berbayar: 135, tidakDiatribusikan: 25 },
  { date: "27 Aug", penjelajahan: 48, berbayar: 142, tidakDiatribusikan: 27 },
  { date: "29 Aug", penjelajahan: 15, berbayar: 38, tidakDiatribusikan: 9 }, // Incomplete day dip!
]

const chartDataAkuisisi_28d = [
  { date: "31 Jul", penjelajahan: 1, berbayar: 4, tidakDiatribusikan: 1 },
  { date: "3 Aug", penjelajahan: 2, berbayar: 5, tidakDiatribusikan: 1 },
  { date: "6 Aug", penjelajahan: 2, berbayar: 7, tidakDiatribusikan: 1 },
  { date: "9 Aug", penjelajahan: 1, berbayar: 4, tidakDiatribusikan: 1 },
  { date: "12 Aug", penjelajahan: 3, berbayar: 8, tidakDiatribusikan: 2 },
  { date: "15 Aug", penjelajahan: 3, berbayar: 7, tidakDiatribusikan: 1 },
  { date: "18 Aug", penjelajahan: 4, berbayar: 9, tidakDiatribusikan: 2 },
  { date: "21 Aug", penjelajahan: 5, berbayar: 10, tidakDiatribusikan: 2 },
  { date: "24 Aug", penjelajahan: 6, berbayar: 11, tidakDiatribusikan: 3 },
  { date: "27 Aug", penjelajahan: 7, berbayar: 12, tidakDiatribusikan: 3 },
  { date: "29 Aug", penjelajahan: 2, berbayar: 3, tidakDiatribusikan: 1 }, // Incomplete day dip!
]

const chartDataAktifkan_28d = [
  { date: "31 Jul", penjelajahan: 1, berbayar: 4, tidakDiatribusikan: 1 },
  { date: "3 Aug", penjelajahan: 2, berbayar: 5, tidakDiatribusikan: 1 },
  { date: "6 Aug", penjelajahan: 2, berbayar: 6, tidakDiatribusikan: 1 },
  { date: "9 Aug", penjelajahan: 1, berbayar: 3, tidakDiatribusikan: 1 },
  { date: "12 Aug", penjelajahan: 3, berbayar: 7, tidakDiatribusikan: 2 },
  { date: "15 Aug", penjelajahan: 3, berbayar: 7, tidakDiatribusikan: 1 },
  { date: "18 Aug", penjelajahan: 4, berbayar: 8, tidakDiatribusikan: 2 },
  { date: "21 Aug", penjelajahan: 4, berbayar: 9, tidakDiatribusikan: 2 },
  { date: "24 Aug", penjelajahan: 5, berbayar: 10, tidakDiatribusikan: 2 },
  { date: "27 Aug", penjelajahan: 6, berbayar: 11, tidakDiatribusikan: 3 },
  { date: "29 Aug", penjelajahan: 2, berbayar: 3, tidakDiatribusikan: 1 }, // Incomplete day dip!
]

const chartDataInteraksi_28d = [
  { date: "31 Jul", penjelajahan: 1, berbayar: 3, tidakDiatribusikan: 1 },
  { date: "3 Aug", penjelajahan: 1, berbayar: 4, tidakDiatribusikan: 1 },
  { date: "6 Aug", penjelajahan: 2, berbayar: 5, tidakDiatribusikan: 1 },
  { date: "9 Aug", penjelajahan: 1, berbayar: 2, tidakDiatribusikan: 1 },
  { date: "12 Aug", penjelajahan: 2, berbayar: 6, tidakDiatribusikan: 1 },
  { date: "15 Aug", penjelajahan: 2, berbayar: 5, tidakDiatribusikan: 1 },
  { date: "18 Aug", penjelajahan: 3, berbayar: 7, tidakDiatribusikan: 2 },
  { date: "21 Aug", penjelajahan: 3, berbayar: 8, tidakDiatribusikan: 2 },
  { date: "24 Aug", penjelajahan: 4, berbayar: 9, tidakDiatribusikan: 2 },
  { date: "27 Aug", penjelajahan: 5, berbayar: 10, tidakDiatribusikan: 2 },
  { date: "29 Aug", penjelajahan: 1, berbayar: 2, tidakDiatribusikan: 1 }, // Incomplete day dip!
]

const chartDataPertahankan_28d = [
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
  { date: "29 Aug", penjelajahan: 78, berbayar: 82, tidakDiatribusikan: 68 },
]

// ============================================================
// 2. 90 HARI TERAKHIR DATASETS (1 Jun - 29 Aug, Full 3 Months of History)
// ============================================================
const chartDataJangkauan_90d = [
  { date: "1 Jun", penjelajahan: 2, berbayar: 8, tidakDiatribusikan: 2 },
  { date: "10 Jun", penjelajahan: 5, berbayar: 20, tidakDiatribusikan: 4 },
  { date: "20 Jun", penjelajahan: 10, berbayar: 38, tidakDiatribusikan: 7 },
  { date: "1 Jul", penjelajahan: 15, berbayar: 52, tidakDiatribusikan: 10 },
  { date: "10 Jul", penjelajahan: 22, berbayar: 70, tidakDiatribusikan: 14 },
  { date: "20 Jul", penjelajahan: 28, berbayar: 85, tidakDiatribusikan: 16 },
  { date: "1 Aug", penjelajahan: 32, berbayar: 95, tidakDiatribusikan: 18 },
  { date: "10 Aug", penjelajahan: 38, berbayar: 115, tidakDiatribusikan: 22 },
  { date: "20 Aug", penjelajahan: 44, berbayar: 132, tidakDiatribusikan: 25 },
  { date: "27 Aug", penjelajahan: 48, berbayar: 142, tidakDiatribusikan: 27 },
  { date: "29 Aug", penjelajahan: 15, berbayar: 38, tidakDiatribusikan: 9 }, // Incomplete day dip!
]

const chartDataAkuisisi_90d = [
  { date: "1 Jun", penjelajahan: 1, berbayar: 1, tidakDiatribusikan: 0 },
  { date: "10 Jun", penjelajahan: 1, berbayar: 2, tidakDiatribusikan: 1 },
  { date: "20 Jun", penjelajahan: 2, berbayar: 4, tidakDiatribusikan: 1 },
  { date: "1 Jul", penjelajahan: 3, berbayar: 6, tidakDiatribusikan: 1 },
  { date: "10 Jul", penjelajahan: 4, berbayar: 7, tidakDiatribusikan: 2 },
  { date: "20 Jul", penjelajahan: 5, berbayar: 8, tidakDiatribusikan: 2 },
  { date: "1 Aug", penjelajahan: 5, berbayar: 9, tidakDiatribusikan: 2 },
  { date: "10 Aug", penjelajahan: 6, berbayar: 10, tidakDiatribusikan: 3 },
  { date: "20 Aug", penjelajahan: 7, berbayar: 11, tidakDiatribusikan: 3 },
  { date: "27 Aug", penjelajahan: 7, berbayar: 12, tidakDiatribusikan: 3 },
  { date: "29 Aug", penjelajahan: 2, berbayar: 3, tidakDiatribusikan: 1 }, // Incomplete day dip!
]

const chartDataAktifkan_90d = [
  { date: "1 Jun", penjelajahan: 1, berbayar: 1, tidakDiatribusikan: 0 },
  { date: "10 Jun", penjelajahan: 1, berbayar: 2, tidakDiatribusikan: 1 },
  { date: "20 Jun", penjelajahan: 2, berbayar: 3, tidakDiatribusikan: 1 },
  { date: "1 Jul", penjelajahan: 3, berbayar: 5, tidakDiatribusikan: 1 },
  { date: "10 Jul", penjelajahan: 4, berbayar: 6, tidakDiatribusikan: 2 },
  { date: "20 Jul", penjelajahan: 5, berbayar: 7, tidakDiatribusikan: 2 },
  { date: "1 Aug", penjelajahan: 5, berbayar: 8, tidakDiatribusikan: 2 },
  { date: "10 Aug", penjelajahan: 6, berbayar: 9, tidakDiatribusikan: 2 },
  { date: "20 Aug", penjelajahan: 6, berbayar: 10, tidakDiatribusikan: 3 },
  { date: "27 Aug", penjelajahan: 6, berbayar: 11, tidakDiatribusikan: 3 },
  { date: "29 Aug", penjelajahan: 2, berbayar: 3, tidakDiatribusikan: 1 }, // Incomplete day dip!
]

const chartDataInteraksi_90d = [
  { date: "1 Jun", penjelajahan: 0, berbayar: 1, tidakDiatribusikan: 0 },
  { date: "10 Jun", penjelajahan: 1, berbayar: 2, tidakDiatribusikan: 0 },
  { date: "20 Jun", penjelajahan: 1, berbayar: 3, tidakDiatribusikan: 1 },
  { date: "1 Jul", penjelajahan: 2, berbayar: 4, tidakDiatribusikan: 1 },
  { date: "10 Jul", penjelajahan: 3, berbayar: 5, tidakDiatribusikan: 1 },
  { date: "20 Jul", penjelajahan: 4, berbayar: 6, tidakDiatribusikan: 2 },
  { date: "1 Aug", penjelajahan: 4, berbayar: 7, tidakDiatribusikan: 2 },
  { date: "10 Aug", penjelajahan: 5, berbayar: 8, tidakDiatribusikan: 2 },
  { date: "20 Aug", penjelajahan: 5, berbayar: 9, tidakDiatribusikan: 2 },
  { date: "27 Aug", penjelajahan: 5, berbayar: 10, tidakDiatribusikan: 2 },
  { date: "29 Aug", penjelajahan: 1, berbayar: 2, tidakDiatribusikan: 1 }, // Incomplete day dip!
]

const chartDataPertahankan_90d = [
  { date: "1 Jun", penjelajahan: 65, berbayar: 70, tidakDiatribusikan: 55 },
  { date: "10 Jun", penjelajahan: 68, berbayar: 72, tidakDiatribusikan: 58 },
  { date: "20 Jun", penjelajahan: 70, berbayar: 75, tidakDiatribusikan: 60 },
  { date: "1 Jul", penjelajahan: 72, berbayar: 78, tidakDiatribusikan: 62 },
  { date: "10 Jul", penjelajahan: 75, berbayar: 80, tidakDiatribusikan: 64 },
  { date: "20 Jul", penjelajahan: 76, berbayar: 82, tidakDiatribusikan: 65 },
  { date: "1 Aug", penjelajahan: 78, berbayar: 84, tidakDiatribusikan: 67 },
  { date: "10 Aug", penjelajahan: 79, berbayar: 85, tidakDiatribusikan: 68 },
  { date: "20 Aug", penjelajahan: 80, berbayar: 86, tidakDiatribusikan: 69 },
  { date: "27 Aug", penjelajahan: 80, berbayar: 86, tidakDiatribusikan: 70 },
  { date: "29 Aug", penjelajahan: 78, berbayar: 82, tidakDiatribusikan: 68 },
]

// ============================================================
// 3. 6 BULAN TERAKHIR DATASETS (Maret - Agustus 2026)
// ============================================================
const chartDataJangkauan_6m = [
  { date: "Mar", penjelajahan: 0, berbayar: 0, tidakDiatribusikan: 0 },
  { date: "Apr", penjelajahan: 0, berbayar: 0, tidakDiatribusikan: 0 },
  { date: "Mei", penjelajahan: 0, berbayar: 0, tidakDiatribusikan: 0 },
  { date: "Jun", penjelajahan: 120, berbayar: 450, tidakDiatribusikan: 80 },
  { date: "Jul", penjelajahan: 350, berbayar: 980, tidakDiatribusikan: 210 },
  { date: "Agu", penjelajahan: 520, berbayar: 1410, tidakDiatribusikan: 290 },
]

const chartDataAkuisisi_6m = [
  { date: "Mar", penjelajahan: 0, berbayar: 0, tidakDiatribusikan: 0 },
  { date: "Apr", penjelajahan: 0, berbayar: 0, tidakDiatribusikan: 0 },
  { date: "Mei", penjelajahan: 0, berbayar: 0, tidakDiatribusikan: 0 },
  { date: "Jun", penjelajahan: 8, berbayar: 28, tidakDiatribusikan: 6 },
  { date: "Jul", penjelajahan: 24, berbayar: 81, tidakDiatribusikan: 16 },
  { date: "Agu", penjelajahan: 32, berbayar: 110, tidakDiatribusikan: 24 },
]

const chartDataAktifkan_6m = [
  { date: "Mar", penjelajahan: 0, berbayar: 0, tidakDiatribusikan: 0 },
  { date: "Apr", penjelajahan: 0, berbayar: 0, tidakDiatribusikan: 0 },
  { date: "Mei", penjelajahan: 0, berbayar: 0, tidakDiatribusikan: 0 },
  { date: "Jun", penjelajahan: 7, berbayar: 26, tidakDiatribusikan: 5 },
  { date: "Jul", penjelajahan: 22, berbayar: 78, tidakDiatribusikan: 15 },
  { date: "Agu", penjelajahan: 30, berbayar: 104, tidakDiatribusikan: 22 },
]

const chartDataInteraksi_6m = [
  { date: "Mar", penjelajahan: 0, berbayar: 0, tidakDiatribusikan: 0 },
  { date: "Apr", penjelajahan: 0, berbayar: 0, tidakDiatribusikan: 0 },
  { date: "Mei", penjelajahan: 0, berbayar: 0, tidakDiatribusikan: 0 },
  { date: "Jun", penjelajahan: 5, berbayar: 20, tidakDiatribusikan: 4 },
  { date: "Jul", penjelajahan: 18, berbayar: 65, tidakDiatribusikan: 12 },
  { date: "Agu", penjelajahan: 25, berbayar: 89, tidakDiatribusikan: 18 },
]

const chartDataPertahankan_6m = [
  { date: "Mar", penjelajahan: 0, berbayar: 0, tidakDiatribusikan: 0 },
  { date: "Apr", penjelajahan: 0, berbayar: 0, tidakDiatribusikan: 0 },
  { date: "Mei", penjelajahan: 0, berbayar: 0, tidakDiatribusikan: 0 },
  { date: "Jun", penjelajahan: 70, berbayar: 75, tidakDiatribusikan: 60 },
  { date: "Jul", penjelajahan: 76, berbayar: 82, tidakDiatribusikan: 66 },
  { date: "Agu", penjelajahan: 80, berbayar: 86, tidakDiatribusikan: 70 },
]

export default function UsersPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([])
  const [filtered, setFiltered] = useState<RegisteredUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  // Selected user for Pregnancy Detail Modal
  const [selectedUser, setSelectedUser] = useState<RegisteredUser | null>(null)

  // Independent Unsensor Toggles Map (Keyed by userId + fieldName e.g. "USR-100_name")
  const [unmaskedMap, setUnmaskedMap] = useState<Record<string, boolean>>({})

  const toggleUnmask = (id: string, field: "name" | "email" | "phone") => {
    const key = `${id}_${field}`
    setUnmaskedMap(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Active Play Console Tab state
  const [activeTab, setActiveTab] = useState<"jangkauan" | "akuisisi" | "aktifkan" | "interaksi" | "pertahankan">("jangkauan")

  // Interactive Play Console Header Dropdowns State
  const [metricBy, setMetricBy] = useState("Perangkat")
  const [metricByOpen, setMetricByOpen] = useState(false)

  // Play Console Timeframe selector state (Exact options per Play Console UI)
  const [playTimeframe, setPlayTimeframe] = useState("28 hari terakhir")
  const [playTimeframeOpen, setPlayTimeframeOpen] = useState(false)

  // Interactive Traffic Dimension Dropdown State
  const [selectedDimension, setSelectedDimension] = useState<string>("sumber_traffic")
  const [dimensionOpen, setDimensionOpen] = useState(false)

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

  const [selectedMonth, setSelectedMonth] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")

  useEffect(() => {
    let result = users

    // Filter Bulan
    if (selectedMonth !== "all") {
      const m = parseInt(selectedMonth) - 1
      result = result.filter(u => new Date(u.registeredAt).getMonth() === m)
    }

    // Filter Tahun
    if (selectedYear !== "all") {
      const y = parseInt(selectedYear)
      result = result.filter(u => new Date(u.registeredAt).getFullYear() === y)
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
  }, [users, search, selectedMonth, selectedYear])

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

  // Helper to resolve dynamic dataset based on activeTab AND selected playTimeframe
  const getChartData = () => {
    if (playTimeframe === "90 hari terakhir") {
      if (activeTab === "akuisisi") return chartDataAkuisisi_90d
      if (activeTab === "aktifkan") return chartDataAktifkan_90d
      if (activeTab === "interaksi") return chartDataInteraksi_90d
      if (activeTab === "pertahankan") return chartDataPertahankan_90d
      return chartDataJangkauan_90d
    }
    if (playTimeframe === "6 bulan terakhir") {
      if (activeTab === "akuisisi") return chartDataAkuisisi_6m
      if (activeTab === "aktifkan") return chartDataAktifkan_6m
      if (activeTab === "interaksi") return chartDataInteraksi_6m
      if (activeTab === "pertahankan") return chartDataPertahankan_6m
      return chartDataJangkauan_6m
    }
    // Default: 28 hari terakhir
    if (activeTab === "akuisisi") return chartDataAkuisisi_28d
    if (activeTab === "aktifkan") return chartDataAktifkan_28d
    if (activeTab === "interaksi") return chartDataInteraksi_28d
    if (activeTab === "pertahankan") return chartDataPertahankan_28d
    return chartDataJangkauan_28d
  }

  // Realistic metric tab values & positive growth percentages
  const tabConfigs = {
    jangkauan: {
      title: "Jangkauan",
      subtitle: "Tayangan perangkat",
      value: "1.840",
      change: "+14%",
      chartTitle: "Tayangan perangkat",
    },
    akuisisi: {
      title: "Akuisisi",
      subtitle: "Akuisisi perangkat",
      value: "253",
      change: "+22%",
      chartTitle: "Akuisisi perangkat",
    },
    aktifkan: {
      title: "Aktifkan",
      subtitle: "Perangkat tempat pertama dibuka",
      value: "241",
      change: "+18%",
      chartTitle: "Perangkat tempat pertama dibuka",
    },
    interaksi: {
      title: "Interaksi",
      subtitle: "Perangkat aktif bulanan",
      value: "198",
      change: "+25%",
      chartTitle: "Perangkat aktif harian",
    },
    pertahankan: {
      title: "Pertahankan",
      subtitle: "Retensi perangkat 7 hari",
      value: "78.2%",
      change: "Tinggi",
      chartTitle: "Retensi perangkat 7 hari",
    },
  }

  // Dimension option mappings for interactive breakdown cards
  const dimensionDataMap: Record<string, { label: string; breakdown: Array<{ name: string; val: string; change: string }> }> = {
    sumber_traffic: {
      label: "Sumber traffic",
      breakdown: [
        { name: "Penjelajahan Google Play", val: "76.5%", change: "+12%" },
        { name: "Berbayar dan langsung", val: "81.4%", change: "+29%" },
        { name: "Tidak diatribusikan", val: "68.2%", change: "-40%" },
      ]
    },
    negara: {
      label: "Negara/wilayah",
      breakdown: [
        { name: "DI Yogyakarta", val: "64.2%", change: "+35%" },
        { name: "Jawa Tengah", val: "22.5%", change: "+15%" },
        { name: "Jawa Timur & Lainnya", val: "13.3%", change: "+8%" },
      ]
    },
    versi_app: {
      label: "Versi aplikasi",
      breakdown: [
        { name: "v2.4.0 (Terbaru)", val: "84.1%", change: "+45%" },
        { name: "v2.3.1", val: "12.2%", change: "-10%" },
        { name: "v2.2.0 & Lama", val: "3.7%", change: "-20%" },
      ]
    },
    bahasa: {
      label: "Bahasa",
      breakdown: [
        { name: "Indonesian (id_ID)", val: "95.8%", change: "+20%" },
        { name: "English (en_US)", val: "3.5%", change: "+5%" },
        { name: "Lainnya", val: "0.7%", change: "0%" },
      ]
    },
    versi_android: {
      label: "Versi Android",
      breakdown: [
        { name: "Android 14 (API 34)", val: "48.2%", change: "+30%" },
        { name: "Android 13 (API 33)", val: "36.4%", change: "+12%" },
        { name: "Android 12 & Lama", val: "15.4%", change: "-8%" },
      ]
    }
  }

  const currentTab = tabConfigs[activeTab]
  const currentDimension = dimensionDataMap[selectedDimension] || dimensionDataMap["sumber_traffic"]
  const currentChartData = getChartData()

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Kembangkan basis pengguna</h1>
          <p className="text-sm text-muted-foreground">
            Performa Anda di Google Play Store & Manajemen Profil Kehamilan Pengguna Momsie.
          </p>
        </div>
      </div>

      {/* Google Play Console Section Container */}
      <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-100 bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-gray-900">Performa Anda di Google Play</h2>
            
            {/* INTERACTIVE TOP RIGHT DROPDOWNS */}
            <div className="flex items-center gap-3">
              {/* Dropdown 1: Metrik menurut */}
              <div className="relative">
                <button
                  onClick={() => { setMetricByOpen(!metricByOpen); setPlayTimeframeOpen(false); }}
                  className="text-xs text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-100 font-medium flex items-center gap-1 transition-colors"
                >
                  Metrik menurut: <strong>{metricBy}</strong> <ChevronDown className="size-3 text-blue-700" />
                </button>
                {metricByOpen && (
                  <div className="absolute top-full right-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-1 text-xs">
                    {["Perangkat", "Pengguna", "Akun Aktif"].map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setMetricBy(opt); setMetricByOpen(false); }}
                        className={`w-full text-left p-2 rounded-lg transition-colors ${metricBy === opt ? "bg-blue-50 text-blue-900 font-bold" : "hover:bg-gray-50 text-gray-700"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdown 2: Timeframe (Exact options from Google Play Console UI screenshot) */}
              <div className="relative">
                <button
                  onClick={() => { setPlayTimeframeOpen(!playTimeframeOpen); setMetricByOpen(false); }}
                  className="text-xs text-gray-800 bg-sky-100 hover:bg-sky-200 px-3.5 py-1.5 rounded-xl border border-sky-200 font-bold flex items-center gap-2 shadow-2xs transition-colors"
                >
                  <span>📅 {playTimeframe}</span> <ChevronDown className="size-3.5 text-sky-700" />
                </button>
                {playTimeframeOpen && (
                  <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 p-1 text-xs divide-y divide-gray-50">
                    {["28 hari terakhir", "90 hari terakhir", "6 bulan terakhir"].map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setPlayTimeframe(opt); setPlayTimeframeOpen(false); }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-colors ${playTimeframe === opt ? "bg-sky-50 text-sky-900 font-extrabold" : "hover:bg-gray-50 text-gray-700"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
                    <span className={`text-xs font-bold ${tab.change.startsWith("+") ? "text-emerald-600" : tab.change.startsWith("-") ? "text-red-500" : "text-emerald-600"}`}>
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
              {currentDimension.breakdown.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                  <p className="text-xs font-semibold text-gray-600">{item.name}</p>
                  <div className="flex items-baseline justify-between mt-1">
                    <p className="text-2xl font-black text-gray-900">{item.val}</p>
                    <span className={`text-xs font-bold ${item.change.startsWith("+") ? "text-emerald-600 font-bold" : item.change.startsWith("-") ? "text-red-500" : "text-gray-500"}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter Toolbar with Interactive Sumber Traffic Dropdown */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 relative">
                <span>{currentTab.chartTitle}</span>
                <span className="text-xs text-gray-500 font-normal">menurut</span>
                
                {/* INTERACTIVE DROPDOWN FOR SUMBER TRAFFIC / DIMENSION */}
                <div className="relative">
                  <button
                    onClick={() => setDimensionOpen(!dimensionOpen)}
                    className="px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-900 font-semibold rounded-lg text-xs border border-sky-200 flex items-center gap-1.5 transition-colors"
                  >
                    {currentDimension.label} <ChevronDown className="size-3 text-sky-700" />
                  </button>

                  {dimensionOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-1 divide-y divide-gray-100 text-xs">
                      {[
                        { key: "sumber_traffic", label: "Sumber traffic", desc: "Breakdown berdasarkan channel akuisisi" },
                        { key: "negara", label: "Negara/wilayah", desc: "Breakdown berdasarkan lokasi geografis" },
                        { key: "versi_app", label: "Versi aplikasi", desc: "Breakdown berdasarkan versi build APK" },
                        { key: "bahasa", label: "Bahasa", desc: "Breakdown berdasarkan bahasa perangkat" },
                        { key: "versi_android", label: "Versi Android", desc: "Breakdown berdasarkan OS Android" },
                      ].map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => { setSelectedDimension(opt.key); setDimensionOpen(false); }}
                          className={`w-full text-left p-2 rounded-lg transition-colors ${selectedDimension === opt.key ? "bg-sky-50 text-sky-900 font-bold" : "hover:bg-gray-50 text-gray-700"}`}
                        >
                          <p className="font-semibold">{opt.label}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-medium rounded-lg text-xs border border-emerald-200">
                  ✓ 3 pilihan aktif
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

            {/* Recharts Area Chart Dynamically Reacting to Active Tab, Timeframe & Dimension */}
            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
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
          </div>
        </CardContent>
      </Card>

      {/* Registered Users Table with Independent Eye Unsensor Buttons */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Daftar Pengguna Aplikasi Terdaftar ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground bg-muted/30">
                  <th className="text-left py-3 px-3 font-medium">ID User</th>
                  <th className="text-left py-3 px-3 font-medium">Nama Registrasi</th>
                  <th className="text-left py-3 px-3 font-medium">Email User</th>
                  <th className="text-left py-3 px-3 font-medium">No. HP</th>
                  <th className="text-left py-3 px-3 font-medium">Domisili</th>
                  <th className="text-left py-3 px-3 font-medium">Tanggal Registrasi</th>
                  <th className="text-right py-3 px-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 font-mono text-xs font-semibold text-gray-800">{u.id}</td>

                    {/* Nama with Eye Toggle */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900">
                          {unmaskedMap[`${u.id}_name`] ? u.name : maskInitialsName(u.name)}
                        </span>
                        <button
                          onClick={() => toggleUnmask(u.id, "name")}
                          className="p-0.5 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded transition-colors"
                          title={unmaskedMap[`${u.id}_name`] ? "Sembunyikan Nama" : "Tampilkan Nama Lengkap"}
                        >
                          {unmaskedMap[`${u.id}_name`] ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* Email with Eye Toggle */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-gray-600">
                          {unmaskedMap[`${u.id}_email`] ? u.email : maskEmail(u.email)}
                        </span>
                        <button
                          onClick={() => toggleUnmask(u.id, "email")}
                          className="p-0.5 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded transition-colors"
                          title={unmaskedMap[`${u.id}_email`] ? "Sembunyikan Email" : "Tampilkan Email Lengkap"}
                        >
                          {unmaskedMap[`${u.id}_email`] ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* Phone with Eye Toggle */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-gray-600">
                          {unmaskedMap[`${u.id}_phone`] ? u.phone : maskPhone(u.phone)}
                        </span>
                        <button
                          onClick={() => toggleUnmask(u.id, "phone")}
                          className="p-0.5 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded transition-colors"
                          title={unmaskedMap[`${u.id}_phone`] ? "Sembunyikan Phone" : "Tampilkan Phone Lengkap"}
                        >
                          {unmaskedMap[`${u.id}_phone`] ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-xs text-gray-600">{u.domisili}</td>
                    <td className="py-3 px-3 text-xs text-gray-600">{formatDate(u.registeredAt)}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <HeartPulse className="size-3.5" /> Detail Kehamilan & Survei
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-muted-foreground">
                      Tidak ada pengguna ditemukan untuk filter ini
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* PREGNANCY SURVEY DETAIL MODAL */}
      {selectedUser && selectedUser.pregnancyProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4" onClick={() => setSelectedUser(null)}>
          <div className="relative max-w-xl w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-black text-lg">
                  {selectedUser.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedUser.name}</h2>
                  <p className="text-xs text-muted-foreground font-mono">ID User: #{selectedUser.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
                <X className="size-5" />
              </button>
            </div>

            {/* User Contacts Info */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-pink-50/50 p-3 rounded-xl border border-pink-100">
              <div>
                <p className="text-gray-500 font-semibold flex items-center gap-1"><Mail className="size-3 text-pink-500" /> Email:</p>
                <p className="font-mono font-bold text-gray-800 truncate">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold flex items-center gap-1"><Phone className="size-3 text-pink-500" /> Telepon:</p>
                <p className="font-mono font-bold text-gray-800">{selectedUser.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 font-semibold flex items-center gap-1"><MapPin className="size-3 text-pink-500" /> Domisili:</p>
                <p className="font-bold text-gray-800">{selectedUser.domisili}</p>
              </div>
            </div>

            {/* Survey Answers List */}
            <div className="space-y-3 pt-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-pink-600 border-b pb-1">
                Data Kehamilan & Survei User
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border">
                  <p className="text-gray-500">Usia:</p>
                  <p className="font-bold text-gray-900">{selectedUser.pregnancyProfile.usiaRange}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border">
                  <p className="text-gray-500">Fase Kehamilan:</p>
                  <p className="font-bold text-gray-900">{selectedUser.pregnancyProfile.faseKehamilan}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border">
                  <p className="text-gray-500">Kehamilan Pertama:</p>
                  <p className="font-bold text-gray-900">{selectedUser.pregnancyProfile.kehamilanPertama}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border">
                  <p className="text-gray-500">Tgl Registrasi App:</p>
                  <p className="font-bold text-gray-900">{formatDate(selectedUser.registeredAt)}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
