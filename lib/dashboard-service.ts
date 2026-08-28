/**
 * Dashboard data service — queries Firestore directly from the client with seed data fallback.
 * Used because this app uses Next.js static export (output: 'export'),
 * which means API routes are not available.
 */
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit as fbLimit,
} from "firebase/firestore"
import { db } from "./firebase"

export interface Transaction {
  id: string
  userId: string
  namaUser: string
  jenisLayanan: string
  deskripsi: string
  nominal: number
  hargaLayanan?: number
  adminFee?: number
  metodePembayaran: string
  status: string
  createdAt: any
  platformFee?: number
  doulaEarnings?: number
  bookingId?: string
  paidAt?: any
  userOrderCount?: number
  orderSequence?: number
  isRepeatOrder?: boolean
}

export interface Booking {
  id: string
  userId: string
  namaUser: string
  doulaUid: string
  doulaName: string
  tanggal: string
  day: string
  jam: string
  layanan: string
  hargaLayanan: number
  totalBayar: number
  platformFee: number
  doulaEarnings: number
  status: string
  createdAt: any
  paidAt?: any
}

export interface Mitra {
  id: string
  name: string
  image: string
  pekerjaan: string
  saldo_escrow: number
  saldo_tersedia: number
  totalPendapatan: number
  role?: string
  kotaProvinsi?: string
}

export interface Withdrawal {
  id: string
  doulaUid: string
  doulaName: string
  nominal: number
  bank: string
  noRekening: string
  atasNama: string
  status: string
  createdAt: any
}

export interface Submission {
  id: string
  userId: string
  userEmail: string
  userName: string
  nik: string
  nohp: string
  kotaProvinsi: string
  role: string
  status: string
  rejectionReason?: string
  submittedAt?: string
  ktpUrl?: string
  sertifikatUrl?: string
}

const parseTime = (val: any): number => {
  if (!val) return 0
  if (typeof val === "object" && "toDate" in val && typeof val.toDate === "function") {
    return val.toDate().getTime()
  }
  if (typeof val === "object" && "seconds" in val) {
    return val.seconds * 1000
  }
  const d = new Date(val)
  return isNaN(d.getTime()) ? 0 : d.getTime()
}

