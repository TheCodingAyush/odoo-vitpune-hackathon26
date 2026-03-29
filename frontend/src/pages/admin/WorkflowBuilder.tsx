import { useState, useEffect } from "react"
import { motion, Reorder } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GripVertical, Plus, ArrowRight, Trash2, Save, Loader2 } from "lucide-react"
import api from "@/lib/api"

type AppUser = {
  id: number;
  name: string;
  role: string;
}

type StepItem = {
  id: string; // for framer-motion key
  approverId: number | "";
}

export function WorkflowBuilder() {
  const [items, setItems] = useState<StepItem[]>([])
  const [users, setUsers] = useState<AppUser[]>([])
  const [ruleName, setRuleName] = useState("Default Sequential Rule")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users to populate dropdowns
        const usersRes = await api.get("/users")
        console.log("Users API Response:", usersRes.data)
        const usersData = usersRes.data
        const eligibleUsers = (usersData.users || []).filter((u: any) => u.role === "manager" || u.role === "admin")
        setUsers(eligibleUsers)

        // Fetch existing rules
        const rulesRes = await api.get("/rules")
        const rulesData = rulesRes.data
        
        const existingRules = rulesData.rules || []
        const sequentialRule = existingRules.find((r: any) => r.rule_type === "sequential")
        
        if (sequentialRule && sequentialRule.steps) {
          setRuleName(sequentialRule.name)
          const sortedSteps = [...sequentialRule.steps].sort((a: any, b: any) => a.step_order - b.step_order)
          setItems(sortedSteps.map(s => ({
            id: String(Math.random()),
            approverId: s.approver_id
          })))
        } else {
          // default starting state
          setItems([{ id: "1", approverId: "" }])
        }
      } catch (err: any) {
        console.error("API Call Failed:", err.response?.data || err.message || err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAddStep = () => {
    setItems([...items, { id: String(Math.random()), approverId: "" }])
  }

  const handleDeleteStep = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleApproverChange = (id: string, newApproverId: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, approverId: parseInt(newApproverId, 10) } : item
    ))
  }

  const handleSave = async () => {
    setMessage({ type: "", text: "" })
    
    // Validate
    if (items.length === 0) {
      setMessage({ type: "error", text: "You must have at least one step." })
      return
    }
    if (items.some(item => !item.approverId)) {
      setMessage({ type: "error", text: "Please select an approver for all steps." })
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        name: ruleName,
        ruleType: "sequential",
        steps: items.map((item, index) => ({
          approverId: item.approverId,
          stepOrder: index + 1
        }))
      }

      await api.post("/rules", payload)

      setMessage({ type: "success", text: "Approval workflow saved successfully!" })
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || err.message || "Failed to save rule" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center h-40 items-center"><Loader2 className="animate-spin w-8 h-8 text-muted-foreground" /></div>
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center sm:items-end flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflow Builder</h1>
          <p className="text-muted-foreground mt-2">Design multi-step sequential approval rules.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={handleAddStep} className="flex-1 sm:flex-none">
            <Plus className="w-4 h-4 mr-2" /> Add Step
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-none">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Workflow
          </Button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg font-medium ${message.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
          {message.text}
        </div>
      )}

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Sequential Approval Rules</CardTitle>
              <CardDescription>Drag and drop to reorder the approval hierarchy.</CardDescription>
            </div>
            <input 
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder="Rule Name"
              className="text-sm border bg-background px-3 py-1.5 rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-48"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
            {items.map((item, index) => (
              <Reorder.Item key={item.id} value={item}>
                <motion.div 
                  className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-xl border shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                >
                  <GripVertical className="text-muted-foreground w-5 h-5 hidden sm:block flex-shrink-0" />
                  
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>

                  <div className="flex-1 w-full sm:w-auto">
                    <label className="text-xs text-muted-foreground font-medium mb-1 block">Assigned Approver</label>
                    <select
                      value={item.approverId}
                      onChange={(e) => handleApproverChange(item.id, e.target.value)}
                      className="w-full h-10 border bg-background rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="" disabled>Select an approver...</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteStep(item.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
                
                {index < items.length - 1 && (
                  <div className="flex justify-center my-2 text-muted-foreground/40">
                    <ArrowRight className="w-5 h-5 rotate-90" />
                  </div>
                )}
              </Reorder.Item>
            ))}
            
            {items.length === 0 && (
              <div className="text-center py-12 text-muted-foreground italic border-2 border-dashed rounded-xl">
                No approvers assigned. Add a step to get started.
              </div>
            )}
          </Reorder.Group>
        </CardContent>
      </Card>
    </div>
  )
}
