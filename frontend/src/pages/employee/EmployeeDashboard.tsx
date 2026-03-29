import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { ExpenseTimeline, type TimelineStep } from "@/components/employee/ExpenseTimeline"

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

const myExpenses: Expense[] = [
  { 
    id: "EXP-8902", date: "2024-03-25", merchant: "Delta Airlines", amount: "$450.00", category: "Travel", status: "pending", 
    steps: [
      { name: "Submitted", status: "completed" as const, date: "Mar 25", actor: "You" },
      { name: "Manager Approval", status: "pending" as const, date: "Waiting", actor: "Sarah J." },
      { name: "Finance Review", status: "upcoming" as const, date: "" }
    ]
  },
  { 
    id: "EXP-8841", date: "2024-03-20", merchant: "AWS Services", amount: "$120.00", category: "Software", status: "approved", 
    steps: [
      { name: "Submitted", status: "completed" as const, date: "Mar 20", actor: "You" },
      { name: "Manager Approval", status: "completed" as const, date: "Mar 21", actor: "Sarah J.", comment: "Looks good for the Q1 hosting" },
      { name: "Finance Review", status: "completed" as const, date: "Mar 22", actor: "Finance Dept" },
      { name: "Reimbursement Paid", status: "completed" as const, date: "Mar 24" }
    ]
  },
  { 
    id: "EXP-8700", date: "2024-03-15", merchant: "Uber Rides", amount: "$45.00", category: "Travel", status: "rejected", 
    reason: "Out of policy limit for short distance without prior approval. Please use public transit for distances under 5 miles.",
    steps: [
      { name: "Submitted", status: "completed" as const, date: "Mar 15", actor: "You" },
      { name: "Manager Approval", status: "rejected" as const, date: "Mar 16", actor: "Sarah J." },
    ]
  }
]

export function EmployeeDashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Expenses</h1>
          <p className="text-muted-foreground mt-2">Track history and live approval timelines.</p>
        </div>
        <Button className="shadow-md hover:shadow-lg transition-all" onClick={() => window.location.href='/employee/submit'}>
          Submit New
        </Button>
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
