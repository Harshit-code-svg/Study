"use client"
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="py-16 text-center">
      <div className="text-3xl mb-3">💥</div>
      <h2 className="text-xl font-bold mb-2">App crashed</h2>
      <p className="text-zinc-400 text-sm mb-4">{error.message || "Unexpected error"}</p>
      <button onClick={()=>reset()} className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm">Try again</button>
    </div>
  )
}
