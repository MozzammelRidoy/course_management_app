import { z } from 'zod'
import { ResultStatusValues } from './teachers_constant'

const courseId_params_ValidationZodSchema = z.object({
  params: z.object({
    courseId: z
      .string({ required_error: 'Course ID is Required!' })
      .uuid({ message: 'Invalid Course ID Format!' })
  })
})

const allowResultStatus = ResultStatusValues.filter(
  v => v !== 'IN_PROGRESS' && v !== 'ENROLLED'
) as [string, ...string[]]

const update_result_ValidationZodSchema = z.object({
  body: z.object({
    courseId: z
      .string({ required_error: 'Course ID is Required!' })
      .uuid({ message: 'Invalid Course ID Format!' })
      .uuid({ message: 'Invalid Course ID Format!' }),
    studentId: z
      .string({ required_error: 'Student ID is Required!' })
      .uuid({ message: 'Invalid Student ID Format!' }),
    result: z
      .number({ required_error: 'Result is Required!' })
      .min(0, { message: 'Result should be greater than 0!' })
      .max(100, { message: 'Result should be less than 100!' }),
    feedback: z
      .string({ required_error: 'Feedback is Required!' })
      .max(200, { message: 'Feedback should be less than 200 characters!' })
      .optional(),
    status: z.enum(allowResultStatus, {
      required_error: 'Status is Required!'
    }),
    semester: z
      .string({ required_error: 'Semester is Required!' })
      .max(20, { message: 'Semester should be less than 20 characters!' }),
    academicYear: z.string({ required_error: 'Academic Year is Required!' }),
    completedAt: z
      .string({ required_error: 'End Date is required' })
      .refine(
        val => !isNaN(Date.parse(val)),
        'End Date date must be a valid date string'
      )
  })
})
export const TeacherValidations = {
  courseId_params_ValidationZodSchema,
  update_result_ValidationZodSchema
}
