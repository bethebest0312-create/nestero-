// Minimal auth helpers (placeholder). Choose actual provider (NextAuth or Clerk) and replace.

export type User = {
  id: string
  email?: string | null
  name?: string | null
}

export async function getCurrentUser(): Promise<User | null> {
  // Replace with real integration. This is a compile-safe placeholder.
  return null
}

export function requireAuth(): never | void {
  // Throw or redirect in real impl.
  return
}
