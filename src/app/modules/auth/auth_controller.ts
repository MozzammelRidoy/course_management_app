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

export const AuthControllers = {
  Auth_LoginUser,
  change_Password
}
