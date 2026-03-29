import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/Theme/ThemeProvider";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { Onboarding } from "./pages/auth/Onboarding";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { WorkflowBuilder } from "./pages/admin/WorkflowBuilder";
import { UserManagement } from "./pages/admin/UserManagement";
import { PolicyEngine } from "./pages/admin/PolicyEngine";
import { AuditLogs } from "./pages/admin/AuditLogs";
import { EmployeeDashboard } from "./pages/employee/EmployeeDashboard";
import { SubmitExpense } from "./pages/employee/SubmitExpense";
import { ManagerDashboard } from "./pages/manager/ManagerDashboard";
import { LiveSimulation } from "./pages/simulation/LiveSimulation";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SessionManager } from "./components/auth/SessionManager";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <SessionManager />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes Wrapper */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/admin" replace />} />
            
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Admin */}
            <Route path="/admin">
              <Route index element={<AdminDashboard />} />
              <Route path="workflow" element={<WorkflowBuilder />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="policy" element={<PolicyEngine />} />
              <Route path="audit" element={<AuditLogs />} />
            </Route>
            
            {/* Employee */}
            <Route path="/employee">
              <Route index element={<EmployeeDashboard />} />
              <Route path="submit" element={<SubmitExpense />} />
            </Route>
            
            {/* Manager */}
            <Route path="/manager">
              <Route index element={<ManagerDashboard />} />
              <Route path="expenses" element={<div className="p-8 text-2xl font-bold">Team Expenses Tracker (Coming Soon)</div>} />
            </Route>

            {/* Shared/Simulation */}
            <Route path="/simulation" element={<LiveSimulation />} />
          </Route>
          
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
