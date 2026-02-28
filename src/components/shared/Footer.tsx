'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <motion.footer
      className="py-12 px-4 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <div className="font-body text-xs font-light text-text-secondary/[0.35] leading-relaxed space-y-1">
        <p>Built by Remi — Sound Healer &amp; Developer</p>
        <p>Part of the Harmonic Waves ecosystem</p>
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
          <a href="https://airas.app" className="hover:text-accent-primary/60 transition-colors">airas.app</a>
          <span>·</span>
          <a href="https://shumann.app" className="hover:text-accent-primary/60 transition-colors">shumann.app</a>
          <span>·</span>
          <a href="https://lunata.app" className="hover:text-accent-primary/60 transition-colors">lunata.app</a>
          <span>·</span>
          <a href="https://tidara.app" className="hover:text-accent-primary/60 transition-colors">tidara.app</a>
          <span>·</span>
          <a href="https://sonarus.app" className="hover:text-accent-primary/60 transition-colors">sonarus.app</a>
        </p>
      </div>
    </motion.footer>
  )
}
