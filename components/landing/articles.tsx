"use client"

import Link from "next/link"
import { Clock, ArrowRight, BookOpen } from "lucide-react"
import { articles } from "@/lib/articles-data"

const categoryColors: Record<string, string> = {
  Kehamilan: "bg-pink-100 text-pink-700",
  Bayi: "bg-blue-100 text-blue-700",
  Nutrisi: "bg-green-100 text-green-700",
  Doula: "bg-purple-100 text-purple-700",
  Persalinan: "bg-rose-100 text-rose-700",
}

export default function ArticlesSection() {
  const featured = articles.slice(0, 3)

  return (
    <section id="articles" className="py-20 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-600 mb-3">
              <BookOpen className="size-4" />
              Artikel & Edukasi
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Artikel Terbaru</h2>
            <p className="text-slate-500 mt-1 text-sm">Panduan kehamilan, nutrisi, dan persalinan berbasis bukti ilmiah.</p>
          </div>
          <Link
            href="/artikel"
            className="flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors shrink-0"
          >
            Lihat Semua
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((article, i) => (
            <Link
              key={article.slug}
              href={`/artikel/${article.slug}`}
              className={`group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${i === 0 ? "md:col-span-1" : ""}`}
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[article.category]}`}>
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="size-3" />
                    {article.readTime}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 leading-snug group-hover:text-pink-600 transition-colors line-clamp-2 mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
