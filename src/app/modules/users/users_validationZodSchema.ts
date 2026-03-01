import { z } from 'zod'

// user signup validation schema
const signup_user_ValidationZodSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required!' })
      .min(3, { message: 'Name must be at least 3 characters long' })
      .max(40, { message: 'Name must be at most 40 characters long' }),
    instituteId: z
      .string({ required_error: 'Institute Id is required!' })
      .uuid({ message: 'Invalid Institute Id format' }),
    phone: z
      .string({ required_error: 'Phone is required!' })
      .length(11, { message: 'Phone number must be exactly 11 digits.' })
      .regex(/^01[0-9]{9}$/, {
        message:
          'Phone number must be a valid 11-digit number starting with 01.'
      }),
    email: z
      .string({ required_error: 'Email is required!' })
      .email('Invalid Email Format!')
      .trim()
      .toLowerCase()
      .max(80, {
        message: 'Email must be less than or equal to 80 characters.'
      }),
    password: z
      .string({ required_error: 'Password is required!' })
      .superRefine((password, ctx) => {
        if (password.length < 8 || password.length > 20) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password must be between 8 and 20 characters long.'
          })
        }
        // if (!/[a-z]/.test(password)) {
        //   ctx.addIssue({
        //     code: z.ZodIssueCode.custom,
        //     message: 'Password must include at least one lowercase letter.'
        //   })
        // }
        // if (!/[A-Z]/.test(password)) {
        //   ctx.addIssue({
        //     code: z.ZodIssueCode.custom,
        //     message: 'Password must include at least one uppercase letter.'
        //   })
        // }
        // if (!/\d/.test(password)) {
        //   ctx.addIssue({
        //     code: z.ZodIssueCode.custom,
        //     message: 'Password must include at least one number.'
        //   })
        // }
        // if (!/[@$!%*?&#]/.test(password)) {
        //   ctx.addIssue({
        //     code: z.ZodIssueCode.custom,
        //     message:
        //       'Password must include at least one special character (@, $, !, %, *, ?, &, #).'
        //   })
        // }
      })
  })
})

export const UserValidations = {
  signup_user_ValidationZodSchema
}
