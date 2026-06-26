import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <div className="text-4xl mb-3">🗺️</div>
      <h2 className="text-2xl font-bold">404 — Lost on the map</h2>
      <p className="text-zinc-400 mt-2 mb-6">That route doesn't exist.</p>
      <Link href="/"><Button>Back to Dashboard</Button></Link>
    </div>
  )
}
