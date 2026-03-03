import express from 'express'
import auth from '../../middlewares/auth'
import { InstituteController } from '../institutes/institute_controller'
import validateRequest from '../../middlewares/validateRequest'
import { InstituteValidations } from '../institutes/institute_validationZodSchema'
import { UserValidations } from '../users/users_validationZodSchema'
import { UserController } from '../users/users_controller'
import { courseValidations } from '../courses/course_validationZodSchema'
import { CourseControllers } from '../courses/course_controller'
import { AdminControllers } from './admin_controller'
import { AdminValidations } from './admin_validationZodScheam'

const router = express.Router()
// =================Institute=======================
// fetch all institutes for Admin
router.get(
  '/institutes',
  auth('SUPER_ADMIN', 'ADMIN'),
  InstituteController.get_All_institutes_forAdmin
)

// create institute by Admin.
router.post(
  '/institute-create',
  auth('SUPER_ADMIN', 'ADMIN'),
  validateRequest(InstituteValidations.create_institute_validationZodSchema),
  InstituteController.create_institute
)

// ==============Teacher=======================
// create teacher profile by admin.
router.post(
  '/teacher-create',
  auth('SUPER_ADMIN', 'ADMIN'),
  validateRequest(
    UserValidations.create_teacher_profile_by_admin_ValidationZodSchema
  ),
  UserController.create_teacher_profile_byAdmin
)

// ===============Course=======================
// fetch course by admin.
router.get(
  '/courses',
  auth('SUPER_ADMIN', 'ADMIN'),
  CourseControllers.get_Courses_byAdmin
)
// create course by admin.
router.post(
  '/course-create',
  auth('SUPER_ADMIN', 'ADMIN'),
  validateRequest(courseValidations.create_course_ValidationZodScheam),
  CourseControllers.create_Course_byAdmin
)

// update course by Admin
router.put(
  '/course-update/:courseId',
  auth('SUPER_ADMIN', 'ADMIN'),
  validateRequest(courseValidations.update_course_byAdmin_ValidationZodSchema),
  CourseControllers.update_course_byAdmin
)

// ==================Dashboard=======================
// student result per institute by admin.
router.get(
  '/students-result/:instituteId',
  auth('SUPER_ADMIN', 'ADMIN'),
  validateRequest(AdminValidations.instituteId_params_ValidationZodSchema),
  AdminControllers.fetch_Student_Result_PerInstitute_byAdmin
)

// Top coursers per year by admin.
router.get(
  '/top-courses',
  auth('SUPER_ADMIN', 'ADMIN'),
  AdminControllers.fetch_Top_Courses_perYear_byAdmin
)

// Top Ranking student by Admin
router.get(
  '/top-ranking-students',
  auth('SUPER_ADMIN', 'ADMIN'),
  AdminControllers.fetch_topRanking_Student_byAdmin
)

export const AdminRoutes = router
