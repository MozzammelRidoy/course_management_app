import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AuthValidations } from './auth_validationZodSchema'
import { AuthControllers } from './auth_controller'

const router = express.Router()

// user login
router.post(
  '/login',
  validateRequest(AuthValidations.Auth_LoginUser_ValidationZodSchema),
  AuthControllers.Auth_LoginUser
)

export const AuthRoutes = router
