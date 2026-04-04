import { Bell, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Header({ className }: { className?: string }) {
  return (
    <header className={cn("flex items-center justify-between border-b bg-card px-6", className)}>
      <div className="flex items-center text-muted-foreground">
        <Search className="size-5 mr-3" />
        <span className="text-sm">Pencarian Cepat...</span>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="size-5" />
          <span className="absolute -top-1 -right-1 size-2 rounded-full bg-primary" />
        </button>
        <div className="flex items-center gap-3 border-l pl-6">
          <div className="flex flex-col items-end text-sm">
            <span className="font-semibold leading-none text-balance">Halo, Arvin</span>
            <span className="text-xs text-muted-foreground">Project Manager</span>
          </div>
          <div className="size-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold border-2 border-primary/20">
            AR
          </div>
        </div>
      </div>
    </header>
  )
}
