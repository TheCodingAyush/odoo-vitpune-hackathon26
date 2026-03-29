import { useState } from "react"
import { motion, Reorder } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GripVertical, Plus, ArrowRight, Settings2, Trash2, ShieldAlert } from "lucide-react"

export function WorkflowBuilder() {
  const [items, setItems] = useState([
    { id: "1", role: "Direct Manager", type: "standard", rules: [] },
    { id: "2", role: "Finance Team", type: "conditional", rules: ["Amount > $1000"] },
    { id: "3", role: "Director / CFO", type: "strict", rules: ["Specific Approver", "Amount > $5000"] }
  ])

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflow Builder</h1>
          <p className="text-muted-foreground mt-2">Design multi-step sequencing and conditional rules.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Step
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card className="border-0 shadow-sm bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Approval Sequence</CardTitle>
              <CardDescription>Drag and drop to reorder the approval hierarchy.</CardDescription>
            </CardHeader>
            <CardContent>
              <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
                {items.map((item, index) => (
                  <Reorder.Item key={item.id} value={item}>
                    <motion.div 
                      className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
                      whileHover={{ scale: 1.01 }}
                    >
                      <GripVertical className="text-muted-foreground w-5 h-5 flex-shrink-0" />
                      
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{item.role}</h4>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {item.rules.length > 0 ? item.rules.map(r => (
                            <Badge key={r} variant="secondary" className="text-xs bg-accent/80 hover:bg-accent border">
                              {r}
                            </Badge>
                          )) : (
                            <span className="text-xs text-muted-foreground italic">Always requires approval</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Settings2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
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
              </Reorder.Group>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row items-center gap-2 text-lg">
                <ShieldAlert className="w-5 h-5 text-warning" />
                Rule Engine
              </CardTitle>
              <CardDescription>Drag conditions into steps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg bg-card text-sm font-medium cursor-grab active:cursor-grabbing hover:ring-1 ring-primary transition-all flex items-center justify-between">
                <span>Amount &gt; $500</span>
                <Badge variant="outline" className="text-[10px]">Financial</Badge>
              </div>
              <div className="p-3 border rounded-lg bg-card text-sm font-medium cursor-grab active:cursor-grabbing hover:ring-1 ring-primary transition-all flex items-center justify-between">
                <span>Out of Policy</span>
                <Badge variant="outline" className="text-[10px]">Compliance</Badge>
              </div>
              <div className="p-3 border rounded-lg bg-card text-sm font-medium cursor-grab active:cursor-grabbing hover:ring-1 ring-primary transition-all flex items-center justify-between">
                <span>Specific Approver</span>
                <Badge variant="outline" className="text-[10px]">Routing</Badge>
              </div>
              <div className="p-3 border rounded-lg bg-card text-sm font-medium cursor-grab active:cursor-grabbing hover:ring-1 ring-primary transition-all flex items-center justify-between">
                <span>Missing Receipt</span>
                <Badge variant="outline" className="text-[10px]">Validation</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
