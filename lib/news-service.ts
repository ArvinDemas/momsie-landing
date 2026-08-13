import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export type NewsCategory = "Liputan Media" | "Press Release" | "Pengumuman" | "Update Produk"
export type NewsStatus = "draft" | "published"

export interface NewsItem {
  id?: string
  title: string
  slug: string
  category: NewsCategory
  publisher: string
  externalUrl: string
  coverUrl: string
  summary: string
  content: string
  status: NewsStatus
  author: string
  publishedAt: Timestamp | null
  createdAt: Timestamp | null
}

const NEWS_COLLECTION = "news"

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Fetch all published news (for public pages)
export async function getPublishedNews(limitCount = 10): Promise<NewsItem[]> {
  const q = query(
    collection(db, NEWS_COLLECTION),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
    limit(limitCount)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as NewsItem))
}

// Fetch all news (for admin CMS)
export async function getAllNews(): Promise<NewsItem[]> {
  const q = query(
    collection(db, NEWS_COLLECTION),
    orderBy("createdAt", "desc")
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as NewsItem))
}

// Get single news by slug (for public detail page)
export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const q = query(
    collection(db, NEWS_COLLECTION),
    where("slug", "==", slug),
    where("status", "==", "published")
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const d = snapshot.docs[0]
  return { id: d.id, ...d.data() } as NewsItem
}

// Create news (admin only)
export async function createNews(data: Omit<NewsItem, "id" | "createdAt" | "publishedAt" | "slug">): Promise<string> {
  const slug = generateSlug(data.title)
  const docRef = await addDoc(collection(db, NEWS_COLLECTION), {
    ...data,
    slug,
    createdAt: serverTimestamp(),
    publishedAt: data.status === "published" ? serverTimestamp() : null,
  })
  return docRef.id
}

// Update news (admin only)
export async function updateNews(id: string, data: Partial<NewsItem>): Promise<void> {
  const ref = doc(db, NEWS_COLLECTION, id)
  const updateData: Record<string, unknown> = { ...data }
  if (data.status === "published" && !data.publishedAt) {
    updateData.publishedAt = serverTimestamp()
  }
  if (data.title) {
    updateData.slug = generateSlug(data.title)
  }
  await updateDoc(ref, updateData)
}

// Delete news (admin only)
export async function deleteNews(id: string): Promise<void> {
  await deleteDoc(doc(db, NEWS_COLLECTION, id))
}
