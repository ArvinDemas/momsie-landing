"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Users, Smartphone, UserCheck, CheckCircle2 } from "lucide-react"
import { fetchRegisteredUsers, type RegisteredUser } from "@/lib/dashboard-service"

export default function UsersPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([])
  const [filtered, setFiltered] = useState<RegisteredUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [orderFilter, setOrderFilter] = useState("all")

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
    if (orderFilter === "transacting") {
      result = result.filter(u => u.totalOrders > 0)
    } else if (orderFilter === "non_transacting") {
      result = result.filter(u => u.totalOrders === 0)
    }

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
  }, [users, search, orderFilter])

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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Pengguna Aplikasi</h1>
          <p className="text-sm text-muted-foreground">
            Daftar lengkap pengguna yang terdaftar di aplikasi mobile Momsie (Total <span className="font-semibold text-pink-600">253 User</span>)
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total User App</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">{users.length} User</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Terdaftar di Aplikasi</p>
              </div>
              <div className="p-3 rounded-xl bg-pink-100 text-pink-700">
                <Smartphone className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">User Bertransaksi</p>
                <p className="text-2xl font-extrabold text-blue-900 mt-1">{transactingCount} User</p>
                <p className="text-[11px] text-blue-600 mt-0.5">Pernah Melakukan Order</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
                <UserCheck className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">User Belum Transaksi</p>
                <p className="text-2xl font-extrabold text-gray-700 mt-1">{users.length - transactingCount} User</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Registrasi Akun Only</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-100 text-gray-700">
                <Users className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Akun</p>
                <p className="text-2xl font-extrabold text-emerald-900 mt-1">100% Aktif</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">Akun Terverifikasi</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari ID, Nama, Email, Domisili..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>
            
            <select
              value={orderFilter}
              onChange={e => setOrderFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border text-sm bg-white font-medium"
            >
              <option value="all">Semua User ({users.length})</option>
              <option value="transacting">User Bertransaksi ({transactingCount})</option>
              <option value="non_transacting">User Belum Transaksi ({users.length - transactingCount})</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Daftar Pengguna ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground bg-muted/30">
                  <th className="text-left py-3 px-2 font-medium">ID User</th>
                  <th className="text-left py-3 px-2 font-medium">Nama Pengguna</th>
                  <th className="text-left py-3 px-2 font-medium">Email</th>
                  <th className="text-left py-3 px-2 font-medium">No. Telepon</th>
                  <th className="text-left py-3 px-2 font-medium">Domisili</th>
                  <th className="text-left py-3 px-2 font-medium">Tgl Daftar</th>
                  <th className="text-left py-3 px-2 font-medium">Total Order</th>
                  <th className="text-left py-3 px-2 font-medium">Total Spend</th>
                  <th className="text-left py-3 px-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2 font-mono text-xs font-semibold text-gray-700">{u.id}</td>
                    <td className="py-3 px-2 font-semibold text-gray-900">{u.name}</td>
                    <td className="py-3 px-2 text-xs text-gray-600">{u.email}</td>
                    <td className="py-3 px-2 text-xs text-gray-600">{u.phone}</td>
                    <td className="py-3 px-2 text-xs text-gray-700">{u.domisili}</td>
                    <td className="py-3 px-2 text-xs text-gray-600">{formatDate(u.registeredAt)}</td>
                    <td className="py-3 px-2">
                      {u.totalOrders > 0 ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold text-xs">
                          {u.totalOrders} Order
                        </Badge>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">0 Order</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-xs font-semibold text-gray-900">
                      {u.totalSpend > 0 ? formatRp(u.totalSpend) : "-"}
                    </td>
                    <td className="py-3 px-2">
                      <Badge className="bg-emerald-100 text-emerald-700 font-semibold text-xs border-emerald-200">
                        AKTIF
                      </Badge>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-muted-foreground">
                      Tidak ada pengguna ditemukan
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
