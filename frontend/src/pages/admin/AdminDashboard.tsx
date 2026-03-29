import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts"
import { 
  DollarSign, 
  Users, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles
} from "lucide-react"

const monthlyData = [
  { name: "Jan", expenses: 4000 },
  { name: "Feb", expenses: 3000 },
  { name: "Mar", expenses: 2000 },
  { name: "Apr", expenses: 2780 },
  { name: "May", expenses: 1890 },
  { name: "Jun", expenses: 2390 },
  { name: "Jul", expenses: 3490 },
]

const recentActivity = [
  {
    id: 1,
    user: "Alice Smith",
    action: "Submitted an expense report ($450.00)",
    time: "2 hours ago",
    status: "pending"
  },
  {
    id: 2,
    user: "Robert Johnson",
    action: "Approved Software License ($120.00)",
    time: "4 hours ago",
    status: "approved"
  },
  {
    id: 3,
    user: "Emma Davis",
    action: "Rejected Travel Expense ($2,400.00) - Over limit",
    time: "1 day ago",
    status: "rejected"
  }
]

const categoryData = [
  { name: "Travel", budget: 15000, spent: 12400 },
  { name: "Software", budget: 8000, spent: 8540 },
  { name: "Meals", budget: 5000, spent: 2100 },
  { name: "Office", budget: 2000, spent: 800 },
]

const anomalyData = [
  { id: 1, type: "Duplicate", merchant: "Uber Rides", amount: "$45.00", user: "John Doe", risk: "High" },
  { id: 2, type: "Weekend Spend", merchant: "Starbucks", amount: "$12.00", user: "Sarah J.", risk: "Low" },
  { id: 3, type: "Over Limit", merchant: "AWS Services", amount: "$5,540.00", user: "Emma Davis", risk: "High" },
]

export function AdminDashboard() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-2">Metrics and system status at a glance.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}>
          <Card className="ring-1 ring-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Processed</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-success mr-1" />
                <span className="text-success">+20.1%</span> from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="ring-1 ring-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Employees</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-success mr-1" />
                <span className="text-success">+180</span> new this year
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="ring-1 ring-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Approval Time</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14h 32m</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingDown className="h-3 w-3 text-destructive mr-1" />
                <span className="text-destructive">-12%</span> slower recently
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="ring-1 ring-border/50 shadow-sm bg-primary text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary-foreground/80">Pending Final Review</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-primary-foreground/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-primary-foreground/70 mt-1">
                Awaiting Finance Department
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        {/* AI Insights Panel */}
        <motion.div variants={item} className="col-span-3">
          <Card className="h-full ring-1 ring-border/50 shadow-sm border-warning/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-warning" /> AI Insights & Anomalies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomalyData.map((anomaly) => (
                  <div key={anomaly.id} className="flex flex-col gap-1 p-3 rounded-lg bg-muted/40 border border-border/50">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`h-4 w-4 ${anomaly.risk === 'High' ? 'text-destructive' : 'text-warning'}`} />
                        <span className="font-semibold text-sm">{anomaly.type}</span>
                      </div>
                      <Badge variant={anomaly.risk === 'High' ? 'destructive' : 'secondary'} className="text-[10px] uppercase">{anomaly.risk} Risk</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-muted-foreground">{anomaly.merchant} - <span className="text-foreground">{anomaly.user}</span></span>
                      <span className="font-mono font-bold text-sm">{anomaly.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="col-span-4">
          <Card className="h-full ring-1 ring-border/50 shadow-sm">
            <CardHeader className="pb-0">
              <CardTitle>Category Budgets vs Spent</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} style={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }} />
                  <Bar dataKey="budget" name="Budget Limit" fill="hsl(var(--muted-foreground))" fillOpacity={0.3} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spent" name="Spent Amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        <motion.div variants={item} className="col-span-4">
          <Card className="h-full ring-1 ring-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Expenditure Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary-base)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary-base)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tickMargin={10}
                    style={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tickMargin={10}
                    tickFormatter={(value) => `$${value}`}
                    style={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'var(--color-primary-base)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="var(--ring)" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: "var(--background)", strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="col-span-3">
          <Card className="h-full ring-1 ring-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivity.map((activity, i) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="relative mt-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold ring-4 ring-background">
                        {activity.user.charAt(0)}
                      </div>
                      {i !== recentActivity.length - 1 && (
                        <div className="absolute left-1/2 top-8 -ml-px h-full w-0.5 bg-muted" />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 pb-2">
                      <span className="text-sm font-medium leading-none">{activity.user}</span>
                      <span className="text-sm text-muted-foreground mt-1.5 leading-snug">
                        {activity.action}
                      </span>
                      <span className="text-xs text-muted-foreground/60 mt-1">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
