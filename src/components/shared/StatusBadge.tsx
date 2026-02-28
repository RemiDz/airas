import type { AqiBand } from '@/lib/types'

interface StatusBadgeProps {
  band: AqiBand
  className?: string
}

export default function StatusBadge({ band, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-data text-[10px] tracking-[0.2em] uppercase ${className}`}
      style={{
        backgroundColor: `${band.colour}15`,
        color: band.colour,
        border: `1px solid ${band.colour}30`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: band.colour }}
      />
      {band.label}
    </span>
  )
}
