"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Clock, BookOpen } from "lucide-react"
import { articles } from "@/lib/articles-data"
import AnimatedBackground from "@/components/landing/animated-background"
import Header from "@/components/landing/header"
import ProtectedRoute from "@/components/auth/protected-route"

const categories = ["Semua", "Kehamilan", "Bayi", "Nutrisi", "Doula", "Persalinan"]

const categoryColors: Record<string, string> = {
  Kehamilan: "bg-pink-100 text-pink-700",
  Bayi: "bg-blue-100 text-blue-700",
  Nutrisi: "bg-green-100 text-green-700",
  Doula: "bg-purple-100 text-purple-700",
  Persalinan: "bg-rose-100 text-rose-700",
}

export default function ArtikelPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("Semua")

  const filtered = articles.filter((a) => {
    const matchCat = activeCategory === "Semua" || a.category === activeCategory
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-pink-50/30">
        <AnimatedBackground />
        <Header />

        <div className="relative z-10 container mx-auto px-4 md:px-6 pt-24 pb-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-600 mb-4">
            <BookOpen className="size-4" />
            Artikel & Edukasi
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Panduan Kehamilan & Persalinan
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Informasi terpercaya seputar kehamilan, persalinan, nutrisi, dan peran doula untuk mendukung perjalanan ibu hamil Indonesia.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-lg mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari artikel..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm shadow-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-pink-500 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-pink-300 hover:text-pink-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <BookOpen className="size-12 mx-auto mb-3 opacity-40" />
            <p>Tidak ada artikel yang sesuai.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <Link
                key={article.slug}
                href={`/artikel/${article.slug}`}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
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
                  <h2 className="font-bold text-slate-900 leading-snug mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{article.excerpt}</p>
                  <div className="mt-4 text-xs text-slate-400">{article.date} · {article.author}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      </div>
    </ProtectedRoute>
  )
}
