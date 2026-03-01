import { z } from 'zod'

// create institute validation schema
const create_institute_validationZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Institute name is required'
      })
      .min(3, 'Institute name must be at least 3 characters long')
      .max(120, 'Institute name must be less than 120 characters long'),
    code: z
      .string({
        required_error: 'Institute code is required'
      })
      .min(3, 'Institute code must be at least 3 characters long')
      .max(120, 'Institute code must be less than 120 characters long'),
    description: z
      .string({
        required_error: 'Institute description is required'
      })
      .min(10, 'Institute description must be at least 10 characters long')
      .max(500, 'Institute description must be less than 500 characters long')
      .optional(),
    address: z
      .string({ required_error: 'Institute address is required' })
      .min(10, 'Institute address must be at least 10 characters long')
      .max(200, 'Institute address must be less than 200 characters long')
      .optional(),
    contact: z
      .string({ required_error: 'Phone is required!' })
      .length(11, { message: 'Phone number must be exactly 11 digits.' })
      .regex(/^[0-9]+$/, { message: 'Phone number can only contain numbers.' })
      .refine(val => val.startsWith('01'), {
        message: 'Phone number must start with 01.'
      })
      .optional(),
    email: z
      .string({ required_error: 'Email is required!' })
      .email('Invalid Email Format!')
      .max(120, 'Email must be less than 120 characters long')
      .optional(),
    website: z
      .string({ required_error: 'Institute website is required' })
      .url('Invalid URL format!')
      .max(200, 'Institute website must be less than 200 characters long')
      .optional(),
    establishedAt: z
      .string({ required_error: 'Establisheddate is required' })
      .refine(
        val => !isNaN(Date.parse(val)),
        'Established date must be a valid date string'
      )
      .optional(),
    isActive: z
      .boolean({ required_error: 'Institute is active status is required' })
      .optional()
  })
})

export const InstituteValidations = {
  create_institute_validationZodSchema
}
