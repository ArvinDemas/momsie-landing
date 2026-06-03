# Pengembangan Web Momsie: Fitur Pameran + Login Firebase

Menambahkan fitur **Artikel Terbaru**, **Kalkulator Kehamilan**, dan sistem **Autentikasi Firebase** (Google + Email) ke web Momsie yang sudah ada di Netlify. Fokus pada UX yang baik, konsistensi UI dengan design system yang sudah ada (pink/rose palette, Inter font, Tailwind).

---

## Open Questions

> [!IMPORTANT]
> Sebelum mulai eksekusi, ada beberapa hal yang perlu dikonfirmasi:
>
> 1. **Firebase Config**: Kamu sudah punya project Firebase `Momsie-app`. Untuk web, kita perlu tambahkan **Web App** di Firebase Console dan mendapatkan `firebaseConfig`. Apakah kamu sudah pernah menambahkan Web App di project tersebut, atau baru untuk Android/iOS saja?
> 2. **Artikel**: Artikel ditampilkan secara statis (hardcoded konten sample untuk pameran), atau mau diambil dari Firestore (dynamic)?
> 3. **Setelah Login**: Setelah user berhasil login, mau diarahkan ke mana? Tetap di landing page dengan state "sudah login", atau ada halaman dashboard tersendiri?
> 4. **Data User Tersimpan di mana**: Cukup di Firebase Auth saja (nama, email, foto profil), atau juga perlu tersimpan di Firestore (misalnya untuk data tambahan user)?

---

## Proposed Changes

### 1. Setup Firebase + Packages

#### [MODIFY] [package.json](file:///d:/p2mw/momsie/package.json)
- Tambah dependency: `firebase` (Firebase Web SDK v10+)

#### [NEW] lib/firebase.ts
- Inisialisasi Firebase App dengan `firebaseConfig`
- Export `auth` (Firebase Auth) dan `db` (Firestore, jika diperlukan)
- Konfigurasi `GoogleAuthProvider`

#### [NEW] lib/auth-context.tsx
- React Context untuk state autentikasi global (`user`, `loading`, `signOut`)
- Wrap seluruh app via `layout.tsx`

---

### 2. Halaman & Komponen Autentikasi

#### [NEW] app/auth/page.tsx
- Halaman `/auth` — gabungan Login + Register dalam satu halaman (tab/toggle)
- **Login**: Email + Password, tombol "Masuk dengan Google"
- **Register**: Nama, Email, Password, Konfirmasi Password, tombol "Daftar dengan Google"
- Tombol **Back** ke landing page di pojok kiri atas
- Design konsisten dengan Momsie: pink gradient, logo, animasi subtle

#### [NEW] components/auth/AuthForm.tsx
- Form component reusable untuk login dan register
- Validasi client-side (format email, password min 8 karakter)
- Loading state, error handling yang informatif (icon dari lucide-react)
- Google OAuth button dengan logo Google SVG

#### [NEW] components/auth/UserMenu.tsx  
- Dropdown menu kecil di navbar ketika sudah login
- Menampilkan foto profil / avatar inisial, nama user
- Menu: Profil, Keluar

---

### 3. Update Navbar (Header)

#### [MODIFY] [header.tsx](file:///d:/p2mw/momsie/components/landing/header.tsx)
- Mengganti tombol "Unduh Aplikasi" dengan dua kondisi:
  - **Belum login**: Tampilkan tombol "Masuk" + "Daftar"
  - **Sudah login**: Tampilkan `UserMenu` (avatar + dropdown)
- Gunakan `useAuth()` hook dari auth context

---

### 4. Fitur Artikel Terbaru

#### [NEW] app/artikel/page.tsx
- Halaman `/artikel` — grid 3 kolom artikel
- Tombol **Back** ke landing page
- Search/filter sederhana berdasarkan kategori (Kehamilan, Bayi, Nutrisi, Doula)
- Setiap card: gambar thumbnail, judul, excerpt, tanggal, kategori badge, tombol "Baca Selengkapnya"

#### [NEW] app/artikel/[slug]/page.tsx
- Halaman detail artikel `/artikel/[slug]`
- Tombol **Back** ke halaman daftar artikel
- Layout: header artikel, gambar hero, konten, artikel terkait di bawah

