import express from 'express'
import { InstituteController } from './institute_controller'

const router = express.Router()

// fetch all institutes for Global.
router.get('/', InstituteController.get_All_institutes_forGlobal)

export const InstituteRoutes = router
