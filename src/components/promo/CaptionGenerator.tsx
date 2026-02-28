'use client'

import { useState } from 'react'
import type { CaptionSet } from '@/lib/promo-utils'
import { copyToClipboard } from '@/lib/promo-utils'

interface CaptionGeneratorProps {
  label: string
  captions: CaptionSet
}

const VARIANTS: { key: keyof CaptionSet; label: string }[] = [
  { key: 'educational', label: 'Educational' },
  { key: 'practitioner', label: 'Practitioner' },
  { key: 'engagement', label: 'Engagement' },
]

export default function CaptionGenerator({ label, captions }: CaptionGeneratorProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = async (key: string, text: string) => {
    await copyToClipboard(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="glass-card p-4">
      <div className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/50 mb-3">
        {label} — Captions
      </div>
      <div className="space-y-3">
        {VARIANTS.map(({ key, label: variantLabel }) => (
          <div key={key} className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-data text-[9px] tracking-wider text-text-secondary/40">
                {variantLabel}
              </span>
              <button
                onClick={() => handleCopy(key, captions[key])}
                className="font-data text-[9px] tracking-wider text-accent-primary/60 hover:text-accent-primary transition-colors"
              >
                {copied === key ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="font-body text-xs text-text-secondary/60 leading-relaxed whitespace-pre-line">
              {captions[key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
