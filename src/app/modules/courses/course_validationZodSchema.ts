import { z } from 'zod'
import { CourseLevelValues, CourseStatusValues } from './course_constant'

// Create Course Validation Schema
const create_course_ValidationZodScheam = z.object({
  body: z.object({
    instituteId: z
      .string({ required_error: 'Institute Id is required' })
      .uuid({ message: 'Institute Id must be a valid uuid' }),
    code: z
      .string({ required_error: 'Code is required' })
      .min(3, { message: 'Code must be at least 3 characters long' })
      .max(120, { message: 'Code Must be at most 120 characters long' }),
    name: z
      .string({ required_error: 'Name is required' })
      .min(3, { message: 'Name must be at least 3 characters long' })
      .max(240, { message: 'Name Must be at most 240 characters long' }),
    description: z
      .string({ required_error: 'Description is required' })
      .min(5, { message: 'Description must be at least 5 characters long' })
      .max(700, 'Description Must be at most 700 characters long')
      .optional(),
    credits: z
      .number({ required_error: 'Credits is required' })
      .min(1, { message: 'Credits must be at least 1' })
      .max(40, { message: 'Credits must be at most 40' }),
    duration: z
      .number({ required_error: 'Duration is required' })
      .min(1, { message: 'Duration must be at least 1' })
      .max(48, { message: 'Duration must be at most 48' }),
    category: z
      .string({ required_error: 'Category is required' })
      .min(3, { message: 'Category must be at least 3 characters long' })
      .max(120, { message: 'Category Must be at most 120 characters long' })
      .optional(),
    level: z
      .enum([...(CourseLevelValues as [string, ...string[]])], {
        required_error: 'Level is required'
      })
      .optional(),
    startDate: z
      .string({ required_error: 'Start Date is required' })
      .refine(
        val => !isNaN(Date.parse(val)),
        'Start Date date must be a valid date string'
      )
      .optional(),
    endDate: z
      .string({ required_error: 'End Date is required' })
      .refine(
        val => !isNaN(Date.parse(val)),
        'End Date date must be a valid date string'
      )
      .optional(),
    status: z
      .enum([...(CourseStatusValues as [string, ...string[]])], {
        required_error: 'Course Status is required'
      })
      .optional(),
    isAvailable: z.boolean({
      required_error: 'Course Availability is required'
    })
  })
})

export const courseValidations = { create_course_ValidationZodScheam }
