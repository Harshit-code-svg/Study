"use client"
import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useStudyStore } from "@/lib/store"
import { Button } from "./ui/button"
import { ResourceType } from "@/lib/types"

export default function SessionLogModal({ open, onClose }:{ open:boolean, onClose:()=>void }) {
  const subjects = useStudyStore(s=>s.subjects)
  const logSession = useStudyStore(s=>s.logSession)
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "")
  const subject = subjects.find(s=>s.id===subjectId) || subjects[0]
  const [chapterId, setChapterId] = useState(subject?.chapters?.[0]?.id || "")
  const [resource, setResource] = useState<ResourceType>("video")
  const [minutes, setMinutes] = useState(25)
  const [mood, setMood] = useState<"focus"|"flow"|"tired"|"distracted">("focus")

  const chapters = subject?.chapters || []

  useMemo(()=>{
    if(subject && !chapters.find(c=>c.id===chapterId)) {
      setChapterId(chapters[0]?.id || "")
    }
  }, [subjectId])

  const submit = () => {
    if(!subjectId || !chapterId || minutes < 1) return
    logSession({ subjectId, chapterId, resourceType: resource, minutes, mood })
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          className="fixed inset-0 z-[85] bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            onClick={e=>e.stopPropagation()}
            className="w-full md:max-w-lg rounded-t-[28px] md:rounded-[28px] border-t md:border border-zinc-800 bg-zinc-950 p-5 shadow-2xl"
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-zinc-800 md:hidden" />
            <h2 className="text-lg font-bold mb-4">Log Session</h2>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400">Subject</label>
                  <select value={subjectId} onChange={e=>setSubjectId(e.target.value)}
                    className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 h-11 text-sm">
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400">Chapter</label>
                  <select value={chapterId} onChange={e=>setChapterId(e.target.value)}
                    className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 h-11 text-sm">
                    {chapters.map(c => <option key={c.id} value={c.id}>{c.isBoss ? "💀 " : ""}{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400">Resource</label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {(["video","notes","pyq","revise"] as ResourceType[]).map(r=>(
                    <button key={r}
                      onClick={()=>setResource(r)}
                      className={`h-11 rounded-xl text-xs font-medium border transition ${resource===r ? "bg-purple-600 border-purple-500 text-white" : "border-zinc-800 bg-zinc-900 text-zinc-300"}`}
                    >
                      {r === "video" ? "🎥" : r==="notes" ? "📝" : r==="pyq" ? "❓" : "🔁"} <br className="md:hidden"/>{r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400">Minutes</label>
                  <input type="number" min={1} max={180} value={minutes}
                    onChange={e=>setMinutes(parseInt(e.target.value)||0)}
                    className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 h-11 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400">Mood</label>
                  <select value={mood} onChange={e=>setMood(e.target.value as any)}
                    className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 h-11 text-sm">
                    <option value="focus">🎯 Focus</option>
                    <option value="flow">⚡ Flow</option>
                    <option value="tired">😴 Tired</option>
                    <option value="distracted">🧠 Distracted</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1 h-12 text-base" onClick={submit}>Log +{ ({video:15,notes:10,pyq:25,revise:20}[resource]) + Math.floor(minutes/10) } XP</Button>
                <Button variant="secondary" onClick={onClose} className="h-12">Cancel</Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
