"use client"
import { motion, AnimatePresence } from "framer-motion"
import { BADGE_DEFS } from "@/lib/badges"
import { BadgeId } from "@/lib/types"

export default function BadgeToast({ badgeId, onClose }:{ badgeId?: BadgeId | null, onClose:()=>void }) {
  const badge = BADGE_DEFS.find(b=>b.id===badgeId)
  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          initial={{ y: 80, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:80, opacity:0 }}
          className="fixed bottom-6 right-4 z-[90] max-w-xs"
        >
          <div className="rounded-2xl border border-emerald-600/30 bg-zinc-950/95 glass px-4 py-3 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{badge.emoji}</div>
              <div className="flex-1">
                <div className="text-xs text-emerald-300 font-semibold">BADGE UNLOCKED</div>
                <div className="font-bold">{badge.name}</div>
                <div className="text-xs text-zinc-400">{badge.description}</div>
              </div>
              <button onClick={onClose} className="text-zinc-500 text-sm">✕</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
      }
