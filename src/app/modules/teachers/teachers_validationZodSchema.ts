import { z } from 'zod'

const courseId_params_ValidationZodSchema = z.object({
  params: z.object({
    courseId: z
      .string({ required_error: 'Course ID is Required!' })
      .uuid({ message: 'Invalid Course ID Format!' })
  })
})

export const TeacherValidations = {
  courseId_params_ValidationZodSchema
}
