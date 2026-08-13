"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Newspaper, Eye, EyeOff, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  author: "Admin Momsie",
}

export default function NewsManagerPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)

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
    setForm({ ...EMPTY_FORM })
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
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.summary.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await updateNews(editingId, form)
      } else {
        await createNews(form)
      }
      setShowForm(false)
      setForm({ ...EMPTY_FORM })
      await fetchNews()
    } finally {
      setSaving(false)
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
          <p className="text-sm text-muted-foreground mt-1">Kelola berita, press release, dan liputan media Momsie.</p>
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
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-12 px-4 pb-8 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {editingId ? "Edit Berita" : "Tambah Berita Baru"}
            </h2>

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
                    placeholder="Merapi Uncover, Momsie Official..."
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

              {/* Cover URL */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">URL Gambar Cover</label>
                <input
                  value={form.coverUrl}
                  onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                  placeholder="https://... (paste URL gambar)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Ringkasan Berita * <span className="text-slate-400 font-normal">(ditampilkan di kartu)</span></label>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Ringkasan 2-3 kalimat berita..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>

              {/* Content */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Isi Berita Lengkap <span className="text-slate-400 font-normal">(opsional jika ada link sumber)</span></label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Tulis isi berita lengkap di sini..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim() || !form.summary.trim()}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Publikasikan Berita"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
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
            <div className="p-8 text-center text-slate-400 animate-pulse">Memuat berita...</div>
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
                    <p className="text-xs text-slate-400 mt-0.5">{item.publisher} · {formatDate(item.publishedAt)}</p>
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