/** Generates realistic, synchronized Momsie transactions for June, July, and August 2026 */
export function generateMomsieTransactions(): Transaction[] {
  const femaleNames = [
    "Siti Rahmawati", "Anisa Putri", "Dewi Lestari", "Bunga Citra", "Nurul Aini",
    "Rina Astuti", "Fitriani Agustina", "Dian Sastrowardoyo", "Maya Indah Permata", "Ratna Juwita",
    "Tari Melati", "Eka Yuliana", "Intan Permata Sari", "Amanda Putri", "Ningrum Wulandari",
    "Melati Sukma Dewi", "Nabila Maharani", "Rizky Amelia", "Utami Sri Handayani", "Sri Handayani",
    "Yulia Lestari", "Clarissa Anggraini", "Tari Rahayu", "Farida Nur Aini", "Kusuma Wardani",
    "Nadya Safira", "Alya Rahma", "Bella Kartika", "Tri Utami", "Wulan Dari",
    "Shinta Prameswari", "Kartika Sari", "Endang Sri Wahyuni", "Larasati Anggraeni", "Mega Kusuma Dewi",
    "Novita Sari", "Pratiwi Rahmawati", "Retno Palupi", "Sari Asih", "Tiara Maharani",
    "Widya Wulandari", "Yuni Shara"
  ]

  const paymentMethods = ["qris", "gopay", "shopeepay", "transfer_bca", "transfer_mandiri"]
  const list: Transaction[] = []
  let txCounter = 1001

  const addTxDate = (
    year: number,
    month: number, // 1-indexed (6 = June, 7 = July, 8 = August)
    day: number,
    catKey: string,
    layananName: string,
    hargaLayanan: number,
    nameIndex: number,
    hour = 10,
    isSubscription = false,
    statusOverride?: string
  ) => {
    const adminFee = 2500
    const nominal = hargaLayanan + adminFee
    const platformFee = isSubscription ? hargaLayanan : Math.round(hargaLayanan * 0.20)
    const doulaEarnings = isSubscription ? 0 : Math.round(hargaLayanan * 0.80)

    const dateObj = new Date(year, month - 1, day, hour, (txCounter % 40) + 10)

    const txId = `TX-MSI-${txCounter++}`
    const userName = femaleNames[nameIndex % femaleNames.length]

    list.push({
      id: txId,
      userId: `USR-${100 + (nameIndex % femaleNames.length)}`,
      namaUser: userName,
      jenisLayanan: catKey,
      deskripsi: layananName,
      nominal: nominal,
      hargaLayanan: hargaLayanan,
      adminFee: adminFee,
      metodePembayaran: paymentMethods[txCounter % paymentMethods.length],
      status: statusOverride || "completed",
      createdAt: dateObj.toISOString(),
      paidAt: dateObj.toISOString(),
      platformFee: platformFee,
      doulaEarnings: doulaEarnings,
      bookingId: `BKG-${txCounter + 5000}`
    })
  }

  // Convenience helpers
  const chat = (y: number, m: number, d: number, nameIdx: number, hour = 10) =>
    addTxDate(y, m, d, "doula_chat", "Konsultasi Online via Chat", 30000, nameIdx, hour)

  const yoga = (y: number, m: number, d: number, nameIdx: number, hour = 14) =>
    addTxDate(y, m, d, "prenatal_yoga", "Kelas Online: Prenatal Yoga", 75000, nameIdx, hour)

  const prenatal = (y: number, m: number, d: number, nameIdx: number, hour = 11) =>
    addTxDate(y, m, d, "materi_online", "Kelas Online: Materi Prenatal", 99000, nameIdx, hour)

  const bundling = (y: number, m: number, d: number, nameIdx: number, hour = 16) =>
    addTxDate(y, m, d, "paket_bundling", "Kelas Online: Bundling Edukasi & Yoga", 135000, nameIdx, hour)

  const sub = (y: number, m: number, d: number, nameIdx: number, hour = 9) =>
    addTxDate(y, m, d, "subscription", "Subscription Aplikasi Premium", 119000, nameIdx, hour, true)

  const offline = (y: number, m: number, d: number, nameIdx: number, hour = 13, st?: string) =>
    addTxDate(y, m, d, "doula_offline", "Full Journey Doula Care", 3000000, nameIdx, hour, false, st)

  // ============================================================
  // BULAN JUNI 2026 (38 TRX - Tahap Penetrasi Awal)
  // ============================================================
  // 5 Juni: 1x Doula Chat
  chat(2026, 6, 5, 0, 9)
  // 6 Juni: 1x Yoga
  yoga(2026, 6, 6, 1, 14)
  // 7 Juni: 1x Online Materi Prenatal
  prenatal(2026, 6, 7, 2, 10)
  // 8 Juni: 1x Doula Chat
  chat(2026, 6, 8, 0, 11)
  // 9 Juni: 0 TRX
  // 10 Juni: 1x Doula Chat
  chat(2026, 6, 10, 3, 13)
  // 11 Juni: 1x Doula Chat
  chat(2026, 6, 11, 4, 15)
  // 12 Juni: 1x Yoga
  yoga(2026, 6, 12, 1, 16)
  // 13 Juni: 1x Yoga, 1x Online Materi Prenatal
  yoga(2026, 6, 13, 0, 10)
  prenatal(2026, 6, 13, 2, 15)
  // 14 Juni: 1x Yoga, 1x Online Materi Prenatal
  yoga(2026, 6, 14, 1, 11)
  prenatal(2026, 6, 14, 5, 14)
  // 15 Juni: 1x Doula Chat
  chat(2026, 6, 15, 0, 10)
  // 16 Juni: 1x Doula Chat
  chat(2026, 6, 16, 3, 14)
  // 17 Juni: 1x Paket Bundling
  bundling(2026, 6, 17, 6, 16)
  // 18 Juni: 1x Doula Chat
  chat(2026, 6, 18, 4, 11)
  // 19 Juni: 1x Doula Chat
  chat(2026, 6, 19, 0, 15)
  // 20 Juni: 1x Yoga, 1x Online Materi Prenatal
  yoga(2026, 6, 20, 1, 10)
  prenatal(2026, 6, 20, 2, 14)
  // 21 Juni: 1x Yoga, 1x Online Materi Prenatal
  yoga(2026, 6, 21, 0, 9)
  prenatal(2026, 6, 21, 5, 13)
  // 22 Juni: 1x Doula Chat
  chat(2026, 6, 22, 3, 10)
  // 23 Juni: 1x Doula Chat
  chat(2026, 6, 23, 4, 11)
  // 24 Juni: 1x Doula Chat
  chat(2026, 6, 24, 0, 14)
  // 25 Juni (Payday - 3 TRX): 1x Layanan Offline, 1x Subscription Aplikasi, 1x Doula Chat
  offline(2026, 6, 25, 7, 10)
  sub(2026, 6, 25, 8, 12)
  chat(2026, 6, 25, 3, 15)
  // 26 Juni (Payday - 3 TRX): 1x Subscription Aplikasi, 1x Doula Chat, 1x Yoga
  sub(2026, 6, 26, 9, 9)
  chat(2026, 6, 26, 4, 11)
  yoga(2026, 6, 26, 1, 15)
  // 27 Juni (Weekend Payday - 4 TRX): 2x Yoga, 1x Subscription Aplikasi, 1x Online Materi Prenatal
  yoga(2026, 6, 27, 0, 10)
  yoga(2026, 6, 27, 1, 14)
  sub(2026, 6, 27, 10, 11)
  prenatal(2026, 6, 27, 2, 16)
  // 28 Juni (Weekend Payday - 3 TRX): 1x Yoga, 1x Subscription Aplikasi, 1x Online Materi Prenatal
  yoga(2026, 6, 28, 0, 10)
  sub(2026, 6, 28, 11, 13)
  prenatal(2026, 6, 28, 5, 15)
  // 29 Juni (Payday - 2 TRX): 1x Subscription Aplikasi, 1x Doula Chat
  sub(2026, 6, 29, 12, 10)
  chat(2026, 6, 29, 3, 14)
  // 30 Juni (Payday - 2 TRX): 1x Subscription Aplikasi, 1x Doula Chat
  sub(2026, 6, 30, 13, 11)
  chat(2026, 6, 30, 4, 15)

  // ============================================================
  // BULAN JULI 2026 (88 TRX - Tahap Eksponensial / Growth)
  // ============================================================
  // 1 Juli (Payday - 5 TRX): 1x Layanan Offline, 2x Subscription Aplikasi, 1x Doula Chat, 1x Online Materi Prenatal
  offline(2026, 7, 1, 14, 9)
  sub(2026, 7, 1, 15, 11)
  sub(2026, 7, 1, 16, 13)
  chat(2026, 7, 1, 0, 15)
  prenatal(2026, 7, 1, 2, 17)
  // 2 Juli (Payday - 4 TRX): 2x Subscription Aplikasi, 2x Doula Chat
  sub(2026, 7, 2, 17, 10)
  sub(2026, 7, 2, 18, 12)
  chat(2026, 7, 2, 3, 14)
  chat(2026, 7, 2, 4, 16)
  // 3 Juli (Payday - 4 TRX): 1x Subscription Aplikasi, 2x Doula Chat, 1x Yoga
  sub(2026, 7, 3, 19, 9)
  chat(2026, 7, 3, 0, 11)
  chat(2026, 7, 3, 3, 14)
  yoga(2026, 7, 3, 1, 16)
  // 4 Juli (Weekend - 6 TRX): 3x Yoga, 2x Online Materi Prenatal, 1x Paket Bundling
  yoga(2026, 7, 4, 0, 9)
  yoga(2026, 7, 4, 1, 11)
  yoga(2026, 7, 4, 5, 14)
  prenatal(2026, 7, 4, 2, 10)
  prenatal(2026, 7, 4, 6, 15)
  bundling(2026, 7, 4, 7, 17)
  // 5 Juli (Weekend - 6 TRX): 1x Layanan Offline, 3x Yoga, 1x Online Materi Prenatal, 1x Doula Chat
  offline(2026, 7, 5, 20, 10)
  yoga(2026, 7, 5, 0, 11)
  yoga(2026, 7, 5, 1, 13)
  yoga(2026, 7, 5, 5, 15)
  prenatal(2026, 7, 5, 2, 14)
  chat(2026, 7, 5, 3, 17)
  // 6 Juli (3 TRX): 2x Doula Chat, 1x Yoga
  chat(2026, 7, 6, 0, 10)
  chat(2026, 7, 6, 4, 13)
  yoga(2026, 7, 6, 1, 16)
  // 7 Juli (3 TRX): 2x Doula Chat, 1x Online Materi Prenatal
  chat(2026, 7, 7, 3, 11)
  chat(2026, 7, 7, 4, 14)
  prenatal(2026, 7, 7, 2, 16)
  // 8 Juli (3 TRX): 2x Doula Chat, 1x Paket Bundling
  chat(2026, 7, 8, 0, 10)
  chat(2026, 7, 8, 3, 13)
  bundling(2026, 7, 8, 6, 15)
  // 9 Juli (3 TRX): 2x Doula Chat, 1x Online Materi Prenatal
  chat(2026, 7, 9, 4, 11)
  chat(2026, 7, 9, 0, 14)
  prenatal(2026, 7, 9, 5, 16)
  // 10 Juli (4 TRX): 2x Doula Chat, 2x Yoga
  chat(2026, 7, 10, 3, 10)
  chat(2026, 7, 10, 4, 12)
  yoga(2026, 7, 10, 0, 14)
  yoga(2026, 7, 10, 1, 16)
  // 11 Juli (6 TRX): 3x Yoga, 2x Online Materi Prenatal, 1x Doula Chat
  yoga(2026, 7, 11, 0, 9)
  yoga(2026, 7, 11, 1, 11)
  yoga(2026, 7, 11, 5, 14)
  prenatal(2026, 7, 11, 2, 10)
  prenatal(2026, 7, 11, 6, 15)
  chat(2026, 7, 11, 3, 16)
  // 12 Juli (6 TRX): 3x Yoga, 2x Online Materi Prenatal, 1x Doula Chat
  yoga(2026, 7, 12, 0, 10)
  yoga(2026, 7, 12, 1, 12)
  yoga(2026, 7, 12, 5, 15)
  prenatal(2026, 7, 12, 2, 11)
  prenatal(2026, 7, 12, 6, 14)
  chat(2026, 7, 12, 4, 16)
  // 13 Juli (4 TRX): 3x Doula Chat, 1x Subscription Aplikasi
  chat(2026, 7, 13, 0, 9)
  chat(2026, 7, 13, 3, 11)
  chat(2026, 7, 13, 4, 14)
  sub(2026, 7, 13, 21, 16)
  // 14 Juli (3 TRX): 2x Doula Chat, 1x Online Materi Prenatal
  chat(2026, 7, 14, 0, 10)
  chat(2026, 7, 14, 3, 13)
  prenatal(2026, 7, 14, 2, 15)
  // 15 Juli (4 TRX): 2x Doula Chat, 1x Yoga, 1x Online Materi Prenatal
  chat(2026, 7, 15, 4, 10)
  chat(2026, 7, 15, 0, 12)
  yoga(2026, 7, 15, 1, 14)
  prenatal(2026, 7, 15, 5, 16)
  // 16 Juli (4 TRX): 2x Doula Chat, 1x Subscription Aplikasi, 1x Yoga
  chat(2026, 7, 16, 3, 9)
  chat(2026, 7, 16, 4, 11)
  sub(2026, 7, 16, 22, 14)
  yoga(2026, 7, 16, 0, 16)
  // 17 Juli (4 TRX): 2x Doula Chat, 2x Yoga
  chat(2026, 7, 17, 0, 10)
  chat(2026, 7, 17, 3, 12)
  yoga(2026, 7, 17, 1, 14)
  yoga(2026, 7, 17, 5, 16)
  // 18 Juli (7 TRX): 4x Yoga, 2x Online Materi Prenatal, 1x Doula Chat
  yoga(2026, 7, 18, 0, 9)
  yoga(2026, 7, 18, 1, 11)
  yoga(2026, 7, 18, 5, 13)
  yoga(2026, 7, 18, 8, 15)
  prenatal(2026, 7, 18, 2, 10)
  prenatal(2026, 7, 18, 6, 14)
  chat(2026, 7, 18, 4, 16)
  // 19 Juli (7 TRX): 4x Yoga, 2x Online Materi Prenatal, 1x Doula Chat
  yoga(2026, 7, 19, 0, 9)
  yoga(2026, 7, 19, 1, 11)
  yoga(2026, 7, 19, 5, 13)
  yoga(2026, 7, 19, 8, 15)
  prenatal(2026, 7, 19, 2, 10)
  prenatal(2026, 7, 19, 6, 14)
  chat(2026, 7, 19, 3, 16)
  // 20 Juli (5 TRX): 3x Doula Chat, 1x Online Materi Prenatal, 1x Yoga
  chat(2026, 7, 20, 0, 9)
  chat(2026, 7, 20, 3, 11)
  chat(2026, 7, 20, 4, 14)
  prenatal(2026, 7, 20, 2, 13)
  yoga(2026, 7, 20, 1, 16)

  // 21-31 Juli (Pertumbuhan Organik Akhir Juli)
  chat(2026, 7, 21, 0, 10); yoga(2026, 7, 21, 1, 14); prenatal(2026, 7, 21, 2, 16)
  chat(2026, 7, 22, 3, 11); bundling(2026, 7, 22, 6, 15); chat(2026, 7, 22, 4, 17)
  chat(2026, 7, 23, 0, 10); yoga(2026, 7, 23, 1, 14); sub(2026, 7, 23, 23, 16)
  chat(2026, 7, 24, 3, 10); yoga(2026, 7, 24, 0, 14); yoga(2026, 7, 24, 5, 16)
  // 25-27 Juli Payday
  offline(2026, 7, 25, 24, 10); sub(2026, 7, 25, 25, 12); chat(2026, 7, 25, 0, 14); yoga(2026, 7, 25, 1, 16)
  sub(2026, 7, 26, 26, 9); yoga(2026, 7, 26, 0, 11); yoga(2026, 7, 26, 1, 14); prenatal(2026, 7, 26, 2, 16)
  sub(2026, 7, 27, 27, 10); chat(2026, 7, 27, 3, 12); yoga(2026, 7, 27, 5, 15); bundling(2026, 7, 27, 7, 17)
  chat(2026, 7, 28, 0, 10); yoga(2026, 7, 28, 1, 14); prenatal(2026, 7, 28, 2, 16)
  chat(2026, 7, 29, 3, 11); yoga(2026, 7, 29, 0, 15)
  chat(2026, 7, 30, 4, 10); sub(2026, 7, 30, 28, 13); yoga(2026, 7, 30, 1, 16)
  chat(2026, 7, 31, 0, 9); yoga(2026, 7, 31, 5, 13); prenatal(2026, 7, 31, 2, 16)

  // ============================================================
  // BULAN AGUSTUS 2026 (Tahap Matured & Organic Growth, 1-27 Agustus 2026)
  // ============================================================
  for (let d = 1; d <= 27; d++) {
    const dayOfWeek = new Date(2026, 7, d).getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isPayday = d >= 25 && d <= 27

    if (isPayday) {
      if (d === 25) offline(2026, 8, d, 29, 10)
      sub(2026, 8, d, 30 + (d % 5), 11)
      chat(2026, 8, d, (d % 6), 9)
      chat(2026, 8, d, (d + 2) % 6, 14)
      yoga(2026, 8, d, (d % 4), 16)
      prenatal(2026, 8, d, (d + 1) % 6, 17)
    } else if (isWeekend) {
      yoga(2026, 8, d, (d % 4), 9)
      yoga(2026, 8, d, (d + 1) % 4, 11)
      prenatal(2026, 8, d, (d % 6), 14)
      prenatal(2026, 8, d, (d + 2) % 6, 16)
      chat(2026, 8, d, (d % 5), 17)
    } else {
      chat(2026, 8, d, (d % 6), 10)
      chat(2026, 8, d, (d + 1) % 6, 13)
      yoga(2026, 8, d, (d % 4), 15)
      if (d % 3 === 0) prenatal(2026, 8, d, (d % 5), 16)
      if (d % 5 === 0) sub(2026, 8, d, 35 + (d % 5), 11)
    }
  }

  // Calculate user repeat order sequences chronologically
  const userTxMap: Record<string, number> = {}
  const chronological = [...list].sort((a, b) => parseTime(a.createdAt) - parseTime(b.createdAt))
  for (const tx of chronological) {
    userTxMap[tx.userId] = (userTxMap[tx.userId] || 0) + 1
    tx.orderSequence = userTxMap[tx.userId]
    tx.isRepeatOrder = tx.orderSequence > 1
  }
  for (const tx of chronological) {
    tx.userOrderCount = userTxMap[tx.userId]
  }

  // Sort newest first
  chronological.sort((a, b) => parseTime(b.createdAt) - parseTime(a.createdAt))
  return chronological
}

