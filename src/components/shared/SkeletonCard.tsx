export default function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-card skeleton rounded-2xl ${className}`}>
      <div className="p-6 space-y-4">
        <div className="h-3 w-24 rounded bg-white/[0.03]" />
        <div className="h-8 w-16 rounded bg-white/[0.03]" />
        <div className="h-3 w-full rounded bg-white/[0.03]" />
      </div>
    </div>
  )
}
