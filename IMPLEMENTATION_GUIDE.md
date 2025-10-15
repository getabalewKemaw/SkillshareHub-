# SkillShare Hub - Complete Implementation Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/skillshare"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Chapa Payment (Get from https://dashboard.chapa.co/)
CHAPA_SECRET_KEY="your-chapa-secret-key"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Optional: AWS S3 (for production file uploads)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET="your-bucket-name"
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with test data
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📋 Features Implemented

### ✅ Authentication & Onboarding
- **Sign up / Sign in** with credentials or Google OAuth
- **First-time onboarding flow**:
  - Role selection (Student or Instructor)
  - Student onboarding: display name, learning goals, interests, profile photo
  - Instructor onboarding: display name, bio, skills, profile photo, intro video (optional), payment settings
- **Middleware protection**: Redirects to onboarding if not completed

### ✅ Role-Based Dashboards
- **Student Dashboard**:
  - Personalized course recommendations based on interests
  - Recommended instructors based on skill matching
  - Continue learning section with progress tracking
  - Cart access
  - Stats: enrolled courses, completed courses, overall progress
  
- **Instructor Dashboard**:
  - Course management (create, edit, delete)
  - Lesson management for each course
  - Student analytics
  - Revenue tracking
  - Course status management (draft, published, archived)

### ✅ Course Management
- **Instructors can**:
  - Create courses with title, description, category, tags, price, level, duration
  - Upload course thumbnails
  - Add lessons (video, article, quiz, assignment)
  - Set lesson order and preview availability
  - Publish/unpublish courses
  
- **Students can**:
  - Browse courses with filters
  - View course details
  - See instructor profiles
  - Enroll in free courses instantly
  - Add paid courses to cart

### ✅ Shopping Cart & Payments
- **Cart System**:
  - Server-side persistence (database)
  - Add/remove courses
  - View cart summary
  - Checkout flow
  
- **Chapa Payment Integration**:
  - Initialize payment for paid courses
  - Redirect to Chapa checkout
  - Webhook handler for payment verification
  - Automatic enrollment on successful payment
  - Payment history tracking
  - Support for free courses (instant enrollment)

### ✅ Matching Algorithm
- **Student-Course Matching**:
  - Jaccard similarity coefficient for tag/interest matching
  - Weighted scoring: 60% course tags, 30% instructor skills, 10% popularity
  - Personalized recommendations
  
- **Student-Instructor Matching**:
  - Skill-based matching
  - Course count weighting
  - Top instructor recommendations

- **Similar Courses**:
  - Tag-based similarity
  - Category matching

### ✅ File Upload System
- **Local Development**: Files saved to `public/uploads/`
- **Production Ready**: S3 integration code included (commented)
- **Supported Types**:
  - Profile photos (avatars)
  - Course thumbnails
  - Lesson videos
  - Intro videos
  - Documents (PDFs)

### ✅ Authorization & Security
- **Middleware protection** for all authenticated routes
- **Role-based access control**:
  - Students: Can only enroll and view courses
  - Instructors: Can create and manage their own courses
  - Admins: Full access to all resources
- **Ownership validation**: Users can only edit their own content

---

## 🗂️ Project Structure

```
skillsharehub/
├── app/
│   ├── api/
│   │   ├── auth/              # NextAuth routes
│   │   ├── cart/              # Cart management
│   │   ├── courses/           # Course CRUD
│   │   │   └── [id]/
│   │   │       └── lessons/   # Lesson management
│   │   ├── onboarding/        # Onboarding API
│   │   │   ├── select-role/
│   │   │   ├── student/
│   │   │   └── instructor/
│   │   ├── payment/           # Chapa integration
│   │   │   ├── initialize/
│   │   │   ├── verify/
│   │   │   └── webhook/
│   │   ├── recommendations/   # Matching algorithm
│   │   │   ├── courses/
│   │   │   └── instructors/
│   │   └── upload/            # File uploads
│   ├── cart/                  # Cart page
│   ├── dashboard/
│   │   ├── student/           # Student dashboard
│   │   └── instructor/        # Instructor dashboard
│   │       └── courses/       # Course management
│   ├── onboarding/            # Onboarding flow
│   │   ├── user/              # Student onboarding
│   │   └── instructor/        # Instructor onboarding
│   └── payment/
│       └── success/           # Payment success page
├── lib/
│   ├── auth.ts                # NextAuth config
│   ├── chapa.ts               # Chapa SDK
│   ├── matching.ts            # Recommendation algorithm
│   └── prisma.ts              # Prisma client
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
└── middleware.ts              # Route protection
```

