# SkillShare Hub - Setup Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/skillshare"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-key-here"

# Chapa Payment Integration
CHAPA_SECRET_KEY="your-chapa-secret-key"
CHAPA_WEBHOOK_SECRET="your-chapa-webhook-secret"
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
Make sure PostgreSQL is running, then run:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Seed Database (Optional)
Create an admin user and sample data:
```bash
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## Features Implemented

✅ Modern, responsive homepage with hero section
✅ Course listing with filters and search
✅ Course detail pages with enrollment
✅ User dashboard with progress tracking
✅ Instructor dashboard with course management
✅ Admin panel for user and course moderation
✅ Chapa payment integration
✅ Profile management
✅ Role-based access control
✅ Authentication with NextAuth
✅ Beautiful UI with Tailwind CSS and shadcn/ui

## Default User Roles

- **USER**: Can browse and enroll in courses
- **INSTRUCTOR**: Can create and manage courses
- **ADMIN**: Full access to all features

## Payment Integration

The platform uses Chapa for payment processing. To test:

1. Get your API keys from [Chapa Dashboard](https://dashboard.chapa.co)
2. Add them to your `.env` file
3. Test with Chapa's test card numbers

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Payment**: Chapa
- **Form Validation**: React Hook Form + Zod

## Project Structure

```
skillsharehub/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── courses/           # Course pages
│   ├── dashboard/         # User & instructor dashboards
│   ├── admin/             # Admin panel
│   ├── profile/           # User profile
│   └── components/        # Page-specific components
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities and configurations
├── prisma/               # Database schema
└── public/               # Static assets
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License
