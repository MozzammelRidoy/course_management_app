import express from 'express'
import auth from '../../middlewares/auth'
import { TeacherControllers } from './teachers_controller'

const router = express.Router()

// fetch all assigned courses by Techer
router.get(
  '/my-courses',
  auth('TEACHER'),
  TeacherControllers.get_all_assigned_Courses_byTeacher
)

export const TeacherRoutes = router
