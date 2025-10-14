# 🚀 START HERE - SkillShare Hub Quick Start

## ⚡ Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Generate Prisma Client (IMPORTANT!)
```bash
npx prisma generate
```
**This fixes all TypeScript errors!**

### Step 3: Run Database Migrations
```bash
npx prisma migrate dev --name init
```

### Step 4: Seed Test Data
```bash
npx prisma db seed
```

### Step 5: Create Upload Folders
```bash
mkdir -p public/uploads/avatar public/uploads/video public/uploads/course-thumbnail
```

### Step 6: Start Dev Server
```bash
npm run dev
```

### Step 7: Open Browser
Visit: **http://localhost:3000**

---

## 🧪 Test the Application

### Test Login
1. Go to `http://localhost:3000/login`
2. Email: `alice@student.com`
3. Password: `password123`
4. Click "Log in"
5. ✅ You'll be redirected to dashboard!

### Test Signup
1. Go to `http://localhost:3000/signup`
2. Fill in the form
3. Check "I agree to terms"
4. Click "Sign up"
5. ✅ Account created! Login with your credentials

### Test Onboarding
1. Create new account
2. Login for first time
3. ✅ Redirected to onboarding
4. Select role (Student/Instructor)
5. Fill onboarding form
6. ✅ Redirected to dashboard

### Test Cart
1. Login as student
2. Browse courses
3. Add course to cart
4. ✅ See cart icon with badge in navbar
5. Click cart → See your items

---

## 👥 Test Accounts (password: `password123`)

| Role | Email | Use For |
|------|-------|---------|
| **Student** | alice@student.com | Testing student features |
| **Student** | bob@student.com | Testing recommendations |
| **Instructor** | john@instructor.com | Testing course creation |
| **Instructor** | sarah@instructor.com | Testing instructor dashboard |
| **Admin** | admin@skillshare.com | Testing admin features |

---

## ✅ What's Working

### Authentication
- ✅ Sign up with email/password
- ✅ Login with credentials
- ✅ Google OAuth (if configured)
- ✅ Logout
- ✅ Session management

### Onboarding
- ✅ Role selection (Student/Instructor)
- ✅ Student onboarding form
- ✅ Instructor onboarding form
- ✅ Profile photo upload
- ✅ Intro video upload (instructors)
- ✅ Data persistence

### Navigation
- ✅ Navbar with cart
- ✅ Cart count badge
- ✅ Mobile responsive menu
- ✅ User dropdown
- ✅ Role-based links

### Dashboards
- ✅ Student dashboard with recommendations
- ✅ Instructor dashboard with course management
- ✅ Course creation
- ✅ Lesson management

### Cart & Payment
- ✅ Add to cart
- ✅ Remove from cart
- ✅ Cart persistence
- ✅ Checkout flow
- ✅ Chapa payment integration

### Matching Algorithm
- ✅ Student-course matching
- ✅ Student-instructor matching
- ✅ Personalized recommendations
- ✅ Match percentage display

---

## 🎯 Quick Test Scenarios

### Scenario 1: New Student Sign Up
```
1. Go to /signup
2. Create account
3. Login
4. Complete student onboarding
5. See personalized recommendations
6. Add course to cart
7. Checkout
```

### Scenario 2: Instructor Creates Course
```
1. Login as john@instructor.com
2. Go to Instructor Dashboard
3. Click "Create Course"
4. Fill course details
5. Add lessons
6. Publish course
7. Students can now enroll
```

### Scenario 3: Student Enrolls in Course
```
1. Login as alice@student.com
2. Browse courses
3. Add paid course to cart
4. Go to cart
5. Checkout
6. Complete payment (test mode)
7. Course appears in "Continue Learning"
```

---

## 📁 Important Files

### Authentication
- `app/components/auth/LoginForm.tsx` - Login form
- `app/components/auth/SignupForm.tsx` - Signup form
- `app/api/auth/signup/route.ts` - Signup API
- `lib/auth.ts` - NextAuth config

### Onboarding
- `app/onboarding/page.tsx` - Role selection
- `app/onboarding/user/page.tsx` - Student onboarding
- `app/onboarding/instructor/page.tsx` - Instructor onboarding
- `app/api/onboarding/*/route.ts` - Onboarding APIs

### Navigation
- `app/components/layout/NavBar.tsx` - Navbar with cart
- `middleware.ts` - Route protection

### Dashboards
- `app/dashboard/student/page.tsx` - Student dashboard
- `app/dashboard/instructor/courses/page.tsx` - Instructor dashboard

### Cart & Payment
- `app/cart/page.tsx` - Shopping cart
- `app/api/cart/route.ts` - Cart API
- `app/api/payment/*/route.ts` - Payment APIs
- `lib/chapa.ts` - Chapa integration

---

## 🐛 Troubleshooting

### TypeScript Errors?
```bash
npx prisma generate
# Then restart VS Code TypeScript server
```

### Can't Login?
- Check database is running
- Run `npx prisma db seed` to create test accounts
- Check `.env` has correct `DATABASE_URL`

### Cart Not Showing?
- Make sure you're logged in
- Check browser console for errors
- Try clearing browser cache

### Redirected to Onboarding Every Time?
- Complete the onboarding form fully
- Make sure all required fields are filled
- Check database `onboardingCompleted` field

---

## 📚 Documentation

- **UI_IMPLEMENTATION_COMPLETE.md** - Complete UI implementation details
- **SETUP_INSTRUCTIONS.md** - Detailed setup guide
- **IMPLEMENTATION_GUIDE.md** - Feature documentation
- **TESTING_CHECKLIST.md** - Complete testing guide
- **QUICK_REFERENCE.md** - Quick reference card

---

## 🎉 You're All Set!

The application is **fully functional** and ready to use!

**What you can do now:**
1. ✅ Sign up new users
2. ✅ Login existing users
3. ✅ Complete onboarding
4. ✅ Create courses (instructors)
5. ✅ Browse and enroll (students)
6. ✅ Add to cart
7. ✅ Checkout and pay
8. ✅ View personalized recommendations

**Happy coding! 🚀**
