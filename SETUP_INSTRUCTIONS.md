# 🚀 SkillShare Hub - Setup Instructions

## Step-by-Step Setup Guide

### 1️⃣ Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15
- Prisma & PostgreSQL client
- NextAuth.js for authentication
- shadcn/ui components
- React Hook Form & Zod for validation
- bcryptjs for password hashing
- ts-node for running seed scripts

---

### 2️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example
cp .env.example .env
```

Then edit `.env` with your values:

```env
# Database - PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/skillshare"

# NextAuth - Authentication configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Chapa Payment Gateway (Get from https://dashboard.chapa.co/)
CHAPA_SECRET_KEY="CHASECK_TEST-your-test-key-here"

# Optional: Google OAuth (if you want social login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

### 3️⃣ Set Up PostgreSQL Database

#### Option A: Local PostgreSQL

**Install PostgreSQL:**

```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start

# Windows
# Download from https://www.postgresql.org/download/windows/
```

**Create Database:**

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE skillshare;

# Create user (optional)
CREATE USER skillshare_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE skillshare TO skillshare_user;

# Exit
\q
```

**Update DATABASE_URL in .env:**
```env
DATABASE_URL="postgresql://skillshare_user:your_password@localhost:5432/skillshare"
```

#### Option B: Cloud PostgreSQL (Recommended for Production)

**Neon (Free tier available):**
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Paste into `.env` as `DATABASE_URL`

**Supabase:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (Transaction mode)
5. Paste into `.env` as `DATABASE_URL`

---

### 4️⃣ Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init
```

This will:
- Generate TypeScript types from your schema
- Create all database tables
- Set up relations and constraints

---

### 5️⃣ Seed Database with Test Data

```bash
npx prisma db seed
```

This creates:
- **1 Admin account**
- **3 Instructors** with different skills
- **3 Students** with different interests
- **6 Courses** (mix of free and paid)
- **Lessons** for courses
- **Enrollments** with progress tracking
- **Reviews** and ratings
- **Cart items**
- **Sample payment records**

**Test Accounts Created:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@skillshare.com | password123 |
| Instructor | john@instructor.com | password123 |
| Instructor | sarah@instructor.com | password123 |
| Instructor | mike@instructor.com | password123 |
| Student | alice@student.com | password123 |
| Student | bob@student.com | password123 |
| Student | emma@student.com | password123 |

---

### 6️⃣ Create Upload Directories

```bash
# Create directories for file uploads
mkdir -p public/uploads/avatar
mkdir -p public/uploads/video
mkdir -p public/uploads/course-thumbnail
mkdir -p public/uploads/lesson-video
mkdir -p public/uploads/document
```

---

### 7️⃣ Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing the Application

### Test Flow 1: New Student Signup

1. Go to `/signup`
2. Create account with email/password
3. You'll be redirected to `/onboarding`
4. Select "I'm a Student"
5. Fill in:
   - Display Name: "Test Student"
   - Learning Goals: "Learn web development"
   - Interests: "JavaScript, React, Web Development"
   - Upload profile photo (optional)
6. Click "Complete Setup"
7. You'll be redirected to student dashboard with personalized recommendations

### Test Flow 2: New Instructor Signup

1. Go to `/signup`
2. Create account
3. Select "I'm an Instructor"
4. Fill in:
   - Display Name: "Test Instructor"
   - Bio: "Experienced developer teaching web technologies"
   - Skills: "JavaScript, React, Node.js"
   - Upload profile photo (optional)
   - Upload intro video (optional)
   - Enable payments: ✓
5. Click "Complete Setup"
6. You'll be redirected to instructor dashboard

### Test Flow 3: Create a Course (as Instructor)

1. Login as instructor (john@instructor.com / password123)
2. Go to "My Courses"
3. Click "Create Course"
4. Fill in course details:
   - Title: "Test Course"
   - Description: "A comprehensive test course"
   - Category: "Web Development"
   - Tags: "JavaScript, Testing"
   - Price: 500 (or 0 for free)
   - Level: "Beginner"
5. Upload thumbnail (optional)
6. Click "Create Course"
7. Add lessons to the course

### Test Flow 4: Student Enrollment & Payment

1. Login as student (alice@student.com / password123)
2. Browse recommended courses on dashboard
3. Click on a paid course
4. Click "Add to Cart"
5. Go to cart (top right)
6. Review cart items
7. Click "Proceed to Checkout"
8. You'll be redirected to Chapa payment page (test mode)
9. Use test card details from Chapa docs
10. After successful payment, you'll be redirected back
11. Check dashboard - course should appear in "Continue Learning"

### Test Flow 5: Matching Algorithm

1. Login as student with interests in "Python, Data Science"
2. Dashboard will show:
   - Recommended courses matching "Python, Data Science"
   - Recommended instructors with those skills
   - Match percentage badges (>50% match)
3. Verify recommendations are relevant

---

## 🔧 Troubleshooting

### Issue: Prisma Client Not Generated

**Solution:**
```bash
npx prisma generate
```

### Issue: Migration Errors

**Solution:**
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Then run migrations again
npx prisma migrate dev
```

### Issue: TypeScript Errors After Schema Changes

**Solution:**
```bash
# Regenerate Prisma client
npx prisma generate

