import { initializeApp } from "firebase/app"
import { getFirestore, writeBatch, doc, Timestamp } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB3n4J9sv2hSWJKLhbBj2DZR3y5SUZMa3g",
  authDomain: "momsie-app.firebaseapp.com",
  projectId: "momsie-app",
  storageBucket: "momsie-app.firebasestorage.app",
  messagingSenderId: "5481212381",
  appId: "1:5481212381:web:b15aed69a1eb27516c6e34",
  measurementId: "G-6X123MG73V",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const firstNames = [
  "Siti", "Annisa", "Dewi", "Rina", "Novi", "Maya", "Dian", "Fitri", "Indah", "Bunga",
  "Putri", "Sarah", "Tari", "Winda", "Yulia", "Eka", "Lestari", "Mega", "Nita", "Ratna",
  "Sri", "Tri", "Utami", "Widya", "Ayu", "Citra", "Desi", "Elisa", "Fani", "Gita",
  "Hani", "Ika", "Juli", "Kartika", "Lina", "Marlina", "Nadia", "Oliva", "Priscila", "Ria",
  "Aulia", "Bella", "Clarissa", "Dahlia", "Elma", "Febi", "Grace", "Hesti", "Irma", "Jasmine"
]

const lastNames = [
  "Rahmawati", "Lestari", "Permata", "Anggraini", "Susanti", "Kusuma", "Wijaya", "Suryani",
  "Kartika", "Handayani", "Maharani", "Safitri", "Utami", "Wulandari", "Pratiwi", "Hidayah",
  "Saputri", "Nurhaliza", "Kurnia", "Puspita", "Anggita", "Syahrini", "Wahyuni", "Febriani"
]

const domains = ["gmail.com", "yahoo.com", "outlook.com"]

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomTimestamp(startMonthOffset, endMonthOffset) {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - startMonthOffset, 1).getTime()
  const end = new Date(now.getFullYear(), now.getMonth() - endMonthOffset, 28).getTime()
  const randomTime = start + Math.random() * (end - start)
  return Timestamp.fromDate(new Date(randomTime))
}

function generateUID() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < 28; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

async function seedUsers() {
  console.log("🚀 Memulai penambahan 1.000 user ke Firestore Firebase...")

  const totalUsers = 1000
  const batchSize = 500
  let inserted = 0

  for (let b = 0; b < totalUsers; b += batchSize) {
    const batch = writeBatch(db)
    const currentBatchCount = Math.min(batchSize, totalUsers - b)

    for (let i = 0; i < currentBatchCount; i++) {
      const uid = generateUID()
      const firstName = getRandomElement(firstNames)
      const lastName = getRandomElement(lastNames)
      const fullName = `${firstName} ${lastName}`
      const cleanName = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 999)}`
      const email = `${cleanName}@${getRandomElement(domains)}`
      const lastLogin = getRandomTimestamp(6, 0)
      const createdAt = getRandomTimestamp(8, 6)

      const userRef = doc(db, "users", uid)
      batch.set(userRef, {
        uid,
        name: fullName,
        email,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanName}`,
        createdAt,
        lastLogin,
        source: "pameran",
      })
    }

    await batch.commit()
    inserted += currentBatchCount
    console.log(`✅ Berhasil mengirim ${inserted}/${totalUsers} user ke Firestore!`)
  }

  console.log("🎉 SELESAI SANGAT BERHASIL! 1.000 user dummy nyata telah tersimpan di Firebase Firestore!")
  process.exit(0)
}

seedUsers().catch((err) => {
  console.error("❌ Gagal seeding data:", err)
  process.exit(1)
})
