"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, Wallet, CreditCard, Download, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [buktiTransfer, setBuktiTransfer] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState("")
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [method, setMethod] = useState("")

  useEffect(() => {
    const stored = sessionStorage.getItem("momsie_checkout")
    if (stored) {
      const data = JSON.parse(stored)
      setItems(data.items || [])
      setTotal(data.total || 0)
      setMethod(data.method || "Transfer Bank")
    } else {
      router.push("/")
    }
  }, [])

  const handleUploadProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBuktiTransfer(file)
      const reader = new FileReader()
      reader.onloadend = () => setProofPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!buktiTransfer) return
    setIsProcessing(true)

    setTimeout(() => {
      const id = "TRX-" + Date.now().toString(36).toUpperCase()
      setTransactionId(id)
      setShowSuccess(true)
      sessionStorage.removeItem("momsie_checkout")
      setIsProcessing(false)
    }, 1500)
  }

  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto space-y-6 py-8">
        <Card className="text-center border-green-200 bg-green-50">
          <CardContent className="pt-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">Pembayaran Berhasil!</h1>
            <p className="text-green-600 mb-6">
              Transaksi Anda sedang diproses. Tim kami akan memverifikasi dalam 1x24 jam.
            </p>

            <div className="bg-white rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">ID Transaksi</span>
                <span className="font-mono font-semibold">{transactionId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Total Dibayar</span>
                <span className="font-semibold">Rp {total.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metode</span>
                <span>{method}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/dashboard/transaksi" className="block w-full">
                <button className="w-full h-12 text-base font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  Lihat Detail Transaksi
                </button>
              </Link>
              <Link href="/" className="block w-full">
                <button className="w-full h-12 text-base font-medium bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-colors">
                  Kembali ke Beranda
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Konfirmasi Pembayaran</h1>
        <p className="text-muted-foreground mt-1">Silakan selesaikan pembayaran Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-5 h-5 text-pink-500" />
            Ringkasan Pesanan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between py-2 border-b last:border-0">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
              </div>
              <p className="font-semibold">Rp {item.price?.toLocaleString("id-ID")}</p>
            </div>
          ))}
          <div className="flex justify-between py-3 font-bold text-base border-t">
            <span>Total</span>
            <span className="text-pink-600">Rp {total.toLocaleString("id-ID")}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-500" />
            Metode Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg mb-4">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">{method}</p>
              <p className="text-sm text-blue-600">Transfer ke rekening berikut:</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-1">
            <p><strong>BCA:</strong> 1234567890 a/n PT Momsie Indonesia</p>
            <p><strong>BRI:</strong> 0987654321 a/n PT Momsie Indonesia</p>
            <p className="mt-2 text-red-600 font-medium">Jumlah yang harus dibayar: Rp {total.toLocaleString("id-ID")}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="w-5 h-5 text-green-500" />
            Upload Bukti Transfer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
            {proofPreview ? (
              <div className="space-y-2">
                <img src={proofPreview} alt="Bukti" className="max-h-48 mx-auto rounded" />
                <p className="text-sm text-green-600">✓ Bukti berhasil diupload</p>
              </div>
            ) : (
              <div>
                <Download className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-muted-foreground">Klik untuk upload bukti transfer</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, atau PDF (maks 5MB)</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleUploadProof}
              className="hidden"
              id="proof-upload"
            />
            <label htmlFor="proof-upload">
              <button className="mt-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                Pilih File
              </button>
            </label>
          </div>
        </CardContent>
      </Card>

      <button
        onClick={handleSubmit}
        disabled={!buktiTransfer || isProcessing}
        className="w-full h-12 text-base font-medium bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            Konfirmasi Pembayaran
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Transaksi akan dikonfirmasi dalam 1x24 jam setelah bukti transfer diverifikasi.
      </p>
    </div>
  )
}
