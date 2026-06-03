import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export interface GameScore {
  id?: string
  uid: string
  name: string
  score: number
  matches: number
  misses: number
  timeLeft: number
  createdAt?: Timestamp
}

export async function saveScore(score: Omit<GameScore, "id" | "createdAt">) {
  await addDoc(collection(db, "game_scores"), {
    ...score,
    createdAt: serverTimestamp(),
  })
}

export async function getTopScores(n = 10): Promise<GameScore[]> {
  const q = query(
    collection(db, "game_scores"),
    orderBy("score", "desc"),
    limit(n)
  )
  const snap = await getDocs(q)
  return snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as GameScore) }))
}
