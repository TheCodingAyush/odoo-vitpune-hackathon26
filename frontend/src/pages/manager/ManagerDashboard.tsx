import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle2, XCircle, ArrowRightLeft, Maximize2, AlertTriangle, FastForward, Settings, Loader2 } from "lucide-react"
import { DelegationControls } from "@/components/manager/DelegationControls"

type QueueItem = {
  id: string;        // expense_approval.id (for the action endpoint)
  expenseId: string;
  user: string;
  date: string;
  merchant: string;
  amount: number;
  currency: string;
  converted?: number;
  category: string;
  receipt: string;
  priority: "high" | "normal";
  flagReason?: string;
}

export function ManagerDashboard() {
  const [viewMode, setViewMode] = useState<"inbox" | "settings">("inbox")
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedExpId, setSelectedExpId] = useState<string>("")
  const [selectedBulkIds, setSelectedBulkIds] = useState<Set<string>>(new Set())
  const [showModal, setShowModal] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | "escalate" | null>(null)
  const [comment, setComment] = useState("")
  const [isActing, setIsActing] = useState(false)

  const getToken = () => JSON.parse(localStorage.getItem("enterprise_auth") || "{}").token || ""

  useEffect(() => {
    fetch("http://localhost:5000/api/approvals/queue", {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const items: QueueItem[] = (data.queue || []).map((a: any) => ({
          id: String(a.id),
          expenseId: String(a.expense_id),
          user: a.employee_name || "Employee",
          date: a.date?.split("T")[0] || "",
          merchant: a.description || a.category,
          amount: parseFloat(a.amount),
          currency: a.currency || "USD",
          converted: a.converted_amount ? parseFloat(a.converted_amount) : undefined,
          category: a.category,
          receipt: `receipt_${a.expense_id}.pdf`,
          priority: parseFloat(a.amount) > 1000 ? "high" : "normal",
        }))
        setQueue(items)
        if (items.length > 0) setSelectedExpId(items[0].id)
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const selectedExp = queue.find(q => q.id === selectedExpId) || queue[0]

  const handleActionClick = (type: "approve" | "reject" | "escalate") => {
    setActionType(type)
    setShowModal(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedExp || !actionType) return
    setIsActing(true)
    const status = actionType === "escalate" ? "escalated" : (actionType === "approve" ? "approved" : "rejected")
    try {
      const res = await fetch(`http://localhost:5000/api/approvals/${selectedExp.id}/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status, comments: comment || undefined }),
      })
      if (!res.ok) throw new Error("API action failed")
      const newQueue = queue.filter(q => q.id !== selectedExp.id)
      setQueue(newQueue)
      setSelectedExpId(newQueue[0]?.id || "")
    } catch {}
    setIsActing(false)
    setShowModal(false)
    setComment("")
  }

  const handleBulkApprove = () => {
    setQueue(queue.filter(q => !selectedBulkIds.has(q.id)))
    setSelectedBulkIds(new Set())
    if (selectedBulkIds.has(selectedExpId)) {
      setSelectedExpId(queue.find(q => !selectedBulkIds.has(q.id))?.id || "")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-success opacity-50" />
        <h2 className="text-2xl font-bold">Inbox Zero</h2>
        <p className="text-muted-foreground max-w-sm">No expenses are currently waiting for your review. Great job!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manager Hub</h1>
          <p className="text-muted-foreground mt-2">Manage your approval queue and delegation rules.</p>
        </div>
        
        <div className="flex gap-4 items-center">
          {viewMode === 'inbox' && selectedBulkIds.size > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 items-center">
              <span className="text-sm font-medium">{selectedBulkIds.size} selected</span>
              <Button onClick={handleBulkApprove} className="bg-success text-success-foreground hover:bg-success/90 h-10">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Bulk Approve
              </Button>
            </motion.div>
          )}

          <div className="flex bg-muted/50 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('inbox')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                viewMode === 'inbox' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Smart Queue
            </button>
            <button
              onClick={() => setViewMode('settings')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                viewMode === 'settings' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings className="w-4 h-4" /> Delegation
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'settings' ? (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 mt-6 max-w-2xl"
          >
            <DelegationControls />
          </motion.div>
        ) : (
          <motion.div
            key="inbox"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 pt-6"
          >
            {/* Queue List */}
            <div className="w-full lg:w-1/3 overflow-y-auto space-y-3 pr-2 scrollbar-thin shrink-0">
              {queue.map(exp => (
                <Card 
                  key={exp.id} 
                  className={`cursor-pointer transition-all ${selectedExpId === exp.id ? 'ring-2 ring-primary border-primary bg-accent/30 shadow-md' : 'hover:border-primary/50'} ${exp.priority === 'high' ? 'border-l-4 border-l-destructive' : ''}`}
                  onClick={() => setSelectedExpId(exp.id)}
                >
                  <CardContent className="p-4 flex gap-3">
                    <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-muted-foreground/30 accent-primary cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                        checked={selectedBulkIds.has(exp.id)}
                        onChange={(e) => {
                          const newBox = new Set(selectedBulkIds)
                          if (e.target.checked) newBox.add(exp.id)
                          else newBox.delete(exp.id)
                          setSelectedBulkIds(newBox)
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-1 relative">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-sm line-clamp-1">{exp.user}</span>
                        <Badge variant={exp.priority === 'high' ? 'destructive' : 'secondary'} className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0">
                          {exp.priority === 'high' ? 'Priority' : 'Normal'}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground text-xs line-clamp-1 pr-6">{exp.merchant}</div>
                      <div className="font-mono font-bold tracking-tight text-foreground flex justify-between items-end mt-2">
                        <span className="text-[10px] font-sans text-muted-foreground">{exp.id}</span>
                        <span className="text-lg">
                          {exp.converted ? exp.converted.toFixed(2) : exp.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detail View */}
            {selectedExp && (
              <Card className="flex-1 flex flex-col overflow-hidden shadow-lg border-primary/20 bg-background/50 backdrop-blur-xl shrink-0 h-[600px] lg:h-auto">
                <CardHeader className="border-b bg-card/60 shrink-0 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold">{selectedExp.merchant}</CardTitle>
                      <div className="flex flex-wrap gap-2 sm:gap-3 text-sm text-muted-foreground mt-2 items-center">
                        <span>{selectedExp.date}</span>
                        <span className="hidden sm:inline">•</span>
                        <Badge variant="outline" className="text-xs bg-background">{selectedExp.category}</Badge>
                        <span className="hidden sm:inline">•</span>
                        <span>Submitted by <span className="font-medium text-foreground">{selectedExp.user}</span></span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-0 flex flex-col sm:flex-row">
                  <div className="flex-1 p-6 space-y-6 sm:border-r border-border/50">
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount Details</h4>
                      <div className="text-4xl font-mono font-bold tracking-tight mt-2 flex items-center gap-3">
                        {selectedExp.converted ? selectedExp.converted.toFixed(2) : selectedExp.amount.toFixed(2)}
                        <Badge variant="secondary" className="text-sm font-normal py-1 px-2 uppercase tracking-widest">Base</Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-4 text-sm font-medium bg-accent/50 p-3 rounded-lg border border-border/50">
                        <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Original submitted:</span>
                        <span className="font-mono font-bold">
                          {selectedExp.currency === "USD" ? "$" : selectedExp.currency === "EUR" ? "€" : selectedExp.currency}
                          {selectedExp.amount.toFixed(2)} {selectedExp.currency}
                        </span>
                      </div>
                    </div>

                    {selectedExp.flagReason && (
                    <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-r-lg space-y-1 text-sm">
                      <div className="flex items-center gap-2 font-bold text-destructive">
                        <AlertTriangle className="w-4 h-4" /> AI Hybrid Logic Flag
                      </div>
                      <p className="text-foreground/80 font-medium">Why are you seeing this?</p>
                      <p className="text-muted-foreground">{selectedExp.flagReason}. This requires manual manager sign-off before hitting CFO.</p>
                    </div>
                    )}
                  </div>

                  <div className="w-full sm:w-2/5 md:w-1/2 p-6 flex flex-col justify-center items-center bg-muted/10">
                    <div className="w-full max-w-[200px] aspect-[1/1.4] relative group cursor-pointer border-2 border-dashed border-border/60 hover:border-primary/50 rounded-xl bg-card flex flex-col items-center justify-center overflow-hidden transition-all hover:shadow-lg">
                      <Maximize2 className="absolute top-4 right-4 w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                      <FileText className="w-12 h-12 text-muted-foreground/30 mb-4 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-semibold text-muted-foreground px-4 text-center">
                        View Receipt
                        <span className="block font-mono text-[10px] mt-2 bg-muted px-2 py-1 rounded truncate max-w-full">
                          {selectedExp.receipt}
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t bg-card/60 p-4 shrink-0 grid sm:flex sm:grid-cols-none gap-3 sm:justify-end">
                  <Button variant="outline" className="gap-2 h-11 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => handleActionClick("reject")}>
                    <XCircle className="w-4 h-4" /> Reject
                  </Button>
                  <Button variant="outline" className="gap-2 h-11 border-warning/50 text-warning-foreground hover:bg-warning hover:text-warning-foreground" onClick={() => handleActionClick("escalate")}>
                    <FastForward className="w-4 h-4" /> Escalate to Admin
                  </Button>
                  <Button className="gap-2 h-11 bg-success hover:bg-success/90 text-success-foreground" onClick={() => handleActionClick("approve")}>
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </Button>
                </CardFooter>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && selectedExp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-50 w-full max-w-md"
            >
              <Card className={`border-2 shadow-2xl ${actionType === 'approve' ? 'border-success' : actionType === 'escalate' ? 'border-warning' : 'border-destructive'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    {actionType === 'approve' && <CheckCircle2 className="w-6 h-6 text-success" />}
                    {actionType === 'escalate' && <FastForward className="w-6 h-6 text-warning" />}
                    {actionType === 'reject' && <XCircle className="w-6 h-6 text-destructive" />}
                    Confirm {actionType === 'approve' ? 'Approval' : actionType === 'escalate' ? 'Escalation' : 'Rejection'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg flex justify-between items-center border border-border/50">
                    <span className="font-semibold">{selectedExp.merchant}</span>
                    <span className="font-mono font-bold">${selectedExp.amount.toFixed(2)}</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Internal Notes / Reason</label>
                    <textarea 
                      className="min-h-[100px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder={actionType === 'approve' ? "Looks good..." : actionType === 'escalate' ? "Needs VP review..." : "Provide a reason for rejection..."}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-end gap-3 bg-muted/30 border-t py-4">
                  <Button variant="ghost" className="h-10" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button 
                    className={`h-10 ${actionType === 'approve' ? 'bg-success hover:bg-success/90 text-white' : actionType === 'escalate' ? 'bg-warning hover:bg-warning/90 text-white' : 'bg-destructive hover:bg-destructive/90 text-white'}`}
                    onClick={handleConfirmAction}
                    disabled={isActing}
                  >
                    {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : `Confirm ${actionType}`}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
