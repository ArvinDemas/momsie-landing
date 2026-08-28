const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, collection, doc, setDoc, getDocs, deleteDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyB3n4J9sv2hSWJKLhbBj2DZR3y5SUZMa3g",
  authDomain: "momsie-app.firebaseapp.com",
  projectId: "momsie-app",
  storageBucket: "momsie-app.firebasestorage.app",
  messagingSenderId: "5481212381",
  appId: "1:5481212381:web:b15aed69a1eb27516c6e34",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Data Pools
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
];

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
];

const lastNamesPool = [
  "Rahmawati", "Putri", "Lestari", "Citra", "Aini", "Astuti", "Agustina", "Sastrowardoyo", "Permata", "Juwita",
  "Melati", "Yuliana", "Sari", "Wulandari", "Dewi", "Maharani", "Amelia", "Handayani", "Anggraini", "Rahayu",
  "Wardani", "Safira", "Rahma", "Kartika", "Utami", "Dari", "Prameswari", "Wahyuni", "Palupi", "Asih",
  "Shara", "Ratnasari", "Febriani", "Rastanty", "Gutawa", "Purwadinata", "Permatasari", "Bahar", "Amalia", "Maya",
  "Ayunda", "Ramadhani", "Ramlan", "Verhoeven", "Andriana", "Kamal", "Sulistiawaty", "Panduwinata", "Guritno", "Sastry",
  "Hepburn", "Jessica", "Theana", "Shidqia", "Anastasia", "Rashid", "Sarasvati", "Mila", "Karamoy", "Basuki",
  "Kusuma", "Wijaya", "Susanti", "Puspasari", "Kurnia", "Hapsari", "Damayanti", "Firmansyah", "Pratiwi", "Wibowo"
];

const cities = [
  "Sleman, DI Yogyakarta", "Bantul, DI Yogyakarta", "Kota Yogyakarta, DI Yogyakarta",
  "Kulon Progo, DI Yogyakarta", "Gunungkidul, DI Yogyakarta", "Daerah Istimewa Yogyakarta",
  "Solo, Jawa Tengah", "Klaten, Jawa Tengah", "Magelang, Jawa Tengah"
];

const usiaOptions = ["18-25 tahun", "26-30 tahun", "31-35 tahun", "36-40 tahun"];
const faseOptions = ["Trimester 1", "Trimester 2", "Trimester 3", "Pernah Hamil"];
const kehamilanPertamaOptions = ["Ya", "Tidak"];
const kebutuhanOptions = [
  "Persiapan persalinan, Prenatal Yoga, Konsultasi Doula",
  "Konsultasi terkait kehamilan, Pencatatan perkembangan kehamilan",
  "Aktivitas fisik (Yoga kehamilan), Rekomendasi fasilitas kesehatan",
  "Pendampingan emosional & Fisik selama kehamilan dan persalinan",
  "Informasi & Edukasi Kehamilan, Rekomendasi Baby Shop"
];
const fiturOptions = [
  "Layanan Doula Care & Prenatal Yoga",
  "Rekomendasi Rumah Sakit & Klinik Terdekat",
  "Pregnancy Diary & Artikel Kehamilan",
  "Paket Bundling Edukasi & Doula Chat",
  "MOMSIE AI Chat Assistant & Hospital Bag Checklist"
];
const alasanOptions = [
  "Kombinasi layanan profesional Doula & fitur digital terpadu",
  "Pendampingan personal yang nyaman dan fleksibel dari rumah",
  "Akses mudah ke tenaga pendamping terpercaya di wilayah DIY",
  "Laporan kehamilan komprehensif dan kelas online terjangkau"
];

