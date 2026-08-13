"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Newspaper, ArrowRight, ExternalLink, Calendar } from "lucide-react"
import { getPublishedNews, NewsItem } from "@/lib/news-service"
import { Timestamp } from "firebase/firestore"

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

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublishedNews(3)
      .then(setNews)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/80 rounded-3xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
                <div className="h-44 bg-slate-100" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-slate-100 rounded-full w-1/3" />
                  <div className="h-4 bg-slate-100 rounded-full" />
                  <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (news.length === 0) return null

  return (
    <section id="berita" className="py-20 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 mb-3">
              <Newspaper className="size-4" />
              Liputan & Berita
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Berita Terkini Momsie</h2>
            <p className="text-slate-500 mt-1 text-sm">
              Perkembangan terbaru, liputan media, dan pengumuman resmi dari Momsie.
            </p>
          </div>
          <Link
            href="/berita"
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors shrink-0"
          >
            Lihat Semua
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* First card — featured (larger) */}
          {news.map((item, i) => (
            <Link
              key={item.id}
              href={item.externalUrl ? item.externalUrl : `/berita/${item.slug}`}
              target={item.externalUrl ? "_blank" : "_self"}
              rel={item.externalUrl ? "noopener noreferrer" : undefined}
              className={`group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${
                i === 0 ? "md:col-span-2 md:row-span-1" : ""
              }`}
            >
              <div className={`overflow-hidden ${i === 0 ? "h-56" : "h-44"}`}>
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
                  {item.publisher && (
                    <span className="text-xs text-slate-400 font-medium">· {item.publisher}</span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{item.summary}</p>
                {item.externalUrl && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-blue-500 font-semibold">
                    <ExternalLink className="size-3" />
                    Baca di sumber asli
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
