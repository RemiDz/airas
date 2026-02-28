'use client'

import { motion } from 'framer-motion'
import type { SessionGuidance } from '@/lib/practitioner'

interface ModalityChecklistProps {
  modalities: SessionGuidance['modalities']
}

const containerVariants = {
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
}

export default function ModalityChecklist({ modalities }: ModalityChecklistProps) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-2 sm:grid-cols-2"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {modalities.map((m) => (
        <motion.div
          key={m.name}
          className="flex items-start gap-2.5 rounded-xl bg-white/[0.02] px-3.5 py-2.5 border border-white/[0.04]"
          variants={itemVariants}
        >
          {/* Status icon */}
          <span className="mt-0.5 flex-shrink-0">
            {m.safe ? (
              <svg className="h-4 w-4 text-status-good" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-4 w-4 text-status-moderate" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
            )}
          </span>

          <div className="min-w-0">
            <div className={`font-body text-sm ${m.safe ? 'text-text-primary' : 'text-text-secondary/70'}`}>
              {m.name}
            </div>
            {m.note && (
              <div className="font-body text-[11px] text-text-secondary/45 leading-snug mt-0.5">
                {m.note}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
