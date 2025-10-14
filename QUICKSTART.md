# 🚀 Quick Start Guide - SkillShare Hub

Get your SkillShare Hub up and running in 5 minutes!

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ PostgreSQL installed and running
- ✅ npm or yarn package manager

## Step-by-Step Setup

### 1. Install Dependencies (1 min)

```bash
npm install
```

### 2. Setup Environment Variables (2 min)

Create a `.env` file in the root directory:

```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillshare"

# NextAuth - Generate a random secret
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here-change-this"

# Chapa Payment (Optional for testing)
CHAPA_SECRET_KEY="your-chapa-secret-key"
CHAPA_WEBHOOK_SECRET="your-chapa-webhook-secret"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Setup Database (1 min)

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 4. Run Development Server (1 min)

```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

## First Steps After Setup

### Create Your First User

1. Go to http://localhost:3000/signup
2. Register with email and password
3. You'll be redirected to the dashboard

### Make Yourself an Admin (Optional)

Open Prisma Studio:
```bash
npx prisma studio
```

1. Navigate to the `User` model
2. Find your user
3. Change `role` from `USER` to `ADMIN`
4. Save changes
5. Refresh your browser

Now you have full admin access!

### Create Your First Course

1. Change your role to `INSTRUCTOR` or `ADMIN`
2. Go to `/dashboard/instructor`
3. Click "Create New Course"
4. Fill in the details
5. Publish your course!

## Common Issues & Solutions

### Issue: Database Connection Error

**Solution:**
- Make sure PostgreSQL is running
- Check your DATABASE_URL in `.env`
- Verify credentials are correct

```bash
# Test PostgreSQL connection
psql -U postgres -d skillshare
```

### Issue: NextAuth Error

**Solution:**
- Make sure NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your dev server
- Clear browser cookies and try again

### Issue: Prisma Client Not Generated

**Solution:**
```bash
npx prisma generate
```

### Issue: Migration Fails

**Solution:**
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Then run migrations again
npx prisma migrate dev
```

## Testing the Platform

### Test as Student
1. Register a new account
2. Browse courses at `/courses`
3. Enroll in a course
4. View dashboard at `/dashboard`

### Test as Instructor
1. Change user role to `INSTRUCTOR` in database
2. Go to `/dashboard/instructor`
3. Create a course
4. Add materials
5. Publish course

### Test as Admin
1. Change user role to `ADMIN` in database
2. Go to `/admin`
3. View all users
4. Moderate courses
5. View platform statistics

## Payment Testing (Chapa)

### Setup Chapa Test Account

1. Sign up at https://dashboard.chapa.co
2. Get your test API keys
3. Add to `.env` file
4. Use Chapa test cards for testing

### Test Payment Flow

1. Create a paid course (price > 0)
2. Try to enroll
3. You'll be redirected to Chapa
4. Use test card: `4200 0000 0000 0000`
5. Complete payment
6. Webhook will create enrollment

## Development Tips

### Hot Reload
- Changes to components auto-reload
- Changes to API routes require manual refresh
- Database changes need migration

### View Database
```bash
npx prisma studio
```

### Check Logs
- Server logs appear in terminal
- Client errors in browser console

### Format Code
```bash
npm run lint
```

## Project Structure Quick Reference

```
📁 app/
  📄 page.tsx          → Homepage
  📁 courses/          → Course pages
  📁 dashboard/        → User dashboards
  📁 admin/            → Admin panel
  📁 api/              → API routes

📁 components/
  📁 ui/               → Reusable components

📁 lib/
  📄 auth.ts           → NextAuth config
  📄 prisma.ts         → Database client

📁 prisma/
  📄 schema.prisma     → Database schema
```

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma studio        # Open database GUI
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Run migrations
npx prisma migrate reset # Reset database

# Linting
npm run lint             # Check code quality
```

## Next Steps

1. ✅ Customize the homepage
2. ✅ Add your branding
3. ✅ Create sample courses
4. ✅ Test all features
5. ✅ Deploy to production

## Need Help?

- 📖 Check [README.md](./README.md) for detailed docs
- 📋 Check [FEATURES.md](./FEATURES.md) for feature list
- 🔧 Check [SETUP.md](./SETUP.md) for advanced setup
- 📧 Email: gech12kemaw@gmail.com
- 🐛 GitHub Issues: Report bugs

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

### Database Hosting

- **Neon**: Free PostgreSQL
- **Supabase**: Free tier available
- **Railway**: Easy PostgreSQL hosting
- **Vercel Postgres**: Integrated solution

---

**🎉 Congratulations! You're ready to build an amazing learning platform!**

Happy coding! 🚀
