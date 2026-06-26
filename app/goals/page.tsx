"use client"
import { useStudyStore, useHasHydrated } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react"
import EmptyState from "@/components/empty-state"
import { PageSkeleton } from "@/components/loading-skeleton"
import { dayKey } from "@/lib/utils"

export default function GoalsPage() {
  const hydrated = useHasHydrated()
  const goals = useStudyStore(s=>s.goals)
  const addGoal = useStudyStore(s=>s.addGoal)
  const toggleGoal = useStudyStore(s=>s.toggleGoal)
  const subjects = useStudyStore(s=>s.subjects)
  const [title, setTitle] = useState("")
  const [subjectId, setSubjectId] = useState("")
  const [date, setDate] = useState(dayKey(new Date(Date.now()+7*86400000)))

  const activeGoals = useMemo(()=> goals.filter(g=>!g.done), [goals])
  const doneGoals = useMemo(()=> goals.filter(g=>g.done), [goals])

  const soonWarning = (g:any) => {
    const diff = Math.ceil((new Date(g.targetDate).getTime() - Date.now())/86400000)
    return diff <= 2 && diff >= 0 && !g.done
  }

  if(!hydrated) return <PageSkeleton/>

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Goals</h1>
      <Card>
        <CardHeader><CardTitle className="text-base">New Goal</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-2">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Goal title — e.g., Finish Thermodynamics PYQs"
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 h-11 text-sm w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select value={subjectId} onChange={e=>setSubjectId(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 h-11 text-sm">
              <option value="">Any subject</option>
              {subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 h-11 text-sm" />
            <Button className="h-11" onClick={()=>{
              if(!title.trim()) return
              addGoal({ title, subjectId: subjectId||undefined, targetDate: new Date(date).toISOString() })
              setTitle(""); setSubjectId("")
            }}>Add Goal</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {activeGoals.map(g=>{
          const warn = soonWarning(g)
          const daysLeft = Math.ceil((new Date(g.targetDate).getTime()-Date.now())/86400000)
          return (
          <Card key={g.id} className={warn ? "border-amber-600/30 bg-amber-950/5" : ""}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium">{g.title}</div>
                <div className="text-xs text-zinc-400">Target {g.targetDate.slice(0,10)} • {daysLeft>0 ? `${daysLeft}d left` : daysLeft===0 ? "Due today!" : "Overdue"}</div>
                {warn && <div className="text-[11px] text-amber-300 mt-1">⚠️ Due soon — finish for +50 XP</div>}
              </div>
              <Button size="sm" className="w-full sm:w-auto" onClick={()=>toggleGoal(g.id)}>Complete +50 XP</Button>
            </CardContent>
          </Card>
        )})}
        {!activeGoals.length && <EmptyState emoji="🎯" title="No active goals" description="Add a weekly target to stay accountable. Completing awards +50 XP and Goal Crusher badge." />}
      </div>

      {doneGoals.length>0 && (
        <>
          <h3 className="text-sm text-zinc-400 pt-2">Completed</h3>
          <div className="grid gap-2">
            {doneGoals.map(g=>(
              <Card key={g.id} className="opacity-70">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{g.title} ✅</div>
                    <div className="text-xs text-zinc-500">Completed</div>
                  </div>
                  <Button size="sm" variant="secondary" onClick={()=>toggleGoal(g.id)}>Undo</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
            }
                
