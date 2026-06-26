"use client"
import Link from "next/link"
import { useStudyStore, useHasHydrated } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skull } from "lucide-react"
import { PageSkeleton } from "@/components/loading-skeleton"

export default function SubjectsPage() {
  const hydrated = useHasHydrated()
  const subjects = useStudyStore(s=>s.subjects)
  if(!hydrated) return <PageSkeleton/>
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <div className="text-xs text-zinc-400">{subjects.length} tracks</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {subjects.map(sub=>{
          const totalRes = sub.chapters.length*4
          const doneRes = sub.chapters.reduce((a,c)=>a+c.resources.filter(r=>r.done).length,0)
          const pct = totalRes? Math.round(doneRes/totalRes*100):0
          const bossCh = sub.chapters.filter(c=>c.isBoss)
          const bossDone = bossCh.filter(c=>!!c.bossSlainAt).length
          return (
            <Link key={sub.id} href={`/subjects/${sub.id}`}>
              <Card className="hover:border-zinc-700 transition active:scale-[.99]">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-[17px]">
                    <span className="text-xl">{sub.icon}</span> {sub.name}
                    <span className="ml-auto text-[11px] px-2 py-1 rounded-full bg-zinc-800">Lv {sub.level}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={pct} />
                  <div className="flex justify-between text-xs text-zinc-400 mt-2">
                    <span>{pct}% • {sub.xp} XP</span>
                    {bossCh.length>0 && (
                      <span className="flex items-center gap-1 text-red-300"><Skull className="w-3 h-3"/>{bossDone}/{bossCh.length} boss</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
            }
                    
