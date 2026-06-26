"use client"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Revision } from "@/lib/types"
import { useStudyStore } from "@/lib/store"
import { Button } from "./ui/button"

export default function RevisionDueCard({ revisions }: { revisions: Revision[] }) {
  const complete = useStudyStore(s=>s.completeRevision)
  const subjects = useStudyStore(s=>s.subjects)

  if (!revisions.length) return null
  return (
    <Card className="border-sky-700/30 bg-sky-950/10 rev-pulse">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">🔁 Revisions Due Today — {revisions.length}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {revisions.slice(0,4).map(r=>{
          const sub = subjects.find(s=>s.id===r.subjectId)
          const ch = sub?.chapters.find(c=>c.id===r.chapterId)
          return (
            <div key={r.id} className="flex items-center justify-between rounded-lg bg-zinc-900/60 px-3 py-2 text-sm border border-zinc-800">
              <div>
                <div className="font-medium">{ch?.name}</div>
                <div className="text-xs text-zinc-400">{sub?.name} • R{r.stage}</div>
              </div>
              <Button size="sm" variant="secondary" onClick={()=>complete(r.id)}>Done +10 XP</Button>
            </div>
          )
        })}
        {revisions.length>4 && <div className="text-xs text-zinc-400">+{revisions.length-4} more on Revisions page</div>}
      </CardContent>
    </Card>
  )
}
