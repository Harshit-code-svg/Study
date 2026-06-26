"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { Skull } from "lucide-react"

export default function BossSlayerModal({ open, subject, chapter, onClose }:{
  open:boolean; subject?:string; chapter?:string; onClose:()=>void
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{scale:.8, y:30}} animate={{scale:1, y:0}} exit={{scale:.8, opacity:0}}
            transition={{type:"spring", damping:18}}
            onClick={e=>e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-red-700/40 bg-zinc-950/95 boss-glow p-7 text-center"
          >
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-600/15 flex items-center justify-center animate-boss-flicker">
              <Skull className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 text-xs tracking-widest mb-2">BOSS SLAIN</p>
            <h2 className="text-2xl font-black mb-1">{subject} — BOSS SLAIN</h2>
            <p className="text-zinc-300 mb-5">{chapter}</p>
            <div className="grid grid-cols-2 gap-3 text-sm mb-5">
              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3">
                <div className="text-amber-400 text-lg font-bold">+3× XP</div>
                <div className="text-zinc-400 text-xs">Boss bonus</div>
              </div>
              <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3">
                <div className="text-emerald-400 text-lg font-bold">Badge</div>
                <div className="text-zinc-400 text-xs">Boss Slayer</div>
              </div>
            </div>
            <Button variant="boss" className="w-full" onClick={onClose}>Claim Reward</Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
