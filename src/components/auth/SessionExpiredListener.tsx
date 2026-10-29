import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { SESSION_EXPIRED_EVENT } from '@/lib/auth-token'

/**
 * Mounted once inside the router. When the API layer reports a dead session
 * (see `emitSessionExpired` in lib/auth-token), tell the user and send them to
 * sign in, remembering where they were so the login page can return them.
 */
const SessionExpiredListener = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  // Keep the latest location in a ref so the listener never goes stale
  // without needing to re-subscribe on every navigation.
  const locationRef = useRef(location)
  locationRef.current = location

  useEffect(() => {
    const onExpired = () => {
      toast({
        title: 'Session expired',
        description: 'Please sign in again to continue.',
        variant: 'destructive',
      })
      const { pathname, search } = locationRef.current
      if (pathname !== '/login' && pathname !== '/signup') {
        navigate('/login', { replace: true, state: { from: pathname + search } })
      }
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired)
  }, [navigate, toast])

  return null
}

export default SessionExpiredListener
