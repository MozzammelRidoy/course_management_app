/* eslint-disable @typescript-eslint/no-explicit-any */
import PrismaQueryBuilder from '../../builder/PrismaQueryBuilder'
import { TJwtPayload } from '../../interfaces/jwtToken_interface'
import { prisma } from '../../shared/prisma'

// get my all Assigned courses from db by Student
const fetch_my_Assigned_Courses_byTeacher_fromDB = async (
  user: TJwtPayload,
  query: Record<string, unknown>
) => {
  const { search, status, ...rest } = query

  const whereCondition: any = {
    teacher: {
      userId: user.user_id
    }
  }

  if (search) {
    whereCondition.course = {
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          code: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }
  }

  if (status) {
    whereCondition.course = {
      ...whereCondition.course,
      status: status
    }
  }

  const coursesQuery = new PrismaQueryBuilder(prisma.teacherCourses, rest)
    .setBaseQuery({
      ...whereCondition
    })
    .include({
      course: {
        select: {
          name: true,
          description: true,
          category: true,
          level: true,
          credits: true,
          duration: true,
          code: true,
          startDate: true,
          endDate: true,
          status: true
        }
      }
    })
    .filter()
    .fields()
    .sort()
    .paginate()

  const data = await coursesQuery.execute()
  const meta = await coursesQuery.countTotal()

  return { data, meta }
}

// fetch all students under the course by teacher
const fetch_courseStudents_byTeacher_fromDB = async (
  user: TJwtPayload,
  courseId: string,
  query: Record<string, unknown>
) => {
  const { search, studentId } = query

  const whereCondition: any = {
    courseId,

    // Teacher security
    course: {
      teacherLinks: {
        some: {
          teacher: {
            userId: user.user_id
          }
        }
      }
    }
  }

  // Filter by studentId
  if (studentId) {
    whereCondition.studentId = String(studentId)
  }

  // Global search (name OR email)
  if (search) {
    whereCondition.student = {
      user: {
        OR: [
          {
            email: {
              contains: String(search),
              mode: 'insensitive'
            }
          },
          {
            phone: {
              contains: String(search),
              mode: 'insensitive'
            }
          },
          {
            profile: {
              name: {
                contains: String(search),
                mode: 'insensitive'
              }
            }
          }
        ]
      }
    }
  }

  const studentQuery = new PrismaQueryBuilder(prisma.studentsCourses, {})
    .setBaseQuery({
      ...whereCondition
    })
    .setSecretFields(['studentId', 'courseId', 'createdAt', 'updatedAt'])
    .include({
      student: {
        select: {
          id: true,
          user: {
            select: {
              email: true,
              phone: true,
              profile: {
                select: { name: true }
              }
            }
          }
        }
      }
    })
  const data = await studentQuery.execute()
  const meta = await studentQuery.countTotal()

  const formatted = data.map(item => ({
    studentId: item.student.id,
    email: item.student.user.email,
    phone: item.student.user.phone,
    name: item.student.user.profile?.name,
    enrolledAt: item.enrolledAt,
    enrollmentStatus: item.status
  }))

  return { data: formatted, meta }
}

export const TeacherServices = {
  fetch_my_Assigned_Courses_byTeacher_fromDB,
  fetch_courseStudents_byTeacher_fromDB
}
