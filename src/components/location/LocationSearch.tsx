'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Location } from '@/lib/types'
import { fetchGeocode } from '@/lib/api'
import { trackEvent } from '@/lib/analytics'

interface LocationSearchProps {
  open: boolean
  onClose: () => void
  onSelect: (location: Location) => void
}

export default function LocationSearch({ open, onClose, onSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Location[]>([])
  const [searching, setSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setQuery('')
      setResults([])
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      return
    }
    setSearching(true)
    try {
      const res = await fetchGeocode(q)
      setResults(
        (res.results ?? []).map(r => ({
          name: r.name,
          country: r.country,
          latitude: r.latitude,
          longitude: r.longitude,
          admin1: r.admin1,
        }))
      )
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }, [])

  const handleInput = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(value), 300)
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onSelect({
          name: 'Current Location',
          country: '',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      },
      () => {
        // Silently fail — user denied or unavailable
      }
    )
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ backgroundColor: 'rgba(6, 6, 26, 0.88)', backdropFilter: 'blur(16px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            className="glass-card w-full max-w-md p-6"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/60">
                Search Location
              </span>
              <button
                onClick={onClose}
                className="text-text-secondary/50 hover:text-text-primary transition-colors p-1"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Use my location */}
            <button
              onClick={handleUseMyLocation}
              className="w-full flex items-center gap-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-3 mb-4 hover:border-accent-primary/20 transition-colors duration-300"
            >
              <svg className="h-4 w-4 text-accent-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
              </svg>
              <span className="font-body text-sm text-accent-primary/80">Use my location</span>
            </button>

            {/* Search input */}
            <div className="relative mb-4">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && doSearch(query)}
                placeholder="Search city..."
                className="w-full rounded-xl bg-white/[0.03] border border-white/[0.08] px-4 py-3 pr-10 font-body text-sm text-text-primary placeholder:text-text-secondary/35 outline-none focus:border-accent-primary/30 transition-colors"
              />
              {searching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 rounded-full border-2 border-accent-primary/30 border-t-accent-primary animate-spin" />
                </div>
              )}
            </div>

            {/* Results */}
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => { trackEvent('Location Changed', { location: r.name }); onSelect(r) }}
                  className="w-full text-left rounded-xl bg-white/[0.02] border border-white/[0.04] p-3.5 hover:border-accent-primary/20 hover:bg-white/[0.03] transition-all duration-200"
                >
                  <div className="font-body text-sm text-text-primary">
                    {r.name}
                  </div>
                  <div className="font-data text-[10px] text-text-secondary/50 mt-0.5">
                    {r.admin1 ? `${r.admin1}, ` : ''}{r.country} · {r.latitude.toFixed(2)}°, {r.longitude.toFixed(2)}°
                  </div>
                </button>
              ))}
              {query.length >= 2 && !searching && results.length === 0 && (
                <div className="text-center py-4 font-body text-sm text-text-secondary/35 italic">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
