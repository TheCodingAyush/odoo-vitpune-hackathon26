import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export function SessionManager() {
  const { pingActivity, isAuthenticated, sessionExpiresAt, logout } = useAuthStore()
  const navigate = useNavigate()
  const [showWarning, setShowWarning] = useState(false)
  
  useEffect(() => {
    if (!isAuthenticated) return

    // Ping activity on user interaction
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart']
    const handleActivity = () => pingActivity()

    activityEvents.forEach(event => window.addEventListener(event, handleActivity))

    // Check expiration every minute
    const interval = setInterval(() => {
      if (!sessionExpiresAt) return
      
      const timeRemaining = sessionExpiresAt - Date.now()
      
      // Show warning if less than 5 minutes remaining
      if (timeRemaining > 0 && timeRemaining < 5 * 60 * 1000) {
        setShowWarning(true)
      } else if (timeRemaining <= 0) {
        // Force logout if expired
        setShowWarning(false)
        logout()
        navigate("/login", { replace: true, state: { sessionExpired: true } })
      }
    }, 60000)

    return () => {
      activityEvents.forEach(event => window.removeEventListener(event, handleActivity))
      clearInterval(interval)
    }
  }, [isAuthenticated, sessionExpiresAt, pingActivity, logout, navigate])

  const handleExtend = () => {
    pingActivity() // Extend session
    setShowWarning(false)
  }

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <div className="bg-destructive text-destructive-foreground p-4 rounded-xl shadow-2xl border border-destructive/20 flex flex-col gap-3">
            <div className="flex gap-3">
              <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Session Expiring Soon</h4>
                <p className="text-sm opacity-90 mt-1">
                  For your security, your session will expire due to inactivity in less than 5 minutes.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button size="sm" variant="secondary" onClick={() => setShowWarning(false)} className="text-xs h-8">
                Dismiss
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-8 bg-transparent text-destructive-foreground border-destructive-foreground hover:bg-destructive-foreground hover:text-destructive" onClick={handleExtend}>
                Stay Logged In
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
