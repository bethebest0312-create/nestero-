import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  // security headers
  // Common security headers
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'geolocation=()')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')

  // Cross-origin isolation headers (optional - enable only if your app needs COOP/COEP)
  // res.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  // res.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')

  // Content Security Policy — conservative, allows fonts.googleapis.com and inline styles for now (revise for production)
  const csp = [
    "default-src 'self'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.openai.com https://api.stripe.com",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "frame-ancestors 'none'",
  ].join('; ')
  res.headers.set('Content-Security-Policy', csp)
  return res
}

export const config = {
  matcher: '/:path*'
}