---

## 🧪 Testing Guide

### Test Accounts (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@skillshare.com | password123 |
| Instructor | john@instructor.com | password123 |
| Instructor | sarah@instructor.com | password123 |
| Instructor | mike@instructor.com | password123 |
| Student | alice@student.com | password123 |
| Student | bob@student.com | password123 |
| Student | emma@student.com | password123 |

### Acceptance Test Checklist

#### ✅ Authentication & Onboarding
- [ ] Sign up with new account
- [ ] Redirected to onboarding role selection
- [ ] Select Student role
- [ ] Complete student onboarding (name, interests, goals, photo)
- [ ] Redirected to student dashboard
- [ ] Sign out and sign in again
- [ ] Redirected directly to dashboard (onboarding completed)
- [ ] Repeat for Instructor role

#### ✅ Student Flow
- [ ] View personalized course recommendations
- [ ] See recommended instructors based on interests
- [ ] Browse courses with filters
- [ ] View course details
- [ ] Add course to cart
- [ ] View cart
- [ ] Remove course from cart
- [ ] Checkout with free course (instant enrollment)
- [ ] Checkout with paid course (Chapa redirect)
- [ ] Complete payment (test mode)
- [ ] Verify enrollment after payment
- [ ] View enrolled courses in dashboard
- [ ] Track learning progress

#### ✅ Instructor Flow
- [ ] Create new course
- [ ] Upload course thumbnail
- [ ] Add course details (title, description, tags, price)
- [ ] Add lessons to course
- [ ] Upload lesson videos
- [ ] Set lesson order
- [ ] Mark lessons as free preview
- [ ] Publish course
- [ ] View course in public listing
- [ ] Edit course details
- [ ] View student enrollments
- [ ] View revenue statistics

#### ✅ Matching Algorithm
- [ ] Student with "JavaScript" interest sees React courses
- [ ] Student with "Python" interest sees Data Science courses
- [ ] Recommended instructors match student interests
- [ ] Similar courses shown on course detail page
- [ ] Match scores displayed (>50% shows badge)

#### ✅ Payment Flow
- [ ] Add multiple courses to cart
- [ ] See correct total calculation
- [ ] Initialize payment
- [ ] Redirect to Chapa (test mode)
- [ ] Complete test payment
- [ ] Webhook receives payment confirmation
- [ ] Enrollments created automatically
- [ ] Cart cleared after successful payment
- [ ] Payment record saved in database

#### ✅ Authorization
- [ ] Students cannot access instructor routes
- [ ] Instructors cannot edit other instructors' courses
- [ ] Unauthenticated users redirected to login
- [ ] Users without onboarding redirected to onboarding

---

## 🔧 Database Schema

### Key Models

**User**
- Authentication fields (email, password)
- Onboarding fields (displayName, skills, interests, learningGoals)
- Role (USER, INSTRUCTOR, ADMIN)
- Profile fields (bio, avatarUrl, introVideoUrl)

**Course**
- Content fields (title, description, category, tags)
- Pricing (price, level, duration)
- Status (DRAFT, PUBLISHED, ARCHIVED)
- Relations (instructor, lessons, enrollments)

**Lesson**
- Content (title, description, type, videoUrl, content)
- Metadata (order, duration, isFree)

**Enrollment**
- User-Course relationship
- Progress tracking
- Status (PENDING, ACTIVE, COMPLETED)

**CartItem**
- User-Course relationship
- Temporary storage before purchase

**Payment**
- Transaction details (amount, currency, status)
- Chapa reference (transactionRef)
- Metadata (courseIds, courseTitles)

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout

