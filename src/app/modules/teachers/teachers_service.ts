/* eslint-disable @typescript-eslint/no-explicit-any */
import PrismaQueryBuilder from '../../builder/PrismaQueryBuilder'
import AppError from '../../errors/AppError'
import { TJwtPayload } from '../../interfaces/jwtToken_interface'
import { prisma } from '../../shared/prisma'
import { Start_End_DateTime_Validation } from '../../utils/date_Time_Validation'
import { TResultUpdatePayload } from './teachers_interface'

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

  const studentQuery = new PrismaQueryBuilder(prisma.studentsCourses, {})
    .setBaseQuery({
      ...whereCondition
    })
    .setSecretFields(['studentId', 'createdAt', 'updatedAt'])
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
    courseId: item.courseId,
    studentId: item.student.id,
    email: item.student.user.email,
    phone: item.student.user.phone,
    name: item.student.user.profile?.name,
    enrolledAt: item.enrolledAt,
    enrollmentStatus: item.status
  }))

  return { data: formatted, meta }
}

const calculateGrade = (marks: number): string => {
  if (marks >= 80) return 'A+'
  if (marks >= 75) return 'A'
  if (marks >= 70) return 'A-'
  if (marks >= 65) return 'B+'
  if (marks >= 60) return 'B'
  if (marks >= 55) return 'B-'
  if (marks >= 50) return 'C+'
  if (marks >= 45) return 'C'
  if (marks >= 40) return 'D'
  return 'F'
}

// update student result byTeacher into DB
const update_student_result_byTeacher_intoDB = async (
  user: TJwtPayload,
  payload: TResultUpdatePayload
) => {
  const {
    courseId,
    studentId,
    result,
    feedback,
    status,
    academicYear,
    semester: sem,
    completedAt
  } = payload

  const semester = sem.toLowerCase()
  // Verify teacher assigned + student enrolled
  const assignedCourse = await prisma.studentsCourses.findFirst({
    where: {
      courseId,
      studentId,
      course: {
        teacherLinks: {
          some: {
            teacher: {
              userId: user.user_id
            }
          }
        }
      }
    },
    select: {
      id: true,
      studentId: true,
      courseId: true,
      course: {
        select: {
          teacherLinks: {
            where: {
              teacher: {
                userId: user.user_id
              }
            },
            select: {
              teacherId: true
            }
          }
        }
      }
    }
  })

  if (!assignedCourse) {
    throw new AppError(
      404,
      'course',
      'This course is not found or not assigned to you or this student'
    )
  }

  const teacherId = assignedCourse.course.teacherLinks[0]?.teacherId

  if (!teacherId) {
    throw new AppError(403, 'teacher', 'Unauthorized')
  }

  const grade = calculateGrade(result)

  const { start: completedTime } = Start_End_DateTime_Validation(
    completedAt,
    completedAt
  )

  // Transaction (atomic operation)
  await prisma.$transaction(async tx => {
    // Create result (or use upsert if needed)
    await tx.results.upsert({
      where: {
        studentId_courseId_academicYear_semester: {
          studentId,
          courseId,
          academicYear,
          semester
        }
      },
      update: {
        grade,
        score: result,
        teacherId,
        completedAt: completedTime,
        feedback,
        status
      },
      create: {
        studentId,
        courseId,
        teacherId,
        grade,
        score: result,
        completedAt: completedTime,
        academicYear,
        semester,
        feedback,
        status
      }
    })

    // Update enrollment status
    await tx.studentsCourses.update({
      where: {
        id: assignedCourse.id
      },
      data: {
        status
      }
    })
  })

  return {
    message: `Student Result Updated Successfully. The Grade is : ${grade}`
  }
}
export const TeacherServices = {
  fetch_my_Assigned_Courses_byTeacher_fromDB,
  fetch_courseStudents_byTeacher_fromDB,
  update_student_result_byTeacher_intoDB
}
