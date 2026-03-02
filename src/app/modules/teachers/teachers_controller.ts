import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { TeacherServices } from './teachers_service'

// get all assign courses by teacher
const get_all_assigned_Courses_byTeacher = catchAsync(async (req, res) => {
  const result =
    await TeacherServices.fetch_my_Assigned_Courses_byTeacher_fromDB(
      req.user,
      req.query
    )

  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Fetched all assigned courses by teacher',
    data: result.data,
    meta: result.meta
  })
})

// fetch students under the course by teacher.
const get_courseStudents_byTeacher = catchAsync(async (req, res) => {
  const result = await TeacherServices.fetch_courseStudents_byTeacher_fromDB(
    req.user,
    req.params.courseId as string,
    req.query
  )

  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Fetched all students under the course by teacher',
    data: result.data,
    meta: result.meta
  })
})

// update student result by teacher
const update_student_result_byTeacher = catchAsync(async (req, res) => {
  const result = await TeacherServices.update_student_result_byTeacher_intoDB(
    req.user,
    req.body
  )

  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Student Result Updated Successfully',
    data: result
  })
})
export const TeacherControllers = {
  get_all_assigned_Courses_byTeacher,
  get_courseStudents_byTeacher,
  update_student_result_byTeacher
}
