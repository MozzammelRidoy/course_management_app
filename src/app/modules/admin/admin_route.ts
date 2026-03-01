import express from 'express'
import auth from '../../middlewares/auth'
import { InstituteController } from '../institutes/institute_controller'
import validateRequest from '../../middlewares/validateRequest'
import { InstituteValidations } from '../institutes/institute_validationZodSchema'
import { UserValidations } from '../users/users_validationZodSchema'
import { UserController } from '../users/users_controller'

const router = express.Router()

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

// create teacher profile by admin.
router.post(
  '/teacher-create',
  auth('SUPER_ADMIN', 'ADMIN'),
  validateRequest(
    UserValidations.create_teacher_profile_by_admin_ValidationZodSchema
  ),
  UserController.create_teacher_profile_byAdmin
)

export const AdminRoutes = router
