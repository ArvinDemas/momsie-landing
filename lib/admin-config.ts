// Daftar email admin yang diizinkan mengakses dashboard
export const ADMIN_EMAILS = [
  "adnaryama1@gmail.com",
  "mahdaputri@gmail.com",      // email Mahda — update jika beda
  "yosawibowo@gmail.com",      // email Yosa — update jika beda
]

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