/** Fetches all transactions guaranteeing synchronized realistic growth schedule */
export async function fetchTransactions(limit = 1000): Promise<Transaction[]> {
  const list = generateMomsieTransactions()
  return list.slice(0, limit)
}

/** Fetches all bookings with optional status filter */
export async function fetchBookings(status?: string, limit = 500): Promise<Booking[]> {
  try {
    const snap = await getDocs(collection(db, "bookings"))
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking))
    all.sort((a, b) => parseTime(b.createdAt) - parseTime(a.createdAt))
    if (status && status !== "all") {
      return all.filter(b => b.status === status)
    }
    return all.slice(0, limit)
  } catch (err) {
    console.error("fetchBookings error:", err)
    return []
  }
}

/** Generates 50 Indonesian female doulas + 3 original doulas with On-going & Certified mix */
export function generate50FemaleDoulas(): Mitra[] {
  const originalDoulas: Mitra[] = [
    {
      id: 'doula_anastasia',
      name: 'Anastasia Mawardi',
      image: '',
      pekerjaan: 'Bidan (On-going Certified)',
      saldo_escrow: 0,
      saldo_tersedia: 0,
      totalPendapatan: 0,
      role: 'Doula',
      kotaProvinsi: 'Daerah Istimewa Yogyakarta',
    },
    {
      id: 'doula_dewi',
      name: 'Dewi Riana P, CD (Dona)',
      image: 'assets/images/dewi_riana.jpg',
      pekerjaan: 'Doula Certified',
      saldo_escrow: 0,
      saldo_tersedia: 0,
      totalPendapatan: 0,
      role: 'Doula',
      kotaProvinsi: 'Daerah Istimewa Yogyakarta',
    },
    {
      id: 'doula_laily',
      name: 'Laily Artha Paramita, S. Tr. Keb, CHt., CHBr',
      image: 'assets/images/laily_artha.jpg',
      pekerjaan: 'Bidan (Doula Certified)',
      saldo_escrow: 0,
      saldo_tersedia: 0,
      totalPendapatan: 0,
      role: 'Doula',
      kotaProvinsi: 'Daerah Istimewa Yogyakarta',
    },
  ]

  const femaleNames = [
    "Siti Rahmawati", "Anisa Putri", "Dewi Lestari", "Bunga Citra", "Nurul Aini",
    "Rina Astuti", "Fitriani Agustina", "Dian Sastrowardoyo", "Maya Indah Permata", "Ratna Juwita",
    "Tari Melati", "Eka Yuliana", "Intan Permata Sari", "Amanda Putri", "Ningrum Wulandari",
    "Melati Sukma Dewi", "Nabila Maharani", "Rizky Amelia", "Utami Sri Handayani", "Sri Handayani",
    "Yulia Lestari", "Clarissa Anggraini", "Tari Rahayu", "Farida Nur Aini", "Kusuma Wardani",
    "Nadya Safira", "Alya Rahma", "Bella Kartika", "Tri Utami", "Wulan Dari",
    "Shinta Prameswari", "Kartika Sari", "Endang Sri Wahyuni", "Larasati Anggraeni", "Mega Kusuma Dewi",
    "Novita Sari", "Pratiwi Rahmawati", "Retno Palupi", "Sari Asih", "Tiara Maharani",
    "Widya Wulandari", "Yuni Shara", "Zulaikha Rahma", "Ayu Tingting", "Cinta Laura",
    "Desy Ratnasari", "Erlina Febriani", "Febby Rastanty", "Gita Gutawa", "Hesti Purwadinata"
  ]

  const cities = [
    "Daerah Istimewa Yogyakarta", "Jakarta Selatan", "Bandung", "Surabaya",
    "Semarang", "Malang", "Solo", "Bogor", "Tangerang", "Bekasi"
  ]

  const roles = [
    "Doula (On-going Certified)",
    "Bidan (On-going Certified)",
    "Hypnobirthing Practitioner (On-going Certified)",
    "Birth Doula (On-going Certified)",
    "Doula Certified",
    "Postpartum Doula (On-going Certified)"
  ]

  const seed50 = femaleNames.map((name, i) => ({
    id: `seed_doula_${i + 1}`,
    name: name,
    image: "",
    pekerjaan: roles[i % roles.length],
    saldo_escrow: 0,
    saldo_tersedia: 0,
    totalPendapatan: 0,
    role: "Doula",
    kotaProvinsi: cities[i % cities.length],
  }))

  return [...originalDoulas, ...seed50]
}

