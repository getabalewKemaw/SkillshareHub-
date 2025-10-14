import { prisma } from "./prisma"

/**
 * Calculate similarity score between two arrays of tags/skills
 * Uses Jaccard similarity coefficient
 */
function calculateSimilarity(arr1: string[], arr2: string[]): number {
  if (arr1.length === 0 || arr2.length === 0) return 0

  const set1 = new Set(arr1.map(s => s.toLowerCase().trim()))
  const set2 = new Set(arr2.map(s => s.toLowerCase().trim()))

  const intersection = new Set([...set1].filter(x => set2.has(x)))
  const union = new Set([...set1, ...set2])

  return intersection.size / union.size
}

/**
 * Get recommended courses for a student based on their interests
 */
export async function getRecommendedCoursesForStudent(userId: string, limit = 10) {
  // Get student's interests
  const student = await prisma.user.findUnique({
    where: { id: userId },
    select: { interests: true },
  })

  if (!student || !student.interests || student.interests.length === 0) {
    // Return popular courses if no interests
    return prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        instructor: {
          select: {
            id: true,
            displayName: true,
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: {
        enrollments: {
          _count: 'desc',
        },
      },
      take: limit,
    })
  }

  // Get all published courses
  const courses = await prisma.course.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      instructor: {
        select: {
          id: true,
          displayName: true,
          name: true,
          avatarUrl: true,
          skills: true,
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  })

  // Calculate similarity scores
  const coursesWithScores = courses.map(course => {
    const tagSimilarity = calculateSimilarity(student.interests, course.tags)
    const skillSimilarity = calculateSimilarity(
      student.interests,
      course.instructor.skills || []
    )
    
    // Weighted score: 60% tags, 30% instructor skills, 10% popularity
    const popularityScore = Math.min(course._count.enrollments / 100, 1)
    const totalScore = (tagSimilarity * 0.6) + (skillSimilarity * 0.3) + (popularityScore * 0.1)

    return {
      ...course,
      matchScore: totalScore,
    }
  })

  // Sort by match score and return top results
  return coursesWithScores
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

/**
 * Get recommended instructors for a student based on their interests
 */
export async function getRecommendedInstructorsForStudent(userId: string, limit = 10) {
  const student = await prisma.user.findUnique({
    where: { id: userId },
    select: { interests: true },
  })

  if (!student || !student.interests || student.interests.length === 0) {
    // Return instructors with most courses
    return prisma.user.findMany({
      where: { 
        role: 'INSTRUCTOR',
        onboardingCompleted: true,
      },
      select: {
        id: true,
        displayName: true,
        name: true,
        bio: true,
        avatarUrl: true,
        skills: true,
        _count: {
          select: { courses: true },
        },
      },
      orderBy: {
        courses: {
          _count: 'desc',
        },
      },
      take: limit,
    })
  }

  // Get all instructors
  const instructors = await prisma.user.findMany({
    where: { 
      role: 'INSTRUCTOR',
      onboardingCompleted: true,
    },
    select: {
      id: true,
      displayName: true,
      name: true,
      bio: true,
      avatarUrl: true,
      skills: true,
      _count: {
        select: { courses: true },
      },
    },
  })

  // Calculate similarity scores
  const instructorsWithScores = instructors.map(instructor => {
    const skillSimilarity = calculateSimilarity(
      student.interests,
      instructor.skills || []
    )
    
    // Weighted score: 80% skill match, 20% course count
    const courseScore = Math.min(instructor._count.courses / 10, 1)
    const totalScore = (skillSimilarity * 0.8) + (courseScore * 0.2)

    return {
      ...instructor,
      matchScore: totalScore,
    }
  })

  // Sort by match score
  return instructorsWithScores
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

/**
 * Get potential students for an instructor based on their skills
 */
export async function getPotentialStudentsForInstructor(userId: string, limit = 10) {
  const instructor = await prisma.user.findUnique({
    where: { id: userId },
    select: { skills: true },
  })

  if (!instructor || !instructor.skills || instructor.skills.length === 0) {
    // Return recent students
    return prisma.user.findMany({
      where: { 
        role: 'USER',
        onboardingCompleted: true,
      },
      select: {
        id: true,
        displayName: true,
        name: true,
        avatarUrl: true,
        interests: true,
        learningGoals: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })
  }

  // Get all students
  const students = await prisma.user.findMany({
    where: { 
      role: 'USER',
      onboardingCompleted: true,
    },
    select: {
      id: true,
      displayName: true,
      name: true,
      avatarUrl: true,
      interests: true,
      learningGoals: true,
    },
  })

  // Calculate similarity scores
  const studentsWithScores = students.map(student => {
    const interestSimilarity = calculateSimilarity(
      instructor.skills,
      student.interests || []
    )

    return {
      ...student,
      matchScore: interestSimilarity,
    }
  })

  // Sort by match score
  return studentsWithScores
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}

/**
 * Get similar courses based on tags and category
 */
export async function getSimilarCourses(courseId: string, limit = 6) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { tags: true, category: true },
  })

  if (!course) return []

  const similarCourses = await prisma.course.findMany({
    where: {
      id: { not: courseId },
      status: 'PUBLISHED',
      OR: [
        { category: course.category },
        { tags: { hasSome: course.tags } },
      ],
    },
    include: {
      instructor: {
        select: {
          id: true,
          displayName: true,
          name: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
    take: limit * 2, // Get more to calculate similarity
  })

  // Calculate similarity and sort
  const coursesWithScores = similarCourses.map(c => ({
    ...c,
    matchScore: calculateSimilarity(course.tags, c.tags),
  }))

  return coursesWithScores
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit)
}
