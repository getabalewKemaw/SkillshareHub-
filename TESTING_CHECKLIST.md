# 🧪 SkillShare Hub - Complete Testing Checklist

## Pre-Testing Setup

- [ ] Database seeded with test data (`npx prisma db seed`)
- [ ] Development server running (`npm run dev`)
- [ ] Browser console open (F12) for debugging
- [ ] Test accounts ready (see below)

---

## Test Accounts

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Admin | admin@skillshare.com | password123 | Admin features |
| Instructor | john@instructor.com | password123 | Web dev instructor |
| Instructor | sarah@instructor.com | password123 | Data science instructor |
| Instructor | mike@instructor.com | password123 | Design instructor |
| Student | alice@student.com | password123 | Web dev interests |
| Student | bob@student.com | password123 | Data science interests |
| Student | emma@student.com | password123 | Design interests |

---

## 1. Authentication & Authorization Tests

### Sign Up Flow
- [ ] Navigate to `/signup`
- [ ] Create account with valid email/password
- [ ] Verify password validation (min 6 chars)
- [ ] Verify email validation (valid format)
- [ ] Check duplicate email handling
- [ ] Verify redirect to `/onboarding` after signup

### Sign In Flow
- [ ] Navigate to `/login`
- [ ] Login with valid credentials
- [ ] Verify incorrect password error
- [ ] Verify non-existent email error
- [ ] Check "Remember me" functionality
- [ ] Verify redirect based on onboarding status

### Sign Out
- [ ] Click sign out button
- [ ] Verify redirect to home page
- [ ] Verify session cleared
- [ ] Try accessing protected route (should redirect to login)

---

## 2. Onboarding Tests

### Role Selection
- [ ] After signup, see role selection page
- [ ] See "Student" and "Instructor" cards
- [ ] Click "Continue as Student"
- [ ] Verify redirect to `/onboarding/user`
- [ ] Go back and try "Continue as Instructor"
- [ ] Verify redirect to `/onboarding/instructor`

### Student Onboarding
- [ ] Fill display name (required)
- [ ] Fill learning goals (min 10 chars)
- [ ] Add interests (comma-separated)
- [ ] Upload profile photo (optional)
- [ ] Submit form
- [ ] Verify redirect to `/dashboard` (student dashboard)
- [ ] Verify `onboardingCompleted` flag set to true

### Instructor Onboarding
- [ ] Fill display name (required)
- [ ] Fill bio (min 20 chars)
- [ ] Add skills (comma-separated)
- [ ] Upload profile photo (optional)
- [ ] Upload intro video (optional)
- [ ] Toggle "Enable Payments" checkbox
- [ ] Submit form
- [ ] Verify redirect to `/dashboard/instructor`
- [ ] Verify instructor role assigned

### Onboarding Middleware
- [ ] Login with incomplete onboarding
- [ ] Try accessing `/dashboard`
- [ ] Verify redirect to `/onboarding`
- [ ] Complete onboarding
- [ ] Try accessing `/onboarding` again
- [ ] Verify redirect to appropriate dashboard

---

## 3. Student Dashboard Tests

### Dashboard Overview
- [ ] Login as student (alice@student.com)
- [ ] See welcome message with display name
- [ ] See stats cards:
  - [ ] Enrolled Courses count
  - [ ] Completed count
  - [ ] Overall Progress percentage
  - [ ] Learning Streak
- [ ] See cart button with badge (if items in cart)

### Continue Learning Section
- [ ] See active enrollments (if any)
- [ ] See progress bars for each course
- [ ] Click "Continue Learning" button
- [ ] Verify redirect to course page
- [ ] See "View All" link to `/my-courses`

### Recommended Courses
- [ ] See "Recommended For You" section
- [ ] Verify courses match student interests
- [ ] See match percentage badges (>50% match)
- [ ] See course details (title, instructor, price, level)
- [ ] Click "View Course" button
- [ ] Verify redirect to course detail page
- [ ] See heart icon for wishlist (future feature)

### Recommended Instructors
- [ ] See "Top Instructors For You" section
- [ ] See instructor cards with:
  - [ ] Profile photo
  - [ ] Display name
  - [ ] Bio
  - [ ] Skills (first 3)
  - [ ] Course count
