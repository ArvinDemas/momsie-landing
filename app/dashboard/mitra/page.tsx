"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, CheckCircle, XCircle, Eye } from "lucide-react"
import Image from "next/image"
import { doc, updateDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { fetchSubmissions as fetchSubmissionsService, type Submission } from "@/lib/dashboard-service"

interface MitraSubmission {
  id: string
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
  const [viewingDoc, setViewingDoc] = useState<{ url: string; label: string } | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      const data = await fetchSubmissionsService()
      console.log("[Mitra] fetched:", data.length, "submissions")
      setSubmissions(data)
      setFiltered(data)
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
        s.userId.toLowerCase().includes(q) ||
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
      const subSnap = await getDoc(subRef)
      const subData = subSnap.data()

      // Update submission
      await updateDoc(subRef, {
        status: "approved",
        reviewedAt: new Date().toISOString(),
      })

      // Update mitra doc
      if (subData?.userId) {
        const mitraRef = doc(db, "mitra", subData.userId)
        await updateDoc(mitraRef, {
          role: subData?.role || "doula",
          nik: subData?.nik,
          nohp: subData?.nohp,
          kotaProvinsi: subData?.kotaProvinsi,
          sopApprovedAt: new Date().toISOString(),
        })
      }

      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: "approved" } : s))
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Panel Mitra</h1>
          <p className="text-sm text-muted-foreground">Kelola pendaftaran mitra baru (SOP)</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total: <span className="font-semibold text-foreground">{submissions.length}</span>
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
                placeholder="Cari nama, NIK, atau email..."
                className="w-full h-9 rounded-md border border-input bg-background px-3 pl-9 py-1 text-sm"
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
                      ? "bg-pink-500 text-white"
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

      {/* Cards */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Tidak ada data mitra{search || statusFilter !== "all" ? " dengan filter ini" : ""}.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map(sub => (
            <MitraCard
              key={sub.id}
              sub={sub}
              viewingDoc={viewingDoc}
              onViewDoc={(url, label) => setViewingDoc({ url, label })}
              onApprove={handleApprove}
              onReject={() => { setRejectId(sub.id); setRejectReason(sub.rejectionReason || "") }}
              onCancelReject={() => { setRejectId(null); setRejectReason("") }}
              onSubmitReject={handleReject}
              processing={processing === sub.id}
              isRejecting={rejectId === sub.id}
              rejectReason={rejectId === sub.id ? rejectReason : ""}
              setRejectReason={setRejectReason}
            />
          ))}
        </div>
      )}

      {/* Image Dialog */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setViewingDoc(null)}>
          <div className="relative max-w-2xl w-full bg-background rounded-2xl p-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold">{viewingDoc.label}</p>
              <button onClick={() => setViewingDoc(null)} className="p-1 rounded-lg hover:bg-muted">
                <XCircle className="size-5" />
              </button>
            </div>
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-muted">
              <Image
                src={viewingDoc.url}
                alt={viewingDoc.label}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MitraCard({
  sub,
  viewingDoc,
  onViewDoc,
  onApprove,
  onReject,
  onCancelReject,
  onSubmitReject,
  processing,
  isRejecting,
  rejectReason,
  setRejectReason,
}: {
  sub: MitraSubmission
  viewingDoc: { url: string; label: string } | null
  onViewDoc: (url: string, label: string) => void
  onApprove: (id: string) => void
  onReject: () => void
  onCancelReject: () => void
  onSubmitReject: () => void
  processing: boolean
  isRejecting: boolean
  rejectReason: string
  setRejectReason: (v: string | ((prev: string) => string)) => void
}) {
  const statusBadge = (s: string) => {
    if (s === "approved") return <Badge variant="success">Disetujui</Badge>
    if (s === "rejected") return <Badge variant="destructive">Ditolak</Badge>
    return <Badge>Pending</Badge>
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Top Row */}
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-lg shrink-0">
              {sub.userName?.[0]?.toUpperCase() || "M"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-base truncate">{sub.userName}</p>
                {statusBadge(sub.status)}
              </div>
              <p className="text-sm text-muted-foreground truncate">{sub.userEmail}</p>
              <p className="text-xs text-muted-foreground mt-1">
                ID: <span className="font-mono">{sub.userId}</span>
              </p>
            </div>
            <div className="text-right text-xs text-muted-foreground shrink-0">
              <p>Diajukan</p>
              <p className="font-medium text-foreground">
                {sub.submittedAt
                  ? new Date(sub.submittedAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
                  : "-"}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <DetailItem label="NIK" value={sub.nik} />
            <DetailItem label="No HP" value={sub.nohp} />
            <DetailItem label="Role" value={sub.role} />
            <DetailItem label="Kota/Provinsi" value={sub.kotaProvinsi} />
          </div>

          {/* Documents */}
          <div className="flex flex-wrap gap-2">
            {sub.ktpUrl && (
              <button
                onClick={() => onViewDoc(sub.ktpUrl!, "KTP")}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  viewingDoc?.url === sub.ktpUrl
                    ? "ring-2 ring-pink-500 bg-pink-50"
                    : "hover:bg-muted"
                }`}
              >
                <Eye className="size-3.5 inline mr-1.5 -mt-0.5" /> Lihat KTP
              </button>
            )}
            {sub.sertifikatUrl && (
              <button
                onClick={() => onViewDoc(sub.sertifikatUrl!, "Sertifikat")}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  viewingDoc?.url === sub.sertifikatUrl
                    ? "ring-2 ring-pink-500 bg-pink-50"
                    : "hover:bg-muted"
                }`}
              >
                <Eye className="size-3.5 inline mr-1.5 -mt-0.5" /> Lihat Sertifikat
              </button>
            )}
          </div>

          {/* Rejection Reason */}
          {sub.status === "rejected" && sub.rejectionReason && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              <span className="font-semibold">Alasan Penolakan:</span> {sub.rejectionReason}
            </div>
          )}

          {/* Action Buttons */}
          {sub.status === "pending" && (
            <div className="flex gap-2 pt-2 border-t">
              <button
                onClick={() => onApprove(sub.id)}
                disabled={processing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {processing ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle className="size-3.5" />}
                Approve
              </button>
              <button
                onClick={onReject}
                disabled={processing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <XCircle className="size-3.5" /> Tolak
              </button>
            </div>
          )}

          {/* Reject Form */}
          {isRejecting && sub.status === "pending" && (
            <div className="flex flex-col gap-2 pt-2 border-t">
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Alasan penolakan (opsional)..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
              />
              <div className="flex gap-2">
                <button
                  onClick={onSubmitReject}
                  disabled={!rejectReason.trim() || processing}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Konfirmasi Tolak
                </button>
                <button
                  onClick={onCancelReject}
                  className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-sm">{value || "-"}</p>
    </div>
  )
}
