/**
 * Shared helpers for the stored auth session.
 *
 * The backend issues HS256 JWTs with an `exp` claim (24h by default). The app
 * previously treated any token string in localStorage as a live session, so an
 * expired token left the UI looking signed in while every protected request
 * failed with 401. These helpers make expiry visible on the client and give the
 * axios layer and the auth context one place to clear a dead session.
 */

export const TOKEN_KEY = 'auth_token'
export const USER_KEY = 'user_data'

/** Fired on `window` when a protected request is rejected because the session is dead. */
export const SESSION_EXPIRED_EVENT = 'auth:session-expired'

/** Treat a token as expired this many seconds early to absorb clock skew. */
const EXPIRY_SKEW_SECONDS = 30

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

/**
 * True only when the token carries a numeric `exp` that is already in the past.
 * A token we cannot decode is NOT reported as expired; the server stays the
 * authority for anything we cannot read.
 */
export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token) return false
  const payload = decodeJwtPayload(token)
  const exp = payload?.exp
  if (typeof exp !== 'number') return false
  return exp <= Date.now() / 1000 + EXPIRY_SKEW_SECONDS
}

/** Returns the `exp` claim as a Date, or null when absent/unreadable. */
export function getTokenExpiry(token: string | null | undefined): Date | null {
  if (!token) return null
  const exp = decodeJwtPayload(token)?.exp
  return typeof exp === 'number' ? new Date(exp * 1000) : null
}

export function clearStoredSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch {
    /* storage unavailable */
  }
}

/**
 * Reads the stored token. If it has expired, the dead session is removed from
 * storage and null is returned, so callers can treat "expired" and "absent"
 * identically.
 */
export function readStoredToken(): string | null {
  let token: string | null = null
  try {
    token = localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
  if (!token) return null
  if (isTokenExpired(token)) {
    clearStoredSession()
    return null
  }
  return token
}

let lastEmit = 0

/**
 * Clears the session and notifies the app once. Repeated calls within a short
 * window (e.g. several parallel requests all failing) collapse into one event.
 */
export function emitSessionExpired(): void {
  clearStoredSession()
  const now = Date.now()
  if (now - lastEmit < 1000) return
  lastEmit = now
  try {
    window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT))
  } catch {
    /* non-browser environment */
  }
}
