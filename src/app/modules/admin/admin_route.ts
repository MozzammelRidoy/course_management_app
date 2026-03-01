import express from 'express'
import auth from '../../middlewares/auth'
import { InstituteController } from '../institutes/institute_controller'
import validateRequest from '../../middlewares/validateRequest'
import { InstituteValidations } from '../institutes/institute_validationZodSchema'

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

export const AdminRoutes = router
