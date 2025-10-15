# ⚡ SkillShare Hub - Quick Reference Card

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Install
npm install

# 2. Setup environment
cp env.example .env
# Edit .env with your DATABASE_URL and secrets

# 3. Database
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# 4. Create upload folders
mkdir -p public/uploads/{avatar,video,course-thumbnail,lesson-video,document}

# 5. Run
npm run dev
```

Visit: http://localhost:3000

---

## 🔑 Test Accounts (password: `password123`)

| Role | Email | Use For |
|------|-------|---------|
| Student | alice@student.com | Testing student features |
| Student | bob@student.com | Testing recommendations |
| Instructor | john@instructor.com | Testing course creation |
| Instructor | sarah@instructor.com | Testing different skills |
| Admin | admin@skillshare.com | Testing admin features |

---

## 📋 Common Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run start                  # Start production server

# Database
npx prisma generate            # Generate Prisma Client
npx prisma migrate dev         # Create & apply migration
npx prisma migrate deploy      # Apply migrations (production)
npx prisma migrate reset       # Reset database (dev only)
npx prisma db seed             # Seed test data
npx prisma studio              # Open database GUI

# Troubleshooting
npx prisma generate            # Fix TypeScript errors
npx prisma migrate status      # Check migration status
```

---

## 🗂️ Key File Locations

```
📁 Onboarding
  app/onboarding/page.tsx                    # Role selection
  app/onboarding/user/page.tsx               # Student form
  app/onboarding/instructor/page.tsx         # Instructor form
  app/api/onboarding/*/route.ts              # API handlers

📁 Dashboards
  app/dashboard/student/page.tsx             # Student dashboard
  app/dashboard/instructor/courses/page.tsx  # Instructor dashboard
  app/dashboard/instructor/courses/create/page.tsx  # Create course

📁 Cart & Payment
  app/cart/page.tsx                          # Shopping cart
  app/payment/success/page.tsx               # Payment result
  app/api/cart/route.ts                      # Cart API
  app/api/payment/*/route.ts                 # Payment APIs

📁 Core Logic
  lib/matching.ts                            # Recommendation algorithm
  lib/chapa.ts                               # Payment integration
  lib/auth.ts                                # Authentication config
  middleware.ts                              # Route protection

📁 Database
  prisma/schema.prisma                       # Database schema
  prisma/seed.ts                             # Test data
```

---

## 🔌 API Endpoints Cheat Sheet

```
Authentication
POST   /api/auth/signup
POST   /api/auth/signin
POST   /api/auth/signout

Onboarding
POST   /api/onboarding/select-role          { role: "USER" | "INSTRUCTOR" }
POST   /api/onboarding/student              { displayName, learningGoals, interests, avatarUrl }
POST   /api/onboarding/instructor           { displayName, bio, skills, avatarUrl, introVideoUrl, paymentEnabled }

Courses
GET    /api/courses?category=X&search=Y
POST   /api/courses                          { title, description, category, tags, price, level }
GET    /api/courses/[id]
PATCH  /api/courses/[id]                     { title, description, status, ... }
DELETE /api/courses/[id]

Lessons
GET    /api/courses/[id]/lessons
POST   /api/courses/[id]/lessons             { title, type, videoUrl, order, isFree }

Cart
GET    /api/cart
POST   /api/cart                             { courseId }
DELETE /api/cart?courseId=X

Payment
POST   /api/payment/initialize               { courseIds: ["id1", "id2"] }
GET    /api/payment/verify?tx_ref=X
POST   /api/payment/webhook                  (Chapa webhook)

Recommendations
GET    /api/recommendations/courses?limit=10
GET    /api/recommendations/instructors?limit=10

Upload
POST   /api/upload                           FormData: { file, type }
```

---

## 🎯 Feature Testing Checklist

```
✅ Sign up → Onboarding → Dashboard
✅ Student: Browse → Add to cart → Checkout → Enroll
✅ Instructor: Create course → Add lessons → Publish
✅ Matching: Verify recommendations match interests
✅ Payment: Test Chapa integration (test mode)
✅ File upload: Avatar, thumbnail, video
✅ Authorization: Role-based access control
```

---

## 🗄️ Database Models Quick Reference

```
User
  - email, password (hashed)
  - role: USER | INSTRUCTOR | ADMIN
  - onboardingCompleted: boolean
  - displayName, bio, avatarUrl
  - skills: string[] (instructors)
  - interests: string[] (students)
  - learningGoals: string (students)

Course
  - title, description, category
  - tags: string[] (for matching)
  - price: float (0 = free)
  - level: Beginner | Intermediate | Advanced
  - status: DRAFT | PUBLISHED | ARCHIVED
  - instructorId → User

Lesson
  - title, description
  - type: video | article | quiz | assignment
  - videoUrl, content
  - order: int
  - isFree: boolean
  - courseId → Course

Enrollment
  - userId → User
  - courseId → Course
  - progress: 0-100
  - status: PENDING | ACTIVE | COMPLETED

CartItem
  - userId → User
  - courseId → Course
  - Unique: (userId, courseId)

Payment
  - userId → User
  - amount, currency
  - status: pending | completed | failed
  - transactionRef (Chapa)
  - metadata: JSON
```

