import express from 'express'
import auth from '../../middlewares/auth'
import { CourseControllers } from './course_controller'
import validateRequest from '../../middlewares/validateRequest'
import { courseValidations } from './course_validationZodSchema'

const router = express.Router()

// fetch all courses for based on student.
router.get('/', auth('STUDENT'), CourseControllers.get_Courses_byStudent)

// enrollment course by student.
router.post(
  '/enroll',
  auth('STUDENT'),
  validateRequest(
    courseValidations.create_course_enrollment_ValidationZodSchema
  ),
  CourseControllers.create_enrollment_course_byStudent
)

export const CourseRoutes = router
