T# 🎓 SkillShare Hub

A modern, full-stack online learning platform built with Next.js 15, PostgreSQL, Prisma, and Tailwind CSS. Share knowledge, learn new skills, and grow together!

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-6-2d3748)

## ✨ Features

### 🎯 Core Features
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS v4 and shadcn/ui components
- **Authentication**: Secure authentication with NextAuth.js (credentials & OAuth)
- **Role-Based Access**: Three user roles (User, Instructor, Admin) with appropriate permissions
- **Course Management**: Full CRUD operations for courses with materials and categories
- **Enrollment System**: Seamless course enrollment with progress tracking
- **Payment Integration**: Chapa payment gateway for paid courses
- **Reviews & Ratings**: Students can rate and review courses
- **Search & Filters**: Advanced filtering by category, price, and popularity

### 👨‍🎓 For Students
- Browse and search thousands of courses
- Enroll in free and paid courses
- Track learning progress
- Access course materials (videos, PDFs, etc.)
- Write reviews and ratings
- Earn certificates upon completion
- Personal dashboard with enrolled courses

### 👨‍🏫 For Instructors
- Create and manage courses
- Upload course materials
- Track student enrollments
- View course analytics
- Manage course pricing
- Monitor reviews and feedback

### 👨‍💼 For Admins
- User management (roles, permissions)
- Course moderation and approval
- Platform analytics and statistics
- Content management
- Payment oversight

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Payment**: [Chapa](https://chapa.co/)

## 📁 Project Structure

```
skillsharehub/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── auth/               # NextAuth routes
│   │   └── chapa/              # Payment integration
│   ├── courses/                # Course pages
│   │   ├── [id]/              # Course detail & materials
│   │   └── page.tsx           # Course listing
│   ├── dashboard/              # User dashboards
│   │   ├── instructor/        # Instructor dashboard
│   │   └── page.tsx          # Student dashboard
│   ├── admin/                  # Admin panel
│   │   ├── users/            # User management
│   │   └── courses/          # Course moderation
│   ├── profile/               # User profile
│   ├── components/            # Page-specific components
│   │   ├── auth/             # Auth components
│   │   ├── courses/          # Course components
│   │   ├── layout/           # Layout components
│   │   └── payments/         # Payment components
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles
├── components/                # Reusable UI components
│   └── ui/                   # shadcn/ui components
├── lib/                      # Utilities & configs
│   ├── auth.ts              # NextAuth config
│   ├── prisma.ts            # Prisma client
│   └── utils.ts             # Helper functions
├── prisma/                   # Database
│   └── schema.prisma        # Database schema
├── public/                   # Static assets
├── middleware.ts            # Auth & role middleware
└── package.json             # Dependencies
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Chapa account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd skillsharehub
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/skillshare"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Chapa Payment
CHAPA_SECRET_KEY="your-chapa-secret-key"
CHAPA_WEBHOOK_SECRET="your-chapa-webhook-secret"
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**

Visit [http://localhost:3000](http://localhost:3000)

## 📸 Screenshots

### Homepage
Modern landing page with hero section, featured courses, and call-to-actions.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
