import BeritaDetailClient from "./BeritaDetailClient"

export const dynamic = "force-static"

export function generateStaticParams() {
  return [{ slug: "berita-momsie" }]
}

export default function Page() {
  return <BeritaDetailClient />
}
