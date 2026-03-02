import express from 'express'
import auth from '../../middlewares/auth'
import { StudentControllers } from './student_controller'

const router = express.Router()

// fetch my enrolled coures by student.
router.get(
  '/my-courses',
  auth('STUDENT'),
  StudentControllers.get_my_courses_byStudent
)

// fetch my result by Student
router.get(
  '/my-results',
  auth('STUDENT'),
  StudentControllers.get_myResult_byStudent
)

export const StudentRoutes = router
