/* eslint-disable @typescript-eslint/no-explicit-any */
import PrismaQueryBuilder from '../../builder/PrismaQueryBuilder'
import { TJwtPayload } from '../../interfaces/jwtToken_interface'
import { prisma } from '../../shared/prisma'

// get my all courses from db by Student
const fetch_my_courses_by_student_fromDB = async (
  user: TJwtPayload,
  query: Record<string, unknown>
) => {
  const { ...rest } = query
  const coursesQuery = new PrismaQueryBuilder(prisma.studentsCourses, rest)
    .setBaseQuery({
      student: {
        userId: user.user_id
      }
    })
    .include({
      course: {
        select: {
          name: true,
          duration: true,
          credits: true,
          endDate: true,
          startDate: true,
          code: true,
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

// fetch my all result by Student.
const fetch_myResults_byStudent_fromDB = async (
  user: TJwtPayload,
  query: Record<string, unknown>
) => {
  const { search, ...rest } = query
  if (rest.score) rest.score = Number(rest.score)

  const whereCondition: any = {
    isDeleted: false,
    student: {
      userId: user.user_id
    }
  }

  // Search by course name OR course code OR semester OR Academic Year
  if (search) {
    whereCondition.AND = [
      {
        OR: [
          {
            course: {
              name: {
                contains: String(search),
                mode: 'insensitive'
              }
            }
          },
          {
            course: {
              code: {
                contains: String(search),
                mode: 'insensitive'
              }
            }
          },
          {
            academicYear: {
              contains: String(search),
              mode: 'insensitive'
            }
          },
          {
            semester: {
              contains: String(search),
              mode: 'insensitive'
            }
          }
        ]
      }
    ]
  }

  const resultQuery = new PrismaQueryBuilder(prisma.results, rest)
    .setBaseQuery(whereCondition)
    .setSecretFields([
      'studentId',
      'courseId',
      'teacherId',
      'isDeleted',
      'createdAt',
      'updatedAt'
    ])
    .sort()
    .filter()
    .fields()
    .paginate()
    .include({
      course: {
        select: {
          id: true,
          code: true,
          name: true,
          credits: true,
          duration: true,
          level: true,
          category: true,
          startDate: true,
          endDate: true,
          status: true
        }
      }
    })

  const data = await resultQuery.execute()
  const meta = await resultQuery.countTotal()

  return { data, meta }
}

export const StudentServices = {
  fetch_my_courses_by_student_fromDB,
  fetch_myResults_byStudent_fromDB
}
