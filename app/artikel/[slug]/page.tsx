import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, User, BookOpen } from "lucide-react"
import { articles } from "@/lib/articles-data"
import ProtectedRoute from "@/components/auth/protected-route"

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

const categoryColors: Record<string, string> = {
  Kehamilan: "bg-pink-100 text-pink-700",
  Bayi: "bg-blue-100 text-blue-700",
  Nutrisi: "bg-green-100 text-green-700",
  Doula: "bg-purple-100 text-purple-700",
  Persalinan: "bg-rose-100 text-rose-700",
}

export default function ArtikelDetailPage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug)
  if (!article) notFound()

  const related = articles.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 3)

  // Simple markdown-to-JSX: render ## as h2, **text** as bold, and paragraphs
  const renderContent = (text: string) => {
    return text.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) {
        return <h2 key={i} className="text-xl font-bold text-slate-900 mt-8 mb-3">{block.replace("## ", "")}</h2>
      }
      if (block.startsWith("### ")) {
        return <h3 key={i} className="text-lg font-semibold text-slate-800 mt-6 mb-2">{block.replace("### ", "")}</h3>
      }
      if (block.startsWith("- ") || block.startsWith("* ")) {
        const items = block.split("\n").filter(l => l.startsWith("- ") || l.startsWith("* "))
        return (
          <ul key={i} className="list-disc list-inside space-y-1 text-slate-600 my-3">
            {items.map((item, j) => (
              <li key={j}>{item.replace(/^[-*] /, "").replace(/\*\*(.*?)\*\*/g, "$1")}</li>
            ))}
          </ul>
        )
      }
      if (block.includes("|")) {
        const rows = block.split("\n").filter(r => r.includes("|") && !r.includes("---"))
        return (
          <div key={i} className="overflow-x-auto my-4">
            <table className="w-full text-sm border-collapse">
              {rows.map((row, ri) => {
                const cells = row.split("|").filter(c => c.trim())
                return (
                  <tr key={ri} className={ri === 0 ? "bg-pink-50" : "border-b border-slate-100"}>
                    {cells.map((cell, ci) => ri === 0
                      ? <th key={ci} className="text-left px-4 py-2 font-semibold text-slate-700">{cell.trim()}</th>
                      : <td key={ci} className="px-4 py-2 text-slate-600">{cell.trim()}</td>
                    )}
                  </tr>
                )
              })}
            </table>
          </div>
        )
      }
      const html = block.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      return <p key={i} className="text-slate-600 leading-relaxed my-3" dangerouslySetInnerHTML={{ __html: html }} />
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
      {/* Nav */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
          <Link href="/artikel" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-pink-600 transition-colors">
            <ArrowLeft className="size-4" />
            Semua Artikel
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <Link href="/" className="flex items-center gap-2">
            <img src="/Logo Momsie.png" alt="Momsie" className="h-7 w-7 object-contain" />
            <span className="text-lg font-bold text-pink-600">Momsie</span>
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="h-64 md:h-80 overflow-hidden">
        <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 md:px-6 max-w-3xl py-10">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${categoryColors[article.category]}`}>
            {article.category}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-slate-400">
            <Clock className="size-3.5" />
            {article.readTime}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-slate-400">
            <User className="size-3.5" />
            {article.author}
          </span>
          <span className="text-sm text-slate-400">{article.date}</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-6">
          {article.title}
        </h1>

        <p className="text-base text-slate-500 border-l-4 border-pink-300 pl-4 italic mb-8 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="prose-custom">
          {renderContent(article.content)}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-pink-50 to-rose-50 rounded-3xl p-8 text-center border border-pink-100">
          <img src="/Logo Momsie.png" alt="Momsie" className="h-12 w-12 object-contain mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Siap Memulai Perjalanan Kehamilanmu?</h3>
          <p className="text-sm text-slate-600 mb-5">Temukan doula bersertifikat dan layanan pendampingan kehamilan terlengkap di Momsie.</p>
          <Link href="/auth" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-500 text-white font-semibold text-sm hover:bg-pink-600 transition-all active:scale-95 shadow-sm">
            Daftar Sekarang — Gratis
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="size-5 text-pink-500" />
              <h2 className="text-lg font-bold text-slate-900">Artikel Terkait</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/artikel/${rel.slug}`} className="group flex gap-3 p-4 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/50 transition-all">
                  <img src={rel.thumbnail} alt={rel.title} className="size-16 rounded-xl object-cover shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-pink-600 transition-colors line-clamp-2 leading-snug">{rel.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{rel.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </ProtectedRoute>
  )
}
