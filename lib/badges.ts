import { Badge, BadgeId, StudyState } from "./types"

export const BADGE_DEFS: Omit<Badge,"unlockedAt">[] = [
  { id: "boss_slayer", name: "Boss Slayer", description: "Complete a boss chapter", emoji: "💀" },
  { id: "streak_warrior", name: "Streak Warrior", description: "Reach a 30-day streak", emoji: "🔥" },
  { id: "subject_master", name: "Subject Master", description: "Reach Lv.10 in any subject", emoji: "👑" },
  { id: "wall_builder", name: "Wall Builder", description: "Log 100 sessions", emoji: "🧱" },
  { id: "goal_crusher", name: "Goal Crusher", description: "Complete a goal", emoji: "🎯" },
  { id: "early_bird", name: "Early Bird", description: "Log a session before 7 AM", emoji: "🌅" },
  { id: "night_owl", name: "Night Owl", description: "Log a session after 10 PM", emoji: "🦉" },
  { id: "balanced_scholar", name: "Balanced Scholar", description: "All subjects above 50% completion", emoji: "⚖️" },
]

export function checkUnlocks(state: StudyState): BadgeId[] {
  const unlocked = new Set(state.badges.filter(b=>b.unlockedAt).map(b=>b.id))
  const newly: BadgeId[] = []
  const push = (id: BadgeId) => { if(!unlocked.has(id)) newly.push(id) }

  // boss_slayer handled on boss defeat event elsewhere; but safety
  if (state.subjects.some(s=> s.chapters.some(c=> c.isBoss && c.bossSlainAt))) push("boss_slayer")

  if (state.streak >= 30) push("streak_warrior")
  if (state.subjects.some(s=> s.level >= 10)) push("subject_master")
  if (state.sessions.length >= 100) push("wall_builder")
  if (state.goals.some(g=>g.done)) push("goal_crusher")

  const early = state.sessions.some(s => new Date(s.timestamp).getHours() < 7)
  if (early) push("early_bird")
  const night = state.sessions.some(s => new Date(s.timestamp).getHours() >= 22)
  if (night) push("night_owl")

  const allBalanced = state.subjects.length > 0 && state.subjects.every(sub => {
    const totalResources = sub.chapters.length * 4
    const doneResources = sub.chapters.reduce((a,c)=> a + c.resources.filter(r=>r.done).length,0)
    return totalResources ? (doneResources/totalResources) >= .5 : false
  })
  if (allBalanced) push("balanced_scholar")

  return newly
}
