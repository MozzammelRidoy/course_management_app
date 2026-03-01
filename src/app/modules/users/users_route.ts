import express from 'express'
import { UserController } from './users_controller'
import validateRequest from '../../middlewares/validateRequest'
import { UserValidations } from './users_validationZodSchema'

const router = express.Router()

router.post(
  '/signup',
  validateRequest(UserValidations.signup_user_ValidationZodSchema),
  UserController.signUp_Student
)

export const UserRoutes = router
