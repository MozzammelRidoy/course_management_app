/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from '../../../generated/prisma/client'
import AppError from '../../errors/AppError'
import { prisma } from '../../shared/prisma'
import { Start_End_DateTime_Validation } from '../../utils/date_Time_Validation'
import { TCoursePayload } from './course_interface'

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

export const CourseServices = {
  create_course_byAdmin_intoDB
}
