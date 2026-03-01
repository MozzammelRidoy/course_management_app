import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { UserServices } from './users_service'

// create user user
const signUp_Student = catchAsync(async (req, res) => {
  const result = await UserServices.signup_student_intoDB(req.body)
  sendResponse(res, {
    status: 201,
    success: true,
    message: 'User created successfully',
    data: result
  })
})

export const UserController = {
  signUp_Student
}
