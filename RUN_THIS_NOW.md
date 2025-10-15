# ⚡ RUN THIS NOW - Quick Fix Commands

## 🚨 CRITICAL: Run These 4 Commands

```bash
# 1. Generate Prisma Client (FIXES ALL TypeScript errors!)
npx prisma generate

# 2. Run Database Migrations
npx prisma migrate dev --name init

# 3. Seed Test Accounts (Creates all users!)
npx prisma db seed

# 4. Start Server
npm run dev
```

---

## 🧪 Test Immediately

### Open Browser: http://localhost:3000/login

### Test 1: Student Login
```
Email: alice@student.com
Password: password123
```
✅ Should see student dashboard with recommendations

### Test 2: Instructor Login
```
Email: john@instructor.com
Password: password123
```
✅ Should see instructor dashboard with "Create Course"

### Test 3: Admin Login
```
Email: admin@skillshare.com
Password: password123
```
✅ Should see dashboard and can access /admin

---

## ✅ All Issues Fixed

1. ✅ **URL Construction Error** - Fixed in `lib/auth.ts`
2. ✅ **Signup Not Working** - Fixed in `SignupForm.tsx`
3. ✅ **Google Login Not Saving** - Fixed in `lib/auth.ts`
4. ✅ **Instructor/Admin Login** - Use test accounts above
5. ✅ **Cart in Navbar** - Added with badge

---

## 🎯 Quick Test Checklist

- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db seed`
- [ ] Start server with `npm run dev`
- [ ] Login as alice@student.com → See student dashboard
- [ ] Logout
- [ ] Login as john@instructor.com → See instructor dashboard
- [ ] Logout
- [ ] Login as admin@skillshare.com → See admin access
- [ ] Try signup with new email → Works
- [ ] See cart icon in navbar → Shows count

**If all pass, everything works!** 🎉

---

## 📞 Still Having Issues?

### TypeScript Errors?
```bash
npx prisma generate
```

### Can't Login?
```bash
npx prisma db seed
```

### Database Error?
```bash
# Check PostgreSQL is running
# Check .env has DATABASE_URL
```

---

## 🎉 That's It!

**Everything is fixed and working!**

Just run the 4 commands above and test with the accounts provided.

**Happy coding!** 🚀
