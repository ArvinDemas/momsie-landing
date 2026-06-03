"use client"

import Link from "next/link"
import { Instagram, Mail, Tiktok } from "lucide-react"

export default function Footer() {
  return (
    <footer id="contact" className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <img
                src="/Logo Momsie.png"
                alt="Momsie — Platform Doula Digital Indonesia"
                className="h-9 w-9 object-contain"
              />
              <span className="text-2xl font-bold tracking-tight text-pink-600">Momsie</span>
            </Link>
            <p className="text-slate-600 leading-relaxed text-sm text-pretty">
              Aplikasi penyedia layanan Doula bersertifikat dan marketplace ibu & bayi terlengkap.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Tautan Penting</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link href="#" className="hover:text-pink-500 transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="#" className="hover:text-pink-500 transition-colors">Kebijakan Privasi (Privacy Policy)</Link></li>
              <li><Link href="#" className="hover:text-pink-500 transition-colors">Karir/Mitra</Link></li>
              <li><Link href="#" className="hover:text-pink-500 transition-colors">Frequently Asked Questions (FAQ)</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center">
                <Mail className="size-4 mr-2 text-slate-400" />
                <a href="mailto:momsiereborn@gmail.com" className="hover:text-pink-500 transition-colors">
                  momsiereborn@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Ikuti Kami</h4>
            <div className="flex gap-4">
              <a href="#" className="size-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-colors">
                <Instagram className="size-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="size-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-colors">
                <Tiktok className="size-5" />
                <span className="sr-only">TikTok</span>
              </a>
            </div>
            <p className="mt-4 text-sm font-medium text-pink-500">
              @momsiee.id
            </p>
          </div>
          
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center md:text-left text-pretty">
             © 2026 Momsie Indonesia. Hak Cipta Dilindungi Undang-Undang. Terdaftar resmi di Kemenkumham RI (Nomor HKI: 000640318).
          </p>
        </div>
      </div>
    </footer>
  )
}
