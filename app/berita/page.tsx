"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Newspaper, ArrowRight, ExternalLink, Calendar, Search, Tag } from "lucide-react"
import { getPublishedNews, NewsItem } from "@/lib/news-service"
import { Timestamp } from "firebase/firestore"
import AnimatedBackground from "@/components/landing/animated-background"
import Header from "@/components/landing/header"

const ALL_CATEGORIES = ["Semua", "Liputan Media", "Press Release", "Pengumuman", "Update Produk"]

const categoryColors: Record<string, string> = {
  "Liputan Media": "bg-blue-100 text-blue-700",
  "Press Release": "bg-pink-100 text-pink-700",
  "Pengumuman": "bg-amber-100 text-amber-700",
  "Update Produk": "bg-purple-100 text-purple-700",
}

function formatDate(ts: Timestamp | null): string {
  if (!ts) return ""
  return ts.toDate().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function BeritaPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("Semua")

  useEffect(() => {
    getPublishedNews(50)
      .then(setNews)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = news.filter((item) => {
    const matchCat = activeCategory === "Semua" || item.category === activeCategory
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-pink-50/30">
      <AnimatedBackground />
      <Header />

      <div className="relative z-10 container mx-auto px-4 md:px-6 pt-24 pb-16">
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 mb-4">
            <Newspaper className="size-4" />
            Liputan & Berita
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Berita & Press Release Momsie
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Ikuti perkembangan terbaru, liputan media nasional, dan pengumuman resmi dari tim Momsie Indonesia.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-lg mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berita..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm shadow-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
                <div className="h-44 bg-slate-100" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-slate-100 rounded-full w-1/3" />
                  <div className="h-4 bg-slate-100 rounded-full" />
                  <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Newspaper className="size-14 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-1">Belum ada berita</p>
            <p className="text-sm">Coba ubah kata kunci atau kategori pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <Link
                key={item.id}
                href={item.externalUrl ? item.externalUrl : `/berita/${item.slug}`}
                target={item.externalUrl ? "_blank" : "_self"}
                rel={item.externalUrl ? "noopener noreferrer" : undefined}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-44 overflow-hidden">
                  {item.coverUrl ? (
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-pink-100 flex items-center justify-center">
                      <Newspaper className="size-12 text-blue-300" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[item.category] ?? "bg-slate-100 text-slate-600"}`}>
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="size-3" />
                      {formatDate(item.publishedAt)}
                    </span>
                  </div>
                  <h2 className="font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{item.summary}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span>{item.publisher}</span>
                    {item.externalUrl && (
                      <span className="flex items-center gap-1 text-blue-500 font-semibold">
                        <ExternalLink className="size-3" />
                        Sumber Asli
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
