import { useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useAuthStore, type Role } from "@/lib/store"
import { motion } from "framer-motion"
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
import { Loader2 } from "lucide-react"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [role, setRole] = useState<Role>("admin") // Demo purpose
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)

    // Simulate network latency for enterprise feel
    await new Promise(resolve => setTimeout(resolve, 800))

    if (password !== "password") {
      setError("Invalid credentials. Use 'password' for demo.")
      setIsLoading(false)
      return
    }

    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." + Date.now();
    
    login({
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      name: "Jane Doe",
      email: email,
      role: role,
      tenantId: "TENANT-101",
      tenantName: "Acme Corp"
    }, mockToken)
    
    // Redirect logic: respect 'from' location if it exists
    const from = location.state?.from?.pathname
    if (from) {
      navigate(from, { replace: true })
    } else {
      if (role === "admin") navigate("/admin", { replace: true })
      else navigate(`/${role}`, { replace: true })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md shadow-2xl border-0 ring-1 ring-border/50 backdrop-blur-xl bg-background/80">
          <CardHeader className="space-y-2 text-center">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl mx-auto flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Sign in to Reimburse
            </CardTitle>
            <CardDescription>
              Enter your corporate credentials below
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none mb-2 block text-muted-foreground">Work Email</label>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-muted/50 focus:bg-background transition-colors"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none block text-muted-foreground">Password</label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-muted/50 focus:bg-background transition-colors"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground pt-1">Use 'password' to get in</p>
              </div>
              
              <div className="space-y-2 pt-2 border-t mt-4">
                <label className="text-sm font-medium leading-none mb-2 block text-muted-foreground">Demo Role Selector</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["admin", "manager", "employee"] as const).map((r) => (
                    <div
                      key={r}
                      onClick={() => !isLoading && setRole(r)}
                      className={`cursor-pointer border rounded-lg p-2 text-center text-xs font-medium capitalize transition-all ${
                        role === r
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background hover:bg-muted"
                      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary font-semibold hover:underline">
                  Request Access
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
