import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Momsie | Platform Layanan Doula & Ibu Hamil Cerdas",
  description: "Platform digital rekam medis, doula, dan layanan ibu hamil terlengkap di Indonesia.",
  icons: {
    icon: "/Logo Momsie.png",
    apple: "/Logo Momsie.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} min-h-dvh flex flex-col bg-background text-foreground antialiased selection:bg-primary/30 selection:text-primary-foreground`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

