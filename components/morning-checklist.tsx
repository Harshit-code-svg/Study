"use client"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { useStudyStore } from "@/lib/store"
import { MorningPlanSlot } from "@/lib/types"
import { Button } from "./ui/button"
import { dayKey } from "@/lib/utils"

export default function MorningChecklist() {
  const subjects = useStudyStore(s=>s.subjects)
  const plan = useStudyStore(s=>s.morningPlan)
  const savePlan = useStudyStore(s=>s.saveMorningPlan)
  const markSlot = useStudyStore(s=>s.markMorningSlotDone)
  const streak = useStudyStore(s=>s.streak)
  const revisions = useStudyStore(s=>s.revisions)
  const sessions = useStudyStore(s=>s.sessions)

  const hour = new Date().getHours()
  if (hour >= 12) return null

  const dueToday = revisions.filter(r=> !r.completedAt && r.dueDate.slice(0,10) <= dayKey()).length

  const initial: MorningPlanSlot[] = useMemo(() => {
    if (plan?.date === dayKey()) return plan.slots
    return [{},{},{}]
  }, [plan])

  const [slots, setSlots] = useState<MorningPlanSlot[]>(initial)

  useEffect(()=> { setSlots(initial) }, [initial])

  const updateSlot = (i:number, field:"subjectId"|"chapterId", val:string) => {
    const ns = [...slots]
    ns[i] = { ...ns[i], [field]: val || undefined, done: false,
      ...(field==="subjectId" ? { chapterId: undefined } : {})
    }
    setSlots(ns)
    savePlan(ns)
  }

  return (
    <Card className="border-violet-800/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Good Morning — Day {streak}</CardTitle>
        <div className="text-xs text-zinc-400">{dueToday} revisions due • check your plan</div>
      </CardHeader>
      <CardContent className="space-y-3">
        {[0,1,2].map(i=>{
          const sl = slots[i] || {}
          const sub = subjects.find(s=>s.id===sl.subjectId)
          const completedToday = sessions.some(ss=> ss.timestamp.slice(0,10)===dayKey() && ss.subjectId===sl.subjectId && ss.chapterId===sl.chapterId)
          return (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" checked={!!sl.done || completedToday}
                  onChange={e=> markSlot(i,e.target.checked)}
                  className="accent-purple-500"
                />
                <span className="text-sm text-zinc-400">Slot {i+1}</span>
                {(sl.done || completedToday) && <span className="text-emerald-400 text-xs">✓ done</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <select
                  value={sl.subjectId || ""}
                  onChange={e=>updateSlot(i,"subjectId", e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm w-full"
                >
                  <option value="">Subject…</option>
                  {subjects.map(s=> <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
                </select>
                <select
                  value={sl.chapterId || ""}
                  onChange={e=>updateSlot(i,"chapterId", e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm w-full"
                  disabled={!sub}
                >
                  <option value="">Chapter…</option>
                  {sub?.chapters.map(c=> <option key={c.id} value={c.id}>{c.isBoss ? "💀 " : ""}{c.name}</option>)}
                </select>
              </div>
            </div>
          )
        })}
        <Button variant="secondary" size="sm" className="w-full" onClick={()=>savePlan(slots)}>Save Plan</Button>
      </CardContent>
    </Card>
  )
}
