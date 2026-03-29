import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Filter, Loader2, RefreshCcw } from "lucide-react"
import { ExpenseTimeline, type TimelineStep } from "@/components/employee/ExpenseTimeline"
import api from "@/lib/api"

type Expense = {
  id: string;
  date: string;
  merchant: string;
  amount: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  reason?: string;
  steps: TimelineStep[];
}

export function EmployeeDashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [myExpenses, setMyExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchExpenses = async () => {
    try {
      const { data } = await api.get("/expenses/my")
      const expenses: Expense[] = (data.expenses || []).map((e: any) => ({
        id: `EXP-${e.id}`,
        date: e.date?.split("T")[0] || "",
        merchant: e.description || e.category,
        amount: `${e.currency} ${parseFloat(e.amount).toFixed(2)}`,
        category: e.category,
        status: e.status as "pending" | "approved" | "rejected",
        steps: [
          { name: "Submitted", status: "completed" as const, date: e.date?.split("T")[0] || "", actor: "You" },
          { name: "Manager Review", status: e.status === "pending" ? "pending" as const : "completed" as const, date: "" },
        ],
      }))
      setMyExpenses(expenses)
    } catch {
      // Background ping fail
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
    const interval = setInterval(fetchExpenses, 10000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Expenses</h1>
          <p className="text-muted-foreground mt-2">Track history and live approval timelines.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="shadow-sm hover:shadow-md transition-all gap-2" onClick={fetchExpenses}>
            <RefreshCcw className="w-4 h-4" /> Refresh
          </Button>
          <Button className="shadow-md hover:shadow-lg transition-all" onClick={() => window.location.href='/employee/submit'}>
            Submit New
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input className="w-full h-11 pl-10 pr-4 rounded-xl border bg-card/60 shadow-sm text-sm transition-all focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Search by merchant or ID..." />
        </div>
        <Button variant="outline" className="gap-2 shrink-0 h-11 px-5 rounded-xl border-border bg-card shadow-sm">
          <Filter className="w-4 h-4" /> Filters
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {myExpenses.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 h-full ${selectedId === exp.id ? 'ring-2 ring-primary shadow-lg border-primary/50 translate-y-[-2px]' : 'hover:border-primary/50 hover:shadow-md'}`}
              onClick={() => setSelectedId(exp.id === selectedId ? null : exp.id)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <span className="text-xs font-bold tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-md">{exp.id}</span>
                    <h3 className="font-bold text-lg leading-tight mt-3">{exp.merchant}</h3>
                  </div>
                  <Badge variant={exp.status === 'approved' ? 'success' : exp.status === 'rejected' ? 'destructive' : 'secondary'} className="capitalize shadow-sm">
                    {exp.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-border/50">
                  <div className="text-sm font-medium text-muted-foreground">
                    <p>{exp.date}</p>
                    <p className="mt-0.5">{exp.category}</p>
                  </div>
                  <div className="text-2xl font-bold font-mono tracking-tight text-foreground">{exp.amount}</div>
                </div>

                <AnimatePresence>
                  {selectedId === exp.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <ExpenseTimeline steps={exp.steps} reason={exp.reason} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
