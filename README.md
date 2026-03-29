# Reimbursement Management System

**Odoo x VIT Pune Hackathon 26**
A unified multi-currency layout enabling administrators and managers to configure smart workflows to handle hierarchical business expense approvals.

## 👥 Meet the Team
- **Ayush Sonone** 
- **Pratik Kolhe**
- **Aditya Bhangale**
- **Kaustubh Deshmukh**

## 🛠 Tech Stack
- **Frontend:** React + Tailwind CSS (Vite Build System)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL

---

## 🚀 How to Run Locally

This project operates with separate frontend and backend servers.

### 1. Backend Server
1. Navigate to the `/backend` directory: `cd backend`
2. Run `npm install` to download dependencies securely.
3. In a `.env` file, populate your Postgres pool credentials (e.g., `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, etc.).
4. Run your database schema setup (creating `users` and `companies` tables).
5. Start script: `npm start` or `npm run dev` running default port `5000`.

### 2. Frontend Application
1. Open a new terminal and navigate to `/frontend`: `cd frontend`
2. Run `npm install` 
3. Boot the development compiler: `npm run dev`
4. The system will operate by default on typical mapped Vite ports (`localhost:5173`).

---

## 📉 DB Schema Overview (Current)

- **`companies`**: Holds metadata regarding organizational bounds.
  - `id`, `name`, `country`, `currency`, `created_at`
- **`users`**: Isolated by roles and manager relations strictly matching their parent UUID.
  - `id`, `company_id`, `name`, `email`, `password`, `role` (admin/manager/employee), `manager_id` (self-referencing FK to `users`). 

---

## 📡 API Endpoints List (Currently Deployed)

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register company + first admin user |
| POST | `/api/auth/login` | Public | Login, returns JWT |

### Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/create` | Create employee or manager |
| GET | `/api/users` | List all company users |
| PATCH | `/api/users/:id/role` | Update user role |
| PATCH | `/api/users/:id/manager` | Assign manager to user |

### Expenses
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/expenses` | Any auth user | Submit expense (auto currency convert) |
| GET | `/api/expenses/my` | Any auth user | View own expenses |
| GET | `/api/expenses/pending` | Manager | View pending from direct reports |
| GET | `/api/expenses/all` | Admin | View all company expenses |

### Approvals
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/approvals/queue` | Manager/Admin | View personal pending approval queue |
| POST | `/api/approvals/:id/action` | Manager/Admin | Approve or reject with comments |

### Rules (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rules` | Create rule with steps (sequential / percentage / specific) |
| GET | `/api/rules` | List all rules with steps |
| POST | `/api/rules/assign` | Assign rule to existing expense |

### Currency
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/currency/rate?from=USD&to=INR` | Get live exchange rate |
| GET | `/api/currency/convert?amount=100&from=USD&to=INR` | Convert amount |

---

## 📌 Project Status

### Features Implemented
- Completely protected Admin routing layer natively isolating endpoints to their exact `company_id`.
- Express REST architecture scaffolding integrating scalable database queries.
- Clean Auth Pages mocking Framer Motion frontend transition components.
- Secure standard JWT authorization extraction interceptor rules built securely.

### Features Pending
- Migration from `useAuth.jsx` frontend mocking loops replacing with real `fetch()` calls to the deployed API.
- Reusable "Expense & Claims" Core API generating the `expenses` database table.
- Multi-tier 60% rule and approval routing implementations mapping employee queries cleanly to their direct `manager_id` hooks.
