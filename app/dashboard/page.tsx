"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, HeartPulse, CheckCircle2, Gift } from "lucide-react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts"

const areaData = [
  { month: "Okt", users: 100 },
  { month: "Nov", users: 150 },
  { month: "Des", users: 280 },
  { month: "Jan", users: 350 },
  { month: "Feb", users: 420 },
  { month: "Mar", users: 524 },
]

const pieData = [
  { name: "Ibu Hamil", value: 85, color: "#db2777" }, // Pink Tua
  { name: "Mitra Doula/Nakes", value: 15, color: "#fbcfe8" }, // Pink Muda
]

const barData = [
  { name: "Doula Booking", sessions: 420 },
  { name: "Yoga Gamification", sessions: 280 },
  { name: "Pregnancy Diary", sessions: 150 },
]

export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col gap-4 pb-4">
      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-4 gap-4 h-[120px] shrink-0">
        <Card className="flex flex-col justify-center">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-medium text-muted-foreground text-balance">Total Active Users</CardTitle>
            <Users className="size-4 text-primary" />
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="text-2xl font-bold tabular-nums">524 Users</div>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <Badge variant="success" className="text-[10px] px-1.5">+12%</Badge>
              <span className="text-muted-foreground text-pretty">dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col justify-center">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-medium text-muted-foreground text-balance">Total Doula Partners</CardTitle>
            <HeartPulse className="size-4 text-primary" />
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="text-2xl font-bold tabular-nums">45 Mitra</div>
            <div className="mt-1 text-xs text-muted-foreground text-pretty">
              tersertifikasi aktif
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col justify-center">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-medium text-muted-foreground text-balance">Total Bookings</CardTitle>
            <CheckCircle2 className="size-4 text-primary" />
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="text-2xl font-bold tabular-nums">312 Layanan</div>
            <div className="mt-1 text-xs text-muted-foreground text-pretty">
              berhasil diselesaikan
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col justify-center">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-medium text-muted-foreground text-balance">Free-Trial Users</CardTitle>
            <Gift className="size-4 text-primary" />
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="text-2xl font-bold tabular-nums">180 Users</div>
            <div className="mt-1 text-xs text-muted-foreground text-pretty">
              fase eksplorasi aplikasi
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart Section */}
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="px-6 py-4 shrink-0 border-b">
          <CardTitle className="text-base text-balance">User Growth (Beta Launch - Q1 2026)</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-6 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#db2777" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#db2777" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
              <YAxis domain={[0, 600]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', style: { fontVariantNumeric: 'tabular-nums' } }} dx={-10} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#111827', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="users" stroke="#db2777" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-2 gap-4 h-[240px] shrink-0">
        <Card className="flex flex-col min-h-0">
          <CardHeader className="px-5 py-3 shrink-0 border-b flex justify-center">
            <CardTitle className="text-sm font-semibold text-balance">Demografi Pengguna</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 flex items-center justify-center min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 4px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                  formatter={(value: number) => `${value}%`}
                />
                <Legend verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col min-h-0">
          <CardHeader className="px-5 py-3 shrink-0 border-b flex justify-center">
            <CardTitle className="text-sm font-semibold text-balance">Fitur Paling Sering Diakses</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 flex items-center justify-center min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', style: { fontVariantNumeric: 'tabular-nums' } }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#111827', fontWeight: 500 }} dx={-10} />
                <RechartsTooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 4px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sessions" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
