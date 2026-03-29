import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PlayCircle, PauseCircle, RotateCcw, FileText, CheckCircle2, User, Building, Landmark } from "lucide-react"

const SIM_STEPS = [
  { id: "submit", title: "Employee Submit", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/50" },
  { id: "manager", title: "Direct Manager", icon: User, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/50" },
  { id: "finance", title: "Finance Dept", icon: Building, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/50" },
  { id: "cfo", title: "CFO (Conditional >$5000)", icon: Landmark, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/50" },
  { id: "approved", title: "Fully Approved", icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/50" }
]

export function LiveSimulation() {
  const [activeStep, setActiveStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [expensePos, setExpensePos] = useState(0)

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>
    if (isPlaying) {
      interval = setInterval(() => {
        setExpensePos(prev => {
          if (prev >= SIM_STEPS.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 2500) // Move every 2.5s
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  useEffect(() => {
    setActiveStep(expensePos)
  }, [expensePos])

  const restart = () => {
    setIsPlaying(false)
    setExpensePos(0)
    setActiveStep(0)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="text-center w-full max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-orange-500 bg-clip-text text-transparent">Live Workflow Simulation</h1>
        <p className="text-lg text-muted-foreground">Watch exactly how our rule engine routes expenses dynamically based on amount and criteria.</p>
        
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button size="lg" onClick={() => setIsPlaying(!isPlaying)} className={isPlaying ? "bg-warning hover:bg-warning/90 text-warning-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground"}>
            {isPlaying ? <PauseCircle className="mr-2 h-5 w-5" /> : <PlayCircle className="mr-2 h-5 w-5" />}
            {isPlaying ? "Pause Simulation" : "Start Simulation"}
          </Button>
          <Button size="lg" variant="outline" onClick={restart}>
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </div>
      </div>

      <div className="w-full relative mt-16 p-8">
        {/* Background Track */}
        <div className="absolute top-[50%] left-8 right-8 h-2 bg-muted rounded-full -translate-y-1/2" />
        
        {/* Active Track Progress */}
        <motion.div 
          className="absolute top-[50%] left-8 h-2 bg-primary rounded-full -translate-y-1/2 z-0"
          initial={{ width: "0%" }}
          animate={{ width: `${(expensePos / (SIM_STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        <div className="relative z-10 flex justify-between w-full">
          {SIM_STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center gap-4 relative">
              {/* Step Node */}
              <motion.div
                className={`w-16 h-16 rounded-2xl border-4 bg-background flex items-center justify-center transition-all ${activeStep >= index ? step.border : 'border-muted'} ${activeStep === index ? 'ring-4 ring-primary/30 scale-110' : ''}`}
                animate={{ 
                  scale: activeStep === index ? 1.1 : 1,
                  borderColor: activeStep >= index ? 'var(--tw-ring-color)' : 'hsl(var(--muted))' // Simplification
                }}
              >
                <step.icon className={`w-8 h-8 ${activeStep >= index ? step.color : 'text-muted-foreground'}`} />
              </motion.div>
              
              <div className="text-center absolute top-20 w-32 -mx-8">
                <span className={`block font-semibold text-sm transition-colors ${activeStep >= index ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </div>
            </div>
          ))}

          {/* Floating Expense Marker */}
          <motion.div 
            className="absolute top-0 w-16 h-16 flex items-center justify-center pointer-events-none"
            initial={{ left: "0%" }}
            animate={{ left: `${(expensePos / (SIM_STEPS.length - 1)) * 100}%`, x: "-50%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <AnimatePresence>
              {expensePos < SIM_STEPS.length - 1 && (
                <motion.div 
                  initial={{ scale: 0, y: -20, opacity: 0 }}
                  animate={{ scale: 1, y: -40, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="bg-card border shadow-xl rounded-lg p-3 w-48 font-mono text-sm"
                >
                  <div className="text-xs text-muted-foreground font-sans font-semibold uppercase tracking-wider mb-1">Evaluating Rule...</div>
                  <div className="text-foreground">$6,200.00 Expense</div>
                  <div className="text-success mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Rule Passed</div>
                  <div className="absolute -bottom-2 left-1/2 -ml-2 w-4 h-4 bg-card border-b border-r rotate-45 transform" />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute inset-0 border-4 border-dashed border-primary rounded-2xl animate-[spin_4s_linear_infinite] opacity-50" />
          </motion.div>
        </div>
      </div>

    </div>
  )
}
