import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, MoreHorizontal, UserCog, Mail, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api"

type User = {
  id: string | number;
  name: string;
  email: string;
  role: string;
  manager_id: string | number | null;
  status?: string;
  created_at?: string;
  manager_name?: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Add User Form State
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newRole, setNewRole] = useState("employee")
  const [newManager, setNewManager] = useState("")

  useEffect(() => {
    api.get("/users")
      .then(res => {
        const uList = res.data.users || []
        // Map manager names
        const enriched = uList.map((u: any) => {
          const mgr = uList.find((m: any) => m.id === u.manager_id)
          return { ...u, manager_name: mgr?.name }
        })
        setUsers(enriched)
        
        // Auto-select first available manager for the form
        const possibleMgrs = enriched.filter((u: any) => u.role === 'manager' || u.role === 'admin')
        if (possibleMgrs.length > 0) {
          setNewManager(String(possibleMgrs[0].id))
        }
      })
      .catch()
      .finally(() => setIsLoading(false))
  }, [])

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const possibleManagers = users.filter(u => u.role === 'manager' || u.role === 'admin')

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newEmail) return
    setErrorMsg("")
    setIsCreating(true)
    
    try {
      const res = await api.post("/users/create", {
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
        managerId: newRole === 'admin' ? null : parseInt(newManager) || null
      })

      const data = res.data

      const newUser = data.user
      const mgr = users.find(u => u.id === newUser.manager_id)
      newUser.manager_name = mgr?.name

      setUsers([...users, newUser])
      setIsAddModalOpen(false)
      setNewName("")
      setNewEmail("")
      setNewPassword("")
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to create user")
    } finally {
      setIsCreating(false)
    }
  }



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
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
                    {user.manager_name ? (
                      <span className="flex items-center gap-1.5 bg-accent/50 w-fit px-2 py-1 rounded-md text-xs">
                        <UserCog className="w-3.5 h-3.5" />
                        {user.manager_name}
                      </span>
                    ) : (
                      <span className="text-xs italic opacity-60">Top Level</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="success" className="capitalize shadow-sm">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Just now'}
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
                      <Input required value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Emily Boss" disabled={isCreating} />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input required type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="emily@acme.com" disabled={isCreating} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Temporary Password</label>
                      <Input required type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" disabled={isCreating} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Role Access</label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          disabled={isCreating}
                        >
                          <option value="employee">Employee</option>
                          <option value="manager">Manager</option>
                          <option value="admin">System Admin</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Reports To</label>
                        <select 
                          disabled={newRole === 'admin' || isCreating}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
                          value={newManager}
                          onChange={(e) => setNewManager(e.target.value)}
                        >
                          {possibleManagers.map(m => (
                            <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
                  </CardContent>
                  <div className="flex justify-end gap-3 p-6 pt-2 bg-muted/30 border-t rounded-b-xl mt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isCreating}>Cancel</Button>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Send Invite
                    </Button>
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
