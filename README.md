# ⚡ PulseForge Client — Elite Fitness & Gym Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/HeroUI-3.2-000000?style=for-the-badge&logo=nextui&logoColor=white" alt="HeroUI" />
  <img src="https://img.shields.io/badge/Framer_Motion-12.4-f08?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Recharts-2.15-22b5bf?style=for-the-badge" alt="Recharts" />
  <img src="https://img.shields.io/badge/Stripe_Elements-v5-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Better_Auth-v1.7-blueviolet?style=for-the-badge" alt="Better Auth" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<p align="center">
  <strong>PulseForge Frontend</strong> is a modern, high-performance web application built with Next.js 16 (App Router), React 19, and Tailwind CSS v4. Engineered for athletes, certified trainers, and gym administrators with rich interactivity, seamless Dark/Light theming, and real-time Stripe checkout.
</p>

<p align="center">
  <a href="https://pulseforge-fitness.vercel.app">🌐 Live Frontend</a> •
  <a href="https://pulseforge-api.vercel.app">📡 Live Backend API</a> •
  <a href="https://github.com/Jifan-Mahmud/Programming-Hero-Assignment-10-backend">💻 Backend Repository</a>
</p>

---

## 🌐 Live Deployments & Repositories

| Item | Live Link / Repository |
|---|---|
| **Frontend Application** | [https://pulseforge-fitness.vercel.app](https://pulseforge-fitness.vercel.app) |
| **Backend REST API** | [https://pulseforge-api.vercel.app](https://pulseforge-api.vercel.app) |
| **Frontend GitHub Repo** | [Programming-Hero-Assignment-10-frontend](https://github.com/Jifan-Mahmud/Programming-Hero-Assignment-10-frontend) |
| **Backend GitHub Repo** | [Programming-Hero-Assignment-10-backend](https://github.com/Jifan-Mahmud/Programming-Hero-Assignment-10-backend) |

---

## ✨ Key Features & User Experience

### 🚀 7 New Enterprise Features
- **💬 Real-Time 1-on-1 Coach Chat (`/dashboard/chat`):** Instant direct messaging channel between athletes and certified coaches with unread indicators and active status.
- **📹 Live Online Video Class (`/live-class/[id]`):** WebRTC camera stream, audio controls, screen sharing, and an interactive Tabata/Interval round timer HUD directly in browser.
- **📄 Branded PDF Invoice Download (`jsPDF`):** Instant download of official PulseForge payment receipts with transaction IDs and gym authorization seals.
- **📧 Automated Email Notifications:** Dynamic HTML confirmation receipts on booking and application reviews.
- **🥗 Personalized Diet & Workout Tracker (`/dashboard/tracker`):** Daily macro nutrition meters, meal check-offs, and exercise routines with sets/reps.
- **📈 Body Transformation & Weight Loss Analytics (`/dashboard/transformation`):** Recharts area curves plotting weight loss and body fat milestones over time.
- **⭐ Reviews & Star Rating System (`ClassReviews`):** 5-star interactive rating and review system on class detail pages and homepage showcases.

### 🎨 1. Modern Design & Adaptive Theming
- **Tailwind CSS v4 & Glassmorphism:** Sleek, modern styling with subtle glassmorphic navigation and card structures.
- **Dynamic Dark/Light Mode:** Instant theme toggler with zero-flicker state persistent in `localStorage`.
- **Micro-Animations with Motion:** Smooth page transitions, hover glow effects, animated counter statistics, and staggered reveals.
- **Fully Responsive:** Custom layout optimizations across ultra-wide monitors, laptops, tablets, and mobile smartphones.

### 🔐 2. Authentication & Authorization
- **Better Auth Integration:** Secure email/password login with strict password requirements (minimum 6 characters, uppercase, and lowercase).
- **Google OAuth:** One-click social sign-in.
- **Role-Based Routing:** Protected routes automatically redirect unauthenticated users and guard private dashboards based on user role (`user`, `trainer`, `admin`).

### 🏋️ 3. Class Discovery & Slot Booking
- **Live Search & Category Filtering:** Instant search by class name and filtering across categories (HIIT, Yoga, Strength, Cardio, CrossFit).
- **Server-Side Pagination:** Smooth multi-page browsing.
- **Double-Booking Shield:** Proactively checks existing bookings and disables the checkout CTA for already-booked sessions.
- **Stripe Elements Integration:** Built-in CardElement checkout modal with real-time card validation and payment intent processing.
- **Personal Favorites:** Instant bookmarking with toast notifications.

### 💬 4. Community Forum
- **Trainer Knowledge Base:** Read training and nutrition articles authored exclusively by verified trainers and admins.
- **Interactive Voting:** Upvote and downvote system with immediate UI score updates.
- **Threaded Discussions:** Post comments, reply, edit, and delete personal contributions.

### 📊 5. Dedicated Dashboards
- **Member Dashboard:**
  - Overview of booked classes and favorite count.
  - Trainer Application status card with admin review feedback.
  - Booked classes table with schedule details.
  - "Apply to Become a Trainer" interactive application form.
- **Trainer Dashboard:**
  - Classes created counter and enrolled student metric.
  - "Add Class" form (defaults to pending state).
  - Class management table with edit modal, delete confirmation, and **View Enrolled Students attendee roster modal**.
  - Forum publication manager.
- **Admin Dashboard:**
  - High-level platform telemetry (Total Users, Classes, Bookings).
  - **Recharts Analytics:** Category distribution bar chart and monthly revenue growth area chart.
  - User management table with **Soft-Block / Unblock** toggles and Admin promotions.
  - Trainer application review modal with custom feedback textarea.
  - Class review table (Approve, Reject, Delete).
  - Stripe transaction history audit ledger.

### 🧮 6. Health & Wellness Calculators
- **Interactive BMI Calculator:** Instant Body Mass Index scoring with categorized fitness recommendations.
- **Calorie Burn Estimator:** Dynamic calorie expenditure calculation based on workout duration and activity intensity.

---

## 👥 Demo Test Credentials

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **🛡️ Admin** | `admin@pulseforge.com` | `Admin123` | Full system control, charts, application approval, user moderation |
| **🏋️ Trainer** | `marcus.trainer@pulseforge.com` | `Trainer123` | Create classes, view student rosters, publish forum articles |
| **🏃 Member** | `sarah.member@pulseforge.com` | `Member123` | Browse, book with Stripe, favorites, trainer application |

---

## 📁 Frontend Directory Architecture

```
frontend/
├── public/                     # Static media and icons
├── src/
│   ├── app/                    # Next.js 16 App Router
│   │   ├── (auth)/             # Login & Registration pages
│   │   ├── admin/              # Admin dashboard pages (classes, users, trainers, analytics)
│   │   ├── classes/            # Class catalog and [id] dynamic detail view
│   │   ├── dashboard/          # Member personal portal
│   │   ├── forum/              # Community forum listing & [id] article discussion
│   │   ├── payment/            # Stripe payment intent checkout page
│   │   ├── trainer/            # Trainer dashboard pages (my classes, add class, forum)
│   │   ├── layout.jsx          # Root layout with Navbar & Footer
│   │   └── page.jsx            # Dynamic Landing page
│   ├── components/             # Reusable UI components (Navbar, Footer, Modals, Cards)
│   ├── context/                # AppContext & global state providers
│   └── lib/                    # Better Auth client config and API helpers
├── next.config.mjs             # Next.js config (remote image patterns & rewrites)
├── tailwind.config.js          # Tailwind CSS v4 styling rules
└── package.json
```

---

## ⚙️ Environment Variables Setup (`.env`)

Create a `.env` file in the `frontend` directory:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret_key_here
BETTER_AUTH_URL=http://localhost:3000

# MongoDB (Used by Better Auth adapter)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
DB_NAME=pulseforge_db

# APIs
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Google OAuth Credentials
Client_ID=your_google_oauth_client_id.apps.googleusercontent.com
Client_Secret=your_google_oauth_client_secret

# Stripe Public & Secret Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

## 🚀 Running Locally

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## ☁️ Deployment (Vercel)

1. Import this repository into Vercel and select `frontend` as the **Root Directory**.
2. Framework Preset will be automatically detected as **Next.js**.
3. In **Environment Variables**, add the keys from your `.env` file:
   - `NEXT_PUBLIC_BACKEND_URL` ➔ `https://pulseforge-api.vercel.app`
   - `NEXT_PUBLIC_API_URL` ➔ `https://pulseforge-fitness.vercel.app`
   - `BETTER_AUTH_URL` ➔ `https://pulseforge-fitness.vercel.app`
4. Click **Deploy**.

---

## 📄 License
This project is open-source and released under the [MIT License](LICENSE).
