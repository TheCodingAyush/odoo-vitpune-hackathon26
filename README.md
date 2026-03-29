# 💸 Reimbursement Management System

> **Odoo x VIT Pune Hackathon 26**

A full-stack enterprise reimbursement platform with multi-currency support, hierarchical approval workflows, and role-based dashboards for Admins, Managers, and Employees.

---

## 👥 Team

| Name | Role |
|------|------|
| **Ayush Sonone** | Team Leader |
| **Pratik Kolhe** | Developer |
| **Aditya Bhangale** | Developer |
| **Kaustubh Deshmukh** | Developer |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Tailwind CSS (Vite) |
| **Backend** | Node.js + Express |
| **Database** | PostgreSQL |
| **Auth** | JWT (jsonwebtoken) |
| **State** | Zustand |
| **Animations** | Framer Motion |
| **Currency API** | exchangerate-api.com |

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js ≥ 18
- PostgreSQL running locally
- `.env` file configured (see below)

### 1. Backend

```bash
cd backend
npm install
# Configure your .env file (see Environment Variables section)
# Run the schema against your PostgreSQL database:
# psql -U <user> -d <database> -f schema.sql
npm start
# Runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
# Runs on http://localhost:5173
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=your_database_name

JWT_SECRET=your_super_secret_jwt_key
```

---

## 🗃️ Database Schema

### `companies`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| name | VARCHAR | Company name |
| country | VARCHAR | |
| currency | VARCHAR | Base currency code (e.g. INR, USD) |
| created_at | TIMESTAMP | |

### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| company_id | INTEGER FK | → companies |
| name | VARCHAR | |
| email | VARCHAR UNIQUE | |
| password | VARCHAR | bcrypt hashed |
| role | VARCHAR | `admin` / `manager` / `employee` |
| manager_id | INTEGER FK | Self-referencing → users |
| created_at | TIMESTAMP | |

### `expenses`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| employee_id | INTEGER FK | → users |
| company_id | INTEGER FK | → companies |
| amount | NUMERIC | Original amount |
| currency | VARCHAR | Original currency |
| converted_amount | NUMERIC | Converted to company base currency |
| category | VARCHAR | Travel / Meals / Software / Equipment |
| description | TEXT | |
| date | DATE | |
| status | VARCHAR | `pending` / `approved` / `rejected` |
| receipt_url | TEXT | Optional |

### `approval_rules`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| company_id | INTEGER FK | → companies |
| name | VARCHAR | Rule display name |
| rule_type | VARCHAR | `sequential` / `percentage` / `specific` |
| percentage_threshold | NUMERIC | Required for `percentage` rules |
| specific_approver_id | INTEGER FK | Required for `specific` rules |

### `approval_rule_steps`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| rule_id | INTEGER FK | → approval_rules |
| approver_id | INTEGER FK | → users |
| step_order | INTEGER | Ordered sequence |

### `expense_approvals`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| expense_id | INTEGER FK | → expenses |
| approver_id | INTEGER FK | → users |
| step_number | INTEGER | Step in the chain |
| status | VARCHAR | `pending` / `approved` / `rejected` |
| comments | TEXT | Optional feedback |
| acted_at | TIMESTAMP | When action was taken |

---

## 📡 API Endpoints

All protected routes require: `Authorization: Bearer <token>`

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register company + admin user |
| POST | `/api/auth/login` | Public | Login, returns JWT |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/users/create` | Admin | Create employee or manager |
| GET | `/api/users` | Admin | List all users in company |
| PATCH | `/api/users/:id/role` | Admin | Update user role |
| PATCH | `/api/users/:id/manager` | Admin | Assign manager to user |

### Expenses
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/expenses` | Any auth user | Submit expense (auto currency convert) |
| GET | `/api/expenses/my` | Any auth user | View own expense history |
| GET | `/api/expenses/pending` | Manager | View pending from direct reports |
| GET | `/api/expenses/all` | Admin | View all company expenses |

