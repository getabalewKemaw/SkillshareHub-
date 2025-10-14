import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.payment.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.material.deleteMany()
  await prisma.review.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.course.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10)
  const adminPassword = await bcrypt.hash('admin123', 10)

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: adminPassword,
      name: 'Admin User',
      displayName: 'Admin',
      role: 'ADMIN',
      onboardingCompleted: true,
    },
  })

  // Instructors
  const instructor1 = await prisma.user.create({
    data: {
      email: 'john@instructor.com',
      password: hashedPassword,
      name: 'John Doe',
      displayName: 'John Doe',
      bio: 'Full-stack developer with 10+ years of experience. Passionate about teaching web development and helping students achieve their goals.',
      role: 'INSTRUCTOR',
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'MongoDB'],
      paymentEnabled: true,
      onboardingCompleted: true,
      avatarUrl: '/uploads/avatar/instructor1.jpg',
    },
  })

  const instructor2 = await prisma.user.create({
    data: {
      email: 'sarah@instructor.com',
      password: hashedPassword,
      name: 'Sarah Johnson',
      displayName: 'Sarah Johnson',
      bio: 'Data scientist and machine learning expert. Love teaching complex concepts in simple ways.',
      role: 'INSTRUCTOR',
      skills: ['Python', 'Machine Learning', 'Data Science', 'TensorFlow', 'Pandas'],
      paymentEnabled: true,
      onboardingCompleted: true,
      avatarUrl: '/uploads/avatar/instructor2.jpg',
    },
  })

  const instructor3 = await prisma.user.create({
    data: {
      email: 'mike@instructor.com',
      password: hashedPassword,
      name: 'Mike Chen',
      displayName: 'Mike Chen',
      bio: 'UI/UX designer with a passion for creating beautiful and functional interfaces.',
      role: 'INSTRUCTOR',
      skills: ['UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Prototyping'],
      paymentEnabled: true,
      onboardingCompleted: true,
      avatarUrl: '/uploads/avatar/instructor3.jpg',
    },
  })

  // Students
  const student1 = await prisma.user.create({
    data: {
      email: 'alice@student.com',
      password: hashedPassword,
      name: 'Alice Smith',
      displayName: 'Alice',
      role: 'USER',
      interests: ['Web Development', 'JavaScript', 'React'],
      learningGoals: 'I want to become a full-stack web developer and build my own applications.',
      onboardingCompleted: true,
    },
  })

  const student2 = await prisma.user.create({
    data: {
      email: 'bob@student.com',
      password: hashedPassword,
      name: 'Bob Wilson',
      displayName: 'Bob',
      role: 'USER',
      interests: ['Data Science', 'Machine Learning', 'Python'],
      learningGoals: 'Learn data science and machine learning to transition into a data analyst role.',
      onboardingCompleted: true,
    },
  })

  const student3 = await prisma.user.create({
    data: {
      email: 'emma@student.com',
      password: hashedPassword,
      name: 'Emma Davis',
      displayName: 'Emma',
      role: 'USER',
      interests: ['Design', 'UI/UX', 'Figma'],
      learningGoals: 'Improve my design skills and learn industry-standard tools.',
      onboardingCompleted: true,
    },
  })

  console.log('✅ Users created')

  // Create courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Complete Web Development Bootcamp 2024',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and become a full-stack developer.',
      category: 'Web Development',
      tags: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML', 'CSS'],
      price: 1999,
      level: 'Beginner',
      duration: 3600,
      status: 'PUBLISHED',
      instructorId: instructor1.id,
    },
  })

  const course2 = await prisma.course.create({
    data: {
      title: 'Advanced React Patterns and Best Practices',
      description: 'Master advanced React concepts including hooks, context, performance optimization, and testing.',
      category: 'Web Development',
      tags: ['React', 'JavaScript', 'TypeScript', 'Testing'],
      price: 1499,
      level: 'Advanced',
      duration: 1800,
      status: 'PUBLISHED',
      instructorId: instructor1.id,
    },
  })

  const course3 = await prisma.course.create({
    data: {
      title: 'Machine Learning A-Z: Hands-On Python',
      description: 'Learn machine learning algorithms, data preprocessing, model evaluation, and deployment using Python.',
      category: 'Data Science',
      tags: ['Python', 'Machine Learning', 'Data Science', 'TensorFlow', 'Scikit-learn'],
      price: 2499,
      level: 'Intermediate',
      duration: 4200,
      status: 'PUBLISHED',
      instructorId: instructor2.id,
    },
  })

  const course4 = await prisma.course.create({
    data: {
      title: 'Data Analysis with Python and Pandas',
      description: 'Master data analysis using Python, Pandas, NumPy, and Matplotlib. Work with real datasets.',
      category: 'Data Science',
      tags: ['Python', 'Pandas', 'Data Analysis', 'NumPy', 'Matplotlib'],
      price: 0,
      level: 'Beginner',
      duration: 1200,
      status: 'PUBLISHED',
      instructorId: instructor2.id,
    },
  })

  const course5 = await prisma.course.create({
    data: {
      title: 'UI/UX Design Masterclass with Figma',
      description: 'Learn user interface and user experience design from scratch. Master Figma and create stunning designs.',
      category: 'Design',
      tags: ['UI Design', 'UX Design', 'Figma', 'Prototyping', 'User Research'],
      price: 1799,
      level: 'Beginner',
      duration: 2400,
      status: 'PUBLISHED',
      instructorId: instructor3.id,
    },
  })

  const course6 = await prisma.course.create({
    data: {
      title: 'Introduction to Programming with JavaScript',
      description: 'Perfect for beginners! Learn programming fundamentals using JavaScript.',
      category: 'Web Development',
      tags: ['JavaScript', 'Programming', 'Beginner'],
      price: 0,
      level: 'Beginner',
      duration: 900,
      status: 'PUBLISHED',
      instructorId: instructor1.id,
    },
  })

  console.log('✅ Courses created')

  // Create lessons for course 1
  await prisma.lesson.createMany({
    data: [
      {
        courseId: course1.id,
        title: 'Introduction to Web Development',
        description: 'Overview of web development and what you will learn',
        type: 'video',
        duration: 15,
        order: 1,
        isFree: true,
      },
      {
        courseId: course1.id,
        title: 'HTML Basics',
        description: 'Learn HTML tags, elements, and structure',
        type: 'video',
        duration: 45,
        order: 2,
        isFree: true,
      },
      {
        courseId: course1.id,
        title: 'CSS Fundamentals',
        description: 'Styling web pages with CSS',
        type: 'video',
        duration: 60,
        order: 3,
        isFree: false,
      },
      {
        courseId: course1.id,
        title: 'JavaScript Basics',
        description: 'Variables, functions, and control flow',
        type: 'video',
        duration: 90,
        order: 4,
        isFree: false,
      },
      {
        courseId: course1.id,
        title: 'Building Your First Project',
        description: 'Create a portfolio website',
        type: 'video',
        duration: 120,
        order: 5,
        isFree: false,
      },
    ],
  })

  // Create lessons for course 4 (free course)
  await prisma.lesson.createMany({
    data: [
      {
        courseId: course4.id,
        title: 'Introduction to Data Analysis',
        description: 'What is data analysis and why it matters',
        type: 'video',
        duration: 20,
        order: 1,
        isFree: true,
      },
      {
        courseId: course4.id,
        title: 'Setting Up Python Environment',
        description: 'Install Python, Jupyter, and required libraries',
        type: 'video',
        duration: 30,
        order: 2,
        isFree: true,
      },
      {
        courseId: course4.id,
        title: 'Pandas Basics',
        description: 'DataFrames, Series, and basic operations',
        type: 'video',
        duration: 45,
        order: 3,
        isFree: true,
      },
    ],
  })

  console.log('✅ Lessons created')

  // Create enrollments
  await prisma.enrollment.createMany({
    data: [
      { userId: student1.id, courseId: course1.id, progress: 45, status: 'ACTIVE' },
      { userId: student1.id, courseId: course6.id, progress: 100, status: 'COMPLETED' },
      { userId: student2.id, courseId: course3.id, progress: 30, status: 'ACTIVE' },
      { userId: student2.id, courseId: course4.id, progress: 80, status: 'ACTIVE' },
      { userId: student3.id, courseId: course5.id, progress: 60, status: 'ACTIVE' },
      { userId: student3.id, courseId: course6.id, progress: 100, status: 'COMPLETED' },
    ],
  })

  console.log('✅ Enrollments created')

  // Create reviews
  await prisma.review.createMany({
    data: [
      {
        userId: student1.id,
        courseId: course6.id,
        rating: 5,
        comment: 'Excellent course for beginners! Very clear explanations.',
      },
      {
        userId: student2.id,
        courseId: course4.id,
        rating: 5,
        comment: 'Great introduction to data analysis with Python.',
      },
      {
        userId: student3.id,
        courseId: course6.id,
        rating: 4,
        comment: 'Good course, but could use more practice exercises.',
      },
    ],
  })

  console.log('✅ Reviews created')

  // Create cart items
  await prisma.cartItem.createMany({
    data: [
      { userId: student1.id, courseId: course2.id },
      { userId: student2.id, courseId: course1.id },
      { userId: student3.id, courseId: course3.id },
    ],
  })

  console.log('✅ Cart items created')

  // Create sample payment
  await prisma.payment.create({
    data: {
      userId: student1.id,
      amount: 1999,
      currency: 'ETB',
      status: 'completed',
      transactionRef: 'tx-sample-001',
      metadata: JSON.stringify({
        courseIds: [course1.id],
        courseTitles: [course1.title],
      }),
    },
  })

  console.log('✅ Payment records created')

  console.log('🎉 Seed completed successfully!')
  console.log('\n📝 Test Accounts:')
  console.log('Admin: admin@skillshare.com / password123')
  console.log('Instructor 1: john@instructor.com / password123')
  console.log('Instructor 2: sarah@instructor.com / password123')
  console.log('Instructor 3: mike@instructor.com / password123')
  console.log('Student 1: alice@student.com / password123')
  console.log('Student 2: bob@student.com / password123')
  console.log('Student 3: emma@student.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