- [ ] Click "View Profile" button
- [ ] Verify redirect to instructor profile

---

## 4. Instructor Dashboard Tests

### Dashboard Overview
- [ ] Login as instructor (john@instructor.com)
- [ ] See welcome message
- [ ] See "Create Course" button
- [ ] See stats:
  - [ ] Total Courses
  - [ ] Total Students
  - [ ] Total Revenue (ETB)

### Course List
- [ ] See all courses created by instructor
- [ ] See course status badges (DRAFT/PUBLISHED)
- [ ] See course metrics:
  - [ ] Student count
  - [ ] Lesson count
  - [ ] Review count
  - [ ] Price
- [ ] See action buttons (Edit, View, Manage Lessons)

### Empty State
- [ ] Login as new instructor (no courses)
- [ ] See "No courses yet" message
- [ ] See "Create Your First Course" button
- [ ] Click button
- [ ] Verify redirect to course creation

---

## 5. Course Management Tests

### Create Course
- [ ] Click "Create Course" button
- [ ] Fill course title (min 5 chars)
- [ ] Fill description (min 20 chars)
- [ ] Select category from dropdown
- [ ] Add tags (comma-separated)
- [ ] Select level (Beginner/Intermediate/Advanced)
- [ ] Set price (0 for free, or amount in ETB)
- [ ] Set duration (optional, in minutes)
- [ ] Upload thumbnail image
- [ ] Submit form
- [ ] Verify course created with DRAFT status
- [ ] Verify redirect to lesson management

### Edit Course
- [ ] Click "Edit" on existing course
- [ ] Modify course details
- [ ] Change status to PUBLISHED
- [ ] Save changes
- [ ] Verify updates saved
- [ ] Check course appears in public listing

### Delete Course
- [ ] Click delete button (if implemented)
- [ ] Confirm deletion
- [ ] Verify course removed from list
- [ ] Verify cascading deletes (lessons, enrollments)

### Lesson Management
- [ ] Click "Manage Lessons" on course
- [ ] See lesson list (ordered)
- [ ] Click "Add Lesson"
- [ ] Fill lesson details:
  - [ ] Title
  - [ ] Description
  - [ ] Type (video/article/quiz)
  - [ ] Video URL or content
  - [ ] Duration
  - [ ] Order number
  - [ ] Mark as free preview
- [ ] Save lesson
- [ ] Verify lesson appears in list
- [ ] Drag to reorder (if implemented)
- [ ] Edit lesson
- [ ] Delete lesson

---

## 6. Course Browsing Tests

### Course Listing
- [ ] Navigate to `/courses`
- [ ] See all published courses
- [ ] See course cards with:
  - [ ] Thumbnail
  - [ ] Title
  - [ ] Instructor name
  - [ ] Price
  - [ ] Level badge
  - [ ] Rating (if available)
  - [ ] Enrollment count

### Filters
- [ ] Filter by category
- [ ] Filter by price (free/paid)
- [ ] Filter by level
- [ ] Search by keyword
- [ ] Verify results update correctly

### Course Detail Page
- [ ] Click on course card
- [ ] See full course description
- [ ] See instructor info with bio
- [ ] See lesson list (free lessons visible)
- [ ] See "Add to Cart" button (if not enrolled)
- [ ] See "Go to Course" button (if enrolled)
- [ ] See similar courses section
- [ ] See reviews and ratings

---

## 7. Shopping Cart Tests

### Add to Cart
- [ ] Browse courses as student
- [ ] Click "Add to Cart" on paid course
- [ ] See success message
- [ ] See cart badge update
- [ ] Try adding same course again
- [ ] Verify error message (already in cart)
- [ ] Try adding enrolled course
- [ ] Verify error message (already enrolled)

### View Cart
- [ ] Click cart icon/button
- [ ] See all cart items
- [ ] See course details for each item
- [ ] See individual prices
- [ ] See total amount
- [ ] See item count

### Remove from Cart
- [ ] Click remove/trash icon on cart item
- [ ] Verify item removed
- [ ] Verify total updated
- [ ] Verify cart badge updated

### Empty Cart
- [ ] Remove all items
- [ ] See "Your cart is empty" message
- [ ] See "Browse Courses" button
- [ ] Click button
- [ ] Verify redirect to course listing