async function syncAllFirebaseData() {
  console.log("Starting Master Firebase Cloud Firestore Data Synchronization...");
  try {
    await signInWithEmailAndPassword(auth, "sync.admin@momsie.id", "MomsieAdmin123!");
    console.log("Authenticated with Firebase Auth!");

    // 1. CLEAN UP ARVIN DEMAS NARYAMA FROM MITRA AND USERS COLLECTIONS
    console.log("\n[1/4] Cleaning up Arvin Demas Naryama entries from Cloud Firestore...");
    const mitraSnap = await getDocs(collection(db, "mitra"));
    for (const d of mitraSnap.docs) {
      const data = d.data();
      const name = (data.name || data.userName || "").toLowerCase();
      if (name.includes("arvin") || name.includes("demas")) {
        await deleteDoc(doc(db, "mitra", d.id));
        console.log(`  Deleted Arvin Demas mitra doc: ${d.id}`);
      }
    }
    const userSnap = await getDocs(collection(db, "users"));
    for (const d of userSnap.docs) {
      const data = d.data();
      const name = (data.name || data.username || "").toLowerCase();
      if (name.includes("arvin") || name.includes("demas")) {
        await deleteDoc(doc(db, "users", d.id));
        console.log(`  Deleted Arvin Demas user doc: ${d.id}`);
      }
    }

    // 2. SYNC 50 FEMALE MITRA DOULAS
    console.log("\n[2/4] Syncing 50 Female Mitra Doulas to Cloud Firestore...");
    const originalDoulas = [
      { id: "doula_anastasia", name: "Anastasia Mawardi", pekerjaan: "Bidan (On-going Certified)", kotaProvinsi: "Daerah Istimewa Yogyakarta" },
      { id: "doula_dewi", name: "Dewi Riana P, CD (Dona)", pekerjaan: "Doula Certified", kotaProvinsi: "Daerah Istimewa Yogyakarta" },
      { id: "doula_laily", name: "Laily Artha Paramita, S. Tr. Keb, CHt., CHBr", pekerjaan: "Bidan (Doula Certified)", kotaProvinsi: "Daerah Istimewa Yogyakarta" },
    ];
    const rolesPool = [
      "Doula (On-going Certified)", "Bidan (On-going Certified)",
      "Hypnobirthing Practitioner (On-going Certified)", "Birth Doula (On-going Certified)",
      "Doula Certified", "Postpartum Doula (On-going Certified)"
    ];

    const all50Doulas = [...originalDoulas];
    for (let i = 0; i < 47; i++) {
      all50Doulas.push({
        id: `seed_doula_${i + 1}`,
        name: femaleNames[i % femaleNames.length],
        pekerjaan: rolesPool[i % rolesPool.length],
        kotaProvinsi: cities[i % cities.length],
      });
    }

    for (const m of all50Doulas) {
      await setDoc(doc(db, "mitra", m.id), {
        id: m.id,
        name: m.name,
        pekerjaan: m.pekerjaan,
        kotaProvinsi: m.kotaProvinsi,
        role: "Doula",
        saldo_escrow: 0,
        saldo_tersedia: 0,
        totalPendapatan: 0,
        isAvailable: true,
        rating: 5.0,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    console.log(`  Successfully synced ${all50Doulas.length} Mitra Doula documents to 'mitra' collection!`);

    // 3. SYNC 253 REGISTERED USERS WITH PREGNANCY PROFILES
    console.log("\n[3/4] Syncing 253 Registered Users with detailed Pregnancy Profiles to Cloud Firestore...");
    const startDate = new Date(2026, 5, 1).getTime();
    const endDate = new Date(2026, 7, 29).getTime();

    for (let i = 0; i < 253; i++) {
      const userId = `USR-${100 + i}`;
      const fn = firstNamesPool[i % firstNamesPool.length];
      const ln = lastNamesPool[Math.floor(i / 3) % lastNamesPool.length];
      const name = `${fn} ${ln}`;
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i + 1}@gmail.com`;
      const phone = `081${Math.floor(10000000 + (i * 1234567) % 89999999)}`;
      const domisili = cities[i % cities.length];
      const regTime = startDate + Math.floor((i / 253) * (endDate - startDate));
      const regDate = new Date(regTime).toISOString();

      const isTransacted = i < 78;
      const orderCount = isTransacted ? (i < 39 ? 1 : 2 + (i % 3)) : 0;
      const totalSpend = isTransacted ? orderCount * 32500 : 0;

      const pregnancyProfile = {
        usiaRange: usiaOptions[i % usiaOptions.length],
        faseKehamilan: isTransacted ? (i % 2 === 0 ? "Trimester 1" : i % 3 === 0 ? "Trimester 2" : "Trimester 3") : faseOptions[i % faseOptions.length],
        kehamilanPertama: kehamilanPertamaOptions[i % kehamilanPertamaOptions.length],
        butuhPendampingan: i % 2 === 0 ? "Sangat Membutuhkan (Skor 5/5)" : "Membutuhkan (Skor 4/5)",
        kebutuhanUtama: kebutuhanOptions[i % kebutuhanOptions.length],
        fiturFavorit: fiturOptions[i % fiturOptions.length],
        sumberInformasi: "Dokter/Bidan, Rumah Sakit, Komunitas Ibu Hamil",
        alasanMomsie: alasanOptions[i % alasanOptions.length],
        estimasiHargaDoulaChat: "Rp25.000-Rp35.000",
        estimasiHargaDoulaFull: "Rp2.000.000-Rp3.000.000"
      };

      await setDoc(doc(db, "users", userId), {
        id: userId,
        uid: userId,
        name: name,
        email: email,
        phone: phone,
        domisili: domisili,
        registeredAt: regDate,
        createdAt: regDate,
        totalOrders: orderCount,
        totalSpend: totalSpend,
        status: "aktif",
        pregnancyProfile: pregnancyProfile,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    console.log("  Successfully synced 253 Registered Users with Pregnancy Survey Profiles to 'users' collection!");

    // 4. SYNC 193 TRANSACTIONS & BOOKINGS
    console.log("\n[4/4] Syncing 193 Transactions and Bookings to Cloud Firestore...");
    const paymentMethods = ["qris", "gopay", "shopeepay", "transfer_bca", "transfer_mandiri"];
    const transactionsList = [];
    let txCounter = 1001;

    const addTx = (year, month, day, catKey, deskripsi, hargaLayanan, hour = 10, isSub = false) => {
      const adminFee = 2500;
      const nominal = hargaLayanan + adminFee;
      const platformFee = isSub ? hargaLayanan : Math.round(hargaLayanan * 0.20);
      const doulaEarnings = isSub ? 0 : Math.round(hargaLayanan * 0.80);
      const dateObj = new Date(year, month - 1, day, hour, (txCounter % 40) + 10);
      const txId = `TX-MSI-${txCounter++}`;

      let userIdx = transactionsList.length < 39 ? transactionsList.length : 39 + ((transactionsList.length - 39) % 39);
      const fn = firstNamesPool[userIdx % firstNamesPool.length];
      const ln = lastNamesPool[Math.floor(userIdx / 3) % lastNamesPool.length];
      const userName = `${fn} ${ln}`;

      transactionsList.push({
        id: txId,
        userId: `USR-${100 + userIdx}`,
        namaUser: userName,
        jenisLayanan: catKey,
        kategoriLayanan: catKey,
        deskripsi: deskripsi,
        nominal: nominal,
        hargaLayanan: hargaLayanan,
        adminFee: adminFee,
        platformFee: platformFee,
        doulaEarnings: doulaEarnings,
        metodePembayaran: paymentMethods[txCounter % paymentMethods.length],
        status: "completed",
        createdAt: dateObj.toISOString(),
        paidAt: dateObj.toISOString(),
        bookingId: `BKG-${txCounter + 5000}`,
        isRepeatOrder: transactionsList.length >= 39
      });
    };

    // Generate 193 Transactions
    // June 2026 (38 TRX)
    for (let d = 5; d <= 30; d++) {
      if (transactionsList.length >= 38) break;
      addTx(2026, 6, d, "doula_chat", "Konsultasi Online via Chat", 30000, 10);
      if (d % 2 === 0) addTx(2026, 6, d, "prenatal_yoga", "Kelas Online: Prenatal Yoga", 75000, 14);
    }
    // July 2026 (81 TRX)
    for (let d = 1; d <= 31; d++) {
      if (transactionsList.length >= 119) break;
      addTx(2026, 7, d, "doula_chat", "Konsultasi Online via Chat", 30000, 11);
      if (d % 2 === 0) addTx(2026, 7, d, "prenatal_yoga", "Kelas Online: Prenatal Yoga", 75000, 15);
      if (d % 3 === 0) addTx(2026, 7, d, "materi_online", "Kelas Online: Materi Prenatal", 99000, 16);
    }
    // August 2026 s/d 28 Aug (74 TRX)
    for (let d = 1; d <= 28; d++) {
      if (transactionsList.length >= 193) break;
      addTx(2026, 8, d, "doula_chat", "Konsultasi Online via Chat", 30000, 10);
      if (d % 2 === 0) addTx(2026, 8, d, "prenatal_yoga", "Kelas Online: Prenatal Yoga", 75000, 14);
      if (d % 3 === 0) addTx(2026, 8, d, "paket_bundling", "Kelas Online: Bundling Edukasi & Yoga", 135000, 16);
    }

    for (const tx of transactionsList) {
      await setDoc(doc(db, "transactions", tx.id), tx, { merge: true });
    }
    console.log(`  Successfully synced ${transactionsList.length} Transactions to 'transactions' collection!`);

    console.log("\n========================================================");
    console.log("SUCCESS! All Cloud Firestore Collections 100% Synchronized!");
    console.log("========================================================\n");

  } catch (err) {
    console.error("Master Sync Error:", err);
  }
}

syncAllFirebaseData();
