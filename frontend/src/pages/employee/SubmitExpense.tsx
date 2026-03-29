import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { CheckCircle2, ChevronRight, ChevronLeft, Calendar, FileText, BadgeDollarSign, Info, Search, ArrowRightLeft, AlertTriangle } from "lucide-react"
import { ReceiptUploader } from "@/components/employee/ReceiptUploader"
import { convertCurrency } from "@/lib/currency"
import api from "@/lib/api"

export function SubmitExpense() {
  const defaultCurrency = useAppStore(state => state.currency)
  const [step, setStep] = useState(1) // 1: Upload, 2: Review Data, 3: Details & Submit, 4: Success
  
  // Form State
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [merchant, setMerchant] = useState("")
  const [currency, setCurrency] = useState(defaultCurrency)
  const [category, setCategory] = useState("Travel")
  const [purpose, setPurpose] = useState("")
  const [submitError, setSubmitError] = useState("")
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleScanComplete = (extractedData: { amount: string; date: string; merchant: string }) => {
    setAmount(extractedData.amount)
    setDate(extractedData.date)
    setMerchant(extractedData.merchant)
    setTimeout(() => {
      setStep(2) // Move to review step natively
    }, 800)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError("")
    try {
      await api.post("/expenses", {
        amount: parseFloat(amount) || 0,
        currency,
        category,
        description: purpose || merchant || category,
        date: date || new Date().toISOString().split("T")[0],
      })
      
      setIsSubmitting(false)
      setStep(4)
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || err.message || "Failed to submit expense")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header and Progress Indicator */}
      {step < 4 && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Report Expense</h1>
              <p className="text-muted-foreground mt-1">Let our AI handle the heavy lifting for you.</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold px-3 py-1 bg-accent rounded-full text-foreground/80">Step {step} of 3</span>
            </div>
          </div>
          
          <div className="w-full bg-border h-2 rounded-full overflow-hidden mt-2">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "33%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        
        {/* STEP 1: UPLOAD */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pt-4"
          >
            <ReceiptUploader onScanComplete={handleScanComplete} />
            <div className="flex justify-end mt-6">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => setStep(2)}>
                Skip scanning <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: REVIEW OCR DATA */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="shadow-lg border-border">
              <CardHeader className="bg-muted/30 border-b pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1.5 bg-primary/10 rounded-md text-primary"><Search className="w-5 h-5"/></span>
                  <CardTitle className="text-xl">Verify Details</CardTitle>
                </div>
                <CardDescription>Review the data extracted from your receipt. Correct any inaccuracies.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2 text-foreground/90">
                      <FileText className="w-4 h-4 text-muted-foreground" /> Merchant Info
                    </label>
                    <Input 
                      value={merchant} 
                      onChange={(e) => setMerchant(e.target.value)} 
                      placeholder="e.g. Uber, Amazon, Hilton"
                      className="h-12 text-base transition-all focus:ring-primary/50"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2 text-foreground/90">
                      <Calendar className="w-4 h-4 text-muted-foreground" /> Transcription Date
                    </label>
                    <Input 
                      type="date" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)} 
                      className="h-12 text-base transition-all"
                    />
                  </div>
                  
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-sm font-medium flex items-center gap-2 text-foreground/90">
                      <BadgeDollarSign className="w-4 h-4 text-muted-foreground" /> Transaction Amount
                    </label>
                    <div className="flex gap-2">
                      <select 
                        className="h-12 w-28 rounded-md border border-input bg-background/50 px-3 py-2 font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                        <option value="CAD">CAD ($)</option>
                      </select>
                      <Input 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        className="h-12 font-mono text-lg flex-1 transition-all" 
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                </div>
              </CardContent>
              <CardFooter className="flex justify-between bg-accent/20 border-t py-4">
                <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                  <ChevronLeft className="w-4 h-4" /> Rescan Receipt
                </Button>
                <Button onClick={() => setStep(3)} className="gap-2 px-8 shadow-sm">
                  Continue <ChevronRight className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* STEP 3: DETAILS & SUBMIT */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="shadow-lg border-primary/20 ring-1 ring-primary/5">
              <CardHeader className="border-b bg-primary/5 pb-6">
                <CardTitle className="text-xl">Just a few more details</CardTitle>
                <CardDescription>Categorize and explain the business context for approval.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 pt-6">
                
                {submitError && (
                  <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm border border-destructive/20 font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {submitError}
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground/90">Category Allocation</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Travel", "Meals", "Software", "Equipment"].map(cat => (
                      <div 
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`border rounded-lg p-3 text-center text-sm font-medium cursor-pointer transition-all ${
                          category === cat ? 'bg-primary text-primary-foreground border-primary shadow-md transform scale-[1.02]' : 'bg-background hover:bg-muted/50 border-input'
                        }`}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground/90">Business Purpose</label>
                  <textarea 
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all resize-none"
                    placeholder="E.g., Client dinner with ACME Corp leadership regarding Q3 negotiations..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                  />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Info className="w-3.5 h-3.5" />
                    Detailed descriptions significantly speed up the approval process.
                  </div>
                </div>

                {/* Summary Box */}
                <div className="bg-muted p-4 rounded-xl flex items-center justify-between mt-2 border border-border/50">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Claim</p>
                    <div className="flex flex-col">
                      <p className="text-2xl font-bold font-mono">{currency} {amount || "0.00"}</p>
                      {currency !== defaultCurrency && amount && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                           <ArrowRightLeft className="w-3 h-3" />
                           Est. {defaultCurrency} {convertCurrency(parseFloat(amount) || 0, currency, defaultCurrency).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">Destination</p>
                    <p className="text-sm font-semibold">{merchant || "Unknown Merchant"}</p>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="flex justify-between bg-accent/20 border-t py-4">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="px-8 shadow-md hover:shadow-lg transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Finalizing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Submit Report
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center"
          >
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight mb-3">Expense Submitted</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
              Report <strong>EXP-{Math.floor(Math.random() * 10000)}</strong> has been routed to your manager for review.
            </p>
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => { setStep(1); setAmount(""); setMerchant(""); setPurpose(""); setDate(""); setSubmitError(""); }}>
                Submit Another
              </Button>
              <Button asChild>
                <a href="/employee">Return to Dashboard</a>
              </Button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
