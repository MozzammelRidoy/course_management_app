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

// create teacher profile by admin.
const create_teacher_profile_byAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.create_Teacher_byAmin_intoDB(req.body)
  sendResponse(res, {
    status: 201,
    success: true,
    message: 'Teacher created successfully',
    data: result
  })
})

// fetch own profile
const get_ownProfile = catchAsync(async (req, res) => {
  const result = await UserServices.fetch_ownProfile_fromDB(req.user)
  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Profile fetched successfully',
    data: result
  })
})

export const UserController = {
  signUp_Student,
  create_teacher_profile_byAdmin,
  get_ownProfile
}
