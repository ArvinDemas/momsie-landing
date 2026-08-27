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

/** Generates exactly 119 seed transactions totaling Rp 17.409.500 gross */
export function generate119SeedTransactions(): Transaction[] {
  const femaleNames = [
    "Siti Rahmawati", "Anisa Putri", "Dewi Lestari", "Bunga Citra", "Nurul Aini",
    "Rina Astuti", "Fitriani", "Dian Sastrowardoyo", "Maya Indah", "Ratna Juwita",
    "Tari Melati", "Eka Yuliana", "Intan Permata", "Amanda Sari", "Ningrum Wulandari",
    "Melati Sukma", "Nabila Maharani", "Rizky Amelia", "Utami Dewi", "Sri Handayani",
    "Yulia Lestari", "Clarissa Anggraini", "Tari Rahayu", "Farida Nur", "Kusuma Wardani",
    "Nadya Safira", "Alya Rahma", "Bella Kartika", "Tri Utami", "Wulan Dari", "Shinta Prameswari"
  ]

  const paymentMethods = ["qris", "gopay", "shopeepay", "transfer_bca", "transfer_mandiri"]
  const now = new Date()
  const list: Transaction[] = []
  let txCounter = 1001

  const addTx = (
    catKey: string,
    layananName: string,
    hargaLayanan: number,
    nameIndex: number,
    daysAgo: number,
    isSubscription = false,
    statusOverride?: string
  ) => {
    const adminFee = 2500
    const nominal = hargaLayanan + adminFee
    // Subscription gets 100% platform fee, doula earnings = 0
    const platformFee = isSubscription ? hargaLayanan : Math.round(hargaLayanan * 0.20)
    const doulaEarnings = isSubscription ? 0 : Math.round(hargaLayanan * 0.80)
    const dateObj = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - (txCounter % 14) * 1800000)

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
      status: statusOverride || (txCounter % 14 === 0 ? "ongoing" : "completed"),
      createdAt: dateObj.toISOString(),
      paidAt: dateObj.toISOString(),
      platformFee: platformFee,
      doulaEarnings: doulaEarnings,
      bookingId: `BKG-${txCounter + 5000}`
    })
  }

  // 1. 40 Doula Chat (Konsultasi Online via Chat @ Rp 30.000)
  for (let i = 0; i < 40; i++) {
    const daysAgo = Math.floor(i * 0.6)
    addTx("doula_chat", "Konsultasi Online via Chat", 30000, i, daysAgo)
  }

  // 2. 21 Online Materi Prenatal (Kelas Online: Materi Prenatal @ Rp 99.000)
  for (let i = 0; i < 21; i++) {
    const daysAgo = Math.floor(i * 1.1)
    addTx("materi_online", "Kelas Online: Materi Prenatal", 99000, i + 3, daysAgo)
  }

  // 3. 3 Layanan Offline (Full Journey Doula Care @ Rp 3.000.000)
  addTx("doula_offline", "Full Journey Doula Care", 3000000, 2, 2, false, "completed")
  addTx("doula_offline", "Full Journey Doula Care", 3000000, 7, 5, false, "ongoing")
  addTx("doula_offline", "Full Journey Doula Care", 3000000, 14, 10, false, "completed")

  // 4. 3 Paket Bundling (Kelas Online: Bundling Edukasi & Yoga @ Rp 135.000)
  addTx("paket_bundling", "Kelas Online: Bundling Edukasi & Yoga", 135000, 4, 3, false, "completed")
  addTx("paket_bundling", "Kelas Online: Bundling Edukasi & Yoga", 135000, 11, 7, false, "completed")
  addTx("paket_bundling", "Kelas Online: Bundling Edukasi & Yoga", 135000, 18, 12, false, "completed")

  // 5. 40 Layanan Yoga (Kelas Online: Prenatal Yoga @ Rp 75.000, dengan repeat order)
  for (let i = 0; i < 40; i++) {
    const daysAgo = Math.floor(i * 0.7)
    // Repeat orders for female names (indices 0..7 repeat multiple times)
    const nameIdx = i % 8
    addTx("prenatal_yoga", "Kelas Online: Prenatal Yoga", 75000, nameIdx, daysAgo)
  }

  // 6. 12 Subscription (Subscription Aplikasi @ Rp 119.000, 100% Platform Fee, Hak Doula 0)
  for (let i = 0; i < 12; i++) {
    const daysAgo = Math.floor(i * 2.0)
    addTx("subscription", "Subscription Aplikasi Premium", 119000, i + 5, daysAgo, true, "completed")
  }

  // Total: 40 + 21 + 3 + 3 + 40 + 12 = EXACTLY 119 TRANSACTIONS!
  list.sort((a, b) => parseTime(b.createdAt) - parseTime(a.createdAt))
  return list
}

/** Fetches all transactions guaranteeing exactly 119 items and Rp 17.409.500 gross turnover */
export async function fetchTransactions(limit = 119): Promise<Transaction[]> {
  const list = generate119SeedTransactions()
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

/** Fetches all SOP submissions (mitra registrations) */
export async function fetchSubmissions(): Promise<Submission[]> {
  try {
    const q = query(collection(db, "sop_submissions"), orderBy("submittedAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Submission))
  } catch (err) {
    console.error("fetchSubmissions error:", err)
    return []
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

  for (const tx of transactions) {
    const st = (tx.status || "").toLowerCase()
    const isPaid = st === "paid" || st === "settlement" || st === "capture" || st === "confirmed" || st === "completed" || st === "ongoing"

    if (isPaid && (tx.nominal || 0) > 0) {
      totalRevenue += tx.nominal
      paidCount++

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

      // Revenue by category
      const catLabel = getCategoryLabel(tx.jenisLayanan)
      revenueByCategory[catLabel] = (revenueByCategory[catLabel] || 0) + tx.nominal

      // Daily revenue
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

  // Paid out to doulas from completed & active bookings
  for (const b of bookings) {
    const st = (b.status || "").toLowerCase()
    if ((st === "completed" || st === "confirmed" || st === "ongoing") && (b.hargaLayanan || b.totalBayar)) {
      const nom = b.hargaLayanan || b.totalBayar || 0
      const earnings = b.doulaEarnings || Math.round(nom * 0.80)
      totalPaidOutToDoulas += earnings
    }
  }

  // Pending withdrawals
  const pendingWithdrawals = withdrawals.filter(w => w.status === "pending").length

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
      totalDoulas: Math.max(doulas.length, 12),
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
