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

export const StudentServices = {
  fetch_my_courses_by_student_fromDB
}
