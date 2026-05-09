# Auth Admin Panel - Advanced React Dashboard

A professional, high-performance administrative dashboard built with **React 19**. This project features a dual-portal architecture for **Admins** and **SuperAdmins**, providing comprehensive management tools for users, food items, payments, and system statistics.

[![Status](https://img.shields.io/badge/Status-Complete-brightgreen)](#)
[![React](https://img.shields.io/badge/React-19.2.4-blue)](#)
[![Tests](https://img.shields.io/badge/Tests-37%20Passing-success)](#)

---

## 🚀 Step-by-Step Implementation

### Phase 1: Project Foundation & Architecture
1.  **Environment Setup**: Initialized the project with React 19 and configured a modular directory structure (`admin/`, `superadmin/`, `components/`, `context/`).
2.  **Design System**: Established a global CSS design system using CSS Variables, focusing on **Glassmorphism**, dark mode compatibility, and fluid typography.
3.  **Routing Engine**: Integrated **React Router DOM 7** to handle protected routes, portal switching via URL parameters (`?portal=superadmin`), and seamless navigation.

### Phase 2: Core Portal Development
4.  **Dual Authentication**: Developed a multi-portal `LoginForm` that dynamically adjusts based on user roles and portal requirements.
5.  **User Management Dashboard**: Built the `Users.jsx` and `UsersList.jsx` modules, implementing real-time search, multi-criteria filtering, and CRUD operations.
6.  **Product Catalog**: Developed `FoodList.jsx` for managing food listings with optimized state handling.
7.  **Billing & Transactions**: Created `BillingDetails.jsx` to monitor user-submitted billing data and payment status.

### Phase 3: Advanced Features & State Management
8.  **Context API Optimization**: Migrated global state to the **React Context API** (`AdminProvider`). This eliminated prop-drilling and centralized data fetching, resulting in near-instant UI updates.
9.  **Modular Pagination**: Engineered a reusable pagination component with 5 visual styles (Pills, Bordered, Dots, etc.).
10. **Payment Tracking**: Built components to track transaction history and manage user payments.

### Phase 4: Performance & Quality Assurance
11. **Lighthouse Optimization**: Conducted performance audits, resolving render-blocking resources and implementing preconnect hints.
12. **Comprehensive Testing**: Developed a robust suite of **37+ unit tests** using Jest and React Testing Library.
13. **Netlify Deployment**: Configured `_redirects` and `netlify.toml` to support SPA routing.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Javascript (ES6+), React Router 7
- **State Management**: React Context API
- **Styling**: Vanilla CSS (Premium Glassmorphism Design)
- **Testing**: Jest, React Testing Library
- **Deployment**: Netlify

---

## 📦 Folder Structure

```text
src/
├── admin/          # Admin-level views (Users, Food, Billing)
├── superadmin/     # System-level management (Admins, Stats, Security)
├── components/     # Reusable UI components (Modals, Pagination)
├── context/        # Global state management (AdminContext)
├── App.js          # Core routing logic
└── index.js        # Entry point
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/auth-admin.git
   cd auth-admin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root:
   ```env
   REACT_APP_API_URL=https://your-backend-api.com
   ```

4. **Run development server**:
   ```bash
   npm start
   ```

5. **Run tests**:
   ```bash
   npm test
   ```

---

## 📄 License

This project is licensed under the MIT License.
