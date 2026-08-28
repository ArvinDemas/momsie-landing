"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, CheckCircle, XCircle, Eye, UserCheck, MapPin, FileText, Phone, Mail, CreditCard, ShieldCheck, X } from "lucide-react"
import Image from "next/image"
import { doc, updateDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { fetchSubmissions as fetchSubmissionsService, type Submission, maskPhone, maskEmail } from "@/lib/dashboard-service"

interface MitraSubmission {
  id: string
  numericId: string
  userId: string
  userEmail: string
  userName: string
  nik: string
  nohp: string
  kotaProvinsi: string
  role: string
  status: string
  rejectionReason?: string
  submittedAt?: string
  ktpUrl?: string
  sertifikatUrl?: string
}

export default function MitraPage() {
  const [submissions, setSubmissions] = useState<MitraSubmission[]>([])
  const [filtered, setFiltered] = useState<MitraSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // Detail Modal state
  const [selectedMitra, setSelectedMitra] = useState<MitraSubmission | null>(null)
  const [viewingDoc, setViewingDoc] = useState<{ url: string; label: string } | null>(null)

  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const data = await fetchSubmissionsService()
      const formatted: MitraSubmission[] = data.map((s, idx) => ({
        ...s,
        numericId: String(1001 + idx),
      }))
      setSubmissions(formatted)
      setFiltered(formatted)
    } catch (err) {
      console.error("Failed to fetch submissions:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  useEffect(() => {
    let result = submissions
    if (statusFilter !== "all") result = result.filter(s => s.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        s.userName.toLowerCase().includes(q) ||
        s.numericId.includes(q) ||
        s.nik.includes(q) ||
        s.userEmail.toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [submissions, search, statusFilter])

  const handleApprove = async (id: string) => {
    setProcessing(id)
    try {
      const subRef = doc(db, "sop_submissions", id)
      await updateDoc(subRef, {
        status: "approved",
        reviewedAt: new Date().toISOString(),
      })

      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: "approved" } : s))
      if (selectedMitra?.id === id) {
        setSelectedMitra(prev => prev ? { ...prev, status: "approved" } : null)
      }
    } catch (err) {
      console.error("Failed to approve:", err)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async () => {
    if (!rejectId || !rejectReason.trim()) return
    setProcessing(rejectId)
    try {
      const subRef = doc(db, "sop_submissions", rejectId)
      await updateDoc(subRef, {
        status: "rejected",
        reviewedAt: new Date().toISOString(),
        rejectionReason: rejectReason.trim(),
      })

      setSubmissions(prev => prev.map(s => s.id === rejectId ? { ...s, status: "rejected", rejectionReason: rejectReason.trim() } : s))
      if (selectedMitra?.id === rejectId) {
        setSelectedMitra(prev => prev ? { ...prev, status: "rejected", rejectionReason: rejectReason.trim() } : null)
      }
      setRejectId(null)
      setRejectReason("")
    } catch (err) {
      console.error("Failed to reject:", err)
    } finally {
      setProcessing(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="size-8 animate-spin text-pink-500" />
    </div>
  )

  const statusBadge = (s: string) => {
    if (s === "approved") return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold">Disetujui</Badge>
    if (s === "rejected") return <Badge className="bg-red-100 text-red-800 border-red-200 font-semibold">Ditolak</Badge>
    return <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-semibold">Pending</Badge>
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Panel Mitra Doula</h1>
          <p className="text-sm text-muted-foreground">Kelola pendaftaran mitra baru (SOP Verification)</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total Mitra: <span className="font-bold text-gray-900">{submissions.length}</span>
        </div>
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
                placeholder="Cari ID Angka atau Nama Mitra..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-pink-400 outline-none"
              />
            </div>
            <div className="flex gap-2">
              {[
                { key: "all", label: "Semua" },
                { key: "pending", label: "Pending" },
                { key: "approved", label: "Disetujui" },
                { key: "rejected", label: "Ditolak" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === key
                      ? "bg-pink-500 text-white font-semibold"
                      : "bg-card border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clean Mitra List (Shows ONLY ID Angka, Nama Mitra, Role, Status & Tombol Detail) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Daftar Registrasi Mitra ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground bg-muted/30">
                  <th className="text-left py-3 px-3 font-medium">ID Mitra</th>
                  <th className="text-left py-3 px-3 font-medium">Nama Mitra</th>
                  <th className="text-left py-3 px-3 font-medium">Role</th>
                  <th className="text-left py-3 px-3 font-medium">Tgl Pengajuan</th>
                  <th className="text-left py-3 px-3 font-medium">Status</th>
                  <th className="text-right py-3 px-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(sub => (
                  <tr key={sub.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-gray-800 text-xs">{sub.numericId}</td>
                    <td className="py-3 px-3 font-bold text-gray-900">{sub.userName}</td>
                    <td className="py-3 px-3 text-xs text-gray-700 font-medium capitalize">{sub.role || "Doula Care"}</td>
                    <td className="py-3 px-3 text-xs text-gray-600">
                      {sub.submittedAt
                        ? new Date(sub.submittedAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
                        : "-"}
                    </td>
                    <td className="py-3 px-3">{statusBadge(sub.status)}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedMitra(sub)}
                        className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white font-medium text-xs rounded-lg transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <Eye className="size-3.5" /> Detail Mitra
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                      Tidak ada data pendaftaran mitra ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* DETAIL MODAL (Displays NIK, Contact, Location, Documents, & Approval Controls) */}
      {selectedMitra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4" onClick={() => setSelectedMitra(null)}>
          <div className="relative max-w-xl w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-extrabold text-base">
                  {selectedMitra.userName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedMitra.userName}</h2>
                  <p className="text-xs text-muted-foreground font-mono">ID Mitra: #{selectedMitra.numericId}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMitra(null)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Content Details */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-xl bg-gray-50 border">
                  <p className="text-xs text-gray-500 font-semibold uppercase flex items-center gap-1 mb-1">
                    <CreditCard className="size-3.5 text-pink-500" /> NIK KTP
                  </p>
                  <p className="font-mono font-bold text-gray-900">{selectedMitra.nik || "-"}</p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border">
                  <p className="text-xs text-gray-500 font-semibold uppercase flex items-center gap-1 mb-1">
                    <ShieldCheck className="size-3.5 text-pink-500" /> Role Mitra
                  </p>
                  <p className="font-bold text-gray-900 capitalize">{selectedMitra.role || "Doula"}</p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border">
                  <p className="text-xs text-gray-500 font-semibold uppercase flex items-center gap-1 mb-1">
                    <Phone className="size-3.5 text-pink-500" /> No. Telepon
                  </p>
                  <p className="font-mono font-bold text-gray-900">{maskPhone(selectedMitra.nohp)}</p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border">
                  <p className="text-xs text-gray-500 font-semibold uppercase flex items-center gap-1 mb-1">
                    <Mail className="size-3.5 text-pink-500" /> Email Registrasi
                  </p>
                  <p className="font-mono text-xs font-bold text-gray-900 truncate">{maskEmail(selectedMitra.userEmail)}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border">
                <p className="text-xs text-gray-500 font-semibold uppercase flex items-center gap-1 mb-1">
                  <MapPin className="size-3.5 text-pink-500" /> Kota / Domisili Operasional
                </p>
                <p className="font-bold text-gray-900">{selectedMitra.kotaProvinsi || "DI Yogyakarta"}</p>
              </div>

              {/* Documents Buttons */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-gray-700 mb-2">Dokumen Pendukung (KTP & Sertifikat):</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMitra.ktpUrl && (
                    <button
                      onClick={() => setViewingDoc({ url: selectedMitra.ktpUrl!, label: `KTP - ${selectedMitra.userName}` })}
                      className="px-3.5 py-2 rounded-lg text-xs font-medium border bg-white hover:bg-pink-50 hover:border-pink-200 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="size-4 text-pink-500" /> Lihat Dokumen KTP
                    </button>
                  )}
                  {selectedMitra.sertifikatUrl && (
                    <button
                      onClick={() => setViewingDoc({ url: selectedMitra.sertifikatUrl!, label: `Sertifikat - ${selectedMitra.userName}` })}
                      className="px-3.5 py-2 rounded-lg text-xs font-medium border bg-white hover:bg-pink-50 hover:border-pink-200 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="size-4 text-pink-500" /> Lihat Sertifikat Pelatihan
                    </button>
                  )}
                </div>
              </div>

              {/* Rejection Reason display */}
              {selectedMitra.status === "rejected" && selectedMitra.rejectionReason && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                  <span className="font-bold">Alasan Penolakan:</span> {selectedMitra.rejectionReason}
                </div>
              )}

              {/* Reject Input */}
              {rejectId === selectedMitra.id && (
                <div className="space-y-2 pt-2 border-t">
                  <textarea
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="Tuliskan alasan penolakan..."
                    className="w-full rounded-lg border p-2.5 text-xs outline-none focus:ring-2 focus:ring-red-400"
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setRejectId(null)} className="px-3 py-1.5 rounded-lg border text-xs font-medium">Batal</button>
                    <button onClick={handleReject} disabled={!rejectReason.trim()} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold disabled:opacity-50">Tolak Mitra</button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            {selectedMitra.status === "pending" && rejectId !== selectedMitra.id && (
              <div className="flex gap-2 pt-3 border-t justify-end">
                <button
                  onClick={() => setRejectId(selectedMitra.id)}
                  className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition-colors"
                >
                  Tolak Mitra
                </button>
                <button
                  onClick={() => handleApprove(selectedMitra.id)}
                  disabled={processing === selectedMitra.id}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5"
                >
                  {processing === selectedMitra.id ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle className="size-3.5" />}
                  Setujui Mitra (Approve)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setViewingDoc(null)}>
          <div className="relative max-w-2xl w-full bg-white rounded-2xl p-4 shadow-2xl space-y-3" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b pb-2">
              <p className="font-bold text-sm">{viewingDoc.label}</p>
              <button onClick={() => setViewingDoc(null)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="size-5" />
              </button>
            </div>
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-100">
              <Image src={viewingDoc.url} alt={viewingDoc.label} fill className="object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
