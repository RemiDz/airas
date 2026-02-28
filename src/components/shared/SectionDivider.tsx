'use client'

import { motion } from 'framer-motion'

interface SectionDividerProps {
  label: string
}

export default function SectionDivider({ label }: SectionDividerProps) {
  return (
    <motion.div
      className="section-divider"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.6 }}
    >
      <span>{label}</span>
    </motion.div>
  )
}