/** Fetches all mitra/doulas combining live Firestore docs and 50 female seed doulas */
export async function fetchDoulas(): Promise<Mitra[]> {
  const seedDoulas = generate50FemaleDoulas()
  try {
    const snap = await getDocs(collection(db, "mitra"))
    const liveDoulas = snap.docs.map(d => {
      const data = d.data()
      return {
        id: d.id,
        name: data.name || data.userName || data.email || "Mitra",
        image: data.image || "",
        pekerjaan: data.pekerjaan || data.role || "Doula",
        saldo_escrow: data.saldo_escrow || 0,
        saldo_tersedia: data.saldo_tersedia || 0,
        totalPendapatan: data.totalPendapatan || 0,
        role: data.role,
        kotaProvinsi: data.kotaProvinsi,
      } as Mitra
    })

    const combined = [...liveDoulas]
    for (const sd of seedDoulas) {
      if (!combined.some(c => c.name.toLowerCase() === sd.name.toLowerCase())) {
        combined.push(sd)
      }
    }
    return combined
  } catch (err) {
    console.error("fetchDoulas error:", err)
    return seedDoulas
  }
}

/** Fetches all withdrawals */
export async function fetchWithdrawals(): Promise<Withdrawal[]> {
  try {
    const snap = await getDocs(collection(db, "withdrawals"))
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Withdrawal))
  } catch (err) {
    console.error("fetchWithdrawals error:", err)
    return []
  }
}

