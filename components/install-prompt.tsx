"use client"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { X } from "lucide-react"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem("studymap-install-dismissed")
    if (dismissed) return
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setShow(true)
    }
    window.addEventListener("beforeinstallprompt", handler as any)
    // fallback nudge for iOS / no prompt
    const t = setTimeout(() => {
      if (!deferred && !window.matchMedia("(display-mode: standalone)").matches) {
        setShow(true)
      }
    }, 4000)
    return () => { window.removeEventListener("beforeinstallprompt", handler as any); clearTimeout(t) }
  }, [deferred])

  if (!show) return null

  const install = async () => {
    if (deferred) {
      await deferred.prompt()
      await deferred.userChoice
      setDeferred(null)
      setShow(false)
    } else {
      // iOS manual
      setShow(false)
      localStorage.setItem("studymap-install-dismissed", "1")
    }
  }
  const dismiss = () => {
    setShow(false)
    localStorage.setItem("studymap-install-dismissed", Date.now().toString())
  }

  return (
    <div className="fixed bottom-[76px] md:bottom-5 left-4 right-4 md:left-auto md:right-5 z-[70] max-w-sm">
      <div className="rounded-2xl border border-purple-800/40 bg-zinc-950/95 backdrop-blur glass px-4 py-3 shadow-[0_0_24px_rgba(124,58,237,0.22)]">
        <div className="flex items-start gap-3">
          <div className="text-xl">📱</div>
          <div className="flex-1">
            <div className="font-semibold text-sm">Install STUDYMAP</div>
            <div className="text-xs text-zinc-400 mt-0.5">Add to home screen for full-screen, offline use.</div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={install}>{deferred ? "Install" : "Got it"}</Button>
              <Button size="sm" variant="ghost" onClick={dismiss}>Later</Button>
            </div>
          </div>
          <button onClick={dismiss} className="text-zinc-500 hover:text-zinc-300"><X className="w-4 h-4"/></button>
        </div>
      </div>
    </div>
  )
}
