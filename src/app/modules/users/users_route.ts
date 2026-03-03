import express from 'express'
import { UserController } from './users_controller'
import validateRequest from '../../middlewares/validateRequest'
import { UserValidations } from './users_validationZodSchema'
import auth from '../../middlewares/auth'

const router = express.Router()

// Student Signup
router.post(
  '/signup',
  validateRequest(UserValidations.signup_user_ValidationZodSchema),
  UserController.signUp_Student
)

// fetch my own profile
router.get(
  '/me',
  auth('ADMIN', 'STUDENT', 'SUPER_ADMIN', 'TEACHER'),
  UserController.get_ownProfile
)

export const UserRoutes = router