---

## 8. Payment & Enrollment Tests

### Free Course Enrollment
- [ ] Add free course to cart
- [ ] Go to cart
- [ ] Click "Enroll Now" button
- [ ] Verify instant enrollment (no payment)
- [ ] Verify redirect to dashboard
- [ ] Verify course appears in "Continue Learning"
- [ ] Verify cart cleared

### Paid Course Checkout
- [ ] Add paid course to cart
- [ ] Go to cart
- [ ] Click "Proceed to Checkout"
- [ ] Verify redirect to Chapa payment page
- [ ] See correct amount
- [ ] See course details in payment description

### Chapa Test Payment
- [ ] Use Chapa test card details:
  - Card: 4200 0000 0000 0000
  - CVV: 123
  - Expiry: Any future date
- [ ] Complete payment
- [ ] Verify redirect to success page
- [ ] See "Payment Successful" message

### Payment Verification
- [ ] After payment, verify:
  - [ ] Payment record created in database
  - [ ] Status: "completed"
  - [ ] Transaction reference saved
- [ ] Verify enrollment created
- [ ] Verify cart cleared
- [ ] Check dashboard shows enrolled course

### Failed Payment
- [ ] Use invalid card details
- [ ] Verify payment fails
- [ ] Verify redirect to failure page
- [ ] Verify no enrollment created
- [ ] Verify cart items remain

### Payment Webhook
- [ ] Trigger webhook manually (if testing locally with ngrok)
- [ ] Verify webhook processes payment
- [ ] Verify enrollment created
- [ ] Check payment status updated

---

## 9. Matching Algorithm Tests

### Student-Course Matching
- [ ] Login as alice@student.com (interests: JavaScript, React, Web Development)
- [ ] Check recommended courses
- [ ] Verify courses tagged with JavaScript/React appear first
- [ ] Check match scores (should be >50% for relevant courses)
- [ ] Login as bob@student.com (interests: Python, Data Science)
- [ ] Verify different recommendations (Python/Data Science courses)

### Student-Instructor Matching
- [ ] As alice (JavaScript interests)
- [ ] Check recommended instructors
- [ ] Verify instructors with JavaScript skills appear
- [ ] As bob (Python interests)
- [ ] Verify instructors with Python skills appear

### Similar Courses
- [ ] View a Web Development course
- [ ] Scroll to "Similar Courses" section
- [ ] Verify courses with similar tags appear
- [ ] Verify courses in same category appear

### Match Score Calculation
- [ ] Course with exact tag match: ~80-100% match
- [ ] Course with partial tag match: ~40-60% match
- [ ] Course with category match only: ~20-40% match
- [ ] Verify badge shows only for >50% match

---

## 10. File Upload Tests

### Avatar Upload
- [ ] During onboarding, upload profile photo
- [ ] Verify image preview shows
- [ ] Verify file size limit (if implemented)
- [ ] Verify file type validation (images only)
- [ ] Submit form
- [ ] Check avatar displays in dashboard
- [ ] Check avatar in navigation bar

### Course Thumbnail Upload
- [ ] Create course
- [ ] Upload thumbnail image
- [ ] Verify preview shows
- [ ] Submit course
- [ ] Verify thumbnail displays in course card
- [ ] Verify thumbnail on course detail page

### Video Upload
- [ ] Add lesson to course
- [ ] Upload video file
- [ ] Verify upload progress (if implemented)
- [ ] Verify video preview
- [ ] Save lesson
- [ ] Check video accessible in course

### Upload Error Handling
- [ ] Try uploading file >10MB (if limit exists)
- [ ] Verify error message
- [ ] Try uploading wrong file type
- [ ] Verify validation error

---

## 11. Authorization Tests

### Student Restrictions
- [ ] Login as student
- [ ] Try accessing `/dashboard/instructor`
- [ ] Verify redirect to student dashboard
- [ ] Try accessing `/dashboard/instructor/courses/create`
- [ ] Verify redirect or 403 error
- [ ] Try POST to `/api/courses`
- [ ] Verify 403 error

### Instructor Restrictions
- [ ] Login as instructor
- [ ] Try editing another instructor's course
- [ ] Verify 403 error
- [ ] Try deleting another instructor's course
- [ ] Verify 403 error

