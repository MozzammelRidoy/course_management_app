/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourseStatus, Prisma } from '../../../generated/prisma/client'
import PrismaQueryBuilder from '../../builder/PrismaQueryBuilder'
import AppError from '../../errors/AppError'
import { TJwtPayload } from '../../interfaces/jwtToken_interface'
import { prisma } from '../../shared/prisma'
import { Start_End_DateTime_Validation } from '../../utils/date_Time_Validation'
import {
  TCourseEnrollmentPayload,
  TCoursePayload,
  TCourseUpdatePayload
} from './course_interface'

// course create by admin
const create_course_byAdmin_intoDB = async (payload: TCoursePayload) => {
  const {
    instituteId,
    name,
    code,
    description,
    startDate,
    endDate,
    credits,
    duration,
    level,
    category,
    status,
    isAvailable
  } = payload

  const { start, end } = Start_End_DateTime_Validation(startDate, endDate)

  // Check Institute Validity
  const institute = await prisma.institutes.findUnique({
    where: { id: instituteId, isActive: true, isDeleted: false }
  })

  if (!institute) {
    throw new AppError(
      404,
      'instituteId',
      'Institute not found or is currently unavailable.'
    )
  }

  // create Course
  try {
    const createdCourse = await prisma.courses.create({
      data: {
        name,
        code,
        description,
        instituteId,
        startDate: start,
        endDate: end,
        credits,
        duration,
        level,
        category,
        status,
        isAvailable,
        isDeleted: false
      }
    })
    if (!createdCourse || !createdCourse.id) {
      throw new AppError(400, 'course', 'Failed to create course')
    }
    return createdCourse
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new AppError(
          409,
          'course',
          `Failed to Course Create! This Course Code already Created!`
        )
      }
    }
    // Re-throw other errors
    throw error
  }
}

// fetch all courses for admin
const fetch_all_courses_byAdmin_fromDB = async (
  query: Record<string, unknown>
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isDeleted, ...rest } = query
  if (rest.isAvailable)
    rest.isAvailable = rest.isAvailable === 'true' ? true : false
  if (rest.credit) rest.credit = Number(rest.credit)
  if (rest.duration) rest.duration = Number(rest.duration)

  // build query
  const courseQuery = new PrismaQueryBuilder(prisma.courses, rest)
    .setBaseQuery({ isDeleted: false })
    .setSecretFields(['isDeleted'])
    .search(['code', 'name'])
    .filter()
    .fields()
    .sort()
    .paginate()
    .include({
      institute: {
        select: {
          name: true,
          code: true
        }
      }
    })

  const data = await courseQuery.execute()
  const meta = await courseQuery.countTotal()

  return { data, meta }
}

// fetch all courses for students
const fetch_all_courses_byStudent_fromDB = async (
  user: TJwtPayload,
  query: Record<string, unknown>
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isDeleted, isAvailable, ...rest } = query

  if (rest.credit) rest.credit = Number(rest.credit)
  if (rest.duration) rest.duration = Number(rest.duration)

  // build query
  const courseQuery = new PrismaQueryBuilder(prisma.courses, rest)
    .setBaseQuery({
      isAvailable: true,
      isDeleted: false,
      status: { in: [CourseStatus.PENDING, CourseStatus.ONGOING] },
      // Courses based on Institute
      institute: {
        students: {
          some: { userId: user.user_id }
        }
      },
      // avoid already enrolled courses
      studentLinks: {
        none: {
          student: {
            userId: user.user_id
          }
        }
      }
    })
    .setSecretFields(['isDeleted', 'isAvailable', 'instituteId'])
    .search(['code', 'name'])
    .filter()
    .fields()
    .sort()
    .paginate()
    .include({
      institute: {
        select: {
          name: true,
          code: true
        }
      }
    })

  const data = await courseQuery.execute()
  const meta = await courseQuery.countTotal()

  return { data, meta }
}

// course enrollment by student.
const enroll_course_byStudent_intoDB = async (
  user: TJwtPayload,
  payload: TCourseEnrollmentPayload
) => {
  // check course is available or not.
  const courseData = await prisma.courses.findFirst({
    where: {
      id: payload.courserId,
      isAvailable: true,
      isDeleted: false,
      status: { in: [CourseStatus.PENDING, CourseStatus.ONGOING] },
      // Courses based on Institute
      institute: {
        students: {
          some: { userId: user.user_id }
        }
      },
      // avoid already enrolled courses
      studentLinks: {
        none: {
          student: {
            userId: user.user_id
          }
        }
      }
    },
    select: {
      id: true,
      institute: {
        select: {
          students: {
            where: {
              userId: user.user_id
            },
            select: {
              id: true
            }
          }
        }
      }
    }
  })

  if (!courseData || !courseData.id) {
    throw new AppError(
      404,
      'courseId',
      'This course is not available or Not Found!'
    )
  }
  const studentId = courseData.institute.students[0]?.id

  await prisma.studentsCourses.create({
    data: {
      studentId,
      courseId: courseData.id
    }
  })

  return { message: 'Course Enrolled Successfully' }
}

// update course by Admin into DB.
const update_course_byAdmin_intoDB = async (
  courseId: string,
  payload: TCourseUpdatePayload
) => {
  const courseData = await prisma.courses.findFirst({
    where: {
      id: courseId,
      isDeleted: false
    }
  })

  if (!courseData) {
    throw new AppError(404, 'courseId', 'This course is not found!')
  }

  // If already ended
  if (courseData.status === 'ENDED') {
    throw new AppError(
      400,
      'status',
      'This course has already ended. It cannot be modified.'
    )
  }

  // If status change requested
  if (payload.status && payload.status !== courseData.status) {
    const allowedTransitions: Record<string, string[]> = {
      PENDING: ['ONGOING'],
      ONGOING: ['ENDED'],
      ENDED: []
    }

    const allowedNextStatuses = allowedTransitions[courseData.status] || []

    if (!allowedNextStatuses.includes(payload.status)) {
      throw new AppError(
        400,
        'status',
        `Invalid status transition from ${courseData.status} to ${payload.status}`
      )
    }
  }

  const updatedCourse = await prisma.courses.update({
    where: { id: courseId },
    data: { status: payload.status, isAvailable: payload.isAvailable }
  })

  return updatedCourse
}
export const CourseServices = {
  create_course_byAdmin_intoDB,
  fetch_all_courses_byAdmin_fromDB,
  fetch_all_courses_byStudent_fromDB,
  enroll_course_byStudent_intoDB,
  update_course_byAdmin_intoDB
}
