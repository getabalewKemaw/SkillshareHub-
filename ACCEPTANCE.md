# SkillShare Hub - Acceptance Checklist

## A. Post-Auth Redirection
- [ ] New signup redirected to `/onboarding`
- [ ] Completing onboarding redirects to role dashboard
- [ ] Subsequent logins go to `/dashboard` or `/dashboard/instructor`

## B. Role-based Onboarding
- [ ] Student: displayName, learningGoals, interests, avatar
- [ ] Instructor: displayName, bio, skills, avatar, introVideo (optional), payments toggle
- [ ] Data persists to `User` fields (Prisma)

## C. Authorization & Routes
- [ ] Only instructors/admin can access `/dashboard/instructor/*`
- [ ] Students can view instructor profile only if enrolled in any of their courses
- [ ] Course materials gated by enrollment or instructor status

## D. Cart + Payment (Chapa demo)
- [ ] Add to cart stores server-side items
- [ ] Cart page shows items and total
- [ ] Checkout hits `/api/chapa/initialize` and redirects to Chapa
- [ ] Webhook `/api/chapa/webhook` marks enrollment on success

## E. Prisma Schema & Migrations
- [ ] Run `npx prisma migrate dev -n add_onboarding_cart_payment`
- [ ] Seed with `ts-node prisma/seed.ts` (or `node --loader ts-node/esm prisma/seed.ts`)

## F. Middleware
- [ ] Un-onboarded users are redirected to `/onboarding`

## G. Uploads (Mock)
- [ ] `/api/uploads/mock` returns a fake URL
- [ ] `lib/uploads.ts` helper works from client forms

## H. Matching
- [ ] `/api/matching` returns best 10 matches based on tags/goals
- [ ] `/matching` page lists matches with score and profile links

## Smoke Test Script
1. Sign up as Student; complete onboarding; see Student Dashboard
2. Browse courses; add free and paid to cart; checkout paid (Chapa test); upon webhook success, enrollment exists
3. Sign up another as Instructor; complete onboarding; create course (manual for now)
4. As Student, view instructor profile only after enrolling
5. Visit `/matching` to see matches
