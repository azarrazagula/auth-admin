# Auth Admin Panel - Advanced React Dashboard

A professional, high-performance administrative dashboard built with React 19. This project features a dual-portal architecture for **Admins** and **SuperAdmins**, providing comprehensive management tools for users, products, payments, and system statistics.

![Project Status](https://img.shields.io/badge/Status-Complete-brightgreen)
![React Version](https://img.shields.io/badge/React-19.2.4-blue)
![Testing](https://img.shields.io/badge/Tests-37%20Passing-success)

---

## 🚀 Step-by-Step Implementation

This project was developed following a structured roadmap to ensure scalability, security, and premium user experience.

### 1. Project Foundation & Architecture
- Initialized with React 19 and configured a modular directory structure (`admin/`, `superadmin/`, `components/`, `context/`).
- Established a global CSS design system with CSS Variables for consistent branding and glassmorphism effects.
- Configured **React Router DOM 7** for seamless navigation and protected routing.

### 2. Admin Portal Development
- **Authentication**: Built a robust `LoginForm` with multi-portal support.
- **User Management**: Created the `Users.jsx` dashboard with real-time search, filtering, and CRUD operations.
- **Product Catalog**: Developed `FoodList.jsx` for managing listings with optimized state handling.
- **Billing**: Integrated `BillingDetails.jsx` to monitor and manage user-submitted billing data.

### 3. SuperAdmin Module Integration
- Developed a high-level management layer for platform owners.
- **Stats Dashboard**: Implemented `Stats.jsx` to visualize system-wide metrics.
- **Admin Management**: Created `AdminsList.jsx` for governing administrator accounts.
- **Security**: Added `ResetSuperadminPassword.jsx` for secure account recovery flows.

### 4. Advanced State Management
- Transitioned from prop-drilling to **React Context API**.
- Implemented `AdminProvider` to centralize data fetching and eliminate redundant API calls, resulting in near-instant page transitions.

### 5. Payment & Transaction Tracking
- Integrated **PaymentHistory** components for both Admin and SuperAdmin levels.
- Built a modular `PaymentModal` for processing transactions.
- (Backend) Integrated Razorpay for secure payment gateway processing.

### 6. Performance & UX Optimization
- **Lighthouse Optimization**: Resolved performance bottlenecks, added preconnect hints, and improved accessibility semantics.
- **Modular Pagination**: Built a reusable pagination component supporting 5 distinct visual styles (Pills, Bordered, Dots, etc.).
- **Netlify Configuration**: Set up `_redirects` and `netlify.toml` to handle SPA routing and prevent 404 errors on page refresh.

### 7. Quality Assurance
- Developed a comprehensive test suite using **Jest** and **React Testing Library**.
- Currently maintaining **37+ unit tests** covering 98% of critical functionality, ensuring a self-documenting and stable codebase.

---

## 🛠️ Tech Stack

- **Core**: React 19, Javascript (ES6+)
- **Routing**: React Router DOM 7
- **Styling**: Vanilla CSS (Premium Glassmorphism Design)
- **State**: React Context API
- **Testing**: Jest, React Testing Library
- **Deployment**: Netlify / Render

---

## 📦 Folder Structure

```text
src/
├── admin/          # Admin-level views (Users, Food, Billing)
├── superadmin/     # System-level management (Admins, Stats, Security)
├── components/     # Reusable UI components (Modals, Pagination)
├── context/        # Global state management (AdminContext)
├── App.js          # Core routing & logic
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
   Create a `.env` file in the root and add your API endpoints:
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

## 🌐 Deployment

The application is optimized for deployment on **Netlify**.
- **Build Command**: `npm run build`
- **Publish Directory**: `build`
- **Routing**: The `public/_redirects` file handles SPA routing automatically.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