### Admin Access
- [ ] Login as admin
- [ ] Access `/admin`
- [ ] Verify access granted
- [ ] Try editing any course
- [ ] Verify access granted
- [ ] Try deleting any course
- [ ] Verify access granted

### Unauthenticated Access
- [ ] Logout
- [ ] Try accessing `/dashboard`
- [ ] Verify redirect to `/login`
- [ ] Try accessing `/cart`
- [ ] Verify redirect to `/login`
- [ ] Try POST to `/api/cart`
- [ ] Verify 401 error

---

## 12. Data Persistence Tests

### Cart Persistence
- [ ] Login as student
- [ ] Add items to cart
- [ ] Logout
- [ ] Login again
- [ ] Verify cart items still present

### Progress Tracking
- [ ] Enroll in course
- [ ] Mark lesson as complete (if implemented)
- [ ] Refresh page
- [ ] Verify progress saved
- [ ] Check dashboard shows updated progress

### Session Persistence
- [ ] Login
- [ ] Close browser
- [ ] Reopen browser
- [ ] Navigate to site
- [ ] Verify still logged in (if "Remember me" checked)

---

## 13. Edge Cases & Error Handling

### Network Errors
- [ ] Disconnect internet
- [ ] Try submitting form
- [ ] Verify error message
- [ ] Reconnect
- [ ] Retry submission
- [ ] Verify success

### Duplicate Actions
- [ ] Add course to cart twice quickly
- [ ] Verify only one item added
- [ ] Enroll in same course twice
- [ ] Verify duplicate prevented

### Invalid Data
- [ ] Submit form with missing required fields
- [ ] Verify validation errors
- [ ] Submit form with invalid email format
- [ ] Verify email validation
- [ ] Submit negative price
- [ ] Verify price validation

### Database Errors
- [ ] Stop database
- [ ] Try loading page
- [ ] Verify graceful error handling
- [ ] Restart database
- [ ] Verify recovery

---

## 14. Performance Tests

### Page Load Times
- [ ] Measure dashboard load time (<2s)
- [ ] Measure course listing load time (<2s)
- [ ] Measure course detail load time (<2s)

### Large Data Sets
- [ ] Create 50+ courses
- [ ] Check course listing performance
- [ ] Check search performance
- [ ] Check filter performance

### Concurrent Users
- [ ] Open multiple browser tabs
- [ ] Login as different users
- [ ] Perform actions simultaneously
- [ ] Verify no conflicts

---

## 15. Mobile Responsiveness Tests

### Viewport Sizes
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)
- [ ] Verify layout adapts correctly

### Touch Interactions
- [ ] Test buttons on mobile
- [ ] Test form inputs on mobile
- [ ] Test navigation menu on mobile
- [ ] Test cart on mobile

---

## 16. Browser Compatibility Tests

### Chrome
- [ ] All features work
- [ ] No console errors
- [ ] Styling correct

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Styling correct

### Safari
- [ ] All features work
- [ ] No console errors
- [ ] Styling correct

### Edge
- [ ] All features work
- [ ] No console errors
- [ ] Styling correct

---

## Test Results Summary

**Date:** ___________  
**Tester:** ___________  
**Environment:** Development / Staging / Production

| Category | Tests Passed | Tests Failed | Notes |
|----------|--------------|--------------|-------|
| Authentication | __ / __ | __ | |
| Onboarding | __ / __ | __ | |
| Dashboards | __ / __ | __ | |
| Course Management | __ / __ | __ | |
| Cart & Payment | __ / __ | __ | |
| Matching Algorithm | __ / __ | __ | |
| File Uploads | __ / __ | __ | |
| Authorization | __ / __ | __ | |
| Edge Cases | __ / __ | __ | |

**Overall Pass Rate:** ____%

**Critical Issues Found:**
1. 
2. 
3. 

**Recommendations:**
1. 
2. 
3. 

---

## Automated Testing (Future)

### Unit Tests
```bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test
```

### E2E Tests
```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npx playwright test
```

### API Tests
```bash
# Install Postman or use curl
# Test all API endpoints
```

---

**Testing Complete! 🎉**
