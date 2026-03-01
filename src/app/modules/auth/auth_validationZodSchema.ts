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

export const AuthValidations = {
  Auth_LoginUser_ValidationZodSchema
}
