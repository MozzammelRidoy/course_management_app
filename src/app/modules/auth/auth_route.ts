import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AuthValidations } from './auth_validationZodSchema'
import { AuthControllers } from './auth_controller'
import auth from '../../middlewares/auth'

const router = express.Router()

// user login
router.post(
  '/login',
  validateRequest(AuthValidations.Auth_LoginUser_ValidationZodSchema),
  AuthControllers.Auth_LoginUser
)

// change password
router.post(
  '/change-password',
  auth('ADMIN', 'SUPER_ADMIN', 'STUDENT', 'TEACHER'),
  validateRequest(AuthValidations.changePassword_ValidationZodSchema),
  AuthControllers.change_Password
)

export const AuthRoutes = router
