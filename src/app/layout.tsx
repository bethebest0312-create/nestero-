import './globals.css'
import React from 'react'
import { ToastProvider } from '@/components/ToastProvider'

export const metadata = {
  title: 'Nestero',
  description: 'Scaffolded app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
