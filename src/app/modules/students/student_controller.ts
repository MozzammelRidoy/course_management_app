import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { StudentServices } from './student_service'

// fetch my all  courses by student
const get_my_courses_byStudent = catchAsync(async (req, res) => {
  const result = await StudentServices.fetch_my_courses_by_student_fromDB(
    req.user,
    req.query
  )

  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Retrived My All Enrolled Courses',
    data: result.data,
    meta: result.meta
  })
})

// get my all result by Student
const get_myResult_byStudent = catchAsync(async (req, res) => {
  const result = await StudentServices.fetch_myResults_byStudent_fromDB(
    req.user,
    req.query
  )

  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Retrived All Results',
    data: result.data,
    meta: result.meta
  })
})
export const StudentControllers = {
  get_my_courses_byStudent,
  get_myResult_byStudent
}
