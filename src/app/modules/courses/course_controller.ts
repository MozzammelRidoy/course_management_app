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

// fetch all courses by admin
const get_Courses_byAdmin = catchAsync(async (req, res) => {
  const result = await CourseServices.fetch_all_courses_byAdmin_fromDB(
    req.query
  )

  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Courses Fetched Successfully',
    data: result.data,
    meta: result.meta
  })
})

// fetch all courses by admin
const get_Courses_byStudent = catchAsync(async (req, res) => {
  const result = await CourseServices.fetch_all_courses_byStudent_fromDB(
    req.user,
    req.query
  )

  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Courses Fetched Successfully',
    data: result.data,
    meta: result.meta
  })
})

// course enrollment by stuent.
const create_enrollment_course_byStudent = catchAsync(async (req, res) => {
  const result = await CourseServices.enroll_course_byStudent_intoDB(
    req.user,
    req.body
  )

  sendResponse(res, {
    status: 201,
    success: true,
    message: 'Course Enrolled Successfully',
    data: result
  })
})

// update course by admin
const update_course_byAdmin = catchAsync(async (req, res) => {
  const result = await CourseServices.update_course_byAdmin_intoDB(
    req.params.courseId as string,
    req.body
  )
  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Course Updated Successfully',
    data: result
  })
})

export const CourseControllers = {
  create_Course_byAdmin,
  get_Courses_byAdmin,
  get_Courses_byStudent,
  create_enrollment_course_byStudent,
  update_course_byAdmin
}
