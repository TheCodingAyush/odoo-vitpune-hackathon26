import { useState } from "react"
import { Search, Filter, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const auditData = [
  { id: "log_001", timestamp: "2024-03-29 10:45:22", user: "Jane Doe", action: "Policy Limit Update", resource: "Policy Engine", status: "success", ip: "192.168.1.45" },
  { id: "log_002", timestamp: "2024-03-29 10:30:11", user: "Sarah J.", action: "Bulk Approved", resource: "EXP-8902, EXP-8841", status: "success", ip: "10.0.0.12" },
  { id: "log_003", timestamp: "2024-03-29 09:15:05", user: "Mark Smith", action: "Submitted Expense", resource: "EXP-8905", status: "success", ip: "172.16.254.1" },
  { id: "log_004", timestamp: "2024-03-29 08:02:14", user: "System", action: "Auto-Rejected", resource: "EXP-8904", status: "success", details: "Policy violation: Duplicate receipt hash detected", ip: "internal" },
  { id: "log_005", timestamp: "2024-03-28 18:45:00", user: "Jane Doe", action: "Created User", resource: "Alex Chen", status: "success", ip: "192.168.1.45" },
  { id: "log_006", timestamp: "2024-03-28 14:22:10", user: "Unknown", action: "Failed Login", resource: "Auth Service", status: "failed", ip: "203.0.113.89" },
]

export function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      // Mock triggering a download
    }, 1500)
  }

  const filteredLogs = auditData.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground mt-2">Immutable record of all system events, approvals, and policy changes.</p>
        </div>
        <Button onClick={handleExport} disabled={isExporting} variant="outline" className="gap-2 shadow-sm">
          {isExporting ? <span className="animate-spin h-4 w-4 border-2 border-foreground/30 border-t-foreground rounded-full" /> : <Download className="w-4 h-4" />} 
          {isExporting ? "Generating CSV..." : "Export as CSV"}
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-9 h-11 bg-card border-border/60 shadow-sm" 
            placeholder="Search by user, action, or resource..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 shrink-0 h-11 bg-card shadow-sm">
          <Filter className="w-4 h-4" /> Date Filter
        </Button>
      </div>

      <Card className="border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left font-mono">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-semibold font-sans">
              <tr>
                <th className="px-6 py-4">Timestamp (UTC)</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Event Action</th>
                <th className="px-6 py-4">Target Resource</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="bg-card hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{log.timestamp}</td>
                  <td className="px-6 py-4 font-semibold text-foreground font-sans">{log.user}</td>
                  <td className="px-6 py-4">
                    <span className="bg-muted px-2 py-1 rounded text-xs">{log.action}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground flex flex-col gap-1">
                    {log.resource}
                    {log.details && <span className="text-[10px] text-destructive/80 font-sans">{log.details}</span>}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={log.status === 'success' ? 'success' : 'destructive'} className="capitalize shadow-none">
                      {log.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                    {log.ip}
                  </td>
                </tr>
              ))}
              
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground font-sans">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    No audit records found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="text-xs text-center text-muted-foreground/50 font-mono">
        Showing last 30 days. Logs are retained immutably for compliance purposes.
      </div>
    </div>
  )
}
