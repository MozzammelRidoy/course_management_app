/* eslint-disable @typescript-eslint/no-explicit-any */
import PrismaQueryBuilder from '../../builder/PrismaQueryBuilder'
import { prisma } from '../../shared/prisma'

const report_student_result_per_institue_byAdmin_fromDB = async (
  instituteId: string,
  query: Record<string, unknown>
) => {
  const { search, ...rest } = query

  const whereCondition: any = {
    isDeleted: false,
    student: {
      instituteId: String(instituteId)
    }
  }

  // Global search (name OR email OR phone)
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

  const resultQuery = new PrismaQueryBuilder(prisma.results, rest)
    .setBaseQuery(whereCondition)
    .setSecretFields(['studentId', 'courseId', 'teacherId', 'isDeleted'])
    .sort()
    .fields()
    .filter()
    .paginate()
    .include({
      student: {
        select: {
          institute: {
            select: {
              name: true,
              code: true
            }
          },
          user: {
            select: {
              id: true,
              email: true,
              phone: true,
              profile: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      },
      course: {
        select: {
          id: true,
          name: true,
          code: true,
          credits: true
        }
      },
      teacher: {
        select: {
          user: {
            select: {
              id: true,
              profile: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }
    })

  const data = await resultQuery.execute()
  const meta = await resultQuery.countTotal()

  return { data, meta }
}

// report top courses per year fetch by Admin.
const report_top_courses_perYear_byAdmin_fromDB = async (
  query: Record<string, unknown>
) => {
  const { year, limit = 5 } = query

  const yearFilter = year
    ? `WHERE EXTRACT(YEAR FROM sc."enrolledAt") = ${Number(year)}`
    : ''

  const data = await prisma.$queryRawUnsafe(`
    SELECT 
      c.id AS "courseId",
      c.name AS "courseName",
      c.code AS "courseCode",
      c.credits AS "courseCredits",
      c.duration AS "courseDuration",
      c.level AS "courseLevel",
      c.status AS "courseStatus",
      EXTRACT(YEAR FROM sc."enrolledAt") AS "year",
      COUNT(sc."studentId") AS "totalStudents"
    FROM students_courses sc
    JOIN courses c ON c.id = sc."courseId"
    ${yearFilter}
    GROUP BY c.id, c.name, c.code, "year"
    ORDER BY "totalStudents" DESC
    LIMIT ${Number(limit)}
  `)

  return data
}

export const AdminServices = {
  report_student_result_per_institue_byAdmin_fromDB,
  report_top_courses_perYear_byAdmin_fromDB
}
