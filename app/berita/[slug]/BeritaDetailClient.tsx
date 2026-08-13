"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, ExternalLink, Newspaper } from "lucide-react"
import { getNewsBySlug, NewsItem } from "@/lib/news-service"
import { Timestamp } from "firebase/firestore"
import AnimatedBackground from "@/components/landing/animated-background"
import Header from "@/components/landing/header"

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

export default function BeritaDetailClient() {
  const params = useParams()
  const slug = params?.slug as string

  const [item, setItem] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    getNewsBySlug(slug)
      .then((data) => {
        if (!data) setNotFound(true)
        else setItem(data)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <div className="min-h-screen bg-pink-50/30">
      <AnimatedBackground />
      <Header />

      <div className="relative z-10 container mx-auto px-4 md:px-6 pt-28 pb-16 max-w-3xl">
        {/* Back */}
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Berita
        </Link>

        {loading && (
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-slate-100 rounded-full w-1/3" />
            <div className="h-10 bg-slate-100 rounded-xl w-full" />
            <div className="h-64 bg-slate-100 rounded-3xl w-full" />
            <div className="space-y-3">
              <div className="h-4 bg-slate-100 rounded-full" />
              <div className="h-4 bg-slate-100 rounded-full w-5/6" />
              <div className="h-4 bg-slate-100 rounded-full w-4/5" />
            </div>
          </div>
        )}

        {!loading && notFound && (
          <div className="text-center py-20 text-slate-400">
            <Newspaper className="size-14 mx-auto mb-4 opacity-30" />
            <h2 className="text-xl font-bold text-slate-700 mb-2">Berita tidak ditemukan</h2>
            <p className="text-sm mb-6">Berita yang kamu cari mungkin telah dihapus atau belum dipublikasikan.</p>
            <Link href="/berita" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
              <ArrowLeft className="size-4" />
              Lihat Semua Berita
            </Link>
          </div>
        )}

        {!loading && item && (
          <article>
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${categoryColors[item.category] ?? "bg-slate-100 text-slate-600"}`}>
                {item.category}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-400">
                <Calendar className="size-3.5" />
                {formatDate(item.publishedAt)}
              </span>
              {item.publisher && (
                <span className="text-sm text-slate-400 font-medium">· {item.publisher}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
              {item.title}
            </h1>

            {/* Cover Image */}
            {item.coverUrl && (
              <div className="rounded-3xl overflow-hidden mb-8 shadow-sm border border-slate-100">
                <img
                  src={item.coverUrl}
                  alt={item.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
              </div>
            )}

            {/* Summary */}
            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8 p-5 bg-blue-50 rounded-2xl border border-blue-100">
              {item.summary}
            </p>

            {/* Content */}
            {item.content && (
              <div className="prose prose-slate prose-lg max-w-none mb-10 text-slate-700 leading-relaxed whitespace-pre-wrap">
                {item.content}
              </div>
            )}

            {/* External Source */}
            {item.externalUrl && (
              <a
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <ExternalLink className="size-4" />
                Baca Berita Lengkap di Sumber Asli ({item.publisher})
              </a>
            )}

            {/* Divider */}
            <div className="mt-12 pt-8 border-t border-slate-100">
              <Link href="/berita" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
                <ArrowLeft className="size-4" />
                Lihat Semua Berita Momsie
              </Link>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}
