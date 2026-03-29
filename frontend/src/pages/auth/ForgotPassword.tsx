import { useState, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card"
import { Loader2, CheckCircle2, RefreshCw, KeyRound, Mail } from "lucide-react"

export function ForgotPassword() {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Helper to handle API mock delay
  const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms))

  // Step 1: Request OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email) {
      setError("Please enter your registered email.")
      return
    }
    setIsLoading(true)
    await simulateDelay(1200)
    setIsLoading(false)
    setStep(2)
  }

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const code = otp.join("")
    if (code.length < 6) {
      setError("Please enter the 6-digit verification code.")
      return
    }
    setIsLoading(true)
    await simulateDelay(1500)
    // Accept any code for demo
    if (code === "000000") {
      setError("Invalid code. Try 123456.")
      setIsLoading(false)
      return
    }
    setIsLoading(false)
    setStep(3)
  }

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!newPassword || newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    setIsLoading(true)
    await simulateDelay(1500)
    setIsLoading(false)
    setStep(4)
    setTimeout(() => {
      navigate("/login")
    }, 3000)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    // Auto advance focus
    if (value !== "" && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 ring-1 ring-border/50 backdrop-blur-xl bg-background/80 overflow-hidden relative">
          
          {/* Progress Bar Header */}
          <div className="absolute top-0 left-0 w-full h-1 bg-muted">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "25%" }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <AnimatePresence mode="wait">
            {/* --- STEP 1: EMAIL --- */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <CardHeader className="space-y-2 text-center pt-8">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl mx-auto flex items-center justify-center mb-2">
                    <Mail className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl font-semibold tracking-tight">Forgot Password</CardTitle>
                  <CardDescription>We'll send a verification code to your email to reset your password.</CardDescription>
                </CardHeader>
                <form onSubmit={handleRequestOTP}>
                  <CardContent className="space-y-4">
                    {error && <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">{error}</div>}
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11"
                        disabled={isLoading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-4">
                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Code"}
                    </Button>
                    <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                      Back to Login
                    </Link>
                  </CardFooter>
                </form>
              </motion.div>
            )}

            {/* --- STEP 2: OTP --- */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <CardHeader className="space-y-2 text-center pt-8">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl mx-auto flex items-center justify-center mb-2">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl font-semibold tracking-tight">Enter Secure Code</CardTitle>
                  <CardDescription>Please enter the 6-digit code sent to<br/><strong className="text-foreground">{email}</strong></CardDescription>
                </CardHeader>
                <form onSubmit={handleVerifyOTP}>
                  <CardContent className="space-y-4">
                    {error && <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">{error}</div>}
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, idx) => (
                        <Input
                          key={idx}
                          ref={(el) => { otpRefs.current[idx] = el; }}
                          type="text"
                          inputMode="numeric"
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="h-14 w-12 text-center text-xl font-bold bg-muted/30"
                          disabled={isLoading}
                          maxLength={1}
                        />
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-4">
                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify Code"}
                    </Button>
                    <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center">
                      <RefreshCw className="mr-2 h-3 w-3" /> Wrong email? Start over
                    </button>
                  </CardFooter>
                </form>
              </motion.div>
            )}

            {/* --- STEP 3: RESET PASSWORD --- */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <CardHeader className="space-y-2 text-center pt-8">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl mx-auto flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <CardTitle className="text-2xl font-semibold tracking-tight">Set New Password</CardTitle>
                  <CardDescription>Your new password must be different from previously used passwords.</CardDescription>
                </CardHeader>
                <form onSubmit={handleResetPassword}>
                  <CardContent className="space-y-4">
                    {error && <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">{error}</div>}
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="New Password (min 8 chars)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="h-11 bg-muted/50"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-11 bg-muted/50"
                        disabled={isLoading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update Password"}
                    </Button>
                  </CardFooter>
                </form>
              </motion.div>
            )}

            {/* --- STEP 4: SUCCESS --- */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 px-6 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight">Password Reset Successfully</h3>
                <p className="text-muted-foreground text-sm max-w-sm pb-4">
                  You can now use your new password to log in to your account. Redirecting you...
                </p>
                <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  )
}