#### [NEW] components/landing/articles.tsx
- Section "Artikel Terbaru" di landing page (tampil 3 artikel terbaru)
- Tombol "Lihat Semua Artikel" yang link ke `/artikel`

#### [NEW] lib/articles-data.ts
- Data artikel statis (untuk pameran) — 6-9 artikel dengan konten relevan:
  - Panduan Doula untuk Ibu Hamil
  - Nutrisi Penting Trimester Pertama
  - Tips Persiapan Persalinan Normal
  - Manfaat Water Birth
  - dll.

---

### 5. Fitur Kalkulator Kehamilan

#### [NEW] app/kalkulator/page.tsx
- Halaman `/kalkulator` — kalkulator interaktif kehamilan
- Tombol **Back** ke landing page
- **Fitur kalkulasi**:
  - Input HPHT (Hari Pertama Haid Terakhir)
  - Hitung otomatis: Usia Kehamilan saat ini, Perkiraan Persalinan (HPL), Trimester saat ini
  - Timeline visual progress kehamilan (minggu ke berapa dari 40 minggu)
  - Info singkat per trimester (apa yang terjadi pada bayi & ibu)
- Desain menarik dengan progress bar, icon dari lucide-react

#### [NEW] components/landing/calculator-cta.tsx
- Section CTA kecil di landing page mengarah ke kalkulator
- "Cari tahu usia kehamilan Anda sekarang →"

---

### 6. Update Landing Page

#### [MODIFY] [page.tsx](file:///d:/p2mw/momsie/app/page.tsx)
- Tambahkan section `Articles` (sebelum footer)
- Tambahkan section `CalculatorCTA` (setelah B2B Partnership)

---

### 7. Protected Route & User Profile

#### [NEW] app/profil/page.tsx
- Halaman profil user yang sudah login
- Tampilkan: foto, nama, email, tanggal bergabung
- Tombol **Back** ke landing page
- Protected: redirect ke `/auth` jika belum login

---

## Alur Navigasi (UX Flow)

```
Landing Page (/)
├── [Navbar] Tombol "Masuk" → /auth
├── [Navbar] Tombol "Daftar" → /auth?tab=register
├── Section Artikel → /artikel
│   └── Card Artikel → /artikel/[slug]  ← Back button ke /artikel
├── Section Kalkulator CTA → /kalkulator  ← Back button ke /
└── [Navbar logged-in] Avatar → dropdown → /profil atau Keluar
```

---

## Panduan Setup Firebase (Langkah Manual oleh User)

> [!IMPORTANT]
> Langkah-langkah ini perlu dilakukan secara manual di Firebase Console sebelum kita mulai coding:
>
> 1. Buka [Firebase Console](https://console.firebase.google.com) → Project **Momsie-app**
> 2. Klik ikon **gear** (Settings) → **Project Settings**
> 3. Scroll ke bawah ke bagian **"Your apps"** → Klik ikon **`</>`** (Web)
> 4. Daftarkan app dengan nama `momsie-web`, centang **"Also set up Firebase Hosting"** jika mau, lalu klik **Register app**
> 5. Firebase akan menampilkan `firebaseConfig` — **copy dan simpan**, nanti akan kita pakai
> 6. Di sidebar Firebase → **Authentication** → **Get Started**
> 7. Aktifkan dua provider: **Email/Password** dan **Google**
> 8. Untuk Google: set **Project support email** ke emailmu
>
> Setelah selesai, bagikan `firebaseConfig` tersebut (atau simpan ke `.env.local`) dan kita bisa mulai coding!

---

## Verification Plan

### Automated Build
- `npm run build` harus berhasil tanpa error setelah semua perubahan

### Manual Verification
- [ ] Register dengan email baru berhasil
- [ ] Login dengan email/password berhasil
- [ ] Login dengan Google berhasil
- [ ] Navbar berubah tampilan saat sudah login (avatar + dropdown)
- [ ] Logout berfungsi
- [ ] Halaman artikel terbuka dan artikel bisa dibuka per halaman
- [ ] Kalkulator kehamilan menghitung dengan benar
- [ ] Tombol Back berfungsi di semua halaman baru
- [ ] UI konsisten (font, warna, spacing) di semua halaman
- [ ] Build & deploy ke Netlify berhasil
