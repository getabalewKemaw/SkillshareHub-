# 🔄 Database Migration Steps

## Initial Setup (First Time)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Database
Edit `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/skillshare"
```

### Step 3: Generate Prisma Client
```bash
npx prisma generate
```

This creates TypeScript types from your schema and resolves all TypeScript errors.

### Step 4: Create Database Tables
```bash
npx prisma migrate dev --name init
```

This will:
- Create a new migration file in `prisma/migrations/`
- Apply the migration to your database
- Create all tables, indexes, and constraints

### Step 5: Seed Database
```bash
npx prisma db seed
```

This populates the database with test data.

---

## After Schema Changes

Whenever you modify `prisma/schema.prisma`:

### Option A: Development Migration (Recommended)
```bash
# Generate new migration
npx prisma migrate dev --name descriptive_name

# Example names:
# - add_onboarding_fields
# - add_cart_and_payment
# - add_lessons_model
```

This will:
1. Create a new migration file
2. Apply it to your database
3. Regenerate Prisma Client

### Option B: Reset Database (Clean Slate)
```bash
# WARNING: This deletes ALL data
npx prisma migrate reset

# Then re-seed
npx prisma db seed
```

---

## Production Deployment

### Step 1: Set Production DATABASE_URL
```env
DATABASE_URL="postgresql://user:pass@production-host:5432/skillshare?sslmode=require"
```

### Step 2: Apply Migrations
```bash
npx prisma migrate deploy
```

**Note:** Use `migrate deploy` in production (not `migrate dev`)

### Step 3: Generate Client
```bash
npx prisma generate
```

---

## Common Migration Commands

### View Migration Status
```bash
npx prisma migrate status
```

### Create Migration Without Applying
```bash
npx prisma migrate dev --create-only
```

### Apply Pending Migrations
```bash
npx prisma migrate deploy
```

### Resolve Migration Issues
```bash
npx prisma migrate resolve --applied "migration_name"
npx prisma migrate resolve --rolled-back "migration_name"
```

---

## Troubleshooting

### Error: "Prisma Client not generated"
```bash
npx prisma generate
```

### Error: "Migration failed"
```bash
# Check migration status
npx prisma migrate status

# Reset and try again (dev only)
npx prisma migrate reset
```

### Error: "Database connection failed"
```bash
# Test connection
npx prisma db pull

# Check DATABASE_URL in .env
# Ensure PostgreSQL is running
```

### TypeScript Errors After Schema Change
```bash
# Regenerate Prisma Client
npx prisma generate

# Restart TypeScript server in VS Code
# Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

---

## Migration Best Practices

1. **Always backup production data** before migrations
2. **Test migrations locally** before production
3. **Use descriptive migration names**
4. **Review generated SQL** in migration files
5. **Never edit migration files** after they're applied
6. **Use `migrate deploy`** in production, not `migrate dev`
7. **Keep migrations small** and focused
8. **Document breaking changes** in migration comments

---

## Schema Change Workflow

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name change_description`
3. Review generated migration file
4. Test locally
5. Commit migration files to git
6. Deploy to production with `npx prisma migrate deploy`

---

## Rollback Strategy

Prisma doesn't support automatic rollbacks. To rollback:

### Option 1: Create Reverse Migration
```bash
# Create new migration that reverses changes
npx prisma migrate dev --name revert_previous_change
```

### Option 2: Restore from Backup
```bash
# Restore database from backup
pg_restore -d skillshare backup.sql
```

### Option 3: Manual SQL
```bash
# Connect to database
psql skillshare

# Run reverse SQL commands
ALTER TABLE users DROP COLUMN new_field;
```

---

## Current Schema Summary

### Tables Created
- `User` - Authentication and profiles
- `Course` - Course content
- `Lesson` - Individual lessons
- `Enrollment` - User-Course enrollments
- `CartItem` - Shopping cart
- `Payment` - Transaction records
- `Review` - Course reviews
- `Material` - Course materials (legacy)
- `Session` - NextAuth sessions
- `Account` - OAuth accounts
- `VerificationToken` - Email verification

### Key Indexes
- `User.email` (unique)
- `Enrollment.userId_courseId` (unique composite)
- `CartItem.userId_courseId` (unique composite)
- `Review.userId_courseId` (unique composite)
- `Payment.transactionRef` (unique)

### Enums
- `Role`: USER, INSTRUCTOR, ADMIN
- `CourseStatus`: DRAFT, PUBLISHED, ARCHIVED
- `EnrollmentStatus`: PENDING, ACTIVE, COMPLETED

---

## Seed Data

The seed script creates:
- 1 Admin user
- 3 Instructors (different specializations)
- 3 Students (different interests)
- 6 Courses (mix of free and paid)
- Multiple lessons per course
- Sample enrollments with progress
- Sample reviews
- Sample cart items
- Sample payment records

All test accounts use password: `password123`

---

## Next Steps After Migration

1. ✅ Run `npm run dev`
2. ✅ Test login with seed accounts
3. ✅ Verify onboarding flow
4. ✅ Test course creation
5. ✅ Test cart and payment
6. ✅ Verify matching algorithm
7. ✅ Check all dashboards

---

**Migration Complete! 🎉**
