import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, MoreHorizontal, UserCog, Mail, ShieldAlert, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock User Data
const initialUsers = [
  { id: "usr_1", name: "Jane Doe", email: "jane@acme.com", role: "admin", manager: null, status: "active", lastLogin: "Just now" },
  { id: "usr_2", name: "Sarah J.", email: "sarah@acme.com", role: "manager", manager: "Jane Doe", status: "active", lastLogin: "2 hrs ago" },
  { id: "usr_3", name: "Mark Smith", email: "mark@acme.com", role: "employee", manager: "Sarah J.", status: "active", lastLogin: "5 hrs ago" },
  { id: "usr_4", name: "Alex Chen", email: "alex@acme.com", role: "employee", manager: "Sarah J.", status: "invited", lastLogin: "Never" },
]

export function UserManagement() {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Add User Form State
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newRole, setNewRole] = useState("employee")
  const [newManager, setNewManager] = useState("Sarah J.")

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newEmail) return
    
    setUsers([...users, {
      id: "usr_" + Math.random().toString(36).substring(2, 7),
      name: newName,
      email: newEmail,
      role: newRole,
      manager: newRole === 'admin' ? null : newManager,
      status: "invited",
      lastLogin: "Never"
    }])
    setIsAddModalOpen(false)
    setNewName("")
    setNewEmail("")
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization & Users</h1>
          <p className="text-muted-foreground mt-2">Manage employee roles, access levels, and reporting hierarchies.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Invite User
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-9 h-11 bg-card border-border/60" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          {filteredUsers.length} total users
        </div>
      </div>

      <Card className="border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role / Access</th>
                <th className="px-6 py-4">Reports To</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Activity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="bg-card hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs ring-1 ring-primary/20">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{user.name}</p>
                        <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className={`w-4 h-4 ${user.role === 'admin' ? 'text-destructive' : user.role === 'manager' ? 'text-warning' : 'text-primary'}`} />
                      <span className="capitalize font-medium text-foreground/80">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-medium">
                    {user.manager ? (
                      <span className="flex items-center gap-1.5 bg-accent/50 w-fit px-2 py-1 rounded-md text-xs">
                        <UserCog className="w-3.5 h-3.5" />
                        {user.manager}
                      </span>
                    ) : (
                      <span className="text-xs italic opacity-60">Top Level</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.status === 'active' ? 'success' : 'secondary'} className="capitalize shadow-sm">
                      {user.status === 'active' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add User Modal Mock */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
            >
              <Card className="shadow-2xl border-border">
                <form onSubmit={handleCreateUser}>
                  <CardContent className="pt-6 space-y-4">
                    <h2 className="text-xl font-bold mb-4">Invite New User</h2>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input required value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Emily Boss" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input required type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="emily@acme.com" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Role Access</label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                        >
                          <option value="employee">Employee</option>
                          <option value="manager">Manager</option>
                          <option value="admin">System Admin</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Reports To</label>
                        <select 
                          disabled={newRole === 'admin'}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
                          value={newManager}
                          onChange={(e) => setNewManager(e.target.value)}
                        >
                          <option value="Jane Doe">Jane Doe (CEO)</option>
                          <option value="Sarah J.">Sarah J. (Head of Ops)</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                  <div className="flex justify-end gap-3 p-6 pt-2 bg-muted/30 border-t rounded-b-xl mt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                    <Button type="submit">Send Invite</Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