---

## 🧮 Matching Algorithm Formula

```javascript
// Student-Course Match
score = (tagSimilarity × 0.6) + 
        (instructorSkillSimilarity × 0.3) + 
        (popularityScore × 0.1)

// Jaccard Similarity
similarity = |A ∩ B| / |A ∪ B|

// Example
interests: ["JavaScript", "React"]
courseTags: ["JavaScript", "React", "Node.js"]
similarity = 2/3 = 67% match
```

---

## 🔐 Environment Variables

```env
# Required
DATABASE_URL="postgresql://user:pass@localhost:5432/skillshare"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
CHAPA_SECRET_KEY="CHASECK_TEST-your-key"

# Optional
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="skillshare-uploads"
```

---

## 🐛 Common Issues & Fixes

```
Issue: TypeScript errors
Fix: npx prisma generate

Issue: Migration failed
Fix: npx prisma migrate reset (dev only)

Issue: Database connection error
Fix: Check DATABASE_URL in .env, ensure PostgreSQL running

Issue: Upload directory not found
Fix: mkdir -p public/uploads/{avatar,video,course-thumbnail}

Issue: Chapa payment not working
Fix: Check CHAPA_SECRET_KEY, use test key for development
```

---

## 📊 Seed Data Summary

```
Users:
  1 Admin
  3 Instructors (Web Dev, Data Science, Design)
  3 Students (different interests)

Courses:
  6 Courses (3 paid, 3 free)
  Multiple lessons per course
  Various categories and tags

Data:
  Sample enrollments with progress
  Sample reviews and ratings
  Sample cart items
  Sample payment records
```

---

## 🚀 Deployment Quick Steps

```bash
# 1. Set up production database (Neon/Supabase)
# 2. Get production Chapa key
# 3. Deploy to Vercel
vercel

# 4. Set environment variables in Vercel dashboard
# 5. Run migrations
npx prisma migrate deploy

# 6. Test production site
```

---

## 📱 Routes Overview

```
Public:
  /                          # Homepage
  /courses                   # Course listing
  /courses/[id]              # Course detail
  /login                     # Sign in
  /signup                    # Sign up

Protected:
  /onboarding                # Role selection
  /onboarding/user           # Student onboarding
  /onboarding/instructor     # Instructor onboarding
  /dashboard                 # Main dashboard (redirects)
  /dashboard/student         # Student dashboard
  /dashboard/instructor      # Instructor dashboard
  /cart                      # Shopping cart
  /payment/success           # Payment result

Instructor Only:
  /dashboard/instructor/courses              # Course list
  /dashboard/instructor/courses/create       # Create course
  /dashboard/instructor/courses/[id]/edit    # Edit course
  /dashboard/instructor/courses/[id]/lessons # Manage lessons

Admin Only:
  /admin                     # Admin panel
```

---

## 🎨 UI Components Used

```
shadcn/ui:
  Card, Button, Input, Label
  Badge, Progress, Avatar
  Select, Checkbox, Dialog
  Accordion, Dropdown Menu

Icons:
  lucide-react (comprehensive icon set)

Styling:
  Tailwind CSS (utility-first)
  Custom gradients and animations
```

---

## 📞 Help & Resources

```
Documentation:
  SETUP_INSTRUCTIONS.md      # Detailed setup
  IMPLEMENTATION_GUIDE.md    # Feature docs
  TESTING_CHECKLIST.md       # Testing guide
  MIGRATION_STEPS.md         # Database guide
  FINAL_SUMMARY.md           # Complete overview

External:
  Next.js: https://nextjs.org/docs
  Prisma: https://www.prisma.io/docs
  NextAuth: https://next-auth.js.org
  Chapa: https://developer.chapa.co/docs
```

---

## ✅ Pre-Launch Checklist

```
Development:
  ✅ All features tested locally
  ✅ Seed data works
  ✅ No console errors
  ✅ TypeScript compiles
  ✅ All API endpoints work

Production:
  ✅ Environment variables set
  ✅ Database configured
  ✅ File storage configured
  ✅ Chapa production key added
  ✅ Migrations applied
  ✅ Error monitoring set up
  ✅ Backups configured
```

---

**🎉 You're all set! Happy coding!**
