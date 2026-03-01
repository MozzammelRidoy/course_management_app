import { z } from 'zod'
import { check_Input_isPhone_Or_isEmail } from '../../utils/commonUtils'

const Auth_LoginUser_ValidationZodSchema = z.object({
  body: z.object({
    credential: z
      .string({ required_error: 'Email or Phone is required!' })
      .refine(
        val => {
          if (val.length < 1) {
            return false
          }
          check_Input_isPhone_Or_isEmail(val)
          return true
        },
        { message: 'Email or Phone is required!' }
      ),

    password: z
      .string({ required_error: 'Password is required!' })
      .min(6, { message: 'Password must be at least 6 characters long.' })
  })
})

// change password validation
const changePassword_ValidationZodSchema = z.object({
  body: z.object({
    oldPassword: z
      .string({ required_error: 'Old password is required!' })
      .min(1, { message: 'Old password is required!' }),
    newPassword: z
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

export const AuthValidations = {
  Auth_LoginUser_ValidationZodSchema,
  changePassword_ValidationZodSchema
}
