# Sushanti (सुशांति) — Next-Generation Event & Competition Platform

> **Discover • Compete • Host**  
> An enterprise-grade, high-performance web platform for hackathons, coding contests, workshops, meetups, case studies, and college fests. Designed to outclass Unstop and Commudle in UX, speed, host tooling, and attendee satisfaction.

---

## 🌟 Key Innovations & Differentiators

| Feature | Sushanti Experience | Legacy Platforms (Unstop/Commudle) |
|---|---|---|
| **Entry Experience** | Dual-Path Choice ("Attend" vs "Host") with instant 1-click Role Switcher | Fragmented portals, clunky mode transitions |
| **Ticketing Speed** | Sub-second digital ticket minting with verifiable QR codes | Slow emailed PDFs, manual gate lists |
| **Check-In Tooling** | Built-in camera & manual QR scanner with instant green/amber feedback | Third-party scanners or printed paper sheets |
| **Teammate Matching** | AI Teammate Matchmaker analyzing complementary skills | Generic public WhatsApp/Telegram groups |
| **Event Creation** | 9-Step Wizard with auto-drafting, custom form builder & AI description writer | Complex, multi-page slow reload forms |
| **Judging & Rubrics** | Live 4-criteria scoring matrix with instant leaderboard publishing | Spreadsheets and offline manual aggregation |
| **Credentials** | Cryptographically sealed certificates with public `/verify/[id]` URLs | Unverifiable generic PDF attachments |
| **AI Assistants** | Embedded AI Q&A assistant on event pages & AI description generator | Static FAQs with no interactive help |

---

## 🏗️ Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript + React 18
- **Styling & UI**: Tailwind CSS + Modern Dark/Light Design Tokens + Framer Motion
- **ORM & Database**: Prisma ORM with SQLite for zero-config local execution (seamlessly upgradable to PostgreSQL via `DATABASE_URL`)
- **Ticketing & QR**: `qrcode` canvas rendering + `html5-qrcode` camera integration
- **Testing**: Vitest automated test suite covering utility functions, seed data, registration, check-in, certificates, and lifecycle
- **Icons & Micro-interactions**: `lucide-react` + `canvas-confetti`

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `v18+` (tested on Node `v24.19.0`)
- npm `v10+`

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd "webdev project"

# Install dependencies
npm install
```

### 3. Database Initialization & Seeding
```bash
# Push schema to SQLite database (dev.db)
npx prisma db push

# Seed rich demo data (7 events, hosts, users, teams, submissions, certificates)
npm run prisma:seed
```

### 4. Running the Platform
```bash
# Development mode
npm run dev

# Production build & start
npm run build
npm run start
```
The application will be live at: **`http://localhost:3000`**

---

## 🧪 Automated Testing

Run the Vitest test suite covering core user and host journeys:
```bash
npm test
```

### Test Coverage:
- Format verification for ticket IDs (`TKT-XXXXXX`) and squad join codes (`SUSH-XXXX`)
- Relational integrity of seeded events across categories and hosts
- User registration and QR payload generation
- Host QR check-in verification and duplicate check-in prevention
- Cryptographic certificate lookup by verification hash
- Host event creation and lifecycle management

---

## 👥 Demo Personas (1-Click Switcher in Navbar)

You can toggle between test personas instantly using the user avatar menu in the top-right navbar:
1. **Alex Rivera (`alex@sushanti.dev`)**: Attendee persona — Full-Stack & AI developer registered for Nexus AI Hackathon 2026.
2. **Priya Sharma (`priya@sushanti.dev`)**: Host persona — Director at TechNexus Innovation Guild managing events and judging submissions.
3. **Rohit Verma (`rohit@sushanti.dev`)**: Attendee persona — UI/UX designer looking for hackathon teammates.
4. **Platform Admin (`admin@sushanti.dev`)**: Super-admin persona — Platform governance, host verification queue, and event moderation.

---

## 🗺️ Key Routes & Pages

### 🎯 Consumer Journey
- `/`: High-impact landing page with dual-path entry cards, stats, and trending events
- `/login`: Universal light-themed Google-only authentication page for all users (Attendees & Hosts)
- `/events`: Multi-faceted exploration catalog (filter by category, mode, pricing, date, and keyword)
- `/events/[slug]`: Rich event detail page with timeline, prizes, sponsors, FAQs accordion, and **AI Event Q&A Assistant**
- `/events/[slug]/register`: Multi-step registration, squad creation/joining, dynamic host form fields, coupon discounts (`EARLYBIRD50`), and QR ticket issuance
- `/events/[slug]/portal`: Competitor portal for submitting repo links, demos, and tracking jury scores
- `/my-events`: Attendee dashboard with countdowns and interactive QR code entry pass modal
- `/teams`: "Looking for Team" board with AI Teammate Matchmaker
- `/profile`: Public builder portfolio with skills badges and verifiable credentials
- `/verify/[certId]`: Public certificate verification view with official watermark and PDF printable view

### 👑 Host Journey
- `/host/dashboard`: Host console overview, registration metrics, and quick action tiles
- `/host/events/create`: 9-Step Event Creation Wizard with **AI Description Writer**
- `/host/events/[id]/overview`: Live event command center with conversion funnel metrics
- `/host/events/[id]/scanner`: Built-in camera & manual QR code check-in scanner with sub-second verification
- `/host/events/[id]/competition`: Judging portal with 4-criteria rubrics scoring and live leaderboard
- `/host/events/[id]/attendees`: Attendee roster with filters and **1-Click CSV Export**

### 🛡️ Platform Governance
- `/admin`: Super-admin moderation queue, host verification approvals, and platform GMV metrics

---

## 📄 Environment Configuration (`.env.example`)

```env
# Database (Default: SQLite for zero-friction local run)
DATABASE_URL="file:./dev.db"

# For Production PostgreSQL:
# DATABASE_URL="postgresql://user:password@localhost:5432/sushanti?schema=public"

# NextAuth / App Secret
NEXTAUTH_SECRET="sushanti-production-secret-key-2026"
NEXTAUTH_URL="http://localhost:3000"

# Optional Cloud Integrations
RAZORPAY_KEY_ID="rzp_test_sample"
RAZORPAY_KEY_SECRET="rzp_secret_sample"
```

---

## 📜 License
MIT © 2026 Sushanti Technologies Inc. Built with craftsmanship for India & Global Builders.
