"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useStudyStore, useHasHydrated } from "@/lib/store"
import { useState } from "react"
import SessionLogModal from "./session-log-modal"

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/subjects", label: "Subjects" },
  { href: "/revisions", label: "Revisions" },
  { href: "/badges", label: "Badges" },
  { href: "/xp", label: "XP" },
  { href: "/goals", label: "Goals" },
  { href: "/reports", label: "Reports" },
]

export default function Nav() {
  const pathname = usePathname()
  const hydrated = useHasHydrated()
  const totalXp = useStudyStore(s=>s.totalXp)
  const streak = useStudyStore(s=>s.streak)
  const shields = useStudyStore(s=>s.streakShields)
  const resetData = useStudyStore(s=>s.resetData)
  const [logOpen, setLogOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[#09090f]/85 border-b border-zinc-900 mb-5 md:mb-6">
      <div className="flex items-center justify-between py-3 md:py-4 gap-3">
        <Link href="/" className="text-xl md:text-2xl font-black tracking-tight">
          STUDY<span className="text-purple-500">MAP</span>
        </Link>
        <div className="hidden lg:flex items-center gap-5 text-[14px]">
          {links.map(l=>(
            <Link key={l.href} href={l.href}
              className={cn("text-zinc-400 hover:text-white transition", pathname===l.href && "text-white font-semibold")}
            >{l.label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button onClick={()=>setLogOpen(true)} className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-500 transition">+ Log</button>
          <div className="px-2.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">🔥 {hydrated ? streak : "—"} {hydrated && shields>0 && <span className="text-cyan-400">+🛡️{shields}</span>}</div>
          <div className="px-2.5 py-1.5 rounded-full bg-purple-900/30 text-purple-300 font-semibold hidden sm:block">{hydrated ? totalXp.toLocaleString() : "—"} XP</div>
          <button onClick={()=>{ if(confirm("Reset all STUDYMAP data?")) resetData() }} className="text-[11px] text-zinc-500 hover:text-zinc-300 px-1 hidden md:block" title="Reset">reset</button>
        </div>
      </div>
      <div className="flex lg:hidden gap-4 overflow-x-auto pb-3 text-[13px] -mx-4 px-4 scrollbar-hide">
        {links.map(l=>(
          <Link key={l.href} href={l.href}
            className={cn("whitespace-nowrap text-zinc-400 py-1", pathname===l.href && "text-white font-semibold")}
          >{l.label}</Link>
        ))}
      </div>
      <SessionLogModal open={logOpen} onClose={()=>setLogOpen(false)} />
    </header>
  )
}
