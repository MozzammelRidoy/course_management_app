import express from 'express'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { InstituteValidations } from './institute_validationZodSchema'
import { InstituteController } from './institute_controller'

const router = express.Router()

// fetch all institutes for Admin
router.get(
  '/all',
  auth('SUPER_ADMIN', 'ADMIN'),
  InstituteController.get_All_institutes_forAdmin
)

// create institute by Admin.
router.post(
  '/create',
  auth('SUPER_ADMIN', 'ADMIN'),
  validateRequest(InstituteValidations.create_institute_validationZodSchema),
  InstituteController.create_institute
)

export const InstituteRoutes = router