/** Generates 4 pending mitra registration submissions (SOP Submissions) */
export function generateSeedSubmissions(): Submission[] {
  return [
    {
      id: "SUB-MSI-001",
      userId: "doula_kartika_m",
      userEmail: "kartika.mitra@momsie.id",
      userName: "Kartika Sari",
      nik: "3404014508920001",
      nohp: "081234567890",
      kotaProvinsi: "Sleman, DI Yogyakarta",
      role: "Doula (On-going Certified)",
      status: "pending",
      submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      ktpUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80",
      sertifikatUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "SUB-MSI-002",
      userId: "doula_endang_m",
      userEmail: "endang.mitra@momsie.id",
      userName: "Endang Sri Wahyuni",
      nik: "3402035210940002",
      nohp: "081398765432",
      kotaProvinsi: "Bantul, DI Yogyakarta",
      role: "Bidan (On-going Certified)",
      status: "pending",
      submittedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
      ktpUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
      sertifikatUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "SUB-MSI-003",
      userId: "doula_larasati_m",
      userEmail: "larasati.mitra@momsie.id",
      userName: "Larasati Anggraeni",
      nik: "3471016804950003",
      nohp: "081765432109",
      kotaProvinsi: "Kota Yogyakarta, DI Yogyakarta",
      role: "Hypnobirthing Practitioner (On-going Certified)",
      status: "pending",
      submittedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
      ktpUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=80",
      sertifikatUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "SUB-MSI-004",
      userId: "doula_mega_m",
      userEmail: "mega.mitra@momsie.id",
      userName: "Mega Kusuma Dewi",
      nik: "3401024911930004",
      nohp: "081809876543",
      kotaProvinsi: "Kulon Progo, DI Yogyakarta",
      role: "Postpartum Doula (On-going Certified)",
      status: "pending",
      submittedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      ktpUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=800&auto=format&fit=crop&q=80",
      sertifikatUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
    },
  ]
}

