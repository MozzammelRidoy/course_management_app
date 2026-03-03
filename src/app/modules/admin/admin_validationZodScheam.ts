import { z } from 'zod'

// institute params validaion
const instituteId_params_ValidationZodSchema = z.object({
  params: z.object({
    instituteId: z
      .string({ required_error: 'Institute Id is Required!' })
      .uuid({ message: 'Institute Id must be a valid Format!' })
  })
})

const insert_million_data_ValidationZodSchema = z.object({
  body: z.object({
    startNumber: z
      .number({ required_error: 'Start Number is Required!' })
      .min(1, { message: 'Start Number must be greater than 0!' })
      .max(1000000, { message: 'Start Number must be less than 1000000!' }),
    endNumber: z
      .number({ required_error: 'End Number is Required!' })
      .min(1, { message: 'End Number must be greater than 0!' })
      .max(1000000, { message: 'End Number must be less than 1000000!' })
  })
})
export const AdminValidations = {
  instituteId_params_ValidationZodSchema,
  insert_million_data_ValidationZodSchema
}