# Restart TypeScript server in VS Code
# Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
# Type: "TypeScript: Restart TS Server"
```

### Issue: Upload Directory Not Found

**Solution:**
```bash
mkdir -p public/uploads/{avatar,video,course-thumbnail,lesson-video,document}
```

### Issue: Database Connection Failed

**Check:**
1. PostgreSQL is running: `pg_isready`
2. Database exists: `psql -l | grep skillshare`
3. Connection string is correct in `.env`
4. Firewall allows PostgreSQL port (5432)

### Issue: Chapa Payment Not Working

**Check:**
1. `CHAPA_SECRET_KEY` is set in `.env`
2. Using test key (starts with `CHASECK_TEST-`)
3. Webhook URL is accessible (use ngrok for local testing)

---

## 📊 Database Schema Overview

### Core Models

**User**
- Authentication (email, password)
- Profile (name, displayName, bio, avatarUrl)
- Role (USER, INSTRUCTOR, ADMIN)
- Onboarding (skills, interests, learningGoals)

**Course**
- Content (title, description, category, tags)
- Pricing (price, level, duration)
- Status (DRAFT, PUBLISHED, ARCHIVED)

**Lesson**
- Content (title, description, type, videoUrl)
- Metadata (order, duration, isFree)

**Enrollment**
- User ↔ Course relationship
- Progress tracking (0-100%)
- Status (PENDING, ACTIVE, COMPLETED)

**CartItem**
- Temporary storage before purchase
- Unique constraint: one course per user

**Payment**
- Transaction records
- Chapa integration (transactionRef)
- Metadata (courseIds, amounts)

---

## 🌐 API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout

### Onboarding
- `POST /api/onboarding/select-role` - Set role (USER/INSTRUCTOR)
- `POST /api/onboarding/student` - Complete student onboarding
- `POST /api/onboarding/instructor` - Complete instructor onboarding

### Courses
- `GET /api/courses` - List courses (filters: category, search, status)
- `POST /api/courses` - Create course (instructor only)
- `GET /api/courses/[id]` - Get course details
- `PATCH /api/courses/[id]` - Update course (owner only)
- `DELETE /api/courses/[id]` - Delete course (owner only)

### Lessons
- `GET /api/courses/[id]/lessons` - List lessons
- `POST /api/courses/[id]/lessons` - Create lesson (owner only)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart (body: { courseId })
- `DELETE /api/cart?courseId=X` - Remove from cart

### Payment
- `POST /api/payment/initialize` - Start checkout (body: { courseIds })
- `POST /api/payment/webhook` - Chapa webhook (automated)
- `GET /api/payment/verify?tx_ref=X` - Verify payment

### Recommendations
- `GET /api/recommendations/courses?limit=10` - Get recommended courses
- `GET /api/recommendations/instructors?limit=10` - Get recommended instructors

### Upload
- `POST /api/upload` - Upload file (multipart/form-data)
  - Form fields: `file`, `type` (avatar/video/course-thumbnail/etc)

---

## 🎯 Feature Checklist

### ✅ Implemented
- [x] Authentication (credentials + OAuth)
- [x] Role-based onboarding (Student/Instructor)
- [x] Student dashboard with recommendations
- [x] Instructor dashboard with course management
- [x] Course creation and editing
- [x] Lesson management
- [x] Shopping cart
- [x] Chapa payment integration
- [x] Enrollment system
- [x] Progress tracking
- [x] Matching algorithm (student-course, student-instructor)
- [x] File uploads (local dev)
- [x] Middleware protection
- [x] Role-based authorization

### 🔜 Recommended Next Steps
- [ ] Email notifications (enrollment, payment)
- [ ] Course reviews and ratings UI
- [ ] Certificate generation (PDF)
- [ ] Live chat (instructor-student)
- [ ] Advanced analytics dashboard
- [ ] Full-text search (Algolia/Meilisearch)
- [ ] Video streaming (Cloudflare Stream/Mux)
- [ ] Quiz system with scoring
- [ ] Assignment submission
- [ ] Mobile app (React Native)

---

## 📱 Production Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - DATABASE_URL
# - NEXTAUTH_URL (your production URL)
# - NEXTAUTH_SECRET
# - CHAPA_SECRET_KEY (production key)
```

### Database (Production)

Use **Neon** or **Supabase** for managed PostgreSQL:

1. Create production database
2. Copy connection string
3. Add to Vercel environment variables
4. Run migrations: `npx prisma migrate deploy`

### File Uploads (Production)

**Option 1: Vercel Blob**
```bash
npm install @vercel/blob
```

**Option 2: AWS S3**
- Uncomment S3 code in `/app/api/upload/route.ts`
- Add AWS credentials to environment variables

**Option 3: Cloudinary**
```bash
npm install cloudinary
```

---

## 🔐 Security Checklist

- [x] Passwords hashed with bcrypt
- [x] JWT sessions (stateless)
- [x] CSRF protection (NextAuth)
- [x] SQL injection prevention (Prisma)
- [x] XSS protection (React escaping)
- [x] Role-based access control
- [x] Ownership validation
- [ ] Rate limiting (add in production)
- [ ] Input sanitization (add validation)
- [ ] File upload restrictions (size, type)

---

## 📞 Support

If you encounter issues:

1. Check this guide
2. Review error messages in browser console
3. Check server logs in terminal
4. Verify environment variables
5. Ensure database is running
6. Regenerate Prisma client: `npx prisma generate`

---

**Happy Coding! 🎉**