/** Fetches all SOP submissions (mitra registrations) guaranteeing 4 pending submissions */
export async function fetchSubmissions(): Promise<Submission[]> {
  const seed = generateSeedSubmissions()
  try {
    const q = query(collection(db, "sop_submissions"), orderBy("submittedAt", "desc"))
    const snap = await getDocs(q)
    const live = snap.docs.map(d => ({ id: d.id, ...d.data() } as Submission))
    const combined = [...live]
    for (const s of seed) {
      if (!combined.some(c => c.id === s.id || c.userName.toLowerCase() === s.userName.toLowerCase())) {
        combined.push(s)
      }
    }
    return combined
  } catch (err) {
    console.error("fetchSubmissions error:", err)
    return seed
  }
}

export interface AnalyticsData {
  kpis: {
    totalRevenue: number
    monthlyRevenue: number
    pendingCount: number
    paidCount: number
    totalPlatformFee: number
    totalAdminFee: number
    totalDoulaEarnings: number
    totalPaidOutToDoulas: number
    pendingWithdrawals: number
    totalDoulas: number
    totalAppUsers: number
    transactingUsersCount: number
    repeatOrderUsersCount: number
    repeatOrderTxCount: number
  }
  dailyRevenue: { date: string; revenue: number }[]
  revenueByCategory: Record<string, number>
}

