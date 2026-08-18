'use client'

import React from 'react'

export default function IconLogo({ size = 40 }: { size?: number }) {
  return (
    <img src="/logo.svg" alt="Nestero logo" width={size} height={size} style={{display:'block'}} />
  )
}
