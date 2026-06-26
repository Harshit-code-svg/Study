"use client"
import { useEffect, useMemo, useState } from "react"
import { useStudyStore, useHasHydrated } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { levelFromXp } from "@/lib/xp"
import MorningChecklist from "@/components/morning-checklist"
import DailyChallengeCard from "@/components/daily-challenge-card"
import RevisionDueCard from "@/components/revision-due-card"
import { getTodaysChallenge, generateDailyChallenge } from "@/lib/challenges"
import { dayKey, formatMinutes } from "@/lib/utils"
import BossSlayerModal from "@/components/boss-slayer-modal"
import BadgeToast from "@/components/badge-toast"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import SessionLogModal from "@/components/session-log-modal"
import EmptyState from "@/components/empty-state"
import { PageSkeleton } from "@/components/loading-skeleton"

export default function DashboardPage() {
  const hydrated = useHasHydrated()
  const totalXp = useStudyStore(s=>s.totalXp)
  const subjects = useStudyStore(s=>s.subjects)
  const sessions = useStudyStore(s=>s.sessions)
  const challenges = useStudyStore(s=>s.challenges)
  const revisions = useStudyStore(s=>s.revisions)
  const xpTx = useStudyStore(s=>s.xpTransactions)
  const badges = useStudyStore(s=>s.badges)
  const [logOpen, setLogOpen] = useState(false)

  const bossDefeat = useStudyStore(s=>s._bossDefeat)
  const clearBoss = useStudyStore(s=>s.clearBossPopup)
  const badgePopup = useStudyStore(s=>s._badgePopup)
  const clearBadge = useStudyStore(s=>s.clearBadgePopup)

  // ensure today's challenge exists at 6am rollover
  useEffect(()=>{
    if(!hydrated) return
    const todayChal = getTodaysChallenge(useStudyStore.getState().challenges)
    if (!todayChal) {
      const nc = generateDailyChallenge(useStudyStore.getState())
      useStudyStore.setState(state=> ({ challenges: [nc, ...state.challenges] }))
    }
  }, [hydrated])

  const todaysChallenge = getTodaysChallenge(challenges)
  const dueRevisions = revisions.filter(r => !r.completedAt && r.dueDate.slice(0,10) <= dayKey())
  const todaySessions = sessions.filter(s=> s.timestamp.slice(0,10)===dayKey())
  const todayMinutes = todaySessions.reduce((a,s)=>a+s.minutes,0)

  const level = levelFromXp(totalXp)
  const nextLevelXp = Math.pow(level,2)*50
  const curLevelXp = Math.pow(Math.max(level-1,0),2)*50
  const progress = Math.min(100, ((totalXp - curLevelXp) / Math.max(1, nextLevelXp - curLevelXp))*100)

  const recentBadges = useMemo(()=> badges.filter(b=>b.unlockedAt).sort((a,b)=> (b.unlockedAt||"").localeCompare(a.unlockedAt||"")).slice(0,3), [badges])

  if (!hydrated) return <PageSkeleton/>

  return (
    <div className="space-y-5">
      {/* Hero / XP */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-xl">Level {level} Scholar</CardTitle>
                <div className="text-sm text-zinc-400 mt-1">{totalXp.toLocaleString()} XP total • {todayMinutes ? formatMinutes(todayMinutes)+" today" : "log your first session"}</div>
              </div>
              <Button size="sm" className="h-10 px-4 shrink-0" onClick={()=>setLogOpen(true)}>+ Log</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} />
            <div className="flex justify-between text-xs text-zinc-500 mt-2">
              <span>{totalXp - curLevelXp} / {nextLevelXp - curLevelXp} XP</span>
              <Link href="/xp" className="text-purple-400 hover:underline">XP breakdown →</Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Today</CardTitle></CardHeader>
          <CardContent className="text-sm text-zinc-300">
            <div>{todaySessions.length} sessions</div>
            <div>{formatMinutes(todayMinutes)} studied</div>
            <div className="text-xs text-zinc-500 mt-1">{dayKey()}</div>
            {!todaySessions.length && <div className="text-xs text-amber-300 mt-2">Tap + Log to start →</div>}
          </CardContent>
        </Card>
      </div>

      <MorningChecklist />

      <div className="grid md:grid-cols-2 gap-4">
        <DailyChallengeCard challenge={todaysChallenge} />
        <RevisionDueCard revisions={dueRevisions} />
      </div>

      {!todaysChallenge && !dueRevisions.length && (
        <EmptyState emoji="🎯" title="All clear!" description="No challenges or revisions due. Log a session or check back tomorrow at 6 AM." />
      )}

      {recentBadges.length > 0 && (
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-base">Recently Unlocked</CardTitle>
            <Link href="/badges" className="text-xs text-purple-400">view all →</Link>
          </CardHeader>
          <CardContent className="flex gap-3 flex-wrap">
            {recentBadges.map(b=>(
              <div key={b.id} className="flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2">
                <span className="text-xl">{b.emoji}</span>
                <div className="text-sm"><div className="font-medium">{b.name}</div><div className="text-[11px] text-zinc-400">{b.description}</div></div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">XP Feed</CardTitle></CardHeader>
          <CardContent className="space-y-2 max-h-64 overflow-auto">
            {xpTx.slice(0,14).map(t=>(
              <div key={t.id} className="flex justify-between gap-3 text-sm border-b border-zinc-900 pb-2">
                <div className="min-w-0">
                  <div className="text-zinc-200 truncate">{t.label}</div>
                  <div className="text-[11px] text-zinc-500">{t.source} • {new Date(t.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                </div>
                <div className="text-emerald-400 font-mono shrink-0">+{t.amount}</div>
              </div>
            ))}
            {!xpTx.length && <EmptyState emoji="⚡" title="No XP yet" description="Complete a resource or log a session to earn XP." />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Quick Links</CardTitle></CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/subjects"><Button variant="secondary" className="w-full justify-start">📚 Subjects</Button></Link>
            <Link href="/revisions"><Button variant="secondary" className="w-full justify-start">🔁 Revisions</Button></Link>
            <Link href="/badges"><Button variant="secondary" className="w-full justify-start">🏅 Badges</Button></Link>
            <Link href="/xp"><Button variant="secondary" className="w-full justify-start">⚡ XP Economy</Button></Link>
          </CardContent>
        </Card>
      </div>

      {/* floating + button mobile */}
      <button onClick={()=>setLogOpen(true)}
        className="md:hidden fixed right-5 bottom-[84px] z-40 w-14 h-14 rounded-full bg-purple-600 text-white text-2xl shadow-[0_8px_30px_rgba(124,58,237,0.45)] active:scale-95"
        aria-label="Log session">+</button>

      <SessionLogModal open={logOpen} onClose={()=>setLogOpen(false)} />
      <BossSlayerModal
        open={!!bossDefeat}
        subject={bossDefeat?.subjectName}
        chapter={bossDefeat?.chapterName}
        onClose={clearBoss}
      />
      <BadgeToast badgeId={badgePopup} onClose={clearBadge} />
    </div>
  )
}
