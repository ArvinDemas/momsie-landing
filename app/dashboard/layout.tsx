import Sidebar from "@/components/layout/sidebar"
import Header from "@/components/layout/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full h-dvh overflow-hidden bg-background">
      <Sidebar className="w-64 flex-shrink-0" />
      <div className="flex flex-col flex-1 h-dvh overflow-hidden">
        <Header className="h-16 flex-shrink-0" />
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-0">
          {children}
        </main>
      </div>
    </div>
  )
}