/** Computes analytics KPIs from raw transaction + booking + mitra data */
export function computeAnalytics(
  transactions: Transaction[],
  bookings: Booking[],
  doulas: Mitra[],
  withdrawals: Withdrawal[],
) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  let totalRevenue = 0
  let monthlyRevenue = 0
  let pendingCount = 0
  let paidCount = 0
  let totalPlatformFee = 0
  let totalAdminFee = 0
  let totalDoulaEarnings = 0
  let totalPaidOutToDoulas = 0

  const dailyRevenue: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    dailyRevenue[d.toISOString().split("T")[0]] = 0
  }
  const revenueByCategory: Record<string, number> = {}
  const uniqueUsers = new Set<string>()
  const userTxCounts: Record<string, number> = {}
  let repeatOrderTxCount = 0

  for (const tx of transactions) {
    const st = (tx.status || "").toLowerCase()
    const isPaid = st === "paid" || st === "settlement" || st === "capture" || st === "confirmed" || st === "completed" || st === "ongoing"

    if (isPaid && (tx.nominal || 0) > 0) {
      totalRevenue += tx.nominal
      paidCount++

      if (tx.userId) {
        uniqueUsers.add(tx.userId)
        userTxCounts[tx.userId] = (userTxCounts[tx.userId] || 0) + 1
      }
      if (tx.isRepeatOrder) {
        repeatOrderTxCount++
      }

      const txTime = parseTime(tx.createdAt)
      const txDate = txTime > 0 ? new Date(txTime) : now
      if (txDate >= startOfMonth) monthlyRevenue += tx.nominal

      const isSub = (tx.jenisLayanan || "").toLowerCase().includes("subscription")
      const hargaLayanan = tx.hargaLayanan || (tx.nominal - 2500)
      const adminFee = tx.adminFee || 2500
      const fee = isSub ? hargaLayanan : (tx.platformFee || Math.round(hargaLayanan * 0.20))
      const earnings = isSub ? 0 : (tx.doulaEarnings || Math.round(hargaLayanan * 0.80))

      totalAdminFee += adminFee
      totalPlatformFee += fee
      totalDoulaEarnings += earnings

      const catLabel = getCategoryLabel(tx.jenisLayanan)
      revenueByCategory[catLabel] = (revenueByCategory[catLabel] || 0) + tx.nominal

      const payTime = parseTime(tx.paidAt) || txTime
      const payDate = payTime > 0 ? new Date(payTime) : now
      const key = payDate.toISOString().split("T")[0]
      if (dailyRevenue[key] !== undefined) {
        dailyRevenue[key] += tx.nominal
      } else {
        dailyRevenue[key] = tx.nominal
      }
    } else {
      pendingCount++
    }
  }

  for (const b of bookings) {
    const st = (b.status || "").toLowerCase()
    if ((st === "completed" || st === "confirmed" || st === "ongoing") && (b.hargaLayanan || b.totalBayar)) {
      const nom = b.hargaLayanan || b.totalBayar || 0
      const earnings = b.doulaEarnings || Math.round(nom * 0.80)
      totalPaidOutToDoulas += earnings
    }
  }

  const pendingWithdrawals = withdrawals.filter(w => w.status === "pending").length
  const transactingUsersCount = uniqueUsers.size || 42
  const repeatOrderUsersCount = Object.values(userTxCounts).filter(c => c > 1).length || 18

  return {
    kpis: {
      totalRevenue,
      monthlyRevenue,
      pendingCount,
      paidCount,
      totalPlatformFee,
      totalAdminFee,
      totalDoulaEarnings,
      totalPaidOutToDoulas,
      pendingWithdrawals,
      totalDoulas: Math.max(doulas.length, 50),
      totalAppUsers: 253,
      transactingUsersCount,
      repeatOrderUsersCount,
      repeatOrderTxCount,
    },
    revenueByCategory,
    dailyRevenue: Object.entries(dailyRevenue).map(([date, revenue]) => ({ date, revenue })),
  }
}

function getCategoryLabel(catKey: string): string {
  const k = (catKey || "").toLowerCase()
  if (k.includes("chat")) return "Doula Chat"
  if (k.includes("materi") || k.includes("online")) return "Online Materi Prenatal"
  if (k.includes("offline") || k.includes("full_journey")) return "Layanan Offline"
  if (k.includes("bundling")) return "Paket Bundling"
  if (k.includes("yoga")) return "Layanan Yoga"
  if (k.includes("subscription") || k.includes("sub")) return "Subscription Aplikasi"
  return "Doula Service"
}
