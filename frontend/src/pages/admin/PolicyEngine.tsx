import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Copy, AlertTriangle, ShieldCheck } from "lucide-react"

export function PolicyEngine() {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  
  const handleSave = () => {
    setSaveStatus("saving")
    setTimeout(() => {
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }, 1000)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policy & Rules Engine</h1>
          <p className="text-muted-foreground mt-2">Configure enforcement rules, budget limits, and AI strictness.</p>
        </div>
        <Button onClick={handleSave} disabled={saveStatus === "saving"} className="gap-2 px-6">
          {saveStatus === "saving" ? (
            <span className="flex items-center gap-2"><span className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full" /> Saving...</span>
          ) : saveStatus === "saved" ? (
            <span className="flex items-center gap-2 text-success-foreground bg-success"><CheckCircle2 className="w-4 h-4" /> Saved</span>
          ) : (
            "Save Policies"
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Limits & Budgets */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="w-5 h-5 text-primary" /> Hard Limits & Budgets
            </CardTitle>
            <CardDescription>Expenses exceeding these amounts require CFO escalation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Auto-Escalation Threshold (USD)</label>
              <Input type="number" defaultValue="5000" />
              <p className="text-xs text-muted-foreground">Any single transaction above this amount bypasses immediate managers.</p>
            </div>
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold mb-3">Category-specific Limits (Monthly)</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-sm w-32">Travel</span>
                  <Input type="number" defaultValue="2000" className="flex-1" />
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-sm w-32">Meals & Ent.</span>
                  <Input type="number" defaultValue="500" className="flex-1" />
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-sm w-32">Office Supplies</span>
                  <Input type="number" defaultValue="200" className="flex-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI & Fraud Prevention */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-warning" /> Fraud & Anomaly Detection
            </CardTitle>
            <CardDescription>Configure AI strictness for duplicate detection and unusual patterns.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <label className="text-sm font-medium">Duplicate Receipt Tolerance</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="high">Strict - Exact amount, date, and merchant required</option>
                <option value="medium">Adaptive - AI contextual similarity matching</option>
                <option value="low">Low - Only exact hash matches blocked</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Out-of-hours Submission Flagging</label>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" defaultChecked />
                <span className="text-sm">Flag expenses submitted between 12 AM and 5 AM</span>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t">
              <label className="text-sm font-medium">Weekend Expense Rules</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="allow_all">Allow without warnings</option>
                <option value="warn">Warn User but allow</option>
                <option value="block">Block and require explicit justification</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Templates */}
        <Card className="md:col-span-2 shadow-sm border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Copy className="w-5 h-5 text-primary" /> Approval Flow Templates
            </CardTitle>
            <CardDescription>Select a base template to apply organization-wide defaults.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="border border-primary bg-background rounded-xl p-4 shadow-sm cursor-pointer ring-2 ring-primary ring-offset-2 ring-offset-background">
                <h4 className="font-bold mb-1">Standard Corporate</h4>
                <p className="text-xs text-muted-foreground">Employee → Direct Manager → Finance.</p>
              </div>
              <div className="border bg-background rounded-xl p-4 shadow-sm cursor-pointer hover:border-primary/50 transition-colors">
                <h4 className="font-bold mb-1">High Velocity</h4>
                <p className="text-xs text-muted-foreground">Auto-approve items &lt;$100. Rest go to Manager.</p>
              </div>
              <div className="border bg-background rounded-xl p-4 shadow-sm cursor-pointer hover:border-primary/50 transition-colors">
                <h4 className="font-bold mb-1">Strict Compliance</h4>
                <p className="text-xs text-muted-foreground">Every expense requires 2-step verification including VP.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
