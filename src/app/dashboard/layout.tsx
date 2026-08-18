import React from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{display:'flex',minHeight:'100vh'}}>
      <aside style={{width:240,background:'#f5f5f5',padding:16}}>Dashboard</aside>
      <section style={{flex:1,padding:16}}>{children}</section>
    </div>
  )
}
