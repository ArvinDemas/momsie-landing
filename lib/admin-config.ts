// Daftar email admin resmi yang diizinkan mengelola dashboard & CMS Berita
export const ADMIN_EMAILS = [
  "adnaryama1@gmail.com",
  "yusufadi5525@gmail.com",
  "mahdanurauliya@gmail.com",
  "berlianapm27@gmail.com",
  "yosawulandari16@gmail.com",
]

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  const cleanEmail = email.trim().toLowerCase()
  return ADMIN_EMAILS.some((adminEmail) => adminEmail.trim().toLowerCase() === cleanEmail)
}
