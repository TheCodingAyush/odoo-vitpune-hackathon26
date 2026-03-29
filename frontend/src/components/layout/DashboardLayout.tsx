import { useState } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { useAuthStore } from "@/lib/store"
import { useTheme } from "../Theme/ThemeProvider"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Receipt,
  Users,
  GitMerge,
  Settings,
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  PlayCircle
} from "lucide-react"

export function DashboardLayout() {
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Dynamic Navigation depending on Role
  const navItems = [
    ...(user?.role === "admin"
      ? [
          { name: "Admin Setup", path: "/admin", icon: LayoutDashboard },
          { name: "Users & Roles", path: "/admin/users", icon: Users },
          { name: "Workflow Builder", path: "/admin/workflow", icon: GitMerge },
          { name: "Simulation", path: "/simulation", icon: PlayCircle }, // Showpiece
        ]
      : []),
    ...(user?.role === "manager"
      ? [
          { name: "Approvals", path: "/manager", icon: LayoutDashboard },
          { name: "Team Expenses", path: "/manager/expenses", icon: Receipt },
        ]
      : []),
    ...(user?.role === "employee"
      ? [
          { name: "My Dashboard", path: "/employee", icon: LayoutDashboard },
          { name: "Submit Expense", path: "/employee/submit", icon: Receipt },
        ]
      : []),
  ]

  return (
    <div className="flex h-screen w-full bg-background no-scrollbar">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r bg-card flex flex-col justify-between hidden md:flex"
      >
        <div>
          <div className="flex items-center h-16 px-6 border-b font-bold tracking-widest text-primary text-xl">
            Reimburse
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content Pane */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10 transition-all">
          
          {/* Global Search Mock */}
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search expenses, users..."
              className="w-full pl-9 pr-4 py-2 rounded-full border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-accent text-foreground transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2 rounded-full hover:bg-accent relative text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
            </button>
            
            {/* User Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {user?.name.charAt(0).toUpperCase() || "U"}
              </button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl border bg-card text-card-foreground shadow-lg overflow-hidden z-50 origin-top-right"
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{user?.email}</p>
                      <div className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase bg-primary/10 text-primary border-primary/20">
                        {user?.role}
                      </div>
                    </div>
                    <div className="p-1">
                      <button className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground text-foreground">
                        <Settings className="h-4 w-4" /> Account Settings
                      </button>
                    </div>
                    <div className="p-1 border-t">
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors text-destructive hover:bg-destructive/10 font-medium"
                      >
                        <LogOut className="h-4 w-4" /> Log out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto p-6 md:p-8 bg-background relative selection:bg-primary/20">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
