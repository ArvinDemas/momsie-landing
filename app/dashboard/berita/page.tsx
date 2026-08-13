"use client"

import { useEffect, useState, useRef } from "react"
import { Plus, Pencil, Trash2, Newspaper, Eye, EyeOff, ExternalLink, Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  NewsItem,
  NewsCategory,
  NewsStatus,
} from "@/lib/news-service"
import { Timestamp } from "firebase/firestore"

const CATEGORIES: NewsCategory[] = ["Liputan Media", "Press Release", "Pengumuman", "Update Produk"]

const categoryColors: Record<string, string> = {
  "Liputan Media": "bg-blue-100 text-blue-700",
  "Press Release": "bg-pink-100 text-pink-700",
  "Pengumuman": "bg-amber-100 text-amber-700",
  "Update Produk": "bg-purple-100 text-purple-700",
}

function formatDate(ts: Timestamp | null): string {
  if (!ts) return "-"
  return ts.toDate().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

const EMPTY_FORM = {
  title: "",
  category: "Liputan Media" as NewsCategory,
  publisher: "",
  externalUrl: "",
  coverUrl: "",
  summary: "",
  content: "",
  status: "draft" as NewsStatus,
  author: "",
}

export default function NewsManagerPage() {
  const { user } = useAuth()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchNews = async () => {
    setLoading(true)
    try {
      const data = await getAllNews()
      setNews(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const openAdd = () => {
    setEditingId(null)
    setForm({
      ...EMPTY_FORM,
      author: user?.displayName || user?.email || "Admin Momsie",
    })
    setImageFile(null)
    setImagePreview("")
    setShowForm(true)
  }

  const openEdit = (item: NewsItem) => {
    setEditingId(item.id!)
    setForm({
      title: item.title,
      category: item.category,
      publisher: item.publisher,
      externalUrl: item.externalUrl,
      coverUrl: item.coverUrl,
      summary: item.summary,
      content: item.content,
      status: item.status,
      author: item.author,
    })
    setImageFile(null)
    setImagePreview(item.coverUrl || "")
    setShowForm(true)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar (PNG, JPG, WebP)")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB")
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const storageRef = ref(storage, `news-covers/${timestamp}_${safeName}`)
    
    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          setUploadProgress(progress)
        },
        reject,
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref)
          resolve(url)
        }
      )
    })
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.summary.trim()) return
    setSaving(true)
    try {
      let finalCoverUrl = form.coverUrl

      // Upload gambar jika ada file baru dipilih
      if (imageFile) {
        setUploading(true)
        setUploadProgress(0)
        finalCoverUrl = await uploadImageToStorage(imageFile)
        setUploading(false)
      }

      const authorName = user?.displayName || user?.email || "Admin Momsie"
      const data = { ...form, coverUrl: finalCoverUrl, author: authorName }

      if (editingId) {
        await updateNews(editingId, data)
      } else {
        await createNews(data)
      }
      setShowForm(false)
      setForm({ ...EMPTY_FORM })
      setImageFile(null)
      setImagePreview("")
      await fetchNews()
    } catch (err) {
      console.error(err)
      alert("Gagal menyimpan berita. Coba lagi.")
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return
    await deleteNews(id)
    await fetchNews()
  }

  const handleToggleStatus = async (item: NewsItem) => {
    const newStatus: NewsStatus = item.status === "published" ? "draft" : "published"
    await updateNews(item.id!, { status: newStatus })
    await fetchNews()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Berita</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola berita, press release, dan liputan media Momsie.
            {user && (
              <span className="ml-1 text-blue-600 font-medium">
                Login sebagai: {user.displayName || user.email}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="size-4" />
          Tambah Berita
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-8 px-4 pb-8 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 my-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "Edit Berita" : "Tambah Berita Baru"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Judul Berita *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Masukkan judul berita..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as NewsCategory })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 bg-white"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as NewsStatus })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 bg-white"
                  >
                    <option value="draft">Draft (Belum Dipublikasikan)</option>
                    <option value="published">Published (Publik)</option>
                  </select>
                </div>
              </div>

              {/* Publisher & External URL */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Penerbit / Media</label>
                  <input
                    value={form.publisher}
                    onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                    placeholder="Contoh: Kompas, Momsie Official..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Link Sumber Asli (Opsional)</label>
                  <input
                    value={form.externalUrl}
                    onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                  Foto Cover Berita
                </label>
                
                {/* Preview */}
                {imagePreview && (
                  <div className="relative mb-3 rounded-2xl overflow-hidden border border-slate-200 h-40">
                    <img
                      src={imagePreview}
                      alt="Preview cover"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null)
                        setImagePreview("")
                        setForm({ ...form, coverUrl: "" })
                        if (fileInputRef.current) fileInputRef.current.value = ""
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow text-slate-600 hover:text-red-500 transition-colors"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                )}

                {/* Upload Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <ImageIcon className="size-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">
                    <span className="text-blue-600 font-semibold">Klik untuk upload</span> atau drag & drop
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, WebP — maks. 5MB</p>
                </div>

                {/* Progress bar */}
                {uploading && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Mengupload gambar...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-200 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                  Ringkasan Berita *{" "}
                  <span className="text-slate-400 font-normal">(ditampilkan di kartu berita)</span>
                </label>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Tulis ringkasan 2-3 kalimat..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>

              {/* Content */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                  Isi Berita Lengkap{" "}
                  <span className="text-slate-400 font-normal">(opsional jika ada link sumber)</span>
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Tulis isi berita lengkap di sini..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>

              {/* Author info */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl">
                <div className="size-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
                  {(user?.displayName || user?.email || "A")[0].toUpperCase()}
                </div>
                <p className="text-xs text-slate-500">
                  Dipublikasikan oleh{" "}
                  <span className="font-semibold text-slate-700">
                    {user?.displayName || user?.email || "Admin"}
                  </span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || uploading || !form.title.trim() || !form.summary.trim()}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {(saving || uploading) && <Loader2 className="size-4 animate-spin" />}
                {uploading ? "Mengupload gambar..." : saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Publikasikan Berita"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                disabled={saving || uploading}
                className="px-6 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* News Table */}
      <Card>
        <CardHeader className="px-6 py-4 border-b">
          <CardTitle className="text-base">Daftar Berita ({news.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="size-5 animate-spin" />
              Memuat berita...
            </div>
          ) : news.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Newspaper className="size-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada berita. Klik "Tambah Berita" untuk memulai.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {news.map((item) => (
                <div key={item.id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
                  {/* Cover */}
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    {item.coverUrl ? (
                      <img src={item.coverUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Newspaper className="size-5 text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[item.category] ?? "bg-slate-100 text-slate-500"}`}>
                        {item.category}
                      </span>
                      <Badge variant={item.status === "published" ? "success" : "secondary"} className="text-[10px]">
                        {item.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="font-semibold text-sm text-slate-900 line-clamp-1">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.publisher} · {formatDate(item.publishedAt)}
                      {item.author && (
                        <span className="ml-1 text-slate-400">
                          · oleh <span className="font-medium text-slate-600">{item.author}</span>
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {item.externalUrl && (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Buka sumber"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleToggleStatus(item)}
                      className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      title={item.status === "published" ? "Jadikan Draft" : "Publikasikan"}
                    >
                      {item.status === "published" ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id!)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
