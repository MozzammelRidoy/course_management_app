import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { CourseServices } from './course_service'

// Create Course
const create_Course_byAdmin = catchAsync(async (req, res) => {
  const result = await CourseServices.create_course_byAdmin_intoDB(req.body)

  sendResponse(res, {
    status: 201,
    success: true,
    message: 'Course Created Successfully',
    data: result
  })
})

export const CourseControllers = {
  create_Course_byAdmin
}
