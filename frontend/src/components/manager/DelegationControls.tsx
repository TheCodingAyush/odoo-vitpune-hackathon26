import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users2, Clock, CalendarDays, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DelegationControls() {
  const [isActive, setIsActive] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <Users2 className="w-5 h-5 text-primary" /> Manager Delegation & Timeouts
        </CardTitle>
        <CardDescription>Configure auto-forwarding rules when you are out of office or unavailable.</CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
          <div className="flex gap-4 items-center">
            <div className={`p-2 rounded-full ${isActive ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Out of Office Coverage</h4>
              <p className="text-sm text-muted-foreground mt-0.5">Automatically route your queue to a colleague.</p>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={isActive} onChange={() => setIsActive(!isActive)} />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
          </label>
        </div>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Input type="date" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Delegate To</label>
                  <select className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                    <option>Select a colleague...</option>
                    <option>Sarah J. (Manager)</option>
                    <option>David Lee (Director)</option>
                    <option>Jane Doe (Admin)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4 pt-6 border-t">
          <div className="flex gap-4 items-center mb-4">
            <div className="p-2 rounded-full bg-warning/20 text-warning">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Auto-Escalation Timeouts</h4>
              <p className="text-sm text-muted-foreground mt-0.5">Prevent bottlenecks by forwarding delayed approvals.</p>
            </div>
          </div>

          <div className="space-y-3 pl-4 border-l-2 ml-4">
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm w-48 font-medium">Priority "High" Expenses</span>
              <div className="flex-1 flex items-center gap-2">
                <select className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm max-w-[150px]">
                  <option value="24">After 24 hours</option>
                  <option value="48">After 48 hours</option>
                  <option value="never">Do not forward</option>
                </select>
                <span className="text-sm text-muted-foreground">→ Escalate to System Admin</span>
              </div>
            </div>

            <div className="flex justify-between items-center gap-4">
              <span className="text-sm w-48 font-medium">Standard Expenses</span>
              <div className="flex-1 flex items-center gap-2">
                <select className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm max-w-[150px]" defaultValue="never">
                  <option value="48">After 48 hours</option>
                  <option value="72">After 72 hours</option>
                  <option value="never">Do not forward</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
           <Button onClick={handleSave} className="w-32">
             {isSaved ? <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Saved</span> : "Save Settings"}
           </Button>
        </div>
      </CardContent>
    </Card>
  )
}