### Approvals
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/approvals/queue` | Manager / Admin | View personal pending approval queue |
| POST | `/api/approvals/:id/action` | Manager / Admin | Approve or reject with comments |

### Rules
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/rules` | Admin | Create rule + steps |
| GET | `/api/rules` | Admin | List all rules with steps |
| POST | `/api/rules/assign` | Admin | Assign rule to existing expense |

### Currency
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/currency/rate?from=USD&to=INR` | Any auth user | Get live exchange rate |
| GET | `/api/currency/convert?amount=100&from=USD&to=INR` | Any auth user | Convert amount |

---

## ✅ Features Implemented

### Backend
- **Auth** — Signup creates company + admin user in a transaction; login returns a signed JWT
- **JWT Middleware** — Verifies Bearer token on all protected routes; attaches `userId`, `companyId`, `role` to `req.user`
- **Role-Based Access Control** — `isAdmin`, `isManager`, `isEmployee` middleware guards applied per route
- **User Management** — Admin can create users, update roles, assign managers (all scoped to company)
- **Expense Submission** — Live currency conversion via exchangerate-api; stores original + converted amount
- **Approval Engine** — Initializes per-expense approval chains from rule steps; processes sequential step-by-step approvals
- **60% Rule** — `percentage` rule type auto-approves expense once threshold of approvers agrees
- **Specific Approver Rule** — Routes directly to a designated approver
- **Sequential Rule** — Ordered multi-step approval chain (step 1 → step 2 → ...)

### Frontend
- **Login / Signup** — Connected to real backend; JWT stored in Zustand + localStorage
- **Protected Routes** — `ProtectedRoute` component guards all dashboard pages; auto-redirects to `/login` on 401
- **Employee Dashboard** — Loads real expense history from `GET /api/expenses/my` with approval timeline
- **Submit Expense** — 3-step animated form submitting to `POST /api/expenses`
- **OCR Receipt Scanning** — Immersive layout in `SubmitExpense.tsx` allowing drag-and-drop receipt capture
- **Manager Dashboard** — Loads real approval queue; approve/reject actions call `POST /api/approvals/:id/action`
- **Admin Dashboard** — Shows live totals (processed amount, employee count, pending count) from real APIs; Recent Activity from real expenses
- **Dark/Light Theme** — System theme toggle with persistence

---

## 📁 Project Structure

```
odoo-vitpune-hackathon26/
├── backend/
│   ├── config/db.js              # PostgreSQL pool
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── expenseController.js
│   │   ├── approvalController.js
│   │   ├── ruleController.js
│   │   └── currencyController.js
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── roleCheck.js          # isAdmin / isManager / isEmployee
│   ├── models/
│   │   ├── User.js
│   │   ├── Company.js
│   │   ├── Expense.js
│   │   ├── ApprovalRule.js
│   │   ├── ApprovalRuleStep.js
│   │   └── ExpenseApproval.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── approvalRoutes.js
│   │   ├── ruleRoutes.js
│   │   └── currencyRoutes.js
│   ├── utils/
│   │   ├── token.js              # JWT generation
│   │   ├── currencyHelper.js     # Live exchange rate fetch
│   │   └── approvalEngine.js     # Chain init + step processing
│   └── index.js                  # Express app entry point
│
└── frontend/
    └── src/
        ├── lib/
        │   ├── api.ts            # Axios client with JWT interceptor
        │   ├── store.ts          # Zustand auth + app state
        │   └── currency.ts       # Client-side currency utils
        ├── pages/
        │   ├── auth/             # Login, Signup, ForgotPassword
        │   ├── admin/            # AdminDashboard, UserManagement, WorkflowBuilder
        │   ├── manager/          # ManagerDashboard
        │   ├── employee/         # EmployeeDashboard, SubmitExpense
        │   └── simulation/       # LiveSimulation
        ├── components/
        │   ├── Layout/           # DashboardLayout, Sidebar, Header
        │   ├── ui/               # Shadcn-style components
        │   ├── auth/             # SessionManager
        │   ├── employee/         # ExpenseTimeline, ReceiptUploader
        │   └── manager/          # DelegationControls
        └── App.tsx               # Router with protected routes
```
