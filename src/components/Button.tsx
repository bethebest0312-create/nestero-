'use client'

import React from 'react'

export default function Button({ children, variant = 'primary', onClick }: { children: React.ReactNode; variant?: 'primary'|'ghost'; onClick?: () => void }) {
  const base = 'vibe-btn'
  const cls = variant === 'primary' ? `${base} accent-gradient text-white px-4 py-2 rounded-md` : `${base} bg-white/5 text-white px-3 py-2 rounded-md`
  return (
    <button onClick={onClick} className={cls}>{children}</button>
  )
}
