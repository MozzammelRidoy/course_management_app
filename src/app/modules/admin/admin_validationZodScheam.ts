import { z } from 'zod'

// institute params validaion
const instituteId_params_ValidationZodSchema = z.object({
  params: z.object({
    instituteId: z
      .string({ required_error: 'Institute Id is Required!' })
      .uuid({ message: 'Institute Id must be a valid Format!' })
  })
})

export const AdminValidations = {
  instituteId_params_ValidationZodSchema
}
