import AppError from '../../errors/AppError'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuthServices } from './auth_service'

// user login
const Auth_LoginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.LoginUser_IntoDB(req.body)

  sendResponse(res, {
    status: 200,
    success: true,
    message: 'User logged in successfully',
    data: result
  })
})

// change password
const change_Password = catchAsync(async (req, res) => {
  const result = await AuthServices.change_Password_intoDB(req.user, req.body)

  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Password changed successfully',
    data: result
  })
})

// generate access token from refresh token
const generate_AccessToken = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[3]
  if (!token) {
    throw new AppError(
      401,
      'UNAUTHORIZED',
      'You are not authorized. No token provided.'
    )
  }

  const result = await AuthServices.generate_Token_from_RefreshToken(token)
  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Access token generated successfully',
    data: result
  })
})
export const AuthControllers = {
  Auth_LoginUser,
  change_Password,
  generate_AccessToken
}
