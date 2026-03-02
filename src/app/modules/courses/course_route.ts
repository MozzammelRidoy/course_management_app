import express from 'express'
import auth from '../../middlewares/auth'
import { CourseControllers } from './course_controller'

const router = express.Router()

// fetch all courses for based on student.
router.get('/', auth('STUDENT'), CourseControllers.get_Courses_byStudent)

export const CourseRoutes = router
