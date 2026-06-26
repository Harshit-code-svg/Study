"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, BookOpen, Repeat, Trophy, Zap } from "lucide-react"

const items = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/subjects", icon: BookOpen, label: "Study" },
  { href: "/revisions", icon: Repeat, label: "Rev" },
  { href: "/badges", icon: Trophy, label: "Badges" },
  { href: "/xp", icon: Zap, label: "XP" },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-zinc-800 bg-[#09090f]/95 backdrop-blur supports-[backdrop-filter]:bg-[#09090f]/80" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex items-center justify-around px-2 py-2">
        {items.map(it=>{
          const active = pathname === it.href || (it.href !== "/" && pathname.startsWith(it.href))
          const Icon = it.icon
          return (
            <Link key={it.href} href={it.href} className={cn(
              "flex flex-col items-center justify-center min-w-[64px] py-1.5 px-3 rounded-xl transition",
              "active:scale-95 touch-manipulation",
              active ? "text-purple-300" : "text-zinc-500"
            )}>
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2}/>
              <span className="text-[10px] mt-1 font-medium">{it.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
