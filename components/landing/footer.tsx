"use client"

import Link from "next/link"
import { Instagram, Mail } from "lucide-react"

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
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.2 2.27 2.05 3.71 2.42v3.75c-1.39-.16-2.73-.77-3.79-1.69-.97-.83-1.68-1.95-2.02-3.19v7.87c.1 1.76-.32 3.52-1.2 5-.94 1.54-2.39 2.72-4.08 3.32-1.95.73-4.14.73-6.09.01-1.89-.66-3.48-2.01-4.44-3.77A9.453 9.453 0 0 1 0 13.06c0-2.37.95-4.63 2.65-6.28 1.63-1.6 3.86-2.52 6.17-2.54 1.1-.02 2.21.14 3.25.5v3.7c-.82-.44-1.75-.68-2.69-.69-1.23-.03-2.45.38-3.41 1.15A5.626 5.626 0 0 0 4.1 12.3c-.3 1.23-.15 2.53.43 3.65.52.99 1.34 1.79 2.34 2.29.98.51 2.09.73 3.19.64 1.25-.09 2.45-.69 3.29-1.63.85-.92 1.27-2.18 1.18-3.43V.02Z"/>
                </svg>
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
