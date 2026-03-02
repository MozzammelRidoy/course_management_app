import express from 'express'
import auth from '../../middlewares/auth'
import { TeacherControllers } from './teachers_controller'
import validateRequest from '../../middlewares/validateRequest'
import { TeacherValidations } from './teachers_validationZodSchema'

const router = express.Router()

// fetch all assigned courses by Techer
router.get(
  '/my-courses',
  auth('TEACHER'),
  TeacherControllers.get_all_assigned_Courses_byTeacher
)

// fetch students under the course by teacher.
router.get(
  '/:courseId/students',
  auth('TEACHER'),
  validateRequest(TeacherValidations.courseId_params_ValidationZodSchema),
  TeacherControllers.get_courseStudents_byTeacher
)
export const TeacherRoutes = router
