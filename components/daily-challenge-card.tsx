"use client"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Challenge } from "@/lib/types"
import { useStudyStore } from "@/lib/store"
import { Badge } from "./ui/badge"

export default function DailyChallengeCard({ challenge }: { challenge?: Challenge }) {
  const accept = useStudyStore(s=>s.acceptChallenge)
  const skip = useStudyStore(s=>s.skipChallenge)

  if (!challenge) return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-base">⚔️ Daily Grind</CardTitle></CardHeader>
      <CardContent className="text-sm text-zinc-400">No challenge yet — check back at 6 AM.</CardContent>
    </Card>
  )
  if (challenge.skipped) return null

  return (
    <Card className="border-amber-600/25 bg-amber-950/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">⚔️ Daily Grind</CardTitle>
          <Badge variant="neon">+{challenge.rewardXp} XP</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-zinc-200 text-[15px] leading-snug">{challenge.text}</p>
        <div className="text-xs text-zinc-400">+1 Streak Shield 🛡️ if completed</div>
        {!challenge.accepted && !challenge.completed ? (
          <div className="flex gap-2">
            <Button size="sm" className="min-h-[40px]" onClick={()=>accept(challenge.id)}>Accept</Button>
            <Button size="sm" variant="ghost" onClick={()=>skip(challenge.id)}>Skip</Button>
          </div>
        ) : challenge.completed ? (
          <div className="text-emerald-400 font-semibold text-sm">Completed! ✅</div>
        ) : (
          <div className="text-amber-300 text-sm">In progress… log a matching session</div>
        )}
      </CardContent>
    </Card>
  )
}
