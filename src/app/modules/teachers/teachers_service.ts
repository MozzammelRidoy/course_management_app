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

  //   const cData = await prisma.teacherCourses.findMany({
  //     where: {
  //       teacher: {
  //         userId: user.user_id
  //       }
  //     },
  //     include: {
  //       course: {
  //         select: {
  //           name: true,
  //           description: true,
  //           category: true,
  //           level: true,
  //           credits: true,
  //           duration: true,
  //           code: true,
  //           startDate: true,
  //           endDate: true,
  //           status: true
  //         }
  //       }
  //     }
  //   })

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

export const TeacherServices = {
  fetch_my_Assigned_Courses_byTeacher_fromDB
}
