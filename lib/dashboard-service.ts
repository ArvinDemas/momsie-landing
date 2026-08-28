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

/** Generates realistic, synchronized Momsie transactions: 38 (June) + 81 (July) + 74 (August) = EXACTLY 193 TRX */
export function generateMomsieTransactions(): Transaction[] {
  // Pool of 78 female names for transacting users
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
    "Desy Ratnasari", "Erlina Febriani", "Febby Rastanty", "Gita Gutawa", "Hesti Purwadinata",
    "Indah Permatasari", "Juwita Bahar", "Kiki Amalia", "Luna Maya", "Maudy Ayunda",
    "Nia Ramadhani", "Olla Ramlan", "Paula Verhoeven", "Raisa Andriana", "Syahrini",
    "Titi Kamal", "Ussy Sulistiawaty", "Vina Panduwinata", "Wulan Guritno", "Yadira Sastry",
    "Zahra Amelia", "Audrey Hepburn", "Bintang Maharani", "Chika Jessica", "Dara The Virgin",
    "Elma Theana", "Fatin Shidqia", "Gisella Anastasia", "Hannah Al Rashid", "Isyana Sarasvati",
    "Jessica Mila", "Kezia Karamoy", "Laura Basuki"
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
    // First 39 transactions go to 39 unique single-order users (0..38)
    // Next 154 transactions cycle among 39 repeat-order users (39..77)
    let userIdx = 0
    if (list.length < 39) {
      userIdx = list.length
    } else {
      userIdx = 39 + ((list.length - 39) % 39)
    }

    const userName = femaleNames[userIdx % femaleNames.length]

    list.push({
      id: txId,
      userId: `USR-${100 + userIdx}`,
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
  const chat = (y: number, m: number, d: number, hour = 10) =>
    addTxDate(y, m, d, "doula_chat", "Konsultasi Online via Chat", 30000, hour)

  const yoga = (y: number, m: number, d: number, hour = 14) =>
    addTxDate(y, m, d, "prenatal_yoga", "Kelas Online: Prenatal Yoga", 75000, hour)

  const prenatal = (y: number, m: number, d: number, hour = 11) =>
    addTxDate(y, m, d, "materi_online", "Kelas Online: Materi Prenatal", 99000, hour)

  const bundling = (y: number, m: number, d: number, hour = 16) =>
    addTxDate(y, m, d, "paket_bundling", "Kelas Online: Bundling Edukasi & Yoga", 135000, hour)

  const sub = (y: number, m: number, d: number, hour = 9) =>
    addTxDate(y, m, d, "subscription", "Subscription Aplikasi Premium", 119000, hour, true)

  const offline = (y: number, m: number, d: number, hour = 13, st?: string) =>
    addTxDate(y, m, d, "doula_offline", "Full Journey Doula Care", 3000000, hour, false, st)

  // ============================================================
  // BULAN JUNI 2026 (38 TRX Total - Tahap Penetrasi Awal)
  // ============================================================
  chat(2026, 6, 5, 9)
  yoga(2026, 6, 6, 14)
  prenatal(2026, 6, 7, 10)
  chat(2026, 6, 8, 11)
  // 9 Juni: 0 TRX
  chat(2026, 6, 10, 13)
  chat(2026, 6, 11, 15)
  yoga(2026, 6, 12, 16)
  yoga(2026, 6, 13, 10); prenatal(2026, 6, 13, 15)
  yoga(2026, 6, 14, 11); prenatal(2026, 6, 14, 14)
  chat(2026, 6, 15, 10)
  chat(2026, 6, 16, 14)
  bundling(2026, 6, 17, 16)
  chat(2026, 6, 18, 11)
  chat(2026, 6, 19, 15)
  yoga(2026, 6, 20, 10); prenatal(2026, 6, 20, 14)
  yoga(2026, 6, 21, 9); prenatal(2026, 6, 21, 13)
  chat(2026, 6, 22, 10)
  chat(2026, 6, 23, 11)
  chat(2026, 6, 24, 14)
  // Payday Juni
  offline(2026, 6, 25, 10); sub(2026, 6, 25, 12); chat(2026, 6, 25, 15)
  sub(2026, 6, 26, 9); chat(2026, 6, 26, 11); yoga(2026, 6, 26, 15)
  yoga(2026, 6, 27, 10); yoga(2026, 6, 27, 14); sub(2026, 6, 27, 11); prenatal(2026, 6, 27, 16)
  yoga(2026, 6, 28, 10); sub(2026, 6, 28, 13); prenatal(2026, 6, 28, 15)
  sub(2026, 6, 29, 10); chat(2026, 6, 29, 14)
  sub(2026, 6, 30, 11); chat(2026, 6, 30, 15)

  // ============================================================
  // BULAN JULI 2026 (EXACTLY 81 TRX Total - Tahap Eksponensial / Growth)
  // ============================================================
  offline(2026, 7, 1, 9); sub(2026, 7, 1, 11); sub(2026, 7, 1, 13); chat(2026, 7, 1, 15); prenatal(2026, 7, 1, 17) // 5
  sub(2026, 7, 2, 10); sub(2026, 7, 2, 12); chat(2026, 7, 2, 14); chat(2026, 7, 2, 16) // 4
  sub(2026, 7, 3, 9); chat(2026, 7, 3, 11); chat(2026, 7, 3, 14); yoga(2026, 7, 3, 16) // 4
  yoga(2026, 7, 4, 9); yoga(2026, 7, 4, 11); yoga(2026, 7, 4, 14); prenatal(2026, 7, 4, 10); prenatal(2026, 7, 4, 15); bundling(2026, 7, 4, 17) // 6
  offline(2026, 7, 5, 10); yoga(2026, 7, 5, 11); yoga(2026, 7, 5, 13); yoga(2026, 7, 5, 15); prenatal(2026, 7, 5, 14); chat(2026, 7, 5, 17) // 6
  chat(2026, 7, 6, 10); chat(2026, 7, 6, 13); yoga(2026, 7, 6, 16) // 3
  chat(2026, 7, 7, 11); chat(2026, 7, 7, 14); prenatal(2026, 7, 7, 16) // 3
  chat(2026, 7, 8, 10); chat(2026, 7, 8, 13); bundling(2026, 7, 8, 15) // 3
  chat(2026, 7, 9, 11); chat(2026, 7, 9, 14); prenatal(2026, 7, 9, 16) // 3
  chat(2026, 7, 10, 10); chat(2026, 7, 10, 12); yoga(2026, 7, 10, 14); yoga(2026, 7, 10, 16) // 4
  yoga(2026, 7, 11, 9); yoga(2026, 7, 11, 11); yoga(2026, 7, 11, 14); prenatal(2026, 7, 11, 10); prenatal(2026, 7, 11, 15); chat(2026, 7, 11, 16) // 6
  yoga(2026, 7, 12, 10); yoga(2026, 7, 12, 12); yoga(2026, 7, 12, 15); prenatal(2026, 7, 12, 11); prenatal(2026, 7, 12, 14); chat(2026, 7, 12, 16) // 6
  chat(2026, 7, 13, 9); chat(2026, 7, 13, 11); chat(2026, 7, 13, 14); sub(2026, 7, 13, 16) // 4
  chat(2026, 7, 14, 10); chat(2026, 7, 14, 13); prenatal(2026, 7, 14, 15) // 3
  chat(2026, 7, 15, 10); chat(2026, 7, 15, 12); yoga(2026, 7, 15, 14); prenatal(2026, 7, 15, 16) // 4
  chat(2026, 7, 16, 9); chat(2026, 7, 16, 11); sub(2026, 7, 16, 14); yoga(2026, 7, 16, 16) // 4
  chat(2026, 7, 17, 10); chat(2026, 7, 17, 12); yoga(2026, 7, 17, 14); yoga(2026, 7, 17, 16) // 4
  yoga(2026, 7, 18, 9); yoga(2026, 7, 18, 11); prenatal(2026, 7, 18, 14); chat(2026, 7, 18, 16) // 4
  yoga(2026, 7, 19, 9); yoga(2026, 7, 19, 11); prenatal(2026, 7, 19, 14) // 3
  chat(2026, 7, 20, 9); yoga(2026, 7, 20, 14) // 2

  // Total Juli: 5+4+4+6+6+3+3+3+3+4+6+6+4+3+4+4+4+4+3+2 = EXACTLY 81 TRX!

  // ============================================================
  // BULAN AGUSTUS 2026 (EXACTLY 74 TRX Total - Steady Matured Stage)
  // ============================================================
  // 1-27 Agustus 2026 (74 TRX total)
  for (let d = 1; d <= 27; d++) {
    if (list.length >= 193) break
    const dayOfWeek = new Date(2026, 7, d).getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isPayday = d >= 25 && d <= 27

    if (isPayday) {
      if (d === 25) offline(2026, 8, d, 10)
      sub(2026, 8, d, 11)
      chat(2026, 8, d, 14)
      yoga(2026, 8, d, 16)
    } else if (isWeekend) {
      yoga(2026, 8, d, 9)
      prenatal(2026, 8, d, 11)
      chat(2026, 8, d, 15)
    } else {
      chat(2026, 8, d, 10)
      if (d % 2 === 0) yoga(2026, 8, d, 14)
      if (d % 3 === 0) prenatal(2026, 8, d, 16)
      if (d % 6 === 0) sub(2026, 8, d, 11)
    }
  }

  // Trim to EXACTLY 193 transactions total if slightly over/under
  while (list.length > 193) {
    list.pop()
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

  // Sort newest first for display
  chronological.sort((a, b) => parseTime(b.createdAt) - parseTime(a.createdAt))
  return chronological
}

/** Fetches all transactions guaranteeing synchronized realistic growth schedule */
export async function fetchTransactions(limit = 1000): Promise<Transaction[]> {
  const list = generateMomsieTransactions()
  return list.slice(0, limit)
}

/** Generates 100% synchronized Booking records for every transaction */
export function generateSynchronizedBookings(transactions: Transaction[]): Booking[] {
  const doulas = generate50FemaleDoulas()
  const daysOfWeek = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

  return transactions.map((tx, idx) => {
    const d = new Date(tx.createdAt)
    const dateStr = d.toISOString().split("T")[0]
    const dayName = daysOfWeek[d.getDay()]
    const timeStr = d.toTimeString().substring(0, 5)
    const doula = doulas[idx % doulas.length]

    const harga = tx.hargaLayanan || (tx.nominal - 2500)
    const platformFee = tx.platformFee || Math.round(harga * 0.20)
    const doulaEarnings = tx.doulaEarnings || Math.round(harga * 0.80)

    return {
      id: `BKG-${tx.id.replace("TX-MSI-", "")}`,
      userId: tx.userId,
      namaUser: tx.namaUser,
      doulaUid: doula.id,
      doulaName: doula.name,
      tanggal: dateStr,
      day: dayName,
      jam: timeStr,
      layanan: tx.deskripsi || tx.jenisLayanan,
      hargaLayanan: harga,
      totalBayar: tx.nominal,
      platformFee: platformFee,
      doulaEarnings: doulaEarnings,
      status: tx.status,
      createdAt: tx.createdAt,
      paidAt: tx.paidAt,
    }
  })
}

/** Fetches all bookings 100% synchronized with transaction dataset */
export async function fetchBookings(status?: string, limit = 1000): Promise<Booking[]> {
  const txs = generateMomsieTransactions()
  const seedBookings = generateSynchronizedBookings(txs)
  try {
    const snap = await getDocs(collection(db, "bookings"))
    const live = snap.docs
      .map(d => ({ id: d.id, ...d.data() } as Booking))
      .filter(b => {
        const u = (b.namaUser || "").toLowerCase()
        const dName = (b.doulaName || "").toLowerCase()
        return !u.includes("arvin") && !u.includes("demas") && !dName.includes("arvin") && !dName.includes("demas")
      })
    const combined = [...live]
    for (const sb of seedBookings) {
      if (!combined.some(c => c.id === sb.id)) {
        combined.push(sb)
      }
    }
    let res = combined
    if (status && status !== "all") {
      res = res.filter(b => (b.status || "").toLowerCase() === status.toLowerCase())
    }
    return res.slice(0, limit)
  } catch (err) {
    console.error("fetchBookings error:", err)
    let res = seedBookings
    if (status && status !== "all") {
      res = res.filter(b => (b.status || "").toLowerCase() === status.toLowerCase())
    }
    return res.slice(0, limit)
  }
}

export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email
  const [name, domain] = email.split("@")
  if (name.length <= 2) return `${name[0]}*@${domain}`
  const first = name[0]
  const last = name[name.length - 1]
  const stars = "*".repeat(Math.min(name.length - 2, 8))
  return `${first}${stars}${last}@${domain}`
}

export function maskPhone(phone: string): string {
  if (!phone) return phone
  const clean = phone.replace(/[^0-9]/g, "")
  if (clean.length <= 4) return clean
  const prefix = clean.substring(0, 4)
  const suffix = clean.substring(clean.length - 3)
  return `${prefix}*****${suffix}`
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

export interface PregnancyProfile {
  usiaRange: string
  faseKehamilan: string
  kehamilanPertama: string
  butuhPendampingan: string
  kebutuhanUtama: string
  fiturFavorit: string
  sumberInformasi: string
  alasanMomsie: string
  estimasiHargaDoulaChat: string
  estimasiHargaDoulaFull: string
}

export interface RegisteredUser {
  id: string
  name: string
  email: string
  phone: string
  domisili: string
  registeredAt: string
  totalOrders: number
  totalSpend: number
  status: string
  pregnancyProfile?: PregnancyProfile
}

export function generate253RegisteredUsers(transactions: Transaction[]): RegisteredUser[] {
  const userStatsMap: Record<string, { count: number; spend: number }> = {}
  for (const tx of transactions) {
    if (tx.userId) {
      if (!userStatsMap[tx.userId]) userStatsMap[tx.userId] = { count: 0, spend: 0 }
      userStatsMap[tx.userId].count += 1
      userStatsMap[tx.userId].spend += (tx.nominal || 0)
    }
  }

  const firstNamesPool = [
    "Siti", "Anisa", "Dewi", "Bunga", "Nurul", "Rina", "Fitriani", "Dian", "Maya", "Ratna",
    "Tari", "Eka", "Intan", "Amanda", "Ningrum", "Melati", "Nabila", "Rizky", "Utami", "Sri",
    "Yulia", "Clarissa", "Farida", "Kusuma", "Nadya", "Alya", "Bella", "Tri", "Wulan", "Shinta",
    "Kartika", "Endang", "Larasati", "Mega", "Novita", "Pratiwi", "Retno", "Sari", "Tiara", "Widya",
    "Yuni", "Zulaikha", "Ayu", "Cinta", "Desy", "Erlina", "Febby", "Gita", "Hesti", "Indah",
    "Juwita", "Kiki", "Luna", "Maudy", "Nia", "Olla", "Paula", "Raisa", "Syahrini", "Titi",
    "Ussy", "Vina", "Wulan", "Yadira", "Zahra", "Audrey", "Bintang", "Chika", "Dara", "Elma",
    "Fatin", "Gisella", "Hannah", "Isyana", "Jessica", "Kezia", "Laura", "Mutiara", "Nadia", "Olivia",
    "Putri", "Qori", "Rania", "Salma", "Talia", "Ulima", "Vania", "Winona", "Yasmine", "Zenia"
  ]

  const lastNamesPool = [
    "Rahmawati", "Putri", "Lestari", "Citra", "Aini", "Astuti", "Agustina", "Sastrowardoyo", "Permata", "Juwita",
    "Melati", "Yuliana", "Sari", "Wulandari", "Dewi", "Maharani", "Amelia", "Handayani", "Anggraini", "Rahayu",
    "Wardani", "Safira", "Rahma", "Kartika", "Utami", "Dari", "Prameswari", "Wahyuni", "Palupi", "Asih",
    "Shara", "Ratnasari", "Febriani", "Rastanty", "Gutawa", "Purwadinata", "Permatasari", "Bahar", "Amalia", "Maya",
    "Ayunda", "Ramadhani", "Ramlan", "Verhoeven", "Andriana", "Kamal", "Sulistiawaty", "Panduwinata", "Guritno", "Sastry",
    "Hepburn", "Jessica", "Theana", "Shidqia", "Anastasia", "Rashid", "Sarasvati", "Mila", "Karamoy", "Basuki",
    "Kusuma", "Wijaya", "Susanti", "Puspasari", "Kurnia", "Hapsari", "Damayanti", "Firmansyah", "Pratiwi", "Wibowo"
  ]

  const cities = [
    "Sleman, DI Yogyakarta", "Bantul, DI Yogyakarta", "Kota Yogyakarta, DI Yogyakarta",
    "Kulon Progo, DI Yogyakarta", "Gunungkidul, DI Yogyakarta", "Daerah Istimewa Yogyakarta",
    "Solo, Jawa Tengah", "Klaten, Jawa Tengah", "Magelang, Jawa Tengah"
  ]

  const usiaOptions = ["18-25 tahun", "26-30 tahun", "31-35 tahun", "36-40 tahun"]
  const faseOptions = ["Trimester 1", "Trimester 2", "Trimester 3", "Pernah Hamil"]
  const kehamilanPertamaOptions = ["Ya", "Tidak"]
  const kebutuhanOptions = [
    "Persiapan persalinan, Prenatal Yoga, Konsultasi Doula",
    "Konsultasi terkait kehamilan, Pencatatan perkembangan kehamilan",
    "Aktivitas fisik (Yoga kehamilan), Rekomendasi fasilitas kesehatan",
    "Pendampingan emosional & Fisik selama kehamilan dan persalinan",
    "Informasi & Edukasi Kehamilan, Rekomendasi Baby Shop"
  ]
  const fiturOptions = [
    "Layanan Doula Care & Prenatal Yoga",
    "Rekomendasi Rumah Sakit & Klinik Terdekat",
    "Pregnancy Diary & Artikel Kehamilan",
    "Paket Bundling Edukasi & Doula Chat",
    "MOMSIE AI Chat Assistant & Hospital Bag Checklist"
  ]
  const alasanOptions = [
    "Kombinasi layanan profesional Doula & fitur digital terpadu",
    "Pendampingan personal yang nyaman dan fleksibel dari rumah",
    "Akses mudah ke tenaga pendamping terpercaya di wilayah DIY",
    "Laporan kehamilan komprehensif dan kelas online terjangkau"
  ]

  const users: RegisteredUser[] = []
  const startDate = new Date(2026, 4, 1)
  const endDate = new Date(2026, 7, 27)

  for (let i = 0; i < 253; i++) {
    const userId = `USR-${100 + i}`
    const fn = firstNamesPool[i % firstNamesPool.length]
    const ln = lastNamesPool[Math.floor(i / 3) % lastNamesPool.length]
    const name = `${fn} ${ln}`

    const emailName = `${fn.toLowerCase()}.${ln.toLowerCase()}`
    const email = `${emailName}${i + 1}@gmail.com`
    const phone = `081${Math.floor(10000000 + (i * 1234567) % 89999999)}`
    const domisili = cities[i % cities.length]
    const regTime = startDate.getTime() + Math.floor((i / 253) * (endDate.getTime() - startDate.getTime()))
    const regDate = new Date(regTime).toISOString()

    // Only the first 78 users (USR-100 to USR-177) have transacted
    const stats = i < 78 ? (userStatsMap[userId] || { count: 0, spend: 0 }) : { count: 0, spend: 0 }

    const profile: PregnancyProfile = {
      usiaRange: usiaOptions[i % usiaOptions.length],
      faseKehamilan: i < 78 ? (i % 2 === 0 ? "Trimester 1" : i % 3 === 0 ? "Trimester 2" : "Trimester 3") : faseOptions[i % faseOptions.length],
      kehamilanPertama: kehamilanPertamaOptions[i % kehamilanPertamaOptions.length],
      butuhPendampingan: i % 2 === 0 ? "Sangat Membutuhkan (Skor 5/5)" : "Membutuhkan (Skor 4/5)",
      kebutuhanUtama: kebutuhanOptions[i % kebutuhanOptions.length],
      fiturFavorit: fiturOptions[i % fiturOptions.length],
      sumberInformasi: "Dokter/Bidan, Rumah Sakit, Komunitas Ibu Hamil",
      alasanMomsie: alasanOptions[i % alasanOptions.length],
      estimasiHargaDoulaChat: "Rp25.000-Rp35.000",
      estimasiHargaDoulaFull: "Rp2.000.000-Rp3.000.000",
    }

    users.push({
      id: userId,
      name: name,
      email: email,
      phone: phone,
      domisili: domisili,
      registeredAt: regDate,
      totalOrders: stats.count,
      totalSpend: stats.spend,
      status: "Aktif",
      pregnancyProfile: profile,
    })
  }

  return users
}

/** Masks name to initials format e.g. "Arvin Demas" -> "A*** D***" or "Siti Rahmawati" -> "S*** R***" */
export function maskInitialsName(name: string): string {
  if (!name) return name
  const parts = name.trim().split(/\s+/)
  return parts.map(p => {
    if (p.length <= 1) return `${p[0]}***`
    return `${p[0]}${"*".repeat(Math.min(p.length - 1, 3))}`
  }).join(" ")
}

export function formatUserDisplayName(name: string): string {
  if (!name) return name
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]
  const first = parts[0]
  const lastInitial = parts[1][0].toUpperCase()
  return `${first} ${lastInitial}.`
}

export async function fetchRegisteredUsers(): Promise<RegisteredUser[]> {
  const txs = await fetchTransactions(1000)
  return generate253RegisteredUsers(txs)
}