### Onboarding
- `POST /api/onboarding/select-role` - Set user role
- `POST /api/onboarding/student` - Complete student onboarding
- `POST /api/onboarding/instructor` - Complete instructor onboarding

### Courses
- `GET /api/courses` - List courses (with filters)
- `POST /api/courses` - Create course (instructor only)
- `GET /api/courses/[id]` - Get course details
- `PATCH /api/courses/[id]` - Update course (owner only)
- `DELETE /api/courses/[id]` - Delete course (owner only)

### Lessons
- `GET /api/courses/[id]/lessons` - List lessons
- `POST /api/courses/[id]/lessons` - Create lesson (owner only)

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `DELETE /api/cart?courseId=X` - Remove from cart

### Payment
- `POST /api/payment/initialize` - Start checkout
- `POST /api/payment/webhook` - Chapa webhook
- `GET /api/payment/verify?tx_ref=X` - Verify payment

### Recommendations
- `GET /api/recommendations/courses` - Get recommended courses
- `GET /api/recommendations/instructors` - Get recommended instructors

### Upload
- `POST /api/upload` - Upload file (multipart/form-data)

---

## 🎨 UI Components Used

- **shadcn/ui**: Card, Button, Input, Label, Badge, Progress, Avatar, Select, Checkbox, Dialog
- **Lucide Icons**: Comprehensive icon set
- **Tailwind CSS**: Utility-first styling
- **React Hook Form + Zod**: Form validation

---

## 🔐 Environment Setup

### PostgreSQL Setup (Local)

```bash
# Install PostgreSQL
# macOS
brew install postgresql

# Ubuntu
sudo apt-get install postgresql

# Start PostgreSQL
brew services start postgresql  # macOS
sudo service postgresql start   # Ubuntu

# Create database
createdb skillshare

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://localhost:5432/skillshare"
```

### Chapa Setup (Test Mode)

1. Sign up at [https://dashboard.chapa.co/](https://dashboard.chapa.co/)
2. Get your **Secret Key** from the dashboard
3. Add to `.env`:
   ```
   CHAPA_SECRET_KEY="CHASECK_TEST-xxxxxxxxxx"
   ```
4. Use test card numbers from Chapa docs for testing

---

## 📦 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Add DATABASE_URL, NEXTAUTH_SECRET, CHAPA_SECRET_KEY
```

### Database (Production)

Use **Neon**, **Supabase**, or **Railway** for PostgreSQL:

```bash
# Example: Neon
# 1. Create database at neon.tech
# 2. Copy connection string
# 3. Update DATABASE_URL in Vercel
```

### File Uploads (Production)

Uncomment S3 code in `/app/api/upload/route.ts` and configure AWS:

```env
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_S3_BUCKET="skillshare-uploads"
```

---

## 🐛 Troubleshooting

### Prisma Client Not Generated
```bash
npx prisma generate
```

### Migration Errors
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### TypeScript Errors
```bash
# Regenerate Prisma client
npx prisma generate

# Restart TypeScript server in VS Code
Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

### Upload Directory Not Found
```bash
mkdir -p public/uploads/avatar
mkdir -p public/uploads/video
mkdir -p public/uploads/course-thumbnail
```

---

## 📝 Next Steps

### Recommended Enhancements
1. **Email Notifications**: Send emails on enrollment, payment success
2. **Course Reviews**: Allow students to rate and review courses
3. **Certificates**: Generate PDF certificates on course completion
4. **Live Chat**: Instructor-student messaging
5. **Course Analytics**: Detailed analytics for instructors
6. **Search**: Full-text search with Algolia or Meilisearch
7. **Video Streaming**: Use Cloudflare Stream or Mux for video hosting
8. **Quizzes**: Interactive quizzes with scoring
9. **Assignments**: File submission and grading system
10. **Mobile App**: React Native app for iOS/Android

---

## 🤝 Support

For issues or questions:
- Check the code comments
- Review Prisma schema
- Test with seed data
- Check browser console for errors
- Verify environment variables

---

**Built with ❤️ using Next.js 15, Prisma, PostgreSQL, and Chapa**
