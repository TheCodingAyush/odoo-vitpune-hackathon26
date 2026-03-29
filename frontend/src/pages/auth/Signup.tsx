import { useState } from "react"
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
import { Loader2, CheckCircle2, Building2, User } from "lucide-react"

export function Signup() {
  const [isNewCompany, setIsNewCompany] = useState(true)
  const [companyName, setCompanyName] = useState("")
  const [country, setCountry] = useState("")
  const [currency, setCurrency] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  
  const [countries, setCountries] = useState<{name: string, currency: string}[]>([])

  import { useEffect } from "react"
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,currencies")
      .then(res => res.json())
      .then(data => {
        const parsed = data
          .map((c: any) => {
            const currencyCode = Object.keys(c.currencies || {})[0] || "USD"
            return { name: c.name.common, currency: currencyCode }
          })
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
        setCountries(parsed)
      })
      .catch(console.error)
  }, [])
  
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value
    setCountry(selectedName)
    const found = countries.find(c => c.name === selectedName)
    if (found) {
      setCurrency(found.currency)
    }
  }

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email || !password || !name || !companyName || !country || !currency) {
      setError("Please fill in all fields.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, country, currency, name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Signup failed. Please try again.")
        setIsLoading(false)
        return
      }

      setIsLoading(false)
      setIsSuccess(true)
      setTimeout(() => navigate("/login"), 3000)
    } catch (err) {
      setError("Could not connect to server. Make sure the backend is running.")
      setIsLoading(false)
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
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="signup-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CardHeader className="space-y-2 text-center pb-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl mx-auto flex items-center justify-center mb-2">
                    {isNewCompany ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
                  </div>
                  <CardTitle className="text-2xl font-semibold tracking-tight">
                    {isNewCompany ? "Register Company" : "Request Access"}
                  </CardTitle>
                  <CardDescription>
                    {isNewCompany 
                      ? "Create a new Reimburse workspace for your team" 
                      : "Join your company's existing Reimburse workspace"}
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                  <CardContent className="space-y-4">
                    
                    {/* Mode Toggle */}
                    <div className="flex p-1 bg-muted/50 rounded-lg">
                      <button
                        type="button"
                        onClick={() => { setIsNewCompany(false); setError(""); }}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                          !isNewCompany ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Employee
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsNewCompany(true); setError(""); }}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                          isNewCompany ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Company Admin
                      </button>
                    </div>

                    {error && (
                      <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                        {error}
                      </div>
                    )}
                    
                    <AnimatePresence>
                      {isNewCompany && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <div className="space-y-2">
                            <label className="text-sm font-medium leading-none block text-muted-foreground">Workspace Name</label>
                            <Input
                              placeholder="Acme Corp LLC"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              className="h-11 bg-muted/50 focus:bg-background transition-colors"
                              disabled={isLoading}
                            />
                          </div>
                          
                          <div className="space-y-2 pt-2">
                            <label className="text-sm font-medium leading-none block text-muted-foreground">Country</label>
                            <select 
                              value={country}
                              onChange={handleCountryChange}
                              disabled={isLoading || countries.length === 0}
                              className="w-full h-11 bg-muted/50 rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <option value="" disabled>Select a country</option>
                              {countries.map(c => (
                                <option key={c.name} value={c.name}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="space-y-2 pt-2">
                            <label className="text-sm font-medium leading-none block text-muted-foreground">Base Currency</label>
                            <Input
                              value={currency || "Select a country first"}
                              disabled
                              className="h-11 bg-muted/50 opacity-70 cursor-not-allowed"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none block text-muted-foreground">Full Name</label>
                      <Input
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11 bg-muted/50 focus:bg-background transition-colors"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none block text-muted-foreground">Work Email</label>
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
                      <label className="text-sm font-medium leading-none block text-muted-foreground">Password</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 bg-muted/50 focus:bg-background transition-colors"
                        disabled={isLoading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-4">
                    <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isNewCompany ? "Setting up workspace..." : "Creating Account..."}
                        </>
                      ) : (
                        isNewCompany ? "Register Company" : "Create Account"
                      )}
                    </Button>
                    <div className="text-sm text-center text-muted-foreground">
                      Already have an account?{" "}
                      <Link to="/login" className="text-primary font-semibold hover:underline">
                        Sign In
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="signup-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  {isNewCompany ? "Workspace Created!" : "Account Created!"}
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  {isNewCompany 
                    ? `Your tenant workspace has been initialized. Redirecting you to login...` 
                    : `Your employee account has been successfully created. We are redirecting you...`}
                </p>
                <div className="pt-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  )
}
