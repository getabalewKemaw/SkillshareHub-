import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Users
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice Student',
      displayName: 'Alice',
      role: 'USER',
      onboardingCompleted: true,
      interests: ['react', 'ui/ux'],
      learningGoals: 'Learn modern React and UI patterns',
    }
  })

  const bob = await prisma.user.upsert({
    where: { email: 'bob@instructors.com' },
    update: {},
    create: {
      email: 'bob@instructors.com',
      name: 'Bob Instructor',
      displayName: 'Bob',
      role: 'INSTRUCTOR',
      onboardingCompleted: true,
      bio: 'Senior engineer teaching React and Node.js',
      skills: ['react', 'node', 'typescript'],
      isPaymentEnabled: true,
    }
  })

  // Courses
  const course1 = await prisma.course.create({
    data: {
      title: 'React Fundamentals',
      description: 'Learn the basics of React',
      category: 'web-development',
      price: 0,
      status: 'PUBLISHED',
      instructorId: bob.id,
    }
  })

  const course2 = await prisma.course.create({
    data: {
      title: 'Advanced React Patterns',
      description: 'Dive into advanced patterns',
      category: 'web-development',
      price: 15,
      status: 'PUBLISHED',
      instructorId: bob.id,
    }
  })

  // Materials
  await prisma.material.createMany({
    data: [
      { courseId: course1.id, title: 'Intro', type: 'video', url: 'https://example.com/intro.mp4', order: 1 },
      { courseId: course1.id, title: 'JSX', type: 'pdf', url: 'https://example.com/jsx.pdf', order: 2 },
    ]
  })

  // Enrollment
  await prisma.enrollment.create({ data: { userId: alice.id, courseId: course1.id } })

  console.log('Seed complete')
}

main().finally(async () => {
  await prisma.$disconnect()
})
