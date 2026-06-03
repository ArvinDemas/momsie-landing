export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  category: "Kehamilan" | "Bayi" | "Nutrisi" | "Doula" | "Persalinan"
  date: string
  readTime: string
  thumbnail: string
  author: string
}

export const articles: Article[] = [
  {
    slug: "mengenal-doula-pendamping-persalinan",
    title: "Mengenal Doula: Pendamping Persalinan yang Ubah Pengalaman Melahirkan",
    excerpt: "Doula bukan bidan, bukan dokter — tapi kehadiran mereka terbukti secara ilmiah mengurangi kebutuhan caesar dan membuat ibu lebih tenang saat melahirkan.",
    content: `
Banyak ibu hamil yang belum familiar dengan profesi doula. Doula adalah pendamping persalinan terlatih yang memberikan dukungan emosional, fisik, dan informasi bagi ibu selama kehamilan, persalinan, hingga masa nifas.

## Apa Perbedaan Doula dengan Bidan?

Bidan adalah tenaga medis yang berfokus pada aspek klinis persalinan. Doula tidak melakukan prosedur medis — mereka hadir untuk mendampingi, menenangkan, dan mengadvokasi kebutuhan ibu di hadapan tim medis.

## Bukti Ilmiah Manfaat Doula

Sebuah studi dari Cochrane Review (2017) yang menganalisis 26 penelitian dengan total 15.000 ibu melahirkan menemukan bahwa ibu yang didampingi doula:

- **28% lebih kecil** kemungkinan menjalani caesar
- **31% lebih kecil** kemungkinan menggunakan analgesik sintetis
- **34% lebih kecil** kemungkinan menilai pengalaman melahirkan sebagai negatif

## Kapan Mulai Bekerjasama dengan Doula?

Idealnya, konsultasi pertama dengan doula dilakukan pada **trimester kedua** (minggu ke-14 hingga 26). Ini memberi cukup waktu untuk membangun hubungan kepercayaan dan menyusun birth plan bersama.

Momsie menghubungkan ibu hamil dengan doula bersertifikat di seluruh Indonesia. Temukan doula yang tepat untukmu melalui aplikasi Momsie.
    `.trim(),
    category: "Doula",
    date: "28 Mei 2026",
    readTime: "5 menit",
    thumbnail: "/img landing page.png",
    author: "Tim Momsie",
  },
  {
    slug: "nutrisi-penting-trimester-pertama",
    title: "9 Nutrisi Wajib di Trimester Pertama yang Sering Terlewat",
    excerpt: "Trimester pertama adalah masa kritis pembentukan organ bayi. Pastikan asupan nutrisi ini terpenuhi untuk mendukung tumbuh kembang si kecil.",
    content: `
Trimester pertama (0–12 minggu) adalah periode paling kritis dalam kehamilan. Organ-organ vital bayi mulai terbentuk, sehingga asupan nutrisi ibu sangat berpengaruh.

## Nutrisi Kritis yang Harus Dipenuhi

### 1. Asam Folat (Folate/Vitamin B9)
**400–800 mcg per hari**. Mencegah cacat tabung saraf (neural tube defects) seperti spina bifida. Sumber: sayuran hijau gelap, kacang-kacangan, hati sapi.

### 2. Zat Besi
**27 mg per hari**. Mendukung pembentukan hemoglobin dan mencegah anemia kehamilan. Sumber: daging merah, hati, bayam, tempe.

### 3. Kalsium
**1.000 mg per hari**. Untuk pembentukan tulang dan gigi bayi. Jika asupan kurang, kalsium diambil dari tulang ibu. Sumber: susu, yogurt, keju, ikan teri.

### 4. Omega-3 (DHA)
Mendukung perkembangan otak dan mata bayi. Sumber: ikan salmon, ikan sarden, biji chia.

### 5. Vitamin D
Membantu penyerapan kalsium. Paparan sinar matahari pagi + susu fortifikasi.

## Tips Praktis

Jika mual di trimester pertama mengganggu, konsumsi suplemen prenatal di malam hari bersama makanan ringan. Konsultasikan dosis suplemen dengan dokter kandungan atau bidan.
    `.trim(),
    category: "Nutrisi",
    date: "20 Mei 2026",
    readTime: "6 menit",
    thumbnail: "/img landing page.png",
    author: "Tim Momsie",
  },
  {
    slug: "persiapan-persalinan-normal",
    title: "Panduan Lengkap Persiapan Persalinan Normal untuk Ibu Hamil",
    excerpt: "Persiapan yang matang dapat membuat proses persalinan normal lebih nyaman dan minim komplikasi. Ini yang perlu kamu siapkan mulai dari trimester ketiga.",
    content: `
Persalinan normal (spontan pervaginam) adalah proses melahirkan yang paling alami. Dengan persiapan yang tepat, proses ini bisa dijalani dengan lebih tenang dan nyaman.

## Persiapan Fisik

### Senam Hamil
Mulai dari usia kehamilan 28 minggu. Fokus pada latihan pernapasan, penguatan otot panggul (Kegel), dan posisi bayi yang optimal.

### Perineal Massage
Mulai minggu ke-34. Pijat area perineum 5–10 menit setiap hari untuk meningkatkan elastisitas jaringan dan mengurangi risiko robekan saat melahirkan.

## Persiapan Mental

### Hypnobirthing
Teknik relaksasi dan visualisasi yang terbukti mengurangi persepsi nyeri selama persalinan. Bisa dipelajari bersama doula atau melalui kelas prenatal.

### Birth Plan
Dokumen tertulis yang menyatakan preferensimu: posisi melahirkan, penggunaan epidural, siapa yang boleh hadir, inisiasi menyusu dini, dan lain-lain.

## Perlengkapan yang Perlu Disiapkan (Minggu ke-36)

- Dokumen: KTP, KK, buku KIA, kartu BPJS
- Pakaian ibu: baju bukaan depan, pembalut bersalin
- Perlengkapan bayi: popok, baju, selimut, topi

Konsultasikan birth plan dengan dokter kandungan dan doula pendampingmu melalui aplikasi Momsie.
    `.trim(),
    category: "Persalinan",
    date: "12 Mei 2026",
    readTime: "8 menit",
    thumbnail: "/img landing page.png",
    author: "Tim Momsie",
  },
  {
    slug: "menghitung-usia-kehamilan",
    title: "Cara Menghitung Usia Kehamilan dan Perkiraan Persalinan dengan Tepat",
    excerpt: "Banyak ibu bingung menghitung usia kehamilan. Simak penjelasan lengkapnya, termasuk perbedaan hitungan dari HPHT dan USG.",
    content: `
Menghitung usia kehamilan secara akurat penting untuk memantau perkembangan janin dan memperkirakan tanggal persalinan.

## Metode Naegele (dari HPHT)

Rumus paling umum yang digunakan:

**HPL = HPHT + 7 hari + 9 bulan** (atau HPHT + 280 hari)

Contoh: HPHT = 1 Januari 2026
- Tambah 7 hari → 8 Januari
- Tambah 9 bulan → 8 Oktober 2026

Usia kehamilan dihitung dari hari pertama HPHT, bukan dari tanggal ovulasi atau konsepsi.

## Trimester Kehamilan

| Trimester | Minggu | Milestone |
|-----------|--------|-----------|
| Pertama | 1–12 | Pembentukan organ vital |
| Kedua | 13–27 | Bayi mulai bergerak, jenis kelamin terlihat |
| Ketiga | 28–40 | Pertumbuhan pesat, persiapan lahir |

## Peran USG dalam Menentukan Usia Kehamilan

USG trimester pertama (7–13 minggu) adalah cara paling akurat menentukan usia kehamilan, karena mengukur CRL (Crown-Rump Length) janin. Setelah trimester dua, akurasi USG menurun.

Gunakan Kalkulator Kehamilan Momsie untuk menghitung usia kehamilan dan HPL otomatis!
    `.trim(),
    category: "Kehamilan",
    date: "5 Mei 2026",
    readTime: "5 menit",
    thumbnail: "/img landing page.png",
    author: "Tim Momsie",
  },
  {
    slug: "inisiasi-menyusu-dini",
    title: "Inisiasi Menyusu Dini (IMD): Manfaat Luar Biasa di 1 Jam Pertama Kelahiran",
    excerpt: "IMD bukan hanya soal ASI — ini tentang bonding, termoregulasi, dan sistem imun bayi yang dimulai sejak detik pertama kelahiran.",
    content: `
Inisiasi Menyusu Dini (IMD) adalah proses membiarkan bayi menemukan sendiri puting ibunya dalam 1 jam pertama setelah lahir.

## Mengapa 1 Jam Pertama Sangat Penting?

Segera setelah lahir, bayi berada dalam kondisi **alert state** — paling responsif dalam 2 jam pertama kehidupannya. Kontak kulit ke kulit (skin-to-skin) memicu:

- Pelepasan oksitosin pada ibu (membantu kontraksi rahim)
- Stabilisasi suhu tubuh bayi (lebih efektif dari inkubator)
- Transfer bakteri baik dari kulit ibu ke bayi
- Penguatan bonding ibu-bayi

## Kolostrum: Emas Bagi Bayi

Cairan kekuningan yang keluar pertama kali ini mengandung:
- **Immunoglobulin A (IgA)** — antibodi pelindung saluran cerna
- **Lactoferrin** — antivirus dan antibakteri alami
- **Faktor pertumbuhan** — mempercepat maturasi usus bayi

## Cara Melakukan IMD

1. Segera setelah lahir, letakkan bayi tengkurap di dada ibu
2. Biarkan bayi bergerak mencari puting — jangan dipaksa
3. Proses ini berlangsung 30–60 menit
4. Hindari penggunaan susu formula dalam 1 jam pertama

Pastikan doula pendampingmu memahami dan mendukung rencana IMD-mu. Temukan doula di Momsie!
    `.trim(),
    category: "Bayi",
    date: "28 April 2026",
    readTime: "5 menit",
    thumbnail: "/img landing page.png",
    author: "Tim Momsie",
  },
  {
    slug: "water-birth-apa-yang-perlu-diketahui",
    title: "Water Birth: Manfaat, Risiko, dan Siapa yang Cocok Mencoba Metode Ini",
    excerpt: "Melahirkan di dalam air kian populer di Indonesia. Tapi apakah metode ini aman? Simak penjelasan berbasis bukti sebelum memutuskan.",
    content: `
Water birth atau melahirkan di dalam air adalah metode persalinan di mana ibu menghabiskan sebagian atau seluruh proses persalinan dalam kolam air hangat.

## Manfaat Water Birth

**Untuk Ibu:**
- Air hangat merelaksasi otot dan mengurangi persepsi nyeri secara alami
- Memudahkan pergerakan dan perubahan posisi
- Tekanan air membantu mengurangi robekan perineum
- Efek hidroterapi menurunkan tekanan darah

**Untuk Bayi:**
- Transisi lembut dari lingkungan amnion ke udara
- Paparan trauma lahir yang lebih minimal

## Siapa yang Cocok?

Water birth ideal untuk:
- Kehamilan tunggal, presentasi kepala
- Usia kehamilan 37–42 minggu
- Kehamilan risiko rendah tanpa komplikasi
- Ibu yang ingin persalinan non-medikamentosa

## Kontraindikasi

Water birth sebaiknya tidak dilakukan jika ada:
- Preeklampsia atau hipertensi dalam kehamilan
- Kehamilan prematur (< 37 minggu)
- Bayi sungsang
- Infeksi aktif pada ibu
- Perdarahan antepartum

## Regulasi di Indonesia

Water birth di Indonesia dapat dilakukan di klinik bersalin atau rumah sakit tertentu yang memiliki fasilitas kolam persalinan. Diskusikan dengan dokter atau bidan dan doula pendampingmu.
    `.trim(),
    category: "Persalinan",
    date: "15 April 2026",
    readTime: "7 menit",
    thumbnail: "/img landing page.png",
    author: "Tim Momsie",
  },
]
