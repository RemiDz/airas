export default function HeroSkeleton() {
  return (
    <section className="relative px-4 pt-8 pb-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Location bar skeleton */}
        <div className="flex items-center justify-between mb-10">
          <div className="skeleton h-4 w-32 rounded-lg" />
          <div className="skeleton h-3 w-24 rounded-lg" />
        </div>

        {/* AQI score skeleton */}
        <div className="flex flex-col items-center mb-8">
          <div className="skeleton h-20 w-28 rounded-2xl sm:h-24 sm:w-32" />
          <div className="skeleton mt-3 h-6 w-20 rounded-lg" />
        </div>

        {/* Gradient bar skeleton */}
        <div className="skeleton mb-8 h-1.5 w-full rounded-full" />

        {/* Tagline skeleton */}
        <div className="skeleton mx-auto mb-10 h-5 w-72 rounded-lg" />

        {/* Quick stats skeleton */}
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton rounded-2xl p-3 h-20" />
          ))}
        </div>
      </div>
    </section>
  )
}
