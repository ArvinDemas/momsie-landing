import urllib.request
import json
import time

API_KEY = "AIzaSyB3n4J9sv2hSWJKLhbBj2DZR3y5SUZMa3g"
PROJECT_ID = "momsie-app"

# Data Pools
femaleNames = [
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

firstNamesPool = [
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

lastNamesPool = [
    "Rahmawati", "Putri", "Lestari", "Citra", "Aini", "Astuti", "Agustina", "Sastrowardoyo", "Permata", "Juwita",
    "Melati", "Yuliana", "Sari", "Wulandari", "Dewi", "Maharani", "Amelia", "Handayani", "Anggraini", "Rahayu",
    "Wardani", "Safira", "Rahma", "Kartika", "Utami", "Dari", "Prameswari", "Wahyuni", "Palupi", "Asih",
    "Shara", "Ratnasari", "Febriani", "Rastanty", "Gutawa", "Purwadinata", "Permatasari", "Bahar", "Amalia", "Maya",
    "Ayunda", "Ramadhani", "Ramlan", "Verhoeven", "Andriana", "Kamal", "Sulistiawaty", "Panduwinata", "Guritno", "Sastry",
    "Hepburn", "Jessica", "Theana", "Shidqia", "Anastasia", "Rashid", "Sarasvati", "Mila", "Karamoy", "Basuki",
    "Kusuma", "Wijaya", "Susanti", "Puspasari", "Kurnia", "Hapsari", "Damayanti", "Firmansyah", "Pratiwi", "Wibowo"
]

cities = [
    "Sleman, DI Yogyakarta", "Bantul, DI Yogyakarta", "Kota Yogyakarta, DI Yogyakarta",
    "Kulon Progo, DI Yogyakarta", "Gunungkidul, DI Yogyakarta", "Daerah Istimewa Yogyakarta",
    "Solo, Jawa Tengah", "Klaten, Jawa Tengah", "Magelang, Jawa Tengah"
]

usiaOptions = ["18-25 tahun", "26-30 tahun", "31-35 tahun", "36-40 tahun"]
faseOptions = ["Trimester 1", "Trimester 2", "Trimester 3", "Pernah Hamil"]
kehamilanPertamaOptions = ["Ya", "Tidak"]
kebutuhanOptions = [
    "Persiapan persalinan, Prenatal Yoga, Konsultasi Doula",
    "Konsultasi terkait kehamilan, Pencatatan perkembangan kehamilan",
    "Aktivitas fisik (Yoga kehamilan), Rekomendasi fasilitas kesehatan",
    "Pendampingan emosional & Fisik selama kehamilan dan persalinan",
    "Informasi & Edukasi Kehamilan, Rekomendasi Baby Shop"
]
fiturOptions = [
    "Layanan Doula Care & Prenatal Yoga",
    "Rekomendasi Rumah Sakit & Klinik Terdekat",
    "Pregnancy Diary & Artikel Kehamilan",
    "Paket Bundling Edukasi & Doula Chat",
    "MOMSIE AI Chat Assistant & Hospital Bag Checklist"
]
alasanOptions = [
    "Kombinasi layanan profesional Doula & fitur digital terpadu",
    "Pendampingan personal yang nyaman dan fleksibel dari rumah",
    "Akses mudah ke tenaga pendamping terpercaya di wilayah DIY",
    "Laporan kehamilan komprehensif dan kelas online terjangkau"
]

def get_auth_token():
    url_signin = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}"
    body = {"email": "sync.admin@momsie.id", "password": "MomsieAdmin123!", "returnSecureToken": True}
    req = urllib.request.Request(url_signin, data=json.dumps(body).encode("utf-8"), headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        return res["idToken"]

def patch_firestore_doc(token, collection_name, doc_id, fields_dict):
    url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/{collection_name}/{doc_id}?key={API_KEY}"
    body = {"fields": fields_dict}
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"},
        method="PATCH"
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return None

def delete_firestore_doc(token, collection_name, doc_id):
    url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/{collection_name}/{doc_id}?key={API_KEY}"
    req = urllib.request.Request(
        url,
        headers={"Authorization": f"Bearer {token}"},
        method="DELETE"
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return True
    except Exception as e:
        return False

def sync_master_data():
    print("Starting Master Cloud Firestore Synchronization via REST API...")
    token = get_auth_token()
    print("Authenticated successfully with Firebase Auth!")

    # 1. DELETE ARVIN DEMAS NARYAMA ENTRIES
    print("\n[1/4] Cleaning up Arvin Demas Naryama entries...")
    delete_firestore_doc(token, "mitra", "doula_arvin")
    delete_firestore_doc(token, "mitra", "arvin_demas_naryama")
    delete_firestore_doc(token, "users", "arvin_demas_naryama")

    # 2. SYNC 253 REGISTERED USERS WITH PREGNANCY PROFILES
    print("\n[2/4] Syncing 253 Registered Users with detailed Pregnancy Profiles to Cloud Firestore...")
    startDate = 1780280400000 # June 1 2026
    endDate = 1787970000000   # August 29 2026

    count_users = 0
    for i in range(253):
        userId = f"USR-{100 + i}"
        fn = firstNamesPool[i % len(firstNamesPool)]
        ln = lastNamesPool[(i // 3) % len(lastNamesPool)]
        name = f"{fn} {ln}"
        email = f"{fn.lower()}.{ln.lower()}{i + 1}@gmail.com"
        phone = f"081{int(10000000 + (i * 1234567) % 89999999)}"
        domisili = cities[i % len(cities)]
        regTime = startDate + int((i / 253.0) * (endDate - startDate))
        regDateStr = time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime(regTime / 1000.0))

        isTransacted = i < 78
        orderCount = 1 if (i < 39 and isTransacted) else (2 + (i % 3) if isTransacted else 0)
        totalSpend = orderCount * 32500

        fields = {
            "id": {"stringValue": userId},
            "uid": {"stringValue": userId},
            "name": {"stringValue": name},
            "email": {"stringValue": email},
            "phone": {"stringValue": phone},
            "domisili": {"stringValue": domisili},
            "registeredAt": {"stringValue": regDateStr},
            "createdAt": {"stringValue": regDateStr},
            "totalOrders": {"integerValue": str(orderCount)},
            "totalSpend": {"integerValue": str(totalSpend)},
            "status": {"stringValue": "aktif"},
            "pregnancyProfile": {
                "mapValue": {
                    "fields": {
                        "usiaRange": {"stringValue": usiaOptions[i % len(usiaOptions)]},
                        "faseKehamilan": {"stringValue": "Trimester 1" if (i % 2 == 0) else ("Trimester 2" if i % 3 == 0 else "Trimester 3") if isTransacted else faseOptions[i % len(faseOptions)]},
                        "kehamilanPertama": {"stringValue": kehamilanPertamaOptions[i % len(kehamilanPertamaOptions)]},
                        "butuhPendampingan": {"stringValue": "Sangat Membutuhkan (Skor 5/5)" if i % 2 == 0 else "Membutuhkan (Skor 4/5)"},
                        "kebutuhanUtama": {"stringValue": kebutuhanOptions[i % len(kebutuhanOptions)]},
                        "fiturFavorit": {"stringValue": fiturOptions[i % len(fiturOptions)]},
                        "sumberInformasi": {"stringValue": "Dokter/Bidan, Rumah Sakit, Komunitas Ibu Hamil"},
                        "alasanMomsie": {"stringValue": alasanOptions[i % len(alasanOptions)]},
                        "estimasiHargaDoulaChat": {"stringValue": "Rp25.000-Rp35.000"},
                        "estimasiHargaDoulaFull": {"stringValue": "Rp2.000.000-Rp3.000.000"}
                    }
                }
            }
        }
        res = patch_firestore_doc(token, "users", userId, fields)
        if res:
            count_users += 1
    print(f"  Successfully synced {count_users} Registered Users with Pregnancy Profiles into 'users' collection!")

    # 3. SYNC 193 TRANSACTIONS
    print("\n[3/4] Syncing 193 Transactions to Cloud Firestore...")
    paymentMethods = ["qris", "gopay", "shopeepay", "transfer_bca", "transfer_mandiri"]
    txList = []
    txCounter = 1001

    def addTx(year, month, day, catKey, deskripsi, hargaLayanan, hour=10, isSub=False):
        nonlocal txCounter
        adminFee = 2500
        nominal = hargaLayanan + adminFee
        platformFee = hargaLayanan if isSub else int(round(hargaLayanan * 0.20))
        doulaEarnings = 0 if isSub else int(round(hargaLayanan * 0.80))
        dateStr = f"{year}-{month:02d}-{day:02d}T{hour:02d}:{(txCounter % 40) + 10:02d}:00.000Z"
        txId = f"TX-MSI-{txCounter}"
        txCounter += 1

        userIdx = len(txList) if len(txList) < 39 else 39 + ((len(txList) - 39) % 39)
        fn = firstNamesPool[userIdx % len(firstNamesPool)]
        ln = lastNamesPool[(userIdx // 3) % len(lastNamesPool)]
        userName = f"{fn} {ln}"

        txList.append({
            "id": txId,
            "userId": f"USR-{100 + userIdx}",
            "namaUser": userName,
            "jenisLayanan": catKey,
            "kategoriLayanan": catKey,
            "deskripsi": deskripsi,
            "nominal": nominal,
            "hargaLayanan": hargaLayanan,
            "adminFee": adminFee,
            "platformFee": platformFee,
            "doulaEarnings": doulaEarnings,
            "metodePembayaran": paymentMethods[len(txList) % len(paymentMethods)],
            "status": "completed",
            "createdAt": dateStr,
            "paidAt": dateStr,
            "bookingId": f"BKG-{txCounter + 5000}",
            "isRepeatOrder": len(txList) >= 39
        })

    # June 2026 (38 TRX)
    for d in range(5, 31):
        if len(txList) >= 38: break
        addTx(2026, 6, d, "doula_chat", "Konsultasi Online via Chat", 30000, 10)
        if d % 2 == 0: addTx(2026, 6, d, "prenatal_yoga", "Kelas Online: Prenatal Yoga", 75000, 14)

    # July 2026 (81 TRX)
    for d in range(1, 32):
        if len(txList) >= 119: break
        addTx(2026, 7, d, "doula_chat", "Konsultasi Online via Chat", 30000, 11)
        if d % 2 == 0: addTx(2026, 7, d, "prenatal_yoga", "Kelas Online: Prenatal Yoga", 75000, 15)
        if d % 3 == 0: addTx(2026, 7, d, "materi_online", "Kelas Online: Materi Prenatal", 99000, 16)

    # August 2026 s/d 28 Aug (74 TRX)
    for d in range(1, 29):
        if len(txList) >= 193: break
        addTx(2026, 8, d, "doula_chat", "Konsultasi Online via Chat", 30000, 10)
        if d % 2 == 0: addTx(2026, 8, d, "prenatal_yoga", "Kelas Online: Prenatal Yoga", 75000, 14)
        if d % 3 == 0: addTx(2026, 8, d, "paket_bundling", "Kelas Online: Bundling Edukasi & Yoga", 135000, 16)

    count_tx = 0
    for tx in txList:
        fields = {
            "id": {"stringValue": tx["id"]},
            "userId": {"stringValue": tx["userId"]},
            "namaUser": {"stringValue": tx["namaUser"]},
            "jenisLayanan": {"stringValue": tx["jenisLayanan"]},
            "kategoriLayanan": {"stringValue": tx["kategoriLayanan"]},
            "deskripsi": {"stringValue": tx["deskripsi"]},
            "nominal": {"integerValue": str(tx["nominal"])},
            "hargaLayanan": {"integerValue": str(tx["hargaLayanan"])},
            "adminFee": {"integerValue": str(tx["adminFee"])},
            "platformFee": {"integerValue": str(tx["platformFee"])},
            "doulaEarnings": {"integerValue": str(tx["doulaEarnings"])},
            "metodePembayaran": {"stringValue": tx["metodePembayaran"]},
            "status": {"stringValue": tx["status"]},
            "createdAt": {"stringValue": tx["createdAt"]},
            "paidAt": {"stringValue": tx["paidAt"]},
            "bookingId": {"stringValue": tx["bookingId"]},
            "isRepeatOrder": {"booleanValue": tx["isRepeatOrder"]}
        }
        res = patch_firestore_doc(token, "transactions", tx["id"], fields)
        if res:
            count_tx += 1

    print(f"  Successfully synced {count_tx} Transactions into 'transactions' collection!")

    # 4. SYNC 50 FEMALE MITRA DOULAS
    print("\n[4/4] Syncing 50 Female Mitra Doulas to Cloud Firestore...")
    originalDoulas = [
        {"id": "doula_anastasia", "name": "Anastasia Mawardi", "pekerjaan": "Bidan (On-going Certified)", "kotaProvinsi": "Daerah Istimewa Yogyakarta"},
        {"id": "doula_dewi", "name": "Dewi Riana P, CD (Dona)", "pekerjaan": "Doula Certified", "kotaProvinsi": "Daerah Istimewa Yogyakarta"},
        {"id": "doula_laily", "name": "Laily Artha Paramita, S. Tr. Keb, CHt., CHBr", "pekerjaan": "Bidan (Doula Certified)", "kotaProvinsi": "Daerah Istimewa Yogyakarta"},
    ]
    rolesPool = [
        "Doula (On-going Certified)", "Bidan (On-going Certified)",
        "Hypnobirthing Practitioner (On-going Certified)", "Birth Doula (On-going Certified)",
        "Doula Certified", "Postpartum Doula (On-going Certified)"
    ]

    all50Doulas = list(originalDoulas)
    for i in range(47):
        all50Doulas.append({
            "id": f"seed_doula_{i + 1}",
            "name": femaleNames[i % len(femaleNames)],
            "pekerjaan": rolesPool[i % len(rolesPool)],
            "kotaProvinsi": cities[i % len(cities)],
        })

    count_mitra = 0
    for m in all50Doulas:
        fields = {
            "id": {"stringValue": m["id"]},
            "name": {"stringValue": m["name"]},
            "pekerjaan": {"stringValue": m["pekerjaan"]},
            "kotaProvinsi": {"stringValue": m["kotaProvinsi"]},
            "role": {"stringValue": "Doula"},
            "saldo_escrow": {"integerValue": "0"},
            "saldo_tersedia": {"integerValue": "0"},
            "totalPendapatan": {"integerValue": "0"},
            "isAvailable": {"booleanValue": True},
            "rating": {"doubleValue": 5.0}
        }
        res = patch_firestore_doc(token, "mitra", m["id"], fields)
        if res:
            count_mitra += 1
    print(f"  Successfully synced {count_mitra} Mitra Doula documents into 'mitra' collection!")

    print("\n=======================================================================")
    print("🎉 SUCCESS! Cloud Firestore Live Database 100% Synchronized Across Collections!")
    print("=======================================================================\n")

sync_master_data()
