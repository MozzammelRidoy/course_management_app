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

export const StudentControllers = {
  get_my_courses_byStudent
}
