import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Globe2, CheckCircle2 } from "lucide-react"

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "INR", symbol: "₹" },
]

export function Onboarding() {
  const [step, setStep] = useState(1)
  const setCurrency = useAppStore((state) => state.setCurrency)
  const currency = useAppStore((state) => state.currency)
  const navigate = useNavigate()

  const [company, setCompany] = useState("")

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
    else navigate("/admin")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-success/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-lg z-10">
        <div className="flex justify-between mb-8 px-2 relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-muted -z-10 -translate-y-1/2" />
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                s <= step
                  ? "bg-primary text-primary-foreground ring-4 ring-background"
                  : "bg-muted text-muted-foreground ring-4 ring-background"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
            >
              <Card className="border-0 shadow-lg ring-1 ring-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Building2 className="w-6 h-6 text-primary" />
                    Company Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Name</label>
                      <Input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Acme Corp"
                        className="h-12"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end bg-muted/20 border-t p-4 mt-6">
                  <Button onClick={nextStep} disabled={!company} className="px-8">
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
            >
              <Card className="border-0 shadow-lg ring-1 ring-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Globe2 className="w-6 h-6 text-primary" />
                    Base Currency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {currencies.map((c) => (
                      <div
                        key={c.code}
                        onClick={() => setCurrency(c.code)}
                        className={`cursor-pointer rounded-xl p-4 border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                          currency === c.code
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50 text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        <span className="text-2xl font-semibold">{c.symbol}</span>
                        <span className="font-medium">{c.code}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="justify-between bg-muted/20 border-t p-4 mt-6">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={nextStep} className="px-8">
                    Set up Workspace
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <Card className="border-0 shadow-lg ring-1 ring-border/50 text-center py-12">
                <CardContent className="flex flex-col items-center justify-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <CheckCircle2 className="w-20 h-20 text-success" />
                  </motion.div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">You're All Set!</h2>
                    <p className="text-muted-foreground">
                      {company} has been created using {currency} as the default currency.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="justify-center mt-4">
                  <Button size="lg" onClick={nextStep} className="w-full max-w-sm h-12">
                    Enter Dashboard
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
