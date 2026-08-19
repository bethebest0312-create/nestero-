'use client'

import React, { createContext, useContext, useState } from 'react'

const ToastContext = createContext<{ toast: (msg: string) => void } | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<string[]>([])
  function toast(msg: string) {
    setMessages((s) => [...s, msg])
    setTimeout(() => setMessages((s) => s.slice(1)), 3000)
  }
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div aria-live="polite" style={{position:'fixed',right:12,top:12}}>
        {messages.map((m, i) => (
          <div key={i} style={{background:'#111',color:'#fff',padding:8,margin:6,borderRadius:6}}>{m}</div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
