import { useState } from "react"

export function ReviewText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <p className={`text-foreground ${expanded ? "" : "line-clamp-2"}`}>
        {text}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-1 text-sm font-bold text-primary hover:underline"
      >
        {expanded ? "Hide" : "Show more"}
      </button>
    </div>
  )
}
