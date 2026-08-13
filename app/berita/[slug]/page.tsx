// Server Component wrapper — required for Next.js static export with output: export
// Actual content is rendered client-side from Firestore

export const dynamic = "force-static"

export function generateStaticParams() {
  // Return empty array — all news slugs are fetched dynamically from Firestore client-side
  return []
}

export { default } from "./BeritaDetailClient"
